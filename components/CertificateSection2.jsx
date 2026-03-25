// components/CertificateSection2.jsx

// ─────────────────────────────────────────────────────────────────
// Microsoft Certified Certificate Section
//
// This section shows the student's certificate status and allows
// download once the admin marks it as generated.
//
// ── CERTIFICATE TYPE ─────────────────────────────────────────────
//   This course awards a "Microsoft Certified Certificate"
//   issued by GogalEdu Academy upon full course completion.
//
// ── STATUS ───────────────────────────────────────────────────────
//   "pending"   → Yellow — Certificate not ready yet
//   "generated" → Green  — Certificate ready to download
//
// ── HOW STATUS IS SET ────────────────────────────────────────────
//   Admin sets: localStorage key "cert-status-{courseSlug}"
//               = "pending" | "generated"
//   → In production: replace with API endpoint
//     e.g. PATCH /api/courses/{slug}/certificate { status: "generated" }
//
// ── DOWNLOAD ─────────────────────────────────────────────────────
//   Currently links to /api/certificate?slug=...
//   → Implement this endpoint to generate a PDF server-side
//     or link to a static PDF: /public/certificates/slug.pdf
//
// ── PROPS ────────────────────────────────────────────────────────
//   courseSlug   — Matches spcourses.js key (e.g. "advance-excel")
//   progress     — Current course completion % (0–100)
//   courseName   — Course title for display
//   studentName  — Student name (from auth session in production)
// ─────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import { Award, Download, Clock, CheckCircle, BadgeCheck } from "lucide-react";

export default function CertificateSection2({
  courseSlug  = "",
  progress    = 0,
  studentName = "Student",
  courseName  = "Course"
}) {
  const [certStatus, setCertStatus] = useState("pending");
  const [isAdmin,    setIsAdmin]    = useState(false);

  // ── Load saved status from localStorage ──────────────────────
  useEffect(() => {
    const admin  = localStorage.getItem("gogaledu_admin") === "true";
    const status = localStorage.getItem(`cert-status-${courseSlug}`) || "pending";
    setIsAdmin(admin);
    setCertStatus(status);
  }, [courseSlug]);

  // ── Admin: update certificate status ─────────────────────────
  const handleStatusChange = (newStatus) => {
    setCertStatus(newStatus);
    localStorage.setItem(`cert-status-${courseSlug}`, newStatus);
  };

  const generated = certStatus === "generated";

  return (
    <section className="mt-10">
      <div className={`rounded-2xl border p-6 transition-all ${
        generated
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          : "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200"
      }`}>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

          {/* Certificate icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            generated ? "bg-green-100" : "bg-yellow-100"
          }`}>
            <Award size={28} className={generated ? "text-green-600" : "text-yellow-600"} />
          </div>

          {/* Info block */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* Certificate title */}
              <h3 className="text-lg font-bold text-gray-900">
                Microsoft Certified Certificate
              </h3>

              {/* ── STATUS BADGE ────────────────────────────────────
                  Green = Generated | Yellow = Pending
                  Admin sees control buttons; student sees badge only.
              ─────────────────────────────────────────────────────── */}
              {generated ? (
                <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                  <CheckCircle size={12} />
                  Certificate Ready ✓
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-200">
                  <Clock size={12} />
                  Certificate Pending
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500">
              {generated
                ? `Your Microsoft Certified Certificate for "${courseName}" is ready. Download and share on LinkedIn!`
                : "Complete the full course and all projects. Our team will generate and verify your Microsoft Certified Certificate."
              }
            </p>

            {/* Microsoft certification note */}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 font-medium">
              <BadgeCheck size={13} />
              Issued by GogalEdu Academy · Microsoft Certified Program
            </div>

            {/* Admin controls — visible only when isAdmin = true */}
            {isAdmin && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleStatusChange("generated")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition ${
                    generated
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
                  }`}
                >
                  ✓ Mark Generated
                </button>
                <button
                  onClick={() => handleStatusChange("pending")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition ${
                    !generated
                      ? "bg-yellow-500 text-white border-yellow-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-yellow-400"
                  }`}
                >
                  ⏳ Mark Pending
                </button>
              </div>
            )}
          </div>

          {/* ── DOWNLOAD BUTTON ──────────────────────────────────────
              Active only when status = "generated".
              PRODUCTION: Replace href with your certificate endpoint.
              e.g. /api/certificates/generate?courseSlug=advance-excel
              Or static PDF: /public/certificates/advance-excel.pdf
          ─────────────────────────────────────────────────────────── */}
          {generated ? (
            <a
              href={`/api/certificate?slug=${courseSlug}&name=${encodeURIComponent(studentName)}`}
              download={`GogalEdu_MicrosoftCertified_${courseSlug}.pdf`}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-xl transition flex-shrink-0 text-sm shadow-sm"
            >
              <Download size={16} />
              Download Certificate
            </a>
          ) : (
            <button
              disabled
              title="Complete the course to unlock your certificate"
              className="flex items-center gap-2 bg-gray-200 text-gray-400 cursor-not-allowed font-semibold px-5 py-3 rounded-xl text-sm flex-shrink-0"
            >
              <Download size={16} />
              Download Certificate
            </button>
          )}
        </div>

        {/* ── PROGRESS INDICATOR when not yet at 100% ─────────────── */}
        {!generated && progress < 100 && (
          <div className="mt-4 pt-4 border-t border-yellow-200">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Course completion needed</span>
              <span className="font-semibold text-yellow-700">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 bg-yellow-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Watch all videos, pass all quizzes and submit all projects to qualify.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}