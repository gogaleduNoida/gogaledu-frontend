// components/ProjectsSection.jsx

// ─────────────────────────────────────────────────────────────────
// Real-World Industry-Level Projects Section
//
// ── LOCKING RULES ────────────────────────────────────────────────
//   • All projects locked (download + upload) until progress ≥ 30%
//   • After upload: upload section is PERMANENTLY locked (no edits)
//   • Exception: if admin rejects → upload re-opens for re-submission
//
// ── STATUS BADGE VISIBILITY ──────────────────────────────────────
//   • NO badge shown before student uploads anything
//   • After upload → "Pending Review" (yellow)
//   • Admin accepts → "Success" (green)
//   • Admin rejects → "Rejected" (red) + re-upload prompt shown
//
// ── UPLOAD CONFIRMATION ──────────────────────────────────────────
//   Before finalizing a file, student sees a modal:
//   "Are you sure you want to upload this file?
//    Once uploaded, you cannot edit this upload."
//   → Yes, Upload / Cancel
//
// ── PROPS ────────────────────────────────────────────────────────
//   projects       — Array from spcourses.js course.projects
//   courseSlug     — Slug string
//   progress       — Course progress % (projects locked until ≥ 30)
//   statuses       — { projectId: "pending"|"accepted"|"rejected" }
//   uploads        — { projectId: fileName }
//   onStatusChange — (projectId, newStatus) → void
//   onUploadChange — (projectId, fileName | null) → void
// ─────────────────────────────────────────────────────────────────

"use client";

import { useState, useRef } from "react";
import {
  Download, Upload, CheckCircle2,
  XCircle, Clock, FolderKanban,
  AlertCircle, Plus, Briefcase, Lock,
  AlertTriangle
} from "lucide-react";

// Status config — only rendered after the student has uploaded a file
const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    color: "bg-yellow-400",
    text:  "text-yellow-700",
    bg:    "bg-yellow-50 border-yellow-200",
    icon:  <Clock size={13} className="text-yellow-600" />
  },
  accepted: {
    label: "Success ✓",
    color: "bg-green-500",
    text:  "text-green-700",
    bg:    "bg-green-50 border-green-200",
    icon:  <CheckCircle2 size={13} className="text-green-600" />
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-500",
    text:  "text-red-600",
    bg:    "bg-red-50 border-red-200",
    icon:  <XCircle size={13} className="text-red-500" />
  }
};

export default function ProjectsSection({
  projects      = [],
  courseSlug    = "",
  progress      = 0,
  statuses      = {},
  uploads       = {},
  onStatusChange,
  onUploadChange
}) {
  const [isAdmin] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("gogaledu_admin") === "true"
      : false
  );

  const [uploadErrors,  setUploadErrors]  = useState({});
  const [extraProjects, setExtraProjects] = useState([]);

  // Holds a selected file waiting for the student to confirm or cancel
  // Shape: { projectId: string, file: File } | null
  const [pendingUpload, setPendingUpload] = useState(null);

  const fileInputRefs = useRef({});

  // Students cannot download or upload until they reach 30% progress
  const projectsLocked = !isAdmin && progress < 30;

  const allProjects = [...projects, ...extraProjects];

  // ── Admin: add an extra project slot ────────────────────────────
  const handleAddProject = () => {
    const newId    = `project-extra-${Date.now()}`;
    const newCount = allProjects.length + 1;
    setExtraProjects((prev) => [
      ...prev,
      {
        id:               newId,
        title:            `Project ${newCount}: New Project`,
        description:      "Click to add a description. Place the brief PDF in /public/projects/ and update spcourses.js.",
        downloadFile:     `/projects/excel-project${newCount}.pdf`,
        downloadFileName: `Excel_Project${newCount}.pdf`
      }
    ]);
    onStatusChange && onStatusChange(newId, "pending");
  };

  // ── Student: file picker → validation → open confirmation dialog ─
  const handleFileChange = (projectId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadErrors((prev) => ({
        ...prev,
        [projectId]: "Only PDF files are accepted. Please upload a .pdf file."
      }));
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadErrors((prev) => ({
        ...prev,
        [projectId]: "File too large. Maximum size is 10MB."
      }));
      e.target.value = "";
      return;
    }

    setUploadErrors((prev) => ({ ...prev, [projectId]: null }));
    // Hold the file and show the confirmation modal — do NOT upload yet
    setPendingUpload({ projectId, file });
    e.target.value = ""; // reset so same file can be re-selected if user cancels
  };

  // ── Confirmation: Yes, Upload ────────────────────────────────────
  const confirmUpload = () => {
    if (!pendingUpload) return;
    const { projectId, file } = pendingUpload;
    onUploadChange && onUploadChange(projectId, file.name);
    onStatusChange && onStatusChange(projectId, "pending");
    // In production: upload to server/S3 here
    setPendingUpload(null);
  };

  // ── Confirmation: Cancel ─────────────────────────────────────────
  const cancelUpload = () => setPendingUpload(null);

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <section className="mt-12">

      {/* ── Section Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <FolderKanban size={22} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Industry-Level Projects</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Real-world projects — Download brief → Complete → Upload PDF → Get reviewed
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 text-sm font-semibold bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-4 py-2 rounded-xl transition"
          >
            <Plus size={16} />
            Add Project
          </button>
        )}
      </div>

      {/* ── LOCKED BANNER (progress < 30%) ───────────────────────────── */}
      {projectsLocked && (
        <div className="mb-6 flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lock size={22} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-800 text-sm">
              Projects unlock at 30% course progress
            </p>
            <p className="text-amber-600 text-xs mt-0.5">
              You&apos;re at <span className="font-bold">{Math.floor(progress)}%</span>.{" "}
              Complete more lessons to unlock project downloads &amp; uploads.
            </p>
            <div className="mt-2 w-full h-2 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${Math.min((progress / 30) * 100, 100)}%` }}
              />
            </div>
            <p className="text-amber-500 text-xs mt-1">
              {Math.max(0, Math.ceil(30 - progress))}% more needed to unlock
            </p>
          </div>
        </div>
      )}

      {/* ── Project Cards ─────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allProjects.map((project) => {
          const status       = statuses[project.id] || "pending";
          const cfg          = STATUS_CONFIG[status];
          const uploadedFile = uploads[project.id];
          const uploadError  = uploadErrors[project.id];

          // Upload is permanently locked once submitted,
          // UNLESS the admin has rejected it (re-upload allowed).
          const uploadLocked = !!uploadedFile && status !== "rejected";

          return (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* ── Card Header ───────────────────────────────────── */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <Briefcase size={11} className="text-gray-400" />
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                      Real-World Project
                    </p>
                  </div>
                  <h3 className="text-white font-semibold text-sm leading-snug">
                    {project.title}
                  </h3>
                </div>

                {/* Status badge / admin dropdown */}
                <div className="flex-shrink-0">
                  {isAdmin ? (
                    // Admin: always show the dropdown
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) =>
                          onStatusChange && onStatusChange(project.id, e.target.value)
                        }
                        className="appearance-none text-xs font-semibold pl-6 pr-5 py-1 rounded-full border cursor-pointer"
                        style={{
                          background:
                            status === "accepted" ? "#dcfce7"
                            : status === "rejected" ? "#fee2e2"
                            : "#fef9c3",
                          color:
                            status === "accepted" ? "#15803d"
                            : status === "rejected" ? "#dc2626"
                            : "#a16207",
                          borderColor:
                            status === "accepted" ? "#86efac"
                            : status === "rejected" ? "#fca5a5"
                            : "#fde047"
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Success</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${cfg.color}`} />
                    </div>
                  ) : (
                    // Student: badge only shown AFTER uploading
                    uploadedFile && (
                      <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text}`}>
                        <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
                        {cfg.label}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ── Card Body ─────────────────────────────────────── */}
              <div className="p-4 space-y-3">

                <p className="text-sm text-gray-500 leading-relaxed">
                  {project.description}
                </p>

                {/* ── DOWNLOAD ──────────────────────────────────────── */}
                {projectsLocked ? (
                  <div className="flex items-center gap-2 w-full justify-center py-2 px-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 text-sm cursor-not-allowed select-none">
                    <Lock size={14} />
                    Download locked — reach 30% first
                  </div>
                ) : (
                  <a
                    href={project.downloadFile}
                    download={project.downloadFileName}
                    className="flex items-center gap-2 w-full justify-center py-2 px-4 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 text-gray-700 hover:text-green-700 font-medium text-sm transition"
                  >
                    <Download size={15} />
                    Download Project Brief (PDF)
                  </a>
                )}

                {/* ── UPLOAD ────────────────────────────────────────────
                    State 1: progress < 30%  → locked placeholder
                    State 2: uploaded + not rejected → permanently locked
                    State 3: rejected → re-upload button (red dashed)
                    State 4: not yet uploaded → first-time upload button
                ─────────────────────────────────────────────────────── */}
                <div>
                  {projectsLocked ? (
                    <div className="flex items-center gap-2 w-full justify-center py-2 px-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm cursor-not-allowed select-none">
                      <Lock size={14} />
                      Upload locked — reach 30% first
                    </div>

                  ) : uploadLocked ? (
                    // Locked after successful submission
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200">
                      <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-green-700">Submitted</p>
                        <p className="text-xs text-green-600 truncate">{uploadedFile}</p>
                      </div>
                      <Lock size={13} className="text-green-400 flex-shrink-0" title="Locked after submission" />
                    </div>

                  ) : (
                    <>
                      <input
                        ref={(el) => (fileInputRefs.current[project.id] = el)}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange(project.id, e)}
                      />

                      {/* Re-upload (after rejection) vs first-time upload */}
                      <button
                        onClick={() => fileInputRefs.current[project.id]?.click()}
                        className={`flex items-center gap-2 w-full justify-center py-2 px-4 rounded-xl border-2 border-dashed font-medium text-sm transition ${
                          status === "rejected" && uploadedFile
                            ? "border-red-300 hover:border-red-400 text-red-500 hover:text-red-600"
                            : "border-gray-300 hover:border-green-400 text-gray-500 hover:text-green-600"
                        }`}
                      >
                        <Upload size={15} />
                        {status === "rejected" && uploadedFile
                          ? "Re-upload Corrected Work (PDF)"
                          : "Upload Your Work (PDF only)"
                        }
                      </button>

                      {uploadError && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                          <AlertCircle size={12} />
                          {uploadError}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* ── Status detail messages (only after upload) ──────── */}
                {uploadedFile && status === "rejected" && (
                  <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                    <XCircle size={14} className="flex-shrink-0 mt-0.5 text-red-500" />
                    <div>
                      <p className="font-semibold">Project Rejected</p>
                      <p className="mt-0.5 text-red-500">
                        Please review the feedback, correct your work, and re-upload using the button above.
                      </p>
                    </div>
                  </div>
                )}
                {uploadedFile && status === "accepted" && (
                  <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
                    <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5 text-green-600" />
                    <div>
                      <p className="font-semibold">Project Accepted!</p>
                      <p className="mt-0.5 text-green-600">
                        Great work! This project is counted toward your fee refund eligibility.
                      </p>
                    </div>
                  </div>
                )}
                {uploadedFile && status === "pending" && (
                  <div className="flex items-start gap-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <Clock size={14} className="flex-shrink-0 mt-0.5 text-yellow-600" />
                    <div>
                      <p className="font-semibold">Submitted — Awaiting Review</p>
                      <p className="mt-0.5 text-yellow-600">
                        Your project is under review by our team. We&apos;ll update the status soon.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Admin notes */}
      {isAdmin && (
        <div className="mt-4 space-y-1">
          <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Admin mode — change project statuses above or add new projects
          </p>
          <p className="text-xs text-gray-400 text-center">
            To permanently add projects, update the{" "}
            <code className="bg-gray-100 px-1 rounded">projects[]</code> array in{" "}
            <code className="bg-gray-100 px-1 rounded">db/spcourses.js</code>
          </p>
        </div>
      )}

      {/* ── UPLOAD CONFIRMATION MODAL ─────────────────────────────────
          Shown when a student selects a file (before finalizing).
          Clicking "Yes, Upload" locks the upload permanently.
          Clicking "Cancel" discards the selected file with no changes.
      ─────────────────────────────────────────────────────────── */}
      {pendingUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Confirm Upload</h3>
                <p className="text-gray-500 text-xs mt-0.5">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <p className="text-sm text-amber-800 font-medium">
                Are you sure you want to upload this file?
              </p>
              <p className="text-xs text-amber-700 mt-1.5">
                Once uploaded,{" "}
                <span className="font-semibold">you cannot edit or replace your submission.</span>{" "}
                Make sure your work is complete and correct before confirming.
              </p>
              {/* Selected filename preview */}
              <div className="mt-3 flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-2">
                <CheckCircle2 size={14} className="text-amber-500 flex-shrink-0" />
                <p className="text-xs text-gray-700 font-medium truncate">
                  {pendingUpload.file.name}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelUpload}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition"
              >
                Yes, Upload
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}