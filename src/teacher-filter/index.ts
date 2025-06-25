import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Staff } from "../types";
import { convertWixImageUrl } from "../utils";

@customElement("teacher-filter")
export class TeacherFilter extends LitElement {
  @property({ type: Array })
  teachers: Staff[] = [];

  @property({ type: String })
  selectedTeacherId: string | null = null;

  static styles = css`
    :host {
      display: block;
      margin: 16px 0;
    }
    .filter-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .filter-header {
      font-size: 1.1rem;
      color: #333;
      font-weight: 500;
      margin: 0;
      white-space: nowrap;
    }
    .selected-teacher {
      font-size: 0.9rem;
      color: #666;
      font-style: italic;
      min-width: 150px;
    }
    .teacher-filter {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .teacher-avatar {
      width: 75px;
      height: 75px;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      transition: transform 0.2s;
    }
    .teacher-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    .teacher-avatar.selected {
      transform: scale(1.1);
      box-shadow: 0 0 0 2px #ff5722;
    }
  `;

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
      <div class="teacher-filter-container">
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
