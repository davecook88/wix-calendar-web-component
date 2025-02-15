import { css } from "lit";

export const styles = css`
  .popup-header {
    position: sticky;
    top: 0;
    background: white;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .popup-content {
    padding: 1rem;
  }

  .time-slot {
    color: #666;
    margin-top: 0.25rem;
  }

  .teacher-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
    max-width: 800px;
  }

  .teacher-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .teacher-card.bookable:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .teacher-card.not-bookable {
    opacity: 0.7;
  }

  .teacher-image-name-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .teacher-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 3px solid #ff5722;
    border-radius: 50%;
  }

  .teacher-info {
    padding: 1rem;
  }

  .teacher-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem 0;
  }

  .booking-options {
    margin-top: 1rem;
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }

  .booking-options-title {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    margin: 0 0 0.5rem 0;
  }

  .booking-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f5f5f5;
  }

  .booking-time {
    font-size: 0.875rem;
    color: #666;
  }

  .booking-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .book-teacher {
    padding: 0.5rem 1rem;
    background: #ff5722;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    text-decoration: none;
    text-align: center;
  }

  .book-teacher:hover {
    background: #f4511e;
  }

  .book-package {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .book-package:hover {
    background-color: #e9e9e9;
  }

  .not-available-badge {
    background: #f5f5f5;
    color: #666;
    text-align: center;
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-style: italic;
  }
`;
