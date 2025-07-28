import { mysqlTable, varchar, text, boolean, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const employees = mysqlTable("employees",{
    employee_id:varchar("employee_id",{length:300}).primaryKey().default(sql`(UUID())`),
    employee_name : varchar("employee_name",{length:300}).notNull(),
    employee_email:varchar("employee_email",{length:300}).notNull().default("NA").unique(),
    password_hash:varchar("password_hash",{length:300}).notNull().default("NA"),
    active : boolean("active").notNull()
})

export const projects = mysqlTable("projects",{
    project_id : varchar("project_id",{length:300}).primaryKey().default(sql`(UUID())`),
    project_name : varchar("project_name",{length:300}).notNull(),
    project_desc : text("project_desc").notNull(),
})

export const employee_project_map = mysqlTable("employee_project_map",{
    project_id : varchar("project_id",{length:300}).references(()=>projects.project_id,{onDelete:"cascade"}),
    employee_id : varchar("employee_id",{length:300}).references(()=>employees.employee_id,{onDelete:"cascade"})
})

export const tasks = mysqlTable("tasks",{
    task_id : varchar("task_id",{length:300}).primaryKey().default(sql`(UUID())`),
    project_id : varchar("project_id",{length:300}).references(()=>projects.project_id,{onDelete:"cascade"}),
    employee_id : varchar("employee_id",{length:300}).references(()=>employees.employee_id,{onDelete:"cascade"}),
    task_desc : text("task_desc").notNull(),
    status : mysqlEnum(["COMPLETED","PENDING","CREATED"]).default("CREATED").notNull()
})

export const time_logs = mysqlTable("time_logs",{
    log_id : varchar("log_id",{length:300}).primaryKey().default(sql`(UUID())`),
    employee_id : varchar("employee_id",{length:300}).references(()=>employees.employee_id,{onDelete:"cascade"}),
    log_date : timestamp("log_date").notNull().defaultNow(),
    log: mysqlEnum(["ENTRY","EXIT"]).notNull()
})

export const screenshots = mysqlTable("screenshots",{
    screenshot_id : varchar("screenshot_id",{length:300}).primaryKey().default(sql`(UUID())`),
    employee_id : varchar("employee_id",{length:300}).references(()=>employees.employee_id,{onDelete:"cascade"}),
    screenshot_date : timestamp("screenshot_date").notNull().defaultNow()
})