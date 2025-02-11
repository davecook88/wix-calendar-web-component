import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CalendarEvent, TeacherOption, TeacherResource } from "../types";

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

  @state()
  private viewHistory: PopupContentView[] = [];

  @state()
  private selectedBooking: any = null;

  @state()
  private selectedTeacher: TeacherOption | null = null;

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
    // Store both the booking details and selected teacher
    this.selectedBooking = e.detail.booking;
    this.selectedTeacher = teacher ?? null;
    // Push the package view
    this.pushView("package");
  }

  private handleBack() {
    this.popView();
  }

  private setSelectedTeacher(teacher: TeacherOption) {
    this.selectedTeacher = teacher;
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
              .service=${this.event?.extendedProps?.service ||
              (this.selectedTeacher?.services &&
                this.selectedTeacher.services[0]?.service)}
              @back=${() => this.popView()}
              @package-selected=${(e: CustomEvent) =>
                this.dispatchEvent(
                  new CustomEvent("book", {
                    detail: e.detail,
                    bubbles: true,
                    composed: true,
                  })
                )}
            ></packages-content>
          `;
        case "appointment":
          return html`
            <appointment-content
              .event=${this.event}
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
