'use strict';

var GridOverlayVue = require('../dist/grid-overlay-vue');

Vue.component('grid-overlay', GridOverlayVue);

new Vue({
    el: '#app',
    methods: {
        gridOverlayPreCreate: function () {
            console.log('gridOverlayPreCreate', this);
        }
    }
});
