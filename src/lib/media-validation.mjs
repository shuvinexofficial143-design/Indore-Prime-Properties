import {imageSize} from "image-size";
export const MAX_MEDIA=3*1024*1024;
const mimeKinds={photo:["image/jpeg","image/png","image/webp"],floor_plan:["image/jpeg","image/png","image/webp","application/pdf"],brochure:["application/pdf"],model:["model/gltf-binary"],panorama:["image/jpeg","image/png","image/webp"]};
export function checkMedia(kind,bytes){
 if(!mimeKinds[kind]||!bytes.length||bytes.length>MAX_MEDIA)throw Error("Unsupported file or size");
 const b=Buffer.from(bytes);let mime="";
 if(b[0]===255&&b[1]===216&&b[2]===255)mime="image/jpeg";
 else if(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))mime="image/png";
 else if(b.toString("ascii",0,4)==="RIFF"&&b.toString("ascii",8,12)==="WEBP")mime="image/webp";
 else if(b.toString("ascii",0,5)==="%PDF-")mime="application/pdf";
 else if(b.length>=20&&b.toString("ascii",0,4)==="glTF"&&b.readUInt32LE(4)===2&&b.readUInt32LE(8)===b.length){
 const n=b.readUInt32LE(12);if(n<2||20+n>b.length||b.readUInt32LE(16)!==0x4e4f534a)throw Error("Invalid GLB");
 const doc=JSON.parse(b.toString("utf8",20,20+n).trim());
 if(doc.asset?.version!=="2.0"||JSON.stringify(doc).match(/"uri"\s*:/))throw Error("Only self-contained GLB models are accepted");
 mime="model/gltf-binary";
 }
 if(!mimeKinds[kind].includes(mime))throw Error("File type does not match media category");
 if(mime.startsWith("image/")){const d=imageSize(b);if(!d.width||!d.height||d.width*d.height>20000000)throw Error("Invalid or oversized image dimensions");if(kind==="panorama"&&(d.width<512||Math.abs(d.width/d.height-2)>.08))throw Error("Panorama must be an equirectangular 2:1 image");}
 return mime;
}
