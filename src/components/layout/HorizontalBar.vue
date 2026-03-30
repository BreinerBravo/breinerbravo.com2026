<template>
  <ul
    class="horizontal-menu hidden py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse 
           bg-white border-t border-[#ebedf2] dark:border-[#191e3a] 
           dark:bg-[#0e1726] text-black dark:text-white-dark"
  >
    <template v-for="(item, index) in navigation" :key="index">
      <!-- Enlaces simples -->
      <li v-if="item.type === 'link'" class="menu nav-item relative">
        <router-link
          :to="item.to || '/'"
          class="nav-link flex items-center"
          :class="{ 'text-primary': currentPath === item.to }"
        >
          <component v-if="item.icon" :is="resolveIcon(item.icon)" 
            class="shrink-0 text-yellow-600 dark:text-yellow-400"

          />
          <span class="px-2">{{ item.title }}</span>
        </router-link>
      </li>

      <!-- Menús colapsables -->
      <li
        v-else-if="item.type === 'collapsible'"
        class="menu nav-item relative"
        @mouseleave="closeDropdown(item.title)"
      >
        <a
          href="javascript:;"
          class="nav-link flex items-center justify-between"
          @mouseenter="openDropdown(item.title)"
        >
          <div class="flex items-center">
            <component v-if="item.icon" :is="resolveIcon(item.icon)" class="shrink-0 " />
            <span class="px-2">{{ item.title }}</span>
          </div>
          <icon-caret-down class="transition-transform duration-300" />
        </a>

        <transition name="fade">
          <ul
            v-if="activeDropdown === item.title"
            class="sub-menu absolute top-full ltr:left-0 rtl:right-0 bg-white dark:bg-[#1b2e4b] 
                   rounded shadow z-[10] min-w-[180px] p-2 text-dark dark:text-white-dark"
          >
            <li v-for="child in item.children" :key="child.title">
              <router-link
                :to="child.to || '/'"
                class="block py-2 px-4 hover:text-primary"
                :class="{ 'text-primary': currentPath === child.to }"
              >
                {{ child.title }}
              </router-link>
            </li>
          </ul>
        </transition>
      </li>

      <!-- Encabezados -->
      <li v-else-if="item.type === 'header'" class="hidden"></li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigation } from '@/composables/use-navigation'
import IconCaretDown from '@/components/icon/icon-caret-down.vue'

const { navigation } = useNavigation()
const route = useRoute()
const currentPath = computed(() => route.path)
const activeDropdown = ref<string | null>(null)

const openDropdown = (title: string) => {
  activeDropdown.value = title
}
const closeDropdown = (title: string) => {
  if (activeDropdown.value === title) activeDropdown.value = null
}

const resolveIcon = (iconName: string) => {
  try {
    return defineAsyncComponent(() =>
      import(`@/components/icon/menu/${iconName}.vue`)
    )
  } catch {
    return null
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
