
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import ViewAllButton from "@/components/shared/button/SecondaryButton";
import { useLanguage } from "@/context/LanguageContext";

const hotDeals = [
    {
        name: {
            en: "Classic Chocolate Cake",
            ar: "كعكة الشوكولاتة الكلاسيكية",
        },
        category: {
            en: "Chocolate",
            ar: "شوكولاتة",
        },
        variant: {
            en: "Medium",
            ar: "متوسط",
        },
        price: 8.5,
        oldPrice: 11,
        discount: 23,
        image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Strawberry Celebration",
            ar: "كعكة الفراولة للاحتفال",
        },
        category: {
            en: "Birthday",
            ar: "أعياد الميلاد",
        },
        variant: {
            en: "Small",
            ar: "صغير",
        },
        price: 9.5,
        oldPrice: 12,
        discount: 21,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Red Velvet Dream",
            ar: "ريد فيلفت دريم",
        },
        category: {
            en: "Red Velvet",
            ar: "ريد فيلفت",
        },
        variant: {
            en: "Medium",
            ar: "متوسط",
        },
        price: 10,
        oldPrice: 13,
        discount: 23,
        image: "https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Berry Cheesecake",
            ar: "تشيز كيك بالتوت",
        },
        category: {
            en: "Cheesecake",
            ar: "تشيز كيك",
        },
        variant: {
            en: "Small",
            ar: "صغير",
        },
        price: 8,
        oldPrice: 10.5,
        discount: 24,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Golden Caramel Cake",
            ar: "كعكة الكراميل الذهبية",
        },
        category: {
            en: "Caramel",
            ar: "كراميل",
        },
        variant: {
            en: "Medium",
            ar: "متوسط",
        },
        price: 9,
        oldPrice: 11.5,
        discount: 22,
        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Fresh Fruit Cake",
            ar: "كعكة الفواكه الطازجة",
        },
        category: {
            en: "Fruit",
            ar: "فواكه",
        },
        variant: {
            en: "Medium",
            ar: "متوسط",
        },
        price: 10.5,
        oldPrice: 14,
        discount: 25,
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Vanilla Mini Cake",
            ar: "كعكة الفانيليا الصغيرة",
        },
        category: {
            en: "Mini Cake",
            ar: "كعكة صغيرة",
        },
        variant: {
            en: "Small",
            ar: "صغير",
        },
        price: 5.5,
        oldPrice: 7,
        discount: 21,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Wedding White Cake",
            ar: "كعكة الزفاف البيضاء",
        },
        category: {
            en: "Wedding",
            ar: "زفاف",
        },
        variant: {
            en: "Medium",
            ar: "متوسط",
        },
        price: 18,
        oldPrice: 18,
        discount: 0,
        image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80",
    },
];

const HotDeals = () => {
    const { language } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-background py-16 md:py-20">
            <div className="wrapper">
                {/* Section Header */}
                <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-none rounded-tl-2xl rounded-br-2xl border border-border bg-card px-4 py-2 text-xs font-semibold text-primary shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                            {language === "ar"
                                ? "الأكثر مبيعاً"
                                : "Top sellers"}
                        </div>

                        <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-foreground md:text-3xl xl:text-4xl">
                            {language === "ar"
                                ? "عروض ساخنة لا تفوتها"
                                : "Hot deals you’ll love"}
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                            {language === "ar"
                                ? "اكتشف الكعكات الأكثر طلباً لدينا بأسعار مميزة."
                                : "Discover our best-selling cakes at special prices."}
                        </p>
                    </div>

                    <ViewAllButton className="hidden md:flex">
                        {language === "ar" ? "عرض الكل" : "View all"}
                    </ViewAllButton>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-5">
                    {hotDeals.map((cake) => (
                        <article
                            key={cake.name.en}
                            className="group overflow-hidden rounded-none rounded-tl-3xl rounded-br-3xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="relative aspect-[1.35/1] overflow-hidden bg-secondary">
                                <img
                                    src={cake.image}
                                    alt={cake.name[language]}
                                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-125"
                                    loading="lazy"
                                />

                                {/* Discount Badge */}
                                {cake.discount > 0 && (
                                    <span
                                        dir="ltr"
                                        className="absolute top-3 inset-s-3 rounded-none rounded-tl-xl rounded-br-xl bg-primary px-2.5 py-1.5 text-[10px] font-bold text-primary-foreground"
                                    >
                                        -{cake.discount}%
                                    </span>
                                )}

                                {/* Variant Badge */}
                                <span className="absolute bottom-3 inset-e-3 rounded-none rounded-tl-xl rounded-br-xl border border-white/40 bg-background/90 px-2.5 py-1.5 text-[10px] font-bold text-foreground shadow-sm backdrop-blur-sm">
                                    {cake.variant[language]}
                                </span>
                            </div>

                            <div className="p-3.5 md:p-4">
                                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                    {cake.category[language]}
                                </p>

                                <h3 className="truncate text-[13px] font-bold tracking-tight text-card-foreground md:text-[15px]">
                                    {cake.name[language]}
                                </h3>

                                <div className="mt-3 flex items-center justify-between gap-2">
                                    <div className="flex min-w-0 items-baseline gap-1.5">
                                        <span className="text-base font-extrabold tracking-tight text-foreground md:text-lg">
                                            {cake.price.toFixed(2)}
                                        </span>

                                        {cake.discount > 0 && (
                                            <span className="text-[10px] text-muted-foreground line-through md:text-xs">
                                                {cake.oldPrice.toFixed(2)}
                                            </span>
                                        )}

                                        <span className="text-[9px] font-semibold text-muted-foreground">
                                            KWD
                                        </span>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="asymmetric"
                                        size="icon-sm"
                                        className="shrink-0"
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Mobile View All */}
                <ViewAllButton className="mt-6 w-full md:hidden">
                    {language === "ar"
                        ? "عرض جميع العروض"
                        : "View all deals"}
                </ViewAllButton>
            </div>
        </section>
    );
};

export default HotDeals;