import React, { useRef, useEffect } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let stars = [];
    let shootingStars = [];
    let animationFrameId;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // 🌠 Create stars (some constant, some twinkling)
    const createStars = () => {
      stars = [];
      const total = 100;
      for (let i = 0; i < total; i++) {
        const isConstant = Math.random() < 0.25; 
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: isConstant ? 1 : Math.random(),
          fade: isConstant ? 0 : Math.random() * 0.02 + 0.005,
          constant: isConstant,
        });
      }
    };
    createStars();

    const createShootingStar = () => {
      if (Math.random() < 0.02) {
        // low probability for natural look
        const startX = Math.random() * (canvas.width / 2) + canvas.width / 2;
        const startY = Math.random() * (canvas.height / 2);
        shootingStars.push({
          x: startX,
          y: startY,
          length: Math.random() * 100 + 60,
          speed: Math.random() * 8 + 6,
          size: Math.random() * 1.2 + 0.8,
          opacity: 1,
          trail: [],
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ✨ draw stars
      stars.forEach((star) => {
        if (!star.constant) {
          star.alpha += star.fade;
          if (star.alpha <= 0 || star.alpha >= 1) star.fade *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.shadowColor = "#b388ff";
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      // 💫 draw shooting stars (top-right to bottom-left)
      shootingStars.forEach((s, i) => {
        s.trail.push({ x: s.x, y: s.y, opacity: s.opacity });
        if (s.trail.length > 10) s.trail.shift();

        // Draw trail with gradient
        const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.length, s.y + s.length / 2);
        gradient.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
        gradient.addColorStop(1, `rgba(155,89,182,0)`); // fade to purple

        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length, s.y + s.length / 2);
        ctx.stroke();

        s.x -= s.speed; // move left
        s.y += s.speed / 2; // move downward
        s.opacity -= 0.02;

        if (s.opacity <= 0) shootingStars.splice(i, 1);
      });

      createShootingStar();
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;
