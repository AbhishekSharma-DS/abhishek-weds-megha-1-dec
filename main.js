import { createIcons, ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, CalendarDays, CalendarPlus, Clock3, Flower2, MapPin, Menu, Navigation, Pause, Play, Plus, Sparkles, Sunrise, Utensils } from 'lucide';
import { createCalendar, getCountdown, eventList } from './invitation.mjs';

const icons = { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, CalendarDays, CalendarPlus, Clock3, Flower2, MapPin, Menu, Navigation, Pause, Play, Plus, Sparkles, Sunrise, Utensils };
const renderIcons = () => createIcons({ icons });
renderIcons();
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const music = document.querySelector('#background-music');
let musicStarting = false;
async function playMusic() {
  if (musicStarting || !music.paused) return;
  musicStarting = true;
  music.volume = .25;
  try { await music.play(); } catch {} finally { musicStarting = false; }
}

const gate = document.querySelector('#entry-gate');
let entering = false;
function openInvitation() {
  if (entering) return;
  entering = true;
  void playMusic();
  gate.classList.add('opening');
  setTimeout(() => {
    gate.close();
    document.body.classList.remove('gate-open');
    document.body.classList.add('entered');
    document.querySelector('#hero-title').focus({ preventScroll: true });
  }, motionPreference.matches ? 0 : 1000);
}
gate.showModal();
document.body.classList.add('gate-open');
document.querySelector('#open-invitation').onclick = openInvitation;
gate.addEventListener('cancel', (event) => { event.preventDefault(); openInvitation(); });
document.addEventListener('pointerdown', () => { void playMusic(); }, { passive: true });
document.addEventListener('keydown', () => { void playMusic(); });
document.addEventListener('click', () => { void playMusic(); });
void playMusic();

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}
menuToggle.onclick = () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
};
mobileNav.querySelectorAll('a').forEach((link) => { link.onclick = closeMenu; });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); } });
matchMedia('(min-width: 1100px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

const toast = document.querySelector('.toast');
let toastTimer;
document.querySelectorAll('[data-calendar]').forEach((button) => {
  button.onclick = () => {
    const events = button.dataset.calendar === 'all' ? eventList : eventList.filter((event) => event.id === button.dataset.calendar);
    const url = URL.createObjectURL(new Blob([createCalendar(events)], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `abhishek-megha-${button.dataset.calendar}.ics`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    clearTimeout(toastTimer);
    toast.textContent = 'Calendar downloaded. Times are in IST; Vadhu Aagaman is saved by date with morning hours noted.';
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 6000);
  };
});

const weddingTime = eventList.find((event) => event.id === 'shubh-lagn').start;
const countdownFields = Object.fromEntries(['days', 'hours', 'minutes', 'seconds'].map((unit) => [unit, document.querySelector(`#count-${unit}`)]));
function updateCountdown() {
  const remaining = getCountdown(weddingTime, new Date());
  for (const [unit, element] of Object.entries(countdownFields)) {
    const value = String(remaining[unit]).padStart(2, '0');
    if (element.textContent !== value) element.textContent = value;
  }
  document.querySelector('#countdown-label').textContent = remaining.ended ? 'Our wedding day has arrived' : 'Until our wedding ceremony';
  document.querySelector('.countdown-grid').setAttribute('aria-label', `${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds until our wedding`);
}
updateCountdown();
setInterval(updateCountdown, 1000);

const film = document.querySelector('#palace-film');
const filmToggle = document.querySelector('#film-toggle');
let filmInView = false;
let filmUserPaused = false;
function updateFilmButton() {
  const label = film.paused ? 'Play background film' : 'Pause background film';
  filmToggle.setAttribute('aria-label', label);
  filmToggle.title = label;
  filmToggle.innerHTML = `<i data-lucide="${film.paused ? 'play' : 'pause'}"></i>`;
  renderIcons();
}
async function playFilm() {
  if (!film.getAttribute('src')) film.src = film.dataset.src;
  film.muted = true;
  try { await film.play(); } catch {}
  updateFilmButton();
}
filmToggle.onclick = () => {
  if (film.paused) { filmUserPaused = false; void playFilm(); }
  else { filmUserPaused = true; film.pause(); }
};
film.addEventListener('play', updateFilmButton);
film.addEventListener('pause', updateFilmButton);
function mayAutoPlayFilm() {
  return filmInView && !filmUserPaused && !motionPreference.matches && !navigator.connection?.saveData && !document.hidden && document.body.classList.contains('entered');
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver((entries) => {
    filmInView = entries[0].isIntersecting;
    if (!filmInView) film.pause();
    else if (mayAutoPlayFilm()) void playFilm();
  }, { threshold: .35 }).observe(film);
}
document.addEventListener('visibilitychange', () => {
  updateCountdown();
  if (document.hidden) film.pause();
  else { void playMusic(); if (mayAutoPlayFilm()) void playFilm(); }
});

const revealElements = document.querySelectorAll('.ornament, .blessings h2, .blessing-copy, .person h3, .person .parents, .person .grandparents, .date-lockup, .countdown, .celebration-heading h2, .event > *, .details > *, .family-group h3, .family-group .family-name, .family-group .name-list, .relationship-group, .well-wishers li, .family-signoff, .footer-names');
const ambientScenes = document.querySelectorAll('.hero, .palace-section, .event, footer');
let revealObserver;
let sceneObserver;
function updateMotion() {
  revealObserver?.disconnect();
  sceneObserver?.disconnect();
  if (motionPreference.matches) film.pause();
  if (motionPreference.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('visible'));
    ambientScenes.forEach((element) => element.classList.remove('scene-in-view'));
    return;
  }
  sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('scene-in-view', entry.isIntersecting));
  }, { threshold: .01 });
  ambientScenes.forEach((element) => sceneObserver.observe(element));
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) entry.target.style.setProperty('--reveal-offset', entry.boundingClientRect.top < 0 ? '-16px' : '16px');
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: .08 });
  revealElements.forEach((element) => {
    element.classList.add('reveal-ready');
    revealObserver.observe(element);
  });
  if (mayAutoPlayFilm()) void playFilm();
}
updateMotion();
motionPreference.addEventListener('change', updateMotion);
document.addEventListener('visibilitychange', () => document.body.classList.toggle('motion-suspended', document.hidden));