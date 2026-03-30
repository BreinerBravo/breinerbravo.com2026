// src/composables/use-navigation.ts
import { computed } from 'vue'
import type { NavItem } from '@/types/navigation'

import { getCvNav } from '@/const/cv-navigation'

export function useNavigation() {
  // Ejemplo de estructura dinámica por rol
  const defaultMenu: NavItem[] = [
      { type: 'header', title: 'General' },
      {
          type: 'link',
          title: 'Inicio',
          icon: 'icon-menu-dashboard',
          to: '/',
        },
    ]

  const navigation = computed<NavItem[]>(() => {
    return  getCvNav()
  })

  return { navigation }
}
