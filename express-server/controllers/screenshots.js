import * as schema from '../db/schema.js'
import {db} from '../db/db.js'
import { DataBaseError } from './utils.js';
import { desc,eq, sql } from 'drizzle-orm';

export async function addSnapshot(req,res){
    try{
        const {employee_id,screenshot_id} = req.body
        let resp = await db.insert(schema.screenshots).values({employee_id,screenshot_id})
        res.status(200).json({status:true,message:"Screenshot added",results:resp});
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function getAllScreenshots(req,res){
    try{
        const {employee_id} = req.body
        let resp = await db.execute(
            sql`SELECT screenshot_id, 
            DATE_FORMAT(screenshot_date, '%d/%m/%Y %h:%i:%s %p') AS screenshot_date 
             FROM screenshots 
             WHERE employee_id = ${employee_id} 
             ORDER BY screenshot_date DESC`
        );
        resp = resp[0]; // For mysql2, results are in the first element
        res.status(200).json({status:true,message:"All Screenshots",results:resp});
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}