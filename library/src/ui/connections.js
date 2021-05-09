window.CoNDeT.ui.ConnectionsComponent = (function () {
  var constructor = function () {};

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

  constructor.prototype.onInit = function (common, props) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.setAttribute(
      "viewBox",
      "0 0 " + props.dimentions.x + " " + props.dimentions.y
    );
    for (var i = 0; props.connections; i++) {
      var path = props.connections[i].path.map(function (point) {
        return { x: point.x + common.deltaXY.x, y: point.y + common.deltaXY.y };
      });
      this.createChild(window.CoNDeT.ui.ConnectionComponent, {
        id: props.connections[i][0],
        path: path,
      });
    }
  };

  constructor.prototype.onUpdate = function (common, props) {
    var usused = findConnectionsWithoutCorrespondedId(
      this.children,
      props.connections
    );
    for (var i = 0; i < usused; i++) {
      this.removeChild(usused[i]);
    }

    for (var i = 0; i < props.connections; i++) {
      var correspondedChild = findConnectionById(
        this.children,
        props.connections[i][0]
      );
      var path = props.path.map(function (point) {
        return { x: point.x + common.deltaXY.x, y: point.y + common.deltaXY.y };
      });
      var connectionProps = {
        id: props.connections[i][0],
        path: path,
      };
      if (correspondedChild != null) {
        correspondedChild.update(common, connectionProps);
      } else {
        this.createChild(window.CoNDeT.ui.ConnectionComponent, connectionProps);
      }
    }
  };

  constructor.prototype.onDestroy = function () {
    this.ref.remove();
  };

  return constructor;

  function findConnectionById(children, id) {
    for (var i = 0; i < children.length; i++) {
      if (children[i].id === id) return children[i];
    }
    return null;
  }

  function findConnectionsWithoutCorrespondedId(children, connections) {
    var ids = connections.reduce(function (acc, val) {
      if (findConnectionById(children, val[0]) == null) return acc;
      acc[val[0]] = true;
      return acc;
    }, {});

    var unused = [];

    children.forEach(function (child) {
      if (ids[child.id]) return;
      unused.push(child);
    });

    return unused;
  }
})();
