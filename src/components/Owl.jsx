import { useAnimations, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function Owl({ animation, ...props }) {
  const group = useRef();
  const model = useGLTF("/models/Owl.glb");
  const modelAnimations = useAnimations(model.animations, group);

  //Set material to the player
  useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [model.scene]);
  // Play animation based on parameter that the component got
  useEffect(() => {
    const action = modelAnimations.actions[animation];
    if (!action) return;
    action
      .reset()
      .fadeIn(0.5)
      .play();

    return () => {
      action.fadeOut(0.5);
    };
  }, [animation, modelAnimations.actions])

  
  return (
    <group ref={group} {...props} dispose={null}>
      <RigidBody type="kinematicPosition" colliders="hull">
        <primitive scale={0.1} object={model.scene} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Owl.glb");
