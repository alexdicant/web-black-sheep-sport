export type EventStatus = "upcoming" | "past";

export interface EventItem {
  slug: string;
  name: string;
  isoDate: string;
  location: string;
  status: EventStatus;
  featured: boolean;
}

export const events: EventItem[] = [
  {
    slug: "happy-wod",
    name: "HAPPY WOD",
    isoDate: "2026-09-19",
    location: "Be Happy",
    status: "past",
    featured: true,
  },
  {
    slug: "fogueo-be-fit",
    name: "Fogueo Be Fit",
    isoDate: "2025-10-16",
    location: "Be Fit Mérida",
    status: "past",
    featured: false,
  },
];

const compareByDateDescending = (a: EventItem, b: EventItem): number =>
  b.isoDate.localeCompare(a.isoDate);

export const getFeaturedEvent = (): EventItem => {
  const featuredEvents = events.filter((event) => event.featured);

  if (featuredEvents.length !== 1) {
    throw new Error(
      `Se esperaba exactamente un evento destacado para Home; se encontraron ${featuredEvents.length}.`,
    );
  }

  return featuredEvents[0];
};

export const getPastEvents = (): EventItem[] =>
  events
    .filter((event) => event.status === "past" && !event.featured)
    .sort(compareByDateDescending);

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
