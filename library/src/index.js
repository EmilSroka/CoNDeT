window.CoNDeT = function (configs) {
  var selector = configs.selector || '.condet-display';

  var state = new window.CoNDeT.data.State()
  var display = new window.CoNDeT.ui.DisplayComponent();
  display.init(
    { deltaXY: { x: 0, y: 0 } },
    { selector: selector, state: state.state }
  );

  display.setupEventListeners();
  display.setStrategy(new window.CoNDeT.ui.DisplayMode());

  state.subscribe(function (newState) {
    display.update({
      selector: selector,
      state: newState,
    });
  });

  return {
    setState: function (newState) {
      state.setState(newState);
    },
    readFromFile: function () {
      window.CoNDeT.data.FileReaderWriter.readFromFile(function (newState) {
        state.setState(newState);
      })
    },
    saveToFile: function () {
      window.CoNDeT.data.FileReaderWriter.saveToFile(state.state);
    }
  }
};

window.CoNDeT.ui = {};
