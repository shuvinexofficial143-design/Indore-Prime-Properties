export const sandboxStages=["new","contacted","qualified","visit_scheduled","closed","lost"];
export const sandboxPropertyStatuses=["draft","published","archived"];
export const initialSandbox=()=>({properties:[{id:1,title:"Emerald Villa · sample",price:18000000,status:"published"},{id:2,title:"Garden Apartment · sample",price:4500000,status:"draft"}],leads:[{id:1,alias:"Demo Buyer 01",property:1,status:"new"},{id:2,alias:"Demo Buyer 02",property:2,status:"contacted"}],visits:[{id:1,lead:1,status:"requested"}],history:["Isolated demonstration created."]});
const asId=x=>Number.isInteger(Number(x))&&Number(x)>0?Number(x):null;
export function sandboxChange(state,action,input){const s=structuredClone(state);let note="";
 if(action==="property_status"){const p=s.properties.find(x=>x.id===asId(input.id));if(!p||!sandboxPropertyStatuses.includes(input.status))return null;p.status=input.status;note=p.title+" → "+p.status;}
 else if(action==="property_price"){const p=s.properties.find(x=>x.id===asId(input.id)),price=Number(input.price);if(!p||!Number.isSafeInteger(price)||price<100000||price>100000000)return null;p.price=price;note=p.title+" price changed.";}
 else if(action==="add_property"){if(s.properties.length>=12)return null;const id=Math.max(0,...s.properties.map(x=>x.id))+1;s.properties.push({id,title:"Concept property "+String(id).padStart(2,"0"),price:6000000,status:"draft"});note="Sample property added.";}
 else if(action==="add_lead"){if(s.leads.length>=25)return null;const p=s.properties.find(x=>x.id===asId(input.property)&&x.status==="published");if(!p)return null;const id=Math.max(0,...s.leads.map(x=>x.id))+1;s.leads.push({id,alias:"Demo Buyer "+String(id).padStart(2,"0"),property:p.id,status:"new"});note="Sample enquiry captured.";}
 else if(action==="lead_status"){const l=s.leads.find(x=>x.id===asId(input.id));if(!l||!sandboxStages.includes(input.status))return null;l.status=input.status;note=l.alias+" → "+l.status;}
 else if(action==="add_visit"){const l=s.leads.find(x=>x.id===asId(input.id));if(!l||s.visits.length>=25||s.visits.some(v=>v.lead===l.id&&["requested","confirmed"].includes(v.status)))return null;const id=Math.max(0,...s.visits.map(x=>x.id))+1;s.visits.push({id,lead:l.id,status:"requested"});note="Sample visit requested.";}
 else if(action==="visit_status"){const v=s.visits.find(x=>x.id===asId(input.id));const allowed={requested:["confirmed","cancelled"],confirmed:["completed","cancelled"]};if(!v||!allowed[v.status]?.includes(input.status))return null;v.status=input.status;const l=s.leads.find(x=>x.id===v.lead);if(l&&v.status==="confirmed")l.status="visit_scheduled";note="Sample visit → "+v.status;}
 else if(action==="reset")return initialSandbox();else return null;
 s.history=[note,...s.history].slice(0,30);return s;}
