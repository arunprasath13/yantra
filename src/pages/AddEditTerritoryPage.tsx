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
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

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
      country: "India",
      state: "Tamilnadu",
      district: "Chennai",
      territoryManager: "",
      longitude: "",
      latitude: "",
      status: true,
    },
    mode: "onChange",
  });

  const isEditMode = Boolean(id);
  const selectedCountry = watch("country");
  const selectedState = watch("state");

 
  const countries = ["India"];
  const indiaStates = [
    "Tamilnadu",
    "Kerala",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana",
  ];
  const tamilnaduDistricts = ["Tirunelveli", "Chennai", "Madurai", "Tuticorin"];
  const managers = ["Mr. Elangi", "Ms. Smith", "Mr. Kumar"];

  
  useEffect(() => {
    if (selectedCountry === "India") {
      setStates(indiaStates);
      setValue("state", "Tamilnadu"); 
      setDistricts([]);
    } else {
      setStates([]);
      setDistricts([]);
      setValue("state", "");
      setValue("district", "");
    }
  }, [selectedCountry, setValue]);

 
  useEffect(() => {
    if (selectedState === "Tamilnadu") {
      setDistricts(tamilnaduDistricts);
      setValue("district", "Chennai"); 
    } else {
      setDistricts([]);
      setValue("district", "");
    }
  }, [selectedState, setValue]);


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
              country: response.data.country || "India",
              state: response.data.state || "Tamilnadu",
              district: response.data.district || "Chennai",
              territoryManager: response.data.territoryManager || "",
              longitude: response.data.longitude || "",
              latitude: response.data.latitude || "",
              status: response.data.status ?? true,
            });
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
            <form
              onSubmit={(e) => {
                console.log("Form submitted! Calling handleSubmit...");
                handleSubmit(onSubmit)(e);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <label className="block font-semibold text-gray-700">Country *</label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        style={{ width: "100%" }}
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
                        disabled={!selectedCountry}
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

                <div>
                  <label className="block font-semibold text-gray-700">District *</label>
                  <Controller
                    name="district"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        style={{ width: "100%" }}
                        disabled={!selectedState}
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