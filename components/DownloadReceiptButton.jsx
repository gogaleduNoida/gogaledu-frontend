"use client"

import { useState } from "react"

export default function DownloadReceiptButton({ studentId }) {

    const [loading, setLoading] = useState(false)

    const download = () => {

        if (!studentId) return

        setLoading(true)

        window.open(
            `${process.env.NEXT_PUBLIC_API_URL}/api/download-receipt/${studentId}`,
            {credentials: "include"},
            "_blank"
        )

        setTimeout(() => setLoading(false), 1000)
    }

    return (

        <button
            onClick={download}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mt-6 transition"
        >

            {loading ? "Preparing Receipt..." : "Download Receipt"}

        </button>

    )

}