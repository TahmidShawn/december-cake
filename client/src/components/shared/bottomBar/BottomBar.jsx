
import {
    Cake,
    House,
    LayoutGrid,
    LogOut,
    Package,
    User,
} from "lucide-react";
import { Link } from "react-router";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/context/LanguageContext";

const categories = [
    {
        name: {
            en: "Birthday Cakes",
            ar: "كعكات أعياد الميلاد",
        },
        slug: "birthday-cakes",
    },
    {
        name: {
            en: "Wedding Cakes",
            ar: "كعكات الزفاف",
        },
        slug: "wedding-cakes",
    },
    {
        name: {
            en: "Chocolate Cakes",
            ar: "كعكات الشوكولاتة",
        },
        slug: "chocolate-cakes",
    },
    {
        name: {
            en: "Red Velvet",
            ar: "ريد فيلفت",
        },
        slug: "red-velvet",
    },
    {
        name: {
            en: "Cheesecakes",
            ar: "كعكات الجبن",
        },
        slug: "cheesecakes",
    },
    {
        name: {
            en: "Cupcakes",
            ar: "كب كيك",
        },
        slug: "cupcakes",
    },
    {
        name: {
            en: "Mini Cakes",
            ar: "كعكات صغيرة",
        },
        slug: "mini-cakes",
    },
    {
        name: {
            en: "Fruit Cakes",
            ar: "كعكات الفواكه",
        },
        slug: "fruit-cakes",
    },
];

const BottomBar = () => {
    const { language } = useLanguage();

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
            <div className="flex h-16 items-center justify-around">
                {/* Home */}
                <Link
                    to="/"
                    className="flex size-14 flex-col items-center justify-center gap-1 rounded-xl text-muted-foreground transition-colors active:bg-secondary active:text-primary"
                >
                    <House className="size-5" />

                    <span className="text-[10px] font-medium">
                        {language === "ar" ? "الرئيسية" : "Home"}
                    </span>
                </Link>

                {/* Categories */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="flex size-14 flex-col items-center justify-center gap-1 rounded-xl text-muted-foreground transition-colors active:bg-secondary active:text-primary"
                        >
                            <LayoutGrid className="size-5" />

                            <span className="text-[10px] font-medium">
                                {language === "ar" ? "الفئات" : "Categories"}
                            </span>
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        side="top"
                        align="center"
                        sideOffset={8}
                        className="w-72 rounded-2xl p-2"
                    >
                        <div className="px-2.5 py-2">
                            <p className="text-sm font-bold text-foreground">
                                {language === "ar"
                                    ? "تصفح الفئات"
                                    : "Browse categories"}
                            </p>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {language === "ar"
                                    ? "اختر نوع الكعكة"
                                    : "Choose a cake category"}
                            </p>
                        </div>

                        <div className="mt-1 grid max-h-72 grid-cols-2 gap-1 overflow-y-auto">
                            {categories.map((category) => (
                                <Link
                                    key={category.slug}
                                    to={`/categories/${category.slug}`}
                                    className="rounded-xl px-2.5 py-2.5 text-xs font-medium text-muted-foreground transition-colors active:bg-secondary active:text-primary"
                                >
                                    {category.name[language]}
                                </Link>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Orders */}
                <Link
                    to="/orders"
                    className="flex size-14 flex-col items-center justify-center gap-1 rounded-xl text-muted-foreground transition-colors active:bg-secondary active:text-primary"
                >
                    <Package className="size-5" />

                    <span className="text-[10px] font-medium">
                        {language === "ar" ? "الطلبات" : "Orders"}
                    </span>
                </Link>

                {/* Account */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="flex size-14 flex-col items-center justify-center gap-1 rounded-xl text-muted-foreground transition-colors active:bg-secondary active:text-primary"
                        >
                            <User className="size-5" />

                            <span className="text-[10px] font-medium">
                                {language === "ar" ? "الحساب" : "Account"}
                            </span>
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        side="top"
                        align="end"
                        sideOffset={8}
                        className="w-56 rounded-2xl p-2"
                    >
                        <div className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-none rounded-tl-xl rounded-br-xl bg-primary text-primary-foreground">
                                <Cake className="size-4" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-foreground">
                                    {language === "ar"
                                        ? "حسابي"
                                        : "My account"}
                                </p>

                                <p className="text-[11px] text-muted-foreground">
                                    {language === "ar"
                                        ? "إدارة حسابك"
                                        : "Manage your account"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-2 space-y-1">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground active:bg-secondary active:text-primary"
                            >
                                <LayoutGrid className="size-4" />
                                {language === "ar"
                                    ? "لوحة التحكم"
                                    : "Dashboard"}
                            </Link>

                            <Link
                                to="/profile"
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground active:bg-secondary active:text-primary"
                            >
                                <User className="size-4" />
                                {language === "ar" ? "الملف الشخصي" : "Profile"}
                            </Link>

                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground active:bg-destructive/10 active:text-destructive"
                            >
                                <LogOut className="size-4" />
                                {language === "ar" ? "تسجيل الخروج" : "Logout"}
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </nav>
    );
};

export default BottomBar;
