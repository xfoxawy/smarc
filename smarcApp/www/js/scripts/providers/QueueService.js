smarc.service('Queue', [function(){
    var items    = [];
    var working  = false;
    var injector = angular.element(document).injector();

    // register to the Q
    this.enqueue = function(item){
        // add to array
        items.unshift(item);

        if (!this.isWorking()) {
            this.dequeue();
        }
    };

    this.dequeue = function(){
        var self = this;
        this.dequeueOne(function(){
            self.dequeue();
        });
    };

    // process the item
    this.dequeueOne = function(cb){

        // get the last item to processed first
        if ( !this.isEmpty() ) {
            this.working = true;
            var item = items[items.length - 1];
            injector.get(item['model'])[item['method']](item.data).then(function(data){
                item['success'](data);

                // remove the item
                items.pop();
                if (typeof cb === 'function') {
                    return cb();
                }
            }, function(e){
                item['error'](e);

                // remove the item
                items.pop();
                if (typeof cb === 'function') {
                    return cb();
                }
            });
        } else {
            this.working = false;
            return true;
        }
    };

    // take a look into the current item without dequeuing it
    this.peek = function(){
        return items[items.length - 1];
    };

    // return queue length
    this.getLength = function(){
        return items.length;
    };

    // return boelen
    this.isEmpty = function(){
        return (items.length) ? false : true;
    };

    this.isWorking = function(){
        return this.working;
    };
}]);
