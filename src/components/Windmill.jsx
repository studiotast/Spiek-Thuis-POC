import { useAnimations, useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";

export function Windmill({ animation, ...props }) {
  const group = useRef();
  const model = useGLTF("/models/Windmill.glb");
  const modelAnimations = useAnimations(model.animations, group);

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [model.scene]);

  useEffect(() => {
    const action = modelAnimations.actions[animation];
    modelAnimations.actions[Object.keys(modelAnimations.actions)[0]]?.play();
    modelAnimations.actions[Object.keys(modelAnimations.actions)[1]]?.play();
    if (!action) return;
    action.reset().fadeIn(0.5).play();

    return () => {
      action.fadeOut(0.5);
    };
  }, [animation, modelAnimations.actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive scale={0.1} object={model.scene} />
    </group>
  );
}

useGLTF.preload("/models/Windmill.glb");
