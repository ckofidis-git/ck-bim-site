// ============================================================
// CK · Privacy notice — slide in/out, remembers acknowledgement
// Visibility is controlled purely by the .privacy--hide class
// (off-screen + pointer-events:none), so the banner never blocks
// CTAs before JS runs. Entrance uses setTimeout, not rAF, so it
// fires reliably even if the page loads in a background tab.
// ============================================================
(function () {
  const KEY = "privacy_acknowledged";
  const el = document.getElementById("privacy");
  if (!el) return;

  // Returning visitor who already acknowledged — remove it entirely.
  if (localStorage.getItem(KEY) === "true") { el.remove(); return; }

  // Slide in shortly after load.
  setTimeout(() => el.classList.remove("privacy--hide"), 80);

  document.getElementById("privacyAck").addEventListener("click", () => {
    el.classList.add("privacy--hide");                       // slide / fade out
    try { localStorage.setItem(KEY, "true"); } catch (e) {}
    el.addEventListener("transitionend", () => el.remove(), { once: true });
  });
})();
