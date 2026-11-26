export type Property={id?:string|null;slug:string;title:string;location:string;type:string;purpose:string;price:number;beds:number;baths:number;area:number;art:string;description:string;demo:boolean;status?:string;photoId?:string|null;modelId?:string|null};
export type Media={id:string;kind:string;title:string;mime:string;bytes:number;visible?:boolean;sort_order?:number};
export const propertyImage=(p:Property)=>p.photoId?"/api/media/"+p.photoId:"/architecture/"+p.art+".svg";
