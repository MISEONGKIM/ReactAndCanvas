import {
  Bodies,
  Composite,
  Engine,
  Events,
  IChamferableBodyDefinition,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
} from "matter-js";
import React, { useEffect, useRef, useState } from "react";
import IconAFRAME from "../assets/icon_AFRAME.png";
import IconCSS from "../assets/icon_CSS.png";
import IconHTML from "../assets/icon_HTML.png";
import IconJS from "../assets/icon_JS.png";
import IconREACT from "../assets/icon_REACT.png";
import IconTHREE from "../assets/icon_THREE.png";

const CW = 1000;
const CH = 1000;
export const useMatter = ({
  setSelected,
}: {
  setSelected: (key: string) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | undefined>();
  const [engine, setEngine] = useState<Engine>();
  const [runner, setRunner] = useState<Runner>();
  const [render, setRender] = useState<Render>();
  const [mouse, setMouse] = useState<Mouse>();

  const initScene = () => {
    const canvas = canvasRef.current;

    const engine = Engine.create();
    setEngine(engine);
    const render = Render.create({
      canvas,
      engine,
      options: {
        width: CW,
        height: CH,
        wireframes: false,
        background: "#1d1d1d",
      },
    });
    setRender(render);
    Render.run(render);

    const runner = Runner.create();
    setRunner(runner);
    Runner.run(runner, engine);

    const garvityPower = 10;
    let gravityDeg = 0;
    Events.on(runner, "tick", () => {
      gravityDeg += 1;
      engine.world.gravity.x =
        garvityPower * Math.cos((Math.PI / 180) * gravityDeg);
      engine.world.gravity.y =
        garvityPower * Math.sin((Math.PI / 180) * gravityDeg);
    });
  };

  const initMouse = () => {
    if (!canvasRef.current || !engine) return;
    const mouse = Mouse.create(canvasRef.current);
    setMouse(mouse);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
    });
    Composite.add(engine.world, mouseConstraint);
    Events.on(mouseConstraint, "mousedown", () => {
      if (!mouseConstraint.body) return;
      const newSelectedKey = mouseConstraint.body.label;
      setSelected(newSelectedKey);
    });
  };

  const initGround = () => {
    if (!engine) return;

    const segments = 32;
    const deg = (Math.PI * 2) / segments;
    const width = 50;
    const radius = CW / 2 + width / 2;
    const height = radius * Math.tan(deg / 2) * 2;
    Array(segments)
      .fill(null)
      .forEach((_, i) => {
        const theta = deg * i;
        const x = radius * Math.cos(theta) + CW / 2; //컨버스 정중앙 기준으로 생성하기 위해 +CW / 2
        const y = radius * Math.sin(theta) + CH / 2;
        addRect({
          engine,
          x,
          y,
          w: width,
          h: height,
          option: { isStatic: true, angle: theta },
        });
      });
  };

  const initImageBoxes = () => {
    if (!engine) return;

    const scale = 0.7;
    const t1 = { w: 250 * scale, h: 250 * scale };
    const t2 = { w: 732 * scale, h: 144 * scale };
    addRect({
      engine,
      x: CW / 2,
      y: CH / 2,
      w: t1.w,
      h: t1.h,
      option: {
        label: "JS",
        chamfer: { radius: 20 },
        render: {
          sprite: {
            texture: IconJS,
            xScale: scale,
            yScale: scale,
          },
        },
      },
    });
    addRect({
      engine,
      x: CW / 2 - t1.w,
      y: CH / 2,
      w: t1.w,
      h: t1.h,
      option: {
        label: "CSS",
        chamfer: { radius: 20 },
        render: {
          sprite: {
            texture: IconCSS,
            xScale: scale,
            yScale: scale,
          },
        },
      },
    });
    addRect({
      engine,
      x: CW / 2 + t1.w,
      y: CH / 2,
      w: t1.w,
      h: t1.h,
      option: {
        label: "HTML",
        chamfer: { radius: 20 },
        render: {
          sprite: {
            texture: IconHTML,
            xScale: scale,
            yScale: scale,
          },
        },
      },
    });
    addRect({
      engine,
      x: CW / 2,
      y: CH / 2 + t1.h,
      w: t1.w,
      h: t1.h,
      option: {
        label: "THREE",
        chamfer: { radius: 20 },
        render: {
          sprite: {
            texture: IconTHREE,
            xScale: scale,
            yScale: scale,
          },
        },
      },
    });
    addRect({
      engine,
      x: CW / 2 - t1.w,
      y: CH / 2 + t1.h,
      w: t1.w,
      h: t1.h,
      option: {
        label: "REACT",
        chamfer: { radius: 75 },
        render: {
          sprite: {
            texture: IconREACT,
            xScale: scale,
            yScale: scale,
          },
        },
      },
    });
    addRect({
      engine,
      x: CW / 2,
      y: CH / 2 - t2.h,
      w: t2.w,
      h: t2.h,
      option: {
        label: "AFRAME",
        chamfer: { radius: 20 },
        render: {
          sprite: {
            texture: IconAFRAME,
            xScale: scale,
            yScale: scale,
          },
        },
      },
    });
  };

  const addRect = ({
    engine,
    x,
    y,
    w,
    h,
    option,
  }: {
    engine: Engine;
    x: number;
    y: number;
    w: number;
    h: number;
    option?: IChamferableBodyDefinition;
  }) => {
    const box = Bodies.rectangle(x, y, w, h, option);
    Composite.add(engine.world, box);
  };

  const run = () => {
    if (!runner || !render) return;
    runner.enabled = true;
    Render.run(render);
  };

  const stop = () => {
    if (!runner || !render) return;
    runner.enabled = false;
    Render.stop(render);
  };

  const clear = () => {
    engine && Composite.clear(engine.world, false);
    mouse && Mouse.clearSourceEvents(mouse);
    runner && Runner.stop(runner);
    render && Render.stop(render);
    engine && Engine.clear(engine);
  };

  useEffect(() => {
    initScene();
    return clear;
  }, []);

  useEffect(() => {
    initMouse();
    initGround();
    initImageBoxes();
  }, [engine]);

  return { canvasRef, run, stop };
};
