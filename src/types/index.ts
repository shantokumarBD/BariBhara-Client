// ============================================================
// 🏢 BariBhara Centralized TypeScript Interfaces & Types
// ============================================================

// 1. User & Auth Types
export type UserRole = "landlord" | "tenant" | "admin";
export type SubscriptionPlan = "free" | "basic" | "pro";
export type SubscriptionStatus = "active" | "pending" | "expired" | "none";

export interface User {
  id: string;
  _id?: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  accountStatus?: "active" | "blocked" | "pending";
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiresAt?: string | Date | null;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 2. Property & Building Types
export interface Property {
  _id: string;
  id?: string;
  name: string;
  location: string;
  owner: string | User;
  totalFloors: number;
  images: string[];
  description?: string;
  unitsCount?: number;
  occupiedUnitsCount?: number;
  availableUnitsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 3. Unit Types
export type UnitStatus = "available" | "occupied" | "maintenance";

export interface Unit {
  _id: string;
  id?: string;
  propertyId: string | Property;
  unitName: string;
  rentAmount: number;
  floorNo?: number | string;
  bedrooms?: number;
  bathrooms?: number;
  status: UnitStatus;
  tenantId?: string | Tenant | null;
  images?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 4. Tenant Types
export type TenantStatus = "active" | "inactive" | "pending";

export interface Tenant {
  _id: string;
  id?: string;
  landlordId: string;
  propertyId: string | Property;
  unitId: string | Unit;
  name: string;
  email: string;
  phone: string;
  nid?: string;
  photo?: string;
  nidFrontPhoto?: string;
  nidBackPhoto?: string;
  advanceAmount?: number;
  rentAmount?: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
  agreementSigned?: boolean;
  status: TenantStatus;
  createdAt?: string;
  updatedAt?: string;
}

// 5. Expense Types
export type ExpenseCategory = "maintenance" | "utility" | "tax" | "cleaning" | "salary" | "other";

export interface Expense {
  _id: string;
  id?: string;
  propertyId: string | Property;
  owner?: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  notes?: string;
  receiptImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 6. Maintenance Request Types
export type MaintenanceStatus = "pending" | "in-progress" | "resolved" | "rejected";
export type MaintenancePriority = "low" | "medium" | "high" | "emergency";

export interface MaintenanceRequest {
  _id: string;
  id?: string;
  propertyId: string | Property;
  unitId?: string | Unit;
  tenantId: string | Tenant;
  landlordId: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  cost?: number;
  photos?: string[];
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 7. Rent & Invoice Types
export type InvoiceStatus = "paid" | "unpaid" | "partial" | "overdue";

export interface Invoice {
  _id: string;
  id?: string;
  tenantId: string | Tenant;
  propertyId: string | Property;
  unitId: string | Unit;
  month: string;
  year: number;
  rentAmount: number;
  electricityBill?: number;
  waterBill?: number;
  gasBill?: number;
  serviceCharge?: number;
  otherCharges?: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: "bkash" | "nagad" | "rocket" | "cash" | "bank";
  transactionId?: string;
  receiptNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 8. Dashboard & Analytics Stats Types
export interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  availableUnits: number;
  totalTenants: number;
  monthlyRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingMaintenanceCount: number;
  unpaidInvoicesCount: number;
}

// 9. Admin Stats & System Settings
export interface AdminStats {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  totalProperties: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingApprovals: number;
}

export interface SystemSettings {
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber?: string;
  helplinePhone?: string;
  supportEmail?: string;
}

// 10. Generic API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  properties?: T;
  units?: T;
  tenants?: T;
  stats?: T;
  settings?: T;
  user?: T;
  token?: string;
}
