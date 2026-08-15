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
  <p>Videos, legal texts, and toolkits for local government leaders.</p>
</div>

<!-- =====================================================
     KNOWLEDGE MATERIAL
===================================================== -->

<section class="section section-alt">

  <h2>Knowledge Repository</h2>

  <p style="text-align:center;color:#777;margin-top:-22px;margin-bottom:30px;">
    Browse a selection of our latest legal acts, reports, manuals, policy briefs and toolkits.
  </p>

  <div class="search-bar">
    <input
      type="text"
      id="doc-search"
      placeholder="Search Legal Acts, Toolkits, and more..."
    >
  </div>

  <p class="doc-count" id="doc-count"></p>

  <div
    class="grid"
    id="doc-results"
    data-limit="8"
    data-preview="true"
  ></div>

  <div class="knowledge-more">
    <a href="/knowledge-material/" class="btn btn-navy">
      Show Complete Knowledge Material &nbsp;→
    </a>
  </div>

</section>


<!-- =====================================================
     VIDEO REPOSITORY
===================================================== -->

<section class="section">

  <h2>LCA TV (Video Vault)</h2>

  <p style="text-align:center;color:#888;font-size:.85rem;margin-top:-24px;margin-bottom:30px;">
    Click any video to watch it without leaving the page.
  </p>

  <div
    class="video-grid"
    id="video-grid"
  ></div>

</section>
