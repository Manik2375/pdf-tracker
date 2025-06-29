import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import React from "react";

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

export default async function NavBar() {
  const session = await auth();
  if (!session?.user) throw new Error("Not logged in");
  return (
    <div className="navbar bg-base-200 shadow-sm rounded-box px-10">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {pages.map((page) => (
              <li key={page.id}>
                <Link href={page.url} className="px-5 py-3">
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">PDF tracker</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {pages.map((page) => (
            <li key={page.id}>
              <Link href={page.url}>{page.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <button
          popoverTarget="popover-1"
          style={{ anchorName: "--anchor-1" } as React.CSSProperties}
          className="w-12 rounded-full overflow-hidden p-1 hover:bg-base-300 cursor-pointer"
        >
          <Image
            className="rounded-full"
            src={session.user.avatar ?? session.user.image}
            width={70}
            height={70}
            alt="avatar"
          />
        </button>
        <div
          className="dropdown dropdown-center menu w-max rounded-box bg-base-100 shadow-sm mr-2"
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}
        >
          <button
            className="btn bg-base-100 border-0 hover:bg-error"
            onClick={async () => {
              "use server";
              await signOut();
            }}
          >
            {/*<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->*/}
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 12L13 12"
                stroke="#323232"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9"
                stroke="#323232"
                strokeWidth={2}
                strokeLinecap="round"
                stroke-linejoinz="round"
              />
              <path
                d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19"
                stroke="#323232"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
