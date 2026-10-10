import { Cake, ShoppingBag, Tags, Users } from "lucide-react";

const stats = [
    {
        title: "Total Orders",
        value: "0",
        icon: ShoppingBag,
    },
    {
        title: "Products",
        value: "0",
        icon: Cake,
    },
    {
        title: "Categories",
        value: "0",
        icon: Tags,
    },
    {
        title: "Customers",
        value: "0",
        icon: Users,
    },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                    Dashboard
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Overview of your Crown Kwt store.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-2xl border bg-background p-5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {stat.title}
                                    </p>

                                    <p className="mt-2 text-2xl font-semibold">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Icon className="size-5" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
