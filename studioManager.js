var { EventEmitter } = require("events");

var guid = 0;

/* 
This class handles room state, and emits events when they're added, removed,
or updated. It's a pretty simple model.
*/
class StudioManager extends EventEmitter {
  constructor() {
    super();
    this.complex = [
      { name: "Living room", key: guid++, active: false },
      { name: "Office", key: guid++, active: true }
    ];
  }

  addRoom(name) {
    this.complex.push({ name, active: false, key: guid++ });
    this.emit("changed");
  }

  removeRoom(key) {
    this.complex = this.complex.filter(r => r.key != key);
    this.emit("changed");
  }

  updateRoom(key, active) {
    var room = this.complex.find(r => r.key == key);
    if (room) {
      room.active = active;
      this.emit("updated", room);
    }
  }

}

module.exports = StudioManager;