"use client"
import { motion } from "framer-motion"
import Loader from "../ui/Loader";
import SuccessForm from "../ui/SuccessForm";
import { FormEvent, useCallback, useState } from "react";
import { formVariants } from "@/animation/varients";
import { usePathname } from "next/navigation";


export default function Form() {

    const pathname = usePathname();
    const basePath = pathname.includes('portfolio') ? '/portfolio' : '';

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [errorOnSubmit, setErrorOnSubmit] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')


    const [data, setData] = useState({
        name: "",
        email: "",
        message: "",
    })

    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string; general?: string }>({})

    const validate = useCallback(() => {
        const nextErrors: typeof errors = {};

        if (!data.name.trim()) {
            nextErrors.name = "Please enter your name.";
        } else if (data.name.trim().length < 2) {
            nextErrors.name = "Name must be at least 2 characters.";
        }

        const email = data.email.trim();
        if (!email) {
            nextErrors.email = "Please enter your email.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!emailRegex.test(email)) {
                nextErrors.email = "Please enter a valid email address.";
            }
        }

        if (!data.message.trim()) {
            nextErrors.message = "Please enter a message.";
        } else if (data.message.trim().length < 10) {
            nextErrors.message = "Message must be at least 10 characters.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }, [data, errors])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Client-side validation first
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        setLoader(true);
        setErrorOnSubmit(false);
        setErrorMessage("");

        try {
            const res = await fetch(`${basePath}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name.trim(),
                    email: data.email.trim(),
                    message: data.message.trim(),
                }),
            });

            if (!res.ok) {
                setErrorOnSubmit(true);
            } else {
                // Success
                setData({ name: "", email: "", message: "" });
                setErrors({});
                setErrorOnSubmit(false);
            }
        } catch (err) {
            setErrorOnSubmit(true);
            setErrorMessage("Network error. Please try again later.");
        } finally {
            setLoader(false);
            // Keep the success/error screen visible briefly, then reset back
            setTimeout(() => setIsSubmitting(false), 6000);
        }
    };


    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={formVariants as any}
            viewport={{ once: true }}
            className={`${isSubmitting ? "gap-0" : 'gap-0'} flex flex-col w-full`}
        >
            {isSubmitting ?
                <div className="h-full min-h-[350px] w-full relative flex flex-col items-center justify-center bg-dark-gray-2 rounded-xl border border-dark-gray-3 select-none">
                    {loader ? <Loader /> : <> <SuccessForm action={errorOnSubmit ? "error" : "success"} /> </>}
                </div>
                :
                <form method="POST" onSubmit={handleSubmit} className="grid gap-4">
                    {/* Input Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="">
                            <input
                                className={`appearance-none w-full leading-[1.4em] outline-none border-none p-4 rounded-lg font-medium text-base placeholder:text-light-gray-1 text-very-light-gray bg-dark-gray-2 ${errors.name ? 'ring-1 ring-red-500' : ''}`}
                                name="Name"
                                placeholder="Name"
                                type="text"
                                aria-label="Full Name"
                                aria-invalid={!!errors.name}
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                onBlur={validate}

                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>
                        <div className="">
                            <input
                                className={`appearance-none w-full leading-[1.4em] outline-none border-none p-4 rounded-lg font-medium text-base placeholder:text-light-gray-1 text-very-light-gray bg-dark-gray-2 ${errors.email ? 'ring-1 ring-red-500' : ''}`}
                                name="Email"
                                placeholder="Email"
                                type="email"
                                aria-label="Email Address"
                                aria-invalid={!!errors.email}
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                onBlur={validate}

                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>
                    </div>
                    {/* Textarea */}
                    <textarea
                        className={`appearance-none w-full leading-[1.4em] outline-none border-none p-4 rounded-lg font-medium text-base placeholder:text-light-gray-1 text-very-light-gray bg-dark-gray-2 resize-y min-h-56 max-h-96 ${errors.message ? 'ring-1 ring-red-500' : ''}`}
                        name="Message"
                        placeholder="Message"
                        rows={8}
                        aria-label="Message"
                        aria-invalid={!!errors.message}
                        value={data.message}
                        onChange={(e) => setData({ ...data, message: e.target.value })}
                        onBlur={validate}

                    />
                    {errors.message && (
                        <p className="-mt-2 text-sm text-red-500">{errors.message}</p>
                    )}

                    {errors.general && (
                        <div className="-mt-1 text-sm text-red-500">{errors.general}</div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loader}
                        className="w-full bg-almost-black text-white p-4 rounded-lg font-medium hover:bg-dark-gray-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loader ? 'Sending…' : 'Send Your Message'}
                    </button>
                </form>
            }

            {/* Submit Feedback overlay content shows errors too */}
            {isSubmitting && !loader && errorOnSubmit && errorMessage && (
                <p className="mt-3 text-center text-red-500 text-sm">{errorMessage}</p>
            )}

            <div />
        </motion.div>
    )
}
