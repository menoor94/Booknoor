import { createBrowserRouter } from "react-router";

import Layout from "./UI/Layout";
import BookList from "./pages/BookList";
// import WantToRead from "./books/WantToRead";
import BookDetail from "./pages/BookDetail";
import Favorites from "./pages/Favorites";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <BookList /> },
      // { path: "/want-to-read", element: <WantToRead /> },
      { path: "book/:id", element: <BookDetail /> },
      { path: "favorites", element: <Favorites /> },
      { path: "search", element: <Search /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
