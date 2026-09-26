
import {
    Cake,
    ChevronRight,
    Clock3,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
    const { language } = useLanguage();

    const isArabic = language === "ar";

    const quickLinks = isArabic
        ? ["الرئيسية", "الفئات", "العروض", "الأكثر مبيعاً"]
        : ["Home", "Categories", "Deals", "Best Sellers"];

    const customerLinks = isArabic
        ? ["تواصل معنا", "التوصيل", "طرق الدفع", "الأسئلة الشائعة"]
        : ["Contact us", "Delivery", "Payment methods", "FAQ"];

    return (
        <footer className="border-t border-border bg-secondary/30">
            <div className="wrapper">
                {/* Main Footer */}
                <div className="grid gap-10 py-12 md:grid-cols-2 md:py-14 xl:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-10 items-center justify-center rounded-none rounded-tl-xl rounded-br-xl bg-primary text-primary-foreground">
                                <Cake className="size-5" />
                            </div>

                            <span className="text-xl font-black tracking-tight text-foreground">
                                Crown Kwt
                            </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-muted-foreground">
                            {isArabic
                                ? "كعكات مصنوعة بعناية لكل لحظة مميزة. اكتشف نكهاتك المفضلة واستمتع بتوصيل موثوق في الكويت."
                                : "Beautifully crafted cakes for every special moment. Discover your favourite flavours with reliable delivery across Kuwait."}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-foreground">
                            {isArabic ? "روابط سريعة" : "Quick links"}
                        </h3>

                        <ul className="mt-4 space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link}>
                                    <button
                                        type="button"
                                        className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        <ChevronRight className="size-3 opacity-0 transition-all group-hover:opacity-100 rtl:rotate-180" />
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h3 className="text-sm font-bold text-foreground">
                            {isArabic ? "خدمة العملاء" : "Customer care"}
                        </h3>

                        <ul className="mt-4 space-y-2.5">
                            {customerLinks.map((link) => (
                                <li key={link}>
                                    <button
                                        type="button"
                                        className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        <ChevronRight className="size-3 opacity-0 transition-all group-hover:opacity-100 rtl:rotate-180" />
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold text-foreground">
                            {isArabic ? "تواصل معنا" : "Get in touch"}
                        </h3>

                        <div className="mt-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                                <p className="text-sm leading-5 text-muted-foreground">
                                    {isArabic
                                        ? "مدينة الكويت، الكويت"
                                        : "Kuwait City, Kuwait"}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="size-4 shrink-0 text-primary" />

                                <p
                                    dir="ltr"
                                    className="text-sm text-muted-foreground"
                                >
                                    +965 2222 2222
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="size-4 shrink-0 text-primary" />

                                <p className="text-sm text-muted-foreground">
                                    hello@crownkwt.com
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock3 className="size-4 shrink-0 text-primary" />

                                <p className="text-sm text-muted-foreground">
                                    {isArabic
                                        ? "يومياً · 10 ص - 10 م"
                                        : "Daily · 10 AM - 10 PM"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col gap-3 border-t border-border py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
                    <p>
                        © {new Date().getFullYear()} Crown Kwt.{" "}
                        {isArabic
                            ? "جميع الحقوق محفوظة."
                            : "All rights reserved."}
                    </p>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="transition-colors hover:text-primary"
                        >
                            {isArabic
                                ? "سياسة الخصوصية"
                                : "Privacy policy"}
                        </button>

                        <button
                            type="button"
                            className="transition-colors hover:text-primary"
                        >
                            {isArabic
                                ? "الشروط والأحكام"
                                : "Terms & conditions"}
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;