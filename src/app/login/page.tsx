import Link from "next/link";
import {redirect} from "next/navigation";
import {currentUser,roleHome} from "@/lib/auth";
import {databaseConfigured} from "@/lib/db.mjs";
import {Header,Footer} from "@/components/site";
export const dynamic="force-dynamic";
export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
 const user=await currentUser();if(user)redirect(roleHome(user.role));
 const {error}=await searchParams;const enabled=databaseConfigured();
 return <><Header/><main className="section"><div className="auth-card"><p className="eyebrow">SECURE ACCESS</p><h1>Welcome back.</h1><p>Sign in to your authorized owner, agent or customer account.</p>{!enabled&&<p className="notice">Database and login are not configured yet. No public demo credentials are available.</p>}{error&&<p role="alert" className="notice">{error==="rate"?"Too many attempts. Try again in 15 minutes.":"Invalid email or password."}</p>}<form method="post" action="/api/auth/login" className="auth-form"><label>Email<input name="email" type="email" required autoComplete="username" maxLength={254}/></label><label>Password<input name="password" type="password" required autoComplete="current-password" maxLength={128}/></label><button className="button" disabled={!enabled}>Sign in</button></form><Link className="text-link" href="/">Back to public website</Link></div></main><Footer/></>;
}
