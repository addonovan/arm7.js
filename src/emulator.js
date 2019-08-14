'use strict';

const pipeline = (function() {

    function pump() { }

    function flush() { }

    return {
        flush: flush,
        pump: pump
    };
})();

