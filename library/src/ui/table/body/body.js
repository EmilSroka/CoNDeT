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
    var last = 0;
    for (var i = 0; i < this.props.rows.length; i++) {
      children.push({
        type: window.CoNDeT.ui.RowComponent,
        id: i,
        props: {
          tableID: this.props.tableID,
          numberOfConditions: this.props.numberOfConditions,
          content: this.props.rows[i].content,
          id: this.props.rows[i].id,
          editCell: this.props.editCell,
        },
      });
      last = i;
    }
    children.push({
      type: window.CoNDeT.ui.RowComponent,
      id: "add-row",
      props: {
        tableID: this.props.tableID,
        numberOfConditions: this.props.numberOfConditions,
        content: [],
        id:
          "add-" +
          (this.props.rows.length > 0 ? this.props.rows[last].id : "rowid0"),
      },
    });
    return children;
  };

  return constructor;
})();
