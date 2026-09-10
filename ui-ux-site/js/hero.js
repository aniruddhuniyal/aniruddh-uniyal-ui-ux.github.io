(function () {
  const canvas = document.getElementById("hero-canvas");
  const wrap = canvas.parentElement;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const texLoader = new THREE.TextureLoader();
  const texture = texLoader.load("/assets/earth.png");
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const uniforms = {
    tDiffuse: { value: texture },
    resolution: { value: new THREE.Vector2(1, 1) },
    pixelSize: { value: 3.0 },
    time: { value: 0 },
    drift: { value: new THREE.Vector2(0, 0) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: DitherShader.vertexShader,
    fragmentShader: DitherShader.fragmentShader,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  let mouseTarget = { x: 0, y: 0 };
  let mouseCurrent = { x: 0, y: 0 };

  window.addEventListener("pointermove", (e) => {
    mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.resolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
  }
  window.addEventListener("resize", resize);
  resize();

  function animate(t) {
    requestAnimationFrame(animate);
    uniforms.time.value = t * 0.001;

    // Slow autonomous drift so the still image doesn't feel static,
    // plus a gentle mouse-parallax nudge on top.
    mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.03;
    mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.03;

    const autoX = Math.sin(uniforms.time.value * 0.05) * 0.3;
    const autoY = Math.cos(uniforms.time.value * 0.04) * 0.15;

    uniforms.drift.value.set(
      autoX + mouseCurrent.x * 0.15,
      autoY + mouseCurrent.y * 0.1
    );

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
