// Mobile nav-bar hamburger -> slide-down drawer (unchanged, mobile-only behavior)
const drawer = document.getElementById('mobileDrawer');
const hamMobile = document.getElementById('hamburgerMobile');
function toggleDrawer(){
  const isOpen = drawer.classList.toggle('open');
  hamMobile.classList.toggle('open', isOpen);
  hamMobile.setAttribute('aria-expanded', isOpen);
}
hamMobile.addEventListener('click', toggleDrawer);
function closeDrawer(){
  drawer.classList.remove('open');
  hamMobile.classList.remove('open');
  hamMobile.setAttribute('aria-expanded','false');
}

// Chrome-bar hamburger -> solid black full-height flyout menu, works on desktop and mobile
const hamChrome = document.getElementById('hamburgerChrome');
const chromeFlyout = document.getElementById('chromeFlyout');
const chromeFlyoutClose = document.getElementById('chromeFlyoutClose');
function toggleFlyout(){
  const isOpen = chromeFlyout.classList.toggle('open');
  hamChrome.setAttribute('aria-expanded', isOpen);
}
function closeFlyout(){
  chromeFlyout.classList.remove('open');
  hamChrome.setAttribute('aria-expanded','false');
}
hamChrome.addEventListener('click', (e)=>{
  e.stopPropagation();
  toggleFlyout();
});
chromeFlyoutClose.addEventListener('click', closeFlyout);
// Close flyout on outside click or Escape
document.addEventListener('click', (e)=>{
  if(chromeFlyout.classList.contains('open') && !chromeFlyout.contains(e.target) && e.target !== hamChrome){
    closeFlyout();
  }
});
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeFlyout();
});

// Active-state highlighting + closing menus after choosing a link
document.querySelectorAll('.mobile-drawer a, .nav-links a, .chrome-flyout a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
    document.querySelectorAll('.nav-link[data-target="'+a.dataset.target+'"]').forEach(l=>l.classList.add('active'));
    closeDrawer();
    closeFlyout();
  });
});

// Functional refresh button: reloads the page for a true refresh
const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', ()=>{
  refreshBtn.classList.add('spin');
  document.getElementById('urlText').textContent = 'RELOADING…';
  setTimeout(()=>{ window.location.reload(); }, 500);
});

// Join button: simple, honest feedback (no external navigation implied)
document.getElementById('joinBtn').addEventListener('click', ()=>{
  const btn = document.getElementById('joinBtn');
  btn.textContent = 'Request Sent ✓';
  setTimeout(()=>{ btn.textContent = 'Join the Roster'; }, 2200);
});

// Active-state highlighting on scroll
const sections = ['home','members','reviews'].map(id=>document.getElementById(id));
const navLinksAll = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', ()=>{
  let current = 'home';
  sections.forEach(sec=>{
    if(sec && window.scrollY + 140 >= sec.offsetTop) current = sec.id;
  });
  navLinksAll.forEach(l=>{
    l.classList.toggle('active', l.dataset.target === current);
  });
});
