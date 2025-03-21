import { FaEnvelope, FaCalendarAlt, FaUser, FaCog } from "react-icons/fa";
import { MdOutlineMedicalServices } from "react-icons/md";
import { BsClipboardCheck, BsFileText } from "react-icons/bs";
import { RocketOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";


const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-white shadow-md fixed top-0 left-0 overflow-y-auto">

            <div className="flex items-center space-x-2 mb-6 shadow " style={{ padding: "20px 5px" }}>
                <RocketOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                <h1 className="text-lg font-bold text-blue-900">Yantra Labs</h1>
            </div>
            <nav className="space-y-6 flex-grow">
                <div>
                    <h2 style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "rgb(51,51,51)", display: "block" }}>Quick Access</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <FaEnvelope /> <span>Inbox</span>
                        </li>
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <FaCalendarAlt /> <span>Calendar</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "rgb(51,51,51)", display: "block" }}>Sales Force Management</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <MdOutlineMedicalServices /> <span>Visit Manager</span>
                        </li>
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <BsClipboardCheck /> <span>Doctor List</span>
                        </li>
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <FaCalendarAlt /> <span>Expense Claim</span>
                        </li>
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <BsFileText /> <span>Contents</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "rgb(51,51,51)", display: "block" }}>Human Resource</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <FaUser /> <span>Users</span>
                        </li>
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <FaCalendarAlt /> <span>Payroll</span>
                        </li>
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <FaCalendarAlt /> <span>Reimbursement</span>
                        </li>
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <BsFileText /> <span>Letters</span>
                        </li>
                        <li className="flex items-center space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition" style={{ padding: "12px 16px 12px 32px" }}>
                            <FaCalendarAlt /> <span>Leave Management</span>
                        </li>
                    </ul>
                </div>
            </nav>
            <Link to="/configuration">
                <div className="flex mt-40 space-x-2 px-4 text-sm text-gray-800 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-100 transition justify-between" style={{ paddingTop: "12px", paddingBottom: "12px", borderTop: "2px solid black" }}>
                    <div className="flex items-center space-x-2">
                        <span>Configuration</span>
                    </div>
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <FaCog />

                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Sidebar;