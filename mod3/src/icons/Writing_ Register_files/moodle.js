document.addEventListener('readystatechange', function () {
  // STATE, REPLACE, LOG_OUT, INTEGRATION, HEIGHT, DONE, UNLOAD
  if (document.readyState === 'complete' && window.self !== window.top) {
    // current location
    const state = { location: window.location.pathname + window.location.search };
    // current user
    const userElement = document.querySelector('.text-username .menu-action-text');
    if (userElement) state.user = userElement.innerHTML.trim();

    window.parent.postMessage({ type: 'STATE', payload: state }, '*');

    // actions
    window.addEventListener('message', function (e) {
      if (e.data.type === 'REPLACE') window.location.replace(e.data.payload);
      if (e.data.type === 'LOG_OUT') {
        const logOutButton = document.querySelector('[data-title="logout,moodle"]');
        if (logOutButton) logOutButton.click();
      }

      // integration adjustments
      if (e.data.type === 'INTEGRATION') {
        const elements = [
          document.querySelector('nav'),
          document.querySelector('header'),
          document.querySelector('footer'),
          document.querySelector('#nav-drawer'),
          document.querySelector('#nav-drawer-footer'),
          document.querySelector('.activity-navigation'),
          document.querySelector('#top-footer'),
          document.querySelector('#sidepreopen-control'),
          document.querySelector('#sidepre-blocks'),
          document.querySelector('section[data-block="custombutton"]')
        ];
        // hides Moodle layout and navigation
        elements.forEach(function (element) {
          if (element) element.style.display = 'none';
        });
        // removes margins
        document.body.style.margin = '0';
        const pageElement = document.querySelector('#page');
        if (pageElement) pageElement.style.marginTop = '0';

        window.parent.postMessage({ type: 'HEIGHT', payload: document.documentElement.scrollHeight }, '*');
        const resizeObserver = new ResizeObserver(() => {
          window.parent.postMessage({ type: 'HEIGHT', payload: document.documentElement.scrollHeight }, '*');
        });
        // further height adjustments are possible
        resizeObserver.observe(document.documentElement);

        window.parent.postMessage({ type: 'DONE' }, '*');
        window.addEventListener('beforeunload', function () {
          window.parent.postMessage({ type: 'UNLOAD' }, '*');
        });
        // beforeunload does not work on iOS
        window.addEventListener('pagehide', function () {
          window.parent.postMessage({ type: 'UNLOAD' }, '*');
        });
      }
    });
  }
});
