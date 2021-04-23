window.CoNDeT.ui = {
    BaseComponent: {
        state: {

        },
        common: {

        },
        init: function(common, props) {
            this.ref = this.onInit();
        },
        update: function(common, props) {
            children.update();
            this.onUpdate();
            this.ref.onUpdate();
        },
        destroy: function(common, props) {
            children.destroy();
            this.onDestroy();
            this.ref.onDestroy();
        },
        getPosition: function() {
            return {
                x: this.domReference.offsetLeft,
                y: this.domReference.offsetTop
            };
        },
        getDimensions: function() {
            return {
                width: this.domReference.clientWidth,
                height: this.domReference.clientHeight
            }
        },
        containsPoint: function(x, y) {
            return (x >= this.domReference.offsetLeft && 
                x <= this.domReference.offsetLeft + this.domReference.clientWidth &&
                y >= this.domReference.offsetTop &&
                y <= this.domReference.offsetTop + this.domReference.clientHeight) ? true : false;
        },
        setState: function(state) {
            this.state.onDestroy();
            this.state = state;
            this.state.onInit();
        },
        setupEventListeners: function() {
            var self = this;
            
            ref.addEventListener('keyup', function() {
                self.strategy.onKeyUp();
            });
            ref.addEventListener('keydown', function() {
                self.strategy.onKeyDown();
            });
            ref.addEventListener('mouseup', function(component) {
                component.onInit();
                self.strategy.onMouseUp();
            });
            ref.addEventListener('mousedown', function(component) {
                component.onInit();
                self.strategy.onMouseDown();
            });
        },
        appendChild: function(child, props, position = 0) {
            var child = new BaseComponent.init(this.common, props); // ???
            this.children.splice(position, 0, child);
        },
        removeChild: function(child, props, position = 0) {
            var child = new BaseComponent.init(this.common, props);
            position > -1 ? this.children.splice(position, 1) : false;
        },
    }
}