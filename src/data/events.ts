export interface EventItem {
  name: string;
  date: string;
  isoDate: string;
  location: string;
  url: string;
  isActive: boolean;
}

export const events: EventItem[] = [
  {
    name: "HAPPY WOD",
    date: "19 de septiembre de 2026",
    isoDate: "2026-09-19",
    location: "Be Happy",
    url: "/eventos/happy-wod/",
    isActive: true,
  },
  {
    name: "Fogueo Be Fit",
    date: "16 de octubre de 2025",
    isoDate: "2025-10-16",
    location: "Be Fit Mérida",
    url: "/eventos/fogueo-be-fit/",
    isActive: false,
  },
];

export const activeEvent = events.find((event) => event.isActive);
