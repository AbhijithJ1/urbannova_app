"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart3,
  Shield,
  Users,
  Zap,
  Droplets,
  Trash2,
  Wind,
  ArrowRight,
  CheckCircle,
  Activity,
  FileText,
  MapPin,
  TrendingUp,
  Globe,
  ChevronDown,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

/* ─── Counter Component (GSAP) ─── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        if (counted.current) return;
        counted.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
          },
        });
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ─── Floating Particles ─── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-indigo-400/20 rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Component ─── */
export default function LandingContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const pillarsRef = useRef<HTMLDivElement>(null);
  const pillarsInView = useInView(pillarsRef, { once: true, margin: "-80px" });

  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: "-80px" });

  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ════════════ HERO ════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Parallax Background Image */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <Image
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80"
            alt="City skyline"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/70 to-indigo-900/60" />
        </motion.div>

        <FloatingParticles />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white/90 rounded-full text-sm font-medium mb-8 border border-white/20"
            >
              <Activity className="w-4 h-4 text-indigo-400" />
              Urban Sustainability Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
            >
              Empowering cities
              <br />
              through{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">
                  citizen intelligence
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 bg-linear-to-r from-indigo-400 to-violet-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed"
            >
              Report civic sustainability issues, track resolution in real time,
              and help your ward achieve a healthier, greener future — all from
              one unified platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-all duration-300 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                <Users className="w-5 h-5" />
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Shield className="w-5 h-5 text-indigo-400" />
                Admin Login
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-white/40 text-xs font-medium tracking-wider uppercase">
              Scroll to explore
            </span>
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════ STATS ════════════ */}
      <section ref={statsRef} className="relative bg-white py-20 -mt-12 rounded-t-[2.5rem] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {[
              { icon: MapPin, label: "City Wards", target: 12, suffix: "+", color: "text-indigo-600", bg: "bg-indigo-50" },
              { icon: BarChart3, label: "Sustainability Pillars", target: 4, suffix: "", color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: TrendingUp, label: "Real-time Tracking", target: 100, suffix: "%", color: "text-amber-600", bg: "bg-amber-50" },
              { icon: Globe, label: "Community Driven", target: 24, suffix: "/7", color: "text-violet-600", bg: "bg-violet-50" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={scaleIn}
                className="text-center"
              >
                <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════ PILLARS ════════════ */}
      <section ref={pillarsRef} className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
              Core Focus Areas
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
              4 Sustainability Pillars
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Citizens report issues across these domains, each scored 1–100 for
              ward-level analytics.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Trash2,
                label: "Waste",
                desc: "Garbage overflow, illegal dumping, e-waste disposal issues",
                color: "text-orange-600",
                bg: "bg-orange-50",
                border: "hover:border-orange-200",
                img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80",
              },
              {
                icon: Droplets,
                label: "Water",
                desc: "Leakage, shortage, sewage overflow, contamination",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "hover:border-blue-200",
                img: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600&q=80",
              },
              {
                icon: Zap,
                label: "Energy",
                desc: "Streetlight failures, power hazards, billing issues",
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "hover:border-amber-200",
                img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80",
              },
              {
                icon: Wind,
                label: "Pollution",
                desc: "Air quality, noise levels, emissions, open burning",
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "hover:border-purple-200",
                img: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&q=80",
              },
            ].map((pillar, i) => (
              <motion.div
                key={pillar.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={pillarsInView ? "visible" : "hidden"}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl ${pillar.border} transition-all duration-300`}
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={pillar.img}
                    alt={pillar.label}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-xl ${pillar.bg} ${pillar.color} flex items-center justify-center shadow-lg`}>
                    <pillar.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-lg mb-1.5">{pillar.label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FEATURE SHOWCASE ════════════ */}
      <section ref={featuresRef} className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
              Platform Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
              Built for transparency & action
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Every tool a citizen or admin needs to drive urban sustainability.
            </p>
          </motion.div>

          {/* Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                Citizen Reporting
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Report issues in seconds
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Submit waste, water, energy, or pollution issues with a title,
                description, landmark, and a severity score from 1-100. Your
                report instantly feeds into ward-level analytics.
              </p>
              <ul className="space-y-3">
                {["Category-based reporting", "Severity scoring 1-100", "Real-time status tracking"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80"
                  alt="Citizens reporting issues"
                  width={800}
                  height={500}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-indigo-900/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Issue Reported</p>
                    <p className="text-xs text-slate-500">Ward 7 · Score 85</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="order-2 lg:order-1 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                  alt="Admin analytics dashboard"
                  width={800}
                  height={500}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-indigo-900/20 to-transparent" />
              </div>
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">City Score</p>
                    <p className="text-xs text-slate-500">Improving ↑ 12%</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="order-1 lg:order-2"
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                Admin Dashboard
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                City-wide analytics at a glance
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Admins see trend charts, ward heatmaps, and priority breakdowns.
                Filter by ward, category, or status. Identify critical wards and
                drive resolution.
              </p>
              <ul className="space-y-3">
                {["Interactive charts & trends", "Ward priority heatmaps", "One-click status management"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section ref={stepsRef} className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
              How It Works
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Three simple steps to make your city better.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-linear-to-r from-indigo-200 via-indigo-400 to-indigo-200" />

            {[
              {
                step: "01",
                title: "Report",
                desc: "Register with your ward, then report issues with a title, description, landmark, and severity score.",
                icon: FileText,
                img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80",
              },
              {
                step: "02",
                title: "Monitor",
                desc: "Admins see city-wide analytics on a dashboard, filter by ward, and prioritize based on severity scores.",
                icon: Activity,
                img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
              },
              {
                step: "03",
                title: "Resolve",
                desc: "Issues are updated to In Progress, Completed, or Blocked. Citizens track every status change in real time.",
                icon: CheckCircle,
                img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={stepsInView ? "visible" : "hidden"}
                className="relative"
              >
                <div className="text-center">
                  {/* Step circle */}
                  <motion.div
                    className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 relative z-10"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <s.icon className="w-6 h-6" />
                  </motion.div>

                  {/* Image */}
                  <div className="relative rounded-xl overflow-hidden mb-5 aspect-video mx-auto">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs font-bold text-white/80 uppercase tracking-wider bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
                      Step {s.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xl mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIAL / SOCIAL PROOF ════════════ */}
      <section className="bg-slate-50 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative bg-linear-to-br from-indigo-600 to-violet-700 rounded-3xl p-10 md:p-16 text-center overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
              >
                <Globe className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join the movement for smarter cities
              </h2>
              <p className="text-indigo-100 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
                Every report you submit helps city planners make data-driven
                decisions. Together we can build more sustainable, livable urban
                spaces for everyone.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                >
                  Start Reporting
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Shield className="w-5 h-5" />
                  Admin Portal
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">UrbanNova</span>
            </div>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} UrbanNova. Building smarter, greener cities.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
