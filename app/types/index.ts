import type { Component } from "vue";

export interface ButtonType {
  icon?: Component;
  iconSize?: number;
  title: string;
  onClick?: () => void;
  position?: "left" | "right";
  href?: string;
  className?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  download?: boolean | string;
  type?: string;
}

export interface heroType {
  name: string;
  intro: string;
  image: string;
  primaryButton: ButtonType;
  secondaryButton: ButtonType;
}

export interface pagesListsType {
  id: number;
  title: string;
  href: string;
  icon: Component;
  iconSize?: number;
}

export interface socialListsTypes {
  id: number;
  title: string;
  icon: Component;
  iconSize?: number;
  link: string;
}

export interface socialBrandsTypes {
  id: number;
  name: string;
  icon: string;
  link: string;
}

export interface counterListsType {
  id: number;
  title: string;
  value: number;
}

export interface myExperienceTypes {
  id: number;
  year: string;
  title: string;
  company: string;
  label?: string[];
  description: string;
  link?: string;
  logo: string;
}

export interface myStackTypes {
  id: number;
  title: string;
  description: string;
  logo: string;
  link: string;
}

export interface myServicesTypes {
  id: number;
  title: string;
  description: string;
  icon: string;
  link: string;
}
export interface myShowCasesTypes {
  id: number;
  title: string;
  description: string;
  link: string;
  type: string;
  theme: string;
  pages: number;
  image: string;
}

export interface testimonialsTypes {
  id: number;
  name: string;
  description: string;
  location: string;
  avatar: string;
}

export interface myServicesPlansTypes {
  id: number;
  service: string;
  price: string;
  description: string;
  completedWorks: string;
  experience: string;
  totalHoursWorked: string;
  icon: string;
}

export type FAQ = {
  question: string;
  answer: string;
};

export interface FollowerData {
  platform: string;
  followers: string;
  url: string;
  icon: string;
}
