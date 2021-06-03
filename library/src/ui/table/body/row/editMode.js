window.CoNDeT.ui.RowEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var self = this;

    var children = [];
    for (var i = 0; i < this.component.props.content.length; i++) {
      if (i === this.component.props.numberOfConditions) {
        children.push({
          type: window.CoNDeT.ui.CellComponent,
          id: "sep-1",
          props: {
            value: "",
            type: "td",
            changeValue: function () {},
            disabled: true,
          },
        });
      }

      var changeValue = (function () {
        var j = i;
        return function (value) {
          self.component.props.editCell(
              self.component.props.id,
              self.component.props.content[j][1],
              self.component.props.content[j][2],
              value
          );
        };
      })();

      children.push({
        type: window.CoNDeT.ui.CellComponent,
        id: this.component.props.content[i][3],
        props: {
          value: this.component.props.content[i][0],
          type: "td",
          changeValue: changeValue,
        },
      });
    }

    children.push({
      type: window.CoNDeT.ui.CellComponent,
      id: "sep-2",
      props: {
        value: "",
        type: "td",
        changeValue: function () {},
        disabled: true,
      },
    });

    return children;
  };

  return constructor;
})();
