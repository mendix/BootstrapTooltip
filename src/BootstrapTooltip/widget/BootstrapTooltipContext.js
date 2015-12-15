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
require([
    'dojo/_base/declare', 'dojo/_base/lang',
    'BootstrapTooltip/widget/BootstrapTooltip'
], function (declare, dojolang, _bootstrapTooltipWidget) {
	"use strict";

	// Declare widget"s prototype.
	return declare("BootstrapTooltip.widget.BootstrapTooltipContext", [_bootstrapTooltipWidget], {

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
					callback: dojolang.hitch(this, function (string) {
						this._tooltipText = string;
						this._initializeTooltip();
					}),
					error: dojolang.hitch(this, function (error) {
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
		}
	});
});
require(["BootstrapTooltip/widget/BootstrapTooltipContext"], function () {
	"use strict";
});