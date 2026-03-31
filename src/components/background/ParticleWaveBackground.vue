<template>
    <div ref="containerRef" class="particle-wave-bg" aria-hidden="true"></div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { ParticleWaveSystem } from '@/lib/ParticleWaveSystem';

    const containerRef = ref<HTMLElement | null>(null);
    let waveSystem: ParticleWaveSystem | null = null;

    const loadThree = async (): Promise<any> => {
        const dynamicImporter = new Function('url', 'return import(url)') as (url: string) => Promise<any>;
        return dynamicImporter('https://esm.sh/three@0.180.0');
    };

    onMounted(async () => {
        if (!containerRef.value) return;

        const THREE = await loadThree();

        waveSystem = new ParticleWaveSystem(THREE, containerRef.value, {
            gridX: 120,
            gridY: 84,
            spacing: 0.2,
            amplitude: 0.32,
            radius: 2.8,
            mouseStrength: 0.28,
            opacityStrength: 0.95,
        });

        waveSystem.init();
        window.addEventListener('resize', waveSystem.resize, { passive: true });
    });

    onUnmounted(() => {
        if (!waveSystem) return;

        window.removeEventListener('resize', waveSystem.resize);
        waveSystem.destroy();
        waveSystem = null;
    });
</script>

<style scoped>
    .particle-wave-bg {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: radial-gradient(circle at 20% 20%, rgba(58, 102, 212, 0.16), rgba(4, 10, 30, 0.88) 60%);
    }

    .particle-wave-bg :deep(canvas) {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
