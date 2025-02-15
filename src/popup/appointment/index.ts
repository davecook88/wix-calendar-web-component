import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CalendarEvent, Service, TeacherOption } from "../../types";
import { styles } from "./styles";

@customElement("appointment-content")
export class AppointmentContent extends LitElement {
  @property({ type: Object })
  event: CalendarEvent | null = null;

  static styles = styles;

  private handleBooking(
    teacher: TeacherOption,
    serviceId: string,
    duration: number
  ) {
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

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const base = "https://www.thriveinspanish.com/booking-form";

    const params = new URLSearchParams({
      bookings_serviceId: serviceId,
      bookings_resourceId: teacher.id,
      bookings_startDate: startDate.toISOString(),
      bookings_endDate: endDate.toISOString(),
      bookings_timezone: timezone,
      numberOfParticipants: "1",
    });
    return `${base}?${params.toString()}`;
  }

  private handleViewPackages(teacher: TeacherOption, service: Service) {
    this.dispatchEvent(
      new CustomEvent("view-packages-selected", {
        detail: {
          teacherId: teacher.id,
          service: service,
        },
        bubbles: true,
        composed: true,
      })
    );

    this.handleBookingSelected(teacher, null, service);
  }

  private handleBookingSelected(
    teacher: TeacherOption,
    booking: any,
    service: Service
  ) {
    this.dispatchEvent(
      new CustomEvent("booking-selected", {
        detail: {
          teacherId: teacher.id,
          booking: booking,
          service: service,
        },
        bubbles: true,
        composed: true,
      })
    );
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

  private handleSelectViewPackages(teacherId: string, serviceId: string) {
    console.log("appointment - handleSelectViewPackages", teacherId);
    const teacher = this.event?.extendedProps.teacherOptions.find(
      (t) => t.id === teacherId
    );
    const service = teacher?.services.find((s) => s.id === serviceId);
    this.dispatchEvent(
      new CustomEvent("view-packages-selected", {
        detail: service?.service ? JSON.stringify(service?.service) : "{}",
        bubbles: true,
        composed: true,
      })
    );
    if (!service?.service || !teacher) return;
    this.handleBookingSelected(teacher, null, service?.service);
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
                      service.service?._id as string,
                      service.durationMinutes
                    )}
                    target="_blank"
                  >
                    Book ${service.durationMinutes}m
                  </a>
                  <button
                    class="book-package"
                    @click=${() =>
                      this.handleSelectViewPackages(teacher.id, service.id)}
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
