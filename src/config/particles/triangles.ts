import type { ISourceOptions } from "@tsparticles/engine";

export const trianglesPreset: ISourceOptions = {
  background: {
    color: "transparent",
  },
  particles: {
    number: {
      value: 350,
      density: {
        enable: true,
      },
    },
    color: {
      value: "#10B981",
    },
    links: {
      distance: 75,
      enable: true,
      color: "#10B981",
      opacity: 0.3,
      width: 1,
      triangles: {
        enable: true,
        opacity: 0.1,
      },
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      outModes: {
        default: "bounce",
      },
      random: false,
      straight: false,
    },
    size: {
      value: {
        min: 1,
        max: 3,
      },
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
    },
  },
  detectRetina: true,
};
