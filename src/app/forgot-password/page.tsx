'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-white text-text-dark font-sans antialiased">
            <div className="w-full pt-8 px-6">
                <div className="flex justify-center items-center max-w-[400px] mx-auto h-10">
                    <div className="text-primary font-extrabold text-xl tracking-tight">
                        <span className="material-symbols-outlined align-middle mr-1">favorite</span>
                        WEDDING
                    </div>
                </div>
            </div>
            <div className="w-full max-w-[400px] px-6 flex flex-col pb-8">
                <div className="my-8">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Forgot Password</h1>
                    <p className="text-text-muted text-lg font-medium">Enter your email to receive a verification code.</p>
                </div>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-text-dark">Email Address</label>
                        <div className="relative">
                            <input className="border-border-light bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none w-full h-14 px-5 rounded-lg text-base font-medium placeholder:text-gray-400 border" placeholder="e.g. name@email.com" type="email" />
                        </div>
                    </div>
                    <div className="pt-2">
                        <button className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-extrabold text-lg rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                            Send Verification Code
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-text-muted font-medium">
                        Remember your password?
                        <Link href="/login" className="font-extrabold text-primary ml-1">Back to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
