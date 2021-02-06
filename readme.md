# On Air

## Simple status displays for pandemic working

Figuring out whether someone was on a live mic with an audience used to be a problem that only radio and TV professionals regularly faced. In COVID times, when many of us have multiple adults working from a single home, many more of us are on the horns of this dilemma. On Air is a simple status display designed to let a household easily mark rooms as "live," and instantly update everyone else, so that you'll know when to burst in and when to send a discrete text instead.

## Architecture

The back-end server for the application is a simple Node app with few dependencies. It serves static files for the front-end code, but most of its functionality is actually built around WebSocket connections. An in-memory model of the "studio complex" keeps a list of rooms and their status, which is transmitted to any connected clients whenever there's a change.

On the client side, the UI is built in Preact. It's a straightforward component, with a wrapper class for the WebSocket connection to handle reconnection and message serialization. Adding, removing, and activating rooms sends the respective commands to the server, which updates its model and then sends a copy back for updating the display state.

## Technical choices and to-dos

### Server

I built the server with the `ws` module from NPM, but otherwise it's pretty much just using the built-in HTTP module from the core. Express felt like overkill for an app that only really serves static files, but in anything more than a toy application I probably would have started with that (see [Dailygraphics Next](https://github.com/nprapps/dailygraphics-next/) for a reasonably complex Express app I currently maintain).

After starting the HTTP server, the application adds the WebSocket handling on top. I wrapped the connection in a small class that lets me subscribe to specific messages as events instead of handing them in a monolithic switch statement. Commands from a client fire message event handlers to call the relevant methods on the StudioManager class, which in turn notifies the app that it has updates for broadcast to clients.

The server isn't bothering with HTTPS, as it sits behind an nginx proxy on the actual AWS instance, which could handle that if need be (that's what I do for my personal apps). It's run as a systemd service to take advantage of automatic restarts and potentially make it available after a server reboot without user intervention.

Since the stored rooms and their state are only kept in memory, if the server kicks over you'll lose any extra config. I thought about setting this up to run with a SQLite database as a simple store, but I'm on Windows and didn't want to hit any snags with deployment of native modules on the EC2 box in the time required.

### Client

For personal apps (like [my podcast listening app](https://github.com/thomaswilburn/radio-v2/)), I often build the UI using vanilla JS, organized into components via custom elements, but for this project I'm not trying to weird anyone out, so it's using Preact instead. Instead of setting up a whole WebPack/JSX compilation pipeline, I just used the standalone ES module and the [htm](https://github.com/developit/htm) templating library). I've really grown to love the simplicity of standing up a quick project using `import` and ES modules. In production, however, I would almost certainly [have a real compilation step](https://github.com/nprapps/elections20-interactive/blob/master/tasks/bundle.js), for live reload and asset bundling if nothing else.

For managing the state of the rooms, I'm treating the server as gospel--after pressing a button or altering the list, we don't update the actual display until we get a new `studio-update` message. It's nice to make sure that we don't have to worry about getting out of sync. But for polish, I'd want to have error handling, and it would be good to have intermediate states for the buttons between when they're touched in the UI and when the server reflects that change back (a "flicker" like a flourescent light would be a fun option).

I don't want to act like this is an accessibility miracle, but there are a couple of things I would note. First, the buttons are read by screen readers as toggle buttons due to the `aria-pressed` attribute, and this is also what triggers the change in visual appearance. Using ARIA as a hook for CSS styling is a technique I like to use as appropriate, since it explicitly makes the accessible state of a control linked to its visual styles. Second, the labels are linked to the toggle buttons but are themselves marked as `aria-hidden` to prevent repetition.