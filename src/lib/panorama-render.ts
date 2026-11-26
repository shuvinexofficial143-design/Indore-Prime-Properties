// Analytic ray-cast of simple room geometry into an equirectangular texture.
type RGB=[number,number,number];type Box={min:number[];max:number[];color:RGB};
export function renderRoom(scene:string):HTMLCanvasElement{
 const canvas=document.createElement("canvas");canvas.width=960;canvas.height=480;const ctx=canvas.getContext("2d")!;const data=ctx.createImageData(canvas.width,canvas.height);
 const objects:Box[]=[];const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:RGB)=>objects.push({min:[x-w/2,y-h/2,z-d/2],max:[x+w/2,y+h/2,z+d/2],color});
 const cream:RGB=[226,214,194],wood:RGB=[139,103,70],linen:RGB=[224,220,204],glass:RGB=[124,173,180],dark:RGB=[63,79,74],gold:RGB=[181,151,92];
 box(0,-.06,0,8,.12,7,[161,139,113]);box(0,3.06,0,8,.12,7,[241,234,216]);
 box(-4,1.5,0,.12,3,7,cream);box(4,1.5,0,.12,3,7,cream);box(0,1.5,-3.5,8,3,.12,cream);box(0,1.5,3.5,8,3,.12,cream);
 box(1.4,1.8,-3.39,3,1.45,.06,glass);box(1.4,1.8,-3.33,.06,1.45,.07,cream);box(1.4,1.8,-3.33,3,.06,.07,cream);
 box(-2.2,1.1,3.39,1.2,2.2,.07,wood);box(-1.75,1.1,3.32,.1,.1,.08,gold);
 if(scene==="bedroom"){box(0,.28,-1.3,2.4,.56,2.4,wood);box(0,.7,-1.3,2.3,.32,2.3,linen);box(0,1.0,-2.55,2.5,1.2,.2,wood);for(const x of [-.55,.55])box(x,.97,-2.1,.86,.2,.55,cream);for(const x of [-1.7,1.7])box(x,.4,-2,.65,.8,.65,wood);box(3.3,1.1,.7,1.15,2.2,2.5,wood);}
 else if(scene==="kitchen"){box(0,.45,-2.95,6.6,.9,.9,wood);box(0,.96,-2.95,6.6,.12,.98,linen);box(3.3,.45,-.2,.9,.9,4.6,wood);box(3.3,.96,-.2,.98,.12,4.6,linen);box(0,.45,-.9,2,.9,1.0,dark);box(0,.96,-.9,2.1,.12,1.1,linen);box(-2.7,2.25,-3.0,2.6,.7,.75,wood);box(3.2,1.1,2,1.1,2.2,1.2,[166,174,176]);}
 else{box(-2,.35,-2.2,3.1,.7,.95,linen);box(-2,.85,-2.58,3.1,.8,.23,linen);for(const x of [-3.43,-.57])box(x,.67,-2.2,.24,.6,.98,linen);box(-2,.03,-.9,3,.06,2,gold);box(-2,.35,-.9,1.5,.56,.8,wood);box(2,.38,2.95,2.2,.7,.5,wood);box(2,1.4,3.25,1.8,1.05,.12,dark);}
 const ox=0,oy=1.55,oz=1.0;
 function intersect(b:Box,dx:number,dy:number,dz:number){const dir=[dx,dy,dz],orig=[ox,oy,oz];let lo=-Infinity,hi=Infinity,axis=0;for(let k=0;k<3;k++){if(Math.abs(dir[k])<1e-7){if(orig[k]<b.min[k]||orig[k]>b.max[k])return null;continue;}let a=(b.min[k]-orig[k])/dir[k],c=(b.max[k]-orig[k])/dir[k];if(a>c){const t=a;a=c;c=t;}if(a>lo){lo=a;axis=k;}hi=Math.min(hi,c);if(hi<lo)return null;}return lo>.001?{distance:lo,axis}:null;}
 for(let y=0;y<canvas.height;y++){const lat=Math.PI*(.5-(y+.5)/canvas.height),cs=Math.cos(lat),dy=Math.sin(lat);for(let x=0;x<canvas.width;x++){const lon=2*Math.PI*((x+.5)/canvas.width-.5),dx=cs*Math.sin(lon),dz=-cs*Math.cos(lon);let nearest=Infinity,col:RGB=cream,axis=1;for(const b of objects){const hit=intersect(b,dx,dy,dz);if(hit&&hit.distance<nearest){nearest=hit.distance;col=b.color;axis=hit.axis;}}const shade=(axis===1?1:axis===0?.88:.95)*(1-Math.min(nearest,8)*.015);const i=(y*canvas.width+x)*4;data.data[i]=col[0]*shade;data.data[i+1]=col[1]*shade;data.data[i+2]=col[2]*shade;data.data[i+3]=255;}}
 ctx.putImageData(data,0,0);return canvas;
}
