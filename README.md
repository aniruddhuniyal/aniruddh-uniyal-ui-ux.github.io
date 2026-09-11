# Aniruddh's Workspace

![Live](https://img.shields.io/badge/site-live-8b5cf6?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-222222?style=flat-square&logo=github)
![No Build Step](https://img.shields.io/badge/build%20step-none-c4b5fd?style=flat-square)

A personal site to showcase my UI/UX work — built from scratch with real 3D (Three.js), a dithered hero image, and a live project gallery.

**Live site:** https://aniruddhuniyal.github.io/aniruddh-uniyal-ui-ux.github.io/

## What this is

This is a showcase of my UI/UX and design work, split into two categories:

- **Non-affiliated** — personal, independent projects
- **Custom Designs** — vision to design projects

## Built with

- Vanilla HTML/CSS/JS — no framework, no build step
- [Three.js](https://threejs.org/) for the 3D ThinkPad model and the WebGL dithering shader
- Hosted on GitHub Pages

## Structure

```
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── dither-shader.js   # shared Bayer-dither shader
│   ├── hero.js            # hero image + mouse-reactive dither
│   ├── laptop.js          # loads laptop.glb, dithered render pass
│   ├── marquee.js         # infinite two-row tag carousel
│   └── work.js            # tab switching for the gallery
└── assets/
    ├── earth.png
    ├── laptop.glb
    └── work/
        ├── non-affiliated/
        └── custom-designs/
```
