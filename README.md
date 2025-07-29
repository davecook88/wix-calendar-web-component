# Thrive Calendar Widget

A modern, responsive, and user-friendly calendar component designed for the Thrive in Spanish online language school. This widget provides a clear, aggregated view of teacher availability and course schedules, solving a key limitation of the standard Wix Booking system.

![Thrive Calendar Screenshot](https://github.com/davecook88/wix-calendar-web-component/blob/main/public/screenshot.png?raw=true)

## The Problem

The Thrive in Spanish school uses Wix for its website and booking management. While Wix Booking is a powerful tool, its default views don't allow potential students to easily see all available class times and teacher schedules at a single glance. This makes it difficult for new users to quickly find a suitable time slot without clicking through multiple pages and filters.

## The Solution

Thrive Calendar is a custom-built web component that integrates seamlessly with the school's existing systems. It fetches all the booking data and displays it in an intuitive, interactive calendar view powered by FullCalendar. Users can now see everything in one place, filter by teacher, and find the perfect class in seconds.

## ✨ Features

- **Aggregated Calendar View:** Displays all classes, courses, and teacher availability in a single, easy-to-read calendar.
- **Interactive & Responsive:** A smooth, modern user experience on both desktop and mobile devices.
- **Teacher Filtering:** Allows users to filter the calendar to see the schedule for a specific teacher.
- **Built as a Web Component:** Encapsulated and reusable, built with [Lit](https://lit.dev) for performance and interoperability.
- **Modern Tech Stack:** Built with TypeScript, Vite, and [FullCalendar](https://fullcalendar.io) for a robust and maintainable codebase.

## 💡 Technical Highlights

This project was developed to solve a specific need within the Wix ecosystem and showcases several interesting technical solutions.

### Overcoming Wix Platform Constraints

Wix's Velo environment presents a unique set of challenges for custom component development. The browser API is non-standard, and communication between custom elements and the parent page is restricted. To overcome this, the Thrive Calendar component employs a few key workarounds:

- **Data Serialization:** Complex data objects, such as teacher schedules and service availability, are serialized to JSON strings before being passed to the web component. The component then parses these strings back into objects, as seen in `wrapper/my-element.ts`:

  ```typescript
  // Example from wrapper/my-element.ts
  this.services = JSON.parse(value);
  ```

- **Custom Event-Based Communication:** To communicate back to the Wix parent page, the component dispatches `CustomEvent` instances. This allows the component to send data and notify the parent page of user interactions, such as selecting a booking or filtering by teacher. This can be seen throughout the component codebase, for example in `calendar-component/index.ts`:

  ```typescript
  // Example from calendar-component/index.ts
  new CustomEvent("eventClick", {
    detail: { event: info.event },
    bubbles: true,
    composed: true,
  });
  ```

### Modular Architecture with Lit

Despite the limitations of the Wix platform, this project maintains a clean and modular architecture thanks to the [Lit](https://lit.dev) library. Lit allows for the creation of encapsulated, reusable web components, which was essential for breaking down the application's logic into coherent and manageable pieces. Each part of the calendar, from the main calendar view to the teacher filter and the pop-up modals, is its own Lit component with its own isolated styles and logic. This made the development process more organized and the final codebase easier to maintain and understand.

## 🛠️ Tech Stack

- **Frontend:** [Lit](https://lit.dev)
- **Calendar:** [FullCalendar](https://fullcalendar.io)
- **Build Tool:** [Vite](https://vitejs.dev)
- **Language:** [TypeScript](https://www.typescriptlang.org)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18.x or later)
- npm

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/your_username/thrive-calendar.git
   ```
2. Navigate to the project directory:
   ```sh
   cd thrive-calendar
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```

### Running the Development Server

To view the component in a live-reloading development environment, run:

```sh
npm run dev
```
This will start the Vite development server, and you can view the component in your browser at the provided URL (usually `http://localhost:5173`).

### Building for Production

To build the component for production, run:

```sh
npm run build
```
This will compile the TypeScript code and bundle the assets into the `dist` directory, ready for deployment.

## Usage

As a web component, the Thrive Calendar can be embedded into any HTML page. However, bear in mind that this has been created specifically to be used with the Wix Booking V2 API and so the types are specific to this use case. After building the project, include the generated JavaScript module from the `dist` folder in your HTML file and then use the `<thrive-calendar></thrive-calendar>` custom element tag.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Thrive Calendar Demo</title>
    <script type="module" src="/dist/index.js"></script>
</head>
<body>
    <thrive-calendar></thrive-calendar>
</body>
</html>
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
