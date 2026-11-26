import {z} from "zod";
import {locations,types} from "./catalog.mjs";
const whole=(min,max)=>z.coerce.number().int().min(min).max(max);
export const propertyInput=z.object({title:z.string().trim().min(3).max(120),slug:z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),location:z.enum(locations),type:z.enum(types),purpose:z.enum(["buy","rent"]),price:whole(1,1000000000),beds:whole(0,30),baths:whole(0,30),area:whole(1,1000000),description:z.string().trim().min(10).max(4000),status:z.enum(["draft","published","archived","sold","rented"]),art:z.enum(["villa","house","tower","office"])});
export const uuid=z.string().uuid();
