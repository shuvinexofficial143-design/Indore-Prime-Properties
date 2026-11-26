import "server-only";
import {S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";
const vars=["S3_BUCKET","S3_REGION","S3_ACCESS_KEY_ID","S3_SECRET_ACCESS_KEY"] as const;
export function storageConfigured(){return vars.every(k=>Boolean(process.env[k]));}
function client(){if(!storageConfigured())throw Error("Media storage not configured");const endpoint=process.env.S3_ENDPOINT;if(endpoint&&new URL(endpoint).protocol!=="https:")throw Error("Storage endpoint must use HTTPS");return new S3Client({region:process.env.S3_REGION!,endpoint: endpoint||undefined,forcePathStyle:!!endpoint,credentials:{accessKeyId:process.env.S3_ACCESS_KEY_ID!,secretAccessKey:process.env.S3_SECRET_ACCESS_KEY!}});}
export async function storeObject(key:string,body:Uint8Array,mime:string){const s=client();try{await s.send(new PutObjectCommand({Bucket:process.env.S3_BUCKET!,Key:key,Body:body,ContentType:mime}));}finally{s.destroy();}}
export async function readObject(key:string){const s=client();try{const r=await s.send(new GetObjectCommand({Bucket:process.env.S3_BUCKET!,Key:key}));if(!r.Body)throw Error("Object missing");return await r.Body.transformToByteArray();}finally{s.destroy();}}
export async function deleteObject(key:string){const s=client();try{await s.send(new DeleteObjectCommand({Bucket:process.env.S3_BUCKET!,Key:key}));}finally{s.destroy();}}
