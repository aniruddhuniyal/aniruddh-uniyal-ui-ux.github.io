(function () {
  const canvas = document.getElementById("laptop-canvas");
  const wrap = canvas.parentElement;

  // ---------- Main scene (renders the model, off-screen) ----------
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.4, 4.2);
  camera.lookAt(0, 0, 0);

  const mainRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mainRenderer.outputEncoding = THREE.sRGBEncoding;
  mainRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  mainRenderer.toneMappingExposure = 1.2;

  scene.add(new THREE.AmbientLight(0xffffff, 1.8));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xffffff, 1.4, 12);
  rimLight.position.set(-3, 1.5, -2);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xffffff, 1.2, 10);
  fillLight.position.set(2, -1, 3);
  scene.add(fillLight);

  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  const loader = new THREE.GLTFLoader();
  let modelLoaded = false;

  loader.load(
    "./assets/laptop.glb",
    (gltf) => {
      const model = gltf.scene;

      // Normalize scale/position so any export size/pivot lands centered and framed.
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2.2 / maxDim;
      model.scale.setScalar(scale);

      model.position.x -= center.x * scale;
      model.position.y -= center.y * scale;
      model.position.z -= center.z * scale;

      modelGroup.add(model);
      modelLoaded = true;
    },
    undefined,
    (err) => {
      console.error("Failed to load laptop.glb", err);
    }
  );

  modelGroup.rotation.x = -0.1;

  // ---------- Drag to rotate / idle spin ----------
  let isDragging = false;
  let prevX = 0, prevY = 0;
  let velocityY = 0.0025;
  let targetRotX = modelGroup.rotation.x;

  canvas.addEventListener("pointerdown", (e) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    modelGroup.rotation.y += dx * 0.008;
    targetRotX = THREE.MathUtils.clamp(targetRotX + dy * 0.006, -0.5, 0.4);
    velocityY = dx * 0.0006;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener("pointerup", () => { isDragging = false; });

  // ---------- Post pass: dither the rendered scene onto the visible canvas ----------
  const postScene = new THREE.Scene();
  const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  let renderTarget = new THREE.WebGLRenderTarget(1, 1);

  const postUniforms = {
    tDiffuse: { value: renderTarget.texture },
    resolution: { value: new THREE.Vector2(1, 1) },
    pixelSize: { value: 1 },
    time: { value: 0 },
    drift: { value: new THREE.Vector2(0, 0) },
    preserveColor: { value: 1 },
  };

  const postMaterial = new THREE.ShaderMaterial({
    uniforms: postUniforms,
    vertexShader: DitherShader.vertexShader,
    fragmentShader: DitherShader.fragmentShader,
  });

  const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
  postScene.add(postQuad);

  // ---------- Resize ----------
  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const pr = mainRenderer.getPixelRatio();

    mainRenderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    postUniforms.resolution.value.set(w * pr, h * pr);

    renderTarget.dispose();
    renderTarget = new THREE.WebGLRenderTarget(w * pr, h * pr);
    postUniforms.tDiffuse.value = renderTarget.texture;
  }
  window.addEventListener("resize", resize);
  resize();

  // ---------- Render loop ----------
  function animate(t) {
    requestAnimationFrame(animate);
    postUniforms.time.value = t * 0.001;

    if (!isDragging && modelLoaded) {
      modelGroup.rotation.y += velocityY;
      velocityY *= 0.98;
      velocityY += (0.0025 - velocityY) * 0.002;
    }
    modelGroup.rotation.x += (targetRotX - modelGroup.rotation.x) * 0.08;

    mainRenderer.setRenderTarget(renderTarget);
    mainRenderer.render(scene, camera);
    mainRenderer.setRenderTarget(null);

    mainRenderer.render(postScene, postCamera);
  }
  requestAnimationFrame(animate);
})();
