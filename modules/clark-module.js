(() => {
  // A single return control works both standalone and inside the hub.
  const dock = document.getElementById('msb-hub-return-dock');
  dock?.querySelector('a')?.addEventListener('click', event => {
    try {
      if (window.parent !== window && typeof window.parent.closeModule === 'function') {
        event.preventDefault(); window.parent.closeModule();
      }
    } catch (_) { /* file-origin isolation: the normal top-level link remains usable */ }
  });
  document.querySelectorAll('#global-fs-btn').forEach(button => {
    button.onclick = async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      } catch (_) {
        button.title = 'Fullscreen is unavailable here. Use Open full page in the hub.';
      }
    };
  });
  if (location.pathname.endsWith('/frizzle-educator-hub.html')) {
    const routes = {
      'Start a New Lesson':'../frizz-files-lesson-hub.html#lessons',
      'Browse Curriculum':'../frizz-files-lesson-hub.html#episodes',
      'View Lesson Plan':'../frizz-files-lesson-hub.html#lessons',
      'Launch':'../frizz-files-lesson-hub.html#experiments',
      'Unlock Module':'MSB_Science_Packets_Complete.html'
    };
    document.querySelectorAll('button').forEach(button => {
      const label = button.textContent.trim();
      let route = routes[label];
      if (label === 'Explore Module') {
        const topic = button.parentElement.textContent;
        route = topic.includes('Solar') ? 'msb-galactic-lab.html' : '../frizz-files-lesson-hub.html#lessons';
        button.textContent = topic.includes('Solar') ? 'Open Galactic Lab' : 'Browse Lesson Library';
      }
      if (label === 'Unlock Module') button.textContent = 'Open Science Packets';
      if (button.getAttribute('aria-label') === 'Download Document') {
        route = 'frizz-worksheet-generator.html';
        button.setAttribute('aria-label','Open printable worksheet generator');
        button.title = 'Open worksheet generator to print or save a PDF';
      }
      if (route) button.addEventListener('click', () => { location.href = route; });
    });
  }
})();
