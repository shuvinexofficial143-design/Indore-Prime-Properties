"use client";
import {useEffect,useRef,useState} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {villaModel} from "./villa-model";
type Control={preset:(mode:string)=>void;zoom:(delta:number)=>void;quality:(high:boolean)=>void;hotspots:(on:boolean)=>void};
function dispose(root:THREE.Object3D){const materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>(),geometries=new Set<THREE.BufferGeometry>();root.traverse(o=>{if(o instanceof THREE.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const val of Object.values(m))if(val instanceof THREE.Texture)textures.add(val);}}});for(const t of textures)t.dispose();for(const m of materials)m.dispose();for(const g of geometries)g.dispose();}
export function ModelViewer({url,illustration}:{url?:string;illustration:string}){
 const mount=useRef<HTMLDivElement>(null),shell=useRef<HTMLDivElement>(null),api=useRef<Control|null>(null);
 const [state,setState]=useState("Loading model…"),[view,setView]=useState("Exterior"),[high,setHigh]=useState(false),[spots,setSpots]=useState(false),[full,setFull]=useState(false);
 useEffect(()=>{const el=mount.current;if(!el)return;let alive=true,renderer:THREE.WebGLRenderer;const scene=new THREE.Scene();scene.background=new THREE.Color(0xdbe6df);let root:THREE.Object3D|undefined,roof:THREE.Group|undefined;const abort=new AbortController();try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"low-power"});}catch{setState("WebGL unavailable on this device.");return;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.25));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.shadowMap.enabled=false;el.appendChild(renderer.domElement);
 const camera=new THREE.PerspectiveCamera(48,1,.05,500);camera.position.set(18,15,22);
 const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,1.5,0);orbit.enableDamping=true;orbit.minDistance=2;orbit.maxDistance=70;orbit.maxPolarAngle=Math.PI*.48;orbit.update();
 scene.add(new THREE.HemisphereLight(0xfff8e8,0x61786c,2.1));const sun=new THREE.DirectionalLight(0xffedc7,2.8);sun.position.set(12,18,8);scene.add(sun);
 const grid=new THREE.GridHelper(70,35,0xa1b2a4,0xc6d3c8);grid.position.y=-.37;scene.add(grid);
 const markers=new THREE.Group();scene.add(markers);markers.visible=false;
 const markerMat=new THREE.MeshBasicMaterial({color:0xeab54d});
 for(const [x,y,z] of [[-3.8,2,2.3],[3.7,2,-2.3],[3.7,2,2.3]]){const marker=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),markerMat);marker.position.set(x,y,z);markers.add(marker);}
 function preset(mode:string){if(roof)roof.visible=mode!=="Interior";if(mode==="Top"){camera.position.set(.01,34,.01);orbit.target.set(0,0,0);}else if(mode==="Interior"&&!url){camera.position.set(11,17,12);orbit.target.set(0,.65,0);}else{camera.position.set(18,15,22);orbit.target.set(0,1.5,0);}orbit.update();}
 api.current={preset,zoom:(d)=>{const v=camera.position.clone().sub(orbit.target);v.setLength(THREE.MathUtils.clamp(v.length()*d,orbit.minDistance,orbit.maxDistance));camera.position.copy(orbit.target).add(v);orbit.update();},quality:(on)=>{renderer.setPixelRatio(Math.min(window.devicePixelRatio,on?2:1.25));renderer.shadowMap.enabled=on&&!url;sun.castShadow=on&&!url;renderer.setSize(el.clientWidth,el.clientHeight,false);},hotspots:on=>{markers.visible=on&&!url;}};
 const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(w&&h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}};
 const obs=new ResizeObserver(resize);obs.observe(el);resize();
 const lost=(e:Event)=>{e.preventDefault();setState("WebGL context lost. Reload or use the property image.");};renderer.domElement.addEventListener("webglcontextlost",lost);
 renderer.setAnimationLoop(()=>{orbit.update();renderer.render(scene,camera);});
 async function load(){try{
 if(url){const res=await fetch(url,{signal:abort.signal,cache:"no-store"});if(!res.ok)throw Error("Model unavailable");const buffer=await res.arrayBuffer();const model=await new GLTFLoader().parseAsync(buffer,"");if(!alive){dispose(model.scene);return;}root=model.scene;const bounds=new THREE.Box3().setFromObject(root),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());const extent=Math.max(size.x,size.y,size.z);if(!Number.isFinite(extent)||extent<=0)throw Error("Empty model");const scale=15/extent;root.position.sub(center);root.position.multiplyScalar(scale);root.scale.multiplyScalar(scale);root.position.y+=size.y*scale/2;
 }else{const sample=villaModel();root=sample.root;roof=sample.roof;}
 if(root){scene.add(root);preset("Exterior");setState("");}
 }catch{if(alive)setState("Model could not be loaded. Use the property image instead.");}}
 void load();
 return()=>{alive=false;abort.abort();api.current=null;obs.disconnect();orbit.dispose();renderer.setAnimationLoop(null);renderer.domElement.removeEventListener("webglcontextlost",lost);dispose(scene);if(root&&root.parent!==scene)dispose(root);renderer.dispose();renderer.domElement.remove();};
 },[url]);
 useEffect(()=>{const f=()=>setFull(!!document.fullscreenElement);document.addEventListener("fullscreenchange",f);return()=>document.removeEventListener("fullscreenchange",f)},[]);
 function preset(v:string){setView(v);api.current?.preset(v);}
 async function toggleFull(){try{if(document.fullscreenElement)await document.exitFullscreen();else await shell.current?.requestFullscreen();}catch{setState("Fullscreen is not available on this browser.");}}
 return <div className="viewer-shell" ref={shell}><div className="viewer-stage"><div ref={mount} className="viewer-mount" data-testid="model-canvas" aria-label="Interactive 3D model; drag to rotate, pinch or scroll to zoom"/>{state&&<div className="viewer-message"><div><p role="status">{state}</p><img src={illustration} alt="Property concept fallback" style={{maxHeight:180,margin:"10px auto"}}/></div></div>}</div><div className="viewer-controls"><button className="button outline" aria-pressed={view==="Exterior"} onClick={()=>preset("Exterior")}>Orbit / exterior</button>{!url&&<button className="button outline" aria-pressed={view==="Interior"} onClick={()=>preset("Interior")}>Interior cutaway</button>}<button className="button outline" aria-pressed={view==="Top"} onClick={()=>preset("Top")}>Top view</button><button className="button outline" onClick={()=>api.current?.zoom(.8)}>Zoom in +</button><button className="button outline" onClick={()=>api.current?.zoom(1.25)}>Zoom out −</button><button className="button outline" onClick={()=>preset("Exterior")}>Reset camera</button>{!url&&<button className="button outline" aria-pressed={spots} onClick={()=>{setSpots(!spots);api.current?.hotspots(!spots);}}>Room markers</button>}<button className="button outline" aria-pressed={high} onClick={()=>{setHigh(!high);api.current?.quality(!high);}}>{high?"High quality":"Balanced quality"}</button><button className="button outline" onClick={toggleFull}>{full?"Exit fullscreen":"Fullscreen"}</button></div><p className="viewer-label">Drag to rotate · two-finger gesture or wheel to zoom · right drag to pan. {url?"Uploaded model; interior geometry and dimensions are not independently verified.":"Single-storey conceptual geometry; gold markers indicate living room, bedroom and kitchen. No verified measurements or walkthrough."}</p></div>
}
