import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import {
    Bell,
    Cake,
    ChevronDown,
    LayoutDashboard,
    Menu,
    Settings,
    ShoppingBag,
    Tags,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigationGroups = [
    {
        title: "Orders",
        icon: ShoppingBag,
        items: [
            { title: "All Orders", path: "/admin/orders" },
            { title: "Pending", path: "/admin/orders/pending" },
            { title: "Processing", path: "/admin/orders/processing" },
            { title: "Completed", path: "/admin/orders/completed" },
        ],
    },
    {
        title: "Cakes",
        icon: Cake,
        items: [
            { title: "All Cakes", path: "/admin/cakes" },
            { title: "Add Cake", path: "/admin/cakes/add" },
        ],
    },
    {
        title: "Categories",
        icon: Tags,
        items: [
            { title: "All Categories", path: "/admin/categories" },
            { title: "Add Category", path: "/admin/categories/add" },
        ],
    },
];

const simpleNavigation = [
    {
        title: "Customers",
        path: "/admin/customers",
        icon: Users,
    },
    {
        title: "Settings",
        path: "/admin/settings",
        icon: Settings,
    },
];

function SidebarContent({ collapsed = false, onNavigate }) {
    const location = useLocation();

    const isGroupActive = (items) =>
        items.some((item) => {
            return (
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`)
            );
        });

    return (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div
                className={`flex h-20 items-center border-b px-5 ${
                    collapsed ? "justify-center px-2" : "justify-start"
                }`}
            >
                <NavLink
                    to="/"
                    onClick={onNavigate}
                    className="flex items-center gap-3"
                >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-tl-2xl rounded-br-2xl bg-primary text-primary-foreground">
                        <Cake className="size-5" />
                    </div>

                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="font-semibold leading-none tracking-tight">
                                Crown Kwt
                            </span>

                            <span className="mt-1 text-xs text-muted-foreground">
                                Admin Panel
                            </span>
                        </div>
                    )}
                </NavLink>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-5">
                <div className="space-y-2">
                    {/* Dashboard */}
                    <NavLink
                        to="/admin"
                        onClick={onNavigate}
                        end
                        className={({ isActive }) =>
                            `group flex h-11 items-center rounded-xl transition-colors ${
                                collapsed ? "justify-center px-0" : "gap-3 px-3"
                            } ${
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`
                        }
                    >
                        <LayoutDashboard className="size-5 shrink-0" />

                        {!collapsed && (
                            <span className="text-sm font-medium">
                                Dashboard
                            </span>
                        )}
                    </NavLink>

                    {/* Dropdown Groups */}
                    {navigationGroups.map((group) => {
                        const Icon = group.icon;
                        const active = isGroupActive(group.items);

                        {
                            /* Collapsed Sidebar */
                        }
                        if (collapsed) {
                            return (
                                <div
                                    key={group.title}
                                    className="group relative flex h-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <Icon className="size-5" />

                                    <div className="pointer-events-none absolute left-[calc(100%+10px)] z-50 hidden w-44 rounded-xl border bg-background p-2 shadow-lg group-hover:pointer-events-auto group-hover:block">
                                        <p className="px-2 py-2 text-xs font-semibold text-muted-foreground">
                                            {group.title}
                                        </p>

                                        {group.items.map((item) => (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                onClick={onNavigate}
                                                end
                                                className={({ isActive }) =>
                                                    `block rounded-lg px-2 py-2 text-sm ${
                                                        isActive
                                                            ? "bg-primary text-primary-foreground"
                                                            : "hover:bg-muted"
                                                    }`
                                                }
                                            >
                                                {item.title}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        {
                            /* Expanded Sidebar */
                        }
                        return (
                            <Collapsible
                                key={group.title}
                                defaultOpen={active}
                                className="w-full"
                            >
                                <CollapsibleTrigger
                                    className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors ${
                                        active
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    <Icon className="size-5 shrink-0" />

                                    <span className="flex-1 text-sm font-medium">
                                        {group.title}
                                    </span>

                                    <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <div className="ml-5 mt-1 space-y-1 border-l pl-3">
                                        {group.items.map((item) => (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                onClick={onNavigate}
                                                end
                                                className={({ isActive }) =>
                                                    `flex min-h-9 items-center rounded-lg px-3 text-sm transition-colors ${
                                                        isActive
                                                            ? "bg-primary text-primary-foreground"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    }`
                                                }
                                            >
                                                {item.title}
                                            </NavLink>
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })}

                    {/* Simple Navigation */}
                    <div className="pt-2">
                        {simpleNavigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onNavigate}
                                    end
                                    className={({ isActive }) =>
                                        `group flex h-11 items-center rounded-xl transition-colors ${
                                            collapsed
                                                ? "justify-center px-0"
                                                : "gap-3 px-3"
                                        } ${
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`
                                    }
                                >
                                    <Icon className="size-5 shrink-0" />

                                    {!collapsed && (
                                        <span className="text-sm font-medium">
                                            {item.title}
                                        </span>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t p-3">
                {!collapsed && (
                    <div className="rounded-xl bg-muted/60 p-3">
                        <p className="text-xs font-medium">Crown Kwt Admin</p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Manage your store
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminDashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Desktop Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 hidden border-r bg-background transition-all duration-300 lg:block ${
                    collapsed ? "w-20" : "w-64"
                }`}
            >
                <SidebarContent collapsed={collapsed} />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <SidebarContent onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Main */}
            <div
                className={`min-h-screen transition-all duration-300 ${
                    collapsed ? "lg:pl-20" : "lg:pl-64"
                }`}
            >
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-20 items-center border-b bg-background/95 px-4 backdrop-blur md:px-6">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu */}
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden"
                                >
                                    <Menu className="size-5" />
                                </Button>
                            </SheetTrigger>
                        </Sheet>

                        {/* Desktop Collapse */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden lg:flex"
                            onClick={() => setCollapsed((value) => !value)}
                        >
                            <Menu className="size-5" />
                        </Button>

                        <div>
                            <h1 className="text-lg font-semibold">
                                Admin Dashboard
                            </h1>

                            <p className="hidden text-xs text-muted-foreground sm:block">
                                Manage your Crown Kwt store
                            </p>
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                        >
                            <Bell className="size-5" />

                            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
