"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import useLogin from "@/utils/useLogin";
import { useRouter } from "next/navigation";

const Screenshots = () => {
  const [id, setID] = useState("");
  const [employee_id, setEmployeeId] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const { isLogin, check, token } = useLogin();
  const router = useRouter();

  async function submit() {
    if (id == "") {
      alert("Fill all fields");
      return;
    }
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/screenshots/all`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: id,
        }),
      }
    );
    const data = await resp.json();
    if (data["status"]) {
      console.log(data["results"]);
      setEmployeeId(id);
      setID("");
      setScreenshots(data["results"]);
    } else {
      alert("Error Occured");
    }
  }

  useEffect(() => {
    if (!isLogin && check) {
      router.push("/login");
    }
  }, [isLogin, check]);

  return isLogin ? (
    <>
      <Navbar />
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-12 container mx-auto w-[70%] my-4">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-3xl font-semibold text-gray-900">
              Get Employee Screenshots
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Employee ID
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-green-600">
                    <input
                      value={id}
                      onChange={(e) => {
                        setID(e.target.value);
                      }}
                      id="username"
                      type="text"
                      name="name"
                      placeholder="Enter Employee ID..."
                      className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-x-6">
          <button
            onClick={submit}
            type="submit"
            className="rounded-md bg-green-600 px-3 py-2 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 cursor-pointer text-xl"
          >
            Submit
          </button>
        </div>
      </form>
      {screenshots.length === 0 && (
        <div className="text-center text-3xl my-10">No Screenshots</div>
      )}
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap justify-center">
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {screenshots.map((item, i) => (
                <div
                  title={employee_id + "_" + item.screenshot_id}
                  key={employee_id + "_" + item.screenshot_id}
                  className="w-full flex flex-col justify-center"
                >
                  <Image
                    width={500}
                    height={500}
                    className="object-cover object-center rounded-lg shadow-md mx-auto cursor-pointer"
                    src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/screenshots/${employee_id}/${item.screenshot_id}.png`}
                    alt="screenshot"
                    onClick={() => {
                      window.open(
                        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/screenshots/${employee_id}/${item.screenshot_id}.png`
                      );
                    }}
                  />
                  <p className="text-center text-xl">{item.screenshot_date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default Screenshots;
