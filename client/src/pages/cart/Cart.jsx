import { useState } from "react";
import {
    ArrowRight,
    Check,
    ChevronRight,
    Minus,
    Plus,
    ShoppingBag,
    Sparkles,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";

const initialCartItems = [
    {
        id: "cake-001",
        name: {
            en: "Classic Chocolate Celebration Cake",
            ar: "كعكة الشوكولاتة الكلاسيكية للاحتفال",
        },
        image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&auto=format&fit=crop&q=85",
        size: { en: "Medium", ar: "متوسط" },
        servings: "8-12",
        price: 12.5,
        discountPercentage: 15,
        discountedPrice: 10.625,
        quantity: 1,
    },
    {
        id: "cake-002",
        name: {
            en: "Strawberry Cream Cake",
            ar: "كعكة كريمة الفراولة",
        },
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&auto=format&fit=crop&q=85",
        size: { en: "Small", ar: "صغير" },
        servings: "3-4",
        price: 8.5,
        discountPercentage: 0,
        discountedPrice: 8.5,
        quantity: 1,
    },
    {
        id: "cake-003",
        name: {
            en: "Red Velvet Celebration Cake",
            ar: "كعكة ريد فلفت للاحتفال",
        },
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=700&auto=format&fit=crop&q=85",
        size: { en: "Medium", ar: "متوسط" },
        servings: "8-12",
        price: 14,
        discountPercentage: 10,
        discountedPrice: 12.6,
        quantity: 1,
    },
];

const addOns = [
    {
        id: "candles",
        name: { en: "Birthday Candles", ar: "شموع عيد الميلاد" },
        description: {
            en: "A colorful candle set for your celebration.",
            ar: "مجموعة شموع ملونة لاحتفالك.",
        },
        image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&auto=format&fit=crop&q=85",
        price: 0.5,
    },
    {
        id: "card",
        name: { en: "Greeting Card", ar: "بطاقة تهنئة" },
        description: {
            en: "Add a personal message to your cake.",
            ar: "أضف رسالة شخصية مع كعكتك.",
        },
        image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=400&auto=format&fit=crop&q=85",
        price: 0.75,
    },
    {
        id: "flowers",
        name: { en: "Fresh Flowers", ar: "زهور نضرة" },
        description: {
            en: "A small fresh flower arrangement.",
            ar: "تنسيق صغير من الزهور النضرة.",
        },
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&auto=format&fit=crop&q=85",
        price: 2,
    },
    {
        id: "chocolate-box",
        name: { en: "Chocolate Box", ar: "علبة شوكولاتة" },
        description: {
            en: "A delicious chocolate box to share.",
            ar: "علبة شوكولاتة لذيذة للمشاركة.",
        },
        image: "https://images.unsplash.com/photo-1548907040-4d42fcaa4f7d?w=400&auto=format&fit=crop&q=85",
        price: 1.5,
    },
    {
        id: "cake-topper",
        name: { en: "Cake Topper", ar: "زينة الكعكة" },
        description: {
            en: "A stylish topper for your celebration cake.",
            ar: "زينة أنيقة لكعكة الاحتفال.",
        },
        image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&auto=format&fit=crop&q=85",
        price: 1,
    },
    {
        id: "mini-balloons",
        name: { en: "Mini Balloons", ar: "بالونات صغيرة" },
        description: {
            en: "A small balloon set for your celebration.",
            ar: "مجموعة بالونات صغيرة لاحتفالك.",
        },
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&auto=format&fit=crop&q=85",
        price: 1.25,
    },
    {
        id: "rose-bouquet",
        name: { en: "Rose Bouquet", ar: "باقة ورد" },
        description: {
            en: "A beautiful bouquet of fresh roses.",
            ar: "باقة جميلة من الورود الطازجة.",
        },
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&auto=format&fit=crop&q=85",
        price: 3.5,
    },
    {
        id: "macaron-box",
        name: { en: "Macaron Box", ar: "علبة ماكارون" },
        description: {
            en: "A colorful box of premium macarons.",
            ar: "علبة ملونة من الماكارون الفاخر.",
        },
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&auto=format&fit=crop&q=85",
        price: 2.5,
    },
    {
        id: "gift-wrap",
        name: { en: "Premium Gift Wrap", ar: "تغليف هدايا فاخر" },
        description: {
            en: "Beautiful premium packaging for gifting.",
            ar: "تغليف فاخر وجميل مناسب للهدايا.",
        },
        image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=85",
        price: 0.75,
    },
    {
        id: "chocolate-strawberries",
        name: {
            en: "Chocolate Strawberries",
            ar: "فراولة بالشوكولاتة",
        },
        description: {
            en: "Fresh strawberries covered in chocolate.",
            ar: "فراولة طازجة مغطاة بالشوكولاتة.",
        },
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=85",
        price: 2.75,
    },
    {
        id: "birthday-banner",
        name: { en: "Birthday Banner", ar: "لافتة عيد ميلاد" },
        description: {
            en: "A festive banner for your special day.",
            ar: "لافتة احتفالية ليومك المميز.",
        },
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&auto=format&fit=crop&q=85",
        price: 1.25,
    },
    {
        id: "premium-candle",
        name: {
            en: "Premium Candle Set",
            ar: "مجموعة شموع فاخرة",
        },
        description: {
            en: "Elegant candles for a premium celebration.",
            ar: "شموع أنيقة لاحتفال مميز.",
        },
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&auto=format&fit=crop&q=85",
        price: 1.5,
    },
];

const featuredAddOns = addOns.slice(0, 6);

const Cart = () => {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    const [cartItems, setCartItems] = useState(initialCartItems);

    const [selectedItems, setSelectedItems] = useState(
        initialCartItems.map((item) => item.id),
    );

    const [selectedAddOns, setSelectedAddOns] = useState([]);

    const [addOnQuantities, setAddOnQuantities] = useState(
        Object.fromEntries(addOns.map((item) => [item.id, 1])),
    );

    const selectedCartItems = cartItems.filter((item) =>
        selectedItems.includes(item.id),
    );

    const selectedAddOnItems = addOns.filter((item) =>
        selectedAddOns.includes(item.id),
    );

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const selectedCakesCount = selectedCartItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const selectedAddOnsCount = selectedAddOnItems.reduce(
        (total, item) => total + addOnQuantities[item.id],
        0,
    );

    const selectedItemsCount = selectedCakesCount + selectedAddOnsCount;

    const cakesTotal = selectedCartItems.reduce(
        (total, item) => total + item.discountedPrice * item.quantity,
        0,
    );

    const addOnsTotal = selectedAddOnItems.reduce(
        (total, item) => total + item.price * addOnQuantities[item.id],
        0,
    );

    const subtotal = cakesTotal + addOnsTotal;
    const deliveryFee = subtotal >= 15 ? 0 : 1.5;
    const total = subtotal + deliveryFee;

    const toggleItem = (id) => {
        setSelectedItems((current) =>
            current.includes(id)
                ? current.filter((itemId) => itemId !== id)
                : [...current, id],
        );
    };

    const toggleAllItems = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map((item) => item.id));
        }
    };

    const updateCakeQuantity = (id, value) => {
        setCartItems((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity: Math.max(1, Math.min(value, 50)),
                      }
                    : item,
            ),
        );
    };

    const removeItem = (id) => {
        setCartItems((current) => current.filter((item) => item.id !== id));

        setSelectedItems((current) =>
            current.filter((itemId) => itemId !== id),
        );
    };

    const toggleAddOn = (id) => {
        setSelectedAddOns((current) =>
            current.includes(id)
                ? current.filter((itemId) => itemId !== id)
                : [...current, id],
        );
    };

    // Clicking + on an unselected add-on automatically selects it.
    const increaseAddOnQuantity = (id) => {
        if (!selectedAddOns.includes(id)) {
            setSelectedAddOns((current) => [...current, id]);

            setAddOnQuantities((current) => ({
                ...current,
                [id]: 1,
            }));

            return;
        }

        setAddOnQuantities((current) => ({
            ...current,
            [id]: Math.min(current[id] + 1, 50),
        }));
    };

    const decreaseAddOnQuantity = (id) => {
        if (!selectedAddOns.includes(id)) {
            return;
        }

        setAddOnQuantities((current) => ({
            ...current,
            [id]: Math.max(current[id] - 1, 1),
        }));
    };

    const scrollToAddOns = () => {
        document.getElementById("cart-add-ons")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    return (
        <main className="bg-background pb-16 md:pb-0">
            <section className="pt-24 md:pt-28">
                <div className="wrapper">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                                    <ShoppingBag className="size-4" />
                                    {isArabic ? "سلة التسوق" : "Shopping cart"}
                                </div>

                                <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] md:text-4xl">
                                    {isArabic ? "سلتك" : "Your cart"}
                                </h1>
                            </div>

                            <span className="pb-1 text-sm font-semibold text-muted-foreground">
                                {totalItems}{" "}
                                {isArabic
                                    ? "منتج"
                                    : totalItems === 1
                                      ? "item"
                                      : "items"}
                            </span>
                        </div>

                        <div className="flex flex-col gap-4 rounded-none rounded-tl-2xl rounded-br-2xl border border-primary/20 bg-secondary/40 p-4 md:flex-row md:items-center md:justify-between md:p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <Sparkles className="size-4" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-black md:text-base">
                                        {isArabic
                                            ? "اجعل احتفالك أكثر تميزًا"
                                            : "Make your celebration extra special"}
                                    </h2>

                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        {isArabic
                                            ? "أضف شموعًا أو زهورًا أو بطاقة تهنئة مع كعكتك."
                                            : "Add candles, flowers, a greeting card, or a little extra with your cake."}
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="asymmetric"
                                size="lg"
                                className="shrink-0 gap-2 px-5 text-xs font-bold md:text-sm"
                                onClick={scrollToAddOns}
                            >
                                {isArabic
                                    ? "اكتشف الإضافات"
                                    : "Explore add-ons"}

                                <ArrowRight className="size-4 rtl:rotate-180" />
                            </Button>
                        </div>

                        <p className="text-sm leading-6 text-muted-foreground">
                            {isArabic
                                ? "راجع طلبك وأضف لمساتك الخاصة قبل المتابعة."
                                : "Review your order and add something special before checkout."}
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-8 md:py-10">
                <div className="wrapper">
                    <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
                        <div className="min-w-0 flex-1">
                            <div className="mb-3 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="select-all"
                                        checked={
                                            cartItems.length > 0 &&
                                            selectedItems.length ===
                                                cartItems.length
                                        }
                                        onCheckedChange={toggleAllItems}
                                    />

                                    <label
                                        htmlFor="select-all"
                                        className="cursor-pointer text-sm font-semibold"
                                    >
                                        {isArabic ? "تحديد الكل" : "Select all"}
                                    </label>
                                </div>

                                <span className="text-sm font-semibold text-muted-foreground">
                                    {selectedItemsCount}{" "}
                                    {isArabic
                                        ? "محدد"
                                        : selectedItemsCount === 1
                                          ? "selected"
                                          : "selected"}
                                </span>
                            </div>

                            <div className="rounded-none rounded-tl-3xl rounded-br-3xl border border-border bg-card p-1 md:p-2">
                                <div className="space-y-2 md:space-y-3">
                                    {cartItems.map((item) => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            language={language}
                                            selected={selectedItems.includes(
                                                item.id,
                                            )}
                                            onToggle={() => toggleItem(item.id)}
                                            onIncrease={() =>
                                                updateCakeQuantity(
                                                    item.id,
                                                    item.quantity + 1,
                                                )
                                            }
                                            onDecrease={() =>
                                                updateCakeQuantity(
                                                    item.id,
                                                    item.quantity - 1,
                                                )
                                            }
                                            onRemove={() => removeItem(item.id)}
                                        />
                                    ))}
                                </div>

                                {cartItems.length === 0 && (
                                    <div className="p-10 text-center">
                                        <ShoppingBag className="mx-auto size-10 text-muted-foreground" />

                                        <h2 className="mt-4 text-lg font-black">
                                            {isArabic
                                                ? "سلة التسوق فارغة"
                                                : "Your cart is empty"}
                                        </h2>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {isArabic
                                                ? "أضف كعكة للبدء."
                                                : "Add a cake to get started."}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div
                                id="cart-add-ons"
                                className="mt-10 scroll-mt-24"
                            >
                                <div className="rounded-none rounded-tl-3xl rounded-br-3xl border border-primary/20 bg-secondary/35 p-5 md:p-6">
                                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                        <div className="max-w-xl">
                                            <div className="flex items-center gap-2 text-primary">
                                                <Sparkles className="size-4" />

                                                <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                                                    {isArabic
                                                        ? "أكمل احتفالك"
                                                        : "Complete the celebration"}
                                                </span>
                                            </div>

                                            <h2 className="mt-2 text-xl font-black tracking-tight md:text-2xl">
                                                {isArabic
                                                    ? "اجعل كعكتك أكثر تميزًا"
                                                    : "Make your cake extra special"}
                                            </h2>

                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                {isArabic
                                                    ? "أضف شموعًا أو بطاقة تهنئة أو زهورًا جميلة مع طلبك."
                                                    : "Add candles, a greeting card, flowers, or another little extra to make your celebration memorable."}
                                            </p>
                                        </div>

                                        <Dialog>
                                            <DialogTrigger
                                                render={
                                                    <Button
                                                        variant="asymmetric"
                                                        size="lg"
                                                        className="shrink-0 gap-2 px-5 text-xs font-bold md:text-sm"
                                                    />
                                                }
                                            >
                                                <Sparkles className="size-4" />

                                                {isArabic
                                                    ? "عرض جميع الإضافات"
                                                    : "See all 12 add-ons"}

                                                <ChevronRight className="size-4 rtl:rotate-180" />
                                            </DialogTrigger>

                                            <DialogContent className="w-[calc(100%-2rem)] !max-w-[70vw] max-h-[90vh] overflow-y-auto p-5 md:p-6">
                                                <DialogHeader className="mb-2">
                                                    <DialogTitle className="text-xl font-black md:text-2xl">
                                                        {isArabic
                                                            ? "اجعل طلبك مميزًا"
                                                            : "Make your order special"}
                                                    </DialogTitle>
                                                </DialogHeader>

                                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                                    {addOns.map((addOn) => (
                                                        <AddOnCard
                                                            key={addOn.id}
                                                            addOn={addOn}
                                                            language={language}
                                                            selected={selectedAddOns.includes(
                                                                addOn.id,
                                                            )}
                                                            quantity={
                                                                addOnQuantities[
                                                                    addOn.id
                                                                ]
                                                            }
                                                            onToggle={() =>
                                                                toggleAddOn(
                                                                    addOn.id,
                                                                )
                                                            }
                                                            onIncrease={() =>
                                                                increaseAddOnQuantity(
                                                                    addOn.id,
                                                                )
                                                            }
                                                            onDecrease={() =>
                                                                decreaseAddOnQuantity(
                                                                    addOn.id,
                                                                )
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                                        {featuredAddOns.map((addOn) => (
                                            <FeaturedAddOn
                                                key={addOn.id}
                                                addOn={addOn}
                                                language={language}
                                                selected={selectedAddOns.includes(
                                                    addOn.id,
                                                )}
                                                quantity={
                                                    addOnQuantities[addOn.id]
                                                }
                                                onToggle={() =>
                                                    toggleAddOn(addOn.id)
                                                }
                                                onIncrease={() =>
                                                    increaseAddOnQuantity(
                                                        addOn.id,
                                                    )
                                                }
                                                onDecrease={() =>
                                                    decreaseAddOnQuantity(
                                                        addOn.id,
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className="w-full xl:w-[360px]">
                            <div className="rounded-none rounded-tl-3xl rounded-br-3xl border border-border bg-card p-5 md:p-6 xl:sticky xl:top-24">
                                <h2 className="text-lg font-black tracking-tight">
                                    {isArabic ? "ملخص الطلب" : "Order summary"}
                                </h2>

                                <div className="mt-5 space-y-4">
                                    {selectedCartItems.length > 0 && (
                                        <div>
                                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                                                {isArabic ? "الكعكات" : "Cakes"}
                                            </p>

                                            <div className="space-y-3">
                                                {selectedCartItems.map(
                                                    (item) => (
                                                        <SummaryItem
                                                            key={item.id}
                                                            name={
                                                                item.name[
                                                                    language
                                                                ]
                                                            }
                                                            quantity={
                                                                item.quantity
                                                            }
                                                            unitPrice={
                                                                item.discountedPrice
                                                            }
                                                            lineTotal={
                                                                item.discountedPrice *
                                                                item.quantity
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {selectedAddOnItems.length > 0 && (
                                        <div>
                                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                                                {isArabic
                                                    ? "الإضافات"
                                                    : "Add-ons"}
                                            </p>

                                            <div className="space-y-3">
                                                {selectedAddOnItems.map(
                                                    (addOn) => {
                                                        const quantity =
                                                            addOnQuantities[
                                                                addOn.id
                                                            ];

                                                        return (
                                                            <SummaryItem
                                                                key={addOn.id}
                                                                name={
                                                                    addOn.name[
                                                                        language
                                                                    ]
                                                                }
                                                                quantity={
                                                                    quantity
                                                                }
                                                                unitPrice={
                                                                    addOn.price
                                                                }
                                                                lineTotal={
                                                                    addOn.price *
                                                                    quantity
                                                                }
                                                            />
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="my-5 border-t border-border" />

                                <div className="space-y-3 text-sm">
                                    <SummaryRow
                                        label={
                                            isArabic
                                                ? "المجموع الفرعي"
                                                : "Subtotal"
                                        }
                                        value={subtotal}
                                    />

                                    <SummaryRow
                                        label={
                                            isArabic ? "التوصيل" : "Delivery"
                                        }
                                        value={deliveryFee}
                                        free={deliveryFee === 0}
                                    />
                                </div>

                                {deliveryFee === 0 && (
                                    <div className="mt-4 rounded-none rounded-tl-xl rounded-br-xl bg-secondary/60 px-3 py-2.5 text-xs font-semibold text-primary">
                                        {isArabic
                                            ? "لقد حصلت على توصيل مجاني."
                                            : "You've unlocked free delivery."}
                                    </div>
                                )}

                                <div className="my-5 border-t border-border" />

                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground">
                                            {isArabic ? "الإجمالي" : "Total"}
                                        </p>

                                        {selectedItemsCount > 0 && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {selectedItemsCount}{" "}
                                                {isArabic
                                                    ? "عنصر محدد"
                                                    : "items selected"}
                                            </p>
                                        )}
                                    </div>

                                    <span
                                        dir="ltr"
                                        className="text-xl font-black"
                                    >
                                        {total.toFixed(3)} KWD
                                    </span>
                                </div>

                                <Button
                                    type="button"
                                    variant="asymmetric"
                                    size="lg"
                                    disabled={selectedItems.length === 0}
                                    className="mt-6 h-12 w-full gap-2 text-sm font-bold"
                                >
                                    {isArabic
                                        ? "متابعة الدفع"
                                        : "Proceed to checkout"}

                                    <ArrowRight className="size-4 rtl:rotate-180" />
                                </Button>

                                {selectedItems.length === 0 && (
                                    <p className="mt-3 text-center text-xs text-destructive">
                                        {isArabic
                                            ? "حدد عنصرًا واحدًا على الأقل للمتابعة."
                                            : "Select at least one item to continue."}
                                    </p>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
};

const CartItem = ({
    item,
    language,
    selected,
    onToggle,
    onIncrease,
    onDecrease,
    onRemove,
}) => {
    const isArabic = language === "ar";
    const lineTotal = item.discountedPrice * item.quantity;

    return (
        <div
            className={`rounded-none rounded-tl-2xl rounded-br-2xl border p-4 shadow-sm transition-all md:p-5 ${
                selected
                    ? "border-border bg-background"
                    : "border-border/60 bg-muted/30 opacity-65"
            }`}
        >
            <div className="flex gap-3 md:gap-4">
                <div className="flex shrink-0 items-start pt-1">
                    <Checkbox checked={selected} onCheckedChange={onToggle} />
                </div>

                <div className="size-20 shrink-0 overflow-hidden rounded-none rounded-tl-xl rounded-br-xl bg-secondary md:size-28">
                    <img
                        src={item.image}
                        alt={item.name[language]}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                                {item.size[language]}
                            </p>

                            <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-5 md:text-lg md:leading-6">
                                {item.name[language]}
                            </h2>

                            <p className="mt-1 text-xs text-muted-foreground">
                                {isArabic
                                    ? `${item.servings} حصص`
                                    : `${item.servings} servings`}
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onRemove}
                            className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>

                    <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span dir="ltr" className="text-sm font-bold">
                                    {item.discountedPrice.toFixed(3)} KWD
                                </span>

                                {item.discountPercentage > 0 && (
                                    <span
                                        dir="ltr"
                                        className="text-xs text-muted-foreground line-through"
                                    >
                                        {item.price.toFixed(3)} KWD
                                    </span>
                                )}
                            </div>

                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="text-[11px] text-muted-foreground">
                                    {isArabic ? "إجمالي المنتج" : "Item total"}
                                </span>

                                <span
                                    dir="ltr"
                                    className="text-base font-black"
                                >
                                    {lineTotal.toFixed(3)} KWD
                                </span>
                            </div>
                        </div>

                        <QuantityControl
                            quantity={item.quantity}
                            onIncrease={onIncrease}
                            onDecrease={onDecrease}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeaturedAddOn = ({
    addOn,
    language,
    selected,
    quantity,
    onToggle,
    onIncrease,
    onDecrease,
}) => {
    const handleCardClick = (event) => {
        if (event.target.closest("button")) {
            return;
        }

        onToggle();
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onToggle();
                }
            }}
            className={`cursor-pointer overflow-hidden rounded-none rounded-tl-2xl rounded-br-2xl border transition-all ${
                selected
                    ? "border-primary/60 bg-primary/[0.05]"
                    : "border-border bg-card hover:border-primary/30"
            }`}
        >
            <div className="relative aspect-[1.45] overflow-hidden bg-secondary">
                <img
                    src={addOn.image}
                    alt={addOn.name[language]}
                    className="h-full w-full object-cover"
                />

                <div className="absolute left-3 top-3">
                    <SelectionIndicator
                        selected={selected}
                        onToggle={onToggle}
                    />
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-sm font-bold md:text-base">
                    {addOn.name[language]}
                </h3>

                <p dir="ltr" className="mt-1 text-sm font-bold text-primary">
                    +{addOn.price.toFixed(3)} KWD
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                    <span className="text-xs font-semibold text-muted-foreground">
                        {language === "ar" ? "الكمية" : "Quantity"}
                    </span>

                    <QuantityControl
                        quantity={selected ? quantity : 0}
                        onIncrease={onIncrease}
                        onDecrease={onDecrease}
                        disabled={false}
                        compact
                    />
                </div>
            </div>
        </div>
    );
};

const AddOnCard = ({
    addOn,
    language,
    selected,
    quantity,
    onToggle,
    onIncrease,
    onDecrease,
}) => {
    const handleCardClick = (event) => {
        if (event.target.closest("button")) {
            return;
        }

        onToggle();
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onToggle();
                }
            }}
            className={`cursor-pointer rounded-none rounded-tl-2xl rounded-br-2xl border p-3 transition-all ${
                selected
                    ? "border-primary/50 bg-primary/[0.04]"
                    : "border-border bg-card hover:border-primary/30"
            }`}
        >
            <div className="flex gap-3">
                <div className="size-16 shrink-0 overflow-hidden rounded-none rounded-tl-xl rounded-br-xl bg-secondary">
                    <img
                        src={addOn.image}
                        alt={addOn.name[language]}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold">
                                {addOn.name[language]}
                            </h3>

                            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                {addOn.description[language]}
                            </p>
                        </div>

                        <SelectionIndicator
                            selected={selected}
                            onToggle={onToggle}
                        />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                        <span
                            dir="ltr"
                            className="text-xs font-bold text-primary"
                        >
                            +{addOn.price.toFixed(3)} KWD
                        </span>

                        <QuantityControl
                            quantity={selected ? quantity : 0}
                            onIncrease={onIncrease}
                            onDecrease={onDecrease}
                            disabled={false}
                            compact
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SelectionIndicator = ({ selected, onToggle }) => {
    return (
        <button
            type="button"
            aria-label={selected ? "Remove add-on" : "Select add-on"}
            onClick={(event) => {
                event.stopPropagation();
                onToggle();
            }}
            className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/35 bg-background hover:border-primary/60"
            }`}
        >
            {selected && <Check className="size-3.5" />}
        </button>
    );
};

const QuantityControl = ({
    quantity,
    onIncrease,
    onDecrease,
    disabled = false,
    compact = false,
}) => {
    return (
        <div
            className={`flex shrink-0 items-center rounded-none rounded-tl-lg rounded-br-lg border border-border bg-background ${
                compact ? "h-8" : "h-9"
            } ${disabled ? "opacity-50" : ""}`}
            onClick={(event) => event.stopPropagation()}
        >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled || quantity <= 1}
                onClick={onDecrease}
                className={`${compact ? "size-7" : "size-8"} rounded-none`}
            >
                <Minus className="size-3.5" />
            </Button>

            <span
                dir="ltr"
                className={`text-center font-bold ${
                    compact ? "w-6 text-xs" : "w-8 text-sm"
                }`}
            >
                {quantity}
            </span>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled || quantity >= 50}
                onClick={onIncrease}
                className={`${compact ? "size-7" : "size-8"} rounded-none`}
            >
                <Plus className="size-3.5" />
            </Button>
        </div>
    );
};

const SummaryItem = ({ name, quantity, unitPrice, lineTotal }) => {
    return (
        <div className="rounded-none rounded-tl-xl rounded-br-xl bg-secondary/35 p-3">
            <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 truncate text-sm font-semibold">{name}</p>

                <span dir="ltr" className="shrink-0 text-sm font-black">
                    {lineTotal.toFixed(3)} KWD
                </span>
            </div>

            <div className="mt-1.5 flex items-center justify-between gap-3">
                <span className="text-[11px] text-muted-foreground">
                    Item total
                </span>

                <span dir="ltr" className="text-[11px] text-muted-foreground">
                    {quantity} × {unitPrice.toFixed(3)} KWD
                </span>
            </div>
        </div>
    );
};

const SummaryRow = ({ label, value, free = false }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{label}</span>

            {free ? (
                <span className="font-semibold text-primary">Free</span>
            ) : (
                <span dir="ltr" className="font-semibold">
                    {value.toFixed(3)} KWD
                </span>
            )}
        </div>
    );
};

export default Cart;
