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

  @property({ type: Array })
  plans: PricingPlan[] = [];

  static styles = styles;

  async connectedCallback() {
    super.connectedCallback();
    this.requestMissingPlans();
  }

  private requestMissingPlans() {
    if (!this.service?.payment.pricingPlanIds) return;

    const missingPlanIds = this.service.payment.pricingPlanIds.filter(
      (id: string) => !this.plans.find((plan) => plan._id === id)
    );

    if (missingPlanIds.length > 0) {
      console.log("requesting plans", missingPlanIds);
      this.dispatchEvent(
        new CustomEvent("get-plans", {
          detail: { planIds: missingPlanIds },
          bubbles: true,
          composed: true,
        })
      );
    }
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
    console.log("PackagesContent", this.service, this.plans);
    const availablePlans =
      this.plans?.filter((plan) =>
        this.service?.payment.pricingPlanIds.includes(plan._id)
      ) || [];

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
                <div class="package-price">
                  ${plan.pricing.price.currency} $${plan.pricing.price.value}
                </div>
                ${plan.description
                  ? html`<div class="package-description">
                      ${plan.description}
                    </div>`
                  : ""}
                ${plan.perks?.length
                  ? html`
                      <ul class="perks-list">
                        ${plan.perks.map(
                          (perk) => html` <li class="perk-item">${perk}</li> `
                        )}
                      </ul>
                    `
                  : ""}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}
