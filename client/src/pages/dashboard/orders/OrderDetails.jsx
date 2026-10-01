import {
    ArrowLeft,
    Check,
    Clock3,
    MapPin,
    Package,
    Truck,
} from "lucide-react";
import { Link, useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
        description: "Your order has been confirmed by Crown Kwt.",
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
        description: "Your order is on its way to you.",
        date: "Expected today",
        completed: false,
        current: true,
        icon: Truck,
    },
    {
        title: "Delivered",
        description: "Your order will be delivered to your address.",
        date: "Pending",
        completed: false,
        icon: MapPin,
    },
];

const OrderDetails = () => {
    const { orderId } = useParams();

    return (
        <div className="p-5 sm:p-7 lg:p-9">
            <div className="mb-7">
                <Button
                    asChild
                    variant="ghost"
                    className="-ml-3 mb-4 rounded-xl text-muted-foreground"
                >
                    <Link to="/dashboard/orders">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to orders
                    </Link>
                </Button>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-semibold text-primary">
                            Order details
                        </p>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Order #{orderId}
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Placed on September 26, 2026
                        </p>
                    </div>

                    <Badge className="w-fit rounded-lg bg-primary/10 px-3 py-1.5 text-primary hover:bg-primary/10">
                        On the way
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                {/* Tracking */}
                <Card className="rounded-2xl border bg-background shadow-none">
                    <CardHeader className="px-5 py-5 sm:px-6">
                        <CardTitle className="text-lg">
                            Order tracking
                        </CardTitle>

                        <p className="text-sm text-muted-foreground">
                            Follow the progress of your order.
                        </p>
                    </CardHeader>

                    <CardContent className="px-5 pb-6 sm:px-6">
                        <div className="relative">
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
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <div className="space-y-6">
                    <Card className="rounded-2xl border bg-background shadow-none">
                        <CardHeader className="px-5 py-5">
                            <CardTitle className="text-lg">
                                Order summary
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-5 pb-5">
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Order number
                                    </span>

                                    <span className="font-medium">
                                        #{orderId}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Items
                                    </span>

                                    <span className="font-medium">2</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Delivery
                                    </span>

                                    <span className="font-medium">KWD 1.000</span>
                                </div>

                                <Separator />

                                <div className="flex justify-between gap-4">
                                    <span className="font-semibold">
                                        Total
                                    </span>

                                    <span className="font-bold">
                                        KWD 18.500
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border bg-background shadow-none">
                        <CardHeader className="px-5 py-5">
                            <CardTitle className="text-lg">
                                Delivery address
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-5 pb-5">
                            <div className="flex gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                    <MapPin className="size-4 text-muted-foreground" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium">
                                        Delivery address
                                    </p>

                                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                        Your saved delivery address will appear
                                        here.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border bg-primary text-primary-foreground shadow-none">
                        <CardContent className="p-5">
                            <div className="flex gap-3">
                                <Clock3 className="mt-0.5 size-5 shrink-0" />

                                <div>
                                    <p className="text-sm font-semibold">
                                        Estimated delivery
                                    </p>

                                    <p className="mt-1 text-sm opacity-80">
                                        Your order is currently on the way.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;