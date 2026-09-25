import { useEffect, useState } from "react";
import { Cake, Languages, Search, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    const { toggleLanguage, t } = useLanguage();

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
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={
                            scrolled
                                ? "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                : "text-foreground hover:bg-secondary hover:text-foreground"
                        }
                    >
                        <ShoppingCart className="h-5 w-5" />
                    </Button>

                    {/* User */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={
                            scrolled
                                ? "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                : "text-foreground hover:bg-secondary hover:text-foreground"
                        }
                    >
                        <User className="h-5 w-5" />
                    </Button>

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
