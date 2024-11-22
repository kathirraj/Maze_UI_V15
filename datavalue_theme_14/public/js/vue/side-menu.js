/*
* Side Menu
*/

import { createApp, ref, onMounted } from 'vue';
import Menu from './components/Menu.vue';

// Create Vue app and mount it
createApp(Menu).mount('#side-menu-component');

// Polyfill the beginsWith function (optional, not recommended to modify native prototypes)
if (!String.prototype.beginsWith) {
    String.prototype.beginsWith = function (string) {
        return this.indexOf(string) === 0;
    };
}
