type BookNotesProps = {
  notes: string;
  onChange: (notes: string) => void;
};

function BookNotes({ notes, onChange }: BookNotesProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-2xs">
      <label
        htmlFor="book-notes"
        className="block text-xs font-semibold text-stone-700 mb-2"
      >
        Your notes
      </label>
      <textarea
        id="book-notes"
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add your personal notes about this book..."
        className="w-full p-3.5 bg-stone-50/40 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 min-h-[90px] resize-y transition shadow-2xs"
      />
    </div>
  );
}

export default BookNotes;
