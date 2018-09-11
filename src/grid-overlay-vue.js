'use strict';

var GridOverlay = require('./grid-overlay.js');

var GridOverlayVue = {
    props: [
        'maxWidth',
        'cols',
        'gridGutter',
        'adaptive',
        'draggable',
        'overlayVisible',
        'writeInlineStyles',
        'windowResizeDelay',
        'controlZIndex',
        'controlBackgroundColor',
        'controlFontColor',
        'controlOpacity',
        'controlPadding',
        'controlTop',
        'controlRight',
        'controlBottom',
        'controlLeft',
        'controlPosition',
        'overlayZIndex',
        'overlayOpacity',
        'foregroundColor',
        'backgroundColor',
        'overlayClass',
        'colClass',
        'colContentClass',
        'controlClass',
        'controlRowClass',
        'controlCheckboxClass',
        'controlLabelClass',
        'controlMaxWidthClass',
        'controlWidthClass',
        'preCreate',
        'postCreate',
        'preRender',
        'postRender',
        'preMakeControlDraggable',
        'postMakeControlDraggable',
        'preToggleControl',
        'postToggleControl',
        'preDestroy',
        'postDestroy'
    ],
    render: function () {
    },
    mounted: function () {
        this.gridOverlay = new GridOverlay({
            maxWidth: this.maxWidth,
            cols: this.cols,
            gridGutter: this.gridGutter,
            adaptive: this.adaptive,
            draggable: this.draggable,
            overlayVisible: this.overlayVisible,
            writeInlineStyles: this.writeInlineStyles,
            windowResizeDelay: this.windowResizeDelay,
            controlZIndex: this.controlZIndex,
            controlBackgroundColor: this.controlBackgroundColor,
            controlFontColor: this.controlFontColor,
            controlOpacity: this.controlOpacity,
            controlPadding: this.controlPadding,
            controlTop: this.controlTop,
            controlRight: this.controlRight,
            controlBottom: this.controlBottom,
            controlLeft: this.controlLeft,
            controlPosition: this.controlPosition,
            overlayZIndex: this.overlayZIndex,
            overlayOpacity: this.overlayOpacity,
            foregroundColor: this.foregroundColor,
            backgroundColor: this.backgroundColor,
            overlayClass: this.overlayClass,
            colClass: this.colClass,
            colContentClass: this.colContentClass,
            controlClass: this.controlClass,
            controlRowClass: this.controlRowClass,
            controlCheckboxClass: this.controlCheckboxClass,
            controlLabelClass: this.controlLabelClass,
            controlMaxWidthClass: this.controlMaxWidthClass,
            controlWidthClass: this.controlWidthClass,
            callbacks: {
                preCreate: this.preCreate,
                postCreate: this.postCreate,
                preRender: this.preRender,
                postRender: this.postRender,
                preMakeControlDraggable: this.preMakeControlDraggable,
                postMakeControlDraggable: this.postMakeControlDraggable,
                preToggleControl: this.preToggleControl,
                postToggleControl: this.postToggleControl,
                preDestroy: this.preDestroy,
                postDestroy: this.postDestroy
            }
        });
    },
    beforeDestroy: function () {
        if (this.gridOverlay) {
            this.gridOverlay.destroy();
        }
    }
};

module.exports = GridOverlayVue;
