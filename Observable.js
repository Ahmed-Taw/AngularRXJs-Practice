function Observable(forEach){
    this._forEach = forEach;
}

Observable.prototype = {
    forEach: function(onNext, onError, onCompleted){
        if(typeof onNext === "function"){
            return this._forEach({
                onNext: onNext,
                onError: onError || function(){},
                onCompleted: onCompleted || function() {}
            })
        }else{
            return this._forEach(onNext);
        }
    },

    map: function(projectionFunction){
        var self = this;
        return new Observable(function forEach(observer){
            return self.forEach(
               function onNext(x) { observer.onNext(projectionFunction(x))},
            )
        })
    },

    filter: function(predicateFunction){
        var self = this;

        return new Observable (function forEach(observer){
             return self.forEach(
                function onNext(x) { if(predicateFunction(x)){return observer.onNext(x);} }
             )
        }
       )
    }
    
}


Observable.fromEvent = function(dom, eventName){
    return new Observable(function forEach(observer) {
        var handler= (e)=> observer.onNext(e);
         dom.addEventListener(eventName, handler);
            return {
                dispose: () => {
                    dom.removeEventListener(eventName,handler);
                }
            }
    });
}