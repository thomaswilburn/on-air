import Wiring from "./wiring.js";

var connection = new Wiring();
connection.addEventListener("ping", e => console.log(e.detail));