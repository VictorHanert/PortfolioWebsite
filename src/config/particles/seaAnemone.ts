import type { ISourceOptions } from "@tsparticles/engine";

export const seaAnemonePreset: ISourceOptions = {
  key: "seaAnemone",
  name: "Sea Anemone",
  particles: {
    color: {
      value: "#FF6B6B",
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "destroy",
      },
      path: {
        clamp: false,
        enable: true,
        delay: {
          value: 0,
        },
        generator: "curvesPathGenerator",
      },
      speed: 1,
    },
    number: {
      density: {
        enable: true,
      },
      value: 0,
    },
    opacity: {
      value: 0.3,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: {
        min: 1,
        max: 10,
      },
      animation: {
        count: 1,
        startValue: "min",
        enable: true,
        speed: 10,
        sync: true,
      },
    },
  },
  background: {
    color: "transparent",
  },
  emitters: {
    direction: "none",
    rate: {
      quantity: 5,
      delay: 0.3,
    },
    size: {
      width: 0,
      height: 0,
    },
    spawnColor: {
      value: "#FF6B6B",
      animation: {
        enable: true,
        speed: 10,
      },
    },
    position: {
      x: 50,
      y: 50,
    },
  },
  trail: {
    fill: { color: "transparent" },
    length: 30,
    enable: true,
  },
};
