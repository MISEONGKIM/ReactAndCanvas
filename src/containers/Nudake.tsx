import "../style/containers/Nudake.css";

import { useEffect } from "react";
import { useCanvas } from "../hooks/useCanvas";

import image1 from "../assets/nudake-1.jpg";
import image2 from "../assets/nudake-2.jpg";
import image3 from "../assets/nudake-3.jpg";

export const Nudake = () => {
  const { ref, drawImage, drawCircles, prePosition, imageSrc } = useCanvas();

  const onMouseDown = (e: MouseEvent) => {
    prePosition.current = { x: e.offsetX, y: e.offsetY };
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
  };

  const onMouseUp = (e: MouseEvent) => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mouseleave", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    drawCircles(e);
  };

  useEffect(() => {
    window.addEventListener("mousedown", onMouseDown);
    imageSrc.current = image1;
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return (
    <div className="nudake">
      <canvas ref={ref} />
    </div>
  );
};
