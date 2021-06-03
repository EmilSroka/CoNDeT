window.CoNDeT.ui.RowDisplayMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var self = this;

    var children = [];
    for (var i = 0; i < this.component.props.content.length; i++) {
      children.push({
        type: window.CoNDeT.ui.CellComponent,
        id: i,
        props: {
          value: this.component.props.content[i][0],
          type: "td",
          changeValue: function () {},
          disabled: false,
        },
      });
    }
    return children;
  };

  return constructor;
})();
