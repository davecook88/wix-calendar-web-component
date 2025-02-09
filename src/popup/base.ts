import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CalendarEvent } from "../types";

@customElement("event-popup")
export class EventPopup extends LitElement {
  @property({ type: Object })
  event: CalendarEvent | null = null;

  static styles = css`
    .event-popup {
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-width: 90vw;
      max-height: 90vh;
      width: 800px;
      overflow: hidden;
    }

    .event-popup.active {
      display: block;
    }

    .event-popup-content {
      max-height: 90vh;
      overflow-y: auto;
      padding: 20px;
      padding-top: 0;
      position: relative;
    }

    .event-popup-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      overflow: hidden;
    }

    .event-popup-backdrop.active {
      display: block;
    }

    .close-button {
      position: sticky;
      top: 0;
      right: 0;
      float: right;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      padding: 10px;
      z-index: 2;
    }

    .event-popup-content::-webkit-scrollbar {
      width: 8px;
    }

    .event-popup-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .event-popup-content::-webkit-scrollbar-thumb {
      background: #ff5722;
      border-radius: 4px;
    }

    .event-popup-content::-webkit-scrollbar-thumb:hover {
      background: #f4511e;
    }
  `;

  private handleClose() {
    this.event = null;
    this.dispatchEvent(new CustomEvent("close"));
  }

  private handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this.handleClose();
    }
  }

  private handleBook(e: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent("book", {
        detail: e.detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const active = !!this.event;

    return html`
      <div
        class="event-popup-backdrop ${active ? "active" : ""}"
        @click=${this.handleBackdropClick}
      >
        <div class="event-popup ${active ? "active" : ""}">
          <div class="event-popup-content">
            <button class="close-button" @click=${this.handleClose}>×</button>
            ${this.event
              ? html`
                  <popup-content-selector
                    .event=${this.event}
                    @book=${this.handleBook}
                  ></popup-content-selector>
                `
              : ""}
          </div>
        </div>
      </div>
    `;
  }
}
