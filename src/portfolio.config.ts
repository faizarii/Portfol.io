/**
 * Portfolio Template Configuration
 * 
 * Customize all text, links, social channels, photo, and layout options below.
 */

import type { GalleryItem } from './components/ui/DragGallery';

export interface SocialLink {
  name: string;
  handle: string;
  url: string;
  icon: 'github' | 'linkedin' | 'instagram' | 'x' | 'discord' | 'mail' | 'link';
  copyable?: boolean;
}

export interface PortfolioConfig {
  ctaButton: {
    label: string;
    actionType: 'download' | 'modal' | 'link' | 'email';
    fileUrl?: string;
    downloadFileName?: string;
    link?: string;
    email?: string;
  };
  navLinks: Array<{
    label: string;
    url: string;
    isExternal?: boolean;
  }>;
  hero: {
    firstName: string; // e.g. "Faiz Ari"
    lastName: string;  // e.g. "Fadhilah"
    // Optional: add 3rd line if you prefer 3 separate lines
    thirdLine?: string;
  };
  avatar: {
    // Set to your photo path or URL (e.g., '/avatar.jpg' or 'https://...')
    // Leave empty ('') to show the sleek minimalist photo placeholder
    imageSrc: string;
    alt: string;
    // Position options: 'left' | 'bottom-right' | 'offset-right' | 'bottom-center' | 'hidden'
    position: 'left' | 'bottom-right' | 'offset-right' | 'bottom-center' | 'hidden';
  };
  lens: {
    enabled: boolean;
    size: number; // in pixels (e.g. 52)
  };
  footer: {
    leftText: {
      line1: string;
      line2: string;
    };
    rightText: {
      line1: string;
      line2: string;
    };
  };
  about: {
    heading: string;
    paragraphs: string[];
    focusAreas?: string[];
    gallery: GalleryItem[];
  };
  experiences: {
    heading: string;
    subtitle: string;
    items: ExperienceItem[];
  };
  projects: {
    heading: string;
    subtitle: string;
    items: ProjectItem[];
  };
  contactModal: {
    title: string;
    subtitle: string;
    email: string;
    socials: SocialLink[];
  };
}

export interface ProjectItem {
  title: string;
  description: string;
  year: string;
  link: string;
  image: string;
  category?: string;
  fullDescription?: string;
  techStack?: string[];
  highlights?: string[];
  gallery?: string[];
  githubUrl?: string;
}

export interface ExperienceItem {
  id: number;
  timelineLabel: string;
  role: string;
  organization: string;
  organizationUrl?: string;
  period: string;
  location?: string;
  description: string;
  highlights?: string[];
  skills?: string[];
  images?: Array<{
    src: string;
    alt: string;
  }>;
}

export const portfolioConfig: PortfolioConfig = {
  // Top-left Call to Action Button (Instant CV Download)
  ctaButton: {
    label: 'DOWNLOAD CV',
    actionType: 'download',
    fileUrl: '/Faiz_CV.pdf',
    downloadFileName: 'Faiz_Ari_Fadhilah_CV.pdf',
  },

  // Top-right Navigation Links
  navLinks: [
    {
      label: 'Home',
      url: '#hero',
    },
    {
      label: 'About',
      url: '#about',
    },
    {
      label: 'Experiences',
      url: '#experience',
    },
    {
      label: 'Projects',
      url: '#projects',
    },
  ],

  // Main Massive Display Name
  hero: {
    firstName: 'FAIZ ARI',
    lastName: 'FADHILAH',
  },

  // Interactive Inverting Lens (Cursor Follower)
  lens: {
    enabled: true,
    size: 56, // Cursor lens size in px
  },

  // Photo Container / Avatar Card
  avatar: {
    // Reference file from public folder as '/avatar.jpg' or an external URL
    imageSrc: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788253366/avatar.jpg',
    alt: 'Faiz Ari Fadhilah profile picture',
    position: 'left', // 'left' | 'bottom-right' | 'offset-right' | 'bottom-center' | 'hidden'
  },

  // Bottom Metadata
  footer: {
    leftText: {
      line1: 'Undergraduate Student from BINUS University,',
      line2: 'majoring in Computer Science.',
    },
    rightText: {
      line1: 'Focused on Web Development,',
      line2: 'Machine Learning, and AI Engineering.',
    },
  },

  // About Me Section
  about: {
    heading: 'WHO AM I?',
    paragraphs: [
      'Hello, World! I\'m Faiz Ari Fadhilah, a Computer Science undergraduate at BINUS University. I have a strong interest in breaking down complex problems and turning them into practical, working systems.',
      'My main focus lies in Web Development, Machine Learning, and AI Engineering. I enjoy building reliable web applications and exploring how to integrate intelligent, data-driven features into them. I\'ve also competed in hackathons, which gave me hands-on experience in architecting software solutions and collaborating effectively under tight deadlines.',
      'Outside of my personal projects, I was actively involved in HIMTI, our campus computer science organization. During my time there, my main division was Web Development, though I also regularly stepped up as operational and logistics staff for various events. This experience gave me a solid balance between writing code and managing the technical execution behind the scenes.',
    ],
    focusAreas: [
      'React & Next.js',
      'TypeScript',
      'Python',
      'PyTorch',
      'Machine Learning',
      'AI Engineering',
      'Deep Learning',
    ],
    gallery: [
      { id: 1, image: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788246800/gallery-1.jpg' },
      { id: 2, image: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788246876/gallery-2.jpg' },
      { id: 3, image: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788246800/gallery-3.jpg' },
      { id: 4, image: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788246876/gallery-4.jpg' },
    ],
  },

  // Experiences & Timeline Section
  experiences: {
    heading: 'EXPERIENCES',
    subtitle: 'A timeline of experiences that shaped me into who I am today.',
    items: [
      {
        id: 1,
        timelineLabel: 'Mar 2025 — Dec 2025',
        role: 'Equipment, Transportation, and Technical Staff',
        organization: 'HIMTI BINUS University',
        period: 'Mar 2025 — Dec 2025',
        location: 'Jakarta, Indonesia',
        description: 'Assisted in managing equipment logistics, transportation, and on-site technical setups across multiple HIMTI events. Ensured smooth operations by coordinating physical resources, deploying necessary hardware, and providing real-time troubleshooting behind the scenes.',
        highlights: [
          'Managed equipment logistics and coordinated transportation across multiple events.',
          'Executed on-site technical setups and deployed necessary hardware.',
          'Provided real-time troubleshooting to ensure seamless event operations.',
        ],
        skills: ['Technical Support', 'Communication', 'Time Management'],
        images: [
          { src: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788246800/gallery-1.jpg', alt: 'HISHOT 2025' },
          { src: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788246800/gallery-3.jpg', alt: 'HILET 2025' },
        ],
      },
      {
        id: 2,
        timelineLabel: 'May 2026 — Jun 2026',
        role: 'AI/ML Engineer',
        organization: 'TechnoScape x AD-INS Hackathon',
        period: 'May 2026 — Jun 2026',
        location: 'BINUS University, Jakarta',
        description: 'Developed VolumeMate, an agricultural procurement PWA for TechnoScape 2026. Built its Python/FastAPI AI engine featuring an 80%+ accurate Gradient Boosting demand forecaster and a weather-driven algorithm to optimize bulk purchase timing and costs.',
        highlights: [
          'TechnoScape 2026 Hackathon Finalist for developing VolumeMate, a mobile-first agricultural procurement PWA.',
          'Built the backend AI engine and deployed a model with >80% accuracy for demand forecasting.',
          'Engineered a custom algorithm integrating weather data to optimize bulk purchase costs and procurement timelines.',
        ],
        skills: ['Problem Solving', 'AI/ML', 'Time Management'],
        images: [
          { src: 'https://res.cloudinary.com/iaurmiih/image/upload/f_auto,q_auto/image22', alt: 'Hackathon Documentation' },
          { src: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788246663/hackathon-certificate.jpg', alt: 'Hackathon Certificate' },
        ],
      },
      {
        id: 3,
        timelineLabel: 'Sep 2026 — Dec 2026',
        role: 'Venture Creation',
        organization: 'BINUS University',
        period: 'Sep 2026 — Dec 2026',
        description: 'This section is currently a placeholder for upcoming venture creation, startup methodologies, and technical milestones that are currently in progress. Detailed project highlights and documentation will be updated here soon.',
        highlights: [
          'Upcoming Venture Milestone: Currently exploring lean startup methodologies and building early-stage prototypes.',
          'Placeholder Entry: Detailed case studies, technical achievements, and media will be published here upon completion.',
        ],
        skills: ['In Progress', 'Coming Soon', 'Ideation', 'Prototyping', 'Product Design'],
        images: [
          { src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80', alt: 'Venture Creation In Progress' },
        ],
      },
    ],
  },

  // Projects / Selected Work Section
  projects: {
    heading: 'MY PROJECTS',
    subtitle: 'A curation of software systems, AI pipelines, and interactive digital products.',
    items: [
      {
        title: 'Colr',
        description: 'Deep Learning image colorization using Pix2Pix cGAN.',
        year: '2025',
        link: 'https://colr-ai.streamlit.app/',
        githubUrl: 'https://github.com/faizarii/Colr',
        category: 'Deep Learning',
        image: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788247121/Screenshot_2026-09-01_141805.png',
        fullDescription:
          'Colr is an automatic deep learning image colorization system that converts grayscale photos into realistic color images using a Pix2Pix cGAN architecture. Built with PyTorch and leveraging a pre-trained ResNet-18 backbone for semantic feature extraction, the model accurately predicts context-aware colors across complex scenes. The entire pipeline is deployed through an interactive Streamlit web application, allowing users to run inference and view side-by-side before-and-after comparisons instantly.',
        techStack: [
          'Python',
          'PyTorch',
          'Torchvision',
          'Streamlit',
          'Pix2Pix',
          'Scikit-Image',
          'Numpy',
        ],
        highlights: [
          'Pix2Pix cGAN Architecture: Frames colorization as an image-to-image translation task to predict realistic colors from grayscale inputs.',
          'ResNet-18 Transfer Learning: Leverages a pre-trained encoder to extract deep semantic context (sky, skin, landscapes) for accurate color choices.',
          'Interactive Web Pipeline: Connects PyTorch inference to a Streamlit UI for real-time, side-by-side visual comparisons.',
        ],
        gallery: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
        ],
      },
      {
        title: 'Particle Toggler',
        description: 'Client-side Minecraft mod to easily toggle all particle and weather effects.',
        year: '2024',
        link: 'https://modrinth.com/mod/particle-toggler',
        githubUrl: 'https://github.com/faizarii/Particle-Toggler',
        category: 'Java',
        image: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788247819/Screenshot_2026-08-19_113922.png',
        fullDescription:
          'Particle Toggler is a client-side Minecraft performance and customization mod built in Java using the Fabric API and Mixins to give players granular control over in-game visual clutter. It allows users to selectively toggle every particle type and weather element in the game—including rain, snow, splashes, thunder audio, and storm fog—either individually or in bulk. Featuring a responsive, tabbed in-game GUI with real-time search, interactive chat commands with tab auto-completion, and automatic JSON configuration persistence, the mod enhances FPS and visibility while maintaining a clean, native user experience.',
        techStack: [
          'Java',
          'Fabric API',
          'Gradle',
          'Mixins',
        ],
        highlights: [
          'Low-Level Rendering Hooks: Used Mixins to intercept client rendering and audio pipelines for zero-overhead particle and weather culling.',
          'Custom GUI with Live Search: Built a tabbed in-game UI featuring real-time filtering across the entire particle registry.',
          'Synchronized State & Persistence: Linked GUI controls to auto-completing chat commands (/particledisabler) with automatic JSON config saves.',
        ],
        gallery: [
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1000&auto=format&fit=crop',
        ],
      },
      {
        title: 'ShipDecKK',
        description: 'Responsive static website showcasing luxury maritime vessels.',
        year: '2023',
        link: 'https://faizarii.github.io/ShipDecKK/',
        githubUrl: 'https://github.com/faizarii/ShipDecKK',
        category: 'Web Development',
        image: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788248427/Screenshot_2026-09-01_144004.png',
        fullDescription:
          'ShipDecKK is a responsive multi-page web template designed to showcase luxury and commercial maritime vessels, including yachts, cargo ships, and cruise liners. Built using semantic HTML5, custom CSS3, and vanilla JavaScript, the site features an automated landing page carousel, category-based gallery filtering, and mobile-friendly hamburger navigation. It also incorporates client-side form validation for user subscriptions and smooth CSS load transitions to deliver a clean visual experience across all screen sizes.',
        techStack: [
          'HTML',
          'CSS',
          'JavaScript',
        ],
        highlights: [
          'Responsive Multi-Page Layout: Built with semantic HTML5 and custom CSS3 animations, featuring mobile-friendly hamburger navigation.',
          'Interactive UI Features: Utilizes vanilla JavaScript for real-time gallery filtering by vessel type and an automated landing page carousel.',
          'Client-Side Form Validation: Implements custom JS input validation for user subscriptions, including email formatting and age limit checks.',
        ],
        gallery: [
          'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1000&auto=format&fit=crop',
        ],
      },
      {
        title: 'Portofol.io',
        description: 'Personal developer portfolio showcasing interactive frontend craft, AI projects, and experience.',
        year: '2026',
        link: 'https://github.com/faizarii',
        githubUrl: 'https://github.com/faizarii',
        category: 'Web & Creative Dev',
        image: 'https://res.cloudinary.com/iaurmiih/image/upload/v1788259683/Screenshot_2026-09-01_174731.png',
        fullDescription:
          'Portofol.io is a modern personal developer portfolio designed and engineered to showcase software projects, hackathon accomplishments, and technical experiences. Built with React 19, TypeScript, Tailwind CSS, and Framer Motion, the site features kinetic pinned scroll sequences, high-voltage electric contrast typography, custom cursor lens interactions, and fluid responsive layouts across all screen sizes.',
        techStack: [
          'React',
          'TypeScript',
          'Tailwind CSS',
          'Framer Motion',
          'Vite',
          'Lenis Scroll',
        ],
        highlights: [
          'Kinetic & Pinned Scroll Stages: Built pinned viewport stages and interactive timeline carousels powered by Framer Motion and Lenis smooth scrolling.',
          'Custom Design System & Micro-Interactions: Crafted a high-contrast palette with electric solar yellow accents and an interactive cursor follower lens.',
          'Responsive & Accessible Architecture: Designed fluid, mobile-first layouts with accessible modal dialogs and seamless touch support.',
        ],
        gallery: [
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
        ],
      },
    ],
  },

  // Contact / Social Media Modal
  contactModal: {
    title: 'Get in Touch',
    subtitle: 'Feel free to reach out for collaborations, project inquiries, or just to say hi!',
    email: 'faizarifadhilah@gmail.com',
    socials: [
      {
        name: 'GitHub',
        handle: '@faizarii',
        url: 'https://github.com/faizarii',
        icon: 'github',
      },
      {
        name: 'LinkedIn',
        handle: 'Faiz Ari Fadhilah',
        url: 'https://linkedin.com/in/faiz-ari-fadhilah',
        icon: 'linkedin',
      },
      {
        name: 'Instagram',
        handle: '@faizarii',
        url: 'https://instagram.com/faizarii',
        icon: 'instagram',
      },
      {
        name: 'Email',
        handle: 'faiz.arifadhilah@gmail.com',
        url: 'mailto:faiz.arifadhilah@gmail.com',
        icon: 'mail',
        copyable: true,
      },
    ],
  },
};
