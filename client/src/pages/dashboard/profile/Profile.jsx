import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
    return (
        <div className="p-5 sm:p-7 lg:p-9">
            <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-primary">
                    Account
                </p>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    My profile
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Manage your personal information and keep your account
                    details up to date.
                </p>
            </div>

            <Card className="max-w-2xl rounded-2xl border bg-background shadow-none">
                <CardHeader className="px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <User className="size-5" />
                        </div>

                        <div>
                            <CardTitle className="text-lg">
                                Personal information
                            </CardTitle>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Update your personal account details.
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-5 pb-6 sm:px-6">
                    <form className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full name</Label>

                            <Input
                                id="name"
                                type="text"
                                placeholder="Your full name"
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="Your email address"
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone number</Label>

                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+965 XXXXXXXX"
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <Button type="submit" className="rounded-xl">
                            Save changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;