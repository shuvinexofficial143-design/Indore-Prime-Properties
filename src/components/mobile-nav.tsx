"use client";
import Link from "next/link";import {usePathname} from "next/navigation";
const entries=[["/","⌂","Home"],["/properties","⌕","Explore"],["/saved","♡","Saved"],["/compare","⇄","Compare"],["/login","○","Profile"]];
export function MobileNav(){const path=usePathname();if(path.startsWith("/admin")||path.startsWith("/agent")||path.endsWith("/3d")||path.endsWith("/tour"))return null;return <nav className="mobile-nav" aria-label="Mobile navigation">{entries.map(([href,icon,label])=><Link key={href} href={href} aria-current={path===href?"page":undefined}><span aria-hidden="true">{icon}</span>{label}</Link>)}</nav>}
