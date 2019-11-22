import React from "react";

export class Login extends React.Component {
  render() {
    return (
      <section class="section">
        <div class="container">
          <div class="columns">
            <div class="column">
              <section class="hero">
                <div class="hero-body">
                  <div class="container">
                    <div class="field">
                      <label for="nombre" id="labelName" class="label">
                        SimplePTV
                      </label>

                      <div class="control">
                        <input type="text" name="name" class="input" />
                      </div>
                    </div>

                    <div class="field">
                      <div class="control">
                        <button class="button is-primary" id="sendBtn">
                          Log In
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
