module.exports = function templateReact(script, tags) {
  return `


<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:title" content="${tags.metaTitle}"/>
    <meta property="og:description"        content="${tags.metaDesc}" />
    <meta property="og:image"              content="${tags.img}" />
    <title>${tags.title}</title>
    <link
      rel="shortcut icon"
      href="https://smers.sse.codesandbox.io/dna.png"
      type="image/x-icon"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css"
    />
    <script
      defer
      src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"
    ></script>
  </head>
  <body>
    <div id="root"/>
    <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="${script}"></script>
  </body>
</html>

   
`;
};
