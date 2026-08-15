// =========================================================
// DOCUMENT / PDF REPOSITORY
// =========================================================

async function initDocSearch(){

  const input = document.getElementById('doc-search');
  const results = document.getElementById('doc-results');

  if(!results) return;

  const countEl = document.getElementById('doc-count');
  const categoryFilter = document.getElementById('doc-category-filter');
  const pagination = document.getElementById('doc-pagination');
  const viewButtons = document.querySelectorAll('.document-view-btn');

  const previewLimit =
    parseInt(results.dataset.limit || '0', 10);

  const moreLink =
    results.dataset.moreLink || '';

  const fullRepository =
    results.dataset.fullRepository === 'true';

  const perPage = 50;

  let documents = [];
  let filteredDocuments = [];
  let currentPage = 1;
  let currentView = 'grid';

  // ---------------------------------------------------------
  // Load documents
  // ---------------------------------------------------------

  try{

    const response = await fetch('/documents.json');

    if(!response.ok){
      throw new Error('Could not load documents.json');
    }

    const data = await response.json();

    documents = Array.isArray(data.items)
      ? data.items
      : [];

  }catch(error){

    results.innerHTML =
      '<p style="color:#c00;padding:20px;">Could not load documents right now.</p>';

    return;
  }


  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------

  function safe(value){
    return String(value || '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }


  function categoryClass(category){

    return String(category || 'Other')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-|-$/g,'') || 'other';

  }


  function categoryLabel(category){
    return category || 'Other';
  }


  // ---------------------------------------------------------
  // Render documents
  // ---------------------------------------------------------

  function render(){

    results.innerHTML = '';

    let list = filteredDocuments;

    // Preview mode
    if(!fullRepository && previewLimit > 0){

      list = list.slice(0, previewLimit);

    }

    // Full repository pagination
    else if(fullRepository){

      const start =
        (currentPage - 1) * perPage;

      list = list.slice(
        start,
        start + perPage
      );

    }


    if(list.length === 0){

      results.innerHTML =
        '<p style="color:#888;padding:20px;text-align:center;grid-column:1/-1;">No documents match your search.</p>';

    }


    list.forEach(doc => {

      const card =
        document.createElement('div');

      const category =
        categoryClass(doc.category);

      card.className =
        `document-card category-${category}`;

      card.innerHTML = `

        <div>

          <span class="document-card-category">
            ${safe(categoryLabel(doc.category))}
          </span>

          <h4>
            ${safe(doc.title)}
          </h4>

          <div class="document-card-meta">
            ${safe(doc.region || 'Pakistan')}
          </div>

        </div>

        <a
          class="download-btn"
          href="${safe(doc.url)}"
          target="_blank"
          rel="noopener"
        >
          Open Document
        </a>

      `;

      results.appendChild(card);

    });


    // -------------------------------------------------------
    // View mode
    // -------------------------------------------------------

    if(currentView === 'list'){

      results.classList.add(
        'document-list-view'
      );

    }else{

      results.classList.remove(
        'document-list-view'
      );

    }


    // -------------------------------------------------------
    // Count
    // -------------------------------------------------------

    if(countEl){

      countEl.textContent =
        filteredDocuments.length +
        (
          filteredDocuments.length === 1
            ? ' document'
            : ' documents'
        );

    }


    // -------------------------------------------------------
    // Full repository pagination
    // -------------------------------------------------------

    if(fullRepository){

      renderPagination();

    }else{

      renderMoreButton();

    }

  }


  // ---------------------------------------------------------
  // "Complete Knowledge Material" button
  // ---------------------------------------------------------

  function renderMoreButton(){

    if(!moreLink) return;

    const existing =
      document.getElementById(
        'document-more-button'
      );

    if(existing) existing.remove();

    if(filteredDocuments.length <= previewLimit)
      return;

    const wrapper =
      document.createElement('div');

    wrapper.id =
      'document-more-button';

    wrapper.className =
      'repository-more';

    wrapper.innerHTML = `

      <a
        href="${moreLink}"
        class="btn btn-navy"
      >
        Show Complete Knowledge Material →
      </a>

    `;

    results.parentNode.appendChild(wrapper);

  }


  // ---------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------

  function renderPagination(){

    if(!pagination) return;

    pagination.innerHTML = '';

    const totalPages =
      Math.ceil(
        filteredDocuments.length / perPage
      );

    if(totalPages <= 1)
      return;


    // Previous

    const previous =
      document.createElement('button');

    previous.className =
      'document-page-btn';

    previous.textContent =
      '‹ Previous';

    previous.disabled =
      currentPage === 1;

    previous.addEventListener(
      'click',
      () => {

        if(currentPage > 1){

          currentPage--;

          render();

          window.scrollTo({
            top: results.offsetTop - 100,
            behavior:'smooth'
          });

        }

      }
    );

    pagination.appendChild(previous);


    // Page numbers

    for(let i = 1; i <= totalPages; i++){

      const button =
        document.createElement('button');

      button.className =
        'document-page-btn' +
        (
          i === currentPage
            ? ' active'
            : ''
        );

      button.textContent = i;

      button.addEventListener(
        'click',
        () => {

          currentPage = i;

          render();

          window.scrollTo({
            top: results.offsetTop - 100,
            behavior:'smooth'
          });

        }
      );

      pagination.appendChild(button);

    }


    // Next

    const next =
      document.createElement('button');

    next.className =
      'document-page-btn';

    next.textContent =
      'Next ›';

    next.disabled =
      currentPage === totalPages;

    next.addEventListener(
      'click',
      () => {

        if(currentPage < totalPages){

          currentPage++;

          render();

          window.scrollTo({
            top: results.offsetTop - 100,
            behavior:'smooth'
          });

        }

      }
    );

    pagination.appendChild(next);

  }


  // ---------------------------------------------------------
  // Search
  // ---------------------------------------------------------

  function applyFilters(){

    const query =
      input
        ? input.value.trim().toLowerCase()
        : '';

    const selectedCategory =
      categoryFilter
        ? categoryFilter.value
        : 'all';


    filteredDocuments =
      documents.filter(doc => {

        const title =
          String(doc.title || '')
            .toLowerCase();

        const category =
          String(doc.category || '')
            .toLowerCase();

        const region =
          String(doc.region || '')
            .toLowerCase();


        const matchesSearch =
          !query ||
          title.includes(query) ||
          category.includes(query) ||
          region.includes(query);


        const matchesCategory =
          selectedCategory === 'all' ||
          doc.category === selectedCategory;


        return (
          matchesSearch &&
          matchesCategory
        );

      });


    currentPage = 1;

    render();

  }


  // ---------------------------------------------------------
  // Category dropdown
  // ---------------------------------------------------------

  if(categoryFilter){

    const categories =
      [...new Set(
        documents
          .map(doc => doc.category)
          .filter(Boolean)
      )].sort();


    categories.forEach(category => {

      const option =
        document.createElement('option');

      option.value = category;

      option.textContent = category;

      categoryFilter.appendChild(option);

    });


    categoryFilter.addEventListener(
      'change',
      applyFilters
    );

  }


  // ---------------------------------------------------------
  // Search listener
  // ---------------------------------------------------------

  if(input){

    input.addEventListener(
      'input',
      applyFilters
    );

  }


  // ---------------------------------------------------------
  // Grid / List buttons
  // ---------------------------------------------------------

  viewButtons.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        currentView =
          button.dataset.view || 'grid';


        viewButtons.forEach(btn => {

          btn.classList.toggle(
            'active',
            btn === button
          );

        });


        render();

      }
    );

  });


  // ---------------------------------------------------------
  // Initial render
  // ---------------------------------------------------------

  filteredDocuments =
    [...documents];

  render();

}



// =========================================================
// YOUTUBE VIDEO REPOSITORY
// =========================================================

function extractYouTubeId(input){

  if(!input) return '';

  input = input.trim();

  const patterns = [

    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/

  ];


  for(const pattern of patterns){

    const match =
      input.match(pattern);

    if(match)
      return match[1];

  }


  if(
    /^[a-zA-Z0-9_-]{11}$/.test(input)
  ){

    return input;

  }


  return input;

}



async function initVideoGrid(){

  const grid =
    document.getElementById('video-grid');

  if(!grid) return;


  const previewLimit =
    parseInt(
      grid.dataset.limit || '0',
      10
    );

  const moreLink =
    grid.dataset.moreLink || '';


  let videos = [];


  try{

    const response =
      await fetch('/videos.json');

    const data =
      await response.json();

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


  toShow.forEach(video => {

    const id =
      extractYouTubeId(
        video.youtubeId
      );


    const card =
      document.createElement('div');

    card.className =
      'video-card';


    card.innerHTML = `

      <div class="video-thumb-wrap">

        <img
          src="https://img.youtube.com/vi/${id}/hqdefault.jpg"
          alt="${safeVideoTitle(video.title)}"
          onerror="
            this.onerror=null;
            this.parentElement.classList.add('thumb-fallback');
            this.style.display='none';
          "
        >

        <div class="play-overlay">
          ▶
        </div>

      </div>

      <div class="video-title">
        ${safeVideoTitle(video.title)}
      </div>

    `;


    card.addEventListener(
      'click',
      () => openVideoModal(
        id,
        video.title
      )
    );


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



function safeVideoTitle(value){

  return String(value || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');

}



function openVideoModal(id,title){

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
          title="${safeVideoTitle(title)}"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen>
        </iframe>

      </div>

    </div>

  `;


  document.body.appendChild(
    overlay
  );


  overlay.addEventListener(
    'click',
    event => {

      if(
        event.target === overlay ||
        event.target.classList.contains(
          'video-modal-close'
        )
      ){

        overlay.remove();

      }

    }
  );

}



// =========================================================
// INITIALISE
// =========================================================

document.addEventListener(
  'DOMContentLoaded',
  () => {

    initDocSearch();

    initVideoGrid();

  }
);
