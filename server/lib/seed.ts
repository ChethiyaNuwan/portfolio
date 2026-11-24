import type { Content } from "./schemas";

// Initial content (the profile email comes from SEED_PROFILE_EMAIL; edit it later in the admin), seeded into the database on first run (generated from the original static data).
export const seedContent: Content = {
  "profile": {
    "name": "Chethiya Nuwan",
    "title": "Fullstack Engineer",
    "intro": "Passionate about creating efficient, user-focused solutions. I specialize in scalable applications, performance optimization, and seamless user experiences, leveraging technology to solve dynamic challenges.",
    "email": process.env.SEED_PROFILE_EMAIL?.trim() || "hello@example.com",
    "avatar": "/profile.jpg",
    "avatarMobile": "",
    "marquee": [],
    "phone": "",
    "location": ""
  },
  "counters": [
    {
      "id": "1",
      "title": "Projects Contributed",
      "value": 25
    },
    {
      "id": "2",
      "title": "Year of Experience",
      "value": 4
    },
    {
      "id": "3",
      "title": "Technologies Used",
      "value": 40
    },
    {
      "id": "4",
      "title": "Total Contributions",
      "value": 1900
    }
  ],
  "experience": [
    {
      "id": "1",
      "year": "2025 - Present",
      "startYear": 2025,
      "startMonth": 0,
      "endYear": 2025,
      "endMonth": 0,
      "present": true,
      "showMonth": false,
      "title": "Fullstack Engineer",
      "company": "Invadraw",
      "labels": [
        "Investment Planning"
      ],
      "description": "I am employed as a fullstack engineer, developing and maintaining both frontend and backend components of the Invadraw investment planning platform. My responsibilities include designing user interfaces, implementing server-side logic, and ensuring seamless integration between various system components. I work closely with cross-functional teams to deliver high-quality software solutions that meet user needs and business objectives.",
      "link": "invadraw.com",
      "logo": "/invadraw.svg"
    },
    {
      "id": "2",
      "year": "2022 - Present",
      "startYear": 2022,
      "startMonth": 0,
      "endYear": 2022,
      "endMonth": 0,
      "present": true,
      "showMonth": false,
      "title": "Fullstack Developer",
      "company": "Freelancer",
      "labels": [
        "Web Development",
        "Mobile Development",
        "Custom Software Solutions"
      ],
      "description": "I contribute as a lead developer in architecting and developing multiple projects, consistently delivering scalable, efficient, and user-friendly applications tailored to client needs. My role involved overseeing end-to-end development processes, including requirements gathering, system design and development, infrastructure management, and deployment to production environments. By following Agile methodologies and leveraging expertise in SQL and NoSQL databases, I provided robust and maintainable solutions that effectively addressed complex technical challenges and delivered significant business value.",
      "link": "/services#showcase",
      "logo": "/freelancer.png"
    },
    {
      "id": "3",
      "year": "Jan 2023 - Jun 2023",
      "startYear": 2023,
      "startMonth": 1,
      "endYear": 2023,
      "endMonth": 6,
      "present": false,
      "showMonth": true,
      "title": "Software Engineer Intern",
      "company": "DirectFn",
      "labels": [
        "FinTech"
      ],
      "description": "Developed two key projects from ground up as part of the Market Data Backend team: (1) MarketData Update Checker – an internal testing tool using React, Redux, and WebSocket to visualize DirectFN's market data streams; and (2) MBE API Portal – a role-based API documentation platform built with Docusaurus and React, featuring a Bun.js backend with Prisma ORM and PostgreSQL, session management via cookies, and Dockerized deployment.",
      "link": "directfn.lk",
      "logo": "/dfn-logo.jpg"
    }
  ],
  "stack": [
    {
      "id": "1",
      "title": "C, C++",
      "description": "Programming Language",
      "logo": "/cpp.png",
      "link": "#"
    },
    {
      "id": "2",
      "title": "C#",
      "description": "Programming Language",
      "logo": "/cs.png",
      "link": "#"
    },
    {
      "id": "3",
      "title": "Java",
      "description": "Programming Language",
      "logo": "/java.png",
      "link": "#"
    },
    {
      "id": "4",
      "title": "Python",
      "description": "Programming Language",
      "logo": "/python.png",
      "link": "#"
    },
    {
      "id": "5",
      "title": "JS",
      "description": "Programming Language",
      "logo": "/js.png",
      "link": "#"
    },
    {
      "id": "6",
      "title": "TS",
      "description": "Programming Language",
      "logo": "/ts.png",
      "link": "#"
    },
    {
      "id": "7",
      "title": "React",
      "description": "Frontend Development",
      "logo": "/react.png",
      "link": "#"
    },
    {
      "id": "8",
      "title": "Next",
      "description": "Frontend Development",
      "logo": "/next.svg",
      "link": "#"
    },
    {
      "id": "9",
      "title": "Node",
      "description": "Backend Development",
      "logo": "/node.png",
      "link": "#"
    },
    {
      "id": "10",
      "title": "Express",
      "description": "Backend Development",
      "logo": "/express.svg",
      "link": "#"
    },
    {
      "id": "11",
      "title": "Bun",
      "description": "Backend Development",
      "logo": "/bun.svg",
      "link": "#"
    },
    {
      "id": "12",
      "title": "Hono",
      "description": "Backend Development",
      "logo": "/hono.png",
      "link": "#"
    },
    {
      "id": "13",
      "title": ".Net",
      "description": "Backend Development",
      "logo": "/net.svg",
      "link": "#"
    },
    {
      "id": "14",
      "title": "Spring Boot",
      "description": "Backend Development",
      "logo": "/spring.svg",
      "link": "#"
    },
    {
      "id": "15",
      "title": "Prisma",
      "description": "ORM",
      "logo": "/prisma.svg",
      "link": "#"
    },
    {
      "id": "16",
      "title": "Mongoose",
      "description": "ORM",
      "logo": "/mongoose.svg",
      "link": "#"
    },
    {
      "id": "17",
      "title": "MSSQL",
      "description": "Database",
      "logo": "/mssql.svg",
      "link": "#"
    },
    {
      "id": "18",
      "title": "PostgreSQL",
      "description": "Database",
      "logo": "/postgres.svg",
      "link": "#"
    },
    {
      "id": "19",
      "title": "MongoDB",
      "description": "Database",
      "logo": "/mongo.svg",
      "link": "#"
    },
    {
      "id": "20",
      "title": "Docker",
      "description": "Containerization",
      "logo": "/docker.svg",
      "link": "#"
    },
    {
      "id": "21",
      "title": "Firebase",
      "description": "Cloud Services",
      "logo": "/firebase.svg",
      "link": "#"
    },
    {
      "id": "22",
      "title": "Figma",
      "description": "Design Tool",
      "logo": "/figma.svg",
      "link": "#"
    }
  ],
  "services": [
    {
      "id": "1",
      "title": "Web Design",
      "description": "Crafting visually captivating and user-friendly websites for online success.",
      "icon": "/web-design.svg",
      "link": "/services"
    },
    {
      "id": "2",
      "title": "Web Development",
      "description": "Bringing ideas to life with robust and scalable web solutions.",
      "icon": "/web-dev.svg",
      "link": "/services"
    },
    {
      "id": "3",
      "title": "Mobile App Development",
      "description": "Creating engaging and user-friendly mobile applications for seamless user experience.",
      "icon": "/seo-opt.svg",
      "link": "/services"
    }
  ],
  "plans": [
    {
      "id": "1",
      "service": "Mobile Dev",
      "description": "Creating engaging and user-friendly mobile applications for seamless user experience.",
      "completedWorks": "3+",
      "experience": "2+",
      "icon": "/web-design.svg"
    },
    {
      "id": "2",
      "service": "Web Dev",
      "description": "Bringing ideas to life with robust and scalable web solutions.",
      "completedWorks": "20+",
      "experience": "4+",
      "icon": "/web-dev.svg"
    }
  ],
  "projects": [
    {
      "id": "1",
      "title": "Cloud POS System Admin Panel",
      "description": "A comprehensive business management platform with features like inventory, sales, and reporting.",
      "link": "demo.crystalbiz.site",
      "type": "Business",
      "theme": "Multi",
      "pages": 10,
      "image": "/business-admin.png",
        "tags": ["Business", "Dashboard"],
        "gallery": [],
        "stack": ["7", "6", "9", "18"]
    },
    {
      "id": "2",
      "title": "Tour Booking Web App",
      "description": "A web app that handles tour bookings inquiries of customers and send emails.",
      "link": "www.dreamers-travel-uk.com",
      "type": "Booking",
      "theme": "Single",
      "pages": 10,
      "image": "/dtuk.png",
        "tags": ["Booking", "Travel"],
        "gallery": [],
        "stack": ["8", "6", "15", "18"]
    },
    {
      "id": "3",
      "title": "Supermarket E-Commerce Web App",
      "description": "An online marketplace for grocery and household items.",
      "link": "ssimpex.stencoitsolutions.com",
      "type": "E-Commerce",
      "theme": "Single",
      "pages": 10,
      "image": "/ssimpex.png",
        "tags": ["E-Commerce", "Retail"],
        "gallery": [],
        "stack": ["7", "5", "9", "19"]
    }
  ],
  "sections": [
    { "id": "intro", "label": "Intro", "visible": true },
    { "id": "work", "label": "Projects", "visible": true },
    { "id": "experience", "label": "Experience", "visible": true },
    { "id": "stack", "label": "Stack", "visible": true },
    { "id": "services", "label": "Services", "visible": true },
    { "id": "contact", "label": "Contact", "visible": true }
  ],
  "theme": {
    "accentDark": "#6f8bff",
    "accentLight": "#2447ff"
  },
  "education": [],
  "faq": [
    {
      "id": "1",
      "question": "Can you work with clients remotely?",
      "answer": "Absolutely! I have experience working with clients from all around the world. Through effective communication channels such as email, video calls, and project management tools, I ensure seamless collaboration regardless of geographical location."
    },
    {
      "id": "2",
      "question": "Will my website be mobile-friendly?",
      "answer": "Absolutely! Mobile responsiveness is a top priority in today's digital landscape. I design and develop websites that are fully responsive and adaptable to various devices and screen sizes. Your website will provide an optimal user experience whether accessed via desktops, smartphones, or tablets."
    },
    {
      "id": "3",
      "question": "How long does it typically take to complete a project?",
      "answer": "The timeline for each project varies depending on its scope and complexity. Factors such as the number of pages, functionalities, and the client feedback process can impact the timeline. Upon discussing your project requirements, I will provide you with a realistic timeline and keep you updated throughout the process."
    },
    {
      "id": "4",
      "question": "Can you integrate third-party tools into my website?",
      "answer": "Yes, I have experience integrating various third-party tools, plugins, and platforms into websites. Whether you need to integrate e-commerce functionalities, social media integration, email marketing services, or anything else, I can recommend and help ensure smooth integration."
    },
    {
      "id": "5",
      "question": "Do you offer website maintenance?",
      "answer": "Yes, I offer website maintenance services to ensure your website remains up to date, secure, and optimized. From performance updates to adding new features and content, I can provide ongoing support to keep your website running smoothly."
    },
    {
      "id": "6",
      "question": "How do you handle website revisions?",
      "answer": "I value your input and collaboration throughout the design process. Upon completing an initial design, I encourage you to provide feedback. I incorporate your suggestions and revisions to ensure the final product aligns with your vision."
    },
    {
      "id": "7",
      "question": "Can you optimize my website?",
      "answer": "Certainly! I incorporate search engine optimization (SEO) best practices into my development process. This includes using relevant keywords, optimizing meta tags, creating search-engine-friendly URLs, and ensuring your website has a solid foundation for better search engine visibility."
    }
  ],
  "socials": [
    {
      "id": "1",
      "title": "Github",
      "icon": "github",
      "link": "https://www.github.com/ChethiyaNuwan"
    },
    {
      "id": "2",
      "title": "LinkedIn",
      "icon": "linkedin",
      "link": "https://www.linkedin.com/in/chethiyahitihamu/"
    },
    {
      "id": "3",
      "title": "Blogging",
      "icon": "newspaper",
      "link": "https://www.medium.com/@chethiya.code"
    },
    {
      "id": "4",
      "title": "Instagram",
      "icon": "instagram",
      "link": "https://www.instagram.com/chethiya.nuwan/"
    }
  ],
  "settings": {
    "cvMode": "generated",
    "cvUploadUrl": null
  }
};
