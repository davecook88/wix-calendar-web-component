import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ServiceType } from "../types";

@customElement("service-type-selector")
export class ServiceTypeSelector extends LitElement {
  @property({ type: String })
  selectedType: ServiceType = "CLASS";

  static styles = css`
    .type-selector {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      gap: 10px;
    }

    .type-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #f5f5f5;
      color: #666;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .type-button.active {
      background: #ff5722;
      color: white;
    }

    .type-button:hover:not(.active) {
      background: #eeeeee;
    }

    @media (max-width: 768px) {
      .type-selector {
        flex-wrap: wrap;
        justify-content: start;
      }
    }
  `;

  private handleTypeChange(type: ServiceType) {
    this.selectedType = type;
    this.dispatchEvent(
      new CustomEvent("type-change", {
        detail: type,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="type-selector">
        <button
          class="type-button ${this.selectedType === "CLASS" ? "active" : ""}"
          @click=${() => this.handleTypeChange("CLASS")}
        >
          Group Class
        </button>
        <button
          class="type-button ${this.selectedType === "APPOINTMENT"
            ? "active"
            : ""}"
          @click=${() => this.handleTypeChange("APPOINTMENT")}
        >
          One-on-One
        </button>
        <!--<button
          class="type-button ${this.selectedType === "COURSE" ? "active" : ""}"
          @click=${() => this.handleTypeChange("COURSE")}
        >
          Course
        </button> -->
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "service-type-selector": ServiceTypeSelector;
  }
}
