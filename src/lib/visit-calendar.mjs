const offset=330*60000;
export function localDate(value){return new Date(new Date(value).getTime()+offset).toISOString().slice(0,10);}
export function weekStart(date){let d;if(typeof date==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(date)){const t=new Date(date+"T00:00:00Z");if(Number.isFinite(t.getTime())&&t.toISOString().slice(0,10)===date)d=t;}if(!d)d=new Date(localDate(Date.now())+"T00:00:00Z");d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10);}
export function shiftDay(date,days){const d=new Date(date+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
export function calendarDays(date,visits){const first=weekStart(date);return Array.from({length:7},(_,i)=>{const day=shiftDay(first,i);return {day,rows:visits.filter(v=>localDate(v.starts_at)===day).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at))};});}
