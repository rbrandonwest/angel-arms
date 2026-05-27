// Faith Forward Ministries + Angel Arms — site behavior

(function () {
  'use strict';

  /* ---- Sticky nav scroll state ---- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 12) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile menu toggle ---- */
  const toggle = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---- Year stamp in footer ---- */
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Contact form submit (AJAX -> Formspree-compatible) ---- */
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const button = form.querySelector('button[type="submit"]');
      const setStatus = (msg, ok) => {
        if (!status) return;
        status.textContent = msg;
        status.style.color = ok ? 'var(--ff-primary-dark)' : '#b94c4c';
      };
      const setButton = (label, disabled) => {
        if (!button) return;
        button.disabled = disabled;
        button.innerHTML = label;
      };

      const endpoint = form.getAttribute('action') || '';
      if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
        setStatus('Form not yet configured. Replace YOUR_FORM_ID in contact.html with your Formspree endpoint.', false);
        return;
      }

      setButton('Sending…', true);
      setStatus('', true);

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          form.reset();
          setStatus('Thank you — your message has been received. We will follow up within one business day.', true);
          setButton('Send message', false);
        } else {
          const data = await res.json().catch(() => ({}));
          const errMsg = (data && data.errors && data.errors.map((x) => x.message).join(', ')) || 'Something went wrong. Please try again, or email us directly.';
          setStatus(errMsg, false);
          setButton('Send message', false);
        }
      } catch (err) {
        setStatus('Network error. Please try again, or email us directly at faithforwardpa@gmail.com.', false);
        setButton('Send message', false);
      }
    });
  }
})();
