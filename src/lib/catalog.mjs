import properties from "./properties.json" with { type: "json" };
export {properties};
export const locations=["Vijay Nagar","Nipania","Rau","Super Corridor","Bicholi Mardana","MR-10","Scheme No. 140","AB Road","Palasia","Bengali Square"];
export const types=["Apartment","Villa","Independent House","Office Space"];
export function filterProperties(filters={},source=properties){
 const max=Number(filters.max),min=Number(filters.min),beds=Number(filters.beds);
 const rows=source.filter(p=>(!filters.purpose||p.purpose===filters.purpose)&&(!filters.location||p.location===filters.location)&&(!filters.type||p.type===filters.type)&&(!Number.isFinite(max)||max<=0||p.price<=max)&&(!Number.isFinite(min)||min<=0||p.price>=min)&&(!Number.isFinite(beds)||beds<=0||p.beds===beds)&&(!filters.model||p.modelId||p.slug==="emerald-villa"));
 return filters.sort==="price-low"?rows.sort((a,b)=>a.price-b.price):filters.sort==="price-high"?rows.sort((a,b)=>b.price-a.price):filters.sort==="area"?rows.sort((a,b)=>b.area-a.area):rows;
}
export function formatPrice(price,purpose){return purpose==="rent"?"₹"+price.toLocaleString("en-IN")+"/mo":price>=10000000?"₹"+(price/10000000).toFixed(2).replace(/0$/,"").replace(/\.$/,"")+" Cr":"₹"+(price/100000).toLocaleString("en-IN",{maximumFractionDigits:2})+" L";}
