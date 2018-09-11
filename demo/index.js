'use strict';

var GridOverlay = require('../dist/grid-overlay');

new GridOverlay({
    controlParentEl: '.attach-grid-overlay-control-here',
    maxWidth: 1440,
    columns: 12,
    gridGutter: 8,
    extraLeftRightGutter: 0,
    draggable: false,
    adaptive: [
        {
            mediaQuery: '(max-width: 600px)',
            cols: 2,
            gridGutter: 8,
            extraLeftRightGutter: 0
        },
        {
            mediaQuery: '(min-width: 1025px)',
            cols: 12,
            gridGutter: 8,
            extraLeftRightGutter: 40
        }
    ],
    overlayVisible: true,
    writeInlineStyles: true,

    controlZIndex: 1200,
    controlBackgroundColor: '#474747',
    controlFontColor: '#ffffff',
    controlOpacity: 0.9,

    overlayZIndex: 1100,
    overlayOpacity: 0.4,
    foregroundColor: '#409bd2',
    backgroundColor: '#80bde1',
    callbacks: {
        preToggleControl: function() {
            console.log('preToggleControl');
        }
    }
});