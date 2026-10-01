import {
    Check,
    Clock3,
    MapPin,
    Package,
    Search,
    Truck,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const trackingSteps = [
    {
        title: "Order placed",
        description: "Your order has been received.",
        date: "September 26, 2026 · 10:24 AM",
        completed: true,
        icon: Check,
    },
    {
        title: "Order confirmed",
        description: "Your order has been confirmed.",
        date: "September 26, 2026 · 10:31 AM",
        completed: true,
        icon: Check,
    },
    {
        title: "Preparing your order",
        description: "Your cakes are being prepared.",
        date: "September 26, 2026 · 11:05 AM",
        completed: true,
        icon: Package,
    },
    {
        title: "Out for delivery",
        description: "Your order is on its way.",
        date: "Expected today",
        current: true,
        icon: Truck,
    },
    {
        title: "Delivered",
        description: "Your order will be delivered to you.",
        date: "Pending",
        icon: MapPin,
    },
];

const OrderTracking = () => {
    const [orderId, setOrderId] = useState("");
    const [searchedOrder, setSearchedOrder] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const value = orderId.trim();

        if (!value) {
            return;
        }

        setSearchedOrder(value);
    };

    return (
        <div className="min-h-[70vh] px-5 py-12 sm:px-7 lg:px-9 lg:py-16">
            <div className="mx-auto max-w-3xl">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold text-primary">
                        Order tracking
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Track your Crown Kwt order
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                        Enter your order number below to see the latest status
                        of your delivery.
                    </p>
                </div>

                <Card className="mt-8 rounded-2xl border bg-background shadow-sm">
                    <CardContent className="p-5 sm:p-6">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-3 sm:flex-row"
                        >
                            <Input
                                value={orderId}
                                onChange={(event) =>
                                    setOrderId(event.target.value)
                                }
                                placeholder="Enter order ID, e.g. CK-1024"
                                className="h-12 rounded-xl"
                            />

                            <Button
                                type="submit"
                                className="h-12 rounded-xl px-6"
                            >
                                <Search className="mr-2 size-4" />
                                Track order
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {searchedOrder && (
                    <Card className="mt-6 rounded-2xl border bg-background shadow-sm">
                        <CardContent className="p-5 sm:p-7">
                            <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Order
                                    </p>

                                    <h2 className="mt-1 text-xl font-bold">
                                        #{searchedOrder}
                                    </h2>
                                </div>

                                <Badge className="w-fit rounded-lg bg-primary/10 px-3 py-1.5 text-primary hover:bg-primary/10">
                                    On the way
                                </Badge>
                            </div>

                            <div className="pt-7">
                                {trackingSteps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isLast =
                                        index === trackingSteps.length - 1;

                                    return (
                                        <div
                                            key={step.title}
                                            className="relative flex gap-4"
                                        >
                                            {!isLast && (
                                                <div
                                                    className={`absolute left-5 top-10 h-[calc(100%-8px)] w-px ${
                                                        step.completed
                                                            ? "bg-primary"
                                                            : "bg-border"
                                                    }`}
                                                />
                                            )}

                                            <div
                                                className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border ${
                                                    step.completed
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : step.current
                                                          ? "border-primary bg-primary/10 text-primary"
                                                          : "border-border bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                <Icon className="size-4" />
                                            </div>

                                            <div
                                                className={`min-w-0 flex-1 ${
                                                    isLast ? "pb-0" : "pb-8"
                                                }`}
                                            >
                                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                    <h3
                                                        className={`text-sm font-semibold ${
                                                            step.current
                                                                ? "text-primary"
                                                                : ""
                                                        }`}
                                                    >
                                                        {step.title}
                                                    </h3>

                                                    <span className="text-xs text-muted-foreground">
                                                        {step.date}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-7 flex items-start gap-3 rounded-xl bg-muted/60 p-4">
                                <Clock3 className="mt-0.5 size-4 shrink-0 text-primary" />

                                <div>
                                    <p className="text-sm font-semibold">
                                        Estimated delivery
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Your order is currently on the way.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;