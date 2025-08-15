(function(){
  const { leagues, ranges, brands, assetsFor } = window.SW_DATA;
  const leagueKeys = Object.keys(leagues);

  const leagueNav = document.getElementById('leagueNav');
  const leagueSelect = document.getElementById('leagueSelect');
  const teamSelect = document.getElementById('teamSelect');
  const assetSelect = document.getElementById('assetSelect');
  const listingGrid = document.getElementById('listingGrid');
  const browseBtn = document.getElementById('browseBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const ticker = document.getElementById('ticker');

  /* ---------- Visual generators ---------- */

  // Simple deterministic color from string
  function colorFrom(str){
    let h=0; for(let i=0;i<str.length;i++) h = (h*31 + str.charCodeAt(i))>>>0;
    const hue = h % 360;
    return `hsl(${hue}deg 65% 45%)`;
  }
  function colorAccent(str){
    let h=0; for(let i=0;i<str.length;i++) h = (h*17 + str.charCodeAt(i))>>>0;
    const hue = h % 360;
    return `hsl(${(hue+30)%360}deg 70% 60%)`;
  }

  // SVG team crest with initials
  function crestSVG(team){
    const base = colorFrom(team);
    const acc  = colorAccent(team);
    const initials = team.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="g${hash(team)}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${acc}"/><stop offset="1" stop-color="${base}"/>
          </linearGradient>
        </defs>
        <path d="M32 4 L58 18 L50 48 L32 60 L14 48 L6 18 Z" fill="url(#g${hash(team)})" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>
        <circle cx="32" cy="32" r="10" fill="rgba(0,0,0,.25)"/>
        <text x="32" y="36" font-size="16" font-weight="900" text-anchor="middle" fill="white">${initials}</text>
      </svg>`;
  }

  // Asset thumbnail SVG (varies by asset type)
  function assetThumbSVG(asset){
    // background
    const bg = `<rect x="0" y="0" width="100%" height="100%" fill="#0f2248"/>` +
               `<rect x="0" y="0" width="100%" height="100%" fill="url(#glow)" opacity="0.35"/>`;

    const defs = `
      <defs>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#335eea"/><stop offset="1" stop-color="#0b1530"/>
        </linearGradient>
        <linearGradient id="led" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#59f"/><stop offset="1" stop-color="#9cf"/>
        </linearGradient>
        <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1" fill="#9cf"/>
        </pattern>
      </defs>`;

    // pick a motif
    let art = '';
    if (/Naming Rights/i.test(asset)){
      art = `<rect x="8" y="18" width="220" height="26" rx="6" fill="#f5c518"/><text x="118" y="36" font-size="16" text-anchor="middle" font-weight="900" fill="#0b0b0b">ARENA NAMING</text>`;
    } else if (/Jersey Patch/i.test(asset)){
      art = `<rect x="190" y="10" width="40" height="40" rx="6" fill="#f5c518"/>`+
            `<text x="210" y="36" font-size="18" text-anchor="middle" font-weight="900" fill="#0b0b0b">SW</text>`+
            `<rect x="20" y="12" width="120" height="80" rx="10" fill="#123"/>`+
            `<rect x="30" y="20" width="100" height="64" rx="8" fill="#1a2f5a"/>`;
    } else if (/Helmet Logo/i.test(asset)){
      art = `<path d="M60 80 q40-40 110-10 l20 20 v30 h-40 v-18 q-40 10-90-22z" fill="#1a2f5a" stroke="#294b8f" stroke-width="3"/>`+
            `<circle cx="140" cy="92" r="10" fill="#0b0b0b"/><circle cx="140" cy="92" r="5" fill="#888"/>`;
    } else if (/Dasher-Board|Outfield Wall|Pitch-Level/i.test(asset)){
      art = `<rect x="0" y="86" width="240" height="20" fill="#0b0b0b"/>`+
            `<rect x="10" y="88" width="60" height="16" fill="#f5c518"/>`+
            `<rect x="80" y="88" width="60" height="16" fill="#59f"/>`+
            `<rect x="150" y="88" width="80" height="16" fill="#9cf"/>`;
    } else if (/LED/i.test(asset)){
      art = `<rect x="10" y="90" width="220" height="12" fill="url(#led)"/>`+
            `<rect x="10" y="74" width="220" height="12" fill="url(#dots)" opacity=".6"/>`;
    } else if (/Videoboard/i.test(asset)){
      art = `<rect x="30" y="14" width="180" height="90" rx="8" fill="#111" stroke="#333"/>`+
            `<rect x="36" y="20" width="168" height="78" rx="6" fill="#223c78"/>`+
            `<text x="120" y="64" font-size="18" text-anchor="middle" fill="#cfe1ff">VIDEOBOARD</text>`;
    } else if (/Concession|Concourse/i.test(asset)){
      art = `<rect x="20" y="20" width="200" height="64" rx="6" fill="#1a2f5a"/>`+
            `<text x="120" y="58" font-size="16" text-anchor="middle" fill="#cfe1ff">CONCOURSE AREA</text>`;
    } else {
      // Fixed Signage or default
      art = `<rect x="16" y="22" width="208" height="56" rx="6" fill="#1a2f5a"/>`+
            `<text x="120" y="56" font-size="16" text-anchor="middle" fill="#cfe1ff">SPONSOR SIGNAGE</text>`;
    }

    return `<svg viewBox="0 0 240 120" role="img" aria-label="${asset} thumbnail">${defs}${bg}${art}</svg>`;
  }

  function hash(str){ let h=0; for(let i=0;i<str.length;i++) h=(h*131 + str.charCodeAt(i))>>>0; return h.toString(16); }
  function currency(n){ return n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}); }
  function randIn(lg){
    const r=ranges[lg];
    const base=Math.random()*(r.high-r.low)+r.low;
    const step=base>50000?1000:100;
    return Math.round(base/step)*step;
  }
  function randBrand(){ return brands[Math.floor(Math.random()*brands.length)]; }

  /* ---------- UI population ---------- */

  function buildNav(){
    leagueNav.innerHTML='';
    leagueKeys.forEach((lg, i)=>{
      const b=document.createElement('button');
      b.className='pill'+(i===0?' active':'');
      b.textContent=lg;
      b.onclick=()=>{
        [...leagueNav.children].forEach(c=>c.classList.remove('active'));
        b.classList.add('active');
        leagueSelect.value=lg; populateTeams(lg); populateAssets(lg); renderCards(lg);
      };
      leagueNav.appendChild(b);
    });
  }

  function populateLeagues(){
    leagueSelect.innerHTML='';
    leagueKeys.forEach(lg=>{
      const o=document.createElement('option'); o.value=lg; o.textContent=lg; leagueSelect.appendChild(o);
    });
    leagueSelect.value=leagueKeys[0];
  }
  function populateTeams(lg){
    teamSelect.innerHTML='';
    leagues[lg].forEach(([team,stadium])=>{
      const o=document.createElement('option'); o.value=team; o.textContent=team; o.dataset.stadium=stadium; teamSelect.appendChild(o);
    });
  }
  function populateAssets(lg){
    assetSelect.innerHTML='';
    assetsFor(lg).forEach(a=>{ const o=document.createElement('option'); o.value=a; o.textContent=a; assetSelect.appendChild(o); });
  }

  function crest(team){
    const span = document.createElement('span');
    span.className = 'logo-crest';
    span.innerHTML = crestSVG(team);
    return span;
  }

  function card(lg, team, stadium, asset){
    const price=currency(randIn(lg));
    const el=document.createElement('article'); el.className='card';
    const thumb = assetThumbSVG(asset);

    el.innerHTML=`
      <div class="thumb">${thumb}</div>
      <div class="meta">
        <span class="badge">${lg}</span>
        <div class="row">
          <span class="team">
            <!-- crest injected here -->
            <strong>${team}</strong>
          </span>
          <span>${stadium}</span>
        </div>
        <div class="row"><span class="asset">${asset}</span><span class="price">${price}</span></div>
      </div>
      <a class="cta" href="#" onclick="alert('Prototype: Open ${team} — ${asset}'); return false;">View Auction</a>`;

    // inject crest before team name
    const teamSpan = el.querySelector('.team');
    teamSpan.insertBefore(crest(team), teamSpan.firstChild);

    return el;
  }

  function renderCards(lg){
    listingGrid.innerHTML='';
    const assets = assetsFor(lg);
    const teams = leagues[lg];
    for(let i=0;i<4;i++){
      const [team, stadium] = teams[i];
      for(let j=0;j<2;j++){
        listingGrid.appendChild(card(lg, team, stadium, assets[j]));
      }
    }
  }

  /* ---------- Ticker ---------- */
  let items=[]; let last=0; let offset=0;
  function newItem(){
    const lg = leagueKeys[Math.floor(Math.random()*leagueKeys.length)];
    const [team] = leagues[lg][Math.floor(Math.random()*leagues[lg].length)];
    const asset = assetsFor(lg)[Math.floor(Math.random()*assetsFor(lg).length)];
    const price = currency(randIn(lg));
    const br = randBrand();
    const a=document.createElement('a'); a.href="#"; a.className='link'; a.onclick=(e)=>{e.preventDefault();};
    a.textContent = `${br} bid ${price} on ${asset} • ${team} (${lg})`;
    const span=document.createElement('span'); span.className='ticker-item';
    const dot=document.createElement('span'); dot.className='dot';
    span.appendChild(dot); span.appendChild(a);
    ticker.appendChild(span); items.push(span);
  }
  function seedTicker(n=16){ for(let i=0;i<n;i++) newItem(); }
  function animate(ts){
    if(!last) last=ts;
    const dt=ts-last; last=ts;
    const speed=44;
    offset -= (speed*dt/1000);
    ticker.style.transform = `translateX(${offset}px)`;
    if(items.length){
      const first=items[0];
      const rect=first.getBoundingClientRect();
      const holder=ticker.parentElement.getBoundingClientRect();
      if(rect.right < holder.left){
        const w=first.offsetWidth + 24;
        ticker.removeChild(first); items.shift(); offset += w;
      }
    }
    if(Math.random() < dt/5000){ newItem(); }
    requestAnimationFrame(animate);
  }

  // Init
  buildNav(); populateLeagues(); populateTeams(leagueKeys[0]); populateAssets(leagueKeys[0]); renderCards(leagueKeys[0]);
  browseBtn.onclick=()=> renderCards(leagueSelect.value);
  shuffleBtn.onclick=()=> renderCards(leagueSelect.value);
  seedTicker(16); requestAnimationFrame(animate);
})();
