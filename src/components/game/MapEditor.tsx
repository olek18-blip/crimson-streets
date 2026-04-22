import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';
import type { PlaceableType } from '../../game/types';

const GRID = 2;
const PLACE_Y = 0.5; // ground is around 0.5 in this game

function snap(n: number, step: number) {
  return Math.round(n / step) * step;
}

function intersectRayWithGround(rayOrigin: THREE.Vector3, rayDir: THREE.Vector3, y = PLACE_Y) {
  if (Math.abs(rayDir.y) < 1e-5) return null;
  const t = (y - rayOrigin.y) / rayDir.y;
  if (t <= 0) return null;
  return rayOrigin.clone().add(rayDir.clone().multiplyScalar(t));
}

function PlacePreview({
  type,
  position,
  rotationY,
}: {
  type: PlaceableType;
  position: [number, number, number];
  rotationY: number;
}) {
  const geom = useMemo(() => {
    if (type === 'streetlight') return new THREE.CylinderGeometry(0.05, 0.05, 4, 10);
    if (type === 'dumpster') return new THREE.BoxGeometry(2.3, 1.6, 1.2);
    if (type === 'tree') return new THREE.ConeGeometry(1.2, 3.2, 8);
    if (type === 'block') return new THREE.BoxGeometry(2, 2, 2);
    return new THREE.BoxGeometry(10, 10, 10);
  }, [type]);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8fd3ff',
        emissive: '#1b3a55',
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.35,
      }),
    [],
  );

  return (
    <mesh geometry={geom} material={mat} position={position} rotation={[0, rotationY, 0]}>
      {/* disposed by three on unmount */}
    </mesh>
  );
}

export default function MapEditor() {
  const { camera } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const [previewPos, setPreviewPos] = useState<[number, number, number] | null>(null);

  const editor = useGameStore((s) => s.editor);
  const toggleEditor = useGameStore((s) => s.toggleEditor);
  const rotateEditor = useGameStore((s) => s.rotateEditor);
  const setEditorSelected = useGameStore((s) => s.setEditorSelected);
  const placeEditorProp = useGameStore((s) => s.placeEditorProp);
  const removeEditorPropNear = useGameStore((s) => s.removeEditorPropNear);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      if (key === 'b') {
        toggleEditor();
        return;
      }
      if (!useGameStore.getState().editor.enabled) return;

      if (key === 'r') {
        rotateEditor();
        return;
      }
      if (key === 'x') {
        if (previewPos) removeEditorPropNear(previewPos, 1.6);
        return;
      }
      const mapping: Record<string, PlaceableType> = {
        '1': 'building',
        '2': 'streetlight',
        '3': 'dumpster',
        '4': 'tree',
        '5': 'block',
      };
      const selected = mapping[key];
      if (selected) setEditorSelected(selected);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewPos, removeEditorPropNear, rotateEditor, setEditorSelected, toggleEditor]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!useGameStore.getState().editor.enabled) return;
      if (e.button !== 0) return;
      const pos = previewPos;
      if (!pos) return;
      placeEditorProp({ type: useGameStore.getState().editor.selected, position: pos, rotationY: useGameStore.getState().editor.rotationY });
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [placeEditorProp, previewPos]);

  useFrame(() => {
    if (!editor.enabled) {
      if (previewPos !== null) setPreviewPos(null);
      return;
    }

    // Ray from camera center.
    raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);
    const ray = raycaster.current.ray;
    const hit = intersectRayWithGround(ray.origin, ray.direction, PLACE_Y);
    if (!hit) return;
    const x = snap(hit.x, GRID);
    const z = snap(hit.z, GRID);
    setPreviewPos([x, PLACE_Y, z]);
  });

  if (!editor.enabled || !previewPos) return null;

  return <PlacePreview type={editor.selected} position={previewPos} rotationY={editor.rotationY} />;
}

