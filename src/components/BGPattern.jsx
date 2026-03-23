import { useEffect, useRef } from "react";

export default function BGPattern({ size = 24, fill, isDark }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const radius = 120; // Mouse influence radius
    const maxDisplace = 8; // Max pixel displacement
    const dotRadius = 1;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", handleMouseMove);

    function handleMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }
    window.addEventListener("mouseleave", handleMouseLeave);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let x = size; x < canvas.width; x += size) {
        for (let y = size; y < canvas.height; y += size) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let drawX = x;
          let drawY = y;
          let scale = 1;
          let opacity = 0.4;

          if (dist < radius) {
            // Push dots away from mouse
            const force = (1 - dist / radius);
            drawX += (dx / dist) * force * maxDisplace;
            drawY += (dy / dist) * force * maxDisplace;
            scale = 1 + force * 1.5;
            opacity = 0.4 + force * 0.6;
          }

          ctx.beginPath();
          ctx.arc(drawX, drawY, dotRadius * scale, 0, Math.PI * 2);
          ctx.fillStyle = fill;
          ctx.globalAlpha = opacity;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, [size, fill]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}