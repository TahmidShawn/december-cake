import { Outlet } from "react-router";

const RootLayout = () => {
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;
