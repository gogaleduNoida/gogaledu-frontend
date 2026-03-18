'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ScholarshipPopup = ({ isOpen, onClose, slug }) => {

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    const closeButtonVariants = {
        initial: { scale: 1, rotate: 0 },
        hover: { scale: 1.1, rotate: 90, transition: { type: 'spring', stiffness: 400 } },
        tap: { scale: 0.9 }
    };

    const [percentage, setPercentage] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [slabs, setSlabs] = useState([]);

    const router = useRouter();

    useEffect(() => {

        const fetchSlabs = async () => {

            try {

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scholarship-slabs`);

                const data = await res.json();

                if (res.ok) {
                    setSlabs(data.slabs);
                }

            } catch (err) { }

        };

        if (isOpen) {
            fetchSlabs();
        }

    }, [isOpen]);

    const handleSubmit = async () => {

        if (!percentage) {
            setError("Please select your percentage slab");
            return;
        }

        if (percentage < 0 || percentage > 100) {
            setError("Percentage must be between 0 and 100");
            return;
        }

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scholarship`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ percentage })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(
                    "Scholarship submitted successfully"
                );

                const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
                    credentials: "include"
                });

                const user = await profileRes.json();

                setTimeout(() => {
                    onClose();
                    if (!user.profile_completed) {
                        router.push(`/user/profile?course=${slug}`);
                    } else {
                        router.push(`/course-confirmation/${slug}`);
                    }
                }, 1200);

            } else {
                setMessage(data.message || "Something went wrong");
            }

        } catch (error) {
            setError("Server error. Please try again.");
        }

    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
            >
                {/* Backdrop with blur */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

                {/* Modal Content */}
                <motion.div
                    className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 sm:p-8 overflow-hidden"
                    variants={containerVariants}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold text-gray-900">Scholarship Eligibility</h2>
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

                    {/* Content */}
                    <div>

                        <p className="text-gray-600 mb-4">
                            Please enter your Intermediate percentage.
                        </p>

                        <input
                            type="number"
                            placeholder="Enter your percentage (e.g. 78)"
                            value={percentage}
                            onChange={(e) => {
                                setPercentage(e.target.value);
                                setError("");
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                        />


                        <div className="space-y-2 mb-4">

                            {slabs.map((slab, index) => (
                                <p key={index} className="text-sm text-gray-600">

                                    {slab.min_percentage}% – {slab.max_percentage}% → ₹{slab.discount_amount}

                                </p>
                            ))}

                        </div>

                        {message && (
                            <div className="text-green-600 text-sm font-medium">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="m-3 text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <p className="text-sm italic text-gray-400 text-center">"Our Scholarship Officer will verify your percentage. You can process your scholarship free of cost by visiting your nearest center or contacting our Online Customer Care at 7011418073."</p>

                        {/* Actions */}
                        <div className="mt-4 flex justify-end space-x-3">
                            <motion.button
                                onClick={handleSubmit}
                                className="w-full cursor-pointer bg-green-700 text-white py-2 rounded-lg font-semibold text-base hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >Submit</motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ScholarshipPopup;
