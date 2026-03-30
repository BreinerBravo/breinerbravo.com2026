// src/types/navigation.d.ts

export interface NavItem {
  title: string;
  to?: string;
  icon?: string | any;
  type?: 'link' | 'header' | 'collapsible';
  children?: NavItem[];
  roles?: string[]; // Opcional: restringe acceso por rol
  disabled?: boolean;
}
