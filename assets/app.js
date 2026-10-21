/* PRISM — shared helpers. Motion language: light, lines and scroll.
   Theme: LIGHT default; dark via html[data-theme="dark"], persisted in
   localStorage ('prism-theme'), set pre-paint by an inline head script
   (also honours ?theme=light|dark). */
(function(){
'use strict';
var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.PRISM_RM = RM;
window.prismTheme = function(){ return document.documentElement.getAttribute('data-theme')==='dark' ? 'dark' : 'light'; };
window.EF = { night:'#141223', violet:'#7D33FF', white:'#FFFFFF', lav:'#EFE9FC', deep:'#6C2BD9',
  g171:'#17171C', g5c:'#5C5C66', g8e:'#8E8E99', g67:'#67676F' };
/* Colours that depend on theme */
window.inkCol = function(){ return window.prismTheme()==='dark' ? '#EFE9FC' : '#141223'; };
window.mutCol = function(){ return window.prismTheme()==='dark' ? '#8E8E99' : '#5C5C66'; };

/* Fit a canvas to its CSS box at devicePixelRatio (cap 2). Returns ctx scaled. */
window.fitCanvas = function(cv, h){
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var w = cv.clientWidth || cv.parentElement.clientWidth || 600;
  if(h) cv.style.height = h+'px';
  var hh = cv.clientHeight || h || 200;
  cv.width = Math.round(w*dpr); cv.height = Math.round(hh*dpr);
  var c = cv.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
  return { ctx:c, w:w, h:hh };
};
/* rAF loop that pauses off-screen and honours reduced motion.
   draw(t) is called with seconds. If RM, draw(0) once (a composed still). */
window.animate = function(cv, draw){
  if(RM){ draw(0); return { stop:function(){} }; }
  var running = true, visible = true, raf = 0;
  function frame(ts){ if(!running) return; if(visible) draw(ts/1000); raf = requestAnimationFrame(frame); }
  raf = requestAnimationFrame(frame);
  var io = null;
  if('IntersectionObserver' in window){
    io = new IntersectionObserver(function(es){ es.forEach(function(e){ visible = e.isIntersecting; }); }, {threshold:.02});
    io.observe(cv);
  }
  return { stop:function(){ running=false; cancelAnimationFrame(raf); if(io) io.disconnect(); } };
};
/* Redraw a still frame on theme change: helper for static canvases */
window.onTheme = function(fn){
  window.addEventListener('prism-themechange', fn);
};

/* Toast */
window.toast = function(msg){
  var t = document.querySelector('.toast');
  if(!t){ t = document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove('show'); }, 2600);
};
/* Download text as file */
window.downloadText = function(name, text){
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], {type:'text/csv'})); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 400);
};

document.addEventListener('DOMContentLoaded', function(){
  /* Mobile nav */
  var t = document.querySelector('.navtoggle'), n = document.querySelector('.navlinks');
  if(t && n){ t.addEventListener('click', function(){
    var open = n.classList.toggle('open'); t.setAttribute('aria-expanded', String(open));
  }); }
  /* Wallet buttons are demo-only */
  document.querySelectorAll('[data-wallet]').forEach(function(b){
    b.addEventListener('click', function(){ toast('Demo only — no wallet connects in this design concept.'); });
  });
  /* Theme toggle */
  var tt = document.getElementById('themeToggle');
  function syncBtn(){
    if(!tt) return; var dark = window.prismTheme()==='dark';
    tt.setAttribute('aria-pressed', String(dark));
    tt.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    var sun = tt.querySelector('.ic-sun'), moon = tt.querySelector('.ic-moon');
    if(sun) sun.style.display = dark ? 'block' : 'none';
    if(moon) moon.style.display = dark ? 'none' : 'block';
  }
  if(tt){ tt.addEventListener('click', function(){
    var next = window.prismTheme()==='dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('prism-theme', next); }catch(e){}
    syncBtn(); window.dispatchEvent(new Event('prism-themechange'));
  }); syncBtn(); }
  /* Desktop-experience note — small screens only, dismissible, once per session */
  try{
    if(window.innerWidth < 860 && !sessionStorage.getItem('prismDesktopNote')){
      var note = document.createElement('div'); note.className='desktopnote'; note.setAttribute('role','note');
      note.innerHTML = 'Best experienced on desktop — for the full interactive experience, open this demo on a computer. You can also explore the mobile version.<button type="button" aria-label="Dismiss note">✕</button>';
      note.querySelector('button').addEventListener('click', function(){
        note.remove(); try{ sessionStorage.setItem('prismDesktopNote','1'); }catch(e){}
      });
      document.body.insertBefore(note, document.body.firstChild);
    }
  }catch(e){}
});
})();
