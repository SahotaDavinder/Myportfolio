'use strict';

/* ============================================
   PERFORMANCE OPTIMIZATIONS
============================================ */
// Detect mobile devices
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Reduce animations on mobile
if (isMobile) {
  document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
}

/* ============================================
   1. LOADER (Simplified)
============================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Simulate loading
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Initialize animations after loader
        initScrollAnimations();
      }, 300);
    }
  }, 150);

  // Prevent scrolling during load
  document.body.style.overflow = 'hidden';
})();

/* ============================================
   2. TYPED TEXT EFFECT (Optimized)
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

    let speed = isDeleting ? 50 : 80;

    if (!isDeleting && charIndex === current.length) {
      speed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ============================================
   3. SMOOTH SCROLL
============================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (!target) return;
      
      e.preventDefault();
      
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobileMenu');
      const hamburger = document.getElementById('hamburger');
      if (mobileMenu?.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
      }
      
      // Smooth scroll to target
      const navHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
})();

/* ============================================
   4. NAVBAR SCROLL & ACTIVE STATES
============================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Navbar scroll effect (throttled for performance)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.pageYOffset > 60);
        
        // Update active nav link
        let current = '';
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
          }
        });
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Hamburger menu toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  });

  // Mobile menu links
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
   5. SCROLL ANIMATIONS (Intersection Observer)
============================================ */
function initScrollAnimations() {
  // Only animate on non-mobile or high-end devices
  const shouldAnimate = !isMobile || window.innerWidth > 768;
  
  if (!shouldAnimate) {
    // Just show everything immediately on mobile
    document.querySelectorAll('.skill-bar-item').forEach(item => {
      const fill = item.querySelector('.skill-bar-fill');
      const level = item.dataset.level;
      if (fill && level) {
        fill.style.width = level + '%';
      }
    });
    
    document.querySelectorAll('.stat-value[data-target]').forEach(el => {
      const target = el.dataset.target;
      const label = el.parentElement.querySelector('.stat-label').textContent;
      const suffix = label.includes('%') ? '%' : '+';
      el.textContent = target + suffix;
    });
    
    return;
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with fade-in animation
  document.querySelectorAll('.tech-icon').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ============================================
   6. COUNTER ANIMATION
============================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-value[data-target]');
  
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const label = el.parentElement.querySelector('.stat-label').textContent;
        const suffix = label.includes('%') ? '%' : '+';
        
        let current = 0;
        const increment = target / 60; // 60 frames for 1 second
        const duration = 1500;
        const stepTime = duration / 60;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          el.textContent = Math.floor(current) + suffix;
        }, stepTime);
        
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  
  counters.forEach((el) => counterObserver.observe(el));
}

/* ============================================
   7. SKILL BARS ANIMATION
============================================ */
function initSkillBars() {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        
        const fill = entry.target.querySelector('.skill-bar-fill');
        const level = entry.target.dataset.level;
        
        if (fill && level) {
          setTimeout(() => {
            fill.style.width = level + '%';
          }, 150);
        }
        
        skillObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );
  
  document.querySelectorAll('.skill-bar-item').forEach((el) => {
    skillObserver.observe(el);
  });
}

/* ============================================
   8. PROJECT FILTER
============================================ */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      // Update active button
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      const filter = this.dataset.filter;

      // Filter projects
      projectCards.forEach((card) => {
        const categories = card.dataset.category.split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
          card.classList.remove('hidden');
          card.style.display = 'block';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ============================================
   9. FORM HANDLING
============================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // If using FormSpree, the form will handle submission automatically
  // Add client-side validation
  form.addEventListener('submit', function(e) {
    let isValid = true;
    
    // Validate required fields
    form.querySelectorAll('[required]').forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ff6584';
        
        // Reset border color on input
        input.addEventListener('input', () => {
          input.style.borderColor = '';
        }, { once: true });
      }
    });

    // Validate email format
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        isValid = false;
        emailInput.style.borderColor = '#ff6584';
        alert('Please enter a valid email address');
      }
    }

    if (!isValid) {
      e.preventDefault();
      return false;
    }

    // If using FormSpree, it will handle the rest
    // Otherwise, prevent default and handle with AJAX
  });
}

/* ============================================
   10. REAL 3D EARTH
============================================ */
async function initEarthInteraction() {
  const container = document.getElementById('earthCanvas');
  const loading = document.querySelector('.earth-loading');
  if (!container) return;

  try {
    // Load Three.js only when the Earth is present.
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 520;
    const isSmallScreen = window.innerWidth <= 768;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.15);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.5 : 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x6c63ff, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(-3, 2, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x43e8d8, 1.25);
    rimLight.position.set(4, -1, -3);
    scene.add(rimLight);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const radius = 1.48;
    const geometry = new THREE.SphereGeometry(radius, isSmallScreen ? 48 : 64, isSmallScreen ? 48 : 64);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    const loadTexture = (url) => new Promise((resolve, reject) => {
      textureLoader.load(url, resolve, undefined, reject);
    });

    const textureBase = 'https://threejs.org/examples/textures/planets/';

    const [earthTexture, normalTexture, specularTexture] = await Promise.all([
      loadTexture(textureBase + 'earth_atmos_2048.jpg'),
      loadTexture(textureBase + 'earth_normal_2048.jpg'),
      loadTexture(textureBase + 'earth_specular_2048.jpg')
    ]);

    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.55, 0.55),
      specularMap: specularTexture,
      specular: new THREE.Color(0x4466aa),
      shininess: 18,
      emissive: new THREE.Color(0x07152b),
      emissiveIntensity: 0.22
    });

    const earth = new THREE.Mesh(geometry, earthMaterial);
    earthGroup.add(earth);

    // Soft atmospheric shell.
    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.035, 48, 48);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x43e8d8) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float rim = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
          gl_FragColor = vec4(glowColor, rim * 0.72);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphere);

    // Subtle city/location markers placed on the 3D globe.
    const locations = [
      { name: 'India', lat: 22.5, lon: 78.9, color: 0x43e8d8 },
      { name: 'USA', lat: 39.8, lon: -98.6, color: 0x6c63ff },
      { name: 'UK', lat: 54.0, lon: -2.0, color: 0xff6584 },
      { name: 'Australia', lat: -25.3, lon: 133.8, color: 0x43e8d8 },
      { name: 'Canada', lat: 56.1, lon: -106.3, color: 0x6c63ff }
    ];

    const markerGroup = new THREE.Group();
    earthGroup.add(markerGroup);

    function latLonToVector3(lat, lon, r) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lon + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    locations.forEach((location) => {
      const point = latLonToVector3(location.lat, location.lon, radius * 1.012);
      const markerGeometry = new THREE.SphereGeometry(isSmallScreen ? 0.035 : 0.045, 12, 12);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: location.color,
        transparent: true,
        opacity: 1
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(point);
      marker.userData.location = location.name;
      markerGroup.add(marker);

      const glowGeometry = new THREE.SphereGeometry(isSmallScreen ? 0.075 : 0.09, 12, 12);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: location.color,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(point);
      markerGroup.add(glow);
    });

    // Stars around the globe.
    const starCount = isSmallScreen ? 350 : 700;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 5 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xb9c9ff,
      size: isSmallScreen ? 0.018 : 0.024,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Start with India facing the viewer.
    earthGroup.rotation.y = THREE.MathUtils.degToRad(-20);
    earthGroup.rotation.x = THREE.MathUtils.degToRad(5);

    let targetRotationX = earthGroup.rotation.x;
    let targetRotationY = earthGroup.rotation.y;
    let velocityX = 0;
    let velocityY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastTime = performance.now();

    const canvas = renderer.domElement;

    const onPointerDown = (event) => {
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      velocityX = 0;
      velocityY = 0;
      canvas.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!isDragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      targetRotationY += dx * 0.008;
      targetRotationX += dy * 0.006;
      targetRotationX = THREE.MathUtils.clamp(targetRotationX, -0.85, 0.85);
      velocityX = dy * 0.0008;
      velocityY = dx * 0.001;
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const onPointerUp = (event) => {
      isDragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', () => { if (isDragging) isDragging = false; });

    // Gentle mouse parallax without fighting manual rotation.
    let mouseInfluenceX = 0;
    let mouseInfluenceY = 0;
    const onMouseMove = (event) => {
      if (isDragging) return;
      mouseInfluenceX = (event.clientX / window.innerWidth - 0.5) * 0.12;
      mouseInfluenceY = (event.clientY / window.innerHeight - 0.5) * 0.08;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const resize = () => {
      const w = container.clientWidth || width;
      const h = container.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 768 ? 1.5 : 2));
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', resize);

    if (loading) loading.classList.add('hidden');

    const clock = new THREE.Clock();
    let animationFrame;

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);

      if (!isDragging) {
        targetRotationY += delta * 0.085;
        targetRotationY += velocityY;
        targetRotationX += velocityX;
        velocityX *= 0.94;
        velocityY *= 0.94;
      }

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const smooth = 1 - Math.pow(0.001, dt);

      earthGroup.rotation.y += (targetRotationY + mouseInfluenceX - earthGroup.rotation.y) * smooth;
      earthGroup.rotation.x += (targetRotationX + mouseInfluenceY - earthGroup.rotation.x) * smooth;

      stars.rotation.y -= delta * 0.006;
      stars.rotation.x += delta * 0.002;

      // Pulse the location glows.
      const pulse = 1 + Math.sin(performance.now() * 0.003) * 0.18;
      markerGroup.children.forEach((object, index) => {
        if (index % 2 === 1) object.scale.setScalar(pulse);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Clean up if the page is later reinitialized.
    container._earthCleanup = () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      renderer.dispose();
      geometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };

  } catch (error) {
    console.error('3D Earth failed to load:', error);
    if (loading) {
      loading.classList.remove('hidden');
      loading.innerHTML = '<span class="earth-loading-dot"></span> 3D Earth unavailable';
    }
  }
}

/* ============================================
   11. SCROLL PROGRESS INDICATOR
============================================ */
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #6c63ff, #43e8d8);
    z-index: 2000;
    width: 0%;
    transition: width 0.1s ease;
    box-shadow: 0 0 10px rgba(108,99,255,0.5);
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const winScroll = window.pageYOffset;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================
   12. LAZY LOAD OPTIMIZATION
============================================ */
function initLazyLoad() {
  // Add loading="lazy" to images if browser supports it
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

/* ============================================
   13. PERFORMANCE MONITORING
============================================ */
function logPerformance() {
  if (!window.performance) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;
      
      console.log('📊 Performance Metrics:');
      console.log(`  Page Load Time: ${pageLoadTime}ms`);
      console.log(`  Server Response: ${connectTime}ms`);
      console.log(`  Render Time: ${renderTime}ms`);
    }, 0);
  });
}

/* ============================================
   14. REDUCE MOTION SUPPORT
============================================ */
(function respectReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    // Disable all animations
    document.documentElement.style.setProperty('--transition', 'none');
    
    // Remove animation classes
    document.querySelectorAll('[class*="animation"]').forEach(el => {
      el.style.animation = 'none';
    });
  }
})();

/* ============================================
   15. INITIALIZE ALL ON DOM READY
============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTypedText();
  initCounters();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initEarthInteraction();
  initScrollProgress();
  initLazyLoad();
  
  // Log performance in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    logPerformance();
  }
});

/* ============================================
   16. WINDOW LOAD EVENT
============================================ */
window.addEventListener('load', () => {
  // Remove any loading states
  document.body.classList.add('loaded');
  
  // Force reflow to ensure all animations are ready
  document.body.offsetHeight;
});

/* ============================================
   17. ERROR HANDLING
============================================ */
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.message);
  // Optionally send to analytics or error tracking service
});

/* ============================================
   18. ORIENTATION CHANGE HANDLER
============================================ */
window.addEventListener('orientationchange', () => {
  // Recalculate layout on orientation change
  setTimeout(() => {
    window.scrollTo(0, window.pageYOffset);
  }, 100);
});

/* ============================================
   19. VISIBILITY CHANGE (Tab switching)
============================================ */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible
    document.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    // Resume animations
    document.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
});

/* ============================================
   20. SERVICE WORKER (Optional - for PWA)
============================================ */
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  });
}
*/

console.log('🚀 Portfolio loaded successfully!');
console.log('💼 Davinder Singh - WordPress Developer');
console.log('📧 inder16933@gmail.com');
