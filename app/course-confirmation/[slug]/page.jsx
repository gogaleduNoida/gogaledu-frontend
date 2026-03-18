'use client';

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CourseData } from '@/db/CourseData';

export default function CourseConfirmationPage() {

    const { slug } = useParams();
    const router = useRouter();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [mode, setMode] = useState("online");
    const [laptop, setLaptop] = useState(false);
    const [paymentType, setPaymentType] = useState("full");

    useEffect(() => {

        const load = async () => {

            try {

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/course-confirmation/${slug}`,
                    { credentials: "include" }
                );

                const json = await res.json();

                if (!json) {
                    setError("Course data not found");
                    return;
                }

                setData(json);

            } catch (err) {

                console.error("Course load failed", err);
                setError("Failed to load course information");

            }
        };

        if (slug) load();

    }, [slug]);


    const course = CourseData.find((c) => c.slug === slug);

    const scholarshipVerified = data?.scholarship?.verified || false;
    const scholarshipDiscount = data?.scholarship?.discount || 0;

    const BASE_FEE = data?.pricing?.base_fee || 0;
    const ONLINE_DISCOUNT = data?.pricing?.online_discount || 0;
    const FULL_PAYMENT_DISCOUNT = data?.pricing?.full_payment_discount || 0;
    const LAPTOP_PRICE = data?.pricing?.laptop_price || 0;
    const REGISTRATION_FEE = data?.pricing?.registration_fee || 0;

    const summary = useMemo(() => {

        let courseFee = BASE_FEE;

        let scholarship = 0;

        if (scholarshipVerified) {

            scholarship = scholarshipDiscount;
            courseFee -= scholarshipDiscount;

        }

        let modeDiscount = 0;

        if (mode === "online") {

            modeDiscount = ONLINE_DISCOUNT;
            courseFee -= ONLINE_DISCOUNT;

        }

        let fullPaymentDiscount = 0;

        if (paymentType === "full") {

            fullPaymentDiscount = FULL_PAYMENT_DISCOUNT;
            courseFee -= FULL_PAYMENT_DISCOUNT;

        }

        let laptopAmount = laptop ? LAPTOP_PRICE : 0;

        const total = courseFee + laptopAmount;

        return {

            scholarship,
            modeDiscount,
            fullPaymentDiscount,
            laptopAmount,
            total

        };

    }, [
        mode,
        laptop,
        paymentType,
        BASE_FEE,
        scholarshipVerified,
        scholarshipDiscount,
        ONLINE_DISCOUNT,
        FULL_PAYMENT_DISCOUNT,
        LAPTOP_PRICE
    ]);


    if (!data) {

        return (
            <div className="pt-40 text-center text-gray-600">
                Loading course details...
            </div>
        );

    }


    if (!course) {

        return (
            <div className="pt-40 text-center text-red-500">
                Course not found
            </div>
        );

    }


    const payableAmount =
        paymentType === "registration"
            ? REGISTRATION_FEE
            : summary.total;


    const handleEnrollment = async () => {

        if (loading) return;

        setLoading(true);
        setError("");

        try {

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/create-order`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        course_slug: slug,
                        mode: mode,
                        laptop: laptop,
                        payment_type: paymentType
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

    }


    return (

        <div className="min-h-screen bg-gray-50 py-12 px-6">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-10 text-center">
                    Course Confirmation
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

                            <p><b>Course:</b> {course.title}</p>
                            <p><b>Duration:</b> {course.duration}</p>
                            <p><b>Level:</b> {course.level}</p>
                            <p><b>Mode:</b> {course.mode}</p>

                        </div>

                        {/* MODE */}

                        <div className="mt-6">

                            <h3 className="font-semibold mb-3">
                                Mode of Learning
                            </h3>

                            <div className="flex gap-4">

                                <button
                                    onClick={() => setMode("online")}
                                    className={`px-4 py-2 rounded-lg border ${mode === "online"
                                        ? "bg-green-600 text-white"
                                        : "bg-white"
                                        }`}
                                >
                                    Online (-₹{ONLINE_DISCOUNT})
                                </button>

                                <button
                                    onClick={() => setMode("offline")}
                                    className={`px-4 py-2 rounded-lg border ${mode === "offline"
                                        ? "bg-green-600 text-white"
                                        : "bg-white"
                                        }`}
                                >
                                    Offline
                                </button>

                            </div>

                        </div>

                        {/* LAPTOP */}

                        <div className="mt-6">

                            <h3 className="font-semibold mb-3">
                                Laptop Requirement
                            </h3>

                            <div className="flex gap-4">

                                <button
                                    onClick={() => setLaptop(true)}
                                    className={`px-4 py-2 rounded-lg border ${laptop
                                        ? "bg-green-600 text-white"
                                        : "bg-white"
                                        }`}
                                >
                                    Yes
                                </button>

                                <button
                                    onClick={() => setLaptop(false)}
                                    className={`px-4 py-2 rounded-lg border ${!laptop
                                        ? "bg-green-600 text-white"
                                        : "bg-white"
                                        }`}
                                >
                                    No
                                </button>

                            </div>

                            {laptop && (

                                <div className="mt-4 text-sm text-gray-600 border p-4 rounded-lg">

                                    <p className="font-semibold mb-2">
                                        Laptop Configuration
                                    </p>

                                    <ul className="list-disc ml-5">

                                        <li>Intel i5 Processor</li>
                                        <li>8 GB RAM</li>
                                        <li>256 GB SSD</li>

                                    </ul>

                                    <p className="mt-2 font-medium">
                                        Refundable Security Amount ₹18,700
                                    </p>

                                </div>

                            )}

                        </div>

                        {/* PAYMENT TYPE */}

                        <div className="mt-6">

                            <h3 className="font-semibold mb-3">
                                Payment Option
                            </h3>

                            <div className="flex gap-4">

                                <button
                                    onClick={() => setPaymentType("full")}
                                    className={`px-4 py-2 rounded-lg border ${paymentType === "full"
                                        ? "bg-green-600 text-white"
                                        : "bg-white"
                                        }`}
                                >
                                    Full Payment
                                </button>

                                <button
                                    onClick={() => setPaymentType("registration")}
                                    className={`px-4 py-2 rounded-lg border ${paymentType === "registration"
                                        ? "bg-green-600 text-white"
                                        : "bg-white"
                                        }`}
                                >
                                    Registration Only
                                </button>

                            </div>

                            {paymentType === "registration" && (

                                <p className="text-sm text-gray-500 mt-2">
                                    Pay ₹{REGISTRATION_FEE} now and complete the remaining later.
                                </p>

                            )}

                        </div>

                    </motion.div>

                    {/* RIGHT CARD */}

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-xl shadow h-fit"
                    >

                        <h2 className="text-xl font-semibold mb-6">
                            Fee Summary
                        </h2>

                        <div className="space-y-3 text-gray-700">

                            <div className="flex justify-between">
                                <span>Course Fee</span>
                                <span>₹{BASE_FEE}</span>
                            </div>

                            <div className="flex justify-between">

                                <span>Scholarship</span>

                                <span>

                                    {data?.scholarship?.status === "verified"
                                        ? `-₹${summary.scholarship}`
                                        : data?.scholarship?.status === "unverified"
                                            ? "Pending Verification"
                                            : "Verification Failed"}

                                </span>

                            </div>

                            <div className="flex justify-between">
                                <span>Mode Discount</span>
                                <span>-₹{summary.modeDiscount}</span>
                            </div>

                            {paymentType === "full" && (

                                <div className="flex justify-between">
                                    <span>Full Payment Discount</span>
                                    <span>-₹{summary.fullPaymentDiscount}</span>
                                </div>

                            )}

                            {laptop && (

                                <div className="flex justify-between">
                                    <span>Laptop Security</span>
                                    <span>₹{summary.laptopAmount}</span>
                                </div>

                            )}

                            <hr />

                            <div className="flex justify-between text-lg font-bold">

                                <span>Net Payable</span>

                                <span>
                                    ₹{payableAmount}
                                </span>

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