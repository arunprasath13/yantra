import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Button, Dropdown, Menu, Input, Switch} from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,

} from "@ant-design/icons";
import DashboardLayout from "../layouts/DashboardLayout";
import EntityTable from "../components/Entity/EntityTable";
import { Entity } from "../types/EntityTypes";

const menu = (
  <Menu>
    <Menu.Item key="1">Action 1</Menu.Item>
    <Menu.Item key="2">Action 2</Menu.Item>
  </Menu>
);

const EntityPage = () => {
  const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<Entity[]>([]);
  const [filteredData, setFilteredData] = useState<Entity[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [status, setStatus] = useState<boolean | null>(null);

  const fetchData = async () => {
    if (entityId) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_CONFIGURATION_URL}/api/entities/${entityId}`
        );
        const result = await response.json();
        const mappedData = Array.isArray(result) ? result : [result];
        setData(mappedData);
        setFilteredData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [entityId, location]);

  useEffect(() => {
    let filtered = [...data];
    if (status !== null) {
      filtered = filtered.filter((entity) => entity.isActive === status);
    }
    console.log("Filtered Data:", filtered);
    setFilteredData(filtered);
  }, [data, status]);

  const toggleCheckbox = (_id: string) => {
    setSelectedEntities((prev) =>
      prev.includes(_id) ? prev.filter((entityId) => entityId !== _id) : [...prev, _id]
    );
  };

  const toggleActive = (_id: string) => {
    setData((prevData) =>
      prevData.map((entity) =>
        entity._id === _id ? { ...entity, isActive: !entity.isActive } : entity
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="flex flex-wrap justify-between items-center bg-white shadow-md rounded-lg p-4">
        <div>
          <h1 className="text-3xl font-bold text-[#173E73] capitalize">{entityType}</h1>
          <p className="text-gray-500">Home &gt; <Link to={"/configuration"}>Configuration</Link> &gt; {entityType}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-2 items-center mt-2 sm:mt-0">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button className="bg-[#173E73] text-white flex items-center gap-1">
              Actions <DownOutlined />
            </Button>
          </Dropdown>
          <Button className="bg-[#173E73] text-white flex items-center gap-1">
            <DownloadOutlined /> Export Records
          </Button>
          <Button className="bg-[#173E73] text-white flex items-center gap-1">
            <UploadOutlined /> Import Records
          </Button>
          <Button
            type="primary"
            className="bg-[#173E73] text-white flex items-center gap-1"
            onClick={() => navigate(`/add/${entityType}/${entityId}`)}
          >
            <PlusOutlined /> Add {entityType}
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center bg-gray-100 shadow-md rounded-lg p-4">
          <Button icon={<FilterOutlined />} className="mr-4">
            Filter
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1 mr-5 justify-center items-center">
              <span className="text-[#173E73] font-bold">Status:</span>
              <Switch
                checked={status === true}
                onChange={(checked) => setStatus(checked ? true : null)}
                style={{ backgroundColor: "#173E73" }}
                size="small"
              />
            </div>
            <div style={{ position: "relative", display: "inline-block", width: "250px" }}>
              <Input placeholder="Search..." style={{ paddingRight: "40px" }} />
              <div
                style={{
                  position: "absolute",
                  right: "0",
                  top: "0",
                  bottom: "0",
                  width: "40px",
                  backgroundColor: "#173E73",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "0 4px 4px 0",
                  cursor: "pointer",
                }}
              >
                <SearchOutlined style={{ color: "white", fontSize: "16px" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 mt-4">
          <div className="overflow-x-auto">
            <EntityTable
              entities={filteredData}
              selectedEntities={selectedEntities}
              toggleCheckbox={toggleCheckbox}
              toggleActive={toggleActive}
              setSelectedEntities={setSelectedEntities}
            />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EntityPage;
