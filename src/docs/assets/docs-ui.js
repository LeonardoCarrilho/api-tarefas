document.documentElement.lang = 'pt-BR';
const viewport = document.createElement('meta');
viewport.name = 'viewport';
viewport.content = 'width=device-width, initial-scale=1';
document.head.append(viewport);

// Keep Swagger's React-owned elements, while exposing a continuous heading hierarchy.
const alignHeadingLevels = () => {
  document.querySelectorAll('.opblock-tag, section.models > h4').forEach(heading => {
    heading.setAttribute('aria-level', '2');
  });
};
alignHeadingLevels();
new MutationObserver(alignHeadingLevels).observe(document.getElementById('swagger-ui'), {
  childList: true,
  subtree: true,
});
