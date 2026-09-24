import { getSelectionPriceLabel, isAllPhotosPackage, pricing } from "../data/pricing";
import { buildWhatsAppUrl } from "../data/site";

const gallery = document.querySelector<HTMLElement>("[data-event-gallery]");

if (gallery) {
  const grid = gallery.querySelector<HTMLUListElement>(".event-gallery__grid");
  const photos = Array.from(
    gallery.querySelectorAll<HTMLButtonElement>("[data-photo-select]"),
  ).map((button, index) => ({
    button,
    code: button.dataset.photoCode ?? "",
    index,
    image: button.querySelector<HTMLImageElement>("[data-photo-image]"),
  }));
  const photosByCode = new Map(photos.map((photo) => [photo.code, photo]));
  const selectedCodes = new Set<string>();
  const selectionBar = gallery.querySelector<HTMLElement>("[data-selection-bar]");
  const selectionCount = gallery.querySelector<HTMLElement>("[data-selection-count]");
  const selectionPrice = gallery.querySelector<HTMLElement>("[data-selection-price]");
  const selectionStatus = gallery.querySelector<HTMLElement>("[data-selection-status]");
  const selectionJump = gallery.querySelector<HTMLAnchorElement>("[data-selection-jump]");
  const clearButton = gallery.querySelector<HTMLButtonElement>("[data-clear-selection]");
  const buyButton = gallery.querySelector<HTMLButtonElement>("[data-buy-selection]");
  const lightbox = gallery.querySelector<HTMLDialogElement>("[data-photo-lightbox]");
  const lightboxStage = gallery.querySelector<HTMLElement>(".photo-lightbox__stage");
  const lightboxImage = gallery.querySelector<HTMLImageElement>("[data-lightbox-image]");
  const lightboxCode = gallery.querySelector<HTMLElement>("[data-lightbox-code]");
  const lightboxClose = gallery.querySelector<HTMLButtonElement>("[data-lightbox-close]");
  const lightboxPrevious = gallery.querySelector<HTMLButtonElement>("[data-lightbox-previous]");
  const lightboxNext = gallery.querySelector<HTMLButtonElement>("[data-lightbox-next]");
  const lightboxSelect = gallery.querySelector<HTMLButtonElement>("[data-lightbox-select]");
  const eventName = gallery.dataset.eventName ?? "este evento";
  const storageKey = gallery.dataset.storageKey ?? "black-sheep-selection";
  let currentPhotoIndex = -1;
  let lightboxTrigger: HTMLButtonElement | null = null;
  let swipeStart: { pointerId: number; x: number; y: number } | null = null;

  const getOrderedCodes = () =>
    Array.from(selectedCodes).sort(
      (a, b) => (photosByCode.get(a)?.index ?? 0) - (photosByCode.get(b)?.index ?? 0),
    );

  const saveSelection = () => {
    try {
      const codes = getOrderedCodes();
      if (codes.length === 0) localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, JSON.stringify(codes));
    } catch {
      // La galería sigue funcionando si el navegador bloquea localStorage.
    }
  };

  const updateLightboxSelection = () => {
    if (!lightboxSelect || currentPhotoIndex < 0) return;
    const code = photos[currentPhotoIndex]?.code ?? "";
    const isSelected = selectedCodes.has(code);
    lightboxSelect.dataset.selected = String(isSelected);
    lightboxSelect.setAttribute("aria-pressed", String(isSelected));
    lightboxSelect.setAttribute("aria-label", `Seleccionar foto ${code}`);
    lightboxSelect.textContent = "Seleccionar foto";
  };

  const updatePhoto = (code: string) => {
    const button = photosByCode.get(code)?.button;
    if (!button) return;
    const isSelected = selectedCodes.has(code);
    button.dataset.selected = String(isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  };

  const updateSummary = (announce = true) => {
    const count = selectedCodes.size;
    const total = photos.length;
    const hasSelection = count > 0;
    if (selectionCount) {
      selectionCount.textContent = count === 1 ? "1 foto seleccionada" : `${count} fotos seleccionadas`;
    }
    if (selectionPrice) selectionPrice.textContent = getSelectionPriceLabel(count);
    if (buyButton) buyButton.textContent = count === 1 ? "Comprar seleccionada" : "Comprar seleccionadas";
    if (selectionBar) selectionBar.hidden = !hasSelection;
    if (selectionJump) selectionJump.hidden = !hasSelection;
    gallery.dataset.hasSelection = String(hasSelection);
    if (hasSelection) document.documentElement.dataset.eventSelectionActive = "true";
    else delete document.documentElement.dataset.eventSelectionActive;
    if (announce && selectionStatus) {
      selectionStatus.textContent = `${count} ${count === 1 ? "foto seleccionada" : "fotos seleccionadas"} de ${total}.`;
    }
    updateLightboxSelection();
  };

  const toggleSelection = (code: string) => {
    if (!photosByCode.has(code)) return;
    if (selectedCodes.has(code)) selectedCodes.delete(code);
    else selectedCodes.add(code);
    updatePhoto(code);
    updateSummary();
    saveSelection();
  };

  const showLightboxPhoto = (index: number) => {
    const photo = photos[index];
    if (!photo?.image || !lightboxImage || !lightboxCode) return;
    currentPhotoIndex = index;
    lightboxCode.textContent = photo.code;
    lightboxImage.alt = photo.image.alt;
    lightboxImage.src = photo.image.getAttribute("src") ?? photo.image.currentSrc;
    const previousWillBeDisabled = index === 0;
    const nextWillBeDisabled = index === photos.length - 1;
    if (document.activeElement === lightboxPrevious && previousWillBeDisabled) {
      (nextWillBeDisabled ? lightboxSelect : lightboxNext)?.focus({ preventScroll: true });
    }
    if (document.activeElement === lightboxNext && nextWillBeDisabled) {
      (previousWillBeDisabled ? lightboxSelect : lightboxPrevious)?.focus({ preventScroll: true });
    }
    if (lightboxPrevious) lightboxPrevious.disabled = previousWillBeDisabled;
    if (lightboxNext) lightboxNext.disabled = nextWillBeDisabled;
    updateLightboxSelection();
  };

  const openLightbox = (photo: (typeof photos)[number], trigger: HTMLButtonElement) => {
    if (!lightbox || !lightboxClose) return;
    lightboxTrigger = trigger;
    showLightboxPhoto(photo.index);
    lightbox.showModal();
    lightboxClose.focus({ preventScroll: true });
  };

  const moveLightbox = (direction: -1 | 1) => {
    const nextIndex = currentPhotoIndex + direction;
    if (nextIndex < 0 || nextIndex >= photos.length) return;
    showLightboxPhoto(nextIndex);
  };

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    if (Array.isArray(stored)) {
      for (const code of stored) {
        if (typeof code === "string" && photosByCode.has(code)) selectedCodes.add(code);
      }
    }
  } catch {
    // Un valor inválido o inaccesible no impide usar la galería.
  }

  selectedCodes.forEach(updatePhoto);
  updateSummary(false);

  // Delegación única para selección y apertura, sin búsquedas por toda la galería en cada acción.
  grid?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const expandButton = target.closest<HTMLButtonElement>("[data-photo-expand]");
    if (expandButton && grid.contains(expandButton)) {
      const item = expandButton.closest(".event-gallery__item");
      const selectButton = item?.querySelector<HTMLButtonElement>("[data-photo-select]");
      const photo = selectButton?.dataset.photoCode
        ? photosByCode.get(selectButton.dataset.photoCode)
        : undefined;
      if (photo) openLightbox(photo, expandButton);
      return;
    }
    const button = target.closest<HTMLButtonElement>("[data-photo-select]");
    if (!button || !grid.contains(button)) return;
    const code = button.dataset.photoCode;
    if (code) {
      toggleSelection(code);
      const item = button.closest(".event-gallery__item");
      if (item && selectionJump && selectedCodes.size > 0) item.append(selectionJump);
      else if (grid && selectionJump) grid.before(selectionJump);
    }
  });

  selectionJump?.addEventListener("click", (event) => {
    event.preventDefault();
    buyButton?.focus({ preventScroll: true });
  });

  lightboxClose?.addEventListener("click", () => lightbox?.close());
  lightboxPrevious?.addEventListener("click", () => moveLightbox(-1));
  lightboxNext?.addEventListener("click", () => moveLightbox(1));
  lightboxStage?.addEventListener("pointerdown", (event) => {
    if (
      !lightbox?.open ||
      event.pointerType !== "touch" ||
      !window.matchMedia("(pointer: coarse)").matches ||
      !event.isPrimary
    ) return;
    swipeStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget instanceof HTMLElement && event.currentTarget.setPointerCapture(event.pointerId);
  });
  lightboxStage?.addEventListener("pointerup", (event) => {
    const start = swipeStart;
    swipeStart = null;
    if (!start || start.pointerId !== event.pointerId || !lightbox?.open) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) return;
    moveLightbox(deltaX < 0 ? 1 : -1);
  });
  lightboxStage?.addEventListener("pointercancel", () => {
    swipeStart = null;
  });
  lightboxSelect?.addEventListener("click", () => {
    const code = photos[currentPhotoIndex]?.code;
    if (code) toggleSelection(code);
  });
  lightbox?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveLightbox(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveLightbox(1);
    }
  });
  lightbox?.addEventListener("close", () => {
    lightboxImage?.removeAttribute("src");
    lightboxTrigger?.focus({ preventScroll: true });
  });
  clearButton?.addEventListener("click", () => {
    const codesToClear = Array.from(selectedCodes);
    selectedCodes.clear();
    codesToClear.forEach(updatePhoto);
    saveSelection();
    updateSummary();
  });
  buyButton?.addEventListener("click", () => {
    const codes = getOrderedCodes();
    if (codes.length === 0) return;
    const message = codes.length === 1
      ? `Hola, vi mis fotos de ${eventName} y seleccioné esta foto: ${codes[0]}. Vi que una foto cuesta ${pricing.singlePhoto.price} ${pricing.unit}. ¿Me ayudas con la compra?`
      : codes.length === 2
        ? `Hola, vi mis fotos de ${eventName} y seleccioné estas fotos: ${codes.join(", ")}. Vi que dos fotos cuestan ${pricing.twoPhotos.price} ${pricing.unit}. ¿Me ayudas con la compra?`
        : `Hola, vi mis fotos de ${eventName} y seleccioné estas fotos: ${codes.join(", ")}. Vi que tienen el paquete ${pricing.allPhotos.label} por ${pricing.allPhotos.price} ${pricing.unit}. ¿Me ayudas con la compra?`;
    const link = document.createElement("a");
    link.href = buildWhatsAppUrl(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  });
}
