/**
 * Copyright © 2015 STRG.AT GmbH, Vienna, Austria
 *
 * This file is part of the The SCORE Framework.
 *
 * The SCORE Framework and all its parts are free software: you can redistribute
 * them and/or modify them under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation which is in the
 * file named COPYING.LESSER.txt.
 *
 * The SCORE Framework and all its parts are distributed without any WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. For more details see the GNU Lesser General Public
 * License.
 *
 * If you have not received a copy of the GNU Lesser General Public License see
 * http://www.gnu.org/licenses/.
 *
 * The License-Agreement realised between you as Licensee and STRG.AT GmbH as
 * Licenser including the issue of its valid conclusion and its pre- and
 * post-contractual effects is governed by the laws of Austria. Any disputes
 * concerning this License-Agreement including the issue of its valid conclusion
 * and its pre- and post-contractual effects are exclusively decided by the
 * competent court, in whose district STRG.AT GmbH has its registered seat, at
 * the discretion of STRG.AT GmbH also the competent court, in whose district the
 * Licensee has his registered seat, an establishment or assets.
 */

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
            if (!active) {
                return true;
            }
            if (!self.trigger('close', active)) {
                return false;
            }
            active.className = active.className.replace(/\bmenu-item-active\b/, '');
            self.hoverItem = null;
            return true;
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
