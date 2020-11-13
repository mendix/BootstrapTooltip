import declare from "dojo/_base/declare";
import lang from "dojo/_base/lang";
import _bootstrapTooltipWidget from "./BootstrapTooltip";

export default declare("BootstrapTooltip.widget.BootstrapTooltipContext", [_bootstrapTooltipWidget], {
    _contextObj: null,
    _attribute: "",

    postCreate: function () {
        const attributeSplit = this.tooltipMessageAttribute.split("/");
        if (attributeSplit.length === 1) {
            this._attribute = this.tooltipMessageAttribute;
        } else {
            this._attribute = attributeSplit[attributeSplit.length - 1];
        }
        this._checkTrigger();
    },

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

        if (this.tooltipSource === "attribute" && this._attribute) {
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
                callback: lang.hitch(this, () => {
                    this.setTooltipTextAttribute()
                })
            });

            this.subscribe({
                guid: this._contextObj.getGuid(),
                attr: this._attribute,
                callback: lang.hitch(this, () => {
                    this.setTooltipTextAttribute()
                })
            });
        }
    },

    setTooltipTextAttribute: function() {
        if (this._contextObj) {
            if (this._contextObj.isEnum(this._attribute)) {
                this._tooltipText = this._contextObj.getEnumCaption(this._attribute);
            } else {
                this._tooltipText = this._contextObj.get(this._attribute);
            }
        } else {
            this._tooltipText = null;
        }
        if (this._tooltipText == null || this._tooltipText === "") {
            this._tooltipText = this.tooltipMessageString;
        }
    }
});
