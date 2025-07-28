import {createPool} from  'mysql2'
import {drizzle} from 'drizzle-orm/mysql2'
import {config} from 'dotenv'

config()

const pool = createPool({
    uri:process.env.DATABASE_URL
})

export const db = drizzle(pool)
