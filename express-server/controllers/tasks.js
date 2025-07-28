import * as schema from '../db/schema.js'
import {db} from '../db/db.js'
import { eq, and, sql } from 'drizzle-orm';
import { DataBaseError } from './utils.js';

export async function filterTasks(req,res){
    try{
        const {employee_id,project_id,status} = req.body
        let array = []
        if(employee_id){
            array.push(eq(schema.tasks.employee_id,employee_id))
        }
        if(project_id){
            array.push(eq(schema.tasks.project_id,project_id))
        }
        if(status){
            array.push(eq(schema.tasks.status,status))
        }
        const results = await db.select({project_name:schema.projects.project_name,task_desc:schema.tasks.task_desc,task_id:schema.tasks.task_id,status:schema.tasks.status}).from(schema.tasks).where(and(...array)).innerJoin(schema.projects,eq(schema.projects.project_id,schema.tasks.project_id))
        res.status(200).json({status:true,message:"All Details",results})
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function addTask(req,res){
    try{
        const {employee_id,project_id,task_desc} = req.body
        let details = await db.select().from(schema.employees).where(eq(schema.employees.employee_id,employee_id))
        if(details.length === 0){
            throw new DataBaseError("Employee does not exist",404)
        }
        if(details[0].active === false){
            throw new DataBaseError("Employee Account is not activated",400)
        }

        details = await db.select().from(schema.projects).where(eq(schema.projects.project_id,project_id))
        if(details.length === 0){
            throw new DataBaseError("Project does not exist",404)
        }

        await db.insert(schema.tasks).values({employee_id,project_id,task_desc})
        res.status(200).json({status:true,message:"Task Added"})
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function removeTask(req,res){
    try{
        const {task_id} = req.body
        await db.delete(schema.tasks).where(eq(schema.tasks.task_id,task_id));
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function allTask(req,res){
    try{
        let resp = await db.execute(
            sql`select employee_id, project_name, t.project_id, employee_name, task_desc, task_id from (select employees.employee_id, project_id, employee_name, task_desc, task_id,status from tasks join employees on tasks.employee_id = employees.employee_id) as t join projects on t.project_id = projects.project_id`
        )
        res.status(200).json({status:true,message:"All Tasks",results:resp[0]})
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function updateTask(req,res){
     try{
        const {task_id,status,employee_id,project_id} = req.body
        let updated = {}
        if(status) updated[status] = status
        if(employee_id) updated[employee_id] = employee_id
        if(project_id) updated[project_id] = project_id
        db.update(schema.tasks).set(updated).where(eq(schema.tasks.task_id,task_id))
        res.status(200).json({"status":true,message:"Task Updated"})
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}