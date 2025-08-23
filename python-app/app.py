from tkinter import *
from tkinter import messagebox
from tkinter.ttk import Treeview,Style
import requests
import pyautogui as pg
import threading
import os
import random
import time
import uuid
import dotenv

dotenv.load_dotenv()

class App():
    def __init__(self):
        self.root = Tk()
        self.root.geometry("1400x600")    
        self.root.title("Time Tracker⏳")

        self.starting_frame = Frame(self.root)
        self.signIn_frame = Frame(self.root)
        self.error_frame = Frame(self.root)

        self.user_home_page_frame = Frame(self.root)
        self.all_todo_frame = Frame(self.root)
        self.all_logs_frame = Frame(self.root)
        self.menubar = Menu(self.root)
        self.base_api = os.getenv("BACKEND_BASE_URL")

        self.db = None
        self.collection = None
        self.client = None
        
        self.all_screenshots = "../express-server/screenshots"
        
        self.employee_id = None
        self.data = None
        self.timer_running = False
        self.exit = False
        self.root.protocol("WM_DELETE_WINDOW", self.on_window_close)
        self.thread = threading.Thread(target=self.screenshot_loop,daemon=True)
        self.thread.start()
        self.startingPage()
        self.root.mainloop()
    
    def screenshot_loop(self):
        while True:
            if(self.exit) : break
            if(self.timer_running == False) : continue
            if(self.employee_id == None) : continue
            sleep_duration = random.uniform(2, 15)
            time.sleep(sleep_duration)
            try:
                idx = uuid.uuid4()
                path = os.path.join(self.all_screenshots,self.employee_id)
                if(not os.path.exists(path)):
                    os.makedirs(path)
                
                json_data = {"employee_id":self.employee_id,"screenshot_id":str(idx)}
                
                res = requests.post(self.base_api + "/screenshots/add",json=json_data)
                
                res = res.json()
                if(not res["status"]): 
                    raise Exception(res["message"])
                
                image_path = os.path.join(path,f"{idx}.png")
                pg.screenshot(imageFilename=image_path)
                
            except Exception as e:
                print(e)
                self.errorPage("Error Occured")
    
    def on_window_close(self):
        if(not self.timer_running) : 
            self.root.quit()
            self.exit = True
            return
        
        resp = messagebox.askyesno(title="Warning",message="Are you sure you want to close the session")
        if(resp and self.timer_running):
            resp = requests.post(self.base_api + "/timelogs/add",json={
                "employee_id":self.employee_id,
                "log":"EXIT"
            })
            resp = resp.json()
            if(resp["status"]):
                print("Log EXIT")
        
        self.exit = True
        self.root.quit()
    
    def logout(self):
        resp = messagebox.askyesno(title="Warning",message="Are you sure you want to logout")
        if(resp and self.timer_running):
            resp = requests.post(self.base_api + "/timelogs/add",json={
                "employee_id":self.employee_id,
                "log":"EXIT"
            })
            resp = resp.json()
            if(resp["status"]):
                print("Log EXIT")
            
        self.employee_id = None
        self.data = None
        self.startingPage()
    
    def showAllTasks(self):
        try:
            self.user_home_page_frame.pack_forget()
            self.all_logs_frame.pack_forget()
            self.all_todo_frame.pack_forget()
            self.error_frame.pack_forget()
            
            json_data = {"employee_id": self.employee_id}
            req = requests.post(self.base_api + "/tasks/filter", json=json_data)
            data = req.json()
            if not data["status"]:
                raise Exception(data["message"])

            # Remove any previous widgets in the frame
            for widget in self.all_todo_frame.winfo_children():
                widget.destroy()
            # Add the label and center it above the table
            label = Label(self.all_todo_frame, text="Your Tasks", font=("monospace", 20, "bold"))
            label.pack(pady=(10, 0))
            
            tree = Treeview(
                self.all_todo_frame,
                columns=("Serial No.", "Task Description", "Project Name", "Task Status"),
                show='headings',
                height=max(len(data["results"]), 10)
            )
            tree.heading("Serial No.", text="Serial No.")
            tree.heading("Task Description", text="Task Description")
            tree.heading("Project Name", text="Project Name")
            tree.heading("Task Status", text="Task Status")
            # Increased column widths
            tree.column("Serial No.", width=200, anchor="center")
            tree.column("Task Description", width=600, anchor="w")
            tree.column("Project Name", width=300, anchor="w")
            tree.column("Task Status", width=300, anchor="center")
            style = Style()
            style.configure("Treeview", font=("monospace", 16))
            style.configure("Treeview.Heading", font=("monospace", 18, "bold"))
            style.configure("Treeview", rowheight=40)

            for i, item in enumerate(data["results"]):
                tree.insert("", END, values=(i + 1, item["task_desc"], item["project_name"], item["status"]))

            # Add vertical scrollbar
            scrollbar = Scrollbar(self.all_todo_frame, orient="vertical", command=tree.yview)
            tree.configure(yscrollcommand=scrollbar.set)
            scrollbar.pack(side="right", fill="y")
            tree.pack(padx=10, pady=10, side="left", fill="both", expand=True)

            self.all_todo_frame.pack()

        except Exception as e:
            print(e)
            self.errorPage("Error Occured")
        
    def showAllLogs(self):
        try:
            self.user_home_page_frame.pack_forget()
            self.all_todo_frame.pack_forget()
            self.all_logs_frame.pack_forget()
            self.error_frame.pack_forget()
            
            json_data = {"employee_id": self.employee_id}
            req = requests.post(self.base_api + "/timelogs/all", json=json_data)
            data = req.json()
            if not data["status"]:
                raise Exception(data["message"])
            for widget in self.all_logs_frame.winfo_children():
                widget.destroy()
            
            label = Label(self.all_logs_frame, text="Your Logs", font=("monospace", 20, "bold"))
            label.pack(pady=(10, 0))
            
            # Calculate height based on number of logs, max 20 rows
            num_logs = len(data["results"])
            tree_height = max(num_logs, 10)

            tree = Treeview(
                self.all_logs_frame,
                columns=("Serial No.", "Date", "Log Status"),
                show='headings',
                height=tree_height
            )
            tree.heading("Serial No.", text="Serial No.")
            tree.heading("Date", text="Date")
            tree.heading("Log Status", text="Log Status")
            tree.column("Serial No.", width=180, anchor="center")
            tree.column("Date", width=600, anchor="w")
            tree.column("Log Status", width=180, anchor="w")

            style = Style()
            style.configure("Treeview", font=("monospace", 16))
            style.configure("Treeview.Heading", font=("monospace", 18, "bold"))
            
            for i, item in enumerate(data["results"]):
                tree.insert("", END, values=(i + 1, item["log_date"], item["log"]))
            # Add vertical scrollbar
            scrollbar = Scrollbar(self.all_logs_frame, orient="vertical", command=tree.yview)
            tree.configure(yscrollcommand=scrollbar.set)
            scrollbar.pack(side="right", fill="y")
            # Increase row height
            style.configure("Treeview", rowheight=40)
            tree.pack(padx=10, pady=10, side="left", fill="both", expand=True)
            # Increase row height
            style.configure("Treeview", rowheight=40)
            tree.pack(padx=10, pady=10)
            
            self.all_logs_frame.pack()
            
        except Exception as e:
            print(e)
            self.errorPage("Error Occured")
        
    def createMenuBar(self):
        self.menubar = Menu(self.root)
        home = Menu(self.menubar,tearoff=False)
        about = Menu(self.menubar,tearoff=False)

        self.menubar.add_cascade(label="Home",menu=home)
        self.menubar.add_cascade(label="About",menu=about)
        
        home.add_cascade(label="Home",command=lambda : self.userHomePage(self.data))
        home.add_cascade(label="Tasks",command=lambda:self.showAllTasks())
        home.add_cascade(label="Logs",command=lambda:self.showAllLogs())
        home.add_separator()
        home.add_cascade(label="Logout",command=lambda:self.logout())
        home.add_separator()
        home.add_cascade(label="Exit",command=self.root.destroy)

        about.add_cascade(label="About",command=lambda:messagebox.askokcancel(title="About",message="This is a Time Tracking App"))
        self.root.config(menu=self.menubar)
            
    def toggle_timer(self):
        if not self.timer_running:
            self.timer_running = True
            self.timer_button.config(text="Stop Timer")
            resp = requests.post(self.base_api + "/timelogs/add",json={
                "employee_id":self.employee_id,
                "log":"ENTRY"
            })
            resp = resp.json()
            if(resp["status"]):
                print("Log ENTRY")
        else:
            self.timer_running = False
            self.timer_button.config(text="Start Timer")
            resp = requests.post(self.base_api + "/timelogs/add",json={
                "employee_id":self.employee_id,
                "log":"EXIT"
            })
            resp = resp.json()
            if(resp["status"]):
                print("Log EXIT")

    def userHomePage(self,identity):
        self.signIn_frame.pack_forget()
        self.user_home_page_frame.pack_forget()
        self.error_frame.pack_forget()
        self.all_logs_frame.pack_forget()
        self.all_todo_frame.pack_forget()
        
        for widget in self.user_home_page_frame.winfo_children():
            widget.destroy()
        
        employee_name = identity["results"]["employee_name"]
        employee_id = identity["results"]["employee_id"]

        self.employee_id = employee_id
        self.data = identity
        self.createMenuBar()

        Label(self.user_home_page_frame,text=f"Welcome {employee_name}",font=("monospace",20,"bold")).grid(row=1,column=2)
        
        self.timer_button = Button(
            self.user_home_page_frame,
            text="Start Timer" if not self.timer_running else "Stop Timer",
            font=("monospace", 16, "bold"),
            command=self.toggle_timer
        )
        self.timer_button.grid(row=2, column=2, pady=20)

        self.user_home_page_frame.pack()

    def loginUser(self,dict):
        try:
            if(dict["email"] == "" or dict["password"] == ""):
                messagebox.showwarning(title="Warning",message="Fill all entries")
            else:
                json_data = {
                    "email":dict["email"],
                    "password":dict["password"]
                }
                req = requests.post(self.base_api + "/employees/auth",json=json_data)
                data = req.json()
                if(data["status"]):
                    self.userHomePage(identity=data)
                else:
                    messagebox.showerror(title="Error",message="You are not authorized!")
                    self.startingPage()
        except Exception as e:
            print(e)
            self.errorPage("Cannot Connect to Database")
        
   
    def loginPage(self):
        self.starting_frame.pack_forget()
        self.error_frame.pack_forget()

        if(self.client):
            self.client.close()
            self.client = None

        email = StringVar()
        password = StringVar()
        
        Label(self.signIn_frame,text="Login",font=("monospace",20,"bold")).grid(column=2,row=0,pady=10)

        Label(self.signIn_frame,text="Email",font=("monospace",20,"bold")).grid(column=1,row=1,pady=10,padx=5)
        emailInput = Entry(self.signIn_frame,textvariable=email,font=("monospace",20,"bold"),width=30)
        emailInput.grid(row=1,column=2,pady=10,padx=5)

        Label(self.signIn_frame,text="Password",font=("monospace",20,"bold")).grid(column=1,row=2,padx=5,pady=10)
        emailInput = Entry(self.signIn_frame,textvariable=password,show="*",font=("monospace",20,"bold"),width=30)
        emailInput.grid(row=2,column=2,padx=5,pady=10)

        Button(self.signIn_frame,text="Home",font=("monospace",20,"bold"),command=self.startingPage).grid(row=3,column=1,pady=20,padx=5)

        Button(self.signIn_frame,text="Submit",font=("monospace",20,"bold"),command=lambda:self.loginUser({"email":email.get(),"password":password.get()})).grid(row=3,column=2,pady=20,padx=5)
        self.signIn_frame.pack()

    def errorPage(self,message):
        self.starting_frame.pack_forget()
        self.signIn_frame.pack_forget()
        self.user_home_page_frame.pack_forget()
        self.all_todo_frame.pack_forget()
        self.menubar.destroy()

        if(self.client):
            self.client.close()
            self.client = None

        self.root.title("Internal Server Error - 500")
        Label(self.error_frame,text="Internal Server Error",font=("monospace",20,"bold")).grid(column=2,row=1,pady=20)
        Label(self.error_frame,text="Status Code - 500",font=("monospace",20,"bold")).grid(row=2,column=2,pady=20)
        Label(self.error_frame,text=message,font=("monospace",20,"bold")).grid(row=3,column=2,pady=20)
        Button(self.error_frame,text="Home",font=("monospace",20,"bold"),command=self.startingPage).grid(row=4,column=2,pady=20,padx=5)

        self.error_frame.pack()

    def startingPage(self):
        self.signIn_frame.pack_forget()
        self.error_frame.pack_forget()
        self.user_home_page_frame.pack_forget()
        self.all_todo_frame.pack_forget()
        self.all_logs_frame.pack_forget()
        self.starting_frame.pack_forget()
        self.menubar.destroy()

        if(self.client):
            self.client.close()
            self.client = None

        Label(self.starting_frame,text="Welcome to Time Tracking App".upper(),font=("monospace",20,"bold")).grid(column=2,row=1,pady=20)

        signIn = Button(self.starting_frame,text="Login",font=("monospace",20,"bold"),command=self.loginPage)
        signIn.grid(column=2,row=2,padx=100,pady=10)

        close = Button(self.starting_frame,text="Exit",font=("monospace",20,"bold"),command=self.root.destroy)
        close.grid(column=2,row=4,padx=100,pady=10)

        self.starting_frame.pack()


if __name__ == '__main__':
    app  = App()

