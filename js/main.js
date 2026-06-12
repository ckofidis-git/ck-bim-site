// ============================================================
// CK · Digital Construction — interactions
// ============================================================

// --- Sticky nav shadow ---
const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 10);
}, { passive: true });

// --- Mobile menu ---
const burger = document.getElementById("navBurger");
const links = document.getElementById("navLinks");
burger.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
});

// --- Scroll reveal ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// --- Animated stat counters ---
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (target === 0) { el.textContent = "0"; return; }
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat[data-count]").forEach((el) => statObserver.observe(el));

// --- Placeholder contact buttons ---
document.querySelectorAll("[data-placeholder]").forEach((el) => {
  el.addEventListener("click", (e) => {
    if (el.getAttribute("href") === "#") {
      e.preventDefault();
      alert("Contact details coming soon — add your " + el.dataset.placeholder + " link in index.html.");
    }
  });
});

// --- Footer year ---
document.getElementById("year").textContent = new Date().getFullYear();

// ============================================================
// 3D depth effects
// ============================================================
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Scroll-driven spin on programme photo cards ---
// Each card's media plane rotates in 3D depending on where it sits
// in the viewport, so photos "turn" as you scroll past them.
const spinMedia = [...document.querySelectorAll(".pcard__media")];
if (spinMedia.length && !reducedMotion) {
  let ticking = false;
  function updateSpin() {
    const vh = window.innerHeight;
    for (const el of spinMedia) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const center = r.top + r.height / 2;
      const d = Math.max(-1, Math.min(1, (center - vh / 2) / (vh / 2))); // -1..1
      el.style.transform =
        `rotateY(${(d * 14).toFixed(2)}deg) rotateX(${(d * -5).toFixed(2)}deg) translateZ(0)`;
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateSpin); }
  }, { passive: true });
  updateSpin();
}

// --- Cursor tilt on programme photos (on top of scroll spin) ---
if (!reducedMotion) {
  document.querySelectorAll(".pcard__media img").forEach((img) => {
    const wrap = img.parentElement;
    wrap.addEventListener("mousemove", (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = `scale(1.04) rotateY(${x * 7}deg) rotateX(${y * -7}deg)`;
    });
    wrap.addEventListener("mouseleave", () => { img.style.transform = ""; });
  });
}

// --- Hero cube follows the cursor ---
// (tilt is applied to the container; the cube itself keeps its CSS float animation)
const heroVisual = document.querySelector(".hero__visual");
const hero = document.querySelector(".hero");
if (heroVisual && hero && !reducedMotion) {
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroVisual.style.transform = `perspective(700px) rotateY(${x * 18}deg) rotateX(${y * -12}deg)`;
  });
  hero.addEventListener("mouseleave", () => { heroVisual.style.transform = ""; });
}
