import type { NavItem } from '@/types/navigation'

export const getCvNav = (): NavItem[] => [
    {
        type: 'link',
        title: 'Inicio',
        icon: 'icon-menu-widget',
        to: '/dashboard/admin',
    },


    { type: 'header', title: 'Actividades' },

     

      {
        type: 'link',
        title: 'Sobre mi',
        icon: 'icon-menu-user',
        to: `/cliente/contacto/me`,
    },
     
    {
        type: 'link',
        title: 'Servicios',
        icon: 'icon-menu-box-minimalistic',
        to: `/cliente/anexo/me`,
    },

      {
        type: 'link',
        title: 'curriculum',
        icon: 'icon-menu-documentation',
        to: `/cliente/consultorias/me`,
    },

       {
        type: 'link',
        title: 'Portafolio',
        icon: 'icon-menu-suitcase',
        to: `/cliente/formularios/me`,
    },

    {
        type: 'link',
        title: 'Contactame',
        icon: 'icon-menu-hand-shake',
        
        to: `/cliente/anexo/me`,
    },

// import iconBook from '../icon/icon-book.vue'

];
          