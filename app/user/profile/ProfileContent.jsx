"use client";

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"

export default function ProfileContent() {

    const [profile, setProfile] = useState(null)
    const [form, setForm] = useState({})
    const [photo, setPhoto] = useState(null)
    const [imgError, setImgError] = useState(false);
    const [successPopup, setSuccessPopup] = useState(false)

    const statusColor = {
        verified: "bg-green-100 text-green-700",
        unverified: "bg-yellow-100 text-yellow-700",
        failed: "bg-red-100 text-red-700"
    }

    const router = useRouter()
    const searchParams = useSearchParams()
    const slug = searchParams.get("course")

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setProfile(data)
                setForm(data)
            })
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        Object.keys(form).forEach(key => {
            formData.append(key, form[key])
        })

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
                if (slug) {
                    router.push(`/course-confirmation/${slug}`)
                } else {
                    router.push("/courses")
                }
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


                    <div className="flex items-center gap-6 mb-8">
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
                            <h2 className="text-xl font-semibold">{profile.username}</h2>
                            <p className="text-gray-500">{profile.email}</p>
                        </div>

                    </div>

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
                                value={form.father_name || ""}
                                onChange={handleChange}
                                className="input"
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
                                className="input"
                                required
                            >

                                <option value="">Graduation Status</option>
                                <option value="Final Year">Final Year</option>
                                <option value="Completed">Completed</option>
                                <option value="Not Yet">Not Yet</option>

                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 mr-2">City:</label>
                            <input
                                name="city"
                                placeholder="City"
                                value={form.city || ""}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mr-2">State:</label>
                            <input
                                name="state"
                                placeholder="State"
                                value={form.state || ""}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mr-2">Address:</label>
                            <input
                                name="address"
                                placeholder="Address"
                                value={form.address || ""}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>

                        <p className=" col-span-2 text-sm italic text-gray-400 text-center">Note: "Once you enter your <b>WhatsApp Number</b> and <b>Intermediate Roll Number</b>, they cannot be changed later."</p>
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
