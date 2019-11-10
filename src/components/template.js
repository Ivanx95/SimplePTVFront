module.exports = function htmlTemplate(reactDom, metaTitle, metaDesc, img) {
  return `
       <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:title" content="${metaTitle}"/>
    <meta property="og:description"        content="${metaDesc}" />
    <meta property="og:image"              content="${img}" />
    <title>SimplePTV</title>
    <link
      rel="shortcut icon"
      href="https://e3obb.sse.codesandbox.io/dna.png"
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
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="https://e3obb.sse.codesandbox.io">
          <img
            src="https://e3obb.sse.codesandbox.io/dna.png"
            width="40"
            height="28"
          />
        </a>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            Home
          </a>

          <a class="navbar-item">
            Documentation
          </a>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              More
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                About
              </a>
              <a class="navbar-item">
                Jobs
              </a>
              <a class="navbar-item">
                Contact
              </a>
              <hr class="navbar-divider" />
              <a class="navbar-item">
                Report an issue
              </a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Simple PTV
        </h1>
        <p class="subtitle">Un muy simple PTV solo por $50 MXN al mes</p>

       
            <div id="app">${reactDom}</div>
            <script src="./app.bundle.js"></script>
        
      </div>
    </section>

    <div class="modal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <!-- Any other Bulma elements you want -->
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
    <script src="https://e3obb.sse.codesandbox.io/script.js"></script>
  </body>
</html>

    `;
};
