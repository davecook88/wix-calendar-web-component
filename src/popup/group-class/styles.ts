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
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    .popup-content {
      padding: 0.75rem;
      padding-bottom: 3rem;
    }

    .service-title {
      font-size: 1.25rem;
    }

    .service-tagline {
      font-size: 1rem;
    }

    .service-image {
      height: 150px;
    }
  }

  .service-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .service-type-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #ff5722;
    color: white;
    border-radius: 1rem;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .service-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .service-tagline {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 1.5rem;
  }

  .session-info {
    background: #f8f8f8;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
  }

  .description {
    color: #444;
    line-height: 1.6;
    margin-bottom: 2rem;
    white-space: pre-wrap;
  }

  .cta-section {
    text-align: center;
    padding: 1.25rem;
    background: #f8f8f8;
    border-radius: 8px;
    position: sticky;
    bottom: 0;
    margin: 0 -1.5rem -1.5rem -1.5rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .cta-section {
      margin: 0 -1rem -1rem -1rem;
      padding: 1rem;
    }

    .price-tag {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .spots-left {
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }

    .book-button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      width: 100%;
      max-width: none;
    }
  }

  .price-tag {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
  }

  .spots-left {
    color: #4caf50;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .spots-left.last-chance {
    color: #f44336;
  }

  .book-button {
    background: #ff5722;
    color: white;
    border: none;
    border-radius: 2rem;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
    max-width: 300px;
  }

  .book-button:hover {
    background: #f4511e;
  }

  .book-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
