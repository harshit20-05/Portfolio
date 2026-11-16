/* ==========================================================================
   PORTFOLIO ENGINE & INTERACTIVITY
   Engineered for Harshit Attri — Software Engineer & Data Scientist
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initScrollReveal();
  initProjectFilters();
  initCounters();
  initGitHubCalendar();
});

/* --------------------------------------------------------------------------
   Theme Toggle & State Persistence
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* --------------------------------------------------------------------------
   Navigation, Mobile Menu & Active Section Highlighting
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll Header Shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Tracking
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Close Mobile Menu when clicking link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll Reveal Observer
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   Project Category Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Animated Number Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counterElements = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetCount = parseInt(target.getAttribute('data-count'), 10);
        const suffix = target.getAttribute('data-suffix') || '';
        let currentCount = 0;
        const step = Math.ceil(targetCount / 40);

        const timer = setInterval(() => {
          currentCount += step;
          if (currentCount >= targetCount) {
            target.textContent = targetCount + suffix;
            clearInterval(timer);
          } else {
            target.textContent = currentCount + suffix;
          }
        }, 30);

        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));
}

/* --------------------------------------------------------------------------
   GitHub Contribution Calendar Integration
   -------------------------------------------------------------------------- */
function initGitHubCalendar() {
  const calendarEl = document.querySelector(".calendar");
  if (!calendarEl) return;

  function renderFallback() {
    calendarEl.innerHTML = `
      <div class="calendar-fallback">
        <p>Active open-source developer with 20+ public repositories on GitHub.</p>
        <a href="https://github.com/harshit20-05" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          View GitHub Contributions & Activity &rarr;
        </a>
      </div>
    `;
  }

  if (typeof GitHubCalendar !== 'undefined') {
    try {
      GitHubCalendar(".calendar", "harshit20-05", {
        responsive: true,
        summary_text: "Summary of commits, pull requests, and issues",
        global_stats: false
      }).catch(err => {
        console.warn("GitHub Calendar API fallback:", err);
        renderFallback();
      });

      // Safety timeout: if after 4 seconds it still hasn't rendered beyond the loading placeholder
      setTimeout(() => {
        const loading = calendarEl.querySelector('.calendar-loading');
        if (loading) {
          renderFallback();
        }
      }, 4000);
    } catch (e) {
      console.warn("GitHub Calendar initialization error:", e);
      renderFallback();
    }
  } else {
    renderFallback();
  }
}

/* --------------------------------------------------------------------------
   Contact Form Submission Handler
   -------------------------------------------------------------------------- */
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const subject = document.getElementById('form-subject').value.trim();
  const message = document.getElementById('form-message').value.trim();
  const statusDiv = document.getElementById('form-status');
  const submitBtn = event.target.querySelector('button[type="submit"]');

  if (!name || !email || !message) {
    alert("Please complete all required fields.");
    return;
  }

  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending Message...';

  fetch('https://formspree.io/f/xvzwvvvo', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      email: email,
      subject: subject || "Portfolio Contact",
      message: message
    })
  })
  .then(response => {
    if (response.ok) {
      statusDiv.classList.add('success');
      statusDiv.textContent = "✓ Message sent successfully! Harshit will get back to you shortly.";
      event.target.reset();
    } else {
      alert("There was an issue sending your message. Please email attriharshit2005@gmail.com directly.");
    }
  })
  .catch(error => {
    alert("There was a network issue sending your message. Please email attriharshit2005@gmail.com directly.");
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  });
}

/* --------------------------------------------------------------------------
   Certificate Preview Lightbox Modal
   -------------------------------------------------------------------------- */
function openCertModal(imageSrc, captionText) {
  const modal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');

  modalImg.src = imageSrc;
  modalCaption.textContent = captionText;
  modal.classList.add('open');
}

function closeCertModal() {
  const modal = document.getElementById('cert-modal');
  modal.classList.remove('open');
}
