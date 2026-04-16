import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { Character } from "./Character";
import usePlayer from "../stores/usePlayer";

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export const CharacterController = () => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 1.1, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 1.8, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(3),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
    },
    { collapsed: true },
  );

  const rb = useRef();
  const container = useRef();
  const player = usePlayer((state) => state.player);
  const setInteracting = usePlayer((state) => state.setInteracting);
  const addXp = usePlayer((state) => state.addXp);

  const [animation, setAnimation] = useState("idle");

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();
  const isClicking = useRef(false);

  const interactionCooldownRef = useRef(false);
  const isInteracting = usePlayer((state) => state.interacting);
  const interactionCooldownTime = useRef(500); // 500ms cooldown between presses
  const isAbleToInteract = usePlayer((state) => state.ableToInteract);

  const { mousecontrols } = useControls("Mouse Controls", {
    mousecontrols: true,
  });

  useEffect(() => {
    const onMouseDown = (e) => {
      isClicking.current = true;
    };
    const onMouseUp = (e) => {
      isClicking.current = false;
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    // touch
    document.addEventListener("touchstart", onMouseDown);
    document.addEventListener("touchend", onMouseUp);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onMouseDown);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const interactDive = document.querySelector(".interactionMenu");
    if (isInteracting) {
      interactDive.style.display = "flex";
    } else {
      interactDive.style.display = "none";
    }
    if (!interactDive) return;
  }, [isInteracting]);

  useFrame(({ camera, mouse }) => {
    if (rb.current) {
      const vel = rb.current.linvel();

      const movement = {
        x: 0,
        z: 0,
      };

      if (get().forward) {
        movement.z = 1;
      }
      if (get().backward) {
        movement.z = -1;
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (isClicking.current) {
        if (!mousecontrols) return;
        if (Math.abs(mouse.x) > 0.1) {
          movement.x = -mouse.x;
        }
        movement.z = mouse.y + 0.4;
        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED;
        }
      }

      if (get().left) {
        movement.x = 1;
      }
      if (get().right) {
        movement.x = -1;
      }

      if (get().getExp) {
        console.log("Xp gained!");
        addXp(1);
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
        if (speed === RUN_SPEED) {
          if (!isInteracting) setAnimation("Run");
        } else {
          if (!isInteracting) setAnimation("Walk");
        }
      } else {
        if (!isInteracting) setAnimation("Idle");
      }

      player.current.rotation.y = lerpAngle(
        player.current.rotation.y,
        characterRotationTarget.current,
        0.1,
      );

      //Interacting...
      if (
        get().interact &&
        !interactionCooldownRef.current &&
        isAbleToInteract
      ) {
        setInteracting(!isInteracting);
        console.log("isInteracting:", !isInteracting);

        if (!isInteracting) {
          setAnimation("Wave");
        }

        interactionCooldownRef.current = true;
        setTimeout(() => {
          interactionCooldownRef.current = false;
        }, interactionCooldownTime.current);
      }

      if (!isInteracting) {
        rb.current.setLinvel(vel, true);
      }
    }

    // CAMERA
    if (!isInteracting) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1,
      );
    }

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <RigidBody colliders={false} lockRotations ref={rb}>
      <group ref={container}>
        <group ref={cameraTarget} position-z={2} />
        <group ref={cameraPosition} position-y={1} position-z={-3} />
        <group ref={player}>
          <Character
            scale={0.65}
            position-y={-0.25}
            animation={animation ? animation : "Idle"}
          />
        </group>
      </group>
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
};
