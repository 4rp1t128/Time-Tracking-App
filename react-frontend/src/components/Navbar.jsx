"use client";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          href={"/"}
          className="flex cursor-pointer title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <span className="ml-3 text-xl">⏳Time Tracking Admin</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href={"/projects"} className="mr-5 hover:text-white">
            Projects
          </Link>
          <Link href={"/employees"} className="mr-5 hover:text-white">
            Employees
          </Link>
          <Link href={"/timelogs"} className="mr-5 hover:text-white">
            Time Logs
          </Link>
          <Link href={"/tasks"} className="mr-5 hover:text-white">
            Tasks
          </Link>
          <Link href={"/screenshots"} className="mr-5 hover:text-white">
            Screenshots
          </Link>
          <Link href={"/payments"} className="mr-5 hover:text-white">
            Payments
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
