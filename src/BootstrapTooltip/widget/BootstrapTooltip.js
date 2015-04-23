/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document */
/*mendix */
/*
    BootstrapTooltip
    ========================

    @file      : BootstrapTooltip.js
    @version   : 1.0
    @author    : Pauline Oudeman
    @date      : Tue, 21 Apr 2015 08:16:44 GMT
	@copyright : Mendix Technology BV
	@license   : Apache License, Version 2.0, January 2004


    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require({
    packages: [{
            name: 'jquery',
            location: '../../widgets/BootstrapTooltip/lib',
            main: 'jquery-1.11.2.min'
    },
        {
            name: 'tooltip',
            location: '../../widgets/BootstrapTooltip/lib',
            main: 'tooltip'
    }]
}, [
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text', 'dojo/html', 'dojo/_base/event',
    'jquery', 'tooltip', 'dojo/text!BootstrapTooltip/widget/template/BootstrapTooltip.html'
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text, html, event, $, tooltip, widgetTemplate) {
    'use strict';

    // Declare widget's prototype.
    return declare('BootstrapTooltip.widget.BootstrapTooltip', [_WidgetBase, _TemplatedMixin], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // Parameters configured in the Modeler.
        tooltipClassName: '',
        tooltipMessageAttribute: '',
        tooltipMessageEntity: '',
        tooltipEntityConstraint: '',
        tooltipMessageString: '',
        tooltipLocation: 'top',
        tooltipMode: 'hover',

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _tooltipText: 'No custom text specified for this tooltip',
        _tooltipTrigger: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {

        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');
            if(this.tooltipMode === 'hover') {
                this._tooltipTrigger = 'hover focus';
            } else if(this.tooltipMode === 'click') {
                this._tooltipTrigger = 'click';
            }
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');
            var xpath = '//' + this.tooltipMessageEntity + this.tooltipEntityConstraint,
                cb = function (objs) {
                    if (objs[0]) {
                        this._tooltipText = objs[0].get(this.tooltipMessageAttribute);
                    } else {
                        console.warn('No objs found!.');
                    }
                    this._initializeTooltip();

                };
            if (this.tooltipMessageAttribute !== '') {
                if (obj) {
                    xpath = xpath.replace('[%CurrentObject%]', obj.getGuid());
                    mx.data.get({
                        xpath: xpath,
                        callback: lang.hitch(this, cb)
                    });
                } else if (!obj && (xpath.indexOf('[%CurrentObject%]') > -1)) {
                    console.warn('No context for xpath, not fetching.');
                } else {
                    mx.data.get({
                        xpath: xpath,
                        callback: lang.hitch(this, cb)
                    });
                }
            } else if (this.tooltipMessageString !== '') {
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
            console.log(this.id + '._initializeTooltip');
            $('.' + this.tooltipClassName).tooltip({
                title: this._tooltipText,
                placement: this.tooltipLocation,
                trigger: this._tooltipTrigger
            });
        }
    });
});