struct ExtractParams {
  texel: vec2f,
  threshold: f32,
  knee: f32,
}

@group(0) @binding(0) var<uniform> params: ExtractParams;
@group(0) @binding(1) var source: texture_2d<f32>;
@group(0) @binding(2) var linear_sampler: sampler;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let t = params.texel;
  let a = textureSampleLevel(source, linear_sampler, uv + vec2f(-t.x, -t.y), 0.0).rgb;
  let b = textureSampleLevel(source, linear_sampler, uv + vec2f(t.x, -t.y), 0.0).rgb;
  let c = textureSampleLevel(source, linear_sampler, uv + vec2f(-t.x, t.y), 0.0).rgb;
  let d = textureSampleLevel(source, linear_sampler, uv + vec2f(t.x, t.y), 0.0).rgb;
  let color = min((a + b + c + d) * 0.25, vec3f(40.0));
  let brightness = max(color.r, max(color.g, color.b));
  let soft = clamp(brightness - params.threshold + params.knee, 0.0, 2.0 * params.knee);
  let curve = soft * soft / (4.0 * params.knee + 0.0001);
  let contribution = max(curve, brightness - params.threshold) / max(brightness, 0.0001);
  return vec4f(color * contribution, 1.0);
}
