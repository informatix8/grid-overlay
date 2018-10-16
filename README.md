# grid-overlay

*Everything lines up.*


- [Homepage](https://gridoverlay.com)
- [Docs](https://gridoverlay.com/docs/)
- [Codepen demo](https://codepen.io/informatix/pen/mzMwRO/?editors=1010#0)

## Usage

### Install

```shell
npm install grid-overlay --save-dev
```

### CDN

```html
<script src="https://unpkg.com/grid-overlay@1.2.0/dist/grid-overlay.min.js"></script>
```

### Vanilla Javascript
```javascript
new GridOverlay({
    controlParentEl: '.attach-grid-overlay-control-here',
    maxWidth: 1440,
    columns: 12,
    gridGutter: 8,
    adaptive: [
        {
            mediaQuery: '(max-width: 600px)',
            cols: 2,
            gridGutter: 8
        },
        {
            mediaQuery: '(min-width: 1025px)',
            cols: 12,
            gridGutter: 48
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
    backgroundColor: '#80bde1'
});
```

### Vue Component
```html
<grid-overlay
    v-bind:adaptive="[
      { mediaQuery: '(max-width: 600px)',  cols: 2, gridGutter: 8, extraLeftRightGutter: 0 },
      { mediaQuery: '(min-width: 1025px)', cols: 12, gridGutter: 8, extraLeftRightGutter: 40 }
    ]"
    v-bind:max-width="1440"
    v-bind:draggable="true"
    v-bind:write-inline-styles="true"
    v-bind:background-color="'#aa55aa'"
    v-bind:foreground-color="'#ff00ff'"
    v-bind:pre-create="gridOverlayPreCreate"
></grid-overlay>
```

## Development

### Build

```shell
npm run build
```

```shell
npm run lint
npm run scripts
npm run scripts-vue
```

### Build Demo

```shell
cd demo
npm run build
```

```shell
cd demo-vue
npm run build
```


## Release

```shell
npm run jsdoc
npm run build
npm run scripts
npm run scripts-vue
git tag -a vX.Y.Z
git push origin master
git push origin --tags
npm publish .
```
