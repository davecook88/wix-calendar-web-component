import { css } from "lit";

export const styles = css`
  .packages-container {
    padding: 20px;
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .back-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #666;
    padding: 5px 10px;
    margin-right: 10px;
  }

  .package-list {
    display: grid;
    gap: 20px;
  }

  .package-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .package-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .package-title {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  .package-price {
    font-weight: bold;
    color: #ff5722;
  }
`;
