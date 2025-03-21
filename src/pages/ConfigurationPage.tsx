import { Building, Users, Layers, UserCog, Bell, Download } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import ConfigItem from "../components/Configuration/ConfigItem";
const ConfigurationPage = () => {
    return (
        <DashboardLayout>
            <div className="bg-gray-50 min-h-screen p-10">

                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Configuration</h1>
                    <p className="text-gray-500">Home</p>
                </div>


                <div className="bg-white p-6 shadow-md rounded-lg">

                    <div>
                        <h2 className="font-semibold text-lg border-b pb-2" style={{ color: "#173E73" }}>Site Configurations</h2>
                        <div className="mt-4">
                            <h3 className="font-medium text-gray-700" style={{ color: "#173E73" }}>Setup</h3>
                            <div className="space-y-2 mt-2">
                                <ConfigItem icon={<Building size={20} />} label="Organisation" path={`/organisation/1`} />
                                <ConfigItem icon={<Building size={20} />} label="Branch / Campus" path={`/branch/2`} />
                                <ConfigItem icon={<Layers size={20} />} label="Departments" path={`/department/3`} />
                                <ConfigItem icon={<Users size={20} />} label="Teams" path={`/teams/4`} />
                            </div>
                        </div>
                    </div>


                    <div className="mt-6">
                        <h2 className="font-semibold text-lg border-b pb-2" style={{ color: "#173E73" }}>Human Resource</h2>
                        <div className="grid grid-cols-2 gap-6 mt-4">

                            <div>
                                <h3 className="font-medium text-gray-700" style={{ color: "#173E73" }}>General</h3>
                                <div className="space-y-2 mt-2">
                                    <ConfigItem icon={<UserCog size={20} />} label="Designation" path={`/designation/5`} />
                                    <ConfigItem icon={<Users size={20} />} label="Employee Group" path={`/employeeGroup/6`} />
                                    <ConfigItem icon={<Layers size={20} />} label="Employee Grade" path={`/employeeGrade/7`} />
                                    <ConfigItem icon={<UserCog size={20} />} label="Employee Type" path={`/employeeType/8`} />
                                </div>
                            </div>


                            <div>
                                <h3 className="font-medium" style={{ color: "#173E73" }}>Leave Management</h3>
                                <div className="space-y-2 mt-2">
                                    <ConfigItem icon={<Layers size={20} />} label="Leave Type" path={`/leaveType/9`} />
                                    <ConfigItem icon={<Layers size={20} />} label="Leave Rules" path={`/leaveRules/10`} />
                                    <ConfigItem icon={<Download size={20} />} label="Import Leave Data" path={`/import-leave-data/11`} />
                                    <ConfigItem icon={<Bell size={20} />} label="Notifications" path={`/notifications/12`} />
                                </div>
                            </div>



                            <div className="">
                                <h2 className="font-medium text-gray-700" style={{ color: "#173E73" }}>Hospital Management</h2>
                                <div className="space-y-2 mt-2">
                                    <ConfigItem icon={<Building size={20} />} label="Doctor Type" path={`/doctor-type/13`} />
                                    <ConfigItem icon={<Users size={20} />} label="Specialisation" path={`/specialisation/14`} />
                                    <ConfigItem icon={<Layers size={20} />} label="Category" path={`/category/15`} />
                                    <ConfigItem icon={<UserCog size={20} />} label="Engagement Mode" path={`/engagement-mode/16`} />
                                </div>
                            </div>
                            <div className="">
                                <h2 className="font-medium text-gray-700" style={{ color: "#173E73" }}>Salesforce Management</h2>
                                <div className="space-y-2 mt-2">
                                    <ConfigItem icon={<Building size={20} />} label="Territory Master" path={`/territory`} />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default ConfigurationPage;
