import { useState, useEffect } from "react";
import { X, ShieldCheck, DollarSign, Plus, Trash2, AlertCircle, Banknote, Calendar } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axiosInstance";

interface RepairItem {
  reason: string;
  amount: number;
}

interface DepositSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
  onSuccess?: () => void;
}

const DepositSettlementModal = ({
  isOpen,
  onClose,
  tenant,
  onSuccess,
}: DepositSettlementModalProps) => {
  const [unpaidDues, setUnpaidDues] = useState<number>(0);
  const [repairs, setRepairs] = useState<RepairItem[]>([]);
  const [newReason, setNewReason] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [refundMethod, setRefundMethod] = useState("Cash");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const originalDeposit = tenant?.advanceAmount || 0;

  useEffect(() => {
    if (tenant?._id && isOpen) {
      setRepairs([]);
      setNewReason("");
      setNewAmount("");
      setNotes("");
      // Fetch any pending due amount for this tenant
      api.get(`/api/rent/history/${tenant._id}`)
        .then((res) => {
          const invoices = res.data?.history || res.data?.invoices || [];
          const totalPending = invoices
            .filter((inv: any) => inv.status !== "Paid")
            .reduce((sum: number, inv: any) => sum + (inv.dueAmount || 0), 0);
          setUnpaidDues(totalPending);
        })
        .catch(() => setUnpaidDues(0));
    }
  }, [tenant?._id, isOpen]);

  if (!isOpen || !tenant) return null;

  const handleAddRepair = () => {
    if (!newReason.trim() || !newAmount || Number(newAmount) <= 0) {
      toast.error("ক্ষতিপূরণ/মেরামতের কারণ ও সঠিক টাকার পরিমাণ লিখুন");
      return;
    }
    setRepairs([...repairs, { reason: newReason.trim(), amount: Number(newAmount) }]);
    setNewReason("");
    setNewAmount("");
  };

  const handleRemoveRepair = (index: number) => {
    setRepairs(repairs.filter((_, i) => i !== index));
  };

  const totalRepairs = repairs.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = Number(unpaidDues) + totalRepairs;
  const netRefund = Math.max(0, originalDeposit - totalDeductions);
  const isDeficit = totalDeductions > originalDeposit;
  const deficitAmount = isDeficit ? totalDeductions - originalDeposit : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post(`/api/tenant/${tenant._id}/deposit-settlement`, {
        unpaidDuesDeduction: unpaidDues,
        repairDeductions: repairs,
        netRefundAmount: isDeficit ? 0 : netRefund,
        refundMethod,
        notes,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "জামানত নিষ্পত্তি সম্পন্ন হয়েছে এবং ইউনিটটি উন্মুক্ত করা হয়েছে!");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res.data?.message || "নিষ্পত্তি ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "সার্ভার এরর! পুনরায় চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[28px] max-w-xl w-full p-4 sm:p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 sm:mb-6 pr-8 sm:pr-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Banknote size={22} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">জামানত নিষ্পত্তি ও প্রস্থান ছাড়পত্র</h2>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {tenant.name} — {tenant.property?.name} ({tenant.unit?.unitName})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Deposit Info Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">সংরক্ষিত মূল জামানত (Deposit)</p>
              <p className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                ৳ {originalDeposit.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">বকেয়া বিল কর্তন (Unpaid Dues)</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-black text-red-500">
                  ৳ {unpaidDues.toLocaleString()}
                </span>
                {unpaidDues > 0 && (
                  <span className="text-[9px] px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 rounded font-black">
                    বকেয়া আছে
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Damage & Repair Deductions */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
              ক্ষতিপূরণ বা মেরামত কর্তন (Damage & Repairs)
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                placeholder="যেমন: ওয়াল রং / টাইলস ক্ষতিপূরণ"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="টাকার পরিমাণ"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="flex-1 sm:w-28 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddRepair}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-black text-xs transition-colors flex items-center justify-center gap-1 shrink-0"
                >
                  <Plus size={14} /> যোগ
                </button>
              </div>
            </div>

            {repairs.length > 0 && (
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40">
                {repairs.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs py-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.reason}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-red-500">- ৳{item.amount.toLocaleString()}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRepair(index)}
                        className="text-slate-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Net Settlement Calculation Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-2">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>মোট জামানত:</span>
              <span className="font-bold">৳ {originalDeposit.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-red-300">
              <span>মোট কর্তন (বকেয়া + ক্ষতিপূরণ):</span>
              <span className="font-black">- ৳ {totalDeductions.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  {isDeficit ? "ভাড়াটিয়ার কাছে পাওনা (Deficit Due)" : "ভাড়াটিয়াকে ফেরতযোগ্য নিট অর্থ (Net Refund)"}
                </p>
                <p className={`text-2xl font-black ${isDeficit ? "text-amber-400" : "text-emerald-400"}`}>
                  ৳ {(isDeficit ? deficitAmount : netRefund).toLocaleString()}
                </p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-[10px] font-bold">
                {isDeficit ? "অতিরিক্ত বকেয়া" : "ফেরত ভাউচার"}
              </span>
            </div>
          </div>

          {/* Refund Method & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                ফেরত প্রদানের মাধ্যম
              </label>
              <select
                value={refundMethod}
                onChange={(e) => setRefundMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs outline-none focus:border-primary"
              >
                <option value="Cash">নগদ (Cash)</option>
                <option value="bKash">বিকাশ (bKash)</option>
                <option value="Nagad">নগদ (Nagad)</option>
                <option value="Bank">ব্যাংক ট্রান্সফার (Bank)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                মন্তব্য (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: চাবি বুঝিয়ে পাওয়া গিয়েছে"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} /> নিষ্পত্তি সম্পন্ন ও ফ্ল্যাট খালি করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositSettlementModal;
