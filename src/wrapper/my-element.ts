import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  CalendarEvent,
  Service,
  Staff,
  AvailabilitySlot,
  ServiceType,
  AggregatedSlot,
  PricingPlan,
} from "../types";
import { styles } from "./styles";
import "../service-type-component";
import "../popup/base";
import "../popup/content-selector";
import "../popup/group-class";
import "../popup/appointment";
import { convertWixImageUrl } from "../utils";

@customElement("teaching-calendar")
export class MyElement extends LitElement {
  private calendar?: Calendar;

  @property({ type: Array })
  services: Service[] = [];

  @property({ type: Array })
  teachers: Staff[] = [];

  @property({ type: Array })
  availability: AvailabilitySlot[] = [];

  @property({ type: Array })
  plans: PricingPlan[] = [];

  @property({ type: String })
  selectedType: ServiceType = "APPOINTMENT";

  @property({ type: Object })
  selectedEvent: CalendarEvent | null = null;

  @property({ attribute: "services" })
  set servicesAttr(value: string) {
    try {
      this.services = JSON.parse(value);
      this.updateCalendarEvents();
    } catch (e) {
      console.error("Error parsing services:", e);
    }
  }

  @property({ attribute: "teachers" })
  set teachersAttr(value: string) {
    try {
      this.teachers = JSON.parse(value);
      this.updateCalendarEvents();
    } catch (e) {
      console.error("Error parsing teachers:", e);
    }
  }

  @property({ attribute: "availability" })
  set availabilityAttr(value: string) {
    try {
      this.availability = JSON.parse(value);
      this.updateCalendarEvents();
    } catch (e) {
      console.error("Error parsing availability:", e);
    }
  }

  @property({ attribute: "plans" })
  set plansAttr(value: string) {
    try {
      this.plans = JSON.parse(value);
    } catch (e) {
      console.error("Error parsing plans:", e);
    }
  }

  static styles = styles;

  private formatRegularEvents(): CalendarEvent[] {
    return this.availability
      .filter((slot) => {
        const service = this.services.find(
          (s) => s._id === slot.slot.serviceId
        );
        return service && service.type === this.selectedType && !service.hidden;
      })
      .map((slot) => {
        const service = this.services.find(
          (s) => s._id === slot.slot.serviceId
        );

        const { startDate, endDate } = slot.slot;
        const teacher = this.teachers.find(
          (t) => t._id === slot.slot.resource._id
        );
        console.log("found teacher", teacher);

        const teacherOptions = [
          {
            id: slot.slot.resource._id,
            services: [
              {
                id: slot.slot.serviceId,
                durationMinutes:
                  (new Date(endDate).getTime() -
                    new Date(startDate).getTime()) /
                  (1000 * 60),
              },
            ],
            name: teacher?.name || slot.slot.resource.name,
            imageUrl: convertWixImageUrl(teacher?.image),
            hexColor: "#808080",
          },
        ];

        return {
          title: service?.name || "Unnamed Event",
          start: startDate,
          end: endDate,
          backgroundColor: slot.bookable ? "#FF5722" : "#F5F5F5",
          borderColor: slot.bookable ? "#F4511E" : "#E0E0E0",
          textColor: slot.bookable ? "#FFFFFF" : "#333333",
          classNames: ["calendar-event"],
          extendedProps: {
            sessionId: slot.slot.sessionId,
            isAggregated: false,
            serviceType: service?.type,
            teacherName: teacher?.name || slot.slot.resource.name,
            bookable: slot.bookable,
            openSpots: slot.openSpots,
            totalSpots: slot.totalSpots,
            teacherOptions,
            service,
          },
        };
      });
  }

  private formatAggregatedAppointments(): CalendarEvent[] {
    const appointmentSlots = this.availability.filter((slot) => {
      const service = this.services.find((s) => s._id === slot.slot.serviceId);
      return service && service.type === "APPOINTMENT" && !service.hidden;
    });

    const aggregatedSlots = new Map<string, AggregatedSlot>();

    appointmentSlots.forEach((slot) => {
      const startTime = new Date(slot.slot.startDate);
      const slotKey = startTime.toISOString().slice(0, 14);
      const { startDate, endDate } = slot.slot;
      const teacher = this.teachers.find(
        (t) => t._id === slot.slot.resource._id
      );

      const teacherService = {
        id: slot.slot.serviceId,
        durationMinutes:
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60),
        service: this.services.find((s) => s._id === slot.slot.serviceId),
      };

      const teacherOption = {
        id: slot.slot.resource._id,
        services: [teacherService],
        name: teacher?.name || slot.slot.resource.name,
        imageUrl: convertWixImageUrl(teacher?.image),
        hexColor: "#808080",
        startUtc: startTime.toISOString(),
      };

      if (!aggregatedSlots.has(slotKey)) {
        aggregatedSlots.set(slotKey, {
          start: startTime,
          end: new Date(startTime.getTime() + 60 * 60 * 1000),
          teacherOptions: [teacherOption],
        });
      } else {
        const aggSlot = aggregatedSlots.get(slotKey);
        if (!aggSlot) return;

        const existingTeacher = aggSlot.teacherOptions.find(
          (t) => t.id === teacherOption.id
        );

        if (!existingTeacher) {
          aggSlot.teacherOptions.push(teacherOption);
        } else {
          // Check if this service duration doesn't already exist for this teacher
          const hasServiceDuration = existingTeacher.services.some(
            (s) => s.durationMinutes === teacherService.durationMinutes
          );
          if (!hasServiceDuration) {
            existingTeacher.services.push(teacherService);
          }
        }
      }
    });

    return Array.from(aggregatedSlots.values()).map((slot) => {
      // Count total available time slots
      const totalSlots = slot.teacherOptions.reduce(
        (sum, teacher) => sum + teacher.services.length,
        0
      );

      return {
        title: `Available Appointments (${totalSlots} slots)`,
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        backgroundColor: "#FF5722",
        borderColor: "#F4511E",
        textColor: "#FFFFFF",
        classNames: ["calendar-event"],
        extendedProps: {
          isAggregated: true,
          teacherOptions: slot.teacherOptions,
          bookable: true,
        },
      };
    });
  }

  private updateCalendarEvents() {
    if (!this.calendar || !this.services.length) return;

    const events =
      this.selectedType === "APPOINTMENT"
        ? this.formatAggregatedAppointments()
        : this.formatRegularEvents();

    this.calendar.removeAllEvents();
    this.calendar.addEventSource(events);
  }

  private handleEventClick(info: any) {
    const eventDetails = {
      ...info.event.toPlainObject(),
      extendedProps: info.event.extendedProps,
    };
    console.log("my-element handleEventClick", info.event);

    this.selectedEvent = eventDetails;
  }

  private handleDatesSet(info: any) {
    this.dispatchEvent(
      new CustomEvent("dateset", {
        detail: JSON.stringify({
          start: info.start.toISOString(),
          end: info.end.toISOString(),
        }),
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBooking(e: CustomEvent) {
    console.log("my-element handleBooking", e.detail);
    this.dispatchEvent(
      new CustomEvent("getPlans", {
        detail: JSON.stringify(e.detail),
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleViewPackagesSelected(e: CustomEvent) {
    console.log("my-element handleViewPackagesSelected", e.detail);
    const detail = JSON.parse(e.detail) as Service;

    this.dispatchEvent(
      new CustomEvent("get-plans", {
        detail: JSON.stringify(detail.payment.pricingPlanIds),
        bubbles: true,
        composed: true,
      })
    );
  }

  firstUpdated() {
    const calendarEl = this.shadowRoot?.querySelector(".calendar-container");
    if (calendarEl) {
      this.calendar = new Calendar(calendarEl as HTMLElement, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: "timeGridWeek",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        slotMinTime: "06:00:00",
        nowIndicator: true,
        allDaySlot: false,
        height: "auto",
        eventClick: this.handleEventClick.bind(this),
        datesSet: this.handleDatesSet.bind(this),
        eventClassNames: ["calendar-event"],
      });

      this.calendar.render();
    }
  }

  private handleTypeChange(e: CustomEvent<ServiceType>) {
    this.selectedType = e.detail;
    this.updateCalendarEvents();
  }

  render() {
    return html`
      <div class="calendar-wrapper">
        <h1>Thrive Calendar</h1>
        <service-type-selector
          .selectedType=${this.selectedType}
          @type-change=${this.handleTypeChange}
        ></service-type-selector>
        <div class="calendar-container"></div>
        <event-popup
          .event=${this.selectedEvent}
          .plans=${this.plans}
          @close=${() => (this.selectedEvent = null)}
          @book=${this.handleBooking}
          @view-packages-selected=${this.handleViewPackagesSelected}
        ></event-popup>
      </div>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.calendar?.destroy();
  }
}
