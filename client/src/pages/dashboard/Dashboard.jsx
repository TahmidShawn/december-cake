import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    Package,
    ShoppingBag,
    Truck,
} from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const statistics = [
    {
        title: "Total orders",
        value: "12",
        description: "All time orders",
        icon: ShoppingBag,
    },
    {
        title: "Processing",
        value: "2",
        description: "Currently preparing",
        icon: Clock3,
    },
    {
        title: "On the way",
        value: "1",
        description: "Out for delivery",
        icon: Truck,
    },
    {
        title: "Delivered",
        value: "9",
        description: "Successfully delivered",
        icon: CheckCircle2,
    },
];

const orders = [
    {
        id: "CK-1024",
        date: "September 26, 2026",
        status: "Delivered",
        total: "18.500",
    },
    {
        id: "CK-1021",
        date: "September 24, 2026",
        status: "On the way",
        total: "12.000",
    },
];

const Dashboard = () => {
    return (
        <div className="p-5 sm:p-7 lg:p-9">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-sm font-semibold text-primary">
                        Overview
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Your dashboard
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                        Keep an eye on your recent orders and account activity.
                    </p>
                </div>

                <Button
                    asChild
                    variant="outline"
                    className="w-fit rounded-xl"
                >
                    <Link to="/products">
                        Continue shopping
                        <ArrowUpRight className="ml-2 size-4" />
                    </Link>
                </Button>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statistics.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card
                            key={item.title}
                            className="rounded-2xl border bg-background shadow-none transition-shadow hover:shadow-sm"
                        >
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {item.title}
                                        </p>

                                        <p className="mt-2 text-2xl font-bold tracking-tight">
                                            {item.value}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Icon className="size-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Orders */}
            <Card className="mt-6 rounded-2xl border bg-background shadow-none">
                <CardHeader className="flex flex-col gap-3 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <CardTitle className="text-lg">
                            Recent orders
                        </CardTitle>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Your latest Crown Kwt purchases.
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-fit gap-1 rounded-lg"
                    >
                        <Link to="/dashboard/orders">
                            View all
                            <ArrowUpRight className="size-4" />
                        </Link>
                    </Button>
                </CardHeader>

                <CardContent className="px-5 py-1 sm:px-6">
                    {orders.map((order, index) => (
                        <div key={order.id}>
                            <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                                        <Package className="size-5 text-muted-foreground" />
                                    </div>

                                    <div>
                                        <p className="font-semibold">
                                            #{order.id}
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {order.date}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-5 sm:justify-end">
                                    <div>
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

                                        <p className="mt-2 text-sm font-semibold">
                                            KWD {order.total}
                                        </p>
                                    </div>

                                    <Button
                                        asChild
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <Link
                                            to={`/dashboard/orders/${order.id}`}
                                        >
                                            <ArrowUpRight className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {index < orders.length - 1 && <Separator />}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;