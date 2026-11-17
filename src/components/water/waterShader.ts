export const vertexShader = /* glsl */ `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

/**
 * Deep emerald pond surface.
 * - domain-warped fbm for slow-moving water body
 * - horizontally stretched light patches (reflected canopy / sky)
 * - thin caustic shimmer + ivory glints
 * - drifting pollen specks
 * - up to 4 soft pointer ripples
 */
export const fragmentShader = /* glsl */ `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uReveal;
uniform float uGlow;
uniform float uScroll;
uniform vec4 uRipples[4]; // x, y (aspect space), birth time, strength

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * snoise(p);
    p = p * 2.02 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return s;
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 p = (frag - 0.5 * uRes) / uRes.y;
  p.y -= uScroll * 0.00012;          // the pond drifts very slightly with scroll

  float t = uTime * 0.035;

  // ── pointer ripples
  vec2 disp = vec2(0.0);
  float ring = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 r = uRipples[i];
    float age = uTime - r.z;
    if (r.w > 0.0 && age > 0.0 && age < 6.0) {
      vec2 d = p - r.xy;
      float dist = length(d);
      float front = age * 0.16;
      float band = exp(-pow((dist - front) * 18.0, 2.0));
      float fade = exp(-age * 0.75) * r.w;
      float w = sin((dist - front) * 70.0) * band * fade;
      disp += (d / max(dist, 0.001)) * w * 0.012;
      ring += w * 0.5 + band * fade * 0.25;
    }
  }

  vec2 q = p + disp;

  // ── water body
  vec2 warp = vec2(fbm(q * 1.1 + vec2(t, -t * 0.6)), fbm(q * 1.1 + vec2(-t * 0.7, t) + 3.1));
  float body = fbm(q * 1.5 + warp * 1.25 + vec2(t * 0.4, -t * 0.25));

  vec3 deep    = vec3(0.027, 0.114, 0.090); // #071D17
  vec3 forest  = vec3(0.035, 0.184, 0.145); // #092F25
  vec3 emerald = vec3(0.063, 0.247, 0.196); // #103F32
  vec3 water   = vec3(0.090, 0.306, 0.239); // #174E3D
  vec3 botan   = vec3(0.278, 0.482, 0.314); // #477B50
  vec3 lime    = vec3(0.569, 0.776, 0.353); // #91C65A
  vec3 ivory   = vec3(0.953, 0.941, 0.890); // #F3F0E3

  float depthGrad = smoothstep(-0.9, 0.8, p.y + 0.18 * body);
  vec3 col = mix(deep, forest, smoothstep(-0.6, 0.4, body));
  col = mix(col, emerald, depthGrad * 0.75);
  col = mix(col, water, smoothstep(0.15, 0.75, body) * 0.45);

  // ── reflected light patches (canopy / sky), stretched along the surface
  float refl = fbm(vec2(q.x * 0.55, q.y * 1.9) + warp * 0.9 + vec2(-t * 0.5, t * 0.15));
  refl = smoothstep(0.08, 0.7, refl);
  col = mix(col, mix(water, botan, 0.55), refl * 0.42 * uReveal * uGlow);

  // ── caustic shimmer
  float c = 1.0 - abs(snoise(q * 6.0 + warp * 2.2 + vec2(t * 2.4, -t * 1.6)));
  c = pow(c, 18.0);
  col += lime * c * 0.07 * uReveal * (0.35 + refl);

  // ── ivory glints on the brightest ridges
  float g = snoise(q * 3.2 - warp * 1.4 + vec2(t * 1.8, t * 0.9));
  g = pow(max(g, 0.0), 10.0);
  col += ivory * g * 0.16 * uReveal * (0.4 + refl);

  // ripple highlights
  col += ivory * ring * 0.05;

  // ── pollen specks drifting on the surface
  vec2 sp = q * 9.0 + vec2(uTime * 0.05, uTime * 0.018);
  vec2 cell = floor(sp);
  vec2 f = fract(sp) - 0.5;
  float h = hash(cell);
  vec2 off = vec2(hash(cell + 7.1), hash(cell + 3.7)) - 0.5;
  float speck = smoothstep(0.035, 0.0, length(f - off * 0.7)) * step(0.86, h);
  col += mix(ivory, lime, h) * speck * 0.35 * uReveal;

  // ── vignette & cinematic reveal
  float vig = smoothstep(1.35, 0.15, length(p * vec2(0.85, 1.15)));
  col *= mix(0.5, 1.08, vig);
  col = mix(deep * 0.7, col, 0.2 + 0.8 * uReveal);

  // dither against banding
  col += (hash(frag + fract(uTime)) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`
