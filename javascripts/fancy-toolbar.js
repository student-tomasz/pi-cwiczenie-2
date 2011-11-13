function FancyToolbar(id, width, scale, range) {

  //
  //  fields
  //

  // DOM nodes of the toolbar
  var toolbar = null;
  var items   = [];

  // fields for animations
  var factor         = 0.0;
  var growing        = null;
  var shrinking      = null;
  var shrinkingDelay = null;



  //
  // initializer
  //

  // normalize arguments
  width = width || 64;
  scale = scale || 2.0;
  range = range || 2;

  // get the toolbar node
  toolbar = document.getElementById(id);

  // go through toolbar items and bind events handlers
  if (toolbar.hasChildNodes()) {
    for (var item = toolbar.childNodes[0]; item; item = item.nextSibling) {
      if (item.nodeType == Node.ELEMENT_NODE && item.className.match(/ft-item/)) {
        items.push(item);
      }
    }

    for (var i = 0; i < items.length; i++) {
      items[i].index = i;
      items[i].width = width;
    }

    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('mouseover', magnify, false);
      items[i].addEventListener('mousemove', resize,  false);
      items[i].addEventListener('mouseout',  shrink,  false);
    }
  }



  //
  // events handlers
  //

  function magnify() {
    window.clearInterval(shrinking);
    shrinking = null;
    window.clearTimeout(shrinkingDelay);
    shrinkingDelay = null;

    if (factor != 1 && !growing) {
      growing = window.setInterval(
        function() {
          factor += 0.075;
          if (factor >= 1) {
            factor = 1;
            window.clearInterval(growing);
            growing = null;
          }
          redraw();
        }, 10);
    }
  };

  function resize(event) {
    var target = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i] == event.target.parentNode) target = items[i];
    }
    if (target) {
      var half = (event.clientX - target.offsetLeft) / target.width - 0.5;
      for (var index = 0; index < items.length; index++) {
        var item = items[index];
        if (Math.abs(item.index - target.index) > range) { // outside range
          item.width = width;
        }
        else { // inside range
          var magic = Math.cos((item.index-target.index-half)/range*Math.PI/2);
          if (magic < 0) magic = 0;
          item.width = width + Math.round(width * (scale-1) * magic);
        }
      }
    }

    redraw();
  };

  function shrink() {
    window.clearInterval(growing);
    growing = null;

    shrinkingDelay = window.setInterval(function() {
      if (factor != 0 && !shrinking) {
        shrinking = window.setInterval(
          function() {
            factor -= 0.075;
            if (factor <= 0) {
              factor = 0;
              window.clearInterval(shrinking);
              shrinking = null;
            }
            redraw();
          }, 10);
      }
    }, 100);
  }



  //
  // helper methods
  //

  var redraw = function() {
    for (var i = 0; i < items.length; i++) {
      var actual = width + factor * (items[i].width - width);

      items[i].style.height = actual + 'px';
      items[i].style.width  = actual + 'px';
      items[i].style.marginTop = width * scale - actual + 'px';
    }
  };

};
