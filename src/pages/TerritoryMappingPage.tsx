import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Button, Dropdown, Menu, Input, Row, Col, Select, Switch } from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    UploadOutlined,
    DownloadOutlined,
    DownOutlined,
    UnorderedListOutlined,
    CheckSquareOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../layouts/DashboardLayout";
import { TerritoryMappingType } from "../types/TerritoryMappingType";
import TerritoryMappingTable from "../components/TerritoryMapping/TerritoryMappingTable";
import axios from "axios";
import { toast } from "react-toastify"; 

const { Option } = Select;

const menu = (
    <Menu>
        <Menu.Item key="1">Action 1</Menu.Item>
        <Menu.Item key="2">Action 2</Menu.Item>
    </Menu>
);

const TerritoryMappingPage = () => {
    const location = useLocation();
    const { entityType } = useParams<{ entityType: string }>();
    const [data, setData] = useState<TerritoryMappingType[]>([]);
    const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
    const [filteredData, setFilteredData] = useState<TerritoryMappingType[]>([]);
    const [status, setStatus] = useState<boolean | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [country, setCountry] = useState<string | null>(null);
    const [state, setState] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/territory-mappings");
                const result = response.data;

                const mappedData: TerritoryMappingType[] = result.map((item: any) => ({
                    _id: item._id,
                    code: item.territoryCode,
                    name: item.territoryName,
                    district: item.district,
                    territoryManager: item.territoryManager,
                    executive: item.executive,
                    createdBy: item.createdBy,
                    createdOn: item.createdOn,
                    status: item.isActive, 
                    country: item.country,
                    state: item.state,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                }));
                console.log("Mapped territories:", mappedData);
                setData(mappedData);
                setFilteredData(mappedData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load territory mappings");
            }
        };
        fetchData();
    }, [location]);

    useEffect(() => {
        let filtered = [...data]; 

        if (country) {
            filtered = filtered.filter(
                (entity) => entity.country?.toLowerCase() === country.toLowerCase()
            );
        }

        if (state) {
            console.log("state: ", state);
            filtered = filtered.filter(
                (entity) => entity.state?.toLowerCase() === state.toLowerCase()
            );
        }

        if (district) {
            filtered = filtered.filter(
                (entity) => entity.district?.toLowerCase() === district.toLowerCase()
            );
        }

        if (status !== null) {
            filtered = filtered.filter((entity) => entity.status === status);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (entity) =>
                    (entity.code ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (entity.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (entity.territoryManager ?? "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (entity.executive ?? "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        console.log("Filtered data:", filtered);
        setFilteredData(filtered);
    }, [data, country, state, district, status, searchTerm]);

    const toggleCheckbox = (_id: string) => {
        setSelectedEntities((prev) =>
            prev.includes(_id) ? prev.filter((entityId) => entityId !== _id) : [...prev, _id]
        );
    };

    const toggleActive = async (_id: string) => {
        try {
            
            const entity = data.find((item) => item._id === _id);
            if (!entity) return;

            const newStatus = !entity.status;

            
            await axios.put(`http://localhost:4000/api/territory-mappings/${_id}`, {
                ...entity,
                isActive: newStatus, 
                status: undefined,
            });

           
            setData((prevData) =>
                prevData.map((entity) =>
                    entity._id === _id ? { ...entity, status: newStatus } : entity
                )
            );

            toast.success("Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const countries = ["India"];
    const states = ["Tamil Nadu"];
    const districts = ["Tirunelveli", "Chennai", "Madurai"];

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-5">
                <div className="text-center sm:text-left mb-3 sm:mb-0">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#173E73] capitalize">
                        {entityType || "Territory"}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Home &gt; <Link to={"/configuration"}>Configuration</Link>
                    </p>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Button
                            className="bg-[#173E73] text-white flex items-center gap-2 w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base"
                        >
                            Actions <DownOutlined />
                        </Button>
                    </Dropdown>
                    <Button
                        className="bg-[#173E73] text-white flex items-center gap-2 w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base"
                    >
                        <DownloadOutlined /> Export Records
                    </Button>
                    <Button
                        className="bg-[#173E73] text-white flex items-center gap-2 w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base"
                    >
                        <UploadOutlined /> Import Records
                    </Button>
                    <Link to={`/add-territory-mapping`}>
                        <Button
                            type="primary"
                            className="bg-[#173E73] text-white flex items-center gap-2 w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base"
                        >
                            <PlusOutlined /> Add New {entityType || "Territory"}
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="p-2 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 shadow-md rounded-lg p-3 sm:p-4 md:p-5 gap-3 sm:gap-0">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <span className="font-semibold text-sm sm:text-base">Filter</span>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <span className="text-[#173E73] font-bold text-xs sm:text-sm">
                                Country
                            </span>
                            <Select
                                placeholder="India"
                                value={country}
                                onChange={(value) => setCountry(value)}
                                className="w-full sm:w-[150px]"
                                allowClear
                            >
                                {countries.map((c) => (
                                    <Option key={c} value={c}>
                                        {c}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <span className="text-[#173E73] font-bold text-xs sm:text-sm">
                                State
                            </span>
                            <Select
                                placeholder="Tamil Nadu"
                                value={state}
                                onChange={(value) => setState(value)}
                                className="w-full sm:w-[150px]"
                                allowClear
                            >
                                {states.map((s) => (
                                    <Option key={s} value={s}>
                                        {s}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <span className="text-[#173E73] font-bold text-xs sm:text-sm">
                                District
                            </span>
                            <Select
                                placeholder="Tirunelveli"
                                value={district}
                                onChange={(value) => setDistrict(value)}
                                className="w-full sm:w-[150px]"
                                allowClear
                            >
                                {districts.map((d) => (
                                    <Option key={d} value={d}>
                                        {d}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <span className="text-[#173E73] font-bold text-xs sm:text-sm">
                                Status
                            </span>
                            <Switch
                                checked={status === true}
                                onChange={(checked) => setStatus(checked ? true : null)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-[250px]">
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-10 h-9 sm:h-10 roundupd"
                            />
                            <div
                                className="absolute right-0 top-0 bottom-0 w-9 sm:w-10 bg-[#173E73] flex items-center justify-center rounded-r cursor-pointer"
                            >
                                <SearchOutlined className="text-white text-sm sm:text-base" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-5 mt-3 sm:mt-4 w-full">
                    <div className="flex justify-end mb-2">
                        <Row gutter={12}>
                            <Col>
                                <UnorderedListOutlined
                                    className="text-[#173E73] cursor-pointer text-lg sm:text-xl md:text-2xl"
                                />
                            </Col>
                            <Col>
                                <CheckSquareOutlined
                                    className="text-[#173E73] cursor-pointer text-lg sm:text-xl md:text-2xl"
                                />
                            </Col>
                        </Row>
                    </div>
                    <TerritoryMappingTable
                        entities={filteredData}
                        selectedEntities={selectedEntities}
                        toggleCheckbox={(_id: string) => toggleCheckbox(_id)}
                        toggleActive={toggleActive}
                        setSelectedEntities={setSelectedEntities}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TerritoryMappingPage;