import { html, render, Component } from "https://unpkg.com/htm/preact/standalone.module.js";
import App from "./app.js";

var host = document.querySelector("main");
render(html`<${App} test=${true} />`, host);