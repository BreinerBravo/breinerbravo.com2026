interface ParticleWaveOptions {
    gridX?: number;
    gridY?: number;
    spacing?: number;
    amplitude?: number;
    mouseStrength?: number;
    radius?: number;
    opacityStrength?: number;
}

export class ParticleWaveSystem {
    private readonly THREE: any;
    private readonly container: HTMLElement;
    private readonly options: Required<ParticleWaveOptions>;

    private renderer: any;
    private scene: any;
    private camera: any;
    private points: any;
    private geometry: any;
    private material: any;

    private clock: any;
    private animationFrameId = 0;

    private mouse: any;
    private targetMouse: any;

    constructor(THREE: any, container: HTMLElement, options: ParticleWaveOptions = {}) {
        this.THREE = THREE;
        this.container = container;
        this.options = {
            gridX: options.gridX ?? 110,
            gridY: options.gridY ?? 80,
            spacing: options.spacing ?? 0.22,
            amplitude: options.amplitude ?? 0.34,
            mouseStrength: options.mouseStrength ?? 0.3,
            radius: options.radius ?? 2.6,
            opacityStrength: options.opacityStrength ?? 0.95,
        };

        this.clock = new this.THREE.Clock();
        this.mouse = new this.THREE.Vector2(9999, 9999);
        this.targetMouse = new this.THREE.Vector2(9999, 9999);
    }

    init() {
        this.scene = new this.THREE.Scene();
        this.setupRenderer();
        this.setupCamera();
        this.createGrid();
        this.setupShader();
        this.handleMouse();
        this.resize();
        this.update();
    }

    private setupRenderer() {
        this.renderer = new this.THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
    }

    private setupCamera() {
        this.camera = new this.THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
        this.camera.position.set(0, 0, 4);
        this.camera.lookAt(0, 0, 0);
    }

    private createGrid() {
        const { gridX, gridY, spacing } = this.options;
        const total = gridX * gridY;

        const positions = new Float32Array(total * 3);
        const uv = new Float32Array(total * 2);
        const lag = new Float32Array(total);
        const randomAttr = new Float32Array(total);

        const halfX = ((gridX - 1) * spacing) * 0.5;
        const halfY = ((gridY - 1) * spacing) * 0.5;

        let p = 0;
        let u = 0;

        for (let y = 0; y < gridY; y++) {
            for (let x = 0; x < gridX; x++) {
                const i = y * gridX + x;
                const randomA = Math.random();
                const randomB = Math.random();
                const randomC = Math.random();

                let px = x * spacing - halfX;
                let py = y * spacing - halfY;

                px += (randomA - 0.5) * spacing * 0.7;
                py += (randomB - 0.5) * spacing * 0.7;

                positions[p++] = px;
                positions[p++] = py;
                positions[p++] = 0;

                uv[u++] = x / (gridX - 1);
                uv[u++] = y / (gridY - 1);

                const normX = (x / (gridX - 1)) * 2 - 1;
                const normY = (y / (gridY - 1)) * 2 - 1;
                lag[i] = Math.sqrt(normX * normX + normY * normY);
                randomAttr[i] = randomC;
            }
        }

        this.geometry = new this.THREE.BufferGeometry();
        this.geometry.setAttribute('position', new this.THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute('aUv', new this.THREE.Float32BufferAttribute(uv, 2));
        this.geometry.setAttribute('aLag', new this.THREE.Float32BufferAttribute(lag, 1));
        this.geometry.setAttribute('aRandom', new this.THREE.Float32BufferAttribute(randomAttr, 1));
    }

    private setupShader() {
        this.material = new this.THREE.ShaderMaterial({
            transparent: true,
            depthTest: false,
            blending: this.THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new this.THREE.Vector2(9999, 9999) },
                uResolution: { value: new this.THREE.Vector2(1, 1) },
                uWaveAmplitude: { value: this.options.amplitude },
                uMouseStrength: { value: this.options.mouseStrength },
                uRadius: { value: this.options.radius },
                uOpacityStrength: { value: this.options.opacityStrength },
                uPointSize: { value: 2.4 },
            },
            vertexShader: `
                attribute vec2 aUv;
                attribute float aLag;
                attribute float aRandom;

                uniform float uTime;
                uniform vec2 uMouse;
                uniform vec2 uResolution;
                uniform float uWaveAmplitude;
                uniform float uMouseStrength;
                uniform float uRadius;
                uniform float uOpacityStrength;
                uniform float uPointSize;

                varying float vOpacity;
                varying float vHeight;

                void main() {
                    vec3 pos = position;
                    float delayedTime = uTime - aLag * 0.55;

                    vec2 toMouse = pos.xy - uMouse;
                    float dist = length(toMouse);
                    float mouseMask = smoothstep(uRadius, 0.0, dist);

                    float ripple = sin(dist * 4.0 - delayedTime * 3.0);
                    float height = ripple * mouseMask * uWaveAmplitude;

                    vec2 dir = normalize(toMouse + vec2(0.0001));
                    height += dot(dir, vec2(0.7, 0.7)) * mouseMask * uMouseStrength;

                    float localNoise = sin((dist * 3.5 + aRandom * 9.0) - delayedTime * (1.5 + aRandom * 0.35));
                    height += localNoise * mouseMask * 0.04;

                    pos.z += height;
                    pos.xy += dir * (height * 0.05 * mouseMask);

                    float life = smoothstep(uRadius * 0.9, uRadius * 0.2, dist);
                    vOpacity = mouseMask * smoothstep(-0.2, 0.4, height) * life * uOpacityStrength;
                    vHeight = height;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;

                    float sizeFade = smoothstep(uRadius, 0.0, dist);
                    gl_PointSize = uPointSize * sizeFade * (min(uResolution.x, uResolution.y) / 900.0);
                }
            `,
            fragmentShader: `
                varying float vOpacity;
                varying float vHeight;

                void main() {
                    vec2 centered = gl_PointCoord - vec2(0.5);
                    float distToCenter = length(centered);
                    float glow = smoothstep(0.5, 0.05, distToCenter);

                    vec3 color = mix(
                        vec3(0.25, 0.45, 0.95),
                        vec3(0.65, 0.85, 1.0),
                        clamp(vHeight * 0.5 + 0.5, 0.0, 1.0)
                    );

                    float alpha = vOpacity * glow;
                    if (alpha < 0.01) discard;

                    gl_FragColor = vec4(color, alpha);
                }
            `,
        });

        this.points = new this.THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
    }

    update = () => {
        const elapsed = this.clock.getElapsedTime();
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.08;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.08;
        this.material.uniforms.uTime.value = elapsed;
        this.material.uniforms.uMouse.value.copy(this.mouse);
        this.renderer.render(this.scene, this.camera);
        this.animationFrameId = window.requestAnimationFrame(this.update);
    };

    handleMouse() {
        this.container.addEventListener('pointermove', this.onPointerMove, { passive: true });
        this.container.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    }

    private onPointerMove = (event: PointerEvent) => {
        const rect = this.container.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = (event.clientY - rect.top) / rect.height;
        const worldWidth = this.camera.right - this.camera.left;
        const worldHeight = this.camera.top - this.camera.bottom;
        this.targetMouse.set((nx - 0.5) * worldWidth, (0.5 - ny) * worldHeight);
    };

    private onPointerLeave = () => {
        this.targetMouse.set(9999, 9999);
    };

    resize = () => {
        const width = Math.max(this.container.clientWidth, 1);
        const height = Math.max(this.container.clientHeight, 1);
        const aspect = width / height;
        const frustumHeight = this.options.gridY * this.options.spacing;
        const frustumWidth = frustumHeight * aspect;
        this.camera.left = -frustumWidth * 0.5;
        this.camera.right = frustumWidth * 0.5;
        this.camera.top = frustumHeight * 0.5;
        this.camera.bottom = -frustumHeight * 0.5;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
        this.material.uniforms.uResolution.value.set(width, height);
    };

    destroy() {
        window.cancelAnimationFrame(this.animationFrameId);
        this.container.removeEventListener('pointermove', this.onPointerMove);
        this.container.removeEventListener('pointerleave', this.onPointerLeave);
        this.scene.remove(this.points);
        this.geometry.dispose();
        this.material.dispose();
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
}
