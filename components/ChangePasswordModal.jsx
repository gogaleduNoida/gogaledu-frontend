"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordModal({ isOpen, onClose }) {

    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    const [show, setShow] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const closeButtonVariants = {
        initial: { scale: 1, rotate: 0 },
        hover: { scale: 1.1, rotate: 90, transition: { type: 'spring', stiffness: 400 } },
        tap: { scale: 0.9 }
    };

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setMessage("");
    };

    const handleSubmit = async () => {

        if (form.new_password !== form.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/change-password`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        old_password: form.old_password,
                        new_password: form.new_password
                    })
                }
            );

            const data = await res.json();

            if (data.success) {
                setMessage(data.message);
                setTimeout(async () => {

                    try {
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
                            method: "POST",
                            credentials: "include",
                        });
                    } catch (err) { }

                    localStorage.removeItem("username");
                    localStorage.removeItem("role");

                    onClose();

                    window.location.href = "/login";

                }, 1200);

            } else {
                setError(data.message);
            }

        } catch {
            setError("Server error");
        }

        setLoading(false);
    };

    const inputField = (name, placeholder, typeKey) => (
        <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <input
                type={show[typeKey] ? "text" : "password"}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
            />

            <button
                type="button"
                onClick={() => setShow({ ...show, [typeKey]: !show[typeKey] })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
                {show[typeKey] ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const containerVariants = {
        hidden: { scale: 0.8, opacity: 0, y: 40 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        },
        exit: { scale: 0.8, opacity: 0, y: 40 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6"
                        variants={containerVariants}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-bold">Change Password</h2>
                            <motion.button
                                onClick={onClose}
                                className="p-1.5 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                variants={closeButtonVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </motion.button>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-4">

                            {inputField("old_password", "Old Password", "old")}
                            {inputField("new_password", "New Password", "new")}
                            {inputField("confirm_password", "Confirm Password", "confirm")}

                            {message && (
                                <p className="text-green-600 text-sm">{message}</p>
                            )}

                            {error && (
                                <p className="text-red-600 text-sm">{error}</p>
                            )}

                            {/* Submit */}
                            <motion.button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "Update Password"
                                )}
                            </motion.button>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}