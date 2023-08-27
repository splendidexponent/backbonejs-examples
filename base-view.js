/*
  Experiment: An Implementation of Backbone.js View.
*/

class BaseView{
  constructor(args){
    // https://backbonejs.org/#View-preinitialize
    this.preinitialize(args);

    if(this.debug){
      this.el.style.borderWidth = '1px';
      this.el.style.borderStyle = 'dashed';
      this.el.style.borderColor = 'red';
      console.log(this.constructor.name, 'debug enabled. Remove this.debug to remove red border.');
      console.log(this.constructor.name, 'instantiated el:', this.el);
    }

    this.delegateEvents();
    this.setReferenceElements();
  }

  // https://backbonejs.org/#View-delegateEvents
  delegateEvents(){
    if(!this.events) return;

    // Remove previous delegated events, if any
    if(this.__events_fn && Object.keys(this.__events_fn).length > 0){
      this.undelegateEvents();
    } else {
      this.__events_fn = {};
    }

    for (const event_key in this.events) {
      const method_name = this.events[event_key];
      const event_key_parts = event_key.match(/([^\s]+)\s(.*)/);
      // handle "click" without any selector. click event on el. ie. event_key_parts == null
      const event_name = event_key_parts == null ? event_key : event_key_parts[1];
      const event_el_selector = event_key_parts == null ? this.el : event_key_parts[2];
      
      this.__events_fn[method_name] = (e) => {
        if(event_el_selector == this.el || this.arr_contains(this.q_all(event_el_selector), e.target)){
          if(this.debug){
            console.log(this.constructor.name, `"${event_key}: ${method_name}" triggered, target:`, e.target, 'el:', this.el);
          }

          this[method_name](e);
        }
      }

      // Set events on el, handled with event bubbling.
      this.el.addEventListener(event_name, this.__events_fn[method_name]);
    }

    if(this.debug){
      console.log(this.constructor.name, 'delegating events el:', this.el);
    }
  }

  // https://backbonejs.org/#View-undelegateEvents
  undelegateEvents(){
    if(!this.events || !this.__events_fn) return;

    for (const event_key in this.events) {
      const method_name = this.events[event_key];
      const event_key_parts = event_key.match(/([^\s]+)\s(.*)/);
      // handle "click" without any selector. click event on el. ie. event_key_parts == null
      const event_name = event_key_parts == null ? event_key : event_key_parts[1];

      this.el.removeEventListener(event_name, this.__events_fn[method_name]);
      delete this.__events_fn[method_name];
    }

    if(this.debug){
      console.log(this.constructor.name, 'undelegating events el:', this.el);
    }
  }

  // Helper methods. KEY_el() will return reference element with KEY.
  // Not in backbone
  setReferenceElements(){
    if(!this.reference_elements) return;

    if(this.debug){
      var function_list = [];
    }

    for (const name in this.reference_elements) {
      // This must be a function, as DOM within el could change at anytime.
      this[name + '_el'] = ()=>this.q(this.reference_elements[name]);

      if(this.debug){
        function_list.push('this.' + name + '_el()');
      }
    }

    if(this.debug){
      console.log(this.constructor.name, 'reference element functions:', function_list.join(), 'el:', this.el);
    }
  }

  // Find element within el. Similar to jQuery this.$el.find().
  // https://backbonejs.org/#View-$el
  q(query){
    return this.el.querySelector(query);
  }

  // Find all elements within el. Similar to jQuery this.$el.find().
  // https://backbonejs.org/#View-$el
  q_all(query){
    return this.el.querySelectorAll(query);
  }

  // Checks if given element is present in an array. (Works on node_list)
  arr_contains(arr, element){
    for (let i = 0; i < arr.length; i++) {
      if(element === arr[i]){
        return true;
      }
    }

    return false;
  }
}
