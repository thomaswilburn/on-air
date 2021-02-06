import { html, render, Component } from "https://unpkg.com/htm/preact/standalone.module.js";
import App from "./app.js";

// boot up the application
var host = document.querySelector("main");
render(html`<${App} test=${true} />`, host);