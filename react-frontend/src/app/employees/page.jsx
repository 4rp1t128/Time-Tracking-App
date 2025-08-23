"use client";
import React, { useEffect, useState } from "react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    (async () => {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/employees/all`
      );
      const data = await resp.json();
      console.log(data);
      setEmployees(data["results"]);
    })();
  }, []);

  async function submit() {
    if (name == "" || email == "") {
      alert("Fill all fields");
      return;
    }
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/employees/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_name: name,
          employee_email: email,
        }),
      }
    );
    const data = await resp.json();
    if (data["status"]) {
      alert("Employee added");
      setName("");
      setEmail("");
    } else {
      alert("Error Occured");
    }
  }

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-12 container mx-auto w-[70%] my-4">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-3xl font-semibold text-gray-900">
              Add Employee
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Employee Name
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-green-600">
                    <input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      id="username"
                      type="text"
                      name="name"
                      placeholder="Enter Employee Name..."
                      className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Employee Email
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-green-600">
                    <input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      id="username"
                      type="text"
                      name="name"
                      placeholder="Enter Employee Email..."
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

      <div className="space-y-12 container mx-auto w-[90%] my-4">
        <h2 className="text-3xl font-semibold text-gray-900">All Employee</h2>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-green-600">
              <tr>
                <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[30%]">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[20%]">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[20%]">
                  Employee Email
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[50%]">
                  Account Active Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((item, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 text-gray-900">
                    {item.employee_id}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {item.employee_name}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {item.employee_email}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {item.active ? "ACTIVE" : "NOT ACTIVE"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Employees;
