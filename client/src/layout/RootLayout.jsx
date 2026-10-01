import BottomBar from "@/components/shared/bottomBar/BottomBar";
import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import { Outlet } from "react-router";

const RootLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
            <BottomBar />
        </div>
    );
};

export default RootLayout;
