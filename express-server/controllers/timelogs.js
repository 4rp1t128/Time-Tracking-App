import * as schema from '../db/schema.js'
import {db} from '../db/db.js'
import { eq, and, desc, sql } from 'drizzle-orm';
import { DataBaseError } from './utils.js';

export async function getAllTimeLogs(req,res){
    try{
        const {employee_id} = req.body
        let results;
        if(employee_id){
            results = await db.execute(
                sql`SELECT log_id,employee_id,log, DATE_FORMAT(log_date, '%d/%m/%Y %h:%i:%s %p') as log_date 
            FROM time_logs 
            WHERE employee_id = ${employee_id} 
            ORDER BY log_date DESC`
            );
        }
        else{
             results = await db.execute(
                sql`SELECT log_id,time_logs.employee_id,employee_name,employee_email,log, DATE_FORMAT(log_date, '%d/%m/%Y %h:%i:%s %p') as log_date 
            FROM time_logs join employees on time_logs.employee_id = employees.employee_id
            ORDER BY log_date DESC`
            );
        }
        results = results[0]; // db.execute returns [rows, fields]
        res.status(200).json({status:true,message:"All Logs",results});
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function addTimeLog(req,res){
    try{
        const {employee_id,log} = req.body
        let details = await db.select().from(schema.employees).where(eq(schema.employees.employee_id,employee_id))
        if(details.length === 0){
            throw new DataBaseError("Employee does not exist",404)
        }
        if(details[0].active === false){
            throw new DataBaseError("Employee Account is not activated",400)
        }

        details = await db.select().from(schema.time_logs).where(
            eq(schema.time_logs.employee_id,employee_id)
        ).orderBy(desc(schema.time_logs.log_date)).limit(1);

        if(details.length === 0 && log === "EXIT"){
            throw new DataBaseError("Cannot exit if there is no entry log",400)
        }
        else if(details.length > 0 && details[0].log === log){
            throw new DataBaseError("Cannot perform this operation",400)
        }
        await db.insert(schema.time_logs).values({employee_id,log});
        res.status(200).json({status:true,message:"Log Created"});
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}

export async function getTotalTimeWithPay(req,res){
    try{
        let {payPerHour} = req.body

        const results = await db.execute(sql`select temp.employee_id, employee_name, sum(timediff) as total_time, round(sum(timediff)*${payPerHour/60},2) as TotalPayOfDay from (select employee_id, log_date,log, lag(log_date) over(partition by employee_id order by log_date) as prev_log, TIMESTAMPDIFF(minute,lag(log_date) over(partition by employee_id order by log_date),log_date) as timediff from time_logs order by log_date) as temp join employees on temp.employee_id = employees.employee_id where log = "EXIT" group by temp.employee_id;`)

        res.status(200).json({status:true,message:"All Details",results:results[0]});
    }
    catch(err){
        if(err instanceof DataBaseError)
            res.status(err.statusCode).json({status:false,message:err.message})
        else
            res.status(500).json({status:false,message:err.message})
    }
}