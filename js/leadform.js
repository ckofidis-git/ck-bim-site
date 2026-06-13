// ============================================================
// CK · Digital Delivery Toolkit — Formspree lead capture
// Async submit, no page refresh. The Formspree form ID is public
// by design (no secret key). State machine: idle → loading →
// success (inline download reveal) | error.
// ============================================================
(function () {
  // ---- SETUP: create a form at https://formspree.io, then replace
  //      "mock_id" below with your real form ID (e.g. "mwkdabcd"). ----
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mock_id";

  const form = document.getElementById("toolkitForm");
  if (!form) return;
  const btn = document.getElementById("toolkitBtn");
  const statusEl = document.getElementById("toolkitStatus");
  const successPanel = document.getElementById("toolkitSuccess");
  const defaultLabel = btn.textContent;
  const configured = !FORMSPREE_ENDPOINT.includes("mock_id") &&
                     !FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID");

  function showError(msg) {
    statusEl.hidden = false;
    statusEl.textContent = "✕ " + msg;
    statusEl.className = "lead__status lead__status--error";
  }
  function resetButton() {
    btn.disabled = false;
    delete btn.dataset.loading;
    btn.textContent = defaultLabel;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form._gotcha && form._gotcha.value) return;          // bot tripped honeypot
    statusEl.hidden = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showError("Please enter your name and a valid email.");
      return;
    }
    if (!configured) {
      showError("Form not yet connected — email CK directly at ckofidis@gmail.com.");
      return;
    }

    btn.disabled = true;
    btn.dataset.loading = "true";
    btn.textContent = "Connecting to server…";

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        form.hidden = true;
        successPanel.hidden = false;
        requestAnimationFrame(() => successPanel.classList.add("is-in"));
      } else {
        const data = await res.json().catch(() => ({}));
        showError(
          data.errors ? data.errors.map((x) => x.message).join(", ")
                      : "Submission failed. Please verify your connection and try again."
        );
        resetButton();
      }
    } catch {
      showError("Submission failed. Please verify your connection and try again.");
      resetButton();
    }
  });
})();
