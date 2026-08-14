// ---------- PDF / Document Search ----------
async function initDocSearch(){
  const input = document.getElementById('doc-search');
  const results = document.getElementById('doc-results');
  const countEl = document.getElementById('doc-count');
  if(!input || !results) return;

  const previewLimit = parseInt(results.dataset.limit, 10) || 0; // 0 = show all
  const moreLink = results.dataset.moreLink || '';

  let documents = [];
  try{
    const res = await fetch('/documents.json');
    const data = await res.json(); documents = data.items;
  }catch(e){
    results.innerHTML = '<p style="color:#c00;padding:20px;">Could not load documents right now.</p>';
    return;
  }

  function render(list, isDefaultView){
    results.innerHTML = '';
    if(list.length === 0){
      results.innerHTML = '<p style="color:#888;padding:20px;">No documents match your search.</p>';
    }

    const showLimited = isDefaultView && previewLimit > 0 && list.length > previewLimit;
    const toShow = showLimited ? list.slice(0, previewLimit) : list;

    toShow.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h4>${doc.title}</h4><p>${doc.category} &middot; ${doc.region}</p><a class="download-btn" href="${doc.url}" target="_blank" rel="noopener">Open Document</a>`;
      results.appendChild(card);
    });

    if(showLimited && moreLink){
      const more = document.createElement('a');
      more.href = moreLink;
      more.className = 'card';
      more.style.cssText = 'text-align:center;display:flex;align-items:center;justify-content:center;color:var(--emerald);font-weight:700;';
      more.innerHTML = `See all ${list.length} documents &rarr;`;
      results.appendChild(more);
    }

    if(countEl) countEl.textContent = list.length + (list.length === 1 ? ' document' : ' documents');
  }

  render(documents, true);

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const filtered = documents.filter(doc =>
      doc.title.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.region.toLowerCase().includes(q)
    );
    render(filtered, q === ''); // only apply the preview limit when the search box is empty
  });
}

// ---------- Video Grid + Modal Player ----------

// Accepts a full YouTube URL (any common format) OR a bare video ID, and always
// returns just the 11-character ID. This means it doesn't matter what a CMS
// editor pastes in — a full link or just the ID both work correctly.
function extractYouTubeId(input){
  if(!input) return '';
  input = input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for(const p of patterns){
    const m = input.match(p);
    if(m) return m[1];
  }
  if(/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  return input; // fallback — will just fail gracefully to the placeholder thumbnail
}

async function initVideoGrid(){
  const grid = document.getElementById('video-grid');
  if(!grid) return;

  const previewLimit = parseInt(grid.dataset.limit, 10) || 0; // 0 = show all
  const moreLink = grid.dataset.moreLink || '';

  let videos = [];
  try{
    const res = await fetch('/videos.json');
    const data = await res.json(); videos = data.items;
  }catch(e){
    grid.innerHTML = '<p style="color:#c00;">Could not load videos right now.</p>';
    return;
  }

  const showLimited = previewLimit > 0 && videos.length > previewLimit;
  const toShow = showLimited ? videos.slice(0, previewLimit) : videos;

  toShow.forEach(v => {
    const id = extractYouTubeId(v.youtubeId);
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <div class="video-thumb-wrap">
        <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="${v.title}" onerror="this.onerror=null;this.parentElement.classList.add('thumb-fallback');this.style.display='none';">
        <div class="play-overlay">▶</div>
      </div>
      <div class="video-title">${v.title}</div>`;
    card.addEventListener('click', () => openVideoModal(id, v.title));
    grid.appendChild(card);
  });

  if(showLimited && moreLink){
    const more = document.createElement('a');
    more.href = moreLink;
    more.className = 'video-card';
    more.style.cssText = 'display:flex;align-items:center;justify-content:center;color:var(--emerald);font-weight:700;min-height:160px;text-decoration:none;';
    more.innerHTML = `See all ${videos.length} videos &rarr;`;
    grid.appendChild(more);
  }
}

function openVideoModal(id, title){
  const overlay = document.createElement('div');
  overlay.className = 'video-modal-overlay';
  overlay.innerHTML = `
    <div class="video-modal">
      <button class="video-modal-close" aria-label="Close">&times;</button>
      <div class="video-modal-frame">
        <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" title="${title}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => {
    if(e.target === overlay || e.target.classList.contains('video-modal-close')){
      overlay.remove();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDocSearch();
  initVideoGrid();
});
