window.CoNDeT.ui.HeadTrEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var self = this;
    var children = [];

    for (var i = 0; i < this.component.props.conditions.length; i++) {
      var editCondition = (function () {
        var j = i;
        return function (value) {
          self.component.props.editCondition(j, value);
        };
      })();
      var deleteCondition = (function () {
        var j = i;
        return function () {
          self.component.common.stateModifier.removeConditionColumn(self.component.props.id, j);
        };
      })();

      children.push({
        type: window.CoNDeT.ui.THComponent,
        id: children.length,
        props: {
          value: this.component.props.conditions[i],
          className: "condition",
          changeValue: editCondition,
          delete: deleteCondition,
        },
      });
    }

    children.push({
      type: window.CoNDeT.ui.AddColumnComponent,
      id: "sep-1",
      props: { className: "condition", action: function () {
        var value = prompt("Enter condition value:");
        self.component.common.stateModifier.addConditionColumn(self.component.props.id, value);
      }},
    });

    for (var i = 0; i < this.component.props.decisions.length; i++) {
      var editDecision = (function () {
        var j = i;
        return function (value) {
          self.component.props.editDecision(j, value);
        };
      })();
      var deleteDecision = (function () {
        var j = i;
        return function () {
          self.component.common.stateModifier.removeDecisionColumn(self.component.props.id, j);
        };
      })();

      children.push({
        type: window.CoNDeT.ui.THComponent,
        id: children.length,
        props: {
          value: this.component.props.decisions[i],
          className: "decision",
          changeValue: editDecision,
          delete: deleteDecision,
        },
      });
    }

    children.push({
      type: window.CoNDeT.ui.AddColumnComponent,
      id: "sep-2",
      props: { className: "decision", action: function () {
          var value = prompt("Enter decision value:");
          self.component.common.stateModifier.addDecisionColumn(self.component.props.id, value);
        }},
    });

    return children;
  };

  return constructor;
})();

