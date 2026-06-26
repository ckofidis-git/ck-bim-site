// ============================================================
// CK · Digital Construction — scroll-cinematic engine
// Multi-section canvas frame-sequence scrub: each section's
// pre-rendered frames (original Three.js wireframe films, never
// project data) are scrubbed by scroll progress. Lenis smooths
// the ride. Non-intro sections lazy-load their frames as the
// reader approaches, keeping initial page weight down.
// ============================================================

(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 768px)").matches;

  const SECTIONS = [
    { id: "cine",         dir: small ? "w960" : "w1600",                   count: 180, lazy: false },
    { id: "cineViaduct",  dir: small ? "viaduct-w960" : "viaduct-w1600",   count: 140, lazy: true },
    { id: "cineTerminal", dir: small ? "terminal-w960" : "terminal-w1600", count: 140, lazy: true },
  ];

  const BG = "#0a0f1e";

  function initScrub(cfg) {
    const section = document.getElementById(cfg.id);
    if (!section) return null;
    const canvas = section.querySelector("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    const lines = [...section.querySelectorAll(".cine-line")];
    const framePath = (i) => `assets/cinematic/${cfg.dir}/frame_${String(i).padStart(4, "0")}.jpg`;

    const images = [];
    let loading = false;
    let firstDrawn = false;

    function loadFrame(i, priority) {
      if (images[i]) return;
      const img = new Image();
      if ("fetchPriority" in img) img.fetchPriority = priority;   // hint the loader
      img.onload = () => { if (!firstDrawn) { firstDrawn = true; draw(current < 0 ? 0 : current); } };
      img.src = framePath(i + 1);
      images[i] = img;
    }
    function preload() {
      if (loading) return;
      loading = true;
      loadFrame(0, "high");                              // first frame ASAP — paints the stage
      const rest = () => { for (let i = 1; i < cfg.count; i++) loadFrame(i, "low"); };
      // bulk download stays off the critical path so it never competes with FCP
      if ("requestIdleCallback" in window) requestIdleCallback(rest, { timeout: 3000 });
      else setTimeout(rest, 400);
    }
    if (cfg.lazy) {
      // start fetching ~1.5 viewports before the section arrives
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { preload(); io.disconnect(); }
      }, { rootMargin: "150% 0px 150% 0px" });
      io.observe(section);
    } else {
      // intro: paint frame 0 immediately, defer the heavy preload until after load
      loadFrame(0, "high");
      if (document.readyState === "complete") preload();
      else window.addEventListener("load", preload, { once: true });
    }

    let current = -1;
    function draw(index) {
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, cw, ch);
      const img = images[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      const ir = img.naturalWidth / img.naturalHeight, cr = cw / ch;
      let dw, dh, dx, dy;
      if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0; }
      else { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
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

    function update() {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight) return;
      const scrollable = rect.height - window.innerHeight;
      const p = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      const idx = Math.min(cfg.count - 1, Math.floor(p * (cfg.count - 1)));
      if (idx !== current) { current = idx; draw(idx); }
      for (const el of lines) {
        const a = parseFloat(el.dataset.in), b = parseFloat(el.dataset.out);
        const mid = (a + b) / 2, half = (b - a) / 2;
        let o = 1 - Math.abs(p - mid) / half;
        o = Math.max(0, Math.min(1, o * 1.4));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${((1 - o) * 26).toFixed(1)}px)`;
      }
      const hint = section.querySelector(".cine__hint");
      if (hint) hint.style.opacity = p > 0.04 ? "0" : "1";
    }

    return { update };
  }

  const scrubs = SECTIONS.map(initScrub).filter(Boolean);

  // ---------- Lenis smooth scroll (skipped for reduced motion) ----------
  let lenis = null;
  if (!reduced && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;                       // exposed so modals can pause page scroll
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
    scrubs.forEach((s) => s.update());
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();
