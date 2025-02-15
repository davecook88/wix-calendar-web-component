import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  CalendarEvent,
  TeacherOption,
  TeacherResource,
  PricingPlan,
  Service,
} from "../types";

export type PopupContentView = "group-class" | "appointment" | "package";

@customElement("popup-content-selector")
export class PopupContentSelector extends LitElement {
  static styles = css`
    .content-container {
      position: relative;
    }

    .back-button {
      position: absolute;
      top: 20px;
      left: 20px;
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #666;
      padding: 5px;
      z-index: 1;
    }
  `;

  @property({ type: Object })
  event: CalendarEvent | null = null;

  @property({ type: Array })
  plans: PricingPlan[] = [];

  @state()
  private viewHistory: PopupContentView[] = [];

  @state()
  private selectedBooking: any = null;

  @state()
  private selectedTeacher: TeacherOption | null = null;

  @state()
  private selectedService: Service | null = null;

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("event")) {
      // Reset view history when event changes
      this.viewHistory = [
        this.event?.extendedProps.isAggregated ? "appointment" : "group-class",
      ];
    }
  }

  private get currentView(): PopupContentView {
    return this.viewHistory[this.viewHistory.length - 1];
  }

  private pushView(view: PopupContentView) {
    this.viewHistory = [...this.viewHistory, view];
  }

  private popView() {
    if (this.viewHistory.length > 1) {
      this.viewHistory = this.viewHistory.slice(0, -1);
    }
  }

  private handleBookingSelected(e: CustomEvent) {
    console.log("handleBookingSelected", e.detail);
    const teacherId = e.detail.teacherId;
    const teacher = this.event?.extendedProps?.teacherOptions.find(
      (t) => t.id === teacherId
    );
    // Store the service along with booking details
    this.selectedBooking = e.detail.booking;
    this.selectedTeacher = teacher ?? null;
    this.selectedService =
      e.detail.service || this.event?.extendedProps?.service;

    console.log("Selected service:", this.selectedService);
    this.pushView("package");
  }

  private handleViewPackagesSelected(e: CustomEvent) {
    console.log("content-selector handleViewPackagesSelected", e.detail);
    const teacherId = e.detail.teacherId;
    const teacher = this.event?.extendedProps?.teacherOptions.find(
      (t) => t.id === teacherId
    );
    this.selectedTeacher = teacher ?? null;
    this.selectedService =
      e.detail.service || this.event?.extendedProps?.service;
    console.log("Selected service from packages:", this.selectedService);
    this.pushView("package");
  }

  private handleBack() {
    this.popView();
  }

  render() {
    if (!this.event) return html``;

    const showBackButton = this.viewHistory.length > 1;
    const currentContent = (() => {
      console.log("selectedTeacher", this.selectedTeacher);

      switch (this.currentView) {
        case "package":
          return html`
            <packages-content
              .selectedBooking=${this.selectedBooking}
              .service=${this.selectedService}
              .plans=${this.plans}
              @back=${() => this.popView()}
            ></packages-content>
          `;
        case "appointment":
          return html`
            <appointment-content
              .event=${this.event}
              @view-packages-selected=${this.handleViewPackagesSelected}
              @booking-selected=${this.handleBookingSelected}
            ></appointment-content>
          `;
        case "group-class":
          return html`
            <group-class-content
              .event=${this.event}
              @booking-selected=${this.handleBookingSelected}
            ></group-class-content>
          `;
        default:
          return html``;
      }
    })();

    return html`
      <div class="content-container">
        ${showBackButton
          ? html`<button class="back-button" @click=${this.handleBack}>
              ←
            </button>`
          : ""}
        ${currentContent}
      </div>
    `;
  }
}

// Export the components so they're available when needed
export * from "./group-class";
export * from "./appointment";
export * from "./packages";
