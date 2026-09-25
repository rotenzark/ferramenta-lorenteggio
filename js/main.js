/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'ferramenta-lorenteggio', // usato per localStorage lang
    whatsapp: {
      number: '393384982876',
      message: 'Buongiorno, vi scrivo dal sito della Ferramenta Lorenteggio: ',
      ids: ['heroWhatsapp'],
    },
    /* orari: per giorno (0=domenica) un array di finestre [inizio, fine]
       in minuti-stringa 'HH:MM'. Fine oltre '24:00' = scavalca mezzanotte
       (es. ['18:00','24:30'] = apre alle 18, chiude alle 00:30 del giorno
       dopo). Giorno chiuso = []. */
    hours: {
      0: [],
      1: [['08:30', '12:30']],
      2: [['08:30', '12:30'], ['15:00', '19:00']],
      3: [['08:30', '12:30'], ['15:00', '19:00']],
      4: [['08:30', '12:30'], ['15:00', '19:00']],
      5: [['08:30', '12:30'], ['15:00', '19:00']],
      6: [['08:30', '12:30']]
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 960,
    /* dizionario EN: SOLO overlay — l'HTML è la versione italiana.
       Forma storica a due lingue, resta valida e invariata. */
    EN: {
      "i.cosa": "Repairs, installation and sales · Via Lorenteggio 155",
      "i.skip": "Skip",
      "m.menu": "Open the menu",
      "m.lingua": "Language",
      "m.top": "Ferramenta Lorenteggio, back to the top",
      "m.nav": "Sections",
      "m.reparti": "Departments",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.chiama": "Call",
      "n.sotto": "Repairs, installation and sales",
      "n.problemi": "Problems",
      "n.lavori": "Our work",
      "n.negozio": "The shop",
      "n.dove": "Where",
      "n.chiama2": "Shop 02&nbsp;4229&nbsp;0755",
      "n.emergenze": "Emergency locksmith 338&nbsp;498&nbsp;2876",
      "g1.t": "At your home",
      "g2.t": "In the shop",
      "g3.t": "Information",
      "p1.t": "Locks and cylinders",
      "p2.t": "Security doors",
      "p3.t": "Roller shutters, grilles, bars",
      "p4.t": "Insect screens and blinds",
      "p5.t": "Windows and frames",
      "p6.t": "Small home jobs",
      "p7.t": "Keys",
      "p8.t": "Remote controls",
      "p9.t": "Hardware",
      "p10.t": "Emergency call-out",
      "p11.t": "Quotes",
      "p12.t": "Hours and payments",
      "s.negozio": "the shop",
      "s.emergenze": "emergency locksmith",
      "h.eti": "Via Lorenteggio 155 · Milan",
      "h.t": "Want your <span class=\"evidenza\">problem</span> solved?",
      "h.p": "We're the hardware shop on Via Lorenteggio. At the counter: keys and remote controls copied, screws, tools and whatever your home needs. At your home: locks, security doors, roller shutters, insect screens and windows, with a clear quote before we start.",
      "h.chiama": "Call the shop · 02&nbsp;4229&nbsp;0755",
      "h.emergenze": "Emergency locksmith · 338&nbsp;498&nbsp;2876",
      "h.wa": "Message us on WhatsApp",
      "c.titolo": "Cutaway of a security cylinder",
      "c.desc": "The key slides into the cylinder, the five pins stop on the shear line, the cam turns and the bolt draws back.",
      "c.molle": "springs",
      "c.taglio": "shear line",
      "c.camma": "cam",
      "c.catenaccio": "bolt",
      "c.didascalia": "Inside a security lock: only the right key lines up the five pins on the shear line. Then the cam turns and the bolt draws back.",
      "p0.t": "The problem, and what we do",
      "p1.q": "Does your security door still take the long key?",
      "p1.a": "You don't need a new door. We switch the old double-bit lock to a European-profile double security cylinder, with a key that can only be copied with its card, and add a defender, magnetic too. We replace locks of every kind, handles and knobs.",
      "p2.q": "A new door, or just a better-looking one?",
      "p2.a": "Made-to-measure security doors, fitted by us, with the masonry restored around the frame. Or a new panel on the door you already have. We are a Team Securemme centre.",
      "p3.q": "Roller shutter stuck?",
      "p3.a": "We repair and replace roller shutters in pvc, aluminium and steel, insulated ones too: straps, rollers, boxes, motors. And shop shutters and security bars, after a break-in attempt too.",
      "p4.q": "Mosquitoes still getting in?",
      "p4.a": "Made-to-measure insect screens, Venetian blinds and curtains: we recommend the right model for your windows and fit it ourselves.",
      "p5.q": "Windows need replacing?",
      "p5.a": "Replacement and maintenance of windows and frames.",
      "p6.q": "And everything else?",
      "p6.a": "Electrics and plumbing, a fan to fit, a room to paint: depending on the job, we put together the right team.",
      "p7.q": "Need a copy?",
      "p7.a": "We copy keys at the counter, security keys too.",
      "p8.q": "Gate remote not working?",
      "p8.a": "We copy and program remote controls for gates and garages; and if the old one can't be copied, we try to repair it.",
      "p9.q": "Missing a screw?",
      "p9.a": "Small hardware and screws, power tools, taps and fittings, electrical and plumbing supplies, household items. The shop is small, but it has everything.",
      "p10.q": "Locked out?",
      "p10.a": "For locks there's an emergency call-out: call <a href=\"tel:+393384982876\">338&nbsp;498&nbsp;2876</a>, on WhatsApp too.",
      "p11.q": "How much will it cost?",
      "p11.a": "It depends on the job: before we start, we give you a clear quote.",
      "p12.q": "When are you open?",
      "p12.a": "Monday 8:30am–12:30pm; Tuesday to Friday 8:30am–12:30pm and 3–7pm; Saturday 8:30am–12:30pm. Closed on Sunday. You can pay by card and debit card, contactless too.",
      "l.eti": "From our Instagram",
      "l.t": "Our work",
      "l.p": "Some jobs from the last few months, as we told them.",
      "j1.data": "July 2026",
      "j1.t": "Security door: a new panel",
      "j1.z1": "Enlarge the photo of the door before",
      "j1.a1": "The security door before: brown wood, brass handle and two defenders",
      "j1.z2": "Enlarge the photo of the door after",
      "j1.a2": "The same door with the new white panel: brass handle, knob and defender",
      "l.prima": "Before",
      "l.dopo": "After",
      "j1.p": "The same door, before and after: a new white panel, edge-finished, without frames, for a simpler line.",
      "j2.data": "March 2026",
      "j2.t": "From double-bit to double cylinder",
      "j2.z": "Enlarge the photo of the cylinder with the defender",
      "j2.a": "Oval brass defender with the European-profile cylinder, the handle and a second defender",
      "j2.p": "A security door switched from a double-bit lock to a European-profile double security cylinder, with a copy-protected key and a magnetic defender.",
      "j3.data": "March 2026",
      "j3.t": "Magnetic defender",
      "j3.z": "Enlarge the photo of the defender",
      "j3.a": "A chrome magnetic defender fitted on a reddish wooden door",
      "j3.p": "Fitting a magnetic defender over the door cylinder.",
      "j4.data": "February 2026",
      "j4.t": "It starts from the old keyhole",
      "j4.z": "Enlarge the photo of the old keyhole",
      "j4.a": "An old oval keyhole for a double-bit key on a dark wooden door",
      "j4.p": "Upgrading the locks of a security door starts here: an old door, with the right changes, can take more modern locks.",
      "j5.data": "January 2026",
      "j5.t": "What we found",
      "j5.z": "Enlarge the photo of the rusty lock",
      "j5.a": "The rusty case of an open lock, with a lock of the wrong size",
      "j5.p": "A badly kept door, with a lock of the wrong size: this is where we started.",
      "j6.data": "January 2026",
      "j6.t": "A new shutter box",
      "j6.z": "Enlarge the photo of the shutter box",
      "j6.a": "The new white aluminium shutter box above a window with a roller shutter",
      "j6.p": "The wooden roller shutter box replaced with a new aluminium one.",
      "l.ig": "More of our work on Instagram: @ferramenta_lorenteggio",
      "ng.eti": "Via Lorenteggio 155",
      "ng.t": "The shop",
      "ng.z": "Enlarge the photo of the sign",
      "ng.a": "The white Ferramenta Lorenteggio sign, repairs and sales, with the list of services, the coloured keys and the emergency locksmith number",
      "ng.ff": "Our sign, above the shop window",
      "ng.p1": "The sign says almost everything: keys, locks, security doors, grilles, roller shutters, shop shutters, insect screens, Venetian blinds, remote controls, electrics and plumbing. At the counter you'll find Matteo and his team: tell us the problem.",
      "r.eti": "4.5 on Google · 138 reviews",
      "r.t": "People who called us",
      "rc.1": "Great experience with Ferramenta Lorenteggio!<br>Yesterday they replaced the locks and fitted the defenders really flawlessly. The work was done quickly, cleanly and with truly excellent results.<br>I highly recommend Ferramenta Lorenteggio to anyone looking for reliability, professionalism, precision and top-quality materials. Well done indeed! 👏👏",
      "rc.f1": "Mauro Casoni · 4 months ago · 5 stars",
      "rc.2": "Excellent service, precise and professional. They fitted my insect screens, changed the lock and replaced the windows. Recommended.",
      "rc.f2": "Daniela Rossi · 2 months ago · 5 stars",
      "rc.3": "Great Matteo! We hit the jackpot when we found out about Ferramenta Lorenteggio<br>A professional with a capital P, punctual, precise and honest, he can do EVERYTHING and always with a smile!<br>Thank you Matteo, see you next time! 😀",
      "rc.f3": "Giovanna Bacchilega · 5 months ago · 5 stars",
      "rc.4": "Purchase and installation of a security door.<br>An extremely positive experience with Ferramenta Lorenteggio. Serious professionals, precise and meticulous in every detail. Besides the flawless fitting of the MADE-TO-MEASURE door, they also restored the masonry around the frame with great care. Comparing notes with other residents of the building who had the same work done, I can say for sure that my experience was better in quality of service and attention to detail.<br>I'll definitely call Matteo for other jobs too. Highly recommended!",
      "rc.f4": "Donato Pastore · a year ago · 5 stars",
      "rc.5": "I'm happy to leave a review because these days courtesy isn't a given.<br>Besides being very well stocked, the guys who work in this shop are helpful, polite and always smiling. Thanks for swapping my Allen key (I'd bought the wrong one!)",
      "rc.f5": "Viola Palazzoli · a year ago · 5 stars",
      "r.piede": "Public reviews on Google, translated from Italian.",
      "o.eti": "Where and when",
      "o.t": "Via Lorenteggio 155",
      "o.cap": "Opening hours",
      "o.lun": "Monday",
      "o.mar": "Tuesday",
      "o.mer": "Wednesday",
      "o.gio": "Thursday",
      "o.ven": "Friday",
      "o.sab": "Saturday",
      "o.dom": "Sunday",
      "o.chiuso": "closed",
      "o.p": "About 350 metres from the Frattini stop on the M4.",
      "o.neg": "Shop",
      "o.emer": "Emergency locksmith",
      "o.wa": "(WhatsApp too)",
      "o.pag": "Payments",
      "o.pagv": "Credit and debit cards, contactless",
      "o.chiama": "Call the shop",
      "o.btn": "Directions",
      "o.mappa": "Map: Ferramenta Lorenteggio, Via Lorenteggio 155, Milan",
      "z.cosa": "repairs, installation and sales",
      "z.emer": "emergency locksmith",
      "z.orari": "Monday 8:30am–12:30pm · Tuesday to Friday 8:30am–12:30pm and 3–7pm · Saturday 8:30am–12:30pm · closed on Sunday",
      "z.cred": "Demo site by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · texts from their Google listing, their PagineGialle page, their Instagram profile and their shop sign; public reviews on Google (September 2026); photographs from their Instagram and the Google listing.",
      "x.nav": "Quick actions",
      "x.negozio": "Shop",
      "x.emergenze": "Emergency",
      "x.mappa": "Map",
      "x.orari": "Hours"
    },
    /* MULTILINGUA (V4) — per i siti con più di due lingue, al posto di EN:
         LANGS: { en: {chiave:'...'}, ar: {chiave:'...'} }
       L'italiano resta SEMPRE la lingua del DOM e non ha dizionario.
       Se si valorizza EN e non LANGS, il comportamento è identico a prima. */
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],   // lingue che ribaltano dir=rtl
    /* etichette dello stato orari per lingua non-IT; l'IT è nel codice.
       Chiave mancante = fallback all'inglese, poi all'italiano. */
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */
  // ── FIRMA «la chiave giusta» (#207 Ferramenta Lorenteggio) ──
  // Lo spaccato di un cilindro di sicurezza. Stato finale in HTML: chiave dentro, perni sulla linea di taglio, camma girata,
  // catenaccio rientrato. Con GSAP e senza reduced-motion il JS rimette tutto chiuso (chiave fuori, perni a riposo, camma e
  // catenaccio in presa) e, dopo l'intro o quando lo spaccato entra in vista, fa entrare la chiave: a ogni fotogramma ogni
  // perno appoggia la punta sul dorso della chiave dove passa (profilo in data-profilo), quindi sale e scende sui tagli e si
  // ferma sulla linea di taglio. Poi la linea si accende, la camma gira di 180° e il catenaccio rientra.
  // Stato in data-cilindro sulla figura: chiuso → apre → aperto. La chiave è tagliata 1-5-5-3-2: i primi tre perni fanno 155.
  var fig = document.querySelector('[data-cilindro]'), cil = fig ? fig.querySelector('svg.cil') : null;
  var cilApri = function () {};
  if (cil) {
    var numeri = function (a) { return a.split(',').map(Number); };
    var PERNI = numeri(cil.getAttribute('data-perni')), LUN = numeri(cil.getAttribute('data-lunghezze'));
    var DRV = +cil.getAttribute('data-driver'), RIP = +cil.getAttribute('data-riposo'), CIMA = +cil.getAttribute('data-cima');
    var LAMA = +cil.getAttribute('data-lama'), PUNTA = +cil.getAttribute('data-punta');
    var PROF = cil.getAttribute('data-profilo').split(' ').map(numeri);
    var perni = Array.prototype.slice.call(cil.querySelectorAll('.cil-perno'));
    var chiave = cil.querySelector('.cil-chiave'), camma = cil.querySelector('.cil-camma'), cat = cil.querySelector('.cil-catenaccio'), linea = cil.querySelector('.cil-linea');
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    // y del dorso della chiave a distanza kx dalla punta (null se la chiave non arriva lì)
    var dorso = function (kx) {
      if (kx < 0) return null;
      for (var i = 0; i < PROF.length - 1; i++) {
        var a = PROF[i], b = PROF[i + 1];
        if (kx >= a[0] && kx <= b[0]) return a[1] + (b[1] - a[1]) * (kx - a[0]) / ((b[0] - a[0]) || 1);
      }
      return PROF[PROF.length - 1][1];
    };
    var molla = function (x, y0, y1) {
      var n = 9, h = (y1 - y0) / n, d = 'M' + x + ' ' + y0;
      for (var i = 0; i < n; i++) d += ' L' + (x + (i % 2 ? -8 : 8)) + ' ' + r1(y0 + h * (i + 0.5));
      return d + ' L' + x + ' ' + r1(y1);
    };
    var pernoChiave = function (x, top, L) {
      return 'M' + (x - 11) + ' ' + r1(top) + ' H' + (x + 11) + ' V' + r1(top + L - 7) + ' L' + x + ' ' + r1(top + L) + ' L' + (x - 11) + ' ' + r1(top + L - 7) + ' Z';
    };
    // posa: la chiave spostata di off verso destra (0 = tutta dentro), i perni appoggiati su di lei o a riposo
    var posa = function (off) {
      chiave.setAttribute('transform', 'translate(' + r1(off) + ' 0)');
      var punta = PUNTA + off;
      PERNI.forEach(function (x, i) {
        var y = dorso(x - punta), fondo = y === null ? RIP : Math.min(RIP, y);
        var topK = fondo - LUN[i], topD = topK - DRV, g = perni[i];
        g.querySelector('.cil-pk').setAttribute('d', pernoChiave(x, topK, LUN[i]));
        g.querySelector('.cil-pd').setAttribute('y', r1(topD));
        g.querySelector('.cil-molla').setAttribute('d', molla(x, CIMA, topD));
      });
    };
    var giraCamma = function (a) { camma.setAttribute('transform', 'rotate(' + r1(a) + ' 158 228)'); };
    var catenaccio = function (x) { cat.setAttribute('transform', 'translate(' + r1(x) + ' 0)'); };
    var chiudiCilindro = function () {
      fig.setAttribute('data-cilindro', 'chiuso');
      posa(LAMA); giraCamma(0); catenaccio(0);
      linea.setAttribute('opacity', '.35');
    };
    cilApri = function (ritardo) {
      if (fig.getAttribute('data-cilindro') !== 'chiuso') return;
      fig.setAttribute('data-cilindro', 'apre');
      var st = { off: LAMA, cam: 0, cat: 0, lin: 0.35 };
      gsap.timeline({ delay: ritardo || 0, onComplete: function () { fig.setAttribute('data-cilindro', 'aperto'); } })
        .to(st, { off: 0, duration: 2.2, ease: 'power1.inOut', onUpdate: function () { posa(st.off); } })
        .to(st, { lin: 1, duration: 0.3, ease: 'power1.out', onUpdate: function () { linea.setAttribute('opacity', r1(st.lin)); } })
        .to(linea, { attr: { 'stroke-width': 6 }, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.inOut' }, '<')
        .to(st, { cam: -180, cat: 34, duration: 0.8, ease: 'power2.inOut', onUpdate: function () { giraCamma(st.cam); catenaccio(st.cat); } }, '+=0.1');
    };
    if (hasGsap && !reducedMotion) {
      chiudiCilindro();
      // rete di sicurezza: se dopo 8 s è ancora chiuso ed è in vista, si apre da solo
      setTimeout(function () {
        var r = fig.getBoundingClientRect();
        if (!document.getElementById('intro') && r.top < innerHeight && r.bottom > 0) cilApri(0);
      }, 8000);
    }
  }
  // se lo spaccato non è in vista quando finisce l'intro, si apre quando ci arriva
  var cilQuandoVisibile = function (ritardo) {
    if (!fig || !hasGsap || reducedMotion) return;
    var r = fig.getBoundingClientRect();
    if (r.top < innerHeight * 0.92 && r.bottom > 0) cilApri(ritardo);
    else if (hasST) ScrollTrigger.create({ trigger: fig, start: 'top 82%', once: true, onEnter: function () { cilApri(0); } });
    else cilApri(0);
  };

  // i reparti a sinistra (e i link #pN) aprono la riga corrispondente
  var apriRiga = function (id) { var d = document.getElementById(id); if (d && d.tagName === 'DETAILS') d.open = true; };
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#p"]'), function (a) {
    a.addEventListener('click', function () { apriRiga(a.getAttribute('href').slice(1)); });
  });
  if (/^#p\d+$/.test(location.hash)) apriRiga(location.hash.slice(1));

  // lo stato degli orari compare due volte (apertura e «Dove e quando»): il secondo copia il primo, anche al cambio lingua
  var stato1 = document.getElementById('orarioStato'), stato2 = document.getElementById('orarioStato2');
  if (stato1 && stato2) {
    var copiaStato = function () { stato2.textContent = stato1.textContent; };
    copiaStato();
    if ('MutationObserver' in window) new MutationObserver(copiaStato).observe(stato1, { childList: true, characterData: true, subtree: true });
  }
  window.bespokeHeroEntrance = function () {
    if (!hasGsap || reducedMotion) return;
    cilQuandoVisibile(0.4);
    gsap.from('.apertura__t', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all' });
    gsap.from('.apertura__p, .apertura .stato, .apertura .azioni', { y: 16, opacity: 0, duration: 0.7, delay: 0.2, stagger: 0.08, ease: 'power2.out', clearProps: 'all' });
  };
})();
