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
