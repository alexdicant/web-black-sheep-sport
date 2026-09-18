import type { ImageMetadata } from "astro";

export interface EventImageModule {
  default: ImageMetadata;
}

const PHOTO_CODE_PATTERN = /^[A-Za-z0-9_-]+$/;
const MAX_PHOTO_CODE_LENGTH = 40;
const naturalOrder = new Intl.Collator("es", { numeric: true, sensitivity: "base" });

export const buildEventPhotos = (
  eventPhotoModules: Record<string, EventImageModule>,
  eventName: string,
) => {
  const getPhotoCode = (fileName: string) => {
    const code = fileName.replace(/\.[^.]+$/, "");

    if (!PHOTO_CODE_PATTERN.test(code) || code.length > MAX_PHOTO_CODE_LENGTH) {
      throw new Error(
        `Invalid photo code in ${eventName}: "${fileName}". ` +
          "Photo filenames may only produce codes containing letters (A-Z, a-z), numbers, '_' and '-', with a maximum length of 40 characters.",
      );
    }

    return code;
  };

  const photos = Object.entries(eventPhotoModules).map(([path, imageModule]) => {
    const fileName = path.split("/").at(-1) ?? path;
    const code = getPhotoCode(fileName);

    return { src: imageModule.default, code, fileName };
  });

  const seenCodes = new Map<string, string>();

  for (const photo of photos) {
    const normalizedCode = photo.code.toLowerCase();
    const previousFileName = seenCodes.get(normalizedCode);

    if (previousFileName) {
      throw new Error(
        `Duplicate photo code in ${eventName}: "${previousFileName}" and "${photo.fileName}" produce the same code when compared case-insensitively. ` +
          "Photo codes must be unique after removing the extension.",
      );
    }

    seenCodes.set(normalizedCode, photo.fileName);
  }

  return photos.sort((a, b) => naturalOrder.compare(a.code, b.code));
};
