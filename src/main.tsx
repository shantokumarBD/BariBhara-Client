import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import ConfirmModal from "./components/modals/ConfirmModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PublicRoute from "./components/PublicRoute.tsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.tsx";
import TenantProtectedRoute from "./components/TenantProtectedRoute.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";
import TenantLayout from "./components/layout/TenantLayout.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import PageLoader from "./components/common/PageLoader";

// Lazy Loaded Pages for high-performance code splitting
const Home = lazy(() => import("./components/Home.tsx"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const PublicPropertyDetail = lazy(() => import("./pages/PublicPropertyDetail"));
const SavedProperties = lazy(() => import("./pages/SavedProperties"));
const TermsPrivacy = lazy(() => import("./pages/TermsPrivacy"));
const Register = lazy(() => import("./pages/Register.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));

// Landlord Pages
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails.tsx"));
const Tenants = lazy(() => import("./pages/Tenants.tsx"));
const RentManagement = lazy(() => import("./pages/RentManagement"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const Reviews = lazy(() => import("./pages/Reviews.tsx"));
const PaymentPage = lazy(() => import("./pages/PaymentPage.tsx"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.tsx"));
const AdminSubscriptions = lazy(() => import("./pages/AdminSubscriptions.tsx"));
const AdminRevenue = lazy(() => import("./pages/admin/AdminRevenue.tsx"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics.tsx"));
const AdminPlans = lazy(() => import("./pages/admin/AdminPlans.tsx"));

// Tenant Pages
const TenantDashboard = lazy(() => import("./pages/tenant/TenantDashboard"));
const TenantInvoices = lazy(() => import("./pages/tenant/TenantInvoices"));
const TenantMaintenance = lazy(() => import("./pages/tenant/TenantMaintenance"));
const TenantAgreement = lazy(() => import("./pages/tenant/TenantAgreement"));
const TenantProfile = lazy(() => import("./pages/tenant/TenantProfile"));

const queryClient = new QueryClient();

// Helper to wrap lazy loaded component with Suspense
const load = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // ১. পাবলিক রাউট (হোমপেজ, লগইন, রেজিস্ট্রেশন)
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: load(Home),
      },
      {
        path: "search",
        element: load(SearchResults),
      },
      {
        path: "property/:id",
        element: load(PublicPropertyDetail),
      },
      {
        path: "saved-properties",
        element: load(SavedProperties),
      },
      {
        path: "terms-privacy",
        element: load(TermsPrivacy),
      },
    ],
  },
  {
    path: "/register",
    element: <PublicRoute>{load(Register)}</PublicRoute>,
  },
  {
    path: "/login",
    element: <PublicRoute>{load(Login)}</PublicRoute>,
  },
  {
    path: "/forgot-password",
    element: <PublicRoute>{load(ForgotPassword)}</PublicRoute>,
  },
  {
    path: "/reset-password",
    element: <PublicRoute>{load(ResetPassword)}</PublicRoute>,
  },

  // ২. ল্যান্ডলর্ড প্রোটেক্টেড রাউট
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: load(Dashboard),
      },
      {
        path: "properties",
        element: load(Properties),
      },
      {
        path: "properties/:id",
        element: load(PropertyDetails),
      },
      {
        path: "tenants",
        element: load(Tenants),
      },
      {
        path: "payments",
        element: load(RentManagement),
      },
      {
        path: "settings",
        element: load(Settings),
      },
      {
        path: "reviews",
        element: load(Reviews),
      },
      {
        path: "maintenance",
        element: load(Maintenance),
      },
      {
        path: "reports",
        element: load(Reports),
      },
    ],
  },
  {
    path: "/payment/:plan",
    element: (
      <ProtectedRoute>
        {load(PaymentPage)}
      </ProtectedRoute>
    ),
  },

  // ৩. অ্যাডমিন রাউট — শুধুমাত্র role=admin হলে অ্যাক্সেস পাবে
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <MainLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: load(AdminDashboard),
      },
      {
        path: "users",
        element: load(AdminUsers),
      },
      {
        path: "subscriptions",
        element: load(AdminSubscriptions),
      },
      {
        path: "revenue",
        element: load(AdminRevenue),
      },
      {
        path: "analytics",
        element: load(AdminAnalytics),
      },
      {
        path: "plans",
        element: load(AdminPlans),
      },
    ],
  },

  // ৪. টেন্যান্ট রাউট
  {
    path: "/tenant",
    element: (
      <TenantProtectedRoute>
        <TenantLayout />
      </TenantProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: load(TenantDashboard),
      },
      {
        path: "invoices",
        element: load(TenantInvoices),
      },
      {
        path: "maintenance",
        element: load(TenantMaintenance),
      },
      {
        path: "agreement",
        element: load(TenantAgreement),
      },
      {
        path: "profile",
        element: load(TenantProfile),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors />
        <ConfirmModal />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
