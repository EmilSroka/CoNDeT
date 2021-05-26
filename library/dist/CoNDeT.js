window.CoNDeT = function (configs) {
  var selector = configs.selector || ".condet-display";
  var modeName = configs.entryMode || "display";

  var state = new window.CoNDeT.data.State();
  var display = new window.CoNDeT.ui.DisplayComponent();
  var common = {
    stateModifier: new window.CoNDeT.data.StateModifier(state),
    mode: getMode(modeName),
  };

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
    changeMode: function (modeName) {
      common.mode = getMode(modeName);
      common.mode.setToAllComponents(display);
    },
    getState: function () {
      return state;
    },
  };

  function getMode(modeName) {
    if (modeName === "edit") {
      return window.CoNDeT.ui.EditMode;
    }

    if (modeName === "display") {
      return window.CoNDeT.ui.DisplayMode;
    }

    return new window.CoNDeT.ui.Mode({});
  }
};

window.CoNDeT.ui = {};
window.CoNDeT.core = {};
/*
 * BaseComponent API
 * createRef -> method that should return new dom element that corresponds to this component
 * [optional] getChildren -> method that returns array of objects that represents children: {type, id, props}
 *   order of elements in returned array will be reflected in dom
 * [optional] onInit -> method for additional functionality during initialization
 * [optional] onUpdate -> method for additional functionality during update
 * [optional] onDestroy -> method for additional functionality during destroy
 * */
window.CoNDeT.ui.BaseComponent = {
  /* component life cycle */
  init: function (common, id, props) {
    this.id = id;
    this.state = {};
    this.children = [];
    this.common = common;
    this.props = props;
    this.ref = this.createRef();
    this.onInit();
    this.setStrategy(common.mode.getEntryStrategy(this));
    this.updateChildren(this.getChildren());
    this.onUpdate();
    this.setupEventListeners();
  },
  createRef: function () {
    throw new Error("Component must implement createRef method");
  },
  getChildren: function () {
    return [];
  },
  onInit: function () {},
  update: function (props) {
    this.props = props;
    this.updateChildren(this.getChildren());
    this.onUpdate();
  },
  onUpdate: function () {},
  destroy: function () {
    this.destroyChildren();
    this.ref.remove();
    this.onDestroy();
  },
  onDestroy: function () {},
  /* state management */
  setState: function (updated) {
    var newState = {};
    for (var prop in this.state) {
      newState[prop] = this.state[prop];
    }
    for (var prop in updated) {
      newState[prop] = updated[prop];
    }
    this.state = newState;
    this.stateChanged();
  },
  stateChanged: function () {
    this.updateChildren(this.getChildren());
    this.onUpdate();
  },
  /* children update */
  updateChildren: function (newChildren) {
    this.unmark(this.children);
    this.unmark(newChildren);
    this.markCorrespondedChildren(this.children, newChildren);
    this.deleteUnmarked(this.children);
    this.setInSameOrder(newChildren);
    this.initNewChildren(newChildren);
    this.updateChildrenProps(newChildren);
  },
  unmark: function (array) {
    for (var i = 0; i < array; i++) {
      array[i].marked = false;
    }
  },
  markCorrespondedChildren: function (array1, array2) {
    for (var i = 0; i < array1; i++) {
      var current = array1[i];
      for (var j = 0; i < array2; j++) {
        var child = this.findChild(current.type, current.id);
        if (child == null) continue;
        child.marked = true;
        current.marked = true;
      }
    }
  },
  deleteUnmarked: function (array) {
    for (var i = 0; i < array; i++) {
      if (!array[i].marked) this.removeChild(array[i]);
    }
  },
  setInSameOrder: function (newChildren) {
    for (
      var childIdx = 0, newChildIdx = 0;
      newChildIdx < newChildren.length;
      newChildIdx++
    ) {
      var currentNewChild = newChildren[newChildIdx];

      var correspondedIdx = this.findIndexOfChild(
        currentNewChild.type,
        currentNewChild.id
      );

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
    for (var i = 0; i < newChildren.length; i++) {
      var corresponded = this.findChild(newChildren[i].type, newChildren[i].id);
      if (corresponded == null) continue;
      corresponded.update(newChildren[i].props);
    }
  },
  initNewChildren: function (newChildren) {
    for (var i = 0; i < newChildren.length; i++) {
      var corresponded = this.findChild(newChildren[i].type, newChildren[i].id);
      if (corresponded != null) continue;
      this.createChild(
        newChildren[i].type,
        newChildren[i].props,
        newChildren[i].id,
        i
      );
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

    for (let i = 0; i < this.children.length; i++) {
      if (
        this.children[i].typeId === type.prototype.typeId &&
        this.children[i].id === id
      )
        return i;
    }
  },
  destroyChildren: function () {
    if (this.children == null) return;

    for (let i = 0; i < children.length; i++) {
      children[i].destroy(common);
    }
  },
  /* dimensions */
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
  containsPoint: function (x, y) {
    return (
      x >= this.ref.offsetLeft &&
      x <= this.ref.offsetLeft + this.ref.clientWidth &&
      y >= this.ref.offsetTop &&
      y <= this.ref.offsetTop + this.ref.clientHeight
    );
  },
  /* strategy */
  setStrategy: function (strategy) {
    if (this.strategy != null) this.strategy.onDestroy();
    this.strategy = strategy;
    this.strategy.onInit(this);
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
  },
  /* child management */
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
  removeChildAtPosition: function (position) {
    if (position <= -1 || position >= this.children.length) return;
    var childToRemove = this.children[position];
    this.removeChild(childToRemove);
  },
};
window.CoNDeT.ui.StrategyCommon = {
  onDestroy: function () {},
  onInit: function (component) { this.component = component },
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
/*
 * props:
 * * getConnections -> callback that return list of paths
 * * width
 * * height
 */
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
      children.push({ type: window.CoNDeT.ui.ConnectionComponent, id: connections[i].id, props: { path: connections[i].path } });
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
})();

window.CoNDeT.ui.ConnectionComponent = (function () {
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
      var point = "L " + path[i].x + " " + path[i].y;
      d += point;
    }
    return d;
  }
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
    return "M " + x + " " + y + "L " + x - 5 + " " + y - 5 + "L " + x - 5 + " " + y + 5 + " Z";
  }
})();
/*
 * props:
 * * name -> table name
 * * class -> table CoNDeT class
 */
window.CoNDeT.ui.NameComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "NameComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("caption");
  };
  constructor.prototype.onInit = function () {
    this.ref.className = "condet-caption";
  }
  constructor.prototype.onUpdate = function () {
    this.ref.innerHTML = this.props.name + " <small>(" + this.props.class + ")</small>";
  };

  return constructor;
})();

/*
 * props:
 * * conditions -> list of conditions (strings)
 * * decisions -> list of decisions (strings)
 */
window.CoNDeT.ui.HeadComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "HeadComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("thead");
  }
  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.HeadTrComponent, id: 'tr', props: this.props }];
  }

  return constructor;
})();

/*
 * props:
 * * conditions -> list of conditions (strings)
 * * decisions -> list of decisions (strings)
 */
window.CoNDeT.ui.HeadTrComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "HeadTrComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("tr");
  }
  constructor.prototype.getChildren = function () {
    var children = [];
    for (var i=0; i<this.props.conditions.length; i++) {
      children.push({ type: window.CoNDeT.ui.CellComponent, id: children.length,
        props: { value: this.props.conditions[i], className: "condition", type: "th" } })
    }
    for (var i=0; i<this.props.decisions.length; i++) {
      children.push({ type: window.CoNDeT.ui.CellComponent, id: children.length,
        props: { value: this.props.decisions[i], className: "decision", type: "th" } })
    }
    return children;
  };

  return constructor;
})();

/*
 * props:
 * * content -> list (rows) of list (row) that contains table content
 */
window.CoNDeT.ui.BodyComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "BodyComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("tbody");
  }
  constructor.prototype.getChildren = function () {
    var children = [];
    for (var i = 0; i < this.props.content.length; i++) {
      children.push({ type: window.CoNDeT.ui.RowComponent, id: i, props: { content: this.props.content[i] } });
    }
    return children;
  }

  return constructor;
})();

/*
 * props:
 * * content -> list of values in row
 */
window.CoNDeT.ui.RowComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "RowComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("tr");
  }
  constructor.prototype.getChildren = function () {
    var children = [];
    for (var i = 0; i < this.props.content.length; i++) {
      children.push({ type: window.CoNDeT.ui.CellComponent, id: i,
        props: { value: this.props.content[i], type: "td" } });
    }
    return children;
  }

  constructor.prototype.getConnectionXY = function () {
    var position = this.getPosition();
    var dimensions = this.getDimensions();
    return { x: position.x + dimensions.width, y: position.y + dimensions.height / 2 };
  };

  return constructor;
})();

/*
 * props:
 * * type -> th | td
 * * [optional] className
 * * value
 */
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
  constructor.prototype.onUpdate = function () {
    this.ref.innerHTML = this.props.value;
  }

  return constructor;
})();
window.CoNDeT.ui.TableComponentDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.TableComponentEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.updateXY = function (event) {
    if (this.startPosition == null) return;
    this.table.common.stateModifier.moveTable(this.table.id, {
      x: this.startPosition.x + event.clientX - this.currentDelta.x,
      y: this.startPosition.y + event.clientY - this.currentDelta.y,
    });
  };

  constructor.prototype.onMouseDown = function (event) {
    this.currentDelta = { x: event.clientX, y: event.clientY };
    this.startPosition = {
      x: this.table.props.coordinates.x,
      y: this.table.props.coordinates.y,
    };
    this.table.ref.style.cursor = "grabbing";
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.currentDelta = null;
    this.startPosition = null;
    this.table.ref.style.cursor = "grab";
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.resetState();
    this.table.ref.className =
      "condet-table condet-class-" + this.table.props.class;
  };
  constructor.prototype.onMouseEnter = function () {
    this.table.ref.className =
      "condet-table condet-class-" +
      this.table.props.class +
      " condet-table-movable";
  };

  constructor.prototype.onInit = function (table) {
    this.table = table;
    this.table.ref.appendChild(this.removeTableElement(table.id));

    this.resetState();
  };

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;
    this.table.ref.style.cursor = "grab";
  };

  constructor.prototype.removeTableElement = function (id) {
    var el = document.createElement("span");
    el.className = "corner-element";
    el.innerHTML = "❌";
    tab = this.table;

    el.addEventListener("mousedown", function () {
      tab.common.stateModifier.removeTable(id);
    });

    return el;
  };

  return constructor;
})();
/*
 * props:
 * * id
 * * name
 * * coordinates
 * * class -> name of CoNDeT class
 * * conditions -> list of conditions (strings)
 * * decisions -> list of decisions (strings)
 * * rows -> content of table (list of list of strings)
 */
window.CoNDeT.ui.TableComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "TableComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("table");
  };
  constructor.prototype.getChildren = function() {
    return [
      { type: window.CoNDeT.ui.NameComponent, id: this.props.id + "_caption",
        props: { name: this.props.name, class: this.props.class }},
      { type: window.CoNDeT.ui.HeadComponent, id: this.props.id + "_header",
        props: { conditions: this.props.conditions, decisions: this.props.decisions }},
      { type: window.CoNDeT.ui.BodyComponent, id: this.props.id + "_body", props: { content: this.props.rows }},
    ]
  }
  constructor.prototype.onInit = function () {
    this.ref.className = "condet-table condet-class-" + this.props.class;
  };
  constructor.prototype.onUpdate = function () {
    this.ref.style.cssText = getCssInlineStyleForPosition(
        this.props.coordinates.x,
        this.props.coordinates.y,
    );
  }

  // note(es): do we need to refactor this ???
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

  function getCssInlineStyleForPosition(x, y) {
    return "position: absolute; left: 0; right: 0; transform: translate(" + x + "px," + y + "px);";
  }
})();
/*
 * props
 * * selector -> css selector of display wrapper
 * * state
 */
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
  constructor.prototype.getChildren = function () {
    var self = this;
    var children = [];

    var tablesProps = window.CoNDeT.core.toTableProps(this.props.state, this.state.deltaXY);
    for (var i = 0; i < this.props.state.length; i++) {
      children.push({ type: window.CoNDeT.ui.TableComponent, id: tablesProps[i].id, props: tablesProps[i] });
    }
    var size = this.getDimensions();
    children.push({ type: window.CoNDeT.ui.ConnectionsComponent, id: "connections", props: { getConnections: function () {
      return window.CoNDeT.core.toConnectionsProps(self, self.props.state);
    }, width: size.width, height: size.height }})

    return children;
  }

  return constructor;
})();
window.CoNDeT.ui.DisplayDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.updateXY = function (event) {
    if (this.currentDelta == null) return;
    this.display.setState({ deltaXY: {
        x: this.startPosition.x + event.clientX - this.currentDelta.x,
        y: this.startPosition.y + event.clientY - this.currentDelta.y,
      }});
  };
  constructor.prototype.onMouseDown = function (event) {
    this.currentDelta = { x: event.clientX, y: event.clientY };
    this.startPosition = { x: this.display.state.deltaXY.x, y: this.display.state.deltaXY.y }
    this.display.ref.style.cursor = "grabbing";
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.currentDelta = null;
    this.startPosition = null;
    this.display.ref.style.cursor = 'grab';
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.resetState();
  };

  constructor.prototype.onInit = function (display) {
    this.display = display;
    this.resetState();
  };

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;
    this.display.ref.style.cursor = "grab";
  }

  return constructor;
})();
window.CoNDeT.ui.DisplayEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
window.CoNDeT.ui.BaseMode = {
  setToAllComponents: function (componentInstance) {
    var Strategy = getEntryStrategy(componentInstance);
    componentInstance.setStrategy(new Strategy());

    for (var i=0; i<componentInstance.children; i++) {
      this.setToAllComponents(componentInstance.children[i]);
    }
  },
  getEntryStrategy: function (componentInstance) {
    var Mode = this.mapper[Object.getPrototypeOf(componentInstance).typeId] || window.CoNDeT.ui.BaseStrategy;
    return new Mode();
  }
}

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
}

window.CoNDeT.ui.componentToEditModeEntryStrategy = {
  DisplayComponent: window.CoNDeT.ui.DisplayEditMode,
  TableComponent: window.CoNDeT.ui.TableComponentEditMode,
}

window.CoNDeT.ui.DisplayMode = new window.CoNDeT.ui.Mode(window.CoNDeT.ui.componentToDisplayModeEntryStrategy);

window.CoNDeT.ui.EditMode = new window.CoNDeT.ui.Mode(window.CoNDeT.ui.componentToEditModeEntryStrategy);
window.CoNDeT.core.toTableProps = function (tablesJSON, deltaXY) {
  var tablesList = [];
  for (var i = 0; i < tablesJSON.length; i++) {
    var tableProps = tablesJSON[i];
    var rowsPrepared = [];
    for (var j = 0; j < tableProps.rows.length; j++) {
      var row = tableProps.rows[j];
      var content = [];
      for (var k = 0; k < tableProps.columns.conditions.length + tableProps.columns.decisions.length; k++) {
        content.push("");
      }
      for (var k = 0; k < row.conditions.length; k++) {
        content[row.conditions[k][0]] = tableProps.rows[j].conditions[k][1];
      }
      for (var k = 0; k < row.decisions.length; k++) {
        content[row.decisions[k][0] + tableProps.columns.conditions.length] = row.decisions[k][1];
      }
      rowsPrepared.push(content);
    }
    tablesList.push({
      id: tableProps.id,
      name: tableProps.name,
      class: tableProps.class,
      coordinates: { x: tableProps.coordinates.x + deltaXY.x, y: tableProps.coordinates.y + deltaXY.y },
      conditions: tableProps.columns.conditions,
      decisions: tableProps.columns.decisions,
      rows: rowsPrepared,
    });
  }

  return tablesList;
};

window.CoNDeT.core.toConnectionsProps = function (display, tablesJSON) {
  var connections = [];
  for (var i=0; i<tablesJSON.length; i++) {
    var table = tablesJSON[i];
    for (var j=0; j<table.rows.length; j++) {
      var row = table.rows[j];
      for (var k=0; k<row.connections.length; k++) {
        var fromTableId = table.id;
        var fromTable = display.findChild(window.CoNDeT.ui.TableComponent, fromTableId);
        if (fromTable == null) continue;
        var starPoint = fromTable.getRowXY(j);

        var toTableId = row.connections[k];
        var toTable = display.findChild(window.CoNDeT.ui.TableComponent, toTableId);
        if (toTable == null) continue;
        var endPoint = toTable.entryPoint();

        connections.push({ id: table.id + "-" + row.row_id + "_" + toTableId, path: window.CoNDeT.core.getLinePoints(starPoint, endPoint) })
      }
    }
  }
  return connections;
};

window.CoNDeT.core.colorHash = function(inputString) {
  var sum = 0;

  for (var i in inputString) {
      sum += inputString.charCodeAt(i);
  }

  var r = ~~(('0.' + Math.sin(sum + 1).toString().substr(6)) * 210);
  var g = ~~(('0.' + Math.sin(sum + 2).toString().substr(6)) * 210);
  var b = ~~(('0.' + Math.sin(sum + 3).toString().substr(6)) * 210);

  var hex = "#";

  hex += ("00" + r.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + g.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + b.toString(16)).substr(-2, 2).toUpperCase();

  return hex;
};

window.CoNDeT.core.getLinePoints = function(startPoint, endPoint) {
  return [
    { x: startPoint.x, y: startPoint.y },
    { x: startPoint.x + 20, y: startPoint.y },
    { x: startPoint.x + 20, y: endPoint.y - 20 },
    { x: endPoint.x, y: endPoint.y - 20 },
    { x: endPoint.x, y: endPoint.y }
  ]
};

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
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.coordinates = {
        x: newCoordinates.x,
        y: newCoordinates.y,
      };

      this.stateManager.setState(newState);
    };

    constructor.prototype.createTable = function (newData) {
      var newState = clone(this.state);
      newState.push(newData);
      this.stateManager.setState(newState);
    };

    constructor.prototype.removeTable = function (tableId) {
      var newState = clone(this.state);
      for (var i = 0; i < newState.length; i++) {
        if (tableId == newState[i].id) {
          newState.splice(i, 1);
        }
      }
      this.stateManager.setState(newState);
    };

    constructor.prototype.editName = function (tableId, name) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.name = name;
      this.stateManager.setState(newState);
    };

    constructor.prototype.editClass = function (tableId, className) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.className = className;
      this.stateManager.setState(newState);
    };

    constructor.prototype.editCondition = function (tableId, conditions) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      replaceInArray(editTable.columns.conditions, conditions);
      this.stateManager.setState(newState);
    };

    constructor.prototype.editDecision = function (tableId, decisions) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      replaceInArray(editTable.columns.decisions, decisions);
      this.stateManager.setState(newState);
    };

    constructor.prototype.editCell = function (
      tableId,
      rowId,
      type,
      index,
      value
    ) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].rowId != rowId) continue;
        for (var j = 0; j < editTable.rows[i][type].length; j++) {
          if (editTable.rows[i][type][j] != index) continue;
          editTable.rows[i][type][j] = value;
        }
      }
      this.stateManager.setState(newState);
    };

    constructor.prototype.addRow = function (tableId, newRow) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.rows.push(newRow);

      this.stateManager.setState(newState);
    };

    constructor.prototype.removeRow = function (tableId, rowId) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].id != rowId) continue;
        editTable.rows.splice(rowId, 1);
      }
      this.stateManager.setState(newState);
    };

    constructor.prototype.addConditionColumn = function (tableId, column) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.columns.conditions.push(column);
      this.stateManager.setState(newState);
    };

    constructor.prototype.addDecisionColumn = function (tableId, column) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      editTable.columns.decisions.push(column);
      this.stateManager.setState(newState);
    };

    constructor.prototype.removeConditionColumn = function (tableId, column) {
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

    constructor.prototype.removeDecisionColumn = function (tableId, column) {
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

    constructor.prototype.changeRowsOrder = function (tableId, rowId, index) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i] != rowId) continue;
        var row = editTable.rows[i];
        editTable.rows.splice(i, 1);
        editTable.rows.splice(index, 0, row);
      }
      this.stateManager.setState(newState);
    };

    constructor.prototype.changeOrder = function (tableId, type, colId, index) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);

      for (var i = 0; i < editTable.columns[type].length; i++) {
        if (editTable.columns[type][i] != colId) continue;
        var col = editTable.column[type][i];
        editTable.column[type].splice(i, 1);
        editTable.column[type].splice(index, 0, col);
      }

      for (var i = 0; i < editTable.rows.length; i++) {
        for (var j = 0; j < editTable.rows[i][type].length; j++) {
          if (editTable.rows[i][type][j][0] == colId) {
            editTable.rows[i][type][j][0] = index;
            continue;
          }
          if (colId > index) {
            if (editTable.rows[i][type][j][0] > index) {
              editTable.rows[i][type][j][0] += 1;
            }
          } else {
            if (editTable.rows[i][type][j][0] < index) {
              editTable.rows[i][type][j][0] -= 1;
            }
          }
        }
      }

      this.stateManager.setState(newState);
    };

    constructor.prototype.addConnection = function (
      tableId,
      rowId,
      secondTableId
    ) {
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].id == rowId) {
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
      var newState = clone(this.state);
      var editTable = getTableWithId(newState, tableId);
      for (var i = 0; i < editTable.rows.length; i++) {
        if (editTable.rows[i].id !== rowId) continue;
        for (var j = 0; j < editTable.rows[i].connections.length; j++) {
          if (editTable.rows[i].connections[j] !== secondTableId) continue;
          editTable.rows[i].connections.splice(j, 1);
        }
      }
      this.stateManager.setState(newState);
    };

    function replaceInArray(toReplace, newValues) {
      for (var i = 0; i < newValues.length; i++) {
        toReplace[i] = newValues[i];
      }
    }

    function removeColumnWithId(columns, rows, type, id) {
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
    }

    function clone(toClone) {
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
    }

    function getTableWithId(table, tableId) {
      for (var i = 0; i < table.length; i++) {
        if (table[i].id != tableId) continue;
        return table[i];
      }
    }

    return constructor;
  })(),
};
