import * as schema from '../db/schema.js'
import {db} from '../db/db.js'
import { eq } from 'drizzle-orm';
import { DataBaseError } from './utils.js';

export async function addProject(req,res){
    try{
        const {project_name,project_desc} = req.body
        await db.insert(schema.projects).values({project_name,project_desc})
        res.json({status:true,message:"Project Added"}).status(201)
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function allProject(req,res){
    try{
        let results = await db.select().from(schema.projects)
        res.json({status:true,message:"Project Added",results}).status(201)
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function removeProject(req,res){
    try{
        const {project_id} = req.body
        
        await db.delete(schema.projects).where(eq(project_id,schema.projects.project_id));
        res.json({status:true,message:"Project Removed"}).status(200)
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}