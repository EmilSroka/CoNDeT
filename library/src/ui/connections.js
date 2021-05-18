window.CoNDeT.ui.ConnectionsComponent = (function () {
  var constructor = function () {};

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = 'ConnectionsComponent';

  constructor.prototype.createRef = function () {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.createMarks(svg);
    return svg;
  };
  constructor.prototype.getChildren = function () {
    var children = [];
    for (var i = 0; this.props.connections; i++) {
      var path = props.connections[i].path.map(function (point) {
        return { x: point.x + common.deltaXY.x, y: point.y + common.deltaXY.y };
      });
      children.push({
        type: window.CoNDeT.ui.ConnectionComponent,
        id: this.props.connections[i].id,
        props: { path: path },
      });
    }
    return children;
  };
  constructor.prototype.onUpdate = function () {
    this.ref.setAttribute(
      'viewBox',
      '0 0 ' + this.props.x + ' ' + this.props.y
    );
  };
  constructor.prototype.createMarks = function (svg) {
    svg.appendChild(this.createMark('arrow', 'black'));
    svg.appendChild(this.createMark('hover-arrow', 'red'));
  };
  constructor.prototype.createMark = function (id, color) {
    let arrow = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'marker'
    );
    arrow.setAttribute('id', id);
    arrow.setAttribute('viewBox', '0 0 4.5 4.5');
    arrow.setAttribute('refX', 1);
    arrow.setAttribute('refY', 2.25);
    arrow.setAttribute('markerWidth', 4.5);
    arrow.setAttribute('markerHeight', 4.5);
    arrow.setAttribute('orient', 'auto');

    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 0 0 L 5.5 2.25 L 0 4.5 z');
    path.setAttribute('fill', color);
    arrow.appendChild(path);

    return arrow;
  };

  return constructor;
})();

window.CoNDeT.ui.ConnectionComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = 'ConnectionComponent';

  constructor.prototype.createRef = function () {
    return document.createElementNS('http://www.w3.org/2000/svg', 'g');
  };
  constructor.prototype.getChildren = function () {
    var lastPointIdx = this.props.path.length - 1;
    return [
      { type: window.CoNDeT.ui.LineComponent, id: 'line', props: this.props },
      {
        type: window.CoNDeT.ui.ArrowComponent,
        id: 'arrow',
        props: {
          x: this.props.path[lastPointIdx].x,
          y: this.props.path[lastPointIdx].y,
        },
      },
    ];
  };

  return constructor;
})();

window.CoNDeT.ui.LineComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = 'LineComponent';

  constructor.prototype.createRef = function () {
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('marker-end', 'url(#arrow)');
    path.setAttribute('fill', 'none');
    return path;
  };
  constructor.prototype.onUpdate = function () {
    this.ref.setAttribute('d', calcPath(props.path));
  };

  return constructor;

  function calcPath(path) {
    var d = 'M ' + path[0].x + ' ' + path[0].y;
    for (var i = 1; i < path.length; i++) {
      var point = 'L ' + path[i].x + ' ' + path[i].y;
      d += point;
    }
    return d;
  }
})();
