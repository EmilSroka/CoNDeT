window.CoNDeT.ui.TableComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

  constructor.prototype.onInit = function (common, props) {
    var ref = document.createElement("table");
    ref.className = "condet-table";
    var currentPosition = this.getPosition();
    var newPosition = {
      x: common.deltaXY.x + currentPosition.x,
      y: common.deltaXY.y + currentPosition.y,
    };
    ref.style.cssText = `position: absolute; left: ${newPosition.x}; top: ${newPosition.y}`;

    this.createChild(window.CoNDeT.ui.NameComponent, { text: props.name });
    this.createChild(window.CoNDeT.ui.HeadComponent, {
      conditions: props.conditions,
      decisions: props.decisions,
    });
    this.createChild(window.CoNDeT.ui.BodyComponent, { content: props.rows });

    return ref;
  };
  constructor.prototype.onUpdate = function (common, props) {
    this.children[0].onUpdate(common, { text: props.name });
    this.children[1].onUpdate(common, {
      conditions: props.conditions,
      decisions: props.decisions,
    });
    this.children[2].onUpdate(common, { content: props.rows });

    var currentPosition = this.getPosition();
    var newPosition = {
      x: common.deltaXY.x + currentPosition.x,
      y: common.deltaXY.y + currentPosition.y,
    };
    this.ref.style.cssText = `position: absolute; left: ${newPosition.x}; top: ${newPosition.y}`;
  };
  constructor.prototype.onDestroy = function (common) {
    this.ref.remove();
  };

  constructor.prototype.getRowXY = function (rowNumber) {
    return this.children[2].children[rowNumber].getConnectionXY();
  };

  return constructor;
})();

window.CoNDeT.ui.NameComponent = (function () {
  function constructor() {}

  constructor.prototype.onInit = function (common, props) {
    var ref = document.createElement("caption");
    ref.innerHTML = props.text;
    ref.className = "condet-caption";

    return ref;
  };
  constructor.prototype.onUpdate = function (common, props) {
    this.ref.innerHTML = props.text;
  };
  constructor.prototype.onDestroy = function (common) {
    this.ref.remove();
  };

  return constructor;
})();

window.CoNDeT.ui.HeadComponent = (function () {
  function constructor() {}

  constructor.prototype.appendHeaders = function (headerRef, content) {
    for (let i = 0; i < content.conditions.length; i++) {
      let headerCol = document.createElement("th");
      headerCol.className = "condition";
      headerCol.innerHTML = content.conditions[i];
      headerRef.appendChild(headerCol);
    }

    for (let i = 0; i < content.decisions.length; i++) {
      let headerCol = document.createElement("th");
      headerCol.className = "decision";
      headerCol.innerHTML = content.decisions[i];
      headerRef.appendChild(headerCol);
    }
  };

  constructor.prototype.onInit = function (common, props) {
    var ref = document.createElement("thead");
    this.headerRow = document.createElement("tr");
    ref.appendChild(this.headerRow);

    this.appendHeaders(this.headerRow, {
      conditions: props.conditions,
      decisions: props.decisions,
    });

    return ref;
  };
  constructor.prototype.onUpdate = function (common, props) {
    for (let i = 0; i < this.ref.children.length; i++) {
      this.ref.removeChild(this.ref.children[i]);
    }
    this.appendHeaders(this.headerRow, {
      conditions: props.conditions,
      decisions: props.decisions,
    });
  };
  constructor.prototype.onDestroy = function (common) {
    this.ref.remove();
  };

  return constructor;
})();

window.CoNDeT.ui.BodyComponent = (function () {
  function constructor() {}

  constructor.prototype.onInit = function (common, props) {
    var ref = document.createElement("tbody");

    for (let i = 0; i < props.content.length; i++) {
      this.createChild(window.CoNDeT.ui.RowComponent, {
        constent: props.content[i],
      });
    }

    return ref;
  };
  constructor.prototype.onUpdate = function (common, props) {
    while (0 != this.children.length) {
      this.removeChildAtPosition(0);
    }
    for (let i = 0; i < props.content.length; i++) {
      this.createChild(window.CoNDeT.ui.RowComponent, {
        constent: props.content[i],
      });
    }
  };
  constructor.prototype.onDestroy = function (common) {
    this.ref.remove();
  };

  return constructor;
})();

window.CoNDeT.ui.RowComponent = (function () {
  function constructor() {}

  constructor.prototype.onInit = function (common, props) {
    var ref = document.createElement("tr");

    for (let i = 0; i < props.content.length; i++) {
      let cell = document.createElement("td");
      cell.innerHTML = props.content[i];
      ref.appendChild(cell);
    }

    return ref;
  };

  constructor.prototype.onUpdate = function (common, props) {};
  constructor.prototype.onDestroy = function (common) {
    this.ref.remove();
  };

  constructor.prototype.getConnectionXY = function () {
    var position = this.getPosition();
    var dimensions = this.getDimensions();
    return { x: position.x + dimensions.x, y: position.y + dimensions.y / 2 };
  };

  return constructor;
})();
