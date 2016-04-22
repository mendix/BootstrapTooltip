define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "BootstrapTooltip/widget/BootstrapTooltip"
], function (declare, lang, _bootstrapTooltipWidget) {
    "use strict";

    return declare("BootstrapTooltip.widget.BootstrapTooltipContext", [_bootstrapTooltipWidget], {

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            var guid = obj.getGuid();
            if (this.tooltipMessageMicroflow !== "") {
                mx.data.action({
                    params: {
                        applyto: "selection",
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
        }
    });
});

require(["BootstrapTooltip/widget/BootstrapTooltipContext"]);
