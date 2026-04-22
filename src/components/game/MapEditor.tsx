import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';
import type { PlaceableType } from '../../game/types';

const GRID = 2;
const PLACE_Y = 0.5;

function snap(n: number, step: number) {
  return Math.round(n / step) * step;
}

function makePreviewGeometry(type: PlaceableType) {
  if (type === 'streetlight') return new THREE.CylinderGeometry(0.05, 0.05, 4, 10);
  if (type === 'dumpster') return new THREE.BoxGeometry(2.3, 1.6, 1.2);
  if (type === 'tree') return new THREE.ConeGeometry(1.2, 3.2, 8);
  if (type === 'block') return new THREE.BoxGeometry(2, 2, 2);
  return new THREE.BoxGeometry(10, 10, 10);
}

function getCursorBasePosition(playerPos: [number, number, number], rotation: number): [number, number, number] {
  const ahead = 6;
  const x = snap(playerPos[0] - Math.sin(rotation) * ahead, GRID);
  const z = snap(playerPos[2] - Math.cos(rotation) * ahead, GRID);
  return [x, PLACE_Y, z];
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
  const geom = useMemo(() => makePreviewGeometry(type), [type]);
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
    <group>
      <mesh position={[position[0], 0.03, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75, 1.05, 24]} />
        <meshStandardMaterial color="#8fd3ff" emissive="#8fd3ff" emissiveIntensity={0.8} transparent opacity={0.55} />
      </mesh>
      <mesh geometry={geom} material={mat} position={position} rotation={[0, rotationY, 0]} />
    </group>
  );
}

export default function MapEditor() {
  const editor = useGameStore((s) => s.editor);
  const player = useGameStore((s) => s.player);
  const toggleEditor = useGameStore((s) => s.toggleEditor);
  const rotateEditor = useGameStore((s) => s.rotateEditor);
  const setEditorSelected = useGameStore((s) => s.setEditorSelected);
  const placeEditorProp = useGameStore((s) => s.placeEditorProp);
  const removeEditorPropNear = useGameStore((s) => s.removeEditorPropNear);
  const [cursorPos, setCursorPos] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    if (!editor.enabled) {
      setCursorPos(null);
      return;
    }

    setCursorPos((current) => current ?? getCursorBasePosition(player.position, player.rotation));
  }, [editor.enabled, player.position, player.rotation]);

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

      if (key === 'enter' || key === ' ') {
        e.preventDefault();
        const pos = cursorPos ?? getCursorBasePosition(useGameStore.getState().player.position, useGameStore.getState().player.rotation);
        placeEditorProp({
          type: useGameStore.getState().editor.selected,
          position: pos,
          rotationY: useGameStore.getState().editor.rotationY,
        });
        return;
      }

      if (key === 'x' || key === 'delete' || key === 'backspace') {
        e.preventDefault();
        const pos = cursorPos;
        if (pos) {
          removeEditorPropNear(pos, 1.6);
        }
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
      if (selected) {
        setEditorSelected(selected);
        return;
      }

      const deltaByKey: Record<string, [number, number]> = {
        i: [0, -GRID],
        k: [0, GRID],
        j: [-GRID, 0],
        l: [GRID, 0],
      };
      const delta = deltaByKey[key];
      if (delta) {
        e.preventDefault();
        setCursorPos((current) => {
          const base = current ?? getCursorBasePosition(useGameStore.getState().player.position, useGameStore.getState().player.rotation);
          return [base[0] + delta[0], PLACE_Y, base[2] + delta[1]];
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cursorPos, placeEditorProp, removeEditorPropNear, rotateEditor, setEditorSelected, toggleEditor]);

  if (!editor.enabled || !cursorPos) return null;

  return <PlacePreview type={editor.selected} position={cursorPos} rotationY={editor.rotationY} />;
}

