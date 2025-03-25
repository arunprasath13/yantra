import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input, Switch, Button, Card, Typography, message, Select, Spin } from "antd";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

const schema = yup.object({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  district: yup.string().required("District is required"),
  territoryManager: yup.string().required("Territory Manager is required"),
  longitude: yup.string().required("Longitude is required"),
  latitude: yup.string().required("Latitude is required"),
  status: yup.boolean().default(true),
});

const AddEditTerritoryPage = () => {
  const { entityType, id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [fetchingCountries, setFetchingCountries] = useState(false);
  const [fetchingStates, setFetchingStates] = useState(false);
  const [fetchingDistricts, setFetchingDistricts] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      code: "",
      name: "",
      country: "",
      state: "",
      district: "",
      territoryManager: "",
      longitude: "",
      latitude: "",
      status: true,
    },
    mode: "onChange",
  });

  const isEditMode = Boolean(id);
  const selectedCountryId = watch("country");
  const selectedStateId = watch("state");

  const managers = ["Mr. Elangi", "Ms. Smith", "Mr. Kumar"];


  const fetchCountries = async () => {
    setFetchingCountries(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_CONFIGURATION_URL}/api/entities/13`);
      const apiCountries = response.data;
      setCountries(apiCountries);
      if (apiCountries.length > 0 && !selectedCountryId) {
        setValue("country", apiCountries[0]._id);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      message.error("Failed to load countries from API");
      setCountries([{ _id: "fallback-id", name: "India" }]);
      setValue("country", "fallback-id");
    } finally {
      setFetchingCountries(false);
    }
  };


  const fetchStates = async (countryId: string) => {
    if (!countryId) return;
    setFetchingStates(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_CONFIGURATION_URL}/api/entities/14/${countryId}/related`);
      const apiStates = response.data;
      setStates(apiStates);
      if (apiStates.length > 0 && !selectedStateId) {
        setValue("state", apiStates[0]._id);
      } else {
        setValue("state", "");
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      message.error("Failed to load states from API");
      setStates([]);
      setValue("state", "");
    } finally {
      setFetchingStates(false);
    }
  };


  const fetchDistricts = async (stateId: string) => {
    if (!stateId) return;
    setFetchingDistricts(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_CONFIGURATION_URL}/api/entities/15/${stateId}/related`);
      const apiDistricts = response.data;
      setDistricts(apiDistricts);
      if (apiDistricts.length > 0 && !watch("district")) {
        setValue("district", apiDistricts[0]._id);
      } else {
        setValue("district", "");
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      message.error("Failed to load districts from API");
      setDistricts([]);
      setValue("district", "");
    } finally {
      setFetchingDistricts(false);
    }
  };


  useEffect(() => {
    if (selectedCountryId) {
      fetchStates(selectedCountryId);
    } else {
      setStates([]);
      setDistricts([]);
      setValue("state", "");
      setValue("district", "");
    }
  }, [selectedCountryId, setValue]);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_CONFIGURATION_URL}/api/territories/${id}`)
        .then((response) => {
          console.log("Fetched Territory Data:", response.data);
          if (response.data) {
            reset({
              code: response.data.territoryCode || "",
              name: response.data.territoryName || "",
              country: response.data.country || "",
              state: response.data.state || "",
              district: response.data.district || "",
              territoryManager: response.data.territoryManager || "",
              longitude: response.data.longitude || "",
              latitude: response.data.latitude || "",
              status: response.data.status ?? true,
            });
            if (countries.length === 0) fetchCountries();
            if (response.data.country) fetchStates(response.data.country);
            // Fetch districts in edit mode if state is present
            if (response.data.state) fetchDistricts(response.data.state);
          }
        })
        .catch((error) => {
          console.error("Error fetching territory data:", error);
          message.error("Failed to load territory data.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode, reset]);

  const handleGoBack = () => navigate(-1);

  const onSubmit = async (data: any) => {
    const payload = {
      territoryCode: data.code,
      territoryName: data.name,
      country: data.country,
      state: data.state,
      district: data.district,
      territoryManager: data.territoryManager,
      longitude: data.longitude,
      latitude: data.latitude,
      status: data.status,
      tenantKey: "tenant-123",
      createdBy: "Admin",
    };

    console.log("📝 Payload to be sent:", payload);

    try {
      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_CONFIGURATION_URL}/api/territories/${id}`, payload);
        toast.success("Territory updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_CONFIGURATION_URL}/api/territories`, payload);
        toast.success("Territory added successfully");
      }
      navigate(-1);
    } catch (error) {
      toast.error("There was an error while saving the territory");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <Title level={3} className="text-[#173E73] text-center sm:text-left">
            {isEditMode ? "Edit Territory" : "Add New Territory"} {entityType}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


                <div>
                  <label className="block font-semibold text-gray-700">Country *</label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        style={{ width: "100%" }}
                        onDropdownVisibleChange={(open) => {
                          if (open) fetchCountries();
                        }}
                        loading={fetchingCountries}
                        placeholder="Select a country"
                      >
                        {countries.map((country) => (
                          <Option key={country._id} value={country._id}>
                            {country.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.country && <Text type="danger">{errors.country.message}</Text>}
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">State *</label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        style={{ width: "100%" }}
                        disabled={!selectedCountryId}
                        loading={fetchingStates}
                        placeholder="Select a state"
                      >
                        {states.map((state) => (
                          <Option key={state._id} value={state._id}>
                            {state.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.state && <Text type="danger">{errors.state.message}</Text>}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">District *</label>
                  <Controller
                    name="district"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onDropdownVisibleChange={(open) => {
                          if (open && selectedStateId) {
                            fetchDistricts(selectedStateId);
                          }
                        }}
                        style={{ width: "100%" }}
                        disabled={!selectedStateId}
                        loading={fetchingDistricts}
                        placeholder="Select a district"
                      >
                        {districts.map((district) => (
                          <Option key={district._id} value={district._id}>
                            {district.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.district && <Text type="danger">{errors.district.message}</Text>}
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Territory Code *</label>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.code && <Text type="danger">{errors.code.message}</Text>}
                </div>




                <div>
                  <label className="block font-semibold text-gray-700">Territory Name *</label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.name && <Text type="danger">{errors.name.message}</Text>}
                </div>

              



                <div>
                  <label className="block font-semibold text-gray-700">Territory Manager *</label>
                  <Controller
                    name="territoryManager"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        style={{ width: "100%" }}
                      >
                        {managers.map((manager) => (
                          <Option key={manager} value={manager}>
                            {manager}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.territoryManager && (
                    <Text type="danger">{errors.territoryManager.message}</Text>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">Longitude *</label>
                  <Controller
                    name="longitude"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.longitude && <Text type="danger">{errors.longitude.message}</Text>}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">Latitude *</label>
                  <Controller
                    name="latitude"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.latitude && <Text type="danger">{errors.latitude.message}</Text>}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">Status</label>
                  <Controller
                    name="status"
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

export default AddEditTerritoryPage;