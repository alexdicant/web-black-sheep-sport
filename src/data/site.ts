export const site = {
  whatsapp: {
    number: "584247438483",
    displayNumber: "+58 424-7438483",
  },
  social: {
    studioInstagram: "https://www.instagram.com/black_sheep_pro/",
  },
  contact: {
    email: "info@sheepsport.com",
  },
} as const;

export const buildWhatsAppUrl = (message?: string): string => {
  const baseUrl = `https://wa.me/${site.whatsapp.number}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};
