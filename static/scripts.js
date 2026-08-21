(function () {

      var $parcel$global =
        typeof globalThis !== 'undefined'
          ? globalThis
          : typeof self !== 'undefined'
          ? self
          : typeof window !== 'undefined'
          ? window
          : typeof global !== 'undefined'
          ? global
          : {};
  
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequirebbb8"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequirebbb8"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("hU7Y2", function(module, exports) {
var htmx = function() {
    'use strict';
    // Public API
    const htmx = {
        // Tsc madness here, assigning the functions directly results in an invalid TypeScript output, but reassigning is fine
        /* Event processing */ /** @type {typeof onLoadHelper} */ onLoad: null,
        /** @type {typeof processNode} */ process: null,
        /** @type {typeof addEventListenerImpl} */ on: null,
        /** @type {typeof removeEventListenerImpl} */ off: null,
        /** @type {typeof triggerEvent} */ trigger: null,
        /** @type {typeof ajaxHelper} */ ajax: null,
        /* DOM querying helpers */ /** @type {typeof find} */ find: null,
        /** @type {typeof findAll} */ findAll: null,
        /** @type {typeof closest} */ closest: null,
        /**
     * Returns the input values that would resolve for a given element via the htmx value resolution mechanism
     *
     * @see https://htmx.org/api/#values
     *
     * @param {Element} elt the element to resolve values on
     * @param {HttpVerb} type the request type (e.g. **get** or **post**) non-GET's will include the enclosing form of the element. Defaults to **post**
     * @returns {Object}
     */ values: function(elt, type) {
            const inputValues = getInputValues(elt, type || 'post');
            return inputValues.values;
        },
        /* DOM manipulation helpers */ /** @type {typeof removeElement} */ remove: null,
        /** @type {typeof addClassToElement} */ addClass: null,
        /** @type {typeof removeClassFromElement} */ removeClass: null,
        /** @type {typeof toggleClassOnElement} */ toggleClass: null,
        /** @type {typeof takeClassForElement} */ takeClass: null,
        /** @type {typeof swap} */ swap: null,
        /* Extension entrypoints */ /** @type {typeof defineExtension} */ defineExtension: null,
        /** @type {typeof removeExtension} */ removeExtension: null,
        /* Debugging */ /** @type {typeof logAll} */ logAll: null,
        /** @type {typeof logNone} */ logNone: null,
        /* Debugging */ /**
     * The logger htmx uses to log with
     *
     * @see https://htmx.org/api/#logger
     */ logger: null,
        /**
     * A property holding the configuration htmx uses at runtime.
     *
     * Note that using a [meta tag](https://htmx.org/docs/#config) is the preferred mechanism for setting these properties.
     *
     * @see https://htmx.org/api/#config
     */ config: {
            /**
       * Whether to use history.
       * @type boolean
       * @default true
       */ historyEnabled: true,
            /**
       * The number of pages to keep in **sessionStorage** for history support.
       * @type number
       * @default 10
       */ historyCacheSize: 10,
            /**
       * @type boolean
       * @default false
       */ refreshOnHistoryMiss: false,
            /**
       * The default swap style to use if **[hx-swap](https://htmx.org/attributes/hx-swap)** is omitted.
       * @type HtmxSwapStyle
       * @default 'innerHTML'
       */ defaultSwapStyle: 'innerHTML',
            /**
       * The default delay between receiving a response from the server and doing the swap.
       * @type number
       * @default 0
       */ defaultSwapDelay: 0,
            /**
       * The default delay between completing the content swap and settling attributes.
       * @type number
       * @default 20
       */ defaultSettleDelay: 20,
            /**
       * If true, htmx will inject a small amount of CSS into the page to make indicators invisible unless the **htmx-indicator** class is present.
       * @type boolean
       * @default true
       */ includeIndicatorStyles: true,
            /**
       * The class to place on indicators when a request is in flight.
       * @type string
       * @default 'htmx-indicator'
       */ indicatorClass: 'htmx-indicator',
            /**
       * The class to place on triggering elements when a request is in flight.
       * @type string
       * @default 'htmx-request'
       */ requestClass: 'htmx-request',
            /**
       * The class to temporarily place on elements that htmx has added to the DOM.
       * @type string
       * @default 'htmx-added'
       */ addedClass: 'htmx-added',
            /**
       * The class to place on target elements when htmx is in the settling phase.
       * @type string
       * @default 'htmx-settling'
       */ settlingClass: 'htmx-settling',
            /**
       * The class to place on target elements when htmx is in the swapping phase.
       * @type string
       * @default 'htmx-swapping'
       */ swappingClass: 'htmx-swapping',
            /**
       * Allows the use of eval-like functionality in htmx, to enable **hx-vars**, trigger conditions & script tag evaluation. Can be set to **false** for CSP compatibility.
       * @type boolean
       * @default true
       */ allowEval: true,
            /**
       * If set to false, disables the interpretation of script tags.
       * @type boolean
       * @default true
       */ allowScriptTags: true,
            /**
       * If set, the nonce will be added to inline scripts.
       * @type string
       * @default ''
       */ inlineScriptNonce: '',
            /**
       * If set, the nonce will be added to inline styles.
       * @type string
       * @default ''
       */ inlineStyleNonce: '',
            /**
       * The attributes to settle during the settling phase.
       * @type string[]
       * @default ['class', 'style', 'width', 'height']
       */ attributesToSettle: [
                'class',
                'style',
                'width',
                'height'
            ],
            /**
       * Allow cross-site Access-Control requests using credentials such as cookies, authorization headers or TLS client certificates.
       * @type boolean
       * @default false
       */ withCredentials: false,
            /**
       * @type number
       * @default 0
       */ timeout: 0,
            /**
       * The default implementation of **getWebSocketReconnectDelay** for reconnecting after unexpected connection loss by the event code **Abnormal Closure**, **Service Restart** or **Try Again Later**.
       * @type {'full-jitter' | ((retryCount:number) => number)}
       * @default "full-jitter"
       */ wsReconnectDelay: 'full-jitter',
            /**
       * The type of binary data being received over the WebSocket connection
       * @type BinaryType
       * @default 'blob'
       */ wsBinaryType: 'blob',
            /**
       * @type string
       * @default '[hx-disable], [data-hx-disable]'
       */ disableSelector: '[hx-disable], [data-hx-disable]',
            /**
       * @type {'auto' | 'instant' | 'smooth'}
       * @default 'instant'
       */ scrollBehavior: 'instant',
            /**
       * If the focused element should be scrolled into view.
       * @type boolean
       * @default false
       */ defaultFocusScroll: false,
            /**
       * If set to true htmx will include a cache-busting parameter in GET requests to avoid caching partial responses by the browser
       * @type boolean
       * @default false
       */ getCacheBusterParam: false,
            /**
       * If set to true, htmx will use the View Transition API when swapping in new content.
       * @type boolean
       * @default false
       */ globalViewTransitions: false,
            /**
       * htmx will format requests with these methods by encoding their parameters in the URL, not the request body
       * @type {(HttpVerb)[]}
       * @default ['get', 'delete']
       */ methodsThatUseUrlParams: [
                'get',
                'delete'
            ],
            /**
       * If set to true, disables htmx-based requests to non-origin hosts.
       * @type boolean
       * @default false
       */ selfRequestsOnly: true,
            /**
       * If set to true htmx will not update the title of the document when a title tag is found in new content
       * @type boolean
       * @default false
       */ ignoreTitle: false,
            /**
       * Whether the target of a boosted element is scrolled into the viewport.
       * @type boolean
       * @default true
       */ scrollIntoViewOnBoost: true,
            /**
       * The cache to store evaluated trigger specifications into.
       * You may define a simple object to use a never-clearing cache, or implement your own system using a [proxy object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
       * @type {Object|null}
       * @default null
       */ triggerSpecsCache: null,
            /** @type boolean */ disableInheritance: false,
            /** @type HtmxResponseHandlingConfig[] */ responseHandling: [
                {
                    code: '204',
                    swap: false
                },
                {
                    code: '[23]..',
                    swap: true
                },
                {
                    code: '[45]..',
                    swap: false,
                    error: true
                }
            ],
            /**
       * Whether to process OOB swaps on elements that are nested within the main response element.
       * @type boolean
       * @default true
       */ allowNestedOobSwaps: true,
            /**
       * Whether to treat history cache miss full page reload requests as a "HX-Request" by returning this response header
       * This should always be disabled when using HX-Request header to optionally return partial responses
       * @type boolean
       * @default true
       */ historyRestoreAsHxRequest: true,
            /**
       * Whether to report input validation errors to the end user and update focus to the first input that fails validation.
       * This should always be enabled as this matches default browser form submit behaviour
       * @type boolean
       * @default false
       */ reportValidityOfForms: false
        },
        /** @type {typeof parseInterval} */ parseInterval: null,
        location: /**
     * proxy of window.location used for page reload functions
     * @type location
     */ location,
        /** @type {typeof internalEval} */ _: null,
        version: '2.0.10'
    };
    // Tsc madness part 2
    htmx.onLoad = onLoadHelper;
    htmx.process = processNode;
    htmx.on = addEventListenerImpl;
    htmx.off = removeEventListenerImpl;
    htmx.trigger = triggerEvent;
    htmx.ajax = ajaxHelper;
    htmx.find = find;
    htmx.findAll = findAll;
    htmx.closest = closest;
    htmx.remove = removeElement;
    htmx.addClass = addClassToElement;
    htmx.removeClass = removeClassFromElement;
    htmx.toggleClass = toggleClassOnElement;
    htmx.takeClass = takeClassForElement;
    htmx.swap = swap;
    htmx.defineExtension = defineExtension;
    htmx.removeExtension = removeExtension;
    htmx.logAll = logAll;
    htmx.logNone = logNone;
    htmx.parseInterval = parseInterval;
    htmx._ = internalEval;
    const internalAPI = {
        addTriggerHandler: addTriggerHandler,
        bodyContains: bodyContains,
        canAccessLocalStorage: canAccessLocalStorage,
        findThisElement: findThisElement,
        filterValues: filterValues,
        swap: swap,
        hasAttribute: hasAttribute,
        getAttributeValue: getAttributeValue,
        getClosestAttributeValue: getClosestAttributeValue,
        getClosestMatch: getClosestMatch,
        getExpressionVars: getExpressionVars,
        getHeaders: getHeaders,
        getInputValues: getInputValues,
        getInternalData: getInternalData,
        getSwapSpecification: getSwapSpecification,
        getTriggerSpecs: getTriggerSpecs,
        getTarget: getTarget,
        makeFragment: makeFragment,
        mergeObjects: mergeObjects,
        makeSettleInfo: makeSettleInfo,
        oobSwap: oobSwap,
        querySelectorExt: querySelectorExt,
        settleImmediately: settleImmediately,
        shouldCancel: shouldCancel,
        triggerEvent: triggerEvent,
        triggerErrorEvent: triggerErrorEvent,
        withExtensions: withExtensions
    };
    const VERBS = [
        'get',
        'post',
        'put',
        'delete',
        'patch'
    ];
    const VERB_SELECTOR = VERBS.map(function(verb) {
        return '[hx-' + verb + '], [data-hx-' + verb + ']';
    }).join(', ');
    //= ===================================================================
    // Utilities
    //= ===================================================================
    /**
   * Parses an interval string consistent with the way htmx does. Useful for plugins that have timing-related attributes.
   *
   * Caution: Accepts an int followed by either **s** or **ms**. All other values use **parseFloat**
   *
   * @see https://htmx.org/api/#parseInterval
   *
   * @param {string} str timing string
   * @returns {number|undefined}
   */ function parseInterval(str) {
        if (str == undefined) return undefined;
        let interval = NaN;
        if (str.slice(-2) == 'ms') interval = parseFloat(str.slice(0, -2));
        else if (str.slice(-1) == 's') interval = parseFloat(str.slice(0, -1)) * 1000;
        else if (str.slice(-1) == 'm') interval = parseFloat(str.slice(0, -1)) * 60000;
        else interval = parseFloat(str);
        return isNaN(interval) ? undefined : interval;
    }
    /**
   * @param {Node} elt
   * @param {string} name
   * @returns {(string | null)}
   */ function getRawAttribute(elt, name) {
        return elt instanceof Element && elt.getAttribute(name);
    }
    /**
   * @param {Element} elt
   * @param {string} qualifiedName
   * @returns {boolean}
   */ // resolve with both hx and data-hx prefixes
    function hasAttribute(elt, qualifiedName) {
        return !!elt.hasAttribute && (elt.hasAttribute(qualifiedName) || elt.hasAttribute('data-' + qualifiedName));
    }
    /**
   *
   * @param {Node} elt
   * @param {string} qualifiedName
   * @returns {(string | null)}
   */ function getAttributeValue(elt, qualifiedName) {
        return getRawAttribute(elt, qualifiedName) || getRawAttribute(elt, 'data-' + qualifiedName);
    }
    /**
   * @param {Node} elt
   * @returns {Node | null}
   */ function parentElt(elt) {
        const parent = elt.parentElement;
        if (!parent && elt.parentNode instanceof ShadowRoot) return elt.parentNode;
        return parent;
    }
    /**
   * @returns {Document}
   */ function getDocument() {
        return document;
    }
    /**
   * @param {Node} elt
   * @param {boolean} global
   * @returns {Node|Document}
   */ function getRootNode(elt, global) {
        return elt.getRootNode ? elt.getRootNode({
            composed: global
        }) : getDocument();
    }
    /**
   * @param {Node} elt
   * @param {(e:Node) => boolean} condition
   * @returns {Node | null}
   */ function getClosestMatch(elt, condition) {
        while(elt && !condition(elt))elt = parentElt(elt);
        return elt || null;
    }
    /**
   * @param {Element} initialElement
   * @param {Element} ancestor
   * @param {string} attributeName
   * @returns {string|null}
   */ function getAttributeValueWithDisinheritance(initialElement, ancestor, attributeName) {
        const attributeValue = getAttributeValue(ancestor, attributeName);
        const disinherit = getAttributeValue(ancestor, 'hx-disinherit');
        var inherit = getAttributeValue(ancestor, 'hx-inherit');
        if (initialElement !== ancestor) {
            if (htmx.config.disableInheritance) {
                if (inherit && (inherit === '*' || inherit.split(' ').indexOf(attributeName) >= 0)) return attributeValue;
                else return null;
            }
            if (disinherit && (disinherit === '*' || disinherit.split(' ').indexOf(attributeName) >= 0)) return 'unset';
        }
        return attributeValue;
    }
    /**
   * @param {Element} elt
   * @param {string} attributeName
   * @returns {string | null}
   */ function getClosestAttributeValue(elt, attributeName) {
        let closestAttr = null;
        getClosestMatch(elt, function(e) {
            return !!(closestAttr = getAttributeValueWithDisinheritance(elt, asElement(e), attributeName));
        });
        if (closestAttr !== 'unset') return closestAttr;
    }
    /**
   * @param {Node} elt
   * @param {string} selector
   * @returns {boolean}
   */ function matches(elt, selector) {
        return elt instanceof Element && elt.matches(selector);
    }
    /**
   * @param {string} str
   * @returns {string}
   */ function getStartTag(str) {
        const tagMatcher = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
        const match = tagMatcher.exec(str);
        if (match) return match[1].toLowerCase();
        else return '';
    }
    /**
   * @param {string} resp
   * @returns {Document}
   */ function parseHTML(resp) {
        if ('parseHTMLUnsafe' in Document) return Document.parseHTMLUnsafe(resp);
        const parser = new DOMParser();
        return parser.parseFromString(resp, 'text/html');
    }
    /**
   * @param {DocumentFragment} fragment
   * @param {Node} elt
   */ function takeChildrenFor(fragment, elt) {
        while(elt.childNodes.length > 0)fragment.append(elt.childNodes[0]);
    }
    /**
   * @param {HTMLScriptElement} script
   * @returns {HTMLScriptElement}
   */ function duplicateScript(script) {
        const newScript = getDocument().createElement('script');
        forEach(script.attributes, function(attr) {
            newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = script.textContent;
        newScript.async = false;
        if (htmx.config.inlineScriptNonce) newScript.nonce = htmx.config.inlineScriptNonce;
        return newScript;
    }
    /**
   * @param {HTMLScriptElement} script
   * @returns {boolean}
   */ function isJavaScriptScriptNode(script) {
        return script.matches('script') && (script.type === 'text/javascript' || script.type === 'module' || script.type === '');
    }
    /**
   * we have to make new copies of script tags that we are going to insert because
   * SOME browsers (not saying who, but it involves an element and an animal) don't
   * execute scripts created in <template> tags when they are inserted into the DOM
   * and all the others do lmao
   * @param {DocumentFragment} fragment
   */ function normalizeScriptTags(fragment) {
        Array.from(fragment.querySelectorAll('script')).forEach(/** @param {HTMLScriptElement} script */ (script)=>{
            if (isJavaScriptScriptNode(script)) {
                const newScript = duplicateScript(script);
                const parent = script.parentNode;
                try {
                    parent.insertBefore(newScript, script);
                } catch (e) {
                    logError(e);
                } finally{
                    script.remove();
                }
            }
        });
    }
    /**
   * @typedef {DocumentFragment & {title?: string}} DocumentFragmentWithTitle
   * @description  a document fragment representing the response HTML, including
   * a `title` property for any title information found
   */ /**
   * @param {string} response HTML
   * @returns {DocumentFragmentWithTitle}
   */ function makeFragment(response) {
        // strip head tag to determine shape of response we are dealing with
        const responseWithNoHead = response.replace(/<head(\s[^>]*)?>[\s\S]*?<\/head>/i, '');
        const startTag = getStartTag(responseWithNoHead);
        /** @type DocumentFragmentWithTitle */ let fragment;
        if (startTag === 'html') {
            // if it is a full document, parse it and return the body
            fragment = /** @type DocumentFragmentWithTitle */ new DocumentFragment();
            const doc = parseHTML(response);
            takeChildrenFor(fragment, doc.body);
            fragment.title = doc.title;
        } else if (startTag === 'body') {
            // parse body w/o wrapping in template
            fragment = /** @type DocumentFragmentWithTitle */ new DocumentFragment();
            const doc = parseHTML(responseWithNoHead);
            takeChildrenFor(fragment, doc.body);
            fragment.title = doc.title;
        } else {
            // otherwise we have non-body partial HTML content, so wrap it in a template to maximize parsing flexibility
            const doc = parseHTML('<body><template class="internal-htmx-wrapper">' + responseWithNoHead + '</template></body>');
            fragment = /** @type DocumentFragmentWithTitle */ doc.querySelector('template').content;
            // extract title into fragment for later processing
            fragment.title = doc.title;
            // for legacy reasons we support a title tag at the root level of non-body responses, so we need to handle it
            var titleElement = fragment.querySelector('title');
            if (titleElement && titleElement.parentNode === fragment) {
                titleElement.remove();
                fragment.title = titleElement.innerText;
            }
        }
        if (fragment) {
            if (htmx.config.allowScriptTags) normalizeScriptTags(fragment);
            else // remove all script tags if scripts are disabled
            fragment.querySelectorAll('script').forEach((script)=>script.remove());
        }
        return fragment;
    }
    /**
   * @param {Function} func
   */ function maybeCall(func) {
        if (func) func();
    }
    /**
   * @param {any} o
   * @param {string} type
   * @returns
   */ function isType(o, type) {
        return Object.prototype.toString.call(o) === '[object ' + type + ']';
    }
    /**
   * @param {*} o
   * @returns {o is Function}
   */ function isFunction(o) {
        return typeof o === 'function';
    }
    /**
   * @param {*} o
   * @returns {o is Object}
   */ function isRawObject(o) {
        return isType(o, 'Object');
    }
    /**
   * @typedef {Object} OnHandler
   * @property {(keyof HTMLElementEventMap)|string} event
   * @property {EventListener} listener
   */ /**
   * @typedef {Object} ListenerInfo
   * @property {string} trigger
   * @property {EventListener} listener
   * @property {EventTarget} on
   */ /**
   * @typedef {Object} HtmxNodeInternalData
   * Element data
   * @property {number} [initHash]
   * @property {boolean} [boosted]
   * @property {OnHandler[]} [onHandlers]
   * @property {number} [timeout]
   * @property {ListenerInfo[]} [listenerInfos]
   * @property {boolean} [cancelled]
   * @property {boolean} [triggeredOnce]
   * @property {number} [delayed]
   * @property {number|null} [throttle]
   * @property {WeakMap<HtmxTriggerSpecification,WeakMap<EventTarget,string>>} [lastValue]
   * @property {boolean} [loaded]
   * @property {string} [path]
   * @property {string} [verb]
   * @property {boolean} [polling]
   * @property {HTMLButtonElement|HTMLInputElement|null} [lastButtonClicked]
   * @property {number} [requestCount]
   * @property {XMLHttpRequest} [xhr]
   * @property {(() => void)[]} [queuedRequests]
   * @property {boolean} [abortable]
   * @property {boolean} [firstInitCompleted]
   *
   * Event data
   * @property {HtmxTriggerSpecification} [triggerSpec]
   * @property {EventTarget[]} [handledFor]
   */ /**
   * getInternalData retrieves "private" data stored by htmx within an element
   * @param {EventTarget|Event} elt
   * @returns {HtmxNodeInternalData}
   */ function getInternalData(elt) {
        const dataProp = 'htmx-internal-data';
        let data = elt[dataProp];
        if (!data) data = elt[dataProp] = {};
        return data;
    }
    /**
   * toArray converts an ArrayLike object into a real array.
   * @template T
   * @param {ArrayLike<T>} arr
   * @returns {T[]}
   */ function toArray(arr) {
        const returnArr = [];
        if (arr) for(let i = 0; i < arr.length; i++)returnArr.push(arr[i]);
        return returnArr;
    }
    /**
   * @template T
   * @param {T[]|NamedNodeMap|HTMLCollection|HTMLFormControlsCollection|ArrayLike<T>} arr
   * @param {(T) => void} func
   */ function forEach(arr, func) {
        if (arr) for(let i = 0; i < arr.length; i++)func(arr[i]);
    }
    /**
   * @param {Element} el
   * @returns {boolean}
   */ function isScrolledIntoView(el) {
        const rect = el.getBoundingClientRect();
        const elemTop = rect.top;
        const elemBottom = rect.bottom;
        return elemTop < window.innerHeight && elemBottom >= 0;
    }
    /**
   * Checks whether the element is in the document (includes shadow roots).
   * This function this is a slight misnomer; it will return true even for elements in the head.
   *
   * @param {Node} elt
   * @returns {boolean}
   */ function bodyContains(elt) {
        return elt.getRootNode({
            composed: true
        }) === document;
    }
    /**
   * @param {string} trigger
   * @returns {string[]}
   */ function splitOnWhitespace(trigger) {
        return trigger.trim().split(/\s+/);
    }
    /**
   * mergeObjects takes all the keys from
   * obj2 and duplicates them into obj1
   * @template T1
   * @template T2
   * @param {T1} obj1
   * @param {T2} obj2
   * @returns {T1 & T2}
   */ function mergeObjects(obj1, obj2) {
        for(const key in obj2)if (obj2.hasOwnProperty(key)) // @ts-ignore tsc doesn't seem to properly handle types merging
        obj1[key] = obj2[key];
        // @ts-ignore tsc doesn't seem to properly handle types merging
        return obj1;
    }
    /**
   * @param {string} jString
   * @returns {any|null}
   */ function parseJSON(jString) {
        try {
            return JSON.parse(jString);
        } catch (error) {
            logError(error);
            return null;
        }
    }
    /**
   * @returns {boolean}
   */ function canAccessLocalStorage() {
        const test = 'htmx:sessionStorageTest';
        try {
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    /**
   * @param {string} path
   * @returns {string}
   */ function normalizePath(path) {
        try {
            const url = new URL(path, window.location.href);
            path = url.pathname + url.search;
        } catch (e) {
        // fallback for malformed URLs
        }
        // remove trailing slash, unless index page
        if (path != '/') path = path.replace(/\/+$/, '');
        return path;
    }
    //= =========================================================================================
    // public API
    //= =========================================================================================
    /**
   * @param {string} str
   * @returns {any}
   */ function internalEval(str) {
        return maybeEval(getDocument().body, function() {
            return eval(str);
        });
    }
    /**
   * Adds a callback for the **htmx:load** event. This can be used to process new content, for example initializing the content with a javascript library
   *
   * @see https://htmx.org/api/#onLoad
   *
   * @param {(elt: Node) => void} callback the callback to call on newly loaded content
   * @returns {EventListener}
   */ function onLoadHelper(callback) {
        const value = htmx.on('htmx:load', /** @param {CustomEvent} evt */ function(evt) {
            callback(evt.detail.elt);
        });
        return value;
    }
    /**
   * Log all htmx events, useful for debugging.
   *
   * @see https://htmx.org/api/#logAll
   */ function logAll() {
        htmx.logger = function(elt, event, data) {
            if (console) console.log(event, elt, data);
        };
    }
    function logNone() {
        htmx.logger = null;
    }
    /**
   * Finds an element matching the selector
   *
   * @see https://htmx.org/api/#find
   *
   * @param {ParentNode|string} eltOrSelector  the root element to find the matching element in, inclusive | the selector to match
   * @param {string} [selector] the selector to match
   * @returns {Element|null}
   */ function find(eltOrSelector, selector) {
        if (typeof eltOrSelector !== 'string') return eltOrSelector.querySelector(selector);
        else return find(getDocument(), eltOrSelector);
    }
    /**
   * Finds all elements matching the selector
   *
   * @see https://htmx.org/api/#findAll
   *
   * @param {ParentNode|string} eltOrSelector the root element to find the matching elements in, inclusive | the selector to match
   * @param {string} [selector] the selector to match
   * @returns {NodeListOf<Element>}
   */ function findAll(eltOrSelector, selector) {
        if (typeof eltOrSelector !== 'string') return eltOrSelector.querySelectorAll(selector);
        else return findAll(getDocument(), eltOrSelector);
    }
    /**
   * @returns Window
   */ function getWindow() {
        return window;
    }
    /**
   * Removes an element from the DOM
   *
   * @see https://htmx.org/api/#remove
   *
   * @param {Node} elt
   * @param {number} [delay]
   */ function removeElement(elt, delay) {
        elt = resolveTarget(elt);
        if (delay) getWindow().setTimeout(function() {
            removeElement(elt);
            elt = null;
        }, delay);
        else parentElt(elt).removeChild(elt);
    }
    /**
   * @param {any} elt
   * @return {Element|null}
   */ function asElement(elt) {
        return elt instanceof Element ? elt : null;
    }
    /**
   * @param {any} elt
   * @return {HTMLElement|null}
   */ function asHtmlElement(elt) {
        return elt instanceof HTMLElement ? elt : null;
    }
    /**
   * @param {any} value
   * @return {string|null}
   */ function asString(value) {
        return typeof value === 'string' ? value : null;
    }
    /**
   * @param {EventTarget} elt
   * @return {ParentNode|null}
   */ function asParentNode(elt) {
        return elt instanceof Element || elt instanceof Document || elt instanceof DocumentFragment ? elt : null;
    }
    /**
   * This method adds a class to the given element.
   *
   * @see https://htmx.org/api/#addClass
   *
   * @param {Element|string} elt the element to add the class to
   * @param {string} clazz the class to add
   * @param {number} [delay] the delay (in milliseconds) before class is added
   */ function addClassToElement(elt, clazz, delay) {
        elt = asElement(resolveTarget(elt));
        if (!elt) return;
        if (delay) getWindow().setTimeout(function() {
            addClassToElement(elt, clazz);
            elt = null;
        }, delay);
        else elt.classList && elt.classList.add(clazz);
    }
    /**
   * Removes a class from the given element
   *
   * @see https://htmx.org/api/#removeClass
   *
   * @param {Node|string} node element to remove the class from
   * @param {string} clazz the class to remove
   * @param {number} [delay] the delay (in milliseconds before class is removed)
   */ function removeClassFromElement(node, clazz, delay) {
        let elt = asElement(resolveTarget(node));
        if (!elt) return;
        if (delay) getWindow().setTimeout(function() {
            removeClassFromElement(elt, clazz);
            elt = null;
        }, delay);
        else if (elt.classList) {
            elt.classList.remove(clazz);
            // if there are no classes left, remove the class attribute
            if (elt.classList.length === 0) elt.removeAttribute('class');
        }
    }
    /**
   * Toggles the given class on an element
   *
   * @see https://htmx.org/api/#toggleClass
   *
   * @param {Element|string} elt the element to toggle the class on
   * @param {string} clazz the class to toggle
   */ function toggleClassOnElement(elt, clazz) {
        elt = resolveTarget(elt);
        elt.classList.toggle(clazz);
    }
    /**
   * Takes the given class from its siblings, so that among its siblings, only the given element will have the class.
   *
   * @see https://htmx.org/api/#takeClass
   *
   * @param {Node|string} elt the element that will take the class
   * @param {string} clazz the class to take
   */ function takeClassForElement(elt, clazz) {
        elt = resolveTarget(elt);
        forEach(elt.parentElement.children, function(child) {
            removeClassFromElement(child, clazz);
        });
        addClassToElement(asElement(elt), clazz);
    }
    /**
   * Finds the closest matching element in the given elements parentage, inclusive of the element
   *
   * @see https://htmx.org/api/#closest
   *
   * @param {Element|string} elt the element to find the selector from
   * @param {string} selector the selector to find
   * @returns {Element|null}
   */ function closest(elt, selector) {
        elt = asElement(resolveTarget(elt));
        if (elt) return elt.closest(selector);
        return null;
    }
    /**
   * @param {string} str
   * @param {string} prefix
   * @returns {boolean}
   */ function startsWith(str, prefix) {
        return str.substring(0, prefix.length) === prefix;
    }
    /**
   * @param {string} str
   * @param {string} suffix
   * @returns {boolean}
   */ function endsWith(str, suffix) {
        return str.substring(str.length - suffix.length) === suffix;
    }
    /**
   * @param {string} selector
   * @returns {string}
   */ function normalizeSelector(selector) {
        const trimmedSelector = selector.trim();
        if (startsWith(trimmedSelector, '<') && endsWith(trimmedSelector, '/>')) return trimmedSelector.substring(1, trimmedSelector.length - 2);
        else return trimmedSelector;
    }
    /**
   * @param {Node|Element|Document|string} elt
   * @param {string} selector
   * @param {boolean=} global
   * @returns {(Node|Window)[]}
   */ function querySelectorAllExt(elt, selector, global) {
        if (selector.indexOf('global ') === 0) return querySelectorAllExt(elt, selector.slice(7), true);
        elt = resolveTarget(elt);
        const parts = [];
        {
            let chevronsCount = 0;
            let offset = 0;
            for(let i = 0; i < selector.length; i++){
                const char = selector[i];
                if (char === ',' && chevronsCount === 0) {
                    parts.push(selector.substring(offset, i));
                    offset = i + 1;
                    continue;
                }
                if (char === '<') chevronsCount++;
                else if (char === '/' && i < selector.length - 1 && selector[i + 1] === '>') chevronsCount--;
            }
            if (offset < selector.length) parts.push(selector.substring(offset));
        }
        const result = [];
        const unprocessedParts = [];
        while(parts.length > 0){
            const selector = normalizeSelector(parts.shift());
            let item;
            if (selector.indexOf('closest ') === 0) item = closest(asElement(elt), normalizeSelector(selector.slice(8)));
            else if (selector.indexOf('find ') === 0) item = find(asParentNode(elt), normalizeSelector(selector.slice(5)));
            else if (selector === 'next' || selector === 'nextElementSibling') item = asElement(elt).nextElementSibling;
            else if (selector.indexOf('next ') === 0) item = scanForwardQuery(elt, normalizeSelector(selector.slice(5)), !!global);
            else if (selector === 'previous' || selector === 'previousElementSibling') item = asElement(elt).previousElementSibling;
            else if (selector.indexOf('previous ') === 0) item = scanBackwardsQuery(elt, normalizeSelector(selector.slice(9)), !!global);
            else if (selector === 'document') item = document;
            else if (selector === 'window') item = window;
            else if (selector === 'body') item = document.body;
            else if (selector === 'root') item = getRootNode(elt, !!global);
            else if (selector === 'host') item = /** @type ShadowRoot */ elt.getRootNode().host;
            else unprocessedParts.push(selector);
            if (item) result.push(item);
        }
        if (unprocessedParts.length > 0) {
            const standardSelector = unprocessedParts.join(',');
            const rootNode = asParentNode(getRootNode(elt, !!global));
            result.push(...toArray(rootNode.querySelectorAll(standardSelector)));
        }
        return result;
    }
    /**
   * @param {Node} start
   * @param {string} match
   * @param {boolean} global
   * @returns {Element}
   */ var scanForwardQuery = function(start, match, global) {
        const results = asParentNode(getRootNode(start, global)).querySelectorAll(match);
        for(let i = 0; i < results.length; i++){
            const elt = results[i];
            if (elt.compareDocumentPosition(start) === Node.DOCUMENT_POSITION_PRECEDING) return elt;
        }
    };
    /**
   * @param {Node} start
   * @param {string} match
   * @param {boolean} global
   * @returns {Element}
   */ var scanBackwardsQuery = function(start, match, global) {
        const results = asParentNode(getRootNode(start, global)).querySelectorAll(match);
        for(let i = results.length - 1; i >= 0; i--){
            const elt = results[i];
            if (elt.compareDocumentPosition(start) === Node.DOCUMENT_POSITION_FOLLOWING) return elt;
        }
    };
    /**
   * @param {Node|string} eltOrSelector
   * @param {string=} selector
   * @returns {Node|Window}
   */ function querySelectorExt(eltOrSelector, selector) {
        if (typeof eltOrSelector !== 'string') return querySelectorAllExt(eltOrSelector, selector)[0];
        else return querySelectorAllExt(getDocument().body, eltOrSelector)[0];
    }
    /**
   * @template {EventTarget} T
   * @param {T|string} eltOrSelector
   * @param {T} [context]
   * @returns {Element|T|null}
   */ function resolveTarget(eltOrSelector, context) {
        if (typeof eltOrSelector === 'string') return find(asParentNode(context) || document, eltOrSelector);
        else return eltOrSelector;
    }
    /**
   * @typedef {keyof HTMLElementEventMap|string} AnyEventName
   */ /**
   * @typedef {Object} EventArgs
   * @property {EventTarget} target
   * @property {AnyEventName} event
   * @property {EventListener} listener
   * @property {Object|boolean} options
   */ /**
   * @param {EventTarget|AnyEventName} arg1
   * @param {AnyEventName|EventListener} arg2
   * @param {EventListener|Object|boolean} [arg3]
   * @param {Object|boolean} [arg4]
   * @returns {EventArgs}
   */ function processEventArgs(arg1, arg2, arg3, arg4) {
        if (isFunction(arg2)) return {
            target: getDocument().body,
            event: asString(arg1),
            listener: arg2,
            options: arg3
        };
        else return {
            target: resolveTarget(arg1),
            event: asString(arg2),
            listener: arg3,
            options: arg4
        };
    }
    /**
   * Adds an event listener to an element
   *
   * @see https://htmx.org/api/#on
   *
   * @param {EventTarget|string} arg1 the element to add the listener to | the event name to add the listener for
   * @param {string|EventListener} arg2 the event name to add the listener for | the listener to add
   * @param {EventListener|Object|boolean} [arg3] the listener to add | options to add
   * @param {Object|boolean} [arg4] options to add
   * @returns {EventListener}
   */ function addEventListenerImpl(arg1, arg2, arg3, arg4) {
        ready(function() {
            const eventArgs = processEventArgs(arg1, arg2, arg3, arg4);
            eventArgs.target.addEventListener(eventArgs.event, eventArgs.listener, eventArgs.options);
        });
        const b = isFunction(arg2);
        return b ? arg2 : arg3;
    }
    /**
   * Removes an event listener from an element
   *
   * @see https://htmx.org/api/#off
   *
   * @param {EventTarget|string} arg1 the element to remove the listener from | the event name to remove the listener from
   * @param {string|EventListener} arg2 the event name to remove the listener from | the listener to remove
   * @param {EventListener} [arg3] the listener to remove
   * @returns {EventListener}
   */ function removeEventListenerImpl(arg1, arg2, arg3) {
        ready(function() {
            const eventArgs = processEventArgs(arg1, arg2, arg3);
            eventArgs.target.removeEventListener(eventArgs.event, eventArgs.listener);
        });
        return isFunction(arg2) ? arg2 : arg3;
    }
    //= ===================================================================
    // Node processing
    //= ===================================================================
    const DUMMY_ELT = getDocument().createElement('output') // dummy element for bad selectors
    ;
    /**
   * @param {Element} elt
   * @param {string} attrName
   * @returns {(Node|Window)[]}
   */ function findAttributeTargets(elt, attrName) {
        const attrTarget = getClosestAttributeValue(elt, attrName);
        if (attrTarget) {
            if (attrTarget === 'this') return [
                findThisElement(elt, attrName)
            ];
            else {
                const result = querySelectorAllExt(elt, attrTarget);
                // find `inherit` whole word in value, make sure it's surrounded by commas or is at the start/end of string
                const shouldInherit = /(^|,)(\s*)inherit(\s*)($|,)/.test(attrTarget);
                if (shouldInherit) {
                    const eltToInheritFrom = asElement(getClosestMatch(elt, function(parent) {
                        return parent !== elt && hasAttribute(asElement(parent), attrName);
                    }));
                    if (eltToInheritFrom) result.push(...findAttributeTargets(eltToInheritFrom, attrName));
                }
                if (result.length === 0) {
                    logError('The selector "' + attrTarget + '" on ' + attrName + ' returned no matches!');
                    return [
                        DUMMY_ELT
                    ];
                } else return result;
            }
        }
    }
    /**
   * @param {Element} elt
   * @param {string} attribute
   * @returns {Element|null}
   */ function findThisElement(elt, attribute) {
        return asElement(getClosestMatch(elt, function(elt) {
            return getAttributeValue(asElement(elt), attribute) != null;
        }));
    }
    /**
   * @param {Element} elt
   * @returns {Node|Window|null}
   */ function getTarget(elt) {
        const targetStr = getClosestAttributeValue(elt, 'hx-target');
        if (targetStr) {
            if (targetStr === 'this') return findThisElement(elt, 'hx-target');
            else return querySelectorExt(elt, targetStr);
        } else {
            const data = getInternalData(elt);
            if (data.boosted) return getDocument().body;
            else return elt;
        }
    }
    /**
   * @param {string} name
   * @returns {boolean}
   */ function shouldSettleAttribute(name) {
        return htmx.config.attributesToSettle.includes(name);
    }
    /**
   * @param {Element} mergeTo
   * @param {Element} mergeFrom
   */ function cloneAttributes(mergeTo, mergeFrom) {
        forEach(Array.from(mergeTo.attributes), function(attr) {
            if (!mergeFrom.hasAttribute(attr.name) && shouldSettleAttribute(attr.name)) mergeTo.removeAttribute(attr.name);
        });
        forEach(mergeFrom.attributes, function(attr) {
            if (shouldSettleAttribute(attr.name)) mergeTo.setAttribute(attr.name, attr.value);
        });
    }
    /**
   * @param {HtmxSwapStyle} swapStyle
   * @param {Element} target
   * @returns {boolean}
   */ function isInlineSwap(swapStyle, target) {
        const extensions = getExtensions(target);
        for(let i = 0; i < extensions.length; i++){
            const extension = extensions[i];
            try {
                if (extension.isInlineSwap(swapStyle)) return true;
            } catch (e) {
                logError(e);
            }
        }
        return swapStyle === 'outerHTML';
    }
    /**
   * @param {string} oobValue
   * @param {Element} oobElement
   * @param {HtmxSettleInfo} settleInfo
   * @param {Node|Document} [rootNode]
   * @returns
   */ function oobSwap(oobValue, oobElement, settleInfo, rootNode) {
        rootNode = rootNode || getDocument();
        let selector = '#' + CSS.escape(getRawAttribute(oobElement, 'id'));
        /** @type HtmxSwapStyle */ let swapStyle = 'outerHTML';
        if (oobValue === 'true') ;
        else if (oobValue.indexOf(':') > 0) {
            swapStyle = oobValue.substring(0, oobValue.indexOf(':'));
            selector = oobValue.substring(oobValue.indexOf(':') + 1);
        } else swapStyle = oobValue;
        oobElement.removeAttribute('hx-swap-oob');
        oobElement.removeAttribute('data-hx-swap-oob');
        const targets = querySelectorAllExt(rootNode, selector, false);
        if (targets.length) {
            forEach(targets, function(target) {
                let fragment;
                const oobElementClone = oobElement.cloneNode(true);
                fragment = getDocument().createDocumentFragment();
                fragment.appendChild(oobElementClone);
                if (!isInlineSwap(swapStyle, target)) fragment = asParentNode(oobElementClone) // if this is not an inline swap, we use the content of the node, not the node itself
                ;
                const beforeSwapDetails = {
                    shouldSwap: true,
                    target: target,
                    fragment: fragment
                };
                if (!triggerEvent(target, 'htmx:oobBeforeSwap', beforeSwapDetails)) return;
                target = beforeSwapDetails.target // allow re-targeting
                ;
                if (beforeSwapDetails.shouldSwap) {
                    handlePreservedElements(fragment);
                    swapWithStyle(swapStyle, target, target, fragment, settleInfo);
                    restorePreservedElements();
                }
                forEach(settleInfo.elts, function(elt) {
                    triggerEvent(elt, 'htmx:oobAfterSwap', beforeSwapDetails);
                });
            });
            oobElement.parentNode.removeChild(oobElement);
        } else {
            oobElement.parentNode.removeChild(oobElement);
            triggerErrorEvent(getDocument().body, 'htmx:oobErrorNoTarget', {
                content: oobElement,
                target: selector
            });
        }
        return oobValue;
    }
    function restorePreservedElements() {
        const pantry = find('#--htmx-preserve-pantry--');
        if (pantry) {
            for (const preservedElt of [
                ...pantry.children
            ]){
                const existingElement = find('#' + preservedElt.id);
                // @ts-ignore - use proposed moveBefore feature
                existingElement.parentNode.moveBefore(preservedElt, existingElement);
                existingElement.remove();
            }
            pantry.remove();
        }
    }
    /**
   * @param {DocumentFragment|ParentNode} fragment
   */ function handlePreservedElements(fragment) {
        forEach(findAll(fragment, '[hx-preserve], [data-hx-preserve]'), function(preservedElt) {
            const id = getAttributeValue(preservedElt, 'id');
            const existingElement = getDocument().getElementById(id);
            if (existingElement != null) {
                if (preservedElt.moveBefore) {
                    // get or create a storage spot for stuff
                    let pantry = find('#--htmx-preserve-pantry--');
                    if (pantry == null) {
                        getDocument().body.insertAdjacentHTML('afterend', "<div id='--htmx-preserve-pantry--'></div>");
                        pantry = find('#--htmx-preserve-pantry--');
                    }
                    // @ts-ignore - use proposed moveBefore feature
                    pantry.moveBefore(existingElement, null);
                } else preservedElt.parentNode.replaceChild(existingElement, preservedElt);
            }
        });
    }
    /**
   * @param {Node} parentNode
   * @param {ParentNode} fragment
   * @param {HtmxSettleInfo} settleInfo
   */ function handleAttributes(parentNode, fragment, settleInfo) {
        forEach(fragment.querySelectorAll('[id]'), function(newNode) {
            const id = getRawAttribute(newNode, 'id');
            if (id && id.length > 0) {
                const parentElt = asParentNode(parentNode);
                const oldNode = parentElt && parentElt.querySelector(CSS.escape(newNode.tagName) + '#' + CSS.escape(id));
                if (oldNode && oldNode !== parentElt) {
                    const newAttributes = newNode.cloneNode();
                    cloneAttributes(newNode, oldNode);
                    settleInfo.tasks.push(function() {
                        cloneAttributes(newNode, newAttributes);
                    });
                }
            }
        });
    }
    /**
   * @param {Node} child
   * @returns {HtmxSettleTask}
   */ function makeAjaxLoadTask(child) {
        return function() {
            removeClassFromElement(child, htmx.config.addedClass);
            processNode(asElement(child));
            processFocus(asParentNode(child));
            triggerEvent(child, 'htmx:load');
        };
    }
    /**
   * @param {ParentNode} child
   */ function processFocus(child) {
        const autofocus = '[autofocus]';
        const autoFocusedElt = asHtmlElement(matches(child, autofocus) ? child : child.querySelector(autofocus));
        if (autoFocusedElt != null) autoFocusedElt.focus();
    }
    /**
   * @param {Node} parentNode
   * @param {Node} insertBefore
   * @param {ParentNode} fragment
   * @param {HtmxSettleInfo} settleInfo
   */ function insertNodesBefore(parentNode, insertBefore, fragment, settleInfo) {
        handleAttributes(parentNode, fragment, settleInfo);
        while(fragment.childNodes.length > 0){
            const child = fragment.firstChild;
            addClassToElement(asElement(child), htmx.config.addedClass);
            parentNode.insertBefore(child, insertBefore);
            if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.COMMENT_NODE) settleInfo.tasks.push(makeAjaxLoadTask(child));
        }
    }
    /**
   * based on https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0,
   * derived from Java's string hashcode implementation
   * @param {string} string
   * @param {number} hash
   * @returns {number}
   */ function stringHash(string, hash) {
        let char = 0;
        while(char < string.length)hash = (hash << 5) - hash + string.charCodeAt(char++) | 0 // bitwise or ensures we have a 32-bit int
        ;
        return hash;
    }
    /**
   * @param {Element} elt
   * @returns {number}
   */ function attributeHash(elt) {
        let hash = 0;
        for(let i = 0; i < elt.attributes.length; i++){
            const attribute = elt.attributes[i];
            if (attribute.value) {
                hash = stringHash(attribute.name, hash);
                hash = stringHash(attribute.value, hash);
            }
        }
        return hash;
    }
    /**
   * @param {EventTarget} elt
   */ function deInitOnHandlers(elt) {
        const internalData = getInternalData(elt);
        if (internalData.onHandlers) {
            for(let i = 0; i < internalData.onHandlers.length; i++){
                const handlerInfo = internalData.onHandlers[i];
                removeEventListenerImpl(elt, handlerInfo.event, handlerInfo.listener);
            }
            delete internalData.onHandlers;
        }
    }
    /**
   * @param {Node} element
   */ function deInitNode(element) {
        const internalData = getInternalData(element);
        if (internalData.timeout) clearTimeout(internalData.timeout);
        if (internalData.listenerInfos) forEach(internalData.listenerInfos, function(info) {
            if (info.on) removeEventListenerImpl(info.on, info.trigger, info.listener);
        });
        deInitOnHandlers(element);
        forEach(Object.keys(internalData), function(key) {
            if (key !== 'firstInitCompleted') delete internalData[key];
        });
    }
    /**
   * @param {Node} element
   */ function cleanUpElement(element) {
        triggerEvent(element, 'htmx:beforeCleanupElement');
        deInitNode(element);
        // @ts-ignore
        forEach(element.children, function(child) {
            cleanUpElement(child);
        });
    }
    /**
   * @param {Element} target
   * @param {ParentNode} fragment
   * @param {HtmxSettleInfo} settleInfo
   */ function swapOuterHTML(target, fragment, settleInfo) {
        if (target.tagName === 'BODY') return swapInnerHTML(target, fragment, settleInfo);
        /** @type {Node} */ let newElt;
        const eltBeforeNewContent = target.previousSibling;
        const parentNode = parentElt(target);
        if (!parentNode) return;
        insertNodesBefore(parentNode, target, fragment, settleInfo);
        if (eltBeforeNewContent == null) newElt = parentNode.firstChild;
        else newElt = eltBeforeNewContent.nextSibling;
        settleInfo.elts = settleInfo.elts.filter(function(e) {
            return e !== target;
        });
        // scan through all newly added content and add all elements to the settle info so we trigger
        // events properly on them
        while(newElt && newElt !== target){
            if (newElt instanceof Element) settleInfo.elts.push(newElt);
            newElt = newElt.nextSibling;
        }
        cleanUpElement(target);
        target.remove();
    }
    /**
   * @param {Element} target
   * @param {ParentNode} fragment
   * @param {HtmxSettleInfo} settleInfo
   */ function swapAfterBegin(target, fragment, settleInfo) {
        return insertNodesBefore(target, target.firstChild, fragment, settleInfo);
    }
    /**
   * @param {Element} target
   * @param {ParentNode} fragment
   * @param {HtmxSettleInfo} settleInfo
   */ function swapBeforeBegin(target, fragment, settleInfo) {
        return insertNodesBefore(parentElt(target), target, fragment, settleInfo);
    }
    /**
   * @param {Element} target
   * @param {ParentNode} fragment
   * @param {HtmxSettleInfo} settleInfo
   */ function swapBeforeEnd(target, fragment, settleInfo) {
        return insertNodesBefore(target, null, fragment, settleInfo);
    }
    /**
   * @param {Element} target
   * @param {ParentNode} fragment
   * @param {HtmxSettleInfo} settleInfo
   */ function swapAfterEnd(target, fragment, settleInfo) {
        return insertNodesBefore(parentElt(target), target.nextSibling, fragment, settleInfo);
    }
    /**
   * @param {Element} target
   */ function swapDelete(target) {
        cleanUpElement(target);
        const parent = parentElt(target);
        if (parent) return parent.removeChild(target);
    }
    /**
   * @param {Element} target
   * @param {ParentNode} fragment
   * @param {HtmxSettleInfo} settleInfo
   */ function swapInnerHTML(target, fragment, settleInfo) {
        const firstChild = target.firstChild;
        insertNodesBefore(target, firstChild, fragment, settleInfo);
        if (firstChild) {
            while(firstChild.nextSibling){
                cleanUpElement(firstChild.nextSibling);
                target.removeChild(firstChild.nextSibling);
            }
            cleanUpElement(firstChild);
            target.removeChild(firstChild);
        }
    }
    /**
   * @param {HtmxSwapStyle} swapStyle
   * @param {Element} elt
   * @param {Element} target
   * @param {ParentNode} fragment
   * @param {HtmxSettleInfo} settleInfo
   */ function swapWithStyle(swapStyle, elt, target, fragment, settleInfo) {
        switch(swapStyle){
            case 'none':
                return;
            case 'outerHTML':
                swapOuterHTML(target, fragment, settleInfo);
                return;
            case 'afterbegin':
                swapAfterBegin(target, fragment, settleInfo);
                return;
            case 'beforebegin':
                swapBeforeBegin(target, fragment, settleInfo);
                return;
            case 'beforeend':
                swapBeforeEnd(target, fragment, settleInfo);
                return;
            case 'afterend':
                swapAfterEnd(target, fragment, settleInfo);
                return;
            case 'delete':
                swapDelete(target);
                return;
            default:
                var extensions = getExtensions(elt);
                for(let i = 0; i < extensions.length; i++){
                    const ext = extensions[i];
                    try {
                        const newElements = ext.handleSwap(swapStyle, target, fragment, settleInfo);
                        if (newElements) {
                            if (Array.isArray(newElements)) // if handleSwap returns an array (like) of elements, we handle them
                            for(let j = 0; j < newElements.length; j++){
                                const child = newElements[j];
                                if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.COMMENT_NODE) settleInfo.tasks.push(makeAjaxLoadTask(child));
                            }
                            return;
                        }
                    } catch (e) {
                        logError(e);
                    }
                }
                if (swapStyle === 'innerHTML') swapInnerHTML(target, fragment, settleInfo);
                else swapWithStyle(htmx.config.defaultSwapStyle, elt, target, fragment, settleInfo);
        }
    }
    /**
   * @param {DocumentFragment} fragment
   * @param {HtmxSettleInfo} settleInfo
   * @param {Node|Document} [rootNode]
   */ function findAndSwapOobElements(fragment, settleInfo, rootNode) {
        var oobElts = findAll(fragment, '[hx-swap-oob], [data-hx-swap-oob]');
        forEach(oobElts, function(oobElement) {
            if (htmx.config.allowNestedOobSwaps || oobElement.parentElement === null) {
                const oobValue = getAttributeValue(oobElement, 'hx-swap-oob');
                if (oobValue != null) oobSwap(oobValue, oobElement, settleInfo, rootNode);
            } else {
                oobElement.removeAttribute('hx-swap-oob');
                oobElement.removeAttribute('data-hx-swap-oob');
            }
        });
        return oobElts.length > 0;
    }
    /**
   * Implements complete swapping pipeline, including: delay, view transitions, focus and selection preservation,
   * title updates, scroll, OOB swapping, normal swapping and settling
   * @param {string|Element} target
   * @param {string} content
   * @param {HtmxSwapSpecification} swapSpec
   * @param {SwapOptions} [swapOptions]
   */ function swap(target, content, swapSpec, swapOptions) {
        if (!swapOptions) swapOptions = {};
        // optional transition API promise callbacks
        let settleResolve = null;
        let settleReject = null;
        let doSwap = function() {
            maybeCall(swapOptions.beforeSwapCallback);
            target = resolveTarget(target);
            const rootNode = swapOptions.contextElement ? getRootNode(swapOptions.contextElement, false) : getDocument();
            // preserve focus and selection
            const activeElt = document.activeElement;
            let selectionInfo = {};
            selectionInfo = {
                elt: activeElt,
                // @ts-ignore
                start: activeElt ? activeElt.selectionStart : null,
                // @ts-ignore
                end: activeElt ? activeElt.selectionEnd : null
            };
            const settleInfo = makeSettleInfo(target);
            // For text content swaps, don't parse the response as HTML, just insert it
            if (swapSpec.swapStyle === 'textContent') target.textContent = content;
            else {
                let fragment = makeFragment(content);
                settleInfo.title = swapOptions.title || fragment.title;
                if (swapOptions.historyRequest) // @ts-ignore fragment can be a parentNode Element
                fragment = fragment.querySelector('[hx-history-elt],[data-hx-history-elt]') || fragment;
                // select-oob swaps
                if (swapOptions.selectOOB) {
                    const oobSelectValues = swapOptions.selectOOB.split(',');
                    for(let i = 0; i < oobSelectValues.length; i++){
                        const oobSelectValue = oobSelectValues[i].split(':', 2);
                        let id = oobSelectValue[0].trim();
                        if (id.indexOf('#') === 0) id = id.substring(1);
                        const oobValue = oobSelectValue[1] || 'true';
                        const oobElement = fragment.querySelector('#' + id);
                        if (oobElement) oobSwap(oobValue, oobElement, settleInfo, rootNode);
                    }
                }
                // oob swaps
                findAndSwapOobElements(fragment, settleInfo, rootNode);
                forEach(findAll(fragment, 'template'), /** @param {HTMLTemplateElement} template */ function(template) {
                    if (template.content && findAndSwapOobElements(template.content, settleInfo, rootNode)) // Avoid polluting the DOM with empty templates that were only used to encapsulate oob swap
                    template.remove();
                });
                // normal swap
                if (swapOptions.select) {
                    const newFragment = getDocument().createDocumentFragment();
                    forEach(fragment.querySelectorAll(swapOptions.select), function(node) {
                        newFragment.appendChild(node);
                    });
                    fragment = newFragment;
                }
                handlePreservedElements(fragment);
                swapWithStyle(swapSpec.swapStyle, swapOptions.contextElement, target, fragment, settleInfo);
                restorePreservedElements();
            }
            // apply saved focus and selection information to swapped content
            if (selectionInfo.elt && !bodyContains(selectionInfo.elt) && getRawAttribute(selectionInfo.elt, 'id')) {
                const newActiveElt = document.getElementById(getRawAttribute(selectionInfo.elt, 'id'));
                const focusOptions = {
                    preventScroll: swapSpec.focusScroll !== undefined ? !swapSpec.focusScroll : !htmx.config.defaultFocusScroll
                };
                if (newActiveElt) {
                    // @ts-ignore
                    if (selectionInfo.start && newActiveElt.setSelectionRange) try {
                        // @ts-ignore
                        newActiveElt.setSelectionRange(selectionInfo.start, selectionInfo.end);
                    } catch (e) {
                    // the setSelectionRange method is present on fields that don't support it, so just let this fail
                    }
                    newActiveElt.focus(focusOptions);
                }
            }
            removeClassFromElement(target, htmx.config.swappingClass);
            forEach(settleInfo.elts, function(elt) {
                if (elt.classList) addClassToElement(elt, htmx.config.settlingClass);
                triggerEvent(elt, 'htmx:afterSwap', swapOptions.eventInfo);
            });
            maybeCall(swapOptions.afterSwapCallback);
            // merge in new title after swap but before settle
            if (!swapSpec.ignoreTitle) handleTitle(settleInfo.title);
            // settle
            const doSettle = function() {
                forEach(settleInfo.tasks, function(task) {
                    task.call();
                });
                forEach(settleInfo.elts, function(elt) {
                    if (elt.classList) removeClassFromElement(elt, htmx.config.settlingClass);
                    triggerEvent(elt, 'htmx:afterSettle', swapOptions.eventInfo);
                });
                if (swapOptions.anchor) {
                    const anchorTarget = asElement(resolveTarget('#' + swapOptions.anchor));
                    if (anchorTarget) anchorTarget.scrollIntoView({
                        block: 'start',
                        behavior: 'auto'
                    });
                }
                updateScrollState(settleInfo.elts, swapSpec);
                maybeCall(swapOptions.afterSettleCallback);
                maybeCall(settleResolve);
            };
            if (swapSpec.settleDelay > 0) getWindow().setTimeout(doSettle, swapSpec.settleDelay);
            else doSettle();
        };
        let shouldTransition = htmx.config.globalViewTransitions;
        if (swapSpec.hasOwnProperty('transition')) shouldTransition = swapSpec.transition;
        const elt = swapOptions.contextElement || getDocument();
        if (shouldTransition && triggerEvent(elt, 'htmx:beforeTransition', swapOptions.eventInfo) && typeof Promise !== 'undefined' && // @ts-ignore experimental feature atm
        document.startViewTransition) {
            const settlePromise = new Promise(function(_resolve, _reject) {
                settleResolve = _resolve;
                settleReject = _reject;
            });
            // wrap the original doSwap() in a call to startViewTransition()
            const innerDoSwap = doSwap;
            doSwap = function() {
                // @ts-ignore experimental feature atm
                document.startViewTransition(function() {
                    innerDoSwap();
                    return settlePromise;
                });
            };
        }
        try {
            if (swapSpec?.swapDelay && swapSpec.swapDelay > 0) getWindow().setTimeout(doSwap, swapSpec.swapDelay);
            else doSwap();
        } catch (e) {
            triggerErrorEvent(elt, 'htmx:swapError', swapOptions.eventInfo);
            maybeCall(settleReject);
            throw e;
        }
    }
    /**
   * @param {XMLHttpRequest} xhr
   * @param {string} header
   * @param {EventTarget} elt
   */ function handleTriggerHeader(xhr, header, elt) {
        const triggerBody = xhr.getResponseHeader(header);
        if (triggerBody.indexOf('{') === 0) {
            const triggers = parseJSON(triggerBody);
            for(const eventName in triggers)if (triggers.hasOwnProperty(eventName)) {
                let detail = triggers[eventName];
                if (isRawObject(detail)) // @ts-ignore
                elt = detail.target !== undefined ? detail.target : elt;
                else detail = {
                    value: detail
                };
                triggerEvent(elt, eventName, detail);
            }
        } else {
            const eventNames = triggerBody.split(',');
            for(let i = 0; i < eventNames.length; i++)triggerEvent(elt, eventNames[i].trim(), []);
        }
    }
    const WHITESPACE = /\s/;
    const WHITESPACE_OR_COMMA = /[\s,]/;
    const SYMBOL_START = /[_$a-zA-Z]/;
    const SYMBOL_CONT = /[_$a-zA-Z0-9]/;
    const STRINGISH_START = [
        '"',
        "'",
        '/'
    ];
    const NOT_WHITESPACE = /[^\s]/;
    const COMBINED_SELECTOR_START = /[{(]/;
    const COMBINED_SELECTOR_END = /[})]/;
    /**
   * @param {string} str
   * @returns {string[]}
   */ function tokenizeString(str) {
        /** @type string[] */ const tokens = [];
        let position = 0;
        while(position < str.length){
            if (SYMBOL_START.exec(str.charAt(position))) {
                var startPosition = position;
                while(SYMBOL_CONT.exec(str.charAt(position + 1)))position++;
                tokens.push(str.substring(startPosition, position + 1));
            } else if (STRINGISH_START.indexOf(str.charAt(position)) !== -1) {
                const startChar = str.charAt(position);
                var startPosition = position;
                position++;
                while(position < str.length && str.charAt(position) !== startChar){
                    if (str.charAt(position) === '\\') position++;
                    position++;
                }
                tokens.push(str.substring(startPosition, position + 1));
            } else {
                const symbol = str.charAt(position);
                tokens.push(symbol);
            }
            position++;
        }
        return tokens;
    }
    /**
   * @param {string} token
   * @param {string|null} last
   * @param {string} paramName
   * @returns {boolean}
   */ function isPossibleRelativeReference(token, last, paramName) {
        return SYMBOL_START.exec(token.charAt(0)) && token !== 'true' && token !== 'false' && token !== 'this' && token !== paramName && last !== '.';
    }
    /**
   * @param {EventTarget|string} elt
   * @param {string[]} tokens
   * @param {string} paramName
   * @returns {ConditionalFunction|null}
   */ function maybeGenerateConditional(elt, tokens, paramName) {
        if (tokens[0] === '[') {
            tokens.shift();
            let bracketCount = 1;
            let conditionalSource = ' return (function(' + paramName + '){ return (';
            let last = null;
            while(tokens.length > 0){
                const token = tokens[0];
                // @ts-ignore For some reason tsc doesn't understand the shift call, and thinks we're comparing the same value here, i.e. '[' vs ']'
                if (token === ']') {
                    bracketCount--;
                    if (bracketCount === 0) {
                        if (last === null) conditionalSource = conditionalSource + 'true';
                        tokens.shift();
                        conditionalSource += ')})';
                        try {
                            const conditionFunction = maybeEval(elt, function() {
                                return Function(conditionalSource)();
                            }, function() {
                                return true;
                            });
                            conditionFunction.source = conditionalSource;
                            return conditionFunction;
                        } catch (e) {
                            triggerErrorEvent(getDocument().body, 'htmx:syntax:error', {
                                error: e,
                                source: conditionalSource
                            });
                            return null;
                        }
                    }
                } else if (token === '[') bracketCount++;
                if (isPossibleRelativeReference(token, last, paramName)) conditionalSource += '((' + paramName + '.' + token + ') ? (' + paramName + '.' + token + ') : (window.' + token + '))';
                else conditionalSource = conditionalSource + token;
                last = tokens.shift();
            }
        }
    }
    /**
   * @param {string[]} tokens
   * @param {RegExp} match
   * @returns {string}
   */ function consumeUntil(tokens, match) {
        let result = '';
        while(tokens.length > 0 && !match.test(tokens[0]))result += tokens.shift();
        return result;
    }
    /**
   * @param {string[]} tokens
   * @returns {string}
   */ function consumeCSSSelector(tokens) {
        let result;
        if (tokens.length > 0 && COMBINED_SELECTOR_START.test(tokens[0])) {
            tokens.shift();
            result = consumeUntil(tokens, COMBINED_SELECTOR_END).trim();
            tokens.shift();
        } else result = consumeUntil(tokens, WHITESPACE_OR_COMMA);
        return result;
    }
    const INPUT_SELECTOR = 'input, textarea, select';
    /**
   * @param {Element} elt
   * @param {string} explicitTrigger
   * @param {Object} cache for trigger specs
   * @returns {HtmxTriggerSpecification[]}
   */ function parseAndCacheTrigger(elt, explicitTrigger, cache) {
        /** @type HtmxTriggerSpecification[] */ const triggerSpecs = [];
        const tokens = tokenizeString(explicitTrigger);
        do {
            consumeUntil(tokens, NOT_WHITESPACE);
            const initialLength = tokens.length;
            const trigger = consumeUntil(tokens, /[,\[\s]/);
            if (trigger !== '') {
                if (trigger === 'every') {
                    /** @type HtmxTriggerSpecification */ const every = {
                        trigger: 'every'
                    };
                    consumeUntil(tokens, NOT_WHITESPACE);
                    every.pollInterval = parseInterval(consumeUntil(tokens, /[,\[\s]/));
                    consumeUntil(tokens, NOT_WHITESPACE);
                    var eventFilter = maybeGenerateConditional(elt, tokens, 'event');
                    if (eventFilter) every.eventFilter = eventFilter;
                    triggerSpecs.push(every);
                } else {
                    /** @type HtmxTriggerSpecification */ const triggerSpec = {
                        trigger: trigger
                    };
                    var eventFilter = maybeGenerateConditional(elt, tokens, 'event');
                    if (eventFilter) triggerSpec.eventFilter = eventFilter;
                    consumeUntil(tokens, NOT_WHITESPACE);
                    while(tokens.length > 0 && tokens[0] !== ','){
                        const token = tokens.shift();
                        if (token === 'changed') triggerSpec.changed = true;
                        else if (token === 'once') triggerSpec.once = true;
                        else if (token === 'consume') triggerSpec.consume = true;
                        else if (token === 'delay' && tokens[0] === ':') {
                            tokens.shift();
                            triggerSpec.delay = parseInterval(consumeUntil(tokens, WHITESPACE_OR_COMMA));
                        } else if (token === 'from' && tokens[0] === ':') {
                            tokens.shift();
                            if (COMBINED_SELECTOR_START.test(tokens[0])) var from_arg = consumeCSSSelector(tokens);
                            else {
                                var from_arg = consumeUntil(tokens, WHITESPACE_OR_COMMA);
                                if (from_arg === 'closest' || from_arg === 'find' || from_arg === 'next' || from_arg === 'previous') {
                                    tokens.shift();
                                    const selector = consumeCSSSelector(tokens);
                                    // `next` and `previous` allow a selector-less syntax
                                    if (selector.length > 0) from_arg += ' ' + selector;
                                }
                            }
                            triggerSpec.from = from_arg;
                        } else if (token === 'target' && tokens[0] === ':') {
                            tokens.shift();
                            triggerSpec.target = consumeCSSSelector(tokens);
                        } else if (token === 'throttle' && tokens[0] === ':') {
                            tokens.shift();
                            triggerSpec.throttle = parseInterval(consumeUntil(tokens, WHITESPACE_OR_COMMA));
                        } else if (token === 'queue' && tokens[0] === ':') {
                            tokens.shift();
                            triggerSpec.queue = consumeUntil(tokens, WHITESPACE_OR_COMMA);
                        } else if (token === 'root' && tokens[0] === ':') {
                            tokens.shift();
                            triggerSpec[token] = consumeCSSSelector(tokens);
                        } else if (token === 'threshold' && tokens[0] === ':') {
                            tokens.shift();
                            triggerSpec[token] = consumeUntil(tokens, WHITESPACE_OR_COMMA);
                        } else triggerErrorEvent(elt, 'htmx:syntax:error', {
                            token: tokens.shift()
                        });
                        consumeUntil(tokens, NOT_WHITESPACE);
                    }
                    triggerSpecs.push(triggerSpec);
                }
            }
            if (tokens.length === initialLength) triggerErrorEvent(elt, 'htmx:syntax:error', {
                token: tokens.shift()
            });
            consumeUntil(tokens, NOT_WHITESPACE);
        }while (tokens[0] === ',' && tokens.shift());
        if (cache) cache[explicitTrigger] = triggerSpecs;
        return triggerSpecs;
    }
    /**
   * @param {Element} elt
   * @returns {HtmxTriggerSpecification[]}
   */ function getTriggerSpecs(elt) {
        const explicitTrigger = getAttributeValue(elt, 'hx-trigger');
        let triggerSpecs = [];
        if (explicitTrigger) {
            const cache = htmx.config.triggerSpecsCache;
            triggerSpecs = cache && cache[explicitTrigger] || parseAndCacheTrigger(elt, explicitTrigger, cache);
        }
        if (triggerSpecs.length > 0) return triggerSpecs;
        else if (matches(elt, 'form')) return [
            {
                trigger: 'submit'
            }
        ];
        else if (matches(elt, 'input[type="button"], input[type="submit"]')) return [
            {
                trigger: 'click'
            }
        ];
        else if (matches(elt, INPUT_SELECTOR)) return [
            {
                trigger: 'change'
            }
        ];
        else return [
            {
                trigger: 'click'
            }
        ];
    }
    /**
   * @param {Element} elt
   */ function cancelPolling(elt) {
        getInternalData(elt).cancelled = true;
    }
    /**
   * @param {Element} elt
   * @param {TriggerHandler} handler
   * @param {HtmxTriggerSpecification} spec
   */ function processPolling(elt, handler, spec) {
        const nodeData = getInternalData(elt);
        nodeData.timeout = getWindow().setTimeout(function() {
            if (bodyContains(elt) && nodeData.cancelled !== true) {
                if (!maybeFilterEvent(spec, elt, makeEvent('hx:poll:trigger', {
                    triggerSpec: spec,
                    target: elt
                }))) handler(elt);
                processPolling(elt, handler, spec);
            }
        }, spec.pollInterval);
    }
    /**
   * @param {HTMLAnchorElement} elt
   * @returns {boolean}
   */ function isLocalLink(elt) {
        return location.hostname === elt.hostname && getRawAttribute(elt, 'href') && getRawAttribute(elt, 'href').indexOf('#') !== 0;
    }
    /**
   * @param {Element} elt
   */ function eltIsDisabled(elt) {
        return closest(elt, htmx.config.disableSelector);
    }
    /**
   * @param {Element} elt
   * @param {HtmxNodeInternalData} nodeData
   * @param {HtmxTriggerSpecification[]} triggerSpecs
   */ function boostElement(elt, nodeData, triggerSpecs) {
        if (elt instanceof HTMLAnchorElement && isLocalLink(elt) && (elt.target === '' || elt.target === '_self') || elt.tagName === 'FORM' && String(getRawAttribute(elt, 'method')).toLowerCase() !== 'dialog') {
            nodeData.boosted = true;
            let verb, path;
            if (elt.tagName === 'A') {
                verb = /** @type HttpVerb */ 'get';
                path = getRawAttribute(elt, 'href');
            } else {
                const rawAttribute = getRawAttribute(elt, 'method');
                verb = /** @type HttpVerb */ rawAttribute ? rawAttribute.toLowerCase() : 'get';
                path = getRawAttribute(elt, 'action');
                if (path == null || path === '') // if there is no action attribute on the form set path to current href before the
                // following logic to properly clear parameters on a GET (not on a POST!)
                path = location.href;
                if (verb === 'get' && path.includes('?')) path = path.replace(/\?[^#]+/, '');
            }
            triggerSpecs.forEach(function(triggerSpec) {
                addEventListener(elt, function(node, evt) {
                    const elt = asElement(node);
                    if (eltIsDisabled(elt)) {
                        cleanUpElement(elt);
                        return;
                    }
                    issueAjaxRequest(verb, path, elt, evt);
                }, nodeData, triggerSpec, true);
            });
        }
    }
    /**
   * @param {Event} evt
   * @param {Element} elt
   * @returns {boolean}
   */ function shouldCancel(evt, elt) {
        if (evt.type === 'submit' && elt.tagName === 'FORM') return true;
        else if (evt.type === 'click') {
            // find button wrapping the trigger element
            const btn = /** @type {HTMLButtonElement|HTMLInputElement|null} */ elt.closest('input[type="submit"], button');
            // Do not cancel on buttons that 1) don't have a related form or 2) have a type attribute of 'reset'/'button'.
            if (btn && btn.form && btn.type === 'submit') return true;
            // find link wrapping the trigger element
            const link = elt.closest('a');
            // Allow links with href="#fragment" (anchors with content after #) to perform normal fragment navigation.
            // Cancel default action for links with href="#" (bare hash) to prevent scrolling to top and unwanted URL changes.
            const samePageAnchor = /^#.+/;
            if (link && link.href && !samePageAnchor.test(link.getAttribute('href'))) return true;
        }
        return false;
    }
    /**
   * @param {Node} elt
   * @param {Event|MouseEvent|KeyboardEvent|TouchEvent} evt
   * @returns {boolean}
   */ function ignoreBoostedAnchorCtrlClick(elt, evt) {
        return getInternalData(elt).boosted && elt instanceof HTMLAnchorElement && evt.type === 'click' && // @ts-ignore this will resolve to undefined for events that don't define those properties, which is fine
        (evt.ctrlKey || evt.metaKey);
    }
    /**
   * @param {HtmxTriggerSpecification} triggerSpec
   * @param {Node} elt
   * @param {Event} evt
   * @returns {boolean}
   */ function maybeFilterEvent(triggerSpec, elt, evt) {
        const eventFilter = triggerSpec.eventFilter;
        if (eventFilter) try {
            return eventFilter.call(elt, evt) !== true;
        } catch (e) {
            const source = eventFilter.source;
            triggerErrorEvent(getDocument().body, 'htmx:eventFilter:error', {
                error: e,
                source: source
            });
            return true;
        }
        return false;
    }
    /**
   * @param {Element} elt
   * @param {TriggerHandler} handler
   * @param {HtmxNodeInternalData} nodeData
   * @param {HtmxTriggerSpecification} triggerSpec
   * @param {boolean} [explicitCancel]
   */ function addEventListener(elt, handler, nodeData, triggerSpec, explicitCancel) {
        const elementData = getInternalData(elt);
        /** @type {(Node|Window)[]} */ let eltsToListenOn;
        if (triggerSpec.from) eltsToListenOn = querySelectorAllExt(elt, triggerSpec.from);
        else eltsToListenOn = [
            elt
        ];
        // store the initial values of the elements, so we can tell if they change
        if (triggerSpec.changed) {
            if (!('lastValue' in elementData)) elementData.lastValue = new WeakMap();
            eltsToListenOn.forEach(function(eltToListenOn) {
                if (!elementData.lastValue.has(triggerSpec)) elementData.lastValue.set(triggerSpec, new WeakMap());
                // @ts-ignore value will be undefined for non-input elements, which is fine
                elementData.lastValue.get(triggerSpec).set(eltToListenOn, eltToListenOn.value);
            });
        }
        forEach(eltsToListenOn, function(eltToListenOn) {
            /** @type EventListener */ const eventListener = function(evt) {
                if (!bodyContains(elt)) {
                    eltToListenOn.removeEventListener(triggerSpec.trigger, eventListener);
                    return;
                }
                if (ignoreBoostedAnchorCtrlClick(elt, evt)) return;
                if (explicitCancel || shouldCancel(evt, eltToListenOn)) evt.preventDefault();
                if (maybeFilterEvent(triggerSpec, elt, evt)) return;
                const eventData = getInternalData(evt);
                eventData.triggerSpec = triggerSpec;
                if (eventData.handledFor == null) eventData.handledFor = [];
                if (eventData.handledFor.indexOf(elt) < 0) {
                    eventData.handledFor.push(elt);
                    if (triggerSpec.consume) evt.stopPropagation();
                    if (triggerSpec.target && evt.target) {
                        if (!matches(asElement(evt.target), triggerSpec.target)) return;
                    }
                    if (triggerSpec.once) {
                        if (elementData.triggeredOnce) return;
                        else elementData.triggeredOnce = true;
                    }
                    if (triggerSpec.changed) {
                        const node = evt.target;
                        // @ts-ignore value will be undefined for non-input elements, which is fine
                        const value = node.value;
                        const lastValue = elementData.lastValue.get(triggerSpec);
                        if (lastValue.has(node) && lastValue.get(node) === value) return;
                        lastValue.set(node, value);
                    }
                    if (elementData.delayed) clearTimeout(elementData.delayed);
                    if (elementData.throttle) return;
                    if (triggerSpec.throttle > 0) {
                        if (!elementData.throttle) {
                            triggerEvent(elt, 'htmx:trigger');
                            handler(elt, evt);
                            elementData.throttle = getWindow().setTimeout(function() {
                                elementData.throttle = null;
                            }, triggerSpec.throttle);
                        }
                    } else if (triggerSpec.delay > 0) elementData.delayed = getWindow().setTimeout(function() {
                        triggerEvent(elt, 'htmx:trigger');
                        handler(elt, evt);
                    }, triggerSpec.delay);
                    else {
                        triggerEvent(elt, 'htmx:trigger');
                        handler(elt, evt);
                    }
                }
            };
            if (nodeData.listenerInfos == null) nodeData.listenerInfos = [];
            nodeData.listenerInfos.push({
                trigger: triggerSpec.trigger,
                listener: eventListener,
                on: eltToListenOn
            });
            eltToListenOn.addEventListener(triggerSpec.trigger, eventListener);
        });
    }
    let windowIsScrolling = false // used by initScrollHandler
    ;
    let scrollHandler = null;
    function initScrollHandler() {
        if (!scrollHandler) {
            scrollHandler = function() {
                windowIsScrolling = true;
            };
            window.addEventListener('scroll', scrollHandler);
            window.addEventListener('resize', scrollHandler);
            setInterval(function() {
                if (windowIsScrolling) {
                    windowIsScrolling = false;
                    forEach(getDocument().querySelectorAll("[hx-trigger*='revealed'],[data-hx-trigger*='revealed']"), function(elt) {
                        maybeReveal(elt);
                    });
                }
            }, 200);
        }
    }
    /**
   * @param {Element} elt
   */ function maybeReveal(elt) {
        if (!hasAttribute(elt, 'data-hx-revealed') && isScrolledIntoView(elt)) {
            elt.setAttribute('data-hx-revealed', 'true');
            const nodeData = getInternalData(elt);
            if (nodeData.initHash) triggerEvent(elt, 'revealed');
            else // if the node isn't initialized, wait for it before triggering the request
            elt.addEventListener('htmx:afterProcessNode', function() {
                triggerEvent(elt, 'revealed');
            }, {
                once: true
            });
        }
    }
    //= ===================================================================
    /**
   * @param {Element} elt
   * @param {TriggerHandler} handler
   * @param {HtmxNodeInternalData} nodeData
   * @param {number} delay
   */ function loadImmediately(elt, handler, nodeData, delay) {
        const load = function() {
            if (!nodeData.loaded) {
                nodeData.loaded = true;
                triggerEvent(elt, 'htmx:trigger');
                handler(elt);
            }
        };
        if (delay > 0) getWindow().setTimeout(load, delay);
        else load();
    }
    /**
   * @param {Element} elt
   * @param {HtmxNodeInternalData} nodeData
   * @param {HtmxTriggerSpecification[]} triggerSpecs
   * @returns {boolean}
   */ function processVerbs(elt, nodeData, triggerSpecs) {
        let explicitAction = false;
        forEach(VERBS, function(verb) {
            if (hasAttribute(elt, 'hx-' + verb)) {
                const path = getAttributeValue(elt, 'hx-' + verb);
                explicitAction = true;
                nodeData.path = path;
                nodeData.verb = verb;
                triggerSpecs.forEach(function(triggerSpec) {
                    addTriggerHandler(elt, triggerSpec, nodeData, function(node, evt) {
                        const elt = asElement(node);
                        if (eltIsDisabled(elt)) {
                            cleanUpElement(elt);
                            return;
                        }
                        issueAjaxRequest(verb, path, elt, evt);
                    });
                });
            }
        });
        return explicitAction;
    }
    /**
   * @callback TriggerHandler
   * @param {Element} elt
   * @param {Event} [evt]
   */ /**
   * @param {Element} elt
   * @param {HtmxTriggerSpecification} triggerSpec
   * @param {HtmxNodeInternalData} nodeData
   * @param {TriggerHandler} handler
   */ function addTriggerHandler(elt, triggerSpec, nodeData, handler) {
        if (triggerSpec.trigger === 'revealed') {
            initScrollHandler();
            addEventListener(elt, handler, nodeData, triggerSpec);
            maybeReveal(asElement(elt));
        } else if (triggerSpec.trigger === 'intersect') {
            const observerOptions = {};
            if (triggerSpec.root) observerOptions.root = querySelectorExt(elt, triggerSpec.root);
            if (triggerSpec.threshold) observerOptions.threshold = parseFloat(triggerSpec.threshold);
            const observer = new IntersectionObserver(function(entries) {
                for(let i = 0; i < entries.length; i++){
                    const entry = entries[i];
                    if (entry.isIntersecting) {
                        triggerEvent(elt, 'intersect');
                        break;
                    }
                }
            }, observerOptions);
            observer.observe(asElement(elt));
            addEventListener(asElement(elt), handler, nodeData, triggerSpec);
        } else if (!nodeData.firstInitCompleted && triggerSpec.trigger === 'load') {
            if (!maybeFilterEvent(triggerSpec, elt, makeEvent('load', {
                elt: elt
            }))) loadImmediately(asElement(elt), handler, nodeData, triggerSpec.delay);
        } else if (triggerSpec.pollInterval > 0) {
            nodeData.polling = true;
            processPolling(asElement(elt), handler, triggerSpec);
        } else addEventListener(elt, handler, nodeData, triggerSpec);
    }
    /**
   * @param {Node} node
   * @returns {boolean}
   */ function shouldProcessHxOn(node) {
        const elt = asElement(node);
        if (!elt) return false;
        const attributes = elt.attributes;
        for(let j = 0; j < attributes.length; j++){
            const attrName = attributes[j].name;
            if (startsWith(attrName, 'hx-on:') || startsWith(attrName, 'data-hx-on:') || startsWith(attrName, 'hx-on-') || startsWith(attrName, 'data-hx-on-')) return true;
        }
        return false;
    }
    /**
   * @param {Node} elt
   * @returns {Element[]}
   */ const HX_ON_QUERY = new XPathEvaluator().createExpression('.//*[@*[ starts-with(name(), "hx-on:") or starts-with(name(), "data-hx-on:") or starts-with(name(), "hx-on-") or starts-with(name(), "data-hx-on-") ]]');
    function processHXOnRoot(elt, elements) {
        if (shouldProcessHxOn(elt)) elements.push(asElement(elt));
        const iter = HX_ON_QUERY.evaluate(elt);
        let node = null;
        while(node = iter.iterateNext())elements.push(asElement(node));
    }
    function findHxOnWildcardElements(elt) {
        /** @type {Element[]} */ const elements = [];
        if (elt instanceof DocumentFragment) for (const child of elt.childNodes)processHXOnRoot(child, elements);
        else processHXOnRoot(elt, elements);
        return elements;
    }
    /**
   * @param {Element} elt
   * @returns {NodeListOf<Element>|[]}
   */ function findElementsToProcess(elt) {
        if (elt.querySelectorAll) {
            const boostedSelector = ', [hx-boost] a, [data-hx-boost] a, a[hx-boost], a[data-hx-boost]';
            const extensionSelectors = [];
            for(const e in extensions){
                const extension = extensions[e];
                if (extension.getSelectors) {
                    var selectors = extension.getSelectors();
                    if (selectors) extensionSelectors.push(selectors);
                }
            }
            const results = elt.querySelectorAll(VERB_SELECTOR + boostedSelector + ", form, [type='submit']," + ' [hx-ext], [data-hx-ext], [hx-trigger], [data-hx-trigger]' + extensionSelectors.flat().map((s)=>', ' + s).join(''));
            return results;
        } else return [];
    }
    /**
   * Handle submit buttons/inputs that have the form attribute set
   * see https://developer.mozilla.org/docs/Web/HTML/Element/button
   * @param {Event} evt
   */ function maybeSetLastButtonClicked(evt) {
        const elt = getTargetButton(evt.target);
        const internalData = getRelatedFormData(evt);
        if (internalData) internalData.lastButtonClicked = elt;
    }
    /**
   * @param {Event} evt
   */ function maybeUnsetLastButtonClicked(evt) {
        const internalData = getRelatedFormData(evt);
        if (internalData) internalData.lastButtonClicked = null;
    }
    /**
   * @param {EventTarget} target
   * @returns {HTMLButtonElement|HTMLInputElement|null}
   */ function getTargetButton(target) {
        return /** @type {HTMLButtonElement|HTMLInputElement|null} */ closest(asElement(target), "button, input[type='submit']");
    }
    /**
   * @param {Element} elt
   * @returns {HTMLFormElement|null}
   */ function getRelatedForm(elt) {
        // @ts-ignore Get the related form if available, else find the closest parent form
        return elt.form || closest(elt, 'form');
    }
    /**
   * @param {Event} evt
   * @returns {HtmxNodeInternalData|undefined}
   */ function getRelatedFormData(evt) {
        const elt = getTargetButton(evt.target);
        if (!elt) return;
        const form = getRelatedForm(elt);
        if (!form) return;
        return getInternalData(form);
    }
    /**
   * @param {EventTarget} elt
   */ function initButtonTracking(elt) {
        // need to handle both click and focus in:
        //   focusin - in case someone tabs in to a button and hits the space bar
        //   click - on OSX buttons do not focus on click see https://bugs.webkit.org/show_bug.cgi?id=13724
        elt.addEventListener('click', maybeSetLastButtonClicked);
        elt.addEventListener('focusin', maybeSetLastButtonClicked);
        elt.addEventListener('focusout', maybeUnsetLastButtonClicked);
    }
    /**
   * @param {Element} elt
   * @param {string} eventName
   * @param {string} code
   */ function addHxOnEventHandler(elt, eventName, code) {
        const nodeData = getInternalData(elt);
        if (!Array.isArray(nodeData.onHandlers)) nodeData.onHandlers = [];
        let func;
        /** @type EventListener */ const listener = function(e) {
            maybeEval(elt, function() {
                if (eltIsDisabled(elt)) return;
                if (!func) func = new Function('event', code);
                func.call(elt, e);
            });
        };
        elt.addEventListener(eventName, listener);
        nodeData.onHandlers.push({
            event: eventName,
            listener: listener
        });
    }
    /**
   * @param {Element} elt
   */ function processHxOnWildcard(elt) {
        // wipe any previous on handlers so that this function takes precedence
        deInitOnHandlers(elt);
        for(let i = 0; i < elt.attributes.length; i++){
            const name = elt.attributes[i].name;
            const value = elt.attributes[i].value;
            if (startsWith(name, 'hx-on') || startsWith(name, 'data-hx-on')) {
                const afterOnPosition = name.indexOf('-on') + 3;
                const nextChar = name.slice(afterOnPosition, afterOnPosition + 1);
                if (nextChar === '-' || nextChar === ':') {
                    let eventName = name.slice(afterOnPosition + 1);
                    // if the eventName starts with a colon or dash, prepend "htmx" for shorthand support
                    if (startsWith(eventName, ':')) eventName = 'htmx' + eventName;
                    else if (startsWith(eventName, '-')) eventName = 'htmx:' + eventName.slice(1);
                    else if (startsWith(eventName, 'htmx-')) eventName = 'htmx:' + eventName.slice(5);
                    addHxOnEventHandler(elt, eventName, value);
                }
            }
        }
    }
    /**
   * @param {Element|HTMLInputElement} elt
   */ function initNode(elt) {
        triggerEvent(elt, 'htmx:beforeProcessNode');
        const nodeData = getInternalData(elt);
        const triggerSpecs = getTriggerSpecs(elt);
        const hasExplicitHttpAction = processVerbs(elt, nodeData, triggerSpecs);
        if (!hasExplicitHttpAction) {
            if (getClosestAttributeValue(elt, 'hx-boost') === 'true') boostElement(elt, nodeData, triggerSpecs);
            else if (hasAttribute(elt, 'hx-trigger')) triggerSpecs.forEach(function(triggerSpec) {
                // For "naked" triggers, don't do anything at all
                addTriggerHandler(elt, triggerSpec, nodeData, function() {});
            });
        }
        // Handle submit buttons/inputs that have the form attribute set
        // see https://developer.mozilla.org/docs/Web/HTML/Element/button
        if (elt.tagName === 'FORM' || getRawAttribute(elt, 'type') === 'submit' && hasAttribute(elt, 'form')) initButtonTracking(elt);
        nodeData.firstInitCompleted = true;
        triggerEvent(elt, 'htmx:afterProcessNode');
    }
    /**
   * @param {Element} elt
   * @returns {boolean}
   */ function maybeDeInitAndHash(elt) {
        // Ensure only valid Elements and not shadow DOM roots are inited
        if (!(elt instanceof Element)) return false;
        const nodeData = getInternalData(elt);
        const hash = attributeHash(elt);
        if (nodeData.initHash !== hash) {
            deInitNode(elt);
            nodeData.initHash = hash;
            return true;
        }
        return false;
    }
    /**
   * Processes new content, enabling htmx behavior. This can be useful if you have content that is added to the DOM outside of the normal htmx request cycle but still want htmx attributes to work.
   *
   * @see https://htmx.org/api/#process
   *
   * @param {Element|string} elt element to process
   */ function processNode(elt) {
        elt = resolveTarget(elt);
        if (eltIsDisabled(elt)) {
            cleanUpElement(elt);
            return;
        }
        const elementsToInit = [];
        if (maybeDeInitAndHash(elt)) elementsToInit.push(elt);
        forEach(findElementsToProcess(elt), function(child) {
            if (eltIsDisabled(child)) {
                cleanUpElement(child);
                return;
            }
            if (maybeDeInitAndHash(child)) elementsToInit.push(child);
        });
        forEach(findHxOnWildcardElements(elt), processHxOnWildcard);
        forEach(elementsToInit, initNode);
    }
    //= ===================================================================
    // Event/Log Support
    //= ===================================================================
    /**
   * @param {string} str
   * @returns {string}
   */ function kebabEventName(str) {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }
    /**
   * @param {string} eventName
   * @param {any} detail
   * @returns {CustomEvent}
   */ function makeEvent(eventName, detail) {
        // TODO: `composed: true` here is a hack to make global event handlers work with events in shadow DOM
        // This breaks expected encapsulation but needs to be here until decided otherwise by core devs
        return new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: detail
        });
    }
    /**
   * @param {EventTarget|string} elt
   * @param {string} eventName
   * @param {any=} detail
   */ function triggerErrorEvent(elt, eventName, detail) {
        triggerEvent(elt, eventName, mergeObjects({
            error: eventName
        }, detail));
    }
    /**
   * @param {string} eventName
   * @returns {boolean}
   */ function ignoreEventForLogging(eventName) {
        return eventName === 'htmx:afterProcessNode';
    }
    /**
   * `withExtensions` locates all active extensions for a provided element, then
   * executes the provided function using each of the active extensions. You can filter
   * the element's extensions by giving it a list of extensions to ignore. It should
   * be called internally at every extendable execution point in htmx.
   *
   * @param {Element} elt
   * @param {(extension:HtmxExtension) => void} toDo
   * @param {string[]=} extensionsToIgnore
   * @returns void
   */ function withExtensions(elt, toDo, extensionsToIgnore) {
        forEach(getExtensions(elt, [], extensionsToIgnore), function(extension) {
            try {
                toDo(extension);
            } catch (e) {
                logError(e);
            }
        });
    }
    function logError(msg) {
        console.error(msg);
    }
    /**
   * Triggers a given event on an element
   *
   * @see https://htmx.org/api/#trigger
   *
   * @param {EventTarget|string} elt the element to trigger the event on
   * @param {string} eventName the name of the event to trigger
   * @param {any=} detail details for the event
   * @returns {boolean}
   */ function triggerEvent(elt, eventName, detail) {
        elt = resolveTarget(elt);
        if (detail == null) detail = {};
        detail.elt = elt;
        const event = makeEvent(eventName, detail);
        if (htmx.logger && !ignoreEventForLogging(eventName)) htmx.logger(elt, eventName, detail);
        if (detail.error) {
            logError(detail.error + (detail.target ? ', ' + detail.target : ''));
            triggerEvent(elt, 'htmx:error', {
                errorInfo: detail
            });
        }
        let eventResult = elt.dispatchEvent(event);
        const kebabName = kebabEventName(eventName);
        if (eventResult && kebabName !== eventName) {
            const kebabedEvent = makeEvent(kebabName, event.detail);
            eventResult = eventResult && elt.dispatchEvent(kebabedEvent);
        }
        withExtensions(asElement(elt), function(extension) {
            eventResult = eventResult && extension.onEvent(eventName, event) !== false && !event.defaultPrevented;
        });
        return eventResult;
    }
    //= ===================================================================
    // History Support
    //= ===================================================================
    let currentPathForHistory;
    /**
   * @param {string} path
   */ function setCurrentPathForHistory(path) {
        currentPathForHistory = path;
        if (canAccessLocalStorage()) sessionStorage.setItem('htmx-current-path-for-history', path);
    }
    setCurrentPathForHistory(location.pathname + location.search);
    /**
   * @returns {Element}
   */ function getHistoryElement() {
        const historyElt = getDocument().querySelector('[hx-history-elt],[data-hx-history-elt]');
        return historyElt || getDocument().body;
    }
    /**
   * @param {string} url
   * @param {Element} rootElt
   */ function saveToHistoryCache(url, rootElt) {
        if (!canAccessLocalStorage()) return;
        // get state to save
        const innerHTML = cleanInnerHtmlForHistory(rootElt);
        const title = getDocument().title;
        const scroll = window.scrollY;
        if (htmx.config.historyCacheSize <= 0) {
            // make sure that an eventually already existing cache is purged
            sessionStorage.removeItem('htmx-history-cache');
            return;
        }
        url = normalizePath(url);
        const historyCache = parseJSON(sessionStorage.getItem('htmx-history-cache')) || [];
        for(let i = 0; i < historyCache.length; i++)if (historyCache[i].url === url) {
            historyCache.splice(i, 1);
            break;
        }
        /** @type HtmxHistoryItem */ const newHistoryItem = {
            url: url,
            content: innerHTML,
            title: title,
            scroll: scroll
        };
        triggerEvent(getDocument().body, 'htmx:historyItemCreated', {
            item: newHistoryItem,
            cache: historyCache
        });
        historyCache.push(newHistoryItem);
        while(historyCache.length > htmx.config.historyCacheSize)historyCache.shift();
        // keep trying to save the cache until it succeeds or is empty
        while(historyCache.length > 0)try {
            sessionStorage.setItem('htmx-history-cache', JSON.stringify(historyCache));
            break;
        } catch (e) {
            triggerErrorEvent(getDocument().body, 'htmx:historyCacheError', {
                cause: e,
                cache: historyCache
            });
            historyCache.shift() // shrink the cache and retry
            ;
        }
    }
    /**
   * @typedef {Object} HtmxHistoryItem
   * @property {string} url
   * @property {string} content
   * @property {string} title
   * @property {number} scroll
   */ /**
   * @param {string} url
   * @returns {HtmxHistoryItem|null}
   */ function getCachedHistory(url) {
        if (!canAccessLocalStorage()) return null;
        url = normalizePath(url);
        const historyCache = parseJSON(sessionStorage.getItem('htmx-history-cache')) || [];
        for(let i = 0; i < historyCache.length; i++){
            if (historyCache[i].url === url) return historyCache[i];
        }
        return null;
    }
    /**
   * @param {Element} elt
   * @returns {string}
   */ function cleanInnerHtmlForHistory(elt) {
        const className = htmx.config.requestClass;
        const clone = /** @type Element */ elt.cloneNode(true);
        forEach(findAll(clone, '.' + className), function(child) {
            removeClassFromElement(child, className);
        });
        // remove the disabled attribute for any element disabled due to an htmx request
        forEach(findAll(clone, '[data-disabled-by-htmx]'), function(child) {
            child.removeAttribute('disabled');
        });
        return clone.innerHTML;
    }
    function saveCurrentPageToHistory() {
        const elt = getHistoryElement();
        let path = currentPathForHistory;
        if (canAccessLocalStorage()) path = sessionStorage.getItem('htmx-current-path-for-history');
        path = path || location.pathname + location.search;
        // Allow history snapshot feature to be disabled where hx-history="false"
        // is present *anywhere* in the current document we're about to save,
        // so we can prevent privileged data entering the cache.
        // The page will still be reachable as a history entry, but htmx will fetch it
        // live from the server onpopstate rather than look in the sessionStorage cache
        const disableHistoryCache = getDocument().querySelector('[hx-history="false" i],[data-hx-history="false" i]');
        if (!disableHistoryCache) {
            triggerEvent(getDocument().body, 'htmx:beforeHistorySave', {
                path: path,
                historyElt: elt
            });
            saveToHistoryCache(path, elt);
        }
        if (htmx.config.historyEnabled) history.replaceState({
            htmx: true
        }, getDocument().title, location.href);
    }
    /**
   * @param {string} path
   */ function pushUrlIntoHistory(path) {
        // remove the cache buster parameter, if any
        if (htmx.config.getCacheBusterParam) {
            path = path.replace(/org\.htmx\.cache-buster=[^&]*&?/, '');
            if (endsWith(path, '&') || endsWith(path, '?')) path = path.slice(0, -1);
        }
        if (htmx.config.historyEnabled) history.pushState({
            htmx: true
        }, '', path);
        setCurrentPathForHistory(path);
    }
    /**
   * @param {string} path
   */ function replaceUrlInHistory(path) {
        if (htmx.config.historyEnabled) history.replaceState({
            htmx: true
        }, '', path);
        setCurrentPathForHistory(path);
    }
    /**
   * @param {HtmxSettleTask[]} tasks
   */ function settleImmediately(tasks) {
        forEach(tasks, function(task) {
            task.call(undefined);
        });
    }
    /**
   * @param {string} path
   */ function loadHistoryFromServer(path) {
        const request = new XMLHttpRequest();
        const swapSpec = {
            swapStyle: 'innerHTML',
            swapDelay: 0,
            settleDelay: 0
        };
        const details = {
            path: path,
            xhr: request,
            historyElt: getHistoryElement(),
            swapSpec: swapSpec
        };
        request.open('GET', path, true);
        if (htmx.config.historyRestoreAsHxRequest) request.setRequestHeader('HX-Request', 'true');
        request.setRequestHeader('HX-History-Restore-Request', 'true');
        request.setRequestHeader('HX-Current-URL', location.href);
        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                details.response = this.response;
                triggerEvent(getDocument().body, 'htmx:historyCacheMissLoad', details);
                swap(details.historyElt, details.response, swapSpec, {
                    contextElement: details.historyElt,
                    historyRequest: true
                });
                setCurrentPathForHistory(details.path);
                triggerEvent(getDocument().body, 'htmx:historyRestore', {
                    path: path,
                    cacheMiss: true,
                    serverResponse: details.response
                });
            } else triggerErrorEvent(getDocument().body, 'htmx:historyCacheMissLoadError', details);
        };
        if (triggerEvent(getDocument().body, 'htmx:historyCacheMiss', details)) request.send() // only send request if event not prevented
        ;
    }
    /**
   * @param {string} [path]
   */ function restoreHistory(path) {
        saveCurrentPageToHistory();
        path = path || location.pathname + location.search;
        const cached = getCachedHistory(path);
        if (cached) {
            const swapSpec = {
                swapStyle: 'innerHTML',
                swapDelay: 0,
                settleDelay: 0,
                scroll: cached.scroll
            };
            const details = {
                path: path,
                item: cached,
                historyElt: getHistoryElement(),
                swapSpec: swapSpec
            };
            if (triggerEvent(getDocument().body, 'htmx:historyCacheHit', details)) {
                swap(details.historyElt, cached.content, swapSpec, {
                    contextElement: details.historyElt,
                    title: cached.title
                });
                setCurrentPathForHistory(details.path);
                triggerEvent(getDocument().body, 'htmx:historyRestore', details);
            }
        } else if (htmx.config.refreshOnHistoryMiss) // @ts-ignore: optional parameter in reload() function throws error
        // noinspection JSUnresolvedReference
        htmx.location.reload(true);
        else loadHistoryFromServer(path);
    }
    /**
   * @param {Element} elt
   * @returns {Element[]}
   */ function addRequestIndicatorClasses(elt) {
        let indicators = /** @type Element[] */ findAttributeTargets(elt, 'hx-indicator');
        if (indicators == null) indicators = [
            elt
        ];
        forEach(indicators, function(ic) {
            const internalData = getInternalData(ic);
            internalData.requestCount = (internalData.requestCount || 0) + 1;
            addClassToElement(ic, htmx.config.requestClass);
        });
        return indicators;
    }
    /**
   * @param {Element} elt
   * @returns {Element[]}
   */ function disableElements(elt) {
        let disabledElts = /** @type Element[] */ findAttributeTargets(elt, 'hx-disabled-elt');
        if (disabledElts == null) disabledElts = [];
        forEach(disabledElts, function(disabledElement) {
            const internalData = getInternalData(disabledElement);
            internalData.requestCount = (internalData.requestCount || 0) + 1;
            if (!disabledElement.hasAttribute('disabled')) {
                disabledElement.setAttribute('disabled', '');
                disabledElement.setAttribute('data-disabled-by-htmx', '');
            }
        });
        return disabledElts;
    }
    /**
   * @param {Element[]} indicators
   * @param {Element[]} disabled
   */ function removeRequestIndicators(indicators, disabled) {
        forEach(indicators.concat(disabled), function(ele) {
            const internalData = getInternalData(ele);
            internalData.requestCount = (internalData.requestCount || 1) - 1;
        });
        forEach(indicators, function(ic) {
            const internalData = getInternalData(ic);
            if (internalData.requestCount === 0) removeClassFromElement(ic, htmx.config.requestClass);
        });
        forEach(disabled, function(disabledElement) {
            const internalData = getInternalData(disabledElement);
            if (internalData.requestCount === 0 && disabledElement.hasAttribute('data-disabled-by-htmx')) {
                disabledElement.removeAttribute('disabled');
                disabledElement.removeAttribute('data-disabled-by-htmx');
            }
        });
    }
    //= ===================================================================
    // Input Value Processing
    //= ===================================================================
    /**
   * @param {Element[]} processed
   * @param {Element} elt
   * @returns {boolean}
   */ function haveSeenNode(processed, elt) {
        for(let i = 0; i < processed.length; i++){
            const node = processed[i];
            if (node.isSameNode(elt)) return true;
        }
        return false;
    }
    /**
   * @param {Element} element
   * @return {boolean}
   */ function shouldInclude(element) {
        // Cast to trick tsc, undefined values will work fine here
        const elt = /** @type {HTMLInputElement} */ element;
        if (elt.name === '' || elt.name == null || elt.disabled || closest(elt, 'fieldset[disabled]')) return false;
        // ignore "submitter" types (see jQuery src/serialize.js)
        if (elt.type === 'button' || elt.type === 'submit' || elt.tagName === 'image' || elt.tagName === 'reset' || elt.tagName === 'file') return false;
        if (elt.type === 'checkbox' || elt.type === 'radio') return elt.checked;
        return true;
    }
    /**
   * @param {string} name
   * @param {string|Array|FormDataEntryValue} value
   * @param {FormData} formData */ function addValueToFormData(name, value, formData) {
        if (name != null && value != null) {
            if (Array.isArray(value)) value.forEach(function(v) {
                formData.append(name, v);
            });
            else formData.append(name, value);
        }
    }
    /**
   * @param {string} name
   * @param {string|Array} value
   * @param {FormData} formData */ function removeValueFromFormData(name, value, formData) {
        if (name != null && value != null) {
            let values = formData.getAll(name);
            if (Array.isArray(value)) values = values.filter((v)=>value.indexOf(v) < 0);
            else values = values.filter((v)=>v !== value);
            formData.delete(name);
            forEach(values, (v)=>formData.append(name, v));
        }
    }
    /**
   * @param {Element} elt
   * @returns {string|Array}
   */ function getValueFromInput(elt) {
        if (elt instanceof HTMLSelectElement && elt.multiple) return toArray(elt.querySelectorAll('option:checked')).map(function(e) {
            return /** @type HTMLOptionElement */ e.value;
        });
        // include file inputs
        if (elt instanceof HTMLInputElement && elt.files) return toArray(elt.files);
        // @ts-ignore value will be undefined for non-input elements, which is fine
        return elt.value;
    }
    /**
   * @param {Element[]} processed
   * @param {FormData} formData
   * @param {HtmxElementValidationError[]} errors
   * @param {Element|HTMLInputElement|HTMLSelectElement|HTMLFormElement} elt
   * @param {boolean} validate
   */ function processInputValue(processed, formData, errors, elt, validate) {
        if (elt == null || haveSeenNode(processed, elt)) return;
        else processed.push(elt);
        if (shouldInclude(elt)) {
            const name = getRawAttribute(elt, 'name');
            addValueToFormData(name, getValueFromInput(elt), formData);
            if (validate) validateElement(elt, errors);
        }
        if (elt instanceof HTMLFormElement) {
            forEach(elt.elements, function(input) {
                if (processed.indexOf(input) >= 0) // The input has already been processed and added to the values, but the FormData that will be
                //  constructed right after on the form, will include it once again. So remove that input's value
                //  now to avoid duplicates
                removeValueFromFormData(input.name, getValueFromInput(input), formData);
                else processed.push(input);
                if (validate) validateElement(input, errors);
            });
            new FormData(elt).forEach(function(value, name) {
                if (value instanceof File && value.name === '') return; // ignore no-name files
                addValueToFormData(name, value, formData);
            });
        }
    }
    /**
   * @param {Element} elt
   * @param {HtmxElementValidationError[]} errors
   */ function validateElement(elt, errors) {
        const element = /** @type {HTMLElement & ElementInternals} */ elt;
        if (element.willValidate) {
            triggerEvent(element, 'htmx:validation:validate');
            if (!element.checkValidity()) {
                if (triggerEvent(element, 'htmx:validation:failed', {
                    message: element.validationMessage,
                    validity: element.validity
                }) && !errors.length && htmx.config.reportValidityOfForms) element.reportValidity();
                errors.push({
                    elt: element,
                    message: element.validationMessage,
                    validity: element.validity
                });
            }
        }
    }
    /**
   * Override values in the one FormData with those from another.
   * @param {FormData} receiver the formdata that will be mutated
   * @param {FormData} donor the formdata that will provide the overriding values
   * @returns {FormData} the {@linkcode receiver}
   */ function overrideFormData(receiver, donor) {
        for (const key of donor.keys())receiver.delete(key);
        donor.forEach(function(value, key) {
            receiver.append(key, value);
        });
        return receiver;
    }
    /**
 * @param {Element|HTMLFormElement} elt
 * @param {HttpVerb} verb
 * @returns {{errors: HtmxElementValidationError[], formData: FormData, values: Object}}
 */ function getInputValues(elt, verb) {
        /** @type Element[] */ const processed = [];
        const formData = new FormData();
        const priorityFormData = new FormData();
        /** @type HtmxElementValidationError[] */ const errors = [];
        const internalData = getInternalData(elt);
        if (internalData.lastButtonClicked && !bodyContains(internalData.lastButtonClicked)) internalData.lastButtonClicked = null;
        // only validate when form is directly submitted and novalidate or formnovalidate are not set
        // or if the element has an explicit hx-validate="true" on it
        let validate = elt instanceof HTMLFormElement && elt.noValidate !== true || getAttributeValue(elt, 'hx-validate') === 'true';
        if (internalData.lastButtonClicked) validate = validate && internalData.lastButtonClicked.formNoValidate !== true;
        // for a non-GET include the related form, which may or may not be a parent element of elt
        if (verb !== 'get') processInputValue(processed, priorityFormData, errors, getRelatedForm(elt), validate);
        // include the element itself
        processInputValue(processed, formData, errors, elt, validate);
        // if a button or submit was clicked last, include its value
        if (internalData.lastButtonClicked || elt.tagName === 'BUTTON' || elt.tagName === 'INPUT' && getRawAttribute(elt, 'type') === 'submit') {
            const button = internalData.lastButtonClicked || /** @type HTMLInputElement|HTMLButtonElement */ elt;
            const name = getRawAttribute(button, 'name');
            addValueToFormData(name, button.value, priorityFormData);
        }
        // include any explicit includes
        const includes = findAttributeTargets(elt, 'hx-include');
        forEach(includes, function(node) {
            processInputValue(processed, formData, errors, asElement(node), validate);
            // if a non-form is included, include any input values within it
            if (!matches(node, 'form')) forEach(asParentNode(node).querySelectorAll(INPUT_SELECTOR), function(descendant) {
                processInputValue(processed, formData, errors, descendant, validate);
            });
        });
        // values from a <form> take precedence, overriding the regular values
        overrideFormData(formData, priorityFormData);
        return {
            errors: errors,
            formData: formData,
            values: formDataProxy(formData)
        };
    }
    /**
   * @param {string} returnStr
   * @param {string} name
   * @param {any} realValue
   * @returns {string}
   */ function appendParam(returnStr, name, realValue) {
        if (returnStr !== '') returnStr += '&';
        if (String(realValue) === '[object Object]') realValue = JSON.stringify(realValue);
        const s = encodeURIComponent(realValue);
        returnStr += encodeURIComponent(name) + '=' + s;
        return returnStr;
    }
    /**
   * @param {FormData|Object} values
   * @returns string
   */ function urlEncode(values) {
        values = formDataFromObject(values);
        let returnStr = '';
        values.forEach(function(value, key) {
            returnStr = appendParam(returnStr, key, value);
        });
        return returnStr;
    }
    //= ===================================================================
    // Ajax
    //= ===================================================================
    /**
 * @param {Element} elt
 * @param {Element} target
 * @param {string} prompt
 * @returns {HtmxHeaderSpecification}
 */ function getHeaders(elt, target, prompt1) {
        /** @type HtmxHeaderSpecification */ const headers = {
            'HX-Request': 'true',
            'HX-Trigger': getRawAttribute(elt, 'id'),
            'HX-Trigger-Name': getRawAttribute(elt, 'name'),
            'HX-Target': getAttributeValue(target, 'id'),
            'HX-Current-URL': location.href
        };
        getValuesForElement(elt, 'hx-headers', false, headers);
        if (prompt1 !== undefined) headers['HX-Prompt'] = prompt1;
        if (getInternalData(elt).boosted) headers['HX-Boosted'] = 'true';
        return headers;
    }
    /**
 * filterValues takes an object containing form input values
 * and returns a new object that only contains keys that are
 * specified by the closest "hx-params" attribute
 * @param {FormData} inputValues
 * @param {Element} elt
 * @returns {FormData}
 */ function filterValues(inputValues, elt) {
        const paramsValue = getClosestAttributeValue(elt, 'hx-params');
        if (paramsValue) {
            if (paramsValue === 'none') return new FormData();
            else if (paramsValue === '*') return inputValues;
            else if (paramsValue.indexOf('not ') === 0) {
                forEach(paramsValue.slice(4).split(','), function(name) {
                    name = name.trim();
                    inputValues.delete(name);
                });
                return inputValues;
            } else {
                const newValues = new FormData();
                forEach(paramsValue.split(','), function(name) {
                    name = name.trim();
                    if (inputValues.has(name)) inputValues.getAll(name).forEach(function(value) {
                        newValues.append(name, value);
                    });
                });
                return newValues;
            }
        } else return inputValues;
    }
    /**
   * @param {Element} elt
   * @return {boolean}
   */ function isAnchorLink(elt) {
        return !!getRawAttribute(elt, 'href') && getRawAttribute(elt, 'href').indexOf('#') >= 0;
    }
    /**
 * @param {Element} elt
 * @param {HtmxSwapStyle} [swapInfoOverride]
 * @returns {HtmxSwapSpecification}
 */ function getSwapSpecification(elt, swapInfoOverride) {
        const swapInfo = swapInfoOverride || getClosestAttributeValue(elt, 'hx-swap');
        /** @type HtmxSwapSpecification */ const swapSpec = {
            swapStyle: getInternalData(elt).boosted ? 'innerHTML' : htmx.config.defaultSwapStyle,
            swapDelay: htmx.config.defaultSwapDelay,
            settleDelay: htmx.config.defaultSettleDelay
        };
        if (htmx.config.scrollIntoViewOnBoost && getInternalData(elt).boosted && !isAnchorLink(elt)) swapSpec.show = 'top';
        if (swapInfo) {
            const split = splitOnWhitespace(swapInfo);
            if (split.length > 0) for(let i = 0; i < split.length; i++){
                const value = split[i];
                if (value.indexOf('swap:') === 0) swapSpec.swapDelay = parseInterval(value.slice(5));
                else if (value.indexOf('settle:') === 0) swapSpec.settleDelay = parseInterval(value.slice(7));
                else if (value.indexOf('transition:') === 0) swapSpec.transition = value.slice(11) === 'true';
                else if (value.indexOf('ignoreTitle:') === 0) swapSpec.ignoreTitle = value.slice(12) === 'true';
                else if (value.indexOf('scroll:') === 0) {
                    const scrollSpec = value.slice(7);
                    var splitSpec = scrollSpec.split(':');
                    const scrollVal = splitSpec.pop();
                    var selectorVal = splitSpec.length > 0 ? splitSpec.join(':') : null;
                    // @ts-ignore
                    swapSpec.scroll = scrollVal;
                    swapSpec.scrollTarget = selectorVal;
                } else if (value.indexOf('show:') === 0) {
                    const showSpec = value.slice(5);
                    var splitSpec = showSpec.split(':');
                    const showVal = splitSpec.pop();
                    var selectorVal = splitSpec.length > 0 ? splitSpec.join(':') : null;
                    swapSpec.show = showVal;
                    swapSpec.showTarget = selectorVal;
                } else if (value.indexOf('focus-scroll:') === 0) {
                    const focusScrollVal = value.slice(13);
                    swapSpec.focusScroll = focusScrollVal == 'true';
                } else if (i == 0) swapSpec.swapStyle = value;
                else logError('Unknown modifier in hx-swap: ' + value);
            }
        }
        return swapSpec;
    }
    /**
   * @param {Element} elt
   * @return {boolean}
   */ function usesFormData(elt) {
        return getClosestAttributeValue(elt, 'hx-encoding') === 'multipart/form-data' || matches(elt, 'form') && getRawAttribute(elt, 'enctype') === 'multipart/form-data';
    }
    /**
   * @param {XMLHttpRequest} xhr
   * @param {Element} elt
   * @param {FormData} filteredParameters
   * @returns {*|string|null}
   */ function encodeParamsForBody(xhr, elt, filteredParameters) {
        let encodedParameters = null;
        withExtensions(elt, function(extension) {
            if (encodedParameters == null) encodedParameters = extension.encodeParameters(xhr, filteredParameters, elt);
        });
        if (encodedParameters != null) return encodedParameters;
        else {
            if (usesFormData(elt)) // Force conversion to an actual FormData object in case filteredParameters is a formDataProxy
            // See https://github.com/bigskysoftware/htmx/issues/2317
            return overrideFormData(new FormData(), formDataFromObject(filteredParameters));
            else return urlEncode(filteredParameters);
        }
    }
    /**
 *
 * @param {Element} target
 * @returns {HtmxSettleInfo}
 */ function makeSettleInfo(target) {
        return {
            tasks: [],
            elts: [
                target
            ]
        };
    }
    /**
   * @param {Element[]} content
   * @param {HtmxSwapSpecification} swapSpec
   */ function updateScrollState(content, swapSpec) {
        const first = content[0];
        const last = content[content.length - 1];
        if (swapSpec.scroll) {
            var target = null;
            if (swapSpec.scrollTarget) target = asElement(querySelectorExt(first, swapSpec.scrollTarget));
            if (swapSpec.scroll === 'top' && (first || target)) {
                target = target || first;
                target.scrollTop = 0;
            }
            if (swapSpec.scroll === 'bottom' && (last || target)) {
                target = target || last;
                target.scrollTop = target.scrollHeight;
            }
            if (typeof swapSpec.scroll === 'number') getWindow().setTimeout(function() {
                window.scrollTo(0, /** @type number */ swapSpec.scroll);
            }, 0) // next 'tick', so browser has time to render layout
            ;
        }
        if (swapSpec.show) {
            var target = null;
            if (swapSpec.showTarget) {
                let targetStr = swapSpec.showTarget;
                if (swapSpec.showTarget === 'window') targetStr = 'body';
                target = asElement(querySelectorExt(first, targetStr));
            }
            if (swapSpec.show === 'top' && (first || target)) {
                target = target || first;
                // @ts-ignore For some reason tsc doesn't recognize "instant" as a valid option for now
                target.scrollIntoView({
                    block: 'start',
                    behavior: htmx.config.scrollBehavior
                });
            }
            if (swapSpec.show === 'bottom' && (last || target)) {
                target = target || last;
                // @ts-ignore For some reason tsc doesn't recognize "instant" as a valid option for now
                target.scrollIntoView({
                    block: 'end',
                    behavior: htmx.config.scrollBehavior
                });
            }
        }
    }
    /**
 * @param {Element} elt
 * @param {string} attr
 * @param {boolean=} evalAsDefault
 * @param {Object=} values
 * @param {Event=} event
 * @returns {Object}
 */ function getValuesForElement(elt, attr, evalAsDefault, values, event) {
        if (values == null) values = {};
        if (elt == null) return values;
        const attributeValue = getAttributeValue(elt, attr);
        if (attributeValue) {
            let str = attributeValue.trim();
            let evaluateValue = evalAsDefault;
            if (str === 'unset') return null;
            if (str.indexOf('javascript:') === 0) {
                str = str.slice(11);
                evaluateValue = true;
            } else if (str.indexOf('js:') === 0) {
                str = str.slice(3);
                evaluateValue = true;
            }
            if (str.indexOf('{') !== 0) str = '{' + str + '}';
            let varsValues;
            if (evaluateValue) varsValues = maybeEval(elt, function() {
                if (event) return Function('event', 'return (' + str + ')').call(elt, event);
                else return Function('return (' + str + ')').call(elt);
            }, {});
            else varsValues = parseJSON(str);
            for(const key in varsValues){
                if (varsValues.hasOwnProperty(key)) {
                    if (values[key] == null) values[key] = varsValues[key];
                }
            }
        }
        return getValuesForElement(asElement(parentElt(elt)), attr, evalAsDefault, values, event);
    }
    /**
   * @param {EventTarget|string} elt
   * @param {() => any} toEval
   * @param {any=} defaultVal
   * @returns {any}
   */ function maybeEval(elt, toEval, defaultVal) {
        if (htmx.config.allowEval) return toEval();
        else {
            triggerErrorEvent(elt, 'htmx:evalDisallowedError');
            return defaultVal;
        }
    }
    /**
 * @param {Element} elt
 * @param {Event=} event
 * @param {*?=} expressionVars
 * @returns
 */ function getHXVarsForElement(elt, event, expressionVars) {
        return getValuesForElement(elt, 'hx-vars', true, expressionVars, event);
    }
    /**
 * @param {Element} elt
 * @param {Event=} event
 * @param {*?=} expressionVars
 * @returns
 */ function getHXValsForElement(elt, event, expressionVars) {
        return getValuesForElement(elt, 'hx-vals', false, expressionVars, event);
    }
    /**
 * @param {Element} elt
 * @param {Event=} event
 * @returns {FormData}
 */ function getExpressionVars(elt, event) {
        return mergeObjects(getHXVarsForElement(elt, event), getHXValsForElement(elt, event));
    }
    /**
   * @param {XMLHttpRequest} xhr
   * @param {string} header
   * @param {string|null} headerValue
   */ function safelySetHeaderValue(xhr, header, headerValue) {
        if (headerValue !== null) try {
            xhr.setRequestHeader(header, headerValue);
        } catch (e) {
            // On an exception, try to set the header URI encoded instead
            xhr.setRequestHeader(header, encodeURIComponent(headerValue));
            xhr.setRequestHeader(header + '-URI-AutoEncoded', 'true');
        }
    }
    /**
   * @param {XMLHttpRequest} xhr
   * @return {string}
   */ function getPathFromResponse(xhr) {
        if (xhr.responseURL) try {
            const url = new URL(xhr.responseURL);
            return url.pathname + url.search;
        } catch (e) {
            triggerErrorEvent(getDocument().body, 'htmx:badResponseUrl', {
                url: xhr.responseURL
            });
        }
    }
    /**
   * @param {XMLHttpRequest} xhr
   * @param {RegExp} regexp
   * @return {boolean}
   */ function hasHeader(xhr, regexp) {
        return regexp.test(xhr.getAllResponseHeaders());
    }
    /**
   * Issues an htmx-style AJAX request
   *
   * @see https://htmx.org/api/#ajax
   *
   * @param {HttpVerb} verb
   * @param {string} path the URL path to make the AJAX
   * @param {Element|string|HtmxAjaxHelperContext} context the element to target (defaults to the **body**) | a selector for the target | a context object that contains any of the following
   * @return {Promise<void>} Promise that resolves immediately if no request is sent, or when the request is complete
   */ function ajaxHelper(verb, path, context) {
        verb = /** @type HttpVerb */ verb.toLowerCase();
        if (context) {
            if (context instanceof Element || typeof context === 'string') return issueAjaxRequest(verb, path, null, null, {
                targetOverride: resolveTarget(context) || DUMMY_ELT,
                returnPromise: true
            });
            else {
                let resolvedTarget = resolveTarget(context.target);
                // If target is supplied but can't resolve OR source is supplied but both target and source can't be resolved
                // then use DUMMY_ELT to abort the request with htmx:targetError to avoid it replacing body by mistake
                if (context.target && !resolvedTarget || context.source && !resolvedTarget && !resolveTarget(context.source)) resolvedTarget = DUMMY_ELT;
                return issueAjaxRequest(verb, path, resolveTarget(context.source), context.event, {
                    handler: context.handler,
                    headers: context.headers,
                    values: context.values,
                    targetOverride: resolvedTarget,
                    swapOverride: context.swap,
                    select: context.select,
                    returnPromise: true,
                    push: context.push,
                    replace: context.replace,
                    selectOOB: context.selectOOB
                });
            }
        } else return issueAjaxRequest(verb, path, null, null, {
            returnPromise: true
        });
    }
    /**
   * @param {Element} elt
   * @return {Element[]}
   */ function hierarchyForElt(elt) {
        const arr = [];
        while(elt){
            arr.push(elt);
            elt = elt.parentElement;
        }
        return arr;
    }
    /**
   * @param {Element} elt
   * @param {string} path
   * @param {HtmxRequestConfig} requestConfig
   * @return {boolean}
   */ function verifyPath(elt, path, requestConfig) {
        const url = new URL(path, location.protocol !== 'about:' ? location.href : window.origin);
        const origin = location.protocol !== 'about:' ? location.origin : window.origin;
        const sameHost = origin === url.origin;
        if (htmx.config.selfRequestsOnly) {
            if (!sameHost) return false;
        }
        return triggerEvent(elt, 'htmx:validateUrl', mergeObjects({
            url: url,
            sameHost: sameHost
        }, requestConfig));
    }
    /**
   * @param {Object|FormData} obj
   * @return {FormData}
   */ function formDataFromObject(obj) {
        if (obj instanceof FormData) return obj;
        const formData = new FormData();
        for(const key in obj)if (obj.hasOwnProperty(key)) {
            if (obj[key] && typeof obj[key].forEach === 'function') obj[key].forEach(function(v) {
                formData.append(key, v);
            });
            else if (typeof obj[key] === 'object' && !(obj[key] instanceof Blob)) formData.append(key, JSON.stringify(obj[key]));
            else formData.append(key, obj[key]);
        }
        return formData;
    }
    /**
   * @param {FormData} formData
   * @param {string} name
   * @param {Array} array
   * @returns {Array}
   */ function formDataArrayProxy(formData, name, array) {
        // mutating the array should mutate the underlying form data
        return new Proxy(array, {
            get: function(target, key) {
                if (typeof key === 'number') return target[key];
                if (key === 'length') return target.length;
                if (key === 'push') return function(value) {
                    target.push(value);
                    formData.append(name, value);
                };
                if (typeof target[key] === 'function') return function() {
                    target[key].apply(target, arguments);
                    formData.delete(name);
                    target.forEach(function(v) {
                        formData.append(name, v);
                    });
                };
                if (target[key] && target[key].length === 1) return target[key][0];
                else return target[key];
            },
            set: function(target, index, value) {
                target[index] = value;
                formData.delete(name);
                target.forEach(function(v) {
                    formData.append(name, v);
                });
                return true;
            }
        });
    }
    /**
   * @param {FormData} formData
   * @returns {Object}
   */ function formDataProxy(formData) {
        return new Proxy(formData, {
            get: function(target, name) {
                if (typeof name === 'symbol') {
                    // Forward symbol calls to the FormData itself directly
                    const result = Reflect.get(target, name);
                    // Wrap in function with apply to correctly bind the FormData context, as a direct call would result in an illegal invocation error
                    if (typeof result === 'function') return function() {
                        return result.apply(formData, arguments);
                    };
                    else return result;
                }
                if (name === 'toJSON') // Support JSON.stringify call on proxy
                return ()=>Object.fromEntries(formData);
                if (name in target) {
                    // Wrap in function with apply to correctly bind the FormData context, as a direct call would result in an illegal invocation error
                    if (typeof target[name] === 'function') return function() {
                        return formData[name].apply(formData, arguments);
                    };
                }
                const array = formData.getAll(name);
                // Those 2 undefined & single value returns are for retro-compatibility as we weren't using FormData before
                if (array.length === 0) return undefined;
                else if (array.length === 1) return array[0];
                else return formDataArrayProxy(target, name, array);
            },
            set: function(target, name, value) {
                if (typeof name !== 'string') return false;
                target.delete(name);
                if (value && typeof value.forEach === 'function') value.forEach(function(v) {
                    target.append(name, v);
                });
                else if (typeof value === 'object' && !(value instanceof Blob)) target.append(name, JSON.stringify(value));
                else target.append(name, value);
                return true;
            },
            deleteProperty: function(target, name) {
                if (typeof name === 'string') target.delete(name);
                return true;
            },
            // Support Object.assign call from proxy
            ownKeys: function(target) {
                return Reflect.ownKeys(Object.fromEntries(target));
            },
            getOwnPropertyDescriptor: function(target, prop) {
                return Reflect.getOwnPropertyDescriptor(Object.fromEntries(target), prop);
            }
        });
    }
    /**
   * @param {HttpVerb} verb
   * @param {string} path
   * @param {Element} elt
   * @param {Event} event
   * @param {HtmxAjaxEtc} [etc]
   * @param {boolean} [confirmed]
   * @return {Promise<void>}
   */ function issueAjaxRequest(verb, path, elt, event, etc, confirmed) {
        let resolve = null;
        let reject = null;
        etc = etc != null ? etc : {};
        if (etc.returnPromise && typeof Promise !== 'undefined') var promise = new Promise(function(_resolve, _reject) {
            resolve = _resolve;
            reject = _reject;
        });
        if (elt == null) elt = getDocument().body;
        const responseHandler = etc.handler || handleAjaxResponse;
        const select = etc.select || null;
        if (!bodyContains(elt)) {
            // do not issue requests for elements removed from the DOM
            maybeCall(resolve);
            return promise;
        }
        const target = etc.targetOverride || asElement(getTarget(elt));
        if (target == null || target == DUMMY_ELT) {
            triggerErrorEvent(elt, 'htmx:targetError', {
                target: getClosestAttributeValue(elt, 'hx-target')
            });
            maybeCall(reject);
            return promise;
        }
        let eltData = getInternalData(elt);
        const submitter = eltData.lastButtonClicked;
        if (submitter) {
            const buttonPath = getRawAttribute(submitter, 'formaction');
            if (buttonPath != null) path = buttonPath;
            const buttonVerb = getRawAttribute(submitter, 'formmethod');
            if (buttonVerb != null) {
                if (VERBS.includes(buttonVerb.toLowerCase())) verb = /** @type HttpVerb */ buttonVerb;
                else {
                    maybeCall(resolve);
                    return promise;
                }
            }
        }
        const confirmQuestion = getClosestAttributeValue(elt, 'hx-confirm');
        // allow event-based confirmation w/ a callback
        if (confirmed === undefined) {
            const issueRequest = function(skipConfirmation) {
                return issueAjaxRequest(verb, path, elt, event, etc, !!skipConfirmation);
            };
            const confirmDetails = {
                target: target,
                elt: elt,
                path: path,
                verb: verb,
                triggeringEvent: event,
                etc: etc,
                issueRequest: issueRequest,
                question: confirmQuestion
            };
            if (triggerEvent(elt, 'htmx:confirm', confirmDetails) === false) {
                maybeCall(resolve);
                return promise;
            }
        }
        let syncElt = elt;
        let syncStrategy = getClosestAttributeValue(elt, 'hx-sync');
        let queueStrategy = null;
        let abortable = false;
        if (syncStrategy) {
            const syncStrings = syncStrategy.split(':');
            const selector = syncStrings[0].trim();
            if (selector === 'this') syncElt = findThisElement(elt, 'hx-sync');
            else syncElt = asElement(querySelectorExt(elt, selector));
            // default to the drop strategy
            syncStrategy = (syncStrings[1] || 'drop').trim();
            eltData = getInternalData(syncElt);
            if (syncStrategy === 'drop' && eltData.xhr && eltData.abortable !== true) {
                maybeCall(resolve);
                return promise;
            } else if (syncStrategy === 'abort') {
                if (eltData.xhr) {
                    maybeCall(resolve);
                    return promise;
                } else abortable = true;
            } else if (syncStrategy === 'replace') triggerEvent(syncElt, 'htmx:abort') // abort the current request and continue
            ;
            else if (syncStrategy.indexOf('queue') === 0) {
                const queueStrArray = syncStrategy.split(' ');
                queueStrategy = (queueStrArray[1] || 'last').trim();
            }
        }
        if (eltData.xhr) {
            if (eltData.abortable) triggerEvent(syncElt, 'htmx:abort') // abort the current request and continue
            ;
            else {
                if (queueStrategy == null) {
                    if (event) {
                        const eventData = getInternalData(event);
                        if (eventData && eventData.triggerSpec && eventData.triggerSpec.queue) queueStrategy = eventData.triggerSpec.queue;
                    }
                    if (queueStrategy == null) queueStrategy = 'last';
                }
                if (eltData.queuedRequests == null) eltData.queuedRequests = [];
                if (queueStrategy === 'first' && eltData.queuedRequests.length === 0) eltData.queuedRequests.push(function() {
                    issueAjaxRequest(verb, path, elt, event, etc);
                });
                else if (queueStrategy === 'all') eltData.queuedRequests.push(function() {
                    issueAjaxRequest(verb, path, elt, event, etc);
                });
                else if (queueStrategy === 'last') {
                    eltData.queuedRequests = [] // dump existing queue
                    ;
                    eltData.queuedRequests.push(function() {
                        issueAjaxRequest(verb, path, elt, event, etc);
                    });
                }
                maybeCall(resolve);
                return promise;
            }
        }
        const xhr = new XMLHttpRequest();
        eltData.xhr = xhr;
        eltData.abortable = abortable;
        const endRequestLock = function() {
            eltData.xhr = null;
            eltData.abortable = false;
            if (eltData.queuedRequests != null && eltData.queuedRequests.length > 0) {
                const queuedRequest = eltData.queuedRequests.shift();
                queuedRequest();
            }
        };
        const promptQuestion = getClosestAttributeValue(elt, 'hx-prompt');
        if (promptQuestion) {
            var promptResponse = prompt(promptQuestion);
            // prompt returns null if cancelled and empty string if accepted with no entry
            if (promptResponse === null || !triggerEvent(elt, 'htmx:prompt', {
                prompt: promptResponse,
                target: target
            })) {
                maybeCall(resolve);
                endRequestLock();
                return promise;
            }
        }
        if (confirmQuestion && !confirmed) {
            if (!confirm(confirmQuestion)) {
                maybeCall(resolve);
                endRequestLock();
                return promise;
            }
        }
        let headers = getHeaders(elt, target, promptResponse);
        if (verb !== 'get' && !usesFormData(elt)) headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (etc.headers) headers = mergeObjects(headers, etc.headers);
        const results = getInputValues(elt, verb);
        let errors = results.errors;
        const rawFormData = results.formData;
        if (etc.values) overrideFormData(rawFormData, formDataFromObject(etc.values));
        const expressionVars = formDataFromObject(getExpressionVars(elt, event));
        const allFormData = overrideFormData(rawFormData, expressionVars);
        let filteredFormData = filterValues(allFormData, elt);
        if (htmx.config.getCacheBusterParam && verb === 'get') filteredFormData.set('org.htmx.cache-buster', getRawAttribute(target, 'id') || 'true');
        // behavior of anchors w/ empty href is to use the current URL
        if (path == null || path === '') path = location.href;
        /**
     * @type {Object}
     * @property {boolean} [credentials]
     * @property {number} [timeout]
     * @property {boolean} [noHeaders]
     */ const requestAttrValues = getValuesForElement(elt, 'hx-request');
        const eltIsBoosted = getInternalData(elt).boosted;
        let useUrlParams = htmx.config.methodsThatUseUrlParams.indexOf(verb) >= 0;
        /** @type HtmxRequestConfig */ const requestConfig = {
            boosted: eltIsBoosted,
            useUrlParams: useUrlParams,
            formData: filteredFormData,
            parameters: formDataProxy(filteredFormData),
            unfilteredFormData: allFormData,
            unfilteredParameters: formDataProxy(allFormData),
            headers: headers,
            elt: elt,
            target: target,
            verb: verb,
            errors: errors,
            withCredentials: etc.credentials || requestAttrValues.credentials || htmx.config.withCredentials,
            timeout: etc.timeout || requestAttrValues.timeout || htmx.config.timeout,
            path: path,
            triggeringEvent: event
        };
        if (!triggerEvent(elt, 'htmx:configRequest', requestConfig)) {
            maybeCall(resolve);
            endRequestLock();
            return promise;
        }
        // copy out in case the object was overwritten
        path = requestConfig.path;
        verb = requestConfig.verb;
        headers = requestConfig.headers;
        filteredFormData = formDataFromObject(requestConfig.parameters);
        errors = requestConfig.errors;
        useUrlParams = requestConfig.useUrlParams;
        if (errors && errors.length > 0) {
            triggerEvent(elt, 'htmx:validation:halted', requestConfig);
            maybeCall(resolve);
            endRequestLock();
            return promise;
        }
        const splitPath = path.split('#');
        const pathNoAnchor = splitPath[0];
        const anchor = splitPath[1];
        let finalPath = path;
        if (useUrlParams) {
            finalPath = pathNoAnchor;
            const hasValues = !filteredFormData.keys().next().done;
            if (hasValues) {
                if (finalPath.indexOf('?') < 0) finalPath += '?';
                else finalPath += '&';
                finalPath += urlEncode(filteredFormData);
                if (anchor) finalPath += '#' + anchor;
            }
        }
        if (!verifyPath(elt, finalPath, requestConfig)) {
            triggerErrorEvent(elt, 'htmx:invalidPath', requestConfig);
            maybeCall(reject);
            endRequestLock();
            return promise;
        }
        xhr.open(verb.toUpperCase(), finalPath, true);
        xhr.overrideMimeType('text/html');
        xhr.withCredentials = requestConfig.withCredentials;
        xhr.timeout = requestConfig.timeout;
        // request headers
        if (requestAttrValues.noHeaders) ;
        else {
            for(const header in headers)if (headers.hasOwnProperty(header)) {
                const headerValue = headers[header];
                safelySetHeaderValue(xhr, header, headerValue);
            }
        }
        /** @type {HtmxResponseInfo} */ const responseInfo = {
            xhr: xhr,
            target: target,
            requestConfig: requestConfig,
            etc: etc,
            boosted: eltIsBoosted,
            select: select,
            pathInfo: {
                requestPath: path,
                finalRequestPath: finalPath,
                responsePath: null,
                anchor: anchor
            }
        };
        xhr.onload = function() {
            try {
                const hierarchy = hierarchyForElt(elt);
                responseInfo.pathInfo.responsePath = getPathFromResponse(xhr);
                responseHandler(elt, responseInfo);
                if (responseInfo.keepIndicators !== true) removeRequestIndicators(indicators, disableElts);
                triggerEvent(elt, 'htmx:afterRequest', responseInfo);
                triggerEvent(elt, 'htmx:afterOnLoad', responseInfo);
                // if the body no longer contains the element, trigger the event on the closest parent
                // remaining in the DOM
                if (!bodyContains(elt)) {
                    let secondaryTriggerElt = null;
                    while(hierarchy.length > 0 && secondaryTriggerElt == null){
                        const parentEltInHierarchy = hierarchy.shift();
                        if (bodyContains(parentEltInHierarchy)) secondaryTriggerElt = parentEltInHierarchy;
                    }
                    if (secondaryTriggerElt) {
                        triggerEvent(secondaryTriggerElt, 'htmx:afterRequest', responseInfo);
                        triggerEvent(secondaryTriggerElt, 'htmx:afterOnLoad', responseInfo);
                    }
                }
                maybeCall(resolve);
            } catch (e) {
                triggerErrorEvent(elt, 'htmx:onLoadError', mergeObjects({
                    error: e
                }, responseInfo));
                throw e;
            } finally{
                endRequestLock();
            }
        };
        xhr.onerror = function() {
            removeRequestIndicators(indicators, disableElts);
            triggerErrorEvent(elt, 'htmx:afterRequest', responseInfo);
            triggerErrorEvent(elt, 'htmx:sendError', responseInfo);
            maybeCall(reject);
            endRequestLock();
        };
        xhr.onabort = function() {
            removeRequestIndicators(indicators, disableElts);
            triggerErrorEvent(elt, 'htmx:afterRequest', responseInfo);
            triggerErrorEvent(elt, 'htmx:sendAbort', responseInfo);
            maybeCall(reject);
            endRequestLock();
        };
        xhr.ontimeout = function() {
            removeRequestIndicators(indicators, disableElts);
            triggerErrorEvent(elt, 'htmx:afterRequest', responseInfo);
            triggerErrorEvent(elt, 'htmx:timeout', responseInfo);
            maybeCall(reject);
            endRequestLock();
        };
        if (!triggerEvent(elt, 'htmx:beforeRequest', responseInfo)) {
            maybeCall(resolve);
            endRequestLock();
            return promise;
        }
        var indicators = addRequestIndicatorClasses(elt);
        var disableElts = disableElements(elt);
        forEach([
            'loadstart',
            'loadend',
            'progress',
            'abort'
        ], function(eventName) {
            forEach([
                xhr,
                xhr.upload
            ], function(target) {
                target.addEventListener(eventName, function(event) {
                    triggerEvent(elt, 'htmx:xhr:' + eventName, {
                        lengthComputable: event.lengthComputable,
                        loaded: event.loaded,
                        total: event.total
                    });
                });
            });
        });
        triggerEvent(elt, 'htmx:beforeSend', responseInfo);
        const params = useUrlParams ? null : encodeParamsForBody(xhr, elt, filteredFormData);
        xhr.send(params);
        return promise;
    }
    /**
   * @typedef {Object} HtmxHistoryUpdate
   * @property {string|null} [type]
   * @property {string|null} [path]
   */ /**
   * @param {Element} elt
   * @param {HtmxResponseInfo} responseInfo
   * @return {HtmxHistoryUpdate}
   */ function determineHistoryUpdates(elt, responseInfo) {
        const xhr = responseInfo.xhr;
        //= ==========================================
        // First consult response headers
        //= ==========================================
        let pathFromHeaders = null;
        let typeFromHeaders = null;
        if (hasHeader(xhr, /HX-Push:/i)) {
            pathFromHeaders = xhr.getResponseHeader('HX-Push');
            typeFromHeaders = 'push';
        } else if (hasHeader(xhr, /HX-Push-Url:/i)) {
            pathFromHeaders = xhr.getResponseHeader('HX-Push-Url');
            typeFromHeaders = 'push';
        } else if (hasHeader(xhr, /HX-Replace-Url:/i)) {
            pathFromHeaders = xhr.getResponseHeader('HX-Replace-Url');
            typeFromHeaders = 'replace';
        }
        // if there was a response header, that has priority
        if (pathFromHeaders) {
            if (pathFromHeaders === 'false') return {};
            else return {
                type: typeFromHeaders,
                path: pathFromHeaders
            };
        }
        //= ==========================================
        // Next resolve via DOM values
        //= ==========================================
        const requestPath = responseInfo.pathInfo.finalRequestPath;
        const responsePath = responseInfo.pathInfo.responsePath;
        let pushUrl = responseInfo.etc.push || getClosestAttributeValue(elt, 'hx-push-url');
        let replaceUrl = responseInfo.etc.replace || getClosestAttributeValue(elt, 'hx-replace-url');
        if (pushUrl === 'false') pushUrl = null;
        if (replaceUrl === 'false') replaceUrl = null;
        const elementIsBoosted = getInternalData(elt).boosted;
        let saveType = null;
        let path = null;
        if (pushUrl) {
            saveType = 'push';
            path = pushUrl;
        } else if (replaceUrl) {
            saveType = 'replace';
            path = replaceUrl;
        } else if (elementIsBoosted) {
            saveType = 'push';
            path = responsePath || requestPath // if there is no response path, go with the original request path
            ;
        }
        if (path) {
            // true indicates we want to follow wherever the server ended up sending us
            if (path === 'true') path = responsePath || requestPath // if there is no response path, go with the original request path
            ;
            // restore any anchor associated with the request
            if (responseInfo.pathInfo.anchor && path.indexOf('#') === -1) path = path + '#' + responseInfo.pathInfo.anchor;
            return {
                type: saveType,
                path: path
            };
        } else return {};
    }
    /**
   * @param {HtmxResponseHandlingConfig} responseHandlingConfig
   * @param {number} status
   * @return {boolean}
   */ function codeMatches(responseHandlingConfig, status) {
        var regExp = new RegExp(responseHandlingConfig.code);
        return regExp.test(status.toString(10));
    }
    /**
   * @param {XMLHttpRequest} xhr
   * @return {HtmxResponseHandlingConfig}
   */ function resolveResponseHandling(xhr) {
        for(var i = 0; i < htmx.config.responseHandling.length; i++){
            /** @type HtmxResponseHandlingConfig */ var responseHandlingElement = htmx.config.responseHandling[i];
            if (codeMatches(responseHandlingElement, xhr.status)) return responseHandlingElement;
        }
        // no matches, return no swap
        return {
            swap: false
        };
    }
    /**
   * @param {string} title
   */ function handleTitle(title) {
        if (title) {
            const titleElt = find('title');
            if (titleElt) titleElt.textContent = title;
            else window.document.title = title;
        }
    }
    /**
   * Resove the Retarget selector and throw if not found
   * @param {Element} elt
   * @param {String} target
   * @returns {Element}
   */ function resolveRetarget(elt, target) {
        if (target === 'this') return elt;
        const resolvedTarget = asElement(querySelectorExt(elt, target));
        if (resolvedTarget == null) {
            triggerErrorEvent(elt, 'htmx:targetError', {
                target: target
            });
            throw new Error(`Invalid re-target ${target}`);
        }
        return resolvedTarget;
    }
    /**
   * @param {Element} elt
   * @param {HtmxResponseInfo} responseInfo
   */ function handleAjaxResponse(elt, responseInfo) {
        const xhr = responseInfo.xhr;
        let target = responseInfo.target;
        const etc = responseInfo.etc;
        const responseInfoSelect = responseInfo.select;
        if (!triggerEvent(elt, 'htmx:beforeOnLoad', responseInfo)) return;
        if (hasHeader(xhr, /HX-Trigger:/i)) handleTriggerHeader(xhr, 'HX-Trigger', elt);
        if (hasHeader(xhr, /HX-Location:/i)) {
            let redirectPath = xhr.getResponseHeader('HX-Location');
            /** @type {HtmxAjaxHelperContext&{path?:string}} */ var redirectSwapSpec = {};
            if (redirectPath.indexOf('{') === 0) {
                redirectSwapSpec = parseJSON(redirectPath);
                // what's the best way to throw an error if the user didn't include this
                redirectPath = redirectSwapSpec.path;
                delete redirectSwapSpec.path;
            }
            redirectSwapSpec.push = redirectSwapSpec.push ?? 'true';
            ajaxHelper('get', redirectPath, redirectSwapSpec);
            return;
        }
        const shouldRefresh = hasHeader(xhr, /HX-Refresh:/i) && xhr.getResponseHeader('HX-Refresh') === 'true';
        if (hasHeader(xhr, /HX-Redirect:/i)) {
            responseInfo.keepIndicators = true;
            htmx.location.href = xhr.getResponseHeader('HX-Redirect');
            shouldRefresh && htmx.location.reload();
            return;
        }
        if (shouldRefresh) {
            responseInfo.keepIndicators = true;
            htmx.location.reload();
            return;
        }
        const historyUpdate = determineHistoryUpdates(elt, responseInfo);
        const responseHandling = resolveResponseHandling(xhr);
        const shouldSwap = responseHandling.swap;
        let isError = !!responseHandling.error;
        let ignoreTitle = htmx.config.ignoreTitle || responseHandling.ignoreTitle;
        let selectOverride = responseHandling.select;
        if (responseHandling.target) responseInfo.target = resolveRetarget(elt, responseHandling.target);
        var swapOverride = etc.swapOverride;
        if (swapOverride == null && responseHandling.swapOverride) swapOverride = responseHandling.swapOverride;
        // response headers override response handling config
        if (hasHeader(xhr, /HX-Retarget:/i)) responseInfo.target = resolveRetarget(elt, xhr.getResponseHeader('HX-Retarget'));
        if (hasHeader(xhr, /HX-Reswap:/i)) swapOverride = xhr.getResponseHeader('HX-Reswap');
        var serverResponse = xhr.response;
        /** @type HtmxBeforeSwapDetails */ var beforeSwapDetails = mergeObjects({
            shouldSwap: shouldSwap,
            serverResponse: serverResponse,
            isError: isError,
            ignoreTitle: ignoreTitle,
            selectOverride: selectOverride,
            swapOverride: swapOverride
        }, responseInfo);
        if (responseHandling.event && !triggerEvent(target, responseHandling.event, beforeSwapDetails)) return;
        if (!triggerEvent(target, 'htmx:beforeSwap', beforeSwapDetails)) return;
        target = beforeSwapDetails.target // allow re-targeting
        ;
        serverResponse = beforeSwapDetails.serverResponse // allow updating content
        ;
        isError = beforeSwapDetails.isError // allow updating error
        ;
        ignoreTitle = beforeSwapDetails.ignoreTitle // allow updating ignoring title
        ;
        selectOverride = beforeSwapDetails.selectOverride // allow updating select override
        ;
        swapOverride = beforeSwapDetails.swapOverride // allow updating swap override
        ;
        responseInfo.target = target // Make updated target available to response events
        ;
        responseInfo.failed = isError // Make failed property available to response events
        ;
        responseInfo.successful = !isError // Make successful property available to response events
        ;
        if (beforeSwapDetails.shouldSwap) {
            if (xhr.status === 286) cancelPolling(elt);
            withExtensions(elt, function(extension) {
                serverResponse = extension.transformResponse(serverResponse, xhr, elt);
            });
            // Save current page if there will be a history update
            if (historyUpdate.type) saveCurrentPageToHistory();
            var swapSpec = getSwapSpecification(elt, swapOverride);
            if (!swapSpec.hasOwnProperty('ignoreTitle')) swapSpec.ignoreTitle = ignoreTitle;
            addClassToElement(target, htmx.config.swappingClass);
            if (responseInfoSelect) selectOverride = responseInfoSelect;
            if (hasHeader(xhr, /HX-Reselect:/i)) selectOverride = xhr.getResponseHeader('HX-Reselect');
            const selectOOB = etc.selectOOB || getClosestAttributeValue(elt, 'hx-select-oob');
            const select = getClosestAttributeValue(elt, 'hx-select');
            swap(target, serverResponse, swapSpec, {
                select: selectOverride === 'unset' ? null : selectOverride || select,
                selectOOB: selectOOB,
                eventInfo: responseInfo,
                anchor: responseInfo.pathInfo.anchor,
                contextElement: elt,
                afterSwapCallback: function() {
                    if (hasHeader(xhr, /HX-Trigger-After-Swap:/i)) {
                        let finalElt = elt;
                        if (!bodyContains(elt)) finalElt = getDocument().body;
                        handleTriggerHeader(xhr, 'HX-Trigger-After-Swap', finalElt);
                    }
                },
                afterSettleCallback: function() {
                    if (hasHeader(xhr, /HX-Trigger-After-Settle:/i)) {
                        let finalElt = elt;
                        if (!bodyContains(elt)) finalElt = getDocument().body;
                        handleTriggerHeader(xhr, 'HX-Trigger-After-Settle', finalElt);
                    }
                },
                beforeSwapCallback: function() {
                    // if we need to save history, do so, before swapping so that relative resources have the correct base URL
                    if (historyUpdate.type) {
                        triggerEvent(getDocument().body, 'htmx:beforeHistoryUpdate', mergeObjects({
                            history: historyUpdate
                        }, responseInfo));
                        if (historyUpdate.type === 'push') {
                            pushUrlIntoHistory(historyUpdate.path);
                            triggerEvent(getDocument().body, 'htmx:pushedIntoHistory', {
                                path: historyUpdate.path
                            });
                        } else {
                            replaceUrlInHistory(historyUpdate.path);
                            triggerEvent(getDocument().body, 'htmx:replacedInHistory', {
                                path: historyUpdate.path
                            });
                        }
                    }
                }
            });
        }
        if (isError) triggerErrorEvent(elt, 'htmx:responseError', mergeObjects({
            error: 'Response Status Error Code ' + xhr.status + ' from ' + responseInfo.pathInfo.requestPath
        }, responseInfo));
    }
    //= ===================================================================
    // Extensions API
    //= ===================================================================
    /** @type {Object<string, HtmxExtension>} */ const extensions = {};
    /**
   * extensionBase defines the default functions for all extensions.
   * @returns {HtmxExtension}
   */ function extensionBase() {
        return {
            init: function(api) {
                return null;
            },
            getSelectors: function() {
                return null;
            },
            onEvent: function(name, evt) {
                return true;
            },
            transformResponse: function(text, xhr, elt) {
                return text;
            },
            isInlineSwap: function(swapStyle) {
                return false;
            },
            handleSwap: function(swapStyle, target, fragment, settleInfo) {
                return false;
            },
            encodeParameters: function(xhr, parameters, elt) {
                return null;
            }
        };
    }
    /**
   * defineExtension initializes the extension and adds it to the htmx registry
   *
   * @see https://htmx.org/api/#defineExtension
   *
   * @param {string} name the extension name
   * @param {Partial<HtmxExtension>} extension the extension definition
   */ function defineExtension(name, extension) {
        if (extension.init) extension.init(internalAPI);
        extensions[name] = mergeObjects(extensionBase(), extension);
    }
    /**
   * removeExtension removes an extension from the htmx registry
   *
   * @see https://htmx.org/api/#removeExtension
   *
   * @param {string} name
   */ function removeExtension(name) {
        delete extensions[name];
    }
    /**
   * getExtensions searches up the DOM tree to return all extensions that can be applied to a given element
   *
   * @param {Element} elt
   * @param {HtmxExtension[]=} extensionsToReturn
   * @param {string[]=} extensionsToIgnore
   * @returns {HtmxExtension[]}
   */ function getExtensions(elt, extensionsToReturn, extensionsToIgnore) {
        if (extensionsToReturn == undefined) extensionsToReturn = [];
        if (elt == undefined) return extensionsToReturn;
        if (extensionsToIgnore == undefined) extensionsToIgnore = [];
        const extensionsForElement = getAttributeValue(elt, 'hx-ext');
        if (extensionsForElement) forEach(extensionsForElement.split(','), function(extensionName) {
            extensionName = extensionName.replace(/ /g, '');
            if (extensionName.slice(0, 7) == 'ignore:') {
                extensionsToIgnore.push(extensionName.slice(7));
                return;
            }
            if (extensionsToIgnore.indexOf(extensionName) < 0) {
                const extension = extensions[extensionName];
                if (extension && extensionsToReturn.indexOf(extension) < 0) extensionsToReturn.push(extension);
            }
        });
        return getExtensions(asElement(parentElt(elt)), extensionsToReturn, extensionsToIgnore);
    }
    //= ===================================================================
    // Initialization
    //= ===================================================================
    var isReady = false;
    getDocument().addEventListener('DOMContentLoaded', function() {
        isReady = true;
    });
    /**
   * Execute a function now if DOMContentLoaded has fired, otherwise listen for it.
   *
   * This function uses isReady because there is no reliable way to ask the browser whether
   * the DOMContentLoaded event has already been fired; there's a gap between DOMContentLoaded
   * firing and readystate=complete.
   */ function ready(fn) {
        // Checking readyState here is a failsafe in case the htmx script tag entered the DOM by
        // some means other than the initial page load.
        if (isReady || getDocument().readyState === 'complete') fn();
        else getDocument().addEventListener('DOMContentLoaded', fn);
    }
    function insertIndicatorStyles() {
        if (htmx.config.includeIndicatorStyles !== false) {
            const nonceAttribute = htmx.config.inlineStyleNonce ? ` nonce="${htmx.config.inlineStyleNonce}"` : '';
            const indicator = htmx.config.indicatorClass;
            const request = htmx.config.requestClass;
            getDocument().head.insertAdjacentHTML('beforeend', `<style${nonceAttribute}>` + `.${indicator}{opacity:0;visibility: hidden} ` + `.${request} .${indicator}, .${request}.${indicator}{opacity:1;visibility: visible;transition: opacity 200ms ease-in}` + '</style>');
        }
    }
    function getMetaConfig() {
        /** @type HTMLMetaElement */ const element = getDocument().querySelector('meta[name="htmx-config"]');
        if (element) return parseJSON(element.content);
        else return null;
    }
    function mergeMetaConfig() {
        const metaConfig = getMetaConfig();
        if (metaConfig) htmx.config = mergeObjects(htmx.config, metaConfig);
    }
    // initialize the document
    ready(function() {
        mergeMetaConfig();
        insertIndicatorStyles();
        let body = getDocument().body;
        processNode(body);
        const restoredElts = getDocument().querySelectorAll("[hx-trigger='restored'],[data-hx-trigger='restored']");
        body.addEventListener('htmx:abort', function(evt) {
            const target = /** @type {CustomEvent} */ evt.detail.elt || evt.target;
            const internalData = getInternalData(target);
            if (internalData && internalData.xhr) internalData.xhr.abort();
        });
        /** @type {(ev: PopStateEvent) => any} */ const originalPopstate = window.onpopstate ? window.onpopstate.bind(window) : null;
        /** @type {(ev: PopStateEvent) => any} */ window.onpopstate = function(event) {
            if (event.state && event.state.htmx) {
                restoreHistory();
                forEach(restoredElts, function(elt) {
                    triggerEvent(elt, 'htmx:restored', {
                        document: getDocument(),
                        triggerEvent: triggerEvent
                    });
                });
            } else if (originalPopstate) originalPopstate(event);
        };
        getWindow().setTimeout(function() {
            triggerEvent(body, 'htmx:load', {}) // give ready handlers a chance to load up before firing this event
            ;
            body = null // kill reference for gc
            ;
        }, 0);
    });
    return htmx;
}();
var /** @typedef {'get'|'head'|'post'|'put'|'delete'|'connect'|'options'|'trace'|'patch'} HttpVerb */ /**
 * @typedef {Object} SwapOptions
 * @property {string} [select]
 * @property {string} [selectOOB]
 * @property {*} [eventInfo]
 * @property {string} [anchor]
 * @property {Element} [contextElement]
 * @property {swapCallback} [afterSwapCallback]
 * @property {swapCallback} [afterSettleCallback]
 * @property {swapCallback} [beforeSwapCallback]
 * @property {string} [title]
 * @property {boolean} [historyRequest]
 */ /**
 * @callback swapCallback
 */ /**
 * @typedef {'innerHTML' | 'outerHTML' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' | 'delete' | 'none' | string} HtmxSwapStyle
 */ /**
 * @typedef HtmxSwapSpecification
 * @property {HtmxSwapStyle} swapStyle
 * @property {number} swapDelay
 * @property {number} settleDelay
 * @property {boolean} [transition]
 * @property {boolean} [ignoreTitle]
 * @property {string} [head]
 * @property {'top' | 'bottom' | number } [scroll]
 * @property {string} [scrollTarget]
 * @property {string} [show]
 * @property {string} [showTarget]
 * @property {boolean} [focusScroll]
 */ /**
 * @typedef {((this:Node, evt:Event) => boolean) & {source: string}} ConditionalFunction
 */ /**
 * @typedef {Object} HtmxTriggerSpecification
 * @property {string} trigger
 * @property {number} [pollInterval]
 * @property {ConditionalFunction} [eventFilter]
 * @property {boolean} [changed]
 * @property {boolean} [once]
 * @property {boolean} [consume]
 * @property {number} [delay]
 * @property {string} [from]
 * @property {string} [target]
 * @property {number} [throttle]
 * @property {string} [queue]
 * @property {string} [root]
 * @property {string} [threshold]
 */ /**
 * @typedef {{elt: Element, message: string, validity: ValidityState}} HtmxElementValidationError
 */ /**
 * @typedef {Record<string, string>} HtmxHeaderSpecification
 * @property {'true'} HX-Request
 * @property {string|null} HX-Trigger
 * @property {string|null} HX-Trigger-Name
 * @property {string|null} HX-Target
 * @property {string} HX-Current-URL
 * @property {string} [HX-Prompt]
 * @property {'true'} [HX-Boosted]
 * @property {string} [Content-Type]
 * @property {'true'} [HX-History-Restore-Request]
 */ /**
 * @typedef HtmxAjaxHelperContext
 * @property {Element|string} [source]
 * @property {Event} [event]
 * @property {HtmxAjaxHandler} [handler]
 * @property {Element|string} [target]
 * @property {HtmxSwapStyle} [swap]
 * @property {Object|FormData} [values]
 * @property {Record<string,string>} [headers]
 * @property {string} [select]
 * @property {string} [push]
 * @property {string} [replace]
 * @property {string} [selectOOB]
 */ /**
 * @typedef {Object} HtmxRequestConfig
 * @property {boolean} boosted
 * @property {boolean} useUrlParams
 * @property {FormData} formData
 * @property {Object} parameters formData proxy
 * @property {FormData} unfilteredFormData
 * @property {Object} unfilteredParameters unfilteredFormData proxy
 * @property {HtmxHeaderSpecification} headers
 * @property {Element} elt
 * @property {Element} target
 * @property {HttpVerb} verb
 * @property {HtmxElementValidationError[]} errors
 * @property {boolean} withCredentials
 * @property {number} timeout
 * @property {string} path
 * @property {Event} triggeringEvent
 */ /**
 * @typedef {Object} HtmxResponseInfo
 * @property {XMLHttpRequest} xhr
 * @property {Element} target
 * @property {HtmxRequestConfig} requestConfig
 * @property {HtmxAjaxEtc} etc
 * @property {boolean} boosted
 * @property {string} select
 * @property {{requestPath: string, finalRequestPath: string, responsePath: string|null, anchor: string}} pathInfo
 * @property {boolean} [failed]
 * @property {boolean} [successful]
 * @property {boolean} [keepIndicators]
 */ /**
 * @typedef {Object} HtmxAjaxEtc
 * @property {boolean} [returnPromise]
 * @property {HtmxAjaxHandler} [handler]
 * @property {string} [select]
 * @property {Element} [targetOverride]
 * @property {HtmxSwapStyle} [swapOverride]
 * @property {Record<string,string>} [headers]
 * @property {Object|FormData} [values]
 * @property {boolean} [credentials]
 * @property {number} [timeout]
 * @property {string} [push]
 * @property {string} [replace]
 * @property {string} [selectOOB]
 */ /**
 * @typedef {Object} HtmxResponseHandlingConfig
 * @property {string} [code]
 * @property {boolean} swap
 * @property {boolean} [error]
 * @property {boolean} [ignoreTitle]
 * @property {string} [select]
 * @property {string} [target]
 * @property {string} [swapOverride]
 * @property {string} [event]
 */ /**
 * @typedef {HtmxResponseInfo & {shouldSwap: boolean, serverResponse: any, isError: boolean, ignoreTitle: boolean, selectOverride:string, swapOverride:string}} HtmxBeforeSwapDetails
 */ /**
 * @callback HtmxAjaxHandler
 * @param {Element} elt
 * @param {HtmxResponseInfo} responseInfo
 */ /**
 * @typedef {(() => void)} HtmxSettleTask
 */ /**
 * @typedef {Object} HtmxSettleInfo
 * @property {HtmxSettleTask[]} tasks
 * @property {Element[]} elts
 * @property {string} [title]
 */ /**
 * @see https://github.com/bigskysoftware/htmx-extensions/blob/main/README.md
 * @typedef {Object} HtmxExtension
 * @property {(api: any) => void} init
 * @property {(name: string, event: CustomEvent) => boolean} onEvent
 * @property {(text: string, xhr: XMLHttpRequest, elt: Element) => string} transformResponse
 * @property {(swapStyle: HtmxSwapStyle) => boolean} isInlineSwap
 * @property {(swapStyle: HtmxSwapStyle, target: Node, fragment: Node, settleInfo: HtmxSettleInfo) => boolean|Node[]} handleSwap
 * @property {(xhr: XMLHttpRequest, parameters: FormData, elt: Node) => *|string|null} encodeParameters
 * @property {() => string[]|null} getSelectors
 */ $d08dd8c879223922$export$2e2bcd8739ae039 = htmx;

});

parcelRequire("hU7Y2");
var $2eb3f569e520dd6a$exports = {};
"use strict";
(()=>{
    var __defProp = Object.defineProperty;
    var __export = (target, all)=>{
        for(var name in all)__defProp(target, name, {
            get: all[name],
            enumerable: true
        });
    };
    // src/core/tokenizer.js
    var Tokens = class {
        #tokens;
        #consumed = [];
        #lastConsumed = null;
        #follows = [];
        source;
        constructor(tokens, source){
            this.#tokens = tokens;
            this.source = source;
            this.consumeWhitespace();
        }
        get list() {
            return this.#tokens;
        }
        get consumed() {
            return this.#consumed;
        }
        // ----- Debug -----
        toString() {
            var cur = this.currentToken();
            var lines = this.source.split("\n");
            var lineIdx = cur?.line ? cur.line - 1 : lines.length - 1;
            var col = cur?.line ? cur.column : 0;
            var contextLine = lines[lineIdx] || "";
            var tokenLen = Math.max(1, cur?.value?.length || 1);
            var gutter = String(lineIdx + 1).length;
            var out = "Tokens(";
            out += this.#consumed.filter((t)=>t.type !== "WHITESPACE").length + " consumed, ";
            out += this.#tokens.filter((t)=>t.type !== "WHITESPACE").length + " remaining";
            out += ", line " + (lineIdx + 1) + ")\n";
            out += "  " + String(lineIdx + 1).padStart(gutter) + " | " + contextLine + "\n";
            out += " ".repeat(gutter + 5) + " ".repeat(col) + "^".repeat(tokenLen);
            if (cur) out += " " + cur.type + " '" + cur.value + "'";
            return out;
        }
        // ----- Token access -----
        currentToken() {
            return this.token(0);
        }
        token(n, includeWhitespace) {
            var token;
            var i = 0;
            do {
                if (!includeWhitespace) while(this.#tokens[i] && this.#tokens[i].type === "WHITESPACE")i++;
                token = this.#tokens[i];
                n--;
                i++;
            }while (n > -1);
            return token || {
                type: "EOF",
                value: "<<<EOF>>>"
            };
        }
        hasMore() {
            return this.#tokens.length > 0;
        }
        lastMatch() {
            return this.#lastConsumed;
        }
        // ----- Token matching -----
        matchToken(value, type) {
            if (this.#follows.includes(value)) return;
            type = type || "IDENTIFIER";
            if (this.currentToken() && this.currentToken().value === value && this.currentToken().type === type) return this.consumeToken();
        }
        matchOpToken(value) {
            if (this.currentToken() && this.currentToken().op && this.currentToken().value === value) return this.consumeToken();
        }
        matchTokenType(...types) {
            if (this.currentToken() && this.currentToken().type && types.includes(this.currentToken().type)) return this.consumeToken();
        }
        matchAnyToken(...tokens) {
            for(var i = 0; i < tokens.length; i++){
                var match = this.matchToken(tokens[i]);
                if (match) return match;
            }
        }
        matchAnyOpToken(...ops) {
            for(var i = 0; i < ops.length; i++){
                var match = this.matchOpToken(ops[i]);
                if (match) return match;
            }
        }
        // ----- Token consuming -----
        consumeToken() {
            var match = this.#tokens.shift();
            this.#consumed.push(match);
            this.#lastConsumed = match;
            this.consumeWhitespace();
            return match;
        }
        consumeWhitespace() {
            while(this.token(0, true).type === "WHITESPACE")this.#consumed.push(this.#tokens.shift());
        }
        consumeUntil(value, type) {
            var tokenList = [];
            var currentToken = this.token(0, true);
            while((type == null || currentToken.type !== type) && (value == null || currentToken.value !== value) && currentToken.type !== "EOF"){
                var match = this.#tokens.shift();
                this.#consumed.push(match);
                tokenList.push(currentToken);
                currentToken = this.token(0, true);
            }
            this.consumeWhitespace();
            return tokenList;
        }
        consumeUntilWhitespace() {
            return this.consumeUntil(null, "WHITESPACE");
        }
        // ----- Lookahead -----
        peekToken(value, peek, type) {
            peek = peek || 0;
            type = type || "IDENTIFIER";
            let peekNoWhitespace = 0;
            while(peek > 0){
                peekNoWhitespace++;
                if (this.#tokens[peekNoWhitespace]?.type !== "WHITESPACE") peek--;
            }
            if (this.#tokens[peekNoWhitespace] && this.#tokens[peekNoWhitespace].value === value && this.#tokens[peekNoWhitespace].type === type) return this.#tokens[peekNoWhitespace];
        }
        // ----- Whitespace -----
        lastWhitespace() {
            var last = this.#consumed.at(-1);
            return last && last.type === "WHITESPACE" ? last.value : "";
        }
        // ----- Follow set management -----
        pushFollow(str) {
            this.#follows.push(str);
        }
        popFollow() {
            this.#follows.pop();
        }
        pushFollows(...strs) {
            for(var i = 0; i < strs.length; i++)this.#follows.push(strs[i]);
            return strs.length;
        }
        popFollows(count) {
            for(var i = 0; i < count; i++)this.#follows.pop();
        }
        clearFollows() {
            var tmp = this.#follows;
            this.#follows = [];
            return tmp;
        }
        restoreFollows(f) {
            this.#follows = f;
        }
    };
    var OP_TABLE = {
        "+": "PLUS",
        "-": "MINUS",
        "*": "MULTIPLY",
        "/": "DIVIDE",
        ".": "PERIOD",
        "..": "ELLIPSIS",
        "\\": "BACKSLASH",
        ":": "COLON",
        "%": "PERCENT",
        "|": "PIPE",
        "!": "EXCLAMATION",
        "?": "QUESTION",
        "#": "POUND",
        "&": "AMPERSAND",
        "$": "DOLLAR",
        ";": "SEMI",
        ",": "COMMA",
        "(": "L_PAREN",
        ")": "R_PAREN",
        "<": "L_ANG",
        ">": "R_ANG",
        "<=": "LTE_ANG",
        ">=": "GTE_ANG",
        "==": "EQ",
        "===": "EQQ",
        "!=": "NEQ",
        "!==": "NEQQ",
        "{": "L_BRACE",
        "}": "R_BRACE",
        "[": "L_BRACKET",
        "]": "R_BRACKET",
        "=": "EQUALS",
        "~": "TILDE",
        "^": "CARET"
    };
    var Tokenizer = class _Tokenizer {
        // ----- Instance state -----
        #source = "";
        #position = 0;
        #column = 0;
        #line = 1;
        #lastToken = "<START>";
        #templateBraceCount = 0;
        #tokens = [];
        #template = false;
        #templateMode;
        // ----- Character classification -----
        #isAlpha(c) {
            return c >= "a" && c <= "z" || c >= "A" && c <= "Z";
        }
        #isNumeric(c) {
            return c >= "0" && c <= "9";
        }
        #isWhitespace(c) {
            return c === " " || c === "	" || c === "\r" || c === "\n";
        }
        #isNewline(c) {
            return c === "\r" || c === "\n";
        }
        #isValidCSSChar(c) {
            return this.#isAlpha(c) || this.#isNumeric(c) || c === "-" || c === "_" || c === ":";
        }
        #isIdentifierChar(c) {
            return c === "_" || c === "$";
        }
        #isReservedChar(c) {
            return c === "`";
        }
        static tokenize(string, template) {
            return new _Tokenizer().tokenize(string, template);
        }
        tokenize(string, template) {
            this.#source = string;
            this.#position = 0;
            this.#column = 0;
            this.#line = 1;
            this.#lastToken = "<START>";
            this.#templateBraceCount = 0;
            this.#tokens = [];
            this.#template = template || false;
            this.#templateMode = "indeterminant";
            return this.#tokenize();
        }
        // ----- Character access -----
        #currentChar() {
            return this.#source.charAt(this.#position);
        }
        #nextChar() {
            return this.#source.charAt(this.#position + 1);
        }
        #charAt(offset = 1) {
            return this.#source.charAt(this.#position + offset);
        }
        #consumeChar() {
            this.#lastToken = this.#currentChar();
            this.#position++;
            if (this.#lastToken === "\n") {
                this.#line++;
                this.#column = 0;
            } else this.#column++;
            return this.#lastToken;
        }
        // ----- Context checks -----
        #inTemplate() {
            return this.#template && this.#templateBraceCount === 0;
        }
        #inCommandMode() {
            return !this.#inTemplate() || this.#templateMode === "command";
        }
        #possiblePrecedingSymbol() {
            return this.#isAlpha(this.#lastToken) || this.#isNumeric(this.#lastToken) || this.#lastToken === ")" || this.#lastToken === '"' || this.#lastToken === "'" || this.#lastToken === "`" || this.#lastToken === "}" || this.#lastToken === "]";
        }
        #isValidSingleQuoteStringStart() {
            if (this.#tokens.length > 0) {
                var prev = this.#tokens.at(-1);
                if (prev.type === "IDENTIFIER" || prev.type === "CLASS_REF" || prev.type === "ID_REF") return false;
                if (prev.op && (prev.value === ">" || prev.value === ")")) return false;
            }
            return true;
        }
        // ----- Token constructors -----
        #makeToken(type, value) {
            return {
                type: type,
                value: value || "",
                start: this.#position,
                end: this.#position + 1,
                column: this.#column,
                line: this.#line
            };
        }
        #makeOpToken(type, value) {
            var token = this.#makeToken(type, value);
            token.op = true;
            return token;
        }
        // ----- Consume methods -----
        #consumeComment() {
            while(this.#currentChar() && !this.#isNewline(this.#currentChar()))this.#consumeChar();
            this.#consumeChar();
        }
        #consumeWhitespace() {
            var ws = this.#makeToken("WHITESPACE");
            var value = "";
            while(this.#currentChar() && this.#isWhitespace(this.#currentChar())){
                if (this.#isNewline(this.#currentChar())) this.#templateMode = "indeterminant";
                value += this.#consumeChar();
            }
            ws.value = value;
            ws.end = this.#position;
            return ws;
        }
        #consumeClassReference() {
            var token = this.#makeToken("CLASS_REF");
            var value = this.#consumeChar();
            if (this.#currentChar() === "{") {
                token.template = true;
                value += this.#consumeChar();
                while(this.#currentChar() && this.#currentChar() !== "}")value += this.#consumeChar();
                if (this.#currentChar() !== "}") throw new Error("Unterminated class reference");
                else value += this.#consumeChar();
            } else while(this.#isValidCSSChar(this.#currentChar()) || this.#currentChar() === "\\"){
                if (this.#currentChar() === "\\") this.#consumeChar();
                value += this.#consumeChar();
            }
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeIdReference() {
            var token = this.#makeToken("ID_REF");
            var value = this.#consumeChar();
            if (this.#currentChar() === "{") {
                token.template = true;
                value += this.#consumeChar();
                while(this.#currentChar() && this.#currentChar() !== "}")value += this.#consumeChar();
                if (this.#currentChar() !== "}") throw new Error("Unterminated id reference");
                else this.#consumeChar();
            } else while(this.#isValidCSSChar(this.#currentChar()))value += this.#consumeChar();
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeAttributeReference() {
            var token = this.#makeToken("ATTRIBUTE_REF");
            var value = this.#consumeChar();
            while(this.#position < this.#source.length && this.#currentChar() !== "]")value += this.#consumeChar();
            if (this.#currentChar() === "]") value += this.#consumeChar();
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeShortAttributeReference() {
            var token = this.#makeToken("ATTRIBUTE_REF");
            var value = this.#consumeChar();
            while(this.#isValidCSSChar(this.#currentChar()))value += this.#consumeChar();
            if (this.#currentChar() === "=") {
                value += this.#consumeChar();
                if (this.#currentChar() === '"' || this.#currentChar() === "'") value += this.#consumeString().value;
                else if (this.#isAlpha(this.#currentChar()) || this.#isNumeric(this.#currentChar()) || this.#isIdentifierChar(this.#currentChar())) value += this.#consumeIdentifier().value;
            }
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeStyleReference() {
            var token = this.#makeToken("STYLE_REF");
            var value = this.#consumeChar();
            while(this.#isAlpha(this.#currentChar()) || this.#currentChar() === "-")value += this.#consumeChar();
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeTemplateLogic() {
            var token = this.#makeToken("IDENTIFIER");
            this.#consumeChar();
            var value = "";
            while(this.#isAlpha(this.#currentChar()))value += this.#consumeChar();
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeTemplateLine() {
            var token = this.#makeToken("TEMPLATE_LINE");
            token.value = "TEMPLATE_LINE";
            var content = "";
            while(this.#currentChar() && !this.#isNewline(this.#currentChar()))content += this.#consumeChar();
            if (this.#currentChar() && this.#isNewline(this.#currentChar())) {
                this.#consumeChar();
                content += "\n";
                this.#templateMode = "indeterminant";
            }
            token.content = content;
            token.end = this.#position;
            return token;
        }
        #consumeTemplateIdentifier() {
            var token = this.#makeToken("IDENTIFIER");
            var value = this.#consumeChar();
            var escaped = value === "\\";
            if (escaped) value = "";
            while(this.#isAlpha(this.#currentChar()) || this.#isNumeric(this.#currentChar()) || this.#isIdentifierChar(this.#currentChar()) || this.#currentChar() === "\\" || this.#currentChar() === "{" || this.#currentChar() === "}"){
                if (this.#currentChar() === "$" && !escaped) break;
                else if (this.#currentChar() === "\\") {
                    escaped = true;
                    this.#consumeChar();
                } else {
                    escaped = false;
                    value += this.#consumeChar();
                }
            }
            if (this.#currentChar() === "!" && value === "beep") value += this.#consumeChar();
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeIdentifier() {
            var token = this.#makeToken("IDENTIFIER");
            var value = this.#consumeChar();
            while(this.#isAlpha(this.#currentChar()) || this.#isNumeric(this.#currentChar()) || this.#isIdentifierChar(this.#currentChar()))value += this.#consumeChar();
            if (this.#currentChar() === "!" && value === "beep") value += this.#consumeChar();
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeNumber() {
            var token = this.#makeToken("NUMBER");
            var value = this.#consumeChar();
            while(this.#isNumeric(this.#currentChar()))value += this.#consumeChar();
            if (this.#currentChar() === "." && this.#isNumeric(this.#nextChar())) value += this.#consumeChar();
            while(this.#isNumeric(this.#currentChar()))value += this.#consumeChar();
            if (this.#currentChar() === "e" || this.#currentChar() === "E") {
                if (this.#isNumeric(this.#nextChar())) value += this.#consumeChar();
                else if (this.#nextChar() === "-") {
                    value += this.#consumeChar();
                    value += this.#consumeChar();
                }
            }
            while(this.#isNumeric(this.#currentChar()))value += this.#consumeChar();
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeOp() {
            var token = this.#makeOpToken();
            var value = this.#consumeChar();
            while(this.#currentChar() && OP_TABLE[value + this.#currentChar()])value += this.#consumeChar();
            token.type = OP_TABLE[value];
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeString() {
            var token = this.#makeToken("STRING");
            var startChar = this.#consumeChar();
            token.template = startChar === "`";
            var value = "";
            while(this.#currentChar() && this.#currentChar() !== startChar)if (this.#currentChar() === "\\") {
                this.#consumeChar();
                let next = this.#consumeChar();
                if (next === "b") value += "\b";
                else if (next === "f") value += "\f";
                else if (next === "n") value += "\n";
                else if (next === "r") value += "\r";
                else if (next === "t") value += "	";
                else if (next === "v") value += "\v";
                else if (token.template && next === "$") value += "\\$";
                else if (next === "x") {
                    const hex = this.#consumeHexEscape();
                    if (Number.isNaN(hex)) throw new Error("Invalid hexadecimal escape at [Line: " + token.line + ", Column: " + token.column + "]");
                    value += String.fromCharCode(hex);
                } else value += next;
            } else value += this.#consumeChar();
            if (this.#currentChar() !== startChar) throw new Error("Unterminated string at [Line: " + token.line + ", Column: " + token.column + "]");
            else this.#consumeChar();
            token.value = value;
            token.end = this.#position;
            return token;
        }
        #consumeHexEscape() {
            if (!this.#currentChar()) return NaN;
            let result = 16 * Number.parseInt(this.#consumeChar(), 16);
            if (!this.#currentChar()) return NaN;
            result += Number.parseInt(this.#consumeChar(), 16);
            return result;
        }
        // ----- Main tokenization loop -----
        #isLineComment() {
            var c = this.#currentChar(), n = this.#nextChar(), n2 = this.#charAt(2);
            return c === "-" && n === "-" && (this.#isWhitespace(n2) || n2 === "" || n2 === "-") || c === "/" && n === "/" && (this.#isWhitespace(n2) || n2 === "" || n2 === "/");
        }
        #tokenize() {
            while(this.#position < this.#source.length){
                if (this.#isLineComment()) this.#consumeComment();
                else if (this.#isWhitespace(this.#currentChar())) this.#tokens.push(this.#consumeWhitespace());
                else if (!this.#possiblePrecedingSymbol() && this.#currentChar() === "." && (this.#isAlpha(this.#nextChar()) || this.#nextChar() === "{" || this.#nextChar() === "-")) this.#tokens.push(this.#consumeClassReference());
                else if (!this.#possiblePrecedingSymbol() && this.#currentChar() === "#" && (this.#isAlpha(this.#nextChar()) || this.#nextChar() === "{")) {
                    if (this.#template === "lines" && this.#templateMode === "indeterminant") {
                        this.#templateMode = "command";
                        this.#tokens.push(this.#consumeTemplateLogic());
                    } else this.#tokens.push(this.#consumeIdReference());
                } else if (this.#template === "lines" && this.#templateMode === "indeterminant" && this.#templateBraceCount === 0) {
                    this.#templateMode = "template";
                    this.#tokens.push(this.#consumeTemplateLine());
                } else if (this.#currentChar() === "[" && this.#nextChar() === "@") this.#tokens.push(this.#consumeAttributeReference());
                else if (this.#currentChar() === "@") this.#tokens.push(this.#consumeShortAttributeReference());
                else if (this.#currentChar() === "*" && this.#isAlpha(this.#nextChar())) this.#tokens.push(this.#consumeStyleReference());
                else if (this.#inTemplate() && (this.#isAlpha(this.#currentChar()) || this.#currentChar() === "\\") && this.#templateMode !== "command") this.#tokens.push(this.#consumeTemplateIdentifier());
                else if (this.#inCommandMode() && (this.#isAlpha(this.#currentChar()) || this.#isIdentifierChar(this.#currentChar()))) this.#tokens.push(this.#consumeIdentifier());
                else if (this.#isNumeric(this.#currentChar())) this.#tokens.push(this.#consumeNumber());
                else if (this.#inCommandMode() && (this.#currentChar() === '"' || this.#currentChar() === "`")) this.#tokens.push(this.#consumeString());
                else if (this.#inCommandMode() && this.#currentChar() === "'") {
                    if (this.#isValidSingleQuoteStringStart()) this.#tokens.push(this.#consumeString());
                    else this.#tokens.push(this.#consumeOp());
                } else if (OP_TABLE[this.#currentChar()]) {
                    if (this.#lastToken === "$" && this.#currentChar() === "{") this.#templateBraceCount++;
                    if (this.#currentChar() === "}") this.#templateBraceCount--;
                    this.#tokens.push(this.#consumeOp());
                } else if (this.#inTemplate() || this.#isReservedChar(this.#currentChar())) this.#tokens.push(this.#makeToken("RESERVED", this.#consumeChar()));
                else {
                    if (this.#position < this.#source.length) throw new Error("Unknown token: " + this.#currentChar() + " ");
                }
            }
            return new Tokens(this.#tokens, this.#source);
        }
    };
    // src/parsetree/base.js
    var ParseElement = class _ParseElement {
        errors = [];
        collectErrors(visited) {
            if (!visited) visited = /* @__PURE__ */ new Set();
            if (visited.has(this)) return [];
            visited.add(this);
            var all = [
                ...this.errors
            ];
            for (var key of Object.keys(this)){
                for (var item of [
                    this[key]
                ].flat())if (item instanceof _ParseElement) all.push(...item.collectErrors(visited));
            }
            return all;
        }
        sourceFor() {
            return this.programSource.substring(this.startToken.start, this.endToken.end);
        }
        lineFor() {
            return this.programSource.split("\n")[this.startToken.line - 1];
        }
        static parseEventArgs(parser) {
            var args = [];
            if (parser.token(0).value === "(" && (parser.token(1).value === ")" || parser.token(2).value === "," || parser.token(2).value === ")")) {
                parser.matchOpToken("(");
                do args.push(parser.requireTokenType("IDENTIFIER"));
                while (parser.matchOpToken(","));
                parser.requireOpToken(")");
            }
            return args;
        }
    };
    var Expression = class extends ParseElement {
        constructor(){
            super();
            if (this.constructor.grammarName) this.type = this.constructor.grammarName;
        }
        evaluate(context) {
            return context.meta.runtime.unifiedEval(this, context);
        }
        evalStatically() {
            throw new Error("This expression cannot be evaluated statically: " + this.type);
        }
    };
    var Command = class extends ParseElement {
        constructor(){
            super();
            if (this.constructor.keyword) this.type = this.constructor.keyword + "Command";
        }
        execute(context) {
            context.meta.command = this;
            return context.meta.runtime.unifiedExec(this, context);
        }
        findNext(context) {
            return context.meta.runtime.findNext(this, context);
        }
    };
    var Feature = class extends ParseElement {
        isFeature = true;
        constructor(){
            super();
            if (this.constructor.keyword) this.type = this.constructor.keyword + "Feature";
        }
        install(target, source, args, runtime2) {}
        /**
     * Parse optional catch/finally blocks after a command list.
     * Returns { errorHandler, errorSymbol, finallyHandler }
     */ static parseErrorAndFinally(parser) {
            var errorSymbol, errorHandler, finallyHandler;
            if (parser.matchToken("catch")) {
                errorSymbol = parser.requireTokenType("IDENTIFIER").value;
                errorHandler = parser.requireElement("commandList");
                parser.ensureTerminated(errorHandler);
            }
            if (parser.matchToken("finally")) {
                finallyHandler = parser.requireElement("commandList");
                parser.ensureTerminated(finallyHandler);
            }
            return {
                errorHandler: errorHandler,
                errorSymbol: errorSymbol,
                finallyHandler: finallyHandler
            };
        }
    };
    // src/parsetree/internals.js
    var EmptyCommandListCommand = class extends Command {
        constructor(){
            super();
            this.type = "emptyCommandListCommand";
        }
        resolve(context) {
            return this.findNext(context);
        }
    };
    var UnlessStatementModifier = class extends Command {
        constructor(root, conditional){
            super();
            this.type = "unlessStatementModifier";
            this.root = root;
            this.args = {
                conditional: conditional
            };
        }
        resolve(context, { conditional: conditional }) {
            if (conditional) return this.next;
            else return this.root;
        }
    };
    var HyperscriptProgram = class extends ParseElement {
        constructor(features){
            super();
            this.type = "hyperscript";
            this.features = features;
        }
        apply(target, source, args, runtime2) {
            for (const feature of this.features)feature.install(target, source, args, runtime2);
        }
    };
    var FailedFeature = class extends Feature {
        constructor(error, keyword){
            super();
            this.type = "failedFeature";
            this.keyword = keyword;
            this.errors.push(error);
        }
        install() {}
    };
    var FailedCommand = class extends Command {
        constructor(error, keyword){
            super();
            this.type = "failedCommand";
            this.keyword = keyword;
            this.errors.push(error);
        }
        resolve() {}
    };
    var ImplicitReturn = class extends Command {
        constructor(){
            super();
            this.type = "implicitReturn";
        }
        resolve(context) {
            context.meta.returned = true;
            if (context.meta.resolve) context.meta.resolve();
            return context.meta.runtime.HALT;
        }
    };
    // src/parsetree/expressions/literals.js
    var literals_exports = {};
    __export(literals_exports, {
        ArrayLiteral: ()=>ArrayLiteral,
        BooleanLiteral: ()=>BooleanLiteral,
        NakedNamedArgumentList: ()=>NakedNamedArgumentList,
        NakedString: ()=>NakedString,
        NamedArgumentList: ()=>NamedArgumentList,
        NullLiteral: ()=>NullLiteral,
        NumberLiteral: ()=>NumberLiteral,
        ObjectKey: ()=>ObjectKey,
        ObjectLiteral: ()=>ObjectLiteral,
        StringLike: ()=>StringLike,
        StringLiteral: ()=>StringLiteral
    });
    var NakedString = class _NakedString extends Expression {
        static grammarName = "nakedString";
        constructor(tokens){
            super();
            this.tokens = tokens;
        }
        static parse(parser) {
            if (parser.hasMore()) {
                var tokenArr = parser.consumeUntilWhitespace();
                parser.matchTokenType("WHITESPACE");
                return new _NakedString(tokenArr);
            }
        }
        evalStatically() {
            return this.resolve();
        }
        resolve(context) {
            return this.tokens.map(function(t) {
                return t.value;
            }).join("");
        }
    };
    var BooleanLiteral = class _BooleanLiteral extends Expression {
        static grammarName = "boolean";
        static expressionType = "leaf";
        constructor(value){
            super();
            this.value = value;
        }
        static parse(parser) {
            var booleanLiteral = parser.matchToken("true") || parser.matchToken("false");
            if (!booleanLiteral) return;
            const value = booleanLiteral.value === "true";
            return new _BooleanLiteral(value);
        }
        evalStatically() {
            return this.value;
        }
        resolve(context) {
            return this.value;
        }
    };
    var NullLiteral = class _NullLiteral extends Expression {
        static grammarName = "null";
        static expressionType = "leaf";
        constructor(){
            super();
        }
        static parse(parser) {
            if (parser.matchToken("null")) return new _NullLiteral();
        }
        evalStatically() {
            return null;
        }
        resolve(context) {
            return null;
        }
    };
    var NumberLiteral = class _NumberLiteral extends Expression {
        static grammarName = "number";
        static expressionType = "leaf";
        constructor(value, numberToken){
            super();
            this.value = value;
            this.numberToken = numberToken;
        }
        static parse(parser) {
            var number = parser.matchTokenType("NUMBER");
            if (!number) return;
            var numberToken = number;
            var value = parseFloat(/** @type {string} */ number.value);
            return new _NumberLiteral(value, numberToken);
        }
        evalStatically() {
            return this.value;
        }
        resolve(context) {
            return this.value;
        }
    };
    var StringLiteral = class _StringLiteral extends Expression {
        static grammarName = "string";
        static expressionType = "leaf";
        constructor(stringToken, rawValue, args){
            super();
            this.token = stringToken;
            this.rawValue = rawValue;
            this.args = args.length > 0 ? {
                parts: args
            } : null;
        }
        static parse(parser) {
            var stringToken = parser.matchTokenType("STRING");
            if (!stringToken) return;
            var rawValue = /** @type {string} */ stringToken.value;
            var args;
            if (stringToken.template) {
                var innerTokens = Tokenizer.tokenize(rawValue, true);
                var innerParser = parser.createChildParser(innerTokens);
                args = innerParser.parseStringTemplate();
            } else args = [];
            return new _StringLiteral(stringToken, rawValue, args);
        }
        evalStatically() {
            if (this.args === null) return this.rawValue;
            return super.evalStatically();
        }
        resolve(context, { parts: parts } = {}) {
            if (!parts || parts.length === 0) return this.rawValue;
            var returnStr = "";
            for(var i = 0; i < parts.length; i++){
                var val = parts[i];
                if (val !== void 0) returnStr += val;
            }
            return returnStr;
        }
    };
    var ArrayLiteral = class _ArrayLiteral extends Expression {
        static grammarName = "arrayLiteral";
        static expressionType = "leaf";
        constructor(values){
            super();
            this.values = values;
            this.args = {
                values: values
            };
        }
        static parse(parser) {
            if (!parser.matchOpToken("[")) return;
            var values = [];
            if (!parser.matchOpToken("]")) {
                do {
                    var expr = parser.requireElement("expression");
                    values.push(expr);
                }while (parser.matchOpToken(","));
                parser.requireOpToken("]");
            }
            return new _ArrayLiteral(values);
        }
        resolve(context, { values: values }) {
            return values;
        }
    };
    var ObjectKey = class _ObjectKey extends Expression {
        static grammarName = "objectKey";
        constructor(key, expr, args){
            super();
            this.key = key;
            this.expr = expr;
            this.args = args;
        }
        static parse(parser) {
            var token;
            if (token = parser.matchTokenType("STRING")) return new _ObjectKey(token.value, null, null);
            else if (parser.matchOpToken("[")) {
                var expr = parser.parseElement("expression");
                parser.requireOpToken("]");
                return new _ObjectKey(null, expr, {
                    value: expr
                });
            } else {
                var key = "";
                do {
                    token = parser.matchTokenType("IDENTIFIER") || parser.matchOpToken("-");
                    if (token) key += token.value;
                }while (token);
                return new _ObjectKey(key, null, null);
            }
        }
        evalStatically() {
            if (!this.expr) return this.key;
            return super.evalStatically();
        }
        resolve(ctx, { value: value } = {}) {
            if (this.expr) return value;
            return this.key;
        }
    };
    var ObjectLiteral = class _ObjectLiteral extends Expression {
        static grammarName = "objectLiteral";
        static expressionType = "leaf";
        constructor(keyExpressions, valueExpressions){
            super();
            this.keyExpressions = keyExpressions;
            this.valueExpressions = valueExpressions;
            this.args = {
                keys: keyExpressions,
                values: valueExpressions
            };
        }
        static parse(parser) {
            if (!parser.matchOpToken("{")) return;
            var keyExpressions = [];
            var valueExpressions = [];
            if (!parser.matchOpToken("}")) {
                do {
                    var name = parser.requireElement("objectKey");
                    parser.requireOpToken(":");
                    var value = parser.requireElement("expression");
                    valueExpressions.push(value);
                    keyExpressions.push(name);
                }while (parser.matchOpToken(",") && !parser.peekToken("}", 0, "R_BRACE"));
                parser.requireOpToken("}");
            }
            return new _ObjectLiteral(keyExpressions, valueExpressions);
        }
        resolve(context, { keys: keys, values: values }) {
            var returnVal = {};
            for(var i = 0; i < keys.length; i++)returnVal[keys[i]] = values[i];
            return returnVal;
        }
    };
    var NamedArgumentList = class _NamedArgumentList extends Expression {
        static grammarName = "namedArgumentList";
        constructor(fields, valueExpressions){
            super();
            this.fields = fields;
            this.args = {
                values: valueExpressions
            };
        }
        static parseNaked(parser) {
            var fields = [];
            var valueExpressions = [];
            if (parser.currentToken().type === "IDENTIFIER") do {
                var name = parser.requireTokenType("IDENTIFIER");
                parser.requireOpToken(":");
                var value = parser.requireElement("expression");
                valueExpressions.push(value);
                fields.push({
                    name: name,
                    value: value
                });
            }while (parser.matchOpToken(","));
            return new _NamedArgumentList(fields, valueExpressions);
        }
        static parse(parser) {
            if (!parser.matchOpToken("(")) return;
            var elt = _NamedArgumentList.parseNaked(parser);
            parser.requireOpToken(")");
            return elt;
        }
        resolve(context, { values: values }) {
            var returnVal = {
                _namedArgList_: true
            };
            for(var i = 0; i < values.length; i++){
                var field = this.fields[i];
                returnVal[field.name.value] = values[i];
            }
            return returnVal;
        }
    };
    var NakedNamedArgumentList = class extends Expression {
        static grammarName = "nakedNamedArgumentList";
        static parse = NamedArgumentList.parseNaked;
    };
    var StringLike = class extends Expression {
        static grammarName = "stringLike";
        static parse(parser) {
            return parser.parseAnyOf([
                "string",
                "nakedString"
            ]);
        }
    };
    // src/core/parser.js
    var ParseError = class {
        constructor(message, token, source, expected){
            this.message = message;
            this.token = token;
            this.source = source;
            this.expected = expected || null;
            this.line = token?.line ?? null;
            this.column = token?.column ?? null;
        }
    };
    var ParseRecoverySentinel = class extends Error {
        constructor(parseError){
            super(parseError.message);
            this.parseError = parseError;
        }
    };
    var Parser = class _Parser {
        #kernel;
        constructor(kernel2, tokens){
            this.#kernel = kernel2;
            this.tokens = tokens;
        }
        toString() {
            this.tokens.matched;
        }
        static formatErrors(errors) {
            if (!errors.length) return "";
            var source = errors[0].source;
            var lines = source.split("\n");
            var byLine = /* @__PURE__ */ new Map();
            for (var e of errors){
                var lineIdx = e.token?.line ? e.token.line - 1 : lines.length - 1;
                if (!byLine.has(lineIdx)) byLine.set(lineIdx, []);
                byLine.get(lineIdx).push(e);
            }
            var maxLine = Math.max(...byLine.keys()) + 1;
            var gutter = String(maxLine).length;
            var pad = " ".repeat(gutter + 5);
            var sortedLines = [
                ...byLine.entries()
            ].sort((a, b)=>a[0] - b[0]);
            var prevLineIdx = -1;
            var out = "";
            for (var [lineIdx, lineErrors] of sortedLines){
                if (prevLineIdx !== -1 && lineIdx > prevLineIdx + 1) out += " ".repeat(gutter + 1) + "...\n";
                else if (prevLineIdx === -1 && lineIdx > 0) out += " ".repeat(gutter + 1) + "...\n";
                prevLineIdx = lineIdx;
                var lineNum = String(lineIdx + 1).padStart(gutter);
                var contextLine = lines[lineIdx] || "";
                out += "  " + lineNum + " | " + contextLine + "\n";
                lineErrors.sort((a, b)=>(a.column || 0) - (b.column || 0));
                var underlineChars = Array(contextLine.length + 10).fill(" ");
                for (var e of lineErrors){
                    var col = e.token?.line ? e.token.column : Math.max(0, contextLine.length - 1);
                    var len = Math.max(1, e.token?.value?.length || 1);
                    for(var i = 0; i < len; i++)underlineChars[col + i] = "^";
                }
                out += pad + underlineChars.join("").trimEnd() + "\n";
                for (var e of lineErrors){
                    var col = e.token?.line ? e.token.column : 0;
                    out += pad + " ".repeat(col) + e.message + "\n";
                }
            }
            return out;
        }
        // ===========================
        // Token delegation methods
        // ===========================
        consumeWhitespace() {
            return this.tokens.consumeWhitespace();
        }
        requireOpToken(value) {
            var token = this.matchOpToken(value);
            if (token) return token;
            this.raiseExpected(value);
        }
        matchAnyOpToken(...ops) {
            return this.tokens.matchAnyOpToken(...ops);
        }
        matchAnyToken(...tokens) {
            return this.tokens.matchAnyToken(...tokens);
        }
        matchOpToken(value) {
            return this.tokens.matchOpToken(value);
        }
        requireTokenType(...types) {
            var token = this.matchTokenType(...types);
            if (token) return token;
            this.raiseExpected(...types);
        }
        matchTokenType(...types) {
            return this.tokens.matchTokenType(...types);
        }
        requireToken(value, type) {
            var token = this.matchToken(value, type);
            if (token) return token;
            this.raiseExpected(value);
        }
        peekToken(value, peek, type) {
            return this.tokens.peekToken(value, peek, type);
        }
        matchToken(value, type) {
            return this.tokens.matchToken(value, type);
        }
        consumeToken() {
            return this.tokens.consumeToken();
        }
        consumeUntil(value, type) {
            return this.tokens.consumeUntil(value, type);
        }
        lastWhitespace() {
            return this.tokens.lastWhitespace();
        }
        consumeUntilWhitespace() {
            return this.tokens.consumeUntilWhitespace();
        }
        hasMore() {
            return this.tokens.hasMore();
        }
        token(n, includeWhitespace) {
            return this.tokens.token(n, includeWhitespace);
        }
        currentToken() {
            return this.tokens.currentToken();
        }
        lastMatch() {
            return this.tokens.lastMatch();
        }
        pushFollow(str) {
            return this.tokens.pushFollow(str);
        }
        popFollow() {
            return this.tokens.popFollow();
        }
        pushFollows(...strs) {
            return this.tokens.pushFollows(...strs);
        }
        popFollows(count) {
            return this.tokens.popFollows(count);
        }
        clearFollows() {
            return this.tokens.clearFollows();
        }
        restoreFollows(f) {
            return this.tokens.restoreFollows(f);
        }
        get source() {
            return this.tokens.source;
        }
        get consumed() {
            return this.tokens.consumed;
        }
        get list() {
            return this.tokens.list;
        }
        createChildParser(tokens) {
            return new _Parser(this.#kernel, tokens);
        }
        // ===========================
        // Kernel delegation methods
        // ===========================
        parseElement(type, root = null) {
            return this.#kernel.parseElement(type, this, root);
        }
        requireElement(type, message, root) {
            return this.#kernel.requireElement(type, this, message, root);
        }
        parseAnyOf(types) {
            return this.#kernel.parseAnyOf(types, this);
        }
        raiseError(message, expected) {
            message = message || "Unexpected Token : " + this.currentToken().value;
            var parseError = new ParseError(message, this.currentToken(), this.source, expected);
            throw new ParseRecoverySentinel(parseError);
        }
        raiseExpected(...expected) {
            var msg = expected.length === 1 ? "Expected '" + expected[0] + "' but found '" + this.currentToken().value + "'" : "Expected one of: " + expected.map((e)=>"'" + e + "'").join(", ");
            this.raiseError(msg, expected);
        }
        // ===========================
        // Parser-owned methods
        // ===========================
        parseStringTemplate() {
            var returnArr = [
                ""
            ];
            do {
                returnArr.push(this.lastWhitespace());
                if (this.currentToken().value === "$") {
                    this.consumeToken();
                    var startingBrace = this.matchOpToken("{");
                    returnArr.push(this.requireElement("expression"));
                    if (startingBrace) this.requireOpToken("}");
                    returnArr.push("");
                } else if (this.currentToken().value === "\\") {
                    this.consumeToken();
                    this.consumeToken();
                } else {
                    var token = this.consumeToken();
                    returnArr[returnArr.length - 1] += token ? token.value : "";
                }
            }while (this.hasMore());
            returnArr.push(this.lastWhitespace());
            return returnArr;
        }
        commandBoundary(token) {
            if (token.value == "end" || token.value == "then" || token.value == "else" || token.value == "otherwise" || token.value == ")" || this.commandStart(token) || this.featureStart(token) || token.type == "EOF") return true;
            return false;
        }
        commandStart(token) {
            return this.#kernel.commandStart(token);
        }
        featureStart(token) {
            return this.#kernel.featureStart(token);
        }
        setParent(elt, parent) {
            if (typeof elt === "object") {
                elt.parent = parent;
                if (typeof parent === "object") {
                    parent.children = parent.children || /* @__PURE__ */ new Set();
                    parent.children.add(elt);
                }
                this.setParent(elt.next, parent);
            }
        }
        parseURLOrExpression() {
            var cur = this.currentToken();
            if (cur.value === "/" && cur.type === "DIVIDE") {
                var tokens = this.consumeUntilWhitespace();
                this.matchTokenType("WHITESPACE");
                return new NakedString(tokens);
            }
            if (cur.type === "IDENTIFIER" && (cur.value === "http" || cur.value === "https" || cur.value === "ws" || cur.value === "wss")) {
                var tokens = this.consumeUntilWhitespace();
                this.matchTokenType("WHITESPACE");
                return new NakedString(tokens);
            }
            return this.requireElement("expression");
        }
        ensureTerminated(commandList) {
            var implicitReturn = new ImplicitReturn();
            var end = commandList;
            while(end.next)end = end.next;
            end.next = implicitReturn;
        }
    };
    // src/core/kernel.js
    var LanguageKernel = class {
        #grammar = {};
        #commands = {};
        #features = {};
        #leafExpressions = [];
        #indirectExpressions = [];
        #postfixExpressions = [];
        #unaryExpressions = [];
        #topExpressions = [];
        #assignableExpressions = [];
        constructor(){
            this.addGrammarElement("hyperscript", this.parseHyperscriptProgram.bind(this));
            this.addGrammarElement("feature", this.parseFeature.bind(this));
            this.addGrammarElement("commandList", this.parseCommandList.bind(this));
            this.addGrammarElement("command", this.parseCommand.bind(this));
            this.addGrammarElement("indirectStatement", this.parseIndirectStatement.bind(this));
            this.addGrammarElement("expression", this.parseExpression.bind(this));
            this.addGrammarElement("assignableExpression", this.parseAssignableExpression.bind(this));
            this.addGrammarElement("unaryExpression", this.parseUnaryExpression.bind(this));
            this.addGrammarElement("postfixExpression", this.parsePostfixExpression.bind(this));
            this.addGrammarElement("primaryExpression", this.parsePrimaryExpression.bind(this));
            this.addGrammarElement("indirectExpression", this.parseIndirectExpression.bind(this));
            this.addGrammarElement("leaf", this.parseLeaf.bind(this));
        }
        parseFeature(parser) {
            if (parser.matchOpToken("(")) {
                var featureElement = parser.requireElement("feature");
                parser.requireOpToken(")");
                return featureElement;
            }
            var featureDefinition = this.#features[parser.currentToken().value || ""];
            if (featureDefinition) return featureDefinition(parser);
        }
        parseCommand(parser) {
            if (parser.matchOpToken("(")) {
                const commandElement2 = parser.requireElement("command");
                parser.requireOpToken(")");
                return commandElement2;
            }
            var commandDefinition = this.#commands[parser.currentToken().value || ""];
            let commandElement;
            if (commandDefinition) commandElement = commandDefinition(parser);
            else if (parser.currentToken().type === "IDENTIFIER") commandElement = parser.parseElement("pseudoCommand");
            if (commandElement) return this.parseElement("indirectStatement", parser, commandElement);
            return commandElement;
        }
        parseCommandList(parser) {
            if (parser.hasMore()) {
                var keyword = parser.currentToken().value;
                var cmd;
                try {
                    cmd = parser.parseElement("command");
                } catch (e) {
                    if (e instanceof ParseRecoverySentinel) {
                        cmd = new FailedCommand(e.parseError, keyword);
                        this.#syncToCommand(parser);
                    } else throw e;
                }
                if (cmd) {
                    parser.matchToken("then");
                    const next = parser.parseElement("commandList");
                    if (next) cmd.next = next;
                    return cmd;
                }
            }
            return new EmptyCommandListCommand();
        }
        parseLeaf(parser) {
            var result = parser.parseAnyOf(this.#leafExpressions);
            if (result == null) return parser.parseElement("symbol");
            return result;
        }
        parseIndirectExpression(parser, root) {
            for(var i = 0; i < this.#indirectExpressions.length; i++){
                var indirect = this.#indirectExpressions[i];
                root.endToken = parser.lastMatch();
                var result = this.parseElement(indirect, parser, root);
                if (result) return result;
            }
            return root;
        }
        parsePostfixExpression(parser) {
            var root = parser.parseElement("negativeNumber");
            for(var i = 0; i < this.#postfixExpressions.length; i++){
                var postfixType = this.#postfixExpressions[i];
                var result = this.parseElement(postfixType, parser, root);
                if (result) return result;
            }
            return root;
        }
        parseUnaryExpression(parser) {
            parser.matchToken("the");
            var result = parser.parseAnyOf(this.#unaryExpressions);
            if (result) return this.parseElement("indirectExpression", parser, result);
            return parser.parseElement("postfixExpression");
        }
        parseExpression(parser) {
            parser.matchToken("the");
            return parser.parseAnyOf(this.#topExpressions);
        }
        parseAssignableExpression(parser) {
            parser.matchToken("the");
            var expr = parser.parseElement("primaryExpression");
            var checkExpr = expr;
            while(checkExpr && checkExpr.type === "parenthesized")checkExpr = checkExpr.expr;
            if (checkExpr && this.#assignableExpressions.includes(checkExpr.type)) return expr;
            else parser.raiseError("A target expression must be writable.  The expression type '" + (checkExpr && checkExpr.type) + "' is not.");
        }
        parseIndirectStatement(parser, root) {
            if (parser.matchToken("unless")) {
                root.endToken = parser.lastMatch();
                var conditional = parser.requireElement("expression");
                var unless = new UnlessStatementModifier(root, conditional);
                root.parent = unless;
                return unless;
            }
            return root;
        }
        parsePrimaryExpression(parser) {
            var leaf = parser.parseElement("leaf");
            if (leaf) return this.parseElement("indirectExpression", parser, leaf);
            parser.raiseError("Unexpected value: " + parser.currentToken().value);
        }
        parseHyperscriptProgram(parser) {
            var features = [];
            if (parser.hasMore()) while(parser.currentToken().type !== "EOF"){
                var keyword = parser.currentToken().value;
                if (parser.featureStart(parser.currentToken()) || parser.currentToken().value === "(") try {
                    var feature = parser.requireElement("feature");
                    features.push(feature);
                    parser.matchToken("end");
                } catch (e) {
                    if (e instanceof ParseRecoverySentinel) {
                        features.push(new FailedFeature(e.parseError, keyword));
                        this.#syncToFeature(parser);
                    } else throw e;
                }
                else if (parser.currentToken().value === "end") break;
                else try {
                    parser.raiseError();
                } catch (e) {
                    if (e instanceof ParseRecoverySentinel) {
                        features.push(new FailedFeature(e.parseError, keyword));
                        this.#syncToFeature(parser);
                    } else throw e;
                }
            }
            return new HyperscriptProgram(features);
        }
        use(plugin) {
            plugin(this);
            return this;
        }
        initElt(parseElement, start, tokens) {
            parseElement.startToken = start;
            parseElement.programSource = tokens.source;
        }
        parseElement(type, parser, root) {
            var elementDefinition = this.#grammar[type];
            if (elementDefinition) {
                var tokens = parser.tokens;
                var start = tokens.currentToken();
                var parseElement = elementDefinition(parser, root);
                if (parseElement) {
                    this.initElt(parseElement, start, tokens);
                    parseElement.endToken = parseElement.endToken || tokens.lastMatch();
                    var root = parseElement.root;
                    while(root != null){
                        this.initElt(root, start, tokens);
                        root = root.root;
                    }
                }
                return parseElement;
            }
        }
        requireElement(type, parser, message, root) {
            var result = this.parseElement(type, parser, root);
            if (!result) parser.raiseError(message || "Expected " + type);
            return result;
        }
        parseAnyOf(types, parser) {
            for(var i = 0; i < types.length; i++){
                var type = types[i];
                var expression = this.parseElement(type, parser);
                if (expression) return expression;
            }
        }
        addGrammarElement(name, definition) {
            if (this.#grammar[name]) throw new Error(`Grammar element '${name}' already exists`);
            this.#grammar[name] = definition;
        }
        addCommand(keyword, definition) {
            var commandGrammarType = keyword + "Command";
            this.#grammar[commandGrammarType] = definition;
            this.#commands[keyword] = definition;
        }
        addCommands(...commandClasses) {
            for (const CommandClass of commandClasses){
                if (!CommandClass.keyword) throw new Error(`Command class ${CommandClass.name} must have a static 'keyword' property`);
                if (!CommandClass.parse) throw new Error(`Command class ${CommandClass.name} must have a static 'parse' method`);
                var keywords = Array.isArray(CommandClass.keyword) ? CommandClass.keyword : [
                    CommandClass.keyword
                ];
                for (var kw of keywords)this.addCommand(kw, CommandClass.parse);
            }
        }
        addFeatures(...featureClasses) {
            for (const FeatureClass of featureClasses){
                if (!FeatureClass.keyword) throw new Error(`Feature class ${FeatureClass.name} must have a static 'keyword' property`);
                if (!FeatureClass.parse) throw new Error(`Feature class ${FeatureClass.name} must have a static 'parse' method`);
                this.addFeature(FeatureClass.keyword, FeatureClass.parse);
            }
        }
        addFeature(keyword, definition) {
            var featureGrammarType = keyword + "Feature";
            this.#grammar[featureGrammarType] = definition;
            this.#features[keyword] = definition;
        }
        /**
     * Register a parse element class based on its static metadata.
     * Commands need `static keyword`, expressions need `static grammarName`.
     */ registerParseElement(ElementClass) {
            if (!ElementClass.parse) return;
            const parse = ElementClass.parse.bind(ElementClass);
            if (ElementClass.keyword && ElementClass.prototype instanceof Command) {
                var keywords = Array.isArray(ElementClass.keyword) ? ElementClass.keyword : [
                    ElementClass.keyword
                ];
                for (var kw of keywords)this.addCommand(kw, parse);
                return;
            }
            if (ElementClass.keyword && ElementClass.prototype instanceof Feature) {
                var keywords = Array.isArray(ElementClass.keyword) ? ElementClass.keyword : [
                    ElementClass.keyword
                ];
                for (var kw of keywords)this.addFeature(kw, parse);
                return;
            }
            const name = ElementClass.grammarName;
            if (!name) return;
            switch(ElementClass.expressionType){
                case "leaf":
                    this.addLeafExpression(name, parse);
                    break;
                case "indirect":
                    this.addIndirectExpression(name, parse);
                    break;
                case "unary":
                    this.addUnaryExpression(name, parse);
                    break;
                case "top":
                    this.addTopExpression(name, parse);
                    break;
                case "postfix":
                    this.addPostfixExpression(name, parse);
                    break;
                default:
                    this.addGrammarElement(name, parse);
                    break;
            }
            if (ElementClass.assignable) this.#assignableExpressions.push(name);
        }
        /**
     * Register all exported parse element classes from a module.
     * Iterates over module exports and registers any class with
     * a static `parse` method and appropriate metadata.
     */ registerModule(module) {
            for (const exported of Object.values(module))if (typeof exported === "function" && exported.parse) this.registerParseElement(exported);
        }
        addLeafExpression(name, definition) {
            this.#leafExpressions.push(name);
            this.addGrammarElement(name, definition);
        }
        addIndirectExpression(name, definition) {
            this.#indirectExpressions.push(name);
            this.addGrammarElement(name, definition);
        }
        addPostfixExpression(name, definition) {
            this.#postfixExpressions.push(name);
            this.addGrammarElement(name, definition);
        }
        addUnaryExpression(name, definition) {
            this.#unaryExpressions.push(name);
            this.addGrammarElement(name, definition);
        }
        addTopExpression(name, definition) {
            this.#topExpressions.push(name);
            this.addGrammarElement(name, definition);
        }
        commandStart(token) {
            return this.#commands[token.value || ""];
        }
        featureStart(token) {
            return this.#features[token.value || ""];
        }
        parseHyperScript(tokens) {
            var parser = new Parser(this, tokens);
            var result;
            var lastError = null;
            try {
                result = parser.parseElement("hyperscript");
                if (tokens.hasMore()) parser.raiseError();
            } catch (e) {
                if (!(e instanceof ParseRecoverySentinel)) throw e;
                lastError = e.parseError;
            }
            if (!result) result = new HyperscriptProgram([]);
            result.errors = result.collectErrors();
            if (lastError) result.errors.push(lastError);
            return result;
        }
        #syncToFeature(parser) {
            parser.tokens.clearFollows();
            while(parser.hasMore() && !parser.featureStart(parser.currentToken()) && parser.currentToken().value !== "end" && parser.currentToken().type !== "EOF")parser.tokens.consumeToken();
        }
        #syncToCommand(parser) {
            parser.tokens.clearFollows();
            while(parser.hasMore() && !parser.commandBoundary(parser.currentToken()))parser.tokens.consumeToken();
            if (parser.hasMore() && parser.currentToken().value === "then") parser.tokens.consumeToken();
        }
        parse(tokenizer2, src) {
            var tokens = tokenizer2.tokenize(src);
            var parser = new Parser(this, tokens);
            var result, lastError;
            try {
                if (parser.commandStart(tokens.currentToken())) {
                    result = this.requireElement("commandList", parser);
                    if (tokens.hasMore()) parser.raiseError();
                    parser.ensureTerminated(result);
                } else if (parser.featureStart(tokens.currentToken())) {
                    result = this.requireElement("hyperscript", parser);
                    if (tokens.hasMore()) parser.raiseError();
                } else {
                    result = this.requireElement("expression", parser);
                    if (tokens.hasMore()) parser.raiseError();
                }
            } catch (e) {
                if (!(e instanceof ParseRecoverySentinel)) throw e;
                lastError = e.parseError;
            }
            if (!result && lastError) result = {
                type: "empty",
                errors: [
                    lastError
                ]
            };
            else if (result) {
                result.errors = result.collectErrors();
                if (lastError) result.errors.push(lastError);
            }
            return result;
        }
    };
    // src/core/config.js
    var config = {
        attributes: "_, script, data-script",
        defaultTransition: "all 500ms ease-in",
        disableSelector: "[disable-scripting], [data-disable-scripting]",
        fetchThrowsOn: [
            /^4/,
            /^5/
        ],
        hideShowStrategies: {},
        logAll: false,
        mutatingMethods: {
            Array: [
                "push",
                "pop",
                "shift",
                "unshift",
                "splice",
                "sort",
                "reverse",
                "fill",
                "copyWithin"
            ],
            Set: [
                "add",
                "delete",
                "clear"
            ],
            Map: [
                "set",
                "delete",
                "clear"
            ]
        }
    };
    // src/core/runtime/conversions.js
    var HyperscriptFormData = class {
        result = {};
        addElement(node) {
            if (node.name == void 0 || node.value == void 0) return;
            if (node.type === "radio" && !node.checked) return;
            var name = node.name;
            var value;
            if (node.type === "checkbox") value = node.checked ? [
                node.value
            ] : void 0;
            else if (node.type === "select-multiple") value = Array.from(node.options).filter((o)=>o.selected).map((o)=>o.value);
            else value = node.value;
            if (value == void 0) return;
            if (this.result[name] == void 0) this.result[name] = value;
            else {
                var existing = Array.isArray(this.result[name]) ? this.result[name] : [
                    this.result[name]
                ];
                this.result[name] = existing.concat(value);
            }
        }
        addContainer(node) {
            if (node.name != void 0 && node.value != void 0) {
                this.addElement(node);
                return;
            }
            if (node.querySelectorAll) node.querySelectorAll("input,select,textarea").forEach((child)=>this.addElement(child));
        }
    };
    function _toHTML(value) {
        if (value instanceof Array) return value.map((item)=>_toHTML(item)).join("");
        if (value instanceof HTMLElement) return value.outerHTML;
        if (value instanceof NodeList) {
            var result = "";
            for(var i = 0; i < value.length; i++)if (value[i] instanceof HTMLElement) result += value[i].outerHTML;
            return result;
        }
        if (value.toString) return value.toString();
        return "";
    }
    var conversions = {
        dynamicResolvers: [
            // Fixed-point number conversion
            function(str, value) {
                if (str === "Fixed") return Number(value).toFixed();
                else if (str.startsWith("Fixed:")) {
                    let num = str.split(":")[1];
                    return Number(value).toFixed(parseInt(num));
                }
            },
            // Values conversion - extracts form values from DOM nodes
            function(str, node, runtime2) {
                if (str !== "Values") return;
                var formData = new HyperscriptFormData();
                runtime2.implicitLoop(node, (node2)=>formData.addContainer(node2));
                return formData.result;
            }
        ],
        String: function(val) {
            if (val.toString) return val.toString();
            else return "" + val;
        },
        Int: function(val) {
            return parseInt(val);
        },
        Float: function(val) {
            return parseFloat(val);
        },
        Number: function(val) {
            return Number(val);
        },
        Boolean: function(val) {
            return !!val;
        },
        Date: function(val) {
            return new Date(val);
        },
        Array: function(val) {
            return Array.from(val);
        },
        JSON: function(val) {
            if (typeof Response !== "undefined" && val instanceof Response) return val.json();
            return JSON.parse(val);
        },
        JSONString: function(val) {
            return JSON.stringify(val);
        },
        Object: function(val) {
            if (val instanceof String) val = val.toString();
            if (typeof val === "string") return JSON.parse(val);
            else return Object.assign({}, val);
        },
        FormEncoded: function(val) {
            return new URLSearchParams(val).toString();
        },
        Set: function(val) {
            return new Set(val);
        },
        Map: function(val) {
            return new Map(Object.entries(val));
        },
        Keys: function(val) {
            if (val instanceof Map) return Array.from(val.keys());
            return Object.keys(val);
        },
        Entries: function(val) {
            if (val instanceof Map) return Array.from(val.entries());
            return Object.entries(val);
        },
        Reversed: function(val) {
            return Array.from(val).reverse();
        },
        Unique: function(val) {
            return [
                ...new Set(val)
            ];
        },
        Flat: function(val) {
            return Array.from(val).flat();
        },
        HTML: _toHTML,
        Stream: function() {
            throw new Error("The Stream conversion requires the SSE extension. Include dist/ext/sse.js or dist/ext/sse.esm.js after hyperscript.");
        },
        Fragment: function(val, runtime2) {
            var frag = document.createDocumentFragment();
            runtime2.implicitLoop(val, (val2)=>{
                if (val2 instanceof Node) frag.append(val2);
                else {
                    var temp = document.createElement("template");
                    temp.innerHTML = val2;
                    frag.append(temp.content);
                }
            });
            return frag;
        }
    };
    // src/core/runtime/cookies.js
    var CookieJar = class {
        #parseCookies() {
            if (!document.cookie) return [];
            return document.cookie.split("; ").map((entry)=>{
                var eq = entry.indexOf("=");
                return {
                    name: entry.slice(0, eq),
                    value: decodeURIComponent(entry.slice(eq + 1))
                };
            });
        }
        get(target, prop) {
            if (prop === "then") return null;
            else if (prop === "length") return this.#parseCookies().length;
            else if (prop === "clear") return (name)=>{
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            };
            else if (prop === "clearAll") return ()=>{
                for (const cookie of this.#parseCookies())document.cookie = cookie.name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            };
            else if (prop === Symbol.iterator) {
                var cookies2 = this.#parseCookies();
                return cookies2[Symbol.iterator].bind(cookies2);
            } else if (typeof prop === "string") {
                if (!isNaN(prop)) return this.#parseCookies()[parseInt(prop)];
                var match = this.#parseCookies().find((c)=>c.name === prop);
                return match ? match.value : void 0;
            }
        }
        set(target, prop, value) {
            var parts = [];
            if (typeof value === "string") {
                parts.push(encodeURIComponent(value));
                parts.push("samesite=lax");
            } else {
                parts.push(encodeURIComponent(value.value));
                if (value.expires) parts.push("expires=" + value.expires);
                if (value.maxAge) parts.push("max-age=" + value.maxAge);
                if (value.partitioned) parts.push("partitioned=" + value.partitioned);
                if (value.path) parts.push("path=" + value.path);
                if (value.samesite) parts.push("samesite=" + value.samesite);
                if (value.secure) parts.push("secure");
            }
            document.cookie = String(prop) + "=" + parts.join(";");
            return true;
        }
        proxy() {
            return new Proxy({}, this);
        }
    };
    // src/core/runtime/collections.js
    var SHOULD_AUTO_ITERATE_SYM = /* @__PURE__ */ Symbol();
    var ElementCollection = class {
        constructor(css, relativeToElement, escape, runtime2){
            this._css = css;
            this.relativeToElement = relativeToElement;
            this.escape = escape;
            this._runtime = runtime2;
            this[SHOULD_AUTO_ITERATE_SYM] = true;
        }
        get css() {
            if (this.escape) return this._runtime.escapeSelector(this._css);
            else return this._css;
        }
        get className() {
            return this._css.slice(1);
        }
        get id() {
            return this.className;
        }
        contains(elt) {
            for (let element of this){
                if (element.contains(elt)) return true;
            }
            return false;
        }
        get length() {
            return this.selectMatches().length;
        }
        [Symbol.iterator]() {
            let query = this.selectMatches();
            return query[Symbol.iterator]();
        }
        /** @returns {NodeList} all elements matching this.css under the root node */ selectMatches() {
            var root = this._runtime.getRootNode(this.relativeToElement);
            return this._runtime.resolveQuery(root, this.css);
        }
    };
    var TemplatedQueryElementCollection = class extends ElementCollection {
        constructor(css, relativeToElement, templateParts, runtime2){
            super(css, relativeToElement, false, runtime2);
            this.templateParts = templateParts;
            this.elements = templateParts.filter((elt)=>elt instanceof Element);
        }
        get css() {
            let rv = "", i = 0;
            for (const val of this.templateParts)if (val instanceof Element) rv += "[data-hs-query-id='" + i++ + "']";
            else rv += val;
            return rv;
        }
        [Symbol.iterator]() {
            this.elements.forEach((el, i)=>el.dataset.hsQueryId = i);
            const rv = super[Symbol.iterator]();
            this.elements.forEach((el)=>el.removeAttribute("data-hs-query-id"));
            return rv;
        }
    };
    var RegExpIterator = class {
        constructor(re, str){
            this.re = re;
            this.str = str;
        }
        next() {
            const match = this.re.exec(this.str);
            if (match === null) return {
                done: true
            };
            if (match[0].length === 0) this.re.lastIndex++;
            return {
                value: match
            };
        }
    };
    var RegExpIterable = class {
        constructor(re, flags, str){
            this.re = re;
            this.flags = flags;
            this.str = str;
        }
        [Symbol.iterator]() {
            return new RegExpIterator(new RegExp(this.re, this.flags), this.str);
        }
    };
    var HyperscriptModule = class extends EventTarget {
        constructor(mod){
            super();
            this.module = mod;
        }
        toString() {
            return this.module.id;
        }
    };
    // src/core/runtime/runtime.js
    var cookies = new CookieJar().proxy();
    var Context = class {
        constructor(owner, feature, hyperscriptTarget, event, runtime2, globalScope2, kernel2, tokenizer2){
            this.meta = {
                parser: kernel2,
                tokenizer: tokenizer2,
                runtime: runtime2,
                owner: owner,
                feature: feature,
                iterators: {},
                ctx: this
            };
            this.locals = {
                cookies: cookies
            };
            if (typeof navigator !== "undefined" && navigator.clipboard) Object.defineProperty(this.locals, "clipboard", {
                get () {
                    return navigator.clipboard.readText();
                },
                set (v) {
                    navigator.clipboard.writeText(String(v));
                },
                enumerable: false,
                configurable: true
            });
            if (typeof window !== "undefined" && window.getSelection) Object.defineProperty(this.locals, "selection", {
                get () {
                    return window.getSelection().toString();
                },
                enumerable: true,
                configurable: true
            });
            this.me = hyperscriptTarget;
            this.you = void 0;
            this.result = void 0;
            this.beingTested = null;
            this.event = event;
            this.target = event?.target ?? null;
            this.detail = event?.detail ?? null;
            this.sender = event?.detail?.sender ?? null;
            this.body = "document" in globalScope2 ? document.body : null;
            runtime2.addFeatures(owner, this);
        }
    };
    var Runtime = class _Runtime {
        static HALT = {};
        HALT = _Runtime.HALT;
        #kernel;
        #tokenizer;
        #globalScope;
        #reactivity;
        #morphEngine;
        #scriptAttrs = null;
        constructor(globalScope2, kernel2, tokenizer2, reactivity2, morphEngine2){
            this.#globalScope = globalScope2;
            this.#kernel = kernel2;
            this.#tokenizer = tokenizer2;
            this.#reactivity = reactivity2;
            this.#morphEngine = morphEngine2;
        }
        get globalScope() {
            return this.#globalScope;
        }
        get reactivity() {
            return this.#reactivity;
        }
        // =================================================================
        // Core execution engine
        // =================================================================
        unifiedExec(command, ctx) {
            while(true){
                try {
                    var next = this.unifiedEval(command, ctx);
                } catch (e) {
                    if (ctx.meta.handlingFinally) {
                        console.error(" Exception in finally block: ", e);
                        next = _Runtime.HALT;
                    } else {
                        this.registerHyperTrace(ctx, e);
                        if (ctx.meta.errorHandler && !ctx.meta.handlingError) {
                            ctx.meta.handlingError = true;
                            ctx.locals[ctx.meta.errorSymbol] = e;
                            command = ctx.meta.errorHandler;
                            continue;
                        } else {
                            ctx.meta.currentException = e;
                            next = _Runtime.HALT;
                        }
                    }
                }
                if (next == null) throw new Error("Command " + (command.type || "unknown") + " did not return a next element to execute");
                else if (next.then) {
                    next.then((resolvedNext)=>{
                        this.unifiedExec(resolvedNext, ctx);
                    }).catch((reason)=>{
                        this.unifiedExec({
                            resolve: function() {
                                throw reason;
                            }
                        }, ctx);
                    });
                    return;
                } else if (next === _Runtime.HALT) {
                    if (ctx.meta.finallyHandler && !ctx.meta.handlingFinally) {
                        ctx.meta.handlingFinally = true;
                        command = ctx.meta.finallyHandler;
                    } else {
                        if (ctx.meta.onHalt) ctx.meta.onHalt();
                        if (ctx.meta.currentException) {
                            if (ctx.meta.reject) {
                                ctx.meta.reject(ctx.meta.currentException);
                                return;
                            } else throw ctx.meta.currentException;
                        } else return;
                    }
                } else command = next;
            }
        }
        unifiedEval(parseElement, ctx) {
            var async = false;
            var evaluatedArgs = {};
            if (parseElement.args) for (var [name, argument] of Object.entries(parseElement.args)){
                if (argument == null) evaluatedArgs[name] = null;
                else if (Array.isArray(argument)) {
                    var arr = [];
                    for(var j = 0; j < argument.length; j++){
                        var element = argument[j];
                        if (element == null) arr.push(null);
                        else if (element.evaluate) {
                            var value = element.evaluate(ctx);
                            if (value && value.then) async = true;
                            arr.push(value);
                        } else arr.push(element);
                    }
                    evaluatedArgs[name] = arr;
                } else if (argument.evaluate) {
                    var value = argument.evaluate(ctx);
                    if (value && value.then) async = true;
                    evaluatedArgs[name] = value;
                } else evaluatedArgs[name] = argument;
            }
            if (async) return new Promise((resolve, reject)=>{
                var keys = Object.keys(evaluatedArgs);
                var values = Object.values(evaluatedArgs).map((v)=>Array.isArray(v) ? Promise.all(v) : v);
                Promise.all(values).then(function(resolved) {
                    try {
                        var finalArgs = {};
                        keys.forEach((k, i)=>finalArgs[k] = resolved[i]);
                        resolve(parseElement.resolve(ctx, finalArgs));
                    } catch (e) {
                        reject(e);
                    }
                }).catch(function(reason) {
                    reject(reason);
                });
            });
            else return parseElement.resolve(ctx, evaluatedArgs);
        }
        findNext(command, context) {
            if (command) {
                if (command.resolveNext) return command.resolveNext(context);
                else if (command.next) return command.next;
                else return this.findNext(command.parent, context);
            }
        }
        // =================================================================
        // Context and scope
        // =================================================================
        makeContext(owner, feature, hyperscriptTarget, event) {
            return new Context(owner, feature, hyperscriptTarget, event, this, this.#globalScope, this.#kernel, this.#tokenizer);
        }
        getHyperscriptFeatures(elt) {
            var data = this.getInternalData(elt);
            if (!data.features) data.features = {};
            return data.features;
        }
        addFeatures(owner, ctx) {
            if (owner) {
                Object.assign(ctx.locals, this.getHyperscriptFeatures(owner));
                this.addFeatures(owner.parentElement, ctx);
            }
        }
        // =================================================================
        // Symbol and property resolution
        // =================================================================
        #isReservedWord(str) {
            return [
                "meta",
                "it",
                "result",
                "locals",
                "event",
                "target",
                "detail",
                "sender",
                "body"
            ].includes(str);
        }
        #isHyperscriptContext(context) {
            return context instanceof Context;
        }
        resolveSymbol(str, context, type, targetElement) {
            if (str === "me" || str === "my" || str === "I") return context.me;
            if (str === "it" || str === "its") return context.beingTested ?? context.result;
            if (str === "result") return context.result;
            if (str === "you" || str === "your" || str === "yourself") return context.you;
            if (type === "global") {
                if (this.reactivity.isTracking) this.reactivity.trackGlobalSymbol(str);
                var val = this.#globalScope[str];
                this.#trackMutation(val);
                return val;
            }
            if (type === "element") {
                if (this.reactivity.isTracking) this.reactivity.trackElementSymbol(str, context.meta.owner);
                var val = this.#getElementScope(context)[str];
                this.#trackMutation(val);
                return val;
            }
            if (type === "inherited") {
                var inherited = this.#resolveInherited(str, context, targetElement);
                if (this.reactivity.isTracking) {
                    var trackElement = inherited.element || targetElement || context.meta?.owner;
                    if (trackElement) this.reactivity.trackElementSymbol(str, trackElement);
                }
                this.#trackMutation(inherited.value);
                return inherited.value;
            }
            if (context.meta?.context) {
                var fromMetaContext = context.meta.context[str];
                if (typeof fromMetaContext !== "undefined") return fromMetaContext;
                if (context.meta.context.detail) {
                    fromMetaContext = context.meta.context.detail[str];
                    if (typeof fromMetaContext !== "undefined") return fromMetaContext;
                }
            }
            var fromContext = this.#isHyperscriptContext(context) && !this.#isReservedWord(str) ? context.locals[str] : context[str];
            if (typeof fromContext !== "undefined") return fromContext;
            var elementScope = this.#getElementScope(context);
            fromContext = elementScope[str];
            if (typeof fromContext !== "undefined") {
                if (this.reactivity.isTracking) this.reactivity.trackElementSymbol(str, context.meta.owner);
                this.#trackMutation(fromContext);
                return fromContext;
            }
            if (this.reactivity.isTracking) this.reactivity.trackGlobalSymbol(str);
            var val = this.#globalScope[str];
            this.#trackMutation(val);
            return val;
        }
        setSymbol(str, context, type, value, targetElement) {
            if (type === "global") {
                this.#globalScope[str] = value;
                this.reactivity.notifyGlobalSymbol(str);
                return;
            }
            if (type === "element") {
                this.#getElementScope(context)[str] = value;
                this.reactivity.notifyElementSymbol(str, context.meta.owner);
                return;
            }
            if (type === "inherited") {
                var inherited = this.#resolveInherited(str, context, targetElement);
                if (inherited.element) {
                    this.getInternalData(inherited.element).elementScope[str] = value;
                    this.reactivity.notifyElementSymbol(str, inherited.element);
                } else {
                    var owner = targetElement || context.meta?.owner;
                    if (owner) {
                        var internalData = this.getInternalData(owner);
                        if (!internalData.elementScope) internalData.elementScope = {};
                        internalData.elementScope[str] = value;
                        this.reactivity.notifyElementSymbol(str, owner);
                    }
                }
                return;
            }
            if (this.#isHyperscriptContext(context) && !this.#isReservedWord(str) && typeof context.locals[str] !== "undefined") {
                context.locals[str] = value;
                return;
            }
            var elementScope = this.#getElementScope(context);
            if (typeof elementScope[str] !== "undefined") {
                elementScope[str] = value;
                this.reactivity.notifyElementSymbol(str, context.meta.owner);
            } else if (this.#isHyperscriptContext(context) && !this.#isReservedWord(str)) context.locals[str] = value;
            else context[str] = value;
        }
        getInternalData(elt) {
            if (!elt._hyperscript) elt._hyperscript = {};
            return elt._hyperscript;
        }
        #resolveInherited(str, context, startElement) {
            var elt = startElement || context.meta && context.meta.owner;
            while(elt){
                var internalData = elt._hyperscript;
                if (internalData && internalData.elementScope && str in internalData.elementScope) return {
                    value: internalData.elementScope[str],
                    element: elt
                };
                var domScope = elt.getAttribute && elt.getAttribute("dom-scope");
                if (domScope) {
                    if (domScope === "isolated") return {
                        value: void 0,
                        element: null
                    };
                    var match = domScope.match(/^closest\s+(.+)/);
                    if (match) {
                        elt = elt.parentElement && elt.parentElement.closest(match[1]);
                        continue;
                    }
                    match = domScope.match(/^parent\s+of\s+(.+)/);
                    if (match) {
                        var target = elt.closest(match[1]);
                        elt = target && target.parentElement;
                        continue;
                    }
                }
                elt = elt.parentElement;
            }
            return {
                value: void 0,
                element: null
            };
        }
        #getElementScope(context) {
            var elt = context.meta && context.meta.owner;
            if (elt) {
                var internalData = this.getInternalData(elt);
                var scopeName = "elementScope";
                if (context.meta.feature && context.meta.feature.behavior) scopeName = context.meta.feature.behavior + "Scope";
                var elementScope = internalData[scopeName];
                if (!elementScope) {
                    elementScope = {};
                    internalData[scopeName] = elementScope;
                }
                return elementScope;
            } else return {};
        }
        #flatGet(root, property, getter) {
            if (root != null) {
                var val = getter(root, property);
                if (typeof val !== "undefined") return val;
                if (this.shouldAutoIterate(root)) {
                    var result = [];
                    for (var component of root){
                        var componentValue = getter(component, property);
                        result.push(componentValue);
                    }
                    return result;
                }
            }
        }
        resolveProperty(root, property) {
            if (this.reactivity.isTracking) this.reactivity.trackProperty(root, property);
            return this.#flatGet(root, property, (root2, property2)=>root2[property2]);
        }
        /**
     * Set a property on an object and notify the reactivity system.
     * @param {Object} obj - DOM element or plain JS object
     * @param {string} property
     * @param {any} value
     */ setProperty(obj, property, value) {
            obj[property] = value;
            this.reactivity.notifyProperty(obj);
        }
        /**
     * Notify the reactivity system that an object was mutated in-place.
     * Call this after operations like push, splice, append, etc.
     * @param {Object} obj - The mutated object
     */ notifyMutation(obj) {
            this.reactivity.notifyProperty(obj);
        }
        morph(elt, content) {
            this.#morphEngine.morph(elt, content, {
                beforeNodeRemoved: (node)=>{
                    if (node.nodeType === 1) this.cleanup(node);
                },
                afterNodeAdded: (node)=>{
                    if (node.nodeType === 1) this.processNode(node);
                },
                afterNodeMorphed: (node)=>{
                    if (node.nodeType === 1) this.processNode(node);
                }
            });
        }
        replaceInDom(target, value) {
            this.implicitLoop(target, (elt)=>{
                var parent = elt.parentElement;
                if (value instanceof Node) elt.replaceWith(value.cloneNode(true));
                else elt.replaceWith(this.convertValue(value, "Fragment"));
                if (parent) this.processNode(parent);
            });
        }
        /**
     * Check if a method call is known to mutate its receiver, and notify if so.
     * @param {Object} target - The object the method was called on
     * @param {string} methodName - The method name
     */ maybeNotify(target, methodName) {
            if (target == null || typeof target !== "object") return;
            var typeName = target.constructor && target.constructor.name;
            var methods = typeName && config.mutatingMethods[typeName];
            if (methods && methods.includes(methodName)) this.notifyMutation(target);
        }
        #trackMutation(val) {
            if (this.reactivity.isTracking && val != null && typeof val === "object") this.reactivity.trackProperty(val, "__mutation__");
        }
        resolveQuery(root, css) {
            if (this.reactivity.isTracking) this.reactivity.trackQuery(root);
            return root.querySelectorAll(css);
        }
        resolveAttribute(root, property) {
            if (this.reactivity.isTracking) this.reactivity.trackAttribute(root, property);
            return this.#flatGet(root, property, (root2, property2)=>root2.getAttribute && root2.getAttribute(property2));
        }
        resolveStyle(root, property) {
            return this.#flatGet(root, property, (root2, property2)=>root2.style && root2.style[property2]);
        }
        resolveComputedStyle(root, property) {
            return this.#flatGet(root, property, (root2, property2)=>getComputedStyle(root2).getPropertyValue(property2));
        }
        assignToNamespace(elt, nameSpace, name, value) {
            let root;
            if (elt == null || typeof document !== "undefined" && elt === document.body) root = this.#globalScope;
            else root = this.getHyperscriptFeatures(elt);
            var propertyName;
            while((propertyName = nameSpace.shift()) !== void 0){
                var newRoot = root[propertyName];
                if (newRoot == null) {
                    newRoot = {};
                    root[propertyName] = newRoot;
                }
                root = newRoot;
            }
            root[name] = value;
        }
        // =================================================================
        // Collection and iteration utilities
        // =================================================================
        #isArrayLike(value) {
            return Array.isArray(value) || typeof NodeList !== "undefined" && (value instanceof NodeList || value instanceof HTMLCollection || value instanceof FileList);
        }
        #isIterable(value) {
            return typeof value === "object" && Symbol.iterator in value && typeof value[Symbol.iterator] === "function";
        }
        shouldAutoIterate(value) {
            return value != null && value[SHOULD_AUTO_ITERATE_SYM] || this.#isArrayLike(value);
        }
        forEach(value, func) {
            if (value == null) ;
            else if (this.#isIterable(value)) for (const nth of value)func(nth);
            else if (this.#isArrayLike(value)) for(var i = 0; i < value.length; i++)func(value[i]);
            else func(value);
        }
        implicitLoop(value, func) {
            if (this.shouldAutoIterate(value)) for (const x of value)func(x);
            else func(value);
        }
        /**
     * Iterate over targets with a when condition, applying forward or reverse per element.
     * Supports async conditions transparently -- returns a Promise if any condition is async.
     */ implicitLoopWhen(targets, whenExpr, context, forwardFn, reverseFn) {
            var elements = [];
            this.implicitLoop(targets, function(elt) {
                elements.push(elt);
            });
            var conditions = elements.map(function(elt) {
                context.beingTested = elt;
                return whenExpr.evaluate(context);
            });
            context.beingTested = null;
            var hasPromise = conditions.some(function(c) {
                return c && typeof c.then === "function";
            });
            if (hasPromise) return Promise.all(conditions).then((results)=>{
                context.result = this.#applyWhenResults(elements, results, forwardFn, reverseFn);
            });
            else context.result = this.#applyWhenResults(elements, conditions, forwardFn, reverseFn);
        }
        #applyWhenResults(elements, results, forwardFn, reverseFn) {
            var matched = [];
            for(var i = 0; i < elements.length; i++)if (results[i]) {
                forwardFn(elements[i]);
                matched.push(elements[i]);
            } else reverseFn(elements[i]);
            return matched;
        }
        // =================================================================
        // Type system
        // =================================================================
        convertValue(value, type) {
            var dynamicResolvers = conversions.dynamicResolvers;
            for(var i = 0; i < dynamicResolvers.length; i++){
                var dynamicResolver = dynamicResolvers[i];
                var converted = dynamicResolver(type, value, this);
                if (converted !== void 0) return converted;
            }
            if (value == null) return null;
            var converter = conversions[type];
            if (converter) return converter(value, this);
            throw new Error("Unknown conversion : " + type);
        }
        evaluateNoPromise(elt, ctx) {
            let result = elt.evaluate(ctx);
            if (result && typeof result.then === "function") throw new Error(elt.sourceFor() + " returned a Promise in a context that they are not allowed.");
            return result;
        }
        typeCheck(value, typeString, nullOk) {
            if (value == null && nullOk) return true;
            var typeName = Object.prototype.toString.call(value).slice(8, -1);
            if (typeName === typeString) return true;
            var ctor = typeof globalThis !== "undefined" && globalThis[typeString];
            return typeof ctor === "function" && value instanceof ctor;
        }
        nullCheck(value, elt) {
            if (value == null) throw new Error("'" + elt.sourceFor() + "' is null");
        }
        isEmpty(value) {
            return value == void 0 || value.length === 0;
        }
        doesExist(value) {
            if (value == null) return false;
            if (this.shouldAutoIterate(value)) {
                for (const elt of value)return true;
                return false;
            }
            return true;
        }
        // =================================================================
        // DOM operations
        // =================================================================
        matchesSelector(elt, selector) {
            return elt.matches && elt.matches(selector);
        }
        makeEvent(eventName, detail) {
            var evt = new Event(eventName, {
                bubbles: true,
                cancelable: true,
                composed: true
            });
            evt["detail"] = detail;
            return evt;
        }
        triggerEvent(elt, eventName, detail, sender) {
            detail = detail || {};
            detail["sender"] = sender;
            var event = this.makeEvent(eventName, detail);
            if (config.logAll) console.log(eventName, detail, elt);
            var eventResult = elt.dispatchEvent(event);
            return eventResult;
        }
        getRootNode(node) {
            if (node && node instanceof Node) {
                var rv = node.getRootNode();
                if (rv instanceof Document || rv instanceof ShadowRoot) return rv;
            }
            return document;
        }
        escapeSelector(str) {
            return str.replace(/[:&()\[\]\/]/g, function(str2) {
                return "\\" + str2;
            });
        }
        getEventQueueFor(elt, onFeature) {
            let internalData = this.getInternalData(elt);
            var eventQueuesForElt = internalData.eventQueues;
            if (eventQueuesForElt == null) {
                eventQueuesForElt = /* @__PURE__ */ new Map();
                internalData.eventQueues = eventQueuesForElt;
            }
            var eventQueueForFeature = eventQueuesForElt.get(onFeature);
            if (eventQueueForFeature == null) {
                eventQueueForFeature = {
                    queue: [],
                    executing: false
                };
                eventQueuesForElt.set(onFeature, eventQueueForFeature);
            }
            return eventQueueForFeature;
        }
        // =================================================================
        // DOM initialization
        // =================================================================
        #getScriptAttributes() {
            if (this.#scriptAttrs == null) this.#scriptAttrs = config.attributes.replaceAll(" ", "").split(",");
            return this.#scriptAttrs;
        }
        #getScript(elt) {
            var attrs = this.#getScriptAttributes();
            for(var i = 0; i < attrs.length; i++){
                var scriptAttribute = attrs[i];
                if (elt.hasAttribute && elt.hasAttribute(scriptAttribute)) return elt.getAttribute(scriptAttribute);
            }
            if (elt instanceof HTMLScriptElement && elt.type === "text/hyperscript") return elt.innerText;
            return null;
        }
        #scriptSelector;
        #getScriptSelector() {
            if (!this.#scriptSelector) this.#scriptSelector = this.#getScriptAttributes().map((a)=>"[" + a + "]").join(", ");
            return this.#scriptSelector;
        }
        #hashScript(str) {
            var hash = 5381;
            for(var i = 0; i < str.length; i++)hash = (hash << 5) + hash + str.charCodeAt(i);
            return hash;
        }
        cleanup(elt) {
            if (!elt._hyperscript) return;
            this.triggerEvent(elt, "hyperscript:before:cleanup");
            var data = elt._hyperscript;
            if (data.listeners) for (var info of data.listeners)info.target.removeEventListener(info.event, info.handler);
            if (data.observers) for (var observer of data.observers)observer.disconnect();
            if (data.eventState) {
                for (var state of data.eventState.values())if (state.debounced) clearTimeout(state.debounced);
            }
            this.reactivity.stopElementEffects(elt);
            if (elt.querySelectorAll) for (var child of elt.querySelectorAll("[data-hyperscript-powered]"))this.cleanup(child);
            this.triggerEvent(elt, "hyperscript:after:cleanup");
            elt.removeAttribute("data-hyperscript-powered");
            delete elt._hyperscript;
        }
        #initElement(elt, target) {
            if (elt.closest && elt.closest(config.disableSelector)) return;
            var internalData = this.getInternalData(elt);
            var src = this.#getScript(elt);
            if (!src) return;
            var hash = this.#hashScript(src);
            if (internalData.initialized) {
                if (internalData.scriptHash === hash) {
                    this.#resolveTemplateScopes(elt);
                    return;
                }
                this.cleanup(elt);
                internalData = this.getInternalData(elt);
            }
            if (!this.triggerEvent(elt, "hyperscript:before:init")) return;
            internalData.initialized = true;
            internalData.scriptHash = hash;
            try {
                var tokens = this.#tokenizer.tokenize(src);
                var hyperScript = this.#kernel.parseHyperScript(tokens);
                if (!hyperScript) return;
                if (hyperScript.errors?.length) {
                    this.triggerEvent(elt, "hyperscript:parse-error", {
                        errors: hyperScript.errors
                    });
                    console.error("hyperscript: " + hyperScript.errors.length + " parse error(s) on:", elt, "\n\n" + Parser.formatErrors(hyperScript.errors));
                    return;
                }
                this.#resolveTemplateScopes(elt);
                hyperScript.apply(target || elt, elt, null, this);
                elt.setAttribute("data-hyperscript-powered", "true");
                this.triggerEvent(elt, "hyperscript:after:init");
                setTimeout(()=>{
                    this.triggerEvent(target || elt, "load", {
                        hyperscript: true
                    });
                }, 1);
            } catch (e) {
                this.triggerEvent(elt, "exception", {
                    error: e
                });
                console.error("hyperscript errors were found on the following element:", elt, "\n\n", e.message, e.stack);
            }
        }
        #resolveTemplateScopes(elt) {
            var root = elt.closest('[data-live-template], [dom-scope="isolated"]');
            if (!root || !root.__hs_scopes) return;
            var matches = [];
            var node = elt;
            while(node && node !== root){
                var prev = node.previousSibling;
                while(prev){
                    if (prev.nodeType === 8) {
                        var text = prev.data;
                        if (text.startsWith("hs-scope:")) {
                            matches.push(text);
                            break;
                        }
                    }
                    prev = prev.previousSibling;
                }
                node = node.parentElement;
            }
            if (!matches.length) return;
            var internalData = this.getInternalData(elt);
            if (!internalData.elementScope) internalData.elementScope = {};
            for(var i = 0; i < matches.length; i++){
                var parts = matches[i].split(":");
                var loopId = parts[1];
                var iter = parseInt(parts[2]);
                var scope = root.__hs_scopes[loopId];
                if (!scope) continue;
                internalData.elementScope[scope.identifier] = scope.source[iter];
                if (scope.indexIdentifier) internalData.elementScope[scope.indexIdentifier] = iter;
            }
        }
        #beforeProcessHooks = [];
        #afterProcessHooks = [];
        addBeforeProcessHook(fn) {
            this.#beforeProcessHooks.push(fn);
        }
        addAfterProcessHook(fn) {
            this.#afterProcessHooks.push(fn);
        }
        processNode(elt) {
            for (var fn of this.#beforeProcessHooks)fn(elt);
            var selector = this.#getScriptSelector();
            if (this.matchesSelector(elt, selector)) this.#initElement(elt, elt);
            if (elt instanceof HTMLScriptElement && elt.type === "text/hyperscript") this.#initElement(elt, document.body);
            if (elt.querySelectorAll) this.forEach(elt.querySelectorAll(selector + ", [type='text/hyperscript']"), (elt2)=>{
                this.#initElement(elt2, elt2 instanceof HTMLScriptElement && elt2.type === "text/hyperscript" ? document.body : elt2);
            });
            for (var fn of this.#afterProcessHooks)fn(elt);
        }
        // =================================================================
        // Debug and tracing
        // =================================================================
        getHyperTrace(ctx, thrown) {
            var trace = [];
            var root = ctx;
            while(root.meta.caller)root = root.meta.caller;
            if (root.meta.traceMap) return root.meta.traceMap.get(thrown, trace);
        }
        registerHyperTrace(ctx, thrown) {
            var trace = [];
            var root = null;
            while(ctx != null){
                trace.push(ctx);
                root = ctx;
                ctx = ctx.meta.caller;
            }
            if (root.meta.traceMap == null) root.meta.traceMap = /* @__PURE__ */ new Map();
            if (!root.meta.traceMap.get(thrown)) {
                var traceEntry = {
                    trace: trace,
                    print: function(logger) {
                        logger = logger || console.error;
                        logger("hypertrace /// ");
                        var maxLen = 0;
                        for(var i = 0; i < trace.length; i++)maxLen = Math.max(maxLen, trace[i].meta.feature.displayName.length);
                        for(var i = 0; i < trace.length; i++){
                            var traceElt = trace[i];
                            logger("  ->", traceElt.meta.feature.displayName.padEnd(maxLen + 2), "-", traceElt.meta.owner);
                        }
                    }
                };
                root.meta.traceMap.set(thrown, traceEntry);
            }
        }
        beepValueToConsole(element, expression, value) {
            if (this.triggerEvent(element, "hyperscript:beep", {
                element: element,
                expression: expression,
                value: value
            })) {
                var typeName = !value ? "object (null)" : value instanceof ElementCollection ? "ElementCollection" : value.constructor?.name || "unknown";
                var logValue = typeName === "String" ? '"' + value + '"' : value instanceof ElementCollection ? Array.from(value) : value;
                console.log("///_ BEEP! The expression (" + expression.sourceFor().replace("beep! ", "") + ") evaluates to:", logValue, "of type " + typeName);
            }
        }
    };
    // src/core/runtime/reactivity.js
    function _sameValue(a, b) {
        return a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;
    }
    var Effect = class {
        /**
     * @param {() => any} expression - The watched expression
     * @param {(v: any) => void} handler - Called when value changes
     * @param {Element|null} element - Owner element; auto-stops when disconnected
     * @param {Reactivity} reactivity - The owning reactivity system
     */ constructor(expression, handler, element, reactivity2){
            this.expression = expression;
            this.handler = handler;
            this.element = element;
            this._reactivity = reactivity2;
            this.dependencies = /* @__PURE__ */ new Map();
            this._lastValue = void 0;
            this._isStopped = false;
            this._consecutiveTriggers = 0;
        }
        /**
     * First evaluation: track deps, subscribe, call handler if non-null.
     * Both undefined and null are treated as "no value yet" to support
     * left-side-wins initialization in bind.
     */ initialize() {
            var reactivity2 = this._reactivity;
            var prev = reactivity2._currentEffect;
            reactivity2._currentEffect = this;
            try {
                this._lastValue = this.expression();
            } catch (e) {
                console.error("Error in reactive expression:", e);
            }
            reactivity2._currentEffect = prev;
            reactivity2._subscribeEffect(this);
            if (this._lastValue != null) try {
                this.handler(this._lastValue);
            } catch (e) {
                console.error("Error in reactive handler:", e);
            }
        }
        /**
     * Re-evaluate expression with dependency tracking, compare with last
     * value, and call handler if changed. Returns false if circular
     * guard tripped (caller should skip this effect).
     * @returns {boolean} Whether the effect ran successfully
     */ run() {
            this._consecutiveTriggers++;
            if (this._consecutiveTriggers > 100) {
                console.error("Reactivity loop detected: an effect triggered 100 consecutive times without settling. This usually means an effect is modifying a variable it also depends on.", this.element || this);
                return false;
            }
            var reactivity2 = this._reactivity;
            reactivity2._unsubscribeEffect(this);
            var oldDeps = this.dependencies;
            this.dependencies = /* @__PURE__ */ new Map();
            var prev = reactivity2._currentEffect;
            reactivity2._currentEffect = this;
            var newValue;
            try {
                newValue = this.expression();
            } catch (e) {
                console.error("Error in reactive expression:", e);
                this.dependencies = oldDeps;
                reactivity2._currentEffect = prev;
                reactivity2._subscribeEffect(this);
                return true;
            }
            reactivity2._currentEffect = prev;
            reactivity2._subscribeEffect(this);
            reactivity2._cleanupOrphanedDeps(oldDeps);
            if (!_sameValue(newValue, this._lastValue)) {
                this._lastValue = newValue;
                try {
                    this.handler(newValue);
                } catch (e) {
                    console.error("Error in reactive handler:", e);
                }
            }
            return true;
        }
        /** Reset circular guard after cascade settles. */ resetTriggerCount() {
            this._consecutiveTriggers = 0;
        }
        /** Stop this effect and clean up all subscriptions. */ stop() {
            if (this._isStopped) return;
            this._isStopped = true;
            this._reactivity._unsubscribeEffect(this);
            this._reactivity._cleanupOrphanedDeps(this.dependencies);
            this._reactivity._pendingEffects.delete(this);
        }
    };
    var Reactivity = class {
        constructor(){
            this._objectState = /* @__PURE__ */ new WeakMap();
            this._globalSymbolSubscriptions = /* @__PURE__ */ new Map();
            this._attributeSubscriptions = /* @__PURE__ */ new Map();
            this._propertySubscriptions = /* @__PURE__ */ new Map();
            this._querySubscriptions = /* @__PURE__ */ new Map();
            this._nextId = 0;
            this._currentEffect = null;
            this._pendingEffects = /* @__PURE__ */ new Set();
            this._isRunScheduled = false;
        }
        /**
     * Get or create the reactive state object for any object.
     * Assigns a stable unique ID on first access.
     * @param {Object} obj - DOM element or plain JS object
     * @returns {{ id: string, subscriptions: Map|null }}
     */ _getObjectState(obj) {
            var state = this._objectState.get(obj);
            if (!state) this._objectState.set(obj, state = {
                id: String(++this._nextId),
                subscriptions: null
            });
            return state;
        }
        /**
     * Whether an effect is currently evaluating its expression().
     * When true, reads (symbol/property/attribute) are recorded as dependencies.
     * @returns {boolean}
     */ get isTracking() {
            return this._currentEffect !== null;
        }
        /**
     * Track a global variable read as a dependency.
     * @param {string} name - Variable name
     */ trackGlobalSymbol(name) {
            this._currentEffect.dependencies.set("symbol:global:" + name, {
                type: "symbol",
                name: name,
                scope: "global"
            });
        }
        /**
     * Track an element-scoped variable read as a dependency.
     * @param {string} name - Variable name
     * @param {Element} element - Owning element
     */ trackElementSymbol(name, element) {
            if (!element) return;
            var elementId = this._getObjectState(element).id;
            this._currentEffect.dependencies.set("symbol:element:" + name + ":" + elementId, {
                type: "symbol",
                name: name,
                scope: "element",
                element: element
            });
        }
        /**
     * Track a property read as a dependency.
     * Subscription is coarse-grained (one handler per object, not per property),
     * so the dep key uses "*" rather than the property name.
     * @param {Object} obj - DOM element or plain JS object
     * @param {string} name - Property name
     */ trackProperty(obj, name) {
            if (obj == null || typeof obj !== "object" || obj._hsSkipTracking) return;
            this._currentEffect.dependencies.set("property:" + this._getObjectState(obj).id, {
                type: "property",
                object: obj,
                name: name
            });
        }
        /**
     * Track a DOM attribute read as a dependency.
     * @param {Element} element
     * @param {string} name - Attribute name
     */ trackAttribute(element, name) {
            if (!(element instanceof Element)) return;
            this._currentEffect.dependencies.set("attribute:" + name + ":" + this._getObjectState(element).id, {
                type: "attribute",
                element: element,
                name: name
            });
        }
        /**
     * Track a DOM query as a dependency. Re-evaluates when any DOM
     * change occurs within root or its descendants.
     * @param {Element|Document} root - the element querySelectorAll runs on (e.g. #myTable in `<:checked/> in #myTable`)
     */ trackQuery(root) {
            if (!this._currentEffect) return;
            root = root || document;
            var key = "query:" + this._getObjectState(root).id;
            this._currentEffect.dependencies.set(key, {
                type: "query",
                root: root
            });
        }
        /**
     * Notify that a global variable was written.
     * @param {string} name - Variable name
     */ notifyGlobalSymbol(name) {
            var subs = this._globalSymbolSubscriptions.get(name);
            if (subs) for (var effect of subs)this._scheduleEffect(effect);
        }
        /**
     * Notify that an element-scoped variable was written.
     * @param {string} name - Variable name
     * @param {Element} element - Owning element
     */ notifyElementSymbol(name, element) {
            if (!element) return;
            var state = this._getObjectState(element);
            if (state.subscriptions) {
                var subs = state.subscriptions.get(name);
                if (subs) for (var effect of subs)this._scheduleEffect(effect);
            }
        }
        /**
     * Notify that a property was written programmatically.
     * Schedules all effects watching properties on this object.
     * @param {Object} obj - DOM element or plain JS object
     */ notifyProperty(obj) {
            if (obj == null || typeof obj !== "object" || obj._hsSkipTracking) return;
            var state = this._objectState.get(obj);
            if (state) {
                var subs = this._propertySubscriptions.get(state.id);
                if (subs) for (var effect of subs)this._scheduleEffect(effect);
            }
        }
        /**
     * Add an effect to the pending set.
     * Schedules a microtask to run them if one isn't already scheduled.
     * @param {Effect} effect
     */ _scheduleEffect(effect) {
            if (effect._isStopped) return;
            this._pendingEffects.add(effect);
            if (!this._isRunScheduled) {
                this._isRunScheduled = true;
                var self2 = this;
                queueMicrotask(function() {
                    self2._runPendingEffects();
                });
            }
        }
        /**
     * Set up the single global MutationObserver and delegated input/change
     * listeners that power attribute, property, and query tracking.
     */ _initGlobalObserver() {
            if (typeof document === "undefined") return;
            if (!this._observer) {
                var reactivity2 = this;
                this._observer = new MutationObserver(function(mutations) {
                    reactivity2._handleMutations(mutations);
                });
                this._inputHandler = function(e) {
                    reactivity2._handleDOMEvent(e);
                };
                this._changeHandler = function(e) {
                    reactivity2._handleDOMEvent(e);
                };
            }
            this._observer.observe(document, {
                attributes: true,
                childList: true,
                subtree: true
            });
            document.addEventListener("input", this._inputHandler, true);
            document.addEventListener("change", this._changeHandler, true);
        }
        /**
     * Handle MutationObserver callbacks. Dispatches to attribute and query
     * subscriptions based on mutation type.
     * @param {MutationRecord[]} mutations
     */ _handleMutations(mutations) {
            var hasQueries = this._querySubscriptions.size > 0;
            var queryTargets = hasQueries ? /* @__PURE__ */ new Set() : null;
            for(var i = 0; i < mutations.length; i++){
                var mutation = mutations[i];
                if (mutation.type === "attributes") this._scheduleAttributeEffects(mutation.target, mutation.attributeName);
                if (queryTargets) queryTargets.add(mutation.target);
            }
            if (queryTargets) this._scheduleQueryEffects(queryTargets);
        }
        /**
     * Handle delegated input/change events. Dispatches to property and
     * query subscriptions.
     * @param {Event} event
     */ _handleDOMEvent(event) {
            var el = event.target;
            if (!(el instanceof Element)) return;
            var state = this._objectState.get(el);
            if (state) {
                var subs = this._propertySubscriptions.get(state.id);
                if (subs) for (var effect of subs)this._scheduleEffect(effect);
            }
            this._scheduleQueryEffects(el);
        }
        /**
     * Schedule effects watching a specific attribute on a specific element.
     * @param {Element} element
     * @param {string} attrName
     */ _scheduleAttributeEffects(element, attrName) {
            var state = this._objectState.get(element);
            if (!state) return;
            var key = attrName + ":" + state.id;
            var subs = this._attributeSubscriptions.get(key);
            if (subs) for (var effect of subs)this._scheduleEffect(effect);
        }
        /**
     * Schedule effects with query deps whose root includes any of the mutated elements.
     * @param {Set<Element>|Element} mutated - Element(s) where DOM changes occurred
     */ _scheduleQueryEffects(mutated) {
            if (this._querySubscriptions.size === 0) return;
            for (var [root, effects] of this._querySubscriptions){
                if (this._containsTarget(root, mutated)) for (var effect of effects)this._scheduleEffect(effect);
            }
        }
        /** Check if any of the mutated elements are inside root. */ _containsTarget(root, mutated) {
            if (mutated instanceof Set) {
                for (var el of mutated){
                    if (root.contains(el)) return true;
                }
                return false;
            }
            return root.contains(mutated);
        }
        /**
     * Run all pending effects. Called once per microtask batch.
     * Effects that re-trigger during this run are queued for the next batch.
     */ _runPendingEffects() {
            this._isRunScheduled = false;
            var effects = Array.from(this._pendingEffects);
            this._pendingEffects.clear();
            for(var i = 0; i < effects.length; i++){
                var effect = effects[i];
                if (effect._isStopped) continue;
                if (effect.element && !effect.element.isConnected) {
                    effect.stop();
                    continue;
                }
                effect.run();
            }
            if (this._pendingEffects.size === 0) {
                for(var i = 0; i < effects.length; i++)if (!effects[i]._isStopped) effects[i].resetTriggerCount();
            }
        }
        /**
     * Subscribe an effect to all its current deps.
     * Symbols go into per-element/global subscription maps.
     * Attributes, properties, and queries use flat lookup maps
     * dispatched by the global observer.
     * @param {Effect} effect
     */ _subscribeEffect(effect) {
            var reactivity2 = this;
            var needsGlobalObserver = false;
            for (var [depKey, dep] of effect.dependencies){
                if (dep.type === "symbol" && dep.scope === "global") {
                    if (!reactivity2._globalSymbolSubscriptions.has(dep.name)) reactivity2._globalSymbolSubscriptions.set(dep.name, /* @__PURE__ */ new Set());
                    reactivity2._globalSymbolSubscriptions.get(dep.name).add(effect);
                } else if (dep.type === "symbol" && dep.scope === "element") {
                    var state = reactivity2._getObjectState(dep.element);
                    if (!state.subscriptions) state.subscriptions = /* @__PURE__ */ new Map();
                    if (!state.subscriptions.has(dep.name)) state.subscriptions.set(dep.name, /* @__PURE__ */ new Set());
                    state.subscriptions.get(dep.name).add(effect);
                } else if (dep.type === "attribute") {
                    var attrState = reactivity2._getObjectState(dep.element);
                    var attrKey = dep.name + ":" + attrState.id;
                    if (!reactivity2._attributeSubscriptions.has(attrKey)) reactivity2._attributeSubscriptions.set(attrKey, /* @__PURE__ */ new Set());
                    reactivity2._attributeSubscriptions.get(attrKey).add(effect);
                    needsGlobalObserver = true;
                } else if (dep.type === "property") {
                    var propState = reactivity2._getObjectState(dep.object);
                    if (!reactivity2._propertySubscriptions.has(propState.id)) reactivity2._propertySubscriptions.set(propState.id, /* @__PURE__ */ new Set());
                    reactivity2._propertySubscriptions.get(propState.id).add(effect);
                    needsGlobalObserver = true;
                } else if (dep.type === "query") {
                    if (!reactivity2._querySubscriptions.has(dep.root)) reactivity2._querySubscriptions.set(dep.root, /* @__PURE__ */ new Set());
                    reactivity2._querySubscriptions.get(dep.root).add(effect);
                    needsGlobalObserver = true;
                }
            }
            if (needsGlobalObserver) reactivity2._initGlobalObserver();
        }
        /** @param {Effect} effect */ _unsubscribeEffect(effect) {
            var reactivity2 = this;
            for (var [depKey, dep] of effect.dependencies){
                if (dep.type === "symbol" && dep.scope === "global") {
                    var subs = reactivity2._globalSymbolSubscriptions.get(dep.name);
                    if (subs) {
                        subs.delete(effect);
                        if (subs.size === 0) reactivity2._globalSymbolSubscriptions.delete(dep.name);
                    }
                } else if (dep.type === "symbol" && dep.scope === "element") {
                    var state = reactivity2._getObjectState(dep.element);
                    if (state.subscriptions) {
                        var subs = state.subscriptions.get(dep.name);
                        if (subs) {
                            subs.delete(effect);
                            if (subs.size === 0) state.subscriptions.delete(dep.name);
                        }
                    }
                } else if (dep.type === "attribute" && dep.element) {
                    var attrState = reactivity2._getObjectState(dep.element);
                    var attrKey = dep.name + ":" + attrState.id;
                    var subs = reactivity2._attributeSubscriptions.get(attrKey);
                    if (subs) {
                        subs.delete(effect);
                        if (subs.size === 0) reactivity2._attributeSubscriptions.delete(attrKey);
                    }
                } else if (dep.type === "property" && dep.object) {
                    var propState = reactivity2._getObjectState(dep.object);
                    var subs = reactivity2._propertySubscriptions.get(propState.id);
                    if (subs) {
                        subs.delete(effect);
                        if (subs.size === 0) reactivity2._propertySubscriptions.delete(propState.id);
                    }
                } else if (dep.type === "query") {
                    var subs = reactivity2._querySubscriptions.get(dep.root);
                    if (subs) {
                        subs.delete(effect);
                        if (subs.size === 0) reactivity2._querySubscriptions.delete(dep.root);
                    }
                }
            }
            reactivity2._maybeStopGlobalObserver();
        }
        /**
     * Disconnect the global observer and delegated listeners when no
     * effects depend on DOM state (attributes, properties, or queries).
     */ _maybeStopGlobalObserver() {
            if (!this._observer) return;
            if (this._attributeSubscriptions.size > 0) return;
            if (this._propertySubscriptions.size > 0) return;
            if (this._querySubscriptions.size > 0) return;
            this._observer.disconnect();
            document.removeEventListener("input", this._inputHandler, true);
            document.removeEventListener("change", this._changeHandler, true);
        }
        /**
     * Remove empty entries from subscription maps for deps that were dropped.
     * Query deps need no cleanup here — _unsubscribeEffect handles them directly.
     * @param {Map<string, Dependency>} deps
     */ _cleanupOrphanedDeps(deps) {
            var reactivity2 = this;
            for (var [depKey, dep] of deps){
                if (dep.type === "attribute" && dep.element) {
                    var attrState = reactivity2._objectState.get(dep.element);
                    if (attrState) {
                        var attrKey = dep.name + ":" + attrState.id;
                        var subs = reactivity2._attributeSubscriptions.get(attrKey);
                        if (subs && subs.size === 0) reactivity2._attributeSubscriptions.delete(attrKey);
                    }
                } else if (dep.type === "property" && dep.object) {
                    var propState = reactivity2._objectState.get(dep.object);
                    if (propState) {
                        var subs = reactivity2._propertySubscriptions.get(propState.id);
                        if (subs && subs.size === 0) reactivity2._propertySubscriptions.delete(propState.id);
                    }
                }
            }
        }
        /**
     * Create a reactive effect with automatic dependency tracking.
     * @param {() => any} expression - The watched expression
     * @param {(value: any) => void} handler - Called when the value changes
     * @param {Object} [options]
     * @param {Element} [options.element] - Auto-stop when element disconnects
     * @returns {() => void} Stop function
     */ createEffect(expression, handler, options) {
            var effect = new Effect(expression, handler, options && options.element || null, this);
            effect.initialize();
            if (effect.element) {
                var data = effect.element._hyperscript ??= {};
                data.effects ??= /* @__PURE__ */ new Set();
                data.effects.add(effect);
            }
            return function() {
                effect.stop();
            };
        }
        /** Stop all reactive effects owned by an element. */ stopElementEffects(element) {
            var data = element._hyperscript;
            if (!data || !data.effects) return;
            for (var effect of data.effects)effect.stop();
            delete data.effects;
        }
    };
    // src/core/runtime/morph.js
    var Morph = class {
        /**
     * Morph oldNode to match content.
     * @param {Element} oldNode - The existing DOM element to morph
     * @param {string|Element|DocumentFragment} content - The new content
     * @param {MorphCallbacks} [callbacks] - Optional lifecycle callbacks
     */ morph(oldNode, content, callbacks = {}) {
            var fragment;
            if (typeof content === "string") {
                var temp = document.createElement("template");
                temp.innerHTML = content;
                fragment = temp.content;
            } else if (content instanceof DocumentFragment) fragment = content;
            else if (content instanceof Element) {
                fragment = document.createDocumentFragment();
                fragment.append(content.cloneNode(true));
            } else throw new Error("morph requires an HTML string, element, or document fragment");
            var newRoot = fragment.firstElementChild;
            if (newRoot && !newRoot.nextElementSibling && newRoot.tagName === oldNode.tagName) {
                _copyAttributes(oldNode, newRoot);
                fragment = newRoot;
            }
            var { persistentIds: persistentIds, idMap: idMap } = _createIdMaps(oldNode, fragment);
            var pantry = document.createElement("div");
            pantry.hidden = true;
            (document.body || oldNode.parentElement).after(pantry);
            var ctx = {
                target: oldNode,
                idMap: idMap,
                persistentIds: persistentIds,
                pantry: pantry,
                futureMatches: /* @__PURE__ */ new WeakSet(),
                callbacks: callbacks
            };
            _morphChildren(ctx, oldNode, fragment);
            callbacks.beforeNodeRemoved?.(pantry);
            pantry.remove();
        }
    };
    function _morphChildren(ctx, oldParent, newParent, insertionPoint = null, endPoint = null) {
        if (oldParent instanceof HTMLTemplateElement && newParent instanceof HTMLTemplateElement) {
            oldParent = oldParent.content;
            newParent = newParent.content;
        }
        insertionPoint ||= oldParent.firstChild;
        let newChild = newParent.firstChild;
        while(newChild){
            let matchedNode;
            if (insertionPoint && insertionPoint !== endPoint) {
                matchedNode = _findBestMatch(ctx, newChild, insertionPoint, endPoint);
                if (matchedNode && matchedNode !== insertionPoint) {
                    let cursor = insertionPoint;
                    while(cursor && cursor !== matchedNode){
                        let tempNode = cursor;
                        cursor = cursor.nextSibling;
                        if (tempNode instanceof Element && (ctx.idMap.has(tempNode) || _matchesUpcomingSibling(ctx, tempNode, newChild))) _moveBefore(oldParent, tempNode, endPoint);
                        else _removeNode(ctx, tempNode);
                    }
                }
            }
            if (!matchedNode && newChild instanceof Element && ctx.persistentIds.has(newChild.id)) {
                let escapedId = CSS.escape(newChild.id);
                matchedNode = ctx.target.id === newChild.id && ctx.target || ctx.target.querySelector('[id="' + escapedId + '"]') || ctx.pantry.querySelector('[id="' + escapedId + '"]');
                let element = matchedNode;
                while(element = element.parentNode){
                    let idSet = ctx.idMap.get(element);
                    if (idSet) {
                        idSet.delete(matchedNode.id);
                        if (!idSet.size) ctx.idMap.delete(element);
                    }
                }
                _moveBefore(oldParent, matchedNode, insertionPoint);
            }
            if (matchedNode) {
                _morphNode(matchedNode, newChild, ctx);
                insertionPoint = matchedNode.nextSibling;
                newChild = newChild.nextSibling;
                continue;
            }
            let nextNewChild = newChild.nextSibling;
            if (ctx.idMap.has(newChild)) {
                let placeholder = document.createElement(newChild.tagName);
                oldParent.insertBefore(placeholder, insertionPoint);
                _morphNode(placeholder, newChild, ctx);
                insertionPoint = placeholder.nextSibling;
            } else {
                oldParent.insertBefore(newChild, insertionPoint);
                ctx.callbacks.afterNodeAdded?.(newChild);
                insertionPoint = newChild.nextSibling;
            }
            newChild = nextNewChild;
        }
        while(insertionPoint && insertionPoint !== endPoint){
            let tempNode = insertionPoint;
            insertionPoint = insertionPoint.nextSibling;
            _removeNode(ctx, tempNode);
        }
    }
    function _morphNode(oldNode, newNode, ctx) {
        if (!(oldNode instanceof Element)) return;
        _copyAttributes(oldNode, newNode);
        if (oldNode instanceof HTMLTextAreaElement && oldNode.defaultValue !== newNode.defaultValue) oldNode.value = newNode.value;
        if (!oldNode.isEqualNode(newNode) || newNode.tagName === "TEMPLATE" || newNode.querySelector?.("template")) _morphChildren(ctx, oldNode, newNode);
        ctx.callbacks.afterNodeMorphed?.(oldNode);
    }
    function _findBestMatch(ctx, node, startPoint, endPoint) {
        if (!(node instanceof Element)) return null;
        var softMatch = null, displaceMatchCount = 0, scanLimit = 10;
        var newSet = ctx.idMap.get(node), nodeMatchCount = newSet?.size || 0;
        if (node.id && !newSet) return null;
        var cursor = startPoint;
        while(cursor && cursor !== endPoint){
            var oldSet = ctx.idMap.get(cursor);
            if (_isSoftMatch(cursor, node)) {
                if (oldSet && newSet && [
                    ...oldSet
                ].some((id)=>newSet.has(id))) return cursor;
                if (!oldSet) {
                    if (scanLimit > 0 && cursor.isEqualNode(node)) return cursor;
                    if (!softMatch) softMatch = cursor;
                }
            }
            displaceMatchCount += oldSet?.size || 0;
            if (displaceMatchCount > nodeMatchCount) break;
            if (cursor.contains(document.activeElement)) break;
            if (--scanLimit < 1 && nodeMatchCount === 0) break;
            cursor = cursor.nextSibling;
        }
        if (softMatch && _matchesUpcomingSibling(ctx, softMatch, node)) return null;
        return softMatch;
    }
    function _matchesUpcomingSibling(ctx, oldElt, startNode) {
        if (ctx.futureMatches.has(oldElt)) return true;
        for(var sibling = startNode.nextSibling, i = 0; sibling && i < 10; sibling = sibling.nextSibling, i++)if (sibling instanceof Element && oldElt.isEqualNode(sibling)) {
            ctx.futureMatches.add(oldElt);
            return true;
        }
        return false;
    }
    function _removeNode(ctx, node) {
        if (ctx.idMap.has(node)) _moveBefore(ctx.pantry, node, null);
        else {
            ctx.callbacks.beforeNodeRemoved?.(node);
            node.remove();
        }
    }
    function _moveBefore(parentNode, element, after) {
        if (parentNode.moveBefore) try {
            parentNode.moveBefore(element, after);
            return;
        } catch (e) {}
        parentNode.insertBefore(element, after);
    }
    function _copyAttributes(destination, source) {
        for (var attr of source.attributes)if (destination.getAttribute(attr.name) !== attr.value) {
            destination.setAttribute(attr.name, attr.value);
            if (attr.name === "value" && destination instanceof HTMLInputElement && destination.type !== "file") destination.value = attr.value;
        }
        for(var i = destination.attributes.length - 1; i >= 0; i--){
            var attr = destination.attributes[i];
            if (attr && !source.hasAttribute(attr.name)) destination.removeAttribute(attr.name);
        }
    }
    function _isSoftMatch(oldNode, newNode) {
        if (!(oldNode instanceof Element) || oldNode.tagName !== newNode.tagName) return false;
        if (oldNode.tagName === "SCRIPT" && !oldNode.isEqualNode(newNode)) return false;
        return !oldNode.id || oldNode.id === newNode.id;
    }
    function _createIdMaps(oldNode, newContent) {
        var oldIdElements = _queryEltAndDescendants(oldNode, "[id]");
        var newIdElements = newContent.querySelectorAll("[id]");
        var persistentIds = _createPersistentIds(oldIdElements, newIdElements);
        var idMap = /* @__PURE__ */ new Map();
        _populateIdMapWithTree(idMap, persistentIds, oldNode.parentElement, oldIdElements);
        _populateIdMapWithTree(idMap, persistentIds, newContent, newIdElements);
        return {
            persistentIds: persistentIds,
            idMap: idMap
        };
    }
    function _createPersistentIds(oldIdElements, newIdElements) {
        var duplicateIds = /* @__PURE__ */ new Set(), oldIdTagNameMap = /* @__PURE__ */ new Map();
        for (var { id: id, tagName: tagName } of oldIdElements){
            if (oldIdTagNameMap.has(id)) duplicateIds.add(id);
            else if (id) oldIdTagNameMap.set(id, tagName);
        }
        var persistentIds = /* @__PURE__ */ new Set();
        for (var { id: id, tagName: tagName } of newIdElements){
            if (persistentIds.has(id)) duplicateIds.add(id);
            else if (oldIdTagNameMap.get(id) === tagName) persistentIds.add(id);
        }
        for (var id of duplicateIds)persistentIds.delete(id);
        return persistentIds;
    }
    function _populateIdMapWithTree(idMap, persistentIds, root, elements) {
        for (var elt of elements)if (persistentIds.has(elt.id)) {
            var current = elt;
            while(current && current !== root){
                var idSet = idMap.get(current);
                if (idSet == null) {
                    idSet = /* @__PURE__ */ new Set();
                    idMap.set(current, idSet);
                }
                idSet.add(elt.id);
                current = current.parentElement;
            }
        }
    }
    function _queryEltAndDescendants(elt, selector) {
        var results = [
            ...elt.querySelectorAll?.(selector) ?? []
        ];
        if (elt.matches?.(selector)) results.unshift(elt);
        return results;
    }
    // src/core/runtime/htmx-compat.js
    var HtmxCompat = class _HtmxCompat {
        #processingFromHtmx = false;
        constructor(globalScope2, hyperscript){
            this.globalScope = globalScope2;
            this.hyperscript = hyperscript;
        }
        init() {
            var self2 = this;
            var globalScope2 = this.globalScope;
            var _hyperscript2 = this.hyperscript;
            globalScope2.document.addEventListener("htmx:load", function(evt) {
                self2.#processingFromHtmx = true;
                _hyperscript2.process(evt.detail.elt);
                self2.#processingFromHtmx = false;
            });
            globalScope2.document.addEventListener("htmx:after:process", function(evt) {
                self2.#processingFromHtmx = true;
                _hyperscript2.process(evt.target);
                self2.#processingFromHtmx = false;
            });
            if (typeof globalScope2.htmx?.process === "function") {
                _hyperscript2.addAfterProcessHook(function(elt) {
                    if (!self2.#processingFromHtmx) htmx.process(elt);
                });
                if (htmx.version?.startsWith("4")) htmx.registerExtension("hs-include", {
                    htmx_config_request: function(elt, detail) {
                        var ctx = detail?.ctx;
                        if (!ctx) return;
                        var sourceElt = ctx.sourceElement || elt;
                        var found = _HtmxCompat.#findHsInclude(sourceElt);
                        if (!found) return;
                        var vars = _HtmxCompat.#resolveSpecifiers(found.value, found.scopeElt);
                        var body = ctx.request?.body;
                        if (body instanceof FormData) for(var k in vars)body.set(k, vars[k]);
                    }
                });
            }
        }
        // ----- hs-include helpers -----
        static #findHsInclude(sourceElt) {
            var attr = sourceElt.getAttribute("hs-include");
            if (attr !== null) return {
                value: attr,
                scopeElt: sourceElt
            };
            var elt = sourceElt.parentElement;
            while(elt){
                attr = elt.getAttribute("hs-include:inherited");
                if (attr !== null) return {
                    value: attr,
                    scopeElt: elt
                };
                elt = elt.parentElement;
            }
            return null;
        }
        static #readScope(elt) {
            return elt?._hyperscript?.elementScope || {};
        }
        static #serialize(value) {
            if (value == null) return "";
            if (typeof value === "object") try {
                return JSON.stringify(value);
            } catch (_) {
                return "";
            }
            return String(value);
        }
        static #resolveInherited(scopeKey, startElt) {
            var elt = startElt;
            while(elt){
                var scope = elt._hyperscript?.elementScope;
                if (scope && scopeKey in scope) return scope[scopeKey];
                elt = elt.parentElement;
            }
        }
        static #resolveSpecifiers(attrValue, scopeElt) {
            var result = {};
            var raw = attrValue.trim();
            if (raw === "*") {
                var scope = this.#readScope(scopeElt);
                for(var k in scope)if (Object.prototype.hasOwnProperty.call(scope, k)) result[k[0] === ":" ? k.slice(1) : k] = this.#serialize(scope[k]);
                return result;
            }
            var self2 = this;
            raw.split(",").forEach(function(part) {
                part = part.trim();
                if (!part) return;
                if (part[0] === ":") {
                    var name = part.slice(1);
                    var scope2 = self2.#readScope(scopeElt);
                    var scopeKey = ":" + name;
                    if (scopeKey in scope2) result[name] = self2.#serialize(scope2[scopeKey]);
                } else if (part[0] === "^") {
                    var name = part.slice(1);
                    var val = self2.#resolveInherited(":" + name, scopeElt);
                    if (val !== void 0) result[name] = self2.#serialize(val);
                } else if (part[0] === "#") {
                    var colonIdx = part.lastIndexOf(":");
                    if (colonIdx > 0) {
                        var selector = part.slice(0, colonIdx);
                        var name = part.slice(colonIdx + 1);
                        var targetElt = document.querySelector(selector);
                        if (targetElt) {
                            var scope2 = self2.#readScope(targetElt);
                            var scopeKey = ":" + name;
                            if (scopeKey in scope2) result[name] = self2.#serialize(scope2[scopeKey]);
                        }
                    }
                }
            });
            return result;
        }
    };
    // src/parsetree/expressions/expressions.js
    var expressions_exports = {};
    __export(expressions_exports, {
        ArrayIndex: ()=>ArrayIndex,
        AsExpression: ()=>AsExpression,
        AttributeRefAccess: ()=>AttributeRefAccess,
        BeepExpression: ()=>BeepExpression,
        BlockLiteral: ()=>BlockLiteral,
        CollectionExpression: ()=>CollectionExpression,
        ComparisonOperator: ()=>ComparisonOperator,
        DotOrColonPath: ()=>DotOrColonPath,
        FunctionCall: ()=>FunctionCall,
        InExpression: ()=>InExpression,
        LogicalNot: ()=>LogicalNot,
        LogicalOperator: ()=>LogicalOperator,
        MathOperator: ()=>MathOperator,
        NegativeNumber: ()=>NegativeNumber,
        OfExpression: ()=>OfExpression,
        ParenthesizedExpression: ()=>ParenthesizedExpression,
        PossessiveExpression: ()=>PossessiveExpression,
        PropertyAccess: ()=>PropertyAccess,
        SymbolRef: ()=>SymbolRef
    });
    var ParenthesizedExpression = class _ParenthesizedExpression extends Expression {
        static grammarName = "parenthesized";
        static expressionType = "leaf";
        constructor(expr){
            super();
            this.expr = expr;
            this.args = {
                value: expr
            };
        }
        static parse(parser) {
            if (parser.matchOpToken("(")) {
                var follows = parser.clearFollows();
                try {
                    var expr = parser.requireElement("expression");
                } finally{
                    parser.restoreFollows(follows);
                }
                parser.requireOpToken(")");
                return new _ParenthesizedExpression(expr);
            }
        }
        resolve(context, { value: value }) {
            return value;
        }
    };
    var BlockLiteral = class _BlockLiteral extends Expression {
        static grammarName = "blockLiteral";
        static expressionType = "leaf";
        constructor(params, expr){
            super();
            this.params = params;
            this.expr = expr;
        }
        static parse(parser) {
            if (!parser.matchOpToken("\\")) return;
            var params = [];
            var arg1 = parser.matchTokenType("IDENTIFIER");
            if (arg1) {
                params.push(arg1);
                while(parser.matchOpToken(","))params.push(parser.requireTokenType("IDENTIFIER"));
            }
            parser.requireOpToken("-");
            parser.requireOpToken(">");
            var expr = parser.requireElement("expression");
            return new _BlockLiteral(params, expr);
        }
        resolve(ctx) {
            var params = this.params;
            var expr = this.expr;
            return function() {
                for(var i = 0; i < params.length; i++)ctx.locals[params[i].value] = arguments[i];
                return expr.evaluate(ctx);
            };
        }
    };
    var NegativeNumber = class _NegativeNumber extends Expression {
        static grammarName = "negativeNumber";
        constructor(root){
            super();
            this.root = root;
            this.args = {
                value: root
            };
        }
        static parse(parser) {
            if (parser.matchOpToken("-")) {
                var root = parser.requireElement("negativeNumber");
                return new _NegativeNumber(root);
            } else return parser.requireElement("primaryExpression");
        }
        resolve(context, { value: value }) {
            return -value;
        }
    };
    var LogicalNot = class _LogicalNot extends Expression {
        static grammarName = "logicalNot";
        static expressionType = "unary";
        constructor(root){
            super();
            this.root = root;
            this.args = {
                value: root
            };
        }
        static parse(parser) {
            if (!parser.matchToken("not")) return;
            var root = parser.requireElement("unaryExpression");
            return new _LogicalNot(root);
        }
        resolve(context, { value: val }) {
            return !val;
        }
    };
    var SymbolRef = class _SymbolRef extends Expression {
        static grammarName = "symbol";
        static assignable = true;
        constructor(token, scope, name, targetExpr){
            super();
            this.token = token;
            this.scope = scope;
            this.name = name;
            this.targetExpr = targetExpr || null;
        }
        static parse(parser) {
            var scope = null;
            if (parser.matchToken("global")) scope = "global";
            else if (parser.matchToken("element")) {
                scope = "element";
                if (parser.matchOpToken("'")) parser.requireToken("s");
            } else if (parser.matchToken("dom")) scope = "inherited";
            else if (parser.matchToken("local")) scope = "local";
            let eltPrefix = parser.matchOpToken(":");
            let caretPrefix = !eltPrefix && parser.matchOpToken("^");
            let identifier = parser.matchTokenType("IDENTIFIER");
            if (identifier && identifier.value) {
                var name = identifier.value;
                if (eltPrefix) name = ":" + name;
                else if (caretPrefix) name = "^" + name;
                if (scope === null) {
                    if (name.startsWith("$")) scope = "global";
                    else if (name.startsWith(":")) scope = "element";
                    else if (name.startsWith("^")) scope = "inherited";
                    else scope = "local";
                }
                var targetExpr = null;
                if (scope === "inherited" && parser.matchToken("on")) {
                    var follows = parser.pushFollows("to", "into", "before", "after", "then");
                    try {
                        targetExpr = parser.requireElement("expression");
                    } finally{
                        parser.popFollows(follows);
                    }
                }
                return new _SymbolRef(identifier, scope, name, targetExpr);
            }
        }
        resolve(context) {
            return context.meta.runtime.resolveSymbol(this.name, context, this.scope, this.targetExpr ? this.targetExpr.evaluate(context) : null);
        }
        get lhs() {
            return {};
        }
        set(ctx, lhs, value) {
            ctx.meta.runtime.setSymbol(this.name, ctx, this.scope, value, this.targetExpr ? this.targetExpr.evaluate(ctx) : null);
        }
    };
    var BeepExpression = class _BeepExpression extends Expression {
        static grammarName = "beepExpression";
        static expressionType = "unary";
        constructor(expression){
            super();
            this.expression = expression;
            this.expression["booped"] = true;
            this.args = {
                value: expression
            };
        }
        static parse(parser) {
            if (!parser.matchToken("beep!")) return;
            var expression = parser.parseElement("unaryExpression");
            if (expression) return new _BeepExpression(expression);
        }
        resolve(ctx, { value: value }) {
            ctx.meta.runtime.beepValueToConsole(ctx.me, this.expression, value);
            return value;
        }
    };
    var PropertyAccess = class _PropertyAccess extends Expression {
        static grammarName = "propertyAccess";
        static expressionType = "indirect";
        static assignable = true;
        constructor(root, prop){
            super();
            this.root = root;
            this.prop = prop;
            this.args = {
                root: root
            };
        }
        static parse(parser, root) {
            if (!parser.matchOpToken(".")) return;
            var prop = parser.requireTokenType("IDENTIFIER");
            var propertyAccess = new _PropertyAccess(root, prop);
            return parser.parseElement("indirectExpression", propertyAccess);
        }
        resolve(context, { root: rootVal }) {
            return context.meta.runtime.resolveProperty(rootVal, this.prop.value);
        }
        get lhs() {
            return {
                root: this.root
            };
        }
        set(ctx, lhs, value) {
            ctx.meta.runtime.nullCheck(lhs.root, this.root);
            var runtime2 = ctx.meta.runtime;
            runtime2.implicitLoop(lhs.root, (elt)=>{
                runtime2.setProperty(elt, this.prop.value, value);
            });
        }
        delete(ctx, lhs) {
            ctx.meta.runtime.nullCheck(lhs.root, this.root);
            var runtime2 = ctx.meta.runtime;
            var prop = this.prop.value;
            runtime2.implicitLoop(lhs.root, (elt)=>{
                delete elt[prop];
                runtime2.notifyMutation(elt);
            });
        }
    };
    var OfExpression = class _OfExpression extends Expression {
        static grammarName = "ofExpression";
        static expressionType = "indirect";
        static assignable = true;
        constructor(prop, newRoot, attribute, expression, args, urRoot){
            super();
            this.prop = prop;
            this.root = newRoot;
            this.attribute = attribute;
            this.expression = expression;
            this.args = args;
            this._urRoot = urRoot;
            this._prop = urRoot.name;
            this._isAttribute = urRoot.type === "attributeRef";
            this._isStyle = urRoot.type === "styleRef";
            this._isComputed = urRoot.type === "computedStyleRef";
        }
        static parse(parser, root) {
            if (!parser.matchToken("of")) return;
            var newRoot = parser.requireElement("unaryExpression");
            var childOfUrRoot = null;
            var urRoot = root;
            while(urRoot.root){
                childOfUrRoot = urRoot;
                urRoot = urRoot.root;
            }
            var validOfRoots = [
                "symbol",
                "attributeRef",
                "styleRef",
                "computedStyleRef"
            ];
            if (!validOfRoots.includes(urRoot.type)) parser.raiseError("Cannot take a property of a non-symbol: " + urRoot.type);
            var attribute = urRoot.type === "attributeRef";
            var style = urRoot.type === "styleRef" || urRoot.type === "computedStyleRef";
            var attributeElt = attribute || style ? urRoot : null;
            var prop = urRoot.name;
            var propertyAccess = new _OfExpression(urRoot.token, // can be undefined for attributeRef
            newRoot, attributeElt, root, {
                root: newRoot
            }, urRoot);
            if (urRoot.type === "attributeRef") propertyAccess.attribute = urRoot;
            if (childOfUrRoot) {
                childOfUrRoot.root = propertyAccess;
                childOfUrRoot.args = {
                    root: propertyAccess
                };
            } else root = propertyAccess;
            return parser.parseElement("indirectExpression", root);
        }
        resolve(context, { root: rootVal }) {
            if (this._isAttribute) return context.meta.runtime.resolveAttribute(rootVal, this._prop);
            else if (this._isComputed) return context.meta.runtime.resolveComputedStyle(rootVal, this._prop);
            else if (this._isStyle) return context.meta.runtime.resolveStyle(rootVal, this._prop);
            else return context.meta.runtime.resolveProperty(rootVal, this._prop);
        }
        get lhs() {
            return {
                root: this.root
            };
        }
        set(ctx, lhs, value) {
            ctx.meta.runtime.nullCheck(lhs.root, this.root);
            if (this._isAttribute) ctx.meta.runtime.implicitLoop(lhs.root, (elt)=>{
                value == null ? elt.removeAttribute(this._prop) : elt.setAttribute(this._prop, value);
            });
            else if (this._isStyle) ctx.meta.runtime.implicitLoop(lhs.root, (elt)=>{
                elt.style[this._prop] = value;
            });
            else {
                var runtime2 = ctx.meta.runtime;
                runtime2.implicitLoop(lhs.root, (elt)=>{
                    runtime2.setProperty(elt, this._prop, value);
                });
            }
        }
        delete(ctx, lhs) {
            ctx.meta.runtime.nullCheck(lhs.root, this.root);
            var runtime2 = ctx.meta.runtime;
            var prop = this._prop;
            if (this._isAttribute) runtime2.implicitLoop(lhs.root, (elt)=>elt.removeAttribute(prop));
            else if (this._isStyle) runtime2.implicitLoop(lhs.root, (elt)=>elt.style.removeProperty(prop));
            else runtime2.implicitLoop(lhs.root, (elt)=>{
                delete elt[prop];
                runtime2.notifyMutation(elt);
            });
        }
    };
    var PossessiveExpression = class _PossessiveExpression extends Expression {
        static grammarName = "possessive";
        static expressionType = "indirect";
        static assignable = true;
        constructor(root, attribute, prop){
            super();
            this.root = root;
            this.attribute = attribute;
            this.prop = prop;
            this.args = {
                root: root
            };
        }
        static parse(parser, root) {
            var apostrophe = parser.matchOpToken("'");
            if (apostrophe || root.type === "symbol" && (root.name === "my" || root.name === "its" || root.name === "your") && (parser.currentToken().type === "IDENTIFIER" || parser.currentToken().type === "ATTRIBUTE_REF" || parser.currentToken().type === "STYLE_REF")) {
                if (apostrophe) parser.requireToken("s");
                var attribute, style, prop;
                attribute = parser.parseElement("attributeRef");
                if (attribute == null) {
                    style = parser.parseElement("styleRef");
                    if (style == null) prop = parser.requireTokenType("IDENTIFIER");
                }
                var propertyAccess = new _PossessiveExpression(root, attribute || style, prop);
                return parser.parseElement("indirectExpression", propertyAccess);
            }
        }
        resolve(context, { root: rootVal }) {
            var value;
            if (this.attribute) {
                if (this.attribute.type === "computedStyleRef") value = context.meta.runtime.resolveComputedStyle(rootVal, this.attribute["name"]);
                else if (this.attribute.type === "styleRef") value = context.meta.runtime.resolveStyle(rootVal, this.attribute["name"]);
                else value = context.meta.runtime.resolveAttribute(rootVal, this.attribute.name);
            } else value = context.meta.runtime.resolveProperty(rootVal, this.prop.value);
            return value;
        }
        get lhs() {
            return {
                root: this.root
            };
        }
        set(ctx, lhs, value) {
            ctx.meta.runtime.nullCheck(lhs.root, this.root);
            if (this.attribute) {
                var name = this.attribute.name;
                if (this.attribute.type === "styleRef") ctx.meta.runtime.implicitLoop(lhs.root, (elt)=>{
                    elt.style[name] = value;
                });
                else ctx.meta.runtime.implicitLoop(lhs.root, (elt)=>{
                    value == null ? elt.removeAttribute(name) : elt.setAttribute(name, value);
                });
            } else {
                var runtime2 = ctx.meta.runtime;
                var prop = this.prop.value;
                runtime2.implicitLoop(lhs.root, (elt)=>{
                    runtime2.setProperty(elt, prop, value);
                });
            }
        }
    };
    var InExpression = class _InExpression extends Expression {
        static grammarName = "inExpression";
        static expressionType = "indirect";
        static assignable = true;
        constructor(root, target){
            super();
            this.root = root;
            this.target = target;
            this.args = {
                root: root,
                target: target
            };
        }
        static parse(parser, root) {
            if (!parser.matchToken("in")) return;
            var target = parser.requireElement("unaryExpression");
            var result = new _InExpression(root, target);
            if (parser.matchToken("where")) result = new WhereExpression(result, CollectionExpression.parseOperand(parser));
            return parser.parseElement("indirectExpression", result);
        }
        resolve(context, { root: rootVal, target: target }) {
            if (rootVal == null) return [];
            var returnArr = [];
            if (rootVal.css) context.meta.runtime.implicitLoop(target, function(targetElt) {
                var results = context.meta.runtime.resolveQuery(targetElt, rootVal.css);
                for(var i = 0; i < results.length; i++)returnArr.push(results[i]);
            });
            else if (rootVal instanceof Element) {
                var within = false;
                context.meta.runtime.implicitLoop(target, function(targetElt) {
                    if (targetElt.contains(rootVal)) within = true;
                });
                if (within) return rootVal;
            } else context.meta.runtime.implicitLoop(rootVal, function(rootElt) {
                context.meta.runtime.implicitLoop(target, function(targetElt) {
                    if (rootElt === targetElt) returnArr.push(rootElt);
                });
            });
            return returnArr;
        }
        get lhs() {
            return {
                root: this.root,
                target: this.target
            };
        }
        set(ctx, lhs, value) {
            var targets = this.resolve(ctx, lhs);
            ctx.meta.runtime.replaceInDom(targets, value);
        }
    };
    var AsExpression = class _AsExpression extends Expression {
        static grammarName = "asExpression";
        static expressionType = "indirect";
        constructor(root, conversion){
            super();
            this.root = root;
            this.conversion = conversion;
            this.args = {
                root: root
            };
        }
        static parse(parser, root) {
            if (!parser.matchToken("as")) return;
            parser.matchToken("a") || parser.matchToken("an");
            var conversion = parser.requireElement("dotOrColonPath").evalStatically();
            var asExpr = new _AsExpression(root, conversion);
            while(parser.matchOpToken("|")){
                conversion = parser.requireElement("dotOrColonPath").evalStatically();
                asExpr = new _AsExpression(asExpr, conversion);
            }
            return parser.parseElement("indirectExpression", asExpr);
        }
        resolve(context, { root: rootVal }) {
            return context.meta.runtime.convertValue(rootVal, this.conversion);
        }
    };
    var FunctionCall = class _FunctionCall extends Expression {
        static grammarName = "functionCall";
        static expressionType = "indirect";
        constructor(root, argExpressions, args, isMethodCall){
            super();
            this.root = root;
            this.argExpressions = argExpressions;
            this.args = args;
            this._isMethodCall = isMethodCall;
            this._parseRoot = root;
        }
        static parse(parser, root) {
            if (!parser.matchOpToken("(")) return;
            var args = [];
            if (!parser.matchOpToken(")")) {
                do args.push(parser.requireElement("expression"));
                while (parser.matchOpToken(","));
                parser.requireOpToken(")");
            }
            var functionCall;
            if (root.root) functionCall = new _FunctionCall(root, args, {
                target: root.root,
                argVals: args
            }, true);
            else functionCall = new _FunctionCall(root, args, {
                target: root,
                argVals: args
            }, false);
            return parser.parseElement("indirectExpression", functionCall);
        }
        resolve(context, { target: target, argVals: argVals }) {
            if (this._isMethodCall) {
                context.meta.runtime.nullCheck(target, this._parseRoot.root);
                var methodName = this._parseRoot.prop.value;
                var func = target[methodName];
                context.meta.runtime.nullCheck(func, this._parseRoot);
                if (func.hyperfunc) argVals.push(context);
                var result = func.apply(target, argVals);
                context.meta.runtime.maybeNotify(target, methodName);
                return result;
            } else {
                context.meta.runtime.nullCheck(target, this._parseRoot);
                if (target.hyperfunc) argVals.push(context);
                return target(...argVals);
            }
        }
    };
    var AttributeRefAccess = class _AttributeRefAccess extends Expression {
        static grammarName = "attributeRefAccess";
        static expressionType = "indirect";
        static assignable = true;
        constructor(root, attribute){
            super();
            this.root = root;
            this.attribute = attribute;
            this.args = {
                root: root
            };
        }
        static parse(parser, root) {
            var attribute = parser.parseElement("attributeRef");
            if (!attribute) return;
            return new _AttributeRefAccess(root, attribute);
        }
        resolve(_ctx, { root: rootVal }) {
            return _ctx.meta.runtime.resolveAttribute(rootVal, this.attribute.name);
        }
        get lhs() {
            return {
                root: this.root
            };
        }
        set(ctx, lhs, value) {
            ctx.meta.runtime.nullCheck(lhs.root, this.root);
            ctx.meta.runtime.implicitLoop(lhs.root, (elt)=>{
                value == null ? elt.removeAttribute(this.attribute.name) : elt.setAttribute(this.attribute.name, value);
            });
        }
    };
    var ArrayIndex = class _ArrayIndex extends Expression {
        static grammarName = "arrayIndex";
        static expressionType = "indirect";
        static assignable = true;
        constructor(root, firstIndex, secondIndex, andBefore, andAfter){
            super();
            this.root = root;
            this.prop = firstIndex;
            this.firstIndex = firstIndex;
            this.secondIndex = secondIndex;
            this.andBefore = andBefore;
            this.andAfter = andAfter;
            this.args = {
                root: root,
                firstIndex: firstIndex,
                secondIndex: secondIndex
            };
        }
        static parse(parser, root) {
            if (!parser.matchOpToken("[")) return;
            var andBefore = false;
            var andAfter = false;
            var firstIndex = null;
            var secondIndex = null;
            if (parser.matchOpToken("..")) {
                andBefore = true;
                firstIndex = parser.requireElement("expression");
            } else {
                firstIndex = parser.requireElement("expression");
                if (parser.matchOpToken("..")) {
                    andAfter = true;
                    var current = parser.currentToken();
                    if (current.type !== "R_BRACKET") secondIndex = parser.parseElement("expression");
                }
            }
            parser.requireOpToken("]");
            var arrayIndex = new _ArrayIndex(root, firstIndex, secondIndex, andBefore, andAfter);
            return parser.parseElement("indirectExpression", arrayIndex);
        }
        resolve(_ctx, { root: root, firstIndex: firstIndex, secondIndex: secondIndex }) {
            if (root == null) return null;
            if (this.andBefore) {
                if (firstIndex < 0) firstIndex = root.length + firstIndex;
                return root.slice(0, firstIndex + 1);
            } else if (this.andAfter) {
                if (secondIndex != null) {
                    if (secondIndex < 0) secondIndex = root.length + secondIndex;
                    return root.slice(firstIndex, secondIndex + 1);
                } else return root.slice(firstIndex);
            } else return root[firstIndex];
        }
        get lhs() {
            return {
                root: this.root,
                index: this.firstIndex
            };
        }
        set(ctx, lhs, value) {
            ctx.meta.runtime.nullCheck(lhs.root, this.root);
            lhs.root[lhs.index] = value;
        }
        delete(ctx, lhs) {
            if (this.andBefore || this.andAfter) throw new Error("Cannot remove a slice - use a single index");
            ctx.meta.runtime.nullCheck(lhs.root, this.root);
            var runtime2 = ctx.meta.runtime;
            var root = lhs.root;
            var idx = lhs.index;
            if (Array.isArray(root)) {
                if (idx < 0) idx = root.length + idx;
                root.splice(idx, 1);
            } else delete root[idx];
            runtime2.notifyMutation(root);
        }
    };
    var MathOperator = class _MathOperator extends Expression {
        static grammarName = "mathOperator";
        constructor(lhs, operator, rhs){
            super();
            this.lhs = lhs;
            this.rhs = rhs;
            this.operator = operator;
            this.args = {
                lhs: lhs,
                rhs: rhs
            };
        }
        static parse(parser) {
            var expr = parser.parseElement("collectionExpression");
            var mathOp, initialMathOp = null;
            mathOp = parser.matchAnyOpToken("+", "-", "*", "/") || parser.matchToken("mod");
            while(mathOp){
                initialMathOp = initialMathOp || mathOp;
                var operator = mathOp.value;
                if (initialMathOp.value !== operator) parser.raiseError("You must parenthesize math operations with different operators");
                var rhs = parser.parseElement("collectionExpression");
                expr = new _MathOperator(expr, operator, rhs);
                mathOp = parser.matchAnyOpToken("+", "-", "*", "/") || parser.matchToken("mod");
            }
            return expr;
        }
        resolve(context, { lhs: lhsVal, rhs: rhsVal }) {
            if (this.operator === "+") {
                if (Array.isArray(lhsVal)) return lhsVal.concat(rhsVal);
                return lhsVal + rhsVal;
            } else if (this.operator === "-") return lhsVal - rhsVal;
            else if (this.operator === "*") return lhsVal * rhsVal;
            else if (this.operator === "/") return lhsVal / rhsVal;
            else if (this.operator === "mod") return lhsVal % rhsVal;
        }
    };
    var ComparisonOperator = class _ComparisonOperator extends Expression {
        static grammarName = "comparisonOperator";
        constructor(lhs, operator, rhs, typeName, nullOk, ignoringCase, rhs2){
            super();
            this.operator = operator;
            this.typeName = typeName;
            this.nullOk = nullOk;
            this.ignoringCase = ignoringCase;
            this.lhs = lhs;
            this.rhs = rhs;
            this.rhs2 = rhs2;
            this.args = {
                lhs: lhs,
                rhs: rhs,
                rhs2: rhs2
            };
        }
        sloppyContains(src, container, value) {
            if (container["contains"]) return container.contains(value);
            else if (container["includes"]) return container.includes(value);
            else throw new Error("The value of " + src.sourceFor() + " does not have a contains or includes method on it");
        }
        sloppyMatches(src, target, toMatch) {
            if (target["match"]) return !!target.match(toMatch);
            else if (target["matches"]) return target.matches(toMatch);
            else throw new Error("The value of " + src.sourceFor() + " does not have a match or matches method on it");
        }
        static parse(parser) {
            var expr = parser.parseElement("mathOperator");
            var comparisonToken = parser.matchAnyOpToken("<", ">", "<=", ">=", "==", "===", "!=", "!==");
            var operator = comparisonToken ? comparisonToken.value : null;
            var hasRightValue = true;
            var typeCheck = false;
            if (operator == null) {
                if (parser.matchToken("is") || parser.matchToken("am")) {
                    if (parser.matchToken("not")) {
                        if (parser.matchToken("in")) operator = "not in";
                        else if (parser.matchToken("a") || parser.matchToken("an")) {
                            operator = "not a";
                            typeCheck = true;
                        } else if (parser.matchToken("empty")) {
                            operator = "not empty";
                            hasRightValue = false;
                        } else if (parser.matchToken("between")) operator = "not between";
                        else if (parser.matchToken("really")) {
                            operator = "!==";
                            if (parser.matchToken("equal")) parser.matchToken("to");
                        } else if (parser.matchToken("equal")) {
                            parser.matchToken("to");
                            operator = "!=";
                        } else operator = "is not";
                    } else if (parser.matchToken("in")) operator = "in";
                    else if (parser.matchToken("a") || parser.matchToken("an")) {
                        operator = "a";
                        typeCheck = true;
                    } else if (parser.matchToken("empty")) {
                        operator = "empty";
                        hasRightValue = false;
                    } else if (parser.matchToken("between")) operator = "between";
                    else if (parser.matchToken("less")) {
                        parser.requireToken("than");
                        if (parser.matchToken("or")) {
                            parser.requireToken("equal");
                            parser.requireToken("to");
                            operator = "<=";
                        } else operator = "<";
                    } else if (parser.matchToken("greater")) {
                        parser.requireToken("than");
                        if (parser.matchToken("or")) {
                            parser.requireToken("equal");
                            parser.requireToken("to");
                            operator = ">=";
                        } else operator = ">";
                    } else if (parser.matchToken("really")) {
                        operator = "===";
                        if (parser.matchToken("equal")) parser.matchToken("to");
                    } else if (parser.matchToken("equal")) {
                        parser.matchToken("to");
                        operator = "==";
                    } else operator = "is";
                } else if (parser.matchToken("equals")) operator = "==";
                else if (parser.matchToken("really")) {
                    parser.requireToken("equals");
                    operator = "===";
                } else if (parser.matchToken("exist") || parser.matchToken("exists")) {
                    operator = "exist";
                    hasRightValue = false;
                } else if (parser.matchToken("matches") || parser.matchToken("match")) operator = "match";
                else if (parser.matchToken("contains") || parser.matchToken("contain")) operator = "contain";
                else if (parser.matchToken("includes") || parser.matchToken("include")) operator = "include";
                else if (parser.matchToken("starts")) {
                    parser.requireToken("with");
                    operator = "start with";
                } else if (parser.matchToken("ends")) {
                    parser.requireToken("with");
                    operator = "end with";
                } else if (parser.matchToken("precedes") || parser.matchToken("precede")) operator = "precede";
                else if (parser.matchToken("follows") || parser.matchToken("follow")) operator = "follow";
                else if (parser.matchToken("do") || parser.matchToken("does")) {
                    parser.requireToken("not");
                    if (parser.matchToken("matches") || parser.matchToken("match")) operator = "not match";
                    else if (parser.matchToken("contains") || parser.matchToken("contain")) operator = "not contain";
                    else if (parser.matchToken("exist")) {
                        operator = "not exist";
                        hasRightValue = false;
                    } else if (parser.matchToken("include")) operator = "not include";
                    else if (parser.matchToken("start")) {
                        parser.requireToken("with");
                        operator = "not start with";
                    } else if (parser.matchToken("end")) {
                        parser.requireToken("with");
                        operator = "not end with";
                    } else if (parser.matchToken("precede")) operator = "not precede";
                    else if (parser.matchToken("follow")) operator = "not follow";
                    else parser.raiseExpected("matches", "contains", "starts with", "ends with", "precede", "follow");
                }
            }
            if (operator) {
                var typeName, nullOk, rhs;
                if (typeCheck) {
                    typeName = parser.requireTokenType("IDENTIFIER");
                    nullOk = !parser.matchOpToken("!");
                } else if (hasRightValue) {
                    rhs = parser.requireElement("mathOperator");
                    if (operator === "match" || operator === "not match") rhs = rhs.css ? rhs.css : rhs;
                }
                var rhs2 = null;
                if (operator === "between" || operator === "not between") {
                    parser.requireToken("and");
                    rhs2 = parser.requireElement("mathOperator");
                }
                var ignoringCase = false;
                if (parser.matchToken("ignoring")) {
                    parser.requireToken("case");
                    ignoringCase = true;
                }
                var lhs = expr;
                expr = new _ComparisonOperator(lhs, operator, rhs, typeName, nullOk, ignoringCase, rhs2);
            }
            return expr;
        }
        resolve(context, { lhs: lhsVal, rhs: rhsVal, rhs2: rhs2Val }) {
            const operator = this.operator;
            const lhs = this.lhs;
            const rhs = this.rhs;
            const typeName = this.typeName;
            const nullOk = this.nullOk;
            if (this.ignoringCase) {
                if (typeof lhsVal === "string") lhsVal = lhsVal.toLowerCase();
                if (typeof rhsVal === "string") rhsVal = rhsVal.toLowerCase();
            }
            if (operator === "is") {
                if (rhsVal === void 0 && rhs.type === "symbol" && rhs.scope === "local" && rhs.name !== "undefined" && rhs.name !== "null") return !!context.meta.runtime.resolveProperty(lhsVal, rhs.name);
                return lhsVal == rhsVal;
            }
            if (operator === "is not") {
                if (rhsVal === void 0 && rhs.type === "symbol" && rhs.scope === "local" && rhs.name !== "undefined" && rhs.name !== "null") return !context.meta.runtime.resolveProperty(lhsVal, rhs.name);
                return lhsVal != rhsVal;
            }
            if (operator === "==") return lhsVal == rhsVal;
            if (operator === "!=") return lhsVal != rhsVal;
            if (operator === "===") return lhsVal === rhsVal;
            if (operator === "!==") return lhsVal !== rhsVal;
            if (operator === "<") return lhsVal < rhsVal;
            if (operator === ">") return lhsVal > rhsVal;
            if (operator === "<=") return lhsVal <= rhsVal;
            if (operator === ">=") return lhsVal >= rhsVal;
            if (operator === "match") return lhsVal != null && this.sloppyMatches(lhs, lhsVal, rhsVal);
            if (operator === "not match") return lhsVal == null || !this.sloppyMatches(lhs, lhsVal, rhsVal);
            if (operator === "in") return rhsVal != null && this.sloppyContains(rhs, rhsVal, lhsVal);
            if (operator === "not in") return rhsVal == null || !this.sloppyContains(rhs, rhsVal, lhsVal);
            if (operator === "contain" || operator === "include") return lhsVal != null && this.sloppyContains(lhs, lhsVal, rhsVal);
            if (operator === "not contain" || operator === "not include") return lhsVal == null || !this.sloppyContains(lhs, lhsVal, rhsVal);
            if (operator === "start with") return lhsVal != null && String(lhsVal).startsWith(rhsVal);
            if (operator === "not start with") return lhsVal == null || !String(lhsVal).startsWith(rhsVal);
            if (operator === "end with") return lhsVal != null && String(lhsVal).endsWith(rhsVal);
            if (operator === "not end with") return lhsVal == null || !String(lhsVal).endsWith(rhsVal);
            if (operator === "between") return lhsVal >= rhsVal && lhsVal <= rhs2Val;
            if (operator === "not between") return lhsVal < rhsVal || lhsVal > rhs2Val;
            if (operator === "precede") return lhsVal != null && rhsVal != null && (lhsVal.compareDocumentPosition(rhsVal) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
            if (operator === "not precede") return lhsVal == null || rhsVal == null || (lhsVal.compareDocumentPosition(rhsVal) & Node.DOCUMENT_POSITION_FOLLOWING) === 0;
            if (operator === "follow") return lhsVal != null && rhsVal != null && (lhsVal.compareDocumentPosition(rhsVal) & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
            if (operator === "not follow") return lhsVal == null || rhsVal == null || (lhsVal.compareDocumentPosition(rhsVal) & Node.DOCUMENT_POSITION_PRECEDING) === 0;
            if (operator === "empty") return context.meta.runtime.isEmpty(lhsVal);
            if (operator === "not empty") return !context.meta.runtime.isEmpty(lhsVal);
            if (operator === "exist") return context.meta.runtime.doesExist(lhsVal);
            if (operator === "not exist") return !context.meta.runtime.doesExist(lhsVal);
            if (operator === "a") return context.meta.runtime.typeCheck(lhsVal, typeName.value, nullOk);
            if (operator === "not a") return !context.meta.runtime.typeCheck(lhsVal, typeName.value, nullOk);
            throw new Error("Unknown comparison : " + operator);
        }
    };
    var LogicalOperator = class _LogicalOperator extends Expression {
        static grammarName = "logicalOperator";
        static expressionType = "top";
        constructor(lhs, operator, rhs){
            super();
            this.operator = operator;
            this.lhs = lhs;
            this.rhs = rhs;
            this.args = {
                lhs: lhs,
                rhs: rhs
            };
        }
        static parse(parser) {
            var expr = parser.parseElement("comparisonOperator");
            var logicalOp, initialLogicalOp = null;
            logicalOp = parser.matchToken("and") || parser.matchToken("or");
            while(logicalOp){
                initialLogicalOp = initialLogicalOp || logicalOp;
                if (initialLogicalOp.value !== logicalOp.value) parser.raiseError("You must parenthesize logical operations with different operators");
                var rhs = parser.requireElement("comparisonOperator");
                const operator = logicalOp.value;
                expr = new _LogicalOperator(expr, operator, rhs);
                logicalOp = parser.matchToken("and") || parser.matchToken("or");
            }
            return expr;
        }
        resolve(context, { lhs: lhsVal, rhs: rhsVal }) {
            if (this.operator === "and") return lhsVal && rhsVal;
            else return lhsVal || rhsVal;
        }
        // override to handle promise-compatible and/or short-circuiting
        evaluate(context) {
            var self2 = this;
            var shortCircuitValue = this.operator === "or";
            var lhsVal = this.lhs.evaluate(context);
            var continueWith = function(resolvedLhs) {
                if (!!resolvedLhs === shortCircuitValue) return resolvedLhs;
                var rhsVal = self2.rhs.evaluate(context);
                if (rhsVal && rhsVal.then) return rhsVal.then((r)=>self2.resolve(context, {
                        lhs: resolvedLhs,
                        rhs: r
                    }));
                return self2.resolve(context, {
                    lhs: resolvedLhs,
                    rhs: rhsVal
                });
            };
            if (lhsVal && lhsVal.then) return lhsVal.then(continueWith);
            return continueWith(lhsVal);
        }
    };
    var DotOrColonPathNode = class extends Expression {
        constructor(path, separator){
            super();
            this.type = "dotOrColonPath";
            this.path = path;
            this.separator = separator;
        }
        evalStatically() {
            return this.path.join(this.separator ? this.separator : "");
        }
        resolve() {
            return this.evalStatically();
        }
    };
    var CollectionExpression = class extends Expression {
        static grammarName = "collectionExpression";
        static KEYWORDS = [
            "where",
            "sorted",
            "mapped",
            "split",
            "joined"
        ];
        static parseOperand(parser) {
            var count = parser.pushFollows(...this.KEYWORDS);
            try {
                return parser.requireElement("expression");
            } finally{
                parser.popFollows(count);
            }
        }
        static parse(parser) {
            var root = parser.parseElement("unaryExpression");
            var changed = true;
            while(changed){
                changed = false;
                if (parser.matchToken("where")) {
                    root = new WhereExpression(root, this.parseOperand(parser));
                    changed = true;
                } else if (parser.matchToken("sorted")) {
                    parser.requireToken("by");
                    var key = this.parseOperand(parser);
                    var descending = parser.matchToken("descending");
                    root = new SortedByExpression(root, key, !!descending);
                    changed = true;
                } else if (parser.matchToken("mapped")) {
                    parser.requireToken("to");
                    root = new MappedToExpression(root, this.parseOperand(parser));
                    changed = true;
                } else if (parser.matchToken("split")) {
                    parser.requireToken("by");
                    root = new SplitByExpression(root, this.parseOperand(parser));
                    changed = true;
                } else if (parser.matchToken("joined")) {
                    parser.requireToken("by");
                    root = new JoinedByExpression(root, this.parseOperand(parser));
                    changed = true;
                }
            }
            return root;
        }
    };
    var WhereExpression = class extends Expression {
        constructor(root, condition){
            super();
            this.root = root;
            this.condition = condition;
            this.args = {
                root: root
            };
        }
        resolve(context, { root: collection }) {
            if (!collection) return collection;
            var result = [];
            var items = Array.from(collection);
            for(var i = 0; i < items.length; i++){
                context.beingTested = items[i];
                if (this.varName) context.locals[this.varName] = items[i];
                if (this.condition.evaluate(context)) result.push(items[i]);
            }
            context.beingTested = null;
            return result;
        }
    };
    var SortedByExpression = class extends Expression {
        constructor(root, key, descending){
            super();
            this.root = root;
            this.key = key;
            this.descending = descending;
            this.args = {
                root: root
            };
        }
        resolve(context, { root: collection }) {
            if (!collection) return collection;
            var items = Array.from(collection);
            var keys = [];
            for(var i = 0; i < items.length; i++){
                context.beingTested = items[i];
                keys.push(this.key.evaluate(context));
            }
            context.beingTested = null;
            var indices = items.map(function(_, i2) {
                return i2;
            });
            var dir = this.descending ? -1 : 1;
            indices.sort(function(a, b) {
                var ka = keys[a], kb = keys[b];
                if (ka == kb) return 0;
                return (ka < kb ? -1 : 1) * dir;
            });
            return indices.map(function(i2) {
                return items[i2];
            });
        }
    };
    var MappedToExpression = class extends Expression {
        constructor(root, projection){
            super();
            this.root = root;
            this.projection = projection;
            this.args = {
                root: root
            };
        }
        resolve(context, { root: collection }) {
            if (!collection) return collection;
            var items = Array.from(collection);
            var result = [];
            for(var i = 0; i < items.length; i++){
                context.beingTested = items[i];
                result.push(this.projection.evaluate(context));
            }
            context.beingTested = null;
            return result;
        }
    };
    var SplitByExpression = class extends Expression {
        constructor(root, delimiter){
            super();
            this.args = {
                root: root,
                delimiter: delimiter
            };
        }
        resolve(context, { root: root, delimiter: delimiter }) {
            if (!root) return root;
            return String(root).split(delimiter);
        }
    };
    var JoinedByExpression = class extends Expression {
        constructor(root, delimiter){
            super();
            this.args = {
                root: root,
                delimiter: delimiter
            };
        }
        resolve(context, { root: root, delimiter: delimiter }) {
            if (!root) return root;
            return Array.from(root).join(delimiter);
        }
    };
    var DotOrColonPath = class extends Expression {
        static grammarName = "dotOrColonPath";
        static parse(parser) {
            var root = parser.matchTokenType("IDENTIFIER");
            if (root) {
                var path = [
                    root.value
                ];
                var separator = parser.matchOpToken(".") || parser.matchOpToken(":");
                if (separator) do path.push(parser.requireTokenType("IDENTIFIER", "NUMBER").value);
                while (parser.matchOpToken(separator.value));
                return new DotOrColonPathNode(path, separator ? separator.value : null);
            }
        }
    };
    // src/parsetree/expressions/webliterals.js
    var webliterals_exports = {};
    __export(webliterals_exports, {
        AttributeRef: ()=>AttributeRef,
        ClassRef: ()=>ClassRef,
        IdRef: ()=>IdRef,
        QueryRef: ()=>QueryRef,
        StyleLiteral: ()=>StyleLiteral,
        StyleRef: ()=>StyleRef
    });
    var IdRef = class _IdRef extends Expression {
        static grammarName = "idRef";
        static expressionType = "leaf";
        static assignable = true;
        constructor(variant, css, value, innerExpression){
            super();
            this.variant = variant;
            this.type = variant === "template" ? "idRefTemplate" : "idRef";
            this.css = css;
            this.value = value;
            this.args = variant === "template" ? {
                expr: innerExpression
            } : null;
        }
        static parse(parser) {
            var elementId = parser.matchTokenType("ID_REF");
            if (!elementId) return;
            if (!elementId.value) return;
            if (elementId.template) {
                var templateValue = elementId.value.substring(2);
                var innerTokens = Tokenizer.tokenize(templateValue);
                var innerParser = parser.createChildParser(innerTokens);
                var innerExpression = innerParser.requireElement("expression");
                return new _IdRef("template", null, null, innerExpression);
            } else {
                const value = elementId.value.substring(1);
                return new _IdRef("static", elementId.value, value, null);
            }
        }
        resolve(context, { expr: expr } = {}) {
            if (this.variant === "template") return context.meta.runtime.getRootNode(context.me).getElementById(expr);
            else return context.meta.runtime.getRootNode(context.me).getElementById(this.value);
        }
        get lhs() {
            return {};
        }
        set(ctx, lhs, value) {
            var target = this.resolve(ctx);
            if (target) ctx.meta.runtime.replaceInDom(target, value);
        }
    };
    var ClassRef = class _ClassRef extends Expression {
        static grammarName = "classRef";
        static expressionType = "leaf";
        static assignable = true;
        constructor(variant, css, className, innerExpression){
            super();
            this.variant = variant;
            this.type = variant === "template" ? "classRefTemplate" : "classRef";
            this.css = css;
            this.className = className;
            this.args = variant === "template" ? {
                expr: innerExpression
            } : null;
        }
        static parse(parser) {
            var classRef = parser.matchTokenType("CLASS_REF");
            if (!classRef) return;
            if (!classRef.value) return;
            if (classRef.template) {
                var templateValue = classRef.value.substring(2);
                var innerTokens = Tokenizer.tokenize(templateValue);
                var innerParser = parser.createChildParser(innerTokens);
                var innerExpression = innerParser.requireElement("expression");
                return new _ClassRef("template", null, null, innerExpression);
            } else {
                const css = classRef.value;
                const className = css.slice(1);
                return new _ClassRef("static", css, className, null);
            }
        }
        resolve(context, { expr: expr } = {}) {
            if (this.variant === "template") return new ElementCollection("." + expr, context.me, true, context.meta.runtime);
            else return new ElementCollection(this.css, context.me, true, context.meta.runtime);
        }
        get lhs() {
            return {};
        }
        set(ctx, lhs, value) {
            var targets = Array.from(this.resolve(ctx));
            ctx.meta.runtime.replaceInDom(targets, value);
        }
    };
    var QueryRef = class _QueryRef extends Expression {
        static grammarName = "queryRef";
        static expressionType = "leaf";
        static assignable = true;
        constructor(css, args, template){
            super();
            this.css = css;
            this.templateArgs = args;
            this.args = template ? {
                parts: args
            } : null;
            this.template = template;
        }
        static parse(parser) {
            var queryStart = parser.matchOpToken("<");
            if (!queryStart) return;
            var queryTokens = parser.consumeUntil("/");
            parser.requireOpToken("/");
            parser.requireOpToken(">");
            var queryValue = queryTokens.map(function(t) {
                if (t.type === "STRING") return '"' + t.value + '"';
                else return t.value;
            }).join("");
            var template, innerTokens, args;
            if (/\$[^=]/.test(queryValue)) {
                template = true;
                innerTokens = Tokenizer.tokenize(queryValue, true);
                var innerParser = parser.createChildParser(innerTokens);
                args = innerParser.parseStringTemplate();
            }
            return new _QueryRef(queryValue, args, template);
        }
        resolve(context, { parts: parts } = {}) {
            if (this.template) return new TemplatedQueryElementCollection(this.css, context.me, parts, context.meta.runtime);
            else return new ElementCollection(this.css, context.me, false, context.meta.runtime);
        }
        get lhs() {
            return this.template ? {
                parts: this.templateArgs
            } : {};
        }
        set(ctx, lhs, value) {
            var targets = Array.from(this.resolve(ctx, lhs));
            ctx.meta.runtime.replaceInDom(targets, value);
        }
    };
    var AttributeRef = class _AttributeRef extends Expression {
        static grammarName = "attributeRef";
        static expressionType = "leaf";
        static assignable = true;
        constructor(name, css, value){
            super();
            this.name = name;
            this.css = css;
            this.value = value;
        }
        static parse(parser) {
            var attributeRef = parser.matchTokenType("ATTRIBUTE_REF");
            if (!attributeRef) return;
            if (!attributeRef.value) return;
            var outerVal = attributeRef.value;
            if (outerVal.startsWith("[")) var innerValue = outerVal.substring(2, outerVal.length - 1);
            else var innerValue = outerVal.substring(1);
            var css = "[" + innerValue + "]";
            var split = innerValue.split("=");
            var name = split[0];
            var value = split[1];
            if (value) {
                if (value.startsWith('"') || value.startsWith("'")) value = value.substring(1, value.length - 1);
            }
            return new _AttributeRef(name, css, value);
        }
        resolve(context) {
            var target = context.you || context.me;
            if (target) return context.meta.runtime.resolveAttribute(target, this.name);
        }
        get lhs() {
            return {};
        }
        set(ctx, lhs, value) {
            var target = ctx.you || ctx.me;
            if (target) value == null ? target.removeAttribute(this.name) : target.setAttribute(this.name, value);
        }
    };
    var StyleRef = class _StyleRef extends Expression {
        static grammarName = "styleRef";
        static expressionType = "leaf";
        static assignable = true;
        constructor(variant, name){
            super();
            this.variant = variant;
            this.type = variant === "computed" ? "computedStyleRef" : "styleRef";
            this.name = name;
        }
        static parse(parser) {
            var styleRef = parser.matchTokenType("STYLE_REF");
            if (!styleRef) return;
            if (!styleRef.value) return;
            var styleProp = styleRef.value.slice(1);
            if (styleProp.startsWith("computed-")) {
                styleProp = styleProp.slice(9);
                return new _StyleRef("computed", styleProp);
            } else return new _StyleRef("style", styleProp);
        }
        resolve(context) {
            var target = context.you || context.me;
            if (target) {
                if (this.variant === "computed") return context.meta.runtime.resolveComputedStyle(target, this.name);
                else return context.meta.runtime.resolveStyle(target, this.name);
            }
        }
        get lhs() {
            return {};
        }
        set(ctx, lhs, value) {
            var target = ctx.you || ctx.me;
            if (target) target.style[this.name] = value;
        }
    };
    var StyleLiteral = class _StyleLiteral extends Expression {
        static grammarName = "styleLiteral";
        constructor(stringParts, exprs){
            super();
            this.stringParts = stringParts;
            this.args = {
                exprs: exprs
            };
        }
        static parse(parser) {
            if (!parser.matchOpToken("{")) return;
            var stringParts = [
                ""
            ];
            var exprs = [];
            while(parser.hasMore()){
                if (parser.matchOpToken("\\")) parser.consumeToken();
                else if (parser.matchOpToken("}")) break;
                else if (parser.matchToken("$")) {
                    var opencurly = parser.matchOpToken("{");
                    var expr = parser.parseElement("expression");
                    if (opencurly) parser.requireOpToken("}");
                    exprs.push(expr);
                    stringParts.push("");
                } else {
                    var tok = parser.consumeToken();
                    stringParts[stringParts.length - 1] += parser.source.substring(tok.start, tok.end);
                }
                stringParts[stringParts.length - 1] += parser.lastWhitespace();
            }
            return new _StyleLiteral(stringParts, exprs);
        }
        resolve(ctx, { exprs: exprs }) {
            var rv = "";
            const stringParts = this.stringParts;
            stringParts.forEach(function(part, idx) {
                rv += part;
                if (idx in exprs) rv += exprs[idx];
            });
            return rv;
        }
    };
    // src/parsetree/expressions/postfix.js
    var postfix_exports = {};
    __export(postfix_exports, {
        StringPostfixExpression: ()=>StringPostfixExpression,
        TimeExpression: ()=>TimeExpression,
        TypeCheckExpression: ()=>TypeCheckExpression
    });
    var STRING_POSTFIXES = [
        "em",
        "ex",
        "cap",
        "ch",
        "ic",
        "rem",
        "lh",
        "rlh",
        "vw",
        "vh",
        "vi",
        "vb",
        "vmin",
        "vmax",
        "cm",
        "mm",
        "Q",
        "pc",
        "pt",
        "px"
    ];
    var StringPostfixExpression = class _StringPostfixExpression extends Expression {
        static grammarName = "stringPostfixExpression";
        static expressionType = "postfix";
        constructor(root, postfix){
            super();
            this.postfix = postfix;
            this.args = {
                value: root
            };
        }
        static parse(parser, root) {
            let stringPostfix = parser.matchAnyToken(...STRING_POSTFIXES) || parser.matchOpToken("%");
            if (!stringPostfix) return;
            return new _StringPostfixExpression(root, stringPostfix.value);
        }
        resolve(context, { value: val }) {
            return "" + val + this.postfix;
        }
    };
    var TimeExpression = class _TimeExpression extends Expression {
        static grammarName = "timeExpression";
        static expressionType = "postfix";
        constructor(root, timeFactor){
            super();
            this.time = root;
            this.factor = timeFactor;
            this.args = {
                value: root
            };
        }
        static parse(parser, root) {
            var timeFactor = null;
            if (parser.matchToken("s") || parser.matchToken("seconds")) timeFactor = 1e3;
            else if (parser.matchToken("ms") || parser.matchToken("milliseconds")) timeFactor = 1;
            if (!timeFactor) return;
            return new _TimeExpression(root, timeFactor);
        }
        evalStatically() {
            return this.time.evalStatically() * this.factor;
        }
        resolve(context, { value: val }) {
            return val * this.factor;
        }
    };
    var TypeCheckExpression = class _TypeCheckExpression extends Expression {
        static grammarName = "typeCheckExpression";
        static expressionType = "postfix";
        constructor(root, typeName, nullOk){
            super();
            this.typeName = typeName;
            this.nullOk = nullOk;
            this.args = {
                value: root
            };
        }
        static parse(parser, root) {
            if (!parser.matchOpToken(":")) return;
            var typeName = parser.requireTokenType("IDENTIFIER");
            if (!typeName.value) return;
            var nullOk = !parser.matchOpToken("!");
            return new _TypeCheckExpression(root, typeName, nullOk);
        }
        resolve(context, { value: val }) {
            var passed = context.meta.runtime.typeCheck(val, this.typeName.value, this.nullOk);
            if (passed) return val;
            else throw new Error("Typecheck failed!  Expected: " + this.typeName.value);
        }
    };
    // src/parsetree/expressions/positional.js
    var positional_exports = {};
    __export(positional_exports, {
        ClosestExpr: ()=>ClosestExpr,
        PositionalExpression: ()=>PositionalExpression,
        RelativePositionalExpression: ()=>RelativePositionalExpression
    });
    var RelativePositionalExpression = class _RelativePositionalExpression extends Expression {
        static grammarName = "relativePositionalExpression";
        static expressionType = "unary";
        constructor(thingElt, from, forwardSearch, inSearch, wrapping, inElt, withinElt, operator){
            super();
            this.thingElt = thingElt;
            this.from = from;
            this.forwardSearch = forwardSearch;
            this.inSearch = inSearch;
            this.wrapping = wrapping;
            this.inElt = inElt;
            this.withinElt = withinElt;
            this.operator = operator;
            this.args = {
                thing: thingElt,
                from: from,
                inElt: inElt,
                withinElt: withinElt
            };
        }
        static parse(parser) {
            var op = parser.matchAnyToken("next", "previous");
            if (!op) return;
            var forwardSearch = op.value === "next";
            var thingElt = parser.parseElement("leaf");
            if (parser.matchToken("from")) {
                parser.pushFollow("in");
                try {
                    var from = parser.requireElement("unaryExpression");
                } finally{
                    parser.popFollow();
                }
            } else var from = parser.requireElement("implicitMeTarget");
            var inSearch = false;
            var withinElt;
            if (parser.matchToken("in")) {
                inSearch = true;
                var inElt = parser.requireElement("unaryExpression");
            } else if (parser.matchToken("within")) withinElt = parser.requireElement("unaryExpression");
            else withinElt = null;
            var wrapping = false;
            if (parser.matchToken("with")) {
                parser.requireToken("wrapping");
                wrapping = true;
            }
            return new _RelativePositionalExpression(thingElt, from, forwardSearch, inSearch, wrapping, inElt, withinElt, op.value);
        }
        scanForwardQuery(start, root, match, wrap) {
            var results = root.querySelectorAll(match);
            for(var i = 0; i < results.length; i++){
                var elt = results[i];
                if (elt.compareDocumentPosition(start) === Node.DOCUMENT_POSITION_PRECEDING) return elt;
            }
            if (wrap) return results[0];
        }
        scanBackwardsQuery(start, root, match, wrap) {
            var results = root.querySelectorAll(match);
            for(var i = results.length - 1; i >= 0; i--){
                var elt = results[i];
                if (elt.compareDocumentPosition(start) === Node.DOCUMENT_POSITION_FOLLOWING) return elt;
            }
            if (wrap) return results[results.length - 1];
        }
        scanForwardArray(start, array, match, wrap) {
            var matches = [];
            for (var elt of array)if (elt.matches(match) || elt === start) matches.push(elt);
            for(var i = 0; i < matches.length - 1; i++){
                var elt = matches[i];
                if (elt === start) return matches[i + 1];
            }
            if (wrap) {
                var first = matches[0];
                if (first && first.matches(match)) return first;
            }
        }
        scanBackwardsArray(start, array, match, wrap) {
            return this.scanForwardArray(start, Array.from(array).reverse(), match, wrap);
        }
        resolve(context, { thing: thing, from: from, inElt: inElt, withinElt: withinElt }) {
            var css = thing.css;
            if (css == null) throw new Error("Expected a CSS value to be returned by " + this.thingElt.sourceFor());
            if (this.inSearch) {
                if (inElt) {
                    if (this.forwardSearch) return this.scanForwardArray(from, inElt, css, this.wrapping);
                    else return this.scanBackwardsArray(from, inElt, css, this.wrapping);
                }
            } else {
                var root = withinElt ?? document.body;
                if (this.forwardSearch) return this.scanForwardQuery(from, root, css, this.wrapping);
                else return this.scanBackwardsQuery(from, root, css, this.wrapping);
            }
        }
    };
    var PositionalExpression = class _PositionalExpression extends Expression {
        static grammarName = "positionalExpression";
        static expressionType = "unary";
        constructor(rhs, operator){
            super();
            this.rhs = rhs;
            this.operator = operator;
            this.args = {
                value: rhs
            };
        }
        static parse(parser) {
            var op = parser.matchAnyToken("first", "last", "random");
            if (!op) return;
            parser.matchAnyToken("in", "from", "of");
            var rhs = parser.requireElement("unaryExpression");
            return new _PositionalExpression(rhs, op.value);
        }
        resolve(context, { value: rhsVal }) {
            if (rhsVal && !Array.isArray(rhsVal)) {
                if (rhsVal.children) rhsVal = rhsVal.children;
                else rhsVal = Array.from(rhsVal);
            }
            if (rhsVal) {
                if (this.operator === "first") return rhsVal[0];
                else if (this.operator === "last") return rhsVal[rhsVal.length - 1];
                else if (this.operator === "random") return rhsVal[Math.floor(Math.random() * rhsVal.length)];
            }
        }
    };
    var ClosestExprNode = class extends Expression {
        constructor(parentSearch, expr, css, to){
            super();
            this.type = "closestExpr";
            this.parentSearch = parentSearch;
            this.expr = expr;
            this.css = css;
            this.to = to;
            this.args = {
                to: to
            };
        }
        resolve(ctx, { to: to }) {
            if (to == null) return null;
            let result = [];
            const css = this.css;
            const parentSearch = this.parentSearch;
            ctx.meta.runtime.implicitLoop(to, function(to2) {
                if (parentSearch) result.push(to2.parentElement ? to2.parentElement.closest(css) : null);
                else result.push(to2.closest(css));
            });
            return ctx.meta.runtime.shouldAutoIterate(to) ? result : result[0];
        }
        get lhs() {
            return {
                to: this.to
            };
        }
        set(ctx, lhs, value) {
            var target = this.resolve(ctx, lhs);
            if (target) ctx.meta.runtime.replaceInDom(target, value);
        }
    };
    var ClosestExpr = class extends Expression {
        static grammarName = "closestExpr";
        static expressionType = "leaf";
        static assignable = true;
        static parse(parser) {
            if (!parser.matchToken("closest")) return;
            var parentSearch = false;
            if (parser.matchToken("parent")) parentSearch = true;
            var css = null;
            var attributeRef = null;
            if (parser.currentToken().type === "ATTRIBUTE_REF") {
                attributeRef = parser.requireElement("attributeRefAccess", null);
                css = "[" + attributeRef.attribute.name + "]";
            }
            if (css == null) {
                var expr = parser.requireElement("unaryExpression");
                if (expr.css == null) parser.raiseError("Expected a CSS expression");
                else css = expr.css;
            }
            if (parser.matchToken("to")) var to = parser.parseElement("expression");
            else var to = parser.parseElement("implicitMeTarget");
            var closestExpr = new ClosestExprNode(parentSearch, expr, css, to);
            if (attributeRef) return new AttributeRefAccess(closestExpr, attributeRef.attribute);
            else return closestExpr;
        }
    };
    // src/parsetree/expressions/existentials.js
    var existentials_exports = {};
    __export(existentials_exports, {
        NoExpression: ()=>NoExpression,
        SomeExpression: ()=>SomeExpression
    });
    var NoExpression = class _NoExpression extends Expression {
        static grammarName = "noExpression";
        static expressionType = "unary";
        constructor(root){
            super();
            this.root = root;
            this.args = {
                value: root
            };
        }
        static parse(parser) {
            if (!parser.matchToken("no")) return;
            var root = parser.requireElement("collectionExpression");
            return new _NoExpression(root);
        }
        resolve(context, { value: val }) {
            return context.meta.runtime.isEmpty(val);
        }
    };
    var SomeExpression = class _SomeExpression extends Expression {
        static grammarName = "some";
        static expressionType = "leaf";
        constructor(root){
            super();
            this.root = root;
            this.args = {
                value: root
            };
        }
        static parse(parser) {
            if (!parser.matchToken("some")) return;
            var root = parser.requireElement("expression");
            return new _SomeExpression(root);
        }
        resolve(context, { value: val }) {
            return !context.meta.runtime.isEmpty(val);
        }
    };
    // src/parsetree/expressions/targets.js
    var targets_exports = {};
    __export(targets_exports, {
        ImplicitMeTarget: ()=>ImplicitMeTarget
    });
    var ImplicitMeTarget = class _ImplicitMeTarget extends Expression {
        static grammarName = "implicitMeTarget";
        constructor(){
            super();
        }
        static parse(parser) {
            return new _ImplicitMeTarget();
        }
        resolve(context) {
            return context.you || context.me;
        }
    };
    // src/parsetree/commands/basic.js
    var basic_exports = {};
    __export(basic_exports, {
        AppendCommand: ()=>AppendCommand,
        BeepCommand: ()=>BeepCommand,
        ExitCommand: ()=>ExitCommand,
        FetchCommand: ()=>FetchCommand,
        GoCommand: ()=>GoCommand,
        HaltCommand: ()=>HaltCommand,
        LogCommand: ()=>LogCommand,
        MakeCommand: ()=>MakeCommand,
        PickCommand: ()=>PickCommand,
        ReturnCommand: ()=>ReturnCommand,
        ScrollCommand: ()=>ScrollCommand,
        ThrowCommand: ()=>ThrowCommand
    });
    var ImplicitResultSymbol = class extends Expression {
        constructor(){
            super();
            this.type = "symbol";
        }
        resolve(context) {
            return context.meta.runtime.resolveSymbol("result", context);
        }
        get lhs() {
            return {};
        }
        set(ctx, lhs, value) {
            ctx.meta.runtime.setSymbol("result", ctx, null, value);
        }
    };
    var LogCommand = class _LogCommand extends Command {
        static keyword = "log";
        constructor(exprs, withExpr){
            super();
            this.exprs = exprs;
            this.withExpr = withExpr;
            this.args = {
                logger: withExpr,
                values: exprs
            };
        }
        static parse(parser) {
            if (!parser.matchToken("log")) return;
            var exprs = [
                parser.parseElement("expression")
            ];
            while(parser.matchOpToken(","))exprs.push(parser.requireElement("expression"));
            if (parser.matchToken("with")) var withExpr = parser.requireElement("expression");
            return new _LogCommand(exprs, withExpr);
        }
        resolve(ctx, { logger: logger, values: values }) {
            if (logger) logger(...values);
            else console.log(...values);
            return this.findNext(ctx);
        }
    };
    var BeepCommand = class _BeepCommand extends Command {
        static keyword = "beep!";
        constructor(exprs){
            super();
            this.exprs = exprs;
            this.args = {
                values: exprs
            };
        }
        static parse(parser) {
            if (!parser.matchToken("beep!")) return;
            var exprs = [
                parser.parseElement("expression")
            ];
            while(parser.matchOpToken(","))exprs.push(parser.requireElement("expression"));
            return new _BeepCommand(exprs);
        }
        resolve(ctx, { values: values }) {
            for(let i = 0; i < this.exprs.length; i++){
                const expr = this.exprs[i];
                const val = values[i];
                ctx.meta.runtime.beepValueToConsole(ctx.me, expr, val);
            }
            return this.findNext(ctx);
        }
    };
    var ThrowCommand = class _ThrowCommand extends Command {
        static keyword = "throw";
        constructor(expr){
            super();
            this.expr = expr;
            this.args = {
                value: expr
            };
        }
        static parse(parser) {
            if (!parser.matchToken("throw")) return;
            var expr = parser.requireElement("expression");
            return new _ThrowCommand(expr);
        }
        resolve(ctx, { value: value }) {
            ctx.meta.runtime.registerHyperTrace(ctx, value);
            throw value;
        }
    };
    var ReturnCommand = class _ReturnCommand extends Command {
        static keyword = "return";
        constructor(value){
            super();
            this.value = value;
            this.args = {
                value: value
            };
        }
        static parse(parser) {
            if (!parser.matchToken("return")) return;
            var value;
            if (!parser.commandBoundary(parser.currentToken())) value = parser.requireElement("expression");
            return new _ReturnCommand(value);
        }
        resolve(context, { value: value }) {
            var resolve = context.meta.resolve;
            context.meta.returned = true;
            context.meta.returnValue = value;
            if (resolve) resolve(value);
            return context.meta.runtime.HALT;
        }
    };
    var ExitCommand = class _ExitCommand extends Command {
        static keyword = "exit";
        static parse(parser) {
            if (!parser.matchToken("exit")) return;
            return new _ExitCommand();
        }
        resolve(context) {
            var resolve = context.meta.resolve;
            context.meta.returned = true;
            context.meta.returnValue = null;
            if (resolve) resolve();
            return context.meta.runtime.HALT;
        }
    };
    var HaltCommand = class _HaltCommand extends Command {
        static keyword = "halt";
        constructor(bubbling, haltDefault, keepExecuting, exit){
            super();
            this.keepExecuting = keepExecuting;
            this.bubbling = bubbling;
            this.haltDefault = haltDefault;
            this.exit = exit;
        }
        static parse(parser) {
            if (!parser.matchToken("halt")) return;
            if (parser.matchToken("the")) {
                parser.requireToken("event");
                if (parser.matchOpToken("'")) parser.requireToken("s");
                var keepExecuting = true;
            }
            if (parser.matchToken("bubbling")) var bubbling = true;
            else if (parser.matchToken("default")) var haltDefault = true;
            var exit = new ExitCommand();
            return new _HaltCommand(bubbling, haltDefault, keepExecuting, exit);
        }
        resolve(ctx) {
            if (ctx.event) {
                if (this.bubbling) ctx.event.stopPropagation();
                else if (this.haltDefault) ctx.event.preventDefault();
                else {
                    ctx.event.stopPropagation();
                    ctx.event.preventDefault();
                }
            }
            if (this.keepExecuting) return this.findNext(ctx);
            else return this.exit;
        }
    };
    var MakeCommand = class _MakeCommand extends Command {
        static keyword = "make";
        constructor(variant, expr, constructorArgs, target){
            super();
            this.variant = variant;
            this.expr = expr;
            this.constructorArgs = constructorArgs;
            this.target = target;
            this.args = variant === "queryRef" ? null : {
                expr: expr,
                constructorArgs: constructorArgs
            };
        }
        static parse(parser) {
            if (!parser.matchToken("make")) return;
            parser.matchToken("a") || parser.matchToken("an");
            var expr = parser.requireElement("expression");
            var args = [];
            if (expr.type !== "queryRef" && parser.matchToken("from")) do args.push(parser.requireElement("expression"));
            while (parser.matchOpToken(","));
            if (parser.matchToken("called")) var target = parser.requireElement("symbol");
            if (expr.type === "queryRef") return new _MakeCommand("queryRef", expr, null, target);
            else return new _MakeCommand("constructor", expr, args, target);
        }
        resolve(ctx, { expr: expr, constructorArgs: constructorArgs } = {}) {
            if (this.variant === "queryRef") {
                var match, tagname = "div", id, classes = [];
                var re = /(?:(^|#|\.)([^#\. ]+))/g;
                while(match = re.exec(this.expr.css)){
                    if (match[1] === "") tagname = match[2].trim();
                    else if (match[1] === "#") id = match[2].trim();
                    else classes.push(match[2].trim());
                }
                var result = document.createElement(tagname);
                if (id !== void 0) result.id = id;
                result.classList.add(...classes);
                ctx.result = result;
            } else ctx.result = new expr(...constructorArgs);
            if (this.target) ctx.meta.runtime.setSymbol(this.target.name, ctx, this.target.scope, ctx.result);
            return this.findNext(ctx);
        }
    };
    var AppendCommand = class _AppendCommand extends Command {
        static keyword = "append";
        constructor(value, targetExpr, assignable){
            super();
            this.value = value;
            this._target = targetExpr;
            this.assignable = assignable;
            if (assignable) this.args = {
                target: targetExpr,
                value: value,
                ...targetExpr.lhs
            };
            else this.args = {
                target: targetExpr,
                value: value
            };
        }
        static parse(parser) {
            if (!parser.matchToken("append")) return;
            var targetExpr = null;
            var value = parser.requireElement("expression");
            if (parser.matchToken("to")) targetExpr = parser.requireElement("expression");
            else targetExpr = new ImplicitResultSymbol();
            var checkTarget = targetExpr;
            while(checkTarget.type === "parenthesized")checkTarget = checkTarget.expr;
            var assignable = checkTarget.set != null;
            return new _AppendCommand(value, targetExpr, assignable);
        }
        resolve(context, args) {
            var { target: target, value: value, ...lhs } = args;
            if (Array.isArray(target)) {
                target.push(value);
                context.meta.runtime.notifyMutation(target);
            } else if (target instanceof Set) {
                target.add(value);
                context.meta.runtime.notifyMutation(target);
            } else if (target instanceof Element) {
                if (value instanceof Element) target.insertAdjacentElement("beforeend", value);
                else target.insertAdjacentHTML("beforeend", value);
                context.meta.runtime.processNode(target);
            } else if (this.assignable) this._target.set(context, lhs, (target || "") + value);
            else throw new Error("Unable to append a value!");
            return this.findNext(context);
        }
    };
    var PickCommand = class _PickCommand extends Command {
        static keyword = "pick";
        constructor(variant, root, range, re, flags, count){
            super();
            this.variant = variant;
            this.range = range;
            this.flags = flags;
            if (variant === "range") this.args = {
                root: root,
                from: range.from,
                to: range.to
            };
            else if (variant === "first" || variant === "last" || variant === "random") this.args = {
                root: root,
                count: count
            };
            else this.args = {
                root: root,
                re: re
            };
        }
        static parsePickRange(parser) {
            parser.matchToken("at") || parser.matchToken("from");
            var rv = {
                includeStart: true,
                includeEnd: false
            };
            rv.from = parser.matchToken("start") ? 0 : parser.requireElement("expression");
            if (parser.matchToken("to") || parser.matchOpToken("..")) {
                if (parser.matchToken("end")) rv.toEnd = true;
                else rv.to = parser.requireElement("expression");
            }
            if (parser.matchToken("inclusive")) rv.includeEnd = true;
            else if (parser.matchToken("exclusive")) rv.includeStart = false;
            return rv;
        }
        static parseSource(parser) {
            if (!parser.matchAnyToken("of", "from")) parser.raiseExpected("of", "from");
            return parser.requireElement("expression");
        }
        static parse(parser) {
            if (!parser.matchToken("pick")) return;
            parser.matchToken("the");
            if (parser.matchToken("first")) {
                var follows = parser.pushFollows("of", "from");
                try {
                    var count = parser.requireElement("expression");
                } finally{
                    parser.popFollows(follows);
                }
                var root = _PickCommand.parseSource(parser);
                return new _PickCommand("first", root, null, null, null, count);
            }
            if (parser.matchToken("last")) {
                var follows = parser.pushFollows("of", "from");
                try {
                    var count = parser.requireElement("expression");
                } finally{
                    parser.popFollows(follows);
                }
                var root = _PickCommand.parseSource(parser);
                return new _PickCommand("last", root, null, null, null, count);
            }
            if (parser.matchToken("random")) {
                var count = null;
                if (parser.currentToken().type === "NUMBER") {
                    var follows = parser.pushFollows("of", "from");
                    try {
                        count = parser.requireElement("expression");
                    } finally{
                        parser.popFollows(follows);
                    }
                }
                var root = _PickCommand.parseSource(parser);
                return new _PickCommand("random", root, null, null, null, count);
            }
            if (parser.matchToken("item") || parser.matchToken("items") || parser.matchToken("character") || parser.matchToken("characters")) {
                var follows = parser.pushFollows("of", "from");
                try {
                    var range = _PickCommand.parsePickRange(parser);
                } finally{
                    parser.popFollows(follows);
                }
                var root = _PickCommand.parseSource(parser);
                return new _PickCommand("range", root, range, null, null);
            }
            if (parser.matchToken("match")) {
                parser.matchToken("of");
                var follows = parser.pushFollows("of", "from");
                try {
                    var re = parser.parseElement("expression");
                    var flags = "";
                    if (parser.matchOpToken("|")) flags = parser.requireTokenType("IDENTIFIER").value;
                } finally{
                    parser.popFollows(follows);
                }
                var root = _PickCommand.parseSource(parser);
                return new _PickCommand("match", root, null, re, flags);
            }
            if (parser.matchToken("matches")) {
                parser.matchToken("of");
                var follows = parser.pushFollows("of", "from");
                try {
                    var re = parser.parseElement("expression");
                    var flags = "gu";
                    if (parser.matchOpToken("|")) flags = "g" + parser.requireTokenType("IDENTIFIER").value.replace("g", "");
                } finally{
                    parser.popFollows(follows);
                }
                var root = _PickCommand.parseSource(parser);
                return new _PickCommand("matches", root, null, re, flags);
            }
        }
        resolve(ctx, { root: root, from: from, to: to, re: re, count: count }) {
            if (root == null) {
                ctx.result = root;
                return this.findNext(ctx);
            }
            if (this.variant === "first") ctx.result = root.slice(0, count);
            else if (this.variant === "last") ctx.result = root.slice(-count);
            else if (this.variant === "random") {
                if (count == null) ctx.result = root[Math.floor(Math.random() * root.length)];
                else {
                    var copy = Array.from(root);
                    var result = [];
                    for(var i = 0; i < count && copy.length > 0; i++){
                        var idx = Math.floor(Math.random() * copy.length);
                        result.push(copy.splice(idx, 1)[0]);
                    }
                    ctx.result = result;
                }
            } else if (this.variant === "range") {
                if (this.range.toEnd) to = root.length;
                if (!this.range.includeStart) from++;
                if (this.range.includeEnd) to++;
                if (to == null) to = from + 1;
                ctx.result = root.slice(from, to);
            } else if (this.variant === "match") ctx.result = new RegExp(re, this.flags).exec(root);
            else ctx.result = new RegExpIterable(re, this.flags, root);
            return this.findNext(ctx);
        }
    };
    var FetchCommand = class _FetchCommand extends Command {
        static keyword = "fetch";
        constructor(url, argExprs, conversionType, conversion, dontThrow){
            super();
            this.url = url;
            this.argExpressions = argExprs;
            this.args = {
                url: url,
                options: argExprs
            };
            this.conversionType = conversionType;
            this.conversion = conversion;
            this.dontThrow = dontThrow;
        }
        static parseConversionInfo(parser) {
            var type = "text";
            var conversion;
            parser.matchToken("a") || parser.matchToken("an");
            if (parser.matchToken("json") || parser.matchToken("JSON") || parser.matchToken("Object")) type = "json";
            else if (parser.matchToken("response") || parser.matchToken("Response")) type = "response";
            else if (parser.matchToken("html") || parser.matchToken("HTML")) type = "html";
            else if (parser.matchToken("text") || parser.matchToken("Text") || parser.matchToken("String")) ;
            else conversion = parser.requireElement("dotOrColonPath").evalStatically();
            return {
                type: type,
                conversion: conversion
            };
        }
        static parse(parser) {
            if (!parser.matchToken("fetch")) return;
            parser.pushFollow("as");
            try {
                var url = parser.parseURLOrExpression();
            } finally{
                parser.popFollow();
            }
            if (parser.matchToken("as")) var conversionInfo = _FetchCommand.parseConversionInfo(parser);
            if (parser.matchToken("with") && parser.currentToken().value !== "{") var argExprs = parser.parseElement("nakedNamedArgumentList");
            else var argExprs = parser.parseElement("objectLiteral");
            if (conversionInfo == null && parser.matchToken("as")) conversionInfo = _FetchCommand.parseConversionInfo(parser);
            var dontThrow = false;
            if (parser.matchToken("do")) {
                parser.requireToken("not");
                parser.requireToken("throw");
                dontThrow = true;
            } else if (parser.currentToken().value === "don" && parser.token(1).value === "'" && parser.token(2).value === "t" && parser.token(1).start === parser.currentToken().end && parser.token(2).start === parser.token(1).end) {
                parser.consumeToken();
                parser.consumeToken();
                parser.consumeToken();
                parser.requireToken("throw");
                dontThrow = true;
            }
            var type = conversionInfo ? conversionInfo.type : "text";
            var conversion = conversionInfo ? conversionInfo.conversion : null;
            return new _FetchCommand(url, argExprs, type, conversion, dontThrow);
        }
        resolve(context, { url: url, options: options }) {
            var detail = options || {};
            detail.sender = context.me;
            detail.headers = detail.headers || {};
            detail.conversion = this.conversion || this.conversionType;
            var abortController = new AbortController();
            var abortListener = ()=>abortController.abort();
            context.me.addEventListener("fetch:abort", abortListener, {
                once: true
            });
            detail.signal = abortController.signal;
            context.meta.runtime.triggerEvent(context.me, "hyperscript:beforeFetch", detail);
            context.meta.runtime.triggerEvent(context.me, "fetch:beforeRequest", detail);
            var finished = false;
            if (detail.timeout) setTimeout(()=>{
                if (!finished) abortController.abort();
            }, detail.timeout);
            var complete = (result)=>{
                context.result = result;
                context.meta.runtime.triggerEvent(context.me, "fetch:afterRequest", {
                    result: result
                });
                finished = true;
                return this.findNext(context);
            };
            var checkThrow = !this.dontThrow && this.conversionType !== "response";
            return fetch(url, detail).then((resp)=>{
                var resultDetails = {
                    response: resp
                };
                context.meta.runtime.triggerEvent(context.me, "fetch:afterResponse", resultDetails);
                resp = resultDetails.response;
                if (checkThrow) {
                    var statusStr = String(resp.status);
                    var patterns = config.fetchThrowsOn || [];
                    for(var i = 0; i < patterns.length; i++)if (patterns[i].test(statusStr)) {
                        var err = new Error("fetch failed: " + resp.status + " " + resp.statusText + " (" + url + ")");
                        err.response = resp;
                        err.status = resp.status;
                        throw err;
                    }
                }
                if (this.conversionType === "response") return complete(resp);
                if (this.conversionType === "json") return resp.json().then(complete);
                if (this.conversion) {
                    var convFn = config.conversions[this.conversion];
                    if (convFn && convFn._rawResponse) return complete(convFn(resp, context.meta.runtime, context));
                }
                return resp.text().then((result)=>{
                    if (this.conversion) result = context.meta.runtime.convertValue(result, this.conversion);
                    if (this.conversionType === "html") result = context.meta.runtime.convertValue(result, "Fragment");
                    return complete(result);
                });
            }).catch((reason)=>{
                context.meta.runtime.triggerEvent(context.me, "fetch:error", {
                    reason: reason
                });
                throw reason;
            }).finally(()=>{
                context.me.removeEventListener("fetch:abort", abortListener);
            });
        }
    };
    function _parseScrollModifiers(parser) {
        parser.matchToken("the");
        var verticalPosition = parser.matchAnyToken("top", "middle", "bottom");
        var horizontalPosition = parser.matchAnyToken("left", "center", "right");
        if (verticalPosition || horizontalPosition) parser.requireToken("of");
        var target = parser.requireElement("unaryExpression");
        var plusOrMinus = parser.matchAnyOpToken("+", "-");
        var offset;
        if (plusOrMinus) {
            parser.pushFollow("px");
            try {
                offset = parser.requireElement("expression");
            } finally{
                parser.popFollow();
            }
        }
        parser.matchToken("px");
        var container;
        if (parser.matchToken("in")) container = parser.requireElement("unaryExpression");
        var smoothness = parser.matchAnyToken("smoothly", "instantly");
        var scrollOptions = {
            block: "start",
            inline: "nearest"
        };
        var blockMap = {
            top: "start",
            bottom: "end",
            middle: "center"
        };
        var inlineMap = {
            left: "start",
            center: "center",
            right: "end"
        };
        var behaviorMap = {
            smoothly: "smooth",
            instantly: "instant"
        };
        if (verticalPosition) scrollOptions.block = blockMap[verticalPosition.value];
        if (horizontalPosition) scrollOptions.inline = inlineMap[horizontalPosition.value];
        if (smoothness) scrollOptions.behavior = behaviorMap[smoothness.value];
        return {
            target: target,
            offset: offset,
            plusOrMinus: plusOrMinus,
            scrollOptions: scrollOptions,
            container: container
        };
    }
    function _parseSmoothness(parser) {
        var smoothness = parser.matchAnyToken("smoothly", "instantly");
        if (!smoothness) return void 0;
        return smoothness.value === "smoothly" ? "smooth" : "instant";
    }
    function _resolveScroll(ctx, to, offset, plusOrMinus, scrollOptions, container) {
        ctx.meta.runtime.implicitLoop(to, function(target) {
            if (target === window) target = document.body;
            if (container) {
                var ctr = container instanceof Element ? container : container;
                var top = target.offsetTop - ctr.offsetTop;
                var left = target.offsetLeft - ctr.offsetLeft;
                if (plusOrMinus) {
                    var adj = plusOrMinus.value === "+" ? offset : offset * -1;
                    top += adj;
                }
                ctr.scrollTo({
                    top: top,
                    left: left,
                    behavior: scrollOptions.behavior || "auto"
                });
                return;
            }
            if (plusOrMinus) {
                var boundingRect = target.getBoundingClientRect();
                var scrollShim = document.createElement("div");
                var actualOffset = plusOrMinus.value === "+" ? offset : offset * -1;
                var offsetX = scrollOptions.inline == "start" || scrollOptions.inline == "end" ? actualOffset : 0;
                var offsetY = scrollOptions.block == "start" || scrollOptions.block == "end" ? actualOffset : 0;
                scrollShim.style.position = "absolute";
                scrollShim.style.top = boundingRect.top + window.scrollY + offsetY + "px";
                scrollShim.style.left = boundingRect.left + window.scrollX + offsetX + "px";
                scrollShim.style.height = boundingRect.height + "px";
                scrollShim.style.width = boundingRect.width + "px";
                scrollShim.style.zIndex = "" + Number.MIN_SAFE_INTEGER;
                scrollShim.style.opacity = "0";
                document.body.appendChild(scrollShim);
                setTimeout(function() {
                    document.body.removeChild(scrollShim);
                }, 100);
                target = scrollShim;
            }
            target.scrollIntoView(scrollOptions);
        });
    }
    var ScrollCommand = class _ScrollCommand extends Command {
        static keyword = "scroll";
        constructor(target, offset, plusOrMinus, scrollOptions, container, byMode){
            super();
            this.target = target;
            this.plusOrMinus = plusOrMinus;
            this.scrollOptions = scrollOptions;
            this.byMode = byMode;
            this.args = {
                target: target,
                offset: offset,
                container: container
            };
        }
        static parse(parser) {
            if (!parser.matchToken("scroll")) return;
            if (parser.matchToken("to")) {
                var scroll = _parseScrollModifiers(parser);
                return new _ScrollCommand(scroll.target, scroll.offset, scroll.plusOrMinus, scroll.scrollOptions, scroll.container);
            }
            var direction = parser.matchAnyToken("up", "down", "left", "right");
            var target;
            if (!direction && parser.currentToken().value !== "by") {
                target = parser.requireElement("unaryExpression");
                direction = parser.matchAnyToken("up", "down", "left", "right");
            }
            parser.requireToken("by");
            parser.pushFollow("px");
            var offset;
            try {
                offset = parser.requireElement("expression");
            } finally{
                parser.popFollow();
            }
            parser.matchToken("px");
            var behavior = _parseSmoothness(parser);
            var scrollOptions = {};
            if (behavior) scrollOptions.behavior = behavior;
            var byMode = {
                direction: direction ? direction.value : "down"
            };
            return new _ScrollCommand(target, offset, null, scrollOptions, null, byMode);
        }
        resolve(ctx, { target: target, offset: offset, container: container }) {
            if (this.byMode) {
                var el = target || document.documentElement;
                var dir = this.byMode.direction;
                var top = 0, left = 0;
                if (dir === "up") top = -offset;
                else if (dir === "down") top = offset;
                else if (dir === "left") left = -offset;
                else if (dir === "right") left = offset;
                var opts = {
                    top: top,
                    left: left
                };
                if (this.scrollOptions.behavior) opts.behavior = this.scrollOptions.behavior;
                el.scrollBy(opts);
            } else _resolveScroll(ctx, target, offset, this.plusOrMinus, this.scrollOptions, container);
            return this.findNext(ctx);
        }
    };
    var GoCommand = class _GoCommand extends Command {
        static keyword = "go";
        constructor(target, offset, back, newWindow, plusOrMinus, scrollOptions){
            super();
            this.target = target;
            this.args = {
                target: target,
                offset: offset
            };
            this.back = back;
            this.newWindow = newWindow;
            this.plusOrMinus = plusOrMinus;
            this.scrollOptions = scrollOptions;
        }
        static parse(parser) {
            if (!parser.matchToken("go")) return;
            if (parser.matchToken("back")) return new _GoCommand(null, null, true);
            parser.matchToken("to");
            if (parser.matchToken("url")) {
                var target = parser.requireElement("stringLike");
                var newWindow = false;
                if (parser.matchToken("in")) {
                    parser.requireToken("new");
                    parser.requireToken("window");
                    newWindow = true;
                }
                return new _GoCommand(target, null, false, newWindow);
            }
            var cur = parser.currentToken();
            if (cur.value === "the" || cur.value === "top" || cur.value === "middle" || cur.value === "bottom" || cur.value === "left" || cur.value === "center" || cur.value === "right") {
                var scroll = _parseScrollModifiers(parser);
                return new _GoCommand(scroll.target, scroll.offset, false, false, scroll.plusOrMinus, scroll.scrollOptions);
            }
            var target = parser.parseURLOrExpression();
            var newWindow = false;
            if (parser.matchToken("in")) {
                parser.requireToken("new");
                parser.requireToken("window");
                newWindow = true;
            }
            return new _GoCommand(target, null, false, newWindow);
        }
        resolve(ctx, { target: to, offset: offset }) {
            if (this.back) window.history.back();
            else if (this.scrollOptions) _resolveScroll(ctx, to, offset, this.plusOrMinus, this.scrollOptions);
            else if (to != null) {
                if (to instanceof Element) to.scrollIntoView({
                    block: "start",
                    inline: "nearest"
                });
                else {
                    var str = String(to);
                    if (str.startsWith("#")) window.location.hash = str;
                    else if (this.newWindow) window.open(str);
                    else window.location.href = str;
                }
            }
            return this.findNext(ctx);
        }
    };
    // src/parsetree/commands/setters.js
    var setters_exports = {};
    __export(setters_exports, {
        DecrementCommand: ()=>DecrementCommand,
        DefaultCommand: ()=>DefaultCommand,
        IncrementCommand: ()=>IncrementCommand,
        PutCommand: ()=>PutCommand,
        SetCommand: ()=>SetCommand,
        SwapCommand: ()=>SwapCommand
    });
    var SetCommand = class _SetCommand extends Command {
        static keyword = "set";
        constructor(target, valueExpr, objectLiteral = null){
            super();
            this.target = target;
            this.objectLiteral = objectLiteral;
            if (objectLiteral) this.args = {
                obj: objectLiteral,
                setTarget: target
            };
            else this.args = {
                ...target.lhs,
                value: valueExpr
            };
        }
        static parse(parser) {
            if (!parser.matchToken("set")) return;
            if (parser.currentToken().type === "L_BRACE") {
                var obj = parser.requireElement("objectLiteral");
                parser.requireToken("on");
                var target = parser.requireElement("expression");
                return new _SetCommand(target, null, obj);
            }
            try {
                parser.pushFollow("to");
                var target = parser.requireElement("assignableExpression");
            } finally{
                parser.popFollow();
            }
            while(target.type === "parenthesized")target = target.expr;
            parser.requireToken("to");
            var value = parser.requireElement("expression");
            return new _SetCommand(target, value);
        }
        resolve(context, args) {
            if (this.objectLiteral) {
                var { obj: obj, setTarget: setTarget } = args;
                Object.assign(setTarget, obj);
            } else {
                var { value: value, ...lhs } = args;
                this.target.set(context, lhs, value);
            }
            return this.findNext(context);
        }
    };
    var DefaultCommand = class _DefaultCommand extends Command {
        static keyword = "default";
        constructor(target, setter){
            super();
            this.target = target;
            this.setter = setter;
            this.args = {
                targetValue: target
            };
        }
        static parse(parser) {
            if (!parser.matchToken("default")) return;
            try {
                parser.pushFollow("to");
                var target = parser.requireElement("assignableExpression");
            } finally{
                parser.popFollow();
            }
            while(target.type === "parenthesized")target = target.expr;
            parser.requireToken("to");
            var value = parser.requireElement("expression");
            var setter = new SetCommand(target, value);
            var defaultCmd = new _DefaultCommand(target, setter);
            setter.parent = defaultCmd;
            return defaultCmd;
        }
        resolve(context, { targetValue: targetValue }) {
            if (targetValue != null && targetValue !== "") return this.findNext(context);
            else return this.setter;
        }
    };
    var IncrementCommand = class _IncrementCommand extends Command {
        static keyword = "increment";
        constructor(target, amountExpr){
            super();
            this.target = target;
            this.amountExpr = amountExpr;
            this.args = {
                targetValue: target,
                amount: amountExpr,
                ...target.lhs
            };
        }
        static parse(parser) {
            if (!parser.matchToken("increment")) return;
            var amountExpr;
            var target = parser.parseElement("assignableExpression");
            while(target.type === "parenthesized")target = target.expr;
            if (parser.matchToken("by")) amountExpr = parser.requireElement("expression");
            return new _IncrementCommand(target, amountExpr);
        }
        resolve(context, args) {
            var { targetValue: targetValue, amount: amount, ...lhs } = args;
            targetValue = targetValue ? parseFloat(targetValue) : 0;
            amount = this.amountExpr ? parseFloat(amount) : 1;
            var newValue = targetValue + amount;
            context.result = newValue;
            this.target.set(context, lhs, newValue);
            return this.findNext(context);
        }
    };
    var DecrementCommand = class _DecrementCommand extends Command {
        static keyword = "decrement";
        constructor(target, amountExpr){
            super();
            this.target = target;
            this.amountExpr = amountExpr;
            this.args = {
                targetValue: target,
                amount: amountExpr,
                ...target.lhs
            };
        }
        static parse(parser) {
            if (!parser.matchToken("decrement")) return;
            var amountExpr;
            try {
                parser.pushFollow("by");
                var target = parser.parseElement("assignableExpression");
            } finally{
                parser.popFollow();
            }
            while(target.type === "parenthesized")target = target.expr;
            if (parser.matchToken("by")) amountExpr = parser.requireElement("expression");
            return new _DecrementCommand(target, amountExpr);
        }
        resolve(context, args) {
            var { targetValue: targetValue, amount: amount, ...lhs } = args;
            targetValue = targetValue ? parseFloat(targetValue) : 0;
            amount = this.amountExpr ? parseFloat(amount) : 1;
            var newValue = targetValue - amount;
            context.result = newValue;
            this.target.set(context, lhs, newValue);
            return this.findNext(context);
        }
    };
    var SwapCommand = class _SwapCommand extends Command {
        static keyword = "swap";
        constructor(target1, target2){
            super();
            this.target1 = target1;
            this.target2 = target2;
            this.args = {
                value1: target1,
                value2: target2,
                root1: target1.lhs.root,
                index1: target1.lhs.index,
                root2: target2.lhs.root,
                index2: target2.lhs.index
            };
        }
        static parse(parser) {
            if (!parser.matchToken("swap")) return;
            try {
                parser.pushFollow("with");
                var target1 = parser.requireElement("assignableExpression");
            } finally{
                parser.popFollow();
            }
            while(target1.type === "parenthesized")target1 = target1.expr;
            parser.requireToken("with");
            var target2 = parser.requireElement("assignableExpression");
            while(target2.type === "parenthesized")target2 = target2.expr;
            return new _SwapCommand(target1, target2);
        }
        resolve(context, { value1: value1, value2: value2, root1: root1, index1: index1, root2: root2, index2: index2 }) {
            if (value1 instanceof Element && value2 instanceof Element) {
                var placeholder = document.createComment("");
                value1.replaceWith(placeholder);
                value2.replaceWith(value1);
                placeholder.replaceWith(value2);
            } else {
                this.target1.set(context, {
                    root: root1,
                    index: index1
                }, value2);
                this.target2.set(context, {
                    root: root2,
                    index: index2
                }, value1);
            }
            return this.findNext(context);
        }
    };
    var PutCommand = class _PutCommand extends Command {
        static keyword = "put";
        constructor(target, operation, value, rootExpr){
            super();
            this.target = target;
            this.operation = operation;
            this.value = value;
            this.rootExpr = rootExpr;
            this.symbolWrite = target.type === "symbol" && operation === "into";
            this.arrayIndex = target.type === "arrayIndex";
            this.attributeWrite = (target.type === "attributeRef" || target.attribute && target.attribute.type === "attributeRef") && operation === "into";
            this.styleWrite = (target.type === "styleRef" || target.attribute && target.attribute.type === "styleRef") && operation === "into";
            if (this.arrayIndex) this.prop = target.prop;
            else if (this.symbolWrite) this.prop = target.name;
            else if (target.type === "attributeRef" || target.type === "styleRef") this.prop = target.name;
            else if (target.attribute) this.prop = target.attribute.name;
            else if (target.prop) this.prop = target.prop.value;
            else this.prop = null;
            this.args = {
                root: rootExpr,
                prop: this.prop,
                value: value
            };
        }
        static parse(parser) {
            if (!parser.matchToken("put")) return;
            var value = parser.requireElement("expression");
            var operationToken = parser.matchAnyToken("into", "before", "after");
            if (operationToken == null && parser.matchToken("at")) {
                parser.matchToken("the");
                operationToken = parser.matchAnyToken("start", "end");
                parser.requireToken("of");
            }
            if (operationToken == null) parser.raiseExpected("into", "before", "at start of", "at end of", "after");
            var target = parser.requireElement("expression");
            while(target.type === "parenthesized")target = target.expr;
            var operation = operationToken.value;
            var rootExpr;
            if (target.type === "arrayIndex" && operation === "into") rootExpr = target.root;
            else if (target.prop && target.root && operation === "into") rootExpr = target.root;
            else if (target.type === "symbol" && operation === "into") rootExpr = null;
            else if (target.type === "attributeRef" && operation === "into") rootExpr = parser.requireElement("implicitMeTarget");
            else if (target.type === "styleRef" && operation === "into") rootExpr = parser.requireElement("implicitMeTarget");
            else if (target.attribute && operation === "into") rootExpr = target.root;
            else rootExpr = target;
            return new _PutCommand(target, operation, value, rootExpr);
        }
        putInto(context, root, prop, valueToPut) {
            if (root == null) var value = context.meta.runtime.resolveSymbol(prop, context);
            else var value = root;
            if ((root == null || prop == null) && (value instanceof Element || value instanceof Document)) {
                while(value.firstChild)value.removeChild(value.firstChild);
                value.append(context.meta.runtime.convertValue(valueToPut, "Fragment"));
                context.meta.runtime.processNode(value);
            } else if (root == null) context.meta.runtime.setSymbol(prop, context, null, valueToPut);
            else root[prop] = valueToPut;
        }
        resolve(context, { root: root, prop: prop, value: valueToPut }) {
            if (this.symbolWrite) this.putInto(context, root, prop, valueToPut);
            else {
                context.meta.runtime.nullCheck(root, this.rootExpr);
                if (this.operation === "into") {
                    if (this.attributeWrite) context.meta.runtime.implicitLoop(root, function(elt) {
                        if (valueToPut == null) elt.removeAttribute(prop);
                        else elt.setAttribute(prop, valueToPut);
                    });
                    else if (this.styleWrite) context.meta.runtime.implicitLoop(root, function(elt) {
                        elt.style[prop] = valueToPut;
                    });
                    else if (this.arrayIndex) root[prop] = valueToPut;
                    else {
                        var cmd = this;
                        context.meta.runtime.implicitLoop(root, function(elt) {
                            cmd.putInto(context, elt, prop, valueToPut);
                        });
                    }
                } else if (Array.isArray(root)) {
                    if (this.operation === "start") root.unshift(valueToPut);
                    else root.push(valueToPut);
                    context.meta.runtime.notifyMutation(root);
                } else {
                    var ops = {
                        before: Element.prototype.before,
                        after: Element.prototype.after,
                        start: Element.prototype.prepend,
                        end: Element.prototype.append
                    };
                    var op = ops[this.operation] || Element.prototype.append;
                    context.meta.runtime.implicitLoop(root, function(elt) {
                        op.call(elt, valueToPut instanceof Node ? valueToPut : context.meta.runtime.convertValue(valueToPut, "Fragment"));
                        if (elt.parentElement) context.meta.runtime.processNode(elt.parentElement);
                        else context.meta.runtime.processNode(elt);
                    });
                }
            }
            return this.findNext(context);
        }
    };
    // src/parsetree/commands/events.js
    var events_exports = {};
    __export(events_exports, {
        EventName: ()=>EventName,
        SendCommand: ()=>SendCommand,
        WaitCommand: ()=>WaitCommand
    });
    var WaitCommand = class _WaitCommand extends Command {
        static keyword = "wait";
        constructor(variant, events, on, time){
            super();
            this.variant = variant;
            this.event = events;
            this.on = on;
            this.time = time;
            this.args = variant === "event" ? {
                on: on
            } : {
                time: time
            };
        }
        static parse(parser) {
            if (!parser.matchToken("wait")) return;
            if (parser.matchToken("for")) {
                parser.matchToken("a");
                var events = [];
                do {
                    var lookahead = parser.token(0);
                    if (lookahead.type === "NUMBER" || lookahead.type === "L_PAREN") events.push(parser.requireElement("expression"));
                    else events.push({
                        name: parser.requireElement("dotOrColonPath", "Expected event name").evalStatically(),
                        args: ParseElement.parseEventArgs(parser)
                    });
                }while (parser.matchToken("or"));
                if (parser.matchToken("from")) var on = parser.requireElement("expression");
                return new _WaitCommand("event", events, on, null);
            } else {
                var time;
                if (parser.matchToken("a")) {
                    parser.requireToken("tick");
                    time = 0;
                } else time = parser.requireElement("expression");
                return new _WaitCommand("time", null, null, time);
            }
        }
        resolve(context, { on: on, time: time }) {
            if (this.variant === "event") {
                var target = on ? on : context.me;
                if (!(target instanceof EventTarget)) throw new Error("Not a valid event target: " + this.on.sourceFor());
                const events = this.event;
                return new Promise((resolve)=>{
                    var resolved = false;
                    for (const eventInfo of events){
                        var listener = (evt)=>{
                            context.result = evt;
                            if (eventInfo.name && eventInfo.args) for (const arg of eventInfo.args)context.locals[arg.value] = evt[arg.value] || (evt.detail ? evt.detail[arg.value] : null);
                            if (!resolved) {
                                resolved = true;
                                resolve(this.findNext(context));
                            }
                        };
                        if (eventInfo.name) target.addEventListener(eventInfo.name, listener, {
                            once: true
                        });
                        else {
                            const timeValue = eventInfo.evaluate(context);
                            setTimeout(listener, timeValue, timeValue);
                        }
                    }
                });
            } else return new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve(this.findNext(context));
                }, time);
            });
        }
    };
    var SendCommand = class _SendCommand extends Command {
        static keyword = [
            "send",
            "trigger"
        ];
        constructor(eventName, details, toExpr){
            super();
            this.eventName = eventName;
            this.details = details;
            this.to = toExpr;
            this.args = {
                to: toExpr,
                eventName: eventName,
                details: details
            };
            this.toExpr = toExpr;
        }
        static parse(parser) {
            var isTrigger = parser.matchToken("trigger");
            if (!isTrigger && !parser.matchToken("send")) return;
            var eventName = parser.requireElement("eventName");
            var details = parser.parseElement("namedArgumentList");
            if (parser.matchToken(isTrigger ? "on" : "to")) var toExpr = parser.requireElement("expression");
            else var toExpr = parser.requireElement("implicitMeTarget");
            return new _SendCommand(eventName, details, toExpr);
        }
        resolve(context, { to: to, eventName: eventName, details: details }) {
            context.meta.runtime.nullCheck(to, this.toExpr);
            context.meta.runtime.implicitLoop(to, function(target) {
                context.meta.runtime.triggerEvent(target, eventName, details, context.me);
            });
            return this.findNext(context);
        }
    };
    var EventName = class _EventName extends Expression {
        static grammarName = "eventName";
        constructor(value){
            super();
            this.value = value;
        }
        evalStatically() {
            return this.value;
        }
        resolve(context) {
            return this.value;
        }
        static parse(parser) {
            var token;
            if (token = parser.matchTokenType("STRING")) return new _EventName(token.value);
            return parser.parseElement("dotOrColonPath");
        }
    };
    // src/parsetree/commands/controlflow.js
    var controlflow_exports = {};
    __export(controlflow_exports, {
        BreakCommand: ()=>BreakCommand,
        ContinueCommand: ()=>ContinueCommand,
        IfCommand: ()=>IfCommand,
        RepeatCommand: ()=>RepeatCommand,
        TellCommand: ()=>TellCommand
    });
    var WaitATick = class extends Command {
        constructor(){
            super();
            this.type = "waitATick";
        }
        resolve(context) {
            return new Promise((resolve)=>{
                setTimeout(()=>resolve(context.meta.runtime.findNext(this)), 0);
            });
        }
    };
    var RepeatLoopCommand = class extends Command {
        constructor(config2, loop, elseBranch){
            super();
            this.identifier = config2.identifier;
            this.indexIdentifier = config2.indexIdentifier;
            this.slot = config2.slot;
            this.expression = config2.expression;
            this.forever = config2.forever;
            this.times = config2.times;
            this.until = config2.until;
            this.event = config2.event;
            this.on = config2.on;
            this.whileExpr = config2.whileExpr;
            this.bottomTested = config2.bottomTested;
            this.loop = loop;
            this.elseBranch = elseBranch;
            this.args = {
                whileValue: config2.whileExpr,
                times: config2.times
            };
        }
        resolveNext() {
            return this;
        }
        resolve(context, { whileValue: whileValue, times: times }) {
            var iteratorInfo = context.meta.iterators[this.slot];
            var keepLooping = false;
            var loopVal = null;
            if (this.bottomTested && iteratorInfo.index === 0) keepLooping = true;
            else if (this.forever) keepLooping = true;
            else if (this.until) {
                if (this.event) keepLooping = context.meta.iterators[this.slot].eventFired === false;
                else keepLooping = whileValue !== true;
            } else if (this.whileExpr) keepLooping = whileValue;
            else if (times) keepLooping = iteratorInfo.index < times;
            else if (iteratorInfo.iterator) {
                if (iteratorInfo.async) {
                    var self2 = this;
                    return iteratorInfo.iterator.next().then(function(result) {
                        if (result.done) return self2._endLoop(context, iteratorInfo);
                        return self2._continueLoop(context, iteratorInfo, result.value);
                    });
                }
                var nextValFromIterator = iteratorInfo.iterator.next();
                keepLooping = !nextValFromIterator.done;
                loopVal = nextValFromIterator.value;
            }
            if (keepLooping) return this._continueLoop(context, iteratorInfo, loopVal);
            else return this._endLoop(context, iteratorInfo);
        }
        _continueLoop(context, iteratorInfo, loopVal) {
            var currentIndex = iteratorInfo.index;
            if (iteratorInfo.value) context.result = context.locals[this.identifier] = loopVal;
            else context.result = currentIndex;
            if (this.indexIdentifier) context.locals[this.indexIdentifier] = currentIndex;
            if (context.meta.__ht_template_result && iteratorInfo.value) {
                var scopes = context.meta.__ht_scopes || (context.meta.__ht_scopes = {});
                if (!scopes[this.slot]) scopes[this.slot] = {
                    identifier: this.identifier,
                    indexIdentifier: this.indexIdentifier,
                    source: iteratorInfo.value
                };
                context.meta.__ht_template_result.push("<!--hs-scope:" + this.slot + ":" + currentIndex + "-->");
            }
            iteratorInfo.didIterate = true;
            iteratorInfo.index++;
            return this.loop;
        }
        _endLoop(context, iteratorInfo) {
            var didIterate = iteratorInfo.didIterate;
            context.meta.iterators[this.slot] = null;
            if (!didIterate && this.elseBranch) return this.elseBranch;
            return context.meta.runtime.findNext(this.parent, context);
        }
    };
    var IfCommand = class _IfCommand extends Command {
        static keyword = "if";
        constructor(expr, trueBranch, falseBranch){
            super();
            this.expr = expr;
            this.trueBranch = trueBranch;
            this.falseBranch = falseBranch;
            this.args = {
                value: expr
            };
        }
        static parse(parser) {
            if (!parser.matchToken("if")) return;
            var expr = parser.requireElement("expression");
            parser.matchToken("then");
            var trueBranch = parser.parseElement("commandList");
            var nestedIfStmt = false;
            let elseToken = parser.matchToken("else") || parser.matchToken("otherwise");
            if (elseToken) {
                let elseIfIfToken = parser.peekToken("if");
                nestedIfStmt = elseIfIfToken != null && elseIfIfToken.line === elseToken.line;
                if (nestedIfStmt) var falseBranch = parser.parseElement("command");
                else var falseBranch = parser.parseElement("commandList");
            }
            if (parser.hasMore() && !nestedIfStmt) parser.requireToken("end");
            var ifCmd = new _IfCommand(expr, trueBranch, falseBranch);
            parser.setParent(trueBranch, ifCmd);
            parser.setParent(falseBranch, ifCmd);
            return ifCmd;
        }
        resolve(context, { value: exprValue }) {
            if (exprValue) return this.trueBranch;
            else if (this.falseBranch) return this.falseBranch;
            else return this.findNext(context);
        }
    };
    var RepeatCommand = class _RepeatCommand extends Command {
        static keyword = [
            "repeat",
            "for"
        ];
        constructor(expression, evt, on, slot, repeatLoopCommand){
            super();
            this.expression = expression;
            this.evt = evt;
            this.on = on;
            this.slot = slot;
            this.repeatLoopCommand = repeatLoopCommand;
            this.args = {
                value: expression,
                event: evt,
                on: on
            };
        }
        static parseRepeatExpression(parser, startedWithForToken) {
            var innerStartToken = parser.currentToken();
            var identifier;
            if (parser.matchToken("for") || startedWithForToken) {
                var identifierToken = parser.requireTokenType("IDENTIFIER");
                identifier = identifierToken.value;
                parser.requireToken("in");
                var expression = parser.requireElement("expression");
                var walk = expression;
                while(walk){
                    if (walk.condition) walk.varName = identifier;
                    walk = walk.root;
                }
            } else if (parser.matchToken("in")) {
                identifier = "it";
                var expression = parser.requireElement("expression");
            } else if (parser.matchToken("while")) var whileExpr = parser.requireElement("expression");
            else if (parser.matchToken("until")) {
                var isUntil = true;
                if (parser.matchToken("event")) {
                    var evt = parser.requireElement("dotOrColonPath", "Expected event name");
                    if (parser.matchToken("from")) var on = parser.requireElement("expression");
                } else var whileExpr = parser.requireElement("expression");
            } else if (!parser.commandBoundary(parser.currentToken()) && parser.currentToken().value !== "forever") {
                var times = parser.requireElement("expression");
                parser.requireToken("times");
            } else {
                parser.matchToken("forever");
                var forever = true;
            }
            if (parser.matchToken("index")) {
                var identifierToken = parser.requireTokenType("IDENTIFIER");
                var indexIdentifier = identifierToken.value;
            } else if (parser.matchToken("indexed")) {
                parser.requireToken("by");
                var identifierToken = parser.requireTokenType("IDENTIFIER");
                var indexIdentifier = identifierToken.value;
            }
            var loop = parser.parseElement("commandList");
            if (loop && evt) {
                var last = loop;
                while(last.next)last = last.next;
                var waitATick = new WaitATick();
                last.next = waitATick;
            }
            var bottomTested = false;
            if (forever && parser.hasMore()) {
                if (parser.matchToken("until")) {
                    forever = false;
                    isUntil = true;
                    bottomTested = true;
                    whileExpr = parser.requireElement("expression");
                } else if (parser.matchToken("while")) {
                    forever = false;
                    bottomTested = true;
                    whileExpr = parser.requireElement("expression");
                }
            }
            var elseBranch = null;
            if (parser.matchToken("else")) elseBranch = parser.parseElement("commandList");
            if (parser.hasMore()) parser.requireToken("end");
            if (identifier == null) {
                identifier = "_implicit_repeat_" + innerStartToken.start;
                var slot = identifier;
            } else var slot = identifier + "_" + innerStartToken.start;
            const loopConfig = {
                identifier: identifier,
                indexIdentifier: indexIdentifier,
                slot: slot,
                expression: expression,
                forever: forever,
                times: times,
                until: isUntil,
                event: evt,
                on: on,
                whileExpr: whileExpr,
                bottomTested: bottomTested
            };
            const repeatLoopCommand = new RepeatLoopCommand(loopConfig, loop, elseBranch);
            const repeatCommand = new _RepeatCommand(expression, evt, on, slot, repeatLoopCommand);
            parser.setParent(loop, repeatLoopCommand);
            if (elseBranch) parser.setParent(elseBranch, repeatCommand);
            parser.setParent(repeatLoopCommand, repeatCommand);
            return repeatCommand;
        }
        static parse(parser) {
            if (parser.matchToken("for")) return _RepeatCommand.parseRepeatExpression(parser, true);
            if (parser.matchToken("repeat")) return _RepeatCommand.parseRepeatExpression(parser, false);
        }
        resolve(context, { value: value, event: event, on: on }) {
            var iteratorInfo = {
                index: 0,
                value: value,
                eventFired: false
            };
            context.meta.iterators[this.slot] = iteratorInfo;
            if (value) {
                if (value[Symbol.asyncIterator]) {
                    iteratorInfo.iterator = value[Symbol.asyncIterator]();
                    iteratorInfo.async = true;
                } else if (value[Symbol.iterator]) iteratorInfo.iterator = value[Symbol.iterator]();
                else iteratorInfo.iterator = Object.keys(value)[Symbol.iterator]();
            } else if (this.repeatLoopCommand.elseBranch) iteratorInfo.iterator = [][Symbol.iterator]();
            if (this.evt) {
                var target = on || context.me;
                const slot = this.slot;
                target.addEventListener(event, function(e) {
                    context.meta.iterators[slot].eventFired = true;
                }, {
                    once: true
                });
            }
            return this.repeatLoopCommand;
        }
    };
    var ContinueCommand = class _ContinueCommand extends Command {
        static keyword = "continue";
        static parse(parser) {
            if (!parser.matchToken("continue")) return;
            return new _ContinueCommand();
        }
        resolve(context) {
            for(var parent = this.parent; parent; parent = parent.parent){
                if (parent.loop != void 0) return parent.resolveNext(context);
            }
            throw new Error("Command `continue` cannot be used outside of a `repeat` loop.");
        }
    };
    var BreakCommand = class _BreakCommand extends Command {
        static keyword = "break";
        static parse(parser) {
            if (!parser.matchToken("break")) return;
            return new _BreakCommand();
        }
        resolve(context) {
            for(var parent = this.parent; parent; parent = parent.parent){
                if (parent.loop != void 0) return context.meta.runtime.findNext(parent.parent, context);
            }
            throw new Error("Command `break` cannot be used outside of a `repeat` loop.");
        }
    };
    var TellCommand = class _TellCommand extends Command {
        static keyword = "tell";
        constructor(value, body, slot){
            super();
            this.value = value;
            this.body = body;
            this.slot = slot;
            this.args = {
                value: value
            };
        }
        static parse(parser) {
            var startToken = parser.currentToken();
            if (!parser.matchToken("tell")) return;
            var value = parser.requireElement("expression");
            var body = parser.requireElement("commandList");
            if (parser.hasMore() && !parser.featureStart(parser.currentToken())) parser.requireToken("end");
            var slot = "tell_" + startToken.start;
            var tellCmd = new _TellCommand(value, body, slot);
            parser.setParent(body, tellCmd);
            return tellCmd;
        }
        resolveNext(context) {
            var iterator = context.meta.iterators[this.slot];
            if (iterator.index < iterator.value.length) {
                context.you = iterator.value[iterator.index++];
                return this.body;
            } else {
                context.you = iterator.originalYou;
                if (this.next) return this.next;
                else return context.meta.runtime.findNext(this.parent, context);
            }
        }
        resolve(context, { value: value }) {
            if (value == null) value = [];
            else if (!(Array.isArray(value) || value instanceof NodeList)) value = [
                value
            ];
            context.meta.iterators[this.slot] = {
                originalYou: context.you,
                index: 0,
                value: value
            };
            return this.resolveNext(context);
        }
    };
    // src/parsetree/commands/execution.js
    var execution_exports = {};
    __export(execution_exports, {
        GetCommand: ()=>GetCommand,
        JsBody: ()=>JsBody,
        JsCommand: ()=>JsCommand
    });
    var JsBody = class _JsBody {
        static grammarName = "jsBody";
        constructor(jsSource, exposedFunctionNames){
            this.type = "jsBody";
            this.jsSource = jsSource;
            this.exposedFunctionNames = exposedFunctionNames;
        }
        static parse(parser) {
            var jsSourceStart = parser.currentToken().start;
            var jsLastToken = parser.currentToken();
            var funcNames = [];
            var funcName = "";
            var expectFunctionDeclaration = false;
            while(parser.hasMore()){
                jsLastToken = parser.consumeToken();
                var peek = parser.token(0, true);
                if (peek.type === "IDENTIFIER" && peek.value === "end") break;
                if (expectFunctionDeclaration) {
                    if (jsLastToken.type === "IDENTIFIER" || jsLastToken.type === "NUMBER") funcName += jsLastToken.value;
                    else {
                        if (funcName !== "") funcNames.push(funcName);
                        funcName = "";
                        expectFunctionDeclaration = false;
                    }
                } else if (jsLastToken.type === "IDENTIFIER" && jsLastToken.value === "function") expectFunctionDeclaration = true;
            }
            var jsSourceEnd = jsLastToken.end + 1;
            return new _JsBody(parser.source.substring(jsSourceStart, jsSourceEnd), funcNames);
        }
    };
    var JsCommand = class _JsCommand extends Command {
        static keyword = "js";
        constructor(jsSource, func, inputs){
            super();
            this.jsSource = jsSource;
            this.function = func;
            this.inputs = inputs;
        }
        static parse(parser) {
            if (!parser.matchToken("js")) return;
            var inputs = [];
            if (parser.matchOpToken("(")) {
                if (parser.matchOpToken(")")) ;
                else {
                    do {
                        var inp = parser.requireTokenType("IDENTIFIER");
                        inputs.push(inp.value);
                    }while (parser.matchOpToken(","));
                    parser.requireOpToken(")");
                }
            }
            var jsBody = parser.requireElement("jsBody");
            parser.matchToken("end");
            var func = new Function(...inputs, jsBody.jsSource);
            return new _JsCommand(jsBody.jsSource, func, inputs);
        }
        resolve(context) {
            var args = this.inputs.map((input)=>context.meta.runtime.resolveSymbol(input, context, "local"));
            var result = this.function.apply(context.meta.runtime.globalScope, args);
            if (result && typeof result.then === "function") return result.then((actualResult)=>{
                context.result = actualResult;
                return this.findNext(context);
            });
            else {
                context.result = result;
                return this.findNext(context);
            }
        }
    };
    var GetCommand = class _GetCommand extends Command {
        static keyword = [
            "get",
            "call"
        ];
        constructor(expr){
            super();
            this.expr = expr;
            this.args = {
                result: expr
            };
        }
        static parse(parser) {
            var isCall = parser.matchToken("call");
            if (!isCall && !parser.matchToken("get")) return;
            var expr = parser.requireElement("expression");
            if (isCall && expr && expr.type !== "functionCall") parser.raiseError("Must be a function invocation");
            return new _GetCommand(expr);
        }
        resolve(context, { result: result }) {
            context.result = result;
            return this.findNext(context);
        }
    };
    // src/parsetree/commands/pseudoCommand.js
    var pseudoCommand_exports = {};
    __export(pseudoCommand_exports, {
        PseudoCommand: ()=>PseudoCommand
    });
    var PseudoCommand = class _PseudoCommand extends Command {
        static grammarName = "pseudoCommand";
        constructor(variant, expr, realRoot, root){
            super();
            this.variant = variant;
            this.expr = expr;
            this._root = root;
            this._realRoot = realRoot;
            if (variant === "target") {
                this.root = realRoot;
                this.argExpressions = root.argExpressions;
                this.args = {
                    target: realRoot,
                    argVals: root.argExpressions
                };
            } else this.args = {
                result: expr
            };
        }
        static parse(parser) {
            let lookAhead = parser.token(1);
            if (!(lookAhead && lookAhead.op && (lookAhead.value === "." || lookAhead.value === "("))) return null;
            var expr = parser.requireElement("primaryExpression");
            var rootRoot = expr.root;
            var root = expr;
            while(rootRoot.root != null){
                root = root.root;
                rootRoot = rootRoot.root;
            }
            if (expr.type !== "functionCall") parser.raiseError("Pseudo-commands must be function calls");
            if (root.type === "functionCall" && root.root.root == null) {
                if (parser.matchAnyToken("the", "to", "on", "with", "into", "from", "at")) var realRoot = parser.requireElement("expression");
                else if (parser.matchToken("me")) var realRoot = parser.requireElement("implicitMeTarget");
            }
            if (realRoot) return new _PseudoCommand("target", expr, realRoot, root);
            else return new _PseudoCommand("simple", expr, null, null);
        }
        resolve(context, { target: target, argVals: argVals, result: result }) {
            if (this.variant === "target") {
                context.meta.runtime.nullCheck(target, this._realRoot);
                var methodName = this._root.root.name;
                var func = target[methodName];
                context.meta.runtime.nullCheck(func, this._root);
                if (func.hyperfunc) argVals.push(context);
                context.result = func.apply(target, argVals);
                context.meta.runtime.maybeNotify(target, methodName);
            } else context.result = result;
            return this.findNext(context);
        }
    };
    // src/parsetree/commands/dom.js
    var dom_exports = {};
    __export(dom_exports, {
        AddCommand: ()=>AddCommand,
        AnswerCommand: ()=>AnswerCommand,
        AskCommand: ()=>AskCommand,
        BlurCommand: ()=>BlurCommand,
        CloseCommand: ()=>CloseCommand,
        EmptyCommand: ()=>EmptyCommand,
        FocusCommand: ()=>FocusCommand,
        HideCommand: ()=>HideCommand,
        MeasureCommand: ()=>MeasureCommand,
        MorphCommand: ()=>MorphCommand,
        OpenCommand: ()=>OpenCommand,
        RemoveCommand: ()=>RemoveCommand,
        ResetCommand: ()=>ResetCommand,
        SelectCommand: ()=>SelectCommand,
        ShowCommand: ()=>ShowCommand,
        SpeakCommand: ()=>SpeakCommand,
        TakeCommand: ()=>TakeCommand,
        ToggleCommand: ()=>ToggleCommand
    });
    var HIDE_SHOW_STRATEGIES = {
        display: function(op, element, arg, runtime2) {
            if (!arg && element instanceof HTMLDialogElement) {
                if (op === "hide") element.close();
                else if (op === "show") {
                    if (!element.open) element.show();
                } else if (op === "toggle") {
                    if (element.open) element.close();
                    else element.show();
                }
                return;
            }
            if (arg) element.style.display = arg;
            else if (op === "toggle") {
                if (getComputedStyle(element).display === "none") HIDE_SHOW_STRATEGIES.display("show", element, arg, runtime2);
                else HIDE_SHOW_STRATEGIES.display("hide", element, arg, runtime2);
            } else if (op === "hide") {
                const internalData = runtime2.getInternalData(element);
                if (internalData.originalDisplay == null) internalData.originalDisplay = element.style.display;
                element.style.display = "none";
            } else {
                const internalData = runtime2.getInternalData(element);
                if (internalData.originalDisplay && internalData.originalDisplay !== "none") element.style.display = internalData.originalDisplay;
                else element.style.removeProperty("display");
            }
        },
        visibility: function(op, element, arg) {
            if (arg) element.style.visibility = arg;
            else if (op === "toggle") {
                if (getComputedStyle(element).visibility === "hidden") HIDE_SHOW_STRATEGIES.visibility("show", element, arg);
                else HIDE_SHOW_STRATEGIES.visibility("hide", element, arg);
            } else if (op === "hide") element.style.visibility = "hidden";
            else element.style.visibility = "visible";
        },
        opacity: function(op, element, arg) {
            if (arg) element.style.opacity = arg;
            else if (op === "toggle") {
                if (getComputedStyle(element).opacity === "0") HIDE_SHOW_STRATEGIES.opacity("show", element, arg);
                else HIDE_SHOW_STRATEGIES.opacity("hide", element, arg);
            } else if (op === "hide") element.style.opacity = "0";
            else element.style.opacity = "1";
        },
        hidden: function(op, element) {
            if (op === "toggle") op = element.hasAttribute("hidden") ? "show" : "hide";
            if (op === "hide") element.setAttribute("hidden", "");
            else element.removeAttribute("hidden");
        }
    };
    function _cssPropertyNames(css) {
        return css.split(";").map(function(p) {
            return p.split(":")[0].trim();
        }).filter(Boolean);
    }
    function _removeCssProperties(elt, propNames) {
        for(var i = 0; i < propNames.length; i++)elt.style.removeProperty(propNames[i]);
    }
    var VisibilityCommand = class extends Command {
        static parseShowHideTarget(parser) {
            var currentTokenValue = parser.currentToken();
            if (currentTokenValue.value === "when" || currentTokenValue.value === "with" || parser.commandBoundary(currentTokenValue)) return parser.parseElement("implicitMeTarget");
            else return parser.parseElement("expression");
        }
        static resolveHideShowStrategy(parser, name) {
            var configDefault = config.defaultHideShowStrategy;
            var strategies = HIDE_SHOW_STRATEGIES;
            if (config.hideShowStrategies) strategies = Object.assign({}, strategies, config.hideShowStrategies);
            name = name || configDefault || "display";
            var value = strategies[name];
            if (value == null) parser.raiseError("Unknown show/hide strategy : " + name);
            return value;
        }
    };
    var AddCommand = class _AddCommand extends Command {
        static keyword = "add";
        constructor(variant, classRefs, attributeRef, cssDeclaration, toExpr, when, valueExpr){
            super();
            this.variant = variant;
            this.classRefs = classRefs;
            this.attributeRef = attributeRef;
            this.cssDeclaration = cssDeclaration;
            this.to = toExpr;
            this.toExpr = toExpr;
            this.when = when;
            this.valueExpr = valueExpr;
            if (variant === "class") this.args = {
                to: toExpr,
                classRefs: classRefs
            };
            else if (variant === "attribute") this.args = {
                to: toExpr
            };
            else if (variant === "collection") this.args = {
                to: toExpr,
                value: valueExpr
            };
            else this.args = {
                to: toExpr,
                css: cssDeclaration
            };
        }
        static parse(parser) {
            if (!parser.matchToken("add")) return;
            var classRef = parser.parseElement("classRef");
            var attributeRef = null;
            var cssDeclaration = null;
            var valueExpr = null;
            if (classRef == null) {
                attributeRef = parser.parseElement("attributeRef");
                if (attributeRef == null) {
                    cssDeclaration = parser.parseElement("styleLiteral");
                    if (cssDeclaration == null) {
                        parser.pushFollow("to");
                        try {
                            valueExpr = parser.parseElement("expression");
                        } finally{
                            parser.popFollow();
                        }
                        if (valueExpr == null || !parser.currentToken() || parser.currentToken().value !== "to") parser.raiseError("Expected either a class reference or attribute expression");
                    }
                }
            } else {
                var classRefs = [
                    classRef
                ];
                while(classRef = parser.parseElement("classRef"))classRefs.push(classRef);
            }
            if (parser.matchToken("to")) var toExpr = parser.requireElement("expression");
            else var toExpr = parser.requireElement("implicitMeTarget");
            if (parser.matchToken("when")) var when = parser.requireElement("expression");
            if (classRefs) return new _AddCommand("class", classRefs, null, null, toExpr, when);
            else if (attributeRef) return new _AddCommand("attribute", null, attributeRef, null, toExpr, when);
            else if (cssDeclaration) return new _AddCommand("css", null, null, cssDeclaration, toExpr, null);
            else return new _AddCommand("collection", null, null, null, toExpr, null, valueExpr);
        }
        resolve(context, { to: to, classRefs: classRefs, css: css, value: value }) {
            var runtime2 = context.meta.runtime;
            var cmd = this;
            runtime2.nullCheck(to, this.toExpr);
            var result;
            if (this.variant === "collection") {
                if (Array.isArray(to)) to.push(value);
                else if (to instanceof Set) to.add(value);
                else if (to instanceof Map) throw new Error("Use 'set myMap[key] to value' for Maps");
                else throw new Error("Cannot add to " + typeof to);
                runtime2.notifyMutation(to);
                return runtime2.findNext(this, context);
            } else if (this.variant === "class") runtime2.forEach(classRefs, function(classRef) {
                if (cmd.when) result = runtime2.implicitLoopWhen(to, cmd.when, context, function(t) {
                    if (t instanceof Element) t.classList.add(classRef.className);
                }, function(t) {
                    if (t instanceof Element) t.classList.remove(classRef.className);
                });
                else runtime2.implicitLoop(to, function(t) {
                    if (t instanceof Element) t.classList.add(classRef.className);
                });
            });
            else if (this.variant === "attribute") {
                var attributeRef = this.attributeRef;
                if (this.when) result = runtime2.implicitLoopWhen(to, this.when, context, function(t) {
                    t.setAttribute(attributeRef.name, attributeRef.value);
                }, function(t) {
                    t.removeAttribute(attributeRef.name);
                });
                else runtime2.implicitLoop(to, function(t) {
                    t.setAttribute(attributeRef.name, attributeRef.value);
                });
            } else if (this.when) {
                var propNames = _cssPropertyNames(css);
                result = runtime2.implicitLoopWhen(to, this.when, context, function(t) {
                    t.style.cssText += css;
                }, function(t) {
                    _removeCssProperties(t, propNames);
                });
            } else runtime2.implicitLoop(to, function(t) {
                t.style.cssText += css;
            });
            if (result && result.then) return result.then(function() {
                return runtime2.findNext(cmd, context);
            });
            return runtime2.findNext(this, context);
        }
    };
    var RemoveCommand = class _RemoveCommand extends Command {
        static keyword = "remove";
        constructor(variant, elementExpr, classRefs, attributeRef, cssDeclaration, fromExpr, when){
            super();
            this.variant = variant;
            this.elementExpr = elementExpr;
            this.classRefs = classRefs;
            this.attributeRef = attributeRef;
            this.cssDeclaration = cssDeclaration;
            this.from = fromExpr;
            this.fromExpr = fromExpr;
            this.when = when;
            if (variant === "element") this.args = {
                element: elementExpr,
                from: fromExpr
            };
            else if (variant === "css") this.args = {
                css: cssDeclaration,
                from: fromExpr
            };
            else this.args = {
                classRefs: classRefs,
                from: fromExpr
            };
        }
        static parse(parser) {
            if (!parser.matchToken("remove")) return;
            var classRef = parser.parseElement("classRef");
            var attributeRef = null;
            var cssDeclaration = null;
            var elementExpr = null;
            if (classRef == null) {
                attributeRef = parser.parseElement("attributeRef");
                if (attributeRef == null) {
                    cssDeclaration = parser.parseElement("styleLiteral");
                    if (cssDeclaration == null) {
                        elementExpr = parser.parseElement("expression");
                        if (elementExpr == null) parser.raiseError("Expected either a class reference, attribute expression or value expression");
                    }
                }
            } else {
                var classRefs = [
                    classRef
                ];
                while(classRef = parser.parseElement("classRef"))classRefs.push(classRef);
            }
            if (parser.matchToken("from")) var fromExpr = parser.requireElement("expression");
            else if (elementExpr == null) var fromExpr = parser.requireElement("implicitMeTarget");
            if (parser.matchToken("when")) {
                if (elementExpr) parser.raiseError("'when' clause is not supported when removing elements");
                var when = parser.requireElement("expression");
            }
            if (elementExpr) return new _RemoveCommand("element", elementExpr, null, null, null, fromExpr);
            else if (cssDeclaration) return new _RemoveCommand("css", null, null, null, cssDeclaration, fromExpr, when);
            else return new _RemoveCommand("classOrAttr", null, classRefs, attributeRef, null, fromExpr, when);
        }
        resolve(context, { element: element, classRefs: classRefs, css: css, from: from }) {
            var runtime2 = context.meta.runtime;
            var cmd = this;
            var result;
            if (this.variant === "element") {
                if (from == null && typeof this.elementExpr.delete === "function") {
                    var isDomTarget = this.isDOMTarget(element);
                    if (!isDomTarget) {
                        var lhsExprs = this.elementExpr.lhs;
                        var lhs = {};
                        for(var key in lhsExprs){
                            var sub = lhsExprs[key];
                            lhs[key] = sub && sub.evaluate ? sub.evaluate(context) : sub;
                        }
                        this.elementExpr.delete(context, lhs);
                        return this.findNext(context);
                    }
                }
                runtime2.nullCheck(element, this.elementExpr);
                if (from != null && Array.isArray(from)) {
                    var idx = from.indexOf(element);
                    if (idx > -1) from.splice(idx, 1);
                    runtime2.notifyMutation(from);
                } else if (from instanceof Set) {
                    from.delete(element);
                    runtime2.notifyMutation(from);
                } else if (from instanceof Map) {
                    from.delete(element);
                    runtime2.notifyMutation(from);
                } else runtime2.implicitLoop(element, function(target) {
                    if (target.parentElement && (from == null || from.contains(target))) target.parentElement.removeChild(target);
                });
            } else if (this.variant === "css") {
                runtime2.nullCheck(from, this.fromExpr);
                var propNames = _cssPropertyNames(css);
                runtime2.implicitLoop(from, function(target) {
                    _removeCssProperties(target, propNames);
                });
            } else {
                runtime2.nullCheck(from, this.fromExpr);
                if (classRefs) runtime2.forEach(classRefs, function(classRef) {
                    if (cmd.when) result = runtime2.implicitLoopWhen(from, cmd.when, context, function(t) {
                        t.classList.remove(classRef.className);
                    }, function(t) {
                        t.classList.add(classRef.className);
                    });
                    else runtime2.implicitLoop(from, function(t) {
                        t.classList.remove(classRef.className);
                    });
                });
                else {
                    var attributeRef = this.attributeRef;
                    if (this.when) result = runtime2.implicitLoopWhen(from, this.when, context, function(t) {
                        t.removeAttribute(attributeRef.name);
                    }, function(t) {
                        t.setAttribute(attributeRef.name, attributeRef.value);
                    });
                    else runtime2.implicitLoop(from, function(t) {
                        t.removeAttribute(attributeRef.name);
                    });
                }
            }
            if (result && result.then) return result.then(function() {
                return runtime2.findNext(cmd, context);
            });
            return runtime2.findNext(this, context);
        }
        isDOMTarget(element) {
            return element instanceof Node || element instanceof NodeList || element instanceof HTMLCollection;
        }
    };
    var ToggleCommand = class _ToggleCommand extends VisibilityCommand {
        static keyword = "toggle";
        constructor(classRef, classRef2, classRefs, attributeRef, attributeRef2, onExpr, time, evt, from, visibility, betweenClass, betweenAttr, hideShowStrategy, betweenValues, toggleExpr, styleProp){
            super();
            this.classRef = classRef;
            this.classRef2 = classRef2;
            this.classRefs = classRefs;
            this.attributeRef = attributeRef;
            this.attributeRef2 = attributeRef2;
            this.on = onExpr;
            this.time = time;
            this.evt = evt;
            this.from = from;
            this.visibility = visibility;
            this.betweenClass = betweenClass;
            this.betweenAttr = betweenAttr;
            this.hideShowStrategy = hideShowStrategy;
            this.betweenValues = betweenValues;
            this.toggleExpr = toggleExpr;
            this.styleProp = styleProp;
            this.onExpr = onExpr;
            this.args = {
                on: onExpr,
                time: time,
                evt: evt,
                from: from,
                classRef: classRef,
                classRef2: classRef2,
                classRefs: classRefs,
                betweenValues: betweenValues
            };
        }
        static parse(parser) {
            if (!parser.matchToken("toggle")) return;
            parser.matchAnyToken("the", "my");
            var visibility = false;
            var hideShowStrategy = null;
            var onExpr = null;
            var classRef = null;
            var classRef2 = null;
            var classRefs = null;
            var attributeRef = null;
            var attributeRef2 = null;
            var betweenClass = false;
            var betweenAttr = false;
            var toggleExpr = null;
            var styleProp = null;
            if (parser.currentToken().type === "STYLE_REF") {
                let styleRef = parser.consumeToken();
                styleProp = styleRef.value.slice(1);
                visibility = true;
                hideShowStrategy = VisibilityCommand.resolveHideShowStrategy(parser, styleProp);
                if (parser.matchToken("of")) {
                    var follows = parser.pushFollows("with", "between");
                    try {
                        onExpr = parser.requireElement("expression");
                    } finally{
                        parser.popFollows(follows);
                    }
                } else onExpr = parser.requireElement("implicitMeTarget");
            } else if (parser.matchToken("between")) {
                classRef = parser.parseElement("classRef");
                if (classRef != null) {
                    betweenClass = true;
                    parser.requireToken("and");
                    classRef2 = parser.requireElement("classRef");
                } else {
                    betweenAttr = true;
                    attributeRef = parser.parseElement("attributeRef");
                    if (attributeRef == null) parser.raiseError("Expected either a class reference or attribute expression");
                    parser.requireToken("and");
                    attributeRef2 = parser.requireElement("attributeRef");
                }
            } else if (classRef = parser.parseElement("classRef")) {
                classRefs = [
                    classRef
                ];
                while(classRef = parser.parseElement("classRef"))classRefs.push(classRef);
            } else if (attributeRef = parser.parseElement("attributeRef")) ;
            else {
                parser.pushFollow("between");
                toggleExpr = parser.parseElement("assignableExpression");
                parser.popFollow();
                if (toggleExpr == null) parser.raiseError("Expected a class reference, attribute, style property, or settable expression");
            }
            if (!visibility && !toggleExpr) {
                if (parser.matchToken("on")) onExpr = parser.requireElement("expression");
                else onExpr = parser.requireElement("implicitMeTarget");
            }
            var betweenValues = null;
            if (parser.matchToken("between")) {
                parser.pushFollow("and");
                betweenValues = [
                    parser.requireElement("expression")
                ];
                while(parser.matchOpToken(","))betweenValues.push(parser.requireElement("expression"));
                parser.popFollow();
                parser.requireToken("and");
                betweenValues.push(parser.requireElement("expression"));
            }
            if (toggleExpr && !betweenValues) parser.raiseError("toggle <expression> requires 'between' with values");
            var time = null;
            var evt = null;
            var from = null;
            if (parser.peekToken("for") && !parser.peekToken("in", 2)) {
                parser.matchToken("for");
                time = parser.requireElement("expression");
            } else if (parser.matchToken("until")) {
                evt = parser.requireElement("dotOrColonPath", "Expected event name");
                if (parser.matchToken("from")) from = parser.requireElement("expression");
            }
            return new _ToggleCommand(classRef, classRef2, classRefs, attributeRef, attributeRef2, onExpr, time, evt, from, visibility, betweenClass, betweenAttr, hideShowStrategy, betweenValues, toggleExpr, styleProp);
        }
        toggle(context, on, classRef, classRef2, classRefs, betweenValues) {
            if (this.betweenValues) {
                if (this.visibility) context.meta.runtime.implicitLoop(on, (target)=>{
                    var current2 = target.style[this.styleProp] || getComputedStyle(target)[this.styleProp];
                    var idx2 = betweenValues.findIndex((v)=>v == current2);
                    target.style[this.styleProp] = betweenValues[(idx2 + 1) % betweenValues.length];
                });
                else {
                    var current = this.toggleExpr.evaluate(context);
                    var idx = betweenValues.findIndex((v)=>v == current);
                    var next = betweenValues[(idx + 1) % betweenValues.length];
                    var lhsValues = {};
                    for(var key in this.toggleExpr.lhs){
                        var val = this.toggleExpr.lhs[key];
                        lhsValues[key] = val && val.evaluate ? val.evaluate(context) : val;
                    }
                    this.toggleExpr.set(context, lhsValues, next);
                }
                return;
            }
            context.meta.runtime.nullCheck(on, this.onExpr);
            if (this.visibility) context.meta.runtime.implicitLoop(on, (target)=>{
                this.hideShowStrategy("toggle", target, null, context.meta.runtime);
            });
            else if (this.betweenClass) context.meta.runtime.implicitLoop(on, (target)=>{
                if (target.classList.contains(classRef.className)) {
                    target.classList.remove(classRef.className);
                    target.classList.add(classRef2.className);
                } else {
                    target.classList.add(classRef.className);
                    target.classList.remove(classRef2.className);
                }
            });
            else if (this.betweenAttr) context.meta.runtime.implicitLoop(on, (target)=>{
                if (target.hasAttribute(this.attributeRef.name) && target.getAttribute(this.attributeRef.name) === this.attributeRef.value) {
                    target.removeAttribute(this.attributeRef.name);
                    target.setAttribute(this.attributeRef2.name, this.attributeRef2.value);
                } else {
                    if (target.hasAttribute(this.attributeRef2.name)) target.removeAttribute(this.attributeRef2.name);
                    target.setAttribute(this.attributeRef.name, this.attributeRef.value);
                }
            });
            else if (classRefs) context.meta.runtime.forEach(classRefs, (classRef3)=>{
                context.meta.runtime.implicitLoop(on, (target)=>{
                    target.classList.toggle(classRef3.className);
                });
            });
            else context.meta.runtime.implicitLoop(on, (target)=>{
                if (target.hasAttribute(this.attributeRef.name)) target.removeAttribute(this.attributeRef.name);
                else target.setAttribute(this.attributeRef.name, this.attributeRef.value);
            });
        }
        resolve(context, { on: on, time: time, evt: evt, from: from, classRef: classRef, classRef2: classRef2, classRefs: classRefs, betweenValues: betweenValues }) {
            if (time) return new Promise((resolve)=>{
                this.toggle(context, on, classRef, classRef2, classRefs, betweenValues);
                setTimeout(()=>{
                    this.toggle(context, on, classRef, classRef2, classRefs, betweenValues);
                    resolve(this.findNext(context));
                }, time);
            });
            else if (evt) return new Promise((resolve)=>{
                var target = from || context.me;
                target.addEventListener(evt, ()=>{
                    this.toggle(context, on, classRef, classRef2, classRefs, betweenValues);
                    resolve(this.findNext(context));
                }, {
                    once: true
                });
                this.toggle(context, on, classRef, classRef2, classRefs, betweenValues);
            });
            else {
                this.toggle(context, on, classRef, classRef2, classRefs, betweenValues);
                return this.findNext(context);
            }
        }
    };
    var HideCommand = class _HideCommand extends VisibilityCommand {
        static keyword = "hide";
        constructor(targetExpr, when, hideShowStrategy){
            super();
            this.target = targetExpr;
            this.targetExpr = targetExpr;
            this.when = when;
            this.hideShowStrategy = hideShowStrategy;
            this.args = {
                target: targetExpr
            };
        }
        static parse(parser) {
            if (!parser.matchToken("hide")) return;
            var targetExpr = VisibilityCommand.parseShowHideTarget(parser);
            var name = null;
            if (parser.matchToken("with")) {
                name = parser.requireTokenType("IDENTIFIER", "STYLE_REF").value;
                if (name.startsWith("*")) name = name.slice(1);
            }
            if (parser.matchToken("when")) var when = parser.requireElement("expression");
            var hideShowStrategy = VisibilityCommand.resolveHideShowStrategy(parser, name);
            return new _HideCommand(targetExpr, when, hideShowStrategy);
        }
        resolve(ctx, { target: target }) {
            var runtime2 = ctx.meta.runtime;
            var cmd = this;
            runtime2.nullCheck(target, this.targetExpr);
            if (this.when) {
                var result = runtime2.implicitLoopWhen(target, this.when, ctx, function(elt) {
                    cmd.hideShowStrategy("hide", elt, null, runtime2);
                }, function(elt) {
                    cmd.hideShowStrategy("show", elt, null, runtime2);
                });
                if (result && result.then) return result.then(function() {
                    return runtime2.findNext(cmd, ctx);
                });
            } else runtime2.implicitLoop(target, function(elt) {
                cmd.hideShowStrategy("hide", elt, null, runtime2);
            });
            return runtime2.findNext(this, ctx);
        }
    };
    var ShowCommand = class _ShowCommand extends VisibilityCommand {
        static keyword = "show";
        constructor(targetExpr, when, arg, hideShowStrategy){
            super();
            this.target = targetExpr;
            this.targetExpr = targetExpr;
            this.when = when;
            this.arg = arg;
            this.hideShowStrategy = hideShowStrategy;
            this.args = {
                target: targetExpr
            };
        }
        static parse(parser) {
            if (!parser.matchToken("show")) return;
            var targetExpr = VisibilityCommand.parseShowHideTarget(parser);
            var name = null;
            if (parser.matchToken("with")) {
                name = parser.requireTokenType("IDENTIFIER", "STYLE_REF").value;
                if (name.startsWith("*")) name = name.slice(1);
            }
            var arg = null;
            if (parser.matchOpToken(":")) {
                var tokenArr = parser.consumeUntilWhitespace();
                parser.matchTokenType("WHITESPACE");
                arg = tokenArr.map(function(t) {
                    return t.value;
                }).join("");
            }
            if (parser.matchToken("when")) var when = parser.requireElement("expression");
            var hideShowStrategy = VisibilityCommand.resolveHideShowStrategy(parser, name);
            return new _ShowCommand(targetExpr, when, arg, hideShowStrategy);
        }
        resolve(ctx, { target: target }) {
            var runtime2 = ctx.meta.runtime;
            var cmd = this;
            runtime2.nullCheck(target, this.targetExpr);
            if (this.when) {
                var result = runtime2.implicitLoopWhen(target, this.when, ctx, function(elt) {
                    cmd.hideShowStrategy("show", elt, cmd.arg, runtime2);
                }, function(elt) {
                    cmd.hideShowStrategy("hide", elt, null, runtime2);
                });
                if (result && result.then) return result.then(function() {
                    return runtime2.findNext(cmd, ctx);
                });
            } else runtime2.implicitLoop(target, function(elt) {
                cmd.hideShowStrategy("show", elt, cmd.arg, runtime2);
            });
            return runtime2.findNext(this, ctx);
        }
    };
    var TakeCommand = class _TakeCommand extends Command {
        static keyword = "take";
        constructor(variant, classRefs, attributeRef, fromExpr, forExpr, replacementValue, replacementClass){
            super();
            this.variant = variant;
            this.classRefs = classRefs;
            this.attributeRef = attributeRef;
            this.from = fromExpr;
            this.fromExpr = fromExpr;
            this.forElt = forExpr;
            this.forExpr = forExpr;
            this.replacementValue = replacementValue;
            this.replacementClass = replacementClass;
            if (variant === "class") this.args = {
                classRefs: classRefs,
                from: fromExpr,
                forElt: forExpr
            };
            else this.args = {
                from: fromExpr,
                forElt: forExpr,
                replacementValue: replacementValue
            };
        }
        static parse(parser) {
            if (parser.matchToken("take")) {
                let classRef = null;
                let classRefs = [];
                while(classRef = parser.parseElement("classRef"))classRefs.push(classRef);
                var attributeRef = null;
                var replacementValue = null;
                var replacementClass = null;
                let weAreTakingClasses = classRefs.length > 0;
                if (!weAreTakingClasses) {
                    attributeRef = parser.parseElement("attributeRef");
                    if (attributeRef == null) parser.raiseError("Expected either a class reference or attribute expression");
                    if (parser.matchToken("with")) replacementValue = parser.requireElement("expression");
                } else if (parser.matchToken("with")) {
                    if (classRefs.length > 1) parser.raiseError("`with` cannot be combined with multiple class refs");
                    replacementClass = parser.requireElement("classRef");
                }
                if (parser.matchToken("from")) {
                    var fromExpr = parser.requireElement("expression");
                    if (parser.matchToken("giving")) {
                        if (weAreTakingClasses) {
                            if (replacementClass) parser.raiseError("`giving` cannot be combined with `with`");
                            if (classRefs.length > 1) parser.raiseError("`giving` cannot be combined with multiple class refs");
                            replacementClass = parser.requireElement("classRef");
                        } else {
                            if (replacementValue) parser.raiseError("`giving` cannot be combined with `with`");
                            replacementValue = parser.requireElement("expression");
                        }
                    }
                }
                if (parser.matchToken("for")) var forExpr = parser.requireElement("expression");
                else var forExpr = parser.requireElement("implicitMeTarget");
                if (weAreTakingClasses) return new _TakeCommand("class", classRefs, null, fromExpr, forExpr, null, replacementClass);
                else return new _TakeCommand("attribute", null, attributeRef, fromExpr, forExpr, replacementValue, null);
            }
        }
        resolve(context, { classRefs: classRefs, from: from, forElt: forElt, replacementValue: replacementValue }) {
            if (this.variant === "class") {
                context.meta.runtime.nullCheck(forElt, this.forExpr);
                var replacementClass = this.replacementClass ? this.replacementClass.className : null;
                context.meta.runtime.implicitLoop(classRefs, (classRef)=>{
                    var clazz = classRef.className;
                    if (from) context.meta.runtime.implicitLoop(from, (target)=>{
                        target.classList.remove(clazz);
                        if (replacementClass) target.classList.add(replacementClass);
                    });
                    else context.meta.runtime.implicitLoop(classRef, (target)=>{
                        target.classList.remove(clazz);
                        if (replacementClass) target.classList.add(replacementClass);
                    });
                    context.meta.runtime.implicitLoop(forElt, (target)=>{
                        target.classList.add(clazz);
                        if (replacementClass) target.classList.remove(replacementClass);
                    });
                });
            } else {
                context.meta.runtime.nullCheck(from, this.fromExpr);
                context.meta.runtime.nullCheck(forElt, this.forExpr);
                context.meta.runtime.implicitLoop(from, (target)=>{
                    if (!replacementValue) target.removeAttribute(this.attributeRef.name);
                    else target.setAttribute(this.attributeRef.name, replacementValue);
                });
                context.meta.runtime.implicitLoop(forElt, (target)=>{
                    target.setAttribute(this.attributeRef.name, this.attributeRef.value || "");
                });
            }
            return this.findNext(context);
        }
    };
    var MeasureCommand = class _MeasureCommand extends Command {
        static keyword = "measure";
        constructor(targetExpr, propsToMeasure){
            super();
            this.properties = propsToMeasure;
            this.targetExpr = targetExpr;
            this.args = {
                target: targetExpr
            };
        }
        static parse(parser) {
            if (!parser.matchToken("measure")) return;
            var targetExpr;
            var propsToMeasure = [];
            var MEASURE_PROPS = [
                "x",
                "y",
                "left",
                "top",
                "right",
                "bottom",
                "width",
                "height",
                "bounds",
                "scrollLeft",
                "scrollTop",
                "scrollLeftMax",
                "scrollTopMax",
                "scrollWidth",
                "scrollHeight",
                "scroll"
            ];
            if (parser.commandBoundary(parser.currentToken())) targetExpr = parser.parseElement("implicitMeTarget");
            else {
                var expr = parser.requireElement("expression");
                if (expr.type === "symbol" && MEASURE_PROPS.includes(expr.name)) {
                    targetExpr = parser.parseElement("implicitMeTarget");
                    propsToMeasure.push(expr.name);
                } else if (expr.type === "possessive" && expr.prop) {
                    targetExpr = expr.root;
                    propsToMeasure.push(expr.prop.value);
                } else if (expr.type === "ofExpression" && expr.prop) {
                    targetExpr = expr.root;
                    propsToMeasure.push(expr.prop.value);
                } else targetExpr = expr;
            }
            while(parser.matchOpToken(","))propsToMeasure.push(parser.requireTokenType("IDENTIFIER").value);
            return new _MeasureCommand(targetExpr, propsToMeasure);
        }
        resolve(ctx, { target: target }) {
            ctx.meta.runtime.nullCheck(target, this.targetExpr);
            if (0 in target) target = target[0];
            var rect = target.getBoundingClientRect();
            var scroll = {
                top: target.scrollTop,
                left: target.scrollLeft,
                topMax: target.scrollTopMax,
                leftMax: target.scrollLeftMax,
                height: target.scrollHeight,
                width: target.scrollWidth
            };
            ctx.result = {
                x: rect.x,
                y: rect.y,
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height,
                bounds: rect,
                scrollLeft: scroll.left,
                scrollTop: scroll.top,
                scrollLeftMax: scroll.leftMax,
                scrollTopMax: scroll.topMax,
                scrollWidth: scroll.width,
                scrollHeight: scroll.height,
                scroll: scroll
            };
            ctx.meta.runtime.forEach(this.properties, (prop)=>{
                if (prop in ctx.result) ctx.locals[prop] = ctx.result[prop];
                else throw new Error("No such measurement as " + prop);
            });
            return this.findNext(ctx);
        }
    };
    var FocusCommand = class _FocusCommand extends Command {
        static keyword = "focus";
        constructor(target){
            super();
            this.args = {
                target: target
            };
        }
        static parse(parser) {
            if (!parser.matchToken("focus")) return;
            var target = null;
            if (!parser.commandBoundary(parser.currentToken())) target = parser.requireElement("expression");
            return new _FocusCommand(target);
        }
        resolve(ctx, { target: target }) {
            (target || ctx.me).focus();
            return this.findNext(ctx);
        }
    };
    var BlurCommand = class _BlurCommand extends Command {
        static keyword = "blur";
        constructor(target){
            super();
            this.args = {
                target: target
            };
        }
        static parse(parser) {
            if (!parser.matchToken("blur")) return;
            var target = null;
            if (!parser.commandBoundary(parser.currentToken())) target = parser.requireElement("expression");
            return new _BlurCommand(target);
        }
        resolve(ctx, { target: target }) {
            (target || ctx.me).blur();
            return this.findNext(ctx);
        }
    };
    var EmptyCommand = class _EmptyCommand extends Command {
        static keyword = [
            "empty",
            "clear"
        ];
        constructor(target){
            super();
            this.args = {
                target: target
            };
        }
        static parse(parser) {
            if (!parser.matchToken("empty") && !parser.matchToken("clear")) return;
            var target = null;
            if (!parser.commandBoundary(parser.currentToken())) target = parser.requireElement("expression");
            return new _EmptyCommand(target);
        }
        resolve(ctx, { target: target }) {
            var elt = target || ctx.me;
            if (Array.isArray(elt)) {
                elt.splice(0);
                ctx.meta.runtime.notifyMutation(elt);
            } else if (elt instanceof Set || elt instanceof Map) {
                elt.clear();
                ctx.meta.runtime.notifyMutation(elt);
            } else ctx.meta.runtime.implicitLoop(elt, function(e) {
                var tag = e.tagName;
                if (tag === "INPUT") {
                    if (e.type === "checkbox" || e.type === "radio") e.checked = false;
                    else e.value = "";
                } else if (tag === "TEXTAREA") e.value = "";
                else if (tag === "SELECT") e.selectedIndex = -1;
                else if (tag === "FORM") e.querySelectorAll("input, textarea, select").forEach(function(inp) {
                    if (inp.tagName === "INPUT") {
                        if (inp.type === "checkbox" || inp.type === "radio") inp.checked = false;
                        else inp.value = "";
                    } else if (inp.tagName === "TEXTAREA") inp.value = "";
                    else if (inp.tagName === "SELECT") inp.selectedIndex = -1;
                });
                else e.replaceChildren();
            });
            return this.findNext(ctx);
        }
    };
    var ResetCommand = class _ResetCommand extends Command {
        static keyword = "reset";
        constructor(target){
            super();
            this.args = {
                target: target
            };
        }
        static parse(parser) {
            if (!parser.matchToken("reset")) return;
            var target = null;
            if (!parser.commandBoundary(parser.currentToken())) target = parser.requireElement("expression");
            return new _ResetCommand(target);
        }
        resolve(ctx, { target: target }) {
            var elt = target || ctx.me;
            ctx.meta.runtime.implicitLoop(elt, function(e) {
                var tag = e.tagName;
                if (tag === "FORM") e.reset();
                else if (tag === "INPUT") {
                    if (e.type === "checkbox" || e.type === "radio") e.checked = e.defaultChecked;
                    else e.value = e.defaultValue;
                } else if (tag === "TEXTAREA") e.value = e.defaultValue;
                else if (tag === "SELECT") for(var i = 0; i < e.options.length; i++)e.options[i].selected = e.options[i].defaultSelected;
            });
            return this.findNext(ctx);
        }
    };
    function _openElement(elt) {
        if (elt instanceof HTMLDialogElement) {
            if (!elt.open) elt.showModal();
        } else if (elt instanceof HTMLDetailsElement) elt.open = true;
        else if (elt.hasAttribute && elt.hasAttribute("popover")) elt.showPopover();
        else if (typeof elt.open === "function") elt.open();
    }
    function _closeElement(elt) {
        if (elt instanceof HTMLDialogElement) elt.close();
        else if (elt instanceof HTMLDetailsElement) elt.open = false;
        else if (elt.hasAttribute && elt.hasAttribute("popover")) elt.hidePopover();
        else if (typeof elt.close === "function") elt.close();
    }
    var OpenCommand = class _OpenCommand extends Command {
        static keyword = "open";
        constructor(target, fullscreen){
            super();
            this.fullscreen = fullscreen;
            this.args = {
                target: target
            };
        }
        static parse(parser) {
            if (!parser.matchToken("open")) return;
            var fullscreen = parser.matchToken("fullscreen");
            var target = null;
            if (!parser.commandBoundary(parser.currentToken())) target = parser.requireElement("expression");
            return new _OpenCommand(target, !!fullscreen);
        }
        resolve(ctx, { target: target }) {
            var elt = target || ctx.me;
            if (this.fullscreen) return (target || document.documentElement).requestFullscreen().then(()=>{
                return this.findNext(ctx);
            });
            ctx.meta.runtime.implicitLoop(elt, _openElement);
            return this.findNext(ctx);
        }
    };
    var CloseCommand = class _CloseCommand extends Command {
        static keyword = "close";
        constructor(target, fullscreen){
            super();
            this.fullscreen = fullscreen;
            this.args = {
                target: target
            };
        }
        static parse(parser) {
            if (!parser.matchToken("close")) return;
            var fullscreen = parser.matchToken("fullscreen");
            var target = null;
            if (!parser.commandBoundary(parser.currentToken())) target = parser.requireElement("expression");
            return new _CloseCommand(target, !!fullscreen);
        }
        resolve(ctx, { target: target }) {
            if (this.fullscreen) return document.exitFullscreen().then(()=>{
                return this.findNext(ctx);
            });
            var elt = target || ctx.me;
            ctx.meta.runtime.implicitLoop(elt, _closeElement);
            return this.findNext(ctx);
        }
    };
    var SpeakCommand = class _SpeakCommand extends Command {
        static keyword = "speak";
        constructor(text, voice, rate, pitch, volume){
            super();
            this.voice = voice;
            this.rate = rate;
            this.pitch = pitch;
            this.volume = volume;
            this.args = {
                text: text,
                voice: voice,
                rate: rate,
                pitch: pitch,
                volume: volume
            };
        }
        static parse(parser) {
            if (!parser.matchToken("speak")) return;
            var text = parser.requireElement("expression");
            var voice = null, rate = null, pitch = null, volume = null;
            while(parser.matchToken("with")){
                if (parser.matchToken("voice")) voice = parser.requireElement("expression");
                else if (parser.matchToken("rate")) rate = parser.requireElement("expression");
                else if (parser.matchToken("pitch")) pitch = parser.requireElement("expression");
                else if (parser.matchToken("volume")) volume = parser.requireElement("expression");
                else parser.raiseExpected("voice", "rate", "pitch", "volume");
            }
            return new _SpeakCommand(text, voice, rate, pitch, volume);
        }
        resolve(ctx, { text: text, voice: voice, rate: rate, pitch: pitch, volume: volume }) {
            var utterance = new SpeechSynthesisUtterance(String(text));
            if (voice) {
                var voices = speechSynthesis.getVoices();
                var match = voices.find((v)=>v.name === voice);
                if (match) utterance.voice = match;
            }
            if (rate != null) utterance.rate = rate;
            if (pitch != null) utterance.pitch = pitch;
            if (volume != null) utterance.volume = volume;
            var cmd = this;
            return new Promise(function(resolve) {
                utterance.onend = function() {
                    resolve(ctx.meta.runtime.findNext(cmd, ctx));
                };
                speechSynthesis.speak(utterance);
            });
        }
    };
    var SelectCommand = class _SelectCommand extends Command {
        static keyword = "select";
        constructor(target){
            super();
            this.args = {
                target: target
            };
        }
        static parse(parser) {
            if (!parser.matchToken("select")) return;
            var target = null;
            if (!parser.commandBoundary(parser.currentToken())) target = parser.requireElement("expression");
            return new _SelectCommand(target);
        }
        resolve(ctx, { target: target }) {
            var elt = target || ctx.me;
            if (typeof elt.select === "function") elt.select();
            return this.findNext(ctx);
        }
    };
    var AskCommand = class _AskCommand extends Command {
        static keyword = "ask";
        constructor(message){
            super();
            this.args = {
                message: message
            };
        }
        static parse(parser) {
            if (!parser.matchToken("ask")) return;
            var message = parser.requireElement("expression");
            return new _AskCommand(message);
        }
        resolve(ctx, { message: message }) {
            ctx.result = prompt(String(message));
            return this.findNext(ctx);
        }
    };
    var AnswerCommand = class _AnswerCommand extends Command {
        static keyword = "answer";
        constructor(message, choiceA, choiceB){
            super();
            this.choiceA = choiceA;
            this.choiceB = choiceB;
            this.args = {
                message: message,
                choiceA: choiceA,
                choiceB: choiceB
            };
        }
        static parse(parser) {
            if (!parser.matchToken("answer")) return;
            var message = parser.requireElement("expression");
            var choiceA = null, choiceB = null;
            if (parser.matchToken("with")) {
                parser.pushFollow("or");
                try {
                    choiceA = parser.requireElement("expression");
                } finally{
                    parser.popFollow();
                }
                parser.requireToken("or");
                choiceB = parser.requireElement("expression");
            }
            return new _AnswerCommand(message, choiceA, choiceB);
        }
        resolve(ctx, { message: message, choiceA: choiceA, choiceB: choiceB }) {
            if (choiceA) ctx.result = confirm(String(message)) ? choiceA : choiceB;
            else alert(String(message));
            return this.findNext(ctx);
        }
    };
    var MorphCommand = class _MorphCommand extends Command {
        static keyword = "morph";
        constructor(target, content){
            super();
            this.args = {
                target: target,
                content: content
            };
        }
        static parse(parser) {
            if (!parser.matchToken("morph")) return;
            var target = parser.requireElement("expression");
            parser.requireToken("to");
            var content = parser.requireElement("expression");
            return new _MorphCommand(target, content);
        }
        resolve(ctx, { target: target, content: content }) {
            ctx.meta.runtime.implicitLoop(target, function(elt) {
                ctx.meta.runtime.morph(elt, content);
            });
            return this.findNext(ctx);
        }
    };
    // src/parsetree/commands/animations.js
    var animations_exports = {};
    __export(animations_exports, {
        SettleCommand: ()=>SettleCommand,
        TransitionCommand: ()=>TransitionCommand,
        ViewTransitionCommand: ()=>ViewTransitionCommand
    });
    var SettleCommand = class _SettleCommand extends Command {
        static keyword = "settle";
        constructor(onExpr){
            super();
            this.onExpr = onExpr;
            this.args = {
                on: onExpr
            };
        }
        static parse(parser) {
            if (parser.matchToken("settle")) {
                if (!parser.commandBoundary(parser.currentToken())) var onExpr = parser.requireElement("expression");
                else var onExpr = parser.requireElement("implicitMeTarget");
                return new _SettleCommand(onExpr);
            }
        }
        resolve(context, { on: on }) {
            context.meta.runtime.nullCheck(on, this.onExpr);
            var cmd = this;
            var elements = on instanceof Element ? [
                on
            ] : Array.from(on);
            return Promise.all(elements.map(_settleOne)).then(function() {
                return context.meta.runtime.findNext(cmd, context);
            });
        }
    };
    function _settleOne(elt) {
        return new Promise(function(resolve) {
            var resolved = false;
            var transitionStarted = false;
            elt.addEventListener("transitionstart", function() {
                transitionStarted = true;
            }, {
                once: true
            });
            setTimeout(function() {
                if (!transitionStarted && !resolved) {
                    resolved = true;
                    resolve();
                }
            }, 500);
            elt.addEventListener("transitionend", function() {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            }, {
                once: true
            });
        });
    }
    var TransitionCommand = class _TransitionCommand extends Command {
        static keyword = "transition";
        constructor(propExprs, from, to, usingExpr, over){
            super();
            this.propExprs = propExprs;
            this.from = from;
            this.to = to;
            this.usingExpr = usingExpr;
            this.over = over;
            this.args = {
                from: from,
                to: to,
                using: usingExpr,
                over: over
            };
        }
        static parse(parser) {
            if (!parser.matchToken("transition")) return;
            var propExprs = [];
            var from = [];
            var to = [];
            do {
                var follows = parser.pushFollows("from", "to");
                try {
                    propExprs.push(parser.requireElement("expression"));
                } finally{
                    parser.popFollows(follows);
                }
                from.push(parser.matchToken("from") ? parser.requireElement("expression") : null);
                parser.requireToken("to");
                to.push(parser.matchToken("initial") ? "initial" : parser.requireElement("expression"));
            }while (!parser.commandBoundary(parser.currentToken()) && parser.currentToken().value !== "over" && parser.currentToken().value !== "using");
            var over, usingExpr;
            if (parser.matchToken("over")) over = parser.requireElement("expression");
            else if (parser.matchToken("using")) usingExpr = parser.requireElement("expression");
            return new _TransitionCommand(propExprs, from, to, usingExpr, over);
        }
        resolve(context, { from: from, to: to, using: using, over: over }) {
            var cmd = this;
            var runtime2 = context.meta.runtime;
            var target;
            if (this.propExprs[0].root) {
                target = this.propExprs[0].root.evaluate(context);
                runtime2.nullCheck(target, this.propExprs[0].root);
            } else target = context.me;
            var promises = [];
            runtime2.implicitLoop(target, function(target2) {
                promises.push(new Promise(function(resolve) {
                    var initialTransition = target2.style.transition;
                    if (over) target2.style.transition = "all " + over + "ms ease-in";
                    else if (using) target2.style.transition = using;
                    else target2.style.transition = config.defaultTransition;
                    var internalData = runtime2.getInternalData(target2);
                    if (!internalData.transitionInitials) internalData.transitionInitials = {};
                    var initialValues = internalData.transitionInitials;
                    for(var j = 0; j < cmd.propExprs.length; j++)if (!(j in initialValues)) initialValues[j] = cmd.propExprs[j].evaluate(context);
                    for(var j = 0; j < cmd.propExprs.length; j++)if (from[j] != null) {
                        var lhs = {};
                        for(var key in cmd.propExprs[j].lhs){
                            var e = cmd.propExprs[j].lhs[key];
                            lhs[key] = e && e.evaluate ? e.evaluate(context) : e;
                        }
                        cmd.propExprs[j].set(context, lhs, from[j]);
                    }
                    var transitionStarted = false;
                    var resolved = false;
                    target2.addEventListener("transitionend", function() {
                        if (!resolved) {
                            target2.style.transition = initialTransition;
                            resolved = true;
                            resolve();
                        }
                    }, {
                        once: true
                    });
                    target2.addEventListener("transitionstart", function() {
                        transitionStarted = true;
                    }, {
                        once: true
                    });
                    setTimeout(function() {
                        if (!resolved && !transitionStarted) {
                            target2.style.transition = initialTransition;
                            resolved = true;
                            resolve();
                        }
                    }, 100);
                    setTimeout(function() {
                        for(var j2 = 0; j2 < cmd.propExprs.length; j2++){
                            var lhs2 = {};
                            for(var key2 in cmd.propExprs[j2].lhs){
                                var e2 = cmd.propExprs[j2].lhs[key2];
                                lhs2[key2] = e2 && e2.evaluate ? e2.evaluate(context) : e2;
                            }
                            var val = to[j2] === "initial" ? initialValues[j2] : to[j2];
                            cmd.propExprs[j2].set(context, lhs2, val);
                        }
                    }, 0);
                }));
            });
            return Promise.all(promises).then(function() {
                return cmd.findNext(context);
            });
        }
    };
    var AbortViewTransition = class extends Command {
        constructor(){
            super();
            this.type = "abortViewTransition";
        }
        resolve(context) {
            var vt = context.meta.viewTransition;
            if (vt) {
                console.warn("hyperscript: view transition skipped due to early exit (return, halt, or break)");
                context.meta.viewTransition = null;
                vt.finished.catch(function() {});
                vt.transition.skipTransition();
                vt.bodyDone();
            }
            return context.meta.runtime.findNext(this);
        }
    };
    var ESCAPE_TYPES = /* @__PURE__ */ new Set([
        "returnCommand",
        "exitCommand",
        "haltCommand",
        "breakCommand",
        "continueCommand"
    ]);
    var LOOP_TYPES = /* @__PURE__ */ new Set([
        "breakCommand",
        "continueCommand"
    ]);
    function insertAborts(cmd, inLoop, visited) {
        if (!visited) visited = /* @__PURE__ */ new Set();
        if (!cmd || visited.has(cmd)) return;
        visited.add(cmd);
        var childInLoop = inLoop || cmd.loop !== void 0;
        for (var key of Object.keys(cmd)){
            if (key === "parent") continue;
            var val = cmd[key];
            if (val instanceof ParseElement && ESCAPE_TYPES.has(val.type)) {
                if (!LOOP_TYPES.has(val.type) || !inLoop) {
                    var abort = new AbortViewTransition();
                    abort.next = val;
                    cmd[key] = abort;
                    visited.add(abort);
                }
            }
            for (var item of [
                val
            ].flat())if (item instanceof ParseElement) insertAborts(item, childInLoop, visited);
        }
    }
    var ViewTransitionTick = class extends Command {
        constructor(){
            super();
            this.type = "viewTransitionTick";
        }
        resolve(context) {
            return new Promise((resolve)=>{
                setTimeout(()=>resolve(context.meta.runtime.findNext(this)), 0);
            });
        }
    };
    var ViewTransitionEnd = class extends Command {
        constructor(){
            super();
            this.type = "viewTransitionEnd";
        }
        resolve(context) {
            var vt = context.meta.viewTransition;
            if (!vt) return context.meta.runtime.findNext(this.parent, context);
            vt.bodyDone();
            return vt.finished.then(()=>{
                context.meta.viewTransition = null;
                return context.meta.runtime.findNext(this.parent, context);
            });
        }
    };
    var ViewTransitionCommand = class _ViewTransitionCommand extends Command {
        static keyword = "start";
        constructor(body, transitionType){
            super();
            this.body = body;
            this.transitionType = transitionType;
            this.args = {
                type: transitionType
            };
        }
        static parse(parser) {
            if (!parser.matchToken("start")) return;
            parser.matchToken("a");
            parser.requireToken("view");
            parser.requireToken("transition");
            parser.matchToken("using");
            var typeToken = parser.matchTokenType("STRING");
            var transitionType = typeToken ? typeToken.value : null;
            var body = parser.requireElement("commandList");
            var tick = new ViewTransitionTick();
            tick.next = body;
            var endCmd = new ViewTransitionEnd();
            var last = body;
            while(last.next)last = last.next;
            last.next = endCmd;
            if (parser.hasMore()) parser.requireToken("end");
            insertAborts(body, false);
            var cmd = new _ViewTransitionCommand(tick, transitionType);
            parser.setParent(tick, cmd);
            parser.setParent(body, cmd);
            endCmd.parent = cmd;
            return cmd;
        }
        resolve(context, { type: type }) {
            if (!document.startViewTransition) return this.body;
            if (context.meta.viewTransition) throw new Error("A view transition is already in progress");
            var bodyDone;
            var bodyPromise = new Promise(function(r) {
                bodyDone = r;
            });
            var options = function() {
                return bodyPromise;
            };
            if (type) options = {
                update: function() {
                    return bodyPromise;
                },
                types: [
                    type
                ]
            };
            var transition = document.startViewTransition(options);
            context.meta.viewTransition = {
                bodyDone: bodyDone,
                finished: transition.finished,
                transition: transition
            };
            return this.body;
        }
    };
    // src/parsetree/commands/debug.js
    var debug_exports = {};
    __export(debug_exports, {
        BreakpointCommand: ()=>BreakpointCommand
    });
    var BreakpointCommand = class _BreakpointCommand extends Command {
        static keyword = "breakpoint";
        static parse(parser) {
            if (!parser.matchToken("breakpoint")) return;
            return new _BreakpointCommand();
        }
        resolve(ctx) {
            debugger;
            return this.findNext(ctx);
        }
    };
    // src/parsetree/features/on.js
    var on_exports = {};
    __export(on_exports, {
        OnFeature: ()=>OnFeature
    });
    var OnFeature = class _OnFeature extends Feature {
        static keyword = "on";
        constructor(displayName, events, start, every, errorHandler, errorSymbol, finallyHandler, queueAll, queueFirst, queueNone, queueLast){
            super();
            this.displayName = displayName;
            this.events = events;
            this.start = start;
            this.every = every;
            this.errorHandler = errorHandler;
            this.errorSymbol = errorSymbol;
            this.finallyHandler = finallyHandler;
            this.queueAll = queueAll;
            this.queueFirst = queueFirst;
            this.queueNone = queueNone;
            this.queueLast = queueLast;
        }
        execute(ctx) {
            const onFeature = this;
            const every = this.every;
            const queueNone = this.queueNone;
            const queueFirst = this.queueFirst;
            const queueLast = this.queueLast;
            const start = this.start;
            let eventQueueInfo = ctx.meta.runtime.getEventQueueFor(ctx.me, onFeature);
            if (eventQueueInfo.executing && every === false) {
                if (queueNone || queueFirst && eventQueueInfo.queue.length > 0) return;
                if (queueLast) eventQueueInfo.queue.length = 0;
                eventQueueInfo.queue.push(ctx);
                return;
            }
            eventQueueInfo.executing = true;
            ctx.meta.onHalt = function() {
                eventQueueInfo.executing = false;
                var queued = eventQueueInfo.queue.shift();
                if (queued) setTimeout(function() {
                    onFeature.execute(queued);
                }, 1);
            };
            ctx.meta.reject = function(err) {
                console.error(err.message ? err.message : err);
                console.error(err.stack);
                var hypertrace = ctx.meta.runtime.getHyperTrace(ctx, err);
                if (hypertrace) hypertrace.print();
                ctx.meta.runtime.triggerEvent(ctx.me, "exception", {
                    error: err
                });
            };
            start.execute(ctx);
        }
        install(elt, source, args, runtime2) {
            const onFeature = this;
            const displayName = this.displayName;
            const errorHandler = this.errorHandler;
            const errorSymbol = this.errorSymbol;
            const finallyHandler = this.finallyHandler;
            for (const eventSpec of onFeature.events){
                var targets;
                if (eventSpec.elsewhere) targets = [
                    document
                ];
                else if (eventSpec.from) targets = eventSpec.from.evaluate(runtime2.makeContext(elt, onFeature, elt, null));
                else targets = [
                    elt
                ];
                var internalData = runtime2.getInternalData(elt);
                if (!internalData.eventState) internalData.eventState = /* @__PURE__ */ new Map();
                if (!internalData.eventState.has(eventSpec)) internalData.eventState.set(eventSpec, {
                    execCount: 0,
                    debounced: void 0,
                    lastExec: void 0
                });
                var eventState = internalData.eventState.get(eventSpec);
                runtime2.implicitLoop(targets, function(target) {
                    var eventName = eventSpec.on;
                    if (target == null) {
                        console.warn("'%s' feature ignored because target does not exists:", displayName, elt);
                        return;
                    }
                    var eltData = runtime2.getInternalData(elt);
                    if (!eltData.listeners) eltData.listeners = [];
                    if (!eltData.observers) eltData.observers = [];
                    if (eventSpec.mutationSpec) {
                        eventName = "hyperscript:mutation";
                        const observer = new MutationObserver(function(mutationList, observer2) {
                            if (!onFeature.executing) runtime2.triggerEvent(target, eventName, {
                                mutationList: mutationList,
                                observer: observer2
                            });
                        });
                        observer.observe(target, eventSpec.mutationSpec);
                        eltData.observers.push(observer);
                    }
                    if (eventSpec.intersectionSpec) {
                        eventName = "hyperscript:intersection";
                        const observer = new IntersectionObserver(function(entries) {
                            for (const entry of entries){
                                var detail = {
                                    observer: observer
                                };
                                detail = Object.assign(detail, entry);
                                detail["intersecting"] = entry.isIntersecting;
                                runtime2.triggerEvent(target, eventName, detail);
                            }
                        }, eventSpec.intersectionSpec);
                        observer.observe(target);
                        eltData.observers.push(observer);
                    }
                    if (eventSpec.resizeSpec && target instanceof Element) {
                        eventName = "hyperscript:resize";
                        const observer = new ResizeObserver(function(entries) {
                            for (const entry of entries){
                                var detail = {
                                    width: entry.contentRect.width,
                                    height: entry.contentRect.height,
                                    contentRect: entry.contentRect,
                                    entry: entry
                                };
                                runtime2.triggerEvent(target, eventName, detail);
                            }
                        });
                        observer.observe(target);
                        eltData.observers.push(observer);
                    }
                    var addEventListener = target.addEventListener || target.on;
                    var handler;
                    addEventListener.call(target, eventName, handler = function listener(evt) {
                        if (typeof Node !== "undefined" && elt instanceof Node && target !== elt && !elt.isConnected) {
                            target.removeEventListener(eventName, listener);
                            return;
                        }
                        var ctx = runtime2.makeContext(elt, onFeature, elt, evt);
                        if (eventSpec.elsewhere && elt.contains(evt.target)) return;
                        if (eventSpec.from) ctx.result = target;
                        for (const arg of eventSpec.args){
                            let eventValue = ctx.event[arg.value];
                            if (eventValue !== void 0) ctx.locals[arg.value] = eventValue;
                            else if (ctx.event.detail != null) ctx.locals[arg.value] = ctx.event.detail[arg.value];
                        }
                        ctx.meta.errorHandler = errorHandler;
                        ctx.meta.errorSymbol = errorSymbol;
                        ctx.meta.finallyHandler = finallyHandler;
                        if (eventSpec.filter) {
                            var initialCtx = ctx.meta.context;
                            ctx.meta.context = ctx.event;
                            try {
                                var value = eventSpec.filter.evaluate(ctx);
                                if (!value) return;
                            } finally{
                                ctx.meta.context = initialCtx;
                            }
                        }
                        if (eventSpec.inExpr) {
                            var inElement = evt.target;
                            while(true)if (inElement.matches && inElement.matches(eventSpec.inExpr.css)) {
                                ctx.result = inElement;
                                break;
                            } else {
                                inElement = inElement.parentElement;
                                if (inElement == null) return;
                            }
                        }
                        eventState.execCount++;
                        if (eventSpec.startCount) {
                            if (eventSpec.endCount) {
                                if (eventState.execCount < eventSpec.startCount || eventState.execCount > eventSpec.endCount) return;
                            } else if (eventSpec.unbounded) {
                                if (eventState.execCount < eventSpec.startCount) return;
                            } else if (eventState.execCount !== eventSpec.startCount) return;
                        }
                        if (eventSpec.debounceTime) {
                            if (eventState.debounced) clearTimeout(eventState.debounced);
                            eventState.debounced = setTimeout(function() {
                                onFeature.execute(ctx);
                            }, eventSpec.debounceTime);
                            return;
                        }
                        if (eventSpec.throttleTime) {
                            if (eventState.lastExec && Date.now() < eventState.lastExec + eventSpec.throttleTime) return;
                            else eventState.lastExec = Date.now();
                        }
                        onFeature.execute(ctx);
                    });
                    eltData.listeners.push({
                        target: target,
                        event: eventName,
                        handler: handler
                    });
                });
            }
        }
        static parse(parser) {
            if (!parser.matchToken("on")) return;
            var every = false;
            var first = false;
            if (parser.matchToken("every")) every = true;
            else if (parser.matchToken("first")) first = true;
            var events = [];
            var displayName = null;
            do {
                var on = parser.requireElement("eventName", "Expected event name");
                var eventName = on.evalStatically();
                if (displayName) displayName = displayName + " or " + eventName;
                else displayName = "on " + eventName;
                var args = ParseElement.parseEventArgs(parser);
                var filter = null;
                if (parser.matchOpToken("[")) {
                    filter = parser.requireElement("expression");
                    parser.requireOpToken("]");
                }
                var startCount, endCount, unbounded;
                if (first) startCount = 1;
                else if (parser.currentToken().type === "NUMBER") {
                    var startCountToken = parser.consumeToken();
                    if (!startCountToken.value) return;
                    startCount = parseInt(startCountToken.value);
                    if (parser.matchToken("to")) {
                        var endCountToken = parser.consumeToken();
                        if (!endCountToken.value) return;
                        endCount = parseInt(endCountToken.value);
                    } else if (parser.matchToken("and")) {
                        unbounded = true;
                        parser.requireToken("on");
                    }
                }
                var intersectionSpec, mutationSpec, resizeSpec;
                if (eventName === "resize") resizeSpec = true;
                else if (eventName === "intersection") {
                    intersectionSpec = {};
                    if (parser.matchToken("with")) intersectionSpec["with"] = parser.requireElement("expression").evalStatically();
                    if (parser.matchToken("having")) do {
                        if (parser.matchToken("margin")) intersectionSpec["rootMargin"] = parser.requireElement("stringLike").evalStatically();
                        else if (parser.matchToken("threshold")) intersectionSpec["threshold"] = parser.requireElement("expression").evalStatically();
                        else parser.raiseError("Unknown intersection config specification");
                    }while (parser.matchToken("and"));
                } else if (eventName === "mutation") {
                    mutationSpec = {};
                    if (parser.matchToken("of")) {
                        do {
                            if (parser.matchToken("anything")) {
                                mutationSpec["attributes"] = true;
                                mutationSpec["subtree"] = true;
                                mutationSpec["characterData"] = true;
                                mutationSpec["childList"] = true;
                            } else if (parser.matchToken("childList")) mutationSpec["childList"] = true;
                            else if (parser.matchToken("attributes")) mutationSpec["attributes"] = true;
                            else if (parser.matchToken("subtree")) mutationSpec["subtree"] = true;
                            else if (parser.matchToken("characterData")) mutationSpec["characterData"] = true;
                            else if (parser.currentToken().type === "ATTRIBUTE_REF") {
                                var attribute = parser.consumeToken();
                                if (mutationSpec["attributeFilter"] == null) mutationSpec["attributeFilter"] = [];
                                if (attribute.value.startsWith("@")) mutationSpec["attributeFilter"].push(attribute.value.substring(1));
                                else parser.raiseError("Only shorthand attribute references are allowed here");
                            } else parser.raiseError("Unknown mutation config specification");
                        }while (parser.matchToken("or"));
                        if (mutationSpec["attributes"] || mutationSpec["attributeFilter"]) mutationSpec["attributeOldValue"] = true;
                        if (mutationSpec["characterData"]) mutationSpec["characterDataOldValue"] = true;
                    } else {
                        mutationSpec["attributes"] = true;
                        mutationSpec["characterData"] = true;
                        mutationSpec["childList"] = true;
                        mutationSpec["attributeOldValue"] = true;
                        mutationSpec["characterDataOldValue"] = true;
                    }
                }
                var from = null;
                var elsewhere = false;
                if (parser.matchToken("from")) {
                    if (parser.matchToken("elsewhere")) elsewhere = true;
                    else {
                        parser.pushFollow("or");
                        try {
                            from = parser.requireElement("expression");
                        } finally{
                            parser.popFollow();
                        }
                        if (!from) parser.raiseError('Expected either target value or "elsewhere".');
                    }
                }
                if (from === null && elsewhere === false && parser.matchToken("elsewhere")) elsewhere = true;
                if (parser.matchToken("in")) var inExpr = parser.parseElement("unaryExpression");
                if (parser.matchToken("debounced")) {
                    parser.requireToken("at");
                    var timeExpr = parser.requireElement("unaryExpression");
                    var debounceTime = timeExpr.evalStatically();
                } else if (parser.matchToken("throttled")) {
                    parser.requireToken("at");
                    var timeExpr = parser.requireElement("unaryExpression");
                    var throttleTime = timeExpr.evalStatically();
                }
                events.push({
                    every: every,
                    on: eventName,
                    args: args,
                    filter: filter,
                    from: from,
                    inExpr: inExpr,
                    elsewhere: elsewhere,
                    startCount: startCount,
                    endCount: endCount,
                    unbounded: unbounded,
                    debounceTime: debounceTime,
                    throttleTime: throttleTime,
                    mutationSpec: mutationSpec,
                    intersectionSpec: intersectionSpec,
                    resizeSpec: resizeSpec
                });
            }while (parser.matchToken("or"));
            var queueLast = true;
            if (!every) {
                if (parser.matchToken("queue")) {
                    if (parser.matchToken("all")) {
                        var queueAll = true;
                        var queueLast = false;
                    } else if (parser.matchToken("first")) var queueFirst = true;
                    else if (parser.matchToken("none")) var queueNone = true;
                    else parser.requireToken("last");
                }
            }
            var start = parser.requireElement("commandList");
            parser.ensureTerminated(start);
            var { errorHandler: errorHandler, errorSymbol: errorSymbol, finallyHandler: finallyHandler } = Feature.parseErrorAndFinally(parser);
            var onFeature = new _OnFeature(displayName, events, start, every, errorHandler, errorSymbol, finallyHandler, queueAll, queueFirst, queueNone, queueLast);
            parser.setParent(start, onFeature);
            return onFeature;
        }
    };
    // src/parsetree/features/def.js
    var def_exports = {};
    __export(def_exports, {
        DefFeature: ()=>DefFeature
    });
    var DefFeature = class _DefFeature extends Feature {
        static keyword = "def";
        constructor(funcName, nameSpace, nameVal, args, start, errorHandler, errorSymbol, finallyHandler){
            super();
            this.displayName = funcName + "(" + args.map(function(arg) {
                return arg.value;
            }).join(", ") + ")";
            this.name = funcName;
            this.args = args;
            this.start = start;
            this.errorHandler = errorHandler;
            this.errorSymbol = errorSymbol;
            this.finallyHandler = finallyHandler;
            this.nameSpace = nameSpace;
            this.nameVal = nameVal;
        }
        install(target, source, funcArgs, runtime2) {
            const args = this.args;
            const start = this.start;
            const errorHandler = this.errorHandler;
            const errorSymbol = this.errorSymbol;
            const finallyHandler = this.finallyHandler;
            const nameVal = this.nameVal;
            const nameSpace = this.nameSpace;
            const funcName = this.name;
            const functionFeature = this;
            var func = function() {
                var ctx = runtime2.makeContext(source, functionFeature, target, null);
                ctx.meta.errorHandler = errorHandler;
                ctx.meta.errorSymbol = errorSymbol;
                ctx.meta.finallyHandler = finallyHandler;
                for(var i = 0; i < args.length; i++){
                    var name = args[i];
                    var argumentVal = arguments[i];
                    if (name) ctx.locals[name.value] = argumentVal;
                }
                ctx.meta.caller = arguments[args.length];
                if (ctx.meta.caller) ctx.meta.callingCommand = ctx.meta.caller.meta.command;
                var resolve, reject;
                var promise = new Promise(function(theResolve, theReject) {
                    resolve = theResolve;
                    reject = theReject;
                });
                start.execute(ctx);
                if (ctx.meta.returned) return ctx.meta.returnValue;
                else {
                    ctx.meta.resolve = resolve;
                    ctx.meta.reject = reject;
                    return promise;
                }
            };
            func.hyperfunc = true;
            func.hypername = nameVal;
            runtime2.assignToNamespace(target, nameSpace, funcName, func);
        }
        static parse(parser) {
            if (!parser.matchToken("def")) return;
            var functionName = parser.requireElement("dotOrColonPath");
            var nameVal = functionName.evalStatically();
            var nameSpace = nameVal.split(".");
            var funcName = nameSpace.pop();
            var args = [];
            if (parser.matchOpToken("(")) {
                if (parser.matchOpToken(")")) ;
                else {
                    do args.push(parser.requireTokenType("IDENTIFIER"));
                    while (parser.matchOpToken(","));
                    parser.requireOpToken(")");
                }
            }
            var start = parser.requireElement("commandList");
            var { errorHandler: errorHandler, errorSymbol: errorSymbol, finallyHandler: finallyHandler } = Feature.parseErrorAndFinally(parser);
            var functionFeature = new _DefFeature(funcName, nameSpace, nameVal, args, start, errorHandler, errorSymbol, finallyHandler);
            parser.ensureTerminated(start);
            if (errorHandler) parser.ensureTerminated(errorHandler);
            parser.setParent(start, functionFeature);
            return functionFeature;
        }
    };
    // src/parsetree/features/set.js
    var set_exports = {};
    __export(set_exports, {
        SetFeature: ()=>SetFeature
    });
    var SetFeature = class _SetFeature extends Feature {
        static keyword = "set";
        constructor(setCmd){
            super();
            this.start = setCmd;
        }
        install(target, source, args, runtime2) {
            queueMicrotask(()=>{
                this.start && this.start.execute(runtime2.makeContext(target, this, target, null));
            });
        }
        static parse(parser) {
            let setCmd = parser.parseElement("setCommand");
            if (setCmd) {
                if (setCmd.target.scope === "local") parser.raiseError("variables declared at the feature level cannot be locally scoped (use :foo, ^foo, $foo, or an @attribute target instead).");
                let setFeature = new _SetFeature(setCmd);
                parser.ensureTerminated(setCmd);
                return setFeature;
            }
        }
    };
    // src/parsetree/features/init.js
    var init_exports = {};
    __export(init_exports, {
        InitFeature: ()=>InitFeature
    });
    var InitFeature = class _InitFeature extends Feature {
        static keyword = "init";
        constructor(start, immediately){
            super();
            this.start = start;
            this.immediately = immediately;
        }
        install(target, source, args, runtime2) {
            var handler = ()=>{
                this.start?.execute(runtime2.makeContext(target, this, target, null));
            };
            if (this.immediately) handler();
            else queueMicrotask(handler);
        }
        static parse(parser) {
            if (!parser.matchToken("init")) return;
            var immediately = parser.matchToken("immediately");
            var start = parser.requireElement("commandList");
            var initFeature = new _InitFeature(start, immediately);
            parser.ensureTerminated(start);
            parser.setParent(start, initFeature);
            return initFeature;
        }
    };
    // src/parsetree/features/worker.js
    var worker_exports = {};
    __export(worker_exports, {
        WorkerFeature: ()=>WorkerFeature
    });
    var WorkerFeature = class extends Feature {
        static keyword = "worker";
        static parse(parser) {
            if (parser.matchToken("worker")) {
                parser.raiseError("In order to use the 'worker' feature, include the _hyperscript worker plugin. See https://hyperscript.org/features/worker/ for more info.");
                return void 0;
            }
        }
    };
    // src/parsetree/features/behavior.js
    var behavior_exports = {};
    __export(behavior_exports, {
        BehaviorFeature: ()=>BehaviorFeature
    });
    var BehaviorFeature = class _BehaviorFeature extends Feature {
        static keyword = "behavior";
        constructor(path, nameSpace, name, formalParams, hs){
            super();
            this.path = path;
            this.nameSpace = nameSpace;
            this.name = name;
            this.formalParams = formalParams;
            this.hs = hs;
        }
        install(target, source, args, runtime2) {
            const path = this.path;
            const nameSpace = this.nameSpace;
            const name = this.name;
            const formalParams = this.formalParams;
            const hs = this.hs;
            runtime2.assignToNamespace(null, nameSpace, name, function(target2, source2, innerArgs) {
                var internalData = runtime2.getInternalData(target2);
                var scopeName = path + "Scope";
                var elementScope = internalData[scopeName] || (internalData[scopeName] = {});
                for(var i = 0; i < formalParams.length; i++)elementScope[formalParams[i]] = innerArgs[formalParams[i]];
                hs.apply(target2, source2, null, runtime2);
            });
        }
        static parse(parser) {
            if (!parser.matchToken("behavior")) return;
            var path = parser.requireElement("dotOrColonPath").evalStatically();
            var nameSpace = path.split(".");
            var name = nameSpace.pop();
            var formalParams = [];
            if (parser.matchOpToken("(") && !parser.matchOpToken(")")) {
                do formalParams.push(parser.requireTokenType("IDENTIFIER").value);
                while (parser.matchOpToken(","));
                parser.requireOpToken(")");
            }
            var hs = parser.requireElement("hyperscript");
            for(var i = 0; i < hs.features.length; i++){
                var feature = hs.features[i];
                feature.behavior = path;
            }
            return new _BehaviorFeature(path, nameSpace, name, formalParams, hs);
        }
    };
    // src/parsetree/features/install.js
    var install_exports = {};
    __export(install_exports, {
        InstallFeature: ()=>InstallFeature
    });
    var InstallFeature = class _InstallFeature extends Feature {
        static keyword = "install";
        constructor(behaviorPath, behaviorNamespace, args){
            super();
            this.behaviorPath = behaviorPath;
            this.behaviorNamespace = behaviorNamespace;
            this.behaviorArgs = args;
        }
        install(target, source, installArgs, runtime2) {
            var ctx = runtime2.makeContext(target, this, target, null);
            var behaviorArgs = this.behaviorArgs ? this.behaviorArgs.evaluate(ctx) : null;
            var behavior = runtime2.globalScope;
            for(var i = 0; i < this.behaviorNamespace.length; i++){
                behavior = behavior[this.behaviorNamespace[i]];
                if (typeof behavior !== "object" && typeof behavior !== "function") throw new Error("No such behavior defined as " + this.behaviorPath);
            }
            if (!(behavior instanceof Function)) throw new Error(this.behaviorPath + " is not a behavior");
            behavior(target, source, behaviorArgs);
        }
        static parse(parser) {
            if (!parser.matchToken("install")) return;
            var behaviorPath = parser.requireElement("dotOrColonPath").evalStatically();
            var behaviorNamespace = behaviorPath.split(".");
            var args = parser.parseElement("namedArgumentList");
            return new _InstallFeature(behaviorPath, behaviorNamespace, args);
        }
    };
    // src/parsetree/features/js.js
    var js_exports = {};
    __export(js_exports, {
        JsFeature: ()=>JsFeature
    });
    var JsFeature = class _JsFeature extends Feature {
        static keyword = "js";
        constructor(jsSource, func, exposedFunctionNames){
            super();
            this.jsSource = jsSource;
            this.function = func;
            this.exposedFunctionNames = exposedFunctionNames;
        }
        install(target, source, args, runtime2) {
            Object.assign(runtime2.globalScope, this.function());
        }
        static parse(parser) {
            if (!parser.matchToken("js")) return;
            var jsBody = parser.requireElement("jsBody");
            var jsSource = jsBody.jsSource + "\nreturn { " + jsBody.exposedFunctionNames.map(function(name) {
                return name + ":" + name;
            }).join(",") + " } ";
            var func = new Function(jsSource);
            return new _JsFeature(jsSource, func, jsBody.exposedFunctionNames);
        }
    };
    // src/parsetree/features/when.js
    var when_exports = {};
    __export(when_exports, {
        WhenFeature: ()=>WhenFeature
    });
    var WhenFeature = class _WhenFeature extends Feature {
        static keyword = "when";
        /**
     * Parse when feature
     * @param {Parser} parser
     * @returns {WhenFeature | undefined}
     */ static parse(parser) {
            if (!parser.matchToken("when")) return;
            var exprs = [];
            do {
                parser.pushFollow("or");
                try {
                    exprs.push(parser.requireElement("expression"));
                } finally{
                    parser.popFollow();
                }
            }while (parser.matchToken("or"));
            for(var i = 0; i < exprs.length; i++){
                var expr = exprs[i];
                if (expr.type === "symbol" && expr.scope === "local" && !expr.name.startsWith("$") && !expr.name.startsWith(":")) parser.raiseError("Cannot watch local variable '" + expr.name + "'. Local variables are not reactive. Use '$" + expr.name + "' (global) or ':" + expr.name + "' (element-scoped) instead.");
            }
            parser.requireToken("changes");
            var start = parser.requireElement("commandList");
            parser.ensureTerminated(start);
            var feature = new _WhenFeature(exprs, start);
            parser.setParent(start, feature);
            return feature;
        }
        constructor(exprs, start){
            super();
            this.exprs = exprs;
            this.start = start;
            this.displayName = "when ... changes";
        }
        install(target, source, args, runtime2) {
            var feature = this;
            queueMicrotask(function() {
                for(var i = 0; i < feature.exprs.length; i++)(function(expr) {
                    runtime2.reactivity.createEffect(function() {
                        return expr.evaluate(runtime2.makeContext(target, feature, target, null));
                    }, function(newValue) {
                        var ctx = runtime2.makeContext(target, feature, target, null);
                        ctx.result = newValue;
                        ctx.meta.reject = function(err) {
                            console.error(err.message ? err.message : err);
                            runtime2.triggerEvent(target, "exception", {
                                error: err
                            });
                        };
                        ctx.meta.onHalt = function() {};
                        feature.start.execute(ctx);
                    }, {
                        element: target
                    });
                })(feature.exprs[i]);
            });
        }
    };
    // src/parsetree/features/bind.js
    var bind_exports = {};
    __export(bind_exports, {
        BindFeature: ()=>BindFeature
    });
    var BindFeature = class _BindFeature extends Feature {
        static keyword = "bind";
        /**
     * Parse bind feature
     * @param {Parser} parser
     * @returns {BindFeature | undefined}
     */ static parse(parser) {
            if (!parser.matchToken("bind")) return;
            var follows = parser.pushFollows("and", "with", "to");
            var left;
            try {
                left = parser.requireElement("expression");
            } finally{
                parser.popFollows(follows);
            }
            if (!parser.matchToken("and") && !parser.matchToken("with") && !parser.matchToken("to")) parser.raiseExpected("and", "with", "to");
            var right = parser.requireElement("expression");
            return new _BindFeature(left, right);
        }
        constructor(left, right){
            super();
            this.left = left;
            this.right = right;
            this.displayName = "bind";
        }
        install(target, source, args, runtime2) {
            var feature = this;
            queueMicrotask(function() {
                try {
                    _bind(feature.left, feature.right, target, feature, runtime2);
                } catch (e) {
                    console.error(e.message || e);
                }
            });
        }
    };
    function _registerListener(runtime2, elt, listenerTarget, event, handler) {
        var eltData = runtime2.getInternalData(elt);
        if (!eltData.listeners) eltData.listeners = [];
        eltData.listeners.push({
            target: listenerTarget,
            event: event,
            handler: handler
        });
    }
    function _isAssignable(expr) {
        if (expr.type === "classRef") return true;
        if (expr.type === "attributeRef") return true;
        return typeof expr.set === "function";
    }
    function _bind(left, right, target, feature, runtime2) {
        var ctx = runtime2.makeContext(target, feature, target, null);
        var leftSide = _resolveSide(left, target, feature, runtime2, ctx);
        var rightSide = _resolveSide(right, target, feature, runtime2, ctx);
        var leftWritable = leftSide.element || _isAssignable(left);
        var rightWritable = rightSide.element || _isAssignable(right);
        if (!leftWritable && !rightWritable) throw new Error("bind requires at least one writable side");
        if (leftWritable) runtime2.reactivity.createEffect(function() {
            return rightSide.read();
        }, function(newValue) {
            leftSide.write(newValue);
        }, {
            element: target
        });
        if (rightWritable) runtime2.reactivity.createEffect(function() {
            return leftSide.read();
        }, function(newValue) {
            rightSide.write(newValue);
        }, {
            element: target
        });
        _setupFormReset(leftSide, rightSide, target, runtime2);
    }
    function _resolveSide(expr, target, feature, runtime2, ctx) {
        var value = expr.evaluate(ctx);
        if (value instanceof Element) return _createElementSide(value, runtime2);
        return _createExpressionSide(expr, target, feature, runtime2);
    }
    var _bindProperty = {
        "INPUT:checkbox": "checked",
        "INPUT:number": "valueAsNumber",
        "INPUT:range": "valueAsNumber",
        "INPUT": "value",
        "TEXTAREA": "value",
        "SELECT": "value"
    };
    function _createElementSide(element, runtime2) {
        var tag = element.tagName;
        var type = tag === "INPUT" ? element.getAttribute("type") || "text" : null;
        if (tag === "INPUT" && type === "radio") {
            var radioValue = element.value;
            return {
                element: element,
                read: function() {
                    var checked = runtime2.resolveProperty(element, "checked");
                    return checked ? radioValue : void 0;
                },
                write: function(value) {
                    element.checked = value === radioValue;
                }
            };
        }
        var prop = _bindProperty[tag + ":" + type] || _bindProperty[tag];
        if (!prop && element.hasAttribute("contenteditable") && element.getAttribute("contenteditable") !== "false") prop = "textContent";
        if (!prop && tag.includes("-") && "value" in element) prop = "value";
        if (!prop) throw new Error("bind cannot auto-detect a property for <" + tag.toLowerCase() + ">. Use an explicit property (e.g. 'bind $var to #el's value').");
        var isNumeric = prop === "valueAsNumber";
        return {
            element: element,
            read: function() {
                var val = runtime2.resolveProperty(element, prop);
                return isNumeric && val !== val ? null : val;
            },
            write: function(value) {
                element[prop] = value;
            }
        };
    }
    function _createExpressionSide(expr, target, feature, runtime2) {
        if (expr.type === "classRef") return {
            read: function() {
                runtime2.resolveAttribute(target, "class");
                return target.classList.contains(expr.className);
            },
            write: function(value) {
                if (value) target.classList.add(expr.className);
                else target.classList.remove(expr.className);
            }
        };
        return {
            read: function() {
                return expr.evaluate(runtime2.makeContext(target, feature, target, null));
            },
            write: function(value) {
                var ctx = runtime2.makeContext(target, feature, target, null);
                _assignTo(runtime2, expr, ctx, value);
            }
        };
    }
    function _setupFormReset(leftSide, rightSide, target, runtime2) {
        _addResetListener(leftSide, rightSide, target, runtime2);
        _addResetListener(rightSide, leftSide, target, runtime2);
    }
    function _addResetListener(source, dest, target, runtime2) {
        if (!source.element) return;
        var form = source.element.closest("form");
        if (!form) return;
        var resetHandler = ()=>{
            setTimeout(()=>{
                if (!target.isConnected) return;
                dest.write(source.read());
            }, 0);
        };
        form.addEventListener("reset", resetHandler);
        _registerListener(runtime2, target, form, "reset", resetHandler);
    }
    function _setAttr(elt, name, value) {
        if (typeof value === "boolean") {
            if (name.startsWith("aria-")) elt.setAttribute(name, String(value));
            else if (value) elt.setAttribute(name, "");
            else elt.removeAttribute(name);
        } else if (value == null) elt.removeAttribute(name);
        else elt.setAttribute(name, value);
    }
    function _assignTo(runtime2, target, ctx, value) {
        if (target.type === "classRef") {
            var elt = ctx.you || ctx.me;
            if (elt) value ? elt.classList.add(target.className) : elt.classList.remove(target.className);
        } else if (target.type === "attributeRef" && typeof value === "boolean") {
            var elt = ctx.you || ctx.me;
            if (elt) _setAttr(elt, target.name, value);
        } else {
            var lhs = {};
            if (target.lhs) for(var key in target.lhs){
                var expr = target.lhs[key];
                lhs[key] = expr && expr.evaluate ? expr.evaluate(ctx) : expr;
            }
            target.set(ctx, lhs, value);
        }
    }
    // src/parsetree/features/live.js
    var live_exports = {};
    __export(live_exports, {
        LiveFeature: ()=>LiveFeature
    });
    var LiveFeature = class _LiveFeature extends Feature {
        static keyword = "live";
        constructor(commands){
            super();
            this.commands = commands;
            this.displayName = "live";
        }
        static parse(parser) {
            if (!parser.matchToken("live")) return;
            var start = parser.requireElement("commandList");
            var feature = new _LiveFeature(start);
            parser.ensureTerminated(start);
            parser.setParent(start, feature);
            return feature;
        }
        install(target, source, args, runtime2) {
            var feature = this;
            queueMicrotask(function() {
                runtime2.reactivity.createEffect(function() {
                    feature.commands.execute(runtime2.makeContext(target, feature, target, null));
                }, function() {}, {
                    element: target
                });
            });
        }
    };
    // src/parsetree/commands/template.js
    var template_exports = {};
    __export(template_exports, {
        EscapeExpression: ()=>EscapeExpression,
        RenderCommand: ()=>RenderCommand,
        TemplateTextCommand: ()=>TemplateTextCommand,
        initLiveTemplates: ()=>initLiveTemplates
    });
    function getTemplateSource(el) {
        return el.textContent;
    }
    var LIVE_SELECTOR = 'script[type="text/hyperscript-template"][live]';
    function initLiveTemplates(runtime2, tokenizer2, Parser2, kernel2, reactivity2) {
        var processed = /* @__PURE__ */ new WeakSet();
        runtime2.addBeforeProcessHook(function(elt) {
            if (!elt || !elt.querySelectorAll) return;
            elt.querySelectorAll(LIVE_SELECTOR).forEach(function(tmpl) {
                if (processed.has(tmpl)) return;
                processed.add(tmpl);
                var source = getTemplateSource(tmpl);
                var script = tmpl.getAttribute("_") || tmpl.getAttribute("data-script") || "";
                tmpl.removeAttribute("_");
                tmpl.removeAttribute("data-script");
                var wrapper = document.createElement("div");
                wrapper.style.display = "contents";
                wrapper.setAttribute("data-live-template", "");
                tmpl.after(wrapper);
                if (script) {
                    wrapper.setAttribute("_", script);
                    runtime2.processNode(wrapper);
                }
                var stamped = false;
                function stamp(html) {
                    if (!stamped) {
                        wrapper.innerHTML = html;
                        runtime2.processNode(wrapper);
                        stamped = true;
                    } else runtime2.morph(wrapper, html);
                }
                function render() {
                    var ctx = runtime2.makeContext(wrapper, null, wrapper, null);
                    var buf = [];
                    ctx.meta.__ht_template_result = buf;
                    var tokens = tokenizer2.tokenize(source, "lines");
                    var parser = new Parser2(kernel2, tokens);
                    var cmds;
                    try {
                        cmds = parser.parseElement("commandList");
                        parser.ensureTerminated(cmds);
                    } catch (e) {
                        console.error("live-template parse error:", e.message || e);
                        return "";
                    }
                    cmds.execute(ctx);
                    wrapper.__hs_scopes = ctx.meta.__ht_scopes || null;
                    if (ctx.meta.returned || !ctx.meta.resolve) return buf.join("");
                    var resolve;
                    var promise = new Promise(function(r) {
                        resolve = r;
                    });
                    ctx.meta.resolve = resolve;
                    return promise.then(function() {
                        return buf.join("");
                    });
                }
                queueMicrotask(function() {
                    var result = render();
                    if (result && result.then) result.then(function(html) {
                        stamp(html);
                        setupEffect();
                    });
                    else {
                        stamp(result);
                        setupEffect();
                    }
                });
                function setupEffect() {
                    reactivity2.createEffect(render, stamp, {
                        element: wrapper
                    });
                }
            });
        });
    }
    function _stringifyTemplatePart(val, part) {
        if (part.type === "literal") return val;
        if (val === void 0 || val === null) return "";
        if (part.escape) return escapeHTML(String(val));
        return String(val);
    }
    function escapeHTML(html) {
        return String(html).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
    }
    var TemplateTextCommand = class _TemplateTextCommand extends Command {
        static keyword = "TEMPLATE_LINE";
        constructor(parts, errors){
            super();
            this.parts = parts;
            this.errors = errors;
        }
        static parse(parser) {
            var tok = parser.currentToken();
            if (tok.type !== "TEMPLATE_LINE") return;
            parser.consumeToken();
            var parts = [];
            var errors = [];
            var raw = tok.content;
            var i = 0;
            while(i < raw.length){
                var nextDollar = raw.indexOf("${", i);
                if (nextDollar === -1) {
                    if (i < raw.length) parts.push({
                        type: "literal",
                        value: raw.slice(i)
                    });
                    break;
                }
                if (nextDollar > i) parts.push({
                    type: "literal",
                    value: raw.slice(i, nextDollar)
                });
                var depth = 1;
                var j = nextDollar + 2;
                while(j < raw.length && depth > 0){
                    if (raw[j] === "{") depth++;
                    else if (raw[j] === "}") depth--;
                    j++;
                }
                if (depth > 0) {
                    errors.push({
                        line: tok.line,
                        message: "Unterminated ${} expression",
                        expr: raw.slice(nextDollar)
                    });
                    parts.push({
                        type: "literal",
                        value: ""
                    });
                    break;
                }
                var exprStr = raw.slice(nextDollar + 2, j - 1);
                var escape = true;
                try {
                    var exprTokens = new Tokenizer().tokenize(exprStr);
                    var exprParser = parser.createChildParser(exprTokens);
                    if (exprParser.matchToken("unescaped")) escape = false;
                    var valueNode = exprParser.requireElement("expression");
                    if (exprParser.matchToken("if")) {
                        var conditionNode = exprParser.requireElement("expression");
                        var elseNode = exprParser.matchToken("else") ? exprParser.requireElement("expression") : null;
                        parts.push({
                            type: "conditional",
                            valueNode: valueNode,
                            conditionNode: conditionNode,
                            elseNode: elseNode,
                            escape: escape
                        });
                    } else parts.push({
                        type: "expr",
                        node: valueNode,
                        escape: escape
                    });
                } catch (e) {
                    errors.push({
                        line: tok.line,
                        column: tok.column + nextDollar,
                        message: e.message || String(e),
                        expr: exprStr
                    });
                    parts.push({
                        type: "literal",
                        value: ""
                    });
                }
                i = j;
            }
            return new _TemplateTextCommand(parts, errors);
        }
        resolve(ctx) {
            var parts = this.parts;
            var vals = parts.map((part)=>{
                if (part.type === "literal") return part.value;
                if (part.type === "conditional") {
                    var condition = part.conditionNode.evaluate(ctx);
                    if (condition) return part.valueNode.evaluate(ctx);
                    else if (part.elseNode) return part.elseNode.evaluate(ctx);
                    else return void 0;
                }
                return part.node.evaluate(ctx);
            });
            if (vals.some((v)=>v && v.then)) return Promise.all(vals).then((resolved)=>{
                ctx.meta.__ht_template_result.push(resolved.map((val, i)=>_stringifyTemplatePart(val, parts[i])).join(""));
                return this.findNext(ctx);
            });
            ctx.meta.__ht_template_result.push(vals.map((val, i)=>_stringifyTemplatePart(val, parts[i])).join(""));
            return this.findNext(ctx);
        }
    };
    var RenderCommand = class _RenderCommand extends Command {
        static keyword = "render";
        constructor(template_, templateArgs, insertHere, target){
            super();
            this.template_ = template_;
            this.insertHere = insertHere;
            this.args = {
                template: template_,
                templateArgs: templateArgs,
                target: target
            };
        }
        static parse(parser) {
            if (!parser.matchToken("render")) return;
            var template_ = parser.requireElement("expression");
            var templateArgs = {};
            if (parser.matchToken("with")) templateArgs = parser.parseElement("nakedNamedArgumentList");
            var insertHere = !!parser.matchToken("here");
            var target = null;
            if (!insertHere && parser.matchToken("into")) target = parser.requireElement("expression");
            var cmd = new _RenderCommand(template_, templateArgs, insertHere, target);
            cmd._parser = parser;
            return cmd;
        }
        resolve(ctx, { template: template, templateArgs: templateArgs, target: target }) {
            if (!(template instanceof Element)) throw new Error(this.template_.sourceFor() + " is not an element");
            var buf = [];
            var runtime2 = ctx.meta.runtime;
            var renderCtx = runtime2.makeContext(ctx.me, null, ctx.me, null);
            renderCtx.locals = Object.assign({}, ctx.locals, templateArgs);
            renderCtx.meta.__ht_template_result = buf;
            var tokens = new Tokenizer().tokenize(getTemplateSource(template), "lines");
            var parser = this._parser.createChildParser(tokens);
            var commandList;
            try {
                commandList = parser.parseElement("commandList");
                parser.ensureTerminated(commandList);
            } catch (e) {
                console.error("hyperscript template parse error:", e.parseError?.message || e.message || e);
                ctx.result = "";
                return runtime2.findNext(this, ctx);
            }
            var errors = commandList.collectErrors();
            if (errors.length) for (var err of errors)console.error("hyperscript template error (line " + err.line + "): " + err.message + (err.expr ? " in ${" + err.expr + "}" : ""));
            var resolve, reject;
            var promise = new Promise(function(res, rej) {
                resolve = res;
                reject = rej;
            });
            commandList.execute(renderCtx);
            var scopes = renderCtx.meta.__ht_scopes || null;
            var SCOPE_MARKER_RE = /<!--hs-scope:[^>]*-->/g;
            var finish = (result)=>{
                ctx.result = result.replace(SCOPE_MARKER_RE, "");
                if (this.insertHere) {
                    ctx.me.__hs_scopes = scopes;
                    ctx.me.innerHTML = result;
                }
                if (target) {
                    target.__hs_scopes = scopes;
                    target.innerHTML = result;
                }
                return runtime2.findNext(this, ctx);
            };
            if (renderCtx.meta.returned) return finish(buf.join(""));
            renderCtx.meta.resolve = resolve;
            renderCtx.meta.reject = reject;
            return promise.then(()=>finish(buf.join("")));
        }
    };
    var EscapeExpression = class _EscapeExpression extends Expression {
        static grammarName = "escape";
        static expressionType = "leaf";
        constructor(arg, unescaped, escapeType){
            super();
            this.unescaped = unescaped;
            this.escapeType = escapeType;
            this.args = {
                value: arg
            };
        }
        static parse(parser) {
            if (!parser.matchToken("escape")) return;
            var escapeType = parser.matchTokenType("IDENTIFIER").value;
            var unescaped = parser.matchToken("unescaped");
            var arg = parser.requireElement("expression");
            return new _EscapeExpression(arg, unescaped, escapeType);
        }
        resolve(ctx, { value: value }) {
            if (this.unescaped) return value;
            if (value == null) return "";
            switch(this.escapeType){
                case "html":
                    return escapeHTML(value);
                default:
                    throw new Error("Unknown escape: " + this.escapeType);
            }
        }
    };
    // src/_hyperscript.js
    var globalScope = typeof self !== "undefined" ? self : typeof $parcel$global !== "undefined" ? $parcel$global : void 0;
    config.conversions = conversions;
    var kernel = new LanguageKernel();
    var tokenizer = new Tokenizer();
    var reactivity = new Reactivity();
    var morphEngine = new Morph();
    var runtime = new Runtime(globalScope, kernel, tokenizer, reactivity, morphEngine);
    kernel.registerModule(expressions_exports);
    kernel.registerModule(literals_exports);
    kernel.registerModule(webliterals_exports);
    kernel.registerModule(postfix_exports);
    kernel.registerModule(positional_exports);
    kernel.registerModule(existentials_exports);
    kernel.registerModule(targets_exports);
    kernel.registerModule(basic_exports);
    kernel.registerModule(setters_exports);
    kernel.registerModule(events_exports);
    kernel.registerModule(controlflow_exports);
    kernel.registerModule(execution_exports);
    kernel.registerModule(pseudoCommand_exports);
    kernel.registerModule(dom_exports);
    kernel.registerModule(animations_exports);
    kernel.registerModule(debug_exports);
    kernel.registerModule(on_exports);
    kernel.registerModule(def_exports);
    kernel.registerModule(set_exports);
    kernel.registerModule(init_exports);
    kernel.registerModule(worker_exports);
    kernel.registerModule(behavior_exports);
    kernel.registerModule(install_exports);
    kernel.registerModule(js_exports);
    kernel.registerModule(when_exports);
    kernel.registerModule(bind_exports);
    kernel.registerModule(live_exports);
    kernel.registerModule(template_exports);
    initLiveTemplates(runtime, tokenizer, Parser, kernel, reactivity);
    function evaluate(src, ctx, args) {
        let body;
        if ("document" in globalScope) body = globalScope.document.body;
        else body = new HyperscriptModule(args && args.module);
        ctx = Object.assign(runtime.makeContext(body, null, body, null), ctx || {});
        let element = kernel.parse(tokenizer, src);
        if (element && element.errors && element.errors.length > 0) throw new Error(element.errors[0].message + "\n\n" + Parser.formatErrors(element.errors));
        if (element.execute) {
            element.execute(ctx);
            return ctx.meta.returnValue !== void 0 ? ctx.meta.returnValue : ctx.result;
        } else if (element.apply) {
            element.apply(body, body, args, runtime);
            return runtime.getHyperscriptFeatures(body);
        } else return element.evaluate(ctx);
    }
    var _hyperscript = Object.assign(evaluate, {
        config: config,
        use (plugin) {
            plugin(_hyperscript);
        },
        internals: {
            tokenizer: tokenizer,
            runtime: runtime,
            reactivity: reactivity,
            createParser: (tokens)=>new Parser(kernel, tokens)
        },
        addFeature: kernel.addFeature.bind(kernel),
        addCommand: kernel.addCommand.bind(kernel),
        addLeafExpression: kernel.addLeafExpression.bind(kernel),
        addBeforeProcessHook: (fn)=>runtime.addBeforeProcessHook(fn),
        addAfterProcessHook: (fn)=>runtime.addAfterProcessHook(fn),
        evaluate: evaluate,
        parse: (src)=>kernel.parse(tokenizer, src),
        process: (elt)=>runtime.processNode(elt),
        processNode: (elt)=>runtime.processNode(elt),
        // deprecated alias
        cleanup: (elt)=>runtime.cleanup(elt),
        version: "0.9.93"
    });
    function ready(fn) {
        if (document.readyState !== "loading") setTimeout(fn);
        else document.addEventListener("DOMContentLoaded", fn);
    }
    function mergeMetaConfig() {
        let element = document.querySelector('meta[name="htmx-config"]');
        if (element) {
            let metaConfig = JSON.parse(element.content);
            Object.assign(config, metaConfig);
        }
    }
    if (typeof document !== "undefined") (async function() {
        mergeMetaConfig();
        let scriptNodes = globalScope.document.querySelectorAll("script[type='text/hyperscript'][src]");
        const scripts = Array.from(scriptNodes);
        const scriptTexts = await Promise.all(scripts.map(async (script)=>{
            const res = await fetch(script.src);
            return res.text();
        }));
        ready(()=>{
            scriptTexts.forEach((sc)=>_hyperscript(sc));
            _hyperscript.process(document.documentElement);
            document.dispatchEvent(new Event("hyperscript:ready"));
            new HtmxCompat(globalScope, _hyperscript).init();
        });
    })();
    if (typeof self !== "undefined") self._hyperscript = _hyperscript;
    var hyperscript_default = _hyperscript;
})();


// Initialize hyperscript.
$2eb3f569e520dd6a$exports.browserInit();

})();
//# sourceMappingURL=scripts.js.map
