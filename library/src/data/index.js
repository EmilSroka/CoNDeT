window.CoNDeT.data = {


function State(){

    this.state = [];
    this.subscribers = [];
}
State.prototype = {
    subscribe: function(fun){
        this.subscribers.push(fun);
    },
    set: function(state){
        this.state = state;
        this.call_subscribers();
    },
    call_subscribers: function(){
        this.subscribers.forEach(element => {
            element.call();
        });
    }
}
}