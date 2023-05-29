import { useEffect } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import throttle from "lodash/throttle";

export const useCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>();
  const size = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const prePosition = useRef<{ x: number; y: number }>();
  const imageSrc = useRef<HTMLImageElement["src"]>();

  const init = useCallback(() => {
    if (!ref.current) return;
    ctx.current = ref.current.getContext("2d");

    resize(ref.current);
    window.addEventListener("resize", () => resize(ref.current!));

    return () => resize(ref.current!);
  }, []);

  const resize = (canvas: HTMLCanvasElement) => {
    const parent = canvas.parentNode as HTMLDivElement;
    size.current = {
      width: parent.clientWidth,
      height: parent.clientHeight,
    };
    canvas.width = size.current.width;
    canvas.height = size.current.height;
    canvas.style.width = size.current.width + "px";
    canvas.style.height = size.current.height + "px";

    drawImage();
  };

  const clearEvent = (resize?: () => void) => {
    window.removeEventListener("resize", resize!);
  };

  const drawImage = () => {
    ctx.current?.clearRect(0, 0, size.current.width, size.current.height);

    const image = new Image();
    image.src = imageSrc.current ?? "";
    image.onload = () => {
      ctx.current?.drawImage(
        image,
        0,
        0,
        size.current.width,
        size.current.height
      );
    };
  };

  const drawCircles = (e: MouseEvent) => {
    if (!ctx.current || !prePosition.current) return;

    ctx.current.globalCompositeOperation = "destination-out";

    const newPos = { x: e.offsetX, y: e.offsetY };
    const dx = Math.pow(prePosition.current.x - newPos.x, 2);
    const dy = Math.pow(prePosition.current.y - newPos.y, 2);
    const distance = Math.sqrt(dx + dy);
    const angle = Math.atan2(dy, dx);

    Array.from({ length: distance }, (v, i) => i + 1).forEach((i) => {
      const x = prePosition.current!.x + Math.cos(angle) * i;
      const y = prePosition.current!.y + Math.sin(angle) * i;
      ctx.current?.beginPath();
      ctx.current?.arc(x, y, size.current.width / 15, 0, Math.PI * 2);
      ctx.current?.fill();
      ctx.current?.closePath();
    });
    prePosition.current = newPos;
  };

  const checkPercent = throttle(() => {
    const imageData = ctx.current?.getImageData(
      0,
      0,
      size.current.width,
      size.current.height
    );
    if (!imageData) return;

    const gap = 64;
    const percent = imageData.data
      .filter((d, i) => i % gap === 3 && i < imageData.data.length - 3)
      .reduce((acc, cur) => {
        return (acc += cur === 0 ? 1 : 0);
      }, 0);

    const total = imageData.data.length / gap;
    console.log(Math.round((percent / total) * 100));
  }, 1000);

  useEffect(() => {
    const resize = init();

    return () => clearEvent(resize);
  }, [init, ref.current]);

  return {
    ref,
    ctx,
    drawImage,
    drawCircles,
    prePosition,
    imageSrc,
    checkPercent,
  };
};
