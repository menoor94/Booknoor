import { createBrowserRouter } from "react-router";

import Layout from "./UI/Layout";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import Favorites from "./pages/Favorites";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

export const router = createBrowserRouter([
  { path: "login", element: <Login /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <BookList /> },
      { path: "book/:id", element: <BookDetail /> },
      { path: "favorites", element: <Favorites /> },
      { path: "search", element: <Search /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
