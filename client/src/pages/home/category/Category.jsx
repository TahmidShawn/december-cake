import { useLanguage } from "@/context/LanguageContext";

const categories = [
    {
        name: {
            en: "Birthday Cakes",
            ar: "كعكات أعياد الميلاد",
        },
        count: 42,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Wedding Cakes",
            ar: "كعكات الزفاف",
        },
        count: 28,
        image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Chocolate Cakes",
            ar: "كعكات الشوكولاتة",
        },
        count: 36,
        image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Red Velvet",
            ar: "ريد فيلفت",
        },
        count: 24,
        image: "https://images.unsplash.com/photo-1621423828877-f6afc6fafa90?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Cheesecakes",
            ar: "كعكات الجبن",
        },
        count: 19,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Cupcakes",
            ar: "كب كيك",
        },
        count: 31,
        image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Mini Cakes",
            ar: "كعكات صغيرة",
        },
        count: 17,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Fruit Cakes",
            ar: "كعكات الفواكه",
        },
        count: 22,
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Custom Cakes",
            ar: "كعكات مخصصة",
        },
        count: 15,
        image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Caramel Cakes",
            ar: "كعكات الكراميل",
        },
        count: 18,
        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop&q=80",
    },
    {
        name: {
            en: "Tarts",
            ar: "تارت",
        },
        count: 14,
        image: "https://images.unsplash.com/photo-1556953410-b77c8b035596?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTMzfHxjYWtlfGVufDB8fDB8fHww",
    },
    {
        name: {
            en: "Seasonal Cakes",
            ar: "كعكات موسمية",
        },
        count: 12,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
    },
];

const Category = () => {
    const { language } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-secondary/30 py-16 sm:py-20">
            <div className="wrapper">
                {/* Section Header */}
                <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-none rounded-tl-2xl rounded-br-2xl border border-border bg-card px-4 py-2 text-xs font-semibold text-primary shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                            {language === "ar"
                                ? "اكتشف مجموعتنا"
                                : "Explore our collection"}
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl xl:text-4xl">
                            {language === "ar"
                                ? "اختر حسب الفئة"
                                : "Find your perfect cake"}
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                            {language === "ar"
                                ? "اكتشف مجموعة من الكعكات المصنوعة لكل مناسبة."
                                : "Browse our selection of cakes crafted for every occasion."}
                        </p>
                    </div>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-5">
                    {categories.map((category) => (
                        <article
                            key={category.name.en}
                            className="group overflow-hidden rounded-none rounded-tl-3xl rounded-br-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="relative aspect-[1.1/1] overflow-hidden bg-secondary">
                                <img
                                    src={category.image}
                                    alt={category.name[language]}
                                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                    loading="lazy"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-foreground/35 via-transparent to-transparent" />

                                <div className="absolute bottom-3 inset-s-3 rounded-none rounded-tl-xl rounded-br-xl border border-white/30 bg-background/90 px-2.5 py-1.5 text-[10px] font-semibold text-foreground shadow-sm backdrop-blur-sm">
                                    {category.count}{" "}
                                    {language === "ar"
                                        ? "كعكة"
                                        : category.count === 1
                                          ? "cake"
                                          : "cakes"}
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 p-4">
                                <h3 className="min-w-0 truncate text-sm font-semibold text-card-foreground md:text-base">
                                    {category.name[language]}
                                </h3>

                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none rounded-tl-lg rounded-br-lg bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="size-4 transition-transform duration-300 group-hover:rotate-45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M7 17 17 7" />
                                        <path d="M7 7h10v10" />
                                    </svg>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Category;
