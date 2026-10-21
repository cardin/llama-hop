# Llama Hop

A desktop-friendly canvas game: hop through cactus gaps, discover new worlds,
and unlock pop-culture llama transformations. No build step or dependencies.

## Play locally

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open <http://localhost:8080>. Click or press Space / Arrow Up to hop.

- Pink cacti award 3 points; every 9 points earns an extra life.
- Transformations start at 13 points; the final new form unlocks at 103 points.
- At 113 points the basic llama returns, followed by Ash at 123, Super Saiyan
  at 133, and so on. Forms repeat every 10 points while the score keeps rising.
- Best score and discovered worlds are saved in browser local storage.
- **Clear game state** resets progress after confirmation.
- All scene and character animations are always enabled.

## Deploy to GitHub Pages

The game is ready to serve as a Pages site: `index.html` is at the repository
root, every asset path is relative, and `.nojekyll` disables Jekyll processing.

1. Make the repository public if it is private. GitHub Pages on the Free plan
   only publishes from public repositories.
2. Open **Settings → Pages** and set **Source** to **Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)`, then save.
4. The game is published at <https://cardin.github.io/llama-hop/>.

No build step, workflow, or dependency install is required. Every push to
`main` republishes the site.

## Code layout

- `index.html` — page structure and controls.
- `styles.css` — layout, typography, and local fonts.
- `js/config.js` — scene palettes, trail settings, and the final transformation score.
- `js/canvas.js` — shared drawing helpers and temporary preview contexts.
- `js/scenes.js` — weather, scenery, and a named renderer for each world.
- `js/scenes/` — standalone scene artwork, including Jurassic's dinosaurs and jungle.
- `js/llama.js` — character artwork, trails, and hop effects.
- `js/transformations.js` — appearance cycles, independent of the actual score.
- `js/game.js` — input, scoring, lives, resets, and the animation loop.
- `js/gallery.js` — pixelated previews and scene discoveries.
- `js/storage.js` — best scores and discoveries in browser local storage.

To rename a world, edit its `name` in `js/config.js`. Discoveries are keyed by
the current name; old names are not translated or migrated.

Serve the whole directory, including `js/`, `styles.css`, artwork, and fonts.
ES modules require HTTP serving rather than opening `index.html` as a local file.
There is still no build step and no runtime dependency to install.

## Tests

With Node.js installed, run `npm test`. The tests use Node's built-in test runner
and recording canvas adapters; no packages need to be installed. They cover game
rules, reset behavior, persistence, scene dispatch, and character effects.

See `ASSETS.md` and the bundled font licenses for asset attribution; character
references belong to their respective rights holders.
