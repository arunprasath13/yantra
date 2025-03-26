import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Switch, Button, Card, Typography, message, Select, Spin, DatePicker, Input } from "antd";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

// Schema for form validation
const schema = yup.object({
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  district: yup.string().required("District is required"),
  territoryCode: yup
    .string()
    .required("Territory Code is required")
    .min(1, "Territory Code cannot be empty"),
  territoryName: yup.string().required("Territory Name is required"),
  executive: yup.string().required("Executive is required"),
  territoryManager: yup.string().required("Territory Manager is required"),
  isActive: yup.boolean().default(true),
  fromDate: yup.date().required("From Date is required").nullable(),
  toDate: yup
    .date()
    .required("To Date is required")
    .nullable()
    .min(yup.ref("fromDate"), "To Date must be after From Date"),
});

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  designation: string;
  status: string;
  email?: string;
  dependents?: Array<{
    contactNumber: string;
    email: string;
  }>;
}

interface Territory {
  _id: string;
  code: string;
  name: string;
}

interface FilterOption {
  children: string;
  value: string;
}

const AddEditTerritoryMappingPage = () => {
  const { entityType, id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState<User | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      country: "",
      state: "",
      district: "",
      territoryCode: "",
      territoryName: "",
      executive: "",
      territoryManager: "",
      isActive: false,
      fromDate: null,
      toDate: null,
    },
    mode: "onChange",
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedTerritoryName = watch("territoryName");

  const isEditMode = Boolean(id);

  // Fetch countries from API
  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_CONFIGURATION_URL}/api/entities/13`);
      const countryList = response.data.map((item: any) => item.name || item);
      console.log("Fetched countries:", countryList);
      setCountries(countryList);
      return countryList;
    } catch (error) {
      console.error("Error fetching countries:", error);
      message.error("Failed to load countries.");
      return [];
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchStates = async (country: string) => {
    setLoadingStates(true);
    try {
      console.log("Fetching states for country:", country);
      const response = await axios.get(`${import.meta.env.VITE_CONFIGURATION_URL}/api/entities/14/67e28e21313bdbca16ae2860/related`);
      const stateList = response.data.map((item: any) => item.name || item);
      console.log("Fetched states:", stateList);
      setStates(stateList);
      return stateList;
    } catch (error) {
      console.error("Error fetching states:", error);
      message.error("Failed to load states.");
      return [];
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchDistricts = async (state: string) => {
    setLoadingDistricts(true);
    try {
      console.log("Fetching districts for state:", state);
      const response = await axios.get(`${import.meta.env.VITE_CONFIGURATION_URL}/api/entities/15/67e28e21313bdbca16ae2861/related`);
      const districtList = response.data.map((item: any) => item.name || item);
      console.log("Fetched districts:", districtList);
      setDistricts(districtList);
      return districtList;
    } catch (error) {
      console.error("Error fetching districts:", error);
      message.error("Failed to load districts.");
      return [];
    } finally {
      setLoadingDistricts(false);
    }
  };

  // Fetch territories (for territoryName and territoryCode mapping)
  const fetchTerritories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_CONFIGURATION_URL}/api/entities/15`); // Adjust endpoint if needed
      const territoryList = response.data.map((item: any) => ({
        _id: item._id,
        code: item.code,
        name: item.name,
      }));
      console.log("Fetched territories:", territoryList);
      setTerritories(territoryList);
      return territoryList;
    } catch (error) {
      console.error("Error fetching territories:", error);
      message.error("Failed to load territories.");
      return [];
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get("https://employee.edsolutions360.com/users");
      const activeUsers = response.data.filter((user: User) => user.status === "active");
      setUsers(activeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load executives.");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchUsers();
    fetchTerritories(); // Fetch territories initially
    if (isEditMode) {
      setLoading(true);
      const loadEditData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_CONFIGURATION_URL}/api/territory-mappings/${id}`);
          console.log("Fetched Territory Data:", response.data);

          if (response.data) {
            const territoryData = {
              country: response.data.country || "",
              state: response.data.state || "",
              district: response.data.district || "",
              territoryCode: response.data.territoryCode || "",
              territoryName: response.data.territoryName || "",
              executive: response.data.executive || "",
              territoryManager: response.data.territoryManager || "",
              isActive: response.data.isActive ?? true,
              fromDate: response.data.fromDate ? new Date(response.data.fromDate) : null,
              toDate: response.data.toDate ? new Date(response.data.toDate) : null,
            };
            reset(territoryData);
            console.log("Form reset with:", territoryData);

            const countryList = await fetchCountries();
            if (territoryData.country && countryList.includes(territoryData.country)) {
              const stateList = await fetchStates(territoryData.country);
              if (stateList.length > 0) {
                const stateToSet = stateList.includes(territoryData.state)
                  ? territoryData.state
                  : stateList[0];
                console.log("Setting state to:", stateToSet);
                setValue("state", stateToSet, { shouldValidate: true });

                const districtList = await fetchDistricts(stateToSet);
                if (districtList.length > 0) {
                  const districtToSet = districtList.includes(territoryData.district)
                    ? territoryData.district
                    : districtList[0];
                  console.log("Setting district to:", districtToSet);
                  setValue("district", districtToSet, { shouldValidate: true });
                }
              }
            }
          }
        } catch (error) {
          console.error("Error in loadEditData:", error);
          message.error("Failed to load territory data.");
        } finally {
          setLoading(false);
        }
      };
      loadEditData();
    }
  }, [id, isEditMode, reset, setValue]);

  
  useEffect(() => {
    if (selectedTerritoryName) {
      const selectedTerritory = territories.find((t) => t.name === selectedTerritoryName);
      if (selectedTerritory) {
        setValue("territoryCode", selectedTerritory.code, { shouldValidate: true });
        console.log("Autopopulated territoryCode:", selectedTerritory.code);
      }
    }
  }, [selectedTerritoryName, territories, setValue]);

  useEffect(() => {
    if (selectedCountry && !isEditMode) {
      fetchStates(selectedCountry).then((stateList) => {
        if (stateList.length > 0 && !watch("state")) {
          console.log("Auto-populating state in add mode:", stateList[0]);
          setValue("state", stateList[0], { shouldValidate: true });
        }
      });
    }
  }, [selectedCountry, setValue, isEditMode]);

  useEffect(() => {
    if (selectedState && !isEditMode) {
      fetchDistricts(selectedState).then((districtList) => {
        if (districtList.length > 0 && !watch("district")) {
          console.log("Auto-populating district in add mode:", districtList[0]);
          setValue("district", districtList[0], { shouldValidate: true });
        }
      });
    }
  }, [selectedState, setValue, isEditMode]);

  const handleGoBack = () => navigate(-1);

  const onSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    const payload = {
      tenantKey: "tenant-001",
      territoryCode: data.territoryCode,
      territoryName: data.territoryName,
      country: String(data.country),
      state: data.state,
      district: data.district,
      executive: data.executive,
      territoryManager: data.territoryManager,
      fromDate: data.fromDate ? dayjs(data.fromDate).toISOString() : null,
      toDate: data.toDate ? dayjs(data.toDate).toISOString() : null,
      createdBy: "admin",
      isActive: data.isActive,
      assignmentHistory: isEditMode
        ? undefined
        : [
            {
              date: data.fromDate ? dayjs(data.fromDate).toISOString() : new Date().toISOString(),
              reassignedFrom: "None",
              reassignedTo: data.executive,
              reason: "Initial assignment",
            },
          ],
    };

    try {
      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_CONFIGURATION_URL}/api/territory-mappings/${id}`, payload);
        toast.success("Territory updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_CONFIGURATION_URL}/api/territory-mappings`, payload);
        toast.success("Territory added successfully");
      }
      navigate(-1);
    } catch (error) {
      console.error("Error saving territory:", error);
      toast.error("There was an error while saving the territory");
    }
  };

  const handleDropdownVisibleChange = (open: boolean) => {
    if (open && countries.length === 0) {
      fetchCountries();
    }
  };

  const handleExecutiveSelect = (value: string) => {
    const selectedUser = users.find((user) => `${user.firstName} ${user.lastName}` === value);
    setSelectedExecutive(selectedUser || null);
  };

  const handleFilterOption = (input: string, option?: FilterOption): boolean => {
    return option ? option.children.toLowerCase().includes(input.toLowerCase()) : false;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <Title level={3} className="text-[#173E73] text-center sm:text-left">
            {isEditMode ? "Edit Territory Mapping" : "Add New Territory Mapping"} {entityType}
          </Title>
          <Button type="primary" className="flex items-center" onClick={handleGoBack}>
            <ArrowLeft size={16} className="mr-2" />
            BACK
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto p-4 sm:p-6 shadow-md bg-white">
          {loading ? (
            <Spin size="large" className="block mx-auto" />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* First Row: Country, State, District */}
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <label className="block font-semibold text-gray-700">Country *</label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        style={{ width: "100%" }}
                        loading={loadingCountries}
                        showSearch
                        placeholder="Select Country"
                        optionFilterProp="children"
                        filterOption={handleFilterOption}
                        onDropdownVisibleChange={handleDropdownVisibleChange}
                      >
                        {countries.map((country) => (
                          <Option key={country} value={country}>
                            {country}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.country && <Text type="danger">{errors.country.message}</Text>}
                </div>

                <div className="flex-1">
                  <label className="block font-semibold text-gray-700">State *</label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        style={{ width: "100%" }}
                        loading={loadingStates}
                        disabled={!selectedCountry}
                        placeholder="Select State"
                        showSearch
                        optionFilterProp="children"
                        filterOption={handleFilterOption}
                      >
                        {states.map((state) => (
                          <Option key={state} value={state}>
                            {state}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.state && <Text type="danger">{errors.state.message}</Text>}
                </div>

                <div className="flex-1">
                  <label className="block font-semibold text-gray-700">District *</label>
                  <Controller
                    name="district"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        style={{ width: "100%" }}
                        loading={loadingDistricts}
                        disabled={!selectedState}
                        placeholder="Select District"
                        showSearch
                        optionFilterProp="children"
                        filterOption={handleFilterOption}
                      >
                        {districts.map((district) => (
                          <Option key={district} value={district}>
                            {district}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.district && <Text type="danger">{errors.district.message}</Text>}
                </div>
              </div>

              {/* Territory Code and Territory Name */}
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <label className="block font-semibold text-gray-700">Territory Code *</label>
                  <Controller
                    name="territoryCode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Territory Code (auto-populated)"
                        disabled // Disable manual input since it's autopopulated
                      />
                    )}
                  />
                  {errors.territoryCode && <Text type="danger">{errors.territoryCode.message}</Text>}
                </div>

                <div className="flex-1">
                  <label className="block font-semibold text-gray-700">Territory Name *</label>
                  <Controller
                    name="territoryName"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        style={{ width: "100%" }}
                        placeholder="Select Territory Name"
                      >
                        {territories.map((territory) => (
                          <Option key={territory._id} value={territory.name}>
                            {territory.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.territoryName && <Text type="danger">{errors.territoryName.message}</Text>}
                </div>

                <div className="flex-1">
                  <label className="block font-semibold text-gray-700">Is Active</label>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Executive and Territory Manager */}
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <label className="block font-semibold text-gray-700">Select the Executive *</label>
                  <Controller
                    name="executive"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          handleExecutiveSelect(value);
                        }}
                        style={{ width: "100%" }}
                        loading={loadingUsers}
                        onDropdownVisibleChange={(open) => open && fetchUsers()}
                        showSearch
                        placeholder="Select Executive"
                        optionFilterProp="children"
                        filterOption={handleFilterOption}
                      >
                        {users.map((user) => (
                          <Option key={user._id} value={`${user.firstName} ${user.lastName}`}>
                            {`${user.firstName} ${user.lastName} (${user.designation})`}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.executive && <Text type="danger">{errors.executive.message}</Text>}
                </div>

                <div className="flex-1">
                  <label className="block font-semibold text-gray-700">Territory Manager *</label>
                  <Controller
                    name="territoryManager"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        style={{ width: "100%" }}
                        loading={loadingUsers}
                        onDropdownVisibleChange={(open) => open && fetchUsers()}
                        showSearch
                        placeholder="Select Territory Manager"
                        optionFilterProp="children"
                        filterOption={handleFilterOption}
                      >
                        {users.map((user) => (
                          <Option key={user._id} value={`${user.firstName} ${user.lastName}`}>
                            {`${user.firstName} ${user.lastName} (${user.designation})`}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.territoryManager && <Text type="danger">{errors.territoryManager.message}</Text>}
                </div>
              </div>

              {selectedExecutive && (
                <div className="mb-6">
                  <Card className="flex items-center p-4 shadow-md">
                    <div className="w-12 h-12 bg-blue-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                      {selectedExecutive.firstName[0]}{selectedExecutive.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong className="text-lg">
                            {selectedExecutive.firstName} {selectedExecutive.lastName}
                          </Text>
                          <div>
                            <Text className="text-gray-500">{selectedExecutive.designation}</Text>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="mr-2">📞</span>
                            <Text>{selectedExecutive.dependents?.[0]?.contactNumber || "N/A"}</Text>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="mr-2">✉️</span>
                            <Text>{selectedExecutive.email || selectedExecutive.dependents?.[0]?.email || "N/A"}</Text>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            shape="circle"
                            icon={<span>📞</span>}
                            onClick={() => {
                              const phoneNumber = selectedExecutive.dependents?.[0]?.contactNumber;
                              if (phoneNumber && phoneNumber !== "N/A") {
                                window.location.href = `tel:${phoneNumber}`;
                              } else {
                                message.warning("No phone number available to call.");
                              }
                            }}
                          />
                          <Button
                            shape="circle"
                            icon={<span>✉️</span>}
                            onClick={() => {
                              const email = selectedExecutive.email || selectedExecutive.dependents?.[0]?.email;
                              if (email && email !== "N/A") {
                                window.location.href = `mailto:${email}?subject=Regarding Territory Mapping`;
                              } else {
                                message.warning("No email address available to send an email.");
                              }
                            }}
                          />
                          <Button shape="circle" icon={<span>⋯</span>} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <label className="block font-semibold text-gray-700">From Date *</label>
                  <Controller
                    name="fromDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date ? date.toDate() : null)}
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        placeholder="Select From Date"
                      />
                    )}
                  />
                  {errors.fromDate && <Text type="danger">{errors.fromDate.message}</Text>}
                </div>

                <div className="flex-1">
                  <label className="block font-semibold text-gray-700">To Date *</label>
                  <Controller
                    name="toDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date ? date.toDate() : null)}
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        placeholder="Select To Date"
                      />
                    )}
                  />
                  {errors.toDate && <Text type="danger">{errors.toDate.message}</Text>}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
                <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                  {isEditMode ? "Update" : "Save"}
                </Button>
                <Button onClick={handleGoBack}>Cancel</Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddEditTerritoryMappingPage;