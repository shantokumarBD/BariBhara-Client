import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import type { Tenant } from "@/types";
import {
  addTenantApi,
  getAllTenantsApi,
  getTenantByUnitApi,
  updateTenantApi,
  vacateTenantApi,
  toggleAutoRenewApi,
  renewLeaseApi,
  generateAgreementApi,
  deleteAgreementApi,
  verifyNidApi,
  updateUtilitiesApi,
  rateTenantApi,
} from "@/api/tenant.api";

export const useTenant = (page = 1, limit = 9) => {
  const queryClient = useQueryClient();
  const { token, user } = useAuthStore();

  // ১. সকল ভাড়াটিয়া লোড করার কুয়েরি
  const { data, isLoading: isTenantsLoading } = useQuery({
    queryKey: ["tenants", page, limit],
    queryFn: () => getAllTenantsApi(page, limit),
    enabled: !!token,
    placeholderData: (prev) => prev,
  });

  const tenants: Tenant[] = data?.tenants ?? [];
  const total: number = data?.total ?? 0;
  const totalPages: number = data?.totalPages ?? 1;

  // ২. নির্দিষ্ট ইউনিটের ভাড়াটিয়া
  const useGetTenantByUnit = (unitId?: string) =>
    useQuery<Tenant>({
      queryKey: ["tenant", unitId],
      queryFn: () => getTenantByUnitApi(unitId!),
      enabled: !!token && !!unitId,
      retry: false,
    });

  // ৩. নতুন ভাড়াটিয়া যোগ করা
  const addTenantMutation = useMutation({
    mutationFn: (formData: FormData) => {
      // Enforce Free Plan limit of 2 tenants
      if (user?.subscriptionPlan === "free" && total >= 2) {
        throw new Error(
          "আপনার ফ্রি প্ল্যানের লিমিট শেষ! আরও ভাড়াটিয়া যোগ করতে দয়া করে প্রো প্ল্যানে সাবস্ক্রাইব করুন।"
        );
      }
      return addTenantApi(formData);
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "ভাড়াটিয়া সফলভাবে যোগ করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.message || err.response?.data?.message || "ভাড়াটিয়া যোগ করতে সমস্যা হয়েছে!");
    },
  });

  // ৪. ভাড়াটিয়ার তথ্য আপডেট
  const updateTenantMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateTenantApi(id, formData),
    onSuccess: (res: any) => {
      toast.success(res?.message || "ভাড়াটিয়ার তথ্য আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "আপডেট ব্যর্থ হয়েছে!");
    },
  });

  // ৫. ভাড়াটিয়া সরানো (Vacate)
  const vacateTenantMutation = useMutation({
    mutationFn: (id: string) => vacateTenantApi(id),
    onSuccess: (res: any) => {
      toast.success(res?.message || "ভাড়াটিয়া সফলভাবে সরানো হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "ভাড়াটিয়া সরাতে সমস্যা হয়েছে!");
    },
  });

  // ৬. লিজ অটো-রিনিউ টগল
  const toggleAutoRenewMutation = useMutation({
    mutationFn: ({ id, autoRenew }: { id: string; autoRenew: boolean }) =>
      toggleAutoRenewApi(id, autoRenew),
    onSuccess: (res: any) => {
      toast.success(res?.message || "অটো-রিনিউ স্ট্যাটাস আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "অটো-রিনিউ পরিবর্তন করা যায়নি!");
    },
  });

  // ৭. লিজ নবায়ন
  const renewLeaseMutation = useMutation({
    mutationFn: ({ id, newEndDate }: { id: string; newEndDate: string }) =>
      renewLeaseApi(id, newEndDate),
    onSuccess: (res: any) => {
      toast.success(res?.message || "লিজ সফলভাবে নবায়ন হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "নবায়ন ব্যর্থ হয়েছে!");
    },
  });

  // ৮. চুক্তিপত্র তৈরি
  const generateAgreementMutation = useMutation({
    mutationFn: (id: string) => generateAgreementApi(id),
    onSuccess: (res: any) => {
      toast.success(res?.message || "চুক্তিপত্র তৈরি হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "চুক্তিপত্র তৈরিতে সমস্যা হয়েছে!");
    },
  });

  // ৯. চুক্তিপত্র মুছে ফেলা
  const deleteAgreementMutation = useMutation({
    mutationFn: (id: string) => deleteAgreementApi(id),
    onSuccess: (res: any) => {
      toast.success(res?.message || "চুক্তিপত্র মুছে ফেলা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "চুক্তিপত্র মুছতে সমস্যা হয়েছে!");
    },
  });

  // ১০. NID ভেরিফিকেশন
  const verifyNidMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      verifyNidApi(id, verified),
    onSuccess: (res: any) => {
      toast.success(res?.message || "NID স্ট্যাটাস আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "ভেরিফিকেশন ব্যর্থ হয়েছে!");
    },
  });

  // ১১. ইউটিলিটি চার্জেস
  const updateUtilitiesMutation = useMutation({
    mutationFn: ({ id, utilities }: { id: string; utilities: any }) =>
      updateUtilitiesApi(id, utilities),
    onSuccess: (res: any) => {
      toast.success(res?.message || "ইউটিলিটি চার্জেস সেভ হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "ইউটিলিটি সেভ করতে সমস্যা হয়েছে!");
    },
  });

  // ১২. রেটিং দেওয়া
  const rateTenantMutation = useMutation({
    mutationFn: ({ id, rating, review }: { id: string; rating: number; review?: string }) =>
      rateTenantApi(id, rating, review),
    onSuccess: (res: any) => {
      toast.success(res?.message || "রেটিং সফলভাবে জমা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "রেটিং দিতে সমস্যা হয়েছে!");
    },
  });

  return {
    tenants,
    total,
    totalPages,
    isTenantsLoading,
    useGetTenantByUnit,
    addTenantMutation,
    updateTenantMutation,
    vacateTenantMutation,
    toggleAutoRenewMutation,
    renewLeaseMutation,
    generateAgreementMutation,
    deleteAgreementMutation,
    verifyNidMutation,
    updateUtilitiesMutation,
    rateTenantMutation,
  };
};

export default useTenant;
