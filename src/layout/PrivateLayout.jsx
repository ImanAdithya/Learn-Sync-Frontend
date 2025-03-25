import { SideBar } from "../components/SideBar.jsx";
import { Header } from "../components/Header.jsx";
import { Outlet } from "react-router-dom";

export const PrivateLayout = () => {
    return (
        <div className="flex w-full h-screen">
            <SideBar />

            <div className="flex flex-col flex-1 h-screen">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
