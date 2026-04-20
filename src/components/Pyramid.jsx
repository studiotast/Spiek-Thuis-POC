import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import usePlayer from "../stores/usePlayer";

// Single block object
const Block = ({ position, scale = 0.5 }) => {
  const { scene } = useGLTF("/models/cube.glb");
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  return (
    <RigidBody
      type="dynamic"
      colliders="cuboid"
      position={position}
      mass={1}
      linearDamping={1}
      angularDamping={1}
      restitution={0}
      friction={1}
      canSleep
    >
      <group ref={groupRef} scale={scale * 0.5}>
        <primitive object={scene.clone()} />
      </group>
    </RigidBody>
  );
};

useGLTF.preload("/models/cube.glb");

// Pyramid made of blocks
export const Pyramid = ({
  position = [0, 0, 0],
  baseRows = 4,
  blockSize = 0.3,
  gap = 0.1,
  rotation = [0, 0, 0],
}) => {
  const pyramidResetTrigger = usePlayer((state) => state.pyramidResetTrigger);
  const blocks = [];
  let blockIndex = 0;

  // Create pyramid structure
  for (let row = 0; row < baseRows; row++) {
    const blocksInRow = baseRows - row;
    const blockSpacing = blockSize + gap;
    const rowWidth = blocksInRow * blockSpacing;
    const startX = -rowWidth / 2 + blockSpacing / 2;

    for (let col = 0; col < blocksInRow; col++) {
      const x = startX + col * blockSpacing;
      const y = row * blockSpacing + blockSize / 2;
      const z = 0;

      blocks.push(
        <Block
          key={`block-${blockIndex}`}
          position={[x, y, z]}
          scale={blockSize}
        />,
      );
      blockIndex++;
    }
  }

  return (
    <group
      key={`pyramid-${pyramidResetTrigger}`}
      position={position}
      rotation={rotation}
    >
      {blocks}
    </group>
  );
};
