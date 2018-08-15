import { Component, State } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  // shadow: false
})
export class AppHome {
  @State() username: string = 'david@thefrahms.com';
  @State() password: string;
  @State() someSelect: string;
  @State() someCheckbox: string[] = [];
  @State() loginResponse: string = "Ready...";

  handleChange(e: UIEvent, valueTarget: any) {
    console.log("handleChange()");

    console.log("element", e.target);
    console.log("element's tag name", (e.target as HTMLElement).tagName);

    console.log("BEFORE valueTarget", valueTarget);
    switch ((e.target as HTMLElement).tagName) {
      case "INPUT":
        console.log("input type", (e.target as HTMLInputElement).getAttribute('type'));
        if ((e.target as HTMLInputElement).getAttribute('type') === 'checkbox') {
          console.log("checkbox is checked?", (e.target as HTMLInputElement).checked);
          var index = valueTarget.indexOf((e.target as HTMLInputElement).value);
          if ((e.target as HTMLInputElement).checked) {
            if (index === -1) {
              valueTarget.push((e.target as HTMLInputElement).value);
            }
          } else {
            if (index > -1) {
              valueTarget.splice(index, 1);
            }
          }
        } else {
          valueTarget = (e.target as HTMLInputElement).value;
        }
        break;
      case "SELECT":
        valueTarget = (e.target as HTMLSelectElement).value;
        break;
    }
    console.log("AFTER valueTarget", valueTarget);
  }

  submitLogin(e: UIEvent) {
    console.info("submitLogin(e)", e);
    e.preventDefault();
    this.login();
  }

  login() {
    console.info("login()");
    var url = 'https://api.dev.testery.io/api/user';
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + Buffer.from(this.username + ":" + this.password).toString('base64'));
    fetch(url, {
      method: 'POST',
      headers: headers
    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        console.log('Success:', response);
        this.loginResponse = "DONE > token: " + response.token;
      });
  }

  /**
   * TODO: Need to try out some StencilJS 'ref' JSX magic, as suggested by Justin in Slack.
   * See docs for JSX: Getting a reference to a dom element
   */

  submitFromButton(e: UIEvent) {
    console.info("submitFromButton()");
    console.log("ion-button", (e.target as HTMLElement));
    console.log("shadowRoot", (e.target as HTMLElement).shadowRoot);
    console.log("button", (e.target as HTMLElement).shadowRoot.querySelector('button'));
    console.log("form", ((e.target as HTMLElement).closest('form') as HTMLFormElement));
    console.log("form validity", ((e.target as HTMLElement).closest('form') as HTMLFormElement).reportValidity());

    // console.log("form submit", ((e.target as HTMLElement).closest('form') as HTMLFormElement).submit());
  }

  submitFromFormOnSubmit(e: UIEvent) {
    console.info("submitFromFormOnSubmit()");
    console.log("ion-button", (e.target as HTMLElement));
    console.log("shadowRoot", (e.target as HTMLElement).shadowRoot);
    console.log("button", (e.target as HTMLElement).shadowRoot.querySelector('button'));
    console.log("form", ((e.target as HTMLElement).closest('form') as HTMLFormElement));
    console.log("form validity", ((e.target as HTMLElement).closest('form') as HTMLFormElement).reportValidity());
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content padding>
        <p>
          Ideally, a form would have one onSubmit() that would submit the form whether user:
          <br />* Presses ENTER key in an input field
          <br />* Clicks submit button
        </p>
        <p>
          Currently, to accomplish both things, you must:
          <br />* Implement form onSubmit() code, to submit via the ENTER key
          <br />* Implement ion-button onClick() code, to submit via user clicking a button
        </p>
        <form id="loginForm" onSubmit={(e: UIEvent) => this.submitFromFormOnSubmit(e)}>
          <div>
            <input name="Username" type="text" required={true} value={this.username} onChange={(e: UIEvent) => this.handleChange(e, this.username)} />
          </div>
          <div>
            <input name="Password" type="text" required={true} value={this.password} onChange={(e: UIEvent) => this.handleChange(e, this.password)} />
          </div>
          <div>
            <select name="SomeSelect" required={true} onChange={(e: UIEvent) => this.handleChange(e, this.someSelect)}>
              <option value="">Select...</option>
              <option value="select-1">One</option>
              <option value="select-2">Two</option>
              <option value="select-3">Three</option>
            </select>
          </div>
          <div>
            <label>Check 1
              <input name="SomeCheckbox" type="checkbox" value="check-1" onChange={(e: UIEvent) => this.handleChange(e, this.someCheckbox)} />
            </label>
            <label>Check 2
              <input name="SomeCheckbox" type="checkbox" value="check-2" onChange={(e: UIEvent) => this.handleChange(e, this.someCheckbox)}/>
            </label>
          </div>
          <br /><br />
          <div>
            <input type="submit" value="HTML Button (works)" />
            <br />
            <ion-button onClick={() => this.login()}>Ionic Button onClick (works)</ion-button>
            <br />
            <ion-button onClick={(e: UIEvent) => this.submitFromButton(e)}>Ionic Button onClick + js submit (works)</ion-button>
            <br/>
            <ion-button type="submit">Ionic Button type="submit" (does NOT work)</ion-button>
          </div>
        </form>
        <div>RESPONSE: {this.loginResponse}</div>

        <br />
        <br />
        <br />
        <ion-button href="/profile/ionic">Profile page</ion-button>
      </ion-content>
    ];
  }
}
