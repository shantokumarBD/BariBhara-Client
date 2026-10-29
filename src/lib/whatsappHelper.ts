/**
 * Utility to generate 1-click WhatsApp Rent Reminder links for landlords
 */
export interface WhatsAppReminderParams {
  phone: string;
  tenantName: string;
  unitName?: string;
  month: string;
  amount: number | string;
  bkashNumber?: string;
  landlordName?: string;
}

export const generateWhatsAppRentReminderUrl = ({
  phone,
  tenantName,
  unitName,
  month,
  amount,
  bkashNumber,
  landlordName,
}: WhatsAppReminderParams): string => {
  // Format BD phone number: remove non-digits, ensure 880 prefix
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "88" + cleanPhone;
  } else if (!cleanPhone.startsWith("88") && cleanPhone.length === 10) {
    cleanPhone = "880" + cleanPhone;
  }

  const message = `আসসালামু আলাইকুম ${tenantName || "সম্মানিত ভাড়াটিয়া"},
আপনার${unitName ? ` (${unitName})` : ""} ${month} মাসের বাড়ি ভাড়া ৳${amount}/- টাকা বকেয়া রয়েছে।${
    bkashNumber ? `\n\nবিকাশ/নগদ নম্বর: ${bkashNumber}` : ""
  }
দয়া করে দ্রুত পরিশোধ করার জন্য অনুরোধ জানানো হচ্ছে।

ধন্যবাদ,${landlordName ? `\n${landlordName}` : "\nবাড়িওয়ালা"}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

export const openWhatsAppRentReminder = (params: WhatsAppReminderParams) => {
  const url = generateWhatsAppRentReminderUrl(params);
  window.open(url, "_blank", "noopener,noreferrer");
};
