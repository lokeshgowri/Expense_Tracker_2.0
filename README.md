# 💸 Expense Tracker 2.0 

A beautifully designed, modern **Expense Tracker** web application built using **HTML, CSS, JavaScript**, and **Knockout.js**. 

This project goes beyond a simple expense logger by functioning as a full budgeting tool. It allows users to track their monthly salary, monitor savings, and seamlessly manage transactions with advanced filtering, editing capabilities, and a sleek Dark Mode UI.

---

## 🔧 Features

- 🎨 **Premium UI & UX**: Clean, minimalistic dashboard with smooth CSS animations, micro-interactions, and a custom Toast notification system.
- 🌙 **Dark Mode**: Fully supported dark theme utilizing CSS variables, with user preference saved in local storage.
- 💰 **Budgeting & Savings**: Input a monthly salary to automatically calculate remaining savings based on total expenses.
- ✏️ **Full CRUD Operations**: Seamlessly Add, View, Edit, and Delete expenses without page reloads.
- 📱 **Progressive Web App (PWA)**: Installable on Desktop and Mobile devices, functioning perfectly offline via Service Workers.
- 🔍 **Advanced Filtering**: Filter transactions instantly by Month, Payment Method, and Category.
- 💾 **Data Persistence**: All expenses, settings, and receipt photos are saved instantly to the browser's `localStorage`.
- 📊 **Visual Insights**: Interactive Doughnut Chart using **Chart.js** to visualize spending dynamically.
- 📸 **Bill Photo Upload**: Attach and view photos of receipts for any transaction via a custom in-app modal.

---

## 🚀 Tech Stack & Architecture

| Technology | Role |
|------------|------|
| **HTML5** | Semantic structure and accessibility |
| **CSS3** | Responsive grid/flexbox layouts, CSS Variables for theming, Keyframe animations |
| **JavaScript (ES6+)** | Core application logic, DOM manipulation, Service Workers |
| **Knockout.js** | MVVM (Model-View-ViewModel) architecture for seamless, reactive data-binding |
| **Chart.js** | Dynamic data visualization |
| **Web Storage API** | `localStorage` for offline data persistence |

### 🧠 Why this Tech Stack?
- **Knockout.js**: Chosen for its robust two-way data binding and dependency tracking using Observables. It enforces a clean separation of concerns (MVVM) without the heavy boilerplate or build-step requirements of larger frameworks like React or Angular, making it perfect for a lightweight, performant web app.
- **Vanilla CSS (No Frameworks)**: Demonstrates strong fundamental CSS skills, including CSS Variables, Grid, Flexbox, and Media Queries for responsive design, avoiding the bloat of libraries like Bootstrap or Tailwind.
- **Service Workers (PWA)**: Implemented to cache assets and provide an offline-first experience, proving an understanding of modern web capabilities and native-like app experiences.

