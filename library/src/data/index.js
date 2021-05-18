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
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.coordinates = {
        x: newCoordinates.x,
        y: newCoordinates.y,
      };

      this.stateManager.setState(newState);
    };

    createTable = function (newData) {
      var newState = clone(this.state);
      newState.push(newData);
      this.stateManager.setState(newState);
    };

    editName = function (tableId, name) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      if (name != null) {
        editTable.name = name;
      }

      this.stateManager.setState(newState);
    };

    editClass = function (tableId, className) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      if (className != null) {
        editTable.className = className;
      }

      this.stateManager.setState(newState);
    };

    editCondition = function (tableId, conditions) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      replaceInArray(editTable.columns.conditions, conditions);

      this.stateManager.setState(newState);
    };

    editDecision = function (tableId, decisions) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      replaceInArray(editTable.columns.decisions, decisions);

      this.stateManager.setState(newState);
    };

    editCell = function (tableId, cell) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      if (cell != null) {
        for (var i = 0; i < editTable.rows.length; i++) {
          if (editTable.rows[i].rowId == cell.rowId) {
            editTable.rows[i].conditions = cell.conditions;
            editTable.rows[i].decisions = cell.decisions;
          }
        }
      }

      this.stateManager.setState(newState);
    };

    addRow = function (tableId, newRow) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.rows.push(newRow);

      this.stateManager.setState(newState);
    };

    removeRow = function (tableId, rowId) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      if (editTable.rows != null) {
        for (var i = 0; i < editTable.rows.length; i++) {
          if (editTable.rows[i].id != rowId) continue;
          editTable.rows.splice(rowId, 1);
        }
      }

      this.stateManager.setState(newState);
    };

    addConditionColumn = function (tableId, column) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      if (column != null) {
        editTable.columns.conditions.push(column);
      }

      this.stateManager.setState(newState);
    };

    addDecisionColumn = function (tableId, column) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      if (column != null) {
        editTable.columns.decisions.push(column);
      }

      this.stateManager.setState(newState);
    };

    removeConditionColumn = function (tableId, column) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      removeColumnWithId(
        editTable.columns.conditions,
        editTable.rows,
        "conditions",
        column
      );

      this.stateManager.setState(newState);
    };

    removeDecisionColumn = function (tableId, column) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      removeColumnWithId(
        editTable.columns.decisions,
        editTable.rows,
        "decisions",
        column.decision
      );

      this.stateManager.setState(newState);
    };

    changeOrder = function (tableId) {}; //WIP

    addConnection = function (tableId, rowId, secondTableId) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].id == rowId) {
          editTable.rows[i].connections.push(secondTableId);
        }
      }

      this.stateManager.setState(newState);
    };

    removeConnection = function (tableId, rowId, secondTableId) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].id !== rowId) continue;
        for (var j = 0; j < editTable.rows[i].connections.length; j++) {
          if (editTable.rows[i].connections[j] !== secondTableId) connections;
          editTable.rows[i].connections.splice(j, 1);
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
          for (var j = 0; j < rows[i][type].length; j++) {
            if (rows[i][type][j][0] == id) {
              rows[i][type].splice(j, 1);
            }
          }
        }
      }
    };

    clone = function (toClone) {
      if (Array.isArray(toClone)) {
        var objectWithArray = clone({ array: toClone });
        return objectWithArray.array;
      }
      if (typeof toClone === "object" && toClone !== null) {
        var copyOfTables = {};
        for (var attr in toClone) {
          if (!toClone.hasOwnProperty(attr)) continue;
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
      } else {
        var copyOfTables = toClone;
      }

      return copyOfTables;
    };

    getTableWithId = function (table, tableId) {
      for (var i = 0; i < table.length; i++) {
        if (table[i].id != tableId) continue;
        return table[i];
      }
    };
  })(),
};
