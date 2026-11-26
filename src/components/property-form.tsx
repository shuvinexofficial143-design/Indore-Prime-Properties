import {locations,types} from "@/lib/catalog.mjs";
import {save} from "@/app/admin/properties/actions";
import type {Property} from "@/lib/property-types";
export function PropertyForm({p}:{p?:Property}){
 return <form action={save} className="editor-form">
 {p?.id&&<input type="hidden" name="id" value={p.id}/>}
 <label>Title<input name="title" defaultValue={p?.title} required minLength={3} maxLength={120}/></label>
 <label>URL slug<input name="slug" defaultValue={p?.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100}/></label>
 <label>Location<select name="location" defaultValue={p?.location||locations[0]}>{locations.map(x=><option key={x}>{x}</option>)}</select></label>
 <label>Type<select name="type" defaultValue={p?.type||types[0]}>{types.map(x=><option key={x}>{x}</option>)}</select></label>
 <label>Purpose<select name="purpose" defaultValue={p?.purpose||"buy"}><option value="buy">Buy</option><option value="rent">Rent</option></select></label>
 <label>Price (INR; monthly for rent)<input type="number" name="price" defaultValue={p?.price||""} required min={1} max={1000000000}/></label>
 <label>Bedrooms<input type="number" name="beds" defaultValue={p?.beds??2} required min={0} max={30}/></label>
 <label>Bathrooms<input type="number" name="baths" defaultValue={p?.baths??2} required min={0} max={30}/></label>
 <label>Area (sq ft)<input type="number" name="area" defaultValue={p?.area||""} required min={1}/></label>
 <label>Status<select aria-label="Status" name="status" defaultValue={p?.status||"draft"}>{["draft","published","archived","sold","rented"].map(x=><option key={x}>{x}</option>)}</select></label>
 <label>Fallback concept art<select name="art" defaultValue={p?.art||"house"}>{["villa","house","tower","office"].map(x=><option key={x}>{x}</option>)}</select></label>
 <label className="full">Description<textarea name="description" defaultValue={p?.description} required minLength={10} maxLength={4000} rows={5}/></label>
 <button className="button" type="submit">Save property</button>
 </form>
}
