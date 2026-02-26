import type { ISourceOptions } from "@tsparticles/engine";

export const linksPreset: ISourceOptions = {
  background: {
    color: "transparent",
  },
  particles: {
    number: {
      value: 280,
      density: {
        enable: true,
      },
    },
    color: {
      value: "#4F46E5",
    },
    links: {
      distance: 80,
      enable: true,
      color: "#4F46E5",
      opacity: 0.5,
      width: 1,
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
