// Generated by CoffeeScript 1.6.2
/* Util (open) {{{1
*/


(function() {
  var asyncEach, cacheImgs, elemAddEventListener, extend, floatPart, identityFn, maximize, nextTick, onComplete, runOnce, setStyle, touchHandler, xhr,
    __slice = [].slice;

  floatPart = function(n) {
    return n - Math.floor(n);
  };

  extend = function() {
    var key, source, sources, target, val, _i, _len;

    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      for (key in source) {
        val = source[key];
        target[key] = val;
      }
    }
    return target;
  };

  nextTick = function(fn) {
    return setTimeout(fn, 0);
  };

  identityFn = function(e) {
    return e;
  };

  runOnce = function(fn) {
    return function() {
      var args;

      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (fn) {
        fn.apply(null, args);
        return fn = void 0;
      } else {
        return void 0;
      }
    };
  };

  asyncEach = function(arr, fn, done) {
    var elem, next, remaining, _i, _len;

    done = runOnce(done);
    remaining = arr.length;
    next = function(err) {
      if (err) {
        done(err);
      }
      if (!--remaining) {
        return done();
      }
    };
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      elem = arr[_i];
      fn(elem, next);
    }
    return void 0;
  };

  xhr = setStyle = function(elem, obj) {
    var key, val, _results;

    _results = [];
    for (key in obj) {
      val = obj[key];
      _results.push(elem.style[key] = val);
    }
    return _results;
  };

  onComplete = function(fn) {
    var f;

    return (f = function() {
      if (document.readyState === "interactive" || document.readyState === "complete") {
        return fn();
      } else {
        return setTimeout(f, 10);
      }
    })();
  };

  elemAddEventListener = function(elem, type, fn) {
    if (elem.addEventListener) {
      return elem.addEventListener(type, fn, false);
    } else {
      return typeof elem.attachEvent === "function" ? elem.attachEvent("on" + type, fn) : void 0;
    }
  };

  cacheImgs = function(urls, callback) {
    var loadImg;

    loadImg = function(url, done) {
      var img;

      img = new Image();
      img.src = url;
      return img.onload = function() {
        return done();
      };
    };
    return asyncEach(urls, loadImg, callback);
  };

  maximize = function(elem) {
    var nextSibling, node, oldbody, parent, _i, _len, _ref;

    oldbody = document.createElement("div");
    oldbody.style.display = "none";
    parent = elem.parentElement;
    nextSibling = elem.nextSibling;
    document.body.appendChild(oldbody);
    _ref = (function() {
      var _j, _len, _ref, _results;

      _ref = document.body.childNodes;
      _results = [];
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        node = _ref[_j];
        _results.push(node);
      }
      return _results;
    })();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      if (node !== oldbody) {
        oldbody.appendChild(node);
      }
    }
    document.body.appendChild(elem);
    return function() {
      var _j, _len1, _ref1;

      _ref1 = (function() {
        var _k, _len1, _ref1, _results;

        _ref1 = oldbody.childNodes;
        _results = [];
        for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
          node = _ref1[_k];
          _results.push(node);
        }
        return _results;
      })();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        node = _ref1[_j];
        document.body.appendChild(node);
      }
      oldbody.remove();
      if (nextSibling) {
        return elem.insertBefore(nextSibling);
      } else {
        return parent.appendChild(elem);
      }
    };
  };

  touchHandler = void 0;

  (function() {
    var moveTouch, multitouch, startTouch, stopTouch, touch, touches, updateTouch, windowTouch;

    touches = [];
    multitouch = false;
    touch = false;
    startTouch = function(e, handler) {
      touch = {
        handler: handler,
        x0: e.clientX,
        y0: e.clientY,
        x: e.clientX,
        y: e.clientY
      };
      updateTouch(touch, e);
      return touch.ctx = handler.start(touch);
    };
    updateTouch = function(touch, e) {
      var x, y;

      x = e.clientX;
      y = e.clientY;
      touch.event = e;
      touch.ddx = x - touch.x || 0;
      touch.ddy = y - touch.y || 0;
      touch.dx = x - touch.x0;
      touch.dy = y - touch.y0;
      touch.x = x;
      return touch.y = y;
    };
    moveTouch = function(e) {
      updateTouch(touch, e);
      return touch.ctx = touch.handler.move(touch);
    };
    stopTouch = function(e) {
      updateTouch(touch, e);
      touch.handler.endtouch;
      return touch = void 0;
    };
    windowTouch = runOnce(function() {
      elemAddEventListener(window, "mousemove", function(e) {
        if (!touch) {
          return void 0;
        }
        e.preventDefault();
        return moveTouch(e);
      });
      elemAddEventListener(window, "touchmove", function(e) {
        if (!touch) {
          return void 0;
        }
        e.preventDefault();
        return moveTouch(e.touches[0]);
      });
      elemAddEventListener(window, "mouseup", function(e) {
        if (!touch) {
          return void 0;
        }
        e.preventDefault();
        return stopTouch(e);
      });
      return elemAddEventListener(window, "touchend", function(e) {
        if (!touch) {
          return void 0;
        }
        e.preventDefault();
        return stopTouch(e.touches[0]);
      });
    });
    return touchHandler = function(handler) {
      elemAddEventListener(handler.elem, "mousedown", function(e) {
        e.preventDefault();
        return startTouch(e, handler);
      });
      elemAddEventListener(handler.elem, "touchstart", function(e) {
        e.preventDefault();
        return startTouch(e.touches[0], handler);
      });
      windowTouch();
      handler.start || (handler.start = identityFn);
      handler.move || (handler.move = identityFn);
      return handler.end || (handler.end = identityFn);
    };
  })();

  /* Notes {{{2
  {{{3 TODO
  
  - cursor icon
  - icons - zoom-lense(desktop), fullscreen, close(fullscreen)
  - logo
  - fullscreen(on both desktop and mobile)
  - zoom(on desktop, mobile postponed)
  - multitouch
  - talk with api
  - labels/markers
  - browser-support: IE8+, iOS 5+ Android 4+
  
  {{{3 Done
  
  - image caching / preloader
  - rotate - drag
  - singletouch
  - animate on load
  - drag
  
  {{{3 Interaction
  
  - drag left/right: rotate
    - rotation = x-drag scaled
  - tap/click: fullscreen, click on X or outside centered image to close
  - zoom (multitouch+multidrag: iOS + android 2.3.3+, zoom-button with lens on desktop)
  
  {{{3 Why img.src replacement
  
  When targeting mobile devices,  
  and possibly several 360º views on a page,
  memory is more likely to be bottleneck than CPU.
  
  We therefore just preload the compressed images
  into the browsers component cache, 
  and decompress them at render time.
  
  The actual rendering is then just replacing
  the `src` of an image tag, - also making it work
  in non-HTML5 browsers, such as IE8, 
  which we also need to support.
  */


  (function() {
    var default360Config;

    default360Config = {
      autorotate: true,
      imageURLs: void 0
    };
    return window.onetwo360 = function(cfg) {
      var autorotate, cache360Images, currentAngle, elem, get360Config, img, init360Controls, init360Elem, updateImage, width;

      currentAngle = 0;
      width = void 0;
      elem = document.getElementById(cfg.elem_id);
      img = new Image();
      elem.appendChild(img);
      nextTick(function() {
        return get360Config();
      });
      get360Config = function() {
        return nextTick(function() {
          var i, serverConfig;

          serverConfig = {
            imageURLs: (function() {
              var _i, _results;

              _results = [];
              for (i = _i = 1; _i <= 36; i = ++_i) {
                _results.push("testimg/" + i + ".jpg");
              }
              return _results;
            })()
          };
          cfg = extend({}, default360Config, serverConfig, cfg);
          return init360Elem();
        });
      };
      init360Elem = function() {
        return cache360Images(function() {
          setStyle(img, {
            width: cfg.request_width + "px",
            height: cfg.request_height + "px"
          });
          width = cfg.request_width;
          if (cfg.autorotate) {
            return autorotate(init360Controls);
          } else {
            return init360Controls();
          }
        });
      };
      cache360Images = function(done) {
        return cacheImgs(cfg.imageURLs, done);
      };
      autorotate = function(done) {
        var i, showNext;

        i = 0;
        showNext = function() {
          if (i < cfg.imageURLs.length) {
            img.src = cfg.imageURLs[i++];
            return img.onload = function() {
              return setTimeout(showNext, 10);
            };
          } else {
            return done();
          }
        };
        return showNext();
      };
      updateImage = function() {
        return img.src = cfg.imageURLs[floatPart(currentAngle / Math.PI / 2) * cfg.imageURLs.length | 0];
      };
      return init360Controls = function() {
        return touchHandler({
          elem: img,
          start: function(t) {
            return void 0;
          },
          move: function(t) {
            currentAngle -= 2 * Math.PI * t.ddx / width;
            return updateImage();
          },
          end: function(t) {
            return void 0;
          }
        });
      };
    };
  })();

}).call(this);
