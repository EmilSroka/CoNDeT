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
