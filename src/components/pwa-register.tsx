"use client";import {useEffect} from "react";
export function PwaRegister(){useEffect(()=>{if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost"))void navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(()=>{});},[]);return null;}
