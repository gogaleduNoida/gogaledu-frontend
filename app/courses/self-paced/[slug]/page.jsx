"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { spcourses } from "@/db/spcourses";

// import CourseHero from "@/components/CourseHero";
import VideoPlayer from "@/components/VideoPlayer";
import Quiz from "@/components/Quiz";
import ProjectsSection from "@/components/ProjectsSection";
import CertificateSection2 from "@/components/CertificateSection2";
import FeeRefundSection from "@/components/FeeRefundSection";

import {
  BookOpen, Lock, Play, ChevronDown, ChevronUp,
  CheckCircle2, Clock, Target, Award, Wrench,
  CircleCheck, BookMarked, GraduationCap, Zap,
  BarChart3, Code2, Database, FileText, Star, Users, PlayCircle, ShieldCheck, Wifi
} from "lucide-react";

// ── Icon map for overview cards ──────────────────────────────────
const OVERVIEW_ICONS = [
  <BarChart3  size={20} />,
  <Zap        size={20} />,
  <Database   size={20} />,
  <Target     size={20} />,
  <Code2      size={20} />,
  <BookMarked size={20} />,
  <Award      size={20} />,
  <FileText   size={20} />,
  <Star       size={20} />,
  <CheckCircle2 size={20} />
];

const OVERVIEW_COLORS = [
  "bg-green-50  border-green-200  text-green-600",
  "bg-blue-50   border-blue-200   text-blue-600",
  "bg-purple-50 border-purple-200 text-purple-600",
  "bg-amber-50  border-amber-200  text-amber-600",
  "bg-teal-50   border-teal-200   text-teal-600",
  "bg-rose-50   border-rose-200   text-rose-600",
  "bg-indigo-50 border-indigo-200 text-indigo-600",
  "bg-orange-50 border-orange-200 text-orange-600",
  "bg-cyan-50   border-cyan-200   text-cyan-600",
  "bg-lime-50   border-lime-200   text-lime-600"
];

// ── Format seconds → "Xm Ys" ────────────────────────────────────
function fmtDuration(s) {
  if (!s || s < 0) return "0s";
  const m   = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  if (m === 0) return `${sec}s`;
  return `${m}m ${sec > 0 ? sec + "s" : ""}`.trim();
}

// ── localStorage key helpers ─────────────────────────────────────
const keys = {
  progress:  (slug) => `sp-progress-${slug}`,   // { videoPath: { watched, position, duration } }
  completed: (slug) => `sp-completed-${slug}`,   // [videoPath, ...]
  quizzes:   (slug) => `sp-quizzes-${slug}`,     // [moduleIndex, ...]
  quizScores:(slug) => `sp-quizscores-${slug}`,  // { moduleIndex: score% }
  scores:    (slug) => `sp-scores-${slug}`,      // { moduleIndex: scorePercent }
  projStatus:(slug, id) => `proj-status-${slug}-${id}`,
  projUpload:(slug, id) => `proj-upload-${slug}-${id}`
};

export default function CourseDetailPage() {

  const { slug } = useParams(); 
  console.log("slug:", slug);
  const router = useRouter();
  // const course = spcourses?.[slug];
  // console.log(course)
  
  // ================= AUTH STATE =================
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      const foundcourse = spcourses?.[slug];
      setCourse(foundcourse);

      const auth = await checkAuth();   // check auth on page load
      setIsAuthenticated(auth);

      setLoading(false);
    };
    loadData();
  }, [slug]);

  // ================= AUTH CHECK =================
  const checkAuth = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-auth`, {
        method: "GET",
        credentials: "include"
      });

      if (!res.ok) return false;

      const data = await res.json();
      return data?.authenticated === true;

    } catch (error) {
      console.error("Auth check failed:", error);
      return false;
    }
  };

  // ================= ENROLL HANDLER =================
  const handleEnroll = async () => {

    const auth = await checkAuth();

    if (!auth) {
      router.push("/login");
      return;
    }

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: "GET",
        credentials: "include"
      });

      const user = await res.json();

      if (!user?.profile_completed) {
        router.push(`/user/profile?course=${slug}`);
        return;
      }
      console.log("Going to:", slug);
      router.push(`/sp-course-confirmation/${slug}`);

    } catch (err) {
      console.error("Enroll failed:", err);
    }
  };

  // ── UI STATE ────────────────────────────────────────────────────
  const [tab,          setTab]          = useState("overview");
  const [openModule,   setOpenModule]   = useState(0);
  const [activeVideo,  setActiveVideo]  = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [videoKey,     setVideoKey]     = useState(0);

  // ── PROGRESS STATE ──────────────────────────────────────────────
  const [lessonProgress,   setLessonProgress]   = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  const [passedQuizzes,    setPassedQuizzes]    = useState([]);
  const [quizScores,       setQuizScores]       = useState({});
  const [projectStatuses, setProjectStatuses] = useState({});
  const [projectUploads,  setProjectUploads]  = useState({});

  // ── LOAD ALL SAVED STATE FROM LOCALSTORAGE ──────────────────────
  useEffect(() => {
    if (!slug) return;
    try {
      const savedProgress  = localStorage.getItem(keys.progress(slug));
      const savedCompleted = localStorage.getItem(keys.completed(slug));
      const savedQuizzes   = localStorage.getItem(keys.quizzes(slug));
      const savedScores    = localStorage.getItem(keys.quizScores(slug));
      if (savedProgress)  setLessonProgress(JSON.parse(savedProgress));
      if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));
      if (savedQuizzes)   setPassedQuizzes(JSON.parse(savedQuizzes));
      if (savedScores)    setQuizScores(JSON.parse(savedScores));
    } catch (e) {
      console.error("Error loading progress:", e);
    }

    // Load project state
    if (course?.projects) {
      const statuses = {};
      const uploads  = {};
      course.projects.forEach((p) => {
        statuses[p.id] = localStorage.getItem(keys.projStatus(slug, p.id)) || "pending";
        const upload   = localStorage.getItem(keys.projUpload(slug, p.id));
        if (upload) uploads[p.id] = upload;
      });
      setProjectStatuses(statuses);
      setProjectUploads(uploads);
    }
  }, [slug, course]);

  // ── PERSIST lessonProgress ───────────────────────────────────────
  useEffect(() => {
    if (!slug || Object.keys(lessonProgress).length === 0) return;
    localStorage.setItem(keys.progress(slug), JSON.stringify(lessonProgress));
  }, [lessonProgress, slug]);

  // ── PERSIST completedLessons ─────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    localStorage.setItem(keys.completed(slug), JSON.stringify(completedLessons));
  }, [completedLessons, slug]);

  // ── PERSIST passedQuizzes ────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    localStorage.setItem(keys.quizzes(slug), JSON.stringify(passedQuizzes));
  }, [passedQuizzes, slug]);

  // ── PERSIST quizScores ───────────────────────────────────────────
  useEffect(() => {
    if (!slug || Object.keys(quizScores).length === 0) return;
    localStorage.setItem(keys.quizScores(slug), JSON.stringify(quizScores));
  }, [quizScores, slug]);

  // ── FLAT LIST OF ALL LESSONS ─────────────────────────────────────
  const allLessons = useMemo(() => {
    if (!course?.curriculum) return [];
    return course.curriculum.flatMap((mod, mi) =>
      mod.lessons.map((lesson, li) => ({
        ...lesson,
        moduleIndex: mi,
        lessonIndex: li
      }))
    );
  }, [course]);

  // ── TOTAL COURSE DURATION (seconds) ─────────────────────────────
  const totalDuration = useMemo(() => {
    if (!course?.curriculum) return 1;
    return course.curriculum.reduce(
      (total, mod) =>
        total + mod.lessons.reduce((t, l) => t + (l.durationSeconds || 0), 0),
      0
    );
  }, [course]);

  const progress = useMemo(() => {
    if (totalDuration <= 0) return 0;
    const totalWatched = Object.values(lessonProgress).reduce(
      (sum, v) => sum + Math.min(v.watched || 0, v.duration || v.watched || 0),
      0
    );
    return Math.min((totalWatched / totalDuration) * 100, 100);
  }, [lessonProgress, totalDuration]);

  const isLessonLocked = useCallback((moduleIndex, lessonIndex) => {
    if (!course?.curriculum) return true;

    // Calculate global index of this lesson
    let globalIdx = 0;
    for (let mi = 0; mi < moduleIndex; mi++) {
      globalIdx += course.curriculum[mi].lessons.length;
    }
    globalIdx += lessonIndex;

    // First 3 lessons (free preview) are always unlocked
    if (globalIdx < 3) return false;

    // Previous lesson must be completed
    const prevLesson = allLessons[globalIdx - 1];
    if (prevLesson && !completedLessons.includes(prevLesson.video)) {
      return true;
    }

    if (lessonIndex === 0 && moduleIndex > 0) {
      const prevModule = course.curriculum[moduleIndex - 1];
      const prevHasQuiz = prevModule?.quiz && prevModule.quiz.length > 0;
      if (prevHasQuiz && !passedQuizzes.includes(moduleIndex - 1)) {
        return true;
      }
    }

    return false;
  }, [course, allLessons, completedLessons, passedQuizzes]);

  // ── CAN TAKE QUIZ CHECK ──────────────────────────────────────────
  // Quiz unlocks only when ALL lessons in the module are completed.
  const canTakeQuiz = useCallback((moduleIndex) => {
    if (!course?.curriculum) return false;
    return course.curriculum[moduleIndex].lessons.every(
      (lesson) => completedLessons.includes(lesson.video)
    );
  }, [course, completedLessons]);

  // ── HANDLE TIME UPDATE FROM VIDEOPLAYER ──────────────────────────
  // Receives: (accumulatedWatched, duration, currentPosition)
  //
  // accumulatedWatched — real wall-clock seconds the video has played
  //                      (not the seek position)
  // currentPosition   — current playhead position (for resume seeking)
  //
  // Completion threshold: watched >= duration - 0.5 (0.5s tolerance)
  const handleTimeUpdate = useCallback((accumulatedWatched, duration, currentPosition) => {
    if (!activeVideo || !duration) return;

    setLessonProgress((prev) => {
      const existing   = prev[activeVideo] || { watched: 0, position: 0, duration };
      // Never let accumulated go backwards (in case of rapid updates)
      const newWatched = Math.max(existing.watched, accumulatedWatched);

      // ── COMPLETION CHECK ───────────────────────────────────────
      // Mark as completed when real watch time ≥ video duration - 0.5s.
      // This ensures the student actually watched (not just scrubbed).
      if (newWatched >= duration - 0.5) {
        setCompletedLessons((prevCompleted) => {
          if (!prevCompleted.includes(activeVideo)) {
            return [...prevCompleted, activeVideo];
          }
          return prevCompleted;
        });
      }

      return {
        ...prev,
        [activeVideo]: {
          watched:  newWatched,
          position: Math.floor(currentPosition || 0), // save resume position
          duration: Math.floor(duration)
        }
      };
    });
  }, [activeVideo]);

  // ── VIDEO ENDED: Auto-play next lesson if unlocked ───────────────
  const handleVideoEnded = useCallback(() => {
    const currentIdx = allLessons.findIndex((l) => l.video === activeVideo);
    if (currentIdx !== -1 && currentIdx < allLessons.length - 1) {
      const next = allLessons[currentIdx + 1];
      if (!isLessonLocked(next.moduleIndex, next.lessonIndex)) {
        setActiveVideo(next.video);
        setActiveLesson({ moduleIndex: next.moduleIndex, lessonIndex: next.lessonIndex });
        // Auto-expand the next module accordion if needed
        if (next.moduleIndex !== activeLesson?.moduleIndex) {
          setOpenModule(next.moduleIndex);
        }
      }
    }
  }, [activeVideo, allLessons, isLessonLocked, activeLesson]);

  // ── QUIZ PASS HANDLER ────────────────────────────────────────────
  // ── QUIZ PASS HANDLER ────────────────────────────────────────────
  // Called by Quiz with (moduleIndex, scorePercent) when student passes
  const handleQuizPass = useCallback((moduleIndex, scorePercent) => {
    setPassedQuizzes((prev) => {
      if (!prev.includes(moduleIndex)) return [...prev, moduleIndex];
      return prev;
    });
    // Save the score so the passed badge can display it
    setQuizScores((prev) => ({ ...prev, [moduleIndex]: scorePercent }));
  }, []);

  // ── OPEN VIDEO PLAYER ────────────────────────────────────────────
  const openVideo = (lesson, moduleIndex, lessonIndex) => {
    if (isLessonLocked(moduleIndex, lessonIndex)) return;
    setVideoKey((k) => k + 1); // always increment → forces VideoPlayer remount
    setActiveVideo(lesson.video);
    setActiveLesson({ moduleIndex, lessonIndex });
  };

  // ── PROJECT STATUS CHANGE (from ProjectsSection admin) ──────────
  const handleProjectStatusChange = useCallback((projectId, newStatus) => {
    setProjectStatuses((prev) => ({ ...prev, [projectId]: newStatus }));
    localStorage.setItem(keys.projStatus(slug, projectId), newStatus);
  }, [slug]);

  // ── PROJECT UPLOAD CHANGE (from ProjectsSection student) ────────
  const handleProjectUploadChange = useCallback((projectId, fileName) => {
    setProjectUploads((prev) => ({ ...prev, [projectId]: fileName }));
    if (fileName) {
      localStorage.setItem(keys.projUpload(slug, projectId), fileName);
    } else {
      localStorage.removeItem(keys.projUpload(slug, projectId));
    }
  }, [slug]);

  // ── REFUND UNLOCK CONDITIONS ─────────────────────────────────────
  // All four must be true before the student can request a refund.

  // 1. All lessons fully watched
  const allVideosWatched = useMemo(() => {
    if (!allLessons.length) return false;
    return allLessons.every((l) => completedLessons.includes(l.video));
  }, [allLessons, completedLessons]);

  // 2. All module quizzes passed (skip modules with no quiz)
  const allQuizzesPassed = useMemo(() => {
    if (!course?.curriculum) return false;
    return course.curriculum.every((mod, mi) => {
      if (!mod.quiz || mod.quiz.length === 0) return true; // no quiz = no requirement
      return passedQuizzes.includes(mi);
    });
  }, [course, passedQuizzes]);

  // 3. All projects uploaded by student
  const allProjectsSubmitted = useMemo(() => {
    if (!course?.projects?.length) return false;
    return course.projects.every((p) => !!projectUploads[p.id]);
  }, [course, projectUploads]);

  // 4. All projects accepted (green icon) by admin
  const allProjectsAccepted = useMemo(() => {
    if (!course?.projects?.length) return false;
    return course.projects.every((p) => projectStatuses[p.id] === "accepted");
  }, [course, projectStatuses]);

  // ── CERTIFICATE UNLOCK ───────────────────────────────────────────
  const certificateUnlocked = progress >= 100;

  // ── 404 GUARD ────────────────────────────────────────────────────
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <GraduationCap size={56} className="text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-700">Course not found</h1>
        <p className="text-gray-500">
          The course{" "}
          <code className="bg-gray-100 px-2 py-0.5 rounded">{slug}</code>{" "}
          does not exist in spcourses.js
        </p>
        <p className="text-sm text-gray-400">
          Add it to{" "}
          <code className="bg-gray-100 px-1 rounded">db/spcourses.js</code>{" "}
          to activate this page.
        </p>
      </div>
    );
  }

  const hero = course?.hero;
  if (!hero) return null;

  const progressClamped = Math.min(Math.max(progress, 0), 100);

  const ICON_MAP = {
    target: <Target className="w-4 h-4" />,
    clock: <Clock className="w-4 h-4" />,
    online: <PlayCircle className="w-4 h-4" />,
    award: <Award className="w-4 h-4" />,
    wifi: <Wifi className="w-4 h-4" />
  };

  // Tag pill colors — cycles by index
  const TAG_COLORS = [
    "bg-green-100  text-green-700",
    "bg-blue-100   text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100  text-amber-700"
  ];

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      <section className="pt-28 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-10">

          {/* ── LEFT SIDE ──────────────────────────────────────────── */}
          <div className="lg:col-span-2">
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
                <motion.button
                  onClick={handleEnroll}
                  className="w-full cursor-pointer bg-green-700 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Enroll Now</span>
                </motion.button>

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

      {/* ── STICKY TABS ─────────────────────────────────────────── */}
      <section className="bg-white border-t border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 relative">
            {["overview", "curriculum"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-4 px-2 font-semibold text-sm capitalize transition ${
                  tab === t ? "text-green-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "overview" ? "Overview" : "Course Curriculum"}
              </button>
            ))}
            {/* Animated underline */}
            <div
              className="absolute bottom-0 h-0.5 bg-green-600 transition-all duration-300"
              style={{
                left:  tab === "overview" ? "0px"   : "120px",
                width: tab === "overview" ? "88px"  : "155px"
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TAB: OVERVIEW
      ════════════════════════════════════════════════════════════ */}
      {tab === "overview" && (
        <div className="max-w-5xl mx-auto py-10 px-4">

          {/* ── OVERVIEW CARDS ──────────────────────────────────── */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Course Overview</h2>
          <p className="text-gray-500 mb-8">What you&apos;ll learn in this course</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {course.overview?.map((item, i) => {
              const colorClass = OVERVIEW_COLORS[i % OVERVIEW_COLORS.length];
              const icon       = OVERVIEW_ICONS[i % OVERVIEW_ICONS.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border-2 rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${colorClass}`}>
                    {icon}
                  </div>
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">{item}</p>
                </motion.div>
              );
            })}
          </div>

          {/* ── REQUIREMENTS ──────────────────────────────────────── */}
          {course.requirements?.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
              <div className="bg-white border rounded-2xl p-6 grid sm:grid-cols-2 gap-3">
                {course.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CircleCheck size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TOOLS ─────────────────────────────────────────────── */}
          {course.tools?.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tools & Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {course.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:border-green-300 transition"
                  >
                    <Wrench size={14} className="text-green-600" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── INSTRUCTOR ────────────────────────────────────────── */}
          {course.instructor && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Instructor</h3>
              <div className="bg-white border rounded-2xl p-6 flex items-center gap-4">
                {course.instructor.avatar ? (
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {course.instructor.name?.charAt(0) || "?"}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900">{course.instructor.name}</p>
                  <p className="text-green-600 text-sm">{course.instructor.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{course.instructor.experience}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB: CURRICULUM
      ════════════════════════════════════════════════════════════ */}
      {tab === "curriculum" && (
        <div className="max-w-5xl mx-auto py-10 px-4">

          {/* ── CURRICULUM HEADER ─────────────────────────────────── */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Course Curriculum</h2>
              <p className="text-gray-500 text-sm mt-1">
                {course.curriculum.length} modules •{" "}
                {allLessons.length} lessons •{" "}
                {fmtDuration(totalDuration)} total
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{progress.toFixed(1)}%</p>
              <p className="text-xs text-gray-400">completed</p>
            </div>
          </div>

          {/* ── MODULES ACCORDION ─────────────────────────────────── */}
          <div className="space-y-3 mb-10">
            {course.curriculum.map((module, mi) => {

              const isOpen          = openModule === mi;
              const moduleCompleted = module.lessons.every(
                (l) => completedLessons.includes(l.video)
              );
              const quizPassed      = passedQuizzes.includes(mi);
              const completedCount  = module.lessons.filter(
                (l) => completedLessons.includes(l.video)
              ).length;
              const isFreePreview   = module.isFreePreview === true;

              return (
                <div
                  key={mi}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* ── Module Header (click to expand) ──────────── */}
                  <button
                    onClick={() => setOpenModule(isOpen ? null : mi)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition"
                  >
                    {/* Module number / status icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      moduleCompleted && (quizPassed || !module.quiz?.length)
                        ? "bg-green-100 text-green-600"
                        : isFreePreview
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                    }`}>
                      {moduleCompleted && (quizPassed || !module.quiz?.length)
                        ? <CheckCircle2 size={18} className="text-green-600" />
                        : mi + 1
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{module.moduleTitle}</p>
                        {/* Free preview badge */}
                        {isFreePreview && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium border border-blue-200">
                            Free Preview
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{module.moduleDescription}</p>
                    </div>

                    {/* Progress badge + quiz status */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">
                        {completedCount}/{module.lessons.length} done
                      </span>
                      {quizPassed && (
                        <span className="text-xs bg-green-100 text-green-600 px-2.5 py-0.5 rounded-full font-medium border border-green-200 flex items-center gap-1">
                          Quiz ✓
                          {quizScores[mi] !== undefined && (
                            <span className="font-bold">{quizScores[mi]}%</span>
                          )}
                        </span>
                      )}
                      {isOpen
                        ? <ChevronUp size={18} className="text-gray-400" />
                        : <ChevronDown size={18} className="text-gray-400" />
                      }
                    </div>
                  </button>

                  {/* ── Module Content (lessons + quiz) ───────────── */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-2 bg-gray-50 border-t border-gray-100">

                          {/* ── LESSONS ─────────────────────────────── */}
                          <div className="pt-3 space-y-2">
                            {module.lessons.map((lesson, li) => {
                              const locked    = isLessonLocked(mi, li);
                              const completed = completedLessons.includes(lesson.video);
                              const isActive  =
                                activeLesson?.moduleIndex === mi &&
                                activeLesson?.lessonIndex === li;
                              const saved     = lessonProgress[lesson.video];

                              // ── WATCH PERCENTAGE ─────────────────────
                              // Shown as a mini progress bar and text.
                              // Based on REAL accumulated watch time, not position.
                              const watchPct = saved?.duration
                                ? Math.min((saved.watched / saved.duration) * 100, 100)
                                : 0;

                              return (
                                <div
                                  key={li}
                                  className={`rounded-xl border p-4 transition ${
                                    locked
                                      ? "bg-gray-100 border-gray-200 opacity-70"
                                      : isActive
                                        ? "bg-green-50 border-green-300 shadow-sm"
                                        : "bg-white border-gray-200 hover:border-green-200 hover:shadow-sm"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">

                                    {/* Status icon */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      completed ? "bg-green-100"
                                        : locked   ? "bg-gray-200"
                                        : "bg-green-50"
                                    }`}>
                                      {completed ? (
                                        <CheckCircle2 size={16} className="text-green-600" />
                                      ) : locked ? (
                                        <Lock size={14} className="text-gray-400" />
                                      ) : (
                                        <Play size={14} className="text-green-600" />
                                      )}
                                    </div>

                                    {/* Lesson info */}
                                    <div className="flex-1 min-w-0">
                                      <p className={`font-medium text-sm ${locked ? "text-gray-400" : "text-gray-800"}`}>
                                        {lesson.lessonTitle}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        <Clock size={11} className="text-gray-400" />
                                        <span className="text-xs text-gray-400">
                                          {fmtDuration(lesson.durationSeconds)}
                                        </span>
                                        {completed && (
                                          <span className="text-xs text-green-600 font-medium">
                                            ✓ Completed
                                          </span>
                                        )}
                                        {!completed && !locked && watchPct > 0 && (
                                          <span className="text-xs text-blue-500 font-medium">
                                            {Math.round(watchPct)}% watched
                                          </span>
                                        )}
                                        {locked && (
                                          <span className="text-xs text-gray-400">
                                            {li === 0 && mi > 0 &&
                                             course.curriculum[mi - 1]?.quiz?.length > 0 &&
                                             !passedQuizzes.includes(mi - 1)
                                              ? "Complete previous module quiz to unlock"
                                              : "Watch previous lesson to unlock"
                                            }
                                          </span>
                                        )}
                                      </div>

                                      {/* Mini progress bar (real watch time) */}
                                      {!locked && watchPct > 0 && !completed && (
                                        <div className="mt-1.5 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-green-400 rounded-full transition-all"
                                            style={{ width: `${watchPct}%` }}
                                          />
                                        </div>
                                      )}
                                    </div>

                                    {/* Play / Replay button */}
                                    {!locked ? (
                                      <button
                                        onClick={() => openVideo(lesson, mi, li)}
                                        className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition flex-shrink-0 ${
                                          completed
                                            ? "text-gray-500 hover:text-green-600 hover:bg-green-50"
                                            : "text-green-600 hover:bg-green-100"
                                        }`}
                                      >
                                        <Play size={13} fill="currentColor" />
                                        {/* Once completed, show Replay — unlimited replays allowed */}
                                        {completed ? "Replay" : "Play"}
                                      </button>
                                    ) : (
                                      <Lock size={16} className="text-gray-300 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* ── MODULE QUIZ ─────────────────────────────
                              Available only after ALL lessons in module done.
                              Pass ≥60% to unlock the next module.
                              Student can retry if they score below 60%.
                          ─────────────────────────────────────────────── */}
                          {module.quiz && module.quiz.length > 0 && (
                            <div>
                              {canTakeQuiz(mi) ? (
                                <Quiz
                                  questions={module.quiz}
                                  moduleIndex={mi}
                                  passedQuizzes={passedQuizzes}
                                  quizScore={quizScores[mi]}
                                  onPass={handleQuizPass}
                                />
                              ) : (
                                <div className="mt-3 flex items-center gap-2 bg-gray-100 border border-dashed border-gray-300 rounded-xl p-3">
                                  <Lock size={14} className="text-gray-400" />
                                  <p className="text-xs text-gray-500">
                                    Watch all {module.lessons.length} lessons to unlock the module quiz
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* ── PROJECTS SECTION ────────────────────────────────────
              State is lifted to this page so FeeRefundSection can
              check whether all projects are accepted.
              ProjectsSection is "controlled" — statuses/uploads come
              from page state, changes are reported back via callbacks.
          ─────────────────────────────────────────────────────── */}
          {course.projects && course.projects.length > 0 && (
            <ProjectsSection
              projects={course.projects}
              courseSlug={slug}
              progress={progress}
              statuses={projectStatuses}
              uploads={projectUploads}
              onStatusChange={handleProjectStatusChange}
              onUploadChange={handleProjectUploadChange}
            />
          )}

          {/* ── CERTIFICATE SECTION ─────────────────────────────────
              Microsoft Certified Certificate.
              Admin sets status via admin panel (localStorage for now).
          ─────────────────────────────────────────────────────── */}
          <CertificateSection2
            courseSlug={slug}
            progress={progress}
            courseName={course.hero?.title || "Course"}
            studentName="Student"
            // TODO: Replace "Student" with actual name from your auth session
          />

          {/* ── FEE REFUND SECTION ──────────────────────────────────
              LOCKED until all 4 conditions are met:
              1. allVideosWatched   — all lessons fully watched
              2. allQuizzesPassed   — all module quizzes passed ≥60%
              3. allProjectsSubmitted — all project PDFs uploaded
              4. allProjectsAccepted  — admin marks all projects green
          ─────────────────────────────────────────────────────── */}
          <FeeRefundSection
            courseSlug={slug}
            originalPrice={course.hero?.pricing?.discountPrice || "2999"}
            allVideosWatched={allVideosWatched}
            allQuizzesPassed={allQuizzesPassed}
            allProjectsSubmitted={allProjectsSubmitted}
            allProjectsAccepted={allProjectsAccepted}
          />

        </div>
      )}

      {/* ── CTA SECTION ─────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Start Your Learning Journey</h2>
            <p className="text-green-100 mb-8">Join thousands of students building real skills.</p>
            <motion.button
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold flex items-center gap-3 mx-auto hover:bg-green-50 transition"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleEnroll}
            >
              <BookOpen className="w-5 h-5" />
              Enroll Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── VIDEO PLAYER OVERLAY ─────────────────────────────────────
          The player uses REAL wall-clock watch time tracking.
          savedTime    = last seek position (for resume)
          savedWatched = previously accumulated real watch seconds
          onTimeUpdate = receives (accumulatedWatched, duration, position)
      ─────────────────────────────────────────────────────────── */}
      {activeVideo && (
        <VideoPlayer
          key={videoKey}
          src={activeVideo}
          onClose={() => {
            setActiveVideo(null);
            setActiveLesson(null);
          }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          savedTime={lessonProgress[activeVideo]?.position || 0}
          savedWatched={lessonProgress[activeVideo]?.watched || 0}
          courseSlug={slug}
        />
      )}

    </div>
  );
}
