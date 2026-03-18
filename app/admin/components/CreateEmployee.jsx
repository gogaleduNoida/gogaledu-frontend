"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';


export default function CreateEmployee() {

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [successPopup, setSuccessPopup] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage("");
                setError("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const submit = async () => {

        if (form.password !== form.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        try {

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/create-employee`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            )

            const data = await res.json()

            if (res.ok) {

                setSuccessPopup(true)

                setForm({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                setTimeout(() => {
                    setSuccessPopup(false)
                }, 2500)

            }
            else {

                setError(data.message || "Something went wrong")

            }

        } catch (error) {
            console.error(error)
        }
    }

    return (

        <div className="max-w-md space-y-5">

            {/* SUCCESS POPUP */}

            {successPopup && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Employee created successfully
                </div>
            )}

            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={form.username}
                        required
                        onChange={e =>
                            setForm({ ...form, username: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        placeholder="Enter your full name"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        required
                        onChange={e =>
                            setForm({ ...form, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        placeholder="Enter your email"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={e =>
                            setForm({ ...form, password: e.target.value })
                        }
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        placeholder="Create a password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={e =>
                            setForm({ ...form, confirmPassword: e.target.value })
                        }
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        placeholder="Confirm your password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <motion.button
                onClick={submit}
                className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg
                    hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                    </>
                ) : (
                    <span>Create Employee</span>
                )}
            </motion.button>

        </div>
    )
}