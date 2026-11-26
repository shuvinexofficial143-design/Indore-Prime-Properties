import {locations,types} from "./catalog.mjs";
const hindiDigits="०१२३४५६७८९";const normal=s=>s.toLowerCase().replace(/[०-९]/g,x=>String(hindiDigits.indexOf(x))).replace(/,/g,"").trim();
const aliases={"Vijay Nagar":["vijay nagar","विजय नगर"],Nipania:["nipania","nipaniya","निपानिया","निपानिया"],Rau:["rau","राऊ"],"Super Corridor":["super corridor","सुपर कॉरिडोर"],"Bicholi Mardana":["bicholi","बिचौली"],"MR-10":["mr-10","mr 10"],"Scheme No. 140":["scheme 140","scheme no. 140","स्कीम 140"],"AB Road":["ab road","एबी रोड"],Palasia:["palasia","पलासिया"],"Bengali Square":["bengali square","बंगाली चौराहा"]};
export function parsePropertyQuery(input){const s=normal(typeof input==="string"?input.slice(0,300):"");const out={};if(/\b(rent|rental|lease)\b|किराय/.test(s))out.purpose="rent";else if(/\b(buy|purchase|sale)\b|खरीद|खरीदना/.test(s))out.purpose="buy";
 for(const location of locations)if((aliases[location]||[]).some(x=>s.includes(x))){out.location=location;break;}
 if(/\b(villa)\b|विला/.test(s))out.type="Villa";else if(/\b(flat|apartment)\b|फ्लैट|अपार्टमेंट/.test(s))out.type="Apartment";else if(/\b(office|commercial)\b|ऑफिस|दुकान/.test(s))out.type="Office Space";else if(/independent house|bungalow|बंगला|स्वतंत्र मकान/.test(s))out.type="Independent House";
 const bhk=s.match(/\b([1-9])\s*(?:bhk|bedroom|bedrooms)\b|([1-9])\s*(?:बीएचके|कमरे)/);if(bhk)out.beds=bhk[1]||bhk[2];
 const budget=s.match(/(\d+(?:\.\d+)?)\s*(crore|cr\b|करोड़|करोड|lakh|lac|लाख|thousand|k\b|हजार|हज़ार)/);if(budget){const n=Number(budget[1]),u=budget[2],factor=/crore|cr|करोड़|करोड/.test(u)?10000000:/lakh|lac|लाख/.test(u)?100000:1000;const price=Math.round(n*factor);if(price>=1&&price<=1000000000)out.max=String(price);}
 else{const v=s.match(/(?:₹|rs\.?\s*|inr\s*|budget\s*|बजट\s*)(\d{4,10})/);if(v&&Number(v[1])<=1000000000)out.max=v[1];}
 if(/\b3d\b|थ्री डी|त्रिआयामी/.test(s))out.model="yes";return out;}
