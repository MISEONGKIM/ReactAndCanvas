import {
  Bodies,
  Composite,
  Engine,
  IChamferableBodyDefinition,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
} from "matter-js";
import React, { useEffect, useRef } from "react";
const CW = 1000;
const CH = 1000;
export const useMatter = () => {
  const canvasRef = useRef<HTMLCanvasElement | undefined>();
  const mouseRef = useRef<Mouse>();

  const initScene = () =>
    new Promise<{ engine: Engine }>((resolve) => {
      const canvas = canvasRef.current;

      const engine = Engine.create();
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
      Render.run(render);
      Runner.run(Runner.create(), engine);
      resolve({ engine });
    });

  const initMouse = ({ engine }: { engine: Engine }) => {
    if (!canvasRef.current) return;
    const mouse = Mouse.create(canvasRef.current);
    mouseRef.current = mouse;
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
    });
    Composite.add(engine.world, mouseConstraint);
  };

  const initGround = ({ engine }: { engine: Engine }) => {
    const segments = 32;
    const deg = (Math.PI * 2) / segments;
    const width = 50;
    const radius = CW / 2 + width / 2;
    const height = radius * Math.tan(deg / 2) * 2;
    Array.from<number, number>({ length: segments }, (v, i) => i).forEach(
      (i) => {
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
      }
    );
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

  const init = async () => {
    const { engine } = await initScene();
    if (!engine) return;

    initMouse({ engine });
    initGround({ engine });
    canvasRef.current?.addEventListener("mousewheel", () => {
      if (!mouseRef.current) return;
      addRect({
        engine,
        x: mouseRef.current.position.x,
        y: mouseRef.current.position.y,
        w: 50,
        h: 50,
      });
    });
  };

  useEffect(() => {
    init();
  }, []);

  return { canvasRef };
};
