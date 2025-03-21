import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ConfigItemProps } from "../../types/ConfigItemTypes";

const ConfigItem: React.FC<ConfigItemProps> = ({ icon, label, path }) => {
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <Link
            to={path || "#"}
            className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-800 hover:bg-gray-100"}`}
        >
            <span className={`${isActive ? "text-blue-700" : "text-gray-600"}`}>{icon}</span>
            <p>{label}</p>
        </Link>
    );
};

export default ConfigItem;
