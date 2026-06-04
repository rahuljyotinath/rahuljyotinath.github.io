# images/

This folder is populated by the external GitHub Actions service, alongside the
`content.json` it generates. The site loads gracefully (showing a blueprint
placeholder pattern) for any image that is missing, so deploys never break.

## Files referenced by the current content.json

| File                | Used for            | Suggested size        |
| ------------------- | ------------------- | --------------------- |
| `hero.jpg`          | Hero background     | 2400 × 1400 (landscape) |
| `project-1.jpg`     | Featured project    | 2000 × 900 (wide)     |
| `project-2.jpg`     | Featured project    | 2000 × 900 (wide)     |
| `project-3.jpg`     | Project card        | 1600 × 1100           |
| `project-4.jpg`     | Project card        | 1600 × 1100           |
| `about.jpg`         | About section       | 1200 × 1500 (portrait)|
| `favicon.png`       | Browser tab icon    | 512 × 512             |

Image paths are **driven entirely by `content.json`** — to add, remove, or rename
an image, change the corresponding `image` field in the JSON. The scaffolding in
`index.html` does not hardcode any filenames.
