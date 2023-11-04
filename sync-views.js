// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
class SyncViews{
  static debug = false;
  static view_classes = {};
  static view_instances = [];

  static addViewClass(viewClass){
    this.view_classes[viewClass.name] = viewClass;

    if(this.debug){
      console.log('SyncViews:', 'Added View Class', viewClass.name);
    }

    this.sync();
  }

  static sync(){
    // Select all uninitialized views
    const els = document.querySelectorAll('[data-view]:not([data-view-initialized])');

    // Instantiate
    els.forEach((el)=>{
      if(!this.view_classes[el.dataset.view]) return;

      el.dataset.viewInitialized = 'true';
      this.view_instances.push({
        el: el,
        instance: new this.view_classes[el.dataset.view](el)
      });

      if(this.debug){
        console.log('SyncViews:', 'Instantiated', el.dataset.view, 'for el:', el);
      }
    });

    // Remove instances that are not in dom
    this.view_instances = this.view_instances.filter((view_instance)=>{
      if(document.body.contains(view_instance.el) == false){
        if(this.debug){
          console.log('SyncViews:', 'Removed', view_instance.instance.constructor.name , 'instance for el:', view_instance.el);
        }

        view_instance.instance.undelegateEvents();
        delete view_instance.instance;
        delete view_instance.el;
        return false;
      }

      return true;
    });
  }
}
