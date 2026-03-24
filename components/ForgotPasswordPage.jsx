'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

const ForgotPasswordPage = () => {

    const [step, setStep] = useState("email"); // email | reset
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [passwordData, setPasswordData] = useState({
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const params = useParams();
    const router = useRouter();
    const token = params?.token;

    // detect token → switch to reset step
    useEffect(() => {
        if (token) {
            setStep("reset");
        }
    }, [token]);

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage("");
                setError("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    // STEP 1: Send Email
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                }
            );

            const data = await res.json();

            if (data.success) {
                setMessage("Reset link sent to your email");
                setStep("email-sent");
            } else {
                setError(data.message);
            }

        } catch {
            setError("Server error");
        }

        setIsLoading(false);
    };

    // STEP 2: Reset Password
    const handleResetSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/reset-password/${token}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ new_password: passwordData.password })
                }
            );

            const data = await res.json();

            if (data.success) {
                setMessage("Password reset successful");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);

            } else {
                setError(data.message);
            }

        } catch {
            setError("Server error");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-white flex pt-16">

            {/* LEFT SIDE */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 to-blue-50 flex-col justify-center items-center p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <div className="w-32 h-32 flex items-center justify-center mx-auto mb-8">
                        <img
                            src="/logo.jpg"
                            alt="GogalEdu Logo"
                            className="w-28 h-28 object-cover"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Secure Your Account
                    </h1>
                    <p className="text-lg text-gray-600 max-w-md">
                        Reset your password securely and continue learning
                    </p>
                </motion.div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md"
                >

                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center">
                            <img
                                src="/logo.jpg"
                                alt="GogalEdu Logo"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        </div>
                    </div>

                    {/* HEADING */}
                    <div className="text-center lg:text-left mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {step === "reset" ? "Reset Password" : "Forgot Password"}
                        </h1>

                        <p className="text-gray-600">
                            {step === "reset"
                                ? "Enter your new password"
                                : "Enter your email to receive reset link"}
                        </p>
                    </div>

                    {/* ALERTS */}
                    {message && <div className="bg-green-100 p-3 rounded mb-4">{message}</div>}
                    {error && <div className="bg-red-100 p-3 rounded mb-4">{error}</div>}

                    {/* STEP 1 FORM */}
                    {step === "email" && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </motion.button>

                            {/* Sign Up Link */}
                            <div className="text-center">
                                <p className="text-gray-600 text-sm">
                                    Don't have an account?{' '}
                                    <Link href="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                                        Sign up
                                    </Link>
                                </p>
                            </div>

                        </form>
                    )}

                    {/* STEP EMAIL SENT */}
                    {step === "email-sent" && (
                        <div className="text-green-600 font-medium">
                            Check your email for reset link
                        </div>
                    )}

                    {/* STEP 2 RESET */}
                    {/* Password Field */}
                    {step === "reset" && (
                        <form onSubmit={handleResetSubmit} className="space-y-4">

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    id="password"
                                    name="password"
                                    required
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, password: e.target.value })
                                    }
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    required
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value
                                        })
                                    }
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-3 rounded-lg"
                                whileTap={{ scale: 0.95 }}
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </motion.button>

                            
                        </form>
                    )}

                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;