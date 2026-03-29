// app/courses/self-paced/page.jsx
//
// ─────────────────────────────────────────────────────────────────────────────
// SELF-PACED COURSES LISTING PAGE
//
// FIXES IN THIS VERSION:
//  1. course.hero.title    (was course.title — field does not exist at root)
//  2. course.hero.image    (was course.image — field does not exist at root)
//  3. course.hero.stats.rating / .students / .projects pulled correctly
//  4. course.hero.pricing.discountPrice / .price pulled correctly
//  5. course.instructor.name pulled for byline
//  6. Module count shown instead of all module tag pills (was too heavy)
//  7. Card click area & "Explore Course" button both go to correct slug page
//  8. Tools array truncated to first 3 icons only
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { spcourses } from "@/db/spcourses";
import {
  BookOpen,
  CheckCircle,
  Star,
  Users,
  Award,
  Target,
  Clock,
  Briefcase,
  BadgeCheck,
  PlayCircle,
  ArrowRight,
  Layers,
  Wrench,
  ChevronRight,
  TrendingUp,
  IndianRupee,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// BUILD COURSE LIST FROM DATABASE
// All field paths corrected to match spcourses.js schema:
//   hero.title | hero.image | hero.stats.* | hero.pricing.* | instructor.name
// ─────────────────────────────────────────────────────────────────────────────
const selfPacedCourses = Object.entries(spcourses).map(([slug, course]) => {
  // Count only non-free-preview modules for the display number
  const contentModules = (course.curriculum || []).filter(
    (m) => !m.isFreePreview
  );

  // Show up to 2 tools for the card badge row
  const topTools = (course.tools || []).slice(0, 2);

  return {
    slug,
    title:         course.hero?.title        ?? slug,
    image:         course.hero?.image        ?? "/course/default.jpg",
    rating:        course.hero?.stats?.rating    ?? "4.8",
    students:      course.hero?.students     ?? course.hero?.stats?.students ?? "200+",
    projects:      course.hero?.stats?.projects  ?? "5",
    price:         course.hero?.pricing?.price         ?? "5999",
    discountPrice: course.hero?.pricing?.discountPrice ?? "2999",
    discount:      course.hero?.pricing?.discount      ?? "50% OFF",
    instructor:    course.instructor?.name   ?? "Expert Trainer",
    moduleCount:   contentModules.length,
    topTools,
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SelfPacedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="pt-36 pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4">

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
          >
            <PlayCircle size={15} />
            Self-Paced Online Learning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight"
          >
            Master In-Demand{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              Data Skills
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Industry-focused courses you can study on your own schedule.
            Complete real projects, earn a verified certificate and get
            your full course fee returned.
          </motion.p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STAT CARDS
      ══════════════════════════════════════════════════════════════ */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto px-4"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {[
          { number: `${selfPacedCourses.length}+`, label: "Self-Paced Courses",  icon: BookOpen    },
          { number: "1,500+",                       label: "Students Enrolled",   icon: Users       },
          { number: "100%",                          label: "Fee Return Guarantee",icon: CheckCircle },
          { number: "4.8/5",                         label: "Average Rating",      icon: Star        },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-md text-center"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow mx-auto mb-3">
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.number}</div>
            <div className="text-xs text-gray-500 font-medium leading-snug">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          COURSES GRID
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 mt-14">
        <div className="max-w-7xl mx-auto px-4">

          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Available{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                Courses
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Choose a course below and start learning immediately — at your own pace.
            </p>
          </div>

          {/* ── Cards grid ────────────────────────────────────────── */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {selfPacedCourses.map((course) => (
              <motion.div key={course.slug} variants={fadeUp} >
                {/*
                  ┌─────────────────────────────────────────────────────┐
                  │  COURSE CARD                                         │
                  │  • Entire card is clickable (Link wrapper)           │
                  │  • Separate "Explore Course" CTA at the bottom       │
                  └─────────────────────────────────────────────────────┘
                */}
                <Link
                  href={`/courses/self-paced/${course.slug}`}
                  className="group block bg-white rounded-2xl border border-gray-200
                             shadow-sm hover:shadow-xl hover:border-green-200
                             transition-all duration-300 overflow-hidden h-full"
                >
                  {/* ── Course image ──────────────────────────────── */}
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Discount badge — top right */}
                    <div className="absolute top-3 right-3 bg-violet-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                      {course.discount}
                    </div>

                    {/* Self-Paced badge — top left */}
                    <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-lg">
                      Self-Paced
                    </div>

                    {/* Price — bottom left, over gradient */}
                    <div className="absolute bottom-3 left-3 bg-green-600/80  backdrop-blur-sm flex items-baseline px-2 py-1 rounded-lg gap-3">
                      <span className="text-white font-bold text-lg leading-none">
                        ₹{course.discountPrice}
                      </span>
                      <span className="text-white/60 font-medium text-sm line-through leading-none">
                        ₹{course.price}
                      </span>
                    </div>
                  </div>

                  {/* ── Card body ─────────────────────────────────── */}
                  <div className="p-5 flex flex-col gap-3">

                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors ">
                      {course.title}
                    </h3>

                    {/* Instructor */}
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 -mt-1">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-[9px]">
                        {course.instructor.charAt(0)}
                      </span>
                      {course.instructor}
                    </p>

                    {/* Quick stats row */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {/* Rating */}
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-gray-700">{course.rating}</span>
                      </span>
                      {/* Students */}
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-gray-400" />
                        {course.students}
                      </span>
                      {/* Modules */}
                      <span className="flex items-center gap-1">
                        <Layers size={12} className="text-gray-400" />
                        {course.moduleCount} modules
                      </span>
                      {/* Projects */}
                      <span className="flex items-center gap-1">
                        <Briefcase size={12} className="text-gray-400" />
                        {course.projects} projects
                      </span>
                    </div>

                    {/* Tools pills — max 3 */}
                    {course.topTools.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {course.topTools.map((tool) => (
                          <span
                            key={tool}
                            className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-medium"
                          >
                            {tool}
                          </span>
                        ))}
                        {(course.topTools.length < (spcourses[course.slug]?.tools?.length ?? 0)) && (
                          <span className="text-[11px] text-gray-400 px-1 py-0.5">
                            +{(spcourses[course.slug]?.tools?.length ?? 0) - course.topTools.length} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Refund guarantee strip */}
                    <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-xs text-green-700 font-medium">
                      <BadgeCheck size={13} className="text-green-600 flex-shrink-0" />
                      100% Fee Return on Completion
                    </div>

                    {/* CTA button */}
                    <div className="mt-1">
                      <div
                        className="w-full flex items-center justify-center gap-2
                                   bg-green-600 group-hover:bg-green-700 text-white
                                   py-2.5 rounded-xl font-semibold text-sm
                                   transition-all duration-300 group-hover:gap-3"
                      >
                        Explore Course
                        <ArrowRight size={15} />
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW THE REFUND MODEL WORKS
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              How The{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                Refund Model Works
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Complete the full course and you get every rupee back. No gimmicks.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Enroll in Course",
                desc:  "Register and get instant access to all course materials."
              },
              {
                step: "02",
                icon: PlayCircle,
                title: "Complete All Lessons",
                desc:  "Watch all videos and pass every module quiz."
              },
              {
                step: "03",
                icon: Target,
                title: "Submit All Projects",
                desc:  "Build and submit every industry project for review."
              },
              {
                step: "04",
                icon: Award,
                title: "Certificate + Full Refund",
                desc:  "Receive your certificate and 100% of your fee back."
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="relative bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300"
              >
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow">
                  {item.step}
                </div>

                {/* Connector arrow — not on last item */}
                {/* {i < 3 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10">
                    <ChevronRight size={20} className="text-green-400" />
                  </div>
                )} */}

                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4 mt-2">
                  <item.icon className="w-6 h-6 text-green-600" />
                </div>

                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHY SELF-PACED LEARNING
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                Self-Paced Learning?
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Everything you need to grow your skills without disrupting your life.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-7"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {[
              {
                icon: Clock,
                title: "Flexible Learning",
                desc:  "Study whenever you want. No fixed schedules, no deadlines. Learn completely at your own pace from anywhere.",
                highlight: "Study anytime"
              },
              {
                icon: Target,
                title: "Real Industry Projects",
                desc:  "Every course includes 5–6 real industry-level projects designed to build a portfolio employers respect.",
                highlight: "5–6 projects per course"
              },
              {
                icon: Award,
                title: "Verified Certification",
                desc:  "Earn an industry-recognised certificate after completing all lessons, quizzes and projects.",
                highlight: "Certificate included"
              },
              {
                icon: TrendingUp,
                title: "Structured Curriculum",
                desc:  "Follow a carefully designed path from beginner to advanced — each module builds on the last.",
                highlight: "Beginner to advanced"
              },
              {
                icon: Wrench,
                title: "Tools You Will Actually Use",
                desc:  "Every course uses real tools — Excel, SQL, Power BI, Tableau, Python — that companies hire for today.",
                highlight: "Industry tools"
              },
              {
                icon: IndianRupee,
                title: "100% Fee Guarantee",
                desc:  "Complete the full course — all lessons, quizzes and projects — and we return 100% of your fee. No catch.",
                highlight: "Full refund on completion"
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <item.icon className="w-6 h-6 text-green-600" />
                </div>

                <div className="inline-block bg-green-50 text-green-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-3 border border-green-100">
                  {item.highlight}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHAT YOU GET AT A GLANCE — compact feature strip
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: PlayCircle, label: "HD Video Lessons",       sub: "All self-paced"       },
              { icon: Layers,     label: "Module Quizzes",          sub: "Test your knowledge"  },
              { icon: Briefcase,  label: "Industry Projects",       sub: "5–6 per course"       },
              { icon: BadgeCheck, label: "Certificate + Refund",   sub: "On full completion"   },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
                  <f.icon size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-semibold text-gray-800">{f.label}</p>
                <p className="text-xs text-gray-400">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA — BOTTOM
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 text-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-green-100 text-s mb-10 max-w-xl mx-auto">
              Join thousands of students upgrading their careers with flexible courses and real industry projects.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a
                href="tel:+917011418073"
                className="bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Call for Free Demo
              </a>
              <a
                href="tel:+917011418073"
                className="border border-white/40 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Contact a Counselor
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: Briefcase,  label: "Industry Projects"        },
                { icon: Award,      label: "Certificate Included"      },
                { icon: BadgeCheck, label: "100% Fee Return"           },
                { icon: Clock,      label: "Learn at Your Own Pace"    },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                  <b.icon size={15} className="text-green-200" />
                  {b.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}