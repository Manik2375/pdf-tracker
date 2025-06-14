import Link from "next/link";

const pages = [
  {
    id: 1,
    title: "Home",
    url: "/home",
  },
  {
    id: 2,
    title: "Books",
    url: "/home/books",
  },
  {
    id: 3,
    title: "Special",
    url: "/special",
  },
];
export default function NavBar() {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col m-5">
        {/* Navbar */}
        <div className="navbar bg-base-100 w-full shadow-sm">
          <div className="flex-none lg:hidden ">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 navbar-start">
            {" "}
            <Link className="btn btn-ghost text-xl" href="/home">
              PDF tracker
            </Link>
          </div>
          <nav className="hidden flex-none lg:block navbar-center">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              {pages.map((page) => (
                <li key={page.id}>
                  <Link href={page.url}>{page.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* ----- */}
      </div>
      <nav className="drawer-side nabar">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          {pages.map((page) => (
            <li key={page.id}>
              <Link href={page.url}>{page.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
