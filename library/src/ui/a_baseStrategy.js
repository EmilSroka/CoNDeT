window.CoNDeT.ui.StrategyCommon = {
  onDestroy: function () {},
  onInit: function (component) { this.component = component },
  getChildren: function () { return []; },
  onDbClick: function () {},
  onKeyUp: function () {},
  onKeyDown: function () {},
  onMouseUp: function () {},
  onMouseDown: function () {},
  onMouseMove: function () {},
  onMouseLeave: function () {},
  onMouseEnter: function () {},
}

window.CoNDeT.ui.BaseStrategy = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  return constructor;
})();
