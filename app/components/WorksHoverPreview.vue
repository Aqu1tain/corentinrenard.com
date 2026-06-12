<script setup lang="ts">
import { gsap } from 'gsap'
import { workItems } from '#shared/utils/works'

const VERT = `
attribute vec2 aPosition;
attribute vec2 aUv;
uniform vec2 uRes;
uniform vec2 uPos;
uniform vec2 uSize;
uniform vec2 uVelo;
varying vec2 vUv;
void main() {
  vUv = aUv;
  vec2 pos = aPosition;
  pos.y += sin(aUv.x * 3.14159) * uVelo.y * -0.25;
  pos.x += sin(aUv.y * 3.14159) * uVelo.x * -0.25;
  vec2 px = uPos + pos * uSize;
  vec2 clip = (px / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uVelo;
uniform float uAlpha;
varying vec2 vUv;
void main() {
  vec2 shift = uVelo * 0.03;
  float r = texture2D(uTex, vUv + shift).r;
  vec2 gb = texture2D(uTex, vUv - shift * 0.6).gb;

  vec2 ratio = vec2(16.0 / 9.0, 1.0);
  float radius = 0.07;
  vec2 p = (vUv - 0.5) * ratio;
  vec2 b = 0.5 * ratio - vec2(radius);
  vec2 d = abs(p) - b;
  float corner = length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - radius;
  float mask = 1.0 - smoothstep(-0.004, 0.004, corner);

  gl_FragColor = vec4(r, gb, uAlpha * mask);
}
`

const canvasEl = ref<HTMLCanvasElement | null>(null)
const enabled = ref(false)

const imageBySlug = new Map(workItems.filter((work) => work.image).map((work) => [work.slug, work.image!]))

let gl: WebGLRenderingContext | null = null
let cleanups: Array<() => void> = []

const compile = (context: WebGLRenderingContext, type: number, source: string) => {
  const shader = context.createShader(type)!
  context.shaderSource(shader, source)
  context.compileShader(shader)
  return shader
}

const initWebgl = () => {
  const canvas = canvasEl.value
  if (!canvas) return

  gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
  if (!gl) return
  const context = gl

  const program = context.createProgram()!
  context.attachShader(program, compile(context, context.VERTEX_SHADER, VERT))
  context.attachShader(program, compile(context, context.FRAGMENT_SHADER, FRAG))
  context.linkProgram(program)
  context.useProgram(program)
  context.enable(context.BLEND)
  context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA)
  context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 1)

  const quad = new Float32Array([
    -0.5, -0.5, 0, 1,
    0.5, -0.5, 1, 1,
    -0.5, 0.5, 0, 0,
    0.5, 0.5, 1, 0,
  ])
  context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer())
  context.bufferData(context.ARRAY_BUFFER, quad, context.STATIC_DRAW)
  const aPosition = context.getAttribLocation(program, 'aPosition')
  const aUv = context.getAttribLocation(program, 'aUv')
  context.enableVertexAttribArray(aPosition)
  context.vertexAttribPointer(aPosition, 2, context.FLOAT, false, 16, 0)
  context.enableVertexAttribArray(aUv)
  context.vertexAttribPointer(aUv, 2, context.FLOAT, false, 16, 8)

  const uniforms = {
    uRes: context.getUniformLocation(program, 'uRes'),
    uPos: context.getUniformLocation(program, 'uPos'),
    uSize: context.getUniformLocation(program, 'uSize'),
    uVelo: context.getUniformLocation(program, 'uVelo'),
    uAlpha: context.getUniformLocation(program, 'uAlpha'),
  }

  const textures = new Map<string, WebGLTexture>()
  let currentSlug: string | null = null

  const loadTexture = (slug: string) => {
    if (textures.has(slug)) return
    const img = new Image()
    img.src = imageBySlug.get(slug)!
    img.decode().then(() => {
      const texture = context.createTexture()!
      context.bindTexture(context.TEXTURE_2D, texture)
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE)
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE)
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR)
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR)
      context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, img)
      textures.set(slug, texture)
      if (currentSlug === slug) context.bindTexture(context.TEXTURE_2D, texture)
    }).catch(() => {})
  }

  const state = { alpha: 0, scale: 0.9 }
  const target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    context.viewport(0, 0, canvas.width, canvas.height)
    context.uniform2f(uniforms.uRes, window.innerWidth, window.innerHeight)
  }
  resize()
  window.addEventListener('resize', resize)
  cleanups.push(() => window.removeEventListener('resize', resize))

  const onMove = (event: PointerEvent) => {
    target.x = event.clientX
    target.y = event.clientY
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  cleanups.push(() => window.removeEventListener('pointermove', onMove))

  for (const row of document.querySelectorAll<HTMLElement>('.works-list .work-row')) {
    const slug = row.dataset.slug
    if (!slug || !imageBySlug.has(slug)) continue
    const enter = () => {
      currentSlug = slug
      loadTexture(slug)
      current.x = target.x
      current.y = target.y
      state.scale = 0.9
      const texture = textures.get(slug)
      if (!texture) return
      context.bindTexture(context.TEXTURE_2D, texture)
      gsap.to(state, { alpha: 1, scale: 1, duration: 0.4, ease: 'power2.out', overwrite: true })
    }
    const leave = () => {
      currentSlug = null
      gsap.to(state, { alpha: 0, scale: 0.9, duration: 0.3, ease: 'power2.in', overwrite: true })
    }
    row.addEventListener('pointerenter', enter)
    row.addEventListener('pointerleave', leave)
    cleanups.push(() => {
      row.removeEventListener('pointerenter', enter)
      row.removeEventListener('pointerleave', leave)
    })
  }

  const render = () => {
    current.x += (target.x - current.x) * 0.12
    current.y += (target.y - current.y) * 0.12
    if (currentSlug && state.alpha === 0) {
      const texture = textures.get(currentSlug)
      if (texture) {
        context.bindTexture(context.TEXTURE_2D, texture)
        gsap.to(state, { alpha: 1, scale: 1, duration: 0.4, ease: 'power2.out', overwrite: true })
      }
    }
    context.clear(context.COLOR_BUFFER_BIT)
    if (state.alpha < 0.001) return
    const width = Math.min(Math.max(window.innerWidth * 0.24, 280), 380) * state.scale
    const velo = {
      x: Math.max(-1, Math.min(1, (target.x - current.x) / 90)),
      y: Math.max(-1, Math.min(1, (target.y - current.y) / 90)),
    }
    context.uniform2f(uniforms.uPos, current.x, current.y)
    context.uniform2f(uniforms.uSize, width, width * 9 / 16)
    context.uniform2f(uniforms.uVelo, velo.x, velo.y)
    context.uniform1f(uniforms.uAlpha, state.alpha)
    context.drawArrays(context.TRIANGLE_STRIP, 0, 4)
  }
  gsap.ticker.add(render)
  cleanups.push(() => gsap.ticker.remove(render))

  context.clearColor(0, 0, 0, 0)
}

onMounted(async () => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduce || !imageBySlug.size) return
  enabled.value = true
  await nextTick()
  initWebgl()
})

onUnmounted(() => {
  cleanups.forEach((dispose) => dispose())
  cleanups = []
  gl?.getExtension('WEBGL_lose_context')?.loseContext()
  gl = null
})
</script>

<template>
  <Teleport to="body">
    <canvas v-if="enabled" ref="canvasEl" class="works-preview-canvas" />
  </Teleport>
</template>

<style scoped>
.works-preview-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  pointer-events: none;
}
</style>
