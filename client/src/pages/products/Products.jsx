import { Filter, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import ProductFilters from "./ProductFilters";
import { useLanguage } from "@/context/LanguageContext";

const products = [
    {
        id: 1,
        name: {
            en: "Classic Chocolate Cake",
            ar: "كعكة الشوكولاتة الكلاسيكية",
        },
        categoryName: {
            en: "Chocolate",
            ar: "شوكولاتة",
        },
        category: "chocolate-cakes",
        price: 8.5,
        oldPrice: 11,
        size: ["small", "medium"],
        delivery: ["today", "free"],
        image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&auto=format&fit=crop&q=80",
    },
    {
        id: 2,
        name: {
            en: "Strawberry Celebration",
            ar: "كعكة الفراولة للاحتفال",
        },
        categoryName: {
            en: "Birthday",
            ar: "أعياد الميلاد",
        },
        category: "birthday-cakes",
        price: 9.5,
        oldPrice: 12,
        size: ["small", "medium"],
        delivery: ["today"],
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
    },
    {
        id: 3,
        name: {
            en: "Red Velvet Dream",
            ar: "ريد فلفت دريم",
        },
        categoryName: {
            en: "Red Velvet",
            ar: "ريد فلفت",
        },
        category: "red-velvet",
        price: 10,
        oldPrice: 13,
        size: ["medium"],
        delivery: ["today", "free"],
        image: "https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?w=800&auto=format&fit=crop&q=80",
    },
    {
        id: 4,
        name: {
            en: "Berry Cheesecake",
            ar: "تشيز كيك بالتوت",
        },
        categoryName: {
            en: "Cheesecake",
            ar: "تشيز كيك",
        },
        category: "cheesecakes",
        price: 8,
        oldPrice: 10.5,
        size: ["small", "medium"],
        delivery: ["free"],
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
    },
    {
        id: 5,
        name: {
            en: "Golden Caramel Cake",
            ar: "كعكة الكراميل الذهبية",
        },
        categoryName: {
            en: "Caramel",
            ar: "كراميل",
        },
        category: "caramel-cakes",
        price: 9,
        oldPrice: 11.5,
        size: ["small", "medium"],
        delivery: ["today"],
        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop&q=80",
    },
    {
        id: 6,
        name: {
            en: "Fresh Fruit Cake",
            ar: "كعكة الفواكه الطازجة",
        },
        categoryName: {
            en: "Fruit",
            ar: "فواكه",
        },
        category: "fruit-cakes",
        price: 10.5,
        oldPrice: 14,
        size: ["medium"],
        delivery: ["free"],
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80",
    },
    {
        id: 7,
        name: {
            en: "Vanilla Mini Cake",
            ar: "كعكة الفانيليا الصغيرة",
        },
        categoryName: {
            en: "Mini Cake",
            ar: "كعكة صغيرة",
        },
        category: "mini-cakes",
        price: 5.5,
        oldPrice: 7,
        size: ["small"],
        delivery: ["today", "free"],
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
    },
    {
        id: 8,
        name: {
            en: "Wedding White Cake",
            ar: "كعكة الزفاف البيضاء",
        },
        categoryName: {
            en: "Wedding",
            ar: "زفاف",
        },
        category: "wedding-cakes",
        price: 18,
        oldPrice: 18,
        size: ["medium"],
        delivery: ["today"],
        image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80",
    },
];

const initialFilters = {
    category: null,
    price: null,
    size: [],
    delivery: [],
};

const Products = () => {
    const { language } = useLanguage();

    const [filters, setFilters] = useState(initialFilters);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [sort, setSort] = useState("featured");

    const isArabic = language === "ar";

    const handleFilterChange = (nextFilters) => {
        setFilters(nextFilters);
    };

    const clearFilters = () => {
        setFilters(initialFilters);
    };

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (filters.category) {
            result = result.filter(
                (product) => product.category === filters.category,
            );
        }

        if (filters.price) {
            const [min, max] = filters.price.split("-").map(Number);

            result = result.filter(
                (product) => product.price >= min && product.price <= max,
            );
        }

        if (filters.size.length > 0) {
            result = result.filter((product) =>
                filters.size.some((size) => product.size.includes(size)),
            );
        }

        if (filters.delivery.length > 0) {
            result = result.filter((product) =>
                filters.delivery.every((delivery) =>
                    product.delivery.includes(delivery),
                ),
            );
        }

        if (sort === "price-low") {
            result.sort((a, b) => a.price - b.price);
        }

        if (sort === "price-high") {
            result.sort((a, b) => b.price - a.price);
        }

        if (sort === "name") {
            result.sort((a, b) =>
                a.name[language].localeCompare(b.name[language]),
            );
        }

        return result;
    }, [filters, sort, language]);

    const selectedFilters = [];

    if (filters.category) {
        const category = [
            {
                value: "birthday-cakes",
                en: "Birthday Cakes",
                ar: "كعكات أعياد الميلاد",
            },
            {
                value: "wedding-cakes",
                en: "Wedding Cakes",
                ar: "كعكات الزفاف",
            },
            {
                value: "chocolate-cakes",
                en: "Chocolate Cakes",
                ar: "كعكات الشوكولاتة",
            },
            {
                value: "red-velvet",
                en: "Red Velvet",
                ar: "ريد فلفت",
            },
            {
                value: "cheesecakes",
                en: "Cheesecakes",
                ar: "كعكات الجبن",
            },
            {
                value: "cupcakes",
                en: "Cupcakes",
                ar: "كب كيك",
            },
            {
                value: "mini-cakes",
                en: "Mini Cakes",
                ar: "كعكات صغيرة",
            },
            {
                value: "fruit-cakes",
                en: "Fruit Cakes",
                ar: "كعكات الفواكه",
            },
            {
                value: "custom-cakes",
                en: "Custom Cakes",
                ar: "كعكات مخصصة",
            },
            {
                value: "caramel-cakes",
                en: "Caramel Cakes",
                ar: "كعكات الكراميل",
            },
            {
                value: "tarts",
                en: "Tarts",
                ar: "تارت",
            },
            {
                value: "seasonal-cakes",
                en: "Seasonal Cakes",
                ar: "كعكات موسمية",
            },
        ].find((item) => item.value === filters.category);

        if (category) {
            selectedFilters.push({
                type: "category",
                value: category.value,
                label: category[language],
            });
        }
    }

    if (filters.price) {
        const price = {
            "0-5": {
                en: "0 – 5 KWD",
                ar: "٠ – ٥ د.ك",
            },
            "5-10": {
                en: "5 – 10 KWD",
                ar: "٥ – ١٠ د.ك",
            },
            "10-15": {
                en: "10 – 15 KWD",
                ar: "١٠ – ١٥ د.ك",
            },
            "15-100": {
                en: "15 – 100 KWD",
                ar: "١٥ – ١٠٠ د.ك",
            },
        }[filters.price];

        if (price) {
            selectedFilters.push({
                type: "price",
                value: filters.price,
                label: price[language],
            });
        }
    }

    filters.size.forEach((size) => {
        selectedFilters.push({
            type: "size",
            value: size,
            label:
                size === "small"
                    ? isArabic
                        ? "صغير"
                        : "Small"
                    : isArabic
                      ? "متوسط"
                      : "Medium",
        });
    });

    filters.delivery.forEach((delivery) => {
        selectedFilters.push({
            type: "delivery",
            value: delivery,
            label:
                delivery === "today"
                    ? isArabic
                        ? "متاح اليوم"
                        : "Available today"
                    : isArabic
                      ? "توصيل مجاني"
                      : "Free delivery",
        });
    });

    const removeFilter = (type, value) => {
        if (type === "category" || type === "price") {
            setFilters((current) => ({
                ...current,
                [type]: null,
            }));

            return;
        }

        setFilters((current) => ({
            ...current,
            [type]: current[type].filter((item) => item !== value),
        }));
    };

    return (
        <main className="bg-background pb-16 md:pb-0">
            {/* Page header */}
            <section className="border-b border-border bg-secondary/30 pt-28 pb-8 md:pt-32 md:pb-10">
                <div className="wrapper">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        {isArabic ? "مجموعتنا" : "Our collection"}
                    </p>

                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-[-0.04em] text-foreground md:text-4xl xl:text-5xl">
                                {isArabic
                                    ? "اكتشف جميع الكعكات"
                                    : "Explore all cakes"}
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                                {isArabic
                                    ? "اختر من مجموعتنا من الكعكات المصنوعة لكل مناسبة."
                                    : "Browse our collection of cakes crafted for every occasion."}
                            </p>
                        </div>

                        {/* Mobile filter button */}
                        <Sheet
                            open={mobileFiltersOpen}
                            onOpenChange={setMobileFiltersOpen}
                        >
                            <SheetTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline-asymmetric"
                                    size="sm"
                                    className="py-5 px-8 shrink-0 md:hidden"
                                >
                                    <Filter className="size-4" />
                                    {isArabic ? "تصفية" : "Filters"}
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side={isArabic ? "left" : "right"}
                                className="w-[min(90vw,380px)] overflow-y-auto p-0"
                            >
                                <SheetHeader className="border-b border-border px-5 py-5 text-start">
                                    <SheetTitle>
                                        {isArabic
                                            ? "تصفية المنتجات"
                                            : "Filter products"}
                                    </SheetTitle>

                                    <SheetDescription>
                                        {isArabic
                                            ? "اختر ما يناسبك"
                                            : "Refine your selection"}
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="px-5">
                                    <ProductFilters
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="py-8 md:py-10">
                <div className="wrapper">
                    <div className="flex items-start gap-8">
                        {/* Desktop filters */}
                        <aside className="hidden w-60 shrink-0 md:block xl:w-64">
                            <div className="sticky top-24 rounded-none rounded-tl-3xl rounded-br-3xl border border-border bg-card p-5 shadow-sm">
                                <ProductFilters
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                        </aside>

                        {/* Product area */}
                        <div className="min-w-0 flex-1">
                            {/* Toolbar */}
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-bold text-foreground">
                                        {filteredProducts.length}
                                    </span>{" "}
                                    {isArabic ? "منتج" : "products"}
                                </p>

                                <div className="flex items-center gap-2">
                                    <span className="hidden text-xs font-medium text-muted-foreground md:block">
                                        {isArabic ? "ترتيب حسب" : "Sort by"}
                                    </span>

                                    <Select
                                        value={sort}
                                        onValueChange={setSort}
                                    >
                                        <SelectTrigger className="h-9 w-36 rounded-none rounded-tl-xl rounded-br-xl bg-card text-xs md:w-40">
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="featured">
                                                {isArabic ? "مميز" : "Featured"}
                                            </SelectItem>

                                            <SelectItem value="price-low">
                                                {isArabic
                                                    ? "السعر: الأقل"
                                                    : "Price: Low to high"}
                                            </SelectItem>

                                            <SelectItem value="price-high">
                                                {isArabic
                                                    ? "السعر: الأعلى"
                                                    : "Price: High to low"}
                                            </SelectItem>

                                            <SelectItem value="name">
                                                {isArabic ? "الاسم" : "Name"}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Selected filters */}
                            {selectedFilters.length > 0 && (
                                <div className="mb-6 flex flex-wrap items-center gap-2">
                                    <span className="me-1 text-xs font-semibold text-muted-foreground">
                                        {isArabic
                                            ? "الفلاتر المحددة:"
                                            : "Selected:"}
                                    </span>

                                    {selectedFilters.map((filter) => (
                                        <button
                                            key={`${filter.type}-${filter.value}`}
                                            type="button"
                                            onClick={() =>
                                                removeFilter(
                                                    filter.type,
                                                    filter.value,
                                                )
                                            }
                                            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-secondary hover:text-primary"
                                        >
                                            {filter.label}

                                            <X className="size-3 text-muted-foreground transition-colors group-hover:text-primary" />
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="ms-1 text-xs font-semibold text-primary hover:text-primary/70"
                                    >
                                        {isArabic ? "مسح الكل" : "Clear all"}
                                    </button>
                                </div>
                            )}

                            {/* Product grid */}
                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-5">
                                    {filteredProducts.map((product) => (
                                        <article
                                            key={product.id}
                                            className="group overflow-hidden rounded-none rounded-tl-3xl rounded-br-3xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
                                        >
                                            <div className="relative aspect-1.25/1 overflow-hidden bg-secondary">
                                                <img
                                                    src={product.image}
                                                    alt={product.name[language]}
                                                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                                                    loading="lazy"
                                                />

                                                {product.oldPrice >
                                                    product.price && (
                                                    <span
                                                        dir="ltr"
                                                        className="absolute top-3 inset-s-3 rounded-none rounded-tl-xl rounded-br-xl bg-primary px-2.5 py-1.5 text-[10px] font-bold text-primary-foreground"
                                                    >
                                                        -
                                                        {Math.round(
                                                            ((product.oldPrice -
                                                                product.price) /
                                                                product.oldPrice) *
                                                                100,
                                                        )}
                                                        %
                                                    </span>
                                                )}

                                                <span className="absolute bottom-3 inset-e-3 translate-y-2 rounded-none rounded-tl-xl rounded-br-xl border border-white/40 bg-background/90 px-2.5 py-1.5 text-[10px] font-bold text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                    {product.size.length === 2
                                                        ? isArabic
                                                            ? "صغير / متوسط"
                                                            : "Small / Medium"
                                                        : product.size[0] ===
                                                            "small"
                                                          ? isArabic
                                                              ? "صغير"
                                                              : "Small"
                                                          : isArabic
                                                            ? "متوسط"
                                                            : "Medium"}
                                                </span>
                                            </div>

                                            <div className="p-3.5 md:p-4">
                                                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                                    {
                                                        product.categoryName[
                                                            language
                                                        ]
                                                    }
                                                </p>

                                                <h3 className="truncate text-[13px] font-bold tracking-tight text-card-foreground md:text-[15px]">
                                                    {product.name[language]}
                                                </h3>

                                                <div className="mt-3 flex items-baseline gap-1.5">
                                                    <span className="text-base font-extrabold tracking-tight text-foreground md:text-lg">
                                                        {product.price.toFixed(
                                                            2,
                                                        )}
                                                    </span>

                                                    {product.oldPrice >
                                                        product.price && (
                                                        <span className="text-[10px] text-muted-foreground line-through md:text-xs">
                                                            {product.oldPrice.toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                    )}

                                                    <span className="text-[9px] font-semibold text-muted-foreground">
                                                        KWD
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-none rounded-tl-3xl rounded-br-3xl border border-border bg-card px-6 py-16 text-center">
                                    <h2 className="mt-4 text-lg font-bold text-foreground">
                                        {isArabic
                                            ? "لم يتم العثور على كعكات"
                                            : "No cakes found"}
                                    </h2>

                                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                                        {isArabic
                                            ? "جرب إزالة بعض الفلاتر لرؤية المزيد من الكعكات."
                                            : "Try removing some filters to see more cakes."}
                                    </p>

                                    <Button
                                        type="button"
                                        variant="outline-asymmetric"
                                        className="mt-5"
                                        onClick={clearFilters}
                                    >
                                        {isArabic
                                            ? "مسح الفلاتر"
                                            : "Clear filters"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Products;
