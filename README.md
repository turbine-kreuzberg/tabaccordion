# TabAccordion

An accordion, that may change its display to tabbed content based on the screen width.
It can be used with Twitter Bootstrap or Zurb Foundation stylesheets.
Or you create your own styles based on the minimal standalone styles.

## Getting started

You can download this package by using Bower:

    bower install votum-tabaccordion

Or you can clone this repository and run `bower install` inside the directory it was checked out to install any dependencies.

## Usage

@todo

## Options

By default the TabAccordion is displayed as accordion on small screens and as tabbed content on larger screens (depending on the breakpoint and behavior definitions). The behavior can (partly) be controlled through the following `data-*` attributes.

### `data-panel-group-type`

Defines the TabAccordion behavior – i.e. whether it is displayed as accordion or tabbed content. Possible values are:

- **`accordion`** Display an accordion, no matter what the screen size is.
- **`accordion-tabs`** Display an accordion on small screens and tabbed content on wider screens. This is the **default**.
- **`accordion-mobile-only`** Display the content as simple panels (without using any JS), but let the collapse to an accordion on small screens.
- **`tabs-only`** Display tabbed content no matter what the screen size is.

#### `data-panel-group-all-closed`

This is a boolean attribute (i.e. it has no value). If it is set, all sections in an accordion are closed on initialization. The option is ignored in tabbed-content-mode.

#### `data-panel-group-open`

This option can be used to open another section than the first one (which is active/open per default). Specify a one-based index to open that section on initialization.

The combination of the options `data-panel-group-all-closed` and `data-panel-group-open` is undefined, not tested and should be avoided.

## Examples

The Foundation and Bootstrap examples are both based on the respective accordion markup of either framework. Both frameworks lack of a semantic tabbed content markup, so we ignore theirs and build tabs from the accrodion markup through additional CSS.

### Twitter Bootstrap

This example uses the Bootstrap 3.3.4 stylesheets and the markup found in the [Bootstrap “Collapse” documentation](http://getbootstrap.com/javascript/#collapse).

It was not tested in combination with the Bootstrap JavaScript. Bugs may occur if you include the [collapse.js](https://github.com/twbs/bootstrap/blob/master/js/collapse.js).

Demo: [examples/twitter-bootstrap.htm](https://rawgit.com/votum/tabaccordion/master/examples/twitter-bootstrap.htm)

We use the default Twitter Bootstrap panels for the individual sections and add a wrapper around all panels that should be displayed as one TabAccordion with the class `.panel-group`.

The clickable heading and the section content are defined using the Bootstrpa class names `.panel-header` and `.panel-body`.

### Zurb Foundation

This example uses the Foundation 5 CSS and the accordion markup found in the [Zurb Foundation “Accordion” documentation](http://foundation.zurb.com/docs/components/accordion.html).

It was not tested in combination with the Foundation JavaScript. Bugs may occur if you include the [foundation.accordion.js](https://github.com/zurb/foundation/blob/master/js/foundation/foundation.accordion.js).

Demo: [examples/zurb-foundation.htm](https://rawgit.com/votum/tabaccordion/master/examples/zurb-foundation.htm)
