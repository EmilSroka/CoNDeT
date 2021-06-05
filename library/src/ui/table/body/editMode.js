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
