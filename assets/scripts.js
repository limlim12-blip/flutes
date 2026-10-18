import htmx from 'htmx.org';
import _hyperscript from 'hyperscript.org';
import Hls from 'hls.js';

window.Hls = Hls;
window.htmx = htmx;
window._hyperscript = _hyperscript;

if (typeof window !== 'undefined') {
    _hyperscript.browserInit();
}
