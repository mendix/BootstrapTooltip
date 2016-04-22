define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/_base/lang",
    "BootstrapTooltip/lib/jquery",
    "BootstrapTooltip/lib/tooltip",
    "dojo/text!BootstrapTooltip/widget/template/BootstrapTooltip.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, lang, _jQuery, tooltip, widgetTemplate) {
    "use strict";

    var _jQ = _jQuery.noConflict(true);
    var j$ = tooltip.createInstance(_jQ);

    return declare("BootstrapTooltip.widget.BootstrapTooltip", [_WidgetBase, _TemplatedMixin], {

        templateString: widgetTemplate,

        tooltipClassName: "",
        tooltipMessageMicroflow: "",
        tooltipMessageString: "",
        tooltipLocation: "top",
        tooltipMode: "hover",

        _tooltipText: "No custom text specified for this tooltip",
        _tooltipTrigger: null,

        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            if (this.tooltipMode === "hover") {
                this._tooltipTrigger = "focus hover";
            } else if (this.tooltipMode === "focus") {
                this._tooltipTrigger = "focus";
            } else if (this.tooltipMode === "click") {
                this._tooltipTrigger = "click";
            }
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            if (this.tooltipMessageMicroflow !== "") {
                mx.data.action({
                    params: {
                        actionname: this.tooltipMessageMicroflow
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

        _initializeTooltip: function () {
            logger.debug(this.id + "._initializeTooltip");

            // Find element by classname in the same container (DOM level) as widget
            var $targetElement = j$(this.domNode).siblings("." + this.tooltipClassName);

            // No element found on same level, try to find target element on page
            if ($targetElement.length === 0) {
                $targetElement = j$("." + this.tooltipClassName);
            }

            if ($targetElement.length === 0) {
                console.warn("Did you configure BootstrapTooltip widget correctly? Couldn't find an element with class '"+ this.tooltipClassName +"' on same level as widget (id='" + this.domNode.id+"')" );
            }

            //if the element is a label+input combination, find the input element.
            if ($targetElement.hasClass("form-group")){
                $targetElement = $targetElement.find(".form-control").length !== 0 ? $targetElement.find(".form-control") : $targetElement.find("input");
            }

            $targetElement.tooltip({
                title: this._tooltipText,
                placement: this.tooltipLocation,
                trigger: this._tooltipTrigger,
                html : this.tooltipRenderHTML
            });
        }
    });
});

require(["BootstrapTooltip/widget/BootstrapTooltip"]);
