(() => {
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.dataset.open = 'false';
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.dataset.open = String(open);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  function updateActiveLink() {
    let active = null;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= 180) active = section.id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) active = 'contact';
    links.forEach(link => {
      if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateActiveLink); }
  }, { passive: true });
  updateActiveLink();

  const copy = document.querySelector('#copy-email');
  const status = document.querySelector('#copy-status');
  const label = copy.querySelector('span');
  copy.hidden = false;
  let feedbackTimer;
  copy.addEventListener('click', async () => {
    clearTimeout(feedbackTimer);
    copy.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText('chiragpagaria.cp@gmail.com');
      label.textContent = 'Copied';
      status.textContent = 'Email address copied.';
    } catch {
      label.textContent = 'Copy';
      status.textContent = 'Select the email address to copy it, or click it to send an email.';
    } finally {
      copy.disabled = false;
      feedbackTimer = setTimeout(() => { label.textContent = 'Copy'; status.textContent = ''; }, 6000);
    }
  });
})();
