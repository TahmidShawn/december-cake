
import { ChevronDown, ChevronRight, SlidersHorizontal } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/context/LanguageContext";

const categories = [
    {
        name: { en: "Birthday Cakes", ar: "كعكات أعياد الميلاد" },
        value: "birthday-cakes",
    },
    {
        name: { en: "Wedding Cakes", ar: "كعكات الزفاف" },
        value: "wedding-cakes",
    },
    {
        name: { en: "Chocolate Cakes", ar: "كعكات الشوكولاتة" },
        value: "chocolate-cakes",
    },
    {
        name: { en: "Red Velvet", ar: "ريد فلفت" },
        value: "red-velvet",
    },
    {
        name: { en: "Cheesecakes", ar: "كعكات الجبن" },
        value: "cheesecakes",
    },
    {
        name: { en: "Cupcakes", ar: "كب كيك" },
        value: "cupcakes",
    },
    {
        name: { en: "Mini Cakes", ar: "كعكات صغيرة" },
        value: "mini-cakes",
    },
    {
        name: { en: "Fruit Cakes", ar: "كعكات الفواكه" },
        value: "fruit-cakes",
    },
    {
        name: { en: "Custom Cakes", ar: "كعكات مخصصة" },
        value: "custom-cakes",
    },
    {
        name: { en: "Caramel Cakes", ar: "كعكات الكراميل" },
        value: "caramel-cakes",
    },
    {
        name: { en: "Tarts", ar: "تارت" },
        value: "tarts",
    },
    {
        name: { en: "Seasonal Cakes", ar: "كعكات موسمية" },
        value: "seasonal-cakes",
    },
];

const priceRanges = [
    {
        label: { en: "0 – 5 KWD", ar: "٠ – ٥ د.ك" },
        value: "0-5",
    },
    {
        label: { en: "5 – 10 KWD", ar: "٥ – ١٠ د.ك" },
        value: "5-10",
    },
    {
        label: { en: "10 – 15 KWD", ar: "١٠ – ١٥ د.ك" },
        value: "10-15",
    },
    {
        label: { en: "15 – 100 KWD", ar: "١٥ – ١٠٠ د.ك" },
        value: "15-100",
    },
];

const sizes = [
    {
        label: { en: "Small", ar: "صغير" },
        value: "small",
        count: 24,
    },
    {
        label: { en: "Medium", ar: "متوسط" },
        value: "medium",
        count: 38,
    },
];

const deliveryOptions = [
    {
        label: { en: "Available today", ar: "متاح للتوصيل اليوم" },
        value: "today",
    },
    {
        label: { en: "Free delivery", ar: "توصيل مجاني" },
        value: "free",
    },
];

const ProductFilters = ({
    filters = {
        category: null,
        price: null,
        size: [],
        delivery: [],
    },
    onFilterChange = () => {},
}) => {
    const { language } = useLanguage();

    const isArabic = language === "ar";

    const handleCategoryClick = (value) => {
        onFilterChange({
            ...filters,
            category: filters.category === value ? null : value,
        });
    };

    const handlePriceChange = (value) => {
        onFilterChange({
            ...filters,
            price: filters.price === value ? null : value,
        });
    };

    const handleSizeChange = (value) => {
        const currentSizes = filters.size || [];

        const nextSizes = currentSizes.includes(value)
            ? currentSizes.filter((item) => item !== value)
            : [...currentSizes, value];

        onFilterChange({
            ...filters,
            size: nextSizes,
        });
    };

    const handleDeliveryChange = (value) => {
        const currentDelivery = filters.delivery || [];

        const nextDelivery = currentDelivery.includes(value)
            ? currentDelivery.filter((item) => item !== value)
            : [...currentDelivery, value];

        onFilterChange({
            ...filters,
            delivery: nextDelivery,
        });
    };

    const clearAll = () => {
        onFilterChange({
            category: null,
            price: null,
            size: [],
            delivery: [],
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-none rounded-tl-lg rounded-br-lg bg-secondary text-primary">
                        <SlidersHorizontal className="size-4" />
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-foreground">
                            {isArabic ? "تصفية المنتجات" : "Filters"}
                        </h2>

                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {isArabic
                                ? "تصفح حسب تفضيلاتك"
                                : "Refine your selection"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={clearAll}
                    className="text-[10px] font-semibold text-primary transition-colors hover:text-primary/70"
                >
                    {isArabic ? "مسح الكل" : "Clear all"}
                </button>
            </div>

            {/* Categories */}
            <Collapsible defaultOpen>
                <div className="border-t border-border py-5">
                    <CollapsibleTrigger className="group flex w-full items-center justify-between text-start outline-none">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
                                {isArabic ? "الفئات" : "Categories"}
                            </h3>

                            <p className="mt-1 text-[10px] text-muted-foreground">
                                {isArabic ? "تصفح الفئات" : "Browse categories"}
                            </p>
                        </div>

                        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="overflow-hidden">
                        <div className="mt-4 max-h-52 overflow-y-auto">
                            <div className="space-y-0.5 pe-1">
                                {categories.map((category) => {
                                    const isSelected =
                                        filters.category === category.value;

                                    return (
                                        <button
                                            key={category.value}
                                            type="button"
                                            onClick={() =>
                                                handleCategoryClick(
                                                    category.value,
                                                )
                                            }
                                            className={`group flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-start text-sm transition-colors ${
                                                isSelected
                                                    ? "bg-secondary font-semibold text-primary"
                                                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                                            }`}
                                        >
                                            <span>
                                                {category.name[language]}
                                            </span>

                                            <ChevronRight
                                                className={`size-3.5 rtl:rotate-180 ${
                                                    isSelected
                                                        ? "opacity-100"
                                                        : "opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>

            {/* Price */}
            <Collapsible defaultOpen>
                <div className="border-t border-border py-5">
                    <CollapsibleTrigger className="group flex w-full items-center justify-between text-start outline-none">
                        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
                            {isArabic ? "السعر" : "Price"}
                        </h3>

                        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="overflow-hidden">
                        <div className="space-y-1.5 pt-4">
                            {priceRanges.map((range) => {
                                const isSelected =
                                    filters.price === range.value;

                                return (
                                    <label
                                        key={range.value}
                                        className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary"
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() =>
                                                handlePriceChange(
                                                    range.value,
                                                )
                                            }
                                        />

                                        <span
                                            className={`text-sm transition-colors ${
                                                isSelected
                                                    ? "font-semibold text-foreground"
                                                    : "text-muted-foreground group-hover:text-foreground"
                                            }`}
                                        >
                                            {range.label[language]}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>

            {/* Size */}
            <Collapsible defaultOpen>
                <div className="border-t border-border py-5">
                    <CollapsibleTrigger className="group flex w-full items-center justify-between text-start outline-none">
                        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
                            {isArabic ? "الحجم" : "Size"}
                        </h3>

                        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="overflow-hidden">
                        <div className="space-y-1.5 pt-4">
                            {sizes.map((size) => {
                                const isSelected =
                                    filters.size?.includes(size.value);

                                return (
                                    <label
                                        key={size.value}
                                        className="group flex cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() =>
                                                    handleSizeChange(
                                                        size.value,
                                                    )
                                                }
                                            />

                                            <span
                                                className={`text-sm transition-colors ${
                                                    isSelected
                                                        ? "font-semibold text-foreground"
                                                        : "text-muted-foreground group-hover:text-foreground"
                                                }`}
                                            >
                                                {size.label[language]}
                                            </span>
                                        </div>

                                        <span className="text-[10px] text-muted-foreground">
                                            {size.count}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>

            {/* Delivery */}
            <Collapsible defaultOpen>
                <div className="border-t border-border py-5">
                    <CollapsibleTrigger className="group flex w-full items-center justify-between text-start outline-none">
                        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
                            {isArabic ? "التوصيل" : "Delivery"}
                        </h3>

                        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="overflow-hidden">
                        <div className="space-y-1.5 pt-4">
                            {deliveryOptions.map((option) => {
                                const isSelected =
                                    filters.delivery?.includes(option.value);

                                return (
                                    <label
                                        key={option.value}
                                        className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary"
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() =>
                                                handleDeliveryChange(
                                                    option.value,
                                                )
                                            }
                                        />

                                        <span
                                            className={`text-sm transition-colors ${
                                                isSelected
                                                    ? "font-semibold text-foreground"
                                                    : "text-muted-foreground group-hover:text-foreground"
                                            }`}
                                        >
                                            {option.label[language]}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        </div>
    );
};

export default ProductFilters;