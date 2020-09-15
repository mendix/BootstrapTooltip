import declare from "dojo/_base/declare";
import _WidgetBase from "mxui/widget/_WidgetBase";
import _TemplatedMixin from "dijit/_TemplatedMixin";
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

    _tooltipTrigger: null,
    _tooltipText: "No custom text specified for this tooltip",

    postCreate: function() {
        logger.debug(this.id + ".postCreate");

        this._tooltipTrigger = this.tooltipMode === "hover" ? "focus hover" : this.tooltipMode;
    },

    update: function(obj, callback) {
        logger.debug(this.id + ".update");

        if (this.tooltipMessageMicroflow) {
            this._execMf(this.tooltipMessageMicroflow, obj ? obj.getGuid() : null, message => {
                this._tooltipText = message;
                setTimeout(() => this._initializeTooltip(callback), 1000);
            });
        } else {
            if (this.tooltipMessageString) {
                this._tooltipText = this.tooltipMessageString;
            }
            setTimeout(() => this._initializeTooltip(callback), 1000);
        }
    },

    _initializeTooltip: function(cb) {
        logger.debug(this.id + "._initializeTooltip");

        // Find element by classname in the same container (DOM level) as widget
        var $targetElement = $(this.domNode).siblings("." + this.tooltipClassName);

        // No element found on same level, try to find target element on same parent
        if ($targetElement.length === 0) {
            $targetElement = $(this.domNode.parentNode).find("." + this.tooltipClassName);
        }

        // No element found on same level, try to find target element on same page
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
            cb();
            return;
        }

        // if the element is a label+input combination, find the input element.
        if ($targetElement.hasClass("form-group")) {
            $targetElement =
                $targetElement.find(".form-control").length !== 0
                    ? $targetElement.find(".form-control")
                    : $targetElement.find("input");
        }

        if ($targetElement.length > 0) {
            try {
                $targetElement.tooltip({
                    title: () => {
                        return this._tooltipText;
                    },
                    placement: this.tooltipLocation,
                    trigger: this._getTrigger(),
                    html: this.tooltipRenderHTML
                });
            } catch(e) {
                console.warn(
                    "Did you configure BootstrapTooltip widget correctly? Couldn't start tooltip methods in the element with class '" +
                    this.tooltipClassName +
                    "' on same level as widget (id='" +
                    this.domNode.id +
                    "')"
                );
                cb();
                return;
            }
        } else {
            window.logger.warn("Form input not available at the moment");
        }

        this._executeCallback(cb, "_initializeTooltip");
    },

    /* Convert a hover trigger to click trigger, because hovering on mobile touchscreen devices is not supported.
    Devices with a pointing device and touchscreen will keep the hover trigger. */
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
            callback: obj => {
                if (typeof cb === "function") {
                    cb(obj);
                }
            },
            error: error => console.log(this.id + "._execMf error: " + error)
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
