import { LitElement, html } from "lit";
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

  private _calculateInitialDate(events: CalendarEvent[]): string | undefined {
    console.log("Calculating initial date for events:", events);
    if (events.length === 0) {
      return undefined;
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const eventsThisWeek = events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate >= startOfWeek && eventDate < endOfWeek;
    });

    if (eventsThisWeek.length > 0) {
      return undefined; // Default behavior, show current week
    }

    const futureEvents = events
      .filter((event) => new Date(event.start) > new Date())
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );

    if (futureEvents.length > 0) {
      return futureEvents[0].start;
    }

    return undefined;
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("events") && this.calendar) {
      console.log("Updating calendar with new events:", this.events);
      this.calendar.removeAllEvents();
      this.calendar.addEventSource(this.events);
      const newDate = this._calculateInitialDate(this.events);
      if (newDate) {
        this.calendar.gotoDate(newDate);
      }
    }
  }

  firstUpdated() {
    const initialDate = this._calculateInitialDate(this.events);

    const calendarEl = this.shadowRoot?.querySelector(".calendar-container");

    if (calendarEl) {
      console.log(
        "Initializing calendar with element:",
        calendarEl,
        initialDate
      );
      this.calendar = new Calendar(calendarEl as HTMLElement, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: "timeGridWeek",
        initialDate: initialDate,
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
        eventDidMount: (info) => {
          // This will set the font size for each event as it's mounted
        },
      });

      this.calendar.render();
    }
  }

  render() {
    return html`
      <div class="calendar-container" style="font-size:14px"></div>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.calendar?.destroy();
  }
}
