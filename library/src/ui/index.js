window.CoNDeT.ui = {
  BaseComponent: {
    init: function (common, props) {
      this.children = [];
      this.ref = this.onInit(common, props);
      this.common = common;
    },
    update: function (common, props) {
      this.onUpdate(common, props);
      this.common = common;
    },
    destroy: function (common) {
      if (this.children != null) {
        for (let i = 0; i < children.length; i++) {
          children[i].destroy(common);
        }
      }
      this.onDestroy(common);
    },
    getPosition: function () {
      return {
        x: this.ref.offsetLeft,
        y: this.ref.offsetTop,
      };
    },
    getDimensions: function () {
      return {
        width: this.ref.clientWidth,
        height: this.ref.clientHeight,
      };
    },
    containsPoint: function (x, y) {
      return (
        x >= this.ref.offsetLeft &&
        x <= this.ref.offsetLeft + this.ref.clientWidth &&
        y >= this.ref.offsetTop &&
        y <= this.ref.offsetTop + this.ref.clientHeight
      );
    },
    setState: function (state) {
      if (this.state != null) this.state.onDestroy();
      this.state = state;
      this.state.onInit();
    },
    setupEventListeners: function () {
      var self = this;

      this.ref.addEventListener("keyup", function () {
        self.strategy.onKeyUp();
      });
      this.ref.addEventListener("keydown", function () {
        self.strategy.onKeyDown();
      });
      this.ref.addEventListener("mouseup", function () {
        self.strategy.onMouseUp();
      });
      this.ref.addEventListener("mousedown", function () {
        self.strategy.onMouseDown();
      });
    },
    appendChild: function (child, position = 0) {
      if (this.children == null || position > this.children.length) return;
      if (position === this.children.length) {
        this.ref.appendChild(child);
      } else {
        this.ref.insertBefore(child, this.children[position]);
      }
      this.children.splice(position, 0, child);
    },
    createChild: function (ComponentRef, props, position = 0) {
      var child = new ComponentRef();
      componentRef.init(this.common, props);
      this.appendChild(child, position);
    },
    removeChild: function (component) {
      if (this.children == null) return;
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i] === component) {
          this.children[i].destroy(this.common);
          this.children.splice(i, 1);
        }
      }
    },
    removeChildAtPosition: function (position) {
      if (position <= -1 || position >= this.children.length) return;
      var childToRemove = this.children[position];
      this.removeChild(childToRemove);
    },
  },
  DisplayMode: (function () {
    function constructor() {
      this.deltaXY = null;
      this.currentDelta = null;
    }

    constructor.prototype.updateXY = function (event) {
      if (this.deltaXY == null) return;
      this.ref.setCurrentXY({
        x: this.deltaXY.x + this.currentDelta.x - event.clientX,
        y: this.deltaXY.y + this.currentDelta.y - event.clientY,
      });
    };

    constructor.prototype.onKeyDown = function (event) {};
    constructor.prototype.onKeyUp = function (event) {};
    constructor.prototype.onMouseDown = function (event) {
      this.deltaXY = this.ref.getCurrentXY();
      this.currentDelta = { x: event.clientX, y: event.clientY };
    };
    constructor.prototype.onMouseMove = function (event) {
      this.updateXY(event);
    };
    constructor.prototype.onMouseUp = function (event) {
      this.updateXY(event);
      this.deltaXY = null;
      this.currentDelta = null;
    };
    constructor.prototype.onMouseLeave = function (event) {
      this.updateXY(event);
      this.deltaXY = null;
      this.currentDelta = null;
    };

    constructor.prototype.onInit = function (ref) {
      this.ref = ref;
    };
    constructor.prototype.onDestroy = function () {};

    return constructor;
  })(),
  Connections: (function(){
    var constructor = function () {};

    constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

    constructor.prototype.onInit = function(common, props) {
      var element = document.createElement('svg');
      element.setAttribute('viewBox', '0 0 ' + props.dimentions.x + ' ' + props.dimentions.y);
      for (var i=0; props.connections; i++) {
        this.createChild(window.CoNDeT.ui.Connection, {
          id: props.connections[i][0],
          start: { x: props.connections[i][1].x + common.deltaXY.x, y: props.connections[i][1].y + common.deltaXY.y },
          end: { x: props.connections[i][2].x + common.deltaXY.x, y: props.connections[i][2].y + common.deltaXY.y },
          findingPathAlgorithm: props.findingPathAlgorithm
        })
      }
    }

    constructor.prototype.onUpdate = function(common, props) {
      var usused = findConnectionsWithoutCorrespondedId(this.children, props.connections);
      for (var i=0; i<usused; i++) {
        this.removeChild(usused[i]);
      }

      for (var i=0; i<props.connections; i++) {
        var correspondedChild = findConnectionById(this.children, props.connections[i][0]);
        var connectionProps = {
          id: props.connections[i][0],
          start: { x: props.connections[i][1].x + common.deltaXY.x, y: props.connections[i][1].y + common.deltaXY.y },
          end: { x: props.connections[i][2].x + common.deltaXY.x, y: props.connections[i][2].y + common.deltaXY.y },
          findingPathAlgorithm: props.findingPathAlgorithm
        };
        if (correspondedChild != null) {
          correspondedChild.update(common, connectionProps);
        } else {
          this.createChild(window.CoNDeT.ui.Connection, connectionProps);
        }
      }
    }

    constructor.prototype.onDestroy = function () {
      this.ref.remove();
    }

    return constructor;

    function findConnectionById(children, id) {
      for (var i=0; i<children.length; i++) {
        if (children[i].id === id) return  children[i];
      }
      return null;
    }

    function findConnectionsWithoutCorrespondedId(children, connections) {
      var ids = connections.reduce(function (acc, val) {
        if (findConnectionById(children, val[0]) == null) return acc;
        acc[val[0]] = true;
        return acc;
      }, {})

      var unused = [];

      children.forEach(function (child) {
        if (ids[child.id]) return;
        unused.push(child);
      })

      return unused;
    }
  })(),
  DisplayComponent: (function () {
    function constructor() {
      common = {};
    }

    constructor.prototype.setCurrentXY = function ({ x, y }) {
      common.deltaXY = { x: x, y: y };
    };

    constructor.prototype.getCurrentXY = function () {
      return common.deltaXY;
    };

    constructor.prototype.prepareData = function (tablesJSON) {
      var tablesList = [];
      for (var i = 0; i < tablesJSON.length; i++) {
        var tableProps = tablesJSON[i];
        var rowsPrepared = [];
        for (var j = 0, k = 0; j < tableProps.columns.conditions.length; j++) {
          if (tableProps.rows.conditions[k][1] != null) {
            rowsPrepared.push(tableProps.rows.conditions[k][1]);
            k += 1;
          } else {
            rowsPrepared.push("");
          }
        }
        for (var j = 0, k = 0; j < tableProps.columns.decisions.length; j++) {
          if (tableProps.rows.decisions[k][1] != null) {
            rowsPrepared.push(tableProps.rows.decisions[k][1]);
            k += 1;
          } else {
            rowsPrepared.push("");
          }
        }

        tablesList.push({
          name: tableProps.name,
          class: tableProps.classType,
          coordinates: tableProps.coordinates,
          conditions: tableProps.columns.conditions,
          decisions: tableProps.columns.decisions,
          rows: rowsPrepared,
        });
      }

      return tablesList;
    };

    constructor.prototype.onInit = function (common, props) {
      var ref = document.getElementsByClassName(props.className)[0];
      var tables = this.prepareData(props.state.data);
      for (var i = 0; i < tables.length; i++) {
        this.createChild(window.CoNDeT.ui.Table, tables[i]);
      }

      return ref;
    };

    constructor.prototype.onUpdate = function (common, props) {
      var tables = this.prepareData(props.state.data);
      var unused = findTablesWithoutCorrespondingName(this.children, tables);

      for (var i = 0; i < array.length; i++) {
        this.removeChild(unused[i]);
      }

      for (var i = 0; i < tables.length; i++) {
        var correspondedChild = findTableByName(this.children, tables[i].name);
        var tablesProps = tables[i];
        if (correspondedChild != null) {
          correspondedChild.update(common, tablesProps);
        } else {
          this.createChild(window.CoNDeT.ui.Table, tablesProps);
        }
      }
    };
    constructor.prototype.onDestroy = function (common) {};

    return constructor;

    function findTableByName(children, name) {
      for (var i = 0; i < children.length; i++) {
        if (children[i].name === name) return children[i];
      }
      return null;
    }

    function findTablesWithoutCorrespondingName(children, tables) {
      var names = tables.reduce(function (acc, val) {
        if (findTableByName(children, val[0].name) == null) return acc;
        acc[val[0].name] = true;
        return acc;
      }, {});

      var unused = [];

      children.forEach(function (child) {
        if (names[child.name]) return;
        unused.push(child);
      });

      return unused;
    }
  })(),
};
