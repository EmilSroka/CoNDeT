window.CoNDeT = (function (configs) {
  var displayClassName = configs.displayClass || 'condet-display';

  var state = window.CoNDeT.data.State()
  var display = window.CoNDeT.ui.DisplayComponent();
  display.init({
    className: displayClassName,
    data: state.state,
  });

  state.subscribe(function (newState) {
    display.update({
      className: displayClassName,
      data: newState,
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
})()