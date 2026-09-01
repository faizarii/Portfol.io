import React, { useEffect, useRef } from 'react';

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Silky organic light blobs
    const blobs = [
      { x: width * 0.2, y: height * 0.25, r: 350, vx: 0.12, vy: 0.15, color: 'rgba(40, 52, 72, 0.22)' },
      { x: width * 0.8, y: height * 0.3, r: 420, vx: -0.1, vy: 0.12, color: 'rgba(30, 40, 58, 0.28)' },
      { x: width * 0.5, y: height * 0.7, r: 480, vx: 0.15, vy: -0.09, color: 'rgba(35, 45, 62, 0.24)' },
      { x: width * 0.3, y: height * 0.8, r: 360, vx: -0.08, vy: -0.14, color: 'rgba(25, 32, 46, 0.25)' },
    ];

    let time = 0;

    const render = () => {
      time += 0.006;
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Deep base gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#090B0E');
      bgGrad.addColorStop(0.5, '#0E1117');
      bgGrad.addColorStop(1, '#080A0D');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw soft organic silky light fields
      blobs.forEach((blob, idx) => {
        const oscillationX = Math.sin(time + idx * 1.5) * 40;
        const oscillationY = Math.cos(time * 0.8 + idx) * 35;
        
        // Mouse gentle magnetic shift
        const distX = (mouseX - blob.x) * 0.03;
        const distY = (mouseY - blob.y) * 0.03;

        const currentX = blob.x + oscillationX + distX;
        const currentY = blob.y + oscillationY + distY;

        const radGrad = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          blob.r * 1.3
        );
        radGrad.addColorStop(0, blob.color);
        radGrad.addColorStop(0.6, blob.color.replace(/[\d\.]+\)$/, '0.08)'));
        radGrad.addColorStop(1, 'rgba(9, 11, 14, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(currentX, currentY, blob.r * 1.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle interactive mouse spotlight
      const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 450);
      mouseGrad.addColorStop(0, 'rgba(80, 105, 145, 0.07)');
      mouseGrad.addColorStop(0.5, 'rgba(40, 60, 90, 0.02)');
      mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none w-full h-full"
      />
      <div className="ambient-silk-bg" />
      <div className="silk-wave-layer" />
      <div className="silk-wave-layer-2" />
      <div className="grain-overlay" />
    </>
  );
};
