"use client"

import { motion } from "framer-motion"

export default function PaymentSummary({ amount }) {

    const formatted = amount?.toLocaleString("en-IN")

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-xl rounded-xl p-6 border"
        >

            <h2 className="text-xl font-semibold mb-4">
                Payment Summary
            </h2>

            <div className="flex justify-between text-gray-700">

                <span>Total Amount</span>

                <span className="font-bold text-green-600">
                    ₹{formatted}
                </span>

            </div>

        </motion.div>

    )

}