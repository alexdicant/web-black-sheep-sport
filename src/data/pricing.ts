export interface PricingTier {
  label: string;
  price: string;
  unit?: string;
  isFeatured: boolean;
}

export const pricing = {
  singlePhoto: {
    label: "1 foto",
    price: "US$4",
  },
  twoPhotos: {
    label: "2 fotos",
    price: "US$7",
  },
  allPhotos: {
    label: "Todas tus fotos",
    price: "US$12",
    unit: "Por atleta",
    minimumPhotos: 3,
  },
} as const;

export const pricingTiers: PricingTier[] = [
  { label: pricing.singlePhoto.label, price: pricing.singlePhoto.price, isFeatured: false },
  { label: pricing.twoPhotos.label, price: pricing.twoPhotos.price, isFeatured: false },
  {
    label: pricing.allPhotos.label,
    price: pricing.allPhotos.price,
    unit: pricing.allPhotos.unit,
    isFeatured: true,
  },
];

export const isAllPhotosPackage = (count: number): boolean =>
  count >= pricing.allPhotos.minimumPhotos;

export const getSelectionPriceLabel = (count: number): string => {
  if (count === 1) return pricing.singlePhoto.price;
  if (count === 2) return pricing.twoPhotos.price;
  if (isAllPhotosPackage(count)) {
    return `Paquete disponible: ${pricing.allPhotos.label} · ${pricing.allPhotos.price} por atleta`;
  }
  return "";
};
