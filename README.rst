.. _js_menu:

**********
score.menu
**********

A simple library controlling drop-down menu elements that will open when the
mouse hovers on one of its items.

Rationale
---------

The key feature of this library is that it will handle mouseenter/-leave
events correctly. For the sake of documentation, lets assume that we have a
drop-down menu that looks like this, when closed::

    +-------------------+
    |   Monty Python    |
    +-------------------+

The menu shall open when the mouse hovers on the element::

    +-------------------+
    |   Monty Python ↖  |
    +-------------------+-------------------+-------------------+
    |      ACTORS       |     SKETCHES      |       SPAM!       |
    +-------------------+-------------------+-------------------+

When the user now moves the mouse onto "ACTORS", the menu will look like the
following::

    +-------------------+
    |   Monty Python    |
    +-------------------+-------------------+-------------------+
    |      ACTORS  ↖    |     SKETCHES      |       SPAM!       |
    +-------------------+-------------------+-------------------+
     |   John Cleese   |
     +-----------------+
     |  Graham Chapman |
     +-----------------+
     |  Terry Gilliam  |
     +-----------------+
     |   Terry Jones   |
     +-----------------+
     |  Michael Palin  |
     +-----------------+

When the user now moves the mouse downward, to reach one of the actors, and
*then* decides to switch to the next menu item ("SKETCHES"), the mouse would
temporarily leave the open menu item and the whole menu would close::

    +-------------------+
    |   Monty Python    |
    +-------------------+
    
                           ↖  :-(

This library will just delay the closing and check back if another menu item
was entered in the mean time. It also ensures that at most one entry is open
at any time.

Usage
-----

The constructor accepts a single DOM node that must be a list node, i.e.
either an ``ul``- or an ``ol``-element. All list items (``li`` nodes) are
assumed to be menu entries of this list.

The menu object will then trigger events whenever a menu item opens or closes.
The events are guaranteed to be in the correct order so that at most one menu
item is open at all times.

The triggered events always have the ``li`` node as argument:

- ``open``: Triggered when a menu item shall open. One of the callback
  functions should perform the actual operation of "opening" the menu
  item.
- ``close``: Triggered when a menu item should be closed. The menu
  item is guaranteed to be opened previously with the other event.

Example
-------

The above menu could be written like the following::

    <ul id="monty-python">
        <li>
            ACTORS
            <ul class='content'>
                <li>John Cleese</li>
                <li>Graham Chapman</li>
                <li>Terry Gillian</li>
                <li>Terry Jones</li>
                <li>Michael Palin</li>
            </ul>
        <li>
        <li>
            SKETCHES
            <ul class='content'>
                <!-- ... -->
            </ul>
        <li>
        <li>
            SPAM!
            <ul class='content'>
                <!-- ... -->
            </ul>
        <li>
    <ul>
    <script>
        require(['lib/score/menu'], function(Menu) {
            var menu = new Menu(document.getElementById('#monty-python'));
            menu.on('open', function(li) {
                li.className = li.className + ' visible';
            });
            menu.on('close', function(li) {
                li.className = li.className.replace('\bvisible\b', '');
            });
        });
    </script>
