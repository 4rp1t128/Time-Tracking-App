"use client"
import React, { useState } from 'react'

const Activate = () => {
    const [id,setID] = useState("")
    const [password,setPassword] = useState("")
    async function submit(){
        if(id == "" || password == ""){
          alert("Fill all fields")
          return
        }
        const resp = await fetch("http://localhost:8000/employees/activate",{
          method:"POST",
           headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                employee_id:id,
                password:password
            })
        });
        const data = await resp.json()
        if(data["status"]){
          alert("Account Activated")
          setID("")
          setPassword("")
        }
        else{
          alert("Error Occured");
        }
    }
  return (
    <>
         <form onSubmit={(e)=>e.preventDefault()}   >
<div className="space-y-12 container mx-auto w-[70%] my-4">
    <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-3xl font-semibold text-gray-900">Activate Employee</h2>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">Employee ID</label>
                <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-green-600">
                        <input value={id} onChange={(e)=>{setID(e.target.value)}} id="username" type="text" name="name" placeholder="Enter Employee ID..." className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
                    </div>
                </div>
            </div>

        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">Set Password</label>
                <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-green-600">
                        <input value={password} onChange={(e)=>{setPassword(e.target.value)}} id="username" type="password" name="name" placeholder="Enter Password..." className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<div className="mt-6 flex items-center justify-center gap-x-6">
    <button onClick={submit} type="submit" className="rounded-md bg-green-600 px-3 py-2 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 cursor-pointer text-xl">Submit</button>
</div>
</form>
    </>
  )
}

export default Activate