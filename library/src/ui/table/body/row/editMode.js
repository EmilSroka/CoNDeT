window.CoNDeT.ui.RowEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var self = this;

    var children = [];

    if (this.component.props.id.substring(0, 4) === "add-") {
      children.push({
        type: window.CoNDeT.ui.IconBtnComponent,
        id: "add-row",
        props: {
          action: function () {
            self.component.common.stateModifier.addRow(
              self.component.props.tableID,
              {
                row_id:
                  "rowid" +
                  (self.component.props.id
                    ? +self.component.props.id.substring(9) + 1
                    : "1"),
                conditions: [],
                decisions: [],
                connections: [],
              }
            );
          },
          icon: this.component.common.icons.add,
          className: "add-column-btn",
          label: "Add row",
        },
      });
    } else {
      children.push({
        type: window.CoNDeT.ui.IconBtnComponent,
        id: "delete-row",
        props: {
          action: function () {
            self.component.common.stateModifier.removeRow(
              self.component.props.tableID,
              self.component.props.id
            );
          },
          icon: this.component.common.icons.delete,
          className: "delete-column-btn",
          label: "Delete row",
        },
      });
      this.lastRowId = +self.component.props.id.slice(-1);
    }

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
