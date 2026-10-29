import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axiosInstance";
import { Megaphone, AlertCircle, CheckCircle2, X } from "lucide-react";

export const GlobalAnnouncementBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  const { data } = useQuery({
    queryKey: ["global-announcement"],
    queryFn: async () => {
      const res = await api.get("/api/public/system-settings");
      return res.data?.settings?.announcement;
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const announcement = data;

  useEffect(() => {
    if (announcement?.message) {
      const saved = sessionStorage.getItem("dismissed_announcement");
      if (saved === announcement.message) {
        setIsDismissed(true);
      } else {
        setIsDismissed(false);
      }
    }
  }, [announcement?.message]);

  if (!announcement || !announcement.active || !announcement.message || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("dismissed_announcement", announcement.message);
  };

  const getStyle = () => {
    switch (announcement.type) {
      case "warning":
        return {
          bg: "bg-gradient-to-r from-amber-600 to-orange-600 text-white",
          icon: AlertCircle,
        };
      case "success":
        return {
          bg: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
          icon: CheckCircle2,
        };
      case "info":
      default:
        return {
          bg: "bg-gradient-to-r from-primary to-indigo-600 text-white",
          icon: Megaphone,
        };
    }
  };

  const { bg, icon: Icon } = getStyle();

  return (
    <div
      className={`${bg} px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md relative z-40 transition-all`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Icon size={18} className="shrink-0 animate-pulse" />
          <span className="truncate">{announcement.message}</span>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          title="বন্ধ করুন"
          aria-label="Dismiss announcement"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
