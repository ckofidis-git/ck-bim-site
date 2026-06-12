// ============================================================
// CK · Digital Construction — 3D programme showcase
// Original procedural wireframe abstractions (never project data).
// Models morph as project cards scroll past; rotation is
// coupled to scroll for a "turn the model in your hands" feel.
// ============================================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

const canvas = document.getElementById("modelCanvas");
const stage = document.getElementById("showcaseStage");
const cardsWrap = document.getElementById("showcaseCards");
if (!canvas || !stage || !cardsWrap) throw new Error("showcase elements missing");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CYAN = 0x38bdf8;
const INDIGO = 0x818cf8;
const SLATE = 0x475569;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
} catch (e) {
  stage.style.display = "none";
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0, 1.1, 8.5);
camera.lookAt(0, 0, 0);

// ---------- helpers ----------
function lineMat(color, opacity = 0.9) {
  return new THREE.LineBasicMaterial({ color, transparent: true, opacity });
}
function edges(geom, color, opacity) {
  return new THREE.LineSegments(new THREE.EdgesGeometry(geom, 12), lineMat(color, opacity));
}
// polyline through arbitrary points
function polyline(points, color, opacity = 0.9) {
  const g = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
  return new THREE.Line(g, lineMat(color, opacity));
}
// vertical-plane arc (for roofs, arches): radius r, centred at (cx, cy, z)
function arc(r, cx, cy, z, color, opacity = 0.9, start = 0, end = Math.PI, seg = 24) {
  const pts = [];
  for (let i = 0; i <= seg; i++) {
    const a = start + (end - start) * (i / seg);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]);
  }
  return polyline(pts, color, opacity);
}

// ---------- model builders (original abstractions) ----------

// Airport terminal: swooping roof ribs over a concourse + tower
function buildTerminal() {
  const g = new THREE.Group();
  for (let i = -3; i <= 3; i++) {
    const z = i * 0.55;
    const r = 1.7 - Math.abs(i) * 0.13;             // swoop
    g.add(arc(r, 0, -0.2, z, i % 2 ? CYAN : INDIGO, 0.85));
  }
  // roof spines connecting rib crowns
  for (const a of [Math.PI / 6, Math.PI / 2, Math.PI - Math.PI / 6]) {
    const pts = [];
    for (let i = -3; i <= 3; i++) {
      const r = 1.7 - Math.abs(i) * 0.13;
      pts.push([r * Math.cos(a), -0.2 + r * Math.sin(a), i * 0.55]);
    }
    g.add(polyline(pts, SLATE, 0.7));
  }
  // concourse slab + runway
  g.add(edges(new THREE.BoxGeometry(3.8, 0.08, 3.9), SLATE, 0.55));
  g.add(polyline([[-2.6, -0.25, -2.6], [2.6, -0.25, 2.6]], CYAN, 0.5));
  // control tower
  const tower = edges(new THREE.CylinderGeometry(0.09, 0.13, 1.5, 6), INDIGO, 0.9);
  tower.position.set(2.2, 0.55, -1.6);
  g.add(tower);
  const cab = edges(new THREE.CylinderGeometry(0.26, 0.2, 0.3, 6), CYAN, 0.95);
  cab.position.set(2.2, 1.4, -1.6);
  g.add(cab);
  g.position.y = -0.3;
  return g;
}

// The Line: two mirrored walls running to the horizon, cross-linked
function buildLineCity() {
  const g = new THREE.Group();
  for (const z of [-0.4, 0.4]) {
    const wall = edges(new THREE.BoxGeometry(7.5, 1.5, 0.05), z < 0 ? CYAN : INDIGO, 0.85);
    wall.position.set(0, 0.45, z);
    g.add(wall);
  }
  // internal floors + cross links
  for (let f = 0; f <= 4; f++) {
    const y = -0.3 + f * 0.375;
    g.add(polyline([[-3.75, y, -0.4], [3.75, y, -0.4]], SLATE, 0.4));
    g.add(polyline([[-3.75, y, 0.4], [3.75, y, 0.4]], SLATE, 0.4));
  }
  for (let i = -5; i <= 5; i++) {
    const x = i * 0.68;
    g.add(polyline([[x, 1.2, -0.4], [x, 1.2, 0.4]], CYAN, 0.5));
    g.add(polyline([[x, -0.3, -0.4], [x, -0.3, 0.4]], SLATE, 0.4));
  }
  // desert ground line
  g.add(polyline([[-4.4, -0.32, 0], [4.4, -0.32, 0]], SLATE, 0.6));
  g.rotation.x = 0.06;
  return g;
}

// Viaduct: piers, arches and a deck — plus a tiny bridging machine
function buildViaduct() {
  const g = new THREE.Group();
  const deck = edges(new THREE.BoxGeometry(7.2, 0.14, 0.9), CYAN, 0.9);
  deck.position.y = 0.7;
  g.add(deck);
  for (let i = -2; i <= 2; i++) {
    const x = i * 1.55;
    const pier = edges(new THREE.CylinderGeometry(0.09, 0.12, 1.5, 8), INDIGO, 0.85);
    pier.position.set(x, -0.12, 0);
    g.add(pier);
    if (i < 2) {
      for (const z of [-0.35, 0.35]) {
        g.add(arc(0.62, x + 0.775, 0.55, z, SLATE, 0.65, Math.PI, 2 * Math.PI));
      }
    }
  }
  // bridging machine silhouette on deck
  const rig = edges(new THREE.BoxGeometry(1.7, 0.32, 0.5), CYAN, 0.95);
  rig.position.set(-1.2, 1.05, 0);
  g.add(rig);
  g.add(polyline([[-2.05, 0.78, 0], [-2.6, 0.78, 0]], CYAN, 0.8)); // launching nose
  // rails
  g.add(polyline([[-3.6, 0.78, -0.18], [3.6, 0.78, -0.18]], INDIGO, 0.6));
  g.add(polyline([[-3.6, 0.78, 0.18], [3.6, 0.78, 0.18]], INDIGO, 0.6));
  g.position.y = -0.25;
  return g;
}

// Reactor: dome + drum, containment rings, and a very large crane
function buildReactor() {
  const g = new THREE.Group();
  const drum = edges(new THREE.CylinderGeometry(1.05, 1.05, 1.1, 18), CYAN, 0.85);
  drum.position.y = 0.05;
  g.add(drum);
  const dome = edges(new THREE.SphereGeometry(1.05, 18, 7, 0, Math.PI * 2, 0, Math.PI / 2), INDIGO, 0.85);
  dome.position.y = 0.6;
  g.add(dome);
  for (const y of [-0.3, 0.2, 0.6]) {
    g.add(arc(1.06, 0, y, 0, SLATE, 0.5, 0, Math.PI * 2, 36));
  }
  // "Big Carl" — the giant ring crane
  const mast = polyline([[2.3, -0.5, 0], [2.3, 2.3, 0]], CYAN, 0.95);
  g.add(mast);
  g.add(polyline([[2.3, 2.3, 0], [0.4, 1.45, 0]], CYAN, 0.9));      // jib
  g.add(polyline([[2.3, 2.3, 0], [3.1, 1.7, 0]], CYAN, 0.9));      // counter-jib
  g.add(polyline([[0.4, 1.45, 0], [0.4, 1.0, 0]], SLATE, 0.8));    // hook line
  g.add(arc(0.5, 2.3, -0.5, 0, SLATE, 0.7, 0, Math.PI * 2, 24));   // crane ring
  // ground
  g.add(polyline([[-2.6, -0.5, 0], [3.4, -0.5, 0]], SLATE, 0.5));
  g.position.y = -0.35;
  return g;
}

// Water: clarifier tank with rotating bridge scraper + pipework
function buildWater() {
  const g = new THREE.Group();
  const tank = edges(new THREE.CylinderGeometry(1.5, 1.5, 0.55, 28), CYAN, 0.85);
  tank.position.y = -0.1;
  g.add(tank);
  g.add(arc(1.5, 0, 0.18, 0, INDIGO, 0.7, 0, Math.PI * 2, 40));   // rim
  // radial scraper bridge
  g.add(polyline([[-1.5, 0.3, 0], [1.5, 0.3, 0]], INDIGO, 0.95));
  g.add(polyline([[-1.5, 0.3, 0], [-1.5, 0.18, 0]], INDIGO, 0.8));
  g.add(polyline([[1.5, 0.3, 0], [1.5, 0.18, 0]], INDIGO, 0.8));
  const hub = edges(new THREE.CylinderGeometry(0.14, 0.14, 0.8, 8), CYAN, 0.9);
  hub.position.y = 0.15;
  g.add(hub);
  // spokes under water line
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    g.add(polyline([[0, -0.05, 0], [1.45 * Math.cos(a), -0.05, 1.45 * Math.sin(a)]], SLATE, 0.35));
  }
  // rising main pipe
  g.add(polyline([[1.5, -0.3, 0.4], [2.6, -0.3, 0.9], [2.6, 0.4, 0.9]], CYAN, 0.7));
  const valve = edges(new THREE.BoxGeometry(0.22, 0.22, 0.22), INDIGO, 0.9);
  valve.position.set(2.6, 0.5, 0.9);
  g.add(valve);
  g.position.y = -0.1;
  return g;
}

// ---------- scene assembly ----------
// Normalize every model to bounding radius 1 and re-centre it, so each
// spins around its true centre; stageScale (set on resize) then grows it
// to fill ~85% of whatever frustum the stage actually has.
function fit(model) {
  const wrapper = new THREE.Group();
  const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
  model.position.sub(sphere.center);
  wrapper.add(model);
  wrapper.userData.fitScale = 1 / sphere.radius;
  return wrapper;
}
const models = {
  terminal: fit(buildTerminal()),
  linecity: fit(buildLineCity()),
  viaduct: fit(buildViaduct()),
  reactor: fit(buildReactor()),
  water: fit(buildWater()),
};
for (const m of Object.values(models)) {
  m.scale.setScalar(0.0001);
  m.visible = false;
  scene.add(m);
}

let activeKey = "terminal";
models[activeKey].visible = true;

// ---------- active model follows the cards ----------
const cards = [...cardsWrap.querySelectorAll(".pcard[data-model]")];
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) activeKey = e.target.dataset.model;
  }
}, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });
cards.forEach((c) => io.observe(c));

// ---------- scroll-coupled rotation ----------
let scrollRot = 0;
let targetScrollRot = 0;
let lastY = window.scrollY;
window.addEventListener("scroll", () => {
  targetScrollRot += (window.scrollY - lastY) * 0.0035;
  lastY = window.scrollY;
}, { passive: true });

// ---------- sizing ----------
let stageScale = 1;
function resize() {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  // largest bounding radius that stays inside the visible frustum at the origin
  const dist = camera.position.length();
  const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
  const halfW = halfH * camera.aspect;
  stageScale = Math.min(halfW, halfH) * 0.85;
}
new ResizeObserver(resize).observe(stage);
resize();

// ---------- animation loop ----------
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  scrollRot += (targetScrollRot - scrollRot) * 0.07;

  for (const [key, m] of Object.entries(models)) {
    const isActive = key === activeKey;
    const full = m.userData.fitScale * stageScale;
    const targetScale = isActive ? full : 0.0001;
    const s = m.scale.x + (targetScale - m.scale.x) * 0.09;
    m.scale.setScalar(s);
    m.visible = s > full * 0.02;
    if (m.visible) {
      m.rotation.y = (reducedMotion ? 0 : t * 0.22) + scrollRot;
      m.rotation.x = -0.12 + (reducedMotion ? 0 : Math.sin(t * 0.7) * 0.03);
      m.position.y = reducedMotion ? 0 : Math.sin(t * 1.1) * 0.06;
    }
  }
  renderer.render(scene, camera);
}
animate();
