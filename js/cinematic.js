// ============================================================
// CK · Digital Construction — cinematic scroll intro
// Canvas frame-sequence scrub (scroll-cinematic technique):
// 180 pre-rendered frames of an original wireframe digital-twin
// fly-through; scroll progress picks the frame, so scrolling
// plays the film forward and backward. Lenis smooths the ride.
// ============================================================

(function () {
  const section = document.getElementById("cine");
  if (!section) return;

  const canvas = section.querySelector("canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const lines = [...section.querySelectorAll(".cine-line")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const FRAME_COUNT = 180;
  const BG = "#0a0f1e";
  const dir = window.matchMedia("(max-width: 768px)").matches ? "w960" : "w1600";
  const framePath = (i) => `assets/cinematic/${dir}/frame_${String(i).padStart(4, "0")}.jpg`;

  // ---------- preload ----------
  const images = [];
  let firstDrawn = false;
  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.src = framePath(i + 1);
    img.onload = () => { if (!firstDrawn) { firstDrawn = true; draw(0); } };
    images[i] = img;
  }

  // ---------- draw (cover fit, HiDPI) ----------
  let current = -1;
  function draw(index) {
    const img = images[index];
    if (!img || !img.complete || !img.naturalWidth) return;
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    const ir = img.naturalWidth / img.naturalHeight, cr = cw / ch;
    let dw, dh, dx, dy;
    if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0; }
    else { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(current < 0 ? 0 : current);
  }
  window.addEventListener("resize", resize);
  resize();

  // ---------- scrub update ----------
  function update() {
    const rect = section.getBoundingClientRect();
    if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight) return;
    const scrollable = rect.height - window.innerHeight;
    const p = Math.min(Math.max(-rect.top / scrollable, 0), 1);
    const idx = Math.min(FRAME_COUNT - 1, Math.floor(p * (FRAME_COUNT - 1)));
    if (idx !== current) { current = idx; draw(idx); }
    for (const el of lines) {
      const a = parseFloat(el.dataset.in), b = parseFloat(el.dataset.out);
      const mid = (a + b) / 2, half = (b - a) / 2;
      let o = 1 - Math.abs(p - mid) / half;
      o = Math.max(0, Math.min(1, o * 1.4));        // plateau so lines hold full opacity
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translateY(${((1 - o) * 26).toFixed(1)}px)`;
    }
    const hint = section.querySelector(".cine__hint");
    if (hint) hint.style.opacity = p > 0.04 ? "0" : "1";
  }

  // ---------- Lenis smooth scroll (skipped for reduced motion) ----------
  let lenis = null;
  if (!reduced && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    // route anchor links through Lenis so nav clicks glide
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70, duration: 1.4 });
      });
    });
  }

  function raf(t) {
    if (lenis) lenis.raf(t);
    update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();
