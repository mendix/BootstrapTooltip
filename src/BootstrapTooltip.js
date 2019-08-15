import declare from "dojo/_base/declare";
import _WidgetBase from "mxui/widget/_WidgetBase";
import _TemplatedMixin from "dijit/_TemplatedMixin";
import lang from "dojo/_base/lang";
import { tooltip } from "bootstrap";
import widgetTemplate from "./BootstrapTooltip.html";

export default declare("BootstrapTooltip.widget.BootstrapTooltip", [_WidgetBase, _TemplatedMixin], {
    templateString: widgetTemplate,

    tooltipClassName: "",
    tooltipSource: "",
    tooltipMessageAttribute: "",
    tooltipMessageMicroflow: "",
    tooltipMessageString: "",
    tooltipLocation: "top",
    tooltipMode: "hover",

    _tooltipText: "No custom text specified for this tooltip",
    _tooltipTrigger: null,

    _tooltipInitialized: false,

    postCreate: function() {
        logger.debug(this.id + ".postCreate");

        if (this.tooltipMode === "hover") {
            this._tooltipTrigger = "focus hover";
        } else if (this.tooltipMode === "focus") {
            this._tooltipTrigger = "focus";
        } else if (this.tooltipMode === "click") {
            this._tooltipTrigger = "click";
        }
    },

    update: function(obj, callback) {
        logger.debug(this.id + ".update");

        if (this.tooltipMessageMicroflow !== "") {
            this._execMf(
                this.tooltipMessageMicroflow,
                obj ? obj.getGuid() : null,
                lang.hitch(this, function(string) {
                    this._tooltipText = string;
                    this._initializeTooltip(callback);
                })
            );
        } else {
            if (this.tooltipMessageString !== "") {
                this._tooltipText = this.tooltipMessageString;
            }
            this._initializeTooltip(callback);
        }
    },

    _initializeTooltip: function(cb) {
        logger.debug(this.id + "._initializeTooltip");
        if (!this._tooltipInitialized) {
            // Find element by classname in the same container (DOM level) as widget
            var $targetElement = $(this.domNode).siblings("." + this.tooltipClassName);

            // No element found on same level, try to find target element on page
            if ($targetElement.length === 0) {
                $targetElement = $("." + this.tooltipClassName);
            }

            if ($targetElement.length === 0) {
                console.warn(
                    "Did you configure BootstrapTooltip widget correctly? Couldn't find an element with class '" +
                        this.tooltipClassName +
                        "' on same level as widget (id='" +
                        this.domNode.id +
                        "')"
                );
            }

            //if the element is a label+input combination, find the input element.
            if ($targetElement.hasClass("form-group")) {
                $targetElement =
                    $targetElement.find(".form-control").length !== 0
                        ? $targetElement.find(".form-control")
                        : $targetElement.find("input");
            }

            $targetElement.tooltip({
                title: () => {
                    return this._tooltipText;
                },
                placement: this.tooltipLocation,
                trigger: this._getTrigger(),
                html: this.tooltipRenderHTML
            });

            !this._tooltipInitialized;
        }

        this._executeCallback(cb, "_initializeTooltip");
    },

    _getTrigger: function() {
        return this._tooltipTrigger === "hover" && this.isMobileDevice() ? "click" : this._tooltipTrigger;
    },

    isMobileDevice: function() {
        return /(iPhone|iPod|iPad|Android|Windows Phone)/.test(navigator.userAgent);
    },

    _execMf: function(mf, guid, cb) {
        logger.debug(this.id + "._execMf");

        var mfParams = {
            actionname: mf
        };

        if (guid) {
            mfParams.applyto = "selection";
            mfParams.guids = [guid];
        }

        var mfAction = {
            params: mfParams,
            origin: this.mxform,
            callback: lang.hitch(this, function(obj) {
                if (typeof cb === "function") {
                    cb(obj);
                }
            }),
            error: lang.hitch(this, function(error) {
                console.log(this.id + "._execMf error: " + error.description);
            })
        };

        mx.data.action(mfAction, this);
    },

    _executeCallback: function(cb, from) {
        logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
        if (cb && typeof cb === "function") {
            cb();
        }
    }
});
