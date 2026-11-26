import type {Metadata} from "next";import type {ReactNode} from "react";import "./globals.css";import "./auth.css";import "./platform.css";import "./viewer.css";import "./crm.css";import {MobileNav} from "@/components/mobile-nav";
export const metadata:Metadata={title:"Indore Prime Properties | Shuvi 360 Demo",description:"A fictional real estate portfolio demonstration by Shuvi 360.",robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body>{children}<MobileNav/></body></html>;}
