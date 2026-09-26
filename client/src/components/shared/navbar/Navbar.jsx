import { useEffect, useState } from "react";
import {
    Cake,
    Languages,
    LayoutGrid,
    LogOut,
    Search,
    ShoppingCart,
    User,
} from "lucide-react";
import { Link } from "react-router";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    const { language, toggleLanguage, t } = useLanguage();

    const isArabic = language === "ar";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-background/95 text-foreground backdrop-blur-md"
            }`}
        >
            <div className="wrapper flex h-16 items-center gap-3 sm:h-17 sm:gap-4">
                {/* Logo */}
                <div className="flex shrink-0 items-center gap-2">
                    <div
                        className={`flex h-9 w-9 items-center justify-center rounded-tl-xl rounded-br-xl transition-colors ${
                            scrolled
                                ? "bg-primary-foreground/15"
                                : "bg-secondary"
                        }`}
                    >
                        <Cake
                            className={`h-5 w-5 ${
                                scrolled
                                    ? "text-primary-foreground"
                                    : "text-primary"
                            }`}
                        />
                    </div>

                    <span className="hidden text-lg font-bold tracking-tight sm:block">
                        Crown Kwt
                    </span>
                </div>

                {/* Search */}
                <div className="mx-auto w-full max-w-xl">
                    <div className="relative">
                        <Search className="pointer-events-none absolute inset-s-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            dir="ltr"
                            placeholder={t.nav.search}
                            className={`h-10 rounded-none rounded-tl-xl rounded-br-xl ps-10 pe-4 text-left [direction:ltr] shadow-none transition-all duration-300 focus-visible:ring-1 ${
                                scrolled
                                    ? "border-transparent bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                                    : "border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30"
                            }`}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                    {/* Cart */}

                    <Link to="/cart">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={`cursor-pointer ${
                                scrolled
                                    ? "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                    : "text-foreground hover:bg-secondary hover:text-foreground"
                            }`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </Link>

                    {/* User */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={`hidden md:inline-flex cursor-pointer ${
                                    scrolled
                                        ? "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                        : "text-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            side="bottom"
                            align="end"
                            sideOffset={10}
                            className="w-56 rounded-2xl p-2"
                        >
                            {/* Account header */}
                            <div className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-none rounded-tl-xl rounded-br-xl bg-primary text-primary-foreground">
                                    <Cake className="size-4" />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-foreground">
                                        {isArabic ? "حسابي" : "My account"}
                                    </p>

                                    <p className="text-[11px] text-muted-foreground">
                                        {isArabic
                                            ? "إدارة حسابك"
                                            : "Manage your account"}
                                    </p>
                                </div>
                            </div>

                            {/* Account options */}
                            <div className="mt-2 space-y-1">
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                                >
                                    <LayoutGrid className="size-4" />

                                    {isArabic ? "لوحة التحكم" : "Dashboard"}
                                </Link>

                                <Link
                                    to="/profile"
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                                >
                                    <User className="size-4" />

                                    {isArabic ? "الملف الشخصي" : "Profile"}
                                </Link>

                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <LogOut className="size-4" />

                                    {isArabic ? "تسجيل الخروج" : "Logout"}
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {/* Language */}
                    <Button
                        type="button"
                        variant="outline-asymmetric"
                        onClick={toggleLanguage}
                        className={
                            scrolled
                                ? "border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                : "bg-card text-foreground"
                        }
                    >
                        <Languages className="h-4 w-4" />
                        <span>{t.nav.language}</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
