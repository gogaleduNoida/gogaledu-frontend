'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { Lock } from 'lucide-react';
import ChangePasswordModal from "@/components/ChangePasswordModal";
import StateCityData from "@/db/StateCityData.json";

export default function ProfilePage() {

    const [profile, setProfile] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [imgError, setImgError] = useState(false);
    const [successPopup, setSuccessPopup] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false);

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


    if (!profile) return <div className="pt-32 text-center">Loading profile...</div>


    return (

        <div className="min-h-screen bg-gray-50 pt-28 pb-20">

            <div className="max-w-5xl mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white shadow-xl rounded-2xl p-10"
                >
                    <h1 className="text-2xl font-bold mb-8">Student Profile</h1>

                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                {profile.profile_photo && !imgError ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${profile.profile_photo}`}
                                        className="w-20 h-20 rounded-full object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-green-600 text-white flex items-center justify-center rounded-full text-xl font-bold">
                                        {profile?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <label className="absolute bottom-0 right-0 bg-white border rounded-full p-2 cursor-pointer shadow w-8 h-8 flex items-center justify-center text-sm">
                                    📷
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                    />
                                </label>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{profile.username.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h2>
                                <p className="text-gray-500">{profile.email}</p>
                            </div>

                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                onClick={() => setShowPasswordModal(true)}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-500 text-white font-medium shadow-md hover:bg-blue-600"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Lock className="w-5 h-5" />
                                Change Password
                            </motion.button>
                            <motion.button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500 text-white font-medium shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogoutIcon />
                                Logout
                            </motion.button>
                        </div>
                    </div>

                    <ChangePasswordModal
                        isOpen={showPasswordModal}
                        onClose={() => setShowPasswordModal(false)}
                    />

                    {successPopup && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50"
                        >
                            Profile Updated Successfully
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mr-2">Father Name:</label>
                            <input
                                name="father_name"
                                placeholder="Father Name"
                                value={form.father_name ? form.father_name.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : ""}
                                onChange={handleChange}
                                className="input"
                                disabled={profile.father_name}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 mr-2">Whatsapp Number:</label>
                            <input
                                name="whatsapp_number"
                                placeholder="WhatsApp Number"
                                value={form.whatsapp_number || ""}
                                onChange={handleChange}
                                className="input"
                                disabled={profile.whatsapp_number}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mr-2">Intermediate Roll No:</label>
                            <input
                                name="intermediate_roll_number"
                                placeholder="Intermediate Roll Number"
                                value={form.intermediate_roll_number || ""}
                                onChange={handleChange}
                                className="input"
                                disabled={profile.intermediate_roll_number}
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mr-2">Intermediate Percentage:</label>
                                <input
                                    name="intermediate_percentage"
                                    value={form.intermediate_percentage || ""}
                                    disabled
                                    className="input"
                                />

                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[profile.percentage_verification_status]}`}>
                                    {profile.percentage_verification_status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 mr-2">Graduation Status:</label>

                            <select
                                name="graduation_status"
                                value={form.graduation_status || ""}
                                onChange={handleChange}
                                className="px-2 py-1 border rounded-xl focus:ring-2 focus:ring-green-500"
                                disabled={profile.graduation_status}
                                required
                            >

                                <option value="">Graduation Status</option>
                                <option value="Final Year">Final Year</option>
                                <option value="Completed">Completed</option>
                                <option value="Not Yet">Not Yet</option>

                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mr-2">State:</label>
                            <select
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="px-2 py-1 border rounded-xl focus:ring-2 focus:ring-green-500 hover:border-green-500 transition"
                                disabled={profile.state}
                                required
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mr-2">City:</label>
                            <select
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="px-2 py-1 border rounded-xl focus:ring-2 focus:ring-green-500 hover:border-green-500 transition"
                                required
                                disabled={!form.state || !!profile.city}
                            >
                                <option value="">
                                    {form.state ? "Select City" : "Select State First"}
                                </option>

                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mr-2">Address:</label>
                            <input
                                name="address"
                                placeholder="Address"
                                value={form.address || ""}
                                onChange={handleChange}
                                className="input"
                                disabled={profile.address}
                                required
                            />
                        </div>

                        <p className=" col-span-2 text-sm italic text-gray-400 text-center">Note: "Once you enter your <b>Details</b>, they cannot be changed later."</p>
                        <motion.button
                            type="submit"
                            className="w-full cursor-pointer col-span-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Save Profile
                        </motion.button>    
                    </form>

                </motion.div>

            </div>

        </div>

    )

}
