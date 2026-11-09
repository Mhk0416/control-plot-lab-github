## Add dsh-control-plot-lab

GitHub-only plugin (no npm package).

- Repository: https://github.com/Mhk0416/control-plot-lab-github
- Category: `ui`
- Provides a local-first control-systems workbench inside DSH: transfer-function input, interactive Bode / Nyquist / root-locus plots, zoom and pan, and a step-by-step derivation panel.
- Supports symbolic `K` (numerator or denominator) and pure delay `e^(-tau*s)`; Bode/Nyquist use the exact delay, root locus uses a second-order Padé approximation.
- No runtime network calls and no third-party runtime dependencies; the plugin works offline after installation.
- `package.json` declares `dsh.bundle.patch` and `dsh.client`; `client.js` is prebuilt and committed, so no install-time build is required.
- Before opening this PR, the repository has the `dsh-plugin` topic and is older than the 1-day gate.
