import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CalendarEvent } from "../../types";
import { convertWixImageUrl } from "../../utils";
import { styles } from "./styles";

@customElement("group-class-content")
export class GroupClassContent extends LitElement {
  @property({ type: Object })
  event: CalendarEvent | null = null;

  static styles = styles;

  private generateBookingUrl(sessionId: string) {
    // example url
    // https://www.thriveinspanish.com/booking-form?bookings_sessionId=193ZPR9ppP9emJUCLevcLf6orynNEIDt5nc0520xjGQILnPPaF5s62yK3BWz7ExgIRM1ICBdzeB3Oyc9kaXTwIC9K42fkNZRPYJSjmABRmWZCULmJGkma9sfuriHLRkdYUCu1Oy5Ki11pNJ1LEP8pl2TpGve14zMoZpVjCaa9UiEnvVV4V9f8zRRtmTs66wVg60HX7eJiZLhF4MHIjNewpU95aFrYCSz7r3P8utAoOt25UXKmQBc2jVzJ9uz415IwpvxRWwNAQEFHjcrrlxL5oiIKMlsOeiwmqRVopquMzL4yB7BHQ1ilgOJsGKg8xeq5ZmCIvNfsp81Qz&bookings_timezone=UTC
    if (!this.event) return "#";

    const base = "https://www.thriveinspanish.com/booking-form";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const params = new URLSearchParams({
      bookings_sessionId: sessionId,
      bookings_timezone: timezone,
    });
    return `${base}?${params.toString()}`;
  }

  render() {
    if (!this.event) return html``;

    const {
      totalSpots,
      openSpots = 0,
      service,
      sessionId,
    } = this.event.extendedProps;
    const startDate = new Date(this.event.start);
    const endDate = new Date(this.event.end);
    const duration = Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60)
    );

    return html`
      <div class="popup-content">
        ${service?.media?.mainMedia?.image
          ? html`
              <img
                class="service-image"
                src="${convertWixImageUrl(service.media.mainMedia.image)}"
                alt="${service.name}"
              />
            `
          : ""}

        <h2 class="service-title">${this.event.title}</h2>
        ${service?.tagLine
          ? html` <p class="service-tagline">${service.tagLine}</p> `
          : ""}

        <div class="session-info">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-icon">📅</span>
              ${startDate.toLocaleDateString()}
              ${startDate.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
            <div class="info-item">
              <span class="info-icon">⏱️</span>
              ${duration} minutes
            </div>
            <div class="info-item">
              <span class="info-icon">👥</span>
              Max capacity: ${totalSpots} students
            </div>
          </div>
        </div>

        ${service?.description
          ? html` <div class="description">${service.description}</div> `
          : ""}

        <div class="cta-section">
          ${this.renderPriceTag()}
          <div class="spots-left ${openSpots <= 2 ? "last-chance" : ""}">
            ${openSpots} spots remaining out of ${totalSpots}
          </div>
          ${this.event.extendedProps.bookable && openSpots > 0
            ? html`
                <a
                  class="book-button"
                  href=${this.generateBookingUrl(sessionId as string)}
                  target="_blank"
                >
                  Book Now
                </a>
              `
            : html`
                <button class="book-button" disabled>
                  ${openSpots === 0 ? "Class Full" : "Not Available"}
                </button>
              `}
        </div>
      </div>
    `;
  }

  private renderPriceTag() {
    const service = this.event?.extendedProps.service;
    if (!service) return "";

    const fixedPrice = service.payment.fixed?.price;
    if (!fixedPrice) return "";

    return html`
      <div class="price-tag">${fixedPrice.currency} ${fixedPrice.value}</div>
    `;
  }
}
