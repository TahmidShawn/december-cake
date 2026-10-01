import { Sparkles } from "lucide-react";

import PrimaryButton from "@/components/shared/button/PrimaryButton";
import { useLanguage } from "@/context/LanguageContext";

const featuredCake = {
    name: {
        en: "Fresh Fruit Cake",
        ar: "كعكة الفواكه الطازجة",
    },
    category: {
        en: "Fruit Cake",
        ar: "كعكة الفواكه",
    },
    description: {
        en: "Fresh seasonal fruits, soft sponge and smooth cream in every layer.",
        ar: "فواكه موسمية طازجة وكيك إسفنجي ناعم وكريمة لذيذة في كل طبقة.",
    },
    price: 10.5,
    oldPrice: 14,
    discount: 25,
    image: "https://images.unsplash.com/photo-1557164158-11e97f2bb220?w=500&auto=format&fit=crop&q=85",
};

const FeaturedDeal = () => {
    const { language } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-background pb-20">
            <div className="wrapper">
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        {/* Cake Image */}
                        <div className="relative aspect-[1.3/1] overflow-hidden md:aspect-auto md:h-125 md:w-[55%]">
                            <img
                                src={featuredCake.image}
                                alt={featuredCake.name[language]}
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />

                            {/* Discount */}
                            <div className="absolute top-4 inset-s-4 flex size-20 flex-col items-center justify-center rounded-full bg-background shadow-lg md:top-5 md:inset-s-5 md:size-22">
                                <span className="text-2xl font-black leading-none text-foreground">
                                    {featuredCake.discount}%
                                </span>

                                <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                    {language === "ar" ? "خصم" : "OFF"}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col justify-center p-7 md:p-9 xl:p-10">
                            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                                <Sparkles className="size-3.5" />

                                {language === "ar"
                                    ? "العرض المميز"
                                    : "Featured deal"}
                            </div>

                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                {featuredCake.category[language]}
                            </p>

                            <h2 className="max-w-md text-3xl font-black tracking-[-0.04em] text-foreground md:text-4xl xl:text-5xl">
                                {featuredCake.name[language]}
                            </h2>

                            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground md:text-base">
                                {featuredCake.description[language]}
                            </p>

                            <div className="mt-5 flex items-end gap-2.5">
                                <span className="text-3xl font-black tracking-tight text-foreground">
                                    {featuredCake.price.toFixed(2)}
                                </span>

                                <span className="pb-1 text-xs font-semibold text-muted-foreground">
                                    KWD
                                </span>

                                <span className="pb-1 text-sm text-muted-foreground line-through">
                                    {featuredCake.oldPrice.toFixed(2)}
                                </span>
                            </div>

                            <div className="mt-6">
                                <PrimaryButton type="button">
                                    {language === "ar"
                                        ? "اطلب الآن"
                                        : "Order now"}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedDeal;
