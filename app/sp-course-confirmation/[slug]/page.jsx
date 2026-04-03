'use client';

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { spcourses } from "@/db/spcourses";

export default function SPCourseConfirmationPage() {

    const { slug } = useParams();
    const router = useRouter();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [mode, setMode] = useState("online");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/sp-course-confirmation/${slug}`,
                    { credentials: "include" }
                );
                const json = await res.json();
                if (!json) {
                    setError("Course data not found");
                    return;
                }
                setData(json);
            } catch (err) {
                console.error("SP Course load failed", err);
                setError("Failed to load course information");
            }
        };

        if (slug) load();
    }, [slug]);

    const course = spcourses[slug];

    if (!data) return (
        <div className="pt-40 text-center text-gray-600">
            Loading SP course details...
        </div>
    );

    if (!course) return (
        <div className="pt-40 text-center text-red-500">
            SP Course not found
        </div>
    );

    const BASE_FEE = data?.pricing?.base_fee;

    const handleEnrollment = async () => {
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/create-order`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        course_slug: slug,
                        mode: "online",
                        laptop: false,
                        payment_type: "full"
                    })
                }
            );

            const result = await res.json();

            if (result?.status === "success") {
                router.push(`/payment/${result.order_id}`);
            } else {
                setError("Order creation failed. Please try again.");
            }
        } catch (err) {
            console.error("Order creation error:", err);
            setError("Unable to create order");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-10 text-center">
                    SP Course Confirmation
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-600 p-4 mb-6 rounded text-center">
                        {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-8">

                    {/* LEFT CARD */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-xl shadow"
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            Course Details
                        </h2>

                        <div className="space-y-2 text-gray-700">
                            <p><b>Course:</b> {course.hero.title}</p>
                            <p><b>Description:</b> {course.hero.subtitle}</p>
                            <p><b>Level:</b> Beginner to Advanced</p>
                            <p><b>Mode:</b> Online</p>
                        </div>

                    </motion.div>

                    {/* RIGHT CARD */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-xl shadow h-fit"
                    >
                        <h2 className="text-xl font-semibold mb-6">Fee Summary</h2>

                        <div className="space-y-3 text-gray-700">
                            <div className="flex justify-between">
                                <span>Course Fee</span>
                                <span>₹5999</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount 🎉</span>
                                <span>-₹3000</span>
                            </div>
                            <hr />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Net Payable</span>
                                <span>₹{BASE_FEE}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleEnrollment}
                            disabled={loading}
                            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Confirm Enrollment"}
                        </button>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}