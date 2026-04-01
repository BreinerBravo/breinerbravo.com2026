<template>
    <div class="grid grid-cols-5 grid-rows-6 gap-2 h-full">
        <div
         class="col-span-2 row-span-1 "
        >
        1
        </div>
        <div
         class="col-span-3 row-span-2 "
        >
        3
        </div>
        <div
         class="col-span-2 row-span-3 "
        >
         <Profile/>
        </div>

        <div
         class="col-span-3 row-span-2 "
        >
        
        </div>
        <div
         class="col-span-2 row-span-2 "
        >
        5
        </div>
         <div
         class="col-span-1 row-span-2 "
        >
        7
        </div>
          <div
         class="col-span-2 row-span-2 "
        >
        6
        </div>
    </div>
</template>

<script setup lang="ts">
import Profile from '@/components/icon/home/profile.vue';

</script>