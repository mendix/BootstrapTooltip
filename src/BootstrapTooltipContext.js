import declare from "dojo/_base/declare";
import _bootstrapTooltipWidget from "./BootstrapTooltip";

export default declare("BootstrapTooltip.widget.BootstrapTooltipContext", [_bootstrapTooltipWidget], {
    _contextObj: null,

    update: function(obj, callback) {
        logger.debug(this.id + ".update");

        this._contextObj = obj;
        this._resetSubscriptions();

        if (this.tooltipSource === "microflow" && this.tooltipMessageMicroflow) {
            var guid = obj ? obj.getGuid() : null;
            this._execMf(this.tooltipMessageMicroflow, guid, message => {
                this._tooltipText = message;
                setTimeout(() => this._initializeTooltip(callback), 1000);
            });
            return;
        }

        if (this.tooltipSource === "attribute" && this.tooltipMessageAttribute) {
            this.setTooltipTextAttribute();
        } else {
            if (this.tooltipMessageString) {
                this._tooltipText = this.tooltipMessageString;
            }
        }

        setTimeout(() => this._initializeTooltip(callback), 1000);
    },

    _resetSubscriptions: function() {
        logger.debug(this.id + "._resetSubscriptions");
        this.unsubscribeAll();

        if (this._contextObj) {
            this.subscribe({
                guid: this._contextObj.getGuid(),
                callback: () => this.setTooltipTextAttribute()
            });

            this.subscribe({
                guid: this._contextObj.getGuid(),
                attr: this.tooltipMessageAttribute,
                callback: () => this.setTooltipTextAttribute()
            });
        }
    },

    setTooltipTextAttribute: function() {
        if (this._contextObj) {
            if (this._contextObj.isEnum(this.tooltipMessageAttribute)) {
                this._tooltipText = this._contextObj.getEnumCaption(this.tooltipMessageAttribute);
            } else {
                this._tooltipText = this._contextObj.get(this.tooltipMessageAttribute);
            }
        } else {
            this._tooltipText = null;
        }
        if (this._tooltipText == null || this._tooltipText === "") {
            this._tooltipText = this.tooltipMessageString;
        }
    }
});
