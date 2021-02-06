export default class Wiring extends EventTarget {
  constructor() {
    super();
    this.connect();
    this.attempts = 0;
    this.connect = this.connect.bind(this);
  }

  connect() {
    this.socket = new WebSocket(`ws://${location.host}`);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onclose = this.reconnect.bind(this);
  }

  onOpen() {
    console.log("Connected");
    this.send({ type: "ping" })
  }

  send(message) {
    this.socket.send(JSON.stringify(message));
  }

  onMessage(event) {
    var data = event.data;
    if (typeof data == "string") data = JSON.parse(data);
    var { type } = data;
    console.log(type);
    var emitted = new CustomEvent(type, { detail: data });
    this.dispatchEvent(emitted);
  }

  reconnect() {
    console.log("WebSocket disconnected, trying to reconnect...");
    if (this.attempts++ > 10) return console.log("Too many reconnection attempts, giving up.");
    setTimeout(this.connect, 1000);
  }
}