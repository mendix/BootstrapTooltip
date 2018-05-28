import {
    defineWidget,
    log,
    runCallback,
    executePromise,
} from 'widget-base-helpers';

import jQuery from 'jquery';
import 'bootstrap/js/tooltip';

const $ = jQuery.noConflict();

export default defineWidget('Core', false, {

    // Modeler
    tooltipClassName: '',
    tooltipMessageString: '',
    tooltipRenderHTML: false,
    tooltipLocation: 'top',
    tooltipMode: 'hover',
    tooltipMessageMicroflow: '',

    _tooltipText: 'No custom text specified for this tooltip',
    _tooltipTrigger: null,

    constructor() {
        this.log = log.bind(this);
        this.runCB = runCallback.bind(this);
        this.execute = executePromise.bind(this);
    },

    postCreate() {
        this.log('postCreate', this._WIDGET_VERSION);

        this._tooltipTrigger = 'hover' === this.tooltipMode ? 'focus hover' : this.tooltipMode;
    },

    update(obj, cb) {
        this.log('update');

        if ('' !== this.tooltipMessageMicroflow) {
            this.execute(this.tooltipMessageMicroflow, obj ? obj.getGuid() : null)
                .then(text => {
                    this._tooltipText = text;
                    this._initializeTooltip(cb);
                }, e => {
                    console.error(this.id, e);
                    this.runCB(cb);
                });
        } else {
            if ('' !== this.tooltipMessageString) {
                this._tooltipText = this.tooltipMessageString;
            }
            this._initializeTooltip(cb);
        }
    },

    _initializeTooltip(cb) {
        this.log('_initializeTooltip');

        const className = `.${this.tooltipClassName}`;

        let targetEl = $(this.domNode).siblings(className);

        if (0 === targetEl.length) {
            targetEl = $(className);
        }

        if (0 === targetEl.length) {
            console.warn([
                'Did you configure BootstrapTooltip widget correctly? Couldn\'t find an element with class \'',
                this.tooltipClassName,
                '\' on same level as widget (id=\'',
                this.domNode.id,
                '\')',
            ].join(''));
        }

        if (targetEl.hasClass('form-group')) {
            targetEl = 0 !== targetEl.find('.form-control').length ?
                targetEl.find('.form-control') :
                targetEl.find('input');
        }

        targetEl.tooltip({
            title: this._tooltipText,
            placement: this.tooltipLocation,
            trigger: this._tooltipTrigger,
            html: this.tooltipRenderHTML,
        });

        this.runCB(cb, '_initializeTooltip');
    },
});
