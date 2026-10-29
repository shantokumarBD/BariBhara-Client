import { Phone, MessageCircle, AlertTriangle, ShieldAlert, Zap, Flame, Droplets } from "lucide-react";

interface EmergencyContactsCardProps {
  landlordPhone?: string;
  landlordName?: string;
}

const EmergencyContactsCard = ({ landlordPhone, landlordName }: EmergencyContactsCardProps) => {
  const hotlines = [
    {
      name: "জাতীয় জরুরি সেবা (৯৯৯)",
      desc: "পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস",
      number: "999",
      icon: ShieldAlert,
      color: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-900/40",
    },
    {
      name: "বিদ্যুৎ জরুরি সেবা (১৬৯৯৯)",
      desc: "ডেসকো, ডিপিডিসি ও বিদ্যুৎ অভিযোগ",
      number: "16999",
      icon: Zap,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/40",
    },
    {
      name: "গ্যাস জরুরি কন্ট্রোল রুম (১৬৪৯৬)",
      desc: "তিতাস ও গ্যাস লিকেজ জরুরি সহায়তা",
      number: "16496",
      icon: Flame,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-900/40",
    },
    {
      name: "ওয়াসা হেল্পলাইন (১৬১৬২)",
      desc: "পানি সরবরাহ ও ড্রেনেজ সমস্যা",
      number: "16162",
      icon: Droplets,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
    },
  ];

  const formatWhatsAppNumber = (phone?: string) => {
    if (!phone) return "";
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "88" + clean;
    return clean;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-slate-100">জরুরি যোগাযোগ ও হটলাইন</h3>
            <p className="text-xs font-bold text-slate-400">যেকোনো দুর্ঘটনায় তাৎক্ষণিক ১-ক্লিক কল</p>
          </div>
        </div>
      </div>

      {/* Landlord direct contact */}
      {landlordPhone && (
        <div className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">বাড়িওয়ালার নম্বর</span>
            <p className="font-black text-slate-800 dark:text-slate-100 text-sm mt-0.5">
              {landlordName || "বাড়িওয়ালা"}: <span className="text-slate-600 dark:text-slate-300 font-bold">{landlordPhone}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${landlordPhone}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all shadow-sm"
            >
              <Phone size={14} /> কল করুন
            </a>
            <a
              href={`https://wa.me/${formatWhatsAppNumber(landlordPhone)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-sm"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Grid of National Hotlines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {hotlines.map((hotline) => {
          const Icon = hotline.icon;
          return (
            <div
              key={hotline.number}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all hover:scale-[1.01] ${hotline.color}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/80 shadow-xs">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black">{hotline.name}</h4>
                  <p className="text-[10px] font-semibold opacity-80">{hotline.desc}</p>
                </div>
              </div>
              <a
                href={`tel:${hotline.number}`}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl font-black text-xs shadow-xs hover:shadow transition-all shrink-0 flex items-center gap-1"
              >
                <Phone size={12} /> কল
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyContactsCard;
