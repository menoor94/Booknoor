//Icons
import { MdFavorite } from "react-icons/md";
import { IoLibrary, IoSearch } from "react-icons/io5";
//components
import Logo from "./Logo";
import Button from "./Button";
import Navlink from "./Navlink";

function Header() {
  return (
    <header className="flex justify-between items-center  px-5 md:px-10 shadow-xl">
      <Logo className="w-20  md:w-30" />
      <div className="flex justify-center items-center gap-5 md:gap-10 ">
        <Navlink path="/" icon={<IoLibrary />}>
          Library
        </Navlink>

        <Navlink path="Favorites" icon={<MdFavorite />}>
          Favorites
        </Navlink>

        <Navlink path="Search" icon={<IoSearch />}>
          Search
        </Navlink>
      </div>
      <Button
        type="primary"
        className=" py-1 px-2 md:px-4 text-sm md:text-base"
      >
        +Add books
      </Button>
    </header>
  );
}

export default Header;
