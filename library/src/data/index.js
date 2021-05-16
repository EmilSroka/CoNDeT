window.CoNDeT.data = {
  State: (function () {
    function constructor() {
      this.state = [];
      this.subscribers = [];
    }

    constructor.prototype.subscribe = function (subscriber) {
      this.subscribers.push(subscriber);
      subscriber(this.state);
    };
    constructor.prototype.setState = function (state) {
      this.state = state;
      this.callSubscribers();
    };
    constructor.prototype.callSubscribers = function () {
      var self = this;
      this.subscribers.forEach(function (cb) {
        cb(self.state);
      });
    };
    return constructor;
  })(),

  FileReaderWriter: {
    readFromFile: function (cb) {
      var element = document.createElement("input");
      element.setAttribute("type", "file");
      element.setAttribute("accept", ".json");
      element.addEventListener("change", function (event) {
        var file = event.target.files[0];
        var fileReader = new FileReader();

        fileReader.onload = function (e) {
          cb(JSON.parse(e.target.result));
          element.remove();
        };
        fileReader.readAsText(file);
      });
      element.click();
    },

    saveToFile: function (data) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
          encodeURIComponent(JSON.stringify(data))
      );
      element.setAttribute("download", "CoNDeT.json");

      element.style.display = "none";
      document.body.appendChild(element); //Required on firefox

      element.click();

      element.remove();
    },
  },

  StateModifier: (function () {
    constructor = function (state) {
      this.stateManager = state;
      var self = this;
      state.subscribe(function (newState) {
        self.state = newState;
      });
    };

    moveTable = function (tableId, newCoordinates) {
      var newState = copyTables(this.state);
      this.state[tableId].coordinates = {
        x: newCoordinates.x,
        y: newCoordinates.y,
      };

      this.stateManager.setState(newState);
    };

    createTable = function (newData) {
      // newData = {name, className, coordinates, columns, rows}
      var newState = copyTables(this.state);
      newState.push(newData);
      this.stateManager.setState(newState);
    };

    editContent = function (tableId, cell, header, name, className) {
      // cell = [{rowId, conditions: [cId, newCon], decisions: [dId, newDec]}, ...]
      // header = {conditions: [...], decisions: [...]}, name, className

      var newState = copyTables(this.state);
      var editTable = newState[tableId];

      if (name != null) {
        editTable.name = name;
      }

      if (className != null) {
        editTable.className = className;
      }

      replaceInArray(editTable.columns.conditions, header.conditions);
      replaceInArray(editTable.columns.decisions, header.decisions);

      if (cell != null) {
        for (var i = 0, j = 0; i < editTable.rows.length; i++) {
          if (editTable.rows[i].rowId == header.cell[j].rowId) {
            editTable.rows[i].conditions = header.cell[j].conditions;
            editTable.rows[i].decisions = header.cell[j].decisions;
            j += 1;
          }
        }
      }

      this.stateManager.setState(newState);
    };

    addRow = function (tableId, newRow) {
      // row = {id, conditions, decisions, connections?}
      var newState = copyTables(this.state);
      newState[tableId].rows.push(newRow);

      this.stateManager.setState(newState);
    };

    removeRow = function (tableId, rowId) {
      // row = {id, conditions, decisions, connections}
      var newState = copyTables(this.state);
      if (
        newState[tableId].rows != null &&
        rowId <= newState[tableId].rows.length
      ) {
        newState[tableId].rows.splice(rowId, 1);
      }

      this.stateManager.setState(newState);
    };

    addColumn = function (tableId, column) {
      // column = {condition: "..." albo null, decision: "..." albo null}
      var newState = copyTables(this.state);
      var editTable = newState[tableId];

      if (column.condition != null) {
        editTable.columns.conditions.push(column.condition);
      }
      if (column.decision != null) {
        editTable.columns.decisions.push(column.decision);
      }

      this.stateManager.setState(newState);
    };

    removeColumn = function (tableId, column) {
      // column = {condition: idCon, decision: idDec}
      var newState = copyTables(this.state);
      var editTable = newState[tableId];

      removeColumnWithId(
        editTable.columns.conditions,
        editTable.rows,
        "conditions",
        column.condition
      );
      removeColumnWithId(
        editTable.columns.decisions,
        editTable.rows,
        "decisions",
        column.decision
      );

      this.stateManager.setState(newState);
    };

    changeOrder = function (tableId) {};

    addConnection = function (tableId, rowId, secondTableId) {
      var newState = copyTables(this.state);
      var editTable = newState[tableId];

      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].id == rowId) {
          editTable.rows[i].connections.push(secondTableId);
        }
      }

      this.stateManager.setState(newState);
    };

    removeConnection = function (tableId, rowId, secondTableId) {
      var newState = copyTables(this.state);
      var editTable = newState[tableId];

      for (var i = 0; i < editTable.rows.length; i++) {
        for (var j = 0; j < editTable.rows[i].connections.length; j++) {
          if (
            editTable.rows[i].id == rowId &&
            editTable.rows[i].connections[j] == secondTableId
          ) {
            editTable.rows[i].connections.splice(j, 1);
          }
        }
      }

      this.stateManager.setState(newState);
    };

    replaceInArray = function (toReplace, newValues) {
      if (newValues != []) {
        for (var i = 0; i < newValues.length; i++) {
          toReplace[i] = newValues[i];
        }
      }
    };

    removeColumnWithId = function (columns, rows, type, id) {
      if (id != null && id <= columns.length) {
        columns.splice(id, 1);
        for (var i = 0; i < rows.length; i++) {
          if (type == "conditions") {
            for (var j = 0; j < rows[i].conditions.length; j++) {
              if (rows[i].conditions[j][0] == id) {
                rows[i].conditions.splice(j, 1);
              }
            }
          } else if (type == "decisions") {
            for (var j = 0; j < rows[i].decisions.length; j++) {
              if (rows[i].decisions[j][0] == id) {
                rows[i].decisions.splice(j, 1);
              }
            }
          }
        }
      }
    };

    clone = function (toClone) {
      if (typeof toClone === "object") {
        var copyOfTables = {};
        for (var attr in toClone) {
          if (toClone.hasOwnProperty(attr)) {
            if (Array.isArray(toClone[attr])) {
              copyOfTables[attr] = [];
              for (var j = 0; j < toClone[attr].length; j++) {
                copyOfTables[attr][j] = clone(toClone[attr][j]);
              }
            } else if (typeof toClone[attr] === "object") {
              copyOfTables[attr] = {};
              for (var key in toClone[attr]) {
                if (toClone[attr].hasOwnProperty(key)) {
                  copyOfTables[attr][key] = clone(toClone[attr][key]);
                }
              }
            } else {
              copyOfTables[attr] = toClone[attr];
            }
          }
        }
      } else {
        copyOfTables = toClone;
      }

      return copyOfTables;
    };

    copyTables = function (tables) {
      var copyOfTables = [];

      for (var i = 0; i < tables.length; i++) {
        copyOfTables.push(clone(tables[i]));
      }

      return copyOfTables;
    };
  })(),
};
