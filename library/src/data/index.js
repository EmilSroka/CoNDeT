window.CoNDeT.data = {
  State: (function () {
    function constructor() {
      this.state = [];
      this.subscribers = [];
    }

    constructor.prototype.subscribe = function (subscriber) {
      this.subscribers.push(subscriber);
      subscriber(this.state);
    };
    constructor.prototype.setState = function (state) {
      this.state = state;
      this.callSubscribers();
    };
    constructor.prototype.callSubscribers = function () {
      var self = this;
      this.subscribers.forEach(function (cb) {
        cb(self.state);
      });
    };
    return constructor;
  })(),

  FileReaderWriter: {
    readFromFile: function (cb) {
      var element = document.createElement('input');
      element.setAttribute('type', 'file');
      element.setAttribute('accept', '.json');
      element.addEventListener('change', function (event) {
        var file = event.target.files[0];
        var fileReader = new FileReader();

        fileReader.onload = function (e) {
          cb(JSON.parse(e.target.result));
          element.remove();
        };
        fileReader.readAsText(file);
      });
      element.click();
    },

    saveToFile: function (data) {
      var element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' +
          encodeURIComponent(JSON.stringify(data))
      );
      element.setAttribute('download', 'CoNDeT.json');

      element.style.display = 'none';
      document.body.appendChild(element); //Required on firefox

      element.click();

      element.remove();
    },
  },
};
