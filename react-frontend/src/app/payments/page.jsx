"use client"
import React, { useEffect, useState } from 'react'

const Payments = () => {
    const [data,setData] = useState([]);

    useEffect(()=>{
        (async()=>{
            const resp = await fetch(`${process.env.BACKEND_BASE_URL}/timelogs/totalTime`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({payPerHour:20})
            });
            const d = await resp.json()
            console.log(d)
            setData(d["results"]);
        })();
    },[]);
return (
    <div className="space-y-12 container mx-auto w-[70%] my-4">
        <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-3xl font-semibold text-gray-900">Total Payments of Employees</h2>
            <div
                className="overflow-x-auto rounded-lg shadow my-4"
                style={{ height: "70vh", overflowY: "auto" }}
            >
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                    <thead className="bg-green-600">
                        <tr>
                            <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[40%]">Employee ID</th>
                            <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[25%]">Employee Name</th>
                            <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[25%]">Total Time</th>
                            <th className="px-6 py-3 text-left text-lg font-semibold text-white w-[25%]">Total Pay</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {
                            data.map((item, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="px-6 py-4 text-gray-900">{item.employee_id}</td>
                                    <td className="px-6 py-4 text-gray-900">{item.employee_name}</td>
                                    <td className="px-6 py-4 text-gray-900">{item.total_time}</td>
                                    <td className="px-6 py-4 text-gray-900">₹{item.TotalPayOfDay}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
)
}

export default Payments