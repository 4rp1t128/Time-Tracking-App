"use client";
import React, { useEffect, useState } from "react";

const TimeLogs = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/timelogs/all`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      const d = await resp.json();
      console.log(d);
      setData(d["results"]);
    })();
  }, []);
  return (
    <div className="space-y-12 container mx-auto w-[70%] my-4">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-3xl font-semibold text-gray-900">
          Time Tracking of Employee
        </h2>
        <div
          className="overflow-x-auto rounded-lg shadow my-4"
          style={{ height: "70vh", overflowY: "auto" }}
        >
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-green-600">
              <tr>
                <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[30%]">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[30%]">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[30%]">
                  Employee Email
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[50%]">
                  TimeStamp
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[50%]">
                  Log Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, idx) => (
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
                  <td className="px-6 py-4 text-gray-900">{item.log_date}</td>
                  <td className="px-6 py-4 text-gray-900">{item.log}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimeLogs;
