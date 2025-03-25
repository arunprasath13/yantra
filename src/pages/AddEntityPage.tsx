import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input, Switch, Button, Card, Typography, message } from "antd";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;


const schema: yup.ObjectSchema<FormData> = yup.object({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  isActive: yup.boolean().default(true), 
  entityCategory: yup.number().required("Entity Category is required"),
});

interface FormData {
  code: string;
  name: string;
  description: string;
  isActive: boolean; 
  entityCategory: number;
}

const AddEntityPage: React.FC = () => {
  const { entityId, entityType } = useParams<{ entityId: string; entityType: string }>();
  const navigate = useNavigate();
  const [, setSubmittedData] = useState<FormData | null>(null);

  const safeEntityCategory = entityId ? Number(entityId) : 0;

  const handleGoBack = () => {
    navigate(-1);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      isActive: true, 
      entityCategory: safeEntityCategory,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      isActive: data.isActive, 
      entityCategory: safeEntityCategory,
      createdBy: "Admin",
    };

    console.log("Form Data before sending:", data); 
    console.log("Payload being sent:", payload); 

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_CONFIGURATION_URL}/api/entities`,
        payload
      );
      console.log("API Response:", response.data);

      setSubmittedData(payload);
      message.success("Form Submitted Successfully!");
      toast.success("Form Submitted Successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("There was an error while submitting the form.");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <Title level={3} className="text-[#173E73] text-center sm:text-left">
            Add New {entityType}
          </Title>

          <Button type="primary" className="flex items-center" onClick={handleGoBack}>
            <ArrowLeft size={16} className="mr-2" />
            BACK
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto p-4 sm:p-6 shadow-md bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block font-semibold text-gray-700">
                  {entityType} Code *
                </label>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => <Input placeholder="TNV001" {...field} />}
                />
                {errors.code && <Text type="danger">{errors.code.message}</Text>}
              </div>

              <div>
                <label className="block font-semibold text-gray-700">
                  {entityType} Name *
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => <Input placeholder="Tirunelveli Central" {...field} />}
                />
                {errors.name && <Text type="danger">{errors.name.message}</Text>}
              </div>

              <div className="flex items-center gap-4">
                <label className="font-semibold text-gray-700">Status</label>
                <Controller
                  name="isActive" 
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={(checked) => field.onChange(checked)} 
                    />
                  )}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-semibold text-gray-700">
                {entityType} Description *
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Input.TextArea placeholder="Description..." rows={4} {...field} />}
              />
              {errors.description && <Text type="danger">{errors.description.message}</Text>}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
              <Button type="primary" htmlType="submit" className="w-full sm:w-auto">
                Save
              </Button>
              <Button onClick={handleGoBack} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddEntityPage;