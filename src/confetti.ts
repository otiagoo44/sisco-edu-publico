export function celebrate(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  let width = innerWidth,
    height = innerHeight,
    frame = 0;
  const resize = () => {
    width = innerWidth;
    height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  resize();
  const tokens = getComputedStyle(document.documentElement);
  const colors = [
    "--color-primary",
    "--color-cyan",
    "--color-warm",
    "--color-ink",
  ].map((c) => tokens.getPropertyValue(c).trim());
  const particles = Array.from({ length: width < 600 ? 65 : 110 }, () => ({
    x: width * 0.5,
    y: height * 0.58,
    vx: (Math.random() - 0.5) * 17,
    vy: -7 - Math.random() * 13,
    angle: Math.random() * 6.28,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 4 + Math.random() * 5,
  }));
  let last = performance.now();
  const start = last;
  function draw(now: number) {
    const delta = Math.min((now - last) / 16.67, 2);
    last = now;
    context!.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vy += 0.15 * delta;
      p.vx *= 0.995;
      p.angle += 0.055 * delta;
      context!.save();
      context!.globalAlpha = Math.max(
        0,
        Math.min(1, (4800 - (now - start)) / 1000),
      );
      context!.translate(p.x, p.y);
      context!.rotate(p.angle);
      context!.fillStyle = p.color;
      context!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
      context!.restore();
    }
    if (now - start < 4800) frame = requestAnimationFrame(draw);
  }
  frame = requestAnimationFrame(draw);
  window.addEventListener("resize", resize);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    context.clearRect(0, 0, width, height);
  };
}
