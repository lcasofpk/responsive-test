---
title: "Resources & Knowledge Hub"
description: "LCA TV, legal acts, reports, manuals, policy briefs, toolkits, and other knowledge materials."
permalink: "/resources/index.html"
extraScripts:
  - "/script.js"
layout: base.njk
---

<div class="page-hero">
  <h1>Resources &amp; Knowledge Hub</h1>
  <p>
    Explore knowledge materials, legal resources, reports, toolkits,
    and videos for local government leaders.
  </p>
</div>


<!-- =====================================================
     KNOWLEDGE MATERIALS
====================================================== -->

<section class="section">

  <h2>Knowledge Materials</h2>

  <p style="text-align:center;color:#777;max-width:700px;margin:-20px auto 30px;">
    Explore legal acts, reports, manuals, policy briefs, toolkits,
    research, and other resources for local governance.
  </p>

  <div class="search-bar">
    <input
      type="text"
      id="doc-search"
      placeholder="Search by title, region, or category..."
    >
  </div>

  <p
    class="doc-count"
    id="doc-count"
  ></p>

  <div
    class="grid knowledge-grid"
    id="doc-results"
    data-limit="8"
    data-more-link="/knowledge-material/"
  ></div>

</section>


<!-- =====================================================
     LCA TV
====================================================== -->

<section class="section section-alt">

  <h2>LCA TV — Video Vault</h2>

  <p style="text-align:center;color:#888;font-size:0.85rem;margin-top:-24px;margin-bottom:30px;">
    Watch the latest videos from the Local Councils Associations of Pakistan.
  </p>

  <div
    class="video-grid"
    id="video-grid"
    data-limit="6"
    data-more-link="/resources/"
  ></div>

</section>
