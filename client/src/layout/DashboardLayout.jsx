import {
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Settings,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
    {
        label: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
        end: true,
    },
    {
        label: "My Orders",
        to: "/dashboard/orders",
        icon: Package,
    },
    {
        label: "Profile",
        to: "/dashboard/profile",
        icon: User,
    },
    {
        label: "Settings",
        to: "/dashboard/settings",
        icon: Settings,
    },
];

const getGreeting = (hour) => {
    if (hour >= 5 && hour < 12) {
        return "Good morning";
    }

    if (hour >= 12 && hour < 17) {
        return "Good afternoon";
    }

    if (hour >= 17 && hour < 21) {
        return "Good evening";
    }

    return "Good night";
};

const DashboardLayout = () => {
    const [open, setOpen] = useState(false);
    const [greeting, setGreeting] = useState(() =>
        getGreeting(new Date().getHours()),
    );

    useEffect(() => {
        const updateGreeting = () => {
            setGreeting(getGreeting(new Date().getHours()));
        };

        updateGreeting();

        const interval = setInterval(updateGreeting, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="flex min-h-screen w-full">
                {/* Desktop Sidebar */}
                <aside className="hidden w-64 shrink-0 border-r bg-background lg:flex lg:flex-col">
                    <div className="flex h-20 shrink-0 items-center px-6">
                        <NavLink
                            to="/"
                            className="text-xl font-bold tracking-tight"
                        >
                            Crown <span className="text-primary">Kwt</span>
                        </NavLink>
                    </div>

                    <Separator />

                    <div className="px-5 pt-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Account
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                            {greeting}
                        </p>
                    </div>

                    <nav className="flex-1 space-y-1 px-4 pt-5">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`
                                    }
                                >
                                    <Icon className="size-[18px] shrink-0" />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="shrink-0 p-4">
                        <Separator className="mb-4" />

                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl px-4 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            <LogOut className="size-[18px]" />
                            Logout
                        </Button>
                    </div>
                </aside>

                {/* Main Area */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Mobile Header */}
                    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur lg:hidden">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl"
                                >
                                    <Menu className="size-5" />
                                    <span className="sr-only">
                                        Open dashboard menu
                                    </span>
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="left"
                                className="flex w-72 flex-col p-0"
                            >
                                <SheetHeader className="border-b px-6 py-6 text-left">
                                    <SheetTitle>
                                        <NavLink
                                            to="/"
                                            onClick={() => setOpen(false)}
                                            className="text-xl font-bold tracking-tight"
                                        >
                                            Crown{" "}
                                            <span className="text-primary">
                                                Kwt
                                            </span>
                                        </NavLink>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="px-5 pt-6">
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Account
                                    </p>

                                    <p className="mt-2 text-sm font-semibold">
                                        {greeting}
                                    </p>
                                </div>

                                <nav className="flex-1 space-y-1 p-4 pt-5">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                end={item.end}
                                                onClick={() => setOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                                                        isActive
                                                            ? "bg-primary text-primary-foreground shadow-sm"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    }`
                                                }
                                            >
                                                <Icon className="size-[18px] shrink-0" />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        );
                                    })}
                                </nav>

                                <div className="p-4">
                                    <Separator className="mb-4" />

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full justify-start gap-3 rounded-xl px-4 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        <LogOut className="size-[18px]" />
                                        Logout
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="ml-3">
                            <NavLink
                                to="/"
                                className="text-lg font-bold tracking-tight"
                            >
                                Crown <span className="text-primary">Kwt</span>
                            </NavLink>

                            <p className="text-xs text-muted-foreground">
                                {greeting}
                            </p>
                        </div>
                    </header>

                    <main className="min-w-0 flex-1">{<Outlet />}</main>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;