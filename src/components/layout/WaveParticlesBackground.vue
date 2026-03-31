<template>
    <canvas ref="canvasRef" class="wave-particles-bg" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
    import { onBeforeUnmount, onMounted, ref } from 'vue';

    type Particle = {
        x: number;
        y: number;
        radius: number;
        phase: number;
        depth: number;
    };

    const canvasRef = ref<HTMLCanvasElement | null>(null);

    let ctx: CanvasRenderingContext2D | null = null;
    let animationFrameId = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let deviceRatio = 1;

    const pointer = {
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
    };

    const particleSpacing = 42;

    const buildParticles = () => {
        particles = [];

        const cols = Math.ceil(width / particleSpacing) + 4;
        const rows = Math.ceil(height / particleSpacing) + 4;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                particles.push({
                    x: col * particleSpacing - particleSpacing + (Math.random() - 0.5) * 8,
                    y: row * particleSpacing - particleSpacing + (Math.random() - 0.5) * 8,
                    radius: Math.random() * 0.9 + 0.55,
                    phase: Math.random() * Math.PI * 2,
                    depth: Math.random() * 0.45 + 0.65,
                });
            }
        }
    };

    const resizeCanvas = () => {
        if (!canvasRef.value) {
            return;
        }

        width = window.innerWidth;
        height = window.innerHeight;
        deviceRatio = Math.min(window.devicePixelRatio || 1, 2);

        canvasRef.value.width = Math.floor(width * deviceRatio);
        canvasRef.value.height = Math.floor(height * deviceRatio);
        canvasRef.value.style.width = `${width}px`;
        canvasRef.value.style.height = `${height}px`;

        ctx = canvasRef.value.getContext('2d');
        if (ctx) {
            ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
        }

        pointer.x = width * 0.5;
        pointer.y = height * 0.5;
        pointer.tx = width * 0.5;
        pointer.ty = height * 0.5;

        buildParticles();
    };

    const draw = (time: number) => {
        if (!ctx) {
            return;
        }

        pointer.x += (pointer.tx - pointer.x) * 0.09;
        pointer.y += (pointer.ty - pointer.y) * 0.09;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#01030b';
        ctx.fillRect(0, 0, width, height);

        const seconds = time * 0.001;



        const centerX = width * 0.5;
        const centerY = height * 0.5;

        for (const particle of particles) {
            const fromMouseX = particle.x - pointer.x;
            const fromMouseY = particle.y - pointer.y;
            const distMouse = Math.hypot(fromMouseX, fromMouseY) + 0.0001;

            const angle = Math.atan2(fromMouseY, fromMouseX);


            
        const oceanWave =
    Math.sin(particle.x * 0.012 + seconds * 0.6) +
    Math.sin(particle.y * 0.015 - seconds * 0.4);

const oceanForce = oceanWave * 6;


const angularNoise =
    Math.sin(angle * 3 + seconds * 0.8) * 0.35 +
    Math.sin(angle * 7 - seconds * 0.5) * 0.25;


const centerVoid = Math.exp(-distMouse * 0.007);
            const nxMouse = fromMouseX / distMouse;
            const nyMouse = fromMouseY / distMouse;

            const waveFront = Math.sin(distMouse * 0.045 - seconds * 4.2 + particle.phase) * 16;
            const mouseFalloff = Math.exp(-distMouse * 0.009);
const repelStrength = 20; // fuerza del vacío
const repelRadius = 920; // radio del campo

const ringRadius = 240; // radio del anillo
const ringWidth = 65;   // grosor del anillo

const breathing =
    Math.sin(seconds * 1.4) * 18;

const ringRadiusAnimated =
    ringRadius + breathing;

const distortedRingRadius = ringRadiusAnimated + angularNoise * 90;

  const ringFalloff = Math.exp(
    -Math.pow(distMouse - distortedRingRadius, 2) /
    (ringWidth * ringWidth)
);
const repelFalloff = Math.exp(-(distMouse * distMouse) / (repelRadius * repelRadius));

const turbulence =
    Math.sin(distMouse * 0.04 - seconds * 2) * 0.6;

const mousePush =
    waveFront * mouseFalloff +
    repelStrength * ringFalloff *
    (1 + turbulence);

    
            const fromCenterX = particle.x - centerX;
            const fromCenterY = particle.y - centerY;
            const distCenter = Math.hypot(fromCenterX, fromCenterY) + 0.0001;
            const nxCenter = fromCenterX / distCenter;
            const nyCenter = fromCenterY / distCenter;

            const centerWave = Math.sin(distCenter * 0.024 - seconds * 1.2 + particle.phase) * 2.4;
const flowX =
    Math.sin(particle.y * 0.01 + seconds * 0.7) * 4;

const flowY =
    Math.cos(particle.x * 0.01 - seconds * 0.6) * 4;

const offsetX =
    nxMouse * mousePush +
    nxCenter * centerWave +
    flowX +
    oceanForce;

const offsetY =
    nyMouse * mousePush +
    nyCenter * centerWave +
    flowY +
    oceanForce;

            const screenX = particle.x + offsetX;
            const screenY = particle.y + offsetY;

            const zWave = Math.sin(distMouse * 0.06 - seconds * 4.8 + particle.phase) * mouseFalloff;
            const depthBoost = particle.depth + zWave * 2.6;
const shrink = Math.exp(-distMouse * 0.018);

            const ringBoost = ringFalloff * 8
const farFade = Math.min(1, distMouse * 0.02);

const radius = Math.max(
    1.5,
    particle.radius * (1 - farFade) +
    depthBoost * 0.55 +
    ringBoost -
    centerVoid * 8
);
         const alpha = Math.min(
    1,
    Math.max(
        0.04,
        0.12 +
        depthBoost * 0.28 +
        ringFalloff * 0.55
    )
);

            ctx.beginPath();
            ctx.fillStyle = `rgba(98, 146, 255, ${alpha})`;

            const angleToMouse = Math.atan2(pointer.y - screenY, pointer.x - screenX);

            ctx.ellipse(
                screenX,
                screenY,
                radius,
                radius * 0.48,
                angleToMouse,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        animationFrameId = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
        pointer.tx = event.clientX;
        pointer.ty = event.clientY;
    };

    const handlePointerLeave = () => {
        pointer.tx = width * 0.5;
        pointer.ty = height * 0.5;
    };

    onMounted(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('pointerleave', handlePointerLeave);
        animationFrameId = window.requestAnimationFrame(draw);
    });

    onBeforeUnmount(() => {
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
    });
</script>

<style scoped>
    .wave-particles-bg {
        position: fixed;
        inset: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
</style>
