# CK · Digital Construction — personal website

A static personal site for a Senior BIM Manager. The logo/brand uses the initials "CK";
the full name appears in the About introduction. Programmes are named and illustrated
**only with openly licensed public imagery** (credits + license links under each photo) —
no client documents, project models, requirement names or third-party logos appear anywhere.

## Structure

```
ck-bim-site/
├── index.html          # single-page site (all sections)
├── css/style.css       # dark "digital blueprint" theme + 3D card styles
├── js/main.js          # scroll reveal, counters, mobile nav, 3D tilt & scroll-spin
├── js/showcase3d.js    # Three.js programme showcase (ES module, CDN import)
├── serve.ps1           # dependency-free local preview server (port 8377)
└── assets/
    ├── logo.svg        # CK monogram — isometric wireframe cube
    ├── favicon.svg
    └── projects/       # openly licensed photos (Wikimedia Commons)
```

## The logo

The monogram hides "CK" inside an isometric BIM wireframe cube: the **C** is the cube's
left bracket, the **K** is the centre construction line plus the two diagonals to the
right-hand vertices. The dots are coordination nodes.

## The cinematic scroll intro

The opening section is a **canvas frame-sequence scrub** (the "scroll-cinematic"
technique): 180 frames of an original wireframe digital-twin fly-through — the CK cube
seeds a city that assembles as the camera cranes up — rendered from our own Three.js
scene by `render-frames.html` (dev tool; POSTs frames to `serve.ps1 /save`). Scrolling
plays the film forward/backward via `js/cinematic.js` (+ self-hosted Lenis smooth
scroll in `js/vendor/`). Frames live in `assets/cinematic/w1600` (desktop) and `w960`
(mobile). To regenerate: run `serve.ps1`, open `/render-frames.html`, wait for DONE.

## The 3D programme showcase

`js/showcase3d.js` renders five **original procedural wireframe abstractions** (never
project data): airport terminal, linear city, viaduct with bridging machine, reactor
dome with ring crane, and a clarifier tank. The sticky stage swaps models as each
programme card scrolls past; rotation is coupled to scroll. Photo cards also rotate in
3D with scroll position and tilt under the cursor.

## Image licensing

All photos are from Wikimedia Commons under CC BY-SA (2.0/3.0/4.0); attribution and
license links are shown under each image on the site. If images are replaced, keep the
credit pattern.

## Run it

Open `index.html` in a browser, or run `serve.ps1` and visit `http://localhost:8377/`.
External requests: Google Fonts + Three.js CDN (the rest is self-contained).

## Publishing

Live at https://ckofidis-git.github.io/ck-bim-site/ (GitHub Pages, `main` branch root).
Push to `main` and Pages rebuilds automatically. Contact links (email + LinkedIn) are wired up.

## Ideas to evolve

- Blog ("Field notes") with real articles.
- Replace the water-era wireframe-only card with a strong open photo if one appears.
- A "toolkit" page with downloadable generic templates (BEP skeleton, audit checklist).
- Dark/light theme toggle.
