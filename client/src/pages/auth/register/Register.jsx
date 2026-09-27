
import {
    ArrowLeft,
    ArrowUpRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="min-h-screen bg-background">
            <div className="flex min-h-screen">
                {/* Left — Cake Image */}
                <section className="relative hidden min-h-screen w-1/2 overflow-hidden md:block">
                    <img
                        src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&auto=format&fit=crop&q=90"
                        alt="Beautiful celebration cake"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-black/10" />

                    {/* Back to Home */}
                    <div className="absolute right-6 top-6 z-10">
                        <Button
                            asChild
                            variant="outline-asymmetric"
                            size="lg"
                            className="group/button gap-2 border-white/70 bg-white/90 px-6 py-2 text-sm font-semibold text-foreground shadow-lg backdrop-blur-sm hover:bg-white"
                        >
                            <Link to="/" className="flex items-center gap-2">
                                Home

                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover/button:-rotate-45">
                                    <ArrowLeft className="size-3.5" />
                                </span>
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Right — Register Form */}
                <section className="flex min-h-screen w-full items-center justify-center px-5 py-10 md:w-1/2 md:px-4 lg:px-6">
                    <div className="w-full max-w-lg">
                        {/* Mobile Home */}
                        <div className="mb-8 md:hidden">
                            <Button
                                asChild
                                variant="outline-asymmetric"
                                size="lg"
                                className="group/button gap-2 px-6 py-2 text-sm font-semibold"
                            >
                                <Link to="/" className="flex items-center gap-2">
                                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover/button:-rotate-45">
                                        <ArrowLeft className="size-3.5" />
                                    </span>

                                    Home
                                </Link>
                            </Button>
                        </div>

                        {/* Heading */}
                        <div className="mb-7">
                            <p className="mb-2 text-sm font-semibold text-primary">
                                Welcome to Crown Kwt
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Create your account
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Sign up to order your favorite cakes and manage
                                your orders easily.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Full name
                                </label>

                                <div className="relative">
                                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="h-11 pl-10"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="h-11 pl-10"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Create a password"
                                        className="h-11 px-10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Register */}
                            <Button
                                type="submit"
                                variant="asymmetric"
                                size="lg"
                                className="group/button h-auto w-full gap-2 px-6 py-2 text-sm font-semibold"
                            >
                                Create account

                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary transition-transform duration-300 group-hover/button:rotate-45">
                                    <ArrowUpRight className="size-3.5" />
                                </span>
                            </Button>
                        </form>

                        {/* Login */}
                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/auth/login"
                                className="font-semibold text-primary hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Register;