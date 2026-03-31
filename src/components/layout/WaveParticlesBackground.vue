<template>
    <canvas ref="canvasRef" class="wave-particles-bg" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
    import { onBeforeUnmount, onMounted, ref } from 'vue';

    type Particle = {
        x: number;
        y: number;
        baseZ: number;
        radius: number;
        phase: number;
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

    const particleSpacing = 40;

    const buildParticles = () => {
        particles = [];

        const cols = Math.ceil(width / particleSpacing) + 4;
        const rows = Math.ceil(height / particleSpacing) + 4;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                particles.push({
                    x: col * particleSpacing - particleSpacing,
                    y: row * particleSpacing - particleSpacing,
                    baseZ: Math.random() * 0.4 + 0.3,
                    radius: Math.random() * 0.75 + 0.75,
                    phase: Math.random() * Math.PI * 2,
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

        pointer.x += (pointer.tx - pointer.x) * 0.08;
        pointer.y += (pointer.ty - pointer.y) * 0.08;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#01030b';
        ctx.fillRect(0, 0, width, height);

        const seconds = time * 0.001;

        for (const particle of particles) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const influence = Math.exp(-dist * 0.012);
            const ripple = Math.sin(dist * 0.055 - seconds * 3 + particle.phase) * 24 * influence;
            const drift = Math.sin(seconds + particle.phase) * 2.4;
            const z = particle.baseZ + (ripple + drift) * 0.018;

            const alpha = Math.min(0.95, Math.max(0.08, 0.1 + influence * 0.85 + z * 0.35));
            const radius = Math.max(0.4, particle.radius + z * 1.5 + influence * 1.2);

            ctx.beginPath();
            ctx.fillStyle = `rgba(98, 146, 255, ${alpha})`;
            ctx.ellipse(particle.x, particle.y, radius, radius * 0.55, seconds + particle.phase, 0, Math.PI * 2);
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
