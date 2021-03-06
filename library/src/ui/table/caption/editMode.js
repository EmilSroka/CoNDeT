window.CoNDeT.ui.CaptionEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onDbClick = function (event) {
    event.stopPropagation();
    this.component.setStrategy(new window.CoNDeT.ui.CaptionEditState())
  }

  constructor.prototype.getChildren = function () {
    var self = this;

    var deleteTable = function () {
      self.component.common.stateModifier.removeTable(self.component.props.id);
    }

    return [
      { type: window.CoNDeT.ui.IconBtnComponent, id: "delete-table", props: {
        action: deleteTable, icon: this.component.common.icons.delete, className: "delete-table-btn", label: "Delete table"
      }},
      { type: window.CoNDeT.ui.TextComponent, id: "name-edit", props: { isSmall: false, value: this.component.props.name }},
      { type: window.CoNDeT.ui.TextComponent, id: "class-edit", props: { isSmall: true, value: " (class: " + this.component.props.class }},
      { type: window.CoNDeT.ui.TextComponent, id: "id-edit", props: { isSmall: true, value: ", id: " + this.component.props.id + ")" }}
    ];
  }

  return constructor;
})();

window.CoNDeT.ui.CaptionEditState = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onKeyDown = function (event) {
    if (event.keyCode !== 13) return;

    this.component.props.changeName(this.component.children[0].ref.value)
    this.component.props.changeClass(this.component.children[2].ref.value)
    this.component.props.changeId(this.component.children[4].ref.value)

    this.component.setStrategy(new window.CoNDeT.ui.CaptionEditMode())
  }

  constructor.prototype.getChildren = function () {
    return [
      { type: window.CoNDeT.ui.InputComponent, id: "input-name", props: { onSubmit: function () {}, value: this.component.props.name }},
      { type: window.CoNDeT.ui.TextComponent, id: "separator-1", props: { isSmall: true, value: " (class: " }},
      { type: window.CoNDeT.ui.InputComponent, id: "input-class", props: { onSubmit: function () {}, value: this.component.props.class }},
      { type: window.CoNDeT.ui.TextComponent, id: "separator-2", props: { isSmall: true, value: ", id: " }},
      { type: window.CoNDeT.ui.InputComponent, id: "input-id", props: { onSubmit: function () {}, value: this.component.props.id }},
      { type: window.CoNDeT.ui.TextComponent, id: "separator-3", props: { isSmall: true, value: " )" }},
    ];
  }

  return constructor;
})();
