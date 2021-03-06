import { html, render, Component } from 'https://unpkg.com/htm/preact/index.mjs?module'
import Wiring from "./wiring.js";

// hook up to the UI for adding a studio
// listen to the wiring for update events
// map to the elements accordingly

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      rooms: [],
      addName: ""
    };

    // bind methods
    [
      "onStudioUpdate",
      "addRoom"
    ].forEach(f => this[f] = this[f].bind(this));

    this.connection = new Wiring();
    this.connection.addEventListener("studio-update", this.onStudioUpdate);
    setInterval(() => this.connection.send({ type: "keepalive" }), 30 * 1000);
  }

  // called when the server notifies us with fresh state
  onStudioUpdate({ detail }) {
    var { rooms } = detail;
    this.setState({ rooms });
  }

  // toggle a sign off and on
  onClickStudio(key, active) {
    this.connection.send({ "type": "studio-toggle", key, active });
  }

  addRoom() {
    var name = this.state.addName;
    this.connection.send({ "type": "studio-add", name });
  }

  removeRoom(key) {
    this.connection.send({ "type": "studio-remove", key });
  }

  render(props, state) {
    return html`
      <div class="ui">
        <div class="add-bar">
          <input placeholder="Room name" value=${state.addName} onInput=${e => this.setState({ addName: e.target.value })} />
          <button class="add-room" onClick=${this.addRoom}>Add room</button>
        </div>
        <ul class="rooms">
          ${state.rooms.map(r => html`
          <li key=${r.key}>
            <button
              class="studio-light"
              aria-labelledby="${"label-" + r.key}"
              aria-pressed="${r.active}"
              onClick=${() => this.onClickStudio(r.key, !r.active)}>
              on air
            </button>
            <div class="label-ui">
              <label id="${"label-" + r.key}" aria-hidden="true">
                ${r.name}
              </label>
              <button
                class="remove-room"
                aria-label="remove"
                onClick=${() => this.removeRoom(r.key)}
              >
                <svg width="8" height="8">
                  <path d="M0,0 L8,8 M0,8 L8,0" stroke="currentColor" fill="none" />
                </svg>
              </button>
            </div>
          </li>
          `)}
        </ul>
      </div>
    `
  }
}