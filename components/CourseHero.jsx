// components/CourseHero.jsx

// ─────────────────────────────────────────────────────────────────
// Course Hero — Top section of the course detail page
//
// DATA SOURCE: All content comes from spcourses.js → course.hero
//
// SECTIONS:
//   • Left:  Tags, Title, Subtitle, Stats cards, Progress bar, Feature badges
//   • Right: Course image, Pricing card, Enroll button, What you get
//
// CHANGES:
//   • "Lifetime Access" badge removed (per course spec)
//   • "30-Day Money-Back Guarantee" text removed (per course spec)
//   • "Microsoft Certified" tag support added
//   • Progress bar reflects REAL watch-time (passed from page.jsx)
//
// PROPS:
//   course   — Full course object from spcourses[slug]
//   progress — Current video progress 0-100 (calculated in page.jsx)
// ─────────────────────────────────────────────────────────────────

"use client";

import {
  BookOpen, Star, Users, Target, Clock,
  PlayCircle, ShieldCheck, Award, Wifi
} from "lucide-react";

// Map icon strings (from spcourses.js tags) to Lucide components
const ICON_MAP = {
  target:  <Target      className="w-4 h-4" />,
  clock:   <Clock       className="w-4 h-4" />,
  online:  <PlayCircle  className="w-4 h-4" />,
  award:   <Award       className="w-4 h-4" />,
  wifi:    <Wifi        className="w-4 h-4" />
};

// Tag pill colors — cycles by index
const TAG_COLORS = [
  "bg-green-100  text-green-700",
  "bg-blue-100   text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100  text-amber-700"
];

export default function CourseHero({ course, progress = 0 }) {

  const hero = course?.hero;
  if (!hero) return null;

  const progressClamped = Math.min(Math.max(progress, 0), 100);

  return (
    <section className="pt-28 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-10">

        {/* ── LEFT SIDE ──────────────────────────────────────────── */}
        <div className="lg:col-span-2">

          {/* ── TAGS ──────────────────────────────────────────────────
              Defined in spcourses.js → hero.tags
              ADD/REMOVE tags there; they render here automatically.
              Supports icons: target, clock, online, award, wifi
          ─────────────────────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2 mb-5">
            {hero.tags?.map((tag, i) => (
              <span
                key={i}
                className={`flex items-center gap-1.5 whitespace-nowrap ${TAG_COLORS[i % TAG_COLORS.length]} px-4 py-1 rounded-full text-sm font-medium`}
              >
                {ICON_MAP[tag.icon] || <Target className="w-4 h-4" />}
                {tag.label}
              </span>
            ))}
          </div>

          {/* ── COURSE TITLE ──────────────────────────────────────────
              Defined in spcourses.js → hero.title
          ─────────────────────────────────────────────────────────── */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {hero.title}
          </h1>

          {/* ── SUBTITLE ──────────────────────────────────────────────
              Defined in spcourses.js → hero.subtitle
          ─────────────────────────────────────────────────────────── */}
          <p className="text-gray-600 text-lg mb-8 max-w-xl leading-relaxed">
            {hero.subtitle}
          </p>

          {/* ── STATS CARDS ───────────────────────────────────────────
              Values defined in spcourses.js → hero.stats
          ─────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

            {/* Rating */}
            <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
              <div className="text-xl font-bold text-gray-900">{hero.stats.rating}</div>
              <div className="flex justify-center text-yellow-400 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs font-medium text-gray-500">Student Rating</p>
            </div>

            {/* Students */}
            <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
              <div className="text-xl font-bold text-gray-900">{hero.stats.students}</div>
              <Users className="mx-auto text-green-600 my-1" size={18} />
              <p className="text-xs font-medium text-gray-500">Students Enrolled</p>
            </div>

            {/* Projects */}
            <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
              <div className="text-xl font-bold text-gray-900">{hero.stats.projects}</div>
              <Target className="mx-auto text-green-600 my-1" size={18} />
              <p className="text-xs font-medium text-gray-500">Projects</p>
            </div>

            {/* Guarantee */}
            <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
              <div className="text-xl font-bold text-gray-900">{hero.stats.guarantee}</div>
              <ShieldCheck className="mx-auto text-green-600 my-1" size={18} />
              <p className="text-xs font-medium text-gray-500">Fee Return Guarantee</p>
            </div>
          </div>

          {/* ── PROGRESS BAR ──────────────────────────────────────────
              Calculated in page.jsx based on REAL accumulated watch time.
              Does NOT increase by scrubbing — only by actual playback.
              Updates in real-time as student watches.
          ─────────────────────────────────────────────────────────── */}
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800 text-sm">Course Progress</span>
              <span className="text-green-600 font-bold text-sm">
                {progressClamped.toFixed(1)}% Complete
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-700"
                style={{ width: `${progressClamped}%` }}
              />
            </div>
            {progressClamped === 100 && (
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <Award size={13} />
                Course Complete! Your Microsoft Certified Certificate is ready.
              </p>
            )}
          </div>

          {/* ── COURSE FEATURE BADGES ─────────────────────────────────
              Only shown for features that are true in spcourses.js
              IMPORTANT: "Lifetime Access" is intentionally excluded.
              `details.lifetimeAccess` is false in this course.
          ─────────────────────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-3 mt-5">
            {course.details?.certificate && (
              <span className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full">
                <Award size={13} className="text-green-600" />
                Microsoft Certified Certificate
              </span>
            )}
            {/* NOTE: lifetimeAccess badge is intentionally NOT rendered.
                Do not add it back here. */}
            {course.details?.mobileAccess && (
              <span className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full">
                <Wifi size={13} className="text-green-600" />
                Mobile Accessible
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full">
              <ShieldCheck size={13} className="text-green-600" />
              100% Fee Return Guarantee
            </span>
          </div>
        </div>

        {/* ── RIGHT SIDE ENROLL CARD ───────────────────────────────── */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg border overflow-hidden lg:sticky lg:top-24">

            {/* Course image with discount badge */}
            <div className="relative">
              <img
                src={hero.image}
                alt={hero.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              {/* Image fallback */}
              <div className="hidden w-full h-48 bg-gradient-to-br from-green-600 to-green-800 items-center justify-center">
                <BookOpen size={48} className="text-white/60" />
              </div>

              {hero.pricing.discount && (
                <div className="absolute top-3 right-3 bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  {hero.pricing.discount}
                </div>
              )}
            </div>

            {/* ── PRICING ───────────────────────────────────────────────
                Prices defined in spcourses.js → hero.pricing
            ─────────────────────────────────────────────────────────── */}
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                ₹{hero.pricing.discountPrice}
              </div>
              {hero.pricing.price && (
                <div className="text-gray-400 font-medium line-through text-sm mb-5">
                  ₹{hero.pricing.price}
                </div>
              )}

              {/* Enroll button */}
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition">
                <BookOpen size={18} />
                Enroll Now
              </button>

              {/* NOTE: "30-Day Money-Back Guarantee" is intentionally removed.
                  The refund model is: complete course → submit projects →
                  get admin approval → request 100% refund (not a 30-day guarantee).
                  Do not add it back here. */}
            </div>

            {/* ── WHAT YOU GET SUMMARY ──────────────────────────────────
                Shows a quick bullet list of course benefits.
                "Lifetime Access" is intentionally excluded.
            ─────────────────────────────────────────────────────────── */}
            <div className="border-t px-6 py-4 space-y-2">
              {course.details?.certificate && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Award size={13} className="text-green-600" />
                  Microsoft Certified Certificate on completion
                </div>
              )}
              {/* Lifetime Access intentionally omitted */}
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ShieldCheck size={13} className="text-green-600" />
                100% fee return on course completion
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Target size={13} className="text-green-600" />
                5 real-world industry-level projects
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}