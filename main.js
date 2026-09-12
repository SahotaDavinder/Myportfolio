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
   10. EARTH ROTATION ENHANCEMENT
============================================ */
function initEarthInteraction() {
  const earth = document.querySelector('.earth-sphere');
  if (!earth || isMobile) return; // Skip on mobile for performance

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    // Subtle parallax effect
    requestAnimationFrame(() => {
      earth.style.transform = `rotateY(${mouseX * 5}deg) rotateX(${-mouseY * 5}deg)`;
    });
  });

  // Marker tooltips
  document.querySelectorAll('.marker').forEach(marker => {
    marker.addEventListener('mouseenter', function() {
      const country = this.dataset.country;
      // You can add a tooltip here if needed
      this.style.transform = 'scale(1.2)';
    });
    
    marker.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
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
