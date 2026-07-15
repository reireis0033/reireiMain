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

// Active-state highlighting + closing menus after choosing a link.
// Topnav + mobile drawer mirror each other (and scroll position). The
// chrome-flyout is a separate, independent menu — clicking it only
// affects its own links, and never lights up (or is lit up by) the topnav.
let manualNavUntil = 0;
document.querySelectorAll('.mobile-drawer a, .nav-links a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    document.querySelectorAll('.mobile-drawer a, .nav-links a').forEach(l=>l.classList.remove('active'));
    document.querySelectorAll('.mobile-drawer a[data-target="'+a.dataset.target+'"], .nav-links a[data-target="'+a.dataset.target+'"]').forEach(l=>l.classList.add('active'));
    // Ignore scroll-driven highlighting for a moment so it doesn't fight
    // this click's active state while the smooth-scroll is still animating.
    manualNavUntil = Date.now() + 900;
    closeDrawer();
    closeFlyout();
  });
});

document.querySelectorAll('.chrome-flyout a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    document.querySelectorAll('.chrome-flyout a').forEach(l=>l.classList.remove('active'));
    a.classList.add('active');
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

// Join button (now a link so a real URL can be dropped into its href later).
// While href is still the "#" placeholder, show feedback instead of jumping
// to the top of the page. Once a real link is added, it navigates normally.
document.getElementById('joinBtn').addEventListener('click', (e)=>{
  const btn = e.currentTarget;
  if(btn.getAttribute('href') === '#'){
    e.preventDefault();
    btn.textContent = 'Request Sent ✓';
    setTimeout(()=>{ btn.textContent = 'Join the Roster'; }, 2200);
  }
});

// Active-state highlighting on scroll
// data-target values don't always match element ids (e.g. "members" -> #offers),
// so map each nav target to its real section id.
const sectionMap = { home:'home', members:'offers', reviews:'information' };
const navLinksAll = document.querySelectorAll('.nav-links a, .mobile-drawer a');
window.addEventListener('scroll', ()=>{
  if(Date.now() < manualNavUntil) return; // let a fresh click's highlight win while it scrolls into place
  let current = 'home';
  Object.keys(sectionMap).forEach(target=>{
    const sec = document.getElementById(sectionMap[target]);
    if(sec && window.scrollY + 140 >= sec.offsetTop) current = target;
  });
  navLinksAll.forEach(l=>{
    l.classList.toggle('active', l.dataset.target === current);
  });
});