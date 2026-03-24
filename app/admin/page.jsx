"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import UsersTable from "./components/UsersTable"
import StudentsTable from "./components/StudentsTable"
import EmployeesTable from "./components/EmployeesTable"
import CreateEmployee from "./components/CreateEmployee"
import { Lock } from 'lucide-react';
import ChangePasswordModal from "@/components/ChangePasswordModal";

export default function AdminDashboard() {

    const [data, setData] = useState(null)
    const [tab, setTab] = useState("users")
    const [isLoading, setIsLoading] = useState(false);
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


    useEffect(() => {

        const load = async () => {

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
                { credentials: "include" }
            )

            const json = await res.json()
            setData(json)
        }

        load()

    }, [])

    if (!data) return <div className="p-10">Loading...</div>

    return (

        <div className="p-8 py-22">

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">
                    Admin Dashboard
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

            {/* STAT CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Total Users" value={data.counts?.users} />
                <StatCard title="Total Students" value={data.counts?.students} />
                <StatCard title="Total Employee" value={data.counts?.employees} />
            </div>


            {/* TABS */}
            <div className="flex items-start justify-between">
                <div className="flex gap-4 mb-6">
                    <motion.button
                        onClick={() => setTab("users")}
                        className="px-4 py-2 bg-green-600 text-white rounded  hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                        Users
                    </motion.button>

                    <motion.button
                        onClick={() => setTab("students")}
                        className="px-4 py-2 bg-green-600 text-white rounded  hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                        Students
                    </motion.button>

                    <motion.button
                        onClick={() => setTab("employees")}
                        className="px-4 py-2 bg-green-600 text-white rounded  hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                        Employees
                    </motion.button>

                    <motion.button
                        onClick={() => setTab("create")}
                        className="px-4 py-2 bg-gray-900 text-white rounded
                    hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                        Create Employee
                    </motion.button>
                </div>
            </div>


            {/* TABLES */}

            {tab === "users" && <UsersTable users={data.users} />}

            {tab === "students" && <StudentsTable students={data.students} />}

            {tab === "employees" && <EmployeesTable employees={data.employees} />}

            {tab === "create" && <CreateEmployee />}

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
