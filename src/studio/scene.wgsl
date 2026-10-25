struct SceneParams {
  resolution: vec2f,
  time: f32,
  focal: f32,
  eye: vec4f,
  forward: vec4f,
  right: vec4f,
  up: vec4f,
  shift: vec4f,
  window_center: vec4f,
  window_size: vec4f,
  sun: vec4f,
}

@group(0) @binding(0) var<uniform> params: SceneParams;

const NO_HIT: f32 = 1.0e9;
const WALL_Z: f32 = -4.6;
const LIGHT_TINT: vec3f = vec3f(1.0, 0.86, 0.68);
const BACK_LOW: vec3f = vec3f(0.0038, 0.0041, 0.0031);
const BACK_HIGH: vec3f = vec3f(0.0085, 0.0091, 0.0068);
const TABLE_ALBEDO: vec3f = vec3f(0.085, 0.066, 0.05);

const BOTTLE_BASE: vec3f = vec3f(-0.5, 0.0, -0.42);
const BOTTLE_RADIUS: f32 = 0.36;
const BOTTLE_TOP: f32 = 2.99;
const BOTTLE_FILL: f32 = 1.9;
const CAPSULE_START: f32 = 2.5;
const BOTTLE_WALL: vec3f = vec3f(0.44, 0.6, 0.32);

const GLASS_BASE: vec3f = vec3f(0.76, 0.0, 0.52);
const BOWL_Y: f32 = 1.3;
const BOWL_RADII: vec3f = vec3f(0.42, 0.5, 0.42);
const RIM_Y: f32 = 1.64;
const RIM_RADIUS: f32 = 0.3079;
const GLASS_FILL: f32 = 1.24;
const WINE_SURFACE_RADIUS: f32 = 0.417;
const STEM_RADIUS: f32 = 0.026;
const STEM_TOP: f32 = 0.86;
const FOOT_RADIUS: f32 = 0.33;
const FOOT_HEIGHT: f32 = 0.02;

const WINE_SIGMA: vec3f = vec3f(2.2, 13.0, 11.0);
const IOR_WINE: f32 = 1.34;
const LEAF_TINT: vec3f = vec3f(0.045, 0.06, 0.025);
const DUST_DENSITY: f32 = 0.055;

fn hash12(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

fn hash22(p: vec2f) -> vec2f {
  var p3 = fract(vec3f(p.x, p.y, p.x) * vec3f(0.1031, 0.103, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

fn value_noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash12(i);
  let b = hash12(i + vec2f(1.0, 0.0));
  let c = hash12(i + vec2f(0.0, 1.0));
  let d = hash12(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Interleaved gradient noise: a well-spread per-pixel offset for the beam samples.
fn ign(p: vec2f) -> f32 {
  return fract(52.9829189 * fract(dot(p, vec2f(0.06711056, 0.00583715))));
}

fn fresnel(cos_theta: f32, f0: f32) -> f32 {
  return f0 + (1.0 - f0) * pow(clamp(1.0 - cos_theta, 0.0, 1.0), 5.0);
}

fn sd_box2(p: vec2f, b: vec2f) -> f32 {
  let d = abs(p) - b;
  return length(max(d, vec2f(0.0))) + min(max(d.x, d.y), 0.0);
}

fn smin(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

fn soft_rect(p: vec2f, half_size: vec2f, corner: f32, softness: f32) -> f32 {
  let d = sd_box2(p, half_size - vec2f(corner)) - corner;
  return 1.0 - smoothstep(-softness, softness, d);
}

fn window_bars(p: vec2f, half_size: vec2f, width: f32) -> f32 {
  let vertical = 1.0 - smoothstep(0.0, width, abs(p.x));
  let horizontal = 1.0 - smoothstep(0.0, width, abs(p.y - half_size.y * 0.3));
  return max(vertical, horizontal);
}

// Ray against a vertical capped cylinder. Returns (near, far) or (NO_HIT, -NO_HIT).
fn hit_cylinder(ro: vec3f, rd: vec3f, base: vec3f, radius: f32, y0: f32, y1: f32) -> vec2f {
  let o = ro - base;
  let a = dot(rd.xz, rd.xz);
  let b = dot(o.xz, rd.xz);
  let c = dot(o.xz, o.xz) - radius * radius;
  var t0 = -NO_HIT;
  var t1 = NO_HIT;
  if (a > 1.0e-7) {
    let h = b * b - a * c;
    if (h < 0.0) { return vec2f(NO_HIT, -NO_HIT); }
    let s = sqrt(h);
    t0 = (-b - s) / a;
    t1 = (-b + s) / a;
  } else if (c > 0.0) {
    return vec2f(NO_HIT, -NO_HIT);
  }
  if (abs(rd.y) > 1.0e-7) {
    let ta = (y0 - o.y) / rd.y;
    let tb = (y1 - o.y) / rd.y;
    t0 = max(t0, min(ta, tb));
    t1 = min(t1, max(ta, tb));
  } else if (o.y < y0 || o.y > y1) {
    return vec2f(NO_HIT, -NO_HIT);
  }
  if (t1 < max(t0, 0.0)) { return vec2f(NO_HIT, -NO_HIT); }
  return vec2f(t0, t1);
}

fn hit_ellipsoid(ro: vec3f, rd: vec3f, center: vec3f, radii: vec3f) -> vec2f {
  let o = (ro - center) / radii;
  let d = rd / radii;
  let a = dot(d, d);
  let b = dot(o, d);
  let c = dot(o, o) - 1.0;
  let h = b * b - a * c;
  if (h < 0.0) { return vec2f(NO_HIT, -NO_HIT); }
  let s = sqrt(h);
  return vec2f((-b - s) / a, (-b + s) / a);
}

fn ellipsoid_normal(p: vec3f, center: vec3f, radii: vec3f) -> vec3f {
  return normalize((p - center) / (radii * radii));
}

fn bowl_center() -> vec3f {
  return vec3f(GLASS_BASE.x, BOWL_Y, GLASS_BASE.z);
}

// Horizontal distance between a ray and a vertical axis, plus the ray parameter where it is closest.
fn axis_approach(p: vec3f, l: vec3f, axis: vec3f) -> vec2f {
  let o = p.xz - axis.xz;
  let d = l.xz;
  let s = -dot(o, d) / max(dot(d, d), 1.0e-6);
  return vec2f(length(o + d * s), s);
}

// ---------------------------------------------------------------------------
// Bottle: a Bordeaux profile revolved around its axis.

fn bottle_profile(q: vec2f) -> f32 {
  let body = sd_box2(q - vec2f(0.0, 0.875), vec2f(0.31, 0.825)) - 0.05;
  let shoulder = (length((q - vec2f(0.0, 1.72)) / vec2f(0.36, 0.56)) - 1.0) * 0.36;
  let neck = sd_box2(q - vec2f(0.0, 2.6), vec2f(0.112, 0.38)) - 0.008;
  let lip = sd_box2(q - vec2f(0.0, 2.925), vec2f(0.118, 0.045)) - 0.016;
  return min(smin(min(body, shoulder), neck, 0.13), lip);
}

fn bottle_sdf(p: vec3f) -> f32 {
  let local = p - BOTTLE_BASE;
  return bottle_profile(vec2f(length(local.xz), local.y));
}

fn bottle_normal(p: vec3f) -> vec3f {
  let e = vec2f(0.0012, -0.0012);
  return normalize(
    e.xyy * bottle_sdf(p + e.xyy) +
    e.yyx * bottle_sdf(p + e.yyx) +
    e.yxy * bottle_sdf(p + e.yxy) +
    e.xxx * bottle_sdf(p + e.xxx)
  );
}

fn march_bottle(ro: vec3f, rd: vec3f) -> f32 {
  let span = hit_cylinder(ro, rd, BOTTLE_BASE, BOTTLE_RADIUS + 0.015, -0.01, BOTTLE_TOP + 0.01);
  if (span.x > span.y) { return NO_HIT; }
  var t = max(span.x, 0.0);
  for (var i = 0; i < 80; i += 1) {
    let d = bottle_sdf(ro + rd * t);
    if (d < 0.0007) { return t; }
    t += d * 0.85;
    if (t > span.y) { break; }
  }
  return NO_HIT;
}

fn march_bottle_inside(ro: vec3f, rd: vec3f) -> f32 {
  var t = 0.0;
  for (var i = 0; i < 48; i += 1) {
    let d = -bottle_sdf(ro + rd * t);
    if (d < 0.0008) { return t; }
    t += max(d * 0.9, 0.002);
    if (t > 3.2) { break; }
  }
  return t;
}

fn length_below(p0: vec3f, p1: vec3f, level: f32) -> f32 {
  let full = distance(p0, p1);
  if (p0.y <= level && p1.y <= level) { return full; }
  if (p0.y > level && p1.y > level) { return 0.0; }
  let f = (level - p0.y) / (p1.y - p0.y);
  return select(full * (1.0 - f), full * f, p0.y <= level);
}

// ---------------------------------------------------------------------------
// Light: a tall paned window in the back wall with a tree outside. The camera
// sees it; objects reflect it; the sun that comes through it lights the table.

// Leaves swaying outside the window, in window-plane coordinates.
// 1 = open sky, 0 = leaf. The canopy thickens toward the top of the window.
fn foliage(q: vec2f, octaves: i32, softness: f32) -> f32 {
  let t = params.time;
  let sway = vec2f(sin(t * 0.37) + 0.6 * sin(t * 0.83 + 1.3), 0.5 * cos(t * 0.29)) * 0.04;
  var p = (q + sway) * vec2f(2.6, 3.1) + vec2f(3.1, 7.7);
  var n = 0.0;
  var amp = 0.5;
  var norm = 0.0;
  for (var i = 0; i < octaves; i += 1) {
    n += value_noise(p) * amp;
    norm += amp;
    p = p * 2.07 + vec2f(5.2, 1.3) + sway * f32(i + 1) * 3.0;
    amp *= 0.5;
  }
  n /= norm;
  let threshold = mix(0.67, 0.45, smoothstep(-1.1, 1.0, q.y / params.window_size.y));
  return 1.0 - smoothstep(threshold - softness, threshold + softness, n);
}

// How much of the window is open at q: the frame, the mullions and the leaves.
fn window_opening(q: vec2f, soft: f32, octaves: i32, leaf_softness: f32) -> f32 {
  let size = params.window_size.xy;
  var open = soft_rect(q, size, 0.1, soft);
  if (open < 0.001) { return 0.0; }
  open *= 1.0 - 0.92 * window_bars(q, size, 0.03 + soft * 0.7);
  return open * mix(0.12, 1.0, foliage(q, octaves, leaf_softness));
}

fn window_light(ro: vec3f, rd: vec3f, blur: f32) -> vec3f {
  if (rd.z > -0.0001) { return vec3f(0.0); }
  let t = (WALL_Z - ro.z) / rd.z;
  if (t <= 0.0) { return vec3f(0.0); }
  let p = (ro + rd * t).xy - params.window_center.xy;
  let size = params.window_size.xy;
  let soft = params.window_size.z + blur;
  var panel = soft_rect(p, size, 0.1, soft);
  var sky = vec3f(1.0);
  if (panel > 0.001) {
    panel *= 1.0 - 0.94 * window_bars(p, size, 0.035 + soft * 0.6);
    sky = mix(LEAF_TINT, vec3f(1.0), foliage(p, 3, 0.11 + blur * 0.5));
  }
  let q = p / size;
  let core = 0.72 + 0.4 * exp(-dot(q, q) * 1.4) + 0.12 * q.y;
  let outside = max(sd_box2(p, size), 0.0);
  let halo = params.window_size.w * (exp(-outside * 1.6) + 0.15 * exp(-outside * 0.45));
  return LIGHT_TINT * params.window_center.w * (panel * core * sky + halo);
}

fn backdrop(ro: vec3f, rd: vec3f, blur: f32) -> vec3f {
  let h = clamp(rd.y * 0.5 + 0.5, 0.0, 1.0);
  return mix(BACK_LOW, BACK_HIGH, smoothstep(0.4, 0.8, h)) + window_light(ro, rd, blur);
}

fn sun_gobo(p: vec3f, octaves: i32) -> f32 {
  let l = params.sun.xyz;
  if (l.z > -0.0001) { return 0.0; }
  let s = (WALL_Z - p.z) / l.z;
  if (s <= 0.0) { return 0.0; }
  let q = (p + l * s).xy - params.window_center.xy;
  let soft = 0.05 + s * 0.035;
  if (octaves == 0) {
    let size = params.window_size.xy;
    return soft_rect(q, size, 0.1, soft) * (1.0 - 0.92 * window_bars(q, size, 0.03 + soft * 0.7));
  }
  return window_opening(q, soft, octaves, 0.03 + s * 0.012);
}

// One slab of the beam: the t range where a + b t stays within [-h, h].
fn slab(a: f32, b: f32, h: f32, range: vec2f) -> vec2f {
  if (abs(b) < 1.0e-6) {
    return select(vec2f(1.0, 0.0), range, abs(a) <= h);
  }
  let ta = (-h - a) / b;
  let tb = (h - a) / b;
  return vec2f(max(range.x, min(ta, tb)), min(range.y, max(ta, tb)));
}

// Sunlight scattered by dust in the beam between the window and the table.
// The beam is the window extruded along the sun, so the stretch of the view
// ray inside it is found exactly; a few samples then pick up the mullions,
// the leaves, and the shadows and red light thrown by the bottle and glass.
fn sunbeam(ro: vec3f, rd: vec3f, t_max: f32, jitter: f32) -> vec3f {
  let l = params.sun.xyz;
  if (l.z > -0.0001) { return vec3f(0.0); }
  let s0 = (WALL_Z - ro.z) / l.z;
  let ds = -rd.z / l.z;
  let a = ro.xy + l.xy * s0 - params.window_center.xy;
  let b = rd.xy + l.xy * ds;
  let size = params.window_size.xy;

  var range = vec2f(0.0, t_max);
  if (rd.z < -1.0e-5) { range.y = min(range.y, (WALL_Z - ro.z) / rd.z); }
  if (rd.y < -1.0e-5) { range.y = min(range.y, -ro.y / rd.y); }
  range = slab(a.x, b.x, size.x + 0.15, range);
  range = slab(a.y, b.y, size.y + 0.15, range);
  if (range.y <= range.x) { return vec3f(0.0); }

  let steps = 8;
  let dt = (range.y - range.x) / f32(steps);
  var sum = vec3f(0.0);
  for (var i = 0; i < steps; i += 1) {
    let t = range.x + (f32(i) + jitter) * dt;
    let s = s0 + ds * t;
    let soft = 0.05 + max(s, 0.0) * 0.035;
    let lit = window_opening(a + b * t, soft, 2, 0.1);
    if (lit > 0.002) {
      sum += light_transport(ro + rd * t, l) * lit;
    }
  }
  let phase = 0.3 + 2.2 * pow(max(dot(rd, l), 0.0), 8.0);
  return LIGHT_TINT * sum * dt * DUST_DENSITY * params.sun.w * phase;
}

// Motes drifting through the beam, on a few depth layers facing the camera.
fn dust_motes(ro: vec3f, rd: vec3f, t_max: f32) -> vec3f {
  var c = vec3f(0.0);
  let along = dot(rd, params.forward.xyz);
  if (along < 0.1) { return c; }
  let time = params.time;
  for (var i = 0; i < 3; i += 1) {
    let layer = f32(i);
    let t = (4.4 + layer * 1.35) / along;
    if (t > t_max) { continue; }
    let p = ro + rd * t;
    let rel = p - ro;
    var uv = vec2f(dot(rel, params.right.xyz), dot(rel, params.up.xyz));
    uv += vec2f(sin(time * 0.09 + layer * 2.1) * 0.15, time * (0.022 + layer * 0.006));
    let cell_size = 0.19;
    let g = uv / cell_size;
    let cell = floor(g);
    let h = hash22(cell + layer * 17.0);
    if (h.x > 0.28) { continue; }
    let wobble = vec2f(sin(time * 0.6 + h.y * 31.0), cos(time * 0.5 + h.x * 43.0)) * 0.09;
    let center = cell + 0.25 + 0.5 * hash22(cell + 3.7 + layer * 5.0) + wobble;
    let d = length(g - center) * cell_size;
    let radius = 0.012 - layer * 0.0022;
    let lit = sun_gobo(p, 0);
    if (lit < 0.01) { continue; }
    let twinkle = 0.55 + 0.45 * sin(time * 1.1 + h.y * 57.0);
    c += LIGHT_TINT * exp(-d * d / (radius * radius)) * lit * twinkle * params.sun.w * 0.22;
  }
  return c;
}

// How much sunlight survives on its way from p toward the window, through
// the bottle and the glass of wine. Values above 1 are caustic focusing.
fn light_transport(p: vec3f, l: vec3f) -> vec3f {
  var t = vec3f(1.0);

  let body = hit_cylinder(p, l, BOTTLE_BASE, BOTTLE_RADIUS, 0.0, 2.08);
  if (body.y > max(body.x, 0.0)) {
    let s0 = max(body.x, 0.0);
    let chord = body.y - s0;
    let u = clamp(axis_approach(p, l, BOTTLE_BASE).x / BOTTLE_RADIUS, 0.0, 1.0);
    let mid_y = p.y + l.y * (s0 + body.y) * 0.5;
    let wine = 1.0 - smoothstep(BOTTLE_FILL - 0.06, BOTTLE_FILL + 0.06, mid_y);
    let focus = mix(0.75, 0.14 + 2.6 * exp(-u * u * 16.0), wine);
    let rim_loss = 1.0 - 0.9 * smoothstep(0.72, 1.0, u);
    t *= BOTTLE_WALL * BOTTLE_WALL * exp(-WINE_SIGMA * chord * wine) * focus * rim_loss;
  }

  let neck = hit_cylinder(p, l, BOTTLE_BASE, 0.13, 2.08, BOTTLE_TOP);
  if (neck.y > max(neck.x, 0.0)) {
    let y_mid = p.y + l.y * (max(neck.x, 0.0) + neck.y) * 0.5;
    let foil = smoothstep(CAPSULE_START - 0.03, CAPSULE_START + 0.03, y_mid);
    t *= mix(BOTTLE_WALL * BOTTLE_WALL * 0.7, vec3f(0.0), foil);
  }

  let center = bowl_center();
  let bowl = hit_ellipsoid(p, l, center, BOWL_RADII);
  if (bowl.y > max(bowl.x, 0.0)) {
    let s0 = max(bowl.x, 0.0);
    var s_fill = bowl.y;
    if (l.y > 0.0001) { s_fill = min(bowl.y, (GLASS_FILL - p.y) / l.y); }
    let chord = max(s_fill - s0, 0.0);
    if (chord > 0.0) {
      let rel = center - p;
      let closest = length(rel - l * dot(rel, l)) / BOWL_RADII.x;
      let focus = 0.12 + 3.6 * exp(-closest * closest * 8.0);
      t *= exp(-WINE_SIGMA * chord) * focus;
    } else {
      let rel = center - p;
      let closest = length(rel - l * dot(rel, l)) / BOWL_RADII.x;
      t *= 0.84 + 0.5 * smoothstep(0.82, 0.97, closest) * (1.0 - smoothstep(0.97, 1.0, closest));
    }
  }

  let stem = axis_approach(p, l, GLASS_BASE);
  let stem_y = p.y + l.y * stem.y;
  if (stem.y > 0.0 && stem_y > FOOT_HEIGHT && stem_y < STEM_TOP) {
    t *= mix(0.4, 1.0, smoothstep(STEM_RADIUS * 0.5, STEM_RADIUS * 2.6, stem.x));
  }
  return t;
}

fn contact_shadow(p: vec3f) -> f32 {
  let bottle_gap = length(p.xz - BOTTLE_BASE.xz) - BOTTLE_RADIUS;
  let foot_gap = length(p.xz - GLASS_BASE.xz) - FOOT_RADIUS;
  let bottle_ao = mix(0.25, 1.0, smoothstep(0.0, 0.45, bottle_gap));
  let foot_ao = mix(0.55, 1.0, smoothstep(0.0, 0.2, foot_gap));
  return bottle_ao * foot_ao;
}

fn table_reflection(p: vec3f, rd: vec3f) -> vec3f {
  var c = backdrop(p, rd, 0.45);

  let center = bowl_center();
  let bowl = hit_ellipsoid(p, rd, center, BOWL_RADII);
  if (bowl.y > max(bowl.x, 0.0)) {
    let s0 = max(bowl.x, 0.0);
    let y0 = p.y + rd.y * s0;
    if (y0 < GLASS_FILL) {
      var s1 = bowl.y;
      if (rd.y > 0.0001) { s1 = min(bowl.y, (GLASS_FILL - p.y) / rd.y); }
      let chord = max(s1 - s0, 0.0);
      let behind = backdrop(p + rd * bowl.y, rd, 0.7);
      c = behind * exp(-WINE_SIGMA * chord) * 1.4 + vec3f(0.003, 0.0005, 0.0005);
    } else if (y0 < RIM_Y) {
      c *= 0.85;
    }
  }

  let body = hit_cylinder(p, rd, BOTTLE_BASE, BOTTLE_RADIUS, 0.0, 2.08);
  if (body.y > max(body.x, 0.0)) {
    let s0 = max(body.x, 0.0);
    let chord = body.y - s0;
    let u = clamp(axis_approach(p, rd, BOTTLE_BASE).x / BOTTLE_RADIUS, 0.0, 1.0);
    let mid_y = p.y + rd.y * (s0 + body.y) * 0.5;
    let wine = 1.0 - smoothstep(BOTTLE_FILL - 0.06, BOTTLE_FILL + 0.06, mid_y);
    let behind = backdrop(p + rd * body.y, rd, 0.7);
    c = behind * BOTTLE_WALL * BOTTLE_WALL * exp(-WINE_SIGMA * chord * wine) * (0.4 + 1.2 * exp(-u * u * 5.0)) * (1.0 - 0.8 * smoothstep(0.8, 1.0, u));
  }
  let neck = hit_cylinder(p, rd, BOTTLE_BASE, 0.13, 2.08, BOTTLE_TOP);
  if (neck.y > max(neck.x, 0.0)) {
    c = vec3f(0.004, 0.002, 0.002);
  }
  return c;
}

fn wood_grain(p: vec3f) -> f32 {
  let warp = value_noise(p.xz * vec2f(0.7, 2.4)) * 2.6;
  let fine = value_noise(vec2f(p.x * 1.1, p.z * 24.0 + warp));
  let broad = value_noise(vec2f(p.x * 0.35, p.z * 5.0 + warp * 0.5));
  return 0.72 + 0.36 * fine + 0.22 * broad;
}

fn shade_table(p: vec3f, rd: vec3f) -> vec3f {
  let l = params.sun.xyz;
  let gobo = sun_gobo(p, 3);
  var direct = vec3f(0.0);
  if (gobo > 0.001) {
    direct = light_transport(p, l) * (gobo * params.sun.w * max(l.y, 0.0));
  }
  let to_window = vec3f(params.window_center.x, params.window_center.y * 0.6, WALL_Z) - p;
  let wd = length(to_window);
  let bounce = params.window_center.w * 0.018 * max(to_window.y / wd, 0.0) / (1.0 + wd * wd * 0.1);
  let ao = contact_shadow(p);
  let albedo = TABLE_ALBEDO * wood_grain(p);
  var color = albedo * (direct * mix(0.6, 1.0, ao) + LIGHT_TINT * bounce * ao + vec3f(0.0025));

  let refl = reflect(rd, vec3f(0.0, 1.0, 0.0));
  let f = fresnel(max(-rd.y, 0.0), 0.03);
  color += table_reflection(p, refl) * f * 0.8 * ao;
  return color;
}

// Environment seen in reflections on the glass: the window, the lit table,
// and two tall strip softboxes behind the set that draw the edge highlights.
fn studio(ro: vec3f, rd: vec3f) -> vec3f {
  var c = backdrop(ro, rd, 0.0);
  if (rd.y < -0.0001) {
    let t = -ro.y / rd.y;
    let p = ro + rd * t;
    if (p.z > WALL_Z) {
      c = TABLE_ALBEDO * (sun_gobo(p, 0) * params.sun.w * max(params.sun.y, 0.0) + 0.012);
    }
  }
  let az = atan2(rd.x, rd.z);
  let tall = smoothstep(-0.45, -0.15, rd.y) * (1.0 - smoothstep(0.55, 0.85, rd.y));
  let left = 1.0 - smoothstep(0.04, 0.085, abs(az + 2.2));
  let right = 1.0 - smoothstep(0.03, 0.07, abs(az - 2.3));
  c += vec3f(1.0, 0.94, 0.86) * (left * 6.0 + right * 3.4) * tall;
  c += LIGHT_TINT * pow(max(rd.y, 0.0), 5.0) * 0.5;
  return c;
}

fn scene_behind_bottle(ro: vec3f, rd: vec3f) -> vec3f {
  if (rd.y < -0.0001) {
    let t = -ro.y / rd.y;
    let p = ro + rd * t;
    if (p.z > WALL_Z) { return shade_table(p, rd); }
  }
  return backdrop(ro, rd, 0.0);
}

fn shade_bottle(ro: vec3f, rd: vec3f, t_hit: f32) -> vec3f {
  let p = ro + rd * t_hit;
  let n = bottle_normal(p);
  let cos_i = clamp(dot(-rd, n), 0.0, 1.0);
  let refl = studio(p, reflect(rd, n));
  let sun_half = normalize(params.sun.xyz - rd);
  let glint = pow(clamp(dot(n, sun_half), 0.0, 1.0), 700.0) * params.sun.w * 3.0;

  if (p.y > CAPSULE_START) {
    let foil = vec3f(0.3, 0.032, 0.04);
    let f = fresnel(cos_i, 0.2);
    let band = smoothstep(CAPSULE_START, CAPSULE_START + 0.015, p.y) * (1.0 - smoothstep(CAPSULE_START + 0.035, CAPSULE_START + 0.05, p.y));
    let sheen = refl * mix(foil * 1.8, vec3f(0.85), f);
    return foil * 0.03 + sheen + LIGHT_TINT * glint * 0.5 + vec3f(0.5, 0.42, 0.3) * band * 0.08;
  }

  let f = fresnel(cos_i, 0.045);
  var dir = rd;
  if (p.y < BOTTLE_FILL) {
    dir = refract(rd, n, 1.0 / IOR_WINE);
  }
  let start = p + dir * 0.003;
  let exit_t = march_bottle_inside(start, dir);
  let q = start + dir * exit_t;
  let n_out = bottle_normal(q);
  let cos_o = clamp(dot(dir, n_out), 0.08, 1.0);
  var out_dir = dir;
  if (q.y < BOTTLE_FILL) {
    let bent = refract(dir, -n_out, IOR_WINE);
    out_dir = select(reflect(dir, -n_out), bent, dot(bent, bent) > 0.0);
  }
  let wine_len = length_below(start, q, BOTTLE_FILL);
  let walls = pow(BOTTLE_WALL, vec3f(0.5 / max(cos_i, 0.12) + 0.5 / cos_o));
  let absorb = exp(-WINE_SIGMA * wine_len);
  let behind = scene_behind_bottle(q + out_dir * 0.004, out_dir);
  let transmitted = behind * walls * absorb;
  return mix(transmitted, refl, f) + LIGHT_TINT * glint;
}

fn scene_behind_glass(ro: vec3f, rd: vec3f) -> vec3f {
  let t_bottle = march_bottle(ro, rd);
  var t_table = NO_HIT;
  if (rd.y < -0.0001) {
    let t = -ro.y / rd.y;
    if ((ro + rd * t).z > WALL_Z) { t_table = t; }
  }
  if (t_bottle < t_table) { return shade_bottle(ro, rd, t_bottle); }
  if (t_table < NO_HIT) { return shade_table(ro + rd * t_table, rd); }
  return backdrop(ro, rd, 0.0);
}

// ---------------------------------------------------------------------------
// Wine glass: a thin bowl, the wine inside it, a stem and a foot.

fn bowl_entry(ro: vec3f, rd: vec3f, span: vec2f) -> f32 {
  if (span.x > span.y) { return NO_HIT; }
  if (span.x > 0.0 && ro.y + rd.y * span.x < RIM_Y) { return span.x; }
  if (span.y > 0.0 && ro.y + rd.y * span.y < RIM_Y) { return span.y; }
  return NO_HIT;
}

fn shade_wine_glass(ro: vec3f, rd: vec3f, span: vec2f) -> vec3f {
  let center = bowl_center();
  var color = vec3f(0.0);
  var throughput = vec3f(1.0);
  let p0 = ro + rd * span.x;
  let p1 = ro + rd * span.y;
  let front_wall = span.x > 0.0 && p0.y < RIM_Y;

  if (front_wall) {
    let n0 = ellipsoid_normal(p0, center, BOWL_RADII);
    let c0 = clamp(dot(-rd, n0), 0.0, 1.0);
    let f0 = min(fresnel(c0, 0.04) * 1.7, 1.0);
    color += throughput * f0 * studio(p0, reflect(rd, n0));
    throughput *= (1.0 - f0) * 0.985;
  }

  var entered = false;
  var wp = vec3f(0.0);
  var wn = vec3f(0.0, 1.0, 0.0);
  if (front_wall && p0.y < GLASS_FILL) {
    entered = true;
    wp = p0;
    wn = ellipsoid_normal(p0, center, BOWL_RADII);
  } else if (rd.y < -0.0001) {
    let ts = (GLASS_FILL - ro.y) / rd.y;
    if (ts > max(span.x, 0.0) && ts < span.y) {
      entered = true;
      wp = ro + rd * ts;
      let fs = fresnel(clamp(-rd.y, 0.0, 1.0), 0.02);
      color += throughput * fs * studio(wp, reflect(rd, wn));
      throughput *= 1.0 - fs;
      let edge = length(wp.xz - center.xz) / WINE_SURFACE_RADIUS;
      color += throughput * LIGHT_TINT * smoothstep(0.93, 0.995, edge) * 0.6;
    }
  }

  if (entered) {
    let dir = refract(rd, wn, 1.0 / IOR_WINE);
    let inner = hit_ellipsoid(wp, dir, center, BOWL_RADII * 0.996);
    var exit_t = max(inner.y, 0.0);
    var through_top = false;
    if (dir.y > 0.0001) {
      let tp = (GLASS_FILL - wp.y) / dir.y;
      if (tp > 0.0005 && tp < exit_t) {
        exit_t = tp;
        through_top = true;
      }
    }
    let q = wp + dir * exit_t;
    var out_dir = dir;
    if (through_top) {
      let bent = refract(dir, vec3f(0.0, -1.0, 0.0), IOR_WINE);
      out_dir = select(reflect(dir, vec3f(0.0, -1.0, 0.0)), bent, dot(bent, bent) > 0.0);
    } else {
      let nq = ellipsoid_normal(q, center, BOWL_RADII);
      let bent = refract(dir, -nq, IOR_WINE);
      out_dir = select(reflect(dir, -nq), bent, dot(bent, bent) > 0.0);
    }
    let absorb = exp(-WINE_SIGMA * exit_t);
    let behind = scene_behind_glass(q + out_dir * 0.004, out_dir);
    let inner_glow = vec3f(0.35, 0.02, 0.025) * params.window_center.w * 0.012 * exp(-exit_t * 1.5);
    color += throughput * (absorb * behind + inner_glow);
    return color;
  }

  if (p1.y < RIM_Y) {
    let n1 = ellipsoid_normal(p1, center, BOWL_RADII);
    let c1 = clamp(abs(dot(rd, n1)), 0.0, 1.0);
    let f1 = min(fresnel(c1, 0.04) * 1.7, 1.0);
    color += throughput * f1 * studio(p1, reflect(rd, -n1));
    throughput *= (1.0 - f1) * 0.985;
  }
  color += throughput * scene_behind_glass(p1 + rd * 0.004, rd);
  return color;
}

fn scene_simple(ro: vec3f, rd: vec3f) -> vec3f {
  if (rd.y < -0.0001) {
    let t = -ro.y / rd.y;
    let p = ro + rd * t;
    if (p.z > WALL_Z) { return shade_table(p, rd); }
  }
  return backdrop(ro, rd, 0.0);
}

fn shade_glass_rod(ro: vec3f, rd: vec3f, t_hit: f32, is_foot: bool) -> vec3f {
  let p = ro + rd * t_hit;
  var n = normalize(vec3f(p.x - GLASS_BASE.x, 0.0, p.z - GLASS_BASE.z));
  if (is_foot && p.y > FOOT_HEIGHT - 0.003) { n = vec3f(0.0, 1.0, 0.0); }
  let c = clamp(dot(-rd, n), 0.0, 1.0);
  let f = fresnel(c, 0.05);
  let refl = studio(p, reflect(rd, n));
  let bent = normalize(rd - n * select(0.55, 0.12, is_foot));
  let behind = scene_simple(p + rd * 0.06, bent) * vec3f(0.86, 0.9, 0.88);
  return mix(behind, refl, f);
}

fn rim_highlight(ro: vec3f, rd: vec3f, limit: f32) -> vec3f {
  if (abs(rd.y) < 1.0e-5) { return vec3f(0.0); }
  let t = (RIM_Y - ro.y) / rd.y;
  if (t <= 0.0 || t > limit) { return vec3f(0.0); }
  let p = ro + rd * t;
  let r = length(p.xz - GLASS_BASE.xz);
  let ring = 1.0 - smoothstep(0.0, 0.011, abs(r - RIM_RADIUS));
  let side = normalize(vec3f(p.x - GLASS_BASE.x, 0.0, p.z - GLASS_BASE.z));
  let lit = 0.35 + 0.65 * pow(clamp(dot(side, normalize(vec3f(params.sun.x, 0.0, params.sun.z))) * 0.5 + 0.5, 0.0, 1.0), 2.0);
  return LIGHT_TINT * ring * lit * 1.8;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.resolution.x / max(params.resolution.y, 1.0);
  let ndc = (uv - 0.5) * 2.0;
  let screen = vec2f(ndc.x * aspect, -ndc.y) - params.shift.xy;
  let ro = params.eye.xyz;
  let rd = normalize(params.forward.xyz * params.focal + params.right.xyz * screen.x + params.up.xyz * screen.y);

  let t_bottle = march_bottle(ro, rd);
  let bowl = hit_ellipsoid(ro, rd, bowl_center(), BOWL_RADII);
  let t_bowl = bowl_entry(ro, rd, bowl);
  let stem = hit_cylinder(ro, rd, GLASS_BASE, STEM_RADIUS, FOOT_HEIGHT, STEM_TOP);
  let foot = hit_cylinder(ro, rd, GLASS_BASE, FOOT_RADIUS, 0.0, FOOT_HEIGHT);
  let t_stem = select(NO_HIT, stem.x, stem.x <= stem.y && stem.x > 0.0);
  let t_foot = select(NO_HIT, foot.x, foot.x <= foot.y && foot.x > 0.0);
  var t_table = NO_HIT;
  if (rd.y < -0.0001) {
    let t = -ro.y / rd.y;
    if ((ro + rd * t).z > WALL_Z) { t_table = t; }
  }

  let t_near = min(min(min(t_bottle, t_bowl), min(t_stem, t_foot)), t_table);
  var color: vec3f;
  if (t_near >= NO_HIT) {
    color = backdrop(ro, rd, 0.0);
  } else if (t_near == t_bowl) {
    color = shade_wine_glass(ro, rd, bowl);
  } else if (t_near == t_bottle) {
    color = shade_bottle(ro, rd, t_bottle);
  } else if (t_near == t_stem) {
    color = shade_glass_rod(ro, rd, t_stem, false);
  } else if (t_near == t_foot) {
    color = shade_glass_rod(ro, rd, t_foot, true);
  } else {
    color = shade_table(ro + rd * t_table, rd);
  }

  let opaque_limit = min(min(t_bottle, t_table), min(t_stem, t_foot));
  color += rim_highlight(ro, rd, opaque_limit);

  // A breath of haze: light from the window scattered toward the camera.
  let to_window = normalize(vec3f(params.window_center.xy, WALL_Z) - ro);
  let scatter = pow(max(dot(rd, to_window), 0.0), 24.0);
  color += LIGHT_TINT * params.window_center.w * params.window_size.w * 0.08 * scatter;

  let pixel = uv * params.resolution;
  let jitter = fract(ign(pixel) + params.time * 37.0 * 0.618034);
  color += sunbeam(ro, rd, min(t_near, 40.0), jitter);
  color += dust_motes(ro, rd, min(t_near, 40.0));

  let dither = (hash12(pixel + params.time) - 0.5) / 512.0;
  return vec4f(max(color + dither, vec3f(0.0)), 1.0);
}
