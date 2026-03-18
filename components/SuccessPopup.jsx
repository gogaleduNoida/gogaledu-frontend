"use client"

import { motion } from "framer-motion"

export default function SuccessPopup() {

    return (

        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-xl rounded-xl p-10 text-center"
        >

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ delay: 0.2 }}
                className="text-green-500 text-6xl mb-4"
            >

                ✔

            </motion.div>

            <h2 className="text-2xl font-bold mb-2">
                Enrollment Successful
            </h2>

            <p className="text-gray-600">
                Welcome to GogalEdu Academy
            </p>

        </motion.div>

    )

}