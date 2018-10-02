'use strict';

var dragNdrop = require('npm-dragndrop');
var debounce = require('lodash.debounce');
var merge = require('lodash.merge');

/**
 * @typedef {Object} AdaptiveOptions
 * @memberOf GridOverlay
 * @property {String} mediaQuery Media query.
 * @property {Number} cols Count of columns.
 * @property {Number} gridGutter Column left and right paddings.
 * @property {Number} extraLeftRightGutter Extra grid padding (first left and last right).
 **/

/**
 * @class GridOverlay
 * @summary GridOverlay
 * @param {Object} options Supplied configuration
 * @param {String|HTMLElement} [options.overlayParentEl=null] The Overlay parent element. Either an HTML element object or selector string. Body first child if null.
 * @param {String|HTMLElement} [options.controlParentEl=null] The Control parent element. Either an HTML element object or selector string. Body append if null.
 * @param {Boolean} [options.draggable=true] Init npm-dragndrop for control or not.
 * @param {Number} [options.maxWidth=1440] Max overlay width.
 * @param {Number} [options.cols=12] Number of columns.
 * @param {Number} [options.gridGutter=8] Column left and right paddings.
 * @param {Number} [options.extraLeftRightGutter=0] Extra grid padding (first left and last right).
 * @param {AdaptiveOptions[]} [options.adaptive] List of objects, that describe adaptive behaviour.
 * @param {Boolean} [options.overlayVisible=true] Initial overlay visibility.
 * @param {Boolean} [options.writeInlineStylesOverlay=true] Apply or not visual Overlay styles.
 * @param {Boolean} [options.writeInlineStylesControl=true] Apply or not visual Control styles.
 * @param {Number} [options.windowResizeDelay=50] How long to wait on _trailing_ window resize event logic.
 * @param {Number} [options.controlZIndex=1200] Control z index.
 * @param {String} [options.controlBackgroundColor='#474747'] Control background color.
 * @param {String} [options.controlFontColor='#FFFFFF'] Control font color.
 * @param {Number} [options.controlOpacity=0.9] Control opacity.
 * @param {Number} [options.controlPadding=30] Control padding in pixels.
 * @param {String} [options.controlTop='auto'] Control top.
 * @param {String} [options.controlRight='auto'] Control right.
 * @param {String} [options.controlBottom='auto'] Control bottom.
 * @param {String} [options.controlLeft='auto'] Control left.
 * @param {String} [options.controlPosition='static'] Control position.
 * @param {Number} [options.overlayZIndex=30] Overlay z index.
 * @param {Number} [options.overlayOpacity=0.4] Overlay opacity.
 * @param {String} [options.foregroundColor='#409bd2'] Column color.
 * @param {String} [options.backgroundColor=''#80bde1'] Between columns space color.
 * @param {String} [options.overlayClass='grid-overlay-overlay'] Overlay node class attribute.
 * @param {String} [options.colClass='grid-overlay-col'] Column node class attribute.
 * @param {String} [options.colContentClass='grid-overlay-col-content'] Column content (child of Column node) node class attribute.
 * @param {String} [options.controlClass='grid-overlay-control'] Control node class attribute.
 * @param {String} [options.controlRowClass='grid-overlay-control-row'] Control row node class attribute.
 * @param {String} [options.controlKbdClass='grid-overlay-control-kbd'] Keyboard shortcut info node class attribute.
 * @param {String} [options.controlCheckboxClass='grid-overlay-control-checkbox'] Control checkbox node class attribute.
 * @param {String} [options.controlLabelClass='grid-overlay-control-label'] Control label node class attribute.
 * @param {String} [options.controlMaxWidthClass='grid-overlay-control-max-width'] Control max width node (where max width value appears) class attribute.
 * @param {String} [options.controlWidthClass='grid-overlay-control-width'] Control width node (where current width value appears) class attribute.
 * @param {Object} [options.callbacks] User supplied functions to execute at given stages of the component lifecycle.
 * @param {Function} options.callbacks.preCreate Before nodes created and added to the DOM.
 * @param {Function} options.callbacks.postCreate After all nodes created and added to the DOM.
 * @param {Function} options.callbacks.preRender Before overlay position and visibility calculated.
 * @param {Function} options.callbacks.postRender After overlay position and visibility calculated.
 * @param {Function} options.callbacks.preMakeControlDraggable Before init draggable lib. Will be called even if draggable=false.
 * @param {Function} options.callbacks.postMakeControlDraggable After init draggable lib. Will be called even if draggable=false.
 * @param {Function} options.callbacks.preToggleControl Before toggle control.
 * @param {Function} options.callbacks.postToggleControl After toggle control.
 * @param {Function} options.callbacks.preDestroy Before nodes removing.
 * @param {Function} options.callbacks.postDestroy After nodes removed.
 **/
function GridOverlay(options) {
    var defaults, i, adaptiveOptions, media;

    defaults = {
        overlayParentEl: null,
        controlParentEl: null,
        maxWidth: 1440,
        cols: 12,
        gridGutter: 8,
        extraLeftRightGutter: 0,
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
        draggable: true,
        overlayVisible: true,
        writeInlineStylesOverlay: true,
        writeInlineStylesControl: true,
        windowResizeDelay: 50,
        controlZIndex: 1200,
        controlBackgroundColor: '#474747',
        controlFontColor: '#FFFFFF',
        controlOpacity: 0.9,
        controlPadding: 30,
        controlTop: 'auto',
        controlRight: 'auto',
        controlBottom: 'auto',
        controlLeft: 'auto',
        controlPosition: 'static',
        overlayZIndex: 1100,
        overlayOpacity: 0.4,
        foregroundColor: '#409bd2',
        backgroundColor: '#80bde1',
        overlayClass: 'grid-overlay-overlay',
        colClass: 'grid-overlay-col',
        colContentClass: 'grid-overlay-col-content',
        controlClass: 'grid-overlay-control',
        controlKbdClass: 'grid-overlay-control-kbd',
        controlRowClass: 'grid-overlay-control-row',
        controlCheckboxClass: 'grid-overlay-control-checkbox',
        controlLabelClass: 'grid-overlay-control-label',
        controlMaxWidthClass: 'grid-overlay-control-max-width',
        controlWidthClass: 'grid-overlay-control-width'
    };

    this.body = document.getElementsByTagName('body')[0];

    //put supplied options on top of defaults
    merge(this, defaults, options);

    this.adaptiveOptionsList = [];

    for (i = 0; i < this.adaptive.length; i++) {
        adaptiveOptions = {
            mediaQuery: null,
            cols: null,
            gridGutter: null,
            extraLeftRightGutter: null,
            isActive: false
        };

        if (!this.adaptive[i].mediaQuery) {
            throw 'GridOverlay: Adaptive option must have "mediaQuery" param';
        } else {
            adaptiveOptions.mediaQuery = this.adaptive[i].mediaQuery;
            media = window.matchMedia(this.adaptive[i].mediaQuery);
            media.addListener(this.onMediaChanged.bind(this, adaptiveOptions));
            adaptiveOptions.isActive = media.matches;
        }

        if (!this.adaptive[i].cols) {
            throw 'GridOverlay: Adaptive option must have not 0 "cols" param';
        } else {
            adaptiveOptions.cols = this.adaptive[i].cols;
        }

        if ('gridGutter' in this.adaptive[i]) {
            adaptiveOptions.gridGutter = this.adaptive[i].gridGutter;
        } else {
            throw 'GridOverlay: Adaptive option must have "gridGutter" param';
        }

        if ('extraLeftRightGutter' in this.adaptive[i]) {
            adaptiveOptions.extraLeftRightGutter = this.adaptive[i].extraLeftRightGutter;
        } else {
            throw 'GridOverlay: Adaptive option must have "extraLeftRightGutter" param';
        }

        this.adaptiveOptionsList.push(adaptiveOptions);
    }

    this.adaptiveOptionsList.push({
        mediaQuery: null,
        cols: this.cols,
        gridGutter: this.gridGutter,
        extraLeftRightGutter: this.extraLeftRightGutter,
        isActive: true
    });

    this.overlay = null;
    this.grid = [];
    this.control = null;
    this.checkbox = null;
    this.widthEl = null;

    this.callCustom('preCreate');

    adaptiveOptions = this.detectAdaptiveOptions();

    this.cols = adaptiveOptions.cols;
    this.gridGutter = adaptiveOptions.gridGutter;
    this.extraLeftRightGutter = adaptiveOptions.extraLeftRightGutter;

    this.buildOverlay();

    this.buildGrid();

    this.buildControl();

    this.makeControlDraggable();

    this.render();

    this.windowResizeFn = debounce(this.onWindowResize.bind(this), this.windowResizeDelay);
    window.addEventListener('resize', this.windowResizeFn);

    this.documentKeydownFn = this.documentKeydown.bind(this);
    document.addEventListener('keydown', this.documentKeydownFn);

    window.addEventListener('unload', this.destroy.bind(this));

    this.callCustom('postCreate');
}

GridOverlay.prototype.constructor = GridOverlay;

/**
 * @method callCustom
 * @memberOf GridOverlay
 * @instance
 * @summary Execute an implementation defined callback on a certain action.
 * @private
 */
GridOverlay.prototype.callCustom = function (userFn) {
    var sliced;

    sliced = Array.prototype.slice.call(arguments, 1);

    if (this.callbacks !== undefined && this.callbacks[userFn] !== undefined && typeof this.callbacks[userFn] === 'function') {
        this.callbacks[userFn].apply(this, sliced);
    }
};

/**
 * @method onMediaChanged
 * @memberOf GridOverlay
 * @instance
 * @summary MediaMatch was changed event handler.
 * @private
 */
GridOverlay.prototype.onMediaChanged = function onMediaChanged(adaptiveOptions, mediaQueryList) {
    adaptiveOptions.isActive = mediaQueryList.matches;
};

/**
 * @method onWindowResize
 * @memberOf GridOverlay
 * @instance
 * @summary Window resize event handler.
 * @private
 */
GridOverlay.prototype.onWindowResize = function onWindowResize() {
    var adaptiveOptions;

    adaptiveOptions = this.detectAdaptiveOptions();

    if (this.overlay) {
        if (adaptiveOptions.extraLeftRightGutter !== this.extraLeftRightGutter) {
            this.extraLeftRightGutter = adaptiveOptions.extraLeftRightGutter;
            this.overlay.style.paddingLeft = 1 * this.extraLeftRightGutter + 'px';
            this.overlay.style.paddingRight = 1 * this.extraLeftRightGutter + 'px';
        }
    }

    // Rebuild grid
    if (adaptiveOptions.cols !== this.cols || adaptiveOptions.gridGutter !== this.gridGutter) {
        this.cols = adaptiveOptions.cols;
        this.gridGutter = adaptiveOptions.gridGutter;
        this.buildGrid();
    }

    this.render();
};

/**
 * @method detectAdaptiveOptions
 * @memberOf GridOverlay
 * @instance
 * @summary Detect current adaptiveOptions, depending on adaptiveOptions.mediaQuery.
 * @private
 */
GridOverlay.prototype.detectAdaptiveOptions = function detectAdaptiveOptions() {
    var i;

    for (i = 0; i < this.adaptiveOptionsList.length; i++) {
        if (this.adaptiveOptionsList[i].isActive) {
            return this.adaptiveOptionsList[i];
        }
    }
};

/**
 * @method documentKeydown
 * @memberOf GridOverlay
 * @instance
 * @summary Document keydown event handler.
 * @private
 */
GridOverlay.prototype.documentKeydown = function documentKeydown(event) {
    if (event.keyCode === 71 && event.altKey) {
        event.stopPropagation();
        if (this.overlayVisible) {
            this.hideControl();
        } else {
            this.showControl();
        }
    }
};

/**
 * @method render
 * @memberOf GridOverlay
 * @instance
 * @summary Process overlay node styles in accordance with window width and update width value in control.
 * @private
 */
GridOverlay.prototype.render = function render() {
    var viewport, leftRight, i;

    viewport = {
        width: (window.clientWidth || document.documentElement.clientWidth || this.body.clientWidth),
        height: (window.innerHeight || document.documentElement.clientHeight || this.body.clientHeight)
    };

    this.callCustom('preRender');

    this.widthEl.textContent = viewport.width + 'px';
    this.maxWidthEl.textContent = this.maxWidth ? (this.maxWidth + 'px') : 'auto';

    if (this.overlayVisible) {
        this.overlay.style.display = 'block';
    } else {
        this.overlay.style.display = 'none';
        return;
    }

    leftRight = '0';
    if (this.maxWidth !== null && viewport.width > this.maxWidth) {
        leftRight = (viewport.width - this.maxWidth) / 2 + 'px';
    }

    this.overlay.style.left = leftRight;
    this.overlay.style.right = leftRight;

    for (i = 0; i < this.grid.length; i++) {
        this.grid[i][1].style.height = viewport.height + 'px';
    }

    this.callCustom('postRender');
};

/**
 * @method buildOverlay
 * @memberOf GridOverlay
 * @instance
 * @summary Create overlay related node and put it in the DOM.
 * @private
 */
GridOverlay.prototype.buildOverlay = function buildOverlay() {
    var overlayParentEl;

    this.overlay = document.createElement('div');
    this.overlay.className = this.overlayClass;

    if (this.maxWidth) {
        this.overlay.style.maxWidth = this.maxWidth + 'px';
    } else {
        this.overlay.style.maxWidth = 'auto';
    }

    this.overlay.style.display = 'none';

    if (this.writeInlineStylesOverlay) {
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.bottom = '0';
        this.overlay.style.pointerEvents = 'none';
        this.overlay.style.backgroundColor = this.backgroundColor;
        this.overlay.style.opacity = this.overlayOpacity;
        this.overlay.style.paddingLeft = 1 * this.extraLeftRightGutter + 'px';
        this.overlay.style.paddingRight = 1 * this.extraLeftRightGutter + 'px';
        this.overlay.style.zIndex = 1 * this.overlayZIndex;
    }

    if (this.overlayParentEl) {
        if (typeof this.overlayParentEl === 'string') {
            overlayParentEl = document.querySelector(this.overlayParentEl);
        } else {
            overlayParentEl = this.overlayParentEl;
        }
        if (!overlayParentEl) {
            throw 'GridOverlay: "overlayParentEl" is not found';
        }
        overlayParentEl.appendChild(this.overlay);
    } else {
        this.body.insertBefore(this.overlay, this.body.firstChild);
    }
};

/**
 * @method buildGrid
 * @memberOf GridOverlay
 * @instance
 * @summary Create grid columns related nodes and put them into overlay node.
 * @private
 */
GridOverlay.prototype.buildGrid = function buildGrid() {
    var i, col, colContent;

    for (i = 0; i < this.grid.length; i++) {
        col = this.grid[i][0];
        col.parentNode.removeChild(col);
    }

    this.grid = [];
    for (i = 1; i <= this.cols; i++) {
        col = document.createElement('div');
        col.className = this.colClass;

        if (this.writeInlineStylesOverlay) {
            col.style.boxSizing = 'border-box';
            col.style.float = 'left';

            col.style.paddingLeft = this.gridGutter + 'px';
            col.style.paddingRight = this.gridGutter + 'px';

            col.style.width = 1 / this.cols * 100 + '%';
        }

        colContent = document.createElement('div');
        colContent.className = this.colContentClass;
        if (this.writeInlineStylesOverlay) {
            colContent.style.backgroundColor = this.foregroundColor;
        }

        col.appendChild(colContent);
        this.overlay.appendChild(col);

        this.grid.push([col, colContent]);
    }
};

/**
 * @method buildControl
 * @memberOf GridOverlay
 * @instance
 * @summary Create control related nodes and put them into the DOM.
 * @private
 */
GridOverlay.prototype.buildControl = function buildControl() {
    var controlParentEl, row, label, kbd;

    this.control = document.createElement('div');
    this.control.className = this.controlClass;

    if (this.writeInlineStylesControl) {
        this.control.style.position = this.controlPosition;
        this.control.style.top = this.controlTop;
        this.control.style.right = this.controlRight;
        this.control.style.bottom = this.controlBottom;
        this.control.style.left = this.controlLeft;

        this.control.style.backgroundColor = this.controlBackgroundColor;
        this.control.style.zIndex = this.controlZIndex;
        this.control.style.opacity = this.controlOpacity;
        this.control.style.padding = this.controlPadding + 'px';
        this.control.style.color = this.controlFontColor;
    }

    // Checkbox
    //

    this.checkbox = document.createElement('input');
    this.checkbox.className = this.controlCheckboxClass;
    this.checkbox.setAttribute('type', 'checkbox');
    this.checkbox.setAttribute('tabindex', 0);
    if (this.overlayVisible) {
        this.checkbox.setAttribute('checked', 'checked');
    }

    this.checkbox.addEventListener('change', this.onControlCheckboxChange.bind(this));

    label = document.createElement('label');
    label.className = this.controlLabelClass;
    label.appendChild(this.checkbox);
    label.appendChild(document.createTextNode(' '));
    label.appendChild(document.createTextNode('Show Grid Columns'));

    row = document.createElement('div');
    row.className = this.controlRowClass;
    row.appendChild(label);
    this.control.appendChild(row);

    // Keyboard
    //

    kbd = document.createElement('kbd');
    kbd.className = this.controlKbdClass;
    if (this.writeInlineStylesControl) {
        kbd.style.padding = '.1rem .4rem';
        kbd.style.backgroundColor = '#ededed';
        kbd.style.border = '1px solid #bfbfbf';
        kbd.style.borderRadius = '3px';
        kbd.style.color = '#474747';
        kbd.style.fontFamily = '"DejaVu Sans Mono", Consolas, Menlo, Monaco, "Lucida Console", "Bitstream Vera Sans Mono", "Courier New", monospace';
        kbd.style.lineHeight = '1.4';
        kbd.style.margin = '0 .1em';
        kbd.style.textShadow = '0 1px 0 #fff';
        kbd.style.whiteSpace = 'nowrap';
    }

    row = document.createElement('div');
    row.className = this.controlRowClass;

    if (navigator && navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
        kbd.textContent = 'Option';
    } else {
        kbd.textContent = 'Alt';
    }

    row.appendChild(kbd);

    row.appendChild(document.createTextNode('+'));

    kbd = kbd.cloneNode();
    kbd.textContent = 'g';
    row.appendChild(kbd);

    this.control.appendChild(row);

    // width
    //

    this.widthEl = document.createElement('span');
    this.widthEl.className = this.controlWidthClass;

    row = document.createElement('div');
    row.className = this.controlRowClass;
    row.appendChild(document.createTextNode('Width:'));
    row.appendChild(this.widthEl);
    this.control.appendChild(row);

    // max width
    //

    this.maxWidthEl = document.createElement('span');
    this.maxWidthEl.textContent = this.maxWidth ? this.maxWidth + 'px' : 'auto';
    this.maxWidthEl.className = this.controlCheckboxClass;

    row = document.createElement('div');
    row.className = this.controlRowClass;
    row.appendChild(document.createTextNode('Max Width:'));
    row.appendChild(this.maxWidthEl);
    this.control.appendChild(row);

    if (this.controlParentEl) {
        if (typeof this.controlParentEl === 'string') {
            controlParentEl = document.querySelector(this.controlParentEl);
        } else {
            controlParentEl = this.controlParentEl;
        }
        if (!controlParentEl) {
            throw '"controlParentEl" is not found';
        }
        controlParentEl.appendChild(this.control);
    } else {
        this.body.appendChild(this.control);
    }
};

/**
 * @method makeControlDraggable
 * @memberOf GridOverlay
 * @instance
 * @summary Make control draggable.
 * @private
 */
GridOverlay.prototype.makeControlDraggable = function makeControlDraggable() {
    this.callCustom('preMakeControlDraggable');

    if (this.draggable) {
        this.controlConstrains = document.createElement('div');

        this.controlConstrains.style.position = 'fixed';
        this.controlConstrains.style.top = '0';
        this.controlConstrains.style.right = '0';
        this.controlConstrains.style.bottom = '0';
        this.controlConstrains.style.left = '0';
        this.controlConstrains.style.right = '0';
        this.controlConstrains.style.pointerEvents = 'none';

        this.body.appendChild(this.controlConstrains);

        dragNdrop({
            element: this.control,
            customStyles: true,
            constraints: this.controlConstrains
        });
    }

    this.callCustom('postMakeControlDraggable');
};

/**
 * @method onControlCheckboxChange
 * @memberOf GridOverlay
 * @instance
 * @summary Control checkbox change event handler.
 */
GridOverlay.prototype.onControlCheckboxChange = function onControlCheckboxChange(event) {
    this.callCustom('preToggleControl');

    this.overlayVisible = event.target.checked;
    this.render();

    this.callCustom('postToggleControl');
};

/**
 * @method showControl
 * @memberOf GridOverlay
 * @instance
 * @summary Public function to show control.
 */
GridOverlay.prototype.showControl = function showControl() {
    var overlayVisibleOld;
    this.callCustom('preToggleControl');

    overlayVisibleOld = this.overlayVisible;

    this.overlayVisible = true;
    this.checkbox.checked = true;

    if (this.overlayVisible !== overlayVisibleOld) {
        this.render();
    }

    this.callCustom('postToggleControl');
};

/**
 * @method hideControl
 * @memberOf GridOverlay
 * @instance
 * @summary Public function to hide control.
 */
GridOverlay.prototype.hideControl = function hideControl() {
    var overlayVisibleOld;
    this.callCustom('preToggleControl');

    overlayVisibleOld = this.overlayVisible;

    this.overlayVisible = false;
    this.checkbox.checked = false;

    if (this.overlayVisible !== overlayVisibleOld) {
        this.render();
    }

    this.callCustom('postToggleControl');
};

/**
 * @method destroy
 * @memberOf GridOverlay
 * @instance
 * @summary Public function to destroy a GridOverlay instance.
 */
GridOverlay.prototype.destroy = function destroy() {
    this.callCustom('preDestroy');

    if (this.controlConstrains && this.controlConstrains.parentNode) {
        this.controlConstrains.parentNode.removeChild(this.controlConstrains);
    }

    if (this.control && this.control.parentNode) {
        this.control.parentNode.removeChild(this.control);
    }

    if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
    }

    if (this.windowResizeFn) {
        window.removeEventListener('resize', this.windowResizeFn);
    }

    if (this.documentKeydownFn) {
        document.removeEventListener('keydown', this.documentKeydownFn);
    }

    this.callCustom('postDestroy');
};

module.exports = GridOverlay;
