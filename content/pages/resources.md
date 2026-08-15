---
title: "Resources & Knowledge Hub"
description: "LCA TV, legal acts repository, and toolkits."
permalink: "/resources/index.html"
extraScripts:
  - "/script.js"
layout: base.njk
---

<div class="page-hero">
  <h1>Resources &amp; Knowledge Hub</h1>
  <p>Videos, legal texts, reports, toolkits, and other knowledge materials for local government leaders.</p>
</div>


<!-- =========================================================
     KNOWLEDGE MATERIAL
========================================================= -->

<section class="section">

  <h2>Knowledge Material</h2>

  <p style="text-align:center;color:#777;max-width:700px;margin:-20px auto 30px;">
    Explore legal acts, reports, policy briefs, manuals, toolkits, guidelines, and other resources.
  </p>

  <div class="search-bar">
    <input
      type="text"
      id="doc-search"
      placeholder="Search by title, region, or category..."
    >
  </div>

  <p class="doc-count" id="doc-count"></p>

  <div
    id="doc-results"
    class="grid"
    data-limit="8"
    data-more-link="/knowledge-material/"
  ></div>

  <div style="text-align:center;margin-top:30px;">

    <a
      href="/knowledge-material/"
      class="knowledge-more-btn"
    >
      Show Complete Knowledge Material
      <span aria-hidden="true">→</span>
    </a>

  </div>

</section>


<!-- =========================================================
     LCA TV
========================================================= -->

<section class="section section-alt">

  <h2>LCA TV — Video Vault</h2>

  <p style="text-align:center;color:#888;font-size:.85rem;margin-top:-24px;margin-bottom:30px;">
    Click any video to watch it without leaving the page.
  </p>

  <div
    class="video-grid"
    id="video-grid"
    data-limit="6"
    data-more-link="/resources/"
  ></div>

</section>
