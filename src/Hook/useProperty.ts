import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axiosInstance";
import { toast } from "sonner";
import type { Property, ApiResponse } from "@/types";

export const useProperty = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // ১. সব প্রপার্টি লোড করার জন্য কুয়েরি (Typed)
  const { data: properties = [], isLoading: isPropertiesLoading } = useQuery<Property[]>({
    queryKey: ["my-properties"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Property[]>>("/api/property/my-property");
      return res.data.properties || [];
    },
    enabled: !!token,
  });

  // ২. নির্দিষ্ট একটি প্রপার্টির তথ্য আনার হুক
  const useSingleProperty = (id?: string) => {
    return useQuery<Property>({
      queryKey: ["property", id],
      queryFn: async () => {
        const res = await api.get<ApiResponse<Property>>(`/api/property/${id}`);
        return (res.data as any).property;
      },
      enabled: !!token && !!id,
    });
  };

  // ৩. নতুন প্রপার্টি যোগ করার মিউটেশন
  const createPropertyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Enforce Free Plan limit of 1 building
      const user = useAuthStore.getState().user;
      if (user?.subscriptionPlan === "free" && properties.length >= 1) {
        throw new Error(
          "আপনার ফ্রি প্ল্যানের লিমিট শেষ! আরও বিল্ডিং যোগ করতে দয়া করে প্রো প্ল্যানে সাবস্ক্রাইব করুন।"
        );
      }
      const res = await api.post("/api/property/add-property", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "প্রপার্টি সফলভাবে তৈরি করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.message || error.response?.data?.message || "কিছু একটা ভুল হয়েছে!");
    },
  });

  // ৪. প্রপার্টির তথ্য আপডেট করার মিউটেশন
  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await api.put(`/api/property/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "প্রপার্টি আপডেট করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["property"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["public-properties"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "প্রপার্টি আপডেট করা সম্ভব হয়নি!");
    },
  });

  // ৫. প্রপার্টি ডিলিট করার মিউটেশন
  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/property/${id}`);
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "প্রপার্টি মুছে ফেলা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "প্রপার্টি মুছতে সমস্যা হয়েছে!");
    },
  });

  return {
    properties,
    isPropertiesLoading,
    useSingleProperty,
    createPropertyMutation,
    updatePropertyMutation,
    deletePropertyMutation,
  };
};

export default useProperty;
