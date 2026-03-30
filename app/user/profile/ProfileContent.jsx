'use client'

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { Lock, LogOut, Camera, CheckCircle2, AlertCircle, XCircle, BookOpen, Award, Compass, ChevronRight, Download, Eye, Phone, Hash, GraduationCap, MapPin, Upload } from 'lucide-react';
import ChangePasswordModal from "@/components/ChangePasswordModal";
import StateCityData from "@/db/StateCityData.json";

const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white " +
    "placeholder-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-green-500/25 " +
    "focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"

const selectCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white " +
    "transition-all focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-500 " +
    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"

const FieldLabel = ({ children }) => (
    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
        {children}
    </label>
)

const SectionCard = ({ icon: Icon, emoji, title, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.38, ease: "easeOut" }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50/70">
            {Icon && (
                <div className="w-7 h-7 rounded-lg bg-green-600/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-green-700" />
                </div>
            )}
            {emoji && <span className="text-base leading-none">{emoji}</span>}
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{title}</h2>
        </div>
        <div className="p-5">{children}</div>
    </motion.div>
)

const StatusBadge = ({ status }) => {
    const cfg = {
        verified: { icon: CheckCircle2, label: "Verified", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        unverified: { icon: AlertCircle, label: "Unverified", cls: "bg-amber-50   text-amber-700   border-amber-200" },
        failed: { icon: XCircle, label: "Failed", cls: "bg-rose-50    text-rose-700    border-rose-200" },
    }
    const { icon: Icon, label, cls } = cfg[status] || cfg.unverified
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>
            <Icon className="w-3 h-3" />{label}
        </span>
    )
}

export default function ProfilePage() {

    const [profile, setProfile] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [imgError, setImgError] = useState(false);
    const [successPopup, setSuccessPopup] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [courses, setCourses] = useState([])


    const statusColor = {
        verified: "bg-green-100 text-green-700",
        unverified: "bg-yellow-100 text-yellow-700",
        failed: "bg-red-100 text-red-700"
    }

    const router = useRouter()
    const searchParams = useSearchParams()
    const slug = searchParams.get("course")
    const [form, setForm] = useState({
        father_name: "",
        whatsapp_number: "",
        intermediate_roll_number: "",
        graduation_status: "",
        state: "",
        city: "",
        address: ""
    });

    const states = Object.keys(StateCityData);
    const cities = form.state ? StateCityData[form.state] || [] : [];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "state" ? value.toUpperCase() : value,
            ...(name === "state" && { city: "" })
        }));
    };

    const LogoutIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-1" />
        </svg>
    )

    const getReceiptUrl = (url) => {
        if (!url) return null

        if (url.startsWith("/")) {
            return `${process.env.NEXT_PUBLIC_API_URL}${url}`
        }
        
        return `${process.env.NEXT_PUBLIC_API_URL}/${url}`
    }

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setProfile(data)
                setForm({
                    father_name: data.father_name || "",
                    whatsapp_number: data.whatsapp_number || "",
                    intermediate_roll_number: data.intermediate_roll_number || "",
                    graduation_status: data.graduation_status || "",
                    state: data.state || "",
                    city: data.city || "",
                    address: data.address || ""
                })
            })
        
        // COURSE FETCH
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-courses`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setCourses(data.courses))
    }, [])

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) { }

        localStorage.removeItem("username");
        localStorage.removeItem("role");

        window.location.href = "/login";
    };

    const handleSubmit = async (e) => {

        e.preventDefault()

        const formData = new FormData()

        formData.append("father_name", form.father_name)
        formData.append("whatsapp_number", form.whatsapp_number)
        formData.append("intermediate_roll_number", form.intermediate_roll_number)
        formData.append("graduation_status", form.graduation_status)
        formData.append("state", form.state)
        formData.append("city", form.city)
        formData.append("address", form.address)

        if (photo) {
            formData.append("photo", photo)
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
            method: "POST",
            credentials: "include",
            body: formData
        })

        if (res.ok) {
            setSuccessPopup(true)
            setTimeout(() => {
                    slug ? router.push(`/course-confirmation/${slug}`) : router.push("/courses")
                }, 1200)
        }
    }


        if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f6f7f5]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-9 h-9 border-[3px] border-green-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-medium">Loading profile…</p>
            </div>
        </div>
    )


    const toTitleCase = (str) =>
        str?.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || ""

    const completion = Math.round(
        Object.values(form).filter(Boolean).length / Object.values(form).length * 100
    )

    const avatarSrc =
        profile.profile_photo && !imgError
            ? `${process.env.NEXT_PUBLIC_API_URL}${profile.profile_photo}`
            : null


    return (
    <div className="min-h-screen bg-[#f6f7f5] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 space-y-4">

        {/* ── Success toast ── */}
        <AnimatePresence>
          {successPopup && (
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,   scale: 1     }}
              exit={{    opacity: 0, y: -14              }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-2xl shadow-xl text-sm font-semibold pointer-events-none"
            >
              <CheckCircle2 className="w-4 h-4" />
              Profile Updated Successfully
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ChangePasswordModal (original import — unchanged) ── */}
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />

        {/* HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Thin brand stripe */}
          <div className="h-1 bg-gradient-to-r from-green-700 via-emerald-500 to-green-600" />

          <div className="p-6">
            {/* Top row: avatar ← → action buttons */}
            <div className="flex items-start justify-between gap-4 mb-5">

              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-100 shadow bg-green-600 flex items-center justify-center">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                        alt="avatar"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {profile?.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Camera badge (original file input — unchanged) */}
                  <label className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-green-50 transition">
                    <Camera className="w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </label>
                </div>

                {/* Name + email + upload hint */}
                <div>
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]')?.click()}
                    className="flex items-center gap-1.5 text-[11px] text-green-700 font-semibold hover:text-green-800 transition mb-1"
                  >
                    <Upload className="w-3 h-3" />
                    {photo ? "Change photo" : "Upload profile photo"}
                  </button>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">
                    {toTitleCase(profile.username)}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">{profile.email}</p>
                  {photo && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-green-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Photo selected — save to upload
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                <motion.button
                  onClick={() => setShowPasswordModal(true)}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Change Password</span>
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"

                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            </div>

            {/* Profile completion bar */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                <span>Profile completion</span>
                <span className="text-green-700 font-bold">{completion}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
                  className="h-full bg-green-600 rounded-full"
                />
              </div>
              {completion < 100 && (
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Fill in all fields below to complete your profile.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            PERSONAL INFORMATION FORM
        ════════════════════════════════════════════════════════ */}
        <SectionCard emoji="👤" title="Student Profile" delay={0.08}>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Father Name — original logic preserved */}
              <div>
                <FieldLabel>Father Name</FieldLabel>
                <input
                  name="father_name"
                  placeholder="Enter father's name"
                  value={
                    form.father_name
                      ? form.father_name.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                      : ""
                  }
                  onChange={handleChange}
                  className={inputCls}
                  disabled={profile.father_name}
                  required
                />
              </div>

              {/* WhatsApp — original logic preserved */}
              <div>
                <FieldLabel>WhatsApp Number</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                  <input
                    name="whatsapp_number"
                    placeholder="10-digit WhatsApp number"
                    value={form.whatsapp_number || ""}
                    onChange={handleChange}
                    className={`${inputCls} pl-10`}
                    disabled={profile.whatsapp_number}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Intermediate Roll No — original logic preserved */}
              <div>
                <FieldLabel>Intermediate Roll No.</FieldLabel>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                  <input
                    name="intermediate_roll_number"
                    placeholder="e.g. 10402"
                    value={form.intermediate_roll_number || ""}
                    onChange={handleChange}
                    className={`${inputCls} pl-10`}
                    disabled={profile.intermediate_roll_number}
                    required
                  />
                </div>
              </div>

              {/* Intermediate Percentage — original logic preserved (disabled + badge) */}
              <div>
                <FieldLabel>Intermediate Percentage</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    name="intermediate_percentage"
                    value={form.intermediate_percentage || ""}
                    disabled
                    placeholder="—"
                    className={inputCls}
                  />
                  <StatusBadge status={profile.percentage_verification_status} />
                </div>
              </div>
            </div>

            {/* Graduation Status — original logic preserved */}
            <div>
              <FieldLabel>Graduation Status</FieldLabel>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                <select
                  name="graduation_status"
                  value={form.graduation_status || ""}
                  onChange={handleChange}
                  className={`${selectCls} pl-10`}
                  disabled={profile.graduation_status}
                  required
                >
                  <option value="">Select graduation status</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Yet">Not Yet</option>
                </select>
              </div>
            </div>

            {/* Location divider */}
            <div className="flex items-center gap-2 pt-1">
              <MapPin className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Location</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* State — original logic preserved */}
              <div>
                <FieldLabel>State</FieldLabel>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={selectCls}
                  disabled={profile.state}
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* City — original logic preserved */}
              <div>
                <FieldLabel>City</FieldLabel>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={selectCls}
                  required
                  disabled={!form.state || !!profile.city}
                >
                  <option value="">
                    {form.state ? "Select City" : "Select State First"}
                  </option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address — original logic preserved */}
            <div>
              <FieldLabel>Address</FieldLabel>
              <input
                name="address"
                placeholder="Street, locality, landmark…"
                value={form.address || ""}
                onChange={handleChange}
                className={inputCls}
                disabled={profile.address}
                required
              />
            </div>

            <p className="text-[11px] text-center text-gray-400 italic pt-1">
              ⚠️ Once you enter your <strong className="text-gray-500">Details</strong>, they cannot be changed later.
            </p>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-green-900/15 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Save Profile
            </motion.button>
          </form>
        </SectionCard>

        {/* ════════════════════════════════════════════════════════
            COURSE DETAILS
        ════════════════════════════════════════════════════════ */}
        <SectionCard emoji="📚" title="Course Details" delay={0.14}>

          {courses.length > 0 ? (
            <div className="space-y-3">
              {courses.map((course, i) => {
                const receiptLink = getReceiptUrl(course.receipt_url)
                const isPaid      = course.payment_status === "paid"

                return (
                  <div
                    key={i}
                    className="relative flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-sm bg-white transition-all"
                  >
                    {/* Accent stripe */}
                    <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${isPaid ? "bg-green-500" : "bg-red-400"}`} />

                    {/* Left info */}
                    <div className="pl-4 flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">
                        {course.title} &nbsp;|&nbsp; ₹{course.amount}
                      </p>
                      <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                        <span className="text-xs text-gray-400">
                          {new Date(course.enrollment_date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </span>
                        {/* Status badge — original logic preserved */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isPaid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                        }`}>
                          {isPaid
                            ? <CheckCircle2 className="w-2.5 h-2.5" />
                            : <XCircle      className="w-2.5 h-2.5" />}
                          {course.payment_status?.toUpperCase() || "NO PAYMENT"}
                        </span>
                      </div>
                    </div>

                    {/* Right buttons — original logic preserved */}
                    <div className="flex items-center gap-2 pl-4 sm:pl-0 flex-wrap">
                      {receiptLink ? (
                        <motion.a
                          href={receiptLink}
                          target="_blank"
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition"
                        >
                          <Download className="w-3 h-3" /> Invoice
                        </motion.a>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 text-xs">No Invoice</span>
                      )}

                      <motion.button
                        onClick={() => router.push(`/courses/${course.slug}`)}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition"
                      >
                        <Eye className="w-3 h-3" /> View Course
                      </motion.button>
                    </div>
                  </div>
                )
              })}

              {/* Explore More — shown when already enrolled */}
              <div className="pt-1 flex justify-center">
                <motion.a
                  href="/courses"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold border border-green-200 transition"
                >
                  <Compass className="w-4 h-4" />
                  Explore More Courses
                  <ChevronRight className="w-3.5 h-3.5" />
                </motion.a>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-1">No course enrolled</p>
              <p className="text-xs text-gray-400 mb-4">Discover courses designed for your career goals.</p>
              <motion.a
                href="/courses"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shadow-sm transition"
              >
                <Compass className="w-4 h-4" />
                Explore Courses
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.a>
            </div>
          )}
        </SectionCard>

        {/* ════════════════════════════════════════════════════════
            CERTIFICATE
        ════════════════════════════════════════════════════════ */}
        <SectionCard emoji="🎓" title="Certificate" delay={0.20}>
          <div className="text-center py-7">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-3">
              <Award className="w-7 h-7 text-amber-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Certificates will be available soon</p>
            <p className="text-xs text-gray-400">Complete a course to earn your certificate 🚀</p>
          </div>
        </SectionCard>

      </div>
    </div>
  )
}
   
