import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Staff } from "../types";
import { convertWixImageUrl } from "../utils";
import { styles } from "./styles";

@customElement("teacher-filter")
export class TeacherFilter extends LitElement {
  @property({ type: Array })
  teachers: Staff[] = [];

  @property({ type: String })
  selectedTeacherId: string | null = null;

  static styles = styles;

  private handleTeacherClick(teacherId: string) {
    this.selectedTeacherId =
      this.selectedTeacherId === teacherId ? null : teacherId;
    this.dispatchEvent(
      new CustomEvent("teacher-change", {
        detail: this.selectedTeacherId,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const selectedTeacher = this.teachers.find(
      (t) => t._id === this.selectedTeacherId
    );

    return html`
      <div class="filter-container">
        <span class="filter-header">Filter by Teacher</span>

        <div class="teacher-filter">
          ${this.teachers.map(
            (teacher) => html`
              <div
                class="teacher-avatar ${this.selectedTeacherId === teacher._id
                  ? "selected"
                  : ""}"
                @click=${() => this.handleTeacherClick(teacher._id)}
                title=${teacher.name}
              >
                <img
                  src=${convertWixImageUrl(teacher.image)}
                  alt=${teacher.name}
                />
              </div>
            `
          )}
        </div>
        ${selectedTeacher
          ? html`<div class="selected-teacher">(${selectedTeacher.name})</div>`
          : null}
      </div>
    `;
  }
}
