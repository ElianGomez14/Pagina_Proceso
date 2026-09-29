/**
 * ORION GAMERS — Script Principal
 * Tema dual · Menú responsive · Scroll activo
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ── ANIMACIONES: reveal al hacer scroll + salida de página ── */
  const revealSel = '.hero-text > *, .hero-visual, .catalog-hero .container > *, .section-header, .service-box, .service-card, .catalog-card, .maint-card, .trust-item, .video-showcase-card, .ps5-showcase-card, .ps5-variants-box, .custom-cta-card, .gallery-cta, .carousel, .cards-grid > *';
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll(revealSel).forEach(el => {
      const i = [...el.parentElement.children].indexOf(el);
      el.style.setProperty('--d', Math.min(i, 6) * 0.08 + 's');
      el.classList.add('reveal');
      io.observe(el);
    });
  }
  // Fade-out antes de navegar (solo si el navegador no soporta View Transitions)
  if (!CSS.supports('view-transition-name', 'none')) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || u.pathname === location.pathname || u.protocol !== 'http:' && u.protocol !== 'https:' && u.protocol !== 'file:') return;
      e.preventDefault();
      document.body.classList.add('page-leave');
      setTimeout(() => { location.href = a.href; }, 250);
    });
  }

  /* ── TEMA ── */
  const toggle = document.getElementById('theme-toggle');
  const logo = document.getElementById('brand-logo');
  const footerLogo = document.getElementById('footer-logo');
  const favicon = document.getElementById('favicon');
  const DARK_LOGO = 'Logos%20OrionGamers/Orion_Gamers_Variante_14.webp';
  const LIGHT_LOGO = 'Logos%20OrionGamers/Orion_Gamers_Variante_01.png';
  const LIGHT_LOGO_FOOTER = 'Logos%20OrionGamers/Orion_Gamers_Variante_09.png';

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('orion_theme', t);
    const src = t === 'dark' ? DARK_LOGO : LIGHT_LOGO;
    if (logo) logo.src = src;
    if (footerLogo) footerLogo.src = t === 'dark' ? DARK_LOGO : LIGHT_LOGO_FOOTER;
    if (favicon) favicon.href = src;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#0f172a' : '#f1f5f9');
  }

  setTheme(localStorage.getItem('orion_theme') || 'dark');

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  /* ── MENÚ MÓVIL ── */
  const menuBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open);
    });

    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── HEADER SCROLL & NAVEGACIÓN ACTIVA ── */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // Navegación activa en sitio multi-página
  const navLinks = document.querySelectorAll('.nav .nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });

  /* ── CARRUSEL ── */
  const slides = [
    {
      src: 'Imagenes%20y%20videos%20Pagina/A.webp',
      title: 'Ensamble custom con pantalla LCD',
      desc: 'Refrigeración líquida con logo Orion Gamers y GPU GeForce RTX vertical.'
    },
    {
      src: 'Imagenes%20y%20videos%20Pagina/carrusel2.jpeg',
      title: 'Portátiles y equipos corporativos',
      desc: 'Mantenimiento, optimización y venta de laptops con respaldo Orion Gamers.'
    },
    {
      src: 'Imagenes%20y%20videos%20Pagina/carrusel3.jpeg',
      title: 'Laptops gamer de alta gama',
      desc: 'Diagnóstico térmico, mantenimiento y repotenciación para equipos gaming.'
    },
    {
      src: 'Imagenes%20y%20videos%20Pagina/I.webp',
      title: 'Ensamble White Edition y upgrades',
      desc: 'Chasis blanco, componentes MSI y AORUS, RAM RGB y SSD NVMe.'
    },
    {
      src: 'Imagenes%20y%20videos%20Pagina/carrusel5.webp',
      title: 'Optimización y mantenimiento gamer',
      desc: 'Pastas de alta conductividad, limpieza profunda y flujo de aire calibrado.'
    }
  ];

  const carouselImg = document.getElementById('carousel-img');
  const carouselOverlay = document.getElementById('carousel-overlay');
  const carouselCounter = document.getElementById('carousel-counter');
  const carouselTitle = document.getElementById('carousel-title');
  const carouselDesc = document.getElementById('carousel-desc');
  const carouselDots = document.getElementById('carousel-dots');
  const progressBar = document.getElementById('carousel-progress-bar');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const carouselEl = document.getElementById('carousel');

  if (carouselImg && slides.length) {
    let current = 0;
    let paused = false;
    let autoplayTimer = null;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.type = 'button';
      dot.ariaLabel = 'Ir a imagen ' + (i + 1);
      dot.addEventListener('click', () => goTo(i));
      carouselDots.appendChild(dot);
    });

    function showSlide(idx) {
      const slide = slides[idx];

      // Crossfade image
      carouselImg.classList.remove('fade');
      carouselOverlay.classList.remove('fade');
      void carouselImg.offsetWidth; // force reflow
      carouselImg.src = slide.src;
      carouselImg.alt = slide.title;
      carouselImg.classList.add('fade');
      carouselOverlay.classList.add('fade');

      // Text
      carouselCounter.textContent = (idx + 1) + ' / ' + slides.length;
      carouselTitle.textContent = slide.title;
      carouselDesc.textContent = slide.desc;

      // Dots
      carouselDots.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });

      // Progress bar restart
      progressBar.classList.remove('running');
      void progressBar.offsetWidth;
      if (!paused) progressBar.classList.add('running');
    }

    function goTo(idx) {
      current = idx;
      showSlide(current);
      resetAutoplay();
    }

    function next() {
      current = current === slides.length - 1 ? 0 : current + 1;
      showSlide(current);
    }

    function prev() {
      current = current === 0 ? slides.length - 1 : current - 1;
      showSlide(current);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => { if (!paused) next(); }, 5000);
    }

    // Controls
    prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
    nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

    // Pause on hover
    carouselEl.addEventListener('mouseenter', () => {
      paused = true;
      progressBar.classList.remove('running');
    });
    carouselEl.addEventListener('mouseleave', () => {
      paused = false;
      progressBar.classList.remove('running');
      void progressBar.offsetWidth;
      progressBar.classList.add('running');
    });

    // Init
    showSlide(0);
    resetAutoplay();
  }

  /* ── REPRODUCTORES DE VIDEO Y MODAL DE AMPLIACIÓN ── */
  const videoModal = document.getElementById('video-modal');
  const modalPlayer = document.getElementById('video-modal-player');
  const modalClose = document.getElementById('video-modal-close');
  const modalBackdrop = document.getElementById('video-modal-backdrop');
  const modalTag = document.getElementById('video-modal-tag');
  const modalDot = document.getElementById('video-modal-dot');
  const modalHeading = document.getElementById('video-modal-heading');
  const modalDesc = document.getElementById('video-modal-desc');
  const modalNav = document.getElementById('video-modal-nav');

  const inlineVideos = [
    document.getElementById('video-thumb-0'),
    document.getElementById('video-thumb-1')
  ];

  const ps5MainPlayer = document.getElementById('ps5-main-player');

  // Ajusta la caja al formato real de cada video (vertical u horizontal) para evitar barras negras
  document.querySelectorAll('.showcase-video').forEach(v => {
    const fit = () => {
      if (!v.videoWidth) return;
      const wrap = v.parentElement, portrait = v.videoHeight > v.videoWidth;
      wrap.style.aspectRatio = v.videoWidth + ' / ' + v.videoHeight;
      wrap.style.maxWidth = portrait ? (wrap.classList.contains('ps5-video-wrapper') ? '260px' : '') : '100%';
    };
    v.addEventListener('loadedmetadata', fit);
    fit();
  });
  const ps5PhaseTag = document.getElementById('ps5-phase-tag');
  const ps5InfoTitle = document.getElementById('ps5-info-title');
  const ps5InfoDesc = document.getElementById('ps5-info-desc');
  const ps5VariantsCounter = document.getElementById('ps5-variants-counter');
  const btnExpandPs5 = document.getElementById('btn-expand-ps5');

  // Control de audio/reproducción: pausar otros reproductores si uno inicia
  if (ps5MainPlayer) {
    ps5MainPlayer.addEventListener('play', () => {
      inlineVideos.forEach(vid => { if (vid && !vid.paused) vid.pause(); });
    });
  }

  inlineVideos.forEach((vid, i) => {
    if (!vid) return;
    vid.addEventListener('play', () => {
      const other = inlineVideos[i === 0 ? 1 : 0];
      if (other && !other.paused) other.pause();
      if (ps5MainPlayer && !ps5MainPlayer.paused) ps5MainPlayer.pause();
    });
  });

  const showcaseVideos = [
    {
      src: 'Imagenes%20y%20videos%20Pagina/Antesde.mp4',
      tag: 'ANTES',
      dotColor: '#ef4444',
      title: 'Diagnóstico inicial',
      desc: 'Disipadores llenos de polvo, ventiladores frenados y pasta reseca.'
    },
    {
      src: 'Imagenes%20y%20videos%20Pagina/DespuesDe.mp4',
      tag: 'DESPUÉS',
      dotColor: '#22c55e',
      title: 'Mantenimiento completado',
      desc: 'Desarme completo, pasta de alta conductividad, thermal pads nuevos y buen flujo térmico.'
    }
  ];

  const ps5Videos = [
    {
      src: 'Imagenes%20y%20videos%20Pagina/ps5.mp4',
      tag: 'FASE 1 DE 4 · DESARME',
      dotColor: '#0070d1',
      title: 'Fase 1: Desarme y diagnóstico',
      desc: 'Apertura de la PS5, desconexión de sensores e inspección del polvo en ductos y toberas.'
    },
    {
      src: 'Imagenes%20y%20videos%20Pagina/ps5-2.mp4',
      tag: 'FASE 2 DE 4 · TURBINA 120MM',
      dotColor: '#0070d1',
      title: 'Fase 2: Limpieza de turbina',
      desc: 'Turbina de 120mm desmontada, aspas lavadas, fibras retiradas y balanceo silencioso.'
    },
    {
      src: 'Imagenes%20y%20videos%20Pagina/ps5-3.mp4',
      tag: 'FASE 3 DE 4 · DISIPADOR',
      dotColor: '#0070d1',
      title: 'Fase 3: Disipador y toberas',
      desc: 'Aletas de cobre y aluminio, toberas de escape y túnel de la fuente completamente limpios.'
    },
    {
      src: 'Imagenes%20y%20videos%20Pagina/ps5-4.mp4',
      tag: 'FASE 4 DE 4 · METAL LÍQUIDO APU',
      dotColor: '#0070d1',
      title: 'Fase 4: Metal líquido y cierre',
      desc: 'Metal líquido sobre el procesador AMD Oberon, sin zonas secas, con sellado y armado final.'
    }
  ];

  let activePs5Idx = 0;

  function switchPs5Variant(idx, autoPlay = true) {
    if (idx < 0 || idx >= ps5Videos.length) return;
    activePs5Idx = idx;
    const v = ps5Videos[idx];

    // Pausar otros videos
    inlineVideos.forEach(vid => { if (vid && !vid.paused) vid.pause(); });

    if (ps5MainPlayer) {
      ps5MainPlayer.pause();
      ps5MainPlayer.src = v.src;
      ps5MainPlayer.load();
      if (autoPlay) {
        const playPromise = ps5MainPlayer.play();
        if (playPromise !== undefined) playPromise.catch(() => {});
      }
    }

    if (ps5PhaseTag) ps5PhaseTag.textContent = v.tag;
    if (ps5InfoTitle) ps5InfoTitle.textContent = v.title;
    if (ps5InfoDesc) ps5InfoDesc.textContent = v.desc;
    if (ps5VariantsCounter) ps5VariantsCounter.textContent = `${idx + 1} / ${ps5Videos.length}`;

    // Actualizar botones de variantes
    const variantItems = document.querySelectorAll('.ps5-variant-item');
    variantItems.forEach((btn, i) => {
      const isActive = i === idx;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      const playIcon = btn.querySelector('.ps5-variant-play');
      if (playIcon) playIcon.setAttribute('title', isActive ? 'Reproduciendo' : 'Ver video');
    });
  }

  // Asignar clics a los ítems de variantes de PS5
  const ps5VariantButtons = document.querySelectorAll('.ps5-variant-item');
  if (ps5VariantButtons.length > 0) {
    ps5VariantButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-ps5-index') || '0', 10);
        switchPs5Variant(idx, true);
      });
    });
  }

  function renderModalNav(type, currentIdx) {
    if (!modalNav) return;
    modalNav.innerHTML = '';
    if (type === 'pc') {
      const btnAntes = document.createElement('button');
      btnAntes.type = 'button';
      btnAntes.className = `btn-modal-switch${currentIdx === 0 ? ' active' : ''}`;
      btnAntes.id = 'btn-switch-antes';
      btnAntes.textContent = 'Ver antes';
      btnAntes.addEventListener('click', () => loadAndPlayModalVideo('pc', 0));

      const btnDespues = document.createElement('button');
      btnDespues.type = 'button';
      btnDespues.className = `btn-modal-switch${currentIdx === 1 ? ' active' : ''}`;
      btnDespues.id = 'btn-switch-despues';
      btnDespues.textContent = 'Ver después';
      btnDespues.addEventListener('click', () => loadAndPlayModalVideo('pc', 1));

      modalNav.appendChild(btnAntes);
      modalNav.appendChild(btnDespues);
    } else if (type === 'ps5') {
      ps5Videos.forEach((p, i) => {
        const btnPhase = document.createElement('button');
        btnPhase.type = 'button';
        btnPhase.className = `btn-modal-switch${currentIdx === i ? ' active' : ''}`;
        btnPhase.textContent = `Fase ${i + 1}`;
        btnPhase.title = p.title;
        btnPhase.addEventListener('click', () => {
          switchPs5Variant(i, false);
          loadAndPlayModalVideo('ps5', i);
        });
        modalNav.appendChild(btnPhase);
      });
    }
  }

  function loadAndPlayModalVideo(type, idx) {
    if (!modalPlayer || !videoModal) return;

    let v = null;
    let startTime = 0;

    if (type === 'pc') {
      v = showcaseVideos[idx];
      if (!v) return;
      const inlineVid = inlineVideos[idx];
      if (inlineVid) {
        startTime = inlineVid.currentTime;
        inlineVid.pause();
      }
      const otherInline = inlineVideos[idx === 0 ? 1 : 0];
      if (otherInline && !otherInline.paused) otherInline.pause();
      if (ps5MainPlayer && !ps5MainPlayer.paused) ps5MainPlayer.pause();
    } else if (type === 'ps5') {
      v = ps5Videos[idx];
      if (!v) return;
      inlineVideos.forEach(vid => { if (vid && !vid.paused) vid.pause(); });
      if (ps5MainPlayer) {
        if (activePs5Idx === idx) {
          startTime = ps5MainPlayer.currentTime;
        }
        ps5MainPlayer.pause();
      }
    }

    modalPlayer.pause();
    modalPlayer.src = v.src;
    modalPlayer.load();

    if (modalTag) modalTag.textContent = v.tag;
    if (modalDot) modalDot.style.color = v.dotColor;
    if (modalHeading) modalHeading.textContent = v.title;
    if (modalDesc) modalDesc.textContent = v.desc;

    renderModalNav(type, idx);

    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (startTime > 0) {
      modalPlayer.currentTime = startTime;
    }
    const playPromise = modalPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalPlayer) {
      modalPlayer.pause();
    }
  }

  if (videoModal && modalPlayer) {
    // Botones de PC 'Agrandar Video'
    document.querySelectorAll('.btn-expand-before, .btn-expand-after').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute('data-video-index') || '0', 10);
        loadAndPlayModalVideo('pc', idx);
      });
    });

    // Botón de PS5 'Agrandar Video PS5'
    if (btnExpandPs5) {
      btnExpandPs5.addEventListener('click', (e) => {
        e.preventDefault();
        loadAndPlayModalVideo('ps5', activePs5Idx);
      });
    }

    if (modalClose) modalClose.addEventListener('click', closeVideoModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeVideoModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
      }
    });
  }

  /* ── FILTRADO INTERACTIVO DEL CATÁLOGO ── */
  const filterBar = document.getElementById('catalog-filter-bar');
  const catalogCards = document.querySelectorAll('.catalog-card');

  if (filterBar && catalogCards.length > 0) {
    const filterButtons = filterBar.querySelectorAll('.filter-btn');

    const totalCountEl = document.getElementById('count-all');
    if (totalCountEl) totalCountEl.textContent = catalogCards.length;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        catalogCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('hidden');
            card.style.animation = 'none';
            void card.offsetHeight;
            card.style.animation = 'crossfade .35s cubic-bezier(.16,1,.3,1) forwards';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ── PRODUCTOS DEL CATÁLOGO & MODAL DE VARIANTES CON SLIDER ── */
  const catalogProducts = {
    A: {
      title: 'Ensamble Custom Hyte Y70 Touch Screen',
      badge: 'Del taller',
      badgeClass: 'pill-cyan',
      tag: 'Ensamble Custom',
      desc: 'Armado en nuestro taller: chasis Hyte Y70 con pantalla táctil de 14.5" 2.5K, refrigeración líquida con LCD de temperaturas y GPU GeForce RTX vertical.',
      specs: [
        'Chasis Hyte Y70 con pantalla táctil 2.5K',
        'Refrigeración líquida con LCD de temperaturas',
        'GPU GeForce RTX vertical de triple ventilador',
        'Cableado ordenado, iluminación ARGB y buen flujo de aire'
      ],
      status: 'Bajo pedido',
      waText: 'Hola Orion Gamers, deseo cotizar un ensamble custom similar al Hyte Y70 Touch.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/A.webp',
        'Imagenes%20y%20videos%20Pagina/A2.webp'
      ]
    },
    B: {
      title: 'Portátil ASUS Ultra Slim Corporativo',
      badge: 'Con respaldo',
      badgeClass: 'pill-gold',
      tag: 'Portátil Corporativo',
      desc: 'Portátil corporativo verificado: chasis ultraligero, pantalla antirreflejo, buena batería y teclado ergonómico para jornadas largas.',
      specs: [
        'Chasis ultradelgado y resistente',
        'Pantalla Full HD antirreflejo',
        'Teclado ergonómico de perfil bajo',
        'USB-C, HDMI y Wi-Fi rápido'
      ],
      status: 'Disponible · Con garantía',
      waText: 'Hola Orion Gamers, deseo cotizar el portátil ASUS Ultra Slim Corporativo.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/B.jpeg'
      ]
    },
    C: {
      title: 'Laptop Gamer Lenovo Legion Pro (Core i7 + RTX)',
      badge: 'Máximo rendimiento',
      badgeClass: 'pill-purple',
      tag: 'Laptop Gamer',
      desc: 'Para eSports y render 3D: Intel Core i7, NVIDIA GeForce RTX de alto TGP, pantalla IPS de 165Hz y sistema térmico Legion Coldfront.',
      specs: [
        'Procesador Intel Core i7 multinúcleo',
        'NVIDIA GeForce RTX con Ray Tracing y DLSS',
        'Pantalla IPS de 165Hz de respuesta rápida',
        'Sistema térmico Legion Coldfront con cobre'
      ],
      status: 'Disponible · Verificada en taller',
      waText: 'Hola Orion Gamers, deseo cotizar la laptop Gamer Lenovo Legion Pro Core i7 + RTX.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/C.jpeg',
        'Imagenes%20y%20videos%20Pagina/C2.jpeg',
        'Imagenes%20y%20videos%20Pagina/C3.jpeg',
        'Imagenes%20y%20videos%20Pagina/C4.jpeg',
        'Imagenes%20y%20videos%20Pagina/C5.jpeg',
        'Imagenes%20y%20videos%20Pagina/C6.jpeg',
        'Imagenes%20y%20videos%20Pagina/C7.jpeg',
        'Imagenes%20y%20videos%20Pagina/C8.jpeg'
      ]
    },
    D: {
      title: 'Laptop ASUS ExpertBook Core i5 13va Gen',
      badge: 'Corporativo',
      badgeClass: 'pill-gold',
      tag: 'Portátil Corporativo',
      desc: 'Intel Core i5-13420H (13va Gen), 8 GB de RAM, SSD NVMe de 512 GB, pantalla Full HD, audio Dirac y lector de huellas. Verificada en taller.',
      specs: [
        'Intel Core i5-13420H de 13va Gen',
        'SSD NVMe M.2 de 512 GB',
        'Pantalla 15.6" Full HD (1920x1080) antirreflejo',
        'Audio Dirac y lector de huellas'
      ],
      status: 'Disponible · Verificada en taller',
      waText: 'Hola Orion Gamers, deseo cotizar la laptop ASUS ExpertBook Core i5 13va Gen.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/D.webp',
        'Imagenes%20y%20videos%20Pagina/D2.webp',
        'Imagenes%20y%20videos%20Pagina/D3.webp',
        'Imagenes%20y%20videos%20Pagina/D4.webp'
      ]
    },
    E: {
      title: 'Laptop Empresarial Lenovo ThinkPad T14 vPro',
      badge: 'Empresarial',
      badgeClass: 'pill-gold',
      tag: 'Portátil Empresarial',
      desc: 'Durabilidad para ingeniería y negocios: Intel Core i7 vPro, gráficos Iris Xe, teclado ThinkPad con TrackPoint y puertos Thunderbolt / USB-C.',
      specs: [
        'Intel Core i7 con vPro',
        'Gráficos Intel Iris Xe',
        'Chasis reforzado MIL-STD',
        'Doble Thunderbolt / USB-C y teclado ThinkPad'
      ],
      status: 'Disponible · Garantía de 6 meses',
      waText: 'Hola Orion Gamers, deseo cotizar la laptop Lenovo ThinkPad T14 vPro.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/E.jpeg',
        'Imagenes%20y%20videos%20Pagina/E2.jpeg',
        'Imagenes%20y%20videos%20Pagina/E3.jpeg',
        'Imagenes%20y%20videos%20Pagina/E4.jpeg'
      ]
    },
    F: {
      title: 'Laptop Lenovo V15 G4 (Ryzen 5 + 16GB RAM)',
      badge: 'Oferta',
      badgeClass: 'pill-green',
      tag: 'Oficina y Estudio',
      desc: 'Ideal para oficina y universidad: AMD Ryzen 5 7520U, 16 GB de RAM LPDDR5, SSD NVMe de 512 GB y pantalla Full HD de 15.6" antirreflejo.',
      specs: [
        'AMD Ryzen 5 7520U (4 núcleos / 8 hilos, hasta 4.3 GHz)',
        'RAM de 16 GB LPDDR5',
        'SSD NVMe M.2 de 512 GB',
        'Pantalla 15.6" Full HD antirreflejo'
      ],
      status: 'Promoción · $1.820.000 COP',
      waText: 'Hola Orion Gamers, deseo comprar/cotizar la laptop Lenovo V15 G4 Ryzen 5 por $1.820.000 COP.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/F.jpeg',
        'Imagenes%20y%20videos%20Pagina/F2.jpeg',
        'Imagenes%20y%20videos%20Pagina/F3.jpeg',
        'Imagenes%20y%20videos%20Pagina/F4.jpeg'
      ]
    },
    G: {
      title: 'Laptop Gamer Lenovo IdeaPad Gaming (Ryzen 5 + GTX)',
      badge: 'Gamer de entrada',
      badgeClass: 'pill-purple',
      tag: 'Gaming de Entrada',
      desc: 'Tu entrada al gaming: AMD Ryzen 5 con NVIDIA GeForce GTX, teclado retroiluminado azul y ventilación probada en taller.',
      specs: [
        'Procesador AMD Ryzen 5',
        'NVIDIA GeForce GTX para eSports y juegos populares',
        'Teclado retroiluminado azul',
        'Doble ventilador y toberas traseras'
      ],
      status: 'Disponible · Mantenimiento reciente',
      waText: 'Hola Orion Gamers, deseo cotizar la laptop Gamer Lenovo IdeaPad Ryzen 5 + GTX.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/G.jpeg',
        'Imagenes%20y%20videos%20Pagina/G2.jpeg',
        'Imagenes%20y%20videos%20Pagina/G3.jpeg'
      ]
    },
    H: {
      title: 'Laptop Gamer Lenovo LOQ (Core i7 + RTX)',
      badge: 'Nueva generación',
      badgeClass: 'pill-cyan',
      tag: 'Gaming Avanzado',
      desc: 'Para gamers competitivos y creadores: Intel Core i7 de nueva generación, NVIDIA GeForce RTX con DLSS 3, toberas traseras y teclado RGB.',
      specs: [
        'Intel Core i7 de nueva generación',
        'NVIDIA GeForce RTX con DLSS 3 y Ray Tracing',
        'Chasis LOQ con toberas traseras',
        'Pantalla de alta tasa de refresco'
      ],
      status: 'Disponible · Entrega inmediata',
      waText: 'Hola Orion Gamers, deseo cotizar la laptop Gamer Lenovo LOQ Core i7 + RTX.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/H.jpeg',
        'Imagenes%20y%20videos%20Pagina/H2.jpeg',
        'Imagenes%20y%20videos%20Pagina/H3.jpeg'
      ]
    },
    I: {
      title: 'Build Ensamble White Edition Aorus & MSI',
      badge: 'White Edition',
      badgeClass: 'pill-cyan',
      tag: 'Ensamble White Edition',
      desc: 'Ensamble blanco armado en Orion Gamers: componentes Aorus y MSI, refrigeración blanca, RAM DDR5 RGB y cableado sleeved.',
      specs: [
        'Chasis blanco panorámico de vidrio templado',
        'Componentes MSI y AORUS con iluminación sincronizada',
        'RAM DDR5 con disipador blanco',
        'Cableado sleeved blanco y ventiladores silenciosos'
      ],
      status: 'Disponible para ensamble',
      waText: 'Hola Orion Gamers, deseo cotizar un ensamble Gamer White Edition.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/I.webp',
        'Imagenes%20y%20videos%20Pagina/I2.webp'
      ]
    },
    'LIC-OFFICE24': {
      title: 'Microsoft Office 2024 Professional Plus',
      badge: '',
      badgeClass: '',
      tag: 'Licencia · Permanente',
      desc: 'Licencia original de Office 2024 Professional Plus, lista para activar, sin suscripciones mensuales.',
      specs: [
        'Word, Excel, PowerPoint, Outlook, OneNote y Access',
        'Licencia permanente (pago único)',
        'Activación para 1 computador con Windows 10 u 11',
        'Entrega inmediata con clave oficial y soporte'
      ],
      status: 'Entrega digital inmediata · Clave original',
      waText: 'Hola Orion Gamers, me interesa adquirir la licencia original de Microsoft Office 2024 Professional Plus.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/licencia.jpeg'
      ]
    },
    'LIC-O365': {
      title: 'Microsoft 365 Personal & Business Standard',
      badge: '',
      badgeClass: '',
      tag: 'Licencia · Nube OneDrive',
      desc: 'Microsoft 365 original por 12 meses: Word, Excel, PowerPoint y Outlook siempre actualizados, más 1 TB en OneDrive.',
      specs: [
        'Suscripción oficial de 12 meses (Personal o Business Standard)',
        '1 TB en la nube OneDrive con respaldo',
        'Para PC, Mac, tablets y celulares',
        'Protección contra malware y ransomware'
      ],
      status: 'Entrega digital inmediata · Activación oficial',
      waText: 'Hola Orion Gamers, me interesa adquirir la licencia de Microsoft 365 (Personal / Business).',
      variants: [
        'Imagenes%20y%20videos%20Pagina/licencia2.jpeg'
      ]
    },
    'LIC-PROJECT': {
      title: 'Microsoft Project Professional',
      badge: '',
      badgeClass: '',
      tag: 'Licencia · Profesional',
      desc: 'Project Professional original, el estándar para gestionar recursos, tiempos, cronogramas y presupuestos.',
      specs: [
        'Cronogramas, rutas críticas, subtareas y costos',
        'Diagramas de Gantt, paneles Kanban y escalas de tiempo',
        'Licencia permanente (pago único)',
        'Para Windows 10 y 11'
      ],
      status: 'Entrega digital inmediata · Licencia oficial',
      waText: 'Hola Orion Gamers, deseo cotizar la licencia de Microsoft Project Professional.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/licencia3.jpeg'
      ]
    },
    'LIC-KASPERSKY': {
      title: 'Antivirus Kaspersky (Esencial y Total)',
      badge: '',
      badgeClass: '',
      tag: 'Licencia · Ciberseguridad',
      desc: 'Protección en tiempo real contra virus, spyware, ransomware, troyanos y sitios fraudulentos, con asesoría de Orion Gamers.',
      specs: [
        'Escaneo en tiempo real contra amenazas de día cero',
        'Safe Money para compras y pagos seguros',
        'Modo gaming: protege sin bajar los FPS',
        'Clave oficial con garantía y soporte'
      ],
      status: 'Entrega digital inmediata',
      waText: 'Hola Orion Gamers, deseo adquirir la licencia de Antivirus Kaspersky para proteger mi equipo.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/licencia4.jpeg'
      ]
    },
    'LIC-WINDOWS': {
      title: 'Windows 11 Pro / 10 Pro y Home OEM',
      badge: '',
      badgeClass: '',
      tag: 'Licencia · Sistema operativo',
      desc: 'Windows 11 Pro, 10 Pro y Home OEM originales: sin aviso de activación, con funciones avanzadas y actualizaciones oficiales.',
      specs: [
        'Licencia OEM original ligada a la placa madre',
        'BitLocker, Escritorio Remoto, Hyper-V y Sandbox',
        'Actualizaciones y parches oficiales de Microsoft',
        'Clave de 25 caracteres con guía de uso'
      ],
      status: 'Entrega digital inmediata · Permanente',
      waText: 'Hola Orion Gamers, deseo comprar la licencia original de Windows 11 Pro / Windows 10 Pro.',
      variants: [
        'Imagenes%20y%20videos%20Pagina/licencia5.jpeg'
      ]
    }
  };

  const productModal = document.getElementById('product-modal');
  const productModalBackdrop = document.getElementById('product-modal-backdrop');
  const productModalClose = document.getElementById('product-modal-close');
  const prodModalTag = document.getElementById('modal-product-tag');
  const prodModalTitle = document.getElementById('modal-product-title');
  const prodModalDesc = document.getElementById('modal-product-desc');
  const prodModalSpecs = document.getElementById('modal-product-specs');
  const prodModalStatus = document.getElementById('modal-product-status');
  const prodModalWa = document.getElementById('modal-product-wa');
  const prodModalWaText = document.getElementById('modal-product-wa-text');

  const modalSliderImg = document.getElementById('modal-slider-img');
  const modalSliderCounter = document.getElementById('modal-slider-counter');
  const modalSliderPrev = document.getElementById('modal-slider-prev');
  const modalSliderNext = document.getElementById('modal-slider-next');
  const modalThumbsContainer = document.getElementById('modal-thumbs-container');

  let activeProduct = null;
  let activeVariantIdx = 0;

  function updateModalSlide(idx) {
    if (!activeProduct || !activeProduct.variants.length) return;
    activeVariantIdx = (idx + activeProduct.variants.length) % activeProduct.variants.length;
    
    if (modalSliderImg) {
      modalSliderImg.classList.remove('fade-in');
      void modalSliderImg.offsetWidth;
      modalSliderImg.src = activeProduct.variants[activeVariantIdx];
      modalSliderImg.alt = `${activeProduct.title} - Imagen ${activeVariantIdx + 1}`;
      modalSliderImg.classList.add('fade-in');
    }

    if (modalSliderCounter) {
      modalSliderCounter.textContent = `${activeVariantIdx + 1} / ${activeProduct.variants.length}`;
    }

    if (modalThumbsContainer) {
      modalThumbsContainer.querySelectorAll('.modal-thumb-btn').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === activeVariantIdx);
        if (i === activeVariantIdx) {
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }

    const hasMultiple = activeProduct.variants.length > 1;
    if (modalSliderPrev) modalSliderPrev.style.display = hasMultiple ? 'flex' : 'none';
    if (modalSliderNext) modalSliderNext.style.display = hasMultiple ? 'flex' : 'none';
    if (modalThumbsContainer) modalThumbsContainer.style.display = hasMultiple ? 'flex' : 'none';
  }

  function openProductModal(productId) {
    const prod = catalogProducts[productId];
    if (!prod || !productModal) return;

    activeProduct = prod;
    activeVariantIdx = 0;

    // Poblar detalles (columna izquierda: descripción al lado izquierdo)
    if (prodModalTag) prodModalTag.textContent = prod.tag;
    if (prodModalTitle) prodModalTitle.textContent = prod.title;
    if (prodModalDesc) prodModalDesc.textContent = prod.desc;

    if (prodModalSpecs) {
      prodModalSpecs.innerHTML = '';
      prod.specs.forEach(spec => {
        const li = document.createElement('li');
        li.innerHTML = `<span>✓</span> ${spec}`;
        prodModalSpecs.appendChild(li);
      });
    }

    if (prodModalStatus) prodModalStatus.textContent = prod.status;

    if (prodModalWa) {
      const waUrl = `https://wa.me/573137829331?text=${encodeURIComponent(prod.waText)}`;
      prodModalWa.href = waUrl;
    }
    if (prodModalWaText) {
      prodModalWaText.textContent = `Cotizar ${prod.title.split(' ')[0]} por WhatsApp`;
    }

    // Generar miniaturas (thumbnails)
    if (modalThumbsContainer) {
      modalThumbsContainer.innerHTML = '';
      prod.variants.forEach((imgSrc, i) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.type = 'button';
        thumbBtn.className = `modal-thumb-btn${i === 0 ? ' active' : ''}`;
        thumbBtn.setAttribute('aria-label', `Ver foto ${i + 1} de ${prod.title}`);
        thumbBtn.innerHTML = `<img src="${imgSrc}" alt="${prod.title} miniatura ${i + 1}" loading="lazy">`;
        thumbBtn.addEventListener('click', () => updateModalSlide(i));
        modalThumbsContainer.appendChild(thumbBtn);
      });
    }

    updateModalSlide(0);

    productModal.classList.add('active');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('active');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (productModal) {
    if (productModalClose) productModalClose.addEventListener('click', closeProductModal);
    if (productModalBackdrop) productModalBackdrop.addEventListener('click', closeProductModal);

    if (modalSliderPrev) {
      modalSliderPrev.addEventListener('click', () => {
        updateModalSlide(activeVariantIdx - 1);
      });
    }
    if (modalSliderNext) {
      modalSliderNext.addEventListener('click', () => {
        updateModalSlide(activeVariantIdx + 1);
      });
    }

    // Touch swipe en el slider para móviles
    const sliderBox = document.getElementById('product-modal-slider');
    if (sliderBox) {
      let touchStartX = 0;
      let touchEndX = 0;
      sliderBox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      sliderBox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            updateModalSlide(activeVariantIdx + 1);
          } else {
            updateModalSlide(activeVariantIdx - 1);
          }
        }
      }, { passive: true });
    }

    // Soporte para teclado (Escape, Flechas)
    document.addEventListener('keydown', (e) => {
      if (!productModal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeProductModal();
      } else if (e.key === 'ArrowRight') {
        updateModalSlide(activeVariantIdx + 1);
      } else if (e.key === 'ArrowLeft') {
        updateModalSlide(activeVariantIdx - 1);
      }
    });

    // Conectar eventos de clic en las tarjetas del catálogo
    catalogCards.forEach(card => {
      const pid = card.getAttribute('data-product-id');
      if (!pid) return;

      const media = card.querySelector('.catalog-card-media');
      if (media) {
        media.addEventListener('click', () => openProductModal(pid));
        media.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProductModal(pid);
          }
        });
      }

      const viewBtn = card.querySelector('.btn-catalog-view');
      if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openProductModal(pid);
        });
      }
    });
  }

  /* ── FORMULARIO GENERADOR DE MENSAJE WHATSAPP (contacto.html) ── */
  const contactForm = document.getElementById('appointment-form');
  const previewBubble = document.getElementById('wa-preview-text');

  if (contactForm && previewBubble) {
    const inputNombre = document.getElementById('field-nombre');
    const inputServicio = document.getElementById('field-servicio');
    const inputEquipo = document.getElementById('field-equipo');
    const inputHorario = document.getElementById('field-horario');
    const inputMensaje = document.getElementById('field-mensaje');

    function buildMessage() {
      const nombre = inputNombre && inputNombre.value.trim() ? inputNombre.value.trim() : '[Tu Nombre]';
      const servicio = inputServicio ? inputServicio.value : 'Mantenimiento';
      const equipo = inputEquipo ? inputEquipo.value : 'Equipo';
      const horario = inputHorario ? inputHorario.value : 'Lo antes posible';
      const detalles = inputMensaje && inputMensaje.value.trim() ? inputMensaje.value.trim() : 'Sin detalles adicionales.';

      return `¡Hola Orion Gamers!
Mi nombre es: ${nombre}
Deseo solicitar/cotizar: ${servicio}
Tipo de equipo: ${equipo}
Preferencia de cita/horario: ${horario}
Detalles del equipo / falla:
${detalles}

¡Quedo atento a su respuesta y disponibilidad en el taller de Itagüí!`;
    }

    function updatePreview() {
      previewBubble.textContent = buildMessage();
    }

    [inputNombre, inputServicio, inputEquipo, inputHorario, inputMensaje].forEach(el => {
      if (el) {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
      }
    });

    updatePreview();

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (inputNombre && !inputNombre.value.trim()) {
        inputNombre.focus();
        return;
      }
      const fullText = buildMessage();
      const waUrl = `https://wa.me/573137829331?text=${encodeURIComponent(fullText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /* ── ACORDEÓN INTERACTIVO DE PREGUNTAS FRECUENTES (FAQ) ── */
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (questionBtn && answer) {
        questionBtn.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');

          faqItems.forEach(other => {
            if (other !== item && other.classList.contains('active')) {
              other.classList.remove('active');
              const otherAns = other.querySelector('.faq-answer');
              if (otherAns) otherAns.style.maxHeight = null;
              const otherBtn = other.querySelector('.faq-question');
              if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            }
          });

          if (isOpen) {
            item.classList.remove('active');
            answer.style.maxHeight = null;
            questionBtn.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            questionBtn.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }

});

