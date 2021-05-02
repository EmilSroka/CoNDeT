window.CoNDeT.data = {
  State: (function () {
    function constructor() {}

    constructor.prototype.state = [];
    constructor.prototype.subscribers = [];

    constructor.prototype.methods = {
      subscribe: function (fun) {
        this.subscribers.push(fun);
      },
      set: function (state) {
        this.state = state;
        this.call_subscribers();
      },
      call_subscribers: function () {
        this.subscribers.forEach((element) => {
          element.call();
        });
      },
    };
    return constructor;
  })(),
};
