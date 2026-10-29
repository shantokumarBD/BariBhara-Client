import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axiosInstance";
import { toast } from "sonner";
import type { Unit, ApiResponse } from "@/types";

export const useUnit = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // ১. নির্দিষ্ট একটি বাড়ির সব ইউনিট লোড করার কুয়েরি
  const useGetUnits = (propertyId?: string) => {
    return useQuery<Unit[]>({
      queryKey: ["units", propertyId],
      queryFn: async () => {
        const res = await api.get<ApiResponse<Unit[]>>(`/api/unit/${propertyId}`);
        return (res.data as any).units || [];
      },
      enabled: !!token && !!propertyId,
    });
  };

  // ২. নতুন ইউনিট যোগ করার মিউটেশন
  const createUnitMutation = useMutation({
    mutationFn: async (unitData: Partial<Unit> | FormData) => {
      const isFormData = unitData instanceof FormData;
      const res = await api.post("/api/unit/add-unit", unitData, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "ইউনিট সফলভাবে যোগ করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "ইউনিট যোগ করতে সমস্যা হয়েছে!");
    },
  });

  // ৩. ইউনিটের তথ্য আপডেট করার মিউটেশন
  const updateUnitMutation = useMutation({
    mutationFn: async ({ unitId, data }: { unitId: string; data: Partial<Unit> | FormData }) => {
      const isFormData = data instanceof FormData;
      const res = await api.put(`/api/unit/${unitId}`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "ইউনিট আপডেট করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "ইউনিট আপডেট করা সম্ভব হয়নি!");
    },
  });

  // ৪. ইউনিট ডিলিট করার মিউটেশন
  const deleteUnitMutation = useMutation({
    mutationFn: async (unitId: string) => {
      const res = await api.delete(`/api/unit/${unitId}`);
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "ইউনিট মুছে ফেলা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "ইউনিট মুছতে সমস্যা হয়েছে!");
    },
  });

  return {
    useGetUnits,
    createUnitMutation,
    updateUnitMutation,
    deleteUnitMutation,
  };
};

export default useUnit;
