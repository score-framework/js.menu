define('lib/score/menu', ['lib/score/oop'], function(oop) {

    return oop.Class({
        __name__: 'Menu',
        __events__: ['open', 'close'],

        __init__: function(self, ul) {
            self.ul = ul;
            self.hoverItem = null;
            self.hoverTimeout = null;
            var resolve = function() {
                if (self.hoverItem === null) {
                    self.close();
                } else {
                    self.open(self.hoverItem);
                }
                self.hoverTimeout = null;
            };
            var setResolveTimeout = function() {
                if (self.hoverTimeout !== null) {
                    window.clearTimeout(self.hoverTimeout);
                    self.hoverTimeout = null;
                }
                self.hoverTimeout = window.setTimeout(resolve, 200);
            };
            var mouseLeave = function(event) {
                self.hoverItem = null;
                setResolveTimeout();
            };
            var mouseEnter = function(event) {
                self.hoverItem = this;
                if (self.activeItem()) {
                    setResolveTimeout();
                } else {
                    resolve();
                }
            };
            for (var i = 0; i < ul.children.length; i++) {
                var li = ul.children.item(i);
                li.addEventListener('mouseleave', mouseLeave);
                li.addEventListener('mouseenter', mouseEnter);
                li.addEventListener('click', mouseEnter);
            }
            if ('ontouchstart' in document.documentElement) {
                setResolveTimeout = resolve;
                document.addEventListener('touchstart', function(event) {
                    var target = document.elementFromPoint(event.clientX, event.clientY);
                    if (!self.ul.contains(target)) {
                        self.close();
                    } else {
                        self.hoverItem = this;
                        resolve();
                    }
                });
            }
        },

        close: function(self) {
            var active = self.activeItem();
            if (active) {
                return;
            }
            if (!self.trigger('close', active)) {
                return;
            }
            active.className = active.className.replace(/\bmenu-item-active\b/, '');
            self.hoverItem = null;
        },

        activeItem: function(self) {
            return self.ul.querySelector('li.menu-item-active');
        },

        open: function(self, item) {
            if (typeof item === 'number') {
                item = self.ul.children.item(item);
            } else if (typeof item !== 'object') {
                throw 'Argument must be numeric or a DOM node';
            }
            if (item == self.activeItem()) {
                return;
            }
            if (!self.close()) {
                return;
            }
            item.className = item.className + ' menu-item-active';
            self.hoverItem = item;
            self.trigger('open', item);
        }

    });

});
