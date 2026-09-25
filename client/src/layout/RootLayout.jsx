import Navbar from "@/components/shared/navbar/Navbar";
import { Outlet } from "react-router";

const RootLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;
