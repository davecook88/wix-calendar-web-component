import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background-color: #f9fafb;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .calendar-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    max-height: 85vh;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .calendar-container {
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  .calendar-wrapper::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .calendar-wrapper {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  h1 {
    color: #111827;
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 2rem;
    text-align: center;
  }

  /* FullCalendar styles remain the same */
  .fc .fc-toolbar-title {
    font-size: 1.75rem !important;
    font-weight: 600 !important;
    color: #111827 !important;
  }

  .fc .fc-button-primary {
    background-color: #ff5722 !important;
    border-color: #f4511e !important;
    border: none !important;
    text-transform: none !important;
    font-weight: 500 !important;
    padding: 0.5rem 1rem !important;
    border-radius: 2rem !important;
  }

  .fc .fc-button-primary:hover {
    background-color: #f4511e !important;
    border-color: #e64a19 !important;
  }

  .fc .fc-button-primary:disabled {
    background-color: #bdbdbd !important;
    border: none !important;
  }

  .fc .fc-theme-standard td,
  .fc .fc-theme-standard th {
    border-color: #eeeeee !important;
  }

  .fc th {
    padding: 1rem 0 !important;
    font-weight: 600 !important;
    color: #333333 !important;
  }

  .fc .fc-timegrid-slot {
    height: 3.5rem !important;
  }

  .fc .fc-timegrid-slot-label {
    font-size: 0.875rem !important;
    color: #666666 !important;
  }

  .fc .fc-day-today {
    background-color: #fbe9e7 !important;
  }

  .fc .fc-business-container {
    background-color: #fafafa !important;
  }

  .calendar-event {
    cursor: pointer;
    font-size: 14px !important;
  }

  @media (max-width: 768px) {
    :host {
      padding: 1rem;
    }

    .calendar-wrapper {
      padding-bottom: 1rem;
      max-height: 85vh;
    }

    .calendar-event {
      cursor: pointer;
      font-size: 0.85rem !important;
    }

    .calendar-container {
      padding: 0.75rem;
      border-radius: 0.5rem;
    }

    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .fc .fc-toolbar-title {
      font-size: 1rem !important;
    }

    .fc .fc-toolbar {
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }

    .fc .fc-toolbar-chunk {
      display: flex;
      justify-content: center;
    }

    .fc .fc-button {
      padding: 0.25rem 0.75rem !important;
      font-size: 0.875rem !important;
    }

    .fc .fc-view-harness {
      min-height: 400px;
    }

    .fc .fc-timegrid-slot {
      height: 2.5rem !important;
      min-width: 100px; /* Ensures cells don't get too narrow */
    }

    .fc .fc-scroller {
      overflow: visible !important; /* Changed from hidden to visible */
    }

    @media (max-width: 720px) {
      :host {
        width: 200vw;
      }
    }
  }
`;
