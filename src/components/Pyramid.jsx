import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect } from "react";

// Einzelnes Block-Objekt
const Block = ({ position, scale = 0.5 }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.castShadow = true;
      meshRef.current.receiveShadow = true;
    }
  }, []);

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
      <mesh ref={meshRef} scale={[scale, scale, scale]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
    </RigidBody>
  );
};

// Piramide aus Blöcken
export const Pyramid = ({
  position = [0, 0, 0],
  baseRows = 4,
  blockSize = 0.3,
  gap = 0.1,
  rotation = [0, 0, 0],
}) => {
  const blocks = [];
  let blockIndex = 0;

  // Erstelle Pyramide-Struktur
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
    <group position={position} rotation={rotation}>
      {blocks}
    </group>
  );
};
