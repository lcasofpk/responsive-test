/* =========================================================
   KNOWLEDGE MATERIAL - MORE BUTTON
========================================================= */

.knowledge-more-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  background:var(--navy);
  color:#fff;
  padding:13px 24px;
  border-radius:5px;
  font-size:.9rem;
  font-weight:700;
  border:2px solid var(--navy);
  transition:all .2s ease;
}

.knowledge-more-btn:hover{
  background:var(--emerald);
  border-color:var(--emerald);
  color:#fff;
}

.knowledge-more-btn span{
  font-size:1.1rem;
  transition:transform .2s ease;
}

.knowledge-more-btn:hover span{
  transform:translateX(4px);
}
