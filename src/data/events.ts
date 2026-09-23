export interface EventItem {
  slug: string;
  name: string;
  isoDate: string;
  location: string;
  isActive: boolean;
}

export const events: EventItem[] = [
  {
    slug: "happy-wod",
    name: "HAPPY WOD",
    isoDate: "2026-09-19",
    location: "Be Happy",
    isActive: true,
  },
  {
    slug: "fogueo-be-fit",
    name: "Fogueo Be Fit",
    isoDate: "2025-10-16",
    location: "Be Fit Mérida",
    isActive: false,
  },
];

export const activeEvent = events.find((event) => event.isActive);

export const getEventBySlug = (slug: string): EventItem => {
  const event = events.find((item) => item.slug === slug);
  if (!event) throw new Error(`No existe un evento con el slug "${slug}".`);
  return event;
};

export const getEventUrl = (event: Pick<EventItem, "slug">): string =>
  `/eventos/${event.slug}/`;

export const getEventStorageKey = (event: Pick<EventItem, "slug">): string =>
  `black-sheep-selection-${event.slug}`;

const eventDateFormatter = new Intl.DateTimeFormat("es-VE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const formatEventDate = (isoDate: string): string =>
  eventDateFormatter.format(new Date(`${isoDate}T00:00:00Z`));

export const getEventPageTitle = (event: Pick<EventItem, "name">): string =>
  `${event.name} | Black Sheep Sport`;

export const getEventPageDescription = (event: Pick<EventItem, "name">): string =>
  `Galería de fotografías de ${event.name}. Encuentra y selecciona tus fotos del evento.`;
