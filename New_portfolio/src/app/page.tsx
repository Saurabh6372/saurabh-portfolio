"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Home, User, Briefcase, FileText, Mail } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import Image from "next/image";

/* ================================================================
   LOADER
   ================================================================ */
function Loader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center px-4"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl md:text-7xl font-bold text-white text-center"
      >
        Namaste 🙏🏽
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        className="mt-4 sm:mt-6 text-neutral-400 text-sm md:text-base text-center"
      >
        You&apos;ve landed on Saurabh Maurya&apos;s Portfolio
      </motion.p>
    </motion.div>
  );
}

/* ================================================================
   HERO
   ================================================================ */
function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={400} />

      {/* Left — name card, z-10 so it sits in front of the robot */}
      <div className="relative z-10 w-full lg:w-[52%] px-6 py-24 sm:px-10 md:px-16 lg:px-20 flex flex-col justify-center min-h-screen">
        <GlassCard className="px-6 py-8 sm:px-10 sm:py-12 md:px-12 md:py-14">
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-[1.1]"
          >
            I&apos;m Saurabh
            <br />
            Maurya.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 md:mt-8 text-neutral-300 text-base sm:text-lg md:text-xl max-w-lg"
          >
            I design products with purpose and meticulous attention to detail.
            Available for work.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="https://forms.gle/goxgB85imbac2ynt7"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors text-center"
            >
              Book a call
            </a>
            <a
              href="https://github.com/Saurabh6372"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-center"
            >
              GitHub
            </a>
          </motion.div>
        </GlassCard>
      </div>

      {/* Right — 3D robot: starts at 38% so it sits slightly behind the name card,
          z-[2] keeps it behind z-10 name, height extends 80px below the hero so
          the robot's legs peek into the About section for a seamless transition.
          Pointer events are kept ON so Spline can track the mouse for head-following. */}
      <div
        className="absolute top-0 hidden lg:block z-[2]"
        style={{ left: "38%", right: 0, height: "calc(100% + 80px)" }}
      >
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </section>
  );
}

/* ================================================================
   GLASS CARD WRAPPER — frosted glass for text sections
   ================================================================ */
function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/* ================================================================
   ABOUT
   ================================================================ */
function AboutSection() {
  return (
    <section id="about" className="relative z-10 py-0 sm:py-0">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-14">
        <GlassCard className="px-6 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-10 md:mb-14"
          >
            About Me
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-base sm:text-lg text-neutral-300 mb-6 leading-relaxed">
                A designer based in the beautiful landscapes of Vadodara, India.
                I&apos;ve spent most of my career working remotely and I
                absolutely love it.
              </p>
              <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
                I thrive on creating designs that make a difference. Whether
                it&apos;s collaborating with teams or working solo, my goal is to
                make user experiences seamless, beautiful and enjoyable.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                Working Remotely
              </h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Remote work is my lifestyle. I&apos;ve honed my skills working
                with teams from all over, proving that distance is no barrier to
                great collaboration.
              </p>
              <h3 className="text-xl font-semibold text-white mb-3">
                On the Hunt for Exciting Opportunities
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                I&apos;m on the lookout for new challenges that push my limits.
                If you have an exciting product that needs a creative touch,
                count me in!
              </p>
            </motion.div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

/* ================================================================
   PROJECT DATA
   ================================================================ */
interface Project {
  title: string;
  subtitle: string;
  role: string;
  date: string;
  tags: string[];
  bgColor: string;
  textColor: string;
  image?: string;
  placeholder?: boolean;
  bullets?: string[];
  link?: string;
}

const projects: Project[] = [
  {
    title: "Scientific Image Forgery Detection",
    subtitle:
      "Kaggle Challenge — Deep learning pipeline to detect manipulated regions in scientific images.",
    role: "ML Engineer",
    date: "2025",
    tags: ["Python", "PyTorch", "OpenCV", "DINOv2"],
    bgColor: "#0d1520",
    textColor: "#8bb8d6",
    image: "/imageforery.png",
    bullets: [
      "Built an end-to-end deep learning segmentation pipeline to detect manipulated regions in scientific images.",
      "Implemented high-resolution sliding window inference (1024×1024) with overlap stitching.",
      "Designed adaptive thresholding and morphological post-processing to optimise F1-score performance.",
      "Conducted model comparison experiments (CNN vs DINOv2-Large) analysing metric sensitivity.",
    ],
  },
   {
    title: "Anomaly Detection",
    subtitle:
      "Celebal AnaVerse_B Kaggle — Time-series anomaly detection using multi-sensor data.",
    role: "Data Scientist",
    date: "2025",
    tags: ["Python", "Scikit-Learn", "XGBoost", "SMOTE", "SHAP"],
    bgColor: "#15004A",
    textColor: "#b6a7dd",
    image: "/Anamaly_detection.jpg",
   
    bullets: [
      "Developed a time-series anomaly detection model using multi-sensor tabular data.",
      "Engineered temporal and interaction features to improve model performance.",
      "Handled class imbalance using SMOTE and optimised F1-score via threshold tuning.",
      "Applied TimeSeriesSplit cross-validation (15 folds) and performed SHAP-based model interpretation.",
    ],
  },
  {
    title: "Job Portal",
    subtitle:
      "Full-stack job portal for students and recruiters to manage profiles and job workflows.",
    role: "Full-Stack Developer",
    date: "2024",
    tags: ["React", "Node.js", "Firebase", "REST API"],
    bgColor: "#00050D",
    textColor: "#9699ec",
    image: "/home.png",
    bullets: [
      "Developed a full-stack job portal enabling students and recruiters to manage profiles and job workflows securely.",
      "Designed and implemented RESTful APIs for authentication, resume uploads, and user management.",
      "Integrated Firebase Authentication with secure session handling mechanisms.",
      "Improved frontend performance through modular React architecture and route-based code splitting.",
    ],
  },
  {
    title: "AKSN",
    subtitle: "One platform to solve all your parking needs.",
    role: "Design Lead",
    date: "2023 – present",
    tags: ["UI/UX", "Graphic Design", "Product Design", "Web Design"],
    bgColor: "#0a0f1a",
    textColor: "#c8d6e5",
    image: "/Login_page.png",
  },
  {
    title: "AKSN Mobile",
    subtitle:
      "One platform to solve all your parking needs — Mobile version.",
    role: "Product Design Lead",
    date: "2023 – present",
    tags: ["Design System", "Product Design"],
    bgColor: "#1a0a3e",
    textColor: "#d4c5f9",
    image: "/AKSN_MOBILE.png",
  },
  
 
  
  // {
  //   title: "Dollar Converter",
  //   subtitle:
  //     "A currency conversion tool for quick and accurate dollar conversions.",
  //   role: "Developer",
  //   date: "2024",
  //   tags: ["Web App", "UI/UX"],
  //   bgColor: "#0e0c2a",
  //   textColor: "#a99de0",
  //   placeholder: true,
  // },
  // {
  //   title: "Insta Clone",
  //   subtitle:
  //     "A full-featured Instagram clone with modern UI and interactions.",
  //   role: "Frontend Developer",
  //   date: "2023",
  //   tags: ["Frontend", "UI/UX", "Web App"],
  //   bgColor: "#1a0a1e",
  //   textColor: "#d4a0c4",
  //   placeholder: true,
  // },
  // {
  //   title: "WhatsApp Clone",
  //   subtitle: "A real-time messaging app clone with WhatsApp-like interface.",
  //   role: "Frontend Developer",
  //   date: "2023",
  //   tags: ["Frontend", "Real-time", "Web App"],
  //   bgColor: "#0a1a10",
  //   textColor: "#72c48a",
  //   placeholder: true,
  // },
];

/* ================================================================
   STACKED PROJECT CARD
   ================================================================ */
function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className="sticky top-28 sm:top-32 mb-10 sm:mb-14"
    >
      <div
        className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.06]"
        style={{ backgroundColor: project.bgColor, color: project.textColor }}
      >
        <div className="px-5 py-7 sm:px-8 sm:py-10 md:px-12 md:py-14">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 md:mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono opacity-50">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>/</span>
                <span>{String(projects.length).padStart(2, "0")}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base opacity-70 max-w-xl leading-relaxed">
                {project.subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 text-xs sm:text-sm opacity-60 lg:text-right shrink-0">
              <div>
                <span className="opacity-50">Role: </span>
                {project.role}
              </div>
              <div>
                <span className="opacity-50">Date: </span>
                {project.date}
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-100 transition-opacity"
                >
                  View project &rarr;
                </a>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] sm:text-xs rounded-full border opacity-60"
                style={{ borderColor: `${project.textColor}22` }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bullets */}
          {project.bullets && (
            <ul className="space-y-2 mb-6 opacity-70">
              {project.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-xs sm:text-sm leading-relaxed"
                >
                  <span className="shrink-0 mt-0.5">–</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Image */}
          {project.image && !project.placeholder && (
            <div className="rounded-xl sm:rounded-2xl overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                width={1400}
                height={800}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Placeholder */}
          {project.placeholder && (
            <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-black/20 border border-dashed border-current/10 flex items-center justify-center h-40 sm:h-56 md:h-72">
              <p className="text-xs sm:text-sm opacity-40">
                Project image coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   PROJECTS — Timeline left + Stacked cards right on desktop
             Only stacked cards on mobile
   ================================================================ */
function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reliable scroll-based active detection: whichever card wrapper's top
  // is last above the 50% mark of the viewport is the active one.
  useEffect(() => {
    const handleScroll = () => {
      let next = 0;
      cardRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const top = ref.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.5) next = i;
      });
      setActiveIndex(next);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="projects" className="relative z-10 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-14">
        {/* Section header */}
        <GlassCard className="px-6 py-8 sm:px-10 sm:py-10 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
               Projects
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-lg">
              Here&apos;s a showcase of my work — from design to development to
              machine learning.
            </p>
          </motion.div>
        </GlassCard>

        {/* Desktop: sticky names sidebar on left, stacked cards on right */}
        {/* Mobile: just stacked cards */}
        <div className="flex gap-8 lg:gap-12">
          {/* Timeline track — hidden on mobile */}
          <div className="hidden lg:block w-56 shrink-0">
            {/* Sticky panel — line and names are self-contained here so the
                line never overruns past the last dot */}
            <div className="sticky top-28 pt-8 flex flex-col gap-1 relative">
              {/* Line background — only as tall as the names panel */}
              <div className="absolute left-[19px] top-8 bottom-0 w-[2px] bg-neutral-800/50" />
              {/* Animated progress line — grows dot-by-dot with activeIndex */}
              <motion.div
                className="absolute left-[19px] top-8 w-[2px] bg-gradient-to-b from-purple-500 via-blue-500 to-transparent rounded-full"
                animate={{
                  height:
                    projects.length > 1
                      ? `${(activeIndex / (projects.length - 1)) * 100}%`
                      : "100%",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />

              {projects.map((p, i) => (
                <div
                  key={p.title}
                  className={`flex items-center gap-4 py-2 transition-all duration-300 ${
                    i === activeIndex ? "opacity-100" : "opacity-25"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-black border flex items-center justify-center shrink-0 z-10 transition-colors duration-300 ${
                      i === activeIndex ? "border-white" : "border-neutral-700"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        i === activeIndex ? "bg-white" : "bg-neutral-600"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-bold text-neutral-300 truncate leading-tight">
                    {p.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stacked cards */}
          <div className="flex-1 min-w-0">
            {projects.map((project, i) => (
              <div
                key={project.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <ProjectCard project={project} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   GITHUB CTA
   ================================================================ */
function GitHubSection() {
  return (
    <section className="relative z-10 py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <GlassCard className="px-6 py-12 sm:px-10 sm:py-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8"
          >
            There&apos;s a lot more on my Github.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <a
              href="https://github.com/Saurabh6372"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors"
            >
              github.com/Saurabh6372
            </a>
          </motion.div>

          {/* Gooey morphing text */}
          <div className="h-[100px] sm:h-[140px] flex items-center justify-center">
            <GooeyText
              texts={["Design", "Engineering", "Creativity", "Saurabh"]}
              morphTime={1.2}
              cooldownTime={0.3}
              className="font-bold"
            />
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */
function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { name: "Github", href: "https://github.com/Saurabh6372" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/saurabhmaurya63" },
    { name: "Instagram", href: "https://www.instagram.com/_mauryasaurabh/" },
    { name: "Twitter", href: "https://x.com/_mauryasaurabh" },
    {
      name: "Resume", href: "https://drive.google.com/file/d/1NwbCR7n5GRpkOT9lBSYcWtwVBQwA0nka/view?usp=drive_link",
    },
    { name: "Email", href: "mailto:saurabhmaurya655599@gmail.com" },
  ];

  return (
    <footer id="contact" className="relative z-10 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-14">
      <GlassCard className="px-6 sm:px-10 md:px-16 py-14 sm:py-20">
        {/* Top */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 mb-14 sm:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            Available for work,
            <br />
            Let&apos;s connect.
          </motion.h2>
          <a
            href="https://forms.gle/goxgB85imbac2ynt7"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors shrink-0"
          >
            Book a call
          </a>
        </div>

        {/* Links */}
        <div className="mb-14 sm:mb-20">
          <h3 className="text-base sm:text-lg text-neutral-500 mb-5">
            Find me elsewhere on web,
          </h3>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.name === "Email" ? undefined : "_blank"}
                rel={link.name === "Email" ? undefined : "noopener noreferrer"}
                className="text-white text-sm sm:text-base hover:text-neutral-400 transition-colors relative group"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between">
          <p className="text-neutral-500 text-xs sm:text-sm">
            &copy;{currentYear} saurabhmaurya.dev
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors group"
            aria-label="Scroll to top"
          >
            <svg
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              className="text-white group-hover:-translate-y-1 transition-transform"
            >
              <path
                d="M10 20.7861L10 2.57185"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M18.75 10.7861L10 2.2147L1.25 10.7861"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </GlassCard>
      </div>
    </footer>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const contact = document.getElementById("contact");
      if (contact) {
        const rect = contact.getBoundingClientRect();
        setContactVisible(rect.top < window.innerHeight * 0.8);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", url: "#home", icon: Home },
    { name: "About", url: "#about", icon: User },
    { name: "Projects", url: "#projects", icon: Briefcase },
    { name: "Contact", url: "#contact", icon: Mail },
  ];

  return (
    <div className="bg-black min-h-screen">
      <AnimatePresence mode="wait">
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BackgroundPaths contactVisible={contactVisible} />
          <NavBar items={navItems} />
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <GitHubSection />
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
