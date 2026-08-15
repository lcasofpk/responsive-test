// ---------- PDF / Document Search ----------

async function initDocSearch(){

  const input = document.getElementById('doc-search');
  const results = document.getElementById('doc-results');
  const countEl = document.getElementById('doc-count');

  if(!input || !results) return;

  const isFullRepository =
    results.dataset.fullRepository === 'true';

  const previewLimit =
    parseInt(results.dataset.limit, 10) || 0;

  const moreLink =
    results.dataset.moreLink || '';

  const pagination =
    document.getElementById('doc-pagination');

  const gridButton =
    document.getElementById('doc-grid-view');

  const listButton =
    document.getElementById('doc-list-view');

  const PER_PAGE = 50;

  let documents = [];
  let filteredDocuments = [];
  let currentPage = 1;
  let viewMode = 'grid';


  // ---------- Load Documents ----------

  try{

    const res = await fetch('/documents.json');

    const data = await res.json();

    documents = Array.isArray(data.items)
      ? data.items
      : [];

    filteredDocuments = documents;

  }catch(e){

    results.innerHTML =
      '<p style="color:#c00;padding:20px;">Could not load documents right now.</p>';

    return;

  }


  // ---------- Helpers ----------

  function safe(value){
    return String(value || '');
  }


  function escapeHTML(value){

    return safe(value)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');

  }


  function categoryClass(category){

    return 'category-' +
      safe(category)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g,'-')
        .replace(/^-|-$/g,'');

  }


  // ---------- Render One Document ----------

  function renderDocument(doc){

    const card =
      document.createElement('div');

    card.className =
      viewMode === 'list'
        ? 'card document-card document-list-view'
        : 'card document-card';


    const title =
      escapeHTML(doc.title);

    const category =
      escapeHTML(doc.category || 'Other');

    const region =
      escapeHTML(doc.region || '');

    const url =
      escapeHTML(doc.url || '#');


    card.innerHTML = `

      <div class="document-content">

        <span class="document-category ${categoryClass(doc.category)}">
          ${category}
        </span>

        <h4>${title}</h4>

        ${
          region
            ? `<p class="document-region">${region}</p>`
            : ''
        }

      </div>

      <a
        class="download-btn"
        href="${url}"
        target="_blank"
        rel="noopener"
      >
        Open Document
      </a>

    `;

    results.appendChild(card);

  }


  // ---------- Pagination ----------

  function renderPagination(totalPages){

    if(!pagination) return;

    pagination.innerHTML = '';

    if(totalPages <= 1) return;


    // Previous

    const previous =
      document.createElement('button');

    previous.type = 'button';

    previous.textContent = '← Previous';

    previous.className = 'pagination-btn';

    previous.disabled =
      currentPage === 1;

    previous.addEventListener('click', function(){

      if(currentPage > 1){

        currentPage--;

        render();

        window.scrollTo({
          top: results.offsetTop - 100,
          behavior: 'smooth'
        });

      }

    });

    pagination.appendChild(previous);


    // Page numbers

    const maxVisiblePages = 7;

    let startPage =
      Math.max(1, currentPage - 3);

    let endPage =
      Math.min(
        totalPages,
        startPage + maxVisiblePages - 1
      );

    if(endPage - startPage < maxVisiblePages - 1){

      startPage =
        Math.max(
          1,
          endPage - maxVisiblePages + 1
        );

    }


    if(startPage > 1){

      addPageButton(1);

      if(startPage > 2){

        const dots =
          document.createElement('span');

        dots.className = 'pagination-dots';

        dots.textContent = '…';

        pagination.appendChild(dots);

      }

    }


    for(
      let page = startPage;
      page <= endPage;
      page++
    ){

      addPageButton(page);

    }


    if(endPage < totalPages){

      if(endPage < totalPages - 1){

        const dots =
          document.createElement('span');

        dots.className = 'pagination-dots';

        dots.textContent = '…';

        pagination.appendChild(dots);

      }

      addPageButton(totalPages);

    }


    // Next

    const next =
      document.createElement('button');

    next.type = 'button';

    next.textContent = 'Next →';

    next.className = 'pagination-btn';

    next.disabled =
      currentPage === totalPages;

    next.addEventListener('click', function(){

      if(currentPage < totalPages){

        currentPage++;

        render();

        window.scrollTo({
          top: results.offsetTop - 100,
          behavior: 'smooth'
        });

      }

    });

    pagination.appendChild(next);


    function addPageButton(page){

      const button =
        document.createElement('button');

      button.type = 'button';

      button.textContent = page;

      button.className =
        'pagination-btn' +
        (page === currentPage
          ? ' active'
          : '');

      button.addEventListener('click', function(){

        currentPage = page;

        render();

        window.scrollTo({
          top: results.offsetTop - 100,
          behavior: 'smooth'
        });

      });

      pagination.appendChild(button);

    }

  }


  // ---------- Render Documents ----------

  function render(){

    results.innerHTML = '';

    if(pagination){
      pagination.innerHTML = '';
    }


    // No results

    if(filteredDocuments.length === 0){

      results.innerHTML =
        '<p style="color:#888;padding:20px;grid-column:1/-1;text-align:center;">No documents match your search.</p>';

      if(countEl){
        countEl.textContent = 'No documents found';
      }

      return;

    }


    // ---------- Resources Preview ----------

    if(!isFullRepository){

      const toShow =
        previewLimit > 0
          ? filteredDocuments.slice(0, previewLimit)
          : filteredDocuments;

      toShow.forEach(renderDocument);


      if(countEl){

        countEl.textContent =
          filteredDocuments.length +
          (
            filteredDocuments.length === 1
              ? ' document'
              : ' documents'
          );

      }

      return;

    }


    // ---------- Full Repository ----------

    const totalPages =
      Math.ceil(
        filteredDocuments.length / PER_PAGE
      );


    if(currentPage > totalPages){

      currentPage = totalPages;

    }


    const start =
      (currentPage - 1) * PER_PAGE;

    const end =
      Math.min(
        start + PER_PAGE,
        filteredDocuments.length
      );


    const pageDocuments =
      filteredDocuments.slice(start, end);


    pageDocuments.forEach(renderDocument);


    if(countEl){

      countEl.textContent =
        `Showing ${start + 1}–${end} of ${filteredDocuments.length} documents`;

    }


    renderPagination(totalPages);

  }


  // ---------- Search ----------

  input.addEventListener('input', function(){

    const q =
      input.value.trim().toLowerCase();


    filteredDocuments =
      documents.filter(function(doc){

        return (

          safe(doc.title)
            .toLowerCase()
            .includes(q)

          ||

          safe(doc.category)
            .toLowerCase()
            .includes(q)

          ||

          safe(doc.region)
            .toLowerCase()
            .includes(q)

        );

      });


    currentPage = 1;

    render();

  });


  // ---------- Grid View ----------

  if(gridButton){

    gridButton.addEventListener('click', function(){

      viewMode = 'grid';

      results.classList.remove(
        'documents-list'
      );

      results.classList.add(
        'grid'
      );

      gridButton.classList.add('active');

      if(listButton){
        listButton.classList.remove('active');
      }

      render();

    });

  }


  // ---------- List View ----------

  if(listButton){

    listButton.addEventListener('click', function(){

      viewMode = 'list';

      results.classList.remove(
        'grid'
      );

      results.classList.add(
        'documents-list'
      );

      listButton.classList.add('active');

      if(gridButton){
        gridButton.classList.remove('active');
      }

      render();

    });

  }


  // ---------- Initial Render ----------

  render();

}


// ---------- Video Grid + Modal Player ----------

// Accepts a full YouTube URL or a bare YouTube ID.

function extractYouTubeId(input){

  if(!input) return '';

  input = input.trim();

  const patterns = [

    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/

  ];


  for(const pattern of patterns){

    const match =
      input.match(pattern);

    if(match){
      return match[1];
    }

  }


  if(/^[a-zA-Z0-9_-]{11}$/.test(input)){
    return input;
  }


  return input;

}


// ---------- Video Grid ----------

async function initVideoGrid(){

  const grid =
    document.getElementById('video-grid');

  if(!grid) return;


  const previewLimit =
    parseInt(grid.dataset.limit, 10) || 0;

  const moreLink =
    grid.dataset.moreLink || '';


  let videos = [];


  try{

    const res =
      await fetch('/videos.json');

    const data =
      await res.json();

    videos =
      Array.isArray(data.items)
        ? data.items
        : [];

  }catch(e){

    grid.innerHTML =
      '<p style="color:#c00;">Could not load videos right now.</p>';

    return;

  }


  grid.innerHTML = '';


  const showLimited =
    previewLimit > 0 &&
    videos.length > previewLimit;


  const toShow =
    showLimited
      ? videos.slice(0, previewLimit)
      : videos;


  toShow.forEach(function(v){

    const id =
      extractYouTubeId(v.youtubeId);


    const card =
      document.createElement('div');

    card.className =
      'video-card';


    card.innerHTML = `

      <div class="video-thumb-wrap">

        <img
          src="https://img.youtube.com/vi/${id}/hqdefault.jpg"
          alt="${escapeVideoText(v.title)}"
          onerror="this.onerror=null;this.parentElement.classList.add('thumb-fallback');this.style.display='none';"
        >

        <div class="play-overlay">
          ▶
        </div>

      </div>

      <div class="video-title">
        ${escapeVideoText(v.title)}
      </div>

    `;


    card.addEventListener('click', function(){

      openVideoModal(
        id,
        v.title
      );

    });


    grid.appendChild(card);

  });


  if(showLimited && moreLink){

    const more =
      document.createElement('a');

    more.href =
      moreLink;

    more.className =
      'video-card';

    more.style.cssText =
      'display:flex;align-items:center;justify-content:center;color:var(--emerald);font-weight:700;min-height:160px;text-decoration:none;';

    more.innerHTML =
      `See all ${videos.length} videos →`;

    grid.appendChild(more);

  }

}


// ---------- Video Text Escape ----------

function escapeVideoText(value){

  return String(value || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');

}


// ---------- Video Modal ----------

function openVideoModal(id, title){

  const overlay =
    document.createElement('div');

  overlay.className =
    'video-modal-overlay';


  overlay.innerHTML = `

    <div class="video-modal">

      <button
        class="video-modal-close"
        aria-label="Close"
      >
        &times;
      </button>

      <div class="video-modal-frame">

        <iframe
          src="https://www.youtube.com/embed/${id}?autoplay=1"
          title="${escapeVideoText(title)}"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>

      </div>

    </div>

  `;


  document.body.appendChild(
    overlay
  );


  overlay.addEventListener(
    'click',
    function(e){

      if(
        e.target === overlay ||
        e.target.classList.contains(
          'video-modal-close'
        )
      ){

        overlay.remove();

      }

    }
  );

}


// ---------- Initialise ----------

document.addEventListener(
  'DOMContentLoaded',
  function(){

    initDocSearch();

    initVideoGrid();

  }
);
