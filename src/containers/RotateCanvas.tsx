import React, { RefObject, useEffect, useState } from "react";
import { useMatter } from "../hooks/useMatter";
import "../style/containers/RotateCanvas.css";
import { entries } from "lodash";

interface DataType {
  title: string;
  level: number;
  desc: string;
}
const data: Record<string, DataType> = {
  JS: {
    title: "Javascript",
    level: 4,
    desc: "자바스크립트에 대한 설명이라고 할 수 있습니다. 자바스크립트에 대한 설명. 자바스크립트에 대한 설명.",
  },
  REACT: {
    title: "React.js",
    level: 5,
    desc: "React에 대한 설명이라고 할 수 있습니다. React에 대한 설명. React에 대한 설명.",
  },
  CSS: {
    title: "CSS/SASS",
    level: 3,
    desc: "CSS에 대한 설명이라고 할 수 있습니다. CSS에 대한 설명. CSS에 대한 설명.",
  },
  AFRAME: {
    title: "Aframe.js",
    level: 4,
    desc: "AFRAME에 대한 설명이라고 할 수 있습니다. AFRAME에 대한 설명. AFRAME에 대한 설명.",
  },
  THREE: {
    title: "Three.js",
    level: 2,
    desc: "THREE에 대한 설명이라고 할 수 있습니다. THREE에 대한 설명. THREE에 대한 설명.",
  },
  HTML: {
    title: "HTML",
    level: 5,
    desc: "HTML에 대한 설명이라고 할 수 있습니다. HTML에 대한 설명. HTML에 대한 설명.",
  },
};
const RotateCanvas = () => {
  const [selected, setSelected] = useState<DataType>(data.JS);
  const { canvasRef, run, stop } = useMatter({
    setSelected: (key: string) => {
      setSelected(data[key]);
    },
  });
  const initIntersection = () => {
    return new IntersectionObserver((entries) => {
      const canvasEntry = entries[0];
      if (canvasEntry.isIntersecting) {
        run();
        return;
      }
      stop();
    });
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const observer = initIntersection();
    observer.observe(canvasRef.current);
    return () => {
      if (!canvasRef.current) return;
      observer.unobserve(canvasRef.current);
    };
  }, []);

  return (
    <div className="rotate-canvas-wrapper">
      <canvas ref={canvasRef as RefObject<HTMLCanvasElement>}></canvas>
      <aside>
        <h1>{selected.title}</h1>
        <h2>
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                style={{
                  filter: `grayscale(${selected.level <= i ? 1 : 0})`,
                }}
              >
                &#11088;
              </span>
            ))}
        </h2>
        <p>{selected.desc}</p>
      </aside>
    </div>
  );
};

export default RotateCanvas;
