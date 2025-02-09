import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CalendarEvent } from "../../types";
import { convertWixImageUrl } from "../../utils";

@customElement("group-class-content")
export class GroupClassContent extends LitElement {
  @property({ type: Object })
  event: CalendarEvent | null = null;

  static styles = css`
    .popup-header {
      position: sticky;
      top: 0;
      background: white;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .popup-content {
      padding: 2rem;
    }

    .service-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .service-type-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #ff5722;
      color: white;
      border-radius: 1rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .service-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .service-tagline {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 1.5rem;
    }

    .session-info {
      background: #f8f8f8;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
    }

    .description {
      color: #444;
      line-height: 1.6;
      margin-bottom: 2rem;
      white-space: pre-wrap;
    }

    .cta-section {
      text-align: center;
      padding: 1rem;
      background: #f8f8f8;
      border-radius: 8px;
    }

    .price-tag {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
    }

    .spots-left {
      color: #4caf50;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .spots-left.last-chance {
      color: #f44336;
    }

    .book-button {
      background: #ff5722;
      color: white;
      border: none;
      border-radius: 2rem;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      width: 100%;
      max-width: 300px;
    }

    .book-button:hover {
      background: #f4511e;
    }

    .book-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `;

  private handleBooking() {
    if (!this.event) return;

    const { teacherOptions } = this.event.extendedProps;
    const teacherOption = teacherOptions[0];
    const serviceId = teacherOption.services[0].id;

    this.dispatchEvent(
      new CustomEvent("booking-selected", {
        detail: {
          teacherId: teacherOption.id,
          serviceId,
          startTime: this.event.start,
          endTime: this.event.end,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.event) return html``;

    const { totalSpots, openSpots = 0, service } = this.event.extendedProps;
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
                <button class="book-button" @click=${this.handleBooking}>
                  Book Now
                </button>
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
