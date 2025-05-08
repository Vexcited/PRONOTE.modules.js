require("jquery");
require("jquery.min");
(function ($) {
  $.event.special.destroyed = {
    remove: function (event, ...aRest) {
      if (event.handler) {
        event.handler.call(this, event, ...aRest);
      }
    },
  };
})(jQuery);
