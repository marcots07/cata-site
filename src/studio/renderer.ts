import {
  clock,
  effect,
  frameLoop,
  init,
  sampler,
  surface,
  target,
  type Gpu,
  type Target,
} from "vgpu";

import blurShader from "./bloom-blur.wgsl";
import extractShader from "./bloom-extract.wgsl";
import raysShader from "./light-rays.wgsl";
import presentShader from "./present.wgsl";
import sceneShader from "./scene.wgsl";

type Vec3 = readonly [number, number, number];

const HDR_FORMAT: GPUTextureFormat = "rgba16float";
const LOOK_AT: Vec3 = [0.14, 1.22, 0.05];
const WALL_Z = -4.6;
const WINDOW_Y = 3.05;
const WINDOW_HALF: readonly [number, number] = [1.25, 2.45];
const WINDOW_SOFTNESS = 0.06;
const WINDOW_HAZE = 0.018;
const WINDOW_INTENSITY = 7;
const SUN_ELEVATION = 0.58;
const SUN_INTENSITY = 2.6;
const PIXEL_BUDGET = 950_000;
const MIN_SCALE = 0.38;

export interface WineStage {
  readonly ready: Promise<void>;
  setRunning(running: boolean): void;
  dispose(): void;
}

interface Layout {
  readonly focal: number;
  readonly distance: number;
  readonly shift: readonly [number, number];
  readonly yaw: number;
  readonly pitch: number;
}

interface Camera {
  readonly eye: Vec3;
  readonly forward: Vec3;
  readonly right: Vec3;
  readonly up: Vec3;
}

export function createWineStage(canvas: HTMLCanvasElement, options: { still: boolean }): WineStage {
  let disposed = false;
  let running = true;
  let gpu: Gpu | undefined;
  const cleanups: Array<() => void> = [];

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, idle: Number.POSITIVE_INFINITY };
  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (event.clientY < rect.top || event.clientY > rect.bottom) return;
    pointer.targetX = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    pointer.targetY = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
    pointer.idle = 0;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  cleanups.push(() => window.removeEventListener("pointermove", onPointerMove));

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    for (const cleanup of cleanups.splice(0).reverse()) cleanup();
    gpu?.dispose();
  };

  const ready = (async () => {
    const context = await init();
    if (disposed) {
      context.dispose();
      return;
    }
    gpu = context;

    const output = surface(context, canvas, { dpr: [1, 1.5] });
    const linear = sampler(context, {
      minFilter: "linear",
      magFilter: "linear",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge",
    });

    const scene = effect(context, sceneShader, { label: "cata-scene" });
    const extract = effect(context, extractShader, { label: "cata-bloom-extract" });
    const rays = effect(context, raysShader, { label: "cata-light-rays" });
    const nearH = effect(context, blurShader, { label: "cata-bloom-near-h" });
    const nearV = effect(context, blurShader, { label: "cata-bloom-near-v" });
    const farH = effect(context, blurShader, { label: "cata-bloom-far-h" });
    const farV = effect(context, blurShader, { label: "cata-bloom-far-v" });
    const present = effect(context, presentShader, { label: "cata-present" });

    let scale = sceneScale(output.size);
    const targets = {
      hdr: target(context, { size: [1, 1], format: HDR_FORMAT, label: "cata-hdr" }),
      nearA: target(context, { size: [1, 1], format: HDR_FORMAT, label: "cata-near-a" }),
      nearB: target(context, { size: [1, 1], format: HDR_FORMAT, label: "cata-near-b" }),
      farA: target(context, { size: [1, 1], format: HDR_FORMAT, label: "cata-far-a" }),
      farB: target(context, { size: [1, 1], format: HDR_FORMAT, label: "cata-far-b" }),
      shafts: target(context, { size: [1, 1], format: HDR_FORMAT, label: "cata-shafts" }),
    };
    cleanups.push(() => {
      for (const resource of Object.values(targets)) destroyTarget(resource);
    });

    const resize = () => {
      const [width, height] = output.size;
      const hdrSize: [number, number] = [
        Math.max(1, Math.floor(width * scale)),
        Math.max(1, Math.floor(height * scale)),
      ];
      const near: [number, number] = [Math.max(1, hdrSize[0] >> 2), Math.max(1, hdrSize[1] >> 2)];
      const far: [number, number] = [Math.max(1, hdrSize[0] >> 3), Math.max(1, hdrSize[1] >> 3)];
      targets.hdr.resize(hdrSize);
      targets.nearA.resize(near);
      targets.nearB.resize(near);
      targets.shafts.resize(near);
      targets.farA.resize(far);
      targets.farB.resize(far);

      extract.set({
        params: { texel: targets.hdr.texelSize, threshold: 1.1, knee: 0.6 },
        source: targets.hdr,
        linear_sampler: linear,
      });
      nearH.set({
        params: { direction: [targets.nearA.texelSize[0], 0], spread: 1.4, gain: 1 },
        source: targets.nearA,
        linear_sampler: linear,
      });
      nearV.set({
        params: { direction: [0, targets.nearB.texelSize[1]], spread: 1.4, gain: 1 },
        source: targets.nearB,
        linear_sampler: linear,
      });
      farH.set({
        params: { direction: [targets.nearA.texelSize[0], 0], spread: 3.2, gain: 1 },
        source: targets.nearA,
        linear_sampler: linear,
      });
      farV.set({
        params: { direction: [0, targets.farA.texelSize[1]], spread: 2.2, gain: 1 },
        source: targets.farA,
        linear_sampler: linear,
      });
      rays.set({ source: targets.nearA, linear_sampler: linear });
      present.set({
        scene_texture: targets.hdr,
        bloom_near: targets.nearA,
        bloom_far: targets.farB,
        ray_texture: targets.shafts,
        linear_sampler: linear,
      });
    };
    resize();
    cleanups.push(output.onResize(() => {
      scale = sceneScale(output.size);
      resize();
    }));

    await Promise.all([
      scene.compile(targets.hdr),
      extract.compile(targets.nearA),
      rays.compile(targets.shafts),
      nearH.compile(targets.nearB),
      nearV.compile(targets.nearA),
      farH.compile(targets.farA),
      farV.compile(targets.farB),
      present.compile({ colors: [output.format] }),
    ]);
    if (disposed) return;

    const time = clock(context);
    let elapsed = 0;
    let slowFrames = 0;
    let measured = 0;

    const loop = frameLoop(context, (frame) => {
      if (!running) return;
      const dt = Math.min(Math.max(time.deltaTime, 0), 0.1);
      elapsed += options.still ? 0 : dt;

      measured += 1;
      if (measured > 45) {
        slowFrames = time.deltaTime > 0.026 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
        if (slowFrames > 40 && scale > MIN_SCALE) {
          scale = Math.max(MIN_SCALE, scale * 0.82);
          slowFrames = 0;
          resize();
        }
      }

      pointer.idle += dt;
      if (pointer.idle > 3.5 && !options.still) {
        pointer.targetX = Math.sin(elapsed * 0.16) * 0.55;
        pointer.targetY = 0;
      }
      const ease = 1 - Math.exp(-dt * 2.6);
      pointer.x += (pointer.targetX - pointer.x) * ease;
      pointer.y += (pointer.targetY - pointer.y) * ease;

      const [width, height] = output.size;
      const aspect = width / Math.max(height, 1);
      const layout = layoutFor(width, height);
      const view = orbit(
        layout,
        layout.yaw + pointer.x * 0.07 + Math.sin(elapsed * 0.05) * 0.03,
        layout.pitch + pointer.y * 0.025,
      );

      const windowX = -0.3 + pointer.x * 1.05;
      const toWindow = normalize([windowX - 0.15, 0, WALL_Z - 0.05]);
      const sun: Vec3 = [
        toWindow[0] * Math.cos(SUN_ELEVATION),
        Math.sin(SUN_ELEVATION),
        toWindow[2] * Math.cos(SUN_ELEVATION),
      ];

      scene.set({
        params: {
          resolution: targets.hdr.size,
          time: elapsed,
          focal: layout.focal,
          eye: [...view.eye, 0],
          forward: [...view.forward, 0],
          right: [...view.right, 0],
          up: [...view.up, 0],
          shift: [layout.shift[0], layout.shift[1], 0, 0],
          window_center: [windowX, WINDOW_Y, WALL_Z, WINDOW_INTENSITY],
          window_size: [WINDOW_HALF[0], WINDOW_HALF[1], WINDOW_SOFTNESS, WINDOW_HAZE],
          sun: [...sun, SUN_INTENSITY],
        },
      });
      const lightUv = projectToUv([windowX, WINDOW_Y - 0.4, WALL_Z], view, layout, aspect);
      rays.set({ params: { light_uv: lightUv, decay: 0.955, reach: 0.9 } });
      present.set({
        params: {
          resolution: output.size,
          time: options.still ? 0 : elapsed,
          exposure: 1.0,
          bloom_strength: 0.1,
          ray_strength: 0.035,
          grain: 0.022,
          vignette: 0.45,
        },
      });

      frame.pass(targets.hdr, scene);
      frame.pass(targets.nearA, extract);
      frame.pass(targets.shafts, rays);
      frame.pass(targets.nearB, nearH);
      frame.pass(targets.nearA, nearV);
      frame.pass(targets.farA, farH);
      frame.pass(targets.farB, farV);
      frame.pass(output, present);
    });
    cleanups.push(() => loop.stop());
  })().catch((error: unknown) => {
    dispose();
    throw error;
  });

  return {
    ready,
    setRunning(next) {
      running = next;
    },
    dispose,
  };
}

function layoutFor(width: number, height: number): Layout {
  const aspect = width / Math.max(height, 1);
  if (aspect >= 1.05) {
    const ndcX = aspect > 1.5 ? 0.36 : 0.3;
    return { focal: 2.35, distance: 7.1, shift: [ndcX * aspect, -0.04], yaw: 0.12, pitch: 0.1 };
  }
  const distance = Math.max(7.1, (1.71 * 2.35) / aspect);
  return { focal: 2.35, distance, shift: [0.02, 0.29], yaw: 0.1, pitch: 0.12 };
}

function orbit(layout: Layout, yaw: number, pitch: number): Camera {
  const cp = Math.cos(pitch);
  const eye: Vec3 = [
    LOOK_AT[0] + layout.distance * Math.sin(yaw) * cp,
    LOOK_AT[1] + layout.distance * Math.sin(pitch),
    LOOK_AT[2] + layout.distance * Math.cos(yaw) * cp,
  ];
  const forward = normalize(sub(LOOK_AT, eye));
  const right = normalize(cross(forward, [0, 1, 0]));
  return { eye, forward, right, up: cross(right, forward) };
}

function projectToUv(point: Vec3, view: Camera, layout: Layout, aspect: number): [number, number] {
  const v = sub(point, view.eye);
  const depth = Math.max(dot(v, view.forward), 0.001);
  const sx = (dot(v, view.right) / depth) * layout.focal + layout.shift[0];
  const sy = (dot(v, view.up) / depth) * layout.focal + layout.shift[1];
  return [(sx / aspect + 1) / 2, (1 - sy) / 2];
}

function sceneScale(size: readonly [number, number]): number {
  const pixels = Math.max(size[0] * size[1], 1);
  return Math.min(1, Math.max(MIN_SCALE, Math.sqrt(PIXEL_BUDGET / pixels)));
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function destroyTarget(resource: Target): void {
  (resource as Target & { destroy(): void }).destroy();
}
