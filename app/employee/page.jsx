"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lock } from 'lucide-react';
import ChangePasswordModal from "@/components/ChangePasswordModal";


export default function EmployeeDashboard() {

    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [showPasswordModal, setShowPasswordModal] = useState(false);
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

    const fetchUsers = async () => {

        try {

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/employee/users`,
                { credentials: "include" }
            )

            const data = await res.json()

            setProfiles(data.users || [])

        } catch (err) {
            console.error(err)
            setProfiles([])
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const updateStatus = async (user_id, status) => {

        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/employee/verify-percentage/${user_id}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            }
        )

        fetchUsers()
    }

    const total = profiles.length
    const verified = profiles.filter(p => p.status === "verified").length
    const failed = profiles.filter(p => p.status === "failed").length
    const unverified = profiles.filter(p => p.status === "unverified").length

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading...
            </div>
        )
    }

    return (

        <div className="p-8 py-22">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">
                    Percentage Verification Dashboard
                </h1>

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

            {/* Stats Cards */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

                <StatCard title="Total Users" value={total} />
                <StatCard title="Verified" value={verified} />
                <StatCard title="Unverified" value={unverified} />
                <StatCard title="Failed" value={failed} />

            </div>

            {/* Table */}

            <div className="bg-white shadow rounded-xl overflow-x-auto">

                <table className="min-w-full text-sm">

                    <thead className="bg-green-600">

                        <tr className="text-left text-white">
                            <th className="p-3">Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Roll No</th>
                            <th>Percentage</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {profiles.length === 0 ? (

                            <tr>
                                <td colSpan="6" className="text-center p-6">
                                    No users found
                                </td>
                            </tr>

                        ) : (

                            profiles.map((p) => (

                                <tr key={p.user_id} className="border-t">

                                    <td className="p-3">{p.name}</td>

                                    <td>{p.email}</td>

                                    <td>{p.phone}</td>

                                    <td>{p.roll_no}</td>

                                    <td>{p.percentage}%</td>

                                    <td>

                                        <select
                                            value={p.status}
                                            onChange={(e) =>
                                                updateStatus(
                                                    p.user_id,
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded px-2 py-1"
                                        >

                                            <option value="unverified">Unverified</option>
                                            <option value="verified">Verified</option>
                                            <option value="failed">Failed</option>

                                        </select>

                                    </td>

                                </tr>

                            ))
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )
}

function StatCard({ title, value }) {

    return (

        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow rounded-xl p-6"
        >

            <p className="text-gray-500 text-sm">{title}</p>

            <h2 className="text-2xl font-bold mt-2">
                {value}
            </h2>

        </motion.div>

    )
}
