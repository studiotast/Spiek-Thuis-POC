import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Perf } from "r3f-perf";
import ProgressBar from "./components/ProgressBar/ProgressBar";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
  { name: "interact", keys: ["KeyE", "KeyI"] },
  { name: "getExp", keys: ["KeyX"] },
];

function App() {
  return (
    <KeyboardControls map={keyboardMap}>
      <ProgressBar />
      <Canvas
        shadows
        camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
        style={{
          touchAction: "none",
        }}
      >
        <color attach="background" args={["#ececec"]} />
        <Experience />
        {/*<Perf position="top-left"/>*/}
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
