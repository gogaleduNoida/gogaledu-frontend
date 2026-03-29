"use client"

import { useSearchParams } from "next/navigation"
import SuccessPopup from "@/components/SuccessPopup"
import DownloadReceiptButton from "@/components/DownloadReceiptButton"
import { motion } from "framer-motion"

export default function PaymentSuccessContent() {

    const params = useSearchParams()
    const studentId = params.get("student")

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center">

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
            >

                <SuccessPopup />

                {studentId && (
                    <div className="mt-4 text-gray-700">
                        Student ID: <b>{studentId}</b>
                    </div>
                )}

                <DownloadReceiptButton studentId={studentId} />

            </motion.div>

        </div>
    )
}