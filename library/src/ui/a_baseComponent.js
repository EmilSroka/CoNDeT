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
  init: function (common, id, props) {
    this.id = id;
    this.state = {};
    this.children = [];
    this.common = common;
    this.props = props;
    this.ref = this.createRef();
    this.onInit();
    this.setStrategy(common.mode.getEntryStrategy(this));
    this.updateChildren(this.getChildren());
    this.onUpdate();
    this.setupEventListeners();
  },
  createRef: function () { throw new Error("Component must implement createRef method"); },
  getChildren: function () { return this.strategy.getChildren(); },
  onInit: function () {},
  update: function (props) {
    if (window.CoNDeT.core.equals(this.props, props)) return;

    this.props = props;
    this.render();
  },
  onUpdate: function () {},
  destroy: function () {
    this.destroyChildren();
    this.ref.remove();
    this.onDestroy();
  },
  onDestroy: function () {},
  render: function () {
    this.updateChildren(this.getChildren());
    this.onUpdate();
  },
  /* state management */
  setState: function (updated) {
    var newState = {};
    for (var prop in this.state) {
      newState[prop] = this.state[prop];
    }
    for (var prop in updated) {
      newState[prop] = updated[prop];
    }
    this.state = newState;
    this.render();
  },
  /* children update */
  updateChildren: function (newChildren) {
    this.unmark(this.children);
    this.unmark(newChildren);
    this.markCorrespondedChildren(newChildren);
    this.deleteUnmarkedChildren();
    this.setInSameOrder(newChildren);
    this.initNewChildren(newChildren);
    this.updateChildrenProps(newChildren);
  },
  unmark: function (array) {
    for (var i=0; i<array.length; i++) {
      array[i].marked = false;
    }
  },
  markCorrespondedChildren: function (array) {
    for (var i=0; i<array.length; i++) {
      var current = array[i];
      var child = this.findChild(current.type, current.id);
      if (child == null) continue;
      child.marked = true;
      current.marked = true;
    }
  },
  deleteUnmarkedChildren: function () {
    var childrenCopy = window.CoNDeT.core.copy(this.children);

    for (var i=0; i<childrenCopy.length; i++) {
      if (!childrenCopy[i].marked) {
        this.removeChild(childrenCopy[i]);
      }
    }
  },
  setInSameOrder: function (newChildren) {
    for (var childIdx=0, newChildIdx=0; newChildIdx<newChildren.length; newChildIdx++) {
      var currentNewChild = newChildren[newChildIdx];

      var correspondedIdx = this.findIndexOfChild(currentNewChild.type, currentNewChild.id);

      if (correspondedIdx === childIdx) {
        var component = this.children[correspondedIdx];
        var node = this.ref.removeChild(component.ref);
        this.children.splice(correspondedIdx, 1);

        if (childIdx === this.children.length) {
          this.ref.appendChild(node);
        } else {
          this.ref.insertBefore(node, this.children[childIdx].ref);
        }
        this.children.splice(childIdx, 0, component);
      }
      childIdx++;
    }
  },
  updateChildrenProps: function (newChildren) {
    for (var i=0; i<newChildren.length; i++) {
      var corresponded = this.findChild(newChildren[i].type, newChildren[i].id);
      if (corresponded == null) continue;
      corresponded.update(newChildren[i].props);
    }
  },
  initNewChildren: function (newChildren) {
    for (var i=0; i<newChildren.length; i++) {
      var corresponded = this.findChild(newChildren[i].type, newChildren[i].id);
      if (corresponded != null) continue;
      this.createChild(newChildren[i].type, newChildren[i].props, newChildren[i].id, i);
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

    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].typeId === type.prototype.typeId && this.children[i].id === id)
        return i;
    }
  },
  destroyChildren: function () {
    if (this.children == null) return;

    for (var i = 0; i < this.children.length; i++) {
      this.children[i].destroy(this.common);
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
    this.render();
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
    this.ref.addEventListener("mouseleave", function (event) {
      self.strategy.onMouseLeave(event);
    });
    this.ref.addEventListener("mouseenter", function (event) {
      self.strategy.onMouseEnter(event);
    });
    this.ref.addEventListener("dblclick", function (event) {
      self.strategy.onDbClick(event);
    });
  },
  /* child management */
  appendChild: function (child, position = 0) {
    if (this.children == null || position > this.children.length) return;
    if (position === this.children.length) {
      this.ref.appendChild(child.ref);
    } else {
      this.ref.insertBefore(child.ref, this.children[position].ref);
    }
    this.children.splice(position, 0, child);
  },
  createChild: function (ComponentRef, props, id, position = 0) {
    var child = new ComponentRef();
    child.init(this.common, id, props);
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
