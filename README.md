# Llama Hop

A desktop-friendly canvas game: hop through cactus gaps, discover new worlds,
and unlock pop-culture llama transformations. No build step or dependencies.

## Play locally

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open <http://localhost:8080>. Click or press Space / Arrow Up to hop.

- Pink cacti award 3 points; every 9 points earns an extra life.
- Transformations start at 13 points; the final form unlocks at 103 points.
- Best score and discovered worlds are saved in browser local storage.
- **Clear game state** resets progress after confirmation.
- Reduced-motion preferences are respected.

The game lives in `index.html`. Keep its artwork and font files alongside it
when deploying to any static web server. See `ASSETS.md` and the bundled font
licenses for asset attribution; character references belong to their respective
rights holders.
