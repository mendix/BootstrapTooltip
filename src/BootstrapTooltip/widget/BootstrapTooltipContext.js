/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document */
/*mendix */
/*
    BootstrapTooltip
    ========================
    @file      : BootstrapTooltipContext.js
    @version   : 1.0
    @author    : Pauline Oudeman
    @date      : Tue, 21 Apr 2015 08:16:44 GMT
	@copyright : Mendix Technology BV
	@license   : Apache License, Version 2.0, January 2004


    Documentation
    ========================
    This file extends BootstrapTooltip.js to allow for a context entity. Edited by Eric Tieniber, 09.08.2015
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require({
    packages: [{
        name: 'jqwrapper',
        location: '../../widgets/BootstrapTooltip/lib',
        main: 'jqwrapper'
 }, {
        name: 'tooltip',
        location: '../../widgets/BootstrapTooltip/lib',
        main: 'tooltip'
 }]
}, [
	"dojo/_base/declare", "mxui/widget/_WidgetBase", "dijit/_TemplatedMixin",
	"mxui/dom", "dojo/_base/lang",
	"jqwrapper", "tooltip", "dojo/text!BootstrapTooltip/widget/template/BootstrapTooltip.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, lang, $, tooltip, widgetTemplate) {
	"use strict";

	$ = tooltip.createInstance($);

	// Declare widget"s prototype.
	return declare("BootstrapTooltip.widget.BootstrapTooltipContext", [_WidgetBase, _TemplatedMixin], {
		// _TemplatedMixin will create our dom node using this HTML template.
		templateString: widgetTemplate,

		// Parameters configured in the Modeler.
		tooltipClassName: "",
		tooltipMessageMicroflow: "",
		tooltipMessageString: "",
		tooltipLocation: "top",
		tooltipMode: "hover",

		// Internal variables. Non-primitives created in the prototype are shared between all widget instances.
		_tooltipText: "No custom text specified for this tooltip",
		_tooltipTrigger: null,
		
		// dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
		constructor: function () {

		},

		// dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
		postCreate: function () {

			if (this.tooltipMode === "hover") {
				this._tooltipTrigger = "hover focus";
			} else if (this.tooltipMode === "click") {
				this._tooltipTrigger = "click";
			}
		},

		// mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
		update: function (obj, callback) {
			var guid = obj.getGuid();
			if (this.tooltipMessageMicroflow !== "") {
				mx.data.action({
					params: {
						applyto: 'selection',
						actionname: this.tooltipMessageMicroflow,
						guids: [guid]
					},
					callback: lang.hitch(this, function (string) {
						this._tooltipText = string;
						this._initializeTooltip();
					}),
					error: lang.hitch(this, function (error) {
						console.warn("Error executing Microflow: " + error);
					})
				}, this);
			} else if (this.tooltipMessageString !== "") {
				this._tooltipText = this.tooltipMessageString;
				this._initializeTooltip();
			} else {
				this._initializeTooltip();
			}

			callback();
		},

		// mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
		uninitialize: function () {
			// Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
		},
		_initializeTooltip: function () {
			$(this.domNode).siblings("." +this.tooltipClassName).tooltip({
				title: this._tooltipText,
				placement: this.tooltipLocation,
				trigger: this._tooltipTrigger,
				html : this.tooltipRenderHTML
			});
		}
	});
});
require(["BootstrapTooltip/widget/BootstrapTooltipContext"], function () {
	"use strict";
});