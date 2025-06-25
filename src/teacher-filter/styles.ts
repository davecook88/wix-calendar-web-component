import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    margin: 16px 0;
  }
  .teacher-filter-container {
    display: block !important;
    gap: 8px;
  }
  .filter-header {
    font-size: 0.9rem;
    color: #666;
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

  @media (max-width: 768px) {
    .teacher-filter-container {
      gap: 8px;
    }
    .teacher-filter {
      gap: 8px;
    }
    .teacher-avatar {
      width: 60px;
      height: 60px;
    }
    .selected-teacher {
      margin-top: 4px;
      min-width: unset;
    }
  }

  @media (max-width: 480px) {
    .teacher-avatar {
      width: 25px;
      height: 25px;
    }
    .filter-header {
      padding-left: 20px;
    }
  }
`;
