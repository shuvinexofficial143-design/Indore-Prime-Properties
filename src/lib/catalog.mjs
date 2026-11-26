import properties from "./properties.json" with { type: "json" };
export { properties };
export const locations = ["Vijay Nagar","Nipania","Rau","Super Corridor","Bicholi Mardana","MR-10","Scheme No. 140","AB Road","Palasia","Bengali Square"];
export const types = ["Apartment","Villa","Independent House","Office Space"];
/** @param {{purpose?:string,location?:string,type?:string,max?:string,sort?:string}} filters */
export function filterProperties(filters = {}) {
 const max = Number(filters.max);
 const rows = properties.filter(p => (!filters.purpose || p.purpose===filters.purpose) && (!filters.location || p.location===filters.location) && (!filters.type || p.type===filters.type) && (!Number.isFinite(max)||max<=0||p.price<=max));
 return filters.sort==="price-low" ? rows.sort((a,b)=>a.price-b.price) : filters.sort==="price-high" ? rows.sort((a,b)=>b.price-a.price) : rows;
}
/** @param {number} price @param {string} purpose */
export function formatPrice(price,purpose){return purpose==="rent" ? "₹"+price.toLocaleString("en-IN")+"/mo" : price>=10000000 ? "₹"+(price/10000000).toFixed(2).replace(/0$/,"").replace(/\.$/,"")+" Cr" : "₹"+(price/100000).toLocaleString("en-IN",{maximumFractionDigits:2})+" L"; }
