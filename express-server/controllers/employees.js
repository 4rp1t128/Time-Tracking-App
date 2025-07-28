import * as schema from '../db/schema.js'
import {db} from '../db/db.js'
import { eq, and } from 'drizzle-orm';
import { DataBaseError } from './utils.js'
import * as bcrypt from 'bcrypt'

export async function authenticateEmployee(req,res) {
    try{
        const {email, password} = req.body
        let details = await db.select().from(schema.employees).where(eq(schema.employees.employee_email,email))
        if(details.length != 1){
            throw new DataBaseError("Incorrect Credentials",400)
        }
        const {employee_id,employee_email,password_hash,employee_name} = details[0];
        let resp = await bcrypt.compare(password,password_hash);
        if(!resp){
            throw new DataBaseError("Incorrect Credentials",400)
        }
        res.status(200).json({status:true,message:"User Authenticated",results:{employee_id,employee_email,employee_name}});
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function addEmployee(req,res){
    try{
        const {employee_name,employee_email} = req.body
        let details = await db.select().from(schema.employees).where(eq(schema.employees.employee_email,employee_email))
        if(details.length !== 0){
            throw new DataBaseError("Use different email id",404)
        }
        await db.insert(schema.employees).values({employee_name,active:false,employee_email})
        res.json({status:true,message:"Employee Added"}).status(201)
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function activateEmployee(req,res){
    try{
        const {employee_id,password} = req.body
        const details = await db.select().from(schema.employees).where(eq(schema.employees.employee_id,employee_id));
        if(details.length === 0){
            throw new DataBaseError("Employee is not present",404)
        }
        if(details[0].password_hash != "NA"){
            throw new DataBaseError("Account is already activated!",400)
        }
        let salt = await bcrypt.genSalt(10);
        let password_hash = await bcrypt.hash(password,salt);
        await db.update(schema.employees).set({active:true,password_hash}).where(eq(schema.employees.employee_id,employee_id))
        res.status(200).json({status:true,message:"Employee Activated"})
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function addEmployeeToProject(req,res){
    try{
        const {employee_id,project_id} = req.body
        let details = await db.select().from(schema.employees).where(eq(schema.employees.employee_id,employee_id))
        if(details.length == 0){
            throw new DataBaseError("Employee Does not exists",400)
        }
        if(details[0].active === false){
            throw new DataBaseError("Employee account is not activated",400)
        }

        details = await db.select().from(schema.employee_project_map).where(and(
            eq(schema.employee_project_map.employee_id,employee_id),
            eq(schema.employee_project_map.project_id,project_id)
        ))

        if(details.length != 0){
            throw new DataBaseError("Employee is already present in the project",400)
        }

        await db.insert(schema.employee_project_map).values({employee_id,project_id});
        res.json({status:true,message:"Employee added to project"}).status(500)
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function removeEmployee(req,res){
    try{
        const {employee_id} = req.body
        await db.delete(schema.employees).where(eq(schema.employees.employee_id,employee_id))
        res.status(200).json({status:true,message:"Employee Removed"})
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function allEmployee(req,res){
    try{
        let results = await db.select({employee_id:schema.employees.employee_id,employee_name:schema.employees.employee_name,employee_email:schema.employees.employee_email,active:schema.employees.active}).from(schema.employees);
        res.status(200).json({status:true,message:"All Employees",results})
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}