import { Environment, OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Leva, useControls } from "leva";
import { useRef, useEffect } from "react";
import { CharacterController } from "./CharacterController";
import { Map } from "./Map";
import { Owl } from "./Owl";
import usePlayer from "../stores/usePlayer";
import { useFrame } from "@react-three/fiber";
import { Spiek } from "./Spiek";

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
};
export const Experience = () => {
  const shadowCameraRef = useRef();

  const { map } = useControls(
    "Map",
    {
      map: {
        value: "test_map_spiek",
        options: Object.keys(maps),
      },
    },
    { collapsed: true },
  );

  const { owlPos } = useControls(
    "Owl",
    {
      owlPos: {
        value: [-0.23, -1.61, -2.66],
        step: 0.01,
      },
    },
    { collapsed: true },
  );

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
        intensity={0.65}
        castShadow
        position={[-15, 10, 15]}
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
      <Leva hidden />
      <Physics key={map}>
        <Map
          scale={maps[map].scale}
          position={maps[map].position}
          model={`models/${map}.glb`}
        />

        <CharacterController />
        <Owl
          position={owlPos}
          rotation={[0, Math.PI * 1.45, 0]}
          animation={"Idle"}
        />

        <Spiek
          scale={0.6}
          position={[2, -1.63, -1]}
          rotation={[0, Math.PI / 0.8, 0]}
          animation={"Idle"}
        />
      </Physics>
    </>
  );
};
