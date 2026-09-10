// Ordered (Bayer 4x4) dithering shader, shared by hero.js and laptop.js.
// Quantizes an input texture down to the site's palette using a threshold
// matrix, giving the pixelated / halftone look instead of smooth gradients.

const DitherShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float pixelSize;
    uniform float time;
    uniform vec2 drift;
    uniform float preserveColor;
    varying vec2 vUv;

    const mat4 bayer = mat4(
      0.0,  8.0,  2.0, 10.0,
      12.0, 4.0, 14.0,  6.0,
      3.0, 11.0,  1.0,  9.0,
      15.0, 7.0, 13.0,  5.0
    ) / 16.0;

    float bayerValue(vec2 fragCoord) {
      int x = int(mod(fragCoord.x, 4.0));
      int y = int(mod(fragCoord.y, 4.0));
      // Manual lookup since GLSL ES 1.0 can't index mat4 dynamically on some devices.
      if (y == 0) {
        if (x == 0) return bayer[0][0];
        if (x == 1) return bayer[0][1];
        if (x == 2) return bayer[0][2];
        return bayer[0][3];
      } else if (y == 1) {
        if (x == 0) return bayer[1][0];
        if (x == 1) return bayer[1][1];
        if (x == 2) return bayer[1][2];
        return bayer[1][3];
      } else if (y == 2) {
        if (x == 0) return bayer[2][0];
        if (x == 1) return bayer[2][1];
        if (x == 2) return bayer[2][2];
        return bayer[2][3];
      } else {
        if (x == 0) return bayer[3][0];
        if (x == 1) return bayer[3][1];
        if (x == 2) return bayer[3][2];
        return bayer[3][3];
      }
    }

    void main() {
      // Pixelate first for the chunky dither look.
      vec2 fragCoord = vUv * resolution;
      vec2 snapped = floor(fragCoord / pixelSize) * pixelSize;
      vec2 sampleUv = (snapped / resolution) + (drift * 0.05);

      vec3 color = texture2D(tDiffuse, clamp(sampleUv, 0.0, 1.0)).rgb;

      if (preserveColor > 0.5) {
        gl_FragColor = vec4(color, 1.0);
        return;
      }

      float lum = dot(color, vec3(0.299, 0.587, 0.114));

      // 5-stop palette ramp: void -> deep violet -> accent -> lavender -> white,
      // with a pink bias mixed in for highlights.
      vec3 palette[5];
      palette[0] = vec3(0.043, 0.027, 0.078);  // --bg-void
      palette[1] = vec3(0.196, 0.114, 0.478);  // deep violet
      palette[2] = vec3(0.545, 0.361, 0.965);  // --accent
      palette[3] = vec3(0.769, 0.710, 0.992);  // --accent-soft
      palette[4] = vec3(0.961, 0.953, 1.0);    // --text-primary (near white)

      float scaled = lum * 4.0;
      float i0 = floor(scaled);
      float frac = scaled - i0;
      float threshold = bayerValue(fragCoord);

      int idx = int(i0) + (frac > threshold ? 1 : 0);
      idx = idx < 0 ? 0 : (idx > 4 ? 4 : idx);

      vec3 result = palette[0];
      if (idx == 0) result = palette[0];
      else if (idx == 1) result = palette[1];
      else if (idx == 2) result = palette[2];
      else if (idx == 3) result = palette[3];
      else result = palette[4];

      // Slight pink bias on the brighter dots for warmth.
      result = mix(result, vec3(0.941, 0.671, 0.988), smoothstep(0.7, 1.0, lum) * 0.25);

      gl_FragColor = vec4(result, 1.0);
    }
  `,
};
