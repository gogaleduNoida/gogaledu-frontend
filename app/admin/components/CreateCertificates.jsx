"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, FileDown, Loader2, CheckCircle, XCircle } from "lucide-react"

export default function CreateCertificates() {

    const [file, setFile] = useState(null)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [successPopup, setSuccessPopup] = useState(false)

    useEffect(() => {
        if (message) {
            setSuccessPopup(true)

            const timer = setTimeout(() => {
                setSuccessPopup(false)
                setMessage("")
            }, 2500)

            return () => clearTimeout(timer)
        }
    }, [message])

    const upload = async () => {

        if (!file) {
            setError("Please select CSV file")
            return
        }

        const formData = new FormData()
        formData.append("file", file)

        setLoading(true)
        setError("")
        setMessage("")

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/create-certificates`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData
                }
            )

            const data = await res.json()

            if (res.ok) {
                setMessage(`Uploaded ${data.inserted} certificates successfully`)
                setFile(null)
            } else {
                setError(data.message || "Something went wrong")
            }

        } catch (err) {
            setError("Upload failed")
        }

        setLoading(false)
    }

    return (
        <>
            {/* SUCCESS POPUP */}
            <AnimatePresence>
                {successPopup && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2"
                    >
                        <CheckCircle size={18} />
                        Certificates Uploaded Successfully
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl space-y-5 border"
            >

                <h2 className="text-xl font-bold text-center">
                    Upload Certificates
                </h2>

                {/* Download Template */}
                <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/download-certificates-template`}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                >
                    <FileDown size={18} />
                    Download CSV Template
                </motion.a>

                {/* Upload Box */}
                <label className="border-2 border-dashed p-6 rounded-xl text-center cursor-pointer hover:border-green-500 transition block bg-gray-50">
                    <UploadCloud className="mx-auto mb-2 text-gray-400" size={30} />

                    <p className="text-sm text-gray-600">
                        {file ? file.name : "Click to upload CSV file"}
                    </p>

                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files[0])}
                        hidden
                    />
                </label>

                {/* Upload Button */}
                <motion.button
                    onClick={upload}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.03 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <UploadCloud size={18} />
                            Upload Certificates
                        </>
                    )}
                </motion.button>

                {/* Info */}
                <p className="text-xs text-gray-500 text-center">
                    Max 50 rows allowed • Only CSV file
                </p>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-600 text-center text-sm flex items-center justify-center gap-2"
                        >
                            <XCircle size={16} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </>
    )
}