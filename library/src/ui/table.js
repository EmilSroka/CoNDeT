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
    var self = this;
    var children = [];

    for (var i=0; i<this.props.conditions.length; i++) {
      var editCondition = (function () {
        var j = i;
        return function (value) {
          self.props.editCondition(j, value);
        }
      })();
      children.push({ type: window.CoNDeT.ui.CellComponent, id: children.length,
        props: { value: this.props.conditions[i], className: "condition", type: "th", changeValue: editCondition } })
    }
    for (var i=0; i<this.props.decisions.length; i++) {
      var editDecision = (function () {
        var j = i;
        return function (value) {
          self.props.editDecision(j, value);
        }
      })();
      children.push({ type: window.CoNDeT.ui.CellComponent, id: children.length,
        props: { value: this.props.decisions[i], className: "decision", type: "th", changeValue: editDecision } })
    }
    return children;
  };

  return constructor;
})();

/*
 * props:
 * * content -> list of objects of type
 * * * content -> list (row) that contains table content
 * * * id -> row id
 * * editCell
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
    for (var i = 0; i < this.props.rows.length; i++) {
      children.push({ type: window.CoNDeT.ui.RowComponent, id: i, props: { content: this.props.rows[i].content, id: this.props.rows[i].id, editCell: this.props.editCell } });
    }
    return children;
  }

  return constructor;
})();

/*
 * props:
 * * content -> list of values in row
 * * editCell
 */
window.CoNDeT.ui.RowComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "RowComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("tr");
  }
  constructor.prototype.getChildren = function () {
    var self = this;

    var children = [];
    for (var i = 0; i < this.props.content.length; i++) {
      var changeValue = (function () {
        var j = i;
        return function (value) {
          self.props.editCell(self.props.id, self.props.content[j][1], self.props.content[j][2], value)
        }
      })();

      children.push({ type: window.CoNDeT.ui.CellComponent, id: i,
        props: { value: this.props.content[i][0], type: "td", changeValue: changeValue } });
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

