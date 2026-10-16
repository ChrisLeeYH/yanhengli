document.documentElement.classList.add('js');

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const text = document.getElementById(button.dataset.copy)?.textContent;
    const status = button.parentElement.querySelector('.copy-status');
    if (!text || !status) return;
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Citation copied.';
    } catch {
      status.textContent = 'Select the citation above to copy it, or use Download BibTeX.';
    }
  });
}
