const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const toast = document.querySelector('[data-toast]');

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    textarea.remove();
    return success;
  }
};

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav?.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelector('[data-copy-contact]')?.addEventListener('click', async (event) => {
  const contact = event.currentTarget.dataset.contact;
  const copied = await copyText(contact);
  showToast(copied ? `Контакт ${contact} скопирован` : `Контакт: ${contact}`);
});

const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const message = [
    'Здравствуйте! Пишу по поводу Ohlson 29 Rassvet.',
    '',
    `Имя: ${formData.get('name')}`,
    `Контакт: ${formData.get('contact')}`,
    '',
    formData.get('message')
  ].join('\n');

  await copyText(message);
  showToast('Сообщение скопировано. Открываю Telegram…');
  window.setTimeout(() => {
    window.open('https://t.me/deelstuff', '_blank', 'noopener,noreferrer');
  }, 450);
});

const dialog = document.querySelector('[data-gallery-dialog]');
const dialogCaption = document.querySelector('[data-dialog-caption]');

document.querySelectorAll('[data-gallery-item]').forEach((item) => {
  item.addEventListener('click', () => {
    dialogCaption.textContent = item.dataset.caption;
    dialog.showModal();
  });
});

document.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
