window.CoNDeT = function (configs) {
  var selector = configs.selector || ".condet-display";
  var modeName = configs.entryMode || "display";
  var icons = configs.icons || {};

  var state = new window.CoNDeT.data.State();
  var display = new window.CoNDeT.ui.DisplayComponent();
  var common = {
    stateModifier: new window.CoNDeT.data.StateModifier(state),
    mode: getMode(modeName),
    setMode: setMode,
    icons: window.CoNDeT.core.getIcons(icons),
  };
  common.addTable = window.CoNDeT.core.addTable(common);

  display.init(common, selector, { selector: selector, state: state.state });

  state.subscribe(function (newState) {
    display.update({
      selector: selector,
      state: newState,
    });
  });

  return {
    setState: function (newState) {
      state.setState(newState);
    },
    readFromFile: function () {
      window.CoNDeT.data.FileReaderWriter.readFromFile(function (newState) {
        state.setState(newState);
      });
    },
    saveToFile: function () {
      window.CoNDeT.data.FileReaderWriter.saveToFile(state.state);
    },
    changeMode: setMode,
    addTable: window.CoNDeT.core.addTable(common),
  };

  function getMode(modeName) {
    if (modeName === "edit") {
      return new window.CoNDeT.ui.EditModeConstructor();
    }

    if (modeName === "display") {
      return new window.CoNDeT.ui.DisplayModeConstructor();
    }

    if (modeName === "add connection") {
      return new window.CoNDeT.ui.AddConnectionModeConstructor();
    }

    return new window.CoNDeT.ui.Mode({});
  }

  function setMode (modeName) {
    common.mode = getMode(modeName);
    common.mode.setToAllComponents(display);
  }
};

window.CoNDeT.ui = {};
window.CoNDeT.core = {};
window.CoNDeT.core.toTableProps = function (tablesJSON, deltaXY) {
  var tablesList = [];
  for (var i = 0; i < tablesJSON.length; i++) {
    var tableProps = tablesJSON[i];
    var rowsPrepared = [];
    for (var j = 0; j < tableProps.rows.length; j++) {
      var row = tableProps.rows[j];
      var content = [];
      for (var k = 0; k < tableProps.columns.conditions.length; k++) {
        content.push(["", "conditions", k, tableProps.columns.conditions[k]]);
      }
      for (var k = 0; k < tableProps.columns.decisions.length; k++) {
        content.push(["", "decisions", k, tableProps.columns.decisions[k]]);
      }
      for (var k = 0; k < row.conditions.length; k++) {
        content[row.conditions[k][0]][0] = tableProps.rows[j].conditions[k][1];
      }
      for (var k = 0; k < row.decisions.length; k++) {
        content[row.decisions[k][0] + tableProps.columns.conditions.length][0] =
          row.decisions[k][1];
      }
      rowsPrepared.push({ content: content, id: row.row_id });
    }
    tablesList.push({
      id: tableProps.id,
      name: tableProps.name,
      class: tableProps.class,
      coordinates: {
        x: tableProps.coordinates.x + deltaXY.x,
        y: tableProps.coordinates.y + deltaXY.y,
      },
      conditions: tableProps.columns.conditions,
      decisions: tableProps.columns.decisions,
      rows: rowsPrepared,
    });
  }

  return tablesList;
};

window.CoNDeT.core.toConnectionsProps = function (display, tablesJSON) {
  var connections = [];
  for (var i = 0; i < tablesJSON.length; i++) {
    var table = tablesJSON[i];
    for (var j = 0; j < table.rows.length; j++) {
      var row = table.rows[j];
      for (var k = 0; k < row.connections.length; k++) {
        var fromTableId = table.id;
        var fromTable = display.findChild(
          window.CoNDeT.ui.TableComponent,
          fromTableId
        );
        if (fromTable == null) continue;
        var starPoint = fromTable.getRowXY(j);

        var toTableId = row.connections[k];
        var toTable = display.findChild(
          window.CoNDeT.ui.TableComponent,
          toTableId
        );
        if (toTable == null) continue;
        var endPoint = toTable.entryPoint();

        connections.push({
          id: table.id + "-" + row.row_id + "_" + toTableId,
          path: window.CoNDeT.core.getLinePoints(starPoint, endPoint),
          delete: (function () {
            var id1 = fromTableId;
            var r = row;
            var id2 = toTableId;
            return function () {
              display.common.stateModifier.removeConnection(id1, r.row_id, id2);
            }
          })()
        });
      }
    }
  }
  return connections;
};

window.CoNDeT.core.getLinePoints = function (startPoint, endPoint) {
  return [
    { x: startPoint.x, y: startPoint.y },
    { x: startPoint.x + 20, y: startPoint.y },
    { x: startPoint.x + 20, y: endPoint.y - 20 },
    { x: endPoint.x, y: endPoint.y - 20 },
    { x: endPoint.x, y: endPoint.y },
  ];
};

window.CoNDeT.core.equals = function (value1, value2) {
  if (typeof value1 !== "object" || typeof value2 !== "object")
    return value1 === value2;

  var checkedKeys = [];

  for (var key in value1) {
    var logicalSumOfOwnProps =
      Number(value1.hasOwnProperty(key)) + Number(value2.hasOwnProperty(key));
    if (logicalSumOfOwnProps === 0) continue;
    if (logicalSumOfOwnProps === 1) return false;
    if (!window.CoNDeT.core.equals(value1[key], value2[key])) return false;

    checkedKeys.push(key);
  }

  for (var key in value2) {
    if (checkedKeys.indexOf(key) != -1) continue;
    var logicalSumOfOwnProps =
      Number(value1.hasOwnProperty(key)) + Number(value2.hasOwnProperty(key));
    if (logicalSumOfOwnProps === 0) continue;
    if (logicalSumOfOwnProps === 1) return false;
    if (!window.CoNDeT.core.equals(value1[key], value2[key])) return false;
  }

  return true;
};

window.CoNDeT.core.clone = function (toClone) {
  if (typeof toClone !== "object" || toClone === null) return toClone;
  var result = Array.isArray(toClone) ? [] : {};
  for (var attr in toClone) {
    if (!toClone.hasOwnProperty(attr)) continue;
    result[attr] = window.CoNDeT.core.clone(toClone[attr]);
  }
  return result;
};

window.CoNDeT.core.copy = function (toClone) {
  if (typeof toClone !== "object" || toClone === null) return toClone;
  var result = Array.isArray(toClone) ? [] : {};
  for (var attr in toClone) {
    if (!toClone.hasOwnProperty(attr)) continue;
    result[attr] = toClone[attr];
  }
  return result;
};

window.CoNDeT.core.addTable = function (common) {
  var retAddTable = function (coordinates = { x: 0, y: 0 }) {
    if (common.mode === window.CoNDeT.ui.DisplayMode) return;

    var tableObj = {};
    var rowTab = [];
    var id = prompt("Enter Table ID:");
    if (id == null) return;
    var name = prompt("Enter Table Name:");
    if (name ==  null) return;
    var classType = prompt("Enter Table Class:");
    if (classType == null) return;

    for (var i = 0; i < 3; i++) {
      rowTab.push({
        conditions: [],
        decisions: [],
        connections: [],
        row_id: id + "_row_" + i,
      });
    }

    tableObj.id = id;
    tableObj.name = name;
    tableObj.class = classType;
    tableObj.coordinates = {};
    tableObj.coordinates = coordinates;
    tableObj.columns = {};
    tableObj.columns.conditions = ["defaultCon1", "defaultCon2"];
    tableObj.columns.decisions = ["defaultDet1", "defaultDet2"];
    tableObj.rows = rowTab;

    common.stateModifier.createTable(tableObj);
  };

  return retAddTable;
};

window.CoNDeT.core.getIcons = function (custom) {
  return {
    delete: custom.delete || "❌",
    add: custom.add || "➕",
  }
};

window.CoNDeT.core.getUniqueId = (function () {
  var i = 0;
  return function () {
    i++;
    return "CoNDeT-id-" + (Math.random() * 1000000000000000 >>> 0) + "-" + i;
  }
})();

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
    var constructor = function (state) {
      this.stateManager = state;
      var self = this;
      state.subscribe(function (newState) {
        self.state = newState;
      });
    };

    constructor.prototype.moveTable = function (tableId, newCoordinates) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.coordinates = {
        x: newCoordinates.x,
        y: newCoordinates.y,
      };

      this.stateManager.setState(newState);
    };

    constructor.prototype.createTable = function (newData) {
      var newState = window.CoNDeT.core.clone(this.state);
      newState.push(newData);
      this.stateManager.setState(newState);
    };

    constructor.prototype.removeTable = function (tableId) {
      var newState = window.CoNDeT.core.clone(this.state);
      for (var i = 0; i < newState.length; i++) {
        if (tableId === newState[i].id) {
          newState.splice(i, 1);
        }
      }
      this.stateManager.setState(newState);
    };

    constructor.prototype.editId = function (tableId, id) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      var previousId = editTable.id;

      editTable.id = id;

      for (var i = 0; i<newState.length; i++) {
        var table = newState[i];
        for (var j = 0; j<table.rows.length; j++) {
          var row = table.rows[j];
          for (var k = 0; k<row.connections.length; k++) {
            if (row.connections[k] === previousId) {
              row.connections[k] = id;
            }
          }
        }
      }

      this.stateManager.setState(newState);
    };

    constructor.prototype.editName = function (tableId, name) {
      this.editProp(tableId, "name", name);
    };

    constructor.prototype.editClass = function (tableId, className) {
      this.editProp(tableId, "class", className);
    };

    constructor.prototype.editProp = function (tableId, prop, value) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable[prop] = value;
      this.stateManager.setState(newState);
    };

    constructor.prototype.editCondition = function (tableId, idx, value) {
      this.editHeader(tableId, "conditions", idx, value);
    };

    constructor.prototype.editDecision = function (tableId, idx, value) {
      this.editHeader(tableId, "decisions", idx, value);
    };

    constructor.prototype.editHeader = function (tableId, type, idx, value) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.columns[type][idx] = value;
      this.stateManager.setState(newState);
    };

    constructor.prototype.editCell = function (
      tableId,
      rowId,
      type,
      index,
      value
    ) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].row_id !== rowId) continue;
        for (var j = 0; j < editTable.rows[i][type].length; j++) {
          if (editTable.rows[i][type][j][0] !== index) continue;
          editTable.rows[i][type].splice(j, 1);
        }
        editTable.rows[i][type].push([index, value]);
      }
      this.stateManager.setState(newState);
    };

    constructor.prototype.addEmptyRow = function (tableId) {
      var row = {
        row_id: window.CoNDeT.core.getUniqueId(),
        conditions: [],
        decisions: [],
        connections: [],
      }
      this.addRow(tableId, row);
    }

    constructor.prototype.addRow = function (tableId, newRow) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.rows.push(newRow);

      this.stateManager.setState(newState);
    };

    constructor.prototype.removeRow = function (tableId, rowId) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].row_id !== rowId) continue;
        editTable.rows.splice(i, 1);
      }
      this.stateManager.setState(newState);
    };

    constructor.prototype.addConditionColumn = function (tableId, column) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.columns.conditions.push(column);
      this.stateManager.setState(newState);
    };

    constructor.prototype.addDecisionColumn = function (tableId, column) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.columns.decisions.push(column);
      this.stateManager.setState(newState);
    };

    constructor.prototype.removeConditionColumn = function (tableId, column) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      removeColumnWithId(
        editTable.columns.conditions,
        editTable.rows,
        "conditions",
        column
      );

      this.stateManager.setState(newState);
    };

    constructor.prototype.removeDecisionColumn = function (tableId, column) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      removeColumnWithId(
        editTable.columns.decisions,
        editTable.rows,
        "decisions",
        column
      );

      this.stateManager.setState(newState);
    };

    constructor.prototype.addConnection = function (
      tableId,
      rowId,
      secondTableId
    ) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].row_id === rowId) {
          editTable.rows[i].connections.push(secondTableId);
        }
      }
      this.stateManager.setState(newState);
    };

    constructor.prototype.removeConnection = function (
      tableId,
      rowId,
      secondTableId
    ) {
      var newState = window.CoNDeT.core.clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].row_id !== rowId) continue;
        for (var j = 0; j < editTable.rows[i].connections.length; j++) {
          if (editTable.rows[i].connections[j] !== secondTableId) continue;
          editTable.rows[i].connections.splice(j, 1);
        }
      }
      this.stateManager.setState(newState);
    };

    function removeColumnWithId(columns, rows, type, id) {
      if (id != null && id <= columns.length) {
        columns.splice(id, 1);
        for (var i = 0; i < rows.length; i++) {
          for (var j = 0; j < rows[i][type].length; j++) {
            if (rows[i][type][j][0] > id) {
              rows[i][type][j][0] -= 1;
            } else if (rows[i][type][j][0] === id) {
              rows[i][type].splice(j, 1);
            }
          }
        }
      }
    }

    function getTableWithId(table, tableId) {
      for (var i = 0; i < table.length; i++) {
        if (table[i].id !== tableId) continue;
        return table[i];
      }
    }

    return constructor;
  })(),
};
window.CoNDeT.ui.BaseComponent = {
  init: function (common, id, props) {
    this.id = id;
    this.state = {};
    this.children = [];
    this.common = common;
    this.props = props;
    this.ref = this.createRef();
    this.setStrategy(common.mode.getEntryStrategy(this));
    this.onInit();
    this.render();
    this.setupEventListeners();
  },
  createRef: function () { throw new Error("Component must implement createRef method"); },
  getChildren: function () { return this.strategy.getChildren(); },
  onInit: function () {},
  update: function (props) {
    if (window.CoNDeT.core.equals(this.props, props)) return;

    this.props = props;
    this.render();
  },
  onUpdate: function () {},
  destroy: function () {
    this.destroyChildren();
    this.ref.remove();
    this.onDestroy();
  },
  onDestroy: function () {},
  render: function () {
    this.updateChildren(this.getChildren());
    this.onUpdate();
  },
  setState: function (updated) {
    var newState = {};
    for (var prop in this.state) {
      newState[prop] = this.state[prop];
    }
    for (var prop in updated) {
      newState[prop] = updated[prop];
    }
    this.state = newState;
    this.render();
  },
  updateChildren: function (newChildren) {
    this.unmark(this.children);
    this.unmark(newChildren);
    this.markCorrespondedChildren(newChildren);
    this.deleteUnmarkedChildren();
    this.setInSameOrder(newChildren);
    this.initNewChildren(newChildren);
    this.updateChildrenProps(newChildren);
  },
  unmark: function (array) {
    for (var i=0; i<array.length; i++) {
      array[i].marked = false;
    }
  },
  markCorrespondedChildren: function (array) {
    for (var i=0; i<array.length; i++) {
      var current = array[i];
      var child = this.findChild(current.type, current.id);
      if (child == null) continue;
      child.marked = true;
      current.marked = true;
    }
  },
  deleteUnmarkedChildren: function () {
    var childrenCopy = window.CoNDeT.core.copy(this.children);

    for (var i=0; i<childrenCopy.length; i++) {
      if (!childrenCopy[i].marked) {
        this.removeChild(childrenCopy[i]);
      }
    }
  },
  setInSameOrder: function (newChildren) {
    for (var childIdx=0, newChildIdx=0; newChildIdx<newChildren.length; newChildIdx++) {
      var currentNewChild = newChildren[newChildIdx];

      var correspondedIdx = this.findIndexOfChild(currentNewChild.type, currentNewChild.id);

      if (correspondedIdx === childIdx) {
        var component = this.children[correspondedIdx];
        var node = this.ref.removeChild(component.ref);
        this.children.splice(correspondedIdx, 1);

        if (childIdx === this.children.length) {
          this.ref.appendChild(node);
        } else {
          this.ref.insertBefore(node, this.children[childIdx].ref);
        }
        this.children.splice(childIdx, 0, component);
      }
      childIdx++;
    }
  },
  updateChildrenProps: function (newChildren) {
    for (var i=0; i<newChildren.length; i++) {
      var corresponded = this.findChild(newChildren[i].type, newChildren[i].id);
      if (corresponded == null) continue;
      corresponded.update(newChildren[i].props);
    }
  },
  initNewChildren: function (newChildren) {
    for (var i=0; i<newChildren.length; i++) {
      var corresponded = this.findChild(newChildren[i].type, newChildren[i].id);
      if (corresponded != null) continue;
      this.createChild(newChildren[i].type, newChildren[i].props, newChildren[i].id, i);
    }
  },
  findChild: function (type, id) {
    if (this.children == null) return;

    var idx = this.findIndexOfChild(type, id);
    if (idx == null) return;
    return this.children[idx];
  },
  findIndexOfChild: function (type, id) {
    if (this.children == null) return;

    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].typeId === type.prototype.typeId && this.children[i].id === id)
        return i;
    }
  },
  destroyChildren: function () {
    if (this.children == null) return;

    for (var i = 0; i < this.children.length; i++) {
      this.children[i].destroy(this.common);
    }
  },
  getPosition: function () {
    return {
      x: this.ref.offsetLeft,
      y: this.ref.offsetTop,
    };
  },
  getDimensions: function () {
    return {
      width: this.ref.clientWidth,
      height: this.ref.clientHeight,
    };
  },
  setStrategy: function (strategy) {
    if (this.strategy != null) this.strategy.onDestroy();
    this.strategy = strategy;
    this.strategy.onInit(this);
    this.render();
  },
  setupEventListeners: function () {
    var self = this;

    this.ref.addEventListener("keyup", function (event) {
      self.strategy.onKeyUp(event);
    });
    this.ref.addEventListener("keydown", function (event) {
      self.strategy.onKeyDown(event);
    });
    this.ref.addEventListener("mouseup", function (event) {
      self.strategy.onMouseUp(event);
    });
    this.ref.addEventListener("mousedown", function (event) {
      self.strategy.onMouseDown(event);
    });
    this.ref.addEventListener("mousemove", function (event) {
      self.strategy.onMouseMove(event);
    });
    this.ref.addEventListener("mouseleave", function (event) {
      self.strategy.onMouseLeave(event);
    });
    this.ref.addEventListener("mouseenter", function (event) {
      self.strategy.onMouseEnter(event);
    });
    this.ref.addEventListener("dblclick", function (event) {
      self.strategy.onDbClick(event);
    });
  },
  appendChild: function (child, position = 0) {
    if (this.children == null || position > this.children.length) return;
    if (position === this.children.length) {
      this.ref.appendChild(child.ref);
    } else {
      this.ref.insertBefore(child.ref, this.children[position].ref);
    }
    this.children.splice(position, 0, child);
  },
  createChild: function (ComponentRef, props, id, position = 0) {
    var child = new ComponentRef();
    child.init(this.common, id, props);
    this.appendChild(child, position);
  },
  removeChild: function (component) {
    if (this.children == null) return;
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === component) {
        this.children[i].destroy();
        this.children.splice(i, 1);
      }
    }
  },
};
window.CoNDeT.ui.StrategyCommon = {
  onDestroy: function () {},
  onInit: function (component) { this.component = component },
  getChildren: function () { return []; },
  onDbClick: function () {},
  onKeyUp: function () {},
  onKeyDown: function () {},
  onMouseUp: function () {},
  onMouseDown: function () {},
  onMouseMove: function () {},
  onMouseLeave: function () {},
  onMouseEnter: function () {},
}

window.CoNDeT.ui.BaseStrategy = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.ConnectionsComponent = (function () {
  var constructor = function () {};

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "ConnectionsComponent";

  constructor.prototype.createRef = function () {
    return document.createElementNS("http://www.w3.org/2000/svg", "svg");
  }
  constructor.prototype.getChildren = function () {
    var children = [];
    var connections = this.props.getConnections();
    for (var i = 0; i<connections.length; i++) {
      children.push({ type: window.CoNDeT.ui.ConnectionComponent, id: connections[i].id, props: { path: connections[i].path, delete: connections[i].delete } });
    }
    return children;
  }
  constructor.prototype.onUpdate = function () {
    this.ref.setAttribute(
        "viewBox",
        "0 0 " + this.props.width + " " + this.props.height
    );
  }

  return constructor;
})();window.CoNDeT.ui.ConnectionComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "ConnectionComponent";

  constructor.prototype.createRef = function () {
    return document.createElementNS("http://www.w3.org/2000/svg", "g");
  }
  constructor.prototype.getChildren = function () {
    var lastPointIdx = this.props.path.length - 1;
    return [
      { type: window.CoNDeT.ui.LineComponent, id: "line", props: this.props },
      { type: window.CoNDeT.ui.ArrowComponent, id: "arrow",
        props: { x: this.props.path[lastPointIdx].x, y: this.props.path[lastPointIdx].y } }
    ];
  }

  return constructor;
})();window.CoNDeT.ui.ConnectionDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.ConnectionEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onMouseDown = function (event) {
    if (!event.ctrlKey) return;

    this.component.props.delete();
  }

  return constructor;
})();
window.CoNDeT.ui.ArrowComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "ArrowComponent";

  constructor.prototype.createRef = function () {
    return document.createElementNS("http://www.w3.org/2000/svg", "path");
  }
  constructor.prototype.onUpdate = function () {
    this.ref.setAttribute("d", calcPath(this.props.x, this.props.y));
  }

  return constructor;

  function calcPath (x, y) {
    return "M " + x + " " + y + "L " + (x - 5) + " " + (y - 5) + "L " + (x + 5) + " " + (y - 5) + " Z";
  }
})();
window.CoNDeT.ui.LineComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "LineComponent";

  constructor.prototype.createRef = function () {
    return document.createElementNS("http://www.w3.org/2000/svg", "path");
  }
  constructor.prototype.onUpdate = function () {
    this.ref.setAttribute("d", calcPath(this.props.path));
  }

  return constructor;

  function calcPath (path) {
    var d = "M " + path[0].x + " " + path[0].y;
    for (var i = 1; i < path.length; i++) {
      d += "L " + path[i].x + " " + path[i].y;
    }
    return d;
  }
})();window.CoNDeT.ui.DisplayAddConnectionMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.updateXY = function (event) {
    if (this.currentDelta == null) return;
    this.component.setState({
      deltaXY: {
        x: this.startPosition.x + event.clientX - this.currentDelta.x,
        y: this.startPosition.y + event.clientY - this.currentDelta.y,
      },
    });
  };
  constructor.prototype.onMouseDown = function (event) {
    this.currentDelta = { x: event.clientX, y: event.clientY };
    this.startPosition = {
      x: this.component.state.deltaXY.x,
      y: this.component.state.deltaXY.y,
    };
    this.component.ref.style.cursor = "grabbing";
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.currentDelta = null;
    this.startPosition = null;
    this.component.ref.style.cursor = "grab";
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.resetState();
  };

  constructor.prototype.onInit = function (display) {
    this.component = display;
    this.resetState();
  };
  constructor.prototype.onDestroy = function () {
    this.component.ref.style.cursor = "auto";
  }

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;
    this.component.ref.style.cursor = "grab";
  };

  constructor.prototype.getChildren = function () {
    var children = [];

    var tablesProps = window.CoNDeT.core.toTableProps(this.component.props.state, this.component.state.deltaXY);
    for (var i = 0; i < this.component.props.state.length; i++) {
      tablesProps[i].moveTable = function (id, x, y) {
        self.component.common.stateModifier.moveTable(id, { x: x - self.component.state.deltaXY.x, y: y - self.component.state.deltaXY.y})
      }
      children.push({ type: window.CoNDeT.ui.TableComponent, id: tablesProps[i].id, props: tablesProps[i] });
    }

    return children;
  }

  return constructor;
})();
window.CoNDeT.ui.DisplayComponent = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "DisplayComponent";

  constructor.prototype.createRef = function () {
    return document.querySelector(this.props.selector);
  }
  constructor.prototype.onInit = function () {
    this.setState({ deltaXY: { x: 0, y: 0 } });
    this.ref.style.position = "relative";
    this.ref.style.overflow = "hidden";
  }

  return constructor;
})();
window.CoNDeT.ui.DisplayDisplayMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.updateXY = function (event) {
    if (this.currentDelta == null) return;
    this.component.setState({
      deltaXY: {
        x: this.startPosition.x + event.clientX - this.currentDelta.x,
        y: this.startPosition.y + event.clientY - this.currentDelta.y,
      },
    });
  };
  constructor.prototype.onMouseDown = function (event) {
    this.currentDelta = { x: event.clientX, y: event.clientY };
    this.startPosition = {
      x: this.component.state.deltaXY.x,
      y: this.component.state.deltaXY.y,
    };
    this.component.ref.style.cursor = "grabbing";
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.currentDelta = null;
    this.startPosition = null;
    this.component.ref.style.cursor = "grab";
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.resetState();
  };

  constructor.prototype.onInit = function (display) {
    this.component = display;
    this.resetState();
  };
  constructor.prototype.onDestroy = function () {
    this.component.ref.style.cursor = "auto";
  }

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;
    this.component.ref.style.cursor = "grab";
  };

  constructor.prototype.getChildren = function () {
    var self = this;
    var children = [];

    var tablesProps = window.CoNDeT.core.toTableProps(this.component.props.state, this.component.state.deltaXY);
    for (var i = 0; i < this.component.props.state.length; i++) {
      tablesProps[i].moveTable = function (id, x, y) {
        self.component.common.stateModifier.moveTable(id, { x: x - self.component.state.deltaXY.x, y: y - self.component.state.deltaXY.y})
      }
      children.push({ type: window.CoNDeT.ui.TableComponent, id: tablesProps[i].id, props: tablesProps[i] });
    }
    var size = this.component.getDimensions();
    children.push({ type: window.CoNDeT.ui.ConnectionsComponent, id: "connections",
      props: { getConnections: function () { return window.CoNDeT.core.toConnectionsProps(self.component, self.component.props.state) }, width: size.width, height: size.height }});

    return children;
  }

  return constructor;
})();
window.CoNDeT.ui.DisplayEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onDbClick = function (event) {
    this.component.common.addTable({
      x: event.offsetX + this.component.state.deltaXY.x,
      y: event.offsetY + this.component.state.deltaXY.y,
    });
  }

  constructor.prototype.getChildren = function () {
    var self = this;
    var children = [];

    var tablesProps = window.CoNDeT.core.toTableProps(this.component.props.state, this.component.state.deltaXY);
    for (var i = 0; i < this.component.props.state.length; i++) {
      tablesProps[i].moveTable = function (id, x, y) {
        self.component.common.stateModifier.moveTable(id, { x: x - self.component.state.deltaXY.x, y: y - self.component.state.deltaXY.y})
      }
      children.push({ type: window.CoNDeT.ui.TableComponent, id: tablesProps[i].id, props: tablesProps[i] });
    }
    var size = this.component.getDimensions();
    children.push({ type: window.CoNDeT.ui.ConnectionsComponent, id: "connections",
      props: { getConnections: function () { return window.CoNDeT.core.toConnectionsProps(self.component, self.component.props.state) }, width: size.width, height: size.height }});

    return children;
  }

  return constructor;
})();
window.CoNDeT.ui.CellComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "CellComponent";

  constructor.prototype.createRef = function () {
    return document.createElement(this.props.type);
  }
  constructor.prototype.onInit = function () {
    if (!this.props.className) return;
    this.ref.className = this.props.className;
  }

  return constructor;
})();window.CoNDeT.ui.CellDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.TextComponent, id: "text", props: { isSmall: false, value: this.component.props.value }}]
  }

  return constructor;
})();
window.CoNDeT.ui.CellEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onDbClick = function (event) {
    event.stopPropagation();
    if (this.component.props.disabled) return;
    this.component.setStrategy(new window.CoNDeT.ui.CellEditState())
  }

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.TextComponent, id: "text", props: { isSmall: false, value: this.component.props.value }}]
  }

  return constructor;
})();

window.CoNDeT.ui.CellEditState = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onKeyDown = function (event) {
    if (event.keyCode !== 13) return;

    this.component.setStrategy(new window.CoNDeT.ui.CellEditMode())
  }

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.InputComponent, id: "input", props: { onSubmit: this.component.props.changeValue, value: this.component.props.value }}]
  }

  return constructor;
})();

window.CoNDeT.ui.IconBtnDisplayMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.IconBtnEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onMouseDown = function (event) {
    event.stopPropagation();
    this.component.props.action(event);
  };

  return constructor;
})();
window.CoNDeT.ui.IconBtnComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "IconBtnComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("span");
  };

  constructor.prototype.onInit = function () {
    this.ref.className = this.props.className;
    this.ref.setAttribute("role", "button");
    this.ref.setAttribute("aria-label", this.props.label);
    this.ref.setAttribute("tabindex", 0);

    this.ref.innerHTML = this.props.icon;
  };

  return constructor;
})();
window.CoNDeT.ui.InputDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.InputEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onKeyDown = function (event) {
    if (event.keyCode !== 13) return;

    this.component.props.onSubmit(this.component.ref.value);
  }

  return constructor;
})();
window.CoNDeT.ui.InputComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "InputComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("input");
  }
  constructor.prototype.onInit = function () {
    var self = this;

    this.ref.type = "text";
    this.ref.value = this.props.value;
    setTimeout(function () {
      self.ref.focus();
    }, 0);
  }

  return constructor;
})();window.CoNDeT.ui.TextDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.TextEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.TextComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "TextComponent";

  constructor.prototype.createRef = function () {
    return document.createElement(this.props.isSmall ? "small": "span");
  }
  constructor.prototype.onUpdate = function () {
    this.ref.innerHTML = this.props.value;
  }

  return constructor;
})();
window.CoNDeT.ui.TableComponentAddConnectionMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onMouseDown = function (event) {
    event.stopPropagation();
    this.component.common.stateModifier.addConnection(
      this.component.common.mode.state.from,
      this.component.common.mode.state.row,
      this.component.id,
    );
    this.component.common.setMode("edit");
  };
  constructor.prototype.onMouseLeave = function () {
    this.component.ref.className = "condet-table condet-class-" + this.component.props.class;
  };
  constructor.prototype.onMouseEnter = function () {
    this.component.ref.className = "condet-table condet-class-" + this.component.props.class + " condet-table-selected";
  }

  constructor.prototype.onInit = function (table) {
    this.component = table;
    this.component.ref.style.cursor = "pointer";
  };
  constructor.prototype.onDestroy = function () {
    this.component.ref.style.cursor = "inherit";
  };

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;

  }

  return constructor;
})();
window.CoNDeT.ui.TableComponentDisplayMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.TableComponentEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.updateXY = function (event) {
    if (this.startPosition == null) return;
    this.component.props.moveTable(
      this.component.id,
      this.startPosition.x + event.clientX - this.currentDelta.x,
      this.startPosition.y + event.clientY - this.currentDelta.y
    );
  };

  constructor.prototype.onMouseDown = function (event) {
    this.currentDelta = { x: event.clientX, y: event.clientY };
    this.startPosition = { x: this.component.props.coordinates.x, y: this.component.props.coordinates.y }
    this.component.ref.style.cursor = "grabbing";
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.resetState();
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.resetState();
    this.component.ref.className = "condet-table condet-class-" + this.component.props.class;
  };
  constructor.prototype.onMouseEnter = function () {
    this.component.ref.className = "condet-table condet-class-" + this.component.props.class + " condet-table-movable";
  }

  constructor.prototype.onInit = function (table) {
    this.component = table;
    this.resetState();
  };
  constructor.prototype.onDestroy = function () {
    this.component.ref.style.cursor = "inherit";
  };

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;
    this.component.ref.style.cursor = "grab";
  }

  return constructor;
})();
window.CoNDeT.ui.TableComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "TableComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("table");
  };
  constructor.prototype.getChildren = function() {
    var self = this;
    var editCell = function (rowId, type, index, value) {
      self.common.stateModifier.editCell(self.props.id, rowId, type, index, value);
    }
    var editCondition = function (index, value) {
      self.common.stateModifier.editCondition(self.props.id, index, value);
    }
    var editDecision = function (index, value) {
      self.common.stateModifier.editDecision(self.props.id, index, value);
    }
    var editName = function (value) {
      self.common.stateModifier.editName(self.props.id, value);
    }
    var editId = function (value) {
      self.common.stateModifier.editId(self.props.id, value);
    }
    var editClass = function (value) {
      self.common.stateModifier.editClass(self.props.id, value);
    }
    var addRow = function () {
      self.common.stateModifier.addEmptyRow(self.props.id);
    }
    var deleteRow = function (rowId) {
      self.common.stateModifier.removeRow(self.props.id, rowId);
    }
    var startAddingConnection = function (rowId) {
      self.common.setMode("add connection");
      self.common.mode.setFrom(self.props.id);
      self.common.mode.setRow(rowId);
    }

    return [
      { type: window.CoNDeT.ui.CaptionComponent, id: this.props.id + "_caption",
        props: { name: this.props.name, class: this.props.class, id: this.props.id,
          changeName: editName, changeClass: editClass, changeId: editId}},
      { type: window.CoNDeT.ui.HeadComponent, id: this.props.id + "_header", props: {
        id: this.props.id, conditions: this.props.conditions, decisions: this.props.decisions,
        editCondition: editCondition, editDecision: editDecision
      }},
      { type: window.CoNDeT.ui.BodyComponent, id: this.props.id + "_body", props: {
          rows: this.props.rows, numberOfConditions: this.props.conditions.length,
          editCell: editCell, addRow: addRow, deleteRow: deleteRow, startAddingConnection: startAddingConnection,
      }},
    ]
  }
  constructor.prototype.onInit = function () {
    this.ref.className = "condet-table condet-class-" + this.props.class;
  };
  constructor.prototype.onUpdate = function () {
    this.ref.style.position = "absolute";
    this.ref.style.left = "0";
    this.ref.style.right = "0";
    this.ref.style.transform = "translate(" + this.props.coordinates.x + "px," + this.props.coordinates.y + "px)"
  }

  constructor.prototype.getRowXY = function (rowNumber) {
    var body = this.findChild(window.CoNDeT.ui.BodyComponent, this.props.id + "_body");
    var relative = body.children[rowNumber].getConnectionXY();
    return { x: this.props.coordinates.x + relative.x, y: this.props.coordinates.y + relative.y };
  };

  constructor.prototype.entryPoint = function () {
    var size = this.getDimensions();
    return { x: this.props.coordinates.x + size.width / 2 , y: this.props.coordinates.y };
  }

  return constructor;
})();
window.CoNDeT.ui.BodyComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "BodyComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("tbody");
  };

  return constructor;
})();
window.CoNDeT.ui.BodyComponentDisplayMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var children = [];
    for (var i = 0; i < this.component.props.rows.length; i++) {
      children.push({
        type: window.CoNDeT.ui.RowComponent,
        id: i,
        props: {
          tableID: this.component.props.tableID,
          numberOfConditions: this.component.props.numberOfConditions,
          content: this.component.props.rows[i].content,
          id: this.component.props.rows[i].id,
          editCell: this.component.props.editCell,
        },
      });
    }
    return children;
  }

  return constructor;
})();
window.CoNDeT.ui.BodyComponentEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var children = [];
    for (var i = 0; i < this.component.props.rows.length; i++) {
      children.push({
        type: window.CoNDeT.ui.RowComponent,
        id: i,
        props: {
          numberOfConditions: this.component.props.numberOfConditions,
          content: this.component.props.rows[i].content,
          id: this.component.props.rows[i].id,
          editCell: this.component.props.editCell,
          deleteRow: this.component.props.deleteRow,
          startAddingConnection: this.component.props.startAddingConnection,
        },
      });
    }

    children.push({
      type: window.CoNDeT.ui.AddRowComponent,
      id: "add-row",
      props: {
        addRow: this.component.props.addRow,
      },
    });

    return children;
  }

  return constructor;
})();
window.CoNDeT.ui.AddRowComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "AddRowComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("tr");
  };

  constructor.prototype.getChildren = function () {
    return [{
      type: window.CoNDeT.ui.AddRowCellComponent,
      id: "add-row-cell",
      props: this.props,
    }];
  };

  return constructor;
})();
window.CoNDeT.ui.AddRowCellComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "AddRowCellComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("td");
  };
  constructor.prototype.getChildren = function () {
    return [{
      type: window.CoNDeT.ui.IconBtnComponent,
      id: "add-row",
      props: {
        action: this.props.addRow,
        icon: this.common.icons.add,
        className: "add-column-btn",
        label: "Add row",
      },
    }];
  };

  return constructor;
})();
window.CoNDeT.ui.RowDisplayMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var children = [];
    for (var i = 0; i < this.component.props.content.length; i++) {
      children.push({
        type: window.CoNDeT.ui.CellComponent,
        id: i,
        props: {
          value: this.component.props.content[i][0],
          type: "td",
          changeValue: function () {},
          disabled: false,
        },
      });
    }
    return children;
  };

  return constructor;
})();
window.CoNDeT.ui.RowEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var self = this;
    var deleteRow = function () {
      self.component.props.deleteRow(self.component.props.id)
    }
    var startAddingConnection = function () {
      self.component.props.startAddingConnection(self.component.props.id);
    }

    var children = [];

    children.push({
      type: window.CoNDeT.ui.DeleteRowCellComponent,
      id: "delete-btn",
      props: {
        deleteRow: deleteRow,
      }
    })

    for (var i = 0; i < this.component.props.content.length; i++) {
      if (i === this.component.props.numberOfConditions) {
        children.push({
          type: window.CoNDeT.ui.CellComponent,
          id: "sep-1",
          props: {
            value: "",
            type: "td",
            changeValue: function () {},
            disabled: true,
          },
        });
      }

      var changeValue = (function () {
        var j = i;
        return function (value) {
          self.component.props.editCell(
              self.component.props.id,
              self.component.props.content[j][1],
              self.component.props.content[j][2],
              value
          );
        };
      })();

      children.push({
        type: window.CoNDeT.ui.CellComponent,
        id: this.component.props.content[i][3],
        props: {
          value: this.component.props.content[i][0],
          type: "td",
          changeValue: changeValue,
        },
      });
    }

    children.push({
      type: window.CoNDeT.ui.AddConnectionCellComponent,
      id: "add-connection",
      props: { startAddingConnection: startAddingConnection },
    });

    return children;
  };

  return constructor;
})();
window.CoNDeT.ui.RowComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "RowComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("tr");
  };

  constructor.prototype.getConnectionXY = function () {
    var position = this.getPosition();
    var dimensions = this.getDimensions();
    return {
      x: position.x + dimensions.width,
      y: position.y + dimensions.height / 2,
    };
  };

  return constructor;
})();
window.CoNDeT.ui.AddConnectionCellComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "DeleteRowCellComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("td");
  };
  constructor.prototype.getChildren = function () {
    return [{
      type: window.CoNDeT.ui.IconBtnComponent,
      id: "add-connection",
      props: {
        action: this.props.startAddingConnection,
        icon: this.common.icons.add,
        className: "add-connection-btn",
        label: "Add connection",
      },
    }];
  };

  return constructor;
})();
window.CoNDeT.ui.DeleteRowCellComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "DeleteRowCellComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("td");
  };
  constructor.prototype.getChildren = function () {
    return [{
      type: window.CoNDeT.ui.IconBtnComponent,
      id: "add-row",
      props: {
        action: this.props.deleteRow,
        icon: this.common.icons.delete,
        className: "delete-column-btn",
        label: "Delete row",
      },
    }];
  };

  return constructor;
})();
window.CoNDeT.ui.CaptionComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "CaptionComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("caption");
  };
  constructor.prototype.onInit = function () {
    this.ref.className = "condet-caption";
  }

  return constructor;
})();window.CoNDeT.ui.CaptionDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    return [
      { type: window.CoNDeT.ui.TextComponent, id: "name", props: { isSmall: false, value: this.component.props.name }},
      { type: window.CoNDeT.ui.TextComponent, id: "class", props: { isSmall: true, value: " (class: " + this.component.props.class }},
      { type: window.CoNDeT.ui.TextComponent, id: "id", props: { isSmall: true, value: ", id: " + this.component.props.id + ")" }}
    ];
  }

  return constructor;
})();
window.CoNDeT.ui.CaptionEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onDbClick = function (event) {
    event.stopPropagation();
    this.component.setStrategy(new window.CoNDeT.ui.CaptionEditState())
  }

  constructor.prototype.getChildren = function () {
    var self = this;

    var deleteTable = function () {
      self.component.common.stateModifier.removeTable(self.component.props.id);
    }

    return [
      { type: window.CoNDeT.ui.IconBtnComponent, id: "delete-table", props: {
        action: deleteTable, icon: this.component.common.icons.delete, className: "delete-table-btn", label: "Delete table"
      }},
      { type: window.CoNDeT.ui.TextComponent, id: "name-edit", props: { isSmall: false, value: this.component.props.name }},
      { type: window.CoNDeT.ui.TextComponent, id: "class-edit", props: { isSmall: true, value: " (class: " + this.component.props.class }},
      { type: window.CoNDeT.ui.TextComponent, id: "id-edit", props: { isSmall: true, value: ", id: " + this.component.props.id + ")" }}
    ];
  }

  return constructor;
})();

window.CoNDeT.ui.CaptionEditState = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onKeyDown = function (event) {
    if (event.keyCode !== 13) return;

    this.component.props.changeName(this.component.children[0].ref.value)
    this.component.props.changeClass(this.component.children[2].ref.value)
    this.component.props.changeId(this.component.children[4].ref.value)

    this.component.setStrategy(new window.CoNDeT.ui.CaptionEditMode())
  }

  constructor.prototype.getChildren = function () {
    return [
      { type: window.CoNDeT.ui.InputComponent, id: "input-name", props: { onSubmit: function () {}, value: this.component.props.name }},
      { type: window.CoNDeT.ui.TextComponent, id: "separator-1", props: { isSmall: true, value: " (class: " }},
      { type: window.CoNDeT.ui.InputComponent, id: "input-class", props: { onSubmit: function () {}, value: this.component.props.class }},
      { type: window.CoNDeT.ui.TextComponent, id: "separator-2", props: { isSmall: true, value: ", id: " }},
      { type: window.CoNDeT.ui.InputComponent, id: "input-id", props: { onSubmit: function () {}, value: this.component.props.id }},
      { type: window.CoNDeT.ui.TextComponent, id: "separator-3", props: { isSmall: true, value: " )" }},
    ];
  }

  return constructor;
})();
window.CoNDeT.ui.HeadDisplayMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.HeadEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.HeadComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "HeadComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("thead");
  };

  constructor.prototype.getChildren = function () {
    return [
      {
        type: window.CoNDeT.ui.HeadTrComponent,
        id: "tr",
        props: this.props,
      },
    ];
  };

  return constructor;
})();
window.CoNDeT.ui.HeadTrDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var self = this;
    var children = [];

    for (var i = 0; i < this.component.props.conditions.length; i++) {
      var editCondition = (function () {
        var j = i;
        return function (value) {
          self.props.editCondition(j, value);
        };
      })();
      children.push({
        type: window.CoNDeT.ui.CellComponent,
        id: children.length,
        props: {
          value: this.component.props.conditions[i],
          className: "condition",
          type: "th",
          changeValue: editCondition,
        },
      });
    }
    for (var i = 0; i < this.component.props.decisions.length; i++) {
      var editDecision = (function () {
        var j = i;
        return function (value) {
          self.props.editDecision(j, value);
        };
      })();
      children.push({
        type: window.CoNDeT.ui.CellComponent,
        id: children.length,
        props: {
          value: this.component.props.decisions[i],
          className: "decision",
          type: "th",
          changeValue: editDecision,
        },
      });
    }
    return children;
  };

  return constructor;
})();
window.CoNDeT.ui.HeadTrEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var self = this;
    var children = [];

    children.push({
      type: window.CoNDeT.ui.TextComponent,
      id: "empty",
      props: { isSmall: false, value: "" },
    });

    for (var i = 0; i < this.component.props.conditions.length; i++) {
      var editCondition = (function () {
        var j = i;
        return function (value) {
          self.component.props.editCondition(j, value);
        };
      })();
      var deleteCondition = (function () {
        var j = i;
        return function () {
          self.component.common.stateModifier.removeConditionColumn(self.component.props.id, j);
        };
      })();

      children.push({
        type: window.CoNDeT.ui.THComponent,
        id: children.length,
        props: {
          value: this.component.props.conditions[i],
          className: "condition",
          changeValue: editCondition,
          delete: deleteCondition,
        },
      });
    }

    children.push({
      type: window.CoNDeT.ui.AddColumnComponent,
      id: "sep-1",
      props: { className: "condition", action: function () {
        var value = prompt("Enter condition value:");
        self.component.common.stateModifier.addConditionColumn(self.component.props.id, value);
      }},
    });

    for (var i = 0; i < this.component.props.decisions.length; i++) {
      var editDecision = (function () {
        var j = i;
        return function (value) {
          self.component.props.editDecision(j, value);
        };
      })();
      var deleteDecision = (function () {
        var j = i;
        return function () {
          self.component.common.stateModifier.removeDecisionColumn(self.component.props.id, j);
        };
      })();

      children.push({
        type: window.CoNDeT.ui.THComponent,
        id: children.length,
        props: {
          value: this.component.props.decisions[i],
          className: "decision",
          changeValue: editDecision,
          delete: deleteDecision,
        },
      });
    }

    children.push({
      type: window.CoNDeT.ui.AddColumnComponent,
      id: "sep-2",
      props: { className: "decision", action: function () {
          var value = prompt("Enter decision value:");
          self.component.common.stateModifier.addDecisionColumn(self.component.props.id, value);
        }},
    });

    return children;
  };

  return constructor;
})();
window.CoNDeT.ui.HeadTrComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "HeadTrComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("tr");
  };

  return constructor;
})();
window.CoNDeT.ui.AddColumnComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "AddColumnComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("th");
  }

  constructor.prototype.onInit = function () {
    if (!this.props.className) return;
    this.ref.className = this.props.className;
  }

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.IconBtnComponent, id: "add-column", props: {
      action: this.props.action, icon: this.common.icons.add, className: "add-column-btn", label: "Add column"
    }}]
  }

  return constructor;
})();
window.CoNDeT.ui.THDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.TextComponent, id: "text", props: { isSmall: false, value: this.component.props.value }}]
  }

  return constructor;
})();
window.CoNDeT.ui.THEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onDbClick = function (event) {
    event.stopPropagation();
    this.component.setStrategy(new window.CoNDeT.ui.THEditState())
  }

  constructor.prototype.getChildren = function () {
    return [
      { type: window.CoNDeT.ui.IconBtnComponent, id: "delete-column", props: {
        action: this.component.props.delete, icon: this.component.common.icons.delete, className: "delete-column-btn", label: "Delete column"
      }},
      { type: window.CoNDeT.ui.TextComponent, id: "text", props: { isSmall: false, value: this.component.props.value }},
    ]
  }

  return constructor;
})();

window.CoNDeT.ui.THEditState = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onKeyDown = function (event) {
    if (event.keyCode !== 13) return;

    this.component.setStrategy(new window.CoNDeT.ui.THEditMode())
  }

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.InputComponent, id: "input", props: { onSubmit: this.component.props.changeValue, value: this.component.props.value }}]
  }

  return constructor;
})();

window.CoNDeT.ui.THComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "THComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("th");
  }
  constructor.prototype.onInit = function () {
    this.ref.className = this.props.className;
  }

  return constructor;
})();
window.CoNDeT.ui.BaseMode = {
  setToAllComponents: function (componentInstance) {
    var strategy = this.getEntryStrategy(componentInstance);
    componentInstance.setStrategy(strategy);

    for (var i = 0; i < componentInstance.children.length; i++) {
      this.setToAllComponents(componentInstance.children[i]);
    }
  },
  getEntryStrategy: function (componentInstance) {
    var Mode =
      this.mapper[Object.getPrototypeOf(componentInstance).typeId] ||
      window.CoNDeT.ui.BaseStrategy;
    return new Mode();
  },
};

window.CoNDeT.ui.Mode = (function () {
  function constructor(mapper) {
    this.mapper = mapper;
  }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseMode);

  return constructor;
})();

window.CoNDeT.ui.componentToDisplayModeEntryStrategy = {
  DisplayComponent: window.CoNDeT.ui.DisplayDisplayMode,
  TableComponent: window.CoNDeT.ui.TableComponentDisplayMode,
  CellComponent: window.CoNDeT.ui.CellDisplayMode,
  TextComponent: window.CoNDeT.ui.TextDisplayMode,
  InputComponent: window.CoNDeT.ui.InputDisplayMode,
  CaptionComponent: window.CoNDeT.ui.CaptionDisplayMode,
  HeadComponent: window.CoNDeT.ui.HeadDisplayMode,
  ConnectionComponent: window.CoNDeT.ui.ConnectionDisplayMode,
  RowComponent: window.CoNDeT.ui.RowDisplayMode,
  HeadTrComponent: window.CoNDeT.ui.HeadTrDisplayMode,
  IconBtnComponent: window.CoNDeT.ui.IconBtnDisplayMode,
  THComponent: window.CoNDeT.ui.THDisplayMode,
  BodyComponent: window.CoNDeT.ui.BodyComponentDisplayMode,
};

window.CoNDeT.ui.componentToEditModeEntryStrategy = {
  DisplayComponent: window.CoNDeT.ui.DisplayEditMode,
  TableComponent: window.CoNDeT.ui.TableComponentEditMode,
  CellComponent: window.CoNDeT.ui.CellEditMode,
  TextComponent: window.CoNDeT.ui.TextEditMode,
  InputComponent: window.CoNDeT.ui.InputEditMode,
  CaptionComponent: window.CoNDeT.ui.CaptionEditMode,
  HeadComponent: window.CoNDeT.ui.HeadEditMode,
  ConnectionComponent: window.CoNDeT.ui.ConnectionEditMode,
  RowComponent: window.CoNDeT.ui.RowEditMode,
  HeadTrComponent: window.CoNDeT.ui.HeadTrEditMode,
  IconBtnComponent: window.CoNDeT.ui.IconBtnEditMode,
  THComponent: window.CoNDeT.ui.THEditMode,
  BodyComponent: window.CoNDeT.ui.BodyComponentEditMode,
};

window.CoNDeT.ui.componentToAddConnectionModeEntryStrategy = {
  DisplayComponent: window.CoNDeT.ui.DisplayAddConnectionMode,
  TableComponent: window.CoNDeT.ui.TableComponentAddConnectionMode,
  CellComponent: window.CoNDeT.ui.CellDisplayMode,
  TextComponent: window.CoNDeT.ui.TextDisplayMode,
  InputComponent: window.CoNDeT.ui.InputDisplayMode,
  CaptionComponent: window.CoNDeT.ui.CaptionDisplayMode,
  HeadComponent: window.CoNDeT.ui.HeadDisplayMode,
  ConnectionComponent: window.CoNDeT.ui.ConnectionDisplayMode,
  RowComponent: window.CoNDeT.ui.RowDisplayMode,
  HeadTrComponent: window.CoNDeT.ui.HeadTrDisplayMode,
  IconBtnComponent: window.CoNDeT.ui.IconBtnDisplayMode,
  THComponent: window.CoNDeT.ui.THDisplayMode,
  BodyComponent: window.CoNDeT.ui.BodyComponentDisplayMode,
};

window.CoNDeT.ui.DisplayModeConstructor = (function () {
  function constructor() {
    this.mapper = window.CoNDeT.ui.componentToDisplayModeEntryStrategy;
  }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseMode);

  return constructor;
})();

window.CoNDeT.ui.EditModeConstructor = (function () {
  function constructor() {
    this.mapper = window.CoNDeT.ui.componentToEditModeEntryStrategy;
  }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseMode);

  return constructor;
})();

window.CoNDeT.ui.AddConnectionModeConstructor = (function () {
  function constructor() {
    this.mapper = window.CoNDeT.ui.componentToAddConnectionModeEntryStrategy;
    this.state = {
      from: "",
      to: "",
      row: "",
    }
  }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseMode);

  constructor.prototype.setFrom = function (from) {
    this.state.from = from;
  }
  constructor.prototype.setTo = function (to) {
    this.state.to = to;
  }
  constructor.prototype.setRow = function (row) {
    this.state.row = row;
  }

  return constructor;
})();