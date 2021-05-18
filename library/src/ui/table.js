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
  constructor.prototype.getChildren = function () {
    return [
      { type: window.CoNDeT.ui.NameComponent, id: this.props.id + "_caption",
        props: { name: this.props.name, class: this.props.class }},
      { type: window.CoNDeT.ui.HeadComponent, id: this.props.id + "_header",
        props: { conditions: this.props.conditions, decisions: this.props.decisions }},
      { type: window.CoNDeT.ui.BodyComponent, id: this.props.id + "_body", props: { content: this.props.rows }},
    ]
  };
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
    return this.children[2].children[rowNumber].getConnectionXY();
  };

  return constructor;

  function getCssInlineStyleForPosition(x, y) {
    return "position: absolute; left: 0; right: 0; transform: translate(" + x + "px," + y + "px);";
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

  // note(es): consider refactoring
  constructor.prototype.getConnectionXY = function () {
    var position = this.getPosition();
    var dimensions = this.getDimensions();
    return { x: position.x + dimensions.x, y: position.y + dimensions.y / 2 };
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
