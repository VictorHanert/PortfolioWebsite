import type { ISourceOptions } from "@tsparticles/engine";

export const customTwinklesPreset: ISourceOptions = {
  background: {
    color: "transparent",
  },
  particles: {
    number: {
      value: 450,
      density: {
        enable: true,
      },
    },
    color: {
      value: "#F59E0B",
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      outModes: {
        default: "bounce",
      },
      random: true,
      straight: false,
    },
    size: {
      value: {
        min: 2,
        max: 5,
      },
      animation: {
        enable: true,
        speed: 3,
        sync: false,
      },
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: {
        min: 0.2,
        max: 0.8,
      },
      animation: {
        enable: true,
        speed: 1.5,
        sync: false,
      },
    },
  },
  detectRetina: true,
};
