export type Status = "want" | "reading" | "finished";

export type Bookmark = {
  id: string;
  page: number;
  note?: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  status: Status;
  liked: boolean;
  rating?: number; // 1-5, only for finished books
  note?: string;
  bookmarks: Bookmark[];
  coverId?: number; // Open Library cover id, optional
};
