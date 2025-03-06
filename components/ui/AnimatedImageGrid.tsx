"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const AnimatedImageGrid: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <>
            <div className="absolute inset-0 grid grid-rows-[repeat(10,auto)] grid-cols-[repeat(10,1fr)]">
                {Array.from({ length: 100 }).map((_, index) => (
                    <motion.div
                        key={index}
                        className="bg-image-bg rounded-lg"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isLoaded ? 0 : 1 }}
                        transition={{
                            duration: 0.5,
                            delay: Math.random() * 0.5,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

        </>
    )
}

export default AnimatedImageGrid

