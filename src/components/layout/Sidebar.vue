<template>
  <div class="dark text-white-dark">
    <nav class="sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-[50] transition-all duration-300"
    >

      <div class="bg-white dark:bg-[#0e1726] h-full">
        <!-- Logo -->
        <div
          class="flex justify-between items-center px-4 py-2 h-16 relative overflow-hidden"
        >
          <router-link to="/" class="main-logo flex items-center shrink-0">
            <!-- <transition name="fade-slide" mode="out-in">
                <img
                v-if="sidebarWidth < 200"
                key="fav-icon"
                class="w-8 ml-[5px] transition-all duration-300"
                src="/assets/images/FAV_ICON.svg"
                alt="FAV ICON"
                />
                <img
                v-else
                key="logo-full"
                class="ml-2 w-[150px] transition-all duration-300"
                src="/assets/images/LOGO_FULL.svg"
                alt="LOGO FULL"
                />
            </transition> -->
          </router-link>

          <a
            href="javascript:;"
            class="collapse-icon w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 hover:text-primary"
            @click="store.toggleSidebar()"
          >
            <icon-carets-down
              class="m-auto transition-transform duration-300"
              :class="{ 'rotate-90': store.sidebar, '-rotate-90': !store.sidebar }"
            />
          </a>
        </div>
        <!-- Scroll Area -->
        <perfect-scrollbar  
        :options="{
            swipeEasing: true,
            wheelPropagation: false,
        }" 
        class="h-[calc(100vh-80px)] relative"
        >
          <ul class="font-semibold space-y-0.5 p-4 py-0">
            <template v-for="(item, index) in navigation" :key="index">
              <!-- Header -->
              <h2 v-if="item.type === 'header'" class="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                <icon-minus class="w-4 h-5 flex-none hidden" />
                <span>{{ item.title }}</span>
              </h2>

              <!-- Link -->
              <li v-else-if="item.type === 'link'" class="nav-item">
                <component
                    :is="item.to?.startsWith('http') ? 'a' : 'router-link'"
                    :href="!item.disabled && item.to?.startsWith('http') ? item.to : undefined"
                    :to="!item.disabled && !item.to?.startsWith('http') ? item.to : undefined"
                    class="group nav-link"
                    :class="{ 
                        'opacity-50 cursor-not-allowed pointer-events-none': item.disabled,
                        'bg-primary/10 text-primary dark:text-white-dark': currentPath === item.to
                     }"
                    :target="!item.disabled && item.to?.startsWith('http') ? '_blank' : undefined"
                    @click.prevent="item.disabled ? null : undefined"
                >
                  <div class="flex items-center">
                    <component
                      v-if="item.icon"
                      :is="resolveIcon(item.icon)"
                      :fill="false"
                      class="group-hover:!text-yellow-400 shrink-0 text-yellow-600"
                    />
                    <span class="pl-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {{ item.title }}
                    </span>
                  </div>
                </component>
              </li>

              <!-- Collapsible -->
              <li v-else-if="item.type === 'collapsible'" class="menu nav-item">
                <button
                  type="button"
                  class="nav-link group w-full"
                  :class="{ active: activeDropdown === item.title }"
                  @click="toggleDropdown(item.title)"
                >
                  <div class="flex items-center">
                    <component
                      v-if="item.icon"
                      :is="resolveIcon(item.icon)"
                      class="group-hover:!text-yellow-400 shrink-0 text-yellow-600 "
                    />
                    <span class="pl-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {{ item.title }}
                    </span>
                  </div>
                  <div :class="{ 'rtl:rotate-90 -rotate-90': activeDropdown !== item.title }">
                    <icon-caret-down />
                  </div>
                </button>
                <vue-collapsible :isOpen="activeDropdown === item.title">
                  <ul class="sub-menu text-gray-500">
                    <li v-for="child in item.children" :key="child.title">
                        <router-link
                            :to="child.to || '/'"
                            @click="toggleMobileMenu"
                            :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': child.disabled,
                                'bg-primary/10 text-primary dark:text-white-dark': currentPath === child.to
                             }"
                            @click.prevent="item.disabled ? null : undefined"
                            class="block px-4 py-2 hover:text-primary"
                        >
                            {{ child.title }}
                        </router-link>
                    
                        </li>
                  </ul>
                </vue-collapsible>
              </li>
            </template>
          </ul>
        </perfect-scrollbar>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease-in-out;
  position: absolute;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>


<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent, computed } from 'vue'
import { useRoute } from 'vue-router' 

import { useAppStore } from '@/stores'
import { useNavigation } from '@/composables/use-navigation'
import VueCollapsible from 'vue-height-collapsible/vue3'
import iconBook from '@/components/icon/menu/icon-book.vue'
import IconCaretsDown from '@/components/icon/icon-carets-down.vue'
import IconCaretDown from '@/components/icon/icon-caret-down.vue'
import IconMinus from '@/components/icon/icon-minus.vue'

// Tienda global
const store = useAppStore()
const { navigation } = useNavigation()

const route = useRoute()
const sidebarWidth = ref(260)

// Ruta actual reactiva
const currentPath = computed(() => route.path)

const activeDropdown = ref<string | null>(null)

const toggleDropdown = (name: string) => {
  activeDropdown.value = activeDropdown.value === name ? null : name
}

const toggleMobileMenu = () => {
  if (window.innerWidth < 1024) {
    store.toggleSidebar()
  }
}

// Carga inicial
onMounted(() => {
    const sidebar = document.querySelector('.sidebar')

  if (sidebar) {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        sidebarWidth.value = entry.contentRect.width
      }
    })
    observer.observe(sidebar)
  }
  const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]')
  if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
})

// Resolver íconos dinámicamente
const resolveIcon = (iconName: string) => {
  try {
    return defineAsyncComponent(() => import(`@/components/icon/menu/${iconName}.vue`))
  } catch {
    return null
  }
}
</script>