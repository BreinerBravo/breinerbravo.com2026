<template>
    <section class="wave-hero">
        <ParticleWaveBackground />

        <div class="content">
            <p class="eyebrow">Interactive background</p>
            <h1>Calm Particle Ocean</h1>
            <p>Lightweight Three.js wave field designed for smooth landing page backgrounds.</p>
        </div>
    </section>
</template>

<script setup lang="ts">
    import ParticleWaveBackground from '@/components/background/ParticleWaveBackground.vue';
</script>

<style scoped>
    .wave-hero {
        position: relative;
        min-height: calc(100vh - 7.5rem);
        border-radius: 1rem;
        overflow: hidden;
        isolation: isolate;
        display: flex;
        align-items: flex-end;
    }

    .wave-hero::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(6, 14, 34, 0.1), rgba(3, 8, 22, 0.55));
        pointer-events: none;
        z-index: 1;
    }

    .content {
        position: relative;
        z-index: 2;
        color: #e7f1ff;
        padding: 2.25rem;
        max-width: 42rem;
    }

    .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.22em;
        font-size: 0.7rem;
        margin-bottom: 0.9rem;
        opacity: 0.85;
    }

    h1 {
        font-size: clamp(2rem, 4vw, 3.1rem);
        line-height: 1.1;
        margin-bottom: 0.85rem;
        font-weight: 600;
    }

    p {
        color: rgba(231, 241, 255, 0.88);
        margin: 0;
    }
</style>
