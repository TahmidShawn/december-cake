import { ArrowUpRight, Package } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const orders = [
    {
        id: "CK-1024",
        date: "September 26, 2026",
        status: "Delivered",
        total: "18.500",
        items: 2,
    },
    {
        id: "CK-1021",
        date: "September 24, 2026",
        status: "On the way",
        total: "12.000",
        items: 1,
    },
    {
        id: "CK-1018",
        date: "September 20, 2026",
        status: "Delivered",
        total: "24.000",
        items: 3,
    },
];

const Orders = () => {
    return (
        <div className="p-5 sm:p-7 lg:p-9">
            <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-primary">
                    Account
                </p>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    My orders
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    View your previous purchases and follow the progress of
                    current orders.
                </p>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Card
                        key={order.id}
                        className="rounded-2xl border bg-background shadow-none transition-all hover:border-primary/30 hover:shadow-sm"
                    >
                        <CardContent className="p-5 sm:p-6">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Package className="size-5" />
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold">
                                                Order #{order.id}
                                            </p>

                                            <Badge
                                                variant="secondary"
                                                className={
                                                    order.status === "Delivered"
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-amber-500/10 text-amber-600"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>

                                        <p className="mt-1.5 text-sm text-muted-foreground">
                                            Placed on {order.date}
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {order.items}{" "}
                                            {order.items === 1
                                                ? "item"
                                                : "items"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-5 border-t pt-4 lg:border-0 lg:pt-0">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Order total
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            KWD {order.total}
                                        </p>
                                    </div>

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="rounded-xl"
                                    >
                                        <Link
                                            to={`/dashboard/orders/${order.id}`}
                                        >
                                            View order
                                            <ArrowUpRight className="ml-2 size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Orders;