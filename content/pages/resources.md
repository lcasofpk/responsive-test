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
  <p>Knowledge materials, legal resources, and videos for local government leaders.</p>
</div>

<section class="section section-alt">
  <h2>Knowledge Repository</h2>

  <p style="text-align:center;color:#888;font-size:0.85rem;margin-top:-24px;margin-bottom:30px;">
    Browse legal acts, policy briefs, reports, manuals, toolkits, and other knowledge materials.
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
    class="grid"
    id="doc-results"
    data-limit="8"
    data-more-link="/knowledge-material/"
  ></div>

  <div style="text-align:center;margin-top:30px;">
    <a href="/knowledge-material/" class="btn btn-navy">
      View Complete Knowledge Material
    </a>
  </div>
</section>

<section class="section">
  <h2>LCA TV (Video Vault)</h2>

  <p style="text-align:center;color:#888;font-size:0.85rem;margin-top:-24px;margin-bottom:30px;">
    Click any video to watch it without leaving the page.
  </p>

  <div
    class="video-grid"
    id="video-grid"
  ></div>
</section>
