import { create } from "zustand";

export default create((set) => {
  return {
    player: null,
    setPlayer: (playerIn) => set({ player: playerIn }),

    interacting: false,
    setInteracting: (interactingIn) => set({ interacting: interactingIn }),

    ableToInteract: false,
    setAbleToInteract: (ableToInteractIn) =>
      set({ ableToInteract: ableToInteractIn }),

    xp: 0,
    setXp: (xpIn) => set({ xp: xpIn }),
    level: 1,
    setLevel: (levelIn) => set({ level: levelIn }),

    addXp: (amount) =>
      set((state) => {
        const newXp = state.xp + amount;
        const xpForNextLevel = state.level * 100;

        if (newXp >= xpForNextLevel) {
          return {
            xp: 0,
            level: state.level + 1,
          };
        }

        return { xp: newXp };
      }),

    pyramidResetTrigger: 0,
    resetPyramid: () =>
      set((state) => ({
        pyramidResetTrigger: state.pyramidResetTrigger + 1,
      })),
  };
});
