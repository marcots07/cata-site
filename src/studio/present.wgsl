struct PresentParams {
  resolution: vec2f,
  time: f32,
  exposure: f32,
  bloom_strength: f32,
  ray_strength: f32,
  grain: f32,
  vignette: f32,
}

@group(0) @binding(0) var<uniform> params: PresentParams;
@group(0) @binding(1) var scene_texture: texture_2d<f32>;
@group(0) @binding(2) var bloom_near: texture_2d<f32>;
@group(0) @binding(3) var bloom_far: texture_2d<f32>;
@group(0) @binding(4) var ray_texture: texture_2d<f32>;
@group(0) @binding(5) var linear_sampler: sampler;

// #1e2019, the app's ink, in linear light. Blacks settle here so the canvas
// melts into the page around it.
const INK: vec3f = vec3f(0.01298, 0.01444, 0.00972);

fn hash12(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

fn aces(x: vec3f) -> vec3f {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), vec3f(0.0), vec3f(1.0));
}

fn to_srgb(c: vec3f) -> vec3f {
  let lo = c * 12.92;
  let hi = 1.055 * pow(max(c, vec3f(0.0)), vec3f(1.0 / 2.4)) - 0.055;
  return select(hi, lo, c <= vec3f(0.0031308));
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let scene = textureSampleLevel(scene_texture, linear_sampler, uv, 0.0).rgb;
  let near = textureSampleLevel(bloom_near, linear_sampler, uv, 0.0).rgb;
  let far = textureSampleLevel(bloom_far, linear_sampler, uv, 0.0).rgb;
  let rays = textureSampleLevel(ray_texture, linear_sampler, uv, 0.0).rgb;

  let hdr = (scene + (near * 0.6 + far * 0.55) * params.bloom_strength + rays * params.ray_strength) * params.exposure;
  var color = aces(hdr);

  let centered = (uv - 0.5) * vec2f(1.0, 0.9);
  color *= 1.0 - smoothstep(0.18, 0.75, dot(centered, centered) * 1.6) * params.vignette;
  color = INK + (vec3f(1.0) - INK) * color;

  var encoded = to_srgb(color);
  let noise = hash12(uv * params.resolution + fract(params.time * 7.31) * 113.0) - 0.5;
  encoded += noise * params.grain;
  return vec4f(clamp(encoded, vec3f(0.0), vec3f(1.0)), 1.0);
}
