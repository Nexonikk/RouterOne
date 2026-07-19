"use client"

import { useEffect, useRef } from "react"

type GradientProps = {
    /** Extra classes applied to the canvas element */
    className?: string
    /** Four colors used as gradient stops along the beam, from start to end */
    colors?: [string, string, string, string, string, string, string, string]
    /** Overall animation speed multiplier */
    speed?: number
    /** Whether the beam should distort toward the cursor */
    mouseInteractive?: boolean
    /** Rotation of the beam in degrees */
    angle?: number
    /** Width of the solid core of the beam, 0–1 */
    thickness?: number
    /** Size of the soft outer glow, 0–1 */
    glowSize?: number
    /** Shifts the beam perpendicular to its own axis, e.g. to clear space for copy */
    offset?: number
}

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 vUv;

void main() {
  vUv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouseStrength;
uniform float u_angle;
uniform float u_thickness;
uniform float u_glow;
uniform float u_offset;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

// Classic 2D simplex noise (Ashima Arts / Stefan Gustavson formulation)
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * snoise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

vec3 palette(float t) {
  vec3 col = mix(u_color1, u_color2, smoothstep(0.0, 0.33, t));
  col = mix(col, u_color3, smoothstep(0.33, 0.66, t));
  col = mix(col, u_color4, smoothstep(0.66, 1.0, t));
  return col;
}

void main() {
  vec2 st = vUv - 0.5;
  float aspect = u_resolution.x / u_resolution.y;
  st.x *= aspect;

  float rad = radians(u_angle);
  mat2 rot = mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
  vec2 rst = rot * st;

  vec2 mst = u_mouse - 0.5;
  mst.x *= aspect;

  float distToMouse = length(st - mst);
  float mouseWave = exp(-distToMouse * 3.2) * u_mouseStrength;

  float n1 = fbm(rst * 1.6 + vec2(u_time * 0.06, -u_time * 0.09));
  float n2 = fbm(rst * 3.2 + vec2(-u_time * 0.07, u_time * 0.05));

  float wobble = n1 * 0.16 + n2 * 0.07 + mouseWave * 0.55;
  float d = rst.y + u_offset + wobble;

  float core = 1.0 - smoothstep(0.0, u_thickness, abs(d));
  float glow = (1.0 - smoothstep(0.0, u_glow, abs(d))) * 0.45;

  float t = clamp(rst.x * 0.45 + 0.5 + n1 * 0.12, 0.0, 1.0);
  vec3 color = palette(t);

  float alpha = clamp(core + glow, 0.0, 1.0);
  gl_FragColor = vec4(color * alpha, alpha);
}
`

function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "")
    const value = parseInt(clean, 16)
    return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255]
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)
    if (!shader) throw new Error("Unable to create shader")
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        throw new Error(`Shader compile error: ${info}`)
    }
    return shader
}

export default function Gradient({
    className = "",
    colors = [
        "#040611",
        "#0D1B4F",
        "#2E5CFF",
        "#74B7FF",
        "#FFFFFF",
        "#F7FBFF",
        "#D9E7FF",
        "#8FA8FF",
    ],
    speed = 1,
    mouseInteractive = true,
    angle = -35,
    thickness = 0.3,
    glowSize = 0.62,
    offset = -0.15,
}: GradientProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext("webgl", {
            alpha: true,
            premultipliedAlpha: false,
            antialias: true,
        })
        if (!gl) {
            console.warn("Gradient: WebGL is not supported in this browser.")
            return
        }

        let vertexShader: WebGLShader
        let fragmentShader: WebGLShader
        let program: WebGLProgram | null

        try {
            vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
            fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
            program = gl.createProgram()
            if (!program) throw new Error("Unable to create program")
            gl.attachShader(program, vertexShader)
            gl.attachShader(program, fragmentShader)
            gl.linkProgram(program)
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`)
            }
        } catch (err) {
            console.error(err)
            return
        }

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        // A single triangle that overshoots the viewport is cheaper than a quad
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

        const positionLoc = gl.getAttribLocation(program, "a_position")
        gl.enableVertexAttribArray(positionLoc)
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

        const uniforms = {
            resolution: gl.getUniformLocation(program, "u_resolution"),
            time: gl.getUniformLocation(program, "u_time"),
            mouse: gl.getUniformLocation(program, "u_mouse"),
            mouseStrength: gl.getUniformLocation(program, "u_mouseStrength"),
            angle: gl.getUniformLocation(program, "u_angle"),
            thickness: gl.getUniformLocation(program, "u_thickness"),
            glow: gl.getUniformLocation(program, "u_glow"),
            offset: gl.getUniformLocation(program, "u_offset"),
            color1: gl.getUniformLocation(program, "u_color1"),
            color2: gl.getUniformLocation(program, "u_color2"),
            color3: gl.getUniformLocation(program, "u_color3"),
            color4: gl.getUniformLocation(program, "u_color4"),
        }

        const [c1, c2, c3, c4] = colors.map(hexToRgb)

        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const effectiveSpeed = prefersReducedMotion ? speed * 0.15 : speed
        const interactive = mouseInteractive && !prefersReducedMotion

        let animationFrame = 0
        const startTime = performance.now()

        const targetMouse = { x: 0.5, y: 0.5 }
        const currentMouse = { x: 0.5, y: 0.5 }
        let mouseStrength = 0
        let targetStrength = 0

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const width = canvas.clientWidth || 1
            const height = canvas.clientHeight || 1
            canvas.width = Math.floor(width * dpr)
            canvas.height = Math.floor(height * dpr)
            gl.viewport(0, 0, canvas.width, canvas.height)
        }

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)
        resize()

        const handlePointerMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            targetMouse.x = (e.clientX - rect.left) / rect.width
            targetMouse.y = 1 - (e.clientY - rect.top) / rect.height
            targetStrength = 1
        }

        if (interactive) {
            window.addEventListener("pointermove", handlePointerMove, { passive: true })
        }

        gl.useProgram(program)

        const render = () => {
            const elapsed = (performance.now() - startTime) / 1000

            currentMouse.x += (targetMouse.x - currentMouse.x) * 0.06
            currentMouse.y += (targetMouse.y - currentMouse.y) * 0.06
            mouseStrength += (targetStrength - mouseStrength) * 0.04
            targetStrength *= 0.98

            gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
            gl.uniform1f(uniforms.time, elapsed * effectiveSpeed)
            gl.uniform2f(uniforms.mouse, currentMouse.x, currentMouse.y)
            gl.uniform1f(uniforms.mouseStrength, interactive ? mouseStrength : 0)
            gl.uniform1f(uniforms.angle, angle)
            gl.uniform1f(uniforms.thickness, thickness)
            gl.uniform1f(uniforms.glow, glowSize)
            gl.uniform1f(uniforms.offset, offset)
            gl.uniform3f(uniforms.color1, c1[0], c1[1], c1[2])
            gl.uniform3f(uniforms.color2, c2[0], c2[1], c2[2])
            gl.uniform3f(uniforms.color3, c3[0], c3[1], c3[2])
            gl.uniform3f(uniforms.color4, c4[0], c4[1], c4[2])

            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.drawArrays(gl.TRIANGLES, 0, 3)

            animationFrame = requestAnimationFrame(render)
        }

        animationFrame = requestAnimationFrame(render)

        return () => {
            cancelAnimationFrame(animationFrame)
            resizeObserver.disconnect()
            if (interactive) {
                window.removeEventListener("pointermove", handlePointerMove)
            }
            gl.deleteProgram(program)
            gl.deleteShader(vertexShader)
            gl.deleteShader(fragmentShader)
            gl.deleteBuffer(positionBuffer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colors.join(","), speed, mouseInteractive, angle, thickness, glowSize, offset])

    return <canvas ref={canvasRef} aria-hidden="true" className={`h-full w-full ${className}`} />
}
