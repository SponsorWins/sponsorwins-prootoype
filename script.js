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

  function currency(n){ return n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}); }
  function randIn(lg){
    const r=ranges[lg];
    const base=Math.random()*(r.high-r.low)+r.low;
    const step=base>50000?1000:100;
    return Math.round(base/step)*step;
  }
  function randBrand(){ return brands[Math.floor(Math.random()*brands.length)]; }
  function initials(name){ return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(); }

  function card(lg, team, stadium, asset){
    const price=currency(randIn(lg));
    const chip=initials(team);
    const el=document.createElement('article'); el.className='card';
    el.innerHTML=`
      <div class="thumb"></div>
      <div class="meta">
        <span class="badge">${lg}</span>
        <div class="row"><span class="team"><span class="logo-chip">${chip}</span><strong>${team}</strong></span><span>${stadium}</span></div>
        <div class="row"><span class="asset">${asset}</span><span class="price">${price}</span></div>
      </div>
      <a class="cta" href="#" onclick="alert('Prototype: Open ${team} — ${asset}'); return false;">View Auction</a>`;
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

  buildNav(); populateLeagues(); populateTeams(leagueKeys[0]); populateAssets(leagueKeys[0]); renderCards(leagueKeys[0]);
  browseBtn.onclick=()=> renderCards(leagueSelect.value);
  shuffleBtn.onclick=()=> renderCards(leagueSelect.value);
  seedTicker(16); requestAnimationFrame(animate);
})();
