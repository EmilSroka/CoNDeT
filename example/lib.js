window.CoNDeT = function (configs) {
  var displayClassName = configs.displayClass || 'condet-display';

  var state = new window.CoNDeT.data.State();
  var display = new window.CoNDeT.ui.DisplayComponent();
  display.children = [];
  display.onInit(null, {
    className: displayClassName,
    data: state.state,
    algo: window.CoNDeT.core.getLinePoints
  });
  display.setupEventListeners();
  display.setState(new window.CoNDeT.ui.DisplayMode());



  state.subscribe(function (newState) {
    display.onUpdate(null, {
      className: displayClassName,
      data: newState,
      algo: window.CoNDeT.core.getLinePoints
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

window.CoNDeT.ui.BaseComponent = {
  init: function (common, props) {
    this.children = [];
    this.common = common || {};
    this.ref = this.onInit(common, props);
    this.setupEventListeners();
  },
  update: function (common, props) {
    this.common = common || {};
    this.onUpdate(common, props);
  },
  destroy: function (common) {
    if (this.children != null) {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].destroy(common);
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
    this.state.onInit(this);
  },
  setupEventListeners: function () {
    var self = this;

    this.ref.addEventListener("keyup", function (event) {
      if (self.state == null) return;
      self.state.onKeyUp(event);
    });
    this.ref.addEventListener("keydown", function (event) {
      if (self.state == null) return;
      self.state.onKeyDown(event);
    });
    this.ref.addEventListener("mouseup", function (event) {
      if (self.state == null) return;
      self.state.onMouseUp(event);
    });
    this.ref.addEventListener("mousedown", function (event) {
      if (self.state == null) return;
      self.state.onMouseDown(event);
    });
    this.ref.addEventListener("mousemove", function (event) {
      if (self.state == null) return;
      self.state.onMouseMove(event);
    });
  },
  appendChild: function (child, position = 0) {
    if (this.children == null || position > this.children.length) return;
    if (position === this.children.length) {
      this.ref.appendChild(child.ref);
    } else {
      this.ref.insertBefore(child.ref, this.children[position].ref);
    }
    this.children.splice(position, 0, child);
  },
  createChild: function (ComponentRef, props, position = 0) {
    var child = new ComponentRef();
    child.init(this.common, props);
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
}

window.CoNDeT.ui.DisplayMode = (function () {
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
  })();

window.CoNDeT.ui.Connections = (function(){
    var constructor = function () {};

    constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

    constructor.prototype.onInit = function(common, props) {
      var element = document.createElementNS('http://www.w3.org/2000/svg','svg');
      // element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      // element.setAttribute('style', 'display: block; width: ' + props.dimensions.width + 'px; height: ' + props.dimensions.height + 'px');
      this.ref = element;
      element.setAttribute('viewBox', '0 0 ' + props.dimensions.width + ' ' + props.dimensions.height);
      for (var i=0; i < props.connections.length; i++) {
        var path = props.connections[i].path.map(function (point) {
          return { x: point.x + common.deltaXY.x, y: point.y + common.deltaXY.y }
        });
        this.createChild(window.CoNDeT.ui.Connection, {
          id: props.connections[i].id,
          path: path,
        });
      }
      return element;
    }

    constructor.prototype.onUpdate = function(common, props) {
      var usused = findConnectionsWithoutCorrespondedId(this.children, props.connections);
      for (var i=0; i<usused; i++) {
        this.removeChild(usused[i]);
      }

      for (var i=0; i<props.connections; i++) {
        var correspondedChild = findConnectionById(this.children, props.connections[i][0]);
        var path = props.path.map(function (point) {
          return { x: point.x + common.deltaXY.x, y: point.y + common.deltaXY.y }
        });
        var connectionProps = {
          id: props.connections[i][0],
          path: path,
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
  })();

window.CoNDeT.ui.Connection = (function () {
    function constructor() {}

    constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

    constructor.prototype.onInit = function(common, props) {
      var element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      element.setAttribute('stroke', '#000000');
      element.setAttribute('fill', 'none');
      this.ref = element;
      element.setAttribute('d', this.calcPath(props.path));
      // this.createChild(window.CoNDeT.ui.Arrow, {
      //   x: props.path[props.path.length - 1].x,
      //   y: props.path[props.path.length - 1].y,
      // })
      return element;
    }

    constructor.prototype.onUpdate = function(common, props) {
      this.ref.setAttribute('d', this.calcPath(props.path));
      // this.children[0].update({
      //   x: props.path[props.path.length - 1].x,
      //   y: props.path[props.path.length - 1].y,
      // });
    }

    constructor.prototype.onDestroy = function () {
      this.ref.remove();
    }

    constructor.prototype.calcPath = function (path) {
      var d = 'M ' + path[0].x + ' ' + path[0].y;
      for (var i=1; i < path.length; i++) {
        var point = ' L ' + path[i].x + ' ' + path[i].y;
        d += point;
      }
      return d;
    }

    return constructor;
  })();

window.CoNDeT.ui.Arrow = (function () {
    function constructor() {}

    constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

    constructor.prototype.onInit = function(common, props) {
      var element = document.createElement('path');
      this.ref = element;
      var d = 'M ' + props.x + ' ' + props.y +
          'L ' + props.x - 5 + ' ' + props.y - 5 +
          'L ' + props.x - 5 + ' ' + props.y + 5 + ' Z';
      element.setAttribute('d', d);
      return element;
    }

    constructor.prototype.onUpdate = function(common, props) {
      var d = 'M ' + props.x + ' ' + props.y +
          'L ' + props.x - 5 + ' ' + props.y - 5 +
          'L ' + props.x - 5 + ' ' + props.y + 5 + ' Z';
      this.ref.setAttribute('d', d);
    }

    constructor.prototype.onDestroy = function () {
      this.ref.remove();
    }

    return constructor;
  })();

window.CoNDeT.ui.DisplayComponent = (function () {
    function constructor() {
      this.common = {};
    }

    constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

    // todo(es): destructuring
    constructor.prototype.setCurrentXY = function ({ x, y }) {
      this.common.deltaXY = { x: x, y: y };
      this.update(this.common, this.props);
    };

    constructor.prototype.getCurrentXY = function () {
      return this.common.deltaXY;
    };

    constructor.prototype.prepareData = function (tablesJSON) {
      var tablesList = [];
      for (var i = 0; i < tablesJSON.length; i++) {
        var tableProps = tablesJSON[i];
        var rowsPrepared = [];
        for (var j = 0; j < tableProps.rows.length; j++) {
          var row = tableProps.rows[j];
          var content = [];
          for (var k = 0; k < tableProps.columns.conditions.length + tableProps.columns.decisions.length; k++) {
            content.push('');
          }
          for (var k = 0; k < row.conditions.length; k++) {
            content[row.conditions[k][0]] = tableProps.rows[j].conditions[k][1];
          }
          for (var k = 0; k < row.decisions.length; k++) {
            content[row.decisions[k][0] + tableProps.columns.conditions.length] = row.decisions[k][1];
          }
          rowsPrepared.push(content);
        }
        tablesList.push({
          name: tableProps.name,
          class: tableProps.class,
          coordinates: tableProps.coordinates,
          conditions: tableProps.columns.conditions,
          decisions: tableProps.columns.decisions,
          rows: rowsPrepared,
        });

      }

      return tablesList;
    };

    constructor.prototype.prepareConnections = function (tablesJSON) {
      var self = this;

      var connections = [];
      for (var i = 0; i < tablesJSON.length; i++) {
        var rows = tablesJSON[i].rows;
        for (var j = 0; j < rows.length; j++) {
          for (var k = 0; k < rows[j].connections.length; k++) {

            const child = this.children.find(child => child.name === tablesJSON[i].name);
            const another = this.children.find(child => child.name === tablesJSON[i].rows[j].connections[k]);
            var connection = [
              tablesJSON[i].rows[j].connections[k] + '-' +  tablesJSON[i].name,
              child.getRowXY(j),
              another.getPosition(),
            ]
            connections.push(connection);
          }
        }
      }

      connections = connections.map(function (connection) {

        return {
          id: connection[0],
          path: window.CoNDeT.core.getLinePoints({
            startPoint: connection[1],
            endPoint: connection[2],
            freePlaceCallback: function (point) {
              for(var i = 0; i < self.children.length; i++) {
                if (self.children[i].containsPoint(point)) return false;
              }
              return true;
            },
          })
        }
      });

      return connections;

      function getTableIndexByName(name) {
        for (var i = 0; i < tablesJSON.length; i++) {
          if (tablesJSON[i].name === name) return i;
        }
        return null;
      }
    }

    constructor.prototype.onInit = function (common, props) {
      this.props = props;
      var ref = document.getElementsByClassName(props.className)[0];
      this.ref = ref;
      this.setCurrentXY({ x: 0, y: 0 })
      var tables = this.prepareData(props.data);
      for (var i = 0; i < tables.length; i++) {
        this.createChild(window.CoNDeT.ui.Table, tables[i], i);
      }
      var paths = this.prepareConnections(props.data, props.algo);

      this.createChild(window.CoNDeT.ui.Connections, {
        connections: paths,
        dimensions: this.getDimensions(),
      })

      return ref;
    };

    constructor.prototype.onUpdate = function (common, props) {
      this.props = props;
      this.removeChildAtPosition(0);

      var tables = this.prepareData(props.data);
      var unused = findTablesWithoutCorrespondingName(this.children, tables);

      for (var i = 0; i < unused.length; i++) {
        this.removeChild(unused[i]);
      }

      for (var i = 0; i < tables.length; i++) {
        var correspondedChild = findTableByName(this.children, tables[i].name);
        var tablesProps = tables[i];
        if (correspondedChild != null) {
          correspondedChild.update(this.common, tablesProps);
        } else {
          this.createChild(window.CoNDeT.ui.Table, tablesProps);
        }
      }

      var paths = this.prepareConnections(props.data, props.algo);

      this.createChild(window.CoNDeT.ui.Connections, {
        connections: paths,
        dimensions: this.getDimensions(),
      });
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
        if (findTableByName(children, val.name) == null) return acc;
        acc[val.name] = true;
        return acc;
      }, {});

      var unused = [];

      children.forEach(function (child) {
        if (names[child.name]) return;
        unused.push(child);
      });

      return unused;
    }
  })();

window.CoNDeT.ui.Table = (function () {
    function constructor() {}

    constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

    constructor.prototype.onInit = function (common, props) {
      var ref = document.createElement("table");
      this.ref = ref;
      this.name = props.name;
      ref.className = "condet-table";
      var newPosition = {
        x: common.deltaXY.x + props.coordinates.x,
        y: common.deltaXY.y + props.coordinates.y,
      };
      ref.style.cssText = `position: absolute; left: ${newPosition.x}px; top: ${newPosition.y}px`;

      this.createChild(window.CoNDeT.ui.Name, { text: props.name });
      this.createChild(window.CoNDeT.ui.Head, {
        conditions: props.conditions,
        decisions: props.decisions,
      });
      this.createChild(window.CoNDeT.ui.Body, { content: props.rows });

      return ref;
    };
    constructor.prototype.onUpdate = function (common, props) {
      var currentPosition = this.getPosition();
      var newPosition = {
        x: common.deltaXY.x + currentPosition.x,
        y: common.deltaXY.y + currentPosition.y,
      };
      this.ref.style.cssText = `position: absolute; left: ${newPosition.x}; top: ${newPosition.y}`;

      this.children[1].onUpdate(common, { text: props.name });
      this.children[0].onUpdate(common, {
        conditions: props.conditions,
        decisions: props.decisions,
      });
      this.children[2].onUpdate(common, { content: props.rows });


    };
    constructor.prototype.onDestroy = function (common) {
      this.ref.remove();
    };

    constructor.prototype.getRowXY = function (rowNumber) {
      return this.children[0].children[rowNumber].getConnectionXY();
    };

    return constructor;
  })();

window.CoNDeT.ui.Name = (function () {
    function constructor() {}

    constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

    constructor.prototype.onInit = function (common, props) {
      var ref = document.createElement("caption");
      ref.innerHTML = props.text;
      ref.className = "condet-caption";

      return ref;
    };
    constructor.prototype.onUpdate = function (common, props) {
      this.ref.innerHTML = props.text;
    };
    constructor.prototype.onDestroy = function (common) {
      this.ref.remove();
    };

    return constructor;
  })();

window.CoNDeT.ui.Head = (function () {
    function constructor() {}

    constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

    constructor.prototype.appendHeaders = function (headerRef, content) {
      for (let i = 0; i < content.conditions.length; i++) {
        let headerCol = document.createElement("th");
        headerCol.className = "condition";
        headerCol.innerHTML = content.conditions[i];
        headerRef.appendChild(headerCol);
      }

      for (let i = 0; i < content.decisions.length; i++) {
        let headerCol = document.createElement("th");
        headerCol.className = "decision";
        headerCol.innerHTML = content.decisions[i];
        headerRef.appendChild(headerCol);
      }
    };

    constructor.prototype.onInit = function (common, props) {
      var ref = document.createElement("thead");
      this.headerRow = document.createElement("tr");
      ref.appendChild(this.headerRow);

      this.appendHeaders(this.headerRow, {
        conditions: props.conditions,
        decisions: props.decisions,
      });

      return ref;
    };
    constructor.prototype.onUpdate = function (common, props) {
      for (let i = 0; i < this.ref.children.length; i++) {
        this.ref.removeChild(this.ref.children[i]);
      }
      this.appendHeaders(this.headerRow, {
        conditions: props.conditions,
        decisions: props.decisions,
      });
    };
    constructor.prototype.onDestroy = function (common) {
      this.ref.remove();
    };

    return constructor;
  })();

window.CoNDeT.ui.Body = (function () {
    function constructor() {}

    constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

    constructor.prototype.onInit = function (common, props) {
      var ref = document.createElement("tbody");
      this.ref = ref;

      for (let i = 0; i < props.content.length; i++) {
        this.createChild(window.CoNDeT.ui.Row, { content: props.content[i] });
      }

      return ref;
    };
    constructor.prototype.onUpdate = function (common, props) {
      while (0 != this.children.length) {
        this.removeChildAtPosition(0);
      }
      for (let i = 0; i < props.content.length; i++) {
        this.createChild(window.CoNDeT.ui.Row, { content: props.content[i] });
      }
    };
    constructor.prototype.onDestroy = function (common) {
      this.ref.remove();
    };

    return constructor;
  })();

window.CoNDeT.ui.Row = (function () {
    function constructor() {}

    constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

    constructor.prototype.onInit = function (common, props) {
      var ref = document.createElement("tr");;

      for (let i = 0; i < props.content.length; i++) {
        let cell = document.createElement("td");
        cell.innerHTML = props.content[i];
        ref.appendChild(cell);
      }

      return ref;
    };

    constructor.prototype.onUpdate = function (common, props) {};
    constructor.prototype.onDestroy = function (common) {
      this.ref.remove();
    };

    constructor.prototype.getConnectionXY = function () {
      var position = this.getPosition();
      var dimensions = this.getDimensions();
      return { x: position.x + dimensions.width, y: position.y + dimensions.height / 2 };
    };

    return constructor;
  })();

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

window.CoNDeT.core = {
  colorHash: function(inputString) {
    var sum = 0;

    for (var i in inputString) {
      sum += inputString.charCodeAt(i);
    }

    var r = ~~(('0.' + Math.sin(sum + 1).toString().substr(6)) * 210);
    var g = ~~(('0.' + Math.sin(sum + 2).toString().substr(6)) * 210);
    var b = ~~(('0.' + Math.sin(sum + 3).toString().substr(6)) * 210);

    var hex = "#";

    hex += ("00" + r.toString(16)).substr(-2, 2).toUpperCase();
    hex += ("00" + g.toString(16)).substr(-2, 2).toUpperCase();
    hex += ("00" + b.toString(16)).substr(-2, 2).toUpperCase();

    return hex;
  },
  getLinePoints: function(props) {

    var startPoint = props.startPoint;
    var endPoint = props.endPoint;
    var checkIfCanPlacePoint = props.freePlaceCallback;

    return [startPoint, { x: startPoint.x + 40, y: startPoint.y }, endPoint];

    var deltaX = Math.abs(startPoint.x - endPoint.x);
    var deltaY = Math.abs(startPoint.y - endPoint.y);
    while (deltaX > 10 || deltaY > 10) {
      var path = constructPathFromLinesOfLength(deltaX, deltaY, startPoint, endPoint, 3);

      if (path != null) {
        var points = [];
        while (path.prev != null) {
          points.unshift({ x: path.x, y: path.y })
          path = path.prev;
        }
        return points;
      }

      deltaX /= 2;
      deltaY /= 2;
    }

    return [startPoint, endPoint];

    function constructPathFromLinesOfLength(verticalLength, horizontalLength, startPoint, endPoint, numberOfLinesLimiter) {
      // BFS algorithm
      var edges = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      var queue = [];
      var layer = 0;

      queue.push(startPoint);

      while(queue.length !== 0 && layer <= numberOfLinesLimiter){
        layer += 1;
        var size = queue.length;

        for (var i=0; i<size; i++){
          var currentPoint = queue.shift();

          if (currentPoint.x === endPoint.x && currentPoint.y === endPoint.y) {
            return currentPoint;
          }

          for (var j=0; j<edges.length; j++) {
            var edge = edges[j];
            if (checkIfCanPlaceLine(currentPoint, {x: currentPoint.x + horizontalLength * edge[0], y: currentPoint.y + verticalLength * edge[1]})) {
              queue.push({x: currentPoint.x + horizontalLength * edge[0], y: currentPoint.y + verticalLength * edge[1], prev: currentPoint});
            }
          }
        }
      }

      return null;
    }

    function checkIfCanPlaceLine(startPoint, endPoint) {
      var deltaX = startPoint.x - endPoint.x;
      var deltaY = startPoint.y - endPoint.y;

      var numberOfChecks = Math.round(Math.max(Math.abs(deltaX), Math.abs(deltaY)) / 10) || 1;

      for (var i=0; i<numberOfChecks; i++) {
        if (!checkIfCanPlacePoint({
          x: startPoint.x + deltaX/numberOfChecks * i,
          y: startPoint.y + deltaY/numberOfChecks * i,
        })) {
          return false;
        }
      }
      return true;
    }
  }
}

