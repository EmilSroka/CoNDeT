/*
 * props:
 * * id
 * * name
 * * coordinates
 * * class -> name of CoNDeT class
 * * conditions -> list of conditions (strings)
 * * decisions -> list of decisions (strings)
 * * rows -> content of table
 */
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

    return [
      { type: window.CoNDeT.ui.CaptionComponent, id: this.props.id + "_caption",
        props: { name: this.props.name, class: this.props.class, id: this.props.id,
          changeName: editName, changeClass: editClass, changeId: editId}},
      { type: window.CoNDeT.ui.HeadComponent, id: this.props.id + "_header", props: {
        id: this.props.id, conditions: this.props.conditions, decisions: this.props.decisions,
        editCondition: editCondition, editDecision: editDecision
      }},
      { type: window.CoNDeT.ui.BodyComponent, id: this.props.id + "_body", props: {
        rows: this.props.rows, editCell: editCell, numberOfConditions: this.props.conditions.length
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
})();
