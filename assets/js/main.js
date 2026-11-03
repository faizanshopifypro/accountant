/* ==========================================================================
   AP Accountax Ltd — Homepage behaviour
   No dependencies. Every block is independently guarded so a missing element
   on a future page cannot break the rest of the file.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------- header surface on scroll
     The header is transparent over the ink hero and becomes a solid paper
     surface once the hero has scrolled past. */

  (function headerSurface() {
    const header = document.getElementById('site-header');
    const hero = document.querySelector('.hero');
    if (!header || !hero) return;

    let queued = false;

    function apply() {
      queued = false;
      const threshold = Math.max(hero.offsetHeight - header.offsetHeight, 64);
      header.dataset.scrolled = window.scrollY > threshold ? 'true' : 'false';
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(apply);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    apply();
  })();

  /* ------------------------------------------------------------- mobile nav */

  (function mobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const panel = document.getElementById('mobile-nav');
    const label = document.getElementById('nav-toggle-label');
    const header = document.getElementById('site-header');
    if (!toggle || !panel || !label) return;

    const DESKTOP = window.matchMedia('(min-width: 64rem)');

    function focusable() {
      return Array.from(
        panel.querySelectorAll('a[href], button:not([disabled])')
      ).filter((el) => el.offsetParent !== null);
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      panel.dataset.open = String(open);
      panel.setAttribute('aria-hidden', String(!open));
      document.body.dataset.navOpen = String(open);
      label.textContent = open ? 'Close' : 'Menu';
      if (header) header.dataset.navOpen = String(open);

      if (open) {
        const first = focusable()[0];
        if (first) first.focus();
      }
    }

    function close(returnFocus) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      setOpen(false);
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Choosing a destination should dismiss the panel and release the scroll
    // lock before the browser jumps to the anchor.
    panel.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) close(false);
    });

    document.addEventListener('keydown', function (event) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;

      if (event.key === 'Escape') {
        close(true);
        return;
      }

      // Keep keyboard focus inside the panel while it is open.
      if (event.key === 'Tab') {
        const items = focusable();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    // The panel does not exist at desktop widths, so it must not stay "open".
    DESKTOP.addEventListener('change', function (event) {
      if (event.matches) close(false);
    });
  })();

  /* ------------------------------------------------------ current section
     Tells the user where they are by marking the matching nav link. */

  (function currentSection() {
    const links = Array.from(document.querySelectorAll('[data-nav-target]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    const targets = new Map();
    links.forEach(function (link) {
      const key = link.dataset.navTarget;
      const el = key === 'top' ? document.querySelector('.hero') : document.getElementById(key);
      if (el) targets.set(el, key);
    });
    if (!targets.size) return;

    let active = null;

    function mark(key) {
      if (key === active) return;
      active = key;
      links.forEach(function (link) {
        if (link.dataset.navTarget === key) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    const observer = new IntersectionObserver(
      function (entries) {
        // Pick the visible candidate closest to the top of the viewport.
        const visible = entries
          .filter(function (entry) { return entry.isIntersecting; })
          .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
        if (visible.length) mark(targets.get(visible[0].target));
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    targets.forEach(function (_key, el) { observer.observe(el); });
  })();

  /* ---------------------------------------------------------------- reveal
     One restrained entrance per block. The transform and opacity live behind
     a prefers-reduced-motion: no-preference query in CSS, so setting the
     attribute is inert for users who asked for less motion. */

  (function reveal() {
    const blocks = Array.from(document.querySelectorAll('.reveal'));
    if (!blocks.length) return;

    if (!('IntersectionObserver' in window)) {
      blocks.forEach(function (el) { el.dataset.visible = 'true'; });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.dataset.visible = 'true';
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    blocks.forEach(function (el) { observer.observe(el); });
  })();

  /* ------------------------------------------------------ enquiry form
     Client-side validation only. There is no backend in this prototype, so a
     valid submission hands off to the user's email client rather than
     pretending a server accepted it. */

  (function enquiryForm() {
    const form = document.getElementById('enquiry-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const PHONE = /^[0-9\s()+.-]{7,}$/;

    const rules = {
      name: function (value) {
        if (!value) return 'Please enter your name.';
        if (value.length < 2) return 'Please enter your full name.';
        return '';
      },
      email: function (value) {
        if (!value) return 'Please enter your email address so we can reply.';
        if (!EMAIL.test(value)) return 'Please enter a valid email address, like name@example.co.uk.';
        return '';
      },
      phone: function (value) {
        if (value && !PHONE.test(value)) return 'Please enter a valid phone number, or leave this blank.';
        return '';
      },
      topic: function (value) {
        if (!value) return 'Please choose what you need help with.';
        return '';
      },
      message: function (value) {
        if (!value) return 'Please tell us a little about your business.';
        if (value.length < 10) return 'Please add a little more detail — a sentence is plenty.';
        return '';
      }
    };

    const fields = Object.keys(rules)
      .map(function (name) {
        return {
          name: name,
          control: form.elements[name],
          error: document.getElementById(name + '-error')
        };
      })
      .filter(function (field) { return field.control && field.error; });

    let submitted = false;

    function show(field, message) {
      if (message) {
        field.control.setAttribute('aria-invalid', 'true');
        field.error.textContent = message;
        field.error.dataset.visible = 'true';
      } else {
        field.control.removeAttribute('aria-invalid');
        field.error.textContent = '';
        field.error.dataset.visible = 'false';
      }
      return message;
    }

    function validate(field) {
      return show(field, rules[field.name](field.control.value.trim()));
    }

    function setStatus(state, message) {
      if (!status) return;
      status.dataset.state = state;
      status.textContent = message;
    }

    // Re-validate as the user corrects things, but only after they have tried
    // to submit — validating an untouched field is hostile.
    fields.forEach(function (field) {
      field.control.addEventListener('blur', function () {
        if (submitted) validate(field);
      });
      field.control.addEventListener('input', function () {
        if (submitted && field.control.getAttribute('aria-invalid') === 'true') validate(field);
      });
      field.control.addEventListener('change', function () {
        if (submitted) validate(field);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitted = true;

      const invalid = fields.filter(function (field) { return validate(field); });

      if (invalid.length) {
        setStatus(
          'error',
          invalid.length === 1
            ? 'One field needs attention before you can send this.'
            : invalid.length + ' fields need attention before you can send this.'
        );
        invalid[0].control.focus();
        return;
      }

      const get = function (name) {
        const el = form.elements[name];
        return el ? el.value.trim() : '';
      };

      const body = [
        'Name: ' + get('name'),
        'Email: ' + get('email'),
        'Phone: ' + (get('phone') || 'Not provided'),
        'Enquiry about: ' + get('topic'),
        '',
        get('message')
      ].join('\n');

      setStatus(
        'success',
        'Your details are ready. We have opened a pre-filled message in your email app — ' +
          'press send there, or call +44 20 8552 4323 instead.'
      );

      window.location.href =
        'mailto:contact@apaccountax.co.uk' +
        '?subject=' + encodeURIComponent('Website enquiry — ' + get('topic')) +
        '&body=' + encodeURIComponent(body);
    });
  })();

  /* ----------------------------------------------------------- footer year */

  (function footerYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  })();
})();
