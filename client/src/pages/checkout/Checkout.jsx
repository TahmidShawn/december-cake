import { useState } from "react";
import {
    Check,
    ChevronRight,
    CreditCard,
    MapPin,
    Pencil,
    ShoppingBag,
    Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const demoSavedAddress = {
    fullName: "Tahmid Shawn",
    phone: "+96550123456",
    governorate: "Hawalli",
    area: "Salmiya",
    block: "10",
    street: "Salem Al Mubarak Street",
    building: "25",
    floor: "3",
    apartmentNo: "12",
    notes: "Please call before delivery.",
};

const demoOrderItems = [
    {
        id: "cake-001",
        name: {
            en: "Classic Chocolate Celebration Cake",
            ar: "كعكة الشوكولاتة الكلاسيكية للاحتفال",
        },
        imageUrl:
            "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=300&auto=format&fit=crop&q=80",
        price: 10.625,
        quantity: 1,
    },
    {
        id: "cake-002",
        name: {
            en: "Strawberry Cream Cake",
            ar: "كعكة الفراولة بالكريمة",
        },
        imageUrl:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80",
        price: 8.5,
        quantity: 1,
    },
];

const demoAddOns = [
    {
        id: "addon-001",
        name: {
            en: "Birthday Candles",
            ar: "شموع عيد الميلاد",
        },
        price: 0.5,
        quantity: 2,
    },
    {
        id: "addon-002",
        name: {
            en: "Greeting Card",
            ar: "بطاقة تهنئة",
        },
        price: 0.75,
        quantity: 1,
    },
];

const governorates = [
    "Al Asimah",
    "Hawalli",
    "Farwaniya",
    "Mubarak Al-Kabeer",
    "Ahmadi",
    "Jahra",
];

const formatPrice = (price) => `${price.toFixed(3)} KWD`;

const Checkout = () => {
    const [savedAddress, setSavedAddress] = useState(demoSavedAddress);
    const [address, setAddress] = useState(demoSavedAddress);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const cakesTotal = demoOrderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    const addOnsTotal = demoAddOns.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    const subtotal = cakesTotal + addOnsTotal;
    const discount = 0;
    const deliveryFee = subtotal >= 15 ? 0 : 1.5;
    const totalPrice = subtotal - discount + deliveryFee;

    const updateAddress = (field, value) => {
        setAddress((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleOpenAddressModal = () => {
        setAddress(savedAddress || {});
        setIsAddressModalOpen(true);
    };

    const handleSaveAddress = () => {
        setSavedAddress(address);
        setIsAddressModalOpen(false);
    };

    const handlePlaceOrder = () => {
        if (!savedAddress || !paymentMethod) {
            return;
        }

        const orderPayload = {
            shippingAddress: savedAddress,

            items: demoOrderItems.map((item) => ({
                cake: item.id,
                name: item.name,
                imageUrl: item.imageUrl,
                price: item.price,
                quantity: item.quantity,
                totalPrice: item.price * item.quantity,
            })),

            addOns: demoAddOns.map((item) => ({
                addOn: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                totalPrice: item.price * item.quantity,
            })),

            paymentMethod,
            paymentStatus: "pending",
            subtotal,
            discount,
            deliveryFee,
            totalPrice,
        };

        console.log("Demo order payload:", orderPayload);

        setOrderPlaced(true);
    };

    if (orderPlaced) {
        return (
            <main className="wrapper py-10 md:py-14">
                <div className="mx-auto max-w-2xl border border-border bg-card p-8 text-center md:p-12">
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-8" />
                    </div>

                    <p className="mb-2 text-sm font-semibold tracking-wider text-primary uppercase">
                        Order placed
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Your order is confirmed
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                        Your demo order has been created successfully. The real
                        backend will create the order and continue with the
                        selected payment flow.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 md:flex-row">
                        <Button
                            variant="asymmetric"
                            size="lg"
                            onClick={() => setOrderPlaced(false)}
                        >
                            Back to checkout
                        </Button>

                        <Button variant="outline-asymmetric" size="lg">
                            View order
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="wrapper py-6 md:py-10">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Cart</span>

                    <ChevronRight className="size-4" />

                    <span className="font-medium text-foreground">
                        Checkout
                    </span>
                </div>

                <div className="mt-5">
                    <p className="text-sm font-semibold tracking-wider text-primary uppercase">
                        Secure checkout
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                        Complete your order
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                        Confirm your delivery details, choose your payment
                        method, and review your order before placing it.
                    </p>
                </div>
            </div>

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="space-y-6">
                    {/* Delivery Address */}
                    <section className="border border-border bg-card p-5 md:p-6">
                        <SectionHeader
                            number="01"
                            icon={MapPin}
                            title="Delivery address"
                            description="Choose or update the address where your order will be delivered."
                        />

                        {savedAddress ? (
                            <SavedAddress
                                address={savedAddress}
                                onEdit={handleOpenAddressModal}
                            />
                        ) : (
                            <button
                                type="button"
                                onClick={handleOpenAddressModal}
                                className="flex w-full items-center gap-4 border border-dashed border-border bg-background p-5 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <MapPin className="size-5" />
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        Add delivery address
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Enter the address where you want your
                                        cake delivered.
                                    </p>
                                </div>

                                <ChevronRight className="ml-auto size-5 text-muted-foreground" />
                            </button>
                        )}
                    </section>

                    {/* Payment */}
                    <section className="border border-border bg-card p-5 md:p-6">
                        <SectionHeader
                            number="02"
                            icon={CreditCard}
                            title="Payment method"
                            description="Select one payment method to continue."
                        />

                        <div className="grid gap-3 md:grid-cols-2">
                            <PaymentCard
                                value="online"
                                selected={paymentMethod === "online"}
                                onSelect={setPaymentMethod}
                                icon={CreditCard}
                                title="Online payment"
                                description="Pay securely using MyFatoorah."
                            />

                            <PaymentCard
                                value="cash_on_delivery"
                                selected={
                                    paymentMethod === "cash_on_delivery"
                                }
                                onSelect={setPaymentMethod}
                                icon={Wallet}
                                title="Cash on delivery"
                                description="Pay when your order arrives."
                            />
                        </div>

                        {!paymentMethod && (
                            <p className="mt-3 text-xs text-muted-foreground">
                                Please select a payment method before placing
                                your order.
                            </p>
                        )}
                    </section>

                    {/* Order Review */}
                    <section className="border border-border bg-card p-5 md:p-6">
                        <SectionHeader
                            number="03"
                            icon={ShoppingBag}
                            title="Order review"
                            description="Check your cakes and extras before placing the order."
                        />

                        <div className="space-y-3">
                            {demoOrderItems.map((item) => (
                                <OrderItem
                                    key={item.id}
                                    imageUrl={item.imageUrl}
                                    name={item.name.en}
                                    quantity={item.quantity}
                                    price={item.price}
                                />
                            ))}
                        </div>

                        {demoAddOns.length > 0 && (
                            <div className="mt-6 border-t border-border pt-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="font-semibold">
                                        Add-ons
                                    </h3>

                                    <span className="text-xs text-muted-foreground">
                                        {demoAddOns.length} extras
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {demoAddOns.map((item) => (
                                        <OrderItem
                                            key={item.id}
                                            name={item.name.en}
                                            quantity={item.quantity}
                                            price={item.price}
                                            compact
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Summary */}
                <aside className="xl:sticky xl:top-24">
                    <div className="border border-border bg-card p-5 md:p-6">
                        <div className="mb-6">
                            <p className="text-sm font-semibold tracking-wider text-primary uppercase">
                                Your order
                            </p>

                            <h2 className="mt-1 text-xl font-bold">
                                Order summary
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {demoOrderItems.map((item) => (
                                <SummaryItem
                                    key={item.id}
                                    name={item.name.en}
                                    quantity={item.quantity}
                                    price={item.price}
                                />
                            ))}

                            {demoAddOns.map((item) => (
                                <SummaryItem
                                    key={item.id}
                                    name={item.name.en}
                                    quantity={item.quantity}
                                    price={item.price}
                                />
                            ))}
                        </div>

                        <div className="my-5 border-t border-border" />

                        <div className="space-y-3">
                            <SummaryRow
                                label="Subtotal"
                                value={formatPrice(subtotal)}
                            />

                            <SummaryRow
                                label="Discount"
                                value={
                                    discount > 0
                                        ? `-${formatPrice(discount)}`
                                        : formatPrice(0)
                                }
                            />

                            <SummaryRow
                                label="Delivery"
                                value={
                                    deliveryFee === 0
                                        ? "Free"
                                        : formatPrice(deliveryFee)
                                }
                            />
                        </div>

                        <div className="my-5 border-t border-border" />

                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {formatPrice(totalPrice)}
                                </p>
                            </div>

                            <span className="text-xs text-muted-foreground">
                                KWD
                            </span>
                        </div>

                        <Button
                            variant="asymmetric"
                            size="lg"
                            className="mt-6 h-11 w-full text-sm"
                            disabled={!savedAddress || !paymentMethod}
                            onClick={handlePlaceOrder}
                        >
                            {paymentMethod === "online"
                                ? "Continue to payment"
                                : "Place order"}

                            <ChevronRight className="size-4" />
                        </Button>

                        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                            By placing your order, you agree to our terms and
                            delivery policy.
                        </p>
                    </div>
                </aside>
            </div>

            {/* Address Modal */}
            <AddressModal
                open={isAddressModalOpen}
                onOpenChange={setIsAddressModalOpen}
                address={address}
                onChange={updateAddress}
                onSave={handleSaveAddress}
                governorates={governorates}
                hasSavedAddress={Boolean(savedAddress)}
            />
        </main>
    );
};

const SectionHeader = ({
    number,
    icon: Icon,
    title,
    description,
}) => {
    return (
        <div className="mb-6 flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4" />
            </div>

            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary">
                        {number}
                    </span>

                    <h2 className="text-lg font-bold">{title}</h2>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
};

const SavedAddress = ({ address, onEdit }) => {
    return (
        <div className="border border-primary/20 bg-primary/5 p-4 md:p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3.5" />
                        </div>

                        <p className="text-sm font-semibold">
                            Saved delivery address
                        </p>
                    </div>

                    <div className="mt-4 space-y-1.5 text-sm">
                        <p className="font-semibold">{address.fullName}</p>

                        <p
                            dir="ltr"
                            className="text-left text-muted-foreground"
                        >
                            {address.phone}
                        </p>

                        <p className="leading-relaxed text-muted-foreground">
                            {address.area}, {address.block}, {address.street}
                        </p>

                        <p className="leading-relaxed text-muted-foreground">
                            Building {address.building}
                            {address.floor && `, Floor ${address.floor}`}
                            {address.apartmentNo &&
                                `, Apartment ${address.apartmentNo}`}
                            , {address.governorate}
                        </p>

                        {address.notes && (
                            <p className="pt-1 text-xs text-muted-foreground">
                                Note: {address.notes}
                            </p>
                        )}
                    </div>
                </div>

                <Button
                    variant="outline-asymmetric"
                    size="sm"
                    className="shrink-0 gap-2"
                    onClick={onEdit}
                >
                    <Pencil className="size-3.5" />
                    Edit address
                </Button>
            </div>
        </div>
    );
};

const AddressModal = ({
    open,
    onOpenChange,
    address,
    onChange,
    onSave,
    governorates,
    hasSavedAddress,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] !max-w-3xl max-h-[90vh] overflow-y-auto p-5 md:p-6">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-xl">
                        {hasSavedAddress
                            ? "Edit delivery address"
                            : "Add delivery address"}
                    </DialogTitle>

                    <DialogDescription>
                        {hasSavedAddress
                            ? "Update your saved address. The new address will replace the existing one."
                            : "Enter the address where you want your order delivered."}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-2 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField label="Full name" required>
                            <Input
                                value={address.fullName || ""}
                                onChange={(event) =>
                                    onChange("fullName", event.target.value)
                                }
                                placeholder="Enter your full name"
                            />
                        </FormField>

                        <FormField label="Phone number" required>
                            <Input
                                dir="ltr"
                                className="text-left"
                                value={address.phone || ""}
                                onChange={(event) =>
                                    onChange("phone", event.target.value)
                                }
                                placeholder="+965 5XXXXXXX"
                            />
                        </FormField>

                        <FormField label="Governorate" required>
                            <Select
                                value={address.governorate || ""}
                                onValueChange={(value) =>
                                    onChange("governorate", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select governorate" />
                                </SelectTrigger>

                                <SelectContent>
                                    {governorates.map((governorate) => (
                                        <SelectItem
                                            key={governorate}
                                            value={governorate}
                                        >
                                            {governorate}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Area" required>
                            <Input
                                value={address.area || ""}
                                onChange={(event) =>
                                    onChange("area", event.target.value)
                                }
                                placeholder="e.g. Salmiya"
                            />
                        </FormField>

                        <FormField label="Block" required>
                            <Input
                                value={address.block || ""}
                                onChange={(event) =>
                                    onChange("block", event.target.value)
                                }
                                placeholder="Block number"
                            />
                        </FormField>

                        <FormField label="Street" required>
                            <Input
                                value={address.street || ""}
                                onChange={(event) =>
                                    onChange("street", event.target.value)
                                }
                                placeholder="Street name"
                            />
                        </FormField>

                        <FormField label="Building" required>
                            <Input
                                value={address.building || ""}
                                onChange={(event) =>
                                    onChange("building", event.target.value)
                                }
                                placeholder="Building number"
                            />
                        </FormField>

                        <FormField label="Floor">
                            <Input
                                value={address.floor || ""}
                                onChange={(event) =>
                                    onChange("floor", event.target.value)
                                }
                                placeholder="Optional"
                            />
                        </FormField>

                        <FormField label="Apartment number">
                            <Input
                                value={address.apartmentNo || ""}
                                onChange={(event) =>
                                    onChange("apartmentNo", event.target.value)
                                }
                                placeholder="Optional"
                            />
                        </FormField>
                    </div>

                    <FormField label="Delivery notes">
                        <Textarea
                            value={address.notes || ""}
                            onChange={(event) =>
                                onChange("notes", event.target.value)
                            }
                            placeholder="Any instructions for the delivery driver?"
                            className="min-h-24 resize-none"
                            maxLength={300}
                        />
                    </FormField>

                    <div className="flex flex-col-reverse gap-2 pt-2 md:flex-row md:justify-end">
                        <Button
                            type="button"
                            variant="outline-asymmetric"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="asymmetric"
                            onClick={onSave}
                        >
                            <Check className="size-4" />
                            Save address
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const FormField = ({ label, required, children }) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">
                {label}

                {required && (
                    <span className="ml-1 text-destructive">*</span>
                )}
            </label>

            {children}
        </div>
    );
};

const PaymentCard = ({
    value,
    selected,
    onSelect,
    icon: Icon,
    title,
    description,
}) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(value)}
            className={`relative flex min-h-28 w-full items-start gap-3 border p-4 text-left transition-colors ${
                selected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/30 hover:bg-muted/40"
            }`}
        >
            <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                    selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                }`}
            >
                <Icon className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{title}</p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>

            <div
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
                    selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                }`}
            >
                {selected && <Check className="size-3" />}
            </div>
        </button>
    );
};

const OrderItem = ({
    imageUrl,
    name,
    quantity,
    price,
    compact = false,
}) => {
    return (
        <div className="flex items-center gap-3 border border-border bg-background p-3">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={name}
                    className={`shrink-0 object-cover ${
                        compact ? "size-12" : "size-16"
                    }`}
                />
            )}

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{name}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                    {quantity} × {formatPrice(price)}
                </p>
            </div>

            <p className="shrink-0 text-sm font-semibold">
                {formatPrice(price * quantity)}
            </p>
        </div>
    );
};

const SummaryItem = ({ name, quantity, price }) => {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <div className="min-w-0">
                <p className="font-medium">{name}</p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                    {quantity} × {formatPrice(price)}
                </p>
            </div>

            <p className="shrink-0 font-semibold">
                {formatPrice(price * quantity)}
            </p>
        </div>
    );
};

const SummaryRow = ({ label, value }) => {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>

            <span className="font-medium">{value}</span>
        </div>
    );
};

export default Checkout;