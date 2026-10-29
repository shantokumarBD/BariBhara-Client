import { useState } from "react";
import { X, Calendar, AlertCircle, FileText, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axiosInstance";
import { useTenantAuthStore } from "@/store/useTenantAuthStore";
import axios from "axios";

interface MoveOutNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PRESET_REASONS = [
  "কর্মস্থল / অফিস স্থানান্তর",
  "অন্য এলাকায় শিফট করা হচ্ছে",
  "নিজের ফ্ল্যাটে বা বাড়িতে উঠছি",
  "পারিবারিক প্রয়োজনে",
  "অন্যান্য",
];

const MoveOutNoticeModal = ({ isOpen, onClose, onSuccess }: MoveOutNoticeModalProps) => {
  const { token } = useTenantAuthStore();
  
  // Default to 30 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 30);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  const [expectedDate, setExpectedDate] = useState(defaultDate.toISOString().split("T")[0]);
  const [selectedReason, setSelectedReason] = useState(PRESET_REASONS[0]);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expectedDate) {
      toast.error("অনুগ্রহ করে সম্ভাব্য বাসা ছাড়ার তারিখ নির্বাচন করুন");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalReason = details ? `${selectedReason} - ${details}` : selectedReason;
      const authHeader = {
        Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
      };
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/tenant-portal/move-out-notice`,
        {
          expectedMoveOutDate: expectedDate,
          reason: finalReason,
        },
        { headers: authHeader }
      );

      if (res.data.success) {
        toast.success(res.data.message || "বাসা ছাড়ার নোটিশ সফলভাবে জমা হয়েছে!");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res.data.message || "নোটিশ জমা দিতে সমস্যা হয়েছে");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "সার্ভারে সমস্যা হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[28px] max-w-lg w-full p-4 sm:p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 sm:mb-6 pr-8 sm:pr-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Calendar size={22} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">বাসা ছাড়ার নোটিশ</h2>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">বাড়িওয়ালাকে অগ্রিম প্রস্থান নোটিশ পাঠান</p>
          </div>
        </div>

        {/* Policy Alert Note */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50 mb-6">
          <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-semibold">
            সাধারণত বাড়ি ছাড়ার কমপক্ষে <span className="font-black text-amber-900 dark:text-amber-200">১ মাস (৩০ দিন)</span> পূর্বে নোটিশ প্রদান করতে হয় যাতে বাড়িওয়ালা জামানত ফেরত ও নতুন ভাড়াটিয়া সমন্বয়ের ব্যবস্থা নিতে পারেন।
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
              সম্ভাব্য প্রস্থান তারিখ (Expected Move-Out Date) *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                min={minDate.toISOString().split("T")[0]}
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
              বাসা ছাড়ার মূল কারণ (Reason)
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {PRESET_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
              অতিরিক্ত মন্তব্য বা বিবরণ (ঐচ্ছিক)
            </label>
            <textarea
              rows={3}
              placeholder="যেমন: আগামী মাসের শেষে সিকিউরিটি ডিপোজিট ও মিটার রিডিং সমন্বয় সংক্রান্ত..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} /> নোটিশ জমা দিন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoveOutNoticeModal;
