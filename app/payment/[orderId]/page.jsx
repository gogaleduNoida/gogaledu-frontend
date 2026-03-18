"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import loadRazorpay from "@/lib/loadRazorpay"
import PaymentSummary from "@/components/PaymentSummary"
import { motion } from "framer-motion"

export default function PaymentPage() {

    const { orderId } = useParams()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [amount, setAmount] = useState(0)
    const [error, setError] = useState("")

    const paymentStarted = useRef(false)
    
    useEffect(() => {

        if (!orderId || paymentStarted.current) return

        paymentStarted.current = true

        const fetchOrder = async () => {

            try {

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/order/${orderId}`,
                    { credentials: "include" }
                )

                const data = await res.json()

                if (!data?.order_id) {
                    setError("Order not found")
                    setLoading(false)
                    return
                }

                setAmount(data.amount)

                startPayment(data)

            } catch (err) {

                console.error("Order fetch failed:", err)
                setError("Unable to load order")
                setLoading(false)

            }

        }

        fetchOrder()

    }, [orderId])


    const startPayment = async (orderData) => {

        const razorpayLoaded = await loadRazorpay()

        if (!razorpayLoaded) {
            setError("Payment gateway failed to load")
            setLoading(false)
            return
        }

        const options = {

            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,

            amount: orderData.amount * 100,

            currency: "INR",

            name: "GogalEdu Academy",

            description: "Course Enrollment",

            order_id: orderData.order_id,

            handler: async function (response) {

                try {

                    const verifyRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/verify-payment`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include",
                            body: JSON.stringify({
                                order_id: response.razorpay_order_id,
                                payment_id: response.razorpay_payment_id,
                                signature: response.razorpay_signature
                            })
                        }
                    )

                    const verify = await verifyRes.json()

                    if (verify?.status === "success") {

                        router.push(`/payment-success?student=${verify.student_id}`)

                    } else {

                        setError("Payment verification failed")

                    }

                } catch (err) {

                    console.error("Verification error:", err)
                    setError("Payment verification error")

                }

            },

            prefill: orderData.prefill || {
                name: "",
                email: "",
                contact: ""
            },

            theme: {
                color: "#16a34a"
            }

        }

        const razorpay = new window.Razorpay(options)

        razorpay.open()

        razorpay.on("payment.failed", function () {

            setError("Payment failed. Please try again.")

        })

        setLoading(false)

    }


    return (

        <div className="min-h-screen bg-gray-50 flex items-center justify-center">

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl"
            >

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Processing Payment
                </h1>

                <PaymentSummary amount={amount} />

                {loading && (
                    <div className="mt-6 text-center text-gray-500">
                        Opening Razorpay...
                    </div>
                )}

                {error && (
                    <div className="mt-6 text-center text-red-500 font-medium">
                        {error}
                    </div>
                )}

            </motion.div>

        </div>

    )

}