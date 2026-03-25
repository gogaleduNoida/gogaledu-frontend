// components/FeeRefundSection.jsx

// ─────────────────────────────────────────────────────────────────
// Fee Refund Section
//
// ── LOCK LOGIC ───────────────────────────────────────────────────
//   The "Request Refund" button is LOCKED until ALL 4 are true:
//   1. allVideosWatched     — every lesson fully watched (real time)
//   2. allQuizzesPassed     — every module quiz passed ≥60%
//   3. allProjectsSubmitted — every project PDF uploaded by student
//   4. allProjectsAccepted  — every project marked green by admin
//
//   These are computed in page.jsx and passed as props.
//
// ── REFUND BUTTON STATES ──────────────────────────────────────────
//   "none"    → Locked (conditions not met) OR unlocked (waiting to request)
//   "pending" → Processing — student clicked Request, admin reviewing
//   "success" → Refund Complete — shown with GREEN background
//   "denied"  → Rejected — shown with RED background
//               + "Contact support for more info" message
//               + Button linking to /contact page
//
// ── ADMIN CONTROLS ───────────────────────────────────────────────
//   Admin (localStorage key "gogaledu_admin" = "true") can:
//   - Mark refund as processed (success)
//   - Deny the refund
//   Replace with your real auth check in production.
//
// ── STORAGE ──────────────────────────────────────────────────────
//   Refund status: localStorage key `refund-status-{courseSlug}`
//   Replace with API call in production:
//     POST  /api/refunds  { courseSlug, studentId }
//     PATCH /api/refunds/{id} { status: "success" | "denied" }
//
// ── PROPS ────────────────────────────────────────────────────────
//   courseSlug          — From spcourses.js slug
//   originalPrice       — Course price string (e.g. "2999")
//   allVideosWatched    — All lessons fully watched (boolean)
//   allQuizzesPassed    — All module quizzes passed ≥60% (boolean)
//   allProjectsSubmitted— All project PDFs uploaded (boolean)
//   allProjectsAccepted — All projects marked accepted by admin (boolean)
// ─────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Clock, CheckCircle, XCircle, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function FeeRefundSection({
  courseSlug           = "",
  originalPrice        = "2999",
  allVideosWatched     = false,
  allQuizzesPassed     = false,
  allProjectsSubmitted = false,
  allProjectsAccepted  = false
}) {
  const [refundStatus, setRefundStatus] = useState("none");
  const [isAdmin,      setIsAdmin]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  // ── Check if all 4 conditions are met ──────────────────────────
  // Only when all are true does the refund button become clickable.
  const isUnlocked =
    allVideosWatched &&
    allQuizzesPassed &&
    allProjectsSubmitted &&
    allProjectsAccepted;

  // ── Load admin flag and saved refund status ─────────────────────
  useEffect(() => {
    const admin  = localStorage.getItem("gogaledu_admin") === "true";
    const status = localStorage.getItem(`refund-status-${courseSlug}`) || "none";
    setIsAdmin(admin);
    setRefundStatus(status);
  }, [courseSlug]);

  // ── Update refund status (saves to localStorage) ────────────────
  const updateStatus = (status) => {
    setRefundStatus(status);
    localStorage.setItem(`refund-status-${courseSlug}`, status);
    setShowConfirm(false);
  };

  // ── Which conditions are still unmet (for the locked hint) ──────
  const unmetConditions = [
    !allVideosWatched     && "Watch all course videos completely",
    !allQuizzesPassed     && "Pass all module quizzes (≥60%)",
    !allProjectsSubmitted && "Submit all project files",
    !allProjectsAccepted  && "All projects approved by admin"
  ].filter(Boolean);

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <section className="mt-6 mb-12">
      <div className={`rounded-2xl border p-6 transition-all ${
        refundStatus === "success"
          ? "bg-green-50 border-green-300"
          : refundStatus === "denied"
            ? "bg-red-50 border-red-300"
            : refundStatus === "pending"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-white border-gray-200"
      }`}>

        {/* ── TOP ROW ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            refundStatus === "success"
              ? "bg-green-100"
              : refundStatus === "denied"
                ? "bg-red-100"
                : refundStatus === "pending"
                  ? "bg-yellow-100"
                  : "bg-green-50"
          }`}>
            {refundStatus === "success" ? (
              <CheckCircle size={28} className="text-green-600" />
            ) : refundStatus === "denied" ? (
              <XCircle size={28} className="text-red-500" />
            ) : (
              <ShieldCheck size={28} className="text-green-600" />
            )}
          </div>

          {/* Text + status badge */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">
                100% Fee Return Guarantee
              </h3>

              {/* ── STATUS BADGE ──────────────────────────────────────
                  Shows once a refund is requested.
              ─────────────────────────────────────────────────────── */}
              {refundStatus === "pending" && (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-yellow-100 text-yellow-700 border-yellow-200">
                  <Clock size={12} />
                  Processing
                </span>
              )}
              {refundStatus === "success" && (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-green-100 text-green-700 border-green-200">
                  <CheckCircle size={12} />
                  Refund Complete
                </span>
              )}
              {refundStatus === "denied" && (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-red-100 text-red-600 border-red-200">
                  <XCircle size={12} />
                  Refund Rejected
                </span>
              )}

              {/* Lock icon when conditions not met */}
              {refundStatus === "none" && !isUnlocked && (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-gray-100 text-gray-500 border-gray-200">
                  <Lock size={12} />
                  Locked
                </span>
              )}
            </div>

            {/* ── DESCRIPTION TEXT ──────────────────────────────────
                This text is shown in the curriculum section.
                It describes the refund policy and timeline.
            ─────────────────────────────────────────────────────── */}
            <p className="text-sm text-gray-600 leading-relaxed">
              Request a 100% refund upon Course Completion and Project Submission.
              Refunds are processed within <strong>30 business days</strong>.
            </p>

            {/* Admin controls */}
            {isAdmin && refundStatus === "pending" && (
              <div className="flex gap-2 mt-3 flex-wrap">
                <button
                  onClick={() => updateStatus("success")}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                >
                  ✓ Mark Refund Processed
                </button>
                <button
                  onClick={() => updateStatus("denied")}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                >
                  ✗ Deny Refund
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDE: REFUND BUTTON STATES ───────────────────── */}
          <div className="flex-shrink-0 text-center min-w-[130px]">

            {/* ─── STATE 1: Button locked — conditions not met ─────── */}
            {refundStatus === "none" && !isUnlocked && !showConfirm && (
              <button
                disabled
                title="Complete all requirements to unlock the refund"
                className="flex items-center gap-2 text-sm font-semibold text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed px-4 py-2.5 rounded-xl"
              >
                <Lock size={14} />
                Request Refund
              </button>
            )}

            {/* ─── STATE 2: Button unlocked — ready to request ─────── */}
            {refundStatus === "none" && isUnlocked && !showConfirm && (
              <button
                onClick={() => setShowConfirm(true)}
                className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 border border-green-600 px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                Request Refund
              </button>
            )}

            {/* ─── Confirmation prompt ──────────────────────────────── */}
            {refundStatus === "none" && showConfirm && (
              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  Request refund of ₹{originalPrice}?
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => updateStatus("pending")}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-xs"
                  >
                    Yes, Request
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ─── STATE 3: Processing (pending) ───────────────────── */}
            {refundStatus === "pending" && !isAdmin && (
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock size={20} className="text-yellow-600 animate-pulse" />
                </div>
                <p className="text-xs font-semibold text-yellow-700">Processing</p>
                <p className="text-xs text-gray-400">Up to 30 business days</p>
              </div>
            )}

            {/* ─── STATE 4: Refund Complete (success) ──────────────── */}
            {refundStatus === "success" && (
              <div className="bg-green-600 rounded-xl px-5 py-3 text-center">
                <CheckCircle size={22} className="text-white mx-auto mb-1" />
                <p className="text-sm font-bold text-white">Refund Complete</p>
                <p className="text-xs text-green-100 mt-0.5">Check your account</p>
              </div>
            )}

            {/* ─── STATE 5: Rejected ───────────────────────────────── */}
            {refundStatus === "denied" && (
              <div className="bg-red-600 rounded-xl px-5 py-3 text-center">
                <XCircle size={22} className="text-white mx-auto mb-1" />
                <p className="text-sm font-bold text-white">Refund Rejected</p>
              </div>
            )}

          </div>
        </div>

        {/* ── REJECTED: Contact Support Message ───────────────────────
            Shown below the card when the refund is denied.
        ─────────────────────────────────────────────────────────── */}
        {refundStatus === "denied" && (
          <div className="mt-4 pt-4 border-t border-red-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>Contact support for more info about your refund status.</span>
            </div>
            {/* Link to /contact page */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex-shrink-0"
            >
              Go to Contact Page →
            </Link>
          </div>
        )}

        {/* ── LOCKED: Show which conditions are unmet ──────────────────
            Helps students understand exactly what they need to do.
        ─────────────────────────────────────────────────────────── */}
        {refundStatus === "none" && !isUnlocked && unmetConditions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
              <Lock size={12} />
              Complete the following to unlock your refund:
            </p>
            <ul className="space-y-1">
              {unmetConditions.map((condition, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── FULLY UNLOCKED: All requirements met, not yet requested ──
            Show a green confirmation of all conditions passed.
        ─────────────────────────────────────────────────────────── */}
        {refundStatus === "none" && isUnlocked && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
              <CheckCircle size={13} />
              All requirements completed! You are eligible to request your 100% refund.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}