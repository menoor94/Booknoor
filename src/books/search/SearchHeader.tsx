import { useId } from "react";
import { IoSearch, IoClose } from "react-icons/io5";
import Button from "../../UI/Button";

const SUGGESTIONS = [
  "Dune",
  "Persepolis",
  "Haruki Murakami",
  "Ursula K. Le Guin",
  "Frankenstein",
  "Sci-Fi",
];

type SearchHeaderProps = {
  inputVal: string;
  onInputChange: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onClear: () => void;
  onSuggestionClick: (suggestion: string) => void;
  activeSuggestion?: string;
  isLoading: boolean;
};

function SearchHeader({
  inputVal,
  onInputChange,
  onSubmit,
  onClear,
  onSuggestionClick,
  activeSuggestion,
  isLoading,
}: SearchHeaderProps) {
  const searchInputId = useId();

  return (
    <header className="pb-6 border-b border-line">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink font-serif">
        Find a book
      </h1>
      <p className="mt-2 text-sm sm:text-base text-muted font-medium">
        Search Open Library and add it to your list.
      </p>

      {/* Search Input Bar */}
      <form
        onSubmit={onSubmit}
        className="mt-6 flex flex-row items-stretch sm:items-center gap-2.5 max-w-2xl"
      >
        <div className="relative flex-1">
          <label htmlFor={searchInputId} className="sr-only">
            Search books by title or author
          </label>

          <IoSearch className="text-lg left-4 top-1/2 text-stone-400 -translate-y-1/2 absolute z-10" />

          <input
            id={searchInputId}
            type="text"
            value={inputVal}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full pl-12 pr-11 py-3 bg-card/95 backdrop-blur-xs border border-line rounded-full sm:text-base text-ink placeholder:text-muted focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-2xs"
          />

          {/* Clear button */}
          {inputVal && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink hover:bg-card/80 p-1.5 rounded-full transition-colors cursor-pointer"
              aria-label="Clear search input"
            >
              <IoClose className="text-lg " />
            </button>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="sm:px-7 py-3 text-sm font-semibold rounded-full shadow-xs"
          isLoading={isLoading}
        >
          Search
        </Button>
      </form>

      {/* Quick Suggestions Chips */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-muted">
        <span className="font-medium mr-1">Suggestions:</span>
        {SUGGESTIONS.map((suggestion) => {
          const isActive =
            activeSuggestion?.toLowerCase() === suggestion.toLowerCase();

          return (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestionClick(suggestion)}
              className={`px-3 py-1 rounded-full border transition cursor-pointer ${
                isActive
                  ? "bg-brand-50 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-100 font-semibold"
                  : "bg-card/70 border-line text-muted hover:text-ink hover:bg-card"
              }`}
            >
              {suggestion}
            </button>
          );
        })}
      </div>
    </header>
  );
}

export default SearchHeader;
