import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarEvent } from "../types";
import { styles } from "./styles";

@customElement("calendar-component")
export class CalendarComponent extends LitElement {
  private calendar?: Calendar;

  @property({ type: Array })
  events: CalendarEvent[] = [];

  static styles = styles;

  private handleEventClick(info: any) {
    const eventDetails = {
      ...info.event.toPlainObject(),
      extendedProps: info.event.extendedProps,
    };

    this.dispatchEvent(
      new CustomEvent("eventClick", {
        detail: JSON.stringify(eventDetails),
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleDatesSet(info: any) {
    this.dispatchEvent(
      new CustomEvent("datesSet", {
        detail: JSON.stringify({
          start: info.start.toISOString(),
          end: info.end.toISOString(),
          startStr: info.startStr,
          endStr: info.endStr,
          view: info.view.type,
        }),
        bubbles: true,
        composed: true,
      })
    );
  }

  updated(changedProperties: Map<string, any>) {
    console.log("calendar el", changedProperties);
    if (changedProperties.has("events") && this.calendar) {
      this.calendar.removeAllEvents();
      this.calendar.addEventSource(this.events);
    }
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
        events: this.events,
        eventClick: this.handleEventClick.bind(this),
        datesSet: this.handleDatesSet.bind(this),
        eventClassNames: ["calendar-event"],
      });

      this.calendar.render();
    }
  }

  render() {
    return html` <div class="calendar-container"></div> `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.calendar?.destroy();
  }
}
