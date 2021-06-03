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
  };
  constructor.prototype.getChildren = function () {
    var children = [];
    for (var i = 0; i < this.props.rows.length; i++) {
      children.push({
        type: window.CoNDeT.ui.RowComponent,
        id: i,
        props: {
          numberOfConditions: this.props.numberOfConditions,
          content: this.props.rows[i].content,
          id: this.props.rows[i].id,
          editCell: this.props.editCell,
        },
      });
    }
    return children;
  };

  return constructor;
})();