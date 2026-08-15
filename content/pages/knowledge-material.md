---
title: "Complete Knowledge Material"
description: "Complete repository of legal acts, reports, manuals, policy briefs, toolkits, and other knowledge materials."
permalink: "/knowledge-material/index.html"
extraScripts:
  - "/script.js"
layout: base.njk
---

<div class="page-hero">
  <h1>Complete Knowledge Material</h1>
  <p>Browse the complete repository of documents and legal resources.</p>
</div>

<section class="section">

  <div class="knowledge-toolbar">

    <div class="search-bar knowledge-search">
      <input
        type="text"
        id="doc-search"
        placeholder="Search by title, region, or category..."
      >
    </div>

    <div class="view-toggle">
      <button type="button" id="doc-grid-view" class="view-btn active">
        ▦ Grid
      </button>

      <button type="button" id="doc-list-view" class="view-btn">
        ☰ List
      </button>
    </div>

  </div>

  <p class="doc-count" id="doc-count"></p>

  <div
    id="doc-results"
    class="document-grid"
    data-full-repository="true"
  ></div>

  <div
    id="doc-pagination"
    class="doc-pagination"
  ></div>

</section>
