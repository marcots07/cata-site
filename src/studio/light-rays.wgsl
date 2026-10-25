struct RayParams {
  light_uv: vec2f,
  decay: f32,
  reach: f32,
}

@group(0) @binding(0) var<uniform> params: RayParams;
@group(0) @binding(1) var source: texture_2d<f32>;
@group(0) @binding(2) var linear_sampler: sampler;

const STEPS: i32 = 40;

fn hash12(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Light shafts: walk from each pixel toward the window and gather what glows
// along the way, so the panes, the bottle and the wine cast streaks of light.
@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let to_light = (params.light_uv - uv) * params.reach;
  let delta = to_light / f32(STEPS);
  var coord = uv + delta * hash12(uv * 1931.0);
  var weight = 1.0;
  var sum = vec3f(0.0);
  for (var i = 0; i < STEPS; i += 1) {
    let inside = step(0.0, coord.x) * step(coord.x, 1.0) * step(0.0, coord.y) * step(coord.y, 1.0);
    sum += textureSampleLevel(source, linear_sampler, clamp(coord, vec2f(0.0), vec2f(1.0)), 0.0).rgb * weight * inside;
    weight *= params.decay;
    coord += delta;
  }
  return vec4f(sum / f32(STEPS), 1.0);
}
