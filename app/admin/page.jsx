"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import UsersTable from "./components/UsersTable"
import StudentsTable from "./components/StudentsTable"
import EmployeesTable from "./components/EmployeesTable"
import CreateEmployee from "./components/CreateEmployee"

export default function AdminDashboard() {

    const [data, setData] = useState(null)
    const [tab, setTab] = useState("users")
    const [isLoading, setIsLoading] = useState(false);


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

        <div className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Admin Dashboard
            </h1>

            {/* STAT CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Total Users" value={data.counts?.users} />
                <StatCard title="Total Students" value={data.counts?.students} />
                <StatCard title="Total Employee" value={data.counts?.employees} />
            </div>


            {/* TABS */}

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