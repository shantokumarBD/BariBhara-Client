import { useState } from "react";
import { X, Calendar, Clock, User, Phone, Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
  unitName?: string;
}

const ScheduleVisitModal = ({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  unitName,
}: ScheduleVisitModalProps) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState(tomorrow.toISOString().split("T")[0]);
  const [preferredTime, setPreferredTime] = useState("বিকেল ৪টা - সন্ধ্যা ৬টা");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !preferredDate) {
      toast.error("অনুগ্রহ করে আপনার নাম, ফোন নম্বর এবং তারিখ প্রদান করুন");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullMessage = preferredTime
        ? `[পছন্দের সময়: ${preferredTime}] ${message}`
        : message;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/public/schedule-visit`,
        {
          propertyId,
          name,
          phone,
          email,
          preferredDate,
          message: fullMessage,
        }
      );

      if (res.data.success) {
        toast.success(
          res.data.message || "বাসা দেখার অনুরোধ সফলভাবে পাঠানো হয়েছে! বাড়িওয়ালা দ্রুত যোগাযোগ করবেন।"
        );
        onClose();
      } else {
        toast.error(res.data.message || "অনুরোধ পাঠাতে ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "সার্ভারে সমস্যা হয়েছে! অনুগ্রহ করে সরাসরি কল করুন।");
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
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar size={22} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">বাসা দেখতে চাই</h2>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {propertyName} {unitName ? `(${unitName})` : ""} পরিদর্শনের জন্য শিডিউল করুন
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
              আপনার পুরো নাম *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="যেমন: তানভীর আহমেদ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                মোবাইল নম্বর *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                ইমেইল (ঐচ্ছিক)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                পছন্দের তারিখ *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                সুবিধাজনক সময়
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="সকাল ১০টা - দুপুর ১২টা">সকাল ১০টা - দুপুর ১২টা</option>
                <option value="দুপুর ১২টা - বিকেল ৩টা">দুপুর ১২টা - বিকেল ৩টা</option>
                <option value="বিকেল ৪টা - সন্ধ্যা ৬টা">বিকেল ৪টা - সন্ধ্যা ৬টা</option>
                <option value="সন্ধ্যা ৭টা - রাত ৯টা">সন্ধ্যা ৭টা - রাত ৯টা</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
              বার্তা বা বিশেষ জিজ্ঞাসা (ঐচ্ছিক)
            </label>
            <textarea
              rows={2}
              placeholder="যেমন: আমরা পরিবার নিয়ে আসব..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-black transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} /> অনুরোধ পাঠান
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleVisitModal;
