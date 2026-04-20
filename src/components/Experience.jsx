import { Environment, OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Leva, useControls, button } from "leva";
import { useRef, useEffect } from "react";
import { CharacterController } from "./CharacterController";
import { Map } from "./Map";
import { Owl } from "./Owl";
import usePlayer from "../stores/usePlayer";
import { useFrame } from "@react-three/fiber";
import { Spiek } from "./Spiek";
import { Windmill } from "./Windmill";
import { Pyramid } from "./Pyramid";

const maps = {
  castle_on_hills: {
    scale: 3,
    position: [-6, -7, 0],
  },
  animal_crossing_map: {
    scale: 20,
    position: [-15, -1, 10],
  },
  city_scene_tokyo: {
    scale: 0.72,
    position: [0, -1, -3.5],
  },
  de_dust_2_with_real_light: {
    scale: 0.3,
    position: [-5, -3, 13],
  },
  medieval_fantasy_book: {
    scale: 0.4,
    position: [-4, 0, -6],
  },
  test_map_spiek: {
    scale: 2,
    position: [0, -2, 0],
  },
  SpiekMap: {
    scale: 1,
    position: [0, -1.5, 0],
  },
};
export const Experience = () => {
  const shadowCameraRef = useRef();

  const { map } = useControls("Map", {
    map: {
      value: "SpiekMap",
      options: Object.keys(maps),
    },
  });

  const { owlPos } = useControls("Owl", {
    owlPos: {
      value: [0.17, -1.2, -2.66],
      step: 0.01,
    },
  });

  const { spiekPos } = useControls("Spiek", {
    spiekPos: {
      value: [4.2, -1.38, -0.83],
      step: 0.01,
    },
  });

  const { pyramidPos, baseRows, pyramidRotation } = useControls("Pyramid", {
    pyramidPos: {
      value: [6, -1.4, 4],
      step: 0.1,
    },

    baseRows: {
      value: 4,
      min: 2,
      max: 6,
      step: 1,
    },
    pyramidRotation: {
      value: [0, Math.PI / 2, 0],
      step: 0.1,
    },
    resetPyramid: button(() => {
      const resetPyramid = usePlayer.getState().resetPyramid;
      resetPyramid();
    }),
  });

  const character = useRef();
  const setPlayer = usePlayer((state) => state.setPlayer);

  useEffect(() => {
    setPlayer(character);
  }, [setPlayer]);

  return (
    <>
      {/* <OrbitControls /> */}
      <Environment preset="sunset" />
      <directionalLight
        intensity={0.5}
        castShadow
        //position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      >
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
          ref={shadowCameraRef}
          attach={"shadow-camera"}
        />
      </directionalLight>
      <Physics key={map}>
        <Map
          scale={maps[map].scale}
          position={maps[map].position}
          model={`models/${map}.glb`}
        />
        <CharacterController />
        <Owl
          position={owlPos}
          rotation={[0, Math.PI * 1.8, 0]}
          animation={"Idle"}
        />
        <Spiek
          scale={0.6}
          position={spiekPos}
          rotation={[0, Math.PI / 0.9, 0]}
          animation={"Idle"}
        />
        <Windmill scale={5} position={[0, -1.5, 0]} />
        <Pyramid
          position={pyramidPos}
          baseRows={baseRows}
          rotation={pyramidRotation}
        />
      </Physics>
    </>
  );
};
