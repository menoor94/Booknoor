# 📚 Booknoor (بوک‌نور)

<p align="center">
  <em>Your quiet sanctuary for every story. Track your reading progress, curate your private shelf, and rediscover the joy of books.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/React_Query-v5-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack React Query" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-v2-764ABC?style=flat-square&logo=redux&logoColor=white" alt="Redux Toolkit" />
</p>

---

## 📖 Overview

**Booknoor** is an elegant, distraction-free personal library and reading companion. Crafted with a calm, warm editorial aesthetic ("Noor" gold and deep ink blue), Booknoor allows readers to organize their collection across different reading stages, log thoughts and ratings, set page bookmarks, and discover millions of books via live search powered by the Open Library API.

Whether you're currently immersed in an epic sci-fi series, reflecting on classic literature, or planning your future reading goals, Booknoor gives you a peaceful, beautifully designed space to manage your reading journey.

---

## ✨ Key Features

### 📚 Personal Bookshelf & Library
- **Status Organization**: Group books by status:
  - `Want to read`
  - `Reading`
  - `Finished`
- **Dynamic Book Covers**: Displays official cover art with an automatic fallback palette generator for books without imagery.
- **Quick Library Search & Filtering**: Instant title/author filtering and reading progress indicators (total books, completed, liked).

### 🔍 Live Open Library Search
- **Instant Discovery**: Search millions of books worldwide powered by the [Open Library API](https://openlibrary.org/developers/api).
- **Curated Genre Shortcuts**: Quick one-tap search chips for Sci-Fi, Classics, Philosophy, Fantasy, History, and Mystery.
- **Async Caching & Resiliency**: Built with **TanStack React Query v5** for smooth request caching, debounce handling, and retry mechanics.
- **One-Click Add**: Add any discovered book directly to your bookshelf with your choice of initial status.

### 📝 Reading Details & Note-taking
- **Interactive Ratings**: Rate your completed reads with an intuitive 5-star rating component.
- **Bookmarks & Page Tracking**: Add specific page bookmarks with optional chapter/scene annotations to resume reading effortlessly.
- **Personal Reflections**: Write, edit, and keep private notes for each book.
- **Favorites & Likes**: Heart favorite reads to quickly highlight memorable titles.

### 🎨 Thoughtful Design & Modern UX
- **Dark & Light Modes**: Seamless theme switching with persistent user preference and custom CSS design tokens.
- **Editorial Typography & Motion**: Custom spring-like entrance animations and clean, readable layouts built with accessibility (`prefers-reduced-motion`) in mind.
- **Responsive Layout**: Designed to feel fluid and comfortable across mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite 6](https://vitejs.dev/) |
| **Routing** | [React Router v8](https://reactrouter.com/) |
| **Server State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) & Devtools |
| **Global Client State** | [Redux Toolkit](https://redux-toolkit.js.org/) & [React Redux](https://react-redux.js.org/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` variables |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) (Ionicons 5, Material Design, Lucide/Feather) |
| **Code Quality** | [ESLint](https://eslint.org/) & TypeScript ESLint |

---

## 📁 Project Structure

```text
Booknoor/
├── public/                 # Static assets and icons
├── src/
│   ├── api/                # Open Library REST API services and response formatters
│   │   └── openLibrary.ts
│   ├── books/              # Books domain features and state
│   │   ├── detail/         # Detail views: Header, Sidebar, Bookmarks, Notes, Ratings
│   │   ├── search/         # Search views: SearchHeader, SearchResults, SearchResultItem, hooks
│   │   ├── BooksRender.tsx # Shelf book card component with dynamic spine & cover
│   │   └── booksSlice.ts   # Redux Toolkit slice (add, remove, update status, bookmarks, rating)
│   ├── data/               # Default initial dataset & collection helpers
│   ├── pages/              # Primary route views (BookList, BookDetail, Search, Favorites, Login, NotFound)
│   ├── UI/                 # Shared UI building blocks (Button, Header, Layout, Logo, Navlink, ThemeToggle)
│   ├── utils/              # Utility helpers (cover palette hash generator)
│   ├── index.css           # Tailwind v4 configuration, theme tokens, and animations
│   ├── main.tsx            # App bootstrap with Redux & React Query providers
│   ├── router.tsx          # Application routing definitions
│   ├── store.ts            # Redux store configuration
│   └── types.ts            # TypeScript definitions (Book, Bookmark, Status)
├── eslint.config.js        # ESLint flat configuration
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite plugin configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/menoor94/Booknoor.git
   cd Booknoor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to `http://localhost:5173` to explore your library.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and produces an optimized production build in `dist/`. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint across the codebase to check for lint and formatting errors. |

---

## 🗺️ Roadmap & Future Enhancements

- [ ] **Persistent Storage**: Integrate IndexedDB (or Supabase/Firebase) for persistent user accounts and sync across devices.
- [ ] **Favorites Shelf View**: Dedicated curated grid for all favorite & highest-rated books.
- [ ] **Reading Goals & Statistics**: Annual reading challenges, monthly pace charts, and genre analytics.
- [ ] **Custom Shelves / Tags**: Create custom tags (e.g., *Audiobooks*, *Non-fiction*, *Summer 2026*).
- [ ] **Import / Export**: Export to and import from Goodreads / StoryGraph CSV files.

---

## 📄 License

This project is created for personal and educational use. Feel free to use and adapt it for your own reading tracking!
