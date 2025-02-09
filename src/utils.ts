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
  const params = new URLSearchParams({
    bookings_serviceId: options.serviceId,
    bookings_resourceId: options.resourceId,
    bookings_startDate: options.startDate,
    bookings_endDate: options.endDate,
    bookings_timezone: localTimezone,
  });
  const url = `${base}?${params.toString()}`;
  console.log("createFixedPriceBookingUrl", url);
  return url;
}
