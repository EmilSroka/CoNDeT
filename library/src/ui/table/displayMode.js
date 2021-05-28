window.CoNDeT.ui.TableComponentDisplayMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.render = function () {
    return [
      {
        type: window.CoNDeT.ui.NameComponent,
        id: this.component.props.id + "_caption",
        props: {
          name: this.component.props.name,
          class: this.component.props.class,
          id: this.component.props.id,
        },
      },
      {
        type: window.CoNDeT.ui.HeadComponent,
        id: this.component.props.id + "_header",
        props: {
          conditions: this.component.props.conditions,
          decisions: this.component.props.decisions,
        },
      },
      {
        type: window.CoNDeT.ui.BodyComponent,
        id: this.component.props.id + "_body",
        props: { content: this.component.props.rows },
      },
    ];
  };

  return constructor;
})();
