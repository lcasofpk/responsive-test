// =========================================================
// DOCUMENT / KNOWLEDGE MATERIALS REPOSITORY
// =========================================================

async function initDocSearch(){

  const input = document.getElementById('doc-search');
  const results = document.getElementById('doc-results');
  const countEl = document.getElementById('doc-count');

  if(!input || !results) return;

  const isFullRepository =
    results.dataset.fullRepository === 'true';

  const previewLimit =
    parseInt(results.dataset.limit, 10) || 0;

  const pagination =
    document.getElementById('doc-pagination');

  const gridButton =
    document.getElementById('doc-grid-view');

  const listButton =
    document.getElementById('doc-list-view');

  let documents = [];
  let filteredDocuments = [];

  let currentPage = 1;

  const perPage = 50;

  let currentView = 'grid';


  // -------------------------------------------------------
  // LOAD DOCUMENTS
  // -------------------------------------------------------

  try{

    const res = await fetch('/documents.json');

    if(!res.ok){
      throw new Error('Could not load documents.json');
    }

    const data = await res.json();

    documents = Array.isArray(data.items)
      ? data.items
      : [];

    filteredDocuments = documents;

  }catch(error){

    results.innerHTML =
      '<p style="color:#c00;padding:20px;">Could not load documents right now.</p>';

    return;

  }


  // -------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------

  function escapeHTML(value){

    if(value === undefined || value === null){
      return '';
    }

    return String(value)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');

  }


  function getCategoryClass(category){

    const value =
      String(category || 'Other')
        .toLowerCase()
        .trim();

    if(
      value.includes('legal') ||
      value.includes('act') ||
      value.includes('law')
    ){
      return 'doc-category-legal';
    }

    if(
      value.includes('report') ||
      value.includes('research')
    ){
      return 'doc-category-report';
    }

    if(
      value.includes('manual') ||
      value.includes('guide')
    ){
      return 'doc-category-manual';
    }

    if(
      value.includes('policy') ||
      value.includes('brief')
    ){
      return 'doc-category-policy';
    }

    if(
      value.includes('toolkit') ||
      value.includes('tool')
    ){
      return 'doc-category-toolkit';
    }

    if(
      value.includes('training') ||
      value.includes('capacity')
    ){
      return 'doc-category-training';
    }

    return 'doc-category-other';

  }


  // -------------------------------------------------------
  // RENDER DOCUMENT CARD
  // -------------------------------------------------------

  function createDocumentCard(doc){

    const card =
      document.createElement('div');

    card.className =
      'card document-card ' +
      getCategoryClass(doc.category);


    const title =
      escapeHTML(doc.title || 'Untitled Document');

    const category =
      escapeHTML(doc.category || 'Other');

    const region =
      escapeHTML(doc.region || 'Pakistan');

    const url =
      escapeHTML(doc.url || '#');


    if(currentView === 'list'){

      card.classList.add('document-list-item');

      card.innerHTML = `

        <div class="document-info">

          <h4>${title}</h4>

          <p class="document-meta">
            <span class="document-category">
              ${category}
            </span>

            <span class="document-region">
              ${region}
            </span>
          </p>

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

    }else{

      card.innerHTML = `

        <div class="document-category-label">
          ${category}
        </div>

        <h4>${title}</h4>

        <p>${region}</p>

        <a
          class="download-btn"
          href="${url}"
          target="_blank"
          rel="noopener"
        >
          Open Document
        </a>

      `;

    }

    return card;

  }


  // -------------------------------------------------------
  // PAGINATION
  // -------------------------------------------------------

  function renderPagination(totalItems){

    if(!pagination) return;

    pagination.innerHTML = '';

    const totalPages =
      Math.ceil(totalItems / perPage);

    if(totalPages <= 1) return;


    const previous =
      document.createElement('button');

    previous.type = 'button';

    previous.className = 'pagination-btn';

    previous.textContent = '← Previous';

    previous.disabled =
      currentPage === 1;

    previous.addEventListener(
      'click',
      function(){

        if(currentPage > 1){

          currentPage--;

          render(
            filteredDocuments,
            false
          );

          window.scrollTo({
            top: document
              .getElementById('doc-results')
              .getBoundingClientRect()
              .top
              + window.scrollY
              - 120,
            behavior:'smooth'
          });

        }

      }
    );


    pagination.appendChild(previous);


    // Page numbers

    const startPage =
      Math.max(1,currentPage - 2);

    const endPage =
      Math.min(totalPages,currentPage + 2);


    for(
      let page = startPage;
      page <= endPage;
      page++
    ){

      const button =
        document.createElement('button');

      button.type = 'button';

      button.className =
        'pagination-btn' +
        (page === currentPage
          ? ' active'
          : '');

      button.textContent = page;

      button.addEventListener(
        'click',
        function(){

          currentPage = page;

          render(
            filteredDocuments,
            false
          );

          window.scrollTo({
            top: document
              .getElementById('doc-results')
              .getBoundingClientRect()
              .top
              + window.scrollY
              - 120,
            behavior:'smooth'
          });

        }
      );

      pagination.appendChild(button);

    }


    const next =
      document.createElement('button');

    next.type = 'button';

    next.className =
      'pagination-btn';

    next.textContent = 'Next →';

    next.disabled =
      currentPage === totalPages;

    next.addEventListener(
      'click',
      function(){

        if(currentPage < totalPages){

          currentPage++;

          render(
            filteredDocuments,
            false
          );

          window.scrollTo({
            top: document
              .getElementById('doc-results')
              .getBoundingClientRect()
              .top
              + window.scrollY
              - 120,
            behavior:'smooth'
          });

        }

      }
    );


    pagination.appendChild(next);

  }


  // -------------------------------------------------------
  // RENDER DOCUMENTS
  // -------------------------------------------------------

  function render(list,isDefaultView){

    results.innerHTML = '';

    if(!list.length){

      results.innerHTML =
        '<p class="document-empty">No documents match your search.</p>';

      if(countEl){
        countEl.textContent =
          '0 documents';
      }

      if(pagination){
        pagination.innerHTML = '';
      }

      return;

    }


    let toShow = list;


    // -----------------------------------------------------
    // RESOURCES PAGE
    // Show only first 8 documents
    // -----------------------------------------------------

    if(!isFullRepository){

      const showLimited =
        isDefaultView &&
        previewLimit > 0 &&
        list.length > previewLimit;

      if(showLimited){

        toShow =
          list.slice(0,previewLimit);

      }

      toShow.forEach(function(doc){

        results.appendChild(
          createDocumentCard(doc)
        );

      });


      if(countEl){

        countEl.textContent =
          list.length +
          (
            list.length === 1
              ? ' document'
              : ' documents'
          );

      }

      return;

    }


    // -----------------------------------------------------
    // FULL KNOWLEDGE MATERIAL PAGE
    // 50 DOCUMENTS PER PAGE
    // -----------------------------------------------------

    const totalPages =
      Math.ceil(list.length / perPage);


    if(currentPage > totalPages){

      currentPage =
        Math.max(1,totalPages);

    }


    const start =
      (currentPage - 1) * perPage;

    const end =
      start + perPage;

    toShow =
      list.slice(start,end);


    toShow.forEach(function(doc){

      results.appendChild(
        createDocumentCard(doc)
      );

    });


    if(countEl){

      const first =
        start + 1;

      const last =
        Math.min(
          end,
          list.length
        );

      countEl.textContent =
        `Showing ${first}–${last} of ${list.length} documents`;

    }


    renderPagination(list.length);

  }


  // -------------------------------------------------------
  // GRID / LIST VIEW
  // -------------------------------------------------------

  function setView(view){

    currentView = view;

    if(view === 'list'){

      results.classList.add(
        'knowledge-list-view'
      );

      results.classList.remove(
        'knowledge-grid'
      );

      if(listButton){
        listButton.classList.add('active');
      }

      if(gridButton){
        gridButton.classList.remove('active');
      }

    }else{

      results.classList.add(
        'knowledge-grid'
      );

      results.classList.remove(
        'knowledge-list-view'
      );

      if(gridButton){
        gridButton.classList.add('active');
      }

      if(listButton){
        listButton.classList.remove('active');
      }

    }


    // Save user's preference

    try{

      localStorage.setItem(
        'knowledgeMaterialView',
        view
      );

    }catch(e){}


    render(
      filteredDocuments,
      input.value.trim() === ''
    );

  }


  if(gridButton){

    gridButton.addEventListener(
      'click',
      function(){
        setView('grid');
      }
    );

  }


  if(listButton){

    listButton.addEventListener(
      'click',
      function(){
        setView('list');
      }
    );

  }


  // Restore previous view

  if(isFullRepository){

    try{

      const savedView =
        localStorage.getItem(
          'knowledgeMaterialView'
        );

      if(savedView === 'list'){

        currentView = 'list';

        results.classList.add(
          'knowledge-list-view'
        );

        results.classList.remove(
          'knowledge-grid'
        );

        if(listButton){
          listButton.classList.add('active');
        }

        if(gridButton){
          gridButton.classList.remove('active');
        }

      }

    }catch(e){}

  }


  // -------------------------------------------------------
  // INITIAL RENDER
  // -------------------------------------------------------

  render(
    documents,
    true
  );


  // -------------------------------------------------------
  // SEARCH
  // -------------------------------------------------------

  input.addEventListener(
    'input',
    function(){

      const q =
        input.value
          .trim()
          .toLowerCase();


      filteredDocuments =
        documents.filter(function(doc){

          const title =
            String(doc.title || '')
              .toLowerCase();

          const category =
            String(doc.category || '')
              .toLowerCase();

          const region =
            String(doc.region || '')
              .toLowerCase();


          return (
            title.includes(q) ||
            category.includes(q) ||
            region.includes(q)
          );

        });


      // Always start at page 1
      // when search changes.

      currentPage = 1;


      render(
        filteredDocuments,
        q === ''
      );

    }
  );

}


// =========================================================
// YOUTUBE VIDEO GRID + MODAL PLAYER
// =========================================================


// Accepts:
// - https://youtube.com/watch?v=XXXXXXXXXXX
// - https://youtu.be/XXXXXXXXXXX
// - https://youtube.com/embed/XXXXXXXXXXX
// - https://youtube.com/shorts/XXXXXXXXXXX
// - bare YouTube video ID

function extractYouTubeId(input){

  if(!input) return '';

  input =
    input.trim();


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


  if(
    /^[a-zA-Z0-9_-]{11}$/.test(input)
  ){

    return input;

  }


  return input;

}


// ---------------------------------------------------------
// VIDEO GRID
// ---------------------------------------------------------

async function initVideoGrid(){

  const grid =
    document.getElementById('video-grid');

  if(!grid) return;


  const previewLimit =
    parseInt(
      grid.dataset.limit,
      10
    ) || 0;


  const moreLink =
    grid.dataset.moreLink || '';


  let videos = [];


  try{

    const res =
      await fetch('/videos.json');

    if(!res.ok){
      throw new Error(
        'Could not load videos.json'
      );
    }

    const data =
      await res.json();

    videos =
      Array.isArray(data.items)
        ? data.items
        : [];


  }catch(error){

    grid.innerHTML =
      '<p style="color:#c00;">Could not load videos right now.</p>';

    return;

  }


  const showLimited =
    previewLimit > 0 &&
    videos.length > previewLimit;


  const toShow =
    showLimited
      ? videos.slice(0,previewLimit)
      : videos;


  toShow.forEach(function(v){

    const id =
      extractYouTubeId(
        v.youtubeId
      );


    const card =
      document.createElement('div');

    card.className =
      'video-card';


    const safeTitle =
      String(
        v.title || 'YouTube Video'
      )
      .replace(/"/g,'&quot;');


    card.innerHTML = `

      <div class="video-thumb-wrap">

        <img
          src="https://img.youtube.com/vi/${id}/hqdefault.jpg"
          alt="${safeTitle}"
          onerror="this.onerror=null;this.parentElement.classList.add('thumb-fallback');this.style.display='none';"
        >

        <div class="play-overlay">
          ▶
        </div>

      </div>

      <div class="video-title">
        ${safeTitle}
      </div>

    `;


    card.addEventListener(
      'click',
      function(){

        openVideoModal(
          id,
          v.title
        );

      }
    );


    grid.appendChild(card);

  });


  if(
    showLimited &&
    moreLink
  ){

    const more =
      document.createElement('a');

    more.href =
      moreLink;

    more.className =
      'video-card video-more-card';


    more.innerHTML = `

      <div>
        <strong>
          See all ${videos.length} videos →
        </strong>

        <span>
          Open the complete LCA TV repository
        </span>
      </div>

    `;


    grid.appendChild(more);

  }

}


// ---------------------------------------------------------
// VIDEO MODAL
// ---------------------------------------------------------

function openVideoModal(id,title){

  const overlay =
    document.createElement('div');

  overlay.className =
    'video-modal-overlay';


  const safeTitle =
    String(
      title || 'YouTube Video'
    )
    .replace(/"/g,'&quot;');


  overlay.innerHTML = `

    <div class="video-modal">

      <button
        class="video-modal-close"
        aria-label="Close"
        type="button"
      >
        &times;
      </button>

      <div class="video-modal-frame">

        <iframe
          src="https://www.youtube.com/embed/${id}?autoplay=1"
          title="${safeTitle}"
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


  // ESC closes video

  document.addEventListener(
    'keydown',
    function closeOnEscape(e){

      if(e.key === 'Escape'){

        overlay.remove();

        document.removeEventListener(
          'keydown',
          closeOnEscape
        );

      }

    }
  );

}


// =========================================================
// START ALL PAGE FUNCTIONS
// =========================================================

document.addEventListener(
  'DOMContentLoaded',
  function(){

    initDocSearch();

    initVideoGrid();

  }
);
