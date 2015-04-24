# Bootstrap Tooltip

This widget adds a tooltip to a user defined field, containing for example help text or extra information.

## Contributing
For more information on contributing to this repository visit [Contributing to a GitHub repository] (https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)

## Typical usage scenario
 
Add helptext to an inputfield.

## Installation

Import the widget to your project and add the Bootstrap Tooltip on a page. Configure the properties to determine how the widget will behave in your application.

## Features and limitations
 
- Based on Bootstrap's Tooltip.js

## Properties

* *Tooltip classname* The class name of the field to attach the tooltip to. 
* *Message* A hardcoded message  - visible within the tooltip when an attribute is not defined.
* *Tooltip Location* The location of the tooltip relative to the field. Values: top, left, bottom, right
* *Tooltip mode* When to show the tooltip. Values: On hover, On click
* *Tooltip Microflow* Return value: the text attribute to show in the tooltip.
