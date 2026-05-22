document.addEventListener('DOMContentLoaded', function () {

  // ── Materialize Sidenav ──
  M.Sidenav.init(document.querySelectorAll('.sidenav'), {});

  // ── Scroll Reveal ──
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }


  // ── Materialize Select (contacto) ──
  const selects = document.querySelectorAll('select');
  if (selects.length) M.FormSelect.init(selects, {});

  // ── Contact form submit (demo) ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      M.toast({ html: '✓ Mensaje enviado. Te contactaremos pronto.', classes: 'toast-cyan' });
      form.reset();
    });
  }

});