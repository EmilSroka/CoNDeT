/*
* BaseComponent API
* createRef -> method that should return new dom element that corresponds to this component
* [optional] getChildren -> method that returns array of objects that represents children: {type, id, props}
*   order of elements in returned array will be reflected in dom
* [optional] onInit -> method for additional functionality during initialization
* [optional] onUpdate -> method for additional functionality during update
* [optional] onDestroy -> method for additional functionality during destroy
* */
window.CoNDeT.ui.BaseComponent = {
  /* component life cycle */
  init: function (common, props) {
    this.children = [];
    this.setStrategy(window.CoNDeT.ui.BaseStrategy);
    this.common = common;
    this.props = props;
    this.ref = this.createRef();
    this.onInit();
    this.updateChildren(this.getChildren());
    this.onUpdate();
  },
  createRef: function () { throw new Error("Component must implement createRef method"); },
  getChildren: function () { return []; },
  onInit: function () {},
  update: function (props) {
    this.props = props;
    this.updateChildren(this.getChildren());
    this.onUpdate();
  },
  onUpdate: function () {},
  destroy: function () {
    this.destroyChildren();
    this.ref.remove();
    this.onDestroy();
  },
  onDestroy: function () {},
  /* children update */
  updateChildren: function(newChildren) {
    this.unmark(this.children);
    this.unmark(newChildren);
    this.markCorrespondedChildren(this.children, newChildren);
    this.deleteUnmarked(this.children);
    this.setInSameOrder(newChildren);
    this.updateChildren(newChildren);
    this.initNewChildren();
  },
  unmark: function (array) {
    for (var i=0; i<array; i++) {
      array[i].marked = false;
    }
  },
  markCorrespondedChildren: function (array1, array2) {
    for (var i=0; i<array1; i++) {
      var current = array1[i];
      for (var j=0; i<array2; j++) {
        var child = this.findChild(current.type, current.id);
        if (child == null) continue;
        child.marked = true;
        current.marked = true;
      }
    }
  },
  deleteUnmarked: function (array) {
    for (var i=0; i<array; i++) {
      if (!array[i].marekedToUpdate)
        this.removeChild(array[i]);
    }
  },
  setInSameOrder: function (newChildren) {
    for (var childIdx=0, newChildIdx=0; newChildIdx<newChildren.length; newChildIdx++) {
      var currentNewChild = newChildren[newChildIdx];

      var correspondedIdx = findIndexOfChild(currentNewChild.type, currentNewChild.id);

      if (correspondedIdx === childIdx) {
        var component = this.children[correspondedIdx];
        var node = this.ref.removeChild(component.ref);
        this.children.splice(correspondedIdx, 1);

        this.children.splice(childIdx, 0, component);
        if (childIdx === this.children.length) {
          this.ref.appendChild(node);
        } else {
          this.ref.insertBefore(node, this.children[childIdx]);
        }
      }
      childIdx++;
    }
  },
  updateChildren: function (newChildren) {
    for (var i=0; i<newChildren; i++) {
      var corresponded = this.findChild(newChildren[i].type, newChildren[i].id);
      if (corresponded == null) continue;
      corresponded.update(newChildren[i].props);
    }
  },
  initNewChildren: function () {
    for (var i=0; i<newChildren; i++) {
      var corresponded = this.findChild(newChildren[i].type, newChildren[i].id);
      if (corresponded != null) continue;
      this.createChild(newChildren[i].type, newChildren[i].props, i);
    }
  },
  findChild: function (type, id) {
    if (this.children == null) return;

    var idx = this.findIndexOfChild(type, id);
    if (idx == null) return;
    return this.children[idx];
  },
  findIndexOfChild: function (type, id) {
    if (this.children == null) return;

    for (let i = 0; i < children.length; i++) {
      if (children[i].typeId === Component.typeId && children[i].id === id)
        return i;
    }
  },
  destroyChildren: function () {
    if (this.children == null) return;

    for (let i = 0; i < children.length; i++) {
      children[i].destroy(common);
    }
  },
  /* dimensions */
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
  /* strategy */
  setStrategy: function (strategy) {
    if (this.strategy != null) this.strategy.onDestroy();
    this.strategy = strategy;
    this.strategy.onInit(this);
  },
  setupEventListeners: function () {
    var self = this;

    this.ref.addEventListener("keyup", function (event) {
      self.strategy.onKeyUp(event);
    });
    this.ref.addEventListener("keydown", function (event) {
      self.strategy.onKeyDown(event);
    });
    this.ref.addEventListener("mouseup", function (event) {
      self.strategy.onMouseUp(event);
    });
    this.ref.addEventListener("mousedown", function (event) {
      self.strategy.onMouseDown(event);
    });
    this.ref.addEventListener("mousemove", function (event) {
      self.strategy.onMouseMove(event);
    });
    this.ref.addEventListener("mouseover", function (event) {
      self.strategy.onMouseOver(event);
    });
  },
  /* child management */
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
    ComponentRef.init(this.common, props);
    this.appendChild(child, position);
  },
  removeChild: function (component) {
    if (this.children == null) return;
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === component) {
        this.children[i].destroy();
        this.children.splice(i, 1);
      }
    }
  },
  removeChildAtPosition: function (position) {
    if (position <= -1 || position >= this.children.length) return;
    var childToRemove = this.children[position];
    this.removeChild(childToRemove);
  },
};
