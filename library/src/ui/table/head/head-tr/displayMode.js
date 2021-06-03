window.CoNDeT.ui.HeadTrDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    var self = this;
    var children = [];

    for (var i = 0; i < this.component.props.conditions.length; i++) {
      var editCondition = (function () {
        var j = i;
        return function (value) {
          self.props.editCondition(j, value);
        };
      })();
      children.push({
        type: window.CoNDeT.ui.CellComponent,
        id: children.length,
        props: {
          value: this.component.props.conditions[i],
          className: "condition",
          type: "th",
          changeValue: editCondition,
        },
      });
    }
    for (var i = 0; i < this.component.props.decisions.length; i++) {
      var editDecision = (function () {
        var j = i;
        return function (value) {
          self.props.editDecision(j, value);
        };
      })();
      children.push({
        type: window.CoNDeT.ui.CellComponent,
        id: children.length,
        props: {
          value: this.component.props.decisions[i],
          className: "decision",
          type: "th",
          changeValue: editDecision,
        },
      });
    }
    return children;
  };

  return constructor;
})();
