import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  IoSearch,
  IoChevronDown,
  IoLibraryOutline,
  IoAdd,
} from "react-icons/io5";

import type { Status } from "../types";
import { useAppDispatch, useAppSelector } from "../store";
import { setBooks } from "../books/booksSlice";
import { fetchBooksFromSupabase } from "../services/apiBooks";
import BooksRender from "../books/BooksRender";
import Button from "../UI/Button";

const tabs: { label: string; value: Status | null }[] = [
  { label: "All", value: null },
  { label: "Want to read", value: "want" },
  { label: "Reading", value: "reading" },
  { label: "Finished", value: "finished" },
];

function BookList() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status");
  const [inpValue, setInpValue] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "title" | "author">("recent");

  const books = useAppSelector((state) => state.books.books);
  const user = useAppSelector((state) => state.auth.user);

  // Sync books from Supabase if available when user is logged in
  useEffect(() => {
    if (user?.id) {
      fetchBooksFromSupabase(user.id)
        .then((remoteBooks) => {
          if (remoteBooks && remoteBooks.length > 0) {
            dispatch(setBooks(remoteBooks));
          }
        })
        .catch(() => {});
    }
  }, [user?.id, dispatch]);

  const totalBooks = books.length;
  const finishedCount = books.filter((b) => b.status === "finished").length;
  const likedCount = books.filter((b) => b.liked).length;

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchesStatus = status ? book.status === status : true;
      const matchesSearch = inpValue.trim()
        ? book.title.toLowerCase().includes(inpValue.toLowerCase()) ||
          book.author.toLowerCase().includes(inpValue.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [books, status, inpValue]);

  const visible = useMemo(() => {
    if (sortBy === "title") {
      return [...filtered].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
      );
    }
    if (sortBy === "author") {
      return [...filtered].sort((a, b) =>
        a.author.localeCompare(b.author, undefined, { sensitivity: "base" }),
      );
    }
    return filtered;
  }, [filtered, sortBy]);

  return (
    <div className="relative min-h-full ">
      <div
        className="pointer-events-none absolute -top-8 -left-16 h-80 w-80 rounded-full bg-noor-200/50 blur-3xl opacity-70"
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="pb-6 border-b border-line">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {/* Bigger Heading */}
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink font-serif">
                Your library
              </h1>

              {/* Smaller Status / Stats Line */}
              <div className="mt-2 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted font-medium">
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-ink">{totalBooks}</span>{" "}
                  Books
                </span>
                <span className="text-line">•</span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-ink">
                    {finishedCount}
                  </span>{" "}
                  Finished
                </span>
                <span className="text-line">•</span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-ink">{likedCount}</span>{" "}
                  Liked
                </span>
              </div>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  className="w-full sm:w-64 pl-9 pr-4 py-2 border border-line bg-card/90 backdrop-blur-xs rounded-full text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-2xs"
                  placeholder="Search your library..."
                  value={inpValue}
                  onChange={(e) => setInpValue(e.target.value)}
                  type="text"
                />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "recent" | "title" | "author")
                  }
                  className="appearance-none py-2 pl-4 pr-9 border border-line bg-card/90 backdrop-blur-xs rounded-full cursor-pointer text-xs sm:text-sm font-medium text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-2xs"
                  aria-label="Sort library"
                >
                  <option value="recent">Recently added</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="author">Author (A-Z)</option>
                </select>
                <IoChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-xs" />
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-5">
            {tabs.map((tab) => {
              const active = tab.value === status;
              return (
                <Button
                  key={tab.label}
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  aria-pressed={active}
                  className={`sm:text-sm sm:px-5 ${
                    !active ? "bg-card/80 border-line text-muted" : ""
                  }`}
                  onClick={() =>
                    setSearchParams(tab.value ? { status: tab.value } : {})
                  }
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Books Grid or Empty State */}
        {totalBooks === 0 ? (
          <div className="border border-dashed border-line rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center text-center mt-8 min-h-[380px] bg-card/40">
            <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 flex items-center justify-center mb-4 text-2xl text-brand-700 dark:text-brand-300">
              <IoLibraryOutline />
            </div>

            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink tracking-tight">
              Your library is empty
            </h2>

            <p className="text-muted text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
              You haven't added any books yet. Discover and search books to
              start curating your private bookshelf.
            </p>

            <Link to="/search" className="mt-6 inline-block">
              <Button variant="primary" size="md" className="gap-2 px-6">
                <IoAdd className="text-lg" />
                <span>Discover &amp; add books</span>
              </Button>
            </Link>
          </div>
        ) : visible.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 justify-center items-start">
            {visible.map((b, idx) => (
              <BooksRender key={b.id} book={b} index={idx} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center py-12 px-4">
            <p className="text-base font-medium text-ink">
              No matching books found
            </p>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Try adjusting your search query or switching status tabs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;
