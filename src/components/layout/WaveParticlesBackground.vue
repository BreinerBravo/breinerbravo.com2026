<template>
    <canvas ref="canvasRef" class="wave-particles-bg"/>
</template>

<script setup lang="ts">

import {ref,onMounted,onBeforeUnmount} from 'vue';

import { ParticleWaveSystem } from '@/lib/ParticleWabeSystem';

const canvasRef =
ref<HTMLCanvasElement|null>(null);

let system:ParticleWaveSystem;

onMounted(()=>{

system =
new ParticleWaveSystem(
canvasRef
);

system.start();

});

onBeforeUnmount(()=>{

system.destroy();

});

</script>

<style scoped>

.wave-particles-bg {

position: fixed;
inset:0;
background:transparent !important;

z-index:0;

width:100%;
height:100%;

pointer-events:none;

}

</style>