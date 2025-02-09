import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CalendarEvent } from "../types";

@customElement("popup-content-selector")
export class PopupContentSelector extends LitElement {
  @property({ type: Object })
  event: CalendarEvent | null = null;

  render() {
    if (!this.event) return html``;

    return html`
      ${this.event.extendedProps.isAggregated
        ? html`<appointment-content
            .event=${this.event}
            @booking-selected=${this.handleBookingSelected}
          ></appointment-content>`
        : html`<group-class-content
            .event=${this.event}
            @booking-selected=${this.handleBookingSelected}
          ></group-class-content>`}
    `;
  }

  private handleBookingSelected(e: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent("book", {
        detail: e.detail,
        bubbles: true,
        composed: true,
      })
    );
  }
}

// Export the components so they're available when needed
export * from "./group-class";
export * from "./appointment";
