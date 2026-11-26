import * as THREE from "three";
export function villaModel(){
 const root=new THREE.Group(),roof=new THREE.Group();root.add(roof);
 const mat=(c:number)=>new THREE.MeshStandardMaterial({color:c,roughness:.85});
 const cream=mat(0xf4e7d1),stone=mat(0xc7bca8),wood=mat(0x936944),green=mat(0x547957),dark=mat(0x354843),glass=new THREE.MeshStandardMaterial({color:0x789da1,roughness:.25,metalness:.2}),linen=mat(0xf6f1e3),gold=mat(0xb99a63);
 function box(parent:THREE.Group,w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 box(root,24,.24,22,0,-.2,0,green);box(root,15,.28,11,0,.02,0,stone);box(root,13,.18,9,0,.22,0,cream);
 // Exterior shell: segmented walls leave real door and window openings.
 const h=3.2;box(root,.24,h,9,-6.5,1.85,0,cream);box(root,.24,h,9,6.5,1.85,0,cream);
 box(root,13,h,.24,0,1.85,-4.5,cream);
 for(const x of [-5.5,-1.7,1.7,5.5])box(root,2,h,.24,x,1.85,4.5,cream);
 for(const x of [-3.6,3.6]){box(root,1.8,.85,.22,x,.67,4.5,stone);box(root,1.8,1.75,.08,x,1.98,4.5,glass);box(root,1.8,.62,.24,x,3.14,4.5,cream);box(root,.08,1.75,.12,x,1.98,4.5,dark);}
 box(root,1.4,.65,.24,0,3.14,4.5,cream);
 // Room walls and doorway gaps. One storey; roof can be hidden.
 box(root,.18,3.2,3.1,-1.5,1.85,-2.95,cream);box(root,.18,3.2,1.6,-1.5,1.85,3.65,cream);
 box(root,5,3.2,.18,3.9,1.85,.6,cream);box(root,1.6,.7,.18,.6,3.1,.6,cream);
 box(root,5.1,.12,3.5,3.9,.34,2.6,stone);box(root,4.4,.12,3.5,-4,.34,-2.4,wood);
 // Living room sofa, coffee table, media console, rug.
 box(root,3.1,.65,.95,-3.9,.67,2.9,linen);box(root,3.1,.68,.22,-3.9,1.06,3.32,linen);
 for(const x of [-5.35,-2.45])box(root,.24,.55,.98,x,.88,2.9,linen);
 box(root,2.5,.04,1.8,-3.9,.36,1.5,gold);box(root,1.4,.42,.75,-3.9,.58,1.5,wood);
 box(root,2,.55,.42,-3.9,.55,-.5,wood);box(root,1.65,.92,.1,-3.9,1.35,-.48,dark);
 // Bedroom with headboard, mattress, two side tables.
 box(root,2.1,.48,2.3,3.7,.56,-2.3,wood);box(root,2.02,.36,2.18,3.7,.95,-2.3,linen);
 box(root,2.25,.95,.15,3.7,.95,-3.46,wood);for(const x of [3.2,4.2])box(root,.75,.18,.46,x,1.2,-3,cream);
 for(const x of [2.2,5.2])box(root,.55,.55,.55,x,.58,-3.0,wood);
 // Kitchen island and counters.
 box(root,4.1,.93,.7,3.85,.78,3.93,wood);box(root,4.1,.1,.79,3.85,1.28,3.93,stone);
 box(root,.7,.93,2.4,5.95,.78,2.6,wood);box(root,.8,.1,2.4,5.95,1.28,2.6,stone);
 box(root,1.9,.93,.85,3.75,.78,2.25,wood);box(root,2.05,.12,1,3.75,1.3,2.25,stone);
 // Dining area and entrance.
 box(root,1.25,.78,1.6,-.2,.75,-2.5,wood);for(const x of [-1.1,.7])for(const z of [-2.95,-2.05]){box(root,.46,.44,.46,x,.55,z,wood);box(root,.46,.45,.09,x,.87,z-.19,wood);}
 box(roof,13.7,.25,9.7,0,3.65,0,dark);box(roof,14.1,.14,10.1,0,3.85,0,stone);
 box(roof,4.5,.24,2.4,3.4,3.95,-1.4,wood);
 // Landscape, driveway, garden seating and carport.
 box(root,3.4,.05,8,8.5,.03,4.5,stone);box(root,3.7,.14,5.6,8.5,2.85,2.8,wood);
 for(const x of [6.8,10.2])for(const z of [.2,5.4])box(root,.14,2.8,.14,x,1.4,z,dark);
 box(root,1.7,.55,3.5,8.5,.65,3.1,dark);box(root,1.5,.48,1.85,8.5,1.15,2.9,glass);
 for(const x of [7.63,9.37])for(const z of [1.95,4.2]){const tire=new THREE.Mesh(new THREE.CylinderGeometry(.36,.36,.23,16),dark);tire.rotation.z=Math.PI/2;tire.position.set(x,.38,z);root.add(tire);}
 for(const [x,z] of [[-9,-5],[-9,4],[10,-7],[-3,-8],[3,-8]]){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.15,.22,1.5,8),wood);trunk.position.set(x,.75,z);root.add(trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.1,1),green);crown.position.set(x,2,z);root.add(crown);}
 box(root,2.5,.09,5,0,.07,7.5,stone);for(const x of [-2.1,2.1])box(root,1.2,.35,3.5,x,.2,7.5,green);
 return {root,roof};
}
