# Bootstrap Tooltip

This widget adds a tooltip to an user defined field, containing for example help text or extra information.

## Typical usage scenario

Add helptext to an inputfield on focus. Informative text for buttons on hover.

## Installation

Import the widget to your project and add the Bootstrap Tooltip on a page.

## Configuration

Configure the properties to determine how the widget will behave in your application.

### Properties

#### Appearance

-   _Target element classname_: The class name of the field to attach the tooltip to.
-   _Render HTML_: Renders the tooltip content as HTML. Values: Yes, No
-   _Tooltip position_: The location of the tooltip relative to the field. Values: Top, Left, Bottom, Right
-   _Tooltip mode_: When to show the tooltip. Values: On hover/focus, On focus, On click

#### Data source

-   _Default text_: Text being displayed when no data source microflow is defined.
-   _Tooltip source microflow_: Microflow that returns the text to be displayed in the tooltip.

Extra for Bootstrap Tooltip (Context):

-   _Tooltip source_: Text generated from microflow or object attribute
-   _Tooltip source attribute_: Attribute that contains the text to be displayed in the tooltip.

### Tips

-   Locate the widget as close to the target element as possible. (Preferably next to it)
-   When an element has a tooltip attached to it and needs to be conditionally visible, put both element and tooltip together in a container and apply the visibility conditions to the container instead of the element (see the image below).

![Conditional visible container with target element and Bootstrap Tooltip inside](/assets/conditional-visibility.png)

## Features and limitations

-   Based on Bootstrap's Tooltip.js

## Widget development

To start development on the Bootstrap Tooltip:

-   Clone this repository
-   Make sure you have Node.js installed on your computer
-   Open a terminal in the root directory of the project

To install all project dependencies, execute the following comamnd in the terminal:

```shell
npm install
```

In order to test the widget with one of the supplied test projects, run the following command to generate and include an mpk file in every test project (and in a dist folder):

```shell
npm start
```

This command will also watch the source code files. When changes to these files have been saved, a new mpk file will be generated and included in the dist folder and in every test project. The dist folder will also contain an unpacked version of the mpk. The source files in the deployment folder of the test projects will also be updated, so that it only takes a refresh in the browser to view your changes.

To keep source code formatting uniform across the project, run the following command to format all project source files (XML files are not supported):

```shell
npm run prettier:fix
```

## Widget releasing

To release the widget in the Mendix App Store, run the following command to build the widget:

```shell
npm run build
```

The command will optimize the source code for production environment and generate a new mpk that will be included in the dist folder and in every test project. The dist folder will also contain an unpacked version of the mpk. The source files in the deployment folder of the test projects will also be updated, so that it only takes a refresh in the browser to check your production code.

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)
