/**
 * This is a common VOTUM module for often used functions.
 *
 * The functions must be without further dependencies outside this module scope.
 *
 * @author    Thomas Heuer <thomas.heuer@votum.de>
 * @copyright Copyright © 2015 VOTUM GmbH
 */
define( function() {

    var module = {

        /**
         * Returns a function, that, as long as it continues to be invoked, will not be triggered.
         * The function will be called after it stops being called for N milliseconds.
         * If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
         *
         * This function is copied from Underscore.js
         * @see https://github.com/jashkenas/underscore
         *
         * @param {Function} func
         * @param {Integer} wait
         * @param {Boolean} immediate
         * @returns {Function}
         */
        debounce: function( func, wait, immediate ) {
            var timeout, args, context, timestamp, result;

            var later = function() {
                var last = new Date().getTime() - timestamp;

                if( last < wait && last >= 0 ) {
                    timeout = setTimeout( later, wait - last );
                }
                else {
                    timeout = null;
                    if( !immediate ) {
                        result = func.apply( context, args );
                        if( !timeout ) {
                            context = args = null;
                        }
                    }
                }
            };

            return function() {
                context = this;
                args = arguments;
                timestamp = new Date().getTime();
                var callNow = immediate && !timeout;
                if( !timeout ) {
                    timeout = setTimeout( later, wait );
                }
                if( callNow ) {
                    result = func.apply( context, args );
                    context = args = null;
                }

                return result;
            };
        },

        /**
         * Recursively merge properties of two objects
         *
         * @param {Object} defaults Default settings
         * @param {Object} options User options
         * @returns {Object} Merged values of defaults and options
         */
        extend: function( defaults, options ) {

            function copy( obj1, obj2, prop ) {
                try {
                    if( obj2[prop].constructor === Object ) {
                        obj1[prop] = module.extend( obj1[prop] || {}, obj2[prop] );
                    }
                    else {
                        obj1[prop] = obj2[prop];
                    }
                }
                catch( error ) {
                    obj1[prop] = obj2[prop];
                }
                return obj1;
            }

            var extended = {};
            var prop;
            for( prop in defaults ) {
                if( Object.prototype.hasOwnProperty.call( defaults, prop ) ) {
                    copy( extended, defaults, prop );
                }
            }
            for( prop in options ) {
                if( Object.prototype.hasOwnProperty.call( options, prop ) ) {
                    copy( extended, options, prop );
                }
            }
            return extended;
        },

        /**
         * Set an event-listener to a parent element and use it to capture events on one of it's children.
         *
         * This function works like the long form of jQuery's "on" function.
         *
         * @param {String|Element} elementSelector
         * @param {String} eventName
         * @param {String|NodeList} selector
         * @param {Function} fn
         */
        on: function( elementSelector, eventName, selector, fn ) {

            var element,
                possibleTargets;

            if( elementSelector instanceof Element ) {
                element = elementSelector;
            }
            else {
                element = document.querySelector( elementSelector );
            }

            if( selector instanceof NodeList ) {
                possibleTargets = selector;
            }
            else {
                possibleTargets = element.querySelectorAll( selector );
            }

            element.addEventListener( eventName, function( event ) {
                var target = event.target;

                for( var i = 0, l = possibleTargets.length; i < l; i++ ) {
                    var el = target;
                    var p = possibleTargets[i];

                    while( el && el !== element ) {
                        if( el === p ) {
                            return fn.call( p, event );
                        }

                        el = el.parentNode;
                    }
                }
            } );
        }
    };

    return module;

} );