import { Mail, User, Zap, Send } from "lucide-react";
import {
  asanaIcon,
  // athonLogo,
  // client_1,
  // client_2,
  // client_3,
  // client_4,
  // discord,
  // dribble,
  // dribbleIcon,
  // facebook,
  // figmaIcon,
  // framerIcon,
  // graphicDesignIcon,
  instagramIcon,
  linkedInIcon,
  // notionIcon,
  // pinterest,
  // pixelworksLogo,
  // project_1,
  // project_2,
  // project_3,
  // project_4,
  seoOptIcon,
  // slackIcon,
  // snapchat,
  // spotify,
  // vortexLogo,
  webDesignIcon,
  webDevIcon,
  // webflowIcon,
  // XLogo,
  dfnLogo,
  businessAdminSnap,
  ssimpexSnap
} from "@/utils/assets";
import { Github, Instagram, Linkedin, FileUser as CV } from 'lucide-react'

import { counterListsType, FAQ, FollowerData, myExperienceTypes, myServicesPlansTypes, myServicesTypes, myShowCasesTypes, myStackTypes, heroType, socialBrandsTypes, testimonialsTypes } from "@/types";
import { socialListsTypes } from '@/types'
import { pagesListsType } from "@/types";
import { triggerTemplateEmail } from "@/utils/helpers";

const EMAIL = "chethiya.code@gmail.com";

export const hero: heroType = {
  name: "Chethiya Nuwan",
  intro: "Passionate about creating efficient, user-focused solutions. I specialize in scalable applications, performance optimization, and seamless user experiences, leveraging technology to solve dynamic challenges.",
  image: "profile.png",
  primaryButton: {
    title: "Download CV",
    href: "/docs/cv_SE.pdf",
    icon: <CV size={18}/>,
    target: "_blank",
    download: "Chethiya Hitihamu_SE.pdf",
    type: "application/pdf",
  },
  secondaryButton: {
    title: "Contact Me",
    onClick: () => triggerTemplateEmail(EMAIL),
    icon: <Send size={18}/>,
  },
}

export const pagesLists: pagesListsType[] = [
  {
    id: 1,
    title: "Home",
    href: "/",
    icon: <User />,
  },
  {
    id: 2,
    title: "Services",
    href: "/services",
    icon: <Zap />,
  },
  {
    id: 3,
    title: "Contact",
    href: "/contact",
    icon: <Send />,
  },
];

export const socialLists: socialListsTypes[] = [
  
  {
    id: 1,
    title: 'Github',
    icon: <Github size={22} />,
    link: 'https://www.github.com/ChethiyaNuwan'
  },
  {
    id: 3,
    title: 'LinkedIn',
    icon: <Linkedin size={22} />,
    link: 'https://www.linkedin.com/in/chethiyahitihamu/'
  },
  {
    id: 2,
    title: 'Instagram',
    icon: <Instagram size={22} />,
    link: 'https://www.instagram.com/chethiya.nuwan/'
  },
]

export const socialBrands: socialBrandsTypes[] = [
  // {
  //   id: 1,
  //   name: "Discord",
  //   icon: discord,
  //   link: "#",
  // },
  // {
  //   id: 2,
  //   name: "Dribbble",
  //   icon: dribble,
  //   link: "#",
  // },
  // {
  //   id: 3,
  //   name: "Facebook",
  //   icon: facebook,
  //   link: "#",
  // },
  // {
  //   id: 4,
  //   name: "Pinterest",
  //   icon: pinterest,
  //   link: "#",
  // },
  // {
  //   id: 5,
  //   name: "SnapChat",
  //   icon: snapchat,
  //   link: "#",
  // },
  // {
  //   id: 6,
  //   name: "Spotify",
  //   icon: spotify,
  //   link: "#",
  // },
];

export const counterLists: counterListsType[] = [
  {
    id: 1,
    title: "Projects Contributed",
    value: 20,
  },
  {
    id: 2,
    title: "Year of Experience",
    value: 3,
  },
  {
    id: 3,
    title: "Technologies Used",
    value: 40,
  },
  {
    id: 4,
    title: "Total Contributions",
    value: 900,
  },
];

export const myExperience: myExperienceTypes[] = [
  {
    id: 1,
    year: "Jan 2023 - Jun 2023",
    title: "Software Engineer Intern",
    company: "DirectFn",
    label: 'FinTech',
    description: "Developed two key projects from ground up as part of the Market Data Backend team: (1) MarketData Update Checker – an internal testing tool using React, Redux, and WebSocket to visualize DirectFN's market data streams; and (2) MBE API Portal – a role-based API documentation platform built with Docusaurus and React, featuring a Bun.js backend with Prisma ORM and PostgreSQL, session management via cookies, and Dockerized deployment.",
    link: "https://directfn.lk",
    logo: dfnLogo
  },
]

export const myStack: myStackTypes[] = [
  {
    id: 1,
    title: "C, C++",
    description: "Programming Language",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 2,
    title: "C#",
    description: "Programming Language",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 3,
    title: "Java",
    description: "Programming Language",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 4,
    title: "Python",
    description: "Programming Language",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 5,
    title: "JS, TS",
    description: "Programming Language",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 6,
    title: "React, Next",
    description: "Frontend Development",
    logo: asanaIcon,
    link:  "#",
  },
  {
    id: 7,
    title: "Node, Express",
    description: "Backend Development",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 8,
    title: "Bun, Hono",
    description: "Backend Development",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 9,
    title: "Prisma, Mongoose",
    description: "ORM",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 10,
    title: "MSSQL, PostgreSQL",
    description: "Database",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 11,
    title: "Docker",
    description: "Containerization",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 12,
    title: "MongoDB",
    description: "Database",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 13,
    title: "AWS, GCP",
    description: "Cloud Services",
    logo: asanaIcon,
    link: "#",
  },
  {
    id: 14,
    title: "Figma",
    description: "Design Tool",
    logo: asanaIcon,
    link: "#",
  },
]

export const myServices: myServicesTypes[] = [
  {
    id: 1,
    title: 'Web Design',
    description: 'Crafting visually captivating and user-friendly websites for online success.',
    icon: webDesignIcon,
    link: '/services'
  },
  {
    id: 2,
    title: 'Web Development',
    description: 'Bringing ideas to life with robust and scalable web solutions.',
    icon: webDevIcon,
    link: '/services'
  },
  {
    id: 3,
    title: 'Mobile App Development',
    description: 'Creating engaging and user-friendly mobile applications for seamless user experience.',
    icon: seoOptIcon,
    link: '/services'
  }
]

export const myShowCases: myShowCasesTypes[] = [
  {
    id: 1,
    title: 'Business Admin Web App',
    description: 'A comprehensive business management platform with features like inventory, sales, and reporting.',
    link: 'asenterprise.site',
    type: 'Business',
    theme: 'Multi',
    pages: 10,
    image: businessAdminSnap,
  },
  {
    id: 2,
    title: 'Supermarket E-Commerce Web App',
    description: 'An online marketplace for grocery and household items.',
    link: 'ssimpex.stencoitsolutions.com',
    type: 'E-Commerce',
    theme: 'Single',
    pages: 10,
    image: ssimpexSnap,
  },
]

export const testimonials: testimonialsTypes[] = []

export const myServicesPlans: myServicesPlansTypes[] = [
  {
    id: 1,
    service: 'Mobile Dev',
    price: '',
    description: 'Creating engaging and user-friendly mobile applications for seamless user experience.',
    completedWorks: '2+',
    experience: '2+',
    totalHoursWorked: '',
    icon: webDesignIcon,
  },
  {
    id: 2,
    service: 'Web Dev',
    price: '',
    description: 'Bringing ideas to life with robust and scalable web solutions.',
    completedWorks: '20+',
    experience: '3+',
    totalHoursWorked: '',
    icon: webDevIcon,
  },
];

export const faqData: FAQ[] = [
  {
    question: "Can you work with clients remotely?",
    answer: "Absolutely! I have experience working with clients from all around the world. Through effective communication channels such as email, video calls, and project management tools, I ensure seamless collaboration regardless of geographical location.",
  },
  {
    question: "Will my website be mobile-friendly?",
    answer: "Absolutely! Mobile responsiveness is a top priority in today's digital landscape. I design and develop websites that are fully responsive and adaptable to various devices and screen sizes. Your website will provide an optimal user experience whether accessed via desktops, smartphones, or tablets.",
  },
  {
    question: "How long does it typically take to complete a project?",
    answer: "The timeline for each project varies depending on its scope and complexity. Factors such as the number of pages, functionalities, and the client feedback process can impact the timeline. Upon discussing your project requirements, I will provide you with a realistic timeline and keep you updated throughout the process.",
  },
  {
    question: "Can you integrate third-party tools into my website?",
    answer: "Yes, I have experience integrating various third-party tools, plugins, and platforms into websites. Whether you need to integrate e-commerce functionalities, social media integration, email marketing services, or anything else, I can recommend and help ensure smooth integration.",
  },
  {
    question: "Do you offer website maintenance?",
    answer: "Yes, I offer website maintenance services to ensure your website remains up to date, secure, and optimized. From performance updates to adding new features and content, I can provide ongoing support to keep your website running smoothly.",
  },
  {
    question: "How do you handle website revisions?",
    answer: "I value your input and collaboration throughout the design process. Upon completing an initial design, I encourage you to provide feedback. I incorporate your suggestions and revisions to ensure the final product aligns with your vision.",
  },
  {
    question: "Can you optimize my website?",
    answer: "Certainly! I incorporate search engine optimization (SEO) best practices into my development process. This includes using relevant keywords, optimizing meta tags, creating search-engine-friendly URLs, and ensuring your website has a solid foundation for better search engine visibility.",
  },
  // {
  //   question: "What are your payment terms?",
  //   answer: "Payment terms may vary depending on the project scope and duration. Generally, I request an initial deposit before commencing work.",
  // },
];

export const followerData: FollowerData[] = [
  {
    platform: "LinkedIn",
    followers: "150+",
    url: "https://www.linkedin.com/",
    icon: linkedInIcon,
  },
  {
    platform: "Instagram",
    followers: "150+",
    url: "https://www.instagram.com/",
    icon: instagramIcon,
  },
];