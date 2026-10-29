import { api } from "@/lib/axiosInstance";
import type { Tenant, ApiResponse } from "@/types";

export interface TenantsResponse {
  tenants: Tenant[];
  total: number;
  page: number;
  totalPages: number;
}

// ১. নতুন ভাড়াটিয়া যোগ করা
export const addTenantApi = async (formData: FormData) => {
  const res = await api.post<ApiResponse<Tenant>>("/api/tenant/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ২. সকল ভাড়াটিয়ার তালিকা (Pagination সহ)
export const getAllTenantsApi = async (page = 1, limit = 9) => {
  const res = await api.get<TenantsResponse>(`/api/tenant/all?page=${page}&limit=${limit}`);
  return res.data;
};

// ৩. নির্দিষ্ট ইউনিটের ভাড়াটিয়া
export const getTenantByUnitApi = async (unitId: string) => {
  const res = await api.get<{ tenant: Tenant }>(`/api/tenant/unit/${unitId}`);
  return res.data.tenant;
};

// ৪. ভাড়াটিয়ার তথ্য আপডেট
export const updateTenantApi = async (id: string, formData: FormData) => {
  const res = await api.put<ApiResponse<Tenant>>(`/api/tenant/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ৫. ভাড়াটিয়া সরানো (ইউনিট খালি করা)
export const vacateTenantApi = async (id: string) => {
  const res = await api.patch<ApiResponse>(`/api/tenant/vacate/${id}`);
  return res.data;
};

// ৬. Auto Renew টগল করা
export const toggleAutoRenewApi = async (id: string, autoRenew: boolean) => {
  const res = await api.patch<ApiResponse>(`/api/tenant/auto-renew/${id}`, { autoRenew });
  return res.data;
};

// ৭. লিজ নবায়ন করা
export const renewLeaseApi = async (id: string, newEndDate: string) => {
  const res = await api.patch<ApiResponse>(`/api/tenant/renew/${id}`, { newEndDate });
  return res.data;
};

// ৮. চুক্তিপত্র তৈরি
export const generateAgreementApi = async (id: string) => {
  const res = await api.post<ApiResponse<{ agreementUrl: string }>>(`/api/tenant/agreement/${id}`);
  return res.data;
};

// ৯. চুক্তিপত্র মুছে ফেলা
export const deleteAgreementApi = async (id: string) => {
  const res = await api.delete<ApiResponse>(`/api/tenant/agreement/${id}`);
  return res.data;
};

// ১০. NID ভেরিফিকেশন
export const verifyNidApi = async (id: string, verified: boolean) => {
  const res = await api.patch<ApiResponse>(`/api/tenant/verify-nid/${id}`, { verified });
  return res.data;
};

// ১১. ইউটিলিটি চার্জেস আপডেট
export const updateUtilitiesApi = async (id: string, utilities: any) => {
  const res = await api.patch<ApiResponse>(`/api/tenant/utilities/${id}`, { utilities });
  return res.data;
};

// ১২. ভাড়াটিয়ার রেটিং দেওয়া
export const rateTenantApi = async (id: string, rating: number, review?: string) => {
  const res = await api.post<ApiResponse>(`/api/tenant/rate/${id}`, { rating, review });
  return res.data;
};
