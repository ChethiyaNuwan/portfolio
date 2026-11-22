import { Github, Instagram, Linkedin, Mail, Newspaper, User, Zap, Send } from "lucide-vue-next";

export const socialIconMap = { github: Github, linkedin: Linkedin, instagram: Instagram, newspaper: Newspaper, mail: Mail } as const;

// Fixed site navigation (not admin-editable)
export const navPages = [
  { id: 1, title: "Home", href: "/", icon: User },
  { id: 2, title: "Services", href: "/services", icon: Zap },
  { id: 3, title: "Contact", href: "/contact", icon: Send },
];
