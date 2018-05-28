import {
    defineWidget,
} from 'widget-base-helpers';

import Core from 'Core';

export default defineWidget('BootstrapTooltipContext', false, {

    tooltipClassName: '',
    tooltipMessageString: '',
    tooltipRenderHTML: false,
    tooltipLocation: 'top',
    tooltipMode: 'hover',
    tooltipSource: '',
    tooltipMessageMicroflow: '',
    tooltipMessageAttribute: '',

    update(obj, cb) {
        this.log('update');

        if ('microflow' === this.tooltipSource) {

            if ('' !== this.tooltipMessageMicroflow) {
                this.execute(this.tooltipMessageMicroflow, obj ? obj.getGuid() : null)
                    .then(text => {
                        this._tooltipText = text;
                        this._initializeTooltip();
                    }, e => {
                        console.error(this.id, e);
                        this.runCB(cb);
                    });
            } else {

                if ('' !== this.tooltipMessageString) {
                    this._tooltipText = this.tooltipMessageString;
                }
                this._initializeTooltip();
            }

        } else if ('attribute' === this.tooltipSource) {

            if ('' !== this.tooltipMessageAttribute) {

                if (obj.isEnum(this.tooltipMessageAttribute)) {
                    this._tooltipText = obj.getEnumCaption(this.tooltipMessageAttribute);
                } else {
                    this._tooltipText = obj.get(this.tooltipMessageAttribute);
                }

                if (null === this._tooltipText || '' === this._tooltipText) {
                    this._tooltipText = this.tooltipMessageString;
                }

                this._initializeTooltip();
            } else {
                if ('' !== this.tooltipMessageString) {
                    this._tooltipText = this.tooltipMessageString;
                }
                this._initializeTooltip();
            }
        }

        this.runCB(cb);
    },

}, Core);
