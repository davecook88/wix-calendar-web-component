export function convertWixImageUrl(wixImageUrl?: string) {
  if (!wixImageUrl) {
    return "";
  }
  // Extract the image ID from the URL
  const match = wixImageUrl.match(/v1\/([^/]+)\//);
  const imageId = match ? match[1] : "";

  // Build the new URL format
  return `https://static.wixstatic.com/media/${imageId}`;
}

export function createFixedPriceBookingUrl(options: {
  serviceId: string;
  resourceId: string;
  startDate: string;
  endDate: string;
}) {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const base = "https://www.thriveinspanish.com/booking-form";

  // Create the continue shopping URL
  const continueShoppingUrl = encodeURIComponent(
    "/booking-calendar/one-to-one-structured-class-2"
  );

  const params = new URLSearchParams({
    referral: "booking_calendar_widget",
    continueShoppingUrl: `${continueShoppingUrl}?timezone=${encodeURIComponent(
      localTimezone
    )}`,
    serviceId: options.serviceId,
    resourceId: options.resourceId,
    startDate: options.startDate,
    endDate: options.endDate,
    timezone: localTimezone,
  });

  const url = `${base}?${params.toString()}`;
  console.log("createFixedPriceBookingUrl", url);
  return url;
}
