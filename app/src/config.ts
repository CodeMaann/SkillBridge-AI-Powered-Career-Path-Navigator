// =============================================================================
// SkillBridge Configuration - AI-Powered Career Path Navigator
// =============================================================================
// All site content is configured here. Components render nothing when their
// primary config fields are empty strings or empty arrays.
// =============================================================================

// -----------------------------------------------------------------------------
// Site Config
// -----------------------------------------------------------------------------
export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

export const siteConfig: SiteConfig = {
  title: "SkillBridge - AI-Powered Career Navigator",
  description: "Navigate your career with AI. SkillBridge analyzes your skills, identifies gaps, and creates personalized learning roadmaps to help you land your dream job.",
  language: "en",
  keywords: "career navigator, AI career coach, skill gap analysis, learning roadmap, job market, career transition, professional development",
  ogImage: "/images/hero-career.jpg",
  canonical: "https://skillbridge.ai",
};

// -----------------------------------------------------------------------------
// Navigation Config
// -----------------------------------------------------------------------------
export interface NavDropdownItem {
  name: string;
  href: string;
}

export interface NavLink {
  name: string;
  href: string;
  icon: string;
  dropdown?: NavDropdownItem[];
}

export interface NavigationConfig {
  brandName: string;
  brandSubname: string;
  tagline: string;
  navLinks: NavLink[];
  ctaButtonText: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "SkillBridge",
  brandSubname: "Career Navigator",
  tagline: "AI-Powered Career Growth",
  navLinks: [
    { name: "Home", href: "#home", icon: "Home" },
    { name: "Skills", href: "#skills", icon: "Grape" },
    { name: "Career Paths", href: "#careers", icon: "Users" },
    { name: "Roadmap", href: "#roadmap", icon: "BookOpen" },
    { name: "Insights", href: "#insights", icon: "Newspaper" },
    { name: "Contact", href: "#contact", icon: "Mail" },
  ],
  ctaButtonText: "Get Started",
};

// -----------------------------------------------------------------------------
// Preloader Config
// -----------------------------------------------------------------------------
export interface PreloaderConfig {
  brandName: string;
  brandSubname: string;
  yearText: string;
}

export const preloaderConfig: PreloaderConfig = {
  brandName: "SkillBridge",
  brandSubname: "Career Navigator",
  yearText: "AI-Powered",
};

// -----------------------------------------------------------------------------
// Hero Config
// -----------------------------------------------------------------------------
export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
}

export interface HeroConfig {
  scriptText: string;
  mainTitle: string;
  ctaButtonText: string;
  ctaTarget: string;
  stats: HeroStat[];
  decorativeText: string;
  backgroundImage: string;
}

export const heroConfig: HeroConfig = {
  scriptText: "Navigate Your Future with AI",
  mainTitle: "Bridge the Gap\nBetween You & Your Dream Career",
  ctaButtonText: "Start Your Journey",
  ctaTarget: "#skills",
  stats: [
    { value: 50, suffix: "K+", label: "Career Paths Analyzed" },
    { value: 92, suffix: "%", label: "Success Rate" },
    { value: 1.2, suffix: "M+", label: "Skills Mapped" },
    { value: 85, suffix: "%", label: "Avg. Salary Increase" },
  ],
  decorativeText: "AI-POWERED CAREER NAVIGATION",
  backgroundImage: "/images/hero-career.jpg",
};

// -----------------------------------------------------------------------------
// Skills Showcase Config (replacing wine showcase)
// -----------------------------------------------------------------------------
export interface Skill {
  id: string;
  name: string;
  subtitle: string;
  year: string;
  image: string;
  filter: string;
  glowColor: string;
  description: string;
  tastingNotes: string;
  alcohol: string;
  temperature: string;
  aging: string;
}

export interface SkillFeature {
  icon: string;
  title: string;
  description: string;
}

export interface SkillQuote {
  text: string;
  attribution: string;
  prefix: string;
}

export interface SkillShowcaseConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  skills: Skill[];
  wines: Skill[]; // Alias for skills (backward compatibility)
  features: SkillFeature[];
  quote: SkillQuote;
}

export const skillShowcaseConfig: SkillShowcaseConfig = {
  scriptText: "In-Demand Skills",
  subtitle: "TOP TECHNICAL COMPETENCIES",
  mainTitle: "Master the Skills That Matter",
  skills: [
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      subtitle: "Deep Learning & Neural Networks",
      year: "2024",
      image: "/images/skill-ai.jpg",
      filter: "",
      glowColor: "bg-purple-500/20",
      description: "Master artificial intelligence and machine learning algorithms. From neural networks to natural language processing, build the skills driving the AI revolution.",
      tastingNotes: "Python, TensorFlow, PyTorch, NLP, Computer Vision",
      alcohol: "High Demand",
      temperature: "Remote Friendly",
      aging: "Entry to Senior",
    },
    {
      id: "cloud",
      name: "Cloud Architecture",
      subtitle: "AWS, Azure & GCP",
      year: "2024",
      image: "/images/skill-cloud.jpg",
      filter: "brightness(1.15) sepia(0.1) hue-rotate(10deg) saturate(1.1)",
      glowColor: "bg-cyan-500/20",
      description: "Design and implement scalable cloud infrastructure. Become proficient in multi-cloud environments and DevOps practices that power modern enterprises.",
      tastingNotes: "AWS, Kubernetes, Docker, Terraform, CI/CD",
      alcohol: "Very High Demand",
      temperature: "Hybrid Options",
      aging: "Mid to Senior",
    },
    {
      id: "data",
      name: "Data Science",
      subtitle: "Analytics & Visualization",
      year: "2024",
      image: "/images/skill-data.jpg",
      filter: "brightness(1.2) sepia(0.15) hue-rotate(-10deg) saturate(1.2)",
      glowColor: "bg-blue-500/20",
      description: "Transform raw data into actionable insights. Learn statistical analysis, data visualization, and business intelligence to drive data-driven decisions.",
      tastingNotes: "SQL, Python, Tableau, R, BigQuery",
      alcohol: "High Demand",
      temperature: "Remote Friendly",
      aging: "Entry to Senior",
    },
    {
      id: "security",
      name: "Cybersecurity",
      subtitle: "Ethical Hacking & Defense",
      year: "2024",
      image: "/images/skill-security.jpg",
      filter: "brightness(1.1) sepia(0.2) hue-rotate(-30deg) saturate(0.9)",
      glowColor: "bg-amber-500/20",
      description: "Protect organizations from cyber threats. Master security frameworks, penetration testing, and compliance to safeguard critical infrastructure.",
      tastingNotes: "Security+, CEH, CISSP, SIEM, Risk Management",
      alcohol: "Critical Demand",
      temperature: "Onsite Preferred",
      aging: "Mid to Senior",
    },
  ],
  // wines is an alias for skills (backward compatibility with WineShowcase component)
  get wines() { return this.skills; },
  features: [
    {
      icon: "Sparkles",
      title: "AI-Powered Matching",
      description: "Our BERT-based algorithm analyzes your resume and matches you with optimal career paths based on your unique skill profile.",
    },
    {
      icon: "Thermometer",
      title: "Real-Time Market Data",
      description: "Access live job market insights including salary trends, demand forecasts, and regional opportunities updated daily.",
    },
    {
      icon: "Clock",
      title: "Personalized Timeline",
      description: "Get a customized learning roadmap with realistic timelines based on your current skills and available study hours.",
    },
  ],
  quote: {
    text: "The future belongs to those who learn more skills and combine them in creative ways.",
    attribution: "Robert Greene",
    prefix: "Wisdom",
  },
};

// -----------------------------------------------------------------------------
// Career Paths Carousel Config (replacing winery carousel)
// -----------------------------------------------------------------------------
export interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  area: string;
  unit: string;
  description: string;
}

export interface CareerCarouselConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  locationTag: string;
  slides: CarouselSlide[];
}

export const careerCarouselConfig: CareerCarouselConfig = {
  scriptText: "Explore Careers",
  subtitle: "HIGH-GROWTH PROFESSIONS",
  mainTitle: "Discover Your Perfect Career Path",
  locationTag: "Global Opportunities",
  slides: [
    {
      image: "/images/career-data.jpg",
      title: "Data Scientist",
      subtitle: "Analytics & Insights",
      area: "$125K",
      unit: "Avg Salary",
      description: "Transform complex data into actionable business insights. Data scientists are among the most sought-after professionals, with demand growing 35% annually across industries.",
    },
    {
      image: "/images/career-engineer.jpg",
      title: "Software Engineer",
      subtitle: "Full-Stack Development",
      area: "$140K",
      unit: "Avg Salary",
      description: "Build the applications and systems that power our digital world. From startups to Fortune 500s, software engineers are the architects of modern technology.",
    },
    {
      image: "/images/career-product.jpg",
      title: "Product Manager",
      subtitle: "Strategy & Execution",
      area: "$150K",
      unit: "Avg Salary",
      description: "Lead cross-functional teams to deliver products that users love. Product managers bridge the gap between business goals, user needs, and technical feasibility.",
    },
    {
      image: "/images/career-design.jpg",
      title: "UX Designer",
      subtitle: "User Experience",
      area: "$115K",
      unit: "Avg Salary",
      description: "Create intuitive and delightful user experiences. UX designers combine creativity with research to craft products that are both beautiful and functional.",
    },
  ],
};

// -----------------------------------------------------------------------------
// Learning Roadmap Config (replacing museum config)
// -----------------------------------------------------------------------------
export interface TimelineEvent {
  year: string;
  event: string;
}

export interface RoadmapTabContent {
  title: string;
  description: string;
  highlight: string;
}

export interface RoadmapTab {
  id: string;
  name: string;
  icon: string;
  image: string;
  content: RoadmapTabContent;
}

export interface RoadmapQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface RoadmapConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  timeline: TimelineEvent[];
  tabs: RoadmapTab[];
  openingHours: string;
  openingHoursLabel: string;
  ctaButtonText: string;
  yearBadge: string;
  yearBadgeLabel: string;
  quote: RoadmapQuote;
  founderPhotoAlt: string;
  founderPhoto: string;
}

export const roadmapConfig: RoadmapConfig = {
  scriptText: "Your Journey",
  subtitle: "PERSONALIZED LEARNING PATH",
  mainTitle: "AI-Generated Career Roadmaps",
  introText: "Our reinforcement learning engine creates dynamic, personalized learning paths that adapt to your progress, schedule, and career goals. Each roadmap is uniquely crafted based on your current skills, target role, and market demands.",
  timeline: [
    { year: "Week 1", event: "Skill Assessment & Gap Analysis" },
    { year: "Week 2-4", event: "Foundation Skills Building" },
    { year: "Month 2-3", event: "Core Competency Development" },
    { year: "Month 4-6", event: "Advanced Specialization" },
    { year: "Ongoing", event: "Continuous Growth & Mastery" },
  ],
  tabs: [
    {
      id: "assessment",
      name: "Assessment",
      icon: "History",
      image: "/images/roadmap-learning.jpg",
      content: {
        title: "Comprehensive Skill Analysis",
        description: "Upload your resume and complete our adaptive questionnaire. Our AI analyzes your experience, identifies skill gaps, and maps your profile against O*NET competency matrices for your target roles.",
        highlight: "BERT-powered skill extraction with 94% accuracy",
      },
    },
    {
      id: "roadmap",
      name: "Roadmap",
      icon: "BookOpen",
      image: "/images/team-collab.jpg",
      content: {
        title: "Dynamic Learning Sequences",
        description: "Receive a step-by-step learning plan that sequences courses, projects, and certifications optimally. Our algorithm adjusts based on your learning speed and changing market conditions.",
        highlight: "Reinforcement learning optimizes your path",
      },
    },
    {
      id: "progress",
      name: "Progress",
      icon: "Award",
      image: "/images/career-engineer.jpg",
      content: {
        title: "Track & Celebrate Milestones",
        description: "Monitor your progress with detailed analytics. Earn badges, complete challenges, and build a portfolio that showcases your journey to potential employers.",
        highlight: "Gamified learning with real-world impact",
      },
    },
  ],
  openingHours: "24/7 Access",
  openingHoursLabel: "Platform Availability",
  ctaButtonText: "Generate My Roadmap",
  yearBadge: "2024",
  yearBadgeLabel: "Founded",
  quote: {
    prefix: "Mission",
    text: "We believe everyone deserves access to personalized career guidance. Our mission is to democratize professional development through the power of AI.",
    attribution: "SkillBridge Team",
  },
  founderPhotoAlt: "Team collaboration",
  founderPhoto: "/images/team-collab.jpg",
};

// -----------------------------------------------------------------------------
// Insights & Testimonials Config (replacing news config)
// -----------------------------------------------------------------------------
export interface NewsArticle {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface StoryQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface StoryTimelineItem {
  value: string;
  label: string;
}

export interface InsightsConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  viewAllText: string;
  readMoreText: string;
  articles: NewsArticle[];
  testimonialsScriptText: string;
  testimonialsSubtitle: string;
  testimonialsMainTitle: string;
  testimonials: Testimonial[];
  storyScriptText: string;
  storySubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyTimeline: StoryTimelineItem[];
  storyQuote: StoryQuote;
  storyImage: string;
  storyImageCaption: string;
}

export const insightsConfig: InsightsConfig = {
  scriptText: "Market Insights",
  subtitle: "LATEST INDUSTRY TRENDS",
  mainTitle: "Job Market Intelligence",
  viewAllText: "View All Reports",
  readMoreText: "Read Report",
  articles: [
    {
      id: 1,
      image: "/images/skill-ai.jpg",
      title: "AI Roles See 40% Salary Growth in 2024",
      excerpt: "Machine learning engineers and AI specialists command premium salaries as demand outpaces supply across tech hubs.",
      date: "Feb 15, 2024",
      category: "Salary Report",
    },
    {
      id: 2,
      image: "/images/skill-cloud.jpg",
      title: "Cloud Skills Gap Widens: 1.5M Open Roles",
      excerpt: "Enterprises struggle to find qualified cloud architects and DevOps engineers. Certification demand up 65%.",
      date: "Feb 10, 2024",
      category: "Market Analysis",
    },
    {
      id: 3,
      image: "/images/skill-security.jpg",
      title: "Cybersecurity: Zero Trust Architecture Boom",
      excerpt: "Security professionals with Zero Trust expertise see 30% higher offers. Compliance driving demand.",
      date: "Feb 5, 2024",
      category: "Trend Alert",
    },
    {
      id: 4,
      image: "/images/skill-data.jpg",
      title: "Data Literacy Becomes Core Requirement",
      excerpt: "Non-technical roles increasingly require data skills. SQL and visualization tools now standard expectations.",
      date: "Jan 28, 2024",
      category: "Skills Report",
    },
  ],
  testimonialsScriptText: "Success Stories",
  testimonialsSubtitle: "REAL TRANSFORMATIONS",
  testimonialsMainTitle: "What Our Users Say",
  testimonials: [
    {
      name: "Sarah Chen",
      role: "Data Scientist at Google",
      text: "SkillBridge helped me transition from marketing to data science in 8 months. The personalized roadmap was exactly what I needed.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Senior Engineer at Microsoft",
      text: "The skill gap analysis was eye-opening. I focused on the right technologies and got promoted within 6 months.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager at Stripe",
      text: "I went from junior PM to senior in record time. The market insights helped me negotiate a 40% salary increase.",
      rating: 5,
    },
  ],
  storyScriptText: "Our Impact",
  storySubtitle: "BY THE NUMBERS",
  storyTitle: "Transforming Careers Worldwide",
  storyParagraphs: [
    "Since our launch in 2024, SkillBridge has helped over 50,000 professionals navigate their career transitions. Our AI-powered platform analyzes millions of job postings daily to provide real-time market intelligence.",
    "We partner with leading learning platforms including Coursera, Udacity, and Pluralsight to curate the best courses for each career path. Our users report an average salary increase of 35% within 12 months of following their personalized roadmap.",
  ],
  storyTimeline: [
    { value: "50K+", label: "Careers Transformed" },
    { value: "35%", label: "Avg Salary Increase" },
    { value: "1.2M", label: "Skills Analyzed" },
    { value: "92%", label: "Success Rate" },
  ],
  storyQuote: {
    prefix: "Vision",
    text: "In five years, we envision a world where everyone has access to personalized career guidance, regardless of their background or location.",
    attribution: "SkillBridge Founders",
  },
  storyImage: "/images/team-collab.jpg",
  storyImageCaption: "The SkillBridge team building the future of career development",
};

// -----------------------------------------------------------------------------
// Contact/Onboarding Form Config
// -----------------------------------------------------------------------------
export interface ContactInfoItem {
  icon: string;
  label: string;
  value: string;
  subtext: string;
}

export interface ContactFormFields {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  visitDateLabel: string;
  visitorsLabel: string;
  visitorsOptions: string[];
  messageLabel: string;
  messagePlaceholder: string;
  submitText: string;
  submittingText: string;
  successMessage: string;
  errorMessage: string;
}

export interface ContactFormConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  contactInfoTitle: string;
  contactInfo: ContactInfoItem[];
  form: ContactFormFields;
  privacyNotice: string;
  formEndpoint: string;
}

export const contactFormConfig: ContactFormConfig = {
  scriptText: "Get Started",
  subtitle: "BEGIN YOUR JOURNEY",
  mainTitle: "Start Your Career Transformation",
  introText: "Take the first step toward your dream career. Complete our adaptive onboarding questionnaire and receive your personalized skill gap analysis and learning roadmap within minutes.",
  contactInfoTitle: "Why SkillBridge?",
  contactInfo: [
    {
      icon: "MapPin",
      label: "AI-Powered Analysis",
      value: "BERT-Based Extraction",
      subtext: "94% accuracy in skill identification",
    },
    {
      icon: "Phone",
      label: "Market Intelligence",
      value: "Real-Time Data",
      subtext: "Updated daily from 50+ sources",
    },
    {
      icon: "Mail",
      label: "Personalized Paths",
      value: "Dynamic Roadmaps",
      subtext: "Adapted to your schedule & goals",
    },
    {
      icon: "Clock",
      label: "Proven Results",
      value: "92% Success Rate",
      subtext: "Average 35% salary increase",
    },
  ],
  form: {
    nameLabel: "Full Name",
    namePlaceholder: "Enter your full name",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    phoneLabel: "Current Role",
    phonePlaceholder: "e.g., Junior Developer",
    visitDateLabel: "Target Career Date",
    visitorsLabel: "Weekly Study Hours",
    visitorsOptions: ["5-10 hours", "10-20 hours", "20+ hours", "Full-time"],
    messageLabel: "Career Goals",
    messagePlaceholder: "Tell us about your dream role and any specific skills you want to develop...",
    submitText: "Generate My Roadmap",
    submittingText: "Analyzing Your Profile...",
    successMessage: "Success! Check your email for your personalized skill gap analysis and learning roadmap.",
    errorMessage: "Something went wrong. Please try again or contact support.",
  },
  privacyNotice: "By submitting, you agree to our Privacy Policy. Your data is secure and never shared with third parties.",
  formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
};

// -----------------------------------------------------------------------------
// Footer Config
// -----------------------------------------------------------------------------
export interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterContactItem {
  icon: string;
  text: string;
}

export interface FooterConfig {
  brandName: string;
  tagline: string;
  description: string;
  socialLinks: SocialLink[];
  linkGroups: FooterLinkGroup[];
  contactItems: FooterContactItem[];
  newsletterLabel: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  newsletterSuccessText: string;
  newsletterErrorText: string;
  newsletterEndpoint: string;
  copyrightText: string;
  legalLinks: string[];
  icpText: string;
  backToTopText: string;
  ageVerificationText: string;
}

export const footerConfig: FooterConfig = {
  brandName: "SkillBridge",
  tagline: "Career Navigator",
  description: "AI-powered career path navigation. Bridge the gap between your current skills and your dream career with personalized learning roadmaps.",
  socialLinks: [
    { icon: "Twitter", label: "Twitter", href: "https://twitter.com/skillbridge" },
    { icon: "Facebook", label: "LinkedIn", href: "https://linkedin.com/company/skillbridge" },
    { icon: "Instagram", label: "Instagram", href: "https://instagram.com/skillbridge" },
    { icon: "Youtube", label: "YouTube", href: "https://youtube.com/skillbridge" },
  ],
  linkGroups: [
    {
      title: "Platform",
      links: [
        { name: "Skill Analysis", href: "#skills" },
        { name: "Career Paths", href: "#careers" },
        { name: "Learning Roadmap", href: "#roadmap" },
        { name: "Market Insights", href: "#insights" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Contact", href: "#contact" },
      ],
    },
  ],
  contactItems: [
    { icon: "Mail", text: "hello@skillbridge.ai" },
    { icon: "MapPin", text: "San Francisco, CA" },
  ],
  newsletterLabel: "Subscribe to Career Insights",
  newsletterPlaceholder: "Enter your email",
  newsletterButtonText: "Subscribe",
  newsletterSuccessText: "Thanks for subscribing! Check your inbox for career tips.",
  newsletterErrorText: "Subscription failed. Please try again.",
  newsletterEndpoint: "https://formspree.io/f/YOUR_NEWSLETTER_ID",
  copyrightText: "© 2024 SkillBridge. All rights reserved.",
  legalLinks: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  icpText: "",
  backToTopText: "Back to top",
  ageVerificationText: "",
};

// -----------------------------------------------------------------------------
// Scroll To Top Config
// -----------------------------------------------------------------------------
export interface ScrollToTopConfig {
  ariaLabel: string;
}

export const scrollToTopConfig: ScrollToTopConfig = {
  ariaLabel: "Back to top",
};

// -----------------------------------------------------------------------------
// Export Aliases (for backward compatibility with component imports)
// -----------------------------------------------------------------------------
export { skillShowcaseConfig as wineShowcaseConfig };
export { careerCarouselConfig as wineryCarouselConfig };
export { roadmapConfig as museumConfig };
export { insightsConfig as newsConfig };
export type { CareerCarouselConfig as WineryCarouselConfig };
export type { RoadmapConfig as MuseumConfig };
export type { InsightsConfig as NewsConfig };
export type { RoadmapTab as MuseumTab };
export type { RoadmapTabContent as MuseumTabContent };
export type { RoadmapQuote as MuseumQuote };
export type { StoryQuote as NewsQuote };
export type { StoryTimelineItem as NewsTimelineItem };

// Alias wines to skills for WineShowcase component compatibility
export const wines = skillShowcaseConfig.skills;
