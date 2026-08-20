## Arras Build Loader (Archived)

![arras.io](https://arras.io/favicon/128x128.png)

![GitHub Repo stars](https://img.shields.io/github/stars/dohuy247209/arras-build-loader-temp)
![GitHub Repo forks](https://img.shields.io/github/forks/dohuy247209/arras-build-loader-temp)
![GitHub Repo size](https://img.shields.io/github/repo-size/dohuy247209/arras-build-loader-temp)
![GitHub Repo license](https://img.shields.io/github/license/dohuy247209/arras-build-loader-temp)

A custom script for Arras.io that lets you save and apply build presets instantly (for testing purposes).

## Features
* **Unlimited Presets & Keybinds:** Easily add, edit, or delete custom builds and assign keybinds to them. All data is saved automatically.
* **Instant Build Switch:** Apply any custom build in-game with a single keypress.
* **Theme Matching:** Includes an "Apply Theme" option to sync the panel colors with your in-game theme.
* **Auto Stat Labels:** Displays stat names automatically when entering a build.

## How to Use
1. Install **Tampermonkey** (for Chrome): [https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Copy the full code from `r-app.js` and paste it into a new Tampermonkey script.
3. Go to [arras.io](https://arras.io) and press backtick key ( `` ` `` ) to toggle the panel.
4. Add a build using the `name:build` format (e.g., `overlord:1/2/3/4/5/6/7/8/3/3`). Then enter a keybind in the input field that appears. *Note: Avoid keys that conflict with default game controls (like `E` for auto-fire).*
5. Press your assigned keybind anytime to apply the stored build.
6. To enable or disable in-game notifications, set `notifyInGame` on line 14:

```javascript
  const notifyInGame = true;
```
An example of how it looks in-game:

![notification](https://i.ibb.co/fLchbGP/Screenshot-2026-08-20-174228.png)

## Changelog
- Fix: Game input gets focus instead of the panel.
- Add "Apply theme" option.
- Add an in-game notification when spawn/respawn.
- Fix: Remaining keybinds are still active after the builds are deleted, rename localStorage variable, and patched XSS vulnerability.
- Fix: In-game keybinds trigger when typing in panel inputs.
- Fix: Name input still getting focused upon entering the game; improve UX.
