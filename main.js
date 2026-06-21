'use strict';

/* ============================================
   1. LOADER
============================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  const loaderText = document.getElementById('loaderText');
  let count = 0;

  const interval = setInterval(() => {
    count += Math.random() * 15;
    if (count >= 100) {
      count = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAnimations();
      }, 400);
    }
    progress.style.width = count + '%';
    loaderText.textContent = Math.floor(count) + '%';
  }, 80);

  document.body.style.overflow = 'hidden';
})();

/* ============================================
   2. TYPED TEXT EFFECT
============================================ */
function initTypedText() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const roles = [
    'WordPress Developer',
    'Web Designer',
    'PHP Developer',
    'AI Integrator',
    'UI/UX Designer',
    'SEO Specialist',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = roles[roleIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ============================================
   3. CUSTOM CURSOR
============================================ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a,button,.btn,.project-card,.filter-btn,.social-btn,.magnetic,.timeline-card,.stat-card').forEach((el) => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); follower.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); follower.classList.remove('hovering'); });
  });
})();

/* ============================================
   4. SMOOTH SCROLL
============================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const mobileMenu = document.getElementById('mobileMenu');
      const hamburger = document.getElementById('hamburger');
      if (mobileMenu?.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
      }
      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: 'smooth' });
    });
  });
})();

/* ============================================
   5. NAVBAR
============================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    let current = '';
    sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach((l) => { l.classList.toggle('active', l.getAttribute('href') === '#' + current); });
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = 'auto';
    });
  });
})();

/* ============================================
   6. HERO 3D SCENE
============================================ */
function initHeroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.set(0, 0, 7);

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const pLight1 = new THREE.PointLight(0x6c63ff, 3, 20);
  pLight1.position.set(5, 5, 5);
  scene.add(pLight1);

  const pLight2 = new THREE.PointLight(0x43e8d8, 2, 20);
  pLight2.position.set(-5, -5, -5);
  scene.add(pLight2);

  const pLight3 = new THREE.PointLight(0xff6584, 1.5, 15);
  pLight3.position.set(0, 8, -5);
  scene.add(pLight3);

  // Main blob sphere
  const sphereGeo = new THREE.SphereGeometry(2, 64, 64);
  const sphereMat = new THREE.MeshStandardMaterial({ color: 0x6c63ff, metalness: 0.9, roughness: 0.1 });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere);

  const posAttr = sphereGeo.attributes.position;
  const originalPositions = new Float32Array(posAttr.array.length);
  for (let i = 0; i < posAttr.array.length; i++) originalPositions[i] = posAttr.array[i];

  // Torus rings
  const torus1 = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.08, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0x43e8d8, metalness: 1, roughness: 0 })
  );
  torus1.rotation.x = Math.PI / 3;
  scene.add(torus1);

  const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.05, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0x6c63ff, metalness: 1, roughness: 0.1, opacity: 0.5, transparent: true })
  );
  torus2.rotation.x = Math.PI / 5;
  torus2.rotation.z = Math.PI / 4;
  scene.add(torus2);

  // Floating octahedron (representing code/tech)
  const octahedron = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.6),
    new THREE.MeshStandardMaterial({ color: 0xff6584, metalness: 0.8, roughness: 0.2 })
  );
  octahedron.position.set(3.5, 1.5, -0.5);
  scene.add(octahedron);

  // Small cube (representing WordPress blocks)
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x43e8d8, metalness: 0.9, roughness: 0.1 })
  );
  cube.position.set(-3.2, -1.2, 0.5);
  scene.add(cube);

  // Small sphere accent
  const smallSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x6c63ff, metalness: 1, roughness: 0, opacity: 0.8, transparent: true })
  );
  smallSphere.position.set(-2.5, 2, -1);
  scene.add(smallSphere);

  // Particle field
  const count = 1500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ size: 0.04, color: 0x6c63ff, transparent: true, opacity: 0.6, sizeAttenuation: true }));
  scene.add(particles);

  let mouseX = 0, mouseY = 0, targetRotX = 0, targetRotY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    targetRotX += (mouseY * 0.3 - targetRotX) * 0.05;
    targetRotY += (mouseX * 0.3 - targetRotY) * 0.05;

    // Blob distortion
    for (let i = 0; i < posAttr.count; i++) {
      const ix = i * 3;
      const ox = originalPositions[ix], oy = originalPositions[ix + 1], oz = originalPositions[ix + 2];
      const noise = Math.sin(ox * 2 + t * 1.2) * 0.15 + Math.cos(oy * 2 + t * 0.9) * 0.15 + Math.sin(oz * 2 + t * 1.5) * 0.1;
      posAttr.setXYZ(i, ox + noise * ox * 0.12, oy + noise * oy * 0.12, oz + noise * oz * 0.12);
    }
    posAttr.needsUpdate = true;
    sphereGeo.computeVertexNormals();

    sphere.rotation.x = targetRotX + t * 0.1;
    sphere.rotation.y = targetRotY + t * 0.15;

    torus1.rotation.z = t * 0.25;
    torus2.rotation.z = -t * 0.18;
    torus2.rotation.y = t * 0.1;

    octahedron.position.y = 1.5 + Math.sin(t * 1.2) * 0.5;
    octahedron.rotation.x = t * 0.6;
    octahedron.rotation.y = t * 0.4;

    cube.position.y = -1.2 + Math.cos(t * 0.8) * 0.4;
    cube.rotation.x = t * 0.5;
    cube.rotation.z = t * 0.3;

    smallSphere.position.y = 2 + Math.sin(t * 1.5) * 0.3;

    particles.rotation.y = t * 0.025;
    particles.rotation.x = t * 0.01;

    pLight1.position.x = Math.sin(t * 0.7) * 6;
    pLight1.position.y = Math.cos(t * 0.5) * 4;
    pLight2.position.x = Math.cos(t * 0.6) * -6;

    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
}

/* ============================================
   7. ABOUT 3D SCENE
============================================ */
function initAboutScene() {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const pl1 = new THREE.PointLight(0x6c63ff, 3, 15);
  pl1.position.set(3, 3, 3);
  scene.add(pl1);
  const pl2 = new THREE.PointLight(0x43e8d8, 2, 15);
  pl2.position.set(-3, -3, -3);
  scene.add(pl2);

  // Wireframe icosahedron (representing web structure)
  const icoGeo = new THREE.IcosahedronGeometry(1.5, 1);
  const icosahedron = new THREE.Mesh(icoGeo, new THREE.MeshStandardMaterial({ color: 0x6c63ff, metalness: 1, roughness: 0, wireframe: true }));
  scene.add(icosahedron);

  const icoSolid = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.4, 1),
    new THREE.MeshStandardMaterial({ color: 0x6c63ff, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.25 })
  );
  scene.add(icoSolid);

  // Small orbiting sphere (like a planet/moon)
  const orbitSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x43e8d8, metalness: 1, roughness: 0 })
  );
  scene.add(orbitSphere);

  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    icosahedron.rotation.y = t * 0.4;
    icosahedron.rotation.x = Math.sin(t * 0.3) * 0.3;
    icoSolid.rotation.y = t * 0.4;
    icoSolid.rotation.x = Math.sin(t * 0.3) * 0.3;

    const scale = 1 + Math.sin(t * 1.5) * 0.05;
    icosahedron.scale.set(scale, scale, scale);
    icoSolid.scale.set(scale, scale, scale);

    orbitSphere.position.x = Math.cos(t * 1.2) * 2.2;
    orbitSphere.position.y = Math.sin(t * 1.2) * 2.2;
    orbitSphere.position.z = Math.sin(t * 0.8) * 0.5;

    pl1.position.x = Math.sin(t * 0.7) * 4;
    pl1.position.y = Math.cos(t * 0.5) * 3;

    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
}

/* ============================================
   8. SCROLL REVEAL
============================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );
  elements.forEach((el) => observer.observe(el));
}

/* ============================================
   9. COUNTER ANIMATION
============================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-value[data-target]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const label = el.parentElement.querySelector('.stat-label').textContent;
        let current = 0;
        const step = target / (2000 / 16);
        const counter = setInterval(() => {
          current = Math.min(current + step, target);
          const suffix = label.includes('%') ? '%' : '+';
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(counter);
        }, 16);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
}

/* ============================================
   10. SKILL BARS
============================================ */
function initSkillBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fill = entry.target.querySelector('.skill-bar-fill');
        const level = entry.target.dataset.level;
        if (fill && level) setTimeout(() => { fill.style.width = level + '%'; }, 150);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll('.skill-bar-item').forEach((el) => observer.observe(el));
}

/* ============================================
   11. PROJECT FILTER
============================================ */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      filterBtns.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      const filter = this.dataset.filter;
      projectCards.forEach((card) => {
        const categories = card.dataset.category.split(' ');
        const show = filter === 'all' || categories.includes(filter);
        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ============================================
   12. MAGNETIC BUTTONS
============================================ */
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      this.style.transform = `translate(${x}px,${y}px)`;
      this.style.transition = 'transform 0.15s ease';
    });
    btn.addEventListener('mouseleave', function () {
      this.style.transform = 'translate(0,0)';
      this.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
    });
  });
}

/* ============================================
   13. CONTACT FORM
============================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((input) => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#ff6584';
        input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
      }
    });
    if (!valid) return;

    submitBtn.classList.add('loading');
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';
    if (!submitBtn.querySelector('.spinner')) {
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      submitBtn.prepend(spinner);
    }
    submitBtn.querySelector('.spinner').style.display = 'block';
    submitBtn.querySelector('.btn-icon').style.display = 'none';
    submitBtn.disabled = true;

    await new Promise((r) => setTimeout(r, 2000));

    submitBtn.classList.remove('loading');
    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    submitBtn.querySelector('.spinner').style.display = 'none';
    submitBtn.querySelector('.btn-icon').style.display = 'block';
    submitBtn.disabled = false;

    successMsg.classList.add('visible');
    form.reset();
    setTimeout(() => successMsg.classList.remove('visible'), 6000);
  });
}

/* ============================================
   14. SCROLL PROGRESS BAR
============================================ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#6c63ff,#43e8d8);z-index:2000;width:0%;transition:width 0.1s ease;box-shadow:0 0 10px rgba(108,99,255,0.5);pointer-events:none;';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    bar.style.width = ((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100) + '%';
  }, { passive: true });
}

/* ============================================
   15. PARALLAX ORBS
============================================ */
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.forEach((orb, i) => {
      orb.style.transform = `translate(${x * (i + 1) * 12}px,${y * (i + 1) * 12}px)`;
    });
  });
}

/* ============================================
   16. NOISE OVERLAY
============================================ */
function initNoise() {
  const noise = document.createElement('div');
  noise.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;opacity:0.025;background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E");';
  document.body.appendChild(noise);
}

/* ============================================
   INIT ALL
============================================ */
function initAnimations() {
  initTypedText();
  initHeroScene();
  initAboutScene();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initProjectFilter();
  initMagnetic();
  initContactForm();
  initParallax();
}

document.addEventListener('DOMContentLoaded', () => {
  initNoise();
  initScrollProgress();
});
