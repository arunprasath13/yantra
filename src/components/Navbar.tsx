import { SearchOutlined, BellOutlined, QuestionCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Avatar, Dropdown, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import useAutheStore from "../store/useAutheStore";
import { toast } from "react-toastify";
import svg from "../assets/react.svg";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAutheStore(); 

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully!");
        setTimeout(() => navigate("/login"), 1500);
    };

    
    const items: MenuProps["items"] = [
        {
            key: "0",
            label: (
                <div className="flex items-center gap-2">
                    <span>{user?.email || "No Email"}</span>
                    <span className="text-green-500 font-bold">🟢</span>
                </div>
            ),
            disabled: true, 
        },
       
        {
            key: "1",
            label: "Logout",
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <nav className="bg-white shadow p-4 flex justify-end items-center">
            <div className="flex gap-3 items-center">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <SearchOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
                <BellOutlined style={{ cursor: "pointer" }} />
                <Button icon={<QuestionCircleOutlined />}  type="default" style={{ cursor: "pointer" }}>
                    Help
                </Button>

                
                <Dropdown menu={{ items }} trigger={["click"]} >
                    <Avatar src={svg} style={{ cursor: "pointer"}} />
                </Dropdown>
            </div>
        </nav>
    );
};

export default Navbar;
