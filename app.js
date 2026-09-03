import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* Paste these two values after creating the free Supabase project.
   Do NOT put a service-role key here. Use the anon/publishable key only. */
const SUPABASE_URL = "https://pkfdvmvjdcvmmyuhskmg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZmR2bXZqZGN2bW15dWhza21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjA3NDgsImV4cCI6MjEwNDAzNjc0OH0.7gLvkvwxhbuwi_cyIfEUamIRvXsxjP0AQtM8yn0PsxE";

const PEOPLE = [
  {id:"snehil", name:"Snehil", birthday:"27 July"},
  {id:"khushi", name:"Khushi", birthday:"27 February"},
  {id:"riya", name:"Riya", birthday:"31 August"},
  {id:"shibam", name:"Shibam", birthday:"16 October"}
];

const app = document.querySelector("#app");
const configured = !SUPABASE_URL.includes("PASTE_") && !SUPABASE_ANON_KEY.includes("PASTE_");
const supabase = configured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function nextBirthday(person){
  const now = new Date();
  const [day, monthName] = person.birthday.split(" ");
  let d = new Date(now.getFullYear(), monthNames.indexOf(monthName), Number(day));
  if(d < new Date(now.getFullYear(), now.getMonth(), now.getDate())) d = new Date(now.getFullYear()+1, monthNames.indexOf(monthName), Number(day));
  return d;
}
function activeBirthday(){
  const now = new Date();
  const candidates = PEOPLE.map(p=>({p,d:nextBirthday(p)})).sort((a,b)=>a.d-b.d);
  return candidates[0].p;
}
function formatDate(d){return d.toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}
function escapeHtml(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

function render(){
  const active = activeBirthday();
  app.innerHTML = `
  <main class="shell">
    <header class="hero">
      <div>
        <div class="kicker">Four friends · one very long tradition</div>
        <h1>The Gift Club</h1>
        <p>Because after ten years, “what do you want?” has become a harder question than the birthday itself.</p>
      </div>
    </header>

    <section class="next card">
      <div>
        <span class="pill">NEXT BIRTHDAY</span>
        <div class="name">${escapeHtml(active.name)}</div>
        <div class="date">${formatDate(nextBirthday(active))}</div>
      </div>
      <button class="btn" onclick="openPerson('${active.id}')">Open ${escapeHtml(active.name)}'s wishlist</button>
    </section>

    <div class="section-head">
      <div><h2>The four of us</h2><p>Everyone can browse every wishlist, all year.</p></div>
    </div>
    <section class="grid">
      ${PEOPLE.map(p=>`
        <article class="person card">
          <div>
            <div class="kicker">Birthday</div>
            <h2>${escapeHtml(p.name)}</h2>
            <div class="birthday">${escapeHtml(p.birthday)}</div>
          </div>
          <div class="bottom">
            <span class="pill">${p.id===active.id ? "Claiming is open" : "Wishlist open"}</span>
            <button class="btn secondary" onclick="openPerson('${p.id}')">View wishlist</button>
          </div>
        </article>`).join("")}
    </section>

    <footer>Made for four friends who refuse to let a decade of birthdays defeat them.</footer>
  </main>`;
}

window.openPerson = async function(id){
  const p = PEOPLE.find(x=>x.id===id);
  if(!p) return;
  const items = configured ? await loadItems(id) : demoItems(id);
  const active = isClaimingOpen(p);
  app.innerHTML = `
  <main class="shell">
    <button class="btn ghost" onclick="render()">← Back</button>
    <header class="hero" style="padding-left:0">
      <div><div class="kicker">${escapeHtml(p.birthday)}</div><h1>${escapeHtml(p.name)}'s wishlist</h1>
      <p>${active ? "Gift claiming is currently open." : "Wishlist editing stays open throughout the year. Gift claiming opens 30 days before the birthday."}</p></div>
      <button class="btn secondary" onclick="showAdd('${p.id}')">+ Add gift</button>
    </header>
    <section class="items">
      ${items.length ? items.map(itemCard).join("") : `<div class="card empty">Nothing here yet. Add the first thing you'd genuinely love to receive.</div>`}
    </section>
  </main>`;
};

function isClaimingOpen(p){
  const b=nextBirthday(p), now=new Date();
  const start=new Date(b); start.setDate(start.getDate()-30);
  return now>=start && now<=b;
}

function itemCard(i){
  const img=i.image_url || "https://placehold.co/800x700/f0ece5/777?text=Gift";
  return `<article class="item card">
    <img src="${escapeHtml(img)}" alt="">
    <div class="itembody">
      <h3>${escapeHtml(i.name)}</h3>
      ${i.price ? `<div class="price">₹${escapeHtml(String(i.price))}</div>` : ""}
      ${i.notes ? `<div class="meta">${escapeHtml(i.notes)}</div>` : ""}
      <div class="actions">
        ${i.url ? `<a class="btn secondary" href="${escapeHtml(i.url)}" target="_blank" rel="noopener">View item</a>` : ""}
        ${i.claimed ? `<button class="btn secondary" disabled>Claimed</button>` : `<button class="btn" onclick="claimItem('${i.id}')">Claim</button>`}
      </div>
    </div>
  </article>`;
}

async function loadItems(personId){
  const {data,error}=await supabase.from("gifts").select("*").eq("person_id",personId).order("created_at",{ascending:false});
  if(error){console.error(error); return []}
  return data || [];
}

function demoItems(id){
  return [
    {id:"demo1",name:"Your first wishlist item",price:"",image_url:"",notes:"This preview becomes your real shared wishlist after setup.",url:"",claimed:false}
  ];
}

window.showAdd=function(personId){
  app.insertAdjacentHTML("beforeend", `<div class="modal" id="modal"><div class="modalbox card">
    <button class="btn ghost" style="float:right" onclick="closeModal()">Close</button>
    <h2>Add a gift</h2><p>Add something you'd genuinely be happy to receive. You can edit your wishlist throughout the year.</p>
    <label>Item name</label><input id="gname" placeholder="e.g. Sony headphones">
    <div class="row"><div><label>Price</label><input id="gprice" placeholder="2799"></div><div><label>Image URL</label><input id="gimage" placeholder="Optional"></div></div>
    <label>Shopping link</label><input id="gurl" placeholder="https://...">
    <label>Notes (optional)</label><input id="gnote" placeholder="Size, colour, exact version, etc.">
    <div class="notice">The birthday person will never see who claimed their gifts.</div>
    <button class="btn" style="width:100%;margin-top:10px" onclick="saveGift('${personId}')">Add to wishlist</button>
  </div></div>`);
}
window.closeModal=()=>document.querySelector("#modal")?.remove();

window.saveGift=async function(personId){
  if(!configured){alert("Finish the one-time Supabase setup first. The included setup guide walks you through it.");return}
  const name=document.querySelector("#gname").value.trim();
  if(!name){alert("Please enter an item name.");return}
  const gift={person_id:personId,name,price:document.querySelector("#gprice").value.trim()||null,image_url:document.querySelector("#gimage").value.trim()||null,url:document.querySelector("#gurl").value.trim()||null,notes:document.querySelector("#gnote").value.trim()||null};
  const {error}=await supabase.from("gifts").insert(gift);
  if(error){alert(error.message);return}
  closeModal(); openPerson(personId);
}

window.claimItem=async function(id){
  if(!configured){alert("Finish the one-time Supabase setup first.");return}
  const person=PEOPLE.find(p=>p.id===activeBirthday().id);
  // Lightweight flow: ask which friend is shopping, then authenticate with their Supabase account.
  await showShopperLogin(id);
};

async function showShopperLogin(giftId){
  app.insertAdjacentHTML("beforeend", `<div class="modal" id="modal"><div class="modalbox card">
    <button class="btn ghost" style="float:right" onclick="closeModal()">Close</button>
    <h2>Who's shopping?</h2><p>Choose your name and enter your PIN/password. The birthday person will not be shown who claimed the gift.</p>
    <label>Name</label>
    <select id="shopper" style="width:100%;padding:13px;border:1px solid var(--line);border-radius:13px;background:white">
      ${PEOPLE.map(p=>`<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")}
    </select>
    <label>PIN / password</label><input id="pass" type="password" inputmode="numeric" placeholder="Enter your PIN or password">
    <button class="btn" style="width:100%;margin-top:12px" onclick="doClaim('${giftId}')">Claim this gift</button>
  </div></div>`);
}
window.doClaim=async function(giftId){
  const shopperId=document.querySelector("#shopper").value;
  const password=document.querySelector("#pass").value;
  const emails={
    snehil:"snehil@giftclub.local",
    khushi:"khushi@giftclub.local",
    riya:"riya@giftclub.local",
    shibam:"shibam@giftclub.local"
  };
  const {data,error}=await supabase.auth.signInWithPassword({email:emails[shopperId],password});
  if(error){alert("That PIN/password didn't work.");return}
  const {data:gift,error:ge}=await supabase.from("gifts").select("person_id").eq("id",giftId).single();
  if(ge){alert("Could not find that gift.");return}
  if(gift.person_id===shopperId){alert("You can't claim your own birthday gift.");return}
  const owner=PEOPLE.find(p=>p.id===gift.person_id);
  if(!isClaimingOpen(owner)){alert("Gift claiming isn't open for this birthday yet.");return}
  const {error:e}=await supabase.from("gift_claims").insert({gift_id:giftId,shopper_id:data.user.id});
  if(e){alert(e.code==="23505" ? "That gift has already been claimed." : e.message);return}
  closeModal(); alert("Claimed! The birthday person won't be shown who claimed it."); openPerson(gift.person_id);
}


render();
