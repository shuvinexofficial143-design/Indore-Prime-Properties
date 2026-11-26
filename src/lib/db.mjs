import pg from "pg";
const {Pool}=pg;
let pool;
export function databaseConfigured(){return Boolean(process.env.DATABASE_URL);}
export function db(){
 if(!process.env.DATABASE_URL)throw new Error("Database not configured");
 const url=new URL(process.env.DATABASE_URL);
 if(!["postgres:","postgresql:"].includes(url.protocol))throw new Error("Invalid database URL");
 const local=["localhost","127.0.0.1","[::1]"].includes(url.hostname);
 if(!local&&!["require","verify-ca","verify-full"].includes(url.searchParams.get("sslmode")||""))throw new Error("Remote database requires TLS sslmode");
 if(!local&&url.searchParams.get("sslmode")!=="verify-full")url.searchParams.set("sslmode","verify-full");
 return pool??=new Pool({connectionString:url.toString(),max:3,idleTimeoutMillis:10000,connectionTimeoutMillis:8000});
}
