import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { PricingPlan, Service } from "../../types";
import { styles } from "./styles";

@customElement("packages-content")
export class PackagesContent extends LitElement {
  @property({ type: Object })
  selectedBooking: any = null;

  @property({ type: Object })
  service: Service | null = null;

  @state()
  private pricingPlans: Record<string, PricingPlan> = {};

  static styles = styles;

  async connectedCallback() {
    super.connectedCallback();
    this.requestMissingPlans();
  }

  private requestMissingPlans() {
    if (!this.service?.payment.pricingPlanIds) return;

    const missingPlanIds = this.service.payment.pricingPlanIds.filter(
      (id: string) => !this.pricingPlans[id]
    );

    if (missingPlanIds.length > 0) {
      this.dispatchEvent(
        new CustomEvent("request-plans", {
          detail: { planIds: missingPlanIds },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  @property({ type: Array })
  set plans(newPlans: any[]) {
    // Merge new plans into existing plans
    newPlans.forEach((plan) => {
      this.pricingPlans = {
        ...this.pricingPlans,
        [plan.id]: plan,
      };
    });
    this.requestUpdate();
  }

  private handlePackageSelect(packageDetails: any) {
    this.dispatchEvent(
      new CustomEvent("package-selected", {
        detail: {
          ...this.selectedBooking,
          package: packageDetails,
        },
      })
    );
  }

  render() {
    console.log("PackagesContent", this.service, this.pricingPlans);
    const availablePlans =
      this.service?.payment.pricingPlanIds
        ?.map((id) => this.pricingPlans[id])
        .filter(Boolean) || [];

    return html`
      <div class="packages-container">
        <div class="header">
          <h2>Select a Package</h2>
        </div>

        <div class="package-list">
          ${availablePlans.map(
            (plan) => html`
              <div
                class="package-card"
                @click=${() => this.handlePackageSelect(plan)}
              >
                <div class="package-title">${plan.name}</div>
                <div class="package-price">$${plan.pricing.price}</div>
                ${plan.description
                  ? html`<div class="package-description">
                      ${plan.description}
                    </div>`
                  : ""}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}
