import { Clone, useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { PlayerAnimationState } from '../../game/types';

type ModelTransformProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
};

type StaticModelProps = ModelTransformProps & {
  url: string;
  objectName?: string;
};

type ClipStateConfig = {
  candidates: string[];
  loop?: THREE.AnimationActionLoopStyles;
  timeScale?: number;
};

const PLAYER_CLIP_STATES: Record<PlayerAnimationState, ClipStateConfig> = {
  idle: { candidates: ['rig|Idle'] },
  walk: { candidates: ['rig|Walk'], timeScale: 1 },
  run: { candidates: ['rig|Walk'], timeScale: 1.7 },
  jump: { candidates: ['rig|Dodge', 'rig|Action', 'rig|Walk'], loop: THREE.LoopOnce, timeScale: 1.1 },
  shoot: { candidates: ['rig|Action'], timeScale: 1.18 },
  hit: { candidates: ['rig|Dodge', 'rig|Action'], loop: THREE.LoopOnce, timeScale: 1.05 },
  death: { candidates: ['rig|Dodge', 'rig|Action'], loop: THREE.LoopOnce, timeScale: 0.86 },
};

function prepareObject<T extends THREE.Object3D>(object: T) {
  object.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = true;
    }
  });

  return object;
}

function usePreparedGLTF(url: string) {
  const gltf = useGLTF(url);

  return useMemo(() => {
    prepareObject(gltf.scene);
    return gltf;
  }, [gltf]);
}

function StaticModel({ url, objectName, position, rotation, scale }: StaticModelProps) {
  const gltf = usePreparedGLTF(url);

  const object = useMemo(() => {
    if (!objectName) {
      return gltf.scene;
    }

    return gltf.scene.getObjectByName(objectName) ?? gltf.scene;
  }, [gltf.scene, objectName]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Clone object={object} />
    </group>
  );
}

function resolvePlayerClip(
  names: string[],
  animationState: PlayerAnimationState,
): (ClipStateConfig & { name: string }) | null {
  const config = PLAYER_CLIP_STATES[animationState];
  const name = config.candidates.find((candidate) => names.includes(candidate));

  if (!name) {
    return null;
  }

  return {
    ...config,
    name,
  };
}

type AnimatedPlayerCharacterModelProps = ModelTransformProps & {
  animationState: PlayerAnimationState;
};

export function AnimatedPlayerCharacterModel({
  animationState,
  position,
  rotation,
  scale,
}: AnimatedPlayerCharacterModelProps) {
  const { scene, animations } = usePreparedGLTF('/models/ps1-character.glb');
  const clone = useMemo(() => prepareObject(cloneSkeleton(scene)), [scene]);
  const { actions, names } = useAnimations(animations, clone);
  const activeClipRef = useRef<string | null>(null);

  useEffect(() => {
    const clip = resolvePlayerClip(names, animationState);

    if (!clip) {
      return;
    }

    const nextAction = actions[clip.name];
    if (!nextAction) {
      return;
    }

    const previousAction = activeClipRef.current ? actions[activeClipRef.current] : undefined;
    const isSameClip = activeClipRef.current === clip.name;

    if (!isSameClip && previousAction) {
      previousAction.fadeOut(0.16);
    }

    nextAction.enabled = true;
    nextAction.timeScale = clip.timeScale ?? 1;
    nextAction.setLoop(clip.loop ?? THREE.LoopRepeat, clip.loop === THREE.LoopOnce ? 1 : Infinity);
    nextAction.clampWhenFinished = clip.loop === THREE.LoopOnce;

    if (!isSameClip) {
      nextAction.reset().fadeIn(0.16).play();
    } else if (!nextAction.isRunning()) {
      nextAction.play();
    }

    activeClipRef.current = clip.name;
  }, [actions, animationState, names]);

  useEffect(() => {
    return () => {
      Object.values(actions).forEach((action) => action?.stop());
    };
  }, [actions]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clone} />
    </group>
  );
}

export function PoliceCharacterModel(props: ModelTransformProps) {
  return <StaticModel url="/models/male-character.glb" {...props} />;
}

export function CivilianCharacterModel(props: ModelTransformProps) {
  return <StaticModel url="/models/male-character.glb" {...props} />;
}

export function CivilianAltCharacterModel(props: ModelTransformProps) {
  return <StaticModel url="/models/lowpoly-male-npc.glb" {...props} />;
}

export function GangCharacterModel(props: ModelTransformProps) {
  return <StaticModel url="/models/male-base-v2.glb" {...props} />;
}

export function GunModel(props: ModelTransformProps) {
  return <StaticModel url="/models/gun.glb" {...props} />;
}

export function PistolFireModel(props: ModelTransformProps) {
  return <StaticModel url="/models/pistol-fire.glb" {...props} />;
}

export function CombatKnifeModel(props: ModelTransformProps) {
  return <StaticModel url="/models/combat-knife.glb" {...props} />;
}

export function MalibuCarModel(props: ModelTransformProps) {
  return <StaticModel url="/models/malibu-car.glb" {...props} />;
}

export function PontiacCarModel(props: ModelTransformProps) {
  return <StaticModel url="/models/pontiac-ventura.glb" {...props} />;
}

export function TruckModel(props: ModelTransformProps) {
  return <StaticModel url="/models/refrigerating-truck.glb" {...props} />;
}

export function BuildingsBlockModel(props: ModelTransformProps) {
  return <StaticModel url="/models/buildings.glb" {...props} />;
}

export function TreeClusterModel(props: ModelTransformProps) {
  return <StaticModel url="/models/trees.glb" {...props} />;
}

export function DumpsterSetModel(props: ModelTransformProps) {
  return <StaticModel url="/models/dumpster-set.glb" {...props} />;
}

export function StreetLightSingleModel(props: ModelTransformProps) {
  return <StaticModel url="/models/street-light-kit.glb" objectName="StreetLightSingle" {...props} />;
}

// City pack props (static)
export function CityBuildingModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/building.glb" {...props} />;
}

export function CityHotelBuildingModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/hotel-building.glb" {...props} />;
}

export function CityBarModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/bar.glb" {...props} />;
}

export function CityBillboardModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/billboard.glb" {...props} />;
}

export function CityTrafficLightModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/traffic-light.glb" {...props} />;
}

export function CityStopSignModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/stop-sign.glb" {...props} />;
}

export function CityPoliceCarModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/police-car.glb" {...props} />;
}

export function CitySuvModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/suv.glb" {...props} />;
}

export function CityCarModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/car.glb" {...props} />;
}

export function CityRoadBitsModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/road-bits.glb" {...props} />;
}

export function CityPathStraightModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/path-straight.glb" {...props} />;
}

export function CityManModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/man.glb" {...props} />;
}

export function CityWomanModel(props: ModelTransformProps) {
  return <StaticModel url="/models/city/woman.glb" {...props} />;
}

useGLTF.preload('/models/ps1-character.glb');
useGLTF.preload('/models/cop-character.glb');
useGLTF.preload('/models/male-character.glb');
useGLTF.preload('/models/lowpoly-male-npc.glb');
useGLTF.preload('/models/male-base-v2.glb');
useGLTF.preload('/models/gun.glb');
useGLTF.preload('/models/pistol-fire.glb');
useGLTF.preload('/models/combat-knife.glb');
useGLTF.preload('/models/malibu-car.glb');
useGLTF.preload('/models/pontiac-ventura.glb');
useGLTF.preload('/models/refrigerating-truck.glb');
useGLTF.preload('/models/buildings.glb');
useGLTF.preload('/models/trees.glb');
useGLTF.preload('/models/dumpster-set.glb');
useGLTF.preload('/models/street-light-kit.glb');
useGLTF.preload('/models/city/building.glb');
useGLTF.preload('/models/city/hotel-building.glb');
useGLTF.preload('/models/city/bar.glb');
useGLTF.preload('/models/city/billboard.glb');
useGLTF.preload('/models/city/traffic-light.glb');
useGLTF.preload('/models/city/stop-sign.glb');
useGLTF.preload('/models/city/police-car.glb');
useGLTF.preload('/models/city/suv.glb');
useGLTF.preload('/models/city/car.glb');
useGLTF.preload('/models/city/road-bits.glb');
useGLTF.preload('/models/city/path-straight.glb');
useGLTF.preload('/models/city/man.glb');
useGLTF.preload('/models/city/woman.glb');
