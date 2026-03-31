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

            const nxMouse = fromMouseX / distMouse;
            const nyMouse = fromMouseY / distMouse;

            const waveFront = Math.sin(distMouse * 0.045 - seconds * 4.2 + particle.phase) * 16;
            const mouseFalloff = Math.exp(-distMouse * 0.009);
            const mousePush = waveFront * mouseFalloff;

            const fromCenterX = particle.x - centerX;
            const fromCenterY = particle.y - centerY;
            const distCenter = Math.hypot(fromCenterX, fromCenterY) + 0.0001;
            const nxCenter = fromCenterX / distCenter;
            const nyCenter = fromCenterY / distCenter;

            const centerWave = Math.sin(distCenter * 0.024 - seconds * 1.2 + particle.phase) * 2.4;

            const offsetX = nxMouse * mousePush + nxCenter * centerWave;
            const offsetY = nyMouse * mousePush + nyCenter * centerWave;

            const screenX = particle.x + offsetX;
            const screenY = particle.y + offsetY;

            const zWave = Math.sin(distMouse * 0.06 - seconds * 4.8 + particle.phase) * mouseFalloff;
            const depthBoost = particle.depth + zWave * 2.6;

            const radius = Math.max(0.35, particle.radius + depthBoost * 0.85);
            const alpha = Math.min(0.95, Math.max(0.15, 0.18 + depthBoost * 0.34));

            ctx.beginPath();
            ctx.fillStyle = `rgba(98, 146, 255, ${alpha})`;
            ctx.ellipse(screenX, screenY, radius, radius * 0.48, Math.atan2(offsetY, offsetX), 0, Math.PI * 2);
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
