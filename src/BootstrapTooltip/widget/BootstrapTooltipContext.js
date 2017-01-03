define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "BootstrapTooltip/widget/BootstrapTooltip"
], function (declare, lang, _bootstrapTooltipWidget) {
    "use strict";

    return declare("BootstrapTooltip.widget.BootstrapTooltipContext", [_bootstrapTooltipWidget], {

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            var guid = obj ? obj.getGuid() : null;
            if (this.tooltipMessageMicroflow !== "") {
                this._execMf(this.tooltipMessageMicroflow, guid, lang.hitch(this, function (string) {
                    this._tooltipText = string;
                    this._initializeTooltip();
                }));
            } else {
                if (this.tooltipMessageString !== "") {
                    this._tooltipText = this.tooltipMessageString;
                }
                this._initializeTooltip();
            }

            callback();
        }
    });
});

require(["BootstrapTooltip/widget/BootstrapTooltipContext"]);
