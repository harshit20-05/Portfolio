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
  if (typeof GitHubCalendar !== 'undefined') {
    GitHubCalendar(".calendar", "harshit20-05", {
      responsive: true,
      summary_text: "Summary of commits, pull requests, and issues",
      global_stats: false
    }).catch(err => {
      console.log("GitHub Calendar loaded with standard layout.", err);
    });
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
