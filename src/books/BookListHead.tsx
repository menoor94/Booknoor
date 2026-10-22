import { useState } from "react";

function BookListHead() {
  const [inpValue, setInpValue] = useState("");

  return (
    <section>
      <h2 className="text-3xl">Your library</h2>
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <span>%All books% Books</span>
          <span>%finished% Finished</span>
          <span>%liked% Liked</span>
        </div>
        <div className="flex gap-3">
          <input
            className="py-1 px-3 border border-stone-400 rounded-full"
            placeholder="Search your library"
            value={inpValue}
            onChange={(e) => setInpValue(e.target.value)}
            type="text"
          />
          <select className="py-[5.5px] px-3 border border-stone-400 rounded-full cursor-pointer text-stone-800">
            <option value="Recently added">Recently added</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default BookListHead;
