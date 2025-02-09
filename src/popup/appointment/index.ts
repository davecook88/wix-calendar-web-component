import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CalendarEvent, TeacherOption } from "../../types";

@customElement("appointment-content")
export class AppointmentContent extends LitElement {
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
      padding: 1rem;
    }

    .time-slot {
      color: #666;
      margin-top: 0.25rem;
    }

    .teacher-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin: 1.5rem 0;
      max-width: 800px;
    }

    .teacher-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .teacher-card.bookable:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .teacher-card.not-bookable {
      opacity: 0.7;
    }

    .teacher-image-name-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .teacher-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border: 3px solid #ff5722;
      border-radius: 50%;
    }

    .teacher-info {
      padding: 1rem;
    }

    .teacher-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .booking-options {
      margin-top: 1rem;
      border-top: 1px solid #eee;
      padding-top: 1rem;
    }

    .booking-options-title {
      font-size: 1rem;
      font-weight: 500;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .booking-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f5f5f5;
    }

    .booking-time {
      font-size: 0.875rem;
      color: #666;
    }

    .booking-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .book-teacher {
      padding: 0.5rem 1rem;
      background: #ff5722;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      text-decoration: none;
      text-align: center;
    }

    .book-teacher:hover {
      background: #f4511e;
    }

    .book-package {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .book-package:hover {
      background-color: #e9e9e9;
    }

    .not-available-badge {
      background: #f5f5f5;
      color: #666;
      text-align: center;
      padding: 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-style: italic;
    }
  `;

  private handleBooking(
    teacher: TeacherOption,
    serviceId: string,
    duration: number
  ) {
    console.log("handleBooking", teacher, serviceId, duration);
    this.dispatchEvent(
      new CustomEvent("booking-selected", {
        detail: {
          teacherId: teacher.id,
          serviceId,
          startTime: this.event?.start,
          endTime: this.event?.end,
          duration,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private createBookingUrl(
    teacher: TeacherOption,
    serviceId: string,
    duration: number
  ) {
    if (!this.event) return "#";

    const startDate = new Date(this.event.start);
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

    const base = "https://www.thriveinspanish.com/booking-form";
    const params = new URLSearchParams({
      bookings_serviceId: serviceId,
      bookings_resourceId: teacher.id,
      bookings_startDate: startDate.toISOString(),
      bookings_endDate: endDate.toISOString(),
      bookings_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return `${base}?${params.toString()}`;
  }

  render() {
    if (!this.event) return html``;
    const { teacherOptions } = this.event.extendedProps;
    const startDate = new Date(this.event.start);
    const endDate = new Date(this.event.end);

    return html`
      <div class="popup-header">
        <div>
          <h3 class="popup-title">Available Teachers</h3>
          <p class="time-slot">
            ${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}
            - ${endDate.toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div class="popup-content">
        <div class="teacher-options">
          ${teacherOptions.map((teacher) => this.renderTeacherCard(teacher))}
        </div>
      </div>
    `;
  }

  private renderTeacherCard(teacher: TeacherOption) {
    if (!this.event) return html``;
    const bookable = this.event.extendedProps.bookable;
    console.log("teacher", teacher);

    return html`
      <div class="teacher-card ${bookable ? "bookable" : "not-bookable"}">
        <div class="teacher-info">
          <div class="teacher-image-name-wrapper">
            ${teacher.imageUrl
              ? html`<img
                  class="teacher-image"
                  src="${teacher.imageUrl}"
                  alt="${teacher.name}"
                />`
              : html`<div
                  class="teacher-image"
                  style="background-color: ${teacher.hexColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;"
                >
                  ${teacher.name.charAt(0)}
                </div>`}
            <h4 class="teacher-name">${teacher.name}</h4>
          </div>

          ${bookable
            ? this.renderBookingOptions(teacher)
            : html`
                <div class="not-available-badge">Currently Unavailable</div>
              `}
        </div>
      </div>
    `;
  }

  private renderBookingOptions(teacher: TeacherOption) {
    return html`
      <div class="booking-options">
        <h5 class="booking-options-title">Available Classes:</h5>
        ${teacher.services
          .sort((a, b) => a.durationMinutes - b.durationMinutes)
          .map((service) => {
            if (!this.event) return html``;
            const startDate = new Date(this.event.start);
            const serviceEndDate = new Date(
              startDate.getTime() + service.durationMinutes * 60 * 1000
            );

            return html`
              <div class="booking-option">
                <div class="booking-time">
                  ${startDate.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  -
                  ${serviceEndDate.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
                <div class="booking-buttons">
                  <a
                    class="book-teacher"
                    href=${this.createBookingUrl(
                      teacher,
                      service.id,
                      service.durationMinutes
                    )}
                    target="_blank"
                  >
                    Book ${service.durationMinutes}m
                  </a>
                  <button
                    class="book-package"
                    @click=${() =>
                      this.handleBooking(
                        teacher,
                        service.id,
                        service.durationMinutes
                      )}
                  >
                    Book a package and save
                  </button>
                </div>
              </div>
            `;
          })}
      </div>
    `;
  }
}
