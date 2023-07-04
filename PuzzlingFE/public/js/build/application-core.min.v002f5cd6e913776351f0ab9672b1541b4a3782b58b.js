function getInternetExplorerVersion() {
    var e = -1;
    if ("Microsoft Internet Explorer" == navigator.appName) {
        var t = navigator.userAgent,
            n = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        null != n.exec(t) && (e = parseFloat(RegExp.$1))
    }
    return e
}

function $A(e) {
    if (!e) return [];
    if ("toArray" in Object(e)) return e.toArray();
    for (var t = e.length || 0, n = new Array(t); t--;) n[t] = e[t];
    return n
}

function $w(e) {
    return Object.isString(e) ? (e = e.strip(), e ? e.split(/\s+/) : []) : []
}

function $H(e) {
    return new Hash(e)
}

function $R(e, t, n) {
    return new ObjectRange(e, t, n)
}

function $(e) {
    if (arguments.length > 1) {
        for (var t = 0, n = [], i = arguments.length; i > t; t++) n.push($(arguments[t]));
        return n
    }
    return Object.isString(e) && (e = document.getElementById(e)), Element.extend(e)
}

function deepCopy(e) {
    if ("[object Array]" === Object.prototype.toString.call(e)) {
        for (var t = [], n = 0, i = e.length; i > n; n++) t[n] = arguments.callee(e[n]);
        return t
    }
    if ("object" == typeof e) {
        var n, t = {};
        for (n in e) t[n] = arguments.callee(e[n]);
        return t
    }
    return e
}

function bkClass() {}

function $BK(e) {
    return "string" == typeof e && (e = document.getElementById(e)), e && !e.appendTo ? bkExtend(e, bkElement.prototype) : e
}

function __(e) {
    return e
}
var Base = function() {
    arguments.length && (this == window ? Base.prototype.extend.call(arguments[0], arguments.callee.prototype) : this.extend(arguments[0]))
};
Base.version = "1.0.2", Base.prototype = {
    extend: function(e, t) {
        var n = Base.prototype.extend;
        if (2 == arguments.length) {
            var i = this[e];
            if (i instanceof Function && t instanceof Function && i.valueOf() != t.valueOf() && /\bbase\b/.test(t)) {
                var o = t;
                t = function() {
                    var e = this.base;
                    this.base = i;
                    var t = o.apply(this, arguments);
                    return this.base = e, t
                }, t.valueOf = function() {
                    return o
                }, t.toString = function() {
                    return String(o)
                }
            }
            return this[e] = t
        }
        if (e) {
            var s = {
                    toSource: null
                },
                r = ["toString", "valueOf"];
            Base._prototyping && (r[2] = "constructor");
            for (var a = 0; l = r[a]; a++) e[l] != s[l] && n.call(this, l, e[l]);
            for (var l in e) s[l] || n.call(this, l, e[l])
        }
        return this
    },
    base: function() {}
}, Base.extend = function(e, t) {
    var n = Base.prototype.extend;
    e || (e = {}), Base._prototyping = !0;
    var i = new this;
    n.call(i, e);
    var o = i.constructor;
    i.constructor = this, delete Base._prototyping;
    var s = function() {
        Base._prototyping || o.apply(this, arguments), this.constructor = s
    };
    s.prototype = i, s.extend = this.extend, s.implement = this.implement, s.toString = function() {
        return String(o)
    }, n.call(s, t);
    var r = o ? s : i;
    return r.init instanceof Function && r.init(), r
}, Base.implement = function(e) {
    e instanceof Function && (e = e.prototype), this.prototype.extend(e)
}, DomBuilder = {
    IE_TRANSLATIONS: {
        "class": "className",
        "for": "htmlFor"
    },
    ieAttrSet: function(e, t, n) {
        var i;
        (i = this.IE_TRANSLATIONS[t]) ? n[i] = e[t]: "style" == t ? n.style.cssText = e[t] : t.match(/^on/) ? n[t] = new Function(e[t]) : n.setAttribute(t, e[t])
    },
    apply: function(e) {
        e = e || {};
        for (var t, n = "p|div|span|strong|em|img|table|tr|td|th|thead|tbody|tfoot|pre|code|h1|h2|h3|h4|h5|h6|ul|ol|li|form|input|textarea|legend|fieldset|select|option|blockquote|cite|br|hr|dd|dl|dt|address|a|button|abbr|acronym|script|link|style|bdo|ins|del|object|param|col|colgroup|optgroup|caption|label|dfn|kbd|samp|var".split("|"), i = 0; t = n[i++];) e["$" + t.toLowerCase()] = DomBuilder.tagFunc(t);
        return e
    },
    tagFunc: function(e) {
        return function() {
            var t, n, i = arguments;
            return i.slice = [].slice, i.length > 0 && (i[0].nodeName || "string" == typeof i[0] ? n = i : (t = i[0], n = i.slice(1))), DomBuilder.elem(e, t, n)
        }
    },
    elem: function(e, t, n) {
        t = t || {}, n = n || [];
        var i = getInternetExplorerVersion(),
            o = i > -1 && 9 > i,
            s = document.createElement(o && t.name ? "<" + e + " name=" + t.name + ">" : e);
        for (var r in t) "function" != typeof t[r] && (o ? this.ieAttrSet(t, r, s) : s.setAttribute(r, t[r]));
        for (var r = 0; r < n.length; r++) "string" == typeof n[r] && (n[r] = document.createTextNode(n[r])), s.appendChild(n[r]);
        return s
    }
};
var Prototype = {
    Version: "1.7",
    Browser: function() {
        var e = navigator.userAgent,
            t = "[object Opera]" == Object.prototype.toString.call(window.opera);
        return {
            IE: !!window.attachEvent && !t,
            Opera: t,
            WebKit: e.indexOf("AppleWebKit/") > -1,
            Gecko: e.indexOf("Gecko") > -1 && -1 === e.indexOf("KHTML"),
            MobileSafari: /Apple.*Mobile/.test(e)
        }
    }(),
    BrowserFeatures: {
        XPath: !!document.evaluate,
        SelectorsAPI: !!document.querySelector,
        ElementExtensions: function() {
            var e = window.Element || window.HTMLElement;
            return !(!e || !e.prototype)
        }(),
        SpecificElementExtensions: function() {
            if ("undefined" != typeof window.HTMLDivElement) return !0;
            var e = document.createElement("div"),
                t = document.createElement("form"),
                n = !1;
            return e.__proto__ && e.__proto__ !== t.__proto__ && (n = !0), e = t = null, n
        }()
    },
    ScriptFragment: "<script[^>]*>([\\S\\s]*?)</script>",
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    emptyFunction: function() {},
    K: function(e) {
        return e
    }
};
Prototype.Browser.MobileSafari && (Prototype.BrowserFeatures.SpecificElementExtensions = !1);
var Class = function() {
    function e() {}

    function t() {
        function t() {
            this.initialize.apply(this, arguments)
        }
        var n = null,
            i = $A(arguments);
        Object.isFunction(i[0]) && (n = i.shift()), Object.extend(t, Class.Methods), t.superclass = n, t.subclasses = [], n && (e.prototype = n.prototype, t.prototype = new e, n.subclasses.push(t));
        for (var o = 0, s = i.length; s > o; o++) t.addMethods(i[o]);
        return t.prototype.initialize || (t.prototype.initialize = Prototype.emptyFunction), t.prototype.constructor = t, t
    }

    function n(e) {
        var t = this.superclass && this.superclass.prototype,
            n = Object.keys(e);
        i && (e.toString != Object.prototype.toString && n.push("toString"), e.valueOf != Object.prototype.valueOf && n.push("valueOf"));
        for (var o = 0, s = n.length; s > o; o++) {
            var r = n[o],
                a = e[r];
            if (t && Object.isFunction(a) && "$super" == a.argumentNames()[0]) {
                var l = a;
                a = function(e) {
                    return function() {
                        return t[e].apply(this, arguments)
                    }
                }(r).wrap(l), a.valueOf = l.valueOf.bind(l), a.toString = l.toString.bind(l)
            }
            this.prototype[r] = a
        }
        return this
    }
    var i = function() {
        for (var e in {
                toString: 1
            })
            if ("toString" === e) return !1;
        return !0
    }();
    return {
        create: t,
        Methods: {
            addMethods: n
        }
    }
}();
! function() {
    function e(e) {
        switch (e) {
            case null:
                return E;
            case void 0:
                return w
        }
        var t = typeof e;
        switch (t) {
            case "boolean":
                return x;
            case "number":
                return S;
            case "string":
                return C
        }
        return _
    }

    function t(e, t) {
        for (var n in t) e[n] = t[n];
        return e
    }

    function n(e) {
        try {
            return b(e) ? "undefined" : null === e ? "null" : e.inspect ? e.inspect() : String(e)
        } catch (t) {
            if (t instanceof RangeError) return "...";
            throw t
        }
    }

    function i(e) {
        return o("", {
            "": e
        }, [])
    }

    function o(t, n, i) {
        var s = n[t],
            r = typeof s;
        e(s) === _ && "function" == typeof s.toJSON && (s = s.toJSON(t));
        var a = y.call(s);
        switch (a) {
            case k:
            case O:
            case $:
                s = s.valueOf()
        }
        switch (s) {
            case null:
                return "null";
            case !0:
                return "true";
            case !1:
                return "false"
        }
        switch (r = typeof s) {
            case "string":
                return s.inspect(!0);
            case "number":
                return isFinite(s) ? String(s) : "null";
            case "object":
                for (var l = 0, c = i.length; c > l; l++)
                    if (i[l] === s) throw new TypeError;
                i.push(s);
                var d = [];
                if (a === A) {
                    for (var l = 0, c = s.length; c > l; l++) {
                        var u = o(l, s, i);
                        d.push("undefined" == typeof u ? "null" : u)
                    }
                    d = "[" + d.join(",") + "]"
                } else {
                    for (var h = Object.keys(s), l = 0, c = h.length; c > l; l++) {
                        var t = h[l],
                            u = o(t, s, i);
                        "undefined" != typeof u && d.push(t.inspect(!0) + ":" + u)
                    }
                    d = "{" + d.join(",") + "}"
                }
                return i.pop(), d
        }
    }

    function s(e) {
        return JSON.stringify(e)
    }

    function r(e) {
        return $H(e).toQueryString()
    }

    function a(e) {
        return e && e.toHTML ? e.toHTML() : String.interpret(e)
    }

    function l(t) {
        if (e(t) !== _) throw new TypeError;
        var n = [];
        for (var i in t) t.hasOwnProperty(i) && n.push(i);
        return n
    }

    function c(e) {
        var t = [];
        for (var n in e) t.push(e[n]);
        return t
    }

    function d(e) {
        return t({}, e)
    }

    function u(e) {
        return !(!e || 1 != e.nodeType)
    }

    function h(e) {
        return y.call(e) === A
    }

    function p(e) {
        return e instanceof Hash
    }

    function m(e) {
        return y.call(e) === T
    }

    function f(e) {
        return y.call(e) === $
    }

    function g(e) {
        return y.call(e) === k
    }

    function v(e) {
        return y.call(e) === L
    }

    function b(e) {
        return "undefined" == typeof e
    }
    var y = Object.prototype.toString,
        E = "Null",
        w = "Undefined",
        x = "Boolean",
        S = "Number",
        C = "String",
        _ = "Object",
        T = "[object Function]",
        O = "[object Boolean]",
        k = "[object Number]",
        $ = "[object String]",
        A = "[object Array]",
        L = "[object Date]",
        P = window.JSON && "function" == typeof JSON.stringify && "0" === JSON.stringify(0) && "undefined" == typeof JSON.stringify(Prototype.K),
        F = "function" == typeof Array.isArray && Array.isArray([]) && !Array.isArray({});
    F && (h = Array.isArray), t(Object, {
        extend: t,
        inspect: n,
        toJSON: P ? s : i,
        toQueryString: r,
        toHTML: a,
        keys: Object.keys || l,
        values: c,
        clone: d,
        isElement: u,
        isArray: h,
        isHash: p,
        isFunction: m,
        isString: f,
        isNumber: g,
        isDate: v,
        isUndefined: b
    })
}(), Object.extend(Function.prototype, function() {
        function e(e, t) {
            for (var n = e.length, i = t.length; i--;) e[n + i] = t[i];
            return e
        }

        function t(t, n) {
            return t = d.call(t, 0), e(t, n)
        }

        function n() {
            var e = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, "").replace(/\s+/g, "").split(",");
            return 1 != e.length || e[0] ? e : []
        }

        function i(e) {
            if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
            var n = this,
                i = d.call(arguments, 1);
            return function() {
                var o = t(i, arguments);
                return n.apply(e, o)
            }
        }

        function o(t) {
            var n = this,
                i = d.call(arguments, 1);
            return function(o) {
                var s = e([o || window.event], i);
                return n.apply(t, s)
            }
        }

        function s() {
            if (!arguments.length) return this;
            var e = this,
                n = d.call(arguments, 0);
            return function() {
                var i = t(n, arguments);
                return e.apply(this, i)
            }
        }

        function r(e) {
            var t = this,
                n = d.call(arguments, 1);
            return e = 1e3 * e, window.setTimeout(function() {
                return t.apply(t, n)
            }, e)
        }

        function a() {
            var t = e([.01], arguments);
            return this.delay.apply(this, t)
        }

        function l(t) {
            var n = this;
            return function() {
                var i = e([n.bind(this)], arguments);
                return t.apply(this, i)
            }
        }

        function c() {
            if (this._methodized) return this._methodized;
            var t = this;
            return this._methodized = function() {
                var n = e([this], arguments);
                return t.apply(null, n)
            }
        }
        var d = Array.prototype.slice;
        return {
            argumentNames: n,
            bind: i,
            bindAsEventListener: o,
            curry: s,
            delay: r,
            defer: a,
            wrap: l,
            methodize: c
        }
    }()),
    function(e) {
        function t() {
            return this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1).toPaddedString(2) + "-" + this.getUTCDate().toPaddedString(2) + "T" + this.getUTCHours().toPaddedString(2) + ":" + this.getUTCMinutes().toPaddedString(2) + ":" + this.getUTCSeconds().toPaddedString(2) + "Z"
        }

        function n() {
            return this.toISOString()
        }
        e.toISOString || (e.toISOString = t), e.toJSON || (e.toJSON = n)
    }(Date.prototype), RegExp.prototype.match = RegExp.prototype.test, RegExp.escape = function(e) {
        return String(e).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
    };
var PeriodicalExecuter = Class.create({
    initialize: function(e, t) {
        this.callback = e, this.frequency = t, this.currentlyExecuting = !1, this.registerCallback()
    },
    registerCallback: function() {
        this.timer = setInterval(this.onTimerEvent.bind(this), 1e3 * this.frequency)
    },
    execute: function() {
        this.callback(this)
    },
    stop: function() {
        this.timer && (clearInterval(this.timer), this.timer = null)
    },
    onTimerEvent: function() {
        if (!this.currentlyExecuting) try {
            this.currentlyExecuting = !0, this.execute(), this.currentlyExecuting = !1
        } catch (e) {
            throw this.currentlyExecuting = !1, e
        }
    }
});
Object.extend(String, {
    interpret: function(e) {
        return null == e ? "" : String(e)
    },
    specialChar: {
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\\": "\\\\"
    }
}), Object.extend(String.prototype, function() {
    function prepareReplacement(e) {
        if (Object.isFunction(e)) return e;
        var t = new Template(e);
        return function(e) {
            return t.evaluate(e)
        }
    }

    function gsub(e, t) {
        var n, i = "",
            o = this;
        if (t = prepareReplacement(t), Object.isString(e) && (e = RegExp.escape(e)), !e.length && !e.source) return t = t(""), t + o.split("").join(t) + t;
        for (; o.length > 0;)(n = o.match(e)) ? (i += o.slice(0, n.index), i += String.interpret(t(n)), o = o.slice(n.index + n[0].length)) : (i += o, o = "");
        return i
    }

    function sub(e, t, n) {
        return t = prepareReplacement(t), n = Object.isUndefined(n) ? 1 : n, this.gsub(e, function(e) {
            return --n < 0 ? e[0] : t(e)
        })
    }

    function scan(e, t) {
        return this.gsub(e, t), String(this)
    }

    function truncate(e, t) {
        return e = e || 30, t = Object.isUndefined(t) ? "..." : t, this.length > e ? this.slice(0, e - t.length) + t : String(this)
    }

    function strip() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }

    function stripTags() {
        return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "")
    }

    function stripScripts() {
        return this.replace(new RegExp(Prototype.ScriptFragment, "img"), "")
    }

    function extractScripts() {
        var e = new RegExp(Prototype.ScriptFragment, "img"),
            t = new RegExp(Prototype.ScriptFragment, "im");
        return (this.match(e) || []).map(function(e) {
            return (e.match(t) || ["", ""])[1]
        })
    }

    function evalScripts() {
        return this.extractScripts().map(function(script) {
            return eval(script)
        })
    }

    function escapeHTML() {
        return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }

    function unescapeHTML() {
        return this.stripTags().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    }

    function toQueryParams(e) {
        var t = this.strip().match(/([^?#]*)(#.*)?$/);
        return t ? t[1].split(e || "&").inject({}, function(e, t) {
            if ((t = t.split("="))[0]) {
                var n = decodeURIComponent(t.shift()),
                    i = t.length > 1 ? t.join("=") : t[0];
                void 0 != i && (i = decodeURIComponent(i)), n in e ? (Object.isArray(e[n]) || (e[n] = [e[n]]), e[n].push(i)) : e[n] = i
            }
            return e
        }) : {}
    }

    function toArray() {
        return this.split("")
    }

    function succ() {
        return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
    }

    function times(e) {
        return 1 > e ? "" : new Array(e + 1).join(this)
    }

    function camelize() {
        return this.replace(/-+(.)?/g, function(e, t) {
            return t ? t.toUpperCase() : ""
        })
    }

    function capitalize() {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
    }

    function underscore() {
        return this.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase()
    }

    function dasherize() {
        return this.replace(/_/g, "-")
    }

    function inspect(e) {
        var t = this.replace(/[\x00-\x1f\\]/g, function(e) {
            return e in String.specialChar ? String.specialChar[e] : "\\u00" + e.charCodeAt().toPaddedString(2, 16)
        });
        return e ? '"' + t.replace(/"/g, '\\"') + '"' : "'" + t.replace(/'/g, "\\'") + "'"
    }

    function unfilterJSON(e) {
        return this.replace(e || Prototype.JSONFilter, "$1")
    }

    function isJSON() {
        var e = this;
        return e.blank() ? !1 : (e = e.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@"), e = e.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]"), e = e.replace(/(?:^|:|,)(?:\s*\[)+/g, ""), /^[\],:{}\s]*$/.test(e))
    }

    function evalJSON(sanitize) {
        var json = this.unfilterJSON(),
            cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        cx.test(json) && (json = json.replace(cx, function(e) {
            return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
        }));
        try {
            if (!sanitize || json.isJSON()) return eval("(" + json + ")")
        } catch (e) {}
        throw new SyntaxError("Badly formed JSON string: " + this.inspect())
    }

    function parseJSON() {
        var e = this.unfilterJSON();
        return JSON.parse(e)
    }

    function include(e) {
        return this.indexOf(e) > -1
    }

    function startsWith(e) {
        return 0 === this.lastIndexOf(e, 0)
    }

    function endsWith(e) {
        var t = this.length - e.length;
        return t >= 0 && this.indexOf(e, t) === t
    }

    function empty() {
        return "" == this
    }

    function blank() {
        return /^\s*$/.test(this)
    }

    function interpolate(e, t) {
        return new Template(this, t).evaluate(e)
    }
    var NATIVE_JSON_PARSE_SUPPORT = window.JSON && "function" == typeof JSON.parse && JSON.parse('{"test": true}').test;
    return {
        gsub: gsub,
        sub: sub,
        scan: scan,
        truncate: truncate,
        strip: String.prototype.trim || strip,
        stripTags: stripTags,
        stripScripts: stripScripts,
        extractScripts: extractScripts,
        evalScripts: evalScripts,
        escapeHTML: escapeHTML,
        unescapeHTML: unescapeHTML,
        toQueryParams: toQueryParams,
        parseQuery: toQueryParams,
        toArray: toArray,
        succ: succ,
        times: times,
        camelize: camelize,
        capitalize: capitalize,
        underscore: underscore,
        dasherize: dasherize,
        inspect: inspect,
        unfilterJSON: unfilterJSON,
        isJSON: isJSON,
        evalJSON: NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
        include: include,
        startsWith: startsWith,
        endsWith: endsWith,
        empty: empty,
        blank: blank,
        interpolate: interpolate
    }
}());
var Template = Class.create({
    initialize: function(e, t) {
        this.template = e.toString(), this.pattern = t || Template.Pattern
    },
    evaluate: function(e) {
        return e && Object.isFunction(e.toTemplateReplacements) && (e = e.toTemplateReplacements()), this.template.gsub(this.pattern, function(t) {
            if (null == e) return t[1] + "";
            var n = t[1] || "";
            if ("\\" == n) return t[2];
            var i = e,
                o = t[3],
                s = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
            if (t = s.exec(o), null == t) return n;
            for (; null != t;) {
                var r = t[1].startsWith("[") ? t[2].replace(/\\\\]/g, "]") : t[1];
                if (i = i[r], null == i || "" == t[3]) break;
                o = o.substring("[" == t[3] ? t[1].length : t[0].length), t = s.exec(o)
            }
            return n + String.interpret(i)
        })
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {},
    Enumerable = function() {
        function e(e, t) {
            var n = 0;
            try {
                this._each(function(i) {
                    e.call(t, i, n++)
                })
            } catch (i) {
                if (i != $break) throw i
            }
            return this
        }

        function t(e, t, n) {
            var i = -e,
                o = [],
                s = this.toArray();
            if (1 > e) return s;
            for (;
                (i += e) < s.length;) o.push(s.slice(i, i + e));
            return o.collect(t, n)
        }

        function n(e, t) {
            e = e || Prototype.K;
            var n = !0;
            return this.each(function(i, o) {
                if (n = n && !!e.call(t, i, o), !n) throw $break
            }), n
        }

        function i(e, t) {
            e = e || Prototype.K;
            var n = !1;
            return this.each(function(i, o) {
                if (n = !!e.call(t, i, o)) throw $break
            }), n
        }

        function o(e, t) {
            e = e || Prototype.K;
            var n = [];
            return this.each(function(i, o) {
                n.push(e.call(t, i, o))
            }), n
        }

        function s(e, t) {
            var n;
            return this.each(function(i, o) {
                if (e.call(t, i, o)) throw n = i, $break
            }), n
        }

        function r(e, t) {
            var n = [];
            return this.each(function(i, o) {
                e.call(t, i, o) && n.push(i)
            }), n
        }

        function a(e, t, n) {
            t = t || Prototype.K;
            var i = [];
            return Object.isString(e) && (e = new RegExp(RegExp.escape(e))), this.each(function(o, s) {
                e.match(o) && i.push(t.call(n, o, s))
            }), i
        }

        function l(e) {
            if (Object.isFunction(this.indexOf) && -1 != this.indexOf(e)) return !0;
            var t = !1;
            return this.each(function(n) {
                if (n == e) throw t = !0, $break
            }), t
        }

        function c(e, t) {
            return t = Object.isUndefined(t) ? null : t, this.eachSlice(e, function(n) {
                for (; n.length < e;) n.push(t);
                return n
            })
        }

        function d(e, t, n) {
            return this.each(function(i, o) {
                e = t.call(n, e, i, o)
            }), e
        }

        function u(e) {
            var t = $A(arguments).slice(1);
            return this.map(function(n) {
                return n[e].apply(n, t)
            })
        }

        function h(e, t) {
            e = e || Prototype.K;
            var n;
            return this.each(function(i, o) {
                i = e.call(t, i, o), (null == n || i >= n) && (n = i)
            }), n
        }

        function p(e, t) {
            e = e || Prototype.K;
            var n;
            return this.each(function(i, o) {
                i = e.call(t, i, o), (null == n || n > i) && (n = i)
            }), n
        }

        function m(e, t) {
            e = e || Prototype.K;
            var n = [],
                i = [];
            return this.each(function(o, s) {
                (e.call(t, o, s) ? n : i).push(o)
            }), [n, i]
        }

        function f(e) {
            var t = [];
            return this.each(function(n) {
                t.push(n[e])
            }), t
        }

        function g(e, t) {
            var n = [];
            return this.each(function(i, o) {
                e.call(t, i, o) || n.push(i)
            }), n
        }

        function v(e, t) {
            return this.map(function(n, i) {
                return {
                    value: n,
                    criteria: e.call(t, n, i)
                }
            }).sort(function(e, t) {
                var n = e.criteria,
                    i = t.criteria;
                return i > n ? -1 : n > i ? 1 : 0
            }).pluck("value")
        }

        function b() {
            return this.map()
        }

        function y() {
            var e = Prototype.K,
                t = $A(arguments);
            Object.isFunction(t.last()) && (e = t.pop());
            var n = [this].concat(t).map($A);
            return this.map(function(t, i) {
                return e(n.pluck(i))
            })
        }

        function E() {
            return this.toArray().length
        }

        function w() {
            return "#<Enumerable:" + this.toArray().inspect() + ">"
        }
        return {
            each: e,
            eachSlice: t,
            all: n,
            every: n,
            any: i,
            some: i,
            collect: o,
            map: o,
            detect: s,
            findAll: r,
            select: r,
            filter: r,
            grep: a,
            include: l,
            member: l,
            inGroupsOf: c,
            inject: d,
            invoke: u,
            max: h,
            min: p,
            partition: m,
            pluck: f,
            reject: g,
            sortBy: v,
            toArray: b,
            entries: b,
            zip: y,
            size: E,
            inspect: w,
            find: s
        }
    }();
Array.from = $A,
    function() {
        function e(e, t) {
            for (var n = 0, i = this.length >>> 0; i > n; n++) n in this && e.call(t, this[n], n, this)
        }

        function t() {
            return this.length = 0, this
        }

        function n() {
            return this[0]
        }

        function i() {
            return this[this.length - 1]
        }

        function o() {
            return this.select(function(e) {
                return null != e
            })
        }

        function s() {
            return this.inject([], function(e, t) {
                return Object.isArray(t) ? e.concat(t.flatten()) : (e.push(t), e)
            })
        }

        function r() {
            var e = v.call(arguments, 0);
            return this.select(function(t) {
                return !e.include(t)
            })
        }

        function a(e) {
            return (e === !1 ? this.toArray() : this)._reverse()
        }

        function l(e) {
            return this.inject([], function(t, n, i) {
                return 0 != i && (e ? t.last() == n : t.include(n)) || t.push(n), t
            })
        }

        function c(e) {
            return this.uniq().findAll(function(t) {
                return e.detect(function(e) {
                    return t === e
                })
            })
        }

        function d() {
            return v.call(this, 0)
        }

        function u() {
            return this.length
        }

        function h() {
            return "[" + this.map(Object.inspect).join(", ") + "]"
        }

        function p(e, t) {
            t || (t = 0);
            var n = this.length;
            for (0 > t && (t = n + t); n > t; t++)
                if (this[t] === e) return t;
            return -1
        }

        function m(e, t) {
            t = isNaN(t) ? this.length : (0 > t ? this.length + t : t) + 1;
            var n = this.slice(0, t).reverse().indexOf(e);
            return 0 > n ? n : t - n - 1
        }

        function f() {
            for (var e, t = v.call(this, 0), n = 0, i = arguments.length; i > n; n++)
                if (e = arguments[n], !Object.isArray(e) || "callee" in e) t.push(e);
                else
                    for (var o = 0, s = e.length; s > o; o++) t.push(e[o]);
            return t
        }
        var g = Array.prototype,
            v = g.slice,
            b = g.forEach;
        b || (b = e), Object.extend(g, Enumerable), g._reverse || (g._reverse = g.reverse), Object.extend(g, {
            _each: b,
            clear: t,
            first: n,
            last: i,
            compact: o,
            flatten: s,
            without: r,
            reverse: a,
            uniq: l,
            intersect: c,
            clone: d,
            toArray: d,
            size: u,
            inspect: h
        });
        var y = function() {
            return 1 !== [].concat(arguments)[0][0]
        }(1, 2);
        y && (g.concat = f), g.indexOf || (g.indexOf = p), g.lastIndexOf || (g.lastIndexOf = m)
    }();
var Hash = Class.create(Enumerable, function() {
    function e(e) {
        this._object = Object.isHash(e) ? e.toObject() : Object.clone(e)
    }

    function t(e) {
        for (var t in this._object) {
            var n = this._object[t],
                i = [t, n];
            i.key = t, i.value = n, e(i)
        }
    }

    function n(e, t) {
        return this._object[e] = t
    }

    function i(e) {
        return this._object[e] !== Object.prototype[e] ? this._object[e] : void 0
    }

    function o(e) {
        var t = this._object[e];
        return delete this._object[e], t
    }

    function s() {
        return Object.clone(this._object)
    }

    function r() {
        return this.pluck("key")
    }

    function a() {
        return this.pluck("value")
    }

    function l(e) {
        var t = this.detect(function(t) {
            return t.value === e
        });
        return t && t.key
    }

    function c(e) {
        return this.clone().update(e)
    }

    function d(e) {
        return new Hash(e).inject(this, function(e, t) {
            return e.set(t.key, t.value), e
        })
    }

    function u(e, t) {
        return Object.isUndefined(t) ? e : e + "=" + encodeURIComponent(String.interpret(t))
    }

    function h() {
        return this.inject([], function(e, t) {
            var n = encodeURIComponent(t.key),
                i = t.value;
            if (i && "object" == typeof i) {
                if (Object.isArray(i)) {
                    for (var o, s = [], r = 0, a = i.length; a > r; r++) o = i[r], s.push(u(n, o));
                    return e.concat(s)
                }
            } else e.push(u(n, i));
            return e
        }).join("&")
    }

    function p() {
        return "#<Hash:{" + this.map(function(e) {
            return e.map(Object.inspect).join(": ")
        }).join(", ") + "}>"
    }

    function m() {
        return new Hash(this)
    }
    return {
        initialize: e,
        _each: t,
        set: n,
        get: i,
        unset: o,
        toObject: s,
        toTemplateReplacements: s,
        keys: r,
        values: a,
        index: l,
        merge: c,
        update: d,
        toQueryString: h,
        inspect: p,
        toJSON: s,
        clone: m
    }
}());
Hash.from = $H, Object.extend(Number.prototype, function() {
    function e() {
        return this.toPaddedString(2, 16)
    }

    function t() {
        return this + 1
    }

    function n(e, t) {
        return $R(0, this, !0).each(e, t), this
    }

    function i(e, t) {
        var n = this.toString(t || 10);
        return "0".times(e - n.length) + n
    }

    function o() {
        return Math.abs(this)
    }

    function s() {
        return Math.round(this)
    }

    function r() {
        return Math.ceil(this)
    }

    function a() {
        return Math.floor(this)
    }
    return {
        toColorPart: e,
        succ: t,
        times: n,
        toPaddedString: i,
        abs: o,
        round: s,
        ceil: r,
        floor: a
    }
}());
var ObjectRange = Class.create(Enumerable, function() {
        function e(e, t, n) {
            this.start = e, this.end = t, this.exclusive = n
        }

        function t(e) {
            for (var t = this.start; this.include(t);) e(t), t = t.succ()
        }

        function n(e) {
            return e < this.start ? !1 : this.exclusive ? e < this.end : e <= this.end
        }
        return {
            initialize: e,
            _each: t,
            include: n
        }
    }()),
    Abstract = {},
    Try = {
        these: function() {
            for (var e, t = 0, n = arguments.length; n > t; t++) {
                var i = arguments[t];
                try {
                    e = i();
                    break
                } catch (o) {}
            }
            return e
        }
    },
    Ajax = {
        getTransport: function() {
            return Try.these(function() {
                return new XMLHttpRequest
            }, function() {
                return new ActiveXObject("Msxml2.XMLHTTP")
            }, function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }) || !1
        },
        activeRequestCount: 0
    };
if (Ajax.Responders = {
        responders: [],
        _each: function(e) {
            this.responders._each(e)
        },
        register: function(e) {
            this.include(e) || this.responders.push(e)
        },
        unregister: function(e) {
            this.responders = this.responders.without(e)
        },
        dispatch: function(e, t, n, i) {
            this.each(function(o) {
                if (Object.isFunction(o[e])) try {
                    o[e].apply(o, [t, n, i])
                } catch (s) {}
            })
        }
    }, Object.extend(Ajax.Responders, Enumerable), Ajax.Responders.register({
        onCreate: function() {
            Ajax.activeRequestCount++
        },
        onComplete: function() {
            Ajax.activeRequestCount--
        }
    }), Ajax.Base = Class.create({
        initialize: function(e) {
            this.options = {
                method: "post",
                asynchronous: !0,
                contentType: "application/x-www-form-urlencoded",
                encoding: "UTF-8",
                parameters: "",
                evalJSON: !0,
                evalJS: !0
            }, Object.extend(this.options, e || {}), this.options.method = this.options.method.toLowerCase(), Object.isHash(this.options.parameters) && (this.options.parameters = this.options.parameters.toObject())
        }
    }), Ajax.Request = Class.create(Ajax.Base, {
        _complete: !1,
        initialize: function($super, e, t) {
            $super(t), this.transport = Ajax.getTransport(), this.request(e)
        },
        request: function(e) {
            this.url = e, this.method = this.options.method;
            var t = Object.isString(this.options.parameters) ? this.options.parameters : Object.toQueryString(this.options.parameters);
            ["get", "post"].include(this.method) || (t += (t ? "&" : "") + "_method=" + this.method, this.method = "post"), t && "get" === this.method && (this.url += (this.url.include("?") ? "&" : "?") + t), this.parameters = t.toQueryParams();
            try {
                var n = new Ajax.Response(this);
                this.options.onCreate && this.options.onCreate(n), Ajax.Responders.dispatch("onCreate", this, n), this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous), this.options.asynchronous && this.respondToReadyState.bind(this).defer(1), this.transport.onreadystatechange = this.onStateChange.bind(this), this.setRequestHeaders(), this.body = "post" == this.method ? this.options.postBody || t : null, this.transport.send(this.body), !this.options.asynchronous && this.transport.overrideMimeType && this.onStateChange()
            } catch (i) {
                this.dispatchException(i)
            }
        },
        onStateChange: function() {
            var e = this.transport.readyState;
            e > 1 && (4 != e || !this._complete) && this.respondToReadyState(this.transport.readyState)
        },
        setRequestHeaders: function() {
            var e = {
                "X-Requested-With": "XMLHttpRequest",
                "X-Prototype-Version": Prototype.Version,
                Accept: "text/javascript, text/html, application/xml, text/xml, */*"
            };
            if ("post" == this.method && (e["Content-type"] = this.options.contentType + (this.options.encoding ? "; charset=" + this.options.encoding : ""), this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005 && (e.Connection = "close")), "object" == typeof this.options.requestHeaders) {
                var t = this.options.requestHeaders;
                if (Object.isFunction(t.push))
                    for (var n = 0, i = t.length; i > n; n += 2) e[t[n]] = t[n + 1];
                else $H(t).each(function(t) {
                    e[t.key] = t.value
                })
            }
            for (var o in e) this.transport.setRequestHeader(o, e[o])
        },
        success: function() {
            var e = this.getStatus();
            return !e || e >= 200 && 300 > e || 304 == e
        },
        getStatus: function() {
            try {
                return 1223 === this.transport.status ? 204 : this.transport.status || 0
            } catch (e) {
                return 0
            }
        },
        respondToReadyState: function(e) {
            var t = Ajax.Request.Events[e],
                n = new Ajax.Response(this);
            if ("Complete" == t) {
                try {
                    this._complete = !0, (this.options["on" + n.status] || this.options["on" + (this.success() ? "Success" : "Failure")] || Prototype.emptyFunction)(n, n.headerJSON)
                } catch (i) {
                    this.dispatchException(i)
                }
                var o = n.getHeader("Content-type");
                ("force" == this.options.evalJS || this.options.evalJS && this.isSameOrigin() && o && o.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)) && this.evalResponse()
            }
            try {
                (this.options["on" + t] || Prototype.emptyFunction)(n, n.headerJSON), Ajax.Responders.dispatch("on" + t, this, n, n.headerJSON)
            } catch (i) {
                this.dispatchException(i)
            }
            "Complete" == t && (this.transport.onreadystatechange = Prototype.emptyFunction)
        },
        isSameOrigin: function() {
            var e = this.url.match(/^\s*https?:\/\/[^\/]*/);
            return !e || e[0] == "#{protocol}//#{domain}#{port}".interpolate({
                protocol: location.protocol,
                domain: document.domain,
                port: location.port ? ":" + location.port : ""
            })
        },
        getHeader: function(e) {
            try {
                return this.transport.getResponseHeader(e) || null
            } catch (t) {
                return null
            }
        },
        evalResponse: function() {
            try {
                return eval((this.transport.responseText || "").unfilterJSON())
            } catch (e) {
                this.dispatchException(e)
            }
        },
        dispatchException: function(e) {
            (this.options.onException || Prototype.emptyFunction)(this, e), Ajax.Responders.dispatch("onException", this, e)
        }
    }), Ajax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"], Ajax.Response = Class.create({
        initialize: function(e) {
            this.request = e;
            var t = this.transport = e.transport,
                n = this.readyState = t.readyState;
            if ((n > 2 && !Prototype.Browser.IE || 4 == n) && (this.status = this.getStatus(), this.statusText = this.getStatusText(), this.responseText = String.interpret(t.responseText), this.headerJSON = this._getHeaderJSON()), 4 == n) {
                var i = t.responseXML;
                this.responseXML = Object.isUndefined(i) ? null : i, this.responseJSON = this._getResponseJSON()
            }
        },
        status: 0,
        statusText: "",
        getStatus: Ajax.Request.prototype.getStatus,
        getStatusText: function() {
            try {
                return this.transport.statusText || ""
            } catch (e) {
                return ""
            }
        },
        getHeader: Ajax.Request.prototype.getHeader,
        getAllHeaders: function() {
            try {
                return this.getAllResponseHeaders()
            } catch (e) {
                return null
            }
        },
        getResponseHeader: function(e) {
            return this.transport.getResponseHeader(e)
        },
        getAllResponseHeaders: function() {
            return this.transport.getAllResponseHeaders()
        },
        _getHeaderJSON: function() {
            var e = this.getHeader("X-JSON");
            if (!e) return null;
            e = decodeURIComponent(escape(e));
            try {
                return e.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin())
            } catch (t) {
                this.request.dispatchException(t)
            }
        },
        _getResponseJSON: function() {
            var e = this.request.options;
            if (!e.evalJSON || "force" != e.evalJSON && !(this.getHeader("Content-type") || "").include("application/json") || this.responseText.blank()) return null;
            try {
                return this.responseText.evalJSON(e.sanitizeJSON || !this.request.isSameOrigin())
            } catch (t) {
                this.request.dispatchException(t)
            }
        }
    }), Ajax.Updater = Class.create(Ajax.Request, {
        initialize: function($super, e, t, n) {
            this.container = {
                success: e.success || e,
                failure: e.failure || (e.success ? null : e)
            }, n = Object.clone(n);
            var i = n.onComplete;
            n.onComplete = function(e, t) {
                this.updateContent(e.responseText), Object.isFunction(i) && i(e, t)
            }.bind(this), $super(t, n)
        },
        updateContent: function(e) {
            var t = this.container[this.success() ? "success" : "failure"],
                n = this.options;
            if (n.evalScripts || (e = e.stripScripts()), t = $(t))
                if (n.insertion)
                    if (Object.isString(n.insertion)) {
                        var i = {};
                        i[n.insertion] = e, t.insert(i)
                    } else n.insertion(t, e);
            else t.update(e)
        }
    }), Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
        initialize: function($super, e, t, n) {
            $super(n), this.onComplete = this.options.onComplete, this.frequency = this.options.frequency || 2, this.decay = this.options.decay || 1, this.updater = {}, this.container = e, this.url = t, this.start()
        },
        start: function() {
            this.options.onComplete = this.updateComplete.bind(this), this.onTimerEvent()
        },
        stop: function() {
            this.updater.options.onComplete = void 0, clearTimeout(this.timer), (this.onComplete || Prototype.emptyFunction).apply(this, arguments)
        },
        updateComplete: function(e) {
            this.options.decay && (this.decay = e.responseText == this.lastText ? this.decay * this.options.decay : 1, this.lastText = e.responseText), this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency)
        },
        onTimerEvent: function() {
            this.updater = new Ajax.Updater(this.container, this.url, this.options)
        }
    }), Prototype.BrowserFeatures.XPath && (document._getElementsByXPath = function(e, t) {
        for (var n = [], i = document.evaluate(e, $(t) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), o = 0, s = i.snapshotLength; s > o; o++) n.push(Element.extend(i.snapshotItem(o)));
        return n
    }), !Node) var Node = {};
Node.ELEMENT_NODE || Object.extend(Node, {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        ENTITY_REFERENCE_NODE: 5,
        ENTITY_NODE: 6,
        PROCESSING_INSTRUCTION_NODE: 7,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        DOCUMENT_FRAGMENT_NODE: 11,
        NOTATION_NODE: 12
    }),
    function(e) {
        function t(e, t) {
            return "select" === e ? !1 : "type" in t ? !1 : !0
        }
        var n = function() {
                try {
                    var e = document.createElement('<input name="x">');
                    return "input" === e.tagName.toLowerCase() && "x" === e.name
                } catch (t) {
                    return !1
                }
            }(),
            i = e.Element;
        e.Element = function(e, i) {
            i = i || {}, e = e.toLowerCase();
            var o = Element.cache;
            if (n && i.name) return e = "<" + e + ' name="' + i.name + '">', delete i.name, Element.writeAttribute(document.createElement(e), i);
            o[e] || (o[e] = Element.extend(document.createElement(e)));
            var s = t(e, i) ? o[e].cloneNode(!1) : document.createElement(e);
            return Element.writeAttribute(s, i)
        }, Object.extend(e.Element, i || {}), i && (e.Element.prototype = i.prototype)
    }(this), Element.idCounter = 1, Element.cache = {}, Element._purgeElement = function(e) {
        var t = e._prototypeUID;
        t && (Element.stopObserving(e), e._prototypeUID = void 0, delete Element.Storage[t])
    }, Element.Methods = {
        visible: function(e) {
            return "none" != $(e).style.display
        },
        toggle: function(e) {
            return e = $(e), Element[Element.visible(e) ? "hide" : "show"](e), e
        },
        hide: function(e) {
            return e = $(e), e.style.display = "none", e
        },
        show: function(e) {
            return e = $(e), e.style.display = "", e
        },
        remove: function(e) {
            return e = $(e), e.parentNode.removeChild(e), e
        },
        update: function() {
            function e(e, t) {
                e = $(e);
                for (var n = Element._purgeElement, r = e.getElementsByTagName("*"), a = r.length; a--;) n(r[a]);
                if (t && t.toElement && (t = t.toElement()), Object.isElement(t)) return e.update().insert(t);
                t = Object.toHTML(t);
                var l = e.tagName.toUpperCase();
                if ("SCRIPT" === l && s) return e.text = t, e;
                if (o)
                    if (l in Element._insertionTranslations.tags) {
                        for (; e.firstChild;) e.removeChild(e.firstChild);
                        Element._getContentFromAnonymousElement(l, t.stripScripts()).each(function(t) {
                            e.appendChild(t)
                        })
                    } else if (i && Object.isString(t) && t.indexOf("<link") > -1) {
                    for (; e.firstChild;) e.removeChild(e.firstChild);
                    var c = Element._getContentFromAnonymousElement(l, t.stripScripts(), !0);
                    c.each(function(t) {
                        e.appendChild(t)
                    })
                } else e.innerHTML = t.stripScripts();
                else e.innerHTML = t.stripScripts();
                return t.evalScripts.bind(t).defer(), e
            }
            var t = function() {
                    var e = document.createElement("select"),
                        t = !0;
                    return e.innerHTML = '<option value="test">test</option>', e.options && e.options[0] && (t = "OPTION" !== e.options[0].nodeName.toUpperCase()), e = null, t
                }(),
                n = function() {
                    try {
                        var e = document.createElement("table");
                        if (e && e.tBodies) {
                            e.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
                            var t = "undefined" == typeof e.tBodies[0];
                            return e = null, t
                        }
                    } catch (n) {
                        return !0
                    }
                }(),
                i = function() {
                    try {
                        var e = document.createElement("div");
                        e.innerHTML = "<link>";
                        var t = 0 === e.childNodes.length;
                        return e = null, t
                    } catch (n) {
                        return !0
                    }
                }(),
                o = t || n || i,
                s = function() {
                    var e = document.createElement("script"),
                        t = !1;
                    try {
                        e.appendChild(document.createTextNode("")), t = !e.firstChild || e.firstChild && 3 !== e.firstChild.nodeType
                    } catch (n) {
                        t = !0
                    }
                    return e = null, t
                }();
            return e
        }(),
        replace: function(e, t) {
            if (e = $(e), t && t.toElement) t = t.toElement();
            else if (!Object.isElement(t)) {
                t = Object.toHTML(t);
                var n = e.ownerDocument.createRange();
                n.selectNode(e), t.evalScripts.bind(t).defer(), t = n.createContextualFragment(t.stripScripts())
            }
            return e.parentNode.replaceChild(t, e), e
        },
        insert: function(e, t) {
            e = $(e), (Object.isString(t) || Object.isNumber(t) || Object.isElement(t) || t && (t.toElement || t.toHTML)) && (t = {
                bottom: t
            });
            var n, i, o, s;
            for (var r in t) n = t[r], r = r.toLowerCase(), i = Element._insertionTranslations[r], n && n.toElement && (n = n.toElement()), Object.isElement(n) ? i(e, n) : (n = Object.toHTML(n), o = ("before" == r || "after" == r ? e.parentNode : e).tagName.toUpperCase(), s = Element._getContentFromAnonymousElement(o, n.stripScripts()), ("top" == r || "after" == r) && s.reverse(), s.each(i.curry(e)), n.evalScripts.bind(n).defer());
            return e
        },
        wrap: function(e, t, n) {
            return e = $(e), Object.isElement(t) ? $(t).writeAttribute(n || {}) : t = Object.isString(t) ? new Element(t, n) : new Element("div", t), e.parentNode && e.parentNode.replaceChild(t, e), t.appendChild(e), t
        },
        inspect: function(e) {
            e = $(e);
            var t = "<" + e.tagName.toLowerCase();
            return $H({
                id: "id",
                className: "class"
            }).each(function(n) {
                var i = n.first(),
                    o = n.last(),
                    s = (e[i] || "").toString();
                s && (t += " " + o + "=" + s.inspect(!0))
            }), t + ">"
        },
        recursivelyCollect: function(e, t, n) {
            e = $(e), n = n || -1;
            for (var i = [];
                (e = e[t]) && (1 == e.nodeType && i.push(Element.extend(e)), i.length != n););
            return i
        },
        ancestors: function(e) {
            return Element.recursivelyCollect(e, "parentNode")
        },
        descendants: function(e) {
            return Element.select(e, "*")
        },
        firstDescendant: function(e) {
            for (e = $(e).firstChild; e && 1 != e.nodeType;) e = e.nextSibling;
            return $(e)
        },
        immediateDescendants: function(e) {
            for (var t = [], n = $(e).firstChild; n;) 1 === n.nodeType && t.push(Element.extend(n)), n = n.nextSibling;
            return t
        },
        previousSiblings: function(e) {
            return Element.recursivelyCollect(e, "previousSibling")
        },
        nextSiblings: function(e) {
            return Element.recursivelyCollect(e, "nextSibling")
        },
        siblings: function(e) {
            return e = $(e), Element.previousSiblings(e).reverse().concat(Element.nextSiblings(e))
        },
        match: function(e, t) {
            return e = $(e), Object.isString(t) ? Prototype.Selector.match(e, t) : t.match(e)
        },
        up: function(e, t, n) {
            if (e = $(e), 1 == arguments.length) return $(e.parentNode);
            var i = Element.ancestors(e);
            return Object.isNumber(t) ? i[t] : Prototype.Selector.find(i, t, n)
        },
        down: function(e, t, n) {
            return e = $(e), 1 == arguments.length ? Element.firstDescendant(e) : Object.isNumber(t) ? Element.descendants(e)[t] : Element.select(e, t)[n || 0]
        },
        previous: function(e, t, n) {
            return e = $(e), Object.isNumber(t) && (n = t, t = !1), Object.isNumber(n) || (n = 0), t ? Prototype.Selector.find(e.previousSiblings(), t, n) : e.recursivelyCollect("previousSibling", n + 1)[n]
        },
        next: function(e, t, n) {
            if (e = $(e), Object.isNumber(t) && (n = t, t = !1), Object.isNumber(n) || (n = 0), t) return Prototype.Selector.find(e.nextSiblings(), t, n);
            Object.isNumber(n) ? n + 1 : 1;
            return e.recursivelyCollect("nextSibling", n + 1)[n]
        },
        select: function(e) {
            e = $(e);
            var t = Array.prototype.slice.call(arguments, 1).join(", ");
            return Prototype.Selector.select(t, e)
        },
        adjacent: function(e) {
            e = $(e);
            var t = Array.prototype.slice.call(arguments, 1).join(", ");
            return Prototype.Selector.select(t, e.parentNode).without(e)
        },
        identify: function(e) {
            e = $(e);
            var t = Element.readAttribute(e, "id");
            if (t) return t;
            do t = "anonymous_element_" + Element.idCounter++; while ($(t));
            return Element.writeAttribute(e, "id", t), t
        },
        readAttribute: function(e, t) {
            if (e = $(e), Prototype.Browser.IE) {
                var n = Element._attributeTranslations.read;
                if (n.values[t]) return n.values[t](e, t);
                if (n.names[t] && (t = n.names[t]), t.include(":")) return e.attributes && e.attributes[t] ? e.attributes[t].value : null
            }
            return e.getAttribute(t)
        },
        writeAttribute: function(e, t, n) {
            e = $(e);
            var i = {},
                o = Element._attributeTranslations.write;
            "object" == typeof t ? i = t : i[t] = Object.isUndefined(n) ? !0 : n;
            for (var s in i) t = o.names[s] || s, n = i[s], o.values[s] && (t = o.values[s](e, n)), n === !1 || null === n ? e.removeAttribute(t) : n === !0 ? e.setAttribute(t, t) : e.setAttribute(t, n);
            return e
        },
        getHeight: function(e) {
            return Element.getDimensions(e).height
        },
        getWidth: function(e) {
            return Element.getDimensions(e).width
        },
        classNames: function(e) {
            return new Element.ClassNames(e)
        },
        hasClassName: function(e, t) {
            if (e = $(e)) {
                var n = e.className;
                return n.length > 0 && (n == t || new RegExp("(^|\\s)" + t + "(\\s|$)").test(n))
            }
        },
        addClassName: function(e, t) {
            return (e = $(e)) ? (Element.hasClassName(e, t) || (e.className += (e.className ? " " : "") + t), e) : void 0
        },
        removeClassName: function(e, t) {
            return (e = $(e)) ? (e.className = e.className.replace(new RegExp("(^|\\s+)" + t + "(\\s+|$)"), " ").strip(), e) : void 0
        },
        toggleClassName: function(e, t) {
            return (e = $(e)) ? Element[Element.hasClassName(e, t) ? "removeClassName" : "addClassName"](e, t) : void 0
        },
        cleanWhitespace: function(e) {
            e = $(e);
            for (var t = e.firstChild; t;) {
                var n = t.nextSibling;
                3 != t.nodeType || /\S/.test(t.nodeValue) || e.removeChild(t), t = n
            }
            return e
        },
        empty: function(e) {
            return $(e).innerHTML.blank()
        },
        descendantOf: function(e, t) {
            if (e = $(e), t = $(t), e.compareDocumentPosition) return 8 === (8 & e.compareDocumentPosition(t));
            if (t.contains) return t.contains(e) && t !== e;
            for (; e = e.parentNode;)
                if (e == t) return !0;
            return !1
        },
        scrollTo: function(e) {
            e = $(e);
            var t = Element.cumulativeOffset(e);
            return window.scrollTo(t[0], t[1]), e
        },
        getStyle: function(e, t) {
            e = $(e), t = "float" == t ? "cssFloat" : t.camelize();
            var n = e.style[t];
            if (!n || "auto" == n) {
                var i = document.defaultView.getComputedStyle(e, null);
                n = i ? i[t] : null
            }
            return "opacity" == t ? n ? parseFloat(n) : 1 : "auto" == n ? null : n
        },
        getOpacity: function(e) {
            return $(e).getStyle("opacity")
        },
        setStyle: function(e, t) {
            e = $(e);
            var n = e.style;
            if (Object.isString(t)) return e.style.cssText += ";" + t, t.include("opacity") ? e.setOpacity(t.match(/opacity:\s*(\d?\.?\d*)/)[1]) : e;
            for (var i in t) "opacity" == i ? e.setOpacity(t[i]) : n["float" == i || "cssFloat" == i ? Object.isUndefined(n.styleFloat) ? "cssFloat" : "styleFloat" : i] = t[i];
            return e
        },
        setOpacity: function(e, t) {
            return e = $(e), e.style.opacity = 1 == t || "" === t ? "" : 1e-5 > t ? 0 : t, e
        },
        makePositioned: function(e) {
            e = $(e);
            var t = Element.getStyle(e, "position");
            return "static" != t && t || (e._madePositioned = !0, e.style.position = "relative", Prototype.Browser.Opera && (e.style.top = 0, e.style.left = 0)), e
        },
        undoPositioned: function(e) {
            return e = $(e), e._madePositioned && (e._madePositioned = void 0, e.style.position = e.style.top = e.style.left = e.style.bottom = e.style.right = ""), e
        },
        makeClipping: function(e) {
            return e = $(e), e._overflow ? e : (e._overflow = Element.getStyle(e, "overflow") || "auto", "hidden" !== e._overflow && (e.style.overflow = "hidden"), e)
        },
        undoClipping: function(e) {
            return e = $(e), e._overflow ? (e.style.overflow = "auto" == e._overflow ? "" : e._overflow, e._overflow = null, e) : e
        },
        clonePosition: function(e, t) {
            var n = Object.extend({
                setLeft: !0,
                setTop: !0,
                setWidth: !0,
                setHeight: !0,
                offsetTop: 0,
                offsetLeft: 0
            }, arguments[2] || {});
            t = $(t);
            var i = Element.viewportOffset(t),
                o = [0, 0],
                s = null;
            return e = $(e), "absolute" == Element.getStyle(e, "position") && (s = Element.getOffsetParent(e), o = Element.viewportOffset(s)), s == document.body && (o[0] -= document.body.offsetLeft, o[1] -= document.body.offsetTop), n.setLeft && (e.style.left = i[0] - o[0] + n.offsetLeft + "px"), n.setTop && (e.style.top = i[1] - o[1] + n.offsetTop + "px"), n.setWidth && (e.style.width = t.offsetWidth + "px"), n.setHeight && (e.style.height = t.offsetHeight + "px"), e
        }
    }, Object.extend(Element.Methods, {
        getElementsBySelector: Element.Methods.select,
        childElements: Element.Methods.immediateDescendants
    }), Element._attributeTranslations = {
        write: {
            names: {
                className: "class",
                htmlFor: "for"
            },
            values: {}
        }
    }, Prototype.Browser.Opera ? (Element.Methods.getStyle = Element.Methods.getStyle.wrap(function(e, t, n) {
        switch (n) {
            case "height":
            case "width":
                if (!Element.visible(t)) return null;
                var i = parseInt(e(t, n), 10);
                if (i !== t["offset" + n.capitalize()]) return i + "px";
                var o;
                return o = "height" === n ? ["border-top-width", "padding-top", "padding-bottom", "border-bottom-width"] : ["border-left-width", "padding-left", "padding-right", "border-right-width"], o.inject(i, function(n, i) {
                    var o = e(t, i);
                    return null === o ? n : n - parseInt(o, 10)
                }) + "px";
            default:
                return e(t, n)
        }
    }), Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(function(e, t, n) {
        return "title" === n ? t.title : e(t, n)
    })) : Prototype.Browser.IE ? (Element.Methods.getStyle = function(e, t) {
        e = $(e), t = "float" == t || "cssFloat" == t ? "styleFloat" : t.camelize();
        var n = e.style[t];
        return !n && e.currentStyle && (n = e.currentStyle[t]), "opacity" == t ? (n = (e.getStyle("filter") || "").match(/alpha\(opacity=(.*)\)/)) && n[1] ? parseFloat(n[1]) / 100 : 1 : "auto" == n ? "width" != t && "height" != t || "none" == e.getStyle("display") ? null : e["offset" + t.capitalize()] + "px" : n
    }, Element.Methods.setOpacity = function(e, t) {
        function n(e) {
            return e.replace(/alpha\([^\)]*\)/gi, "")
        }
        e = $(e);
        var i = e.currentStyle;
        (i && !i.hasLayout || !i && "normal" == e.style.zoom) && (e.style.zoom = 1);
        var o = e.getStyle("filter"),
            s = e.style;
        return 1 == t || "" === t ? ((o = n(o)) ? s.filter = o : s.removeAttribute("filter"), e) : (1e-5 > t && (t = 0), s.filter = n(o) + "alpha(opacity=" + 100 * t + ")", e)
    }, Element._attributeTranslations = function() {
        var e = "className",
            t = "for",
            n = document.createElement("div");
        return n.setAttribute(e, "x"), "x" !== n.className && (n.setAttribute("class", "x"), "x" === n.className && (e = "class")), n = null, n = document.createElement("label"), n.setAttribute(t, "x"), "x" !== n.htmlFor && (n.setAttribute("htmlFor", "x"), "x" === n.htmlFor && (t = "htmlFor")), n = null, {
            read: {
                names: {
                    "class": e,
                    className: e,
                    "for": t,
                    htmlFor: t
                },
                values: {
                    _getAttr: function(e, t) {
                        return e.getAttribute(t)
                    },
                    _getAttr2: function(e, t) {
                        return e.getAttribute(t, 2)
                    },
                    _getAttrNode: function(e, t) {
                        var n = e.getAttributeNode(t);
                        return n ? n.value : ""
                    },
                    _getEv: function() {
                        var e, t = document.createElement("div");
                        t.onclick = Prototype.emptyFunction;
                        var n = t.getAttribute("onclick");
                        return String(n).indexOf("{") > -1 ? e = function(e, t) {
                            return (t = e.getAttribute(t)) ? (t = t.toString(), t = t.split("{")[1], t = t.split("}")[0], t.strip()) : null
                        } : "" === n && (e = function(e, t) {
                            return t = e.getAttribute(t), t ? t.strip() : null
                        }), t = null, e
                    }(),
                    _flag: function(e, t) {
                        return $(e).hasAttribute(t) ? t : null
                    },
                    style: function(e) {
                        return e.style.cssText.toLowerCase()
                    },
                    title: function(e) {
                        return e.title
                    }
                }
            }
        }
    }(), Element._attributeTranslations.write = {
        names: Object.extend({
            cellpadding: "cellPadding",
            cellspacing: "cellSpacing"
        }, Element._attributeTranslations.read.names),
        values: {
            checked: function(e, t) {
                e.checked = !!t
            },
            style: function(e, t) {
                e.style.cssText = t ? t : ""
            }
        }
    }, Element._attributeTranslations.has = {}, $w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc frameBorder").each(function(e) {
        Element._attributeTranslations.write.names[e.toLowerCase()] = e, Element._attributeTranslations.has[e.toLowerCase()] = e
    }), function(e) {
        Object.extend(e, {
            href: e._getAttr2,
            src: e._getAttr2,
            type: e._getAttr,
            action: e._getAttrNode,
            disabled: e._flag,
            checked: e._flag,
            readonly: e._flag,
            multiple: e._flag,
            onload: e._getEv,
            onunload: e._getEv,
            onclick: e._getEv,
            ondblclick: e._getEv,
            onmousedown: e._getEv,
            onmouseup: e._getEv,
            onmouseover: e._getEv,
            onmousemove: e._getEv,
            onmouseout: e._getEv,
            onfocus: e._getEv,
            onblur: e._getEv,
            onkeypress: e._getEv,
            onkeydown: e._getEv,
            onkeyup: e._getEv,
            onsubmit: e._getEv,
            onreset: e._getEv,
            onselect: e._getEv,
            onchange: e._getEv
        })
    }(Element._attributeTranslations.read.values), Prototype.BrowserFeatures.ElementExtensions && ! function() {
        function e(e) {
            for (var t, n = e.getElementsByTagName("*"), i = [], o = 0; t = n[o]; o++) "!" !== t.tagName && i.push(t);
            return i
        }
        Element.Methods.down = function(t, n, i) {
            return t = $(t), 1 == arguments.length ? t.firstDescendant() : Object.isNumber(n) ? e(t)[n] : Element.select(t, n)[i || 0]
        }
    }()) : Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent) ? Element.Methods.setOpacity = function(e, t) {
        return e = $(e), e.style.opacity = 1 == t ? .999999 : "" === t ? "" : 1e-5 > t ? 0 : t, e
    } : Prototype.Browser.WebKit && (Element.Methods.setOpacity = function(e, t) {
        if (e = $(e), e.style.opacity = 1 == t || "" === t ? "" : 1e-5 > t ? 0 : t, 1 == t)
            if ("IMG" == e.tagName.toUpperCase() && e.width) e.width++, e.width--;
            else try {
                var n = document.createTextNode(" ");
                e.appendChild(n), e.removeChild(n)
            } catch (i) {}
        return e
    }), "outerHTML" in document.documentElement && (Element.Methods.replace = function(e, t) {
        if (e = $(e), t && t.toElement && (t = t.toElement()), Object.isElement(t)) return e.parentNode.replaceChild(t, e), e;
        t = Object.toHTML(t);
        var n = e.parentNode,
            i = n.tagName.toUpperCase();
        if (Element._insertionTranslations.tags[i]) {
            var o = e.next(),
                s = Element._getContentFromAnonymousElement(i, t.stripScripts());
            n.removeChild(e), s.each(o ? function(e) {
                n.insertBefore(e, o)
            } : function(e) {
                n.appendChild(e)
            })
        } else e.outerHTML = t.stripScripts();
        return t.evalScripts.bind(t).defer(), e
    }), Element._returnOffset = function(e, t) {
        var n = [e, t];
        return n.left = e, n.top = t, n
    }, Element._getContentFromAnonymousElement = function(e, t, n) {
        var i = new Element("div"),
            o = Element._insertionTranslations.tags[e],
            s = !1;
        if (o ? s = !0 : n && (s = !0, o = ["", "", 0]), s) {
            i.innerHTML = "&nbsp;" + o[0] + t + o[1], i.removeChild(i.firstChild);
            for (var r = o[2]; r--;) i = i.firstChild
        } else i.innerHTML = t;
        return $A(i.childNodes)
    }, Element._insertionTranslations = {
        before: function(e, t) {
            e.parentNode.insertBefore(t, e)
        },
        top: function(e, t) {
            e.insertBefore(t, e.firstChild)
        },
        bottom: function(e, t) {
            e.appendChild(t)
        },
        after: function(e, t) {
            e.parentNode.insertBefore(t, e.nextSibling)
        },
        tags: {
            TABLE: ["<table>", "</table>", 1],
            TBODY: ["<table><tbody>", "</tbody></table>", 2],
            TR: ["<table><tbody><tr>", "</tr></tbody></table>", 3],
            TD: ["<table><tbody><tr><td>", "</td></tr></tbody></table>", 4],
            SELECT: ["<select>", "</select>", 1]
        }
    },
    function() {
        var e = Element._insertionTranslations.tags;
        Object.extend(e, {
            THEAD: e.TBODY,
            TFOOT: e.TBODY,
            TH: e.TD
        })
    }(), Element.Methods.Simulated = {
        hasAttribute: function(e, t) {
            t = Element._attributeTranslations.has[t] || t;
            var n = $(e).getAttributeNode(t);
            return !(!n || !n.specified)
        }
    }, Element.Methods.ByTag = {}, Object.extend(Element, Element.Methods),
    function(e) {
        !Prototype.BrowserFeatures.ElementExtensions && e.__proto__ && (window.HTMLElement = {}, window.HTMLElement.prototype = e.__proto__, Prototype.BrowserFeatures.ElementExtensions = !0), e = null
    }(document.createElement("div")), Element.extend = function() {
        function e(e) {
            if ("undefined" != typeof window.Element) {
                var t = window.Element.prototype;
                if (t) {
                    var n = "_" + (Math.random() + "").slice(2),
                        i = document.createElement(e);
                    t[n] = "x";
                    var o = "x" !== i[n];
                    return delete t[n], i = null, o
                }
            }
            return !1
        }

        function t(e, t) {
            for (var n in t) {
                var i = t[n];
                !Object.isFunction(i) || n in e || (e[n] = i.methodize())
            }
        }
        var n = e("object");
        if (Prototype.BrowserFeatures.SpecificElementExtensions) return n ? function(e) {
            if (e && "undefined" == typeof e._extendedByPrototype) {
                var n = e.tagName;
                n && /^(?:object|applet|embed)$/i.test(n) && (t(e, Element.Methods), t(e, Element.Methods.Simulated), t(e, Element.Methods.ByTag[n.toUpperCase()]))
            }
            return e
        } : Prototype.K;
        var i = {},
            o = Element.Methods.ByTag,
            s = Object.extend(function(e) {
                if (!e || "undefined" != typeof e._extendedByPrototype || 1 != e.nodeType || e == window) return e;
                var n = Object.clone(i),
                    s = e.tagName.toUpperCase();
                return o[s] && Object.extend(n, o[s]), t(e, n), e._extendedByPrototype = Prototype.emptyFunction, e
            }, {
                refresh: function() {
                    Prototype.BrowserFeatures.ElementExtensions || (Object.extend(i, Element.Methods), Object.extend(i, Element.Methods.Simulated))
                }
            });
        return s.refresh(), s
    }(), Element.hasAttribute = document.documentElement.hasAttribute ? function(e, t) {
        return e.hasAttribute(t)
    } : Element.Methods.Simulated.hasAttribute, Element.addMethods = function(e) {
        function t(t) {
            t = t.toUpperCase(), Element.Methods.ByTag[t] || (Element.Methods.ByTag[t] = {}), Object.extend(Element.Methods.ByTag[t], e)
        }

        function n(e, t, n) {
            n = n || !1;
            for (var i in e) {
                var o = e[i];
                Object.isFunction(o) && (n && i in t || (t[i] = o.methodize()))
            }
        }

        function i(e) {
            var t, n = {
                OPTGROUP: "OptGroup",
                TEXTAREA: "TextArea",
                P: "Paragraph",
                FIELDSET: "FieldSet",
                UL: "UList",
                OL: "OList",
                DL: "DList",
                DIR: "Directory",
                H1: "Heading",
                H2: "Heading",
                H3: "Heading",
                H4: "Heading",
                H5: "Heading",
                H6: "Heading",
                Q: "Quote",
                INS: "Mod",
                DEL: "Mod",
                A: "Anchor",
                IMG: "Image",
                CAPTION: "TableCaption",
                COL: "TableCol",
                COLGROUP: "TableCol",
                THEAD: "TableSection",
                TFOOT: "TableSection",
                TBODY: "TableSection",
                TR: "TableRow",
                TH: "TableCell",
                TD: "TableCell",
                FRAMESET: "FrameSet",
                IFRAME: "IFrame"
            };
            if (n[e] && (t = "HTML" + n[e] + "Element"), window[t]) return window[t];
            if (t = "HTML" + e + "Element", window[t]) return window[t];
            if (t = "HTML" + e.capitalize() + "Element", window[t]) return window[t];
            var i = document.createElement(e),
                o = i.__proto__ || i.constructor.prototype;
            return i = null, o
        }
        var o = Prototype.BrowserFeatures,
            s = Element.Methods.ByTag;
        if (e || (Object.extend(Form, Form.Methods), Object.extend(Form.Element, Form.Element.Methods), Object.extend(Element.Methods.ByTag, {
                FORM: Object.clone(Form.Methods),
                INPUT: Object.clone(Form.Element.Methods),
                SELECT: Object.clone(Form.Element.Methods),
                TEXTAREA: Object.clone(Form.Element.Methods),
                BUTTON: Object.clone(Form.Element.Methods)
            })), 2 == arguments.length) {
            var r = e;
            e = arguments[1]
        }
        r ? Object.isArray(r) ? r.each(t) : t(r) : Object.extend(Element.Methods, e || {});
        var a = window.HTMLElement ? HTMLElement.prototype : Element.prototype;
        if (o.ElementExtensions && (n(Element.Methods, a), n(Element.Methods.Simulated, a, !0)), o.SpecificElementExtensions)
            for (var l in Element.Methods.ByTag) {
                var c = i(l);
                Object.isUndefined(c) || n(s[l], c.prototype)
            }
        Object.extend(Element, Element.Methods), delete Element.ByTag, Element.extend.refresh && Element.extend.refresh(), Element.cache = {}
    }, document.viewport = {
        getDimensions: function() {
            return {
                width: this.getWidth(),
                height: this.getHeight()
            }
        },
        getScrollOffsets: function() {
            return Element._returnOffset(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
        }
    },
    function(e) {
        function t() {
            return o.WebKit && !s.evaluate ? document : o.Opera && window.parseFloat(window.opera.version()) < 9.5 ? document.body : document.documentElement
        }

        function n(n) {
            return i || (i = t()), r[n] = "client" + n, e["get" + n] = function() {
                return i[r[n]]
            }, e["get" + n]()
        }
        var i, o = Prototype.Browser,
            s = document,
            r = {};
        e.getWidth = n.curry("Width"), e.getHeight = n.curry("Height")
    }(document.viewport), Element.Storage = {
        UID: 1
    }, Element.addMethods({
        getStorage: function(e) {
            if (e = $(e)) {
                var t;
                return e === window ? t = 0 : ("undefined" == typeof e._prototypeUID && (e._prototypeUID = Element.Storage.UID++), t = e._prototypeUID), Element.Storage[t] || (Element.Storage[t] = $H()), Element.Storage[t]
            }
        },
        store: function(e, t, n) {
            return (e = $(e)) ? (2 === arguments.length ? Element.getStorage(e).update(t) : Element.getStorage(e).set(t, n), e) : void 0
        },
        retrieve: function(e, t, n) {
            if (e = $(e)) {
                var i = Element.getStorage(e),
                    o = i.get(t);
                return Object.isUndefined(o) && (i.set(t, n), o = n), o
            }
        },
        clone: function(e, t) {
            if (e = $(e)) {
                var n = e.cloneNode(t);
                if (n._prototypeUID = void 0, t)
                    for (var i = Element.select(n, "*"), o = i.length; o--;) i[o]._prototypeUID = void 0;
                return Element.extend(n)
            }
        },
        purge: function(e) {
            if (e = $(e)) {
                var t = Element._purgeElement;
                t(e);
                for (var n = e.getElementsByTagName("*"), i = n.length; i--;) t(n[i]);
                return null
            }
        }
    }),
    function() {
        function e(e) {
            var t = e.match(/^(\d+)%?$/i);
            return t ? Number(t[1]) / 100 : null
        }

        function t(t, n, i) {
            var o = null;
            if (Object.isElement(t) && (o = t, t = o.getStyle(n)), null === t) return null;
            if (/^(?:-)?\d+(\.\d+)?(px)?$/i.test(t)) return window.parseFloat(t);
            var s = t.include("%"),
                r = i === document.viewport;
            if (/\d/.test(t) && o && o.runtimeStyle && (!s || !r)) {
                var a = o.style.left,
                    l = o.runtimeStyle.left;
                return o.runtimeStyle.left = o.currentStyle.left, o.style.left = t || 0, t = o.style.pixelLeft, o.style.left = a, o.runtimeStyle.left = l, t
            }
            if (o && s) {
                i = i || o.parentNode;
                var c = e(t),
                    d = null,
                    u = (o.getStyle("position"), n.include("left") || n.include("right") || n.include("width")),
                    h = n.include("top") || n.include("bottom") || n.include("height");
                return i === document.viewport ? u ? d = document.viewport.getWidth() : h && (d = document.viewport.getHeight()) : u ? d = $(i).measure("width") : h && (d = $(i).measure("height")), null === d ? 0 : d * c
            }
            return 0
        }

        function n(e) {
            for (; e && e.parentNode;) {
                var t = e.getStyle("display");
                if ("none" === t) return !1;
                e = $(e.parentNode)
            }
            return !0
        }

        function i(e) {
            return e.include("border") && (e += "-width"), e.camelize()
        }

        function o(e, t) {
            return new Element.Layout(e, t)
        }

        function s(e, t) {
            return $(e).getLayout().get(t)
        }

        function r(e) {
            e = $(e);
            var t = Element.getStyle(e, "display");
            if (t && "none" !== t) return {
                width: e.offsetWidth,
                height: e.offsetHeight
            };
            var n = e.style,
                i = {
                    visibility: n.visibility,
                    position: n.position,
                    display: n.display
                },
                o = {
                    visibility: "hidden",
                    display: "block"
                };
            "fixed" !== i.position && (o.position = "absolute"), Element.setStyle(e, o);
            var s = {
                width: e.offsetWidth,
                height: e.offsetHeight
            };
            return Element.setStyle(e, i), s
        }

        function a(e) {
            if (e = $(e), g(e) || v(e) || m(e) || f(e)) return $(document.body);
            var t = "inline" === Element.getStyle(e, "display");
            if (!t && e.offsetParent) return $(e.offsetParent);
            for (;
                (e = e.parentNode) && e !== document.body;)
                if ("static" !== Element.getStyle(e, "position")) return $(f(e) ? document.body : e);
            return $(document.body)
        }

        function l(e) {
            e = $(e);
            var t = 0,
                n = 0;
            if (e.parentNode)
                do t += e.offsetTop || 0, n += e.offsetLeft || 0, e = e.offsetParent; while (e);
            return new Element.Offset(n, t)
        }

        function c(e) {
            e = $(e);
            var t = e.getLayout(),
                n = 0,
                i = 0;
            do
                if (n += e.offsetTop || 0, i += e.offsetLeft || 0, e = e.offsetParent) {
                    if (m(e)) break;
                    var o = Element.getStyle(e, "position");
                    if ("static" !== o) break
                }
            while (e);
            return i -= t.get("margin-top"), n -= t.get("margin-left"), new Element.Offset(i, n)
        }

        function d(e) {
            var t = 0,
                n = 0;
            do t += e.scrollTop || 0, n += e.scrollLeft || 0, e = e.parentNode; while (e);
            return new Element.Offset(n, t)
        }

        function u(e) {
            o = $(o);
            var t = 0,
                n = 0,
                i = document.body,
                o = e;
            do
                if (t += o.offsetTop || 0, n += o.offsetLeft || 0, o.offsetParent == i && "absolute" == Element.getStyle(o, "position")) break; while (o = o.offsetParent);
            o = e;
            do o != i && (t -= o.scrollTop || 0, n -= o.scrollLeft || 0); while (o = o.parentNode);
            return new Element.Offset(n, t)
        }

        function h(e) {
            if (e = $(e), "absolute" === Element.getStyle(e, "position")) return e;
            var t = a(e),
                n = e.viewportOffset(),
                i = t.viewportOffset(),
                o = n.relativeTo(i),
                s = e.getLayout();
            return e.store("prototype_absolutize_original_styles", {
                left: e.getStyle("left"),
                top: e.getStyle("top"),
                width: e.getStyle("width"),
                height: e.getStyle("height")
            }), e.setStyle({
                position: "absolute",
                top: o.top + "px",
                left: o.left + "px",
                width: s.get("width") + "px",
                height: s.get("height") + "px"
            }), e
        }

        function p(e) {
            if (e = $(e), "relative" === Element.getStyle(e, "position")) return e;
            var t = e.retrieve("prototype_absolutize_original_styles");
            return t && e.setStyle(t), e
        }

        function m(e) {
            return "BODY" === e.nodeName.toUpperCase()
        }

        function f(e) {
            return "HTML" === e.nodeName.toUpperCase()
        }

        function g(e) {
            return e.nodeType === Node.DOCUMENT_NODE
        }

        function v(e) {
            return e !== document.body && !Element.descendantOf(e, document.body)
        }
        var b = Prototype.K;
        "currentStyle" in document.documentElement && (b = function(e) {
            return e.currentStyle.hasLayout || (e.style.zoom = 1), e
        }), Element.Layout = Class.create(Hash, {
            initialize: function($super, e, t) {
                $super(), this.element = $(e), Element.Layout.PROPERTIES.each(function(e) {
                    this._set(e, null)
                }, this), t && (this._preComputing = !0, this._begin(), Element.Layout.PROPERTIES.each(this._compute, this), this._end(), this._preComputing = !1)
            },
            _set: function(e, t) {
                return Hash.prototype.set.call(this, e, t)
            },
            set: function() {
                throw "Properties of Element.Layout are read-only."
            },
            get: function($super, e) {
                var t = $super(e);
                return null === t ? this._compute(e) : t
            },
            _begin: function() {
                if (!this._prepared) {
                    var e = this.element;
                    if (n(e)) return void(this._prepared = !0);
                    var i = {
                        position: e.style.position || "",
                        width: e.style.width || "",
                        visibility: e.style.visibility || "",
                        display: e.style.display || ""
                    };
                    e.store("prototype_original_styles", i);
                    var o = e.getStyle("position"),
                        s = e.getStyle("width");
                    ("0px" === s || null === s) && (e.style.display = "block", s = e.getStyle("width"));
                    var r = "fixed" === o ? document.viewport : e.parentNode;
                    e.setStyle({
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    });
                    var a, l = e.getStyle("width");
                    if (s && l === s) a = t(e, "width", r);
                    else if ("absolute" === o || "fixed" === o) a = t(e, "width", r);
                    else {
                        var c = e.parentNode,
                            d = $(c).getLayout();
                        a = d.get("width") - this.get("margin-left") - this.get("border-left") - this.get("padding-left") - this.get("padding-right") - this.get("border-right") - this.get("margin-right")
                    }
                    e.setStyle({
                        width: a + "px"
                    }), this._prepared = !0
                }
            },
            _end: function() {
                var e = this.element,
                    t = e.retrieve("prototype_original_styles");
                e.store("prototype_original_styles", null), e.setStyle(t), this._prepared = !1
            },
            _compute: function(e) {
                var t = Element.Layout.COMPUTATIONS;
                if (!(e in t)) throw "Property not found.";
                return this._set(e, t[e].call(this, this.element))
            },
            toObject: function() {
                var e = $A(arguments),
                    t = 0 === e.length ? Element.Layout.PROPERTIES : e.join(" ").split(" "),
                    n = {};
                return t.each(function(e) {
                    if (Element.Layout.PROPERTIES.include(e)) {
                        var t = this.get(e);
                        null != t && (n[e] = t)
                    }
                }, this), n
            },
            toHash: function() {
                var e = this.toObject.apply(this, arguments);
                return new Hash(e)
            },
            toCSS: function() {
                var e = $A(arguments),
                    t = 0 === e.length ? Element.Layout.PROPERTIES : e.join(" ").split(" "),
                    n = {};
                return t.each(function(e) {
                    if (Element.Layout.PROPERTIES.include(e) && !Element.Layout.COMPOSITE_PROPERTIES.include(e)) {
                        var t = this.get(e);
                        null != t && (n[i(e)] = t + "px")
                    }
                }, this), n
            },
            inspect: function() {
                return "#<Element.Layout>"
            }
        }), Object.extend(Element.Layout, {
            PROPERTIES: $w("height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height"),
            COMPOSITE_PROPERTIES: $w("padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height"),
            COMPUTATIONS: {
                height: function() {
                    this._preComputing || this._begin();
                    var e = this.get("border-box-height");
                    if (0 >= e) return this._preComputing || this._end(), 0;
                    var t = this.get("border-top"),
                        n = this.get("border-bottom"),
                        i = this.get("padding-top"),
                        o = this.get("padding-bottom");
                    return this._preComputing || this._end(), e - t - n - i - o
                },
                width: function() {
                    this._preComputing || this._begin();
                    var e = this.get("border-box-width");
                    if (0 >= e) return this._preComputing || this._end(), 0;
                    var t = this.get("border-left"),
                        n = this.get("border-right"),
                        i = this.get("padding-left"),
                        o = this.get("padding-right");
                    return this._preComputing || this._end(), e - t - n - i - o
                },
                "padding-box-height": function() {
                    var e = this.get("height"),
                        t = this.get("padding-top"),
                        n = this.get("padding-bottom");
                    return e + t + n
                },
                "padding-box-width": function() {
                    var e = this.get("width"),
                        t = this.get("padding-left"),
                        n = this.get("padding-right");
                    return e + t + n
                },
                "border-box-height": function(e) {
                    this._preComputing || this._begin();
                    var t = e.offsetHeight;
                    return this._preComputing || this._end(), t
                },
                "border-box-width": function(e) {
                    this._preComputing || this._begin();
                    var t = e.offsetWidth;
                    return this._preComputing || this._end(), t
                },
                "margin-box-height": function() {
                    var e = this.get("border-box-height"),
                        t = this.get("margin-top"),
                        n = this.get("margin-bottom");
                    return 0 >= e ? 0 : e + t + n
                },
                "margin-box-width": function() {
                    var e = this.get("border-box-width"),
                        t = this.get("margin-left"),
                        n = this.get("margin-right");
                    return 0 >= e ? 0 : e + t + n
                },
                top: function(e) {
                    var t = e.positionedOffset();
                    return t.top
                },
                bottom: function(e) {
                    var t = e.positionedOffset(),
                        n = e.getOffsetParent(),
                        i = n.measure("height"),
                        o = this.get("border-box-height");
                    return i - o - t.top
                },
                left: function(e) {
                    var t = e.positionedOffset();
                    return t.left
                },
                right: function(e) {
                    var t = e.positionedOffset(),
                        n = e.getOffsetParent(),
                        i = n.measure("width"),
                        o = this.get("border-box-width");
                    return i - o - t.left
                },
                "padding-top": function(e) {
                    return t(e, "paddingTop")
                },
                "padding-bottom": function(e) {
                    return t(e, "paddingBottom")
                },
                "padding-left": function(e) {
                    return t(e, "paddingLeft")
                },
                "padding-right": function(e) {
                    return t(e, "paddingRight")
                },
                "border-top": function(e) {
                    return t(e, "borderTopWidth")
                },
                "border-bottom": function(e) {
                    return t(e, "borderBottomWidth")
                },
                "border-left": function(e) {
                    return t(e, "borderLeftWidth")
                },
                "border-right": function(e) {
                    return t(e, "borderRightWidth")
                },
                "margin-top": function(e) {
                    return t(e, "marginTop")
                },
                "margin-bottom": function(e) {
                    return t(e, "marginBottom")
                },
                "margin-left": function(e) {
                    return t(e, "marginLeft")
                },
                "margin-right": function(e) {
                    return t(e, "marginRight")
                }
            }
        }), "getBoundingClientRect" in document.documentElement && Object.extend(Element.Layout.COMPUTATIONS, {
            right: function(e) {
                var t = b(e.getOffsetParent()),
                    n = e.getBoundingClientRect(),
                    i = t.getBoundingClientRect();
                return (i.right - n.right).round()
            },
            bottom: function(e) {
                var t = b(e.getOffsetParent()),
                    n = e.getBoundingClientRect(),
                    i = t.getBoundingClientRect();
                return (i.bottom - n.bottom).round()
            }
        }), Element.Offset = Class.create({
            initialize: function(e, t) {
                this.left = e.round(), this.top = t.round(), this[0] = this.left, this[1] = this.top
            },
            relativeTo: function(e) {
                return new Element.Offset(this.left - e.left, this.top - e.top)
            },
            inspect: function() {
                return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this)
            },
            toString: function() {
                return "[#{left}, #{top}]".interpolate(this)
            },
            toArray: function() {
                return [this.left, this.top]
            }
        }), Prototype.Browser.IE ? (a = a.wrap(function(e, t) {
            if (t = $(t), g(t) || v(t) || m(t) || f(t)) return $(document.body);
            var n = t.getStyle("position");
            if ("static" !== n) return e(t);
            t.setStyle({
                position: "relative"
            });
            var i = e(t);
            return t.setStyle({
                position: n
            }), i
        }), c = c.wrap(function(e, t) {
            if (t = $(t), !t.parentNode) return new Element.Offset(0, 0);
            var n = t.getStyle("position");
            if ("static" !== n) return e(t);
            var i = t.getOffsetParent();
            i && "fixed" === i.getStyle("position") && b(i), t.setStyle({
                position: "relative"
            });
            var o = e(t);
            return t.setStyle({
                position: n
            }), o
        })) : Prototype.Browser.Webkit && (l = function(e) {
            e = $(e);
            var t = 0,
                n = 0;
            do {
                if (t += e.offsetTop || 0, n += e.offsetLeft || 0, e.offsetParent == document.body && "absolute" == Element.getStyle(e, "position")) break;
                e = e.offsetParent
            } while (e);
            return new Element.Offset(n, t)
        }), Element.addMethods({
            getLayout: o,
            measure: s,
            getDimensions: r,
            getOffsetParent: a,
            cumulativeOffset: l,
            positionedOffset: c,
            cumulativeScrollOffset: d,
            viewportOffset: u,
            absolutize: h,
            relativize: p
        }), "getBoundingClientRect" in document.documentElement && Element.addMethods({
            viewportOffset: function(e) {
                if (e = $(e), v(e)) return new Element.Offset(0, 0);
                var t = e.getBoundingClientRect(),
                    n = document.documentElement;
                return new Element.Offset(t.left - n.clientLeft, t.top - n.clientTop)
            }
        })
    }(), window.$$ = function() {
        var e = $A(arguments).join(", ");
        return Prototype.Selector.select(e, document)
    }, Prototype.Selector = function() {
        function e() {
            throw new Error('Method "Prototype.Selector.select" must be defined.')
        }

        function t() {
            throw new Error('Method "Prototype.Selector.match" must be defined.')
        }

        function n(e, t, n) {
            n = n || 0;
            var i, o = Prototype.Selector.match,
                s = e.length,
                r = 0;
            for (i = 0; s > i; i++)
                if (o(e[i], t) && n == r++) return Element.extend(e[i])
        }

        function i(e) {
            for (var t = 0, n = e.length; n > t; t++) Element.extend(e[t]);
            return e
        }
        var o = Prototype.K;
        return {
            select: e,
            match: t,
            find: n,
            extendElements: Element.extend === o ? o : i,
            extendElement: Element.extend
        }
    }(),
    function() {
        function e(e, t, n, i, o, s) {
            for (var r = "previousSibling" == e && !s, a = 0, l = i.length; l > a; a++) {
                var c = i[a];
                if (c) {
                    r && 1 === c.nodeType && (c.sizcache = n, c.sizset = a), c = c[e];
                    for (var d = !1; c;) {
                        if (c.sizcache === n) {
                            d = i[c.sizset];
                            break
                        }
                        if (1 !== c.nodeType || s || (c.sizcache = n, c.sizset = a), c.nodeName === t) {
                            d = c;
                            break
                        }
                        c = c[e]
                    }
                    i[a] = d
                }
            }
        }

        function t(e, t, n, i, o, s) {
            for (var r = "previousSibling" == e && !s, l = 0, c = i.length; c > l; l++) {
                var d = i[l];
                if (d) {
                    r && 1 === d.nodeType && (d.sizcache = n, d.sizset = l), d = d[e];
                    for (var u = !1; d;) {
                        if (d.sizcache === n) {
                            u = i[d.sizset];
                            break
                        }
                        if (1 === d.nodeType)
                            if (s || (d.sizcache = n, d.sizset = l), "string" != typeof t) {
                                if (d === t) {
                                    u = !0;
                                    break
                                }
                            } else if (a.filter(t, [d]).length > 0) {
                            u = d;
                            break
                        }
                        d = d[e]
                    }
                    i[l] = u
                }
            }
        }
        var n = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
            i = 0,
            o = Object.prototype.toString,
            s = !1,
            r = !0;
        [0, 0].sort(function() {
            return r = !1, 0
        });
        var a = function(e, t, i, s) {
            i = i || [];
            var r = t = t || document;
            if (1 !== t.nodeType && 9 !== t.nodeType) return [];
            if (!e || "string" != typeof e) return i;
            for (var d, h, p, v, b = [], y = !0, E = f(t), w = e; null !== (n.exec(""), d = n.exec(w));)
                if (w = d[3], b.push(d[1]), d[2]) {
                    v = d[3];
                    break
                }
            if (b.length > 1 && c.exec(e))
                if (2 === b.length && l.relative[b[0]]) h = g(b[0] + b[1], t);
                else
                    for (h = l.relative[b[0]] ? [t] : a(b.shift(), t); b.length;) e = b.shift(), l.relative[e] && (e += b.shift()), h = g(e, h);
            else {
                if (!s && b.length > 1 && 9 === t.nodeType && !E && l.match.ID.test(b[0]) && !l.match.ID.test(b[b.length - 1])) {
                    var x = a.find(b.shift(), t, E);
                    t = x.expr ? a.filter(x.expr, x.set)[0] : x.set[0]
                }
                if (t) {
                    var x = s ? {
                        expr: b.pop(),
                        set: u(s)
                    } : a.find(b.pop(), 1 !== b.length || "~" !== b[0] && "+" !== b[0] || !t.parentNode ? t : t.parentNode, E);
                    for (h = x.expr ? a.filter(x.expr, x.set) : x.set, b.length > 0 ? p = u(h) : y = !1; b.length;) {
                        var S = b.pop(),
                            C = S;
                        l.relative[S] ? C = b.pop() : S = "", null == C && (C = t), l.relative[S](p, C, E)
                    }
                } else p = b = []
            }
            if (p || (p = h), !p) throw "Syntax error, unrecognized expression: " + (S || e);
            if ("[object Array]" === o.call(p))
                if (y)
                    if (t && 1 === t.nodeType)
                        for (var _ = 0; null != p[_]; _++) p[_] && (p[_] === !0 || 1 === p[_].nodeType && m(t, p[_])) && i.push(h[_]);
                    else
                        for (var _ = 0; null != p[_]; _++) p[_] && 1 === p[_].nodeType && i.push(h[_]);
            else i.push.apply(i, p);
            else u(p, i);
            return v && (a(v, r, i, s), a.uniqueSort(i)), i
        };
        a.uniqueSort = function(e) {
            if (p && (s = r, e.sort(p), s))
                for (var t = 1; t < e.length; t++) e[t] === e[t - 1] && e.splice(t--, 1);
            return e
        }, a.matches = function(e, t) {
            return a(e, null, null, t)
        }, a.find = function(e, t, n) {
            var i, o;
            if (!e) return [];
            for (var s = 0, r = l.order.length; r > s; s++) {
                var o, a = l.order[s];
                if (o = l.leftMatch[a].exec(e)) {
                    var c = o[1];
                    if (o.splice(1, 1), "\\" !== c.substr(c.length - 1) && (o[1] = (o[1] || "").replace(/\\/g, ""), i = l.find[a](o, t, n), null != i)) {
                        e = e.replace(l.match[a], "");
                        break
                    }
                }
            }
            return i || (i = t.getElementsByTagName("*")), {
                set: i,
                expr: e
            }
        }, a.filter = function(e, t, n, i) {
            for (var o, s, r = e, a = [], c = t, d = t && t[0] && f(t[0]); e && t.length;) {
                for (var u in l.filter)
                    if (null != (o = l.match[u].exec(e))) {
                        var h, p, m = l.filter[u];
                        if (s = !1, c == a && (a = []), l.preFilter[u])
                            if (o = l.preFilter[u](o, c, n, a, i, d)) {
                                if (o === !0) continue
                            } else s = h = !0;
                        if (o)
                            for (var g = 0; null != (p = c[g]); g++)
                                if (p) {
                                    h = m(p, o, g, c);
                                    var v = i ^ !!h;
                                    n && null != h ? v ? s = !0 : c[g] = !1 : v && (a.push(p), s = !0)
                                }
                        if (void 0 !== h) {
                            if (n || (c = a), e = e.replace(l.match[u], ""), !s) return [];
                            break
                        }
                    }
                if (e == r) {
                    if (null == s) throw "Syntax error, unrecognized expression: " + e;
                    break
                }
                r = e
            }
            return c
        };
        var l = a.selectors = {
                order: ["ID", "NAME", "TAG"],
                match: {
                    ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
                    CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
                    NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
                    ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                    TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
                    CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
                    POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
                    PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
                },
                leftMatch: {},
                attrMap: {
                    "class": "className",
                    "for": "htmlFor"
                },
                attrHandle: {
                    href: function(e) {
                        return e.getAttribute("href")
                    }
                },
                relative: {
                    "+": function(e, t, n) {
                        var i = "string" == typeof t,
                            o = i && !/\W/.test(t),
                            s = i && !o;
                        o && !n && (t = t.toUpperCase());
                        for (var r, l = 0, c = e.length; c > l; l++)
                            if (r = e[l]) {
                                for (;
                                    (r = r.previousSibling) && 1 !== r.nodeType;);
                                e[l] = s || r && r.nodeName === t ? r || !1 : r === t
                            }
                        s && a.filter(t, e, !0)
                    },
                    ">": function(e, t, n) {
                        var i = "string" == typeof t;
                        if (i && !/\W/.test(t)) {
                            t = n ? t : t.toUpperCase();
                            for (var o = 0, s = e.length; s > o; o++) {
                                var r = e[o];
                                if (r) {
                                    var l = r.parentNode;
                                    e[o] = l.nodeName === t ? l : !1
                                }
                            }
                        } else {
                            for (var o = 0, s = e.length; s > o; o++) {
                                var r = e[o];
                                r && (e[o] = i ? r.parentNode : r.parentNode === t)
                            }
                            i && a.filter(t, e, !0)
                        }
                    },
                    "": function(n, o, s) {
                        var r = i++,
                            a = t;
                        if (!/\W/.test(o)) {
                            var l = o = s ? o : o.toUpperCase();
                            a = e
                        }
                        a("parentNode", o, r, n, l, s)
                    },
                    "~": function(n, o, s) {
                        var r = i++,
                            a = t;
                        if ("string" == typeof o && !/\W/.test(o)) {
                            var l = o = s ? o : o.toUpperCase();
                            a = e
                        }
                        a("previousSibling", o, r, n, l, s)
                    }
                },
                find: {
                    ID: function(e, t, n) {
                        if ("undefined" != typeof t.getElementById && !n) {
                            var i = t.getElementById(e[1]);
                            return i ? [i] : []
                        }
                    },
                    NAME: function(e, t) {
                        if ("undefined" != typeof t.getElementsByName) {
                            for (var n = [], i = t.getElementsByName(e[1]), o = 0, s = i.length; s > o; o++) i[o].getAttribute("name") === e[1] && n.push(i[o]);
                            return 0 === n.length ? null : n
                        }
                    },
                    TAG: function(e, t) {
                        return t.getElementsByTagName(e[1])
                    }
                },
                preFilter: {
                    CLASS: function(e, t, n, i, o, s) {
                        if (e = " " + e[1].replace(/\\/g, "") + " ", s) return e;
                        for (var r, a = 0; null != (r = t[a]); a++) r && (o ^ (r.className && (" " + r.className + " ").indexOf(e) >= 0) ? n || i.push(r) : n && (t[a] = !1));
                        return !1
                    },
                    ID: function(e) {
                        return e[1].replace(/\\/g, "")
                    },
                    TAG: function(e, t) {
                        for (var n = 0; t[n] === !1; n++);
                        return t[n] && f(t[n]) ? e[1] : e[1].toUpperCase()
                    },
                    CHILD: function(e) {
                        if ("nth" == e[1]) {
                            var t = /(-?)(\d*)n((?:\+|-)?\d*)/.exec("even" == e[2] && "2n" || "odd" == e[2] && "2n+1" || !/\D/.test(e[2]) && "0n+" + e[2] || e[2]);
                            e[2] = t[1] + (t[2] || 1) - 0, e[3] = t[3] - 0
                        }
                        return e[0] = i++, e
                    },
                    ATTR: function(e, t, n, i, o, s) {
                        var r = e[1].replace(/\\/g, "");
                        return !s && l.attrMap[r] && (e[1] = l.attrMap[r]), "~=" === e[2] && (e[4] = " " + e[4] + " "), e
                    },
                    PSEUDO: function(e, t, i, o, s) {
                        if ("not" === e[1]) {
                            if (!((n.exec(e[3]) || "").length > 1 || /^\w/.test(e[3]))) {
                                var r = a.filter(e[3], t, i, !0 ^ s);
                                return i || o.push.apply(o, r), !1
                            }
                            e[3] = a(e[3], null, null, t)
                        } else if (l.match.POS.test(e[0]) || l.match.CHILD.test(e[0])) return !0;
                        return e
                    },
                    POS: function(e) {
                        return e.unshift(!0), e
                    }
                },
                filters: {
                    enabled: function(e) {
                        return e.disabled === !1 && "hidden" !== e.type
                    },
                    disabled: function(e) {
                        return e.disabled === !0
                    },
                    checked: function(e) {
                        return e.checked === !0
                    },
                    selected: function(e) {
                        return e.parentNode.selectedIndex, e.selected === !0
                    },
                    parent: function(e) {
                        return !!e.firstChild
                    },
                    empty: function(e) {
                        return !e.firstChild
                    },
                    has: function(e, t, n) {
                        return !!a(n[3], e).length
                    },
                    header: function(e) {
                        return /h\d/i.test(e.nodeName)
                    },
                    text: function(e) {
                        return "text" === e.type
                    },
                    radio: function(e) {
                        return "radio" === e.type
                    },
                    checkbox: function(e) {
                        return "checkbox" === e.type
                    },
                    file: function(e) {
                        return "file" === e.type
                    },
                    password: function(e) {
                        return "password" === e.type
                    },
                    submit: function(e) {
                        return "submit" === e.type
                    },
                    image: function(e) {
                        return "image" === e.type
                    },
                    reset: function(e) {
                        return "reset" === e.type
                    },
                    button: function(e) {
                        return "button" === e.type || "BUTTON" === e.nodeName.toUpperCase()
                    },
                    input: function(e) {
                        return /input|select|textarea|button/i.test(e.nodeName)
                    }
                },
                setFilters: {
                    first: function(e, t) {
                        return 0 === t
                    },
                    last: function(e, t, n, i) {
                        return t === i.length - 1
                    },
                    even: function(e, t) {
                        return t % 2 === 0
                    },
                    odd: function(e, t) {
                        return t % 2 === 1
                    },
                    lt: function(e, t, n) {
                        return t < n[3] - 0
                    },
                    gt: function(e, t, n) {
                        return t > n[3] - 0
                    },
                    nth: function(e, t, n) {
                        return n[3] - 0 == t
                    },
                    eq: function(e, t, n) {
                        return n[3] - 0 == t
                    }
                },
                filter: {
                    PSEUDO: function(e, t, n, i) {
                        var o = t[1],
                            s = l.filters[o];
                        if (s) return s(e, n, t, i);
                        if ("contains" === o) return (e.textContent || e.innerText || "").indexOf(t[3]) >= 0;
                        if ("not" === o) {
                            for (var r = t[3], n = 0, a = r.length; a > n; n++)
                                if (r[n] === e) return !1;
                            return !0
                        }
                    },
                    CHILD: function(e, t) {
                        var n = t[1],
                            i = e;
                        switch (n) {
                            case "only":
                            case "first":
                                for (; i = i.previousSibling;)
                                    if (1 === i.nodeType) return !1;
                                if ("first" == n) return !0;
                                i = e;
                            case "last":
                                for (; i = i.nextSibling;)
                                    if (1 === i.nodeType) return !1;
                                return !0;
                            case "nth":
                                var o = t[2],
                                    s = t[3];
                                if (1 == o && 0 == s) return !0;
                                var r = t[0],
                                    a = e.parentNode;
                                if (a && (a.sizcache !== r || !e.nodeIndex)) {
                                    var l = 0;
                                    for (i = a.firstChild; i; i = i.nextSibling) 1 === i.nodeType && (i.nodeIndex = ++l);
                                    a.sizcache = r
                                }
                                var c = e.nodeIndex - s;
                                return 0 == o ? 0 == c : c % o == 0 && c / o >= 0
                        }
                    },
                    ID: function(e, t) {
                        return 1 === e.nodeType && e.getAttribute("id") === t
                    },
                    TAG: function(e, t) {
                        return "*" === t && 1 === e.nodeType || e.nodeName === t
                    },
                    CLASS: function(e, t) {
                        return (" " + (e.className || e.getAttribute("class")) + " ").indexOf(t) > -1
                    },
                    ATTR: function(e, t) {
                        var n = t[1],
                            i = l.attrHandle[n] ? l.attrHandle[n](e) : null != e[n] ? e[n] : e.getAttribute(n),
                            o = i + "",
                            s = t[2],
                            r = t[4];
                        return null == i ? "!=" === s : "=" === s ? o === r : "*=" === s ? o.indexOf(r) >= 0 : "~=" === s ? (" " + o + " ").indexOf(r) >= 0 : r ? "!=" === s ? o != r : "^=" === s ? 0 === o.indexOf(r) : "$=" === s ? o.substr(o.length - r.length) === r : "|=" === s ? o === r || o.substr(0, r.length + 1) === r + "-" : !1 : o && i !== !1
                    },
                    POS: function(e, t, n, i) {
                        var o = t[2],
                            s = l.setFilters[o];
                        return s ? s(e, n, t, i) : void 0
                    }
                }
            },
            c = l.match.POS;
        for (var d in l.match) l.match[d] = new RegExp(l.match[d].source + /(?![^\[]*\])(?![^\(]*\))/.source), l.leftMatch[d] = new RegExp(/(^(?:.|\r|\n)*?)/.source + l.match[d].source);
        var u = function(e, t) {
            return e = Array.prototype.slice.call(e, 0), t ? (t.push.apply(t, e), t) : e
        };
        try {
            Array.prototype.slice.call(document.documentElement.childNodes, 0)
        } catch (h) {
            u = function(e, t) {
                var n = t || [];
                if ("[object Array]" === o.call(e)) Array.prototype.push.apply(n, e);
                else if ("number" == typeof e.length)
                    for (var i = 0, s = e.length; s > i; i++) n.push(e[i]);
                else
                    for (var i = 0; e[i]; i++) n.push(e[i]);
                return n
            }
        }
        var p;
        document.documentElement.compareDocumentPosition ? p = function(e, t) {
                if (!e.compareDocumentPosition || !t.compareDocumentPosition) return e == t && (s = !0), 0;
                var n = 4 & e.compareDocumentPosition(t) ? -1 : e === t ? 0 : 1;
                return 0 === n && (s = !0), n
            } : "sourceIndex" in document.documentElement ? p = function(e, t) {
                if (!e.sourceIndex || !t.sourceIndex) return e == t && (s = !0), 0;
                var n = e.sourceIndex - t.sourceIndex;
                return 0 === n && (s = !0), n
            } : document.createRange && (p = function(e, t) {
                if (!e.ownerDocument || !t.ownerDocument) return e == t && (s = !0), 0;
                var n = e.ownerDocument.createRange(),
                    i = t.ownerDocument.createRange();
                n.setStart(e, 0), n.setEnd(e, 0), i.setStart(t, 0), i.setEnd(t, 0);
                var o = n.compareBoundaryPoints(Range.START_TO_END, i);
                return 0 === o && (s = !0), o
            }),
            function() {
                var e = document.createElement("div"),
                    t = "script" + (new Date).getTime();
                e.innerHTML = "<a name='" + t + "'/>";
                var n = document.documentElement;
                n.insertBefore(e, n.firstChild), document.getElementById(t) && (l.find.ID = function(e, t, n) {
                    if ("undefined" != typeof t.getElementById && !n) {
                        var i = t.getElementById(e[1]);
                        return i ? i.id === e[1] || "undefined" != typeof i.getAttributeNode && i.getAttributeNode("id").nodeValue === e[1] ? [i] : void 0 : []
                    }
                }, l.filter.ID = function(e, t) {
                    var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return 1 === e.nodeType && n && n.nodeValue === t
                }), n.removeChild(e), n = e = null
            }(),
            function() {
                var e = document.createElement("div");
                e.appendChild(document.createComment("")), e.getElementsByTagName("*").length > 0 && (l.find.TAG = function(e, t) {
                    var n = t.getElementsByTagName(e[1]);
                    if ("*" === e[1]) {
                        for (var i = [], o = 0; n[o]; o++) 1 === n[o].nodeType && i.push(n[o]);
                        n = i
                    }
                    return n
                }), e.innerHTML = "<a href='#'></a>", e.firstChild && "undefined" != typeof e.firstChild.getAttribute && "#" !== e.firstChild.getAttribute("href") && (l.attrHandle.href = function(e) {
                    return e.getAttribute("href", 2)
                }), e = null
            }(), document.querySelectorAll && ! function() {
                var e = a,
                    t = document.createElement("div");
                if (t.innerHTML = "<p class='TEST'></p>", !t.querySelectorAll || 0 !== t.querySelectorAll(".TEST").length) {
                    a = function(t, n, i, o) {
                        if (n = n || document, !o && 9 === n.nodeType && !f(n)) try {
                            return u(n.querySelectorAll(t), i)
                        } catch (s) {}
                        return e(t, n, i, o)
                    };
                    for (var n in e) a[n] = e[n];
                    t = null
                }
            }(), document.getElementsByClassName && document.documentElement.getElementsByClassName && ! function() {
                var e = document.createElement("div");
                e.innerHTML = "<div class='test e'></div><div class='test'></div>", 0 !== e.getElementsByClassName("e").length && (e.lastChild.className = "e", 1 !== e.getElementsByClassName("e").length && (l.order.splice(1, 0, "CLASS"), l.find.CLASS = function(e, t, n) {
                    return "undefined" == typeof t.getElementsByClassName || n ? void 0 : t.getElementsByClassName(e[1])
                }, e = null))
            }();
        var m = document.compareDocumentPosition ? function(e, t) {
                return 16 & e.compareDocumentPosition(t)
            } : function(e, t) {
                return e !== t && (e.contains ? e.contains(t) : !0)
            },
            f = function(e) {
                return 9 === e.nodeType && "HTML" !== e.documentElement.nodeName || !!e.ownerDocument && "HTML" !== e.ownerDocument.documentElement.nodeName
            },
            g = function(e, t) {
                for (var n, i = [], o = "", s = t.nodeType ? [t] : t; n = l.match.PSEUDO.exec(e);) o += n[0], e = e.replace(l.match.PSEUDO, "");
                e = l.relative[e] ? e + "*" : e;
                for (var r = 0, c = s.length; c > r; r++) a(e, s[r], i);
                return a.filter(o, i)
            };
        window.Sizzle = a
    }(), Prototype._original_property = window.Sizzle,
    function(e) {
        function t(t, n) {
            return i(e(t, n || document))
        }

        function n(t, n) {
            return 1 == e.matches(n, [t]).length
        }
        var i = Prototype.Selector.extendElements;
        Prototype.Selector.engine = e, Prototype.Selector.select = t, Prototype.Selector.match = n
    }(Sizzle), window.Sizzle = Prototype._original_property, delete Prototype._original_property;
var Form = {
    reset: function(e) {
        return e = $(e), e.reset(), e
    },
    serializeElements: function(e, t) {
        "object" != typeof t ? t = {
            hash: !!t
        } : Object.isUndefined(t.hash) && (t.hash = !0);
        var n, i, o, s, r = !1,
            a = t.submit;
        return t.hash ? (s = {}, o = function(e, t, n) {
            return t in e ? (Object.isArray(e[t]) || (e[t] = [e[t]]), e[t].push(n)) : e[t] = n, e
        }) : (s = "", o = function(e, t, n) {
            return e + (e ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(n)
        }), e.inject(s, function(e, t) {
            return !t.disabled && t.name && (n = t.name, i = $(t).getValue(), null == i || "file" == t.type || "submit" == t.type && (r || a === !1 || a && n != a || !(r = !0)) || (e = o(e, n, i))), e
        })
    }
};
Form.Methods = {
    serialize: function(e, t) {
        return Form.serializeElements(Form.getElements(e), t)
    },
    getElements: function(e) {
        for (var t, n = $(e).getElementsByTagName("*"), i = [], o = Form.Element.Serializers, s = 0; t = n[s]; s++) i.push(t);
        return i.inject([], function(e, t) {
            return o[t.tagName.toLowerCase()] && e.push(Element.extend(t)), e
        })
    },
    getInputs: function(e, t, n) {
        e = $(e);
        var i = e.getElementsByTagName("input");
        if (!t && !n) return $A(i).map(Element.extend);
        for (var o = 0, s = [], r = i.length; r > o; o++) {
            var a = i[o];
            t && a.type != t || n && a.name != n || s.push(Element.extend(a))
        }
        return s
    },
    disable: function(e) {
        return e = $(e), Form.getElements(e).invoke("disable"), e
    },
    enable: function(e) {
        return e = $(e), Form.getElements(e).invoke("enable"), e
    },
    findFirstElement: function(e) {
        var t = $(e).getElements().findAll(function(e) {
                return "hidden" != e.type && !e.disabled
            }),
            n = t.findAll(function(e) {
                return e.hasAttribute("tabIndex") && e.tabIndex >= 0
            }).sortBy(function(e) {
                return e.tabIndex
            }).first();
        return n ? n : t.find(function(e) {
            return /^(?:input|select|textarea)$/i.test(e.tagName)
        })
    },
    focusFirstElement: function(e) {
        e = $(e);
        var t = e.findFirstElement();
        return t && t.activate(), e
    },
    request: function(e, t) {
        e = $(e), t = Object.clone(t || {});
        var n = t.parameters,
            i = e.readAttribute("action") || "";
        return i.blank() && (i = window.location.href), t.parameters = e.serialize(!0), n && (Object.isString(n) && (n = n.toQueryParams()), Object.extend(t.parameters, n)), e.hasAttribute("method") && !t.method && (t.method = e.method), new Ajax.Request(i, t)
    }
}, Form.Element = {
    focus: function(e) {
        return $(e).focus(), e
    },
    select: function(e) {
        return $(e).select(), e
    }
}, Form.Element.Methods = {
    serialize: function(e) {
        if (e = $(e), !e.disabled && e.name) {
            var t = e.getValue();
            if (void 0 != t) {
                var n = {};
                return n[e.name] = t, Object.toQueryString(n)
            }
        }
        return ""
    },
    getValue: function(e) {
        e = $(e);
        var t = e.tagName.toLowerCase();
        return Form.Element.Serializers[t](e)
    },
    setValue: function(e, t) {
        e = $(e);
        var n = e.tagName.toLowerCase();
        return Form.Element.Serializers[n](e, t), e
    },
    clear: function(e) {
        return $(e).value = "", e
    },
    present: function(e) {
        return "" != $(e).value
    },
    activate: function(e) {
        e = $(e);
        try {
            e.focus(), !e.select || "input" == e.tagName.toLowerCase() && /^(?:button|reset|submit)$/i.test(e.type) || e.select()
        } catch (t) {}
        return e
    },
    disable: function(e) {
        return e = $(e), e.disabled = !0, e
    },
    enable: function(e) {
        return e = $(e), e.disabled = !1, e
    }
};
var Field = Form.Element,
    $F = Form.Element.Methods.getValue;
Form.Element.Serializers = function() {
        function e(e, i) {
            switch (e.type.toLowerCase()) {
                case "checkbox":
                case "radio":
                    return t(e, i);
                default:
                    return n(e, i)
            }
        }

        function t(e, t) {
            return Object.isUndefined(t) ? e.checked ? e.value : null : void(e.checked = !!t)
        }

        function n(e, t) {
            return Object.isUndefined(t) ? e.value : void(e.value = t)
        }

        function i(e, t) {
            if (Object.isUndefined(t)) return ("select-one" === e.type ? o : s)(e);
            for (var n, i, r = !Object.isArray(t), a = 0, l = e.length; l > a; a++)
                if (n = e.options[a], i = this.optionValue(n), r) {
                    if (i == t) return void(n.selected = !0)
                } else n.selected = t.include(i)
        }

        function o(e) {
            var t = e.selectedIndex;
            return t >= 0 ? r(e.options[t]) : null
        }

        function s(e) {
            var t, n = e.length;
            if (!n) return null;
            for (var i = 0, t = []; n > i; i++) {
                var o = e.options[i];
                o.selected && t.push(r(o))
            }
            return t
        }

        function r(e) {
            return Element.hasAttribute(e, "value") ? e.value : e.text
        }
        return {
            input: e,
            inputSelector: t,
            textarea: n,
            select: i,
            selectOne: o,
            selectMany: s,
            optionValue: r,
            button: n
        }
    }(), Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
        initialize: function($super, e, t, n) {
            $super(n, t), this.element = $(e), this.lastValue = this.getValue()
        },
        execute: function() {
            var e = this.getValue();
            (Object.isString(this.lastValue) && Object.isString(e) ? this.lastValue != e : String(this.lastValue) != String(e)) && (this.callback(this.element, e), this.lastValue = e)
        }
    }), Form.Element.Observer = Class.create(Abstract.TimedObserver, {
        getValue: function() {
            return Form.Element.getValue(this.element)
        }
    }), Form.Observer = Class.create(Abstract.TimedObserver, {
        getValue: function() {
            return Form.serialize(this.element)
        }
    }), Abstract.EventObserver = Class.create({
        initialize: function(e, t) {
            this.element = $(e), this.callback = t, this.lastValue = this.getValue(), "form" == this.element.tagName.toLowerCase() ? this.registerFormCallbacks() : this.registerCallback(this.element)
        },
        onElementEvent: function() {
            var e = this.getValue();
            this.lastValue != e && (this.callback(this.element, e), this.lastValue = e)
        },
        registerFormCallbacks: function() {
            Form.getElements(this.element).each(this.registerCallback, this)
        },
        registerCallback: function(e) {
            if (e.type) switch (e.type.toLowerCase()) {
                case "checkbox":
                case "radio":
                    Event.observe(e, "click", this.onElementEvent.bind(this));
                    break;
                default:
                    Event.observe(e, "change", this.onElementEvent.bind(this))
            }
        }
    }), Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
        getValue: function() {
            return Form.Element.getValue(this.element)
        }
    }), Form.EventObserver = Class.create(Abstract.EventObserver, {
        getValue: function() {
            return Form.serialize(this.element)
        }
    }),
    function() {
        function e(e, t) {
            return e.which ? e.which === t + 1 : e.button === t
        }

        function t(e, t) {
            return e.button === C[t]
        }

        function n(e, t) {
            switch (t) {
                case 0:
                    return 1 == e.which && !e.metaKey;
                case 1:
                    return 2 == e.which || 1 == e.which && e.metaKey;
                case 2:
                    return 3 == e.which;
                default:
                    return !1
            }
        }

        function i(e) {
            return S(e, 0)
        }

        function o(e) {
            return S(e, 1)
        }

        function s(e) {
            return S(e, 2)
        }

        function r(e) {
            e = y.extend(e);
            var t = e.target,
                n = e.type,
                i = e.currentTarget;
            return i && i.tagName && ("load" === n || "error" === n || "click" === n && "input" === i.tagName.toLowerCase() && "radio" === i.type) && (t = i), t.nodeType == Node.TEXT_NODE && (t = t.parentNode), Element.extend(t)
        }

        function a(e, t) {
            var n = y.element(e);
            if (!t) return n;
            for (; n;) {
                if (Object.isElement(n) && Prototype.Selector.match(n, t)) return Element.extend(n);
                n = n.parentNode
            }
        }

        function l(e) {
            return {
                x: c(e),
                y: d(e)
            }
        }

        function c(e) {
            var t = document.documentElement,
                n = document.body || {
                    scrollLeft: 0
                };
            return e.pageX || e.clientX + (t.scrollLeft || n.scrollLeft) - (t.clientLeft || 0)
        }

        function d(e) {
            var t = document.documentElement,
                n = document.body || {
                    scrollTop: 0
                };
            return e.pageY || e.clientY + (t.scrollTop || n.scrollTop) - (t.clientTop || 0)
        }

        function u(e) {
            y.extend(e), e.preventDefault(), e.stopPropagation(), e.stopped = !0
        }

        function h(e) {
            var t;
            switch (e.type) {
                case "mouseover":
                case "mouseenter":
                    t = e.fromElement;
                    break;
                case "mouseout":
                case "mouseleave":
                    t = e.toElement;
                    break;
                default:
                    return null
            }
            return Element.extend(t)
        }

        function p(e, t, n) {
            var i = Element.retrieve(e, "prototype_event_registry");
            Object.isUndefined(i) && (O.push(e), i = Element.retrieve(e, "prototype_event_registry", $H()));
            var o = i.get(t);
            if (Object.isUndefined(o) && (o = [], i.set(t, o)), o.pluck("handler").include(n)) return !1;
            var s;
            return t.include(":") ? s = function(i) {
                return Object.isUndefined(i.eventName) ? !1 : i.eventName !== t ? !1 : (y.extend(i, e), void n.call(e, i))
            } : w || "mouseenter" !== t && "mouseleave" !== t ? s = function(t) {
                y.extend(t, e), n.call(e, t)
            } : ("mouseenter" === t || "mouseleave" === t) && (s = function(t) {
                y.extend(t, e);
                for (var i = t.relatedTarget; i && i !== e;) try {
                    i = i.parentNode
                } catch (o) {
                    i = e
                }
                i !== e && n.call(e, t)
            }), s.handler = n, o.push(s), s
        }

        function m() {
            for (var e = 0, t = O.length; t > e; e++) y.stopObserving(O[e]), O[e] = null
        }

        function f(e, t, n) {
            e = $(e);
            var i = p(e, t, n);
            if (!i) return e;
            if (t.include(":")) e.addEventListener ? e.addEventListener("dataavailable", i, !1) : (e.attachEvent("ondataavailable", i), e.attachEvent("onlosecapture", i));
            else {
                var o = k(t);
                e.addEventListener ? e.addEventListener(o, i, !1) : e.attachEvent("on" + o, i)
            }
            return e
        }

        function g(e, t, n) {
            e = $(e);
            var i = Element.retrieve(e, "prototype_event_registry");
            if (!i) return e;
            if (!t) return i.each(function(t) {
                var n = t.key;
                g(e, n)
            }), e;
            var o = i.get(t);
            if (!o) return e;
            if (!n) return o.each(function(n) {
                g(e, t, n.handler)
            }), e;
            for (var s, r = o.length; r--;)
                if (o[r].handler === n) {
                    s = o[r];
                    break
                }
            if (!s) return e;
            if (t.include(":")) e.removeEventListener ? e.removeEventListener("dataavailable", s, !1) : (e.detachEvent("ondataavailable", s), e.detachEvent("onlosecapture", s));
            else {
                var a = k(t);
                e.removeEventListener ? e.removeEventListener(a, s, !1) : e.detachEvent("on" + a, s)
            }
            return i.set(t, o.without(s)), e
        }

        function v(e, t, n, i) {
            e = $(e), Object.isUndefined(i) && (i = !0), e == document && document.createEvent && !e.dispatchEvent && (e = document.documentElement);
            var o;
            return document.createEvent ? (o = document.createEvent("HTMLEvents"), o.initEvent("dataavailable", i, !0)) : (o = document.createEventObject(), o.eventType = i ? "ondataavailable" : "onlosecapture"), o.eventName = t, o.memo = n || {}, document.createEvent ? e.dispatchEvent(o) : e.fireEvent(o.eventType, o), y.extend(o)
        }

        function b(e, t, n, i) {
            return e = $(e), Object.isFunction(n) && Object.isUndefined(i) && (i = n, n = null), new y.Handler(e, t, n, i).start()
        }
        var y = {
                KEY_BACKSPACE: 8,
                KEY_TAB: 9,
                KEY_RETURN: 13,
                KEY_ESC: 27,
                KEY_LEFT: 37,
                KEY_UP: 38,
                KEY_RIGHT: 39,
                KEY_DOWN: 40,
                KEY_DELETE: 46,
                KEY_HOME: 36,
                KEY_END: 35,
                KEY_PAGEUP: 33,
                KEY_PAGEDOWN: 34,
                KEY_INSERT: 45,
                cache: {}
            },
            E = document.documentElement,
            w = "onmouseenter" in E && "onmouseleave" in E,
            x = function() {
                return !1
            };
        window.attachEvent && (x = window.addEventListener ? function(e) {
            return !(e instanceof window.Event)
        } : function() {
            return !0
        });
        var S, C = {
            0: 1,
            1: 4,
            2: 2
        };
        S = window.attachEvent ? window.addEventListener ? function(n, i) {
            return x(n) ? t(n, i) : e(n, i)
        } : t : Prototype.Browser.WebKit ? n : e, y.Methods = {
            isLeftClick: i,
            isMiddleClick: o,
            isRightClick: s,
            element: r,
            findElement: a,
            pointer: l,
            pointerX: c,
            pointerY: d,
            stop: u
        };
        var _ = Object.keys(y.Methods).inject({}, function(e, t) {
            return e[t] = y.Methods[t].methodize(), e
        });
        if (window.attachEvent) {
            var T = {
                stopPropagation: function() {
                    this.cancelBubble = !0
                },
                preventDefault: function() {
                    this.returnValue = !1
                },
                inspect: function() {
                    return "[object Event]"
                }
            };
            y.extend = function(e, t) {
                if (!e) return !1;
                if (!x(e)) return e;
                if (e._extendedByPrototype) return e;
                e._extendedByPrototype = Prototype.emptyFunction;
                var n = y.pointer(e);
                return Object.extend(e, {
                    target: e.srcElement || t,
                    relatedTarget: h(e),
                    pageX: n.x,
                    pageY: n.y
                }), Object.extend(e, _), Object.extend(e, T), e
            }
        } else y.extend = Prototype.K;
        window.addEventListener && (y.prototype = window.Event.prototype || document.createEvent("HTMLEvents").__proto__, Object.extend(y.prototype, _));
        var O = [];
        Prototype.Browser.IE && window.attachEvent("onunload", m), Prototype.Browser.WebKit && window.addEventListener("unload", Prototype.emptyFunction, !1);
        var k = Prototype.K,
            A = {
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            };
        w || (k = function(e) {
            return A[e] || e
        }), y.Handler = Class.create({
            initialize: function(e, t, n, i) {
                this.element = $(e), this.eventName = t, this.selector = n, this.callback = i, this.handler = this.handleEvent.bind(this)
            },
            start: function() {
                return y.observe(this.element, this.eventName, this.handler), this
            },
            stop: function() {
                return y.stopObserving(this.element, this.eventName, this.handler), this
            },
            handleEvent: function(e) {
                var t = y.findElement(e, this.selector);
                t && this.callback.call(this.element, e, t)
            }
        }), Object.extend(y, y.Methods), Object.extend(y, {
            fire: v,
            observe: f,
            stopObserving: g,
            on: b
        }), Element.addMethods({
            fire: v,
            observe: f,
            stopObserving: g,
            on: b
        }), Object.extend(document, {
            fire: v.methodize(),
            observe: f.methodize(),
            stopObserving: g.methodize(),
            on: b.methodize(),
            loaded: !1
        }), window.Event ? Object.extend(window.Event, y) : window.Event = y
    }(),
    function() {
        function e() {
            document.loaded || (i && window.clearTimeout(i), document.loaded = !0, document.fire("dom:loaded"))
        }

        function t() {
            "complete" === document.readyState && (document.stopObserving("readystatechange", t), e())
        }

        function n() {
            try {
                document.documentElement.doScroll("left")
            } catch (t) {
                return void(i = n.defer())
            }
            e()
        }
        var i;
        document.addEventListener ? document.addEventListener("DOMContentLoaded", e, !1) : (document.observe("readystatechange", t), window == top && (i = n.defer())), Event.observe(window, "load", e)
    }(), Element.addMethods(), Hash.toQueryString = Object.toQueryString;
var Toggle = {
    display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
        Before: function(e, t) {
            return Element.insert(e, {
                before: t
            })
        },
        Top: function(e, t) {
            return Element.insert(e, {
                top: t
            })
        },
        Bottom: function(e, t) {
            return Element.insert(e, {
                bottom: t
            })
        },
        After: function(e, t) {
            return Element.insert(e, {
                after: t
            })
        }
    },
    $continue = new Error('"throw $continue" is deprecated, use "return" instead'),
    Position = {
        includeScrollOffsets: !1,
        prepare: function() {
            this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0, this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        },
        within: function(e, t, n) {
            return this.includeScrollOffsets ? this.withinIncludingScrolloffsets(e, t, n) : (this.xcomp = t, this.ycomp = n, this.offset = Element.cumulativeOffset(e), n >= this.offset[1] && n < this.offset[1] + e.offsetHeight && t >= this.offset[0] && t < this.offset[0] + e.offsetWidth)
        },
        withinIncludingScrolloffsets: function(e, t, n) {
            var i = Element.cumulativeScrollOffset(e);
            return this.xcomp = t + i[0] - this.deltaX, this.ycomp = n + i[1] - this.deltaY, this.offset = Element.cumulativeOffset(e), this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + e.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + e.offsetWidth
        },
        overlap: function(e, t) {
            return e ? "vertical" == e ? (this.offset[1] + t.offsetHeight - this.ycomp) / t.offsetHeight : "horizontal" == e ? (this.offset[0] + t.offsetWidth - this.xcomp) / t.offsetWidth : void 0 : 0
        },
        cumulativeOffset: Element.Methods.cumulativeOffset,
        positionedOffset: Element.Methods.positionedOffset,
        absolutize: function(e) {
            return Position.prepare(), Element.absolutize(e)
        },
        relativize: function(e) {
            return Position.prepare(), Element.relativize(e)
        },
        realOffset: Element.Methods.cumulativeScrollOffset,
        offsetParent: Element.Methods.getOffsetParent,
        page: Element.Methods.viewportOffset,
        clone: function(e, t, n) {
            return n = n || {}, Element.clonePosition(t, e, n)
        }
    };
document.getElementsByClassName || (document.getElementsByClassName = function(e) {
        function t(e) {
            return e.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + e + " ')]"
        }
        return e.getElementsByClassName = Prototype.BrowserFeatures.XPath ? function(e, n) {
                n = n.toString().strip();
                var i = /\s/.test(n) ? $w(n).map(t).join("") : t(n);
                return i ? document._getElementsByXPath(".//*" + i, e) : []
            } : function(e, t) {
                t = t.toString().strip();
                var n = [],
                    i = /\s/.test(t) ? $w(t) : null;
                if (!i && !t) return n;
                var o = $(e).getElementsByTagName("*");
                t = " " + t + " ";
                for (var s, r, a = 0; s = o[a]; a++) s.className && (r = " " + s.className + " ") && (r.include(t) || i && i.all(function(e) {
                    return !e.toString().blank() && r.include(" " + e + " ")
                })) && n.push(Element.extend(s));
                return n
            },
            function(e, t) {
                return $(t || document.body).getElementsByClassName(e)
            }
    }(Element.Methods)), Element.ClassNames = Class.create(), Element.ClassNames.prototype = {
        initialize: function(e) {
            this.element = $(e)
        },
        _each: function(e) {
            this.element.className.split(/\s+/).select(function(e) {
                return e.length > 0
            })._each(e)
        },
        set: function(e) {
            this.element.className = e
        },
        add: function(e) {
            this.include(e) || this.set($A(this).concat(e).join(" "))
        },
        remove: function(e) {
            this.include(e) && this.set($A(this).without(e).join(" "))
        },
        toString: function() {
            return $A(this).join(" ")
        }
    }, Object.extend(Element.ClassNames.prototype, Enumerable),
    function() {
        window.Selector = Class.create({
            initialize: function(e) {
                this.expression = e.strip()
            },
            findElements: function(e) {
                return Prototype.Selector.select(this.expression, e)
            },
            match: function(e) {
                return Prototype.Selector.match(e, this.expression)
            },
            toString: function() {
                return this.expression
            },
            inspect: function() {
                return "#<Selector: " + this.expression + ">"
            }
        }), Object.extend(Selector, {
            matchElements: function(e, t) {
                for (var n = Prototype.Selector.match, i = [], o = 0, s = e.length; s > o; o++) {
                    var r = e[o];
                    n(r, t) && i.push(Element.extend(r))
                }
                return i
            },
            findElement: function(e, t, n) {
                n = n || 0;
                for (var i, o = 0, s = 0, r = e.length; r > s; s++)
                    if (i = e[s], Prototype.Selector.match(i, t) && n === o++) return Element.extend(i)
            },
            findChildElements: function(e, t) {
                var n = t.toArray().join(", ");
                return Prototype.Selector.select(n, e || document)
            }
        })
    }();
var Scriptaculous = {
    Version: "1.9.0",
    require: function(e) {
        try {
            document.write('<script type="text/javascript" src="' + e + '"></script>')
        } catch (t) {
            var n = document.createElement("script");
            n.type = "text/javascript", n.src = e, document.getElementsByTagName("head")[0].appendChild(n)
        }
    },
    REQUIRED_PROTOTYPE: "1.6.0.3",
    load: function() {
        function e(e) {
            var t = e.replace(/_.*|\./g, "");
            return t = parseInt(t + "0".times(4 - t.length)), e.indexOf("_") > -1 ? t - 1 : t
        }
        if ("undefined" == typeof Prototype || "undefined" == typeof Element || "undefined" == typeof Element.Methods || e(Prototype.Version) < e(Scriptaculous.REQUIRED_PROTOTYPE)) throw "script.aculo.us requires the Prototype JavaScript framework >= " + Scriptaculous.REQUIRED_PROTOTYPE;
        var t = /scriptaculous\.js(\?.*)?$/;
        $$("script[src]").findAll(function(e) {
            return e.src.match(t)
        }).each(function(e) {
            var n = e.src.replace(t, ""),
                i = e.src.match(/\?.*load=([a-z,]*)/);
            (i ? i[1] : "builder,effects,dragdrop,controls,slider,sound").split(",").each(function(e) {
                Scriptaculous.require(n + e + ".js")
            })
        })
    }
};
Scriptaculous.load(), String.prototype.parseColor = function() {
    var e = "#";
    if ("rgb(" == this.slice(0, 4)) {
        var t = this.slice(4, this.length - 1).split(","),
            n = 0;
        do e += parseInt(t[n]).toColorPart(); while (++n < 3)
    } else if ("#" == this.slice(0, 1)) {
        if (4 == this.length)
            for (var n = 1; 4 > n; n++) e += (this.charAt(n) + this.charAt(n)).toLowerCase();
        7 == this.length && (e = this.toLowerCase())
    }
    return 7 == e.length ? e : arguments[0] || this
}, Element.collectTextNodes = function(e) {
    return $A($(e).childNodes).collect(function(e) {
        return 3 == e.nodeType ? e.nodeValue : e.hasChildNodes() ? Element.collectTextNodes(e) : ""
    }).flatten().join("")
}, Element.collectTextNodesIgnoreClass = function(e, t) {
    return $A($(e).childNodes).collect(function(e) {
        return 3 == e.nodeType ? e.nodeValue : e.hasChildNodes() && !Element.hasClassName(e, t) ? Element.collectTextNodesIgnoreClass(e, t) : ""
    }).flatten().join("")
}, Element.setContentZoom = function(e, t) {
    return e = $(e), e.setStyle({
        fontSize: t / 100 + "em"
    }), Prototype.Browser.WebKit && window.scrollBy(0, 0), e
}, Element.getInlineOpacity = function(e) {
    return $(e).style.opacity || ""
}, Element.forceRerendering = function(e) {
    try {
        e = $(e);
        var t = document.createTextNode(" ");
        e.appendChild(t), e.removeChild(t)
    } catch (n) {}
};
var Effect = {
    _elementDoesNotExistError: {
        name: "ElementDoesNotExistError",
        message: "The specified DOM element does not exist, but is required for this effect to operate"
    },
    Transitions: {
        linear: Prototype.K,
        sinoidal: function(e) {
            return -Math.cos(e * Math.PI) / 2 + .5
        },
        reverse: function(e) {
            return 1 - e
        },
        flicker: function(e) {
            var e = -Math.cos(e * Math.PI) / 4 + .75 + Math.random() / 4;
            return e > 1 ? 1 : e
        },
        wobble: function(e) {
            return -Math.cos(e * Math.PI * 9 * e) / 2 + .5
        },
        pulse: function(e, t) {
            return -Math.cos(e * ((t || 5) - .5) * 2 * Math.PI) / 2 + .5
        },
        spring: function(e) {
            return 1 - Math.cos(4.5 * e * Math.PI) * Math.exp(6 * -e)
        },
        none: function() {
            return 0
        },
        full: function() {
            return 1
        }
    },
    DefaultOptions: {
        duration: 1,
        fps: 100,
        sync: !1,
        from: 0,
        to: 1,
        delay: 0,
        queue: "parallel"
    },
    tagifyText: function(e) {
        var t = "position:relative";
        Prototype.Browser.IE && (t += ";zoom:1"), e = $(e), $A(e.childNodes).each(function(n) {
            3 == n.nodeType && (n.nodeValue.toArray().each(function(i) {
                e.insertBefore(new Element("span", {
                    style: t
                }).update(" " == i ? String.fromCharCode(160) : i), n)
            }), Element.remove(n))
        })
    },
    multiple: function(e, t) {
        var n;
        n = ("object" == typeof e || Object.isFunction(e)) && e.length ? e : $(e).childNodes;
        var i = Object.extend({
                speed: .1,
                delay: 0
            }, arguments[2] || {}),
            o = i.delay;
        $A(n).each(function(e, n) {
            new t(e, Object.extend(i, {
                delay: n * i.speed + o
            }))
        })
    },
    PAIRS: {
        slide: ["SlideDown", "SlideUp"],
        blind: ["BlindDown", "BlindUp"],
        appear: ["Appear", "Fade"]
    },
    toggle: function(e, t, n) {
        return e = $(e), t = (t || "appear").toLowerCase(), Effect[Effect.PAIRS[t][e.visible() ? 1 : 0]](e, Object.extend({
            queue: {
                position: "end",
                scope: e.id || "global",
                limit: 1
            }
        }, n || {}))
    }
};
if (Effect.DefaultOptions.transition = Effect.Transitions.sinoidal, Effect.ScopedQueue = Class.create(Enumerable, {
        initialize: function() {
            this.effects = [], this.interval = null
        },
        _each: function(e) {
            this.effects._each(e)
        },
        add: function(e) {
            var t = (new Date).getTime(),
                n = Object.isString(e.options.queue) ? e.options.queue : e.options.queue.position;
            switch (n) {
                case "front":
                    this.effects.findAll(function(e) {
                        return "idle" == e.state
                    }).each(function(t) {
                        t.startOn += e.finishOn, t.finishOn += e.finishOn
                    });
                    break;
                case "with-last":
                    t = this.effects.pluck("startOn").max() || t;
                    break;
                case "end":
                    t = this.effects.pluck("finishOn").max() || t
            }
            e.startOn += t, e.finishOn += t, (!e.options.queue.limit || this.effects.length < e.options.queue.limit) && this.effects.push(e), this.interval || (this.interval = setInterval(this.loop.bind(this), 15))
        },
        remove: function(e) {
            this.effects = this.effects.reject(function(t) {
                return t == e
            }), 0 == this.effects.length && (clearInterval(this.interval), this.interval = null)
        },
        loop: function() {
            for (var e = (new Date).getTime(), t = 0, n = this.effects.length; n > t; t++) this.effects[t] && this.effects[t].loop(e)
        }
    }), Effect.Queues = {
        instances: $H(),
        get: function(e) {
            return Object.isString(e) ? this.instances.get(e) || this.instances.set(e, new Effect.ScopedQueue) : e
        }
    }, Effect.Queue = Effect.Queues.get("global"), Effect.Base = Class.create({
        position: null,
        start: function(e) {
            e && e.transition === !1 && (e.transition = Effect.Transitions.linear), this.options = Object.extend(Object.extend({}, Effect.DefaultOptions), e || {}), this.currentFrame = 0, this.state = "idle", this.startOn = 1e3 * this.options.delay, this.finishOn = this.startOn + 1e3 * this.options.duration, this.fromToDelta = this.options.to - this.options.from, this.totalTime = this.finishOn - this.startOn, this.totalFrames = this.options.fps * this.options.duration, this.render = function() {
                function e(e, t) {
                    e.options[t + "Internal"] && e.options[t + "Internal"](e), e.options[t] && e.options[t](e)
                }
                return function(t) {
                    "idle" === this.state && (this.state = "running", e(this, "beforeSetup"), this.setup && this.setup(), e(this, "afterSetup")), "running" === this.state && (t = this.options.transition(t) * this.fromToDelta + this.options.from, this.position = t, e(this, "beforeUpdate"), this.update && this.update(t), e(this, "afterUpdate"))
                }
            }(), this.event("beforeStart"), this.options.sync || Effect.Queues.get(Object.isString(this.options.queue) ? "global" : this.options.queue.scope).add(this)
        },
        loop: function(e) {
            if (e >= this.startOn) {
                if (e >= this.finishOn) return this.render(1), this.cancel(), this.event("beforeFinish"), this.finish && this.finish(), void this.event("afterFinish");
                var t = (e - this.startOn) / this.totalTime,
                    n = (t * this.totalFrames).round();
                n > this.currentFrame && (this.render(t), this.currentFrame = n)
            }
        },
        cancel: function() {
            this.options.sync || Effect.Queues.get(Object.isString(this.options.queue) ? "global" : this.options.queue.scope).remove(this), this.state = "finished"
        },
        event: function(e) {
            this.options[e + "Internal"] && this.options[e + "Internal"](this), this.options[e] && this.options[e](this)
        },
        inspect: function() {
            var e = $H();
            for (property in this) Object.isFunction(this[property]) || e.set(property, this[property]);
            return "#<Effect:" + e.inspect() + ",options:" + $H(this.options).inspect() + ">"
        }
    }), Effect.Parallel = Class.create(Effect.Base, {
        initialize: function(e) {
            this.effects = e || [], this.start(arguments[1])
        },
        update: function(e) {
            this.effects.invoke("render", e)
        },
        finish: function(e) {
            this.effects.each(function(t) {
                t.render(1), t.cancel(), t.event("beforeFinish"), t.finish && t.finish(e), t.event("afterFinish")
            })
        }
    }), Effect.Tween = Class.create(Effect.Base, {
        initialize: function(e, t, n) {
            e = Object.isString(e) ? $(e) : e;
            var i = $A(arguments),
                o = i.last(),
                s = 5 == i.length ? i[3] : null;
            this.method = Object.isFunction(o) ? o.bind(e) : Object.isFunction(e[o]) ? e[o].bind(e) : function(t) {
                e[o] = t
            }, this.start(Object.extend({
                from: t,
                to: n
            }, s || {}))
        },
        update: function(e) {
            this.method(e)
        }
    }), Effect.Event = Class.create(Effect.Base, {
        initialize: function() {
            this.start(Object.extend({
                duration: 0
            }, arguments[0] || {}))
        },
        update: Prototype.emptyFunction
    }), Effect.Opacity = Class.create(Effect.Base, {
        initialize: function(e) {
            if (this.element = $(e), !this.element) throw Effect._elementDoesNotExistError;
            Prototype.Browser.IE && !this.element.currentStyle.hasLayout && this.element.setStyle({
                zoom: 1
            });
            var t = Object.extend({
                from: this.element.getOpacity() || 0,
                to: 1
            }, arguments[1] || {});
            this.start(t)
        },
        update: function(e) {
            this.element.setOpacity(e)
        }
    }), Effect.Move = Class.create(Effect.Base, {
        initialize: function(e) {
            if (this.element = $(e), !this.element) throw Effect._elementDoesNotExistError;
            var t = Object.extend({
                x: 0,
                y: 0,
                mode: "relative"
            }, arguments[1] || {});
            this.start(t)
        },
        setup: function() {
            this.element.makePositioned(), this.originalLeft = parseFloat(this.element.getStyle("left") || "0"), this.originalTop = parseFloat(this.element.getStyle("top") || "0"), "absolute" == this.options.mode && (this.options.x = this.options.x - this.originalLeft, this.options.y = this.options.y - this.originalTop)
        },
        update: function(e) {
            this.element.setStyle({
                left: (this.options.x * e + this.originalLeft).round() + "px",
                top: (this.options.y * e + this.originalTop).round() + "px"
            })
        }
    }), Effect.MoveBy = function(e, t, n) {
        return new Effect.Move(e, Object.extend({
            x: n,
            y: t
        }, arguments[3] || {}))
    }, Effect.Scale = Class.create(Effect.Base, {
        initialize: function(e, t) {
            if (this.element = $(e), !this.element) throw Effect._elementDoesNotExistError;
            var n = Object.extend({
                scaleX: !0,
                scaleY: !0,
                scaleContent: !0,
                scaleFromCenter: !1,
                scaleMode: "box",
                scaleFrom: 100,
                scaleTo: t
            }, arguments[2] || {});
            this.start(n)
        },
        setup: function() {
            this.restoreAfterFinish = this.options.restoreAfterFinish || !1, this.elementPositioning = this.element.getStyle("position"), this.originalStyle = {}, ["top", "left", "width", "height", "fontSize"].each(function(e) {
                this.originalStyle[e] = this.element.style[e]
            }.bind(this)), this.originalTop = this.element.offsetTop, this.originalLeft = this.element.offsetLeft;
            var e = this.element.getStyle("font-size") || "100%";
            ["em", "px", "%", "pt"].each(function(t) {
                e.indexOf(t) > 0 && (this.fontSize = parseFloat(e), this.fontSizeType = t)
            }.bind(this)), this.factor = (this.options.scaleTo - this.options.scaleFrom) / 100, this.dims = null, "box" == this.options.scaleMode && (this.dims = [this.element.offsetHeight, this.element.offsetWidth]), /^content/.test(this.options.scaleMode) && (this.dims = [this.element.scrollHeight, this.element.scrollWidth]), this.dims || (this.dims = [this.options.scaleMode.originalHeight, this.options.scaleMode.originalWidth])
        },
        update: function(e) {
            var t = this.options.scaleFrom / 100 + this.factor * e;
            this.options.scaleContent && this.fontSize && this.element.setStyle({
                fontSize: this.fontSize * t + this.fontSizeType
            }), this.setDimensions(this.dims[0] * t, this.dims[1] * t)
        },
        finish: function() {
            this.restoreAfterFinish && this.element.setStyle(this.originalStyle)
        },
        setDimensions: function(e, t) {
            var n = {};
            if (this.options.scaleX && (n.width = t.round() + "px"), this.options.scaleY && (n.height = e.round() + "px"), this.options.scaleFromCenter) {
                var i = (e - this.dims[0]) / 2,
                    o = (t - this.dims[1]) / 2;
                "absolute" == this.elementPositioning ? (this.options.scaleY && (n.top = this.originalTop - i + "px"), this.options.scaleX && (n.left = this.originalLeft - o + "px")) : (this.options.scaleY && (n.top = -i + "px"), this.options.scaleX && (n.left = -o + "px"))
            }
            this.element.setStyle(n)
        }
    }), Effect.Highlight = Class.create(Effect.Base, {
        initialize: function(e) {
            if (this.element = $(e), !this.element) throw Effect._elementDoesNotExistError;
            var t = Object.extend({
                startcolor: "#ffff99"
            }, arguments[1] || {});
            this.start(t)
        },
        setup: function() {
            return "none" == this.element.getStyle("display") ? void this.cancel() : (this.oldStyle = {}, this.options.keepBackgroundImage || (this.oldStyle.backgroundImage = this.element.getStyle("background-image"), this.element.setStyle({
                backgroundImage: "none"
            })), this.options.endcolor || (this.options.endcolor = this.element.getStyle("background-color").parseColor("#ffffff")), this.options.restorecolor || (this.options.restorecolor = this.element.getStyle("background-color")), this._base = $R(0, 2).map(function(e) {
                return parseInt(this.options.startcolor.slice(2 * e + 1, 2 * e + 3), 16)
            }.bind(this)), void(this._delta = $R(0, 2).map(function(e) {
                return parseInt(this.options.endcolor.slice(2 * e + 1, 2 * e + 3), 16) - this._base[e]
            }.bind(this))))
        },
        update: function(e) {
            this.element.setStyle({
                backgroundColor: $R(0, 2).inject("#", function(t, n, i) {
                    return t + (this._base[i] + this._delta[i] * e).round().toColorPart()
                }.bind(this))
            })
        },
        finish: function() {
            this.element.setStyle(Object.extend(this.oldStyle, {
                backgroundColor: this.options.restorecolor
            }))
        }
    }), Effect.ScrollTo = function(e) {
        var t = arguments[1] || {},
            n = document.viewport.getScrollOffsets(),
            i = $(e).cumulativeOffset();
        return t.offset && (i[1] += t.offset), new Effect.Tween(null, n.top, i[1], t, function(e) {
            scrollTo(n.left, e.round())
        })
    }, Effect.Fade = function(e) {
        e = $(e);
        var t = e.getInlineOpacity(),
            n = Object.extend({
                from: e.getOpacity() || 1,
                to: 0,
                afterFinishInternal: function(e) {
                    0 == e.options.to && e.element.hide().setStyle({
                        opacity: t
                    })
                }
            }, arguments[1] || {});
        return new Effect.Opacity(e, n)
    }, Effect.Appear = function(e) {
        e = $(e);
        var t = Object.extend({
            from: "none" == e.getStyle("display") ? 0 : e.getOpacity() || 0,
            to: 1,
            afterFinishInternal: function(e) {
                e.element.forceRerendering()
            },
            beforeSetup: function(e) {
                e.element.setOpacity(e.options.from).show()
            }
        }, arguments[1] || {});
        return new Effect.Opacity(e, t)
    }, Effect.Puff = function(e) {
        e = $(e);
        var t = {
            opacity: e.getInlineOpacity(),
            position: e.getStyle("position"),
            top: e.style.top,
            left: e.style.left,
            width: e.style.width,
            height: e.style.height
        };
        return new Effect.Parallel([new Effect.Scale(e, 200, {
            sync: !0,
            scaleFromCenter: !0,
            scaleContent: !0,
            restoreAfterFinish: !0
        }), new Effect.Opacity(e, {
            sync: !0,
            to: 0
        })], Object.extend({
            duration: 1,
            beforeSetupInternal: function(e) {
                Position.absolutize(e.effects[0].element)
            },
            afterFinishInternal: function(e) {
                e.effects[0].element.hide().setStyle(t)
            }
        }, arguments[1] || {}))
    }, Effect.BlindUp = function(e) {
        return e = $(e), e.makeClipping(), new Effect.Scale(e, 0, Object.extend({
            scaleContent: !1,
            scaleX: !1,
            restoreAfterFinish: !0,
            afterFinishInternal: function(e) {
                e.element.hide().undoClipping()
            }
        }, arguments[1] || {}))
    }, Effect.BlindDown = function(e) {
        e = $(e);
        var t = e.getDimensions();
        return new Effect.Scale(e, 100, Object.extend({
            scaleContent: !1,
            scaleX: !1,
            scaleFrom: 0,
            scaleMode: {
                originalHeight: t.height,
                originalWidth: t.width
            },
            restoreAfterFinish: !0,
            afterSetup: function(e) {
                e.element.makeClipping().setStyle({
                    height: "0px"
                }).show()
            },
            afterFinishInternal: function(e) {
                e.element.undoClipping()
            }
        }, arguments[1] || {}))
    }, Effect.SwitchOff = function(e) {
        e = $(e);
        var t = e.getInlineOpacity();
        return new Effect.Appear(e, Object.extend({
            duration: .4,
            from: 0,
            transition: Effect.Transitions.flicker,
            afterFinishInternal: function(e) {
                new Effect.Scale(e.element, 1, {
                    duration: .3,
                    scaleFromCenter: !0,
                    scaleX: !1,
                    scaleContent: !1,
                    restoreAfterFinish: !0,
                    beforeSetup: function(e) {
                        e.element.makePositioned().makeClipping()
                    },
                    afterFinishInternal: function(e) {
                        e.element.hide().undoClipping().undoPositioned().setStyle({
                            opacity: t
                        })
                    }
                })
            }
        }, arguments[1] || {}))
    }, Effect.DropOut = function(e) {
        e = $(e);
        var t = {
            top: e.getStyle("top"),
            left: e.getStyle("left"),
            opacity: e.getInlineOpacity()
        };
        return new Effect.Parallel([new Effect.Move(e, {
            x: 0,
            y: 100,
            sync: !0
        }), new Effect.Opacity(e, {
            sync: !0,
            to: 0
        })], Object.extend({
            duration: .5,
            beforeSetup: function(e) {
                e.effects[0].element.makePositioned()
            },
            afterFinishInternal: function(e) {
                e.effects[0].element.hide().undoPositioned().setStyle(t)
            }
        }, arguments[1] || {}))
    }, Effect.Shake = function(e) {
        e = $(e);
        var t = Object.extend({
                distance: 20,
                duration: .5
            }, arguments[1] || {}),
            n = parseFloat(t.distance),
            i = parseFloat(t.duration) / 10,
            o = {
                top: e.getStyle("top"),
                left: e.getStyle("left")
            };
        return new Effect.Move(e, {
            x: n,
            y: 0,
            duration: i,
            afterFinishInternal: function(e) {
                new Effect.Move(e.element, {
                    x: 2 * -n,
                    y: 0,
                    duration: 2 * i,
                    afterFinishInternal: function(e) {
                        new Effect.Move(e.element, {
                            x: 2 * n,
                            y: 0,
                            duration: 2 * i,
                            afterFinishInternal: function(e) {
                                new Effect.Move(e.element, {
                                    x: 2 * -n,
                                    y: 0,
                                    duration: 2 * i,
                                    afterFinishInternal: function(e) {
                                        new Effect.Move(e.element, {
                                            x: 2 * n,
                                            y: 0,
                                            duration: 2 * i,
                                            afterFinishInternal: function(e) {
                                                new Effect.Move(e.element, {
                                                    x: -n,
                                                    y: 0,
                                                    duration: i,
                                                    afterFinishInternal: function(e) {
                                                        e.element.undoPositioned().setStyle(o)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }, Effect.SlideDown = function(e) {
        e = $(e).cleanWhitespace();
        var t = e.down().getStyle("bottom"),
            n = e.getDimensions();
        return new Effect.Scale(e, 100, Object.extend({
            scaleContent: !1,
            scaleX: !1,
            scaleFrom: window.opera ? 0 : 1,
            scaleMode: {
                originalHeight: n.height,
                originalWidth: n.width
            },
            restoreAfterFinish: !0,
            afterSetup: function(e) {
                e.element.makePositioned(), e.element.down().makePositioned(), window.opera && e.element.setStyle({
                    top: ""
                }), e.element.makeClipping().setStyle({
                    height: "0px"
                }).show()
            },
            afterUpdateInternal: function(e) {
                e.element.down().setStyle({
                    bottom: e.dims[0] - e.element.clientHeight + "px"
                })
            },
            afterFinishInternal: function(e) {
                e.element.undoClipping().undoPositioned(), e.element.down().undoPositioned().setStyle({
                    bottom: t
                })
            }
        }, arguments[1] || {}))
    }, Effect.SlideUp = function(e) {
        e = $(e).cleanWhitespace();
        var t = e.down().getStyle("bottom"),
            n = e.getDimensions();
        return new Effect.Scale(e, window.opera ? 0 : 1, Object.extend({
            scaleContent: !1,
            scaleX: !1,
            scaleMode: "box",
            scaleFrom: 100,
            scaleMode: {
                originalHeight: n.height,
                originalWidth: n.width
            },
            restoreAfterFinish: !0,
            afterSetup: function(e) {
                e.element.makePositioned(), e.element.down().makePositioned(), window.opera && e.element.setStyle({
                    top: ""
                }), e.element.makeClipping().show()
            },
            afterUpdateInternal: function(e) {
                e.element.down().setStyle({
                    bottom: e.dims[0] - e.element.clientHeight + "px"
                })
            },
            afterFinishInternal: function(e) {
                e.element.hide().undoClipping().undoPositioned(), e.element.down().undoPositioned().setStyle({
                    bottom: t
                })
            }
        }, arguments[1] || {}))
    }, Effect.Squish = function(e) {
        return new Effect.Scale(e, window.opera ? 1 : 0, {
            restoreAfterFinish: !0,
            beforeSetup: function(e) {
                e.element.makeClipping()
            },
            afterFinishInternal: function(e) {
                e.element.hide().undoClipping()
            }
        })
    }, Effect.Grow = function(e) {
        e = $(e);
        var t, n, i, o, s = Object.extend({
                direction: "center",
                moveTransition: Effect.Transitions.sinoidal,
                scaleTransition: Effect.Transitions.sinoidal,
                opacityTransition: Effect.Transitions.full
            }, arguments[1] || {}),
            r = {
                top: e.style.top,
                left: e.style.left,
                height: e.style.height,
                width: e.style.width,
                opacity: e.getInlineOpacity()
            },
            a = e.getDimensions();
        switch (s.direction) {
            case "top-left":
                t = n = i = o = 0;
                break;
            case "top-right":
                t = a.width, n = o = 0, i = -a.width;
                break;
            case "bottom-left":
                t = i = 0, n = a.height, o = -a.height;
                break;
            case "bottom-right":
                t = a.width, n = a.height, i = -a.width, o = -a.height;
                break;
            case "center":
                t = a.width / 2, n = a.height / 2, i = -a.width / 2, o = -a.height / 2
        }
        return new Effect.Move(e, {
            x: t,
            y: n,
            duration: .01,
            beforeSetup: function(e) {
                e.element.hide().makeClipping().makePositioned()
            },
            afterFinishInternal: function(e) {
                new Effect.Parallel([new Effect.Opacity(e.element, {
                    sync: !0,
                    to: 1,
                    from: 0,
                    transition: s.opacityTransition
                }), new Effect.Move(e.element, {
                    x: i,
                    y: o,
                    sync: !0,
                    transition: s.moveTransition
                }), new Effect.Scale(e.element, 100, {
                    scaleMode: {
                        originalHeight: a.height,
                        originalWidth: a.width
                    },
                    sync: !0,
                    scaleFrom: window.opera ? 1 : 0,
                    transition: s.scaleTransition,
                    restoreAfterFinish: !0
                })], Object.extend({
                    beforeSetup: function(e) {
                        e.effects[0].element.setStyle({
                            height: "0px"
                        }).show()
                    },
                    afterFinishInternal: function(e) {
                        e.effects[0].element.undoClipping().undoPositioned().setStyle(r)
                    }
                }, s))
            }
        })
    }, Effect.Shrink = function(e) {
        e = $(e);
        var t, n, i = Object.extend({
                direction: "center",
                moveTransition: Effect.Transitions.sinoidal,
                scaleTransition: Effect.Transitions.sinoidal,
                opacityTransition: Effect.Transitions.none
            }, arguments[1] || {}),
            o = {
                top: e.style.top,
                left: e.style.left,
                height: e.style.height,
                width: e.style.width,
                opacity: e.getInlineOpacity()
            },
            s = e.getDimensions();
        switch (i.direction) {
            case "top-left":
                t = n = 0;
                break;
            case "top-right":
                t = s.width, n = 0;
                break;
            case "bottom-left":
                t = 0, n = s.height;
                break;
            case "bottom-right":
                t = s.width, n = s.height;
                break;
            case "center":
                t = s.width / 2, n = s.height / 2
        }
        return new Effect.Parallel([new Effect.Opacity(e, {
            sync: !0,
            to: 0,
            from: 1,
            transition: i.opacityTransition
        }), new Effect.Scale(e, window.opera ? 1 : 0, {
            sync: !0,
            transition: i.scaleTransition,
            restoreAfterFinish: !0
        }), new Effect.Move(e, {
            x: t,
            y: n,
            sync: !0,
            transition: i.moveTransition
        })], Object.extend({
            beforeStartInternal: function(e) {
                e.effects[0].element.makePositioned().makeClipping()
            },
            afterFinishInternal: function(e) {
                e.effects[0].element.hide().undoClipping().undoPositioned().setStyle(o)
            }
        }, i))
    }, Effect.Pulsate = function(e) {
        e = $(e);
        var t = arguments[1] || {},
            n = e.getInlineOpacity(),
            i = t.transition || Effect.Transitions.linear,
            o = function(e) {
                return 1 - i(-Math.cos(e * (t.pulses || 5) * 2 * Math.PI) / 2 + .5)
            };
        return new Effect.Opacity(e, Object.extend(Object.extend({
            duration: 2,
            from: 0,
            afterFinishInternal: function(e) {
                e.element.setStyle({
                    opacity: n
                })
            }
        }, t), {
            transition: o
        }))
    }, Effect.Fold = function(e) {
        e = $(e);
        var t = {
            top: e.style.top,
            left: e.style.left,
            width: e.style.width,
            height: e.style.height
        };
        return e.makeClipping(), new Effect.Scale(e, 5, Object.extend({
            scaleContent: !1,
            scaleX: !1,
            afterFinishInternal: function() {
                new Effect.Scale(e, 1, {
                    scaleContent: !1,
                    scaleY: !1,
                    afterFinishInternal: function(e) {
                        e.element.hide().undoClipping().setStyle(t)
                    }
                })
            }
        }, arguments[1] || {}))
    }, Effect.Morph = Class.create(Effect.Base, {
        initialize: function(e) {
            if (this.element = $(e), !this.element) throw Effect._elementDoesNotExistError;
            var t = Object.extend({
                style: {}
            }, arguments[1] || {});
            if (Object.isString(t.style))
                if (t.style.include(":")) this.style = t.style.parseStyle();
                else {
                    this.element.addClassName(t.style), this.style = $H(this.element.getStyles()), this.element.removeClassName(t.style);
                    var n = this.element.getStyles();
                    this.style = this.style.reject(function(e) {
                        return e.value == n[e.key]
                    }), t.afterFinishInternal = function(e) {
                        e.element.addClassName(e.options.style), e.transforms.each(function(t) {
                            e.element.style[t.style] = ""
                        })
                    }
                }
            else this.style = $H(t.style);
            this.start(t)
        },
        setup: function() {
            function e(e) {
                return (!e || ["rgba(0, 0, 0, 0)", "transparent"].include(e)) && (e = "#ffffff"), e = e.parseColor(), $R(0, 2).map(function(t) {
                    return parseInt(e.slice(2 * t + 1, 2 * t + 3), 16)
                })
            }
            this.transforms = this.style.map(function(t) {
                var n = t[0],
                    i = t[1],
                    o = null;
                if ("#zzzzzz" != i.parseColor("#zzzzzz")) i = i.parseColor(), o = "color";
                else if ("opacity" == n) i = parseFloat(i), Prototype.Browser.IE && !this.element.currentStyle.hasLayout && this.element.setStyle({
                    zoom: 1
                });
                else if (Element.CSS_LENGTH.test(i)) {
                    var s = i.match(/^([\+\-]?[0-9\.]+)(.*)$/);
                    i = parseFloat(s[1]), o = 3 == s.length ? s[2] : null
                }
                var r = this.element.getStyle(n);
                return {
                    style: n.camelize(),
                    originalValue: "color" == o ? e(r) : parseFloat(r || 0),
                    targetValue: "color" == o ? e(i) : i,
                    unit: o
                }
            }.bind(this)).reject(function(e) {
                return e.originalValue == e.targetValue || "color" != e.unit && (isNaN(e.originalValue) || isNaN(e.targetValue))
            })
        },
        update: function(e) {
            for (var t, n = {}, i = this.transforms.length; i--;) n[(t = this.transforms[i]).style] = "color" == t.unit ? "#" + Math.round(t.originalValue[0] + (t.targetValue[0] - t.originalValue[0]) * e).toColorPart() + Math.round(t.originalValue[1] + (t.targetValue[1] - t.originalValue[1]) * e).toColorPart() + Math.round(t.originalValue[2] + (t.targetValue[2] - t.originalValue[2]) * e).toColorPart() : (t.originalValue + (t.targetValue - t.originalValue) * e).toFixed(3) + (null === t.unit ? "" : t.unit);
            this.element.setStyle(n, !0)
        }
    }), Effect.Transform = Class.create({
        initialize: function(e) {
            this.tracks = [], this.options = arguments[1] || {}, this.addTracks(e)
        },
        addTracks: function(e) {
            return e.each(function(e) {
                e = $H(e);
                var t = e.values().first();
                this.tracks.push($H({
                    ids: e.keys().first(),
                    effect: Effect.Morph,
                    options: {
                        style: t
                    }
                }))
            }.bind(this)), this
        },
        play: function() {
            return new Effect.Parallel(this.tracks.map(function(e) {
                var t = e.get("ids"),
                    n = e.get("effect"),
                    i = e.get("options"),
                    o = [$(t) || $$(t)].flatten();
                return o.map(function(e) {
                    return new n(e, Object.extend({
                        sync: !0
                    }, i))
                })
            }).flatten(), this.options)
        }
    }), Element.CSS_PROPERTIES = $w("backgroundColor backgroundPosition borderBottomColor borderBottomStyle borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderSpacing borderTopColor borderTopStyle borderTopWidth bottom clip color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop markerOffset maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex"), Element.CSS_LENGTH = /^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/, String.__parseStyleElement = document.createElement("div"), String.prototype.parseStyle = function() {
        var e, t = $H();
        return Prototype.Browser.WebKit ? e = new Element("div", {
            style: this
        }).style : (String.__parseStyleElement.innerHTML = '<div style="' + this + '"></div>', e = String.__parseStyleElement.childNodes[0].style), Element.CSS_PROPERTIES.each(function(n) {
            e[n] && t.set(n, e[n])
        }), Prototype.Browser.IE && this.include("opacity") && t.set("opacity", this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1]), t
    }, Element.getStyles = document.defaultView && document.defaultView.getComputedStyle ? function(e) {
        var t = document.defaultView.getComputedStyle($(e), null);
        return Element.CSS_PROPERTIES.inject({}, function(e, n) {
            return e[n] = t[n], e
        })
    } : function(e) {
        e = $(e);
        var t, n = e.currentStyle;
        return t = Element.CSS_PROPERTIES.inject({}, function(e, t) {
            return e[t] = n[t], e
        }), t.opacity || (t.opacity = e.getOpacity()), t
    }, Effect.Methods = {
        morph: function(e, t) {
            return e = $(e), new Effect.Morph(e, Object.extend({
                style: t
            }, arguments[2] || {})), e
        },
        visualEffect: function(e, t, n) {
            e = $(e);
            var i = t.dasherize().camelize(),
                o = i.charAt(0).toUpperCase() + i.substring(1);
            return new Effect[o](e, n), e
        },
        highlight: function(e, t) {
            return e = $(e), new Effect.Highlight(e, t), e
        }
    }, $w("fade appear grow shrink fold blindUp blindDown slideUp slideDown pulsate shake puff squish switchOff dropOut").each(function(e) {
        Effect.Methods[e] = function(t, n) {
            return t = $(t), Effect[e.charAt(0).toUpperCase() + e.substring(1)](t, n), t
        }
    }), $w("getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles").each(function(e) {
        Effect.Methods[e] = Element[e]
    }), Element.addMethods(Effect.Methods), Object.isUndefined(Effect)) throw "dragdrop.js requires including script.aculo.us' effects.js library";
var Droppables = {
        drops: [],
        remove: function(e) {
            this.drops = this.drops.reject(function(t) {
                return t.element == $(e)
            })
        },
        add: function(e) {
            e = $(e);
            var t = Object.extend({
                greedy: !0,
                hoverclass: null,
                tree: !1
            }, arguments[1] || {});
            if (t.containment) {
                t._containers = [];
                var n = t.containment;
                Object.isArray(n) ? n.each(function(e) {
                    t._containers.push($(e))
                }) : t._containers.push($(n))
            }
            t.accept && (t.accept = [t.accept].flatten()), Element.makePositioned(e), t.element = e, this.drops.push(t)
        },
        findDeepestChild: function(e) {
            for (deepest = e[0], i = 1; i < e.length; ++i) Element.isParent(e[i].element, deepest.element) && (deepest = e[i]);
            return deepest
        },
        isContained: function(e, t) {
            var n;
            return n = t.tree ? e.treeNode : e.parentNode, t._containers.detect(function(e) {
                return n == e
            })
        },
        isAffected: function(e, t, n) {
            return n.element != t && (!n._containers || this.isContained(t, n)) && (!n.accept || Element.classNames(t).detect(function(e) {
                return n.accept.include(e)
            })) && Position.within(n.element, e[0], e[1])
        },
        deactivate: function(e) {
            e.hoverclass && Element.removeClassName(e.element, e.hoverclass), this.last_active = null
        },
        activate: function(e) {
            e.hoverclass && Element.addClassName(e.element, e.hoverclass), this.last_active = e
        },
        show: function(e, t) {
            if (this.drops.length) {
                var n, i = [];
                this.drops.each(function(n) {
                    Droppables.isAffected(e, t, n) && i.push(n)
                }), i.length > 0 && (n = Droppables.findDeepestChild(i)), this.last_active && this.last_active != n && this.deactivate(this.last_active), n && (Position.within(n.element, e[0], e[1]), n.onHover && n.onHover(t, n.element, Position.overlap(n.overlap, n.element)), n != this.last_active && Droppables.activate(n))
            }
        },
        fire: function(e, t) {
            return this.last_active ? (Position.prepare(), this.isAffected([Event.pointerX(e), Event.pointerY(e)], t, this.last_active) && this.last_active.onDrop ? (this.last_active.onDrop(t, this.last_active.element, e), !0) : void 0) : void 0
        },
        reset: function() {
            this.last_active && this.deactivate(this.last_active)
        }
    },
    Draggables = {
        drags: [],
        observers: [],
        register: function(e) {
            0 == this.drags.length && (this.eventMouseUp = this.endDrag.bindAsEventListener(this), this.eventMouseMove = this.updateDrag.bindAsEventListener(this), this.eventKeypress = this.keyPress.bindAsEventListener(this), Event.observe(document, "mouseup", this.eventMouseUp), Event.observe(document, "mousemove", this.eventMouseMove), Event.observe(document, "keypress", this.eventKeypress)), this.drags.push(e)
        },
        unregister: function(e) {
            this.drags = this.drags.reject(function(t) {
                return t == e
            }), 0 == this.drags.length && (Event.stopObserving(document, "mouseup", this.eventMouseUp), Event.stopObserving(document, "mousemove", this.eventMouseMove), Event.stopObserving(document, "keypress", this.eventKeypress))
        },
        activate: function(e) {
            e.options.delay ? this._timeout = setTimeout(function() {
                Draggables._timeout = null, window.focus(), Draggables.activeDraggable = e
            }.bind(this), e.options.delay) : (window.focus(), this.activeDraggable = e)
        },
        deactivate: function() {
            this.activeDraggable = null
        },
        updateDrag: function(e) {
            if (this.activeDraggable) {
                var t = [Event.pointerX(e), Event.pointerY(e)];
                this._lastPointer && this._lastPointer.inspect() == t.inspect() || (this._lastPointer = t, this.activeDraggable.updateDrag(e, t))
            }
        },
        endDrag: function(e) {
            this._timeout && (clearTimeout(this._timeout), this._timeout = null), this.activeDraggable && (this._lastPointer = null, this.activeDraggable.endDrag(e), this.activeDraggable = null)
        },
        keyPress: function(e) {
            this.activeDraggable && this.activeDraggable.keyPress(e)
        },
        addObserver: function(e) {
            this.observers.push(e), this._cacheObserverCallbacks()
        },
        removeObserver: function(e) {
            this.observers = this.observers.reject(function(t) {
                return t.element == e
            }), this._cacheObserverCallbacks()
        },
        notify: function(e, t, n) {
            this[e + "Count"] > 0 && this.observers.each(function(i) {
                i[e] && i[e](e, t, n)
            }), t.options[e] && t.options[e](t, n)
        },
        _cacheObserverCallbacks: function() {
            ["onStart", "onEnd", "onDrag"].each(function(e) {
                Draggables[e + "Count"] = Draggables.observers.select(function(t) {
                    return t[e]
                }).length
            })
        }
    },
    Draggable = Class.create({
        initialize: function(e) {
            var t = {
                handle: !1,
                reverteffect: function(e, t, n) {
                    var i = .02 * Math.sqrt(Math.abs(2 ^ t) + Math.abs(2 ^ n));
                    new Effect.Move(e, {
                        x: -n,
                        y: -t,
                        duration: i,
                        queue: {
                            scope: "_draggable",
                            position: "end"
                        }
                    })
                },
                endeffect: function(e) {
                    var t = Object.isNumber(e._opacity) ? e._opacity : 1;
                    new Effect.Opacity(e, {
                        duration: .2,
                        from: .7,
                        to: t,
                        queue: {
                            scope: "_draggable",
                            position: "end"
                        },
                        afterFinish: function() {
                            Draggable._dragging[e] = !1
                        }
                    })
                },
                zindex: 1e3,
                revert: !1,
                quiet: !1,
                scroll: !1,
                scrollSensitivity: 20,
                scrollSpeed: 15,
                snap: !1,
                delay: 0
            };
            (!arguments[1] || Object.isUndefined(arguments[1].endeffect)) && Object.extend(t, {
                starteffect: function(e) {
                    e._opacity = Element.getOpacity(e), Draggable._dragging[e] = !0, new Effect.Opacity(e, {
                        duration: .2,
                        from: e._opacity,
                        to: .7
                    })
                }
            });
            var n = Object.extend(t, arguments[1] || {});
            this.element = $(e), n.handle && Object.isString(n.handle) && (this.handle = this.element.down("." + n.handle, 0)), this.handle || (this.handle = $(n.handle)), this.handle || (this.handle = this.element), !n.scroll || n.scroll.scrollTo || n.scroll.outerHTML || (n.scroll = $(n.scroll), this._isScrollChild = Element.childOf(this.element, n.scroll)), Element.makePositioned(this.element), this.options = n, this.dragging = !1, this.eventMouseDown = this.initDrag.bindAsEventListener(this), Event.observe(this.handle, "mousedown", this.eventMouseDown), Draggables.register(this)
        },
        destroy: function() {
            Event.stopObserving(this.handle, "mousedown", this.eventMouseDown), Draggables.unregister(this)
        },
        currentDelta: function() {
            return [parseInt(Element.getStyle(this.element, "left") || "0"), parseInt(Element.getStyle(this.element, "top") || "0")]
        },
        initDrag: function(e) {
            if ((Object.isUndefined(Draggable._dragging[this.element]) || !Draggable._dragging[this.element]) && Event.isLeftClick(e)) {
                var t = Event.element(e);
                if ((tag_name = t.tagName.toUpperCase()) && ("INPUT" == tag_name || "SELECT" == tag_name || "OPTION" == tag_name || "BUTTON" == tag_name || "TEXTAREA" == tag_name)) return;
                var n = [Event.pointerX(e), Event.pointerY(e)],
                    i = this.element.cumulativeOffset();
                this.offset = [0, 1].map(function(e) {
                    return n[e] - i[e]
                }), Draggables.activate(this), Event.stop(e)
            }
        },
        startDrag: function(e) {
            if (this.dragging = !0, this.delta || (this.delta = this.currentDelta()), this.options.zindex && (this.originalZ = parseInt(Element.getStyle(this.element, "z-index") || 0), this.element.style.zIndex = this.options.zindex), this.options.ghosting && (this._clone = this.element.cloneNode(!0), this._originallyAbsolute = "absolute" == this.element.getStyle("position"), this._originallyAbsolute || Position.absolutize(this.element), this.element.parentNode.insertBefore(this._clone, this.element)), this.options.scroll)
                if (this.options.scroll == window) {
                    var t = this._getWindowScroll(this.options.scroll);
                    this.originalScrollLeft = t.left, this.originalScrollTop = t.top
                } else this.originalScrollLeft = this.options.scroll.scrollLeft, this.originalScrollTop = this.options.scroll.scrollTop;
            Draggables.notify("onStart", this, e), this.options.starteffect && this.options.starteffect(this.element)
        },
        updateDrag: function(event, pointer) {
            if (this.dragging || this.startDrag(event), this.options.quiet || (Position.prepare(), Droppables.show(pointer, this.element)), Draggables.notify("onDrag", this, event), this.draw(pointer), this.options.change && this.options.change(this), this.options.scroll) {
                this.stopScrolling();
                var p;
                if (this.options.scroll == window) with(this._getWindowScroll(this.options.scroll)) p = [left, top, left + width, top + height];
                else p = Position.page(this.options.scroll).toArray(), p[0] += this.options.scroll.scrollLeft + Position.deltaX, p[1] += this.options.scroll.scrollTop + Position.deltaY, p.push(p[0] + this.options.scroll.offsetWidth), p.push(p[1] + this.options.scroll.offsetHeight);
                var speed = [0, 0];
                pointer[0] < p[0] + this.options.scrollSensitivity && (speed[0] = pointer[0] - (p[0] + this.options.scrollSensitivity)), pointer[1] < p[1] + this.options.scrollSensitivity && (speed[1] = pointer[1] - (p[1] + this.options.scrollSensitivity)), pointer[0] > p[2] - this.options.scrollSensitivity && (speed[0] = pointer[0] - (p[2] - this.options.scrollSensitivity)), pointer[1] > p[3] - this.options.scrollSensitivity && (speed[1] = pointer[1] - (p[3] - this.options.scrollSensitivity)), this.startScrolling(speed)
            }
            Prototype.Browser.WebKit && window.scrollBy(0, 0), Event.stop(event)
        },
        finishDrag: function(e, t) {
            if (this.dragging = !1, this.options.quiet) {
                Position.prepare();
                var n = [Event.pointerX(e), Event.pointerY(e)];
                Droppables.show(n, this.element)
            }
            this.options.ghosting && (this._originallyAbsolute || Position.relativize(this.element), delete this._originallyAbsolute, Element.remove(this._clone), this._clone = null);
            var i = !1;
            t && (i = Droppables.fire(e, this.element), i || (i = !1)), i && this.options.onDropped && this.options.onDropped(this.element), Draggables.notify("onEnd", this, e);
            var o = this.options.revert;
            o && Object.isFunction(o) && (o = o(this.element));
            var s = this.currentDelta();
            o && this.options.reverteffect ? (0 == i || "failure" != o) && this.options.reverteffect(this.element, s[1] - this.delta[1], s[0] - this.delta[0]) : this.delta = s, this.options.zindex && (this.element.style.zIndex = this.originalZ), this.options.endeffect && this.options.endeffect(this.element), Draggables.deactivate(this), Droppables.reset()
        },
        keyPress: function(e) {
            e.keyCode == Event.KEY_ESC && (this.finishDrag(e, !1), Event.stop(e))
        },
        endDrag: function(e) {
            this.dragging && (this.stopScrolling(), this.finishDrag(e, !0), Event.stop(e))
        },
        draw: function(e) {
            var t = this.element.cumulativeOffset();
            if (this.options.ghosting) {
                var n = Position.realOffset(this.element);
                t[0] += n[0] - Position.deltaX, t[1] += n[1] - Position.deltaY
            }
            var i = this.currentDelta();
            t[0] -= i[0], t[1] -= i[1], this.options.scroll && this.options.scroll != window && this._isScrollChild && (t[0] -= this.options.scroll.scrollLeft - this.originalScrollLeft, t[1] -= this.options.scroll.scrollTop - this.originalScrollTop);
            var o = [0, 1].map(function(n) {
                return e[n] - t[n] - this.offset[n]
            }.bind(this));
            this.options.snap && (o = Object.isFunction(this.options.snap) ? this.options.snap(o[0], o[1], this) : o.map(Object.isArray(this.options.snap) ? function(e, t) {
                return (e / this.options.snap[t]).round() * this.options.snap[t]
            }.bind(this) : function(e) {
                return (e / this.options.snap).round() * this.options.snap
            }.bind(this)));
            var s = this.element.style;
            this.options.constraint && "horizontal" != this.options.constraint || (s.left = o[0] + "px"), this.options.constraint && "vertical" != this.options.constraint || (s.top = o[1] + "px"), "hidden" == s.visibility && (s.visibility = "")
        },
        stopScrolling: function() {
            this.scrollInterval && (clearInterval(this.scrollInterval), this.scrollInterval = null, Draggables._lastScrollPointer = null)
        },
        startScrolling: function(e) {
            (e[0] || e[1]) && (this.scrollSpeed = [e[0] * this.options.scrollSpeed, e[1] * this.options.scrollSpeed], this.lastScrolled = new Date, this.scrollInterval = setInterval(this.scroll.bind(this), 10))
        },
        scroll: function() {
            var current = new Date,
                delta = current - this.lastScrolled;
            if (this.lastScrolled = current, this.options.scroll == window) {
                with(this._getWindowScroll(this.options.scroll)) if (this.scrollSpeed[0] || this.scrollSpeed[1]) {
                    var d = delta / 1e3;
                    this.options.scroll.scrollTo(left + d * this.scrollSpeed[0], top + d * this.scrollSpeed[1])
                }
            } else this.options.scroll.scrollLeft += this.scrollSpeed[0] * delta / 1e3, this.options.scroll.scrollTop += this.scrollSpeed[1] * delta / 1e3;
            Position.prepare(), Droppables.show(Draggables._lastPointer, this.element), Draggables.notify("onDrag", this), this._isScrollChild && (Draggables._lastScrollPointer = Draggables._lastScrollPointer || $A(Draggables._lastPointer), Draggables._lastScrollPointer[0] += this.scrollSpeed[0] * delta / 1e3, Draggables._lastScrollPointer[1] += this.scrollSpeed[1] * delta / 1e3, Draggables._lastScrollPointer[0] < 0 && (Draggables._lastScrollPointer[0] = 0), Draggables._lastScrollPointer[1] < 0 && (Draggables._lastScrollPointer[1] = 0), this.draw(Draggables._lastScrollPointer)), this.options.change && this.options.change(this)
        },
        _getWindowScroll: function(w) {
            var T, L, W, H;
            with(w.document) w.document.documentElement && documentElement.scrollTop ? (T = documentElement.scrollTop, L = documentElement.scrollLeft) : w.document.body && (T = body.scrollTop, L = body.scrollLeft), w.innerWidth ? (W = w.innerWidth, H = w.innerHeight) : w.document.documentElement && documentElement.clientWidth ? (W = documentElement.clientWidth, H = documentElement.clientHeight) : (W = body.offsetWidth, H = body.offsetHeight);
            return {
                top: T,
                left: L,
                width: W,
                height: H
            }
        }
    });
Draggable._dragging = {};
var SortableObserver = Class.create({
        initialize: function(e, t) {
            this.element = $(e), this.observer = t, this.lastValue = Sortable.serialize(this.element)
        },
        onStart: function() {
            this.lastValue = Sortable.serialize(this.element)
        },
        onEnd: function() {
            Sortable.unmark(), this.lastValue != Sortable.serialize(this.element) && this.observer(this.element)
        }
    }),
    Sortable = {
        SERIALIZE_RULE: /^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,
        sortables: {},
        _findRootElement: function(e) {
            for (;
                "BODY" != e.tagName.toUpperCase();) {
                if (e.id && Sortable.sortables[e.id]) return e;
                e = e.parentNode
            }
        },
        options: function(e) {
            return (e = Sortable._findRootElement($(e))) ? Sortable.sortables[e.id] : void 0
        },
        destroy: function(e) {
            e = $(e);
            var t = Sortable.sortables[e.id];
            t && (Draggables.removeObserver(t.element), t.droppables.each(function(e) {
                Droppables.remove(e)
            }), t.draggables.invoke("destroy"), delete Sortable.sortables[t.element.id])
        },
        create: function(e) {
            e = $(e);
            var t = Object.extend({
                element: e,
                tag: "li",
                dropOnEmpty: !1,
                tree: !1,
                treeTag: "ul",
                overlap: "vertical",
                constraint: "vertical",
                containment: e,
                handle: !1,
                only: !1,
                delay: 0,
                hoverclass: null,
                ghosting: !1,
                quiet: !1,
                scroll: !1,
                scrollSensitivity: 20,
                scrollSpeed: 15,
                format: this.SERIALIZE_RULE,
                elements: !1,
                handles: !1,
                onChange: Prototype.emptyFunction,
                onUpdate: Prototype.emptyFunction
            }, arguments[1] || {});
            this.destroy(e);
            var n = {
                revert: !0,
                quiet: t.quiet,
                scroll: t.scroll,
                scrollSpeed: t.scrollSpeed,
                scrollSensitivity: t.scrollSensitivity,
                delay: t.delay,
                ghosting: t.ghosting,
                constraint: t.constraint,
                handle: t.handle
            };
            t.starteffect && (n.starteffect = t.starteffect), t.reverteffect ? n.reverteffect = t.reverteffect : t.ghosting && (n.reverteffect = function(e) {
                e.style.top = 0, e.style.left = 0
            }), t.endeffect && (n.endeffect = t.endeffect), t.zindex && (n.zindex = t.zindex);
            var i = {
                    overlap: t.overlap,
                    containment: t.containment,
                    tree: t.tree,
                    hoverclass: t.hoverclass,
                    onHover: Sortable.onHover
                },
                o = {
                    onHover: Sortable.onEmptyHover,
                    overlap: t.overlap,
                    containment: t.containment,
                    hoverclass: t.hoverclass
                };
            Element.cleanWhitespace(e), t.draggables = [], t.droppables = [], (t.dropOnEmpty || t.tree) && (Droppables.add(e, o), t.droppables.push(e)), (t.elements || this.findElements(e, t) || []).each(function(o, s) {
                var r = t.handles ? $(t.handles[s]) : t.handle ? $(o).select("." + t.handle)[0] : o;
                t.draggables.push(new Draggable(o, Object.extend(n, {
                    handle: r
                }))), Droppables.add(o, i), t.tree && (o.treeNode = e), t.droppables.push(o)
            }), t.tree && (Sortable.findTreeElements(e, t) || []).each(function(n) {
                Droppables.add(n, o), n.treeNode = e, t.droppables.push(n)
            }), this.sortables[e.identify()] = t, Draggables.addObserver(new SortableObserver(e, t.onUpdate))
        },
        findElements: function(e, t) {
            return Element.findChildren(e, t.only, t.tree ? !0 : !1, t.tag)
        },
        findTreeElements: function(e, t) {
            return Element.findChildren(e, t.only, t.tree ? !0 : !1, t.treeTag)
        },
        onHover: function(e, t, n) {
            if (!(Element.isParent(t, e) || n > .33 && .66 > n && Sortable.options(t).tree))
                if (n > .5) {
                    if (Sortable.mark(t, "before"), t.previousSibling != e) {
                        var i = e.parentNode;
                        e.style.visibility = "hidden", t.parentNode.insertBefore(e, t), t.parentNode != i && Sortable.options(i).onChange(e), Sortable.options(t.parentNode).onChange(e)
                    }
                } else {
                    Sortable.mark(t, "after");
                    var o = t.nextSibling || null;
                    if (o != e) {
                        var i = e.parentNode;
                        e.style.visibility = "hidden", t.parentNode.insertBefore(e, o), t.parentNode != i && Sortable.options(i).onChange(e), Sortable.options(t.parentNode).onChange(e)
                    }
                }
        },
        onEmptyHover: function(e, t, n) {
            var i = e.parentNode,
                o = Sortable.options(t);
            if (!Element.isParent(t, e)) {
                var s, r = Sortable.findElements(t, {
                        tag: o.tag,
                        only: o.only
                    }),
                    a = null;
                if (r) {
                    var l = Element.offsetSize(t, o.overlap) * (1 - n);
                    for (s = 0; s < r.length; s += 1) {
                        if (!(l - Element.offsetSize(r[s], o.overlap) >= 0)) {
                            if (l - Element.offsetSize(r[s], o.overlap) / 2 >= 0) {
                                a = s + 1 < r.length ? r[s + 1] : null;
                                break
                            }
                            a = r[s];
                            break
                        }
                        l -= Element.offsetSize(r[s], o.overlap)
                    }
                }
                t.insertBefore(e, a), Sortable.options(i).onChange(e), o.onChange(e)
            }
        },
        unmark: function() {
            Sortable._marker && Sortable._marker.hide()
        },
        mark: function(e, t) {
            var n = Sortable.options(e.parentNode);
            if (!n || n.ghosting) {
                Sortable._marker || (Sortable._marker = ($("dropmarker") || Element.extend(document.createElement("DIV"))).hide().addClassName("dropmarker").setStyle({
                    position: "absolute"
                }), document.getElementsByTagName("body").item(0).appendChild(Sortable._marker));
                var i = e.cumulativeOffset();
                Sortable._marker.setStyle({
                    left: i[0] + "px",
                    top: i[1] + "px"
                }), "after" == t && Sortable._marker.setStyle("horizontal" == n.overlap ? {
                    left: i[0] + e.clientWidth + "px"
                } : {
                    top: i[1] + e.clientHeight + "px"
                }), Sortable._marker.show()
            }
        },
        _tree: function(e, t, n) {
            for (var i = Sortable.findElements(e, t) || [], o = 0; o < i.length; ++o) {
                var s = i[o].id.match(t.format);
                if (s) {
                    var r = {
                        id: encodeURIComponent(s ? s[1] : null),
                        element: e,
                        parent: n,
                        children: [],
                        position: n.children.length,
                        container: $(i[o]).down(t.treeTag)
                    };
                    r.container && this._tree(r.container, t, r), n.children.push(r)
                }
            }
            return n
        },
        tree: function(e) {
            e = $(e);
            var t = this.options(e),
                n = Object.extend({
                    tag: t.tag,
                    treeTag: t.treeTag,
                    only: t.only,
                    name: e.id,
                    format: t.format
                }, arguments[1] || {}),
                i = {
                    id: null,
                    parent: null,
                    children: [],
                    container: e,
                    position: 0
                };
            return Sortable._tree(e, n, i)
        },
        _constructIndex: function(e) {
            var t = "";
            do e.id && (t = "[" + e.position + "]" + t); while (null != (e = e.parent));
            return t
        },
        sequence: function(e) {
            e = $(e);
            var t = Object.extend(this.options(e), arguments[1] || {});
            return $(this.findElements(e, t) || []).map(function(e) {
                return e.id.match(t.format) ? e.id.match(t.format)[1] : ""
            })
        },
        setSequence: function(e, t) {
            e = $(e);
            var n = Object.extend(this.options(e), arguments[2] || {}),
                i = {};
            this.findElements(e, n).each(function(e) {
                e.id.match(n.format) && (i[e.id.match(n.format)[1]] = [e, e.parentNode]), e.parentNode.removeChild(e)
            }), t.each(function(e) {
                var t = i[e];
                t && (t[1].appendChild(t[0]), delete i[e])
            })
        },
        serialize: function(e) {
            e = $(e);
            var t = Object.extend(Sortable.options(e), arguments[1] || {}),
                n = encodeURIComponent(arguments[1] && arguments[1].name ? arguments[1].name : e.id);
            return t.tree ? Sortable.tree(e, arguments[1]).children.map(function(e) {
                return [n + Sortable._constructIndex(e) + "[id]=" + encodeURIComponent(e.id)].concat(e.children.map(arguments.callee))
            }).flatten().join("&") : Sortable.sequence(e, arguments[1]).map(function(e) {
                return n + "[]=" + encodeURIComponent(e)
            }).join("&")
        }
    };
Element.isParent = function(e, t) {
    return e.parentNode && e != t ? e.parentNode == t ? !0 : Element.isParent(e.parentNode, t) : !1
}, Element.findChildren = function(e, t, n, i) {
    if (!e.hasChildNodes()) return null;
    i = i.toUpperCase(), t && (t = [t].flatten());
    var o = [];
    return $A(e.childNodes).each(function(e) {
        if (!e.tagName || e.tagName.toUpperCase() != i || t && !Element.classNames(e).detect(function(e) {
                return t.include(e)
            }) || o.push(e), n) {
            var s = Element.findChildren(e, t, n, i);
            s && o.push(s)
        }
    }), o.length > 0 ? o.flatten() : []
}, Element.offsetSize = function(e, t) {
    return e["offset" + ("vertical" == t || "height" == t ? "Height" : "Width")]
};
var Builder = {
    NODEMAP: {
        AREA: "map",
        CAPTION: "table",
        COL: "table",
        COLGROUP: "table",
        LEGEND: "fieldset",
        OPTGROUP: "select",
        OPTION: "select",
        PARAM: "object",
        TBODY: "table",
        TD: "table",
        TFOOT: "table",
        TH: "table",
        THEAD: "table",
        TR: "table"
    },
    node: function(e) {
        e = e.toUpperCase();
        var t = this.NODEMAP[e] || "div",
            n = document.createElement(t);
        try {
            n.innerHTML = "<" + e + "></" + e + ">"
        } catch (i) {}
        var o = n.firstChild || null;
        if (o && o.tagName.toUpperCase() != e && (o = o.getElementsByTagName(e)[0]), o || (o = document.createElement(e)), o) {
            if (arguments[1])
                if (this._isStringOrNumber(arguments[1]) || arguments[1] instanceof Array || arguments[1].tagName) this._children(o, arguments[1]);
                else {
                    var s = this._attributes(arguments[1]);
                    if (s.length) {
                        try {
                            n.innerHTML = "<" + e + " " + s + "></" + e + ">"
                        } catch (i) {}
                        if (o = n.firstChild || null, !o) {
                            o = document.createElement(e);
                            for (attr in arguments[1]) o["class" == attr ? "className" : attr] = arguments[1][attr]
                        }
                        o.tagName.toUpperCase() != e && (o = n.getElementsByTagName(e)[0])
                    }
                }
            return arguments[2] && this._children(o, arguments[2]), $(o)
        }
    },
    _text: function(e) {
        return document.createTextNode(e)
    },
    ATTR_MAP: {
        className: "class",
        htmlFor: "for"
    },
    _attributes: function(e) {
        var t = [];
        for (attribute in e) t.push((attribute in this.ATTR_MAP ? this.ATTR_MAP[attribute] : attribute) + '="' + e[attribute].toString().escapeHTML().gsub(/"/, "&quot;") + '"');
        return t.join(" ")
    },
    _children: function(e, t) {
        return t.tagName ? void e.appendChild(t) : void("object" == typeof t ? t.flatten().each(function(t) {
            "object" == typeof t ? e.appendChild(t) : Builder._isStringOrNumber(t) && e.appendChild(Builder._text(t))
        }) : Builder._isStringOrNumber(t) && e.appendChild(Builder._text(t)))
    },
    _isStringOrNumber: function(e) {
        return "string" == typeof e || "number" == typeof e
    },
    build: function(e) {
        var t = this.node("div");
        return $(t).update(e.strip()), t.down()
    },
    dump: function(e) {
        "object" != typeof e && "function" != typeof e && (e = window);
        var t = "A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR".split(/\s+/);
        t.each(function(t) {
            e[t] = function() {
                return Builder.node.apply(Builder, [t].concat($A(arguments)))
            }
        })
    }
};
if ("undefined" == typeof Effect) throw "controls.js requires including script.aculo.us' effects.js library";
var Autocompleter = {};
if (Autocompleter.Base = Class.create({
        baseInitialize: function(e, t, n) {
            e = $(e), this.element = e, this.update = $(t), this.hasFocus = !1, this.changed = !1, this.active = !1, this.index = 0, this.entryCount = 0, this.oldElementValue = this.element.value, this.setOptions ? this.setOptions(n) : this.options = n || {}, this.options.paramName = this.options.paramName || this.element.name, this.options.tokens = this.options.tokens || [], this.options.frequency = this.options.frequency || .4, this.options.minChars = this.options.minChars || 1, this.options.onShow = this.options.onShow || function(e, t) {
                t.style.position && "absolute" != t.style.position || (t.style.position = "absolute", Position.clone(e, t, {
                    setHeight: !1,
                    offsetTop: e.offsetHeight
                })), Effect.Appear(t, {
                    duration: .15
                })
            }, this.options.onHide = this.options.onHide || function(e, t) {
                new Effect.Fade(t, {
                    duration: .15
                })
            }, "string" == typeof this.options.tokens && (this.options.tokens = new Array(this.options.tokens)), this.options.tokens.include("\n") || this.options.tokens.push("\n"), this.observer = null, this.element.setAttribute("autocomplete", "off"), Element.hide(this.update), Event.observe(this.element, "blur", this.onBlur.bindAsEventListener(this)), Event.observe(this.element, "keydown", this.onKeyPress.bindAsEventListener(this))
        },
        show: function() {
            "none" == Element.getStyle(this.update, "display") && this.options.onShow(this.element, this.update), !this.iefix && Prototype.Browser.IE && "absolute" == Element.getStyle(this.update, "position") && (new Insertion.After(this.update, '<iframe id="' + this.update.id + '_iefix" style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" src="javascript:false;" frameborder="0" scrolling="no"></iframe>'), this.iefix = $(this.update.id + "_iefix")), this.iefix && setTimeout(this.fixIEOverlapping.bind(this), 50)
        },
        fixIEOverlapping: function() {
            Position.clone(this.update, this.iefix, {
                setTop: !this.update.style.height
            }), this.iefix.style.zIndex = 1, this.update.style.zIndex = 2, Element.show(this.iefix)
        },
        hide: function() {
            this.stopIndicator(), "none" != Element.getStyle(this.update, "display") && this.options.onHide(this.element, this.update), this.iefix && Element.hide(this.iefix)
        },
        startIndicator: function() {
            this.options.indicator && Element.show(this.options.indicator)
        },
        stopIndicator: function() {
            this.options.indicator && Element.hide(this.options.indicator)
        },
        onKeyPress: function(e) {
            if (this.active) switch (e.keyCode) {
                case Event.KEY_TAB:
                case Event.KEY_RETURN:
                    this.selectEntry(), Event.stop(e);
                case Event.KEY_ESC:
                    return this.hide(), this.active = !1, void Event.stop(e);
                case Event.KEY_LEFT:
                case Event.KEY_RIGHT:
                    return;
                case Event.KEY_UP:
                    return this.markPrevious(), this.render(), void Event.stop(e);
                case Event.KEY_DOWN:
                    return this.markNext(), this.render(), void Event.stop(e)
            } else if (e.keyCode == Event.KEY_TAB || e.keyCode == Event.KEY_RETURN || Prototype.Browser.WebKit > 0 && 0 == e.keyCode) return;
            this.changed = !0, this.hasFocus = !0, this.observer && clearTimeout(this.observer), this.observer = setTimeout(this.onObserverEvent.bind(this), 1e3 * this.options.frequency)
        },
        activate: function() {
            this.changed = !1, this.hasFocus = !0, this.getUpdatedChoices()
        },
        onHover: function(e) {
            var t = Event.findElement(e, "LI");
            this.index != t.autocompleteIndex && (this.index = t.autocompleteIndex, this.render()), Event.stop(e)
        },
        onClick: function(e) {
            var t = Event.findElement(e, "LI");
            this.index = t.autocompleteIndex, this.selectEntry(), this.hide()
        },
        onBlur: function() {
            setTimeout(this.hide.bind(this), 250), this.hasFocus = !1, this.active = !1
        },
        render: function() {
            if (this.entryCount > 0) {
                for (var e = 0; e < this.entryCount; e++) this.index == e ? Element.addClassName(this.getEntry(e), "selected") : Element.removeClassName(this.getEntry(e), "selected");
                this.hasFocus && (this.show(), this.active = !0)
            } else this.active = !1, this.hide()
        },
        markPrevious: function() {
            this.index > 0 ? this.index-- : this.index = this.entryCount - 1, this.getEntry(this.index).scrollIntoView(!0)
        },
        markNext: function() {
            this.index < this.entryCount - 1 ? this.index++ : this.index = 0, this.getEntry(this.index).scrollIntoView(!1)
        },
        getEntry: function(e) {
            return this.update.firstChild.childNodes[e]
        },
        getCurrentEntry: function() {
            return this.getEntry(this.index)
        },
        selectEntry: function() {
            this.active = !1, this.updateElement(this.getCurrentEntry())
        },
        updateElement: function(e) {
            if (this.options.updateElement) return void this.options.updateElement(e);
            var t = "";
            if (this.options.select) {
                var n = $(e).select("." + this.options.select) || [];
                n.length > 0 && (t = Element.collectTextNodes(n[0], this.options.select))
            } else t = Element.collectTextNodesIgnoreClass(e, "informal");
            var i = this.getTokenBounds();
            if (-1 != i[0]) {
                var o = this.element.value.substr(0, i[0]),
                    s = this.element.value.substr(i[0]).match(/^\s+/);
                s && (o += s[0]), this.element.value = o + t + this.element.value.substr(i[1])
            } else this.element.value = t;
            this.oldElementValue = this.element.value, this.element.focus(), this.options.afterUpdateElement && this.options.afterUpdateElement(this.element, e)
        },
        updateChoices: function(e) {
            if (!this.changed && this.hasFocus) {
                if (this.update.innerHTML = e, Element.cleanWhitespace(this.update), Element.cleanWhitespace(this.update.down()), this.update.firstChild && this.update.down().childNodes) {
                    this.entryCount = this.update.down().childNodes.length;
                    for (var t = 0; t < this.entryCount; t++) {
                        var n = this.getEntry(t);
                        n.autocompleteIndex = t, this.addObservers(n)
                    }
                } else this.entryCount = 0;
                this.stopIndicator(), this.index = 0, 1 == this.entryCount && this.options.autoSelect ? (this.selectEntry(), this.hide()) : this.render()
            }
        },
        addObservers: function(e) {
            Event.observe(e, "mouseover", this.onHover.bindAsEventListener(this)), Event.observe(e, "click", this.onClick.bindAsEventListener(this))
        },
        onObserverEvent: function() {
            this.changed = !1, this.tokenBounds = null, this.getToken().length >= this.options.minChars ? this.getUpdatedChoices() : (this.active = !1, this.hide()), this.oldElementValue = this.element.value
        },
        getToken: function() {
            var e = this.getTokenBounds();
            return this.element.value.substring(e[0], e[1]).strip()
        },
        getTokenBounds: function() {
            if (null != this.tokenBounds) return this.tokenBounds;
            var e = this.element.value;
            if (e.strip().empty()) return [-1, 0];
            for (var t, n = arguments.callee.getFirstDifferencePos(e, this.oldElementValue), i = n == this.oldElementValue.length ? 1 : 0, o = -1, s = e.length, r = 0, a = this.options.tokens.length; a > r; ++r) t = e.lastIndexOf(this.options.tokens[r], n + i - 1), t > o && (o = t), t = e.indexOf(this.options.tokens[r], n + i), -1 != t && s > t && (s = t);
            return this.tokenBounds = [o + 1, s]
        }
    }), Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos = function(e, t) {
        for (var n = Math.min(e.length, t.length), i = 0; n > i; ++i)
            if (e[i] != t[i]) return i;
        return n
    }, Ajax.Autocompleter = Class.create(Autocompleter.Base, {
        initialize: function(e, t, n, i) {
            this.baseInitialize(e, t, i), this.options.asynchronous = !0, this.options.onComplete = this.onComplete.bind(this), this.options.defaultParams = this.options.parameters || null, this.url = n
        },
        getUpdatedChoices: function() {
            this.startIndicator();
            var e = encodeURIComponent(this.options.paramName) + "=" + encodeURIComponent(this.getToken());
            this.options.parameters = this.options.callback ? this.options.callback(this.element, e) : e, this.options.defaultParams && (this.options.parameters += "&" + this.options.defaultParams), new Ajax.Request(this.url, this.options)
        },
        onComplete: function(e) {
            this.updateChoices(e.responseText)
        }
    }), Autocompleter.Local = Class.create(Autocompleter.Base, {
        initialize: function(e, t, n, i) {
            this.baseInitialize(e, t, i), this.options.array = n
        },
        getUpdatedChoices: function() {
            this.updateChoices(this.options.selector(this))
        },
        setOptions: function(e) {
            this.options = Object.extend({
                choices: 10,
                partialSearch: !0,
                partialChars: 2,
                ignoreCase: !0,
                fullSearch: !1,
                selector: function(e) {
                    for (var t = [], n = [], i = e.getToken(), o = 0; o < e.options.array.length && t.length < e.options.choices; o++)
                        for (var s = e.options.array[o], r = e.options.ignoreCase ? s.toLowerCase().indexOf(i.toLowerCase()) : s.indexOf(i); - 1 != r;) {
                            if (0 == r && s.length != i.length) {
                                t.push("<li><strong>" + s.substr(0, i.length) + "</strong>" + s.substr(i.length) + "</li>");
                                break
                            }
                            if (i.length >= e.options.partialChars && e.options.partialSearch && -1 != r && (e.options.fullSearch || /\s/.test(s.substr(r - 1, 1)))) {
                                n.push("<li>" + s.substr(0, r) + "<strong>" + s.substr(r, i.length) + "</strong>" + s.substr(r + i.length) + "</li>");
                                break
                            }
                            r = e.options.ignoreCase ? s.toLowerCase().indexOf(i.toLowerCase(), r + 1) : s.indexOf(i, r + 1)
                        }
                    return n.length && (t = t.concat(n.slice(0, e.options.choices - t.length))), "<ul>" + t.join("") + "</ul>"
                }
            }, e || {})
        }
    }), Field.scrollFreeActivate = function(e) {
        setTimeout(function() {
            Field.activate(e)
        }, 1)
    }, Ajax.InPlaceEditor = Class.create({
        initialize: function(e, t, n) {
            this.url = t, this.element = e = $(e), this.prepareOptions(), this._controls = {}, arguments.callee.dealWithDeprecatedOptions(n), Object.extend(this.options, n || {}), !this.options.formId && this.element.id && (this.options.formId = this.element.id + "-inplaceeditor", $(this.options.formId) && (this.options.formId = "")), this.options.externalControl && (this.options.externalControl = $(this.options.externalControl)), this.options.externalControl || (this.options.externalControlOnly = !1), this._originalBackground = this.element.getStyle("background-color") || "transparent", this.element.title = this.options.clickToEditText, this._boundCancelHandler = this.handleFormCancellation.bind(this), this._boundComplete = (this.options.onComplete || Prototype.emptyFunction).bind(this), this._boundFailureHandler = this.handleAJAXFailure.bind(this), this._boundSubmitHandler = this.handleFormSubmission.bind(this), this._boundWrapperHandler = this.wrapUp.bind(this), this.registerListeners()
        },
        checkForEscapeOrReturn: function(e) {
            !this._editing || e.ctrlKey || e.altKey || e.shiftKey || (Event.KEY_ESC == e.keyCode ? this.handleFormCancellation(e) : Event.KEY_RETURN == e.keyCode && this.handleFormSubmission(e))
        },
        createControl: function(e, t, n) {
            var i = this.options[e + "Control"],
                o = this.options[e + "Text"];
            if ("button" == i) {
                var s = document.createElement("input");
                s.type = "submit", s.value = o, s.className = "editor_" + e + "_button", "cancel" == e && (s.onclick = this._boundCancelHandler), this._form.appendChild(s), this._controls[e] = s
            } else if ("link" == i) {
                var r = document.createElement("a");
                r.href = "#", r.appendChild(document.createTextNode(o)), r.onclick = "cancel" == e ? this._boundCancelHandler : this._boundSubmitHandler, r.className = "editor_" + e + "_link", n && (r.className += " " + n), this._form.appendChild(r), this._controls[e] = r
            }
        },
        createEditField: function() {
            var e, t = this.options.loadTextURL ? this.options.loadingText : this.getText();
            if (1 >= this.options.rows && !/\r|\n/.test(this.getText())) {
                e = document.createElement("input"), e.type = "text";
                var n = this.options.size || this.options.cols || 0;
                n > 0 && (e.size = n)
            } else e = document.createElement("textarea"), e.rows = 1 >= this.options.rows ? this.options.autoRows : this.options.rows, e.cols = this.options.cols || 40;
            e.name = this.options.paramName, e.value = t, e.className = "editor_field", this.options.submitOnBlur && (e.onblur = this._boundSubmitHandler), this._controls.editor = e, this.options.loadTextURL && this.loadExternalText(), this._form.appendChild(this._controls.editor)
        },
        createForm: function() {
            function e(e, n) {
                var i = t.options["text" + e + "Controls"];
                i && n !== !1 && t._form.appendChild(document.createTextNode(i))
            }
            var t = this;
            this._form = $(document.createElement("form")), this._form.id = this.options.formId, this._form.addClassName(this.options.formClassName), this._form.onsubmit = this._boundSubmitHandler, this.createEditField(), "textarea" == this._controls.editor.tagName.toLowerCase() && this._form.appendChild(document.createElement("br")), this.options.onFormCustomization && this.options.onFormCustomization(this, this._form), e("Before", this.options.okControl || this.options.cancelControl), this.createControl("ok", this._boundSubmitHandler), e("Between", this.options.okControl && this.options.cancelControl), this.createControl("cancel", this._boundCancelHandler, "editor_cancel"), e("After", this.options.okControl || this.options.cancelControl)
        },
        destroy: function() {
            this._oldInnerHTML && (this.element.innerHTML = this._oldInnerHTML), this.leaveEditMode(), this.unregisterListeners()
        },
        enterEditMode: function(e) {
            this._saving || this._editing || (this._editing = !0, this.triggerCallback("onEnterEditMode"), this.options.externalControl && this.options.externalControl.hide(), this.element.hide(), this.createForm(), this.element.parentNode.insertBefore(this._form, this.element), this.options.loadTextURL || this.postProcessEditField(), e && Event.stop(e))
        },
        enterHover: function() {
            this.options.hoverClassName && this.element.addClassName(this.options.hoverClassName), this._saving || this.triggerCallback("onEnterHover")
        },
        getText: function() {
            return this.element.innerHTML.unescapeHTML()
        },
        handleAJAXFailure: function(e) {
            this.triggerCallback("onFailure", e), this._oldInnerHTML && (this.element.innerHTML = this._oldInnerHTML, this._oldInnerHTML = null)
        },
        handleFormCancellation: function(e) {
            this.wrapUp(), e && Event.stop(e)
        },
        handleFormSubmission: function(e) {
            var t = this._form,
                n = $F(this._controls.editor);
            this.prepareSubmission();
            var i = this.options.callback(t, n) || "";
            if (Object.isString(i) && (i = i.toQueryParams()), i.editorId = this.element.id, this.options.htmlResponse) {
                var o = Object.extend({
                    evalScripts: !0
                }, this.options.ajaxOptions);
                Object.extend(o, {
                    parameters: i,
                    onComplete: this._boundWrapperHandler,
                    onFailure: this._boundFailureHandler
                }), new Ajax.Updater({
                    success: this.element
                }, this.url, o)
            } else {
                var o = Object.extend({
                    method: "get"
                }, this.options.ajaxOptions);
                Object.extend(o, {
                    parameters: i,
                    onComplete: this._boundWrapperHandler,
                    onFailure: this._boundFailureHandler
                }), new Ajax.Request(this.url, o)
            }
            e && Event.stop(e)
        },
        leaveEditMode: function() {
            this.element.removeClassName(this.options.savingClassName), this.removeForm(), this.leaveHover(), this.element.style.backgroundColor = this._originalBackground, this.element.show(), this.options.externalControl && this.options.externalControl.show(), this._saving = !1, this._editing = !1, this._oldInnerHTML = null, this.triggerCallback("onLeaveEditMode")
        },
        leaveHover: function() {
            this.options.hoverClassName && this.element.removeClassName(this.options.hoverClassName), this._saving || this.triggerCallback("onLeaveHover")
        },
        loadExternalText: function() {
            this._form.addClassName(this.options.loadingClassName), this._controls.editor.disabled = !0;
            var e = Object.extend({
                method: "get"
            }, this.options.ajaxOptions);
            Object.extend(e, {
                parameters: "editorId=" + encodeURIComponent(this.element.id),
                onComplete: Prototype.emptyFunction,
                onSuccess: function(e) {
                    this._form.removeClassName(this.options.loadingClassName);
                    var t = e.responseText;
                    this.options.stripLoadedTextTags && (t = t.stripTags()), this._controls.editor.value = t, this._controls.editor.disabled = !1, this.postProcessEditField()
                }.bind(this),
                onFailure: this._boundFailureHandler
            }), new Ajax.Request(this.options.loadTextURL, e)
        },
        postProcessEditField: function() {
            var e = this.options.fieldPostCreation;
            e && $(this._controls.editor)["focus" == e ? "focus" : "activate"]()
        },
        prepareOptions: function() {
            this.options = Object.clone(Ajax.InPlaceEditor.DefaultOptions), Object.extend(this.options, Ajax.InPlaceEditor.DefaultCallbacks), [this._extraDefaultOptions].flatten().compact().each(function(e) {
                Object.extend(this.options, e)
            }.bind(this))
        },
        prepareSubmission: function() {
            this._saving = !0, this.removeForm(), this.leaveHover(), this.showSaving()
        },
        registerListeners: function() {
            this._listeners = {};
            var e;
            $H(Ajax.InPlaceEditor.Listeners).each(function(t) {
                e = this[t.value].bind(this), this._listeners[t.key] = e, this.options.externalControlOnly || this.element.observe(t.key, e), this.options.externalControl && this.options.externalControl.observe(t.key, e)
            }.bind(this))
        },
        removeForm: function() {
            this._form && (this._form.remove(), this._form = null, this._controls = {})
        },
        showSaving: function() {
            this._oldInnerHTML = this.element.innerHTML, this.element.innerHTML = this.options.savingText, this.element.addClassName(this.options.savingClassName), this.element.style.backgroundColor = this._originalBackground, this.element.show()
        },
        triggerCallback: function(e, t) {
            "function" == typeof this.options[e] && this.options[e](this, t)
        },
        unregisterListeners: function() {
            $H(this._listeners).each(function(e) {
                this.options.externalControlOnly || this.element.stopObserving(e.key, e.value), this.options.externalControl && this.options.externalControl.stopObserving(e.key, e.value)
            }.bind(this))
        },
        wrapUp: function(e) {
            this.leaveEditMode(), this._boundComplete(e, this.element)
        }
    }), Object.extend(Ajax.InPlaceEditor.prototype, {
        dispose: Ajax.InPlaceEditor.prototype.destroy
    }), Ajax.InPlaceCollectionEditor = Class.create(Ajax.InPlaceEditor, {
        initialize: function($super, e, t, n) {
            this._extraDefaultOptions = Ajax.InPlaceCollectionEditor.DefaultOptions, $super(e, t, n)
        },
        createEditField: function() {
            var e = document.createElement("select");
            e.name = this.options.paramName, e.size = 1, this._controls.editor = e, this._collection = this.options.collection || [], this.options.loadCollectionURL ? this.loadCollection() : this.checkForExternalText(), this._form.appendChild(this._controls.editor)
        },
        loadCollection: function() {
            this._form.addClassName(this.options.loadingClassName), this.showLoadingText(this.options.loadingCollectionText);
            var options = Object.extend({
                method: "get"
            }, this.options.ajaxOptions);
            Object.extend(options, {
                parameters: "editorId=" + encodeURIComponent(this.element.id),
                onComplete: Prototype.emptyFunction,
                onSuccess: function(transport) {
                    var js = transport.responseText.strip();
                    if (!/^\[.*\]$/.test(js)) throw "Server returned an invalid collection representation.";
                    this._collection = eval(js), this.checkForExternalText()
                }.bind(this),
                onFailure: this.onFailure
            }), new Ajax.Request(this.options.loadCollectionURL, options)
        },
        showLoadingText: function(e) {
            this._controls.editor.disabled = !0;
            var t = this._controls.editor.firstChild;
            t || (t = document.createElement("option"), t.value = "", this._controls.editor.appendChild(t), t.selected = !0), t.update((e || "").stripScripts().stripTags())
        },
        checkForExternalText: function() {
            this._text = this.getText(), this.options.loadTextURL ? this.loadExternalText() : this.buildOptionList()
        },
        loadExternalText: function() {
            this.showLoadingText(this.options.loadingText);
            var e = Object.extend({
                method: "get"
            }, this.options.ajaxOptions);
            Object.extend(e, {
                parameters: "editorId=" + encodeURIComponent(this.element.id),
                onComplete: Prototype.emptyFunction,
                onSuccess: function(e) {
                    this._text = e.responseText.strip(), this.buildOptionList()
                }.bind(this),
                onFailure: this.onFailure
            }), new Ajax.Request(this.options.loadTextURL, e)
        },
        buildOptionList: function() {
            this._form.removeClassName(this.options.loadingClassName), this._collection = this._collection.map(function(e) {
                return 2 === e.length ? e : [e, e].flatten()
            });
            var e = "value" in this.options ? this.options.value : this._text,
                t = this._collection.any(function(t) {
                    return t[0] == e
                }.bind(this));
            this._controls.editor.update("");
            var n;
            this._collection.each(function(i, o) {
                n = document.createElement("option"), n.value = i[0], n.selected = t ? i[0] == e : 0 == o, n.appendChild(document.createTextNode(i[1])), this._controls.editor.appendChild(n)
            }.bind(this)), this._controls.editor.disabled = !1, Field.scrollFreeActivate(this._controls.editor)
        }
    }), Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions = function(e) {
        function t(t, n) {
            t in e || void 0 === n || (e[t] = n)
        }
        e && (t("cancelControl", e.cancelLink ? "link" : e.cancelButton ? "button" : e.cancelLink == e.cancelButton == 0 ? !1 : void 0), t("okControl", e.okLink ? "link" : e.okButton ? "button" : e.okLink == e.okButton == 0 ? !1 : void 0), t("highlightColor", e.highlightcolor), t("highlightEndColor", e.highlightendcolor))
    }, Object.extend(Ajax.InPlaceEditor, {
        DefaultOptions: {
            ajaxOptions: {},
            autoRows: 3,
            cancelControl: "link",
            cancelText: "cancel",
            clickToEditText: "Click to edit",
            externalControl: null,
            externalControlOnly: !1,
            fieldPostCreation: "activate",
            formClassName: "inplaceeditor-form",
            formId: null,
            highlightColor: "#ffff99",
            highlightEndColor: "#ffffff",
            hoverClassName: "",
            htmlResponse: !0,
            loadingClassName: "inplaceeditor-loading",
            loadingText: "Loading...",
            okControl: "button",
            okText: "ok",
            paramName: "value",
            rows: 1,
            savingClassName: "inplaceeditor-saving",
            savingText: "Saving...",
            size: 0,
            stripLoadedTextTags: !1,
            submitOnBlur: !1,
            textAfterControls: "",
            textBeforeControls: "",
            textBetweenControls: ""
        },
        DefaultCallbacks: {
            callback: function(e) {
                return Form.serialize(e)
            },
            onComplete: function(e, t) {
                new Effect.Highlight(t, {
                    startcolor: this.options.highlightColor,
                    keepBackgroundImage: !0
                })
            },
            onEnterEditMode: null,
            onEnterHover: function(e) {
                e.element.style.backgroundColor = e.options.highlightColor, e._effect && e._effect.cancel()
            },
            onFailure: function(e) {
                alert("Error communication with the server: " + e.responseText.stripTags())
            },
            onFormCustomization: null,
            onLeaveEditMode: null,
            onLeaveHover: function(e) {
                e._effect = new Effect.Highlight(e.element, {
                    startcolor: e.options.highlightColor,
                    endcolor: e.options.highlightEndColor,
                    restorecolor: e._originalBackground,
                    keepBackgroundImage: !0
                })
            }
        },
        Listeners: {
            click: "enterEditMode",
            keydown: "checkForEscapeOrReturn",
            mouseover: "enterHover",
            mouseout: "leaveHover"
        }
    }), Ajax.InPlaceCollectionEditor.DefaultOptions = {
        loadingCollectionText: "Loading options..."
    }, Form.Element.DelayedObserver = Class.create({
        initialize: function(e, t, n) {
            this.delay = t || .5, this.element = $(e), this.callback = n, this.timer = null, this.lastValue = $F(this.element), Event.observe(this.element, "keyup", this.delayedListener.bindAsEventListener(this))
        },
        delayedListener: function() {
            this.lastValue != $F(this.element) && (this.timer && clearTimeout(this.timer), this.timer = setTimeout(this.onTimerEvent.bind(this), 1e3 * this.delay), this.lastValue = $F(this.element))
        },
        onTimerEvent: function() {
            this.timer = null, this.callback(this.element, $F(this.element))
        }
    }), !Control) var Control = {};
Control.Slider = Class.create({
    initialize: function(e, t, n) {
        var i = this;
        this.handles = Object.isArray(e) ? e.collect(function(e) {
            return $(e)
        }) : [$(e)], this.track = $(t), this.options = n || {}, this.axis = this.options.axis || "horizontal", this.increment = this.options.increment || 1, this.step = parseInt(this.options.step || "1"), this.range = this.options.range || $R(0, 1), this.value = 0, this.values = this.handles.map(function() {
            return 0
        }), this.spans = this.options.spans ? this.options.spans.map(function(e) {
            return $(e)
        }) : !1, this.options.startSpan = $(this.options.startSpan || null), this.options.endSpan = $(this.options.endSpan || null), this.restricted = this.options.restricted || !1, this.maximum = this.options.maximum || this.range.end, this.minimum = this.options.minimum || this.range.start, this.alignX = parseInt(this.options.alignX || "0"), this.alignY = parseInt(this.options.alignY || "0"), this.trackLength = this.maximumOffset() - this.minimumOffset(), this.handleLength = this.isVertical() ? 0 != this.handles[0].offsetHeight ? this.handles[0].offsetHeight : this.handles[0].style.height.replace(/px$/, "") : 0 != this.handles[0].offsetWidth ? this.handles[0].offsetWidth : this.handles[0].style.width.replace(/px$/, ""), this.active = !1, this.dragging = !1, this.disabled = !1, this.options.disabled && this.setDisabled(), this.allowedValues = this.options.values ? this.options.values.sortBy(Prototype.K) : !1, this.allowedValues && (this.minimum = this.allowedValues.min(), this.maximum = this.allowedValues.max()), this.eventMouseDown = this.startDrag.bindAsEventListener(this), this.eventMouseUp = this.endDrag.bindAsEventListener(this), this.eventMouseMove = this.update.bindAsEventListener(this), this.handles.each(function(e, t) {
            t = i.handles.length - 1 - t, i.setValue(parseFloat((Object.isArray(i.options.sliderValue) ? i.options.sliderValue[t] : i.options.sliderValue) || i.range.start), t), e.makePositioned().observe("mousedown", i.eventMouseDown)
        }), this.track.observe("mousedown", this.eventMouseDown), document.observe("mouseup", this.eventMouseUp), document.observe("mousemove", this.eventMouseMove), this.initialized = !0
    },
    dispose: function() {
        var e = this;
        Event.stopObserving(this.track, "mousedown", this.eventMouseDown), Event.stopObserving(document, "mouseup", this.eventMouseUp), Event.stopObserving(document, "mousemove", this.eventMouseMove), this.handles.each(function(t) {
            Event.stopObserving(t, "mousedown", e.eventMouseDown)
        })
    },
    setDisabled: function() {
        this.disabled = !0
    },
    setEnabled: function() {
        this.disabled = !1
    },
    getNearestValue: function(e) {
        if (this.allowedValues) {
            if (e >= this.allowedValues.max()) return this.allowedValues.max();
            if (e <= this.allowedValues.min()) return this.allowedValues.min();
            var t = Math.abs(this.allowedValues[0] - e),
                n = this.allowedValues[0];
            return this.allowedValues.each(function(i) {
                var o = Math.abs(i - e);
                t >= o && (n = i, t = o)
            }), n
        }
        return e > this.range.end ? this.range.end : e < this.range.start ? this.range.start : e
    },
    setValue: function(e, t) {
        this.active || (this.activeHandleIdx = t || 0, this.activeHandle = this.handles[this.activeHandleIdx], this.updateStyles()), t = t || this.activeHandleIdx || 0, this.initialized && this.restricted && (t > 0 && e < this.values[t - 1] && (e = this.values[t - 1]), t < this.handles.length - 1 && e > this.values[t + 1] && (e = this.values[t + 1])), e = this.getNearestValue(e), this.values[t] = e, this.value = this.values[0], this.handles[t].style[this.isVertical() ? "top" : "left"] = this.translateToPx(e), this.drawSpans(), this.dragging && this.event || this.updateFinished()
    },
    setValueBy: function(e, t) {
        this.setValue(this.values[t || this.activeHandleIdx || 0] + e, t || this.activeHandleIdx || 0)
    },
    translateToPx: function(e) {
        return Math.round((this.trackLength - this.handleLength) / (this.range.end - this.range.start) * (e - this.range.start)) + "px"
    },
    translateToValue: function(e) {
        return e / (this.trackLength - this.handleLength) * (this.range.end - this.range.start) + this.range.start
    },
    getRange: function(e) {
        var t = this.values.sortBy(Prototype.K);
        return e = e || 0, $R(t[e], t[e + 1])
    },
    minimumOffset: function() {
        return this.isVertical() ? this.alignY : this.alignX
    },
    maximumOffset: function() {
        return this.isVertical() ? (0 != this.track.offsetHeight ? this.track.offsetHeight : this.track.style.height.replace(/px$/, "")) - this.alignY : (0 != this.track.offsetWidth ? this.track.offsetWidth : this.track.style.width.replace(/px$/, "")) - this.alignX
    },
    isVertical: function() {
        return "vertical" == this.axis
    },
    drawSpans: function() {
        var e = this;
        this.spans && $R(0, this.spans.length - 1).each(function(t) {
            e.setSpan(e.spans[t], e.getRange(t))
        }), this.options.startSpan && this.setSpan(this.options.startSpan, $R(0, this.values.length > 1 ? this.getRange(0).min() : this.value)), this.options.endSpan && this.setSpan(this.options.endSpan, $R(this.values.length > 1 ? this.getRange(this.spans.length - 1).max() : this.value, this.maximum))
    },
    setSpan: function(e, t) {
        this.isVertical() ? (e.style.top = this.translateToPx(t.start), e.style.height = this.translateToPx(t.end - t.start + this.range.start)) : (e.style.left = this.translateToPx(t.start), e.style.width = this.translateToPx(t.end - t.start + this.range.start))
    },
    updateStyles: function() {
        this.handles.each(function(e) {
            Element.removeClassName(e, "selected")
        }), Element.addClassName(this.activeHandle, "selected")
    },
    startDrag: function(e) {
        if (Event.isLeftClick(e)) {
            if (!this.disabled) {
                this.active = !0;
                var t = Event.element(e),
                    n = [Event.pointerX(e), Event.pointerY(e)],
                    i = t;
                if (i == this.track) {
                    var o = this.track.cumulativeOffset();
                    this.event = e, this.setValue(this.translateToValue((this.isVertical() ? n[1] - o[1] : n[0] - o[0]) - this.handleLength / 2));
                    var o = this.activeHandle.cumulativeOffset();
                    this.offsetX = n[0] - o[0], this.offsetY = n[1] - o[1]
                } else {
                    for (; - 1 == this.handles.indexOf(t) && t.parentNode;) t = t.parentNode;
                    if (-1 != this.handles.indexOf(t)) {
                        this.activeHandle = t, this.activeHandleIdx = this.handles.indexOf(this.activeHandle), this.updateStyles();
                        var o = this.activeHandle.cumulativeOffset();
                        this.offsetX = n[0] - o[0], this.offsetY = n[1] - o[1]
                    }
                }
            }
            Event.stop(e)
        }
    },
    update: function(e) {
        this.active && (this.dragging || (this.dragging = !0), this.draw(e), Prototype.Browser.WebKit && window.scrollBy(0, 0), Event.stop(e))
    },
    draw: function(e) {
        var t = [Event.pointerX(e), Event.pointerY(e)],
            n = this.track.cumulativeOffset();
        t[0] -= this.offsetX + n[0], t[1] -= this.offsetY + n[1], this.event = e, this.setValue(this.translateToValue(this.isVertical() ? t[1] : t[0])), this.initialized && this.options.onSlide && this.options.onSlide(this.values.length > 1 ? this.values : this.value, this)
    },
    endDrag: function(e) {
        this.active && this.dragging && (this.finishDrag(e, !0), Event.stop(e)), this.active = !1, this.dragging = !1
    },
    finishDrag: function() {
        this.active = !1, this.dragging = !1, this.updateFinished()
    },
    updateFinished: function() {
        this.initialized && this.options.onChange && this.options.onChange(this.values.length > 1 ? this.values : this.value, this), this.event = null
    }
});
var Tooltip = Class.create();
Tooltip.prototype = {
    initialize: function(e, t) {
        var n = Object.extend({
            default_css: !1,
            margin: "0px",
            padding: "5px",
            backgroundColor: "#d6d6fc",
            delta_x: 5,
            delta_y: 5,
            zindex: 1e3
        }, arguments[1] || {});
        this.element = $(e), this.tool_tip = $(t), this.options = n, this.tool_tip.hide(), this.eventMouseOver = this.showTooltip.bindAsEventListener(this), this.eventMouseOut = this.hideTooltip.bindAsEventListener(this), this.registerEvents()
    },
    destroy: function() {
        Event.stopObserving(this.element, "mouseover", this.eventMouseOver), Event.stopObserving(this.element, "mouseout", this.eventMouseOut)
    },
    registerEvents: function() {
        Event.observe(this.element, "mouseover", this.eventMouseOver), Event.observe(this.element, "mouseout", this.eventMouseOut)
    },
    showTooltip: function(e) {
        Event.stop(e);
        var t = Event.pointerX(e),
            n = Event.pointerY(e),
            i = Element.getDimensions(this.tool_tip),
            o = i.width,
            s = i.height;
        o + t >= this.getWindowWidth() - this.options.delta_x ? (t -= o, t -= this.options.delta_x) : t += this.options.delta_x, s + n >= this.getWindowHeight() - this.options.delta_y ? (n -= s, n -= this.options.delta_y) : n += this.options.delta_y, this.setStyles(t, n), new Element.show(this.tool_tip)
    },
    setStyles: function(e, t) {
        Element.setStyle(this.tool_tip, {
            position: "absolute",
            top: t + "px",
            left: e + "px",
            zindex: this.options.zindex
        }), this.options.default_css && Element.setStyle(this.tool_tip, {
            margin: this.options.margin,
            padding: this.options.padding,
            backgroundColor: this.options.backgroundColor,
            zindex: this.options.zindex
        })
    },
    hideTooltip: function() {
        new Element.hide(this.tool_tip)
    },
    getWindowHeight: function() {
        var e;
        return e = navigator.appVersion.indexOf("MSIE") > 0 ? document.body.clientHeight : window.innerHeight
    },
    getWindowWidth: function() {
        var e;
        return e = navigator.appVersion.indexOf("MSIE") > 0 ? document.body.clientWidth : window.innerWidth
    }
};
var QF = {};
QF.common = {}, QF.pages = {}, QF.common.utils = {}, QF.common.surveys = {}, QF.common.languages = {
    current: function(e) {
        return locales[this.active()][e] ? locales[this.active()][e] : e
    },
    active: function() {
        var e = $F("language") || "en";
        return locales[e] ? e : "en"
    },
    get: function(e, t) {
        return locales[e] ? locales[e][t] : locales.en[t]
    },
    set: function(e) {
        $("language").value = $F(e), $("langForm").submit()
    }
}, QF.common.account = {
    change: function() {
        $("account-selection").submit()
    }
}, QF.common.basePage = {
    startup: function() {
        lang = QF.common.languages
    },
    init: function(e) {
        DomBuilder.apply(window), page = e, $("whatsNew") && Event.observe("whatsNew", "click", QF.common.showNews.bind(this), !1), $("accountPlans") && $$(".tooltip").each(function(e) {
            new Tooltip(e, e.id + "_tooltip")
        })
    },
    show_tooltip: function() {
        var e = this.id + "_tooltip";
        if ($(e)) {
            new Tooltip(this, "tooltip")
        }
    }
}, QF.common.showNews = function(e) {
    new QF.common.htmlLightbox("largeLB", !1, "blog").show(), Event.stop(e)
}, QF.common.utils.getQueryString = function(e) {
    for (var t = window.location.search.substring(1), n = t.split("&"), i = 0; i < n.length; i++) {
        var o = n[i].split("=");
        if (o[0] == e) return o[1]
    }
    return !1
}, QF.common.utils.surveyNameFromUri = function(e) {
    var t = e ? 1 : 0,
        n = location.href,
        i = n.substr(n.lastIndexOf("/") + t, n.length);
    return i = i.replace(/#/, "")
}, QF.common.lightbox = Base.extend({
    constructor: function(e, t) {
        this.size = e || "mediumLB", this.cssClass = t, this.fadeEffect = !0
    },
    render: function(e) {
        var t = $$("body")[0];
        $("overlay") || t.appendChild($div({
            id: "overlay",
            style: "display:none"
        })), $("lightbox") && t.removeChild($("lightbox"));
        var n = document.viewport.getDimensions(),
            i = n.height - 200,
            o = "max-height: " + i + "px;";
        this.lbWindow = $div({
            id: "lightbox",
            style: "display:none; overflow: auto;" + o,
            "class": "lightbox " + this.size + " " + this.cssClass
        }), t.appendChild(this.lbWindow), e && this.renderCommon()
    },
    renderCommon: function() {
        var e = $div({
            "class": "lightboxHeader clearfix"
        });
        e.innerHTML = "<h2 class='lightboxHeaderTitle'>" + this.title + "</h2><h3 id='lightboxCloseIcon' class='lightboxCloseWindow clickable'>X</h3>", this.lbWindow.appendChild(e), Event.observe("lightboxCloseIcon", "click", this.close.bind(this), !1)
    },
    show: function(e) {
        return this.render(e), QF.common.utils.center($("lightbox")), Element.show("overlay"), Element.show("lightbox"), this
    },
    hide: function() {
        Element.hide("overlay"), Element.hide("lightbox")
    },
    close: function(e) {
        return this.hide(), this.onClose && this.onClose(e), this
    }
}), QF.common.inlineLightbox = QF.common.lightbox.extend({
    constructor: function(e, t, n) {
        this.base(e, t), this.renderCallback = n
    },
    render: function(e) {
        this.base(e);
        var t = $div({
            id: "lightboxMain",
            "class": "lightboxMain alignLeft"
        });
        this.lbWindow.appendChild(t), this.renderCallback && this.renderCallback(t)
    }
}), QF.common.ajaxLightbox = QF.common.lightbox.extend({
    constructor: function(e) {
        this.msg = e, this.size = "mediumLB", this.cssClass = ""
    },
    render: function() {
        this.base(!1), this.lbWindow.appendChild($div({
            "class": "lightboxWait greenLB alignCenter"
        }, this.msg))
    }
}), QF.common.htmlLightbox = QF.common.lightbox.extend({
    constructor: function(e, t, n, i) {
        this.base(e, t), this.htmlFile = n, this.parameters = i
    },
    render: function(e) {
        this.base(e);
        var t = $div({
            id: "lightboxMain",
            "class": "lightboxMain alignLeft"
        });
        this.lbWindow.appendChild(t);
        var n = "file=" + this.htmlFile;
        n += this.parameters ? "&" + this.parameters : "", new Ajax.Request("/partial.php", {
            parameters: n,
            asynchronous: !1,
            method: "get",
            onSuccess: this.renderCallback.bind(this),
            onFailure: this.connError.bind(this)
        })
    },
    renderCallback: function(e) {
        $("lightboxMain").innerHTML = e.responseText;
        var t = this;
        $$(".closeLb").each(function(e) {
            Event.observe(e, "click", t.close.bindAsEventListener(t))
        }), this.onLoad && this.onLoad()
    },
    connError: function() {
        alert("connection error: refresh page")
    }
}), QF.common.accountLimitLightbox = function(e) {
    var t = e ? "feature=" + e : "";
    new QF.common.htmlLightbox("largeLB", !1, "upgrade_required", t).show()
}, QF.common.surveys.toggleState = function(e) {
    new Ajax.Request(document.location.href, {
        method: "post",
        parameters: {
            callback: "toggle_survey_state",
            survey_id: e
        },
        onSuccess: function(e) {
            QF.common.surveys.toggleStateDisplay(e.responseText)
        }
    })
}, QF.common.surveys.toggleStateDisplay = function(ret) {
    eval("var result = " + ret), ret && ($("state_" + result.id).src = result.enabled ? "/images/24-em-check.png" : "/images/24-em-cross.png", $("accountInfo") && new Ajax.Request("/surveys", {
        parameters: {
            callback: "render_account_info"
        },
        method: "post",
        onSuccess: function(e) {
            $("accountInfo").innerHTML = e.responseText
        }
    }), result.enabled ? (Element.removeClassName(result.id, "inactive"), Element.addClassName(result.id, "active")) : (Element.removeClassName(result.id, "active"), Element.addClassName(result.id, "inactive")))
};
var Url = {
    encode: function(e) {
        return escape(this._utf8_encode(e))
    },
    decode: function(e) {
        return this._utf8_decode(unescape(e))
    },
    _utf8_encode: function(e) {
        e = e.replace(/\r\n/g, "\n");
        for (var t = "", n = 0; n < e.length; n++) {
            var i = e.charCodeAt(n);
            128 > i ? t += String.fromCharCode(i) : i > 127 && 2048 > i ? (t += String.fromCharCode(i >> 6 | 192), t += String.fromCharCode(63 & i | 128)) : (t += String.fromCharCode(i >> 12 | 224), t += String.fromCharCode(i >> 6 & 63 | 128), t += String.fromCharCode(63 & i | 128))
        }
        return t
    },
    _utf8_decode: function(e) {
        for (var t = "", n = 0, i = c1 = c2 = 0; n < e.length;) i = e.charCodeAt(n), 128 > i ? (t += String.fromCharCode(i), n++) : i > 191 && 224 > i ? (c2 = e.charCodeAt(n + 1), t += String.fromCharCode((31 & i) << 6 | 63 & c2), n += 2) : (c2 = e.charCodeAt(n + 1), c3 = e.charCodeAt(n + 2), t += String.fromCharCode((15 & i) << 12 | (63 & c2) << 6 | 63 & c3), n += 3);
        return t
    }
};
QF.common.utils.center = function(e) {
    try {
        e = $(e)
    } catch (t) {
        return
    }
    var n = 0,
        i = 0;
    "number" == typeof window.innerWidth ? (n = window.innerWidth, i = window.innerHeight) : document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight) ? (n = document.documentElement.clientWidth, i = document.documentElement.clientHeight) : document.body && (document.body.clientWidth || document.body.clientHeight) && (n = document.body.clientWidth, i = document.body.clientHeight);
    var o = 0;
    document.documentElement && document.documentElement.scrollTop ? o = document.documentElement.scrollTop : document.body && document.body.scrollTop ? o = document.body.scrollTop : window.pageYOffset ? o = window.pageYOffset : window.scrollY && (o = window.scrollY);
    var s = Element.getDimensions(e),
        r = (n - s.width) / 2,
        a = 10 + o;
    r = 0 > r ? 0 : r, a = 0 > a ? 0 : a, e.style.top = a + "px"
}, AIM = {
    frame: function(e) {
        var t = "f" + Math.floor(99999 * Math.random()),
            n = document.createElement("DIV");
        n.innerHTML = '<iframe style="display:none" src="about:blank" id="' + t + '" name="' + t + '" onload="AIM.loaded(\'' + t + "')\"></iframe>", document.body.appendChild(n);
        var i = document.getElementById(t);
        return e && "function" == typeof e.onComplete && (i.onComplete = e.onComplete), t
    },
    form: function(e, t) {
        e.setAttribute("target", t)
    },
    submit: function(e, t) {
        return AIM.form(e, AIM.frame(t)), t && "function" == typeof t.onStart ? t.onStart() : !0
    },
    loaded: function(e) {
        var t = document.getElementById(e);
        if (t.contentDocument) var n = t.contentDocument;
        else if (t.contentWindow) var n = t.contentWindow.document;
        else var n = window.frames[e].document;
        "about:blank" != n.location.href && "function" == typeof t.onComplete && t.onComplete(n.body.innerHTML)
    }
}, strippx = function(e) {
    return parseInt(e.replace("px", ""), 10)
}, dragslider = function(e, t, n, i, o) {
    var s, r, a, l = strippx(e.style.left),
        c = !1,
        d = 12,
        u = 10;
    self.event && event.touches && event.preventDefault(), e.onmousemove = function(h) {
        return a = h ? h.screenX : event.screenX, self.event && event.touches && (a = h.touches[0].screenX), c ? (r = l + a - s, 0 - d - u / 2 > r && (r = 0 - d - u / 2), r > n - d - u / 2 && (r = n - d - u / 2), e.style.left = r + "px", void(document.getElementById(t).value = Math.round((r + d + u / 2) * (o - i) / n) + i)) : (s = a, void(c = !0))
    }, e.ontouchmove = e.onmousemove, e.onmouseup = function() {
        e.onmousemove = null, e.ontouchmove = null, document.onmousemove = null, document.onmouseup = null
    }, document.onmousemove = e.onmousemove, document.onmouseup = e.onmouseup, e.ontouchend = e.onmouseup
}, window.console || (window.console = {
    info: function() {},
    error: function() {},
    log: function() {}
});
var LOG = function(e) {
    window.console && window.console.log && console.log(e)
};
! function(e) {
    var t = e.onerror;
    e.onerror = function(e, n, i, o, s) {
        if ("function" == typeof ga) {
            var r = e;
            "undefined" != typeof s && "undefined" != typeof s.message && (r = s.message), r += " @ " + n + ":" + i + ":" + o, ga("send", "exception", {
                exDescription: r,
                exFatal: !1,
                appName: "Application_Name",
                appVersion: "1.0"
            })
        }
        return "function" == typeof t ? t(e, n, i, o, s) : !1
    }
}(window), Array.indexOf || (Array.prototype.indexOf = function(e) {
    for (var t = 0; t < this.length; t++)
        if (this[t] == e) return t;
    return -1
}), QF.common.basePage.startup();
var locales = {
        en: {
            language: "English",
            untitledHelpText: "Click to edit",
            dropElementsHere: "drag and drop here",
            add: "add",
            remove: "remove",
            required: "Required",
            yes: "Yes",
            no: "No",
            layout: "Layout",
            horizontal: "Horizontal",
            vertical: "Vertical",
            size: "Size",
            large: "Large",
            small: "Small",
            cantremovelanguage: "can't remove last language!",
            columns: "columns",
            delete_confirm: "Are you sure you want to delete?",
            delete_all_confirm: "This will remove all responses, please export if you want to backup existing data. Are you sure you want to delete?",
            loading: "loading... please wait",
            saving: "saving... please wait",
            drophere: "drop here",
            wantToSave: "do you want to save?",
            addItem: "add item",
            delItem: "delete item",
            copyThisField: "Copy this field",
            delThisField: "Delete this field",
            otherOption: "Other Option",
            other: "Other",
            newThread: "new thread",
            title: "title",
            message: "message",
            submit: "submit",
            cancel: "Cancel",
            reply: "reply",
            theme_name: "Theme name",
            background: "Background",
            surveyTitle: "Survey title",
            questionTitle: "Question title",
            questionSubTitle: "Question subtitle",
            fieldText: "Field text",
            border: "Border",
            color: "Color",
            typo: "Typography",
            exit: "exit",
            hover: "Hover color",
            addPage: "add new page",
            removePage: "remove current page",
            deleteAllConfirm: "are you sure you want do delete all?",
            logo: "Logo",
            image: "image",
            upload_logo: "Logo",
            upload_image_error: "invalid file (expecting .png, .gif or .jpg)",
            leavePage: "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?",
            Stars: "Stars",
            audioFile: "MP3 audio file",
            Copy: "Copy",
            Delete: "Delete",
            Options: "Options",
            Actions: "Actions:",
            Languages: "Languages",
            Pages: "Page",
            Columns: "Columns",
            Field_Properties: "Field Properties",
            Close: "Close",
            Skip_Logic: "Branch/Skip Logic",
            Jump_to_Page: "Jump to Page ",
            Image: "Upload Image",
            ok: "Ok",
            validation: "Validation",
            Text: "Text",
            Number: "Number",
            Custom: "Custom",
            Range: "Range",
            Regex: "Pattern",
            Rows: "Rows",
            showCounter: "Display Counter"
        },
        "en-gb": {
            language: "English",
            untitledHelpText: "Click to edit",
            dropElementsHere: "drag and drop here",
            add: "add",
            remove: "remove",
            required: "Required",
            yes: "Yes",
            no: "No",
            layout: "Layout",
            horizontal: "Horizontal",
            vertical: "Vertical",
            size: "Size",
            large: "Large",
            small: "Small",
            cantremovelanguage: "can't remove last language!",
            columns: "columns",
            delete_confirm: "Are you sure you want to delete?",
            delete_all_confirm: "This will remove all responses, please export if you want to backup existing data. Are you sure you want to delete?",
            loading: "loading... please wait",
            saving: "saving... please wait",
            drophere: "drop here",
            wantToSave: "do you want to save?",
            addItem: "add item",
            delItem: "delete item",
            copyThisField: "Copy this field",
            delThisField: "Delete this field",
            otherOption: "Other Option",
            other: "Other",
            newThread: "new thread",
            title: "title",
            message: "message",
            submit: "submit",
            cancel: "Cancel",
            reply: "reply",
            theme_name: "Theme name",
            background: "Background",
            surveyTitle: "Survey title",
            questionTitle: "Question title",
            questionSubTitle: "Question subtitle",
            fieldText: "Field text",
            border: "Border",
            color: "Color",
            typo: "Typography",
            exit: "exit",
            hover: "Hover color",
            addPage: "add new page",
            removePage: "remove current page",
            deleteAllConfirm: "are you sure you want do delete all?",
            logo: "Logo",
            image: "image",
            upload_logo: "Logo",
            upload_image_error: "invalid file (expecting .png, .gif or .jpg)",
            leavePage: "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?",
            Stars: "Stars",
            audioFile: "MP3 audio file",
            Copy: "Copy",
            Delete: "Delete",
            Options: "Options",
            Actions: "Actions:",
            Languages: "Languages",
            Pages: "Page",
            Columns: "Columns",
            Field_Properties: "Field Properties",
            Close: "Close",
            Skip_Logic: "Branch/Skip Logic",
            Jump_to_Page: "Jump to Page ",
            Image: "Upload Image",
            ok: "Ok",
            validation: "Validation",
            Text: "Text",
            Number: "Number",
            Custom: "Custom",
            Range: "Range",
            Regex: "Pattern",
            Rows: "Rows",
            showCounter: "Display Counter"
        },
        pt: {
            language: "Portugu\xeas",
            untitledHelpText: "Clique para editar",
            dropElementsHere: "Adicione elementos aqui",
            add: "adicionar",
            remove: "remover",
            required: "Resposta Obrigat\xf3ria",
            yes: "Sim",
            no: "N\xe3o",
            layout: "Layout",
            horizontal: "Horizontal",
            vertical: "Vertical",
            size: "Tamanho",
            large: "Grande",
            small: "Pequeno",
            cantremovelanguage: "n\xe3o pode remover o \xfaltimo idioma",
            columns: "colunas",
            delete_confirm: "Tem a certeza que quer apagar?",
            delete_all_confirm: "Todas as respostas ser\xe3o apagadas! Tem a certeza que pretende apagar?",
            loading: "aguarde...",
            saving: "a gravar... aguarde",
            drophere: "adicione aqui",
            wantToSave: "deseja gravar?",
            addItem: "adicionar item",
            delItem: "remover item",
            copyThisField: "Copiar este campo",
            delThisField: "Apagar este campo",
            otherOption: "Outra op\xe7\xe3o",
            other: "Outra:",
            newThread: "nova mensagem",
            title: "t\xedtulo",
            message: "mensagem",
            submit: "enviar",
            cancel: "Cancelar",
            reply: "responder",
            theme_name: "Nome do tema",
            background: "Fundo",
            surveyTitle: "T\xedtulo inqu\xe9rito",
            questionTitle: "T\xedtulo da pergunta",
            questionSubTitle: "Subt\xedtulo da pergunta",
            fieldText: "Texto",
            border: "Bordo",
            color: "Cor",
            typo: "Tipografia",
            exit: "sair",
            hover: "Cor hover",
            addPage: "nova p\xe1gina",
            removePage: "apagar p\xe1gina",
            deleteAllConfirm: "tem a certeza que quer apagar todos?",
            logo: "Log\xf3tipo",
            image: "Imagem",
            upload_logo: "Log\xf3tipo",
            upload_image_error: "ficheiro inv\xe1lido (extens\xf5es v\xe1lidas s\xe3o .png, .gif ou .jpg)",
            leavePage: "Tentou sair desta p\xe1gina.  Se efectuo quaisquer altera\xe7\xf5es sem clicar no bot\xe3o Gravar, as suas altera\xe7\xf5es ser\xe3o perdidas. Tem certeza de que deseja sair desta p\xe1gina?",
            Stars: "Estrelas",
            audioFile: "Ficheiro de audio MP3",
            Copy: "Copiar",
            Delete: "Apagar",
            Options: "Op\xe7\xf5es",
            Actions: "Ac\xe7\xf5es:",
            Languages: "Idiomas",
            Pages: "P\xe1gina",
            Columns: "Colunas",
            Field_Properties: "Op\xe7\xf5es",
            Close: "Fechar",
            Skip_Logic: "L\xf3gica Condicional - Saltar P\xe1ginas",
            Jump_to_Page: "Saltar para P\xe1g. ",
            Image: "Imagem",
            ok: "Ok",
            validation: "Valida\xe7\xe3o",
            Text: "Texto",
            Number: "N\xfamero",
            Custom: "Padr\xe3o",
            Range: "Intervalo",
            Regex: "Express\xe3o",
            Rows: "Linhas",
            showCounter: "Mostrar Contador"
        },
        br: {
            language: "Portugu\xeas (BR)",
            untitledHelpText: "Clique para editar",
            dropElementsHere: "adicione elementos aqui",
            add: "adicionar",
            remove: "remover",
            required: "obrigat\xf3rio",
            yes: "sim",
            no: "n\xe3o",
            layout: "Layout",
            horizontal: "Horizontal",
            vertical: "Vertical",
            size: "Tamanho",
            large: "Grande",
            small: "Pequeno",
            cantremovelanguage: "N\xe3o pode remover o \xfaltimo idioma",
            columns: "Colunas",
            delete_confirm: "Tem a certeza que quer apagar?",
            delete_all_confirm: "Todas as respostas ser\xe3o apagadas! Tem a certeza que pretende apagar?",
            loading: "aguarde...",
            saving: "a gravar... aguarde",
            drophere: "adicione aqui",
            wantToSave: "deseja gravar?",
            addItem: "adicionar item",
            delItem: "remover item",
            copyThisField: "copiar este campo",
            delThisField: "apagar este campo",
            otherOption: "Outra op\xe7\xe3o",
            other: "Outra:",
            newThread: "nova mensagem",
            title: "t\xedtulo",
            message: "mensagem",
            submit: "enviar",
            cancel: "Cancelar",
            reply: "responder",
            theme_name: "Nome do tema",
            background: "Fundo",
            surveyTitle: "T\xedtulo inqu\xe9rito",
            questionTitle: "T\xedtulo da pergunta",
            questionSubTitle: "Subt\xedtulo da pergunta",
            fieldText: "Texto",
            border: "Bordo",
            color: "Cor",
            typo: "Tipografia",
            exit: "sair",
            hover: "Cor hover",
            addPage: "nova p\xe1gina",
            removePage: "apagar p\xe1gina",
            deleteAllConfirm: "tem a certeza que quer apagar todos?",
            logo: "Log\xf3tipo",
            image: "imagem",
            upload_logo: "Log\xf3tipo",
            upload_image_error: "ficheiro inv\xe1lido (extens\xf5es v\xe1lidas s\xe3o .png, .gif ou .jpg)",
            leavePage: "Tentou sair desta p\xe1gina.  Se efectuo quaisquer altera\xe7\xf5es sem clicar no bot\xe3o Gravar, as suas altera\xe7\xf5es ser\xe3o perdidas. Tem certeza de que deseja sair desta p\xe1gina?",
            Stars: "Estrelas",
            audioFile: "Ficheiro de audio MP3",
            Copy: "Copiar",
            Delete: "Apagar",
            Options: "Op\xe7\xf5es",
            Actions: "Ac\xe7\xf5es:",
            Languages: "Idiomas",
            Pages: "P\xe1gina",
            Columns: "Colunas",
            Field_Properties: "Op\xe7\xf5es",
            Close: "Fechar",
            Skip_Logic: "L\xf3gica Condicional - Saltar P\xe1ginas",
            Jump_to_Page: "Saltar para P\xe1g. ",
            Image: "Imagem",
            ok: "Ok",
            validation: "Valida\xe7\xe3o",
            Text: "Texto",
            Number: "N\xfamero",
            Custom: "Padr\xe3o",
            Range: "Intervalo",
            Regex: "Express\xe3o",
            Rows: "Linhas",
            showCounter: "Mostrar Contador"
        },
        es: {
            language: "Espa\xf1ol",
            untitledHelpText: "clica para editar",
            dropElementsHere: "agregar los elementos aqu\xed",
            other: "otra"
        },
        fr: {
            language: "Fran\xe7ais",
            untitledHelpText: "cliquez pour \xe9diter",
            dropElementsHere: "glissez les \xe9l\xe9ments ici",
            add: "ajouter",
            remove: "supprimer",
            required: "obligatoire",
            yes: "oui",
            no: "non",
            layout: "Mise en forme",
            horizontal: "Horizontale",
            vertical: "Verticale",
            size: "taille",
            large: "grand",
            small: "petit",
            cantremovelanguage: "il faut laisser au moins une langue",
            columns: "colonnes",
            delete_confirm: "\xeates-vous sur de vouloir supprimer?",
            loading: "chargement... ",
            saving: "enregistrement... ",
            drophere: "glissez ici",
            wantToSave: "voulez-vous enregistrer?",
            addItem: "ajouter un \xe9l\xe9ment",
            delItem: "supprimer l'\xe9l\xe9ment",
            copyThisField: "copier ce champ",
            delThisField: "supprimer ce champ",
            otherOption: "autre choix",
            other: "autre:",
            newThread: "nouveau sujet",
            title: "titre",
            message: "message",
            submit: "envoyer",
            cancel: "annuler",
            reply: "r\xe9pondre",
            theme_name: "nom du th\xe8me",
            background: "arri\xe8re-plan",
            surveyTitle: "titre du questionnaire",
            questionTitle: "question title",
            questionSubTitle: "question subtitle",
            fieldText: "champ texte",
            border: "bordure",
            color: "couleur",
            typo: "police",
            exit: "quitter",
            hover: "couleur survolement",
            addPage: "ajouter une page",
            removePage: "supprimer la page actuelle",
            deleteAllConfirm: "\xeates vous sur de vouloir tout supprimer?",
            logo: "logo",
            image: "imagem",
            upload_logo: "novo logo",
            upload_image_error: "ficheiro inv\xe1lido (extens\xf5es v\xe1lidas s\xe3o .png, .gif ou .jpg)",
            leavePage: "Vous avez tent\xe9 de quitter cette page. Si vous avez effectu\xe9 des modifications dans les champs sans cliquer sur le bouton Save, vos modifications seront perdues. Etes-vous s\xfbr de vouloir quitter cette page?"
        },
        hu: {
            language: "Magyar",
            untitledHelpText: "Szerkeszt\xe9s",
            dropElementsHere: "H\xfazza ide az elemeket",
            other: "M\xe1s"
        },
        sv: {
            language: "Svenska",
            untitledHelpText: "redigera",
            dropElementsHere: "sl\xe4pp objekt h\xe4r",
            other: "\xf6vrig/annan"
        },
        de: {
            language: "Sprache",
            untitledHelpText: "klicken sie hier zum bearbeiten",
            dropElementsHere: "drop elemente hier",
            other: "andere"
        },
        ru: {
            language: "\u044f\u0437\u044b\u043a",
            untitledHelpText: "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u0437\u0434\u0435\u0441\u044c \u0434\u043b\u044f \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f",
            dropElementsHere: "\u043f\u0430\u0434\u0435\u043d\u0438\u0435 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u043e\u0432 \u0437\u0434\u0435\u0441\u044c",
            other: "\u0434\u0440\u0443\u0433\u043e\u0439"
        },
        it: {
            language: "Italiano",
            untitledHelpText: "fai clic per modificare",
            dropElementsHere: "goccia elementi qui",
            other: "altro"
        },
        tr: {
            language: "T\xfcrk",
            untitledHelpText: "d\xfczenlemek ve d\xfczeltmek i\xe7in t\u0131klay\u0131n",
            dropElementsHere: "Drop Here",
            other: "Di\u011fer se\xe7enek"
        },
        nl: {
            language: "Nederlands",
            untitledHelpText: "Klik hier om te bewerken",
            dropElementsHere: "Drop vraag elementen hier",
            other: "Andere"
        },
        ar: {
            language: "\u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629",
            untitledHelpText: "\u0625\u0636\u063a\u0637 \u0644\u0644\u062a\u0639\u062f\u064a\u0644",
            dropElementsHere: "drag and drop here",
            other: "\u0622\u062e\u0631"
        }
    },
    JSON;
JSON || (JSON = {}),
    function() {
        "use strict";

        function f(e) {
            return 10 > e ? "0" + e : e
        }

        function quote(e) {
            return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
                var t = meta[e];
                return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + e + '"'
        }

        function str(e, t) {
            var n, i, o, s, r, a = gap,
                l = t[e];
            switch (l && "object" == typeof l && "function" == typeof l.toJSON && (l = l.toJSON(e)), "function" == typeof rep && (l = rep.call(t, e, l)), typeof l) {
                case "string":
                    return quote(l);
                case "number":
                    return isFinite(l) ? String(l) : "null";
                case "boolean":
                case "null":
                    return String(l);
                case "object":
                    if (!l) return "null";
                    if (gap += indent, r = [], "[object Array]" === Object.prototype.toString.apply(l)) {
                        for (s = l.length, n = 0; s > n; n += 1) r[n] = str(n, l) || "null";
                        return o = 0 === r.length ? "[]" : gap ? "[\n" + gap + r.join(",\n" + gap) + "\n" + a + "]" : "[" + r.join(",") + "]", gap = a, o
                    }
                    if (rep && "object" == typeof rep)
                        for (s = rep.length, n = 0; s > n; n += 1) "string" == typeof rep[n] && (i = rep[n], o = str(i, l), o && r.push(quote(i) + (gap ? ": " : ":") + o));
                    else
                        for (i in l) Object.prototype.hasOwnProperty.call(l, i) && (o = str(i, l), o && r.push(quote(i) + (gap ? ": " : ":") + o));
                    return o = 0 === r.length ? "{}" : gap ? "{\n" + gap + r.join(",\n" + gap) + "\n" + a + "}" : "{" + r.join(",") + "}", gap = a, o
            }
        }
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf()
        });
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
                "\b": "\\b",
                "	": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            rep;
        "function" != typeof JSON.stringify && (JSON.stringify = function(e, t, n) {
            var i;
            if (gap = "", indent = "", "number" == typeof n)
                for (i = 0; n > i; i += 1) indent += " ";
            else "string" == typeof n && (indent = n);
            if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
            return str("", {
                "": e
            })
        }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
            function walk(e, t) {
                var n, i, o = e[t];
                if (o && "object" == typeof o)
                    for (n in o) Object.prototype.hasOwnProperty.call(o, n) && (i = walk(o, n), void 0 !== i ? o[n] = i : delete o[n]);
                return reviver.call(e, t, o)
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
                    return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse")
        })
    }(), QF.pages.surveys = {
        init: function() {
            LOG("PAGE:surveys"), QF.common.basePage.init(this), Event.observe("newsurvey", "click", this.newSurvey.bind(this)), Event.observe(document, "keypress", QF.pages.surveys.keyShortcut), Event.observe("filter", "change", this.filter), this.filter.call($("filter"))
        },
        newSurvey: function() {
            if ($("limit")) window.ga && ga("send", "event", "AccountLimit", "number-of-surveys"), QF.common.accountLimitLightbox("surveys");
            else {
                var e = new QF.common.htmlLightbox("mediumLB", "redLB", "new_survey");
                e.onLoad = function() {
                    $("newSurveyName").focus()
                }, e.show()
            }
        },
        createSurvey: function() {
            new Ajax.Request(document.location.href, {
                method: "post",
                parameters: {
                    callback: "new_survey",
                    name: $F("newSurveyName")
                },
                onSuccess: function(e) {
                    page.createResult(e.responseText)
                }
            }), Element.show("ajaxInfo"), Element.hide("duplicateError")
        },
        createResult: function(e) {
            e ? location.href = e : (Element.hide("ajaxInfo"), Element.show("duplicateError"))
        },
        updateUri: function(e) {
            var t = e.value.replace(/\s/g, "-");
            t = t.replace(/\-/g, ""), t = t.replace(/\&/g, ""), t = t.replace(/\?/g, ""), t = t.replace(/\#/g, ""), t = t.replace(/\//g, ""), t = Url.encode(t), $("surveyNameUri").innerHTML = t
        },
        restrictKeys: function() {},
        deleteSurvey: function(e) {
            return confirm(lang.current("delete_confirm")) && (new Ajax.Request(document.location.href, {
                method: "post",
                parameters: {
                    callback: "delete_survey",
                    survey_id: e
                },
                onSuccess: function() {
                    limitEl = document.getElementById("infoMsg");
                    var e = limitEl.getAttribute("data-limit"),
                        t = parseInt(e) + 1;
                    limitEl.innerHTML = limitEl.innerHTML.replace(e, t)
                }
            }), Element.remove("" + e)), !1
        },
        duplicateSurvey: function(e) {
            $("limit") ? new QF.common.accountLimitLightbox("surveys") : (new Ajax.Request(document.location.href, {
                method: "post",
                parameters: {
                    callback: "duplicate_survey",
                    survey_id: e
                },
                onSuccess: function(e) {
                    page.appendNewSurveyInfoBar(e.responseText), limitEl = document.getElementById("infoMsg");
                    var t = limitEl.getAttribute("data-limit"),
                        n = parseInt(t) - 1;
                    limitEl.innerHTML = limitEl.innerHTML.replace(t, n), limitEl.setAttribute("data-limit", n), limitInputEl = document.getElementById("limit"), t.value = n
                }
            }), Element.show("ajaxWork"))
        },
        rename: function(e, t) {
            Element.hide(e), new Insertion.After(e, '<input onkeyup="page.restrictKeys(this);" type="text" id="new-title-' + t + '" name="' + t + '" value="' + e.innerHTML + '" /><button id="cancel-new-title-' + t + '" onclick="page.cancelRename(\'title-' + t + '\');" class="button grey">' + lang.current("cancel") + '</button><button id="ok-new-title-' + t + '" onclick="page.doRename(\'' + t + '\');" class="button green">' + lang.current("ok") + "</button>"), $("new-title-" + t).focus();
            var n = document.getElementById(t);
            n.querySelector(".rename").style.display = "none"
        },
        keyShortcut: function(e) {
            var t = e.target ? e.target : e.srcElement;
            if ("input" == t.tagName.toLowerCase()) {
                var n = e.keyCode ? e.keyCode : e.charCode;
                switch (n) {
                    case 13:
                        "" != t.value && ("newSurveyName" == t.id ? page.createSurvey() : ($("title-" + t.name).innerHTML = t.value, new Ajax.Request(document.location.href, {
                            method: "post",
                            parameters: {
                                callback: "rename_survey",
                                survey_id: t.name,
                                name: t.value
                            },
                            onSuccess: function(e) {
                                page.replaceSurveyInfoBar(t.name, e.responseText)
                            }
                        }), page.cancelRename("title-" + t.name)));
                        break;
                    case 27:
                        Element.show("title-" + t.name), t.parentNode.removeChild(t)
                }
            } else $$(".selSurvey").each(function(t) {
                var n = t.getStyle("background-color");
                if ("rgb(224, 255, 207)" == n.toString() || "#e0ffcf" == n) {
                    var i = e.keyCode ? e.keyCode : e.charCode,
                        o = String.fromCharCode(i).toLowerCase();
                    switch (o) {
                        case "d":
                            page.duplicateSurvey(t.id)
                    }
                }
            })
        },
        surveyCallback: function(e) {
            $("firstTimeHelp") && $("surveyGrid").removeChild($("firstTimeHelp")), $("surveyGrid").innerHTML = e, this.updateAccount(), this.endAjax()
        },
        updateAccount: function() {
            new Ajax.Request(document.location.href, {
                method: "post",
                parameters: {
                    callback: "render_account_info"
                },
                onSuccess: function(e) {
                    page.updateAccountResponse(e.responseText)
                }
            })
        },
        updateAccountResponse: function(e) {
            $("accountInfo").innerHTML = e, new Effect.Highlight("infoMsg")
        },
        endAjax: function() {
            new Effect.Fade("ajaxWork")
        },
        doRename: function(e) {
            var t = $("new-title-" + e).value;
            t = t.replace(/-/g, "_"), t = t.replace(/&/g, ","), t = t.replace(/#/g, ","), t = t.replace(/\+/g, "*"), $("title-" + e).innerHTML = t, new Ajax.Request(document.location.href, {
                method: "post",
                parameters: {
                    callback: "rename_survey",
                    survey_id: e,
                    name: t
                },
                onSuccess: function(t) {
                    page.replaceSurveyInfoBar(e, t.responseText)
                }
            }), page.cancelRename("title-" + e)
        },
        replaceSurveyInfoBar: function(e, t) {
            $(e).innerHTML = t
        },
        appendNewSurveyInfoBar: function(e) {
            new Effect.Fade("ajaxWork");
            var t = document.getElementById("surveyGrid"),
                n = document.createElement("div");
            n.innerHTML = e;
            var i = n.firstChild;
            t.insertBefore(i, t.firstChild)
        },
        cancelRename: function(e) {
            Element.show(e), Element.remove("new-" + e), Element.remove("cancel-new-" + e), Element.remove("ok-new-" + e), $$(".rename").each(Element.show)
        },
        filter: function() {
            var e = this.value;
            switch (e) {
                case "active":
                    $$(".inactive", ".disabled").each(function(e) {
                        e.hide()
                    }), $$(".active").each(function(e) {
                        e.show()
                    });
                    break;
                case "inactive":
                    $$(".inactive", ".disabled").each(function(e) {
                        e.show()
                    }), $$(".active").each(function(e) {
                        e.hide()
                    });
                    break;
                default:
                    $$(".inactive", ".disabled", ".active").each(function(e) {
                        e.show()
                    })
            }
        }
    }, $("surveysPage") && QF.pages.surveys.init(), QF.pages.edit = {
        init: function() {
            LOG("PAGE:editor"), QF.common.basePage.init(this), this.survey_page = 1, this.currentLang = $F("language"), this.currentLang = "en-gb" == this.currentLang ? "en" : this.currentLang, this.isDragging = !1, this.form = new webForm("formArea", $F("language"), $F("survey-title")), f = this.form, this.f = this.form, this.loading_lightbox = new QF.common.ajaxLightbox(lang.current("loading")), this.background = $("background"), page.return_main = !1, $("forms").hasClassName("start") || (window.onbeforeunload = function() {
                return lang.current("leavePage")
            }), this.windowResize(), Event.observe(window, "resize", this.windowResize);
            var e = $("cache-data").innerText;
            try {
                this.form.setSchema(JSON.parse(e))
            } catch (t) {
                console.error(error), this.read(this.survey_page)
            }
            var n = {
                revert: !0,
                ghosting: !0,
                starteffect: page.startDrag.bind(this),
                endeffect: page.endDrag.bind(this)
            };
            new Draggable("textField", n), new Draggable("textFieldArray", n), new Draggable("exclusiveSelect", n), new Draggable("exclusiveSelectArray", n), new Draggable("multiSelect", n), new Draggable("multiSelectArray", n), new Draggable("dateField", n), new Draggable("starRating", n), new Draggable("starRatingArray", n), new Draggable("countrySelect", n), new Draggable("fileUpload", n), new Draggable("mapSelect", n), new Draggable("videoField", n), new Draggable("audioField", n), new Draggable("freeTextField", n), new Draggable("dropDown", n), new Draggable("slider", n), page.form.formItems.length < 1 && $("demo").show()
        },
        windowResize: function() {
            var e = Position.getWindowSize(),
                t = e[1] - 110,
                n = (e[0] - 280, $("sidebar"));
            n = $("background"), n.setStyle({
                height: t + "px"
            }), n = $("sidebar"), n.setStyle({
                height: t + "px"
            })
        },
        unavailable: function(e) {
            QF.common.accountLimitLightbox(e)
        },
        newPage: function() {
            var e = page.form.pages;
            if (e.length || e.push(0), e.length < 999) {
                e.push(0), page.loading_lightbox.show();
                var t = page.form.getSchema(),
                    n = $("survey-id").value;
                t = JSON.stringify(t), new Ajax.Request(document.location.href, {
                    method: "post",
                    parameters: {
                        callback: "insert_page",
                        schema: t,
                        page: page.survey_page,
                        survey_id: n
                    },
                    onSuccess: function(e) {
                        page.readResult(e.responseJSON)
                    }
                }), page.survey_page = parseInt(page.survey_page) + 1
            } else page.unavailable("multi_page")
        },
        deletePage: function() {
            var e = page.form.pages;
            if (!(e.length <= 1) && confirm(lang.current("delete_confirm"))) {
                this.loading_lightbox.show();
                var t = this.form.getSchema();
                t.globals.pages.removeAt(this.survey_page - 1);
                var n = $("survey-id").value;
                s = JSON.stringify(t), new Ajax.Request(document.location.href, {
                    method: "post",
                    parameters: {
                        callback: "delete_page",
                        schema: s,
                        page: page.survey_page,
                        survey_id: n
                    },
                    onSuccess: function(e) {
                        page.readResult(e.responseJSON)
                    }
                }), this.survey_page--, this.survey_page < 1 && (this.survey_page = 1)
            }
        },
        goToPage: function(e) {
            this.form.deSelectObject();
            var t = page.form.getSchema();
            t = JSON.stringify(t);
            var n = $("survey-id").value;
            new Ajax.Request(document.location.href, {
                method: "post",
                parameters: {
                    callback: "go_to_page",
                    page: e,
                    schema: t,
                    previous: page.survey_page,
                    survey_id: n
                },
                onSuccess: function(e) {
                    page.readResult1(e.responseJSON)
                }
            }), this.survey_page = e, this.selectedLanguage = this.form.selectedLanguage, this.loading_lightbox.show()
        },
        paginate: function(e) {
            pm = new pageManager, pm.render_page_list($("pages-top"), e), pm.render_page_list($("pages-bottom"), e), new Effect.Highlight("pages-top"), new Effect.Highlight("pages-bottom")
        },
        read: function(e) {
            this.survey_page = e, this.loading_lightbox.show();
            var t = $("survey-id").value;
            new Ajax.Request(document.location.href, {
                method: "post",
                parameters: {
                    callback: "read_object",
                    page: this.survey_page,
                    survey_id: t
                },
                onSuccess: function(e) {
                    page.readResult(e.responseJSON)
                }
            })
        },
        readResult: function(e) {
            this.loading_lightbox.hide(), e && this.form.resetSchema() & this.form.setSchema(e)
        },
        readResult1: function(e) {
            this.form.clear(), this.form = new webForm("formArea", $F("survey-title"), this.survey_page, this.selectedLanguage), this.loading_lightbox.hide(), e ? this.form.setSchema(e) : alert("Error loading data, please reload the page!\nIf the problem continues, contact technical support: support@questionform.com")
        },
        publishResult: function() {
            window.onbeforeunload = null, this.loading_lightbox.hide(), location.href = $("publish-url").value
        },
        saveResult: function() {
            this.loading_lightbox.hide(), page.return_main && (location.href = "/surveys")
        },
        createAccount: function(e) {
            this.loading_lightbox.hide(), window.ga && ga("send", "event", "CreateAccount", "Editor");
            var t = new QF.common.inlineLightbox("mediumLB", "greenLB", function() {
                $("lightboxMain").innerHTML = e;
                $$(".closeLb").each(function(e) {
                    Event.observe(e, "click", function() {
                        Element.hide("overlay"), new Effect.Fade("lightbox", {
                            duration: .5
                        })
                    })
                }), Event.observe("accountName", "keyup", page.updateUrlHelp, !1), page.updateUrlHelp();
                var t = $("survey-id").value;
                $("temporary").value = t, Event.observe($("signup"), "submit", function(e) {
                    return window.ga && ga("send", "event", "CreateAccountAttempt", "Editor"), $$("div.error").each(function(e) {
                        Element.remove(e)
                    }), $("signup").request({
                        onComplete: function(e) {
                            "http" == e.responseText.substring(0, 4) && (location.href = e.responseText)
                        },
                        onFailure: function(e) {
                            window.ga && ga("send", "event", "CreateAccountFailed", "Editor", e.responseText), $("temporary").insert({
                                after: e.responseText
                            })
                        }
                    }), Event.stop(e), !1
                })
            });
            t.show()
        },
        publish: function() {
            this.loading_lightbox.show();
            var e = this.form.getSchema(),
                t = $("survey-id").value;
            e = JSON.stringify(e), new Ajax.Request(document.location.href, {
                method: "post",
                parameters: {
                    callback: "publish",
                    schema: e,
                    page: this.survey_page,
                    survey_id: t
                },
                onSuccess: function(e) {
                    page.createAccount(e.responseText)
                }
            })
        },
        save_publish: function() {
            page.save("publishResult")
        },
        save: function(e) {
            e = e || "saveResult", this.loading_lightbox.show();
            var t = this.form.getSchema(),
                n = $("survey-id").value;
            t = JSON.stringify(t), new Ajax.Request(document.location.href, {
                method: "post",
                parameters: {
                    callback: "save_object",
                    schema: t,
                    page: this.survey_page,
                    survey_id: n
                },
                onSuccess: function(t) {
                    page[e](t.responseText)
                }
            })
        },
        startDrag: function(e) {
            $("demo").hide(), this.isDragging = !0, this.form.deSelectObject(), Element.setOpacity(e, .7);
            var t = document.getElementsByClassName("dropdiv"),
                n = this.background,
                i = !1;
            n.scrollTop + Element.getHeight("background") == n.scrollHeight && (i = !0);
            for (var o = 0; o < t.length; o++) {
                var e = t[o];
                e.innerHTML = "<img src='/images/anchor.png' /> " + lang.current("drophere"), e.addClassName("dragging"), e.style.padding = "2em 0"
            }
            i && (n.scrollTop = Element.getHeight("background"))
        },
        endDrag: function(e) {
            $(e).style.position = "relative", $(e).style.height = "16px", this.isDragging = !1, Element.setOpacity(e, 1);
            for (var t = document.getElementsByClassName("dropdiv"), n = 0; n < t.length; n++) {
                var e = t[n];
                e.innerHTML = "", e.removeClassName("dragging"), e.style.padding = "0"
            }
        },
        dropped: function(e, t) {
            page.addObject(e.id, t)
        },
        addObject: function(type, position) {
            if (window.ga && ga("send", "event", "AddField", type), page.form.formItems.length >= page.form.questions) return this.unavailable("questions"), void(window.ga && ga("send", "event", "AccountLimit", "questions"));
            if ("fileUpload" == type && !page.form.fileUpload) return this.unavailable("file_upload"), void(window.ga && ga("send", "event", "AccountLimit", "upload"));
            if ("mapSelect" == type && !page.form.mapSelect) return this.unavailable("map_select"), void(window.ga && ga("send", "event", "AccountLimit", "map"));
            if ("videoField" == type && !page.form.videoField) return this.unavailable("video_field"), void(window.ga && ga("send", "event", "AccountLimit", "video"));
            if ("audioField" == type && !page.form.audioField) return this.unavailable("audio_field"), void(window.ga && ga("send", "event", "AccountLimit", "audio"));
            if ("freeTextField" == type && !page.form.freeTextField) return this.unavailable("freeText_field"), void(window.ga && ga("send", "event", "AccountLimit", "free_text"));
            "slider" == type && (type = "sliderField");
            var oArea = new objectArea(position.id);
            if (eval("oArea.attach(new " + type + "(), true)"), oArea.render(), "startArea" != position.id) {
                var charIndex = position.id.lastIndexOf("_"),
                    dir = position.id.substring(charIndex, position.id.length),
                    id = position.id.substring(0, charIndex),
                    index = page.form.formItems.indexOfId(id);
                switch (dir) {
                    case "_up":
                        page.form.formItems.insertAt(oArea, index);
                        break;
                    case "_down":
                        page.form.formItems.insertAt(oArea, index + 1)
                }
            } else page.form.formItems[0] = oArea;
            Droppables.remove(position.id), position.parentNode.removeChild(position)
        },
        appendObject: function(e) {
            $("demo").hide();
            var t = page.form.formItems[page.form.formItems.length - 1],
                n = $(t ? t.id + "_down" : "startArea");
            this.addObject(e, n)
        },
        goBack: function() {
            return window.onbeforeunload = null, confirm(lang.current("wantToSave")) ? (this.save(), page.return_main = !0) : location.href = "/surveys", !1
        },
        keyShortcut: function(e) {
            8 == e.keyCode && "HTML" == e.target.tagName && Event.stop(e)
        },
        preview: function() {
            this.loading_lightbox.show();
            var e = this.form.getSchema(),
                t = $("survey-id").value;
            e = JSON.stringify(e);
            var n = Position.getWindowSize(),
                i = n[1] - 200;
            new Ajax.Request(document.location.href, {
                method: "post",
                parameters: {
                    callback: "preview2",
                    schema: e,
                    page: this.survey_page,
                    lang: page.form.selectedLanguage,
                    height: i,
                    survey_id: t
                },
                onSuccess: function(e) {
                    page.loading_lightbox.hide();
                    var t = new QF.common.inlineLightbox("previewLB", "", function() {
                        $("lightboxMain").innerHTML = e.responseText;
                        $$(".closeLb").each(function(e) {
                            Event.observe(e, "click", function() {
                                Element.hide("overlay"), new Effect.Fade("lightbox", {
                                    duration: .5
                                })
                            })
                        })
                    });
                    t.show();
                    for (var n = $$("#lightboxMain .datefield"), i = 0; i < n.length; i++) {
                        var o = n[i].getAttribute("data-lang");
                        new Pikaday({
                            field: n[i],
                            format: "YYYY-MM-DD",
                            locale: o
                        })
                    }
                }
            })
        },
        showUploadImage: function(e, t) {
            if (!page.form.imageField) return void this.unavailable("image_field");
            var n = "survey_" + e + "_" + t;
            this.uploadWindow = new QF.common.htmlLightbox("mediumLB", "", "upload_image"), this.uploadWindow.parameters = "id=" + n + "&type=field_image", this.uploadWindow.show()
        },
        uploadImage: function() {
            if (!page.form.imageField) return void this.unavailable("image_field");
            var e = $("image"),
                t = /\.jpg|\.gif|\.png/i,
                n = e.value;
            if (-1 == n.search(t)) return e.form.reset(), !1;
            var i = n.lastIndexOf("."),
                o = n.substr(i + 1, 3);
            if (!this.form.selectedElement) return !1;
            var s = page.form.formItems[page.form.formItems.indexOfId(page.form.selectedElement.id)];
            return s.uiObject.image = $("image_id").value + "." + o, AIM.submit($("upload_image"), {
                onStart: page.startUploading,
                onComplete: page.endUploading
            })
        },
        showUploadAudio: function(e, t) {
            var n = "survey_" + e + "_" + t;
            this.uploadWindow = new QF.common.htmlLightbox("mediumLB", "", "upload_audio"), this.uploadWindow.parameters = "id=" + n + "&type=mp3", this.uploadWindow.show()
        },
        uploadAudio: function() {
            if (!page.form.audioField) return void this.unavailable("audio_field");
            var e = $("audio"),
                t = /\.mp3/i,
                n = e.value;
            if (-1 == n.search(t)) return e.form.reset(), !1;
            var i = n.lastIndexOf("."),
                o = n.substr(i + 1, 3);
            if (!this.form.selectedElement) return !1;
            var s = page.form.formItems[page.form.formItems.indexOfId(page.form.selectedElement.id)];
            return s.uiObject.sound = $("audio_id").value + "." + o, AIM.submit($("upload_audio"), {
                onStart: page.startUploading,
                onComplete: page.endUploadingAudio
            })
        },
        startUploading: function() {
            return !0
        },
        endUploading: function() {
            return Element.show("field_image_remove"), !0
        },
        endUploadingAudio: function() {
            return !0
        },
        trial: function(e) {
            window.ga && ga("send", "event", "AccountLimit", e), ("matrix_questions" == e || "questions" == e) && page.form.setLimits({
                questions: 20
            }), "image_field" == e && page.form.setLimits({
                imageField: !0
            }), "file_upload" == e && page.form.setLimits({
                fileUpload: !0
            }), "map_select" == e && page.form.setLimits({
                mapSelect: !0
            }), "video_field" == e && page.form.setLimits({
                videoField: !0
            }), "multi_page" == e && page.form.setLimits({
                multiPage: !0
            }), "multi_lang" == e && page.form.setLimits({
                multiLang: !0
            }), Element.hide("upgrade-text"), Element.hide("upgrade-title"), Element.show("upgrade-trial-title"), Element.show("upgrade-info"), new Effect.Highlight("upgrade-info")
        },
        doFocus: function(e) {
            var t = e.target ? e.target : e.srcElement;
            Element.addClassName(t.parentNode, "controlFocus")
        },
        doBlur: function(e) {
            var t = e.target ? e.target : e.srcElement;
            Element.removeClassName(t.parentNode, "controlFocus")
        },
        updateUrlHelp: function() {
            var e = $F("accountName");
            $("accountURL").innerHTML = e ? e : "username"
        },
        showCouponCode: function() {
            new Effect.Appear("coupon", {
                duration: .5
            })
        },
        updateUri: function(e) {
            e.value = e.value.replace(/-/g, "_"), e.value = e.value.replace(/&/g, ","), e.value = e.value.replace(/#/g, ","), text = e.value.replace(/\s/g, "-"), text = Url.encode(text), $("surveyURL").innerHTML = text
        },
        closeHelpWindow: function() {
            $("demo").hide()
        },
        highlightStar: function(e, t) {
            for (var n = 0; e >= n; n++) {
                var i = t + "_i" + n.toString();
                $(i).src = "/images/starrat-selected.gif"
            }
        },
        deHighlightStar: function(e, t) {
            var n = 0;
            $(t) && (n = $(t).value), n--;
            for (var i = 0; $(t + "_i" + i.toString());) {
                var o = t + "_i" + i.toString();
                $(o).src = "/images/starrat.gif", i++
            }
        },
        selectOther: function(e, t) {
            e && e.checked ? page.activeOther(t) : page.inactiveOther(t)
        },
        activeOther: function(e) {
            $(e).style.visibility = "visible"
        },
        inactiveOther: function(e) {
            $(e) && ($(e).value = "", $(e).style.visibility = "hidden")
        },
        $: function(e) {
            return $(e)
        }
    }, $("forms") && (Event.observe(window, "load", QF.pages.edit.init.bind(QF.pages.edit)), Event.observe(window, "keypress", QF.pages.edit.keyShortcut)), Array.prototype.insertAt = function(e, t) {
        this.splice(t, 0, e)
    }, Array.prototype.insertBefore = function(e, t) {
        var n = this.indexOf(t); - 1 == n ? this.push(e) : this.splice(n, 0, e)
    }, Array.prototype.removeAt = function(e) {
        this.splice(e, 1)
    }, Array.prototype.remove = function(e) {
        var t = this.indexOf(e); - 1 != t && this.splice(t, 1)
    }, Array.prototype.indexOfId = function(e) {
        var t = -1;
        if (this.length < 1 || 1 != arguments.length) return t;
        for (var n = 0; n < this.length; n++)
            if (this[n].id == e) {
                t = n;
                break
            }
        return t
    }, Position.getWindowSize = function(e) {
        e = e ? e : window;
        var t = e.innerWidth || e.document.documentElement.clientWidth || e.document.body.clientWidth,
            n = e.innerHeight || e.document.documentElement.clientHeight || e.document.body.clientHeight;
        return [t, n]
    }, Droppables.isAffected = function(e, t, n) {
        return Position.prepare(), n.element != t && (!n._containers || this.isContained(t, n)) && (!n.accept || Element.classNames(t).detect(function(e) {
            return n.accept.include(e)
        })) && Position.withinIncludingScrolloffsets(n.element, e[0], e[1])
    }, languageBar = Base.extend({
        constructor: function(e) {
            this.selectedLanguage = e || 0, this.changeObserver = this.change.bindAsEventListener(this)
        },
        render: function(e) {
            var t = page.form.languages[this.selectedLanguage],
                n = $div({
                    "class": "languageBar"
                });
            e.appendChild(n);
            var i = $div({
                id: "languageBarAdmin",
                style: "float:right"
            });
            n.appendChild(i);
            var o = $a({
                    href: "#",
                    "class": "smallbutton"
                }, lang.current("add")),
                s = $a({
                    href: "#",
                    "class": "smallbutton"
                }, lang.current("remove"));
            i.appendChild($span(lang.current("Languages") + ":")), i.appendChild(o), i.appendChild($span("|")), i.appendChild(s);
            var r = page.form.multiLang ? this.newLanguage.bindAsEventListener(this) : function() {
                page.unavailable("multi_lang")
            };
            Event.observe(s, "click", this.remove.bindAsEventListener(this), !1), Event.observe(o, "click", r, !1);
            for (var a = 0; a < page.form.languages.length; a++) {
                var l = "/images/flags/" + page.form.languages[a] + ".gif",
                    c = locales[page.form.languages[a]] ? locales[page.form.languages[a]].language : "undefined",
                    d = "survey_lang" + a.toString();
                if (this.selectedLanguage == a) n.appendChild($img({
                    id: d,
                    "class": "selectedLang",
                    src: l,
                    title: c,
                    name: a
                }));
                else {
                    var u = $img({
                        id: d,
                        "class": "clickable unSelectedLang",
                        src: l,
                        title: c,
                        name: a
                    });
                    n.appendChild(u), Event.observe(u, "click", this.changeObserver, !1)
                }
            }
            var c = locales[t] ? locales[t].language : "undefined";
            n.appendChild($br()), n.appendChild($span({
                id: "selLanguageText"
            }, c))
        },
        newLanguage: function() {
            this.addLangWindow = new QF.common.htmlLightbox("smallLB", "", "add_survey_language"), this.addLangWindow.onClose = this.add, this.addLangWindow.onLoad = this.setupAdd, this.addLangWindow.show()
        },
        setupAdd: function() {
            page.form.languages.each(function(e) {
                $("add-lang-" + e).removeClassName("closeLb").addClassName("unSelectable")
            })
        },
        change: function(e) {
            var t = e.target ? e.target.name : e.srcElement.name,
                n = $("survey_lang" + this.selectedLanguage);
            n.removeClassName("selectedLang").addClassName("unSelectedLang").addClassName("clickable"), Event.observe(n, "click", this.changeObserver, !1);
            var i = $("survey_lang" + t);
            i.removeClassName("unSelectedLang").removeClassName("clickable").addClassName("selectedLang"), Event.stopObserving(i, "click", this.changeObserver);
            var o = page.form.languages[t];
            $("selLanguageText").innerHTML = lang.get(o, "language"), this.selectedLanguage = t, page.form.changeLanguage(t)
        },
        remove: function() {
            page.form.removeLanguage()
        },
        add: function(e) {
            var t = e.target ? e.target.classNames().toArray()[2] : e.srcElement.classNames().toArray()[2];
            t && 2 == t.length && (page.form.languages.push(t), page.form.refresh(!0))
        }
    }), pageManager = Base.extend({
        constructor: function(e) {
            this.total = e
        },
        render: function(e, t) {
            this.id = "pages-" + t;
            var n = $div({
                id: this.id,
                "class": "pages"
            });
            e.appendChild(n), this.render_page_list(n)
        },
        render_page_list: function(e, t) {
            $(e.id + "-add-new-page") && (Event.stopObserving(e.id + "-add-new-page", "click", page.form.multiPage ? page.newPage : function() {
                page.unavailable("multi_page")
            }, !1), Event.stopObserving(e.id + "-del-new-page", "click", page.deletePage.bindAsEventListener(page), !1), Event.stopObserving(e.id + "-paginate-left", "click", function() {
                page.paginate(t - 1)
            }, !1), Event.stopObserving(e.id + "-paginate-right", "click", function() {
                page.paginate(t + 1)
            }, !1), Event.stopObserving("page-selector-" + this.id, "change")), e.innerHTML = "", e.appendChild($div({
                style: "float:right;",
                "class": "clickable"
            }, $img({
                id: e.id + "-add-new-page",
                src: "/images/add.png",
                alt: lang.current("addPage"),
                title: lang.current("addPage")
            }), $img({
                id: e.id + "-del-new-page",
                src: "/images/delete.png",
                alt: lang.current("removePage"),
                title: lang.current("removePage")
            }))), e.appendChild($span({
                style: "color:#dc5151"
            }, lang.current("Pages") + ":")), e.appendChild($select({
                id: "page-selector-" + this.id
            }));
            for (var n = window.page.form.pages.length > 0 ? window.page.form.pages.length : 1, i = 0; n > i; i++) {
                var o = i + 1;
                $("page-selector-" + this.id).appendChild(window.page.survey_page == o ? $option({
                    value: o.toString(),
                    selected: "selected"
                }, o.toString()) : $option({
                    value: o.toString()
                }, o.toString()))
            }
            Event.observe(e.id + "-add-new-page", "click", window.page.form.multiPage ? window.page.newPage : function() {
                window.page.unavailable("multi_page")
            }, !1), Event.observe(e.id + "-del-new-page", "click", page.deletePage.bindAsEventListener(page), !1), Event.observe("page-selector-" + this.id, "change", function() {
                page.goToPage(this.value)
            })
        }
    }), webForm = Base.extend({
        constructor: function(e, t, n, i) {
            this.width = 500, this.formItems = new Array, this.parentId = e, this.currentId = 0, this.title = new htmlTextArea(!0, "25px"), this.title.cssClass = "formTitle", this.title.id = "formTitleText", t = "en-gb" == t ? "en" : t, n && (this.title.itemText = [n]), this.languages = new Array, this.selectedLanguage = i || 0, this.languages[this.languages.length] = t, this.langBar = new languageBar(this.selectedLanguage), this.pages = new Array, this.pages[this.pages.length] = 0, this.currentPage = 1
        },
        getID: function() {
            return this.currentId++
        },
        render: function() {
            var e = $(this.parentId),
                t = $div({
                    id: "formHeader"
                });
            e.appendChild(t), this.title.render(t), this.langBar.render(t), pm = new pageManager(this.pages.length), pm.render(t, "top"), e.appendChild($div({
                id: "startArea"
            }, $span(lang.current("dropElementsHere")))), Droppables.add("startArea", {
                hoverclass: "dropp",
                accept: "candrop",
                onDrop: page.dropped,
                greedy: "true"
            });
            for (var n = "startArea", i = 0; i < this.formItems.length; i++) {
                var o = this.formItems[i];
                o.formId = n, o.render(), Droppables.remove(n), $(n).parentNode.removeChild($(n)), n = o.id + "_down"
            }
            pm.render(e, "bottom")
        },
        changeLanguage: function(e, t) {
            t || this.save(), this.deSelectObject(), this.selectedLanguage = e, this.title.changeLanguage(e);
            for (var n = 0; n < this.formItems.length; n++) this.formItems[n].changeLanguage(e);
            this.langBar.selectedLanguage = e
        },
        removeLanguage: function() {
            if (this.languages.length > 1) {
                var e = locales[this.languages[this.selectedLanguage]].language;
                if (confirm("Are you sure you want to delete " + e + "?")) {
                    var t = this.selectedLanguage;
                    this.languages.removeAt(t), this.title.removeLanguage(t);
                    for (var n = 0; n < this.formItems.length; n++) this.formItems[n].removeLanguage(t);
                    this.changeLanguage(0, !0), this.refresh(!1)
                }
            }
        },
        addLanguage: function() {
            var e = new QF.common.lightbox("New Language", "mediumLB"),
                t = new languageBar(!1, this.selectedLanguage);
            e.render(t.addLanguage)
        },
        save: function() {
            this.title.save();
            for (var e = 0; e < this.formItems.length; e++) this.formItems[e].save()
        },
        clear: function(e) {
            for (var e = e || $("formArea"), t = document.getElementsByClassName("dropdiv"), n = 0; n < t.length; n++) Droppables.remove(t[n].id);
            $("startArea") && Droppables.remove("startArea"), e.innerHTML = ""
        },
        refresh: function(e) {
            var t = $("formArea");
            this.deSelectObject(), e && this.save(), this.clear(t), this.render(t.id)
        },
        selectObject: function(e, t) {
            if (this.selectedElement && !t) {
                if (this.selectedElement.id == e.id) return;
                this.deSelectObject()
            }
            this.selectedElement = e;
            var n = this.formItems.indexOfId(this.selectedElement.id);
            if (0 > n) return void this.deSelectObject();
            $$(".isSelected").each(function(e) {
                Element.removeClassName(e, "isSelected")
            });
            for (var i = 0; i < page.survey_page - 1; i++) n += this.pages[i];
            var o = $(e.id + "_actions");
            o.show();
            var s = $(e.id + "_number");
            s.innerHTML = (n + 1).toString() + ".";
            Position.cumulativeOffset(o)[1] - 60, Position.cumulativeOffset(o)[0] + 10;
            o.setStyle({
                top: "-35px",
                left: "20px"
            });
            var r = this.formItems[this.formItems.indexOfId(this.selectedElement.id)];
            r.select(!0)
        },
        deSelectObject: function() {
            if (this.selectedElement) {
                $(this.selectedElement.id + "_actions") && Element.hide(this.selectedElement.id + "_actions");
                var e = this.formItems[this.formItems.indexOfId(this.selectedElement.id)];
                e && e.select(!1), this.selectedElement = null
            }
        },
        resetProperties: function() {},
        deleteObject: function(e) {
            var t = this.formItems.indexOfId(e);
            this.formItems.removeAt(t), this.resetProperties(), this.selectedElement = null, this.refresh(!0)
        },
        copyObject: function(e) {
            var t = this.selectedElement;
            if (this.deSelectObject(), this.formItems.length >= page.form.questions) return void page.unavailable("questions");
            var n = this.formItems.indexOfId(e);
            this.formItems[n].save();
            var i = this.formItems[n].getCopy();
            this.formItems.insertAt(i, n + 1), this.selectedElement = t, this.refresh(!0)
        },
        showOptionsWindow: function(e) {
            this.save();
            var t = this.formItems.indexOfId(e),
                n = this.formItems[t],
                i = (this.selectedElement, '<div id="prop-window"><h1>' + lang.current("Field_Properties") + '</h1><div id="propertiesArea"></div><input type="button" class="small button green closeLb" value="' + lang.current("Close") + '" /></div>'),
                o = new QF.common.inlineLightbox("mediumLargeLB", "", function() {
                    $("lightboxMain").innerHTML = i, n.uiObject.showProperties();
                    var e = this;
                    $$(".closeLb").each(function(t) {
                        Event.observe(t, "click", e.close.bindAsEventListener(e))
                    })
                });
            o.onClose = function() {
                Event.stopObserving(document, "keydown", s), n.uiObject.saveProperties(), n.uiObject.refresh(), page.form.selectObject(n, !0)
            }, o.show();
            var s = function(e) {
                27 == e.keyCode && o.close()
            };
            Event.observe(document, "keydown", s)
        },
        getSchema: function() {
            this.save();
            var e = {},
                t = {};
            t.title = this.title.getSchema(), t.currentId = this.currentId, t.languages = this.languages, t.height = $("formArea").clientHeight, t.width = this.width, this.pages[page.survey_page - 1] = this.formItems.length ? this.formItems.length : 0, t.pages = this.pages, e.globals = t, e.items = new Array;
            for (var n = 0; n < this.formItems.length; n++) e.items[n] = this.formItems[n].getSchema(), e.items[n].order = n + 1, e.items[n].id = this.formItems[n].id;
            return e
        },
        setSchema: function(e) {
            if (this.questions = this.questions || 5, this.multiLang = this.multiLang || !1, e) {
                if (e.globals && e.globals.obj) {
                    var t = e.globals.obj;
                    t.title && this.title.setSchema(t.title), this.currentId = t.currentId || 0, this.languages = t.languages || this.languages, this.pages = t.pages || new Array(this.formItems.length), this.survey_id = t.survey_id, this.setLimits(t)
                }
                if (e.fields)
                    for (var n = 0; n < e.fields.length; n++) this.formItems[n] = new objectArea, this.formItems[n].setSchema(e.fields[n].type, e.fields[n].obj)
            }
            this.refresh(!1)
        },
        resetSchema: function() {
            this.formItems = !1, this.formItems = new Array
        },
        setLimits: function(e) {
            this.multiPage = e.multiPage || this.multiPage || !1, this.multiLang = e.multiLang || this.multiLang || !1, this.questions = e.questions || this.questions || 5, this.fileUpload = e.fileUpload || this.fileUpload || !1, this.mapSelect = e.mapSelect || this.mapSelect || !1, this.videoField = e.videoField || this.videoField || !1, this.imageField = e.imageField || this.imageField || !1, this.audioField = e.audioField || this.audioField || !1, this.freeTextField = e.freeTextField || this.freeTextField || !1
        }
    }), objectArea = Base.extend({
        constructor: function(e) {
            this.id = "field" + page.form.getID(), this.formId = e
        },
        attach: function(e, t) {
            this.uiObject = e, this.uiObject.id = this.id + "_uiObject", this.uiObject.parentId = this.id, t && this.uiObject.startup && this.uiObject.startup()
        },
        removeLanguage: function(e) {
            this.uiObject.removeLanguage(e)
        },
        changeLanguage: function(e) {
            this.uiObject.changeLanguage(e)
        },
        save: function() {
            $(this.id) && this.uiObject.save()
        },
        getCopy: function() {
            var e = (new Array, new objectArea(this.formId));
            e.isSelected = !1;
            var t = this.uiObject;
            delete t.elem;
            var n = deepCopy(t);
            return n.id = e.id + "_uiObject", n.parentId = e.id, e.attach(n, !1), e
        },
        getSchema: function() {
            var e = {};
            return e = this.uiObject.getSchema()
        },
        setSchema: function(type, obj) {
            this.id = obj.id, type = "slider" == type ? "sliderField" : type, eval("this.attach( new " + type + "(), false);"), this.uiObject.setSchema(obj)
        },
        select: function(e) {
            e ? (Element.addClassName(this.id, "isSelected"), Element.removeClassName(this.id, "notSelected")) : (Element.removeClassName(this.id, "isSelected"), Element.addClassName(this.id, "notSelected")), this.uiObject.select(e)
        },
        highlight: function() {
            new Effect.Highlight(this.id)
        },
        render: function() {
            upDiv = new htmlDroppableDiv(this.id + "_up"), upDiv.render(this.formId), selectableDiv = new htmlSelectableDiv(this.id), selectableDiv.render(this.formId), this.uiObject.render(selectableDiv.id), downDiv = new htmlDroppableDiv(this.id + "_down"), downDiv.render(this.formId), Droppables.add(upDiv.id, {
                hoverclass: "dropp",
                accept: "candrop",
                onDrop: page.dropped
            }), Droppables.add(downDiv.id, {
                hoverclass: "dropp",
                accept: "candrop",
                onDrop: page.dropped
            })
        }
    }), formObject = Base.extend({
        constructor: function() {
            this.isSelected = !1, this.title = new htmlTextLine(!0), this.title.cssClass = "itemTitle", this.subTitle = new htmlTextArea(!0, "25px"), this.subTitle.cssClass = "itemSubTitle", this.required = "no", this.image = !1
        },
        typeOf: function() {
            return this.type
        },
        removeLanguage: function(e) {
            this.title.removeLanguage(e), this.subTitle.removeLanguage(e)
        },
        changeLanguage: function(e) {
            this.title.changeLanguage(e), this.subTitle.changeLanguage(e)
        },
        select: function(e) {
            this.isSelected = e;
            var t = $(this.id);
            if (t) {
                for (var n = t.getElementsByTagName("TEXTAREA"), i = 0; i < n.length; i++) {
                    var o = n[i];
                    e ? Element.addClassName(o, "isSelected") : Element.removeClassName(o, "isSelected")
                }
                for (var s = t.getElementsByTagName("INPUT"), i = 0; i < s.length; i++) {
                    var o = s[i];
                    e && "text" == o.type ? Element.addClassName(o, "isSelected") : Element.removeClassName(o, "isSelected")
                }
            }
        },
        save: function() {
            this.title.save(), this.subTitle.save()
        },
        getSchema: function() {
            var e = {};
            return e.title = this.title.getSchema(), e.subTitle = this.subTitle.getSchema(), e.type = this.type, e.required = this.required, e.image = this.image, e
        },
        setSchema: function(e) {
            this.title.setSchema(e && e.title || ""), this.subTitle.setSchema(e && e.subTitle || ""), this.required = e && e.required || "no", this.image = e && e.image || !1
        },
        render: function(e) {
            var t = this.createMainDiv(e);
            this.title.id = this.id + "_title", this.title.render(t, !0, this.required), this.image && this.renderImage(t), this.subTitle.id = this.id + "_subtitle", this.subTitle.render(t, !0);
            var n = $div({
                id: this.id + "_items",
                "class": "uiObjectItems"
            });
            t.appendChild(n)
        },
        createMainDiv: function(e) {
            var t = $(e),
                n = $div({
                    id: this.id,
                    style: "width:100%; position:relative"
                }),
                i = e + "_ddl",
                o = e + "_number",
                s = e + "_copy",
                r = e + "_copy2",
                a = e + "_delete",
                l = e + "_delete2",
                c = e + "_settings",
                d = e + "_settings2";
            return actionsDiv = $div({
                id: e + "_actions",
                "class": "actions",
                style: "display:none"
            }), actionsDiv.innerHTML = "<span id='" + o + "' class='fieldNumber' style='display:none'></span>&nbsp<img style='width:22px; height:22px' class='clickable' id='" + s + "' src='/images/24-em-plus.png' title='" + lang.current("copyThisField") + "' /> <img class='clickable' id='" + a + "' src='/images/24-em-cross.png' style='width:22px; height:22px' title='" + lang.current("delThisField") + "' /><img class='clickable' style='margin-left: 3px; width:22px; height:22px' id='" + c + "' src='/images/24-settings-blue.png' title='" + lang.current("Options") + "' /><select name='" + e + "' id=\"" + i + "\" style='opacity:0.8; margin-left:2em; position:relative; top:3px; font-size:10px'><option value='actions'>" + lang.current("Actions") + "</option><option value='copy' id=\"" + r + '">' + lang.current("Copy") + "</option><option value='delete' id=\"" + l + '">' + lang.current("Delete") + "</option><option value='settings' id=\"" + d + '">' + lang.current("Options") + "</option></select>", n.appendChild(actionsDiv), t.appendChild(n), Event.observe(s, "click", function(t) {
                page.form.copyObject(e), Event.stop(t)
            }, !1), Event.observe(a, "click", function(t) {
                page.form.deleteObject(e), Event.stop(t)
            }, !1), Event.observe(c, "click", function(t) {
                page.form.showOptionsWindow(e), Event.stop(t)
            }, !1), Event.observe(i, "change", function(e) {
                var t = this.options[this.selectedIndex].value;
                "copy" == t && page.form.copyObject(this.name), "delete" == t && page.form.deleteObject(this.name), "settings" == t && page.form.showOptionsWindow(this.name), Event.stop(e)
            }), n
        },
        refresh: function() {
            this.save();
            var e = $(this.id);
            e.parentNode.removeChild($(this.id)), this.render(this.parentId), page.form.selectObject($(this.id), !0)
        },
        renderImage: function(e) {
            e.appendChild($div({
                id: this.id + "_image",
                "class": "field-image"
            }, $img({
                style: "max-width: 450px",
                src: "/uploads/images/" + this.image + "?timestamp=" + Math.random()
            })))
        },
        saveProperties: function() {
            $("validation-select-details") && this.setProp("validation_details", $("validation-select-details").value), $("validation-select-total") && this.setProp("validation_total", $("validation-select-total").value)
        },
        renderProperty: function(e, t, n) {
            var i = $("propertiesArea"),
                o = $fieldset({
                    "class": "propertyWrapper"
                }, $legend(e));
            i.appendChild(o);
            var s = $div();
            o.appendChild(s), $H(n).each(function(n) {
                s.appendChild($input({
                    type: "radio",
                    name: e + "Field",
                    id: e + "Field" + n[0]
                })), this[t] == n[0] && ($(e + "Field" + n[0]).checked = "1"), s.appendChild($label({
                    style: "margin-right: 0.5em"
                }, n[1]));
                e + "Field" + n[0];
                Event.observe(e + "Field" + n[0], "click", function() {
                    this.setProp(t, n[0])
                }.bind(this), !1)
            }.bind(this)), Element.show("propertiesArea")
        },
        renderPropertyWithOption: function(e, t, n, i, o) {
            var s = $("propertiesArea"),
                r = $fieldset({
                    "class": "propertyWrapper"
                }, $legend(e));
            s.appendChild(r);
            var a = $div();
            r.appendChild(a);
            var l = !1;
            $H(n).each(function(n) {
                a.appendChild($input({
                    type: "radio",
                    name: e + "Field",
                    id: e + "Field" + n[0]
                })), this[t] == n[0] && ($(e + "Field" + n[0]).checked = "1", l = n[0]), a.appendChild($label({
                    style: "margin-right: 0.5em"
                }, n[1]));
                e + "Field" + n[0];
                Event.observe(e + "Field" + n[0], "click", function() {
                    this.setProp(t, n[0]), "large" == n[0] ? $(e + "Field_option").show() : $(e + "Field_option").hide()
                }.bind(this), !1)
            }.bind(this)), option_div = a.appendChild("large" == l ? $div({
                id: e + "Field_option",
                style: "margin-top: 0.5em"
            }) : $div({
                id: e + "Field_option",
                style: "display:none; margin-top:0.5em"
            })), option_div.appendChild($label({}, o)), option_div.appendChild($input({
                type: "text",
                id: e + "Field_option_value",
                style: "width:3em; margin-left:.5em",
                value: this[i]
            }));
            var c = this;
            Event.observe(e + "Field_option_value", "keyup", function() {
                var e = /^\d+$/;
                e.test(this.value) && c.setProp(i, this.value)
            }), Element.show("propertiesArea")
        },
        renderListProperty: function(e, t, n) {
            var i = $("propertiesArea"),
                o = $fieldset({
                    "class": "propertyWrapper"
                }, $legend(e));
            i.appendChild(o);
            var s = $div();
            o.appendChild(s);
            var r = $select({
                id: "validation-select"
            });
            $H(n).each(function(e) {
                r.appendChild(this[t] == e[0] ? $option({
                    value: e[0],
                    selected: "1"
                }, e[1].text) : $option({
                    value: e[0]
                }, e[1].text))
            }.bind(this)), s.appendChild(r), n[this[t]] && n[this[t]].with_details && (s.appendChild($label({
                id: "validation-select-details-label",
                style: "margin: 0 .5em"
            }, n[this[t]].with_details_label)), s.appendChild($input({
                id: "validation-select-details",
                placeholder: n[this[t]].with_details,
                value: this.validation_details
            }))), n[this[t]] && n[this[t]].with_total && (s.appendChild($label({
                id: "validation-select-total-label",
                style: "margin: 0 .5em"
            }, n[this[t]].with_total_label)), s.appendChild($input({
                id: "validation-select-total",
                placeholder: n[this[t]].with_total,
                value: this.validation_total
            })));
            var a = this;
            Event.observe("validation-select", "change", function() {
                $("validation-select-details") && (s.removeChild($("validation-select-details")), s.removeChild($("validation-select-details-label"))), $("validation-select-total") && (s.removeChild($("validation-select-total")), s.removeChild($("validation-select-total-label")));
                var e = $(this).value;
                n[e] && n[e].with_details && (s.appendChild($label({
                    id: "validation-select-details-label",
                    style: "margin: 0 .5em"
                }, n[e].with_details_label)), s.appendChild($input({
                    id: "validation-select-details",
                    placeholder: n[e].with_details,
                    value: a.validation_details
                }))), n[e] && n[e].with_total && (s.appendChild($label({
                    id: "validation-select-total-label",
                    style: "margin: 0 .5em"
                }, n[e].with_total_label)), s.appendChild($input({
                    id: "validation-select-total",
                    placeholder: n[e].with_total,
                    value: a.validation_total
                }))), a.setProp(t, $(this).value), a.setProp("validation_details", ""), a.setProp("validation_total", "")
            }, !1)
        },
        renderImageProperty: function() {
            var e = $("propertiesArea"),
                t = $fieldset({
                    "class": "propertyWrapper"
                }, $legend(lang.current("Image")));
            e.appendChild(t);
            var n = $div();
            t.appendChild(n), n.appendChild($img({
                src: "/images/picture.png"
            }));
            var i = $form({
                    id: "upload_image",
                    method: "post",
                    action: "/upload_image.php",
                    enctype: "multipart/form-data",
                    onsubmit: "return page.uploadImage()",
                    style: "display: inline"
                }),
                o = "survey_" + page.form.survey_id + "_" + this.id;
            i.appendChild($input({
                type: "hidden",
                id: "image_id",
                name: "id",
                value: o
            })), i.appendChild($input({
                type: "hidden",
                id: "type",
                name: "type",
                value: "field_image"
            })), i.appendChild($input({
                type: "file",
                id: "image",
                name: "image",
                style: ""
            })), i.appendChild($input({
                type: "submit",
                "class": "button green",
                value: "Upload"
            })), n.appendChild(i);
            var s = this.image ? "display: inline;" : "display: none";
            n.appendChild($input({
                style: s,
                id: "field_image_remove",
                type: "button",
                "class": "button red",
                value: lang.current("remove")
            })), Event.observe("field_image_remove", "click", function() {
                this.removeImage()
            }.bind(this), !1)
        },
        removeImage: function() {
            this.image = !1, Element.hide("field_image_remove")
        },
        showProperties: function() {
            this.renderProperty(lang.current("required"), "required", {
                yes: lang.current("yes"),
                no: lang.current("no")
            }), this.renderImageProperty()
        },
        setProp: function(e, t) {
            this[e] = t
        }
    }), itemizedFormObject = formObject.extend({
        constructor: function() {
            this.base(), this.items = new Array
        },
        save: function() {
            this.base();
            for (var e = 0; e < this.items.length; e++) this.items[e].save()
        },
        removeLanguage: function(e) {
            this.base(e);
            for (var t = 0; t < this.items.length; t++) this.items[t].removeLanguage(e)
        },
        changeLanguage: function(e) {
            this.base(e);
            for (var t = 0; t < this.items.length; t++) this.items[t].changeLanguage(e)
        },
        getSchema: function() {
            var e = this.base();
            e.layout = this.layout, e.codify_answers = this.codify_answers ? !0 : !1, e.items = new Array, this.otherOption && (e.otherOption = this.otherOption);
            for (var t = 0; t < this.items.length; t++) e.items[t] = this.items[t].getSchema();
            return e
        },
        setSchema: function(e) {
            if (this.base(e), this.layout = e && e.layout ? e.layout : "vertical", e && e.otherOption && (this.otherOption = e.otherOption), e && e.items)
                for (var t = 0; t < e.items.length; t++) this.add(this.buildNewItem()), this.items[t].setSchema(e.items[t]);
            this.codify_answers = e && e.codify_answers ? e.codify_answers : !1
        },
        add: function(e) {
            e.order = this.items.length, this.items[e.order] = e
        },
        addItem: function() {
            if (this.items.length >= page.form.questions) return void page.unavailable("question_options");
            var e = this.buildNewItem();
            e.isSelected = this.isSelected, this.add(e), this.items[this.items.length - 1].render($(this.id + "_items"), "vertical" == this.layout);
            this.id + "_items_" + (this.items.length - 1).toString();
            "yes" == this.otherOption && ($(this.id + "_items").removeChild($(this.id + "_items_other")), this.renderOtherOption($(this.id + "_items"))), this.select(this.isSelected)
        },
        delItem: function() {
            if (this.items.length > 1) {
                var e = this.items.length - 1,
                    t = $(this.id + "_items_" + e);
                this.items.removeAt(e), t.parentNode.removeChild(t)
            }
        },
        select: function(e) {
            try {
                this.base(e)
            } catch (t) {
                window.console && console.info(t)
            }
            var n = $(this.id),
                i = $(this.id + "_items_actions");
            if (e) {
                i.show(); {
                    Position.cumulativeOffset(n)[0] - 35, Position.cumulativeOffset(n)[1] + 25
                }
                i.style.top = "25px", i.style.left = "-35px"
            } else i.hide()
        },
        renderCommon: function(e) {
            var t = e.id + "_actions",
                n = e.id + "_actions_add",
                i = e.id + "_actions_del",
                o = $div({
                    id: t,
                    "class": "itemActions",
                    style: "display:none"
                });
            return o.innerHTML = "<img id='" + n + "' src='/images/add.png' title='" + lang.current("addItem") + "' class='clickable'/><br/>", o.innerHTML += "<img class='clickable' id='" + i + "' src='/images/delete.png' title='" + lang.current("delItem") + "' />", e.appendChild(o), Event.observe(n, "click", function() {
                this.addItem(e.id)
            }.bind(this), !1), Event.observe(i, "click", function() {
                this.delItem(e.id)
            }.bind(this), !1), e
        },
        render: function(e) {
            this.base(e);
            for (var t = $(this.id + "_items"), n = this.renderCommon(t), i = 0; i < this.items.length; i++) {
                var o = this.items[i];
                o.render(n, "vertical" == this.layout)
            }
            "yes" == this.otherOption && this.renderOtherOption(n), $(e).appendChild($div({
                style: "clear:both"
            })), this.select(this.isSelected)
        }
    }), arrayFormObject = itemizedFormObject.extend({
        constructor: function() {
            this.base(), this.headerTitles = new Array
        },
        startup: function() {
            this.add(this.buildNewItem()), this.add(this.buildNewItem())
        },
        initHeaders: function() {
            this.headerTitles = new Array, this.hasHeaders = !0;
            for (var e = 0; e < this.columns; e++) this.headerTitles[e] = new htmlTextArea("100%", "15px")
        },
        addItem: function() {
            if (this.items.length >= page.form.questions - 2) return void page.unavailable("matrix_questions");
            var e = this.buildNewItem();
            e.isSelected = this.isSelected, e.id = this.id + "_items_" + (this.items.length - 1).toString(), this.add(e), this.items[this.items.length - 1].render($(this.id + "_array"), !0), this.select(this.isSelected)
        },
        delItem: function() {
            if (this.items.length > 1) {
                var e = this.items.length - 1,
                    t = $(this.id + "_array_" + e);
                this.items.removeAt(e), t.parentNode.removeChild(t)
            }
        },
        addColumn: function() {
            this.setColumns(this.columns + 1) && (this.headerTitles[this.headerTitles.length] = new htmlTextArea("100%", "15px"), this.refresh(), this.resizeAllColumns())
        },
        delColumn: function() {
            this.setColumns(this.columns - 1) && (this.headerTitles.removeAt(this.headerTitles.length - 1), this.refresh(), this.resizeAllColumns())
        },
        resizeAllColumns: function() {
            for (var e = 0; e < this.headerTitles.length; e++) this.headerTitles[e].resize()
        },
        setColumns: function(e) {
            if (e > 0 && 40 > e) {
                this.columns = e;
                for (var t = 0; t < this.items.length; t++) this.items[t].columns = this.columns
            }
            return this.columns == e
        },
        removeLanguage: function(e) {
            if (this.base(e), this.hasHeaders)
                for (var t = 0; t < this.headerTitles.length; t++) this.headerTitles[t].removeLanguage(e)
        },
        changeLanguage: function(e) {
            if (this.base(e), this.hasHeaders)
                for (var t = 0; t < this.headerTitles.length; t++) this.headerTitles[t].changeLanguage(e);
            $$(".other").each(function(t) {
                t.innerHTML = lang.get(page.form.languages[e], "other")
            })
        },
        save: function() {
            if (this.base(), this.hasHeaders)
                for (var e = 0; e < this.headerTitles.length; e++) this.headerTitles[e].save()
        },
        getSchema: function() {
            var e = this.base();
            if (e.columns = this.columns, e.hasHeaders = this.hasHeaders, this.hasHeaders) {
                e.headerTitles = new Array;
                for (var t = 0; t < this.columns; t++) e.headerTitles[t] = this.headerTitles[t].getSchema()
            }
            return e
        },
        setSchema: function(e) {
            if (this.base(e), this.setColumns(e.columns), this.hasHeader = e.hasHeader, this.hasHeaders) {
                this.initHeaders();
                for (var t = 0; t < this.columns; t++) e.headerTitles && e.headerTitles[t] && this.headerTitles[t].setSchema(e.headerTitles[t])
            }
        },
        renderCommon: function(e) {
            if (this.base(e), "textFieldArray" != this.type) {
                var t = e.id + "_matrix2_actions",
                    n = e.id + "_matrix2_actions_add",
                    i = e.id + "_matrix2_actions_del",
                    o = $div({
                        id: t,
                        "class": "matrixActions",
                        style: "display:block; text-align:right; padding-bottom: 5px"
                    });
                o.innerHTML = lang.current("Columns") + ": <img id='" + n + "' src='/images/add.png' title='" + lang.current("addItem") + "' class='clickable'/>", o.innerHTML += "<img class='clickable' id='" + i + "' src='/images/delete.png' title='" + lang.current("delItem") + "' />", e.appendChild(o), Event.observe(n, "click", function() {
                    this.addColumn(e.id)
                }.bind(this), !1), Event.observe(i, "click", function() {
                    this.delColumn(e.id)
                }.bind(this), !1)
            }
            var s = $div({
                style: "overflow-x:auto; width: 100%"
            });
            e.appendChild(s);
            var r = $table({
                "class": "arrayTable"
            });
            s.appendChild(r);
            var a = $tbody({
                id: this.id + "_array"
            });
            if (r.appendChild(a), this.hasHeaders) {
                var l = $tr({
                    id: e.id + "_header"
                });
                a.appendChild(l), l.appendChild($td({
                    style: "width: 30%; min-width: 140px; border:0"
                }));
                var c = 3 * page.form.width / 6,
                    d = Math.round(c / this.columns);
                30 > d ? d = "30px" : d += "px";
                for (var u = 0; u < this.columns; u++) {
                    var h = $td({
                        "class": "arrayColHeader",
                        style: "width:" + d + ";position:relative;"
                    });
                    l.appendChild(h), this.headerTitles[u].id = l.id + "_col" + u.toString(), this.headerTitles[u].cssClass = "arrayColHeader", this.headerTitles[u].width = d, this.headerTitles[u].render(h)
                }
            }
            var t = e.id + "_matrix_actions",
                n = e.id + "_matrix_actions_add",
                i = e.id + "_matrix_actions_del",
                o = $div({
                    id: t,
                    "class": "matrixActions",
                    style: "display:block"
                });
            return o.innerHTML = lang.current("Rows") + ": <img id='" + n + "' src='/images/add.png' title='" + lang.current("addItem") + "' class='clickable'/>", o.innerHTML += "<img class='clickable' id='" + i + "' src='/images/delete.png' title='" + lang.current("delItem") + "' />", e.appendChild(o), Event.observe(n, "click", function() {
                this.addItem(e.id)
            }.bind(this), !1), Event.observe(i, "click", function() {
                this.delItem(e.id)
            }.bind(this), !1), a
        },
        showProperties: function() {
            if (this.base(), this.canResize) {
                var e = $("propertiesArea"),
                    t = $fieldset({
                        "class": "propertyWrapper"
                    }, $legend(lang.current("columns")));
                e.appendChild(t);
                var n = $div();
                n.innerHTML = "<img id='" + this.id + "_delCol' src='/images/delete.png' class='clickable' /><span id='cols'>" + this.columns + "</span><img id='" + this.id + "_addCol' src='/images/add.png' class='clickable' />", t.appendChild(n), Event.observe(this.id + "_delCol", "click", this.delColumn.bind(this), !1), Event.observe(this.id + "_addCol", "click", this.addColumn.bind(this), !1)
            }
        },
        select: function(e) {
            this.resizeAllColumns();
            try {
                this.base(e)
            } catch (t) {
                window.console && console.info(t)
            }
            var n = ($(this.id), $(this.id + "_items_actions")),
                i = $(this.id + "_items_matrix_actions"),
                o = $(this.id + "_items_matrix2_actions");
            e ? (n && n.hide(), i && (i.style.visibility = "visible"), o && (o.style.visibility = "visible")) : (n && n.hide(), i && (i.style.visibility = "hidden"), o && (o.style.visibility = "hidden"))
        }
    });
var multiSelect = itemizedFormObject.extend({
        constructor: function() {
            this.base(), this.type = "multiSelect", this.layout = "vertical", this.otherOption = "no"
        },
        startup: function() {
            for (var e = 0; 4 > e; e++) this.add(this.buildNewItem())
        },
        buildNewItem: function() {
            return new htmlCheckBox
        },
        changeLanguage: function(e) {
            this.base(e), $$(".other").each(function(t) {
                t.innerHTML = lang.get(page.form.languages[e], "other")
            })
        },
        showProperties: function() {
            this.base(), this.renderProperty(lang.current("layout"), "layout", {
                horizontal: lang.current("horizontal"),
                vertical: lang.current("vertical")
            }), this.renderProperty(lang.current("otherOption"), "otherOption", {
                yes: lang.current("yes"),
                no: lang.current("no")
            })
        },
        renderOtherOption: function(e) {
            var t = "vertical" == this.layout,
                n = $p(t ? {
                    id: e.id + "_other"
                } : {
                    id: e.id + "_other",
                    style: "clear: both; padding-top: 3px"
                });
            e.appendChild(n), n.appendChild($input({
                type: "checkbox"
            })), n.appendChild($span({
                "class": "itemText other"
            }, lang.get(page.form.languages[page.form.selectedLanguage], "other"))), n.appendChild($input({
                type: "text",
                "class": "textfield",
                style: "width:50%"
            }))
        }
    }),
    exclusiveSelect = itemizedFormObject.extend({
        constructor: function() {
            this.base(), this.type = "exclusiveSelect", this.layout = "vertical", this.skip = {}, this.otherOption = "no"
        },
        startup: function() {
            for (var e = 0; 4 > e; e++) this.add(this.buildNewItem())
        },
        buildNewItem: function() {
            return new htmlRadioButton
        },
        changeLanguage: function(e) {
            this.base(e), $$(".other").each(function(t) {
                t.innerHTML = lang.get(page.form.languages[e], "other")
            })
        },
        setSchema: function(e) {
            this.base(e), this.skip = e.skip || this.skip
        },
        getSchema: function() {
            var e = this.base();
            return e.skip = this.skip, e
        },
        showProperties: function() {
            this.base(), this.renderProperty(lang.current("layout"), "layout", {
                horizontal: lang.current("horizontal"),
                vertical: lang.current("vertical")
            }), this.renderProperty(lang.current("otherOption"), "otherOption", {
                yes: lang.current("yes"),
                no: lang.current("no")
            }), this.renderSkipProperty()
        },
        renderSkipProperty: function(e) {
            var e = $("propertiesArea"),
                t = $fieldset({
                    "class": "propertyWrapper skiplogic"
                }, $legend(lang.current("Skip_Logic")));
            e.appendChild(t);
            for (var n = page.form.pages.length, i = page.form.currentPage, o = new Array, s = 1; n >= s; s++) s != i && o.push(s.toString());
            var r = $div();
            t.appendChild(r);
            for (var s = 0; s < this.items.length; s++) {
                var a = r.appendChild($div({
                        style: "padding:0; margin: 1em 0; border-bottom: 1px solid #fafafa"
                    })),
                    l = $div({
                        style: "text-align:right; padding:0; display: inline-block"
                    });
                l.appendChild($span(lang.current("Jump_to_Page")));
                var c = $select({
                    id: e.id + "_skip_page_" + this.items[s].id,
                    name: "select_" + s
                });
                c.appendChild($option());
                for (var d = 0; d < o.length; d++) c.appendChild(this.skip[s] == o[d] ? $option({
                    value: o[d],
                    selected: "selected"
                }, o[d]) : $option({
                    value: o[d]
                }, o[d]));
                l.appendChild(c);
                var u = this.items[s].itemText.itemText[page.form.selectedLanguage] ? this.items[s].itemText.itemText[page.form.selectedLanguage] : "";
                a.appendChild($span({
                    "class": "option",
                    style: "display:inline-block; width: 55%"
                }, u)), a.appendChild(l);
                var h = this;
                Event.observe(c.id, "change", function() {
                    var e = this.name;
                    e = e.replace("select_", ""), h.skip[e] = this.value
                })
            }
        },
        renderOtherOption: function(e) {
            var t = "vertical" == this.layout,
                n = $p(t ? {
                    id: e.id + "_other"
                } : {
                    id: e.id + "_other",
                    style: "clear: both; padding-top: 3px"
                });
            e.appendChild(n), n.appendChild($input({
                type: "radio",
                name: e.id
            })), n.appendChild($span({
                "class": "itemText other"
            }, lang.get(page.form.languages[page.form.selectedLanguage], "other"))), n.appendChild($input({
                type: "text",
                "class": "textfield",
                style: "width:50%"
            }))
        }
    }),
    exclusiveSelectArray = arrayFormObject.extend({
        constructor: function() {
            this.type = "exclusiveSelectArray", this.columns = 4, this.canResize = !0, this.base(), this.initHeaders()
        },
        buildNewItem: function() {
            return new htmlRadioButtonArray(this.columns)
        }
    }),
    multiSelectArray = arrayFormObject.extend({
        constructor: function() {
            this.type = "multiSelectArray", this.columns = 4, this.canResize = !0, this.base(), this.initHeaders()
        },
        buildNewItem: function() {
            return new htmlCheckBoxArray(this.columns)
        }
    }),
    textFieldArray = arrayFormObject.extend({
        constructor: function() {
            this.base(), this.columns = 1, this.type = "textFieldArray", this.size = "small"
        },
        setSchema: function(e) {
            this.base(e), this.type = "textFieldArray", this.size = e && e.size ? e.size : "small", this.columns = 1, this.validation = e && e.validation ? e.validation : "Text", this.validation_details = e && e.validation_details ? e.validation_details : "", this.validation_total = e && e.validation_total ? e.validation_total : "", this.is_token = e && e.is_token, this.applySize(this.size)
        },
        getSchema: function() {
            var e = this.base();
            return e.size = this.size, e.validation = this.validation, e.validation_details = this.validation_details, e.validation_total = this.validation_total, e.is_token = this.is_token, e
        },
        buildNewItem: function() {
            return new htmlTextFieldArray(this.columns, this.size)
        },
        showProperties: function() {
            this.base(), this.renderProperty(lang.current("size"), "size", {
                small: lang.current("small"),
                large: lang.current("large")
            }), this.renderListProperty(lang.current("validation"), "validation", {
                Text: {
                    text: lang.current("Text"),
                    with_details: !1
                },
                Number: {
                    text: lang.current("Number"),
                    with_details: "0..100",
                    with_details_label: lang.current("Range"),
                    with_total: "0..100",
                    with_total_label: lang.current("Total")
                },
                Custom: {
                    text: lang.current("Custom"),
                    with_details: "2013-dd-dd",
                    with_details_label: lang.current("Regex")
                }
            })
        },
        setProp: function(e, t) {
            this[e] = t, "size" == e && this.applySize(t), this.refresh()
        },
        applySize: function(e) {
            for (var t = 0; t < this.items.length; t++) this.items[t].size = e
        }
    }),
    starRatingArray = arrayFormObject.extend({
        constructor: function() {
            this.type = "starRatingArray", this.columns = 1, this.stars = 5, this.base()
        },
        buildNewItem: function() {
            return new htmlStarRatingArray(this.columns, this.stars)
        },
        showProperties: function() {
            this.base();
            var e = $("propertiesArea"),
                t = $fieldset({
                    "class": "propertyWrapper"
                }, $legend(lang.current("Stars")));
            e.appendChild(t);
            var n = $div();
            n.innerHTML = "<img id='" + this.id + "_delStar' src='/images/delete.png' class='clickable' /><span id='cols'>" + this.stars + "</span><img id='" + this.id + "_addStar' src='/images/add.png' class='clickable' />", t.appendChild(n), Event.observe(this.id + "_delStar", "click", this.delStar.bind(this), !1), Event.observe(this.id + "_addStar", "click", this.addStar.bind(this), !1)
        },
        setSchema: function(e) {
            this.base(e), this.stars = e && e.stars ? e.stars : 5, this.columns = 1, this.applySize(this.stars)
        },
        getSchema: function() {
            var e = this.base();
            return e.stars = this.stars, e
        },
        addStar: function() {
            this.stars < 11 && (this.stars = this.stars + 1, this.applySize(this.stars), this.refresh(), $("cols").innerText = this.stars)
        },
        delStar: function() {
            this.stars > 1 && (this.stars = this.stars - 1, this.applySize(this.stars), this.refresh(), $("cols").innerText = this.stars)
        },
        select: function(e) {
            try {
                this.base(e)
            } catch (t) {
                window.console && console.info(t)
            }
            var n = $(this.id + "_items_matrix2_actions");
            $(n).hide()
        },
        applySize: function(e) {
            for (var t = 0; t < this.items.length; t++) this.items[t].numberOfStars = e
        }
    }),
    countrySelect = formObject.extend({
        constructor: function() {
            this.base(), this.setSchema()
        },
        setSchema: function(e) {
            this.base(e), this.type = "countrySelect"
        },
        getSchema: function() {
            var e = this.base();
            return e
        },
        render: function(e) {
            this.base(e);
            var t = $(this.id + "_items"),
                n = $select({
                    id: t.id + "_text"
                }, $option("..."), $option("United States"), $option("United Kingdom"), $option("Spain"), $option("France"), $option("Portugal"), $option("..."));
            t.appendChild(n), this.select(this.isSelected)
        }
    }),
    timezoneSelect = formObject.extend({
        constructor: function() {
            this.base(), this.setSchema()
        },
        setSchema: function(e) {
            this.base(e), this.type = "timezoneSelect"
        },
        getSchema: function() {
            var e = this.base();
            return e
        },
        render: function(e) {
            this.base(e);
            var t = $(this.id + "_items"),
                n = $select({
                    id: t.id + "_text"
                }, $("(...)"), $option("United States"), $option("United Kingdom"), $option("Spain"), $option("France"), $option("Portugal"), $option("(...)"));
            t.appendChild(n), this.select(this.isSelected)
        }
    }),
    fileUpload = formObject.extend({
        constructor: function() {
            this.base(), this.setSchema()
        },
        setSchema: function(e) {
            this.base(e), this.type = "fileUpload"
        },
        getSchema: function() {
            var e = this.base();
            return e
        },
        render: function(e) {
            this.base(e);
            var t = $(this.id + "_items"),
                n = $input({
                    type: "file"
                });
            t.appendChild(n), this.select(this.isSelected)
        }
    }),
    freeTextField = formObject.extend({
        save: function() {
            if (this.nic) {
                if (e = this.findNic(), !e) return;
                this.html[page.form.selectedLanguage] = e.getContent(), this.nic.removeInstance(this.id + "_richtext");
                var t = $(this.id + "_items");
                t.innerHTML = '<div id="' + this.id + '_area"class="freetext"> ' + this.html[page.form.selectedLanguage] + "</div>"
            }
        },
        constructor: function() {
            this.html = new Array;
            for (var e = 0; e < page.form.languages.length; e++) this.html[e] = page.form.languages[e].untitledHelpText;
            this.html[page.form.selectedLanguage] = locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText, this.base(), this.setSchema()
        },
        removeLanguage: function(e) {
            this.base(e), this.html.removeAt(e)
        },
        changeLanguage: function() {
            "undefined" == typeof this.html[page.form.selectedLanguage] && (this.html[page.form.selectedLanguage] = locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText);
            var e = $(this.id + "_items");
            e.innerHTML = '<div id="' + this.id + '_area"class="freetext"> ' + this.html[page.form.selectedLanguage] + "</div>"
        },
        setSchema: function(e) {
            if (this.base(e), e && e.html && "object" == typeof e.html)
                for (var t = 0; t < e.html.length; t++) this.html[t] = decodeURIComponent(e.html[t]);
            else e && e.html && (this.html[0] = decodeURIComponent(e.html));
            this.type = "freeTextField"
        },
        getSchema: function() {
            var e = this.base();
            this.select(!1), e.html = new Array;
            for (var t = 0; t < this.html.length; t++) {
                var n = this.html[t];
                try {
                    e.html[t] = encodeURIComponent(n)
                } catch (i) {
                    e.html[t] = this.cleanWordPaste(e.html[t]), e.html[t] = e.html[t].replace("%", "pct")
                }
            }
            return e
        },
        cleanWordPaste: function(e) {
            var t = e.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
            return t = t.replace(/"/gi, "").replace(/'/gi, "")
        },
        findNic: function() {
            for (i = 0; i < this.nic.nicInstances.length; i++)
                if (this.nic.nicInstances[i].copyElm.id == this.id + "_richtext") return this.nic.nicInstances[i]
        },
        render: function(e) {
            container = this.createMainDiv(e);
            var t = this.html[page.form.selectedLanguage],
                n = $div({
                    id: this.id + "_items",
                    "class": "uiObjectItems"
                });
            container.appendChild(n), n.innerHTML = '<div id="' + this.id + '_area"class="freetext"> ' + t + "</div>", this.select(this.isSelected)
        },
        showProperties: function() {
            return !1
        },
        select: function(t) {
            this.base(t);
            var n = page.form.selectedLanguage;
            if (t) {
                if (!$(this.id + "_area")) return;
                var i = ($(this.id + "_area").innerHTML, $(this.id + "_items"));
                this.html[n] == locales[page.form.languages[n]].untitledHelpText && (this.html[n] = "");
                var o = "100%";
                (/msie/i.test(navigator.userAgent) || /Trident/i.test(navigator.userAgent)) && (o = "580px"), i.innerHTML = '<textarea id="' + this.id + '_richtext" class="freetext" style="width:' + o + '"> ' + this.html[page.form.selectedLanguage] + "</textarea>";
                var s = ["bold", "italic", "underline", "left", "center", "right", "justify", "ol", "ul", "hr", "forecolor", "bgcolor", "fontSize", "fontFamily", "fontFormat", "image", "link"];
                this.nic = new nicEditor({
                    iconsPath: "/images/niceditor_icons.gif",
                    buttonList: s
                }), this.nic.panelInstance(this.id + "_richtext")
            } else if (this.nic) {
                if (e = this.findNic(), !e) return;
                var r = e.getContent();
                r = r.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " "), this.html[n] = r, ("" == this.html[n] || "<br>" == this.html[n].toLowerCase()) && (this.html[n] = locales[page.form.languages[n]].untitledHelpText), this.nic.removeInstance(this.id + "_richtext");
                var i = $(this.id + "_items");
                i.innerHTML = '<div id="' + this.id + '_area"class="freetext"> ' + this.html[n] + "</div>"
            }
        }
    }),
    videoField = formObject.extend({
        constructor: function() {
            this.mode = "youtube", this.video_id = "ScMzIvxBSi4", this.base(), this.setSchema()
        },
        setSchema: function(e) {
            this.base(e), this.video_id = e && e.video_id ? e.video_id : this.video_id, this.type = "videoField"
        },
        getSchema: function() {
            var e = this.base();
            return e.mode = this.mode, e.video_id = this.video_id, e
        },
        render: function(e) {
            this.base(e);
            var t = $(this.id + "_items");
            t.addClassName("alignCenter"), t.innerHTML = navigator.userAgent.toLowerCase().match("msie 6") ? '<embed src="http://www.youtube.com/v/' + this.video_id + '" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350"></embed>' : '<object width="425" height="350"><param name="movie" value="http://www.youtube.com/v/' + this.video_id + '"></param><param name="wmode" value="transparent"></param><embed src="http://www.youtube.com/v/' + this.video_id + '" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350"></embed></object>', this.select(this.isSelected)
        },
        showProperties: function() {
            this.base();
            var e = $("propertiesArea"),
                t = $fieldset({
                    "class": "propertyWrapper"
                }, $legend("video source"));
            e.appendChild(t);
            var n = $div();
            n.innerHTML = 'youtube id: <input type="text" class="inset" id="propVideoId" value="' + this.video_id + '"/><input id="propVideoSave" type="button" class="button green" value="ok" />', t.appendChild(n), Event.observe("propVideoSave", "click", function() {
                this.setProp("video_id", $("propVideoId").value)
            }.bind(this))
        }
    }),
    audioField = formObject.extend({
        constructor: function() {
            this.mode = "mp3", this.sound = "ignition.mp3", this.base(), this.setSchema()
        },
        setSchema: function(e) {
            this.base(e), this.sound = e && e.sound ? e.sound : this.sound, this.type = "audioField"
        },
        getSchema: function() {
            var e = this.base();
            return e.mode = this.mode, e.sound = this.sound, e
        },
        render: function(e) {
            mp3_path = "/uploads/audio/" + this.sound, this.base(e);
            var t = $(this.id + "_items");
            t.innerHTML = '<object type="application/x-shockwave-flash" data="/js/player.swf" id="' + this.id + '_audioplayer1" height="24" width="290">    <param name="movie" value="/js/player.swf">    <param name="FlashVars" value="playerID=' + this.id + "_audioplayer1&soundFile=" + mp3_path + '">    <param name="quality" value="high">    <param name="menu" value="false">    <param name="wmode" value="transparent">    </object>', this.select(this.isSelected)
        },
        showProperties: function() {
            this.base();
            var e = $("propertiesArea"),
                t = $fieldset({
                    "class": "propertyWrapper"
                }, $legend(lang.current("audioFile")));
            e.appendChild(t);
            var n = $div();
            t.appendChild(n), n.appendChild($img({
                src: "/images/sound.png"
            }));
            var i = $form({
                    id: "upload_audio",
                    method: "post",
                    action: "/upload_audio.php",
                    enctype: "multipart/form-data",
                    onsubmit: "return page.uploadAudio()",
                    style: "display: inline"
                }),
                o = "survey_" + page.form.survey_id + "_" + this.id;
            i.appendChild($input({
                type: "hidden",
                id: "audio_id",
                name: "id",
                value: o
            })), i.appendChild($input({
                type: "hidden",
                id: "type",
                name: "type",
                value: "mp3"
            })), i.appendChild($input({
                type: "file",
                id: "audio",
                name: "audio",
                style: ""
            })), i.appendChild($input({
                type: "submit",
                "class": "button green",
                value: "Upload",
                id: "upload_audio_submit"
            })), n.appendChild(i)
        }
    }),
    mapSelect = formObject.extend({
        constructor: function() {
            this.base(), this.setSchema()
        },
        save: function() {
            this.base(), this.zoom = this.map.getZoom(), this.lat = this.map.getCenter().lat(), this.lng = this.map.getCenter().lng(), this.mode = this.map.getCurrentMapType().getName()
        },
        setSchema: function(e) {
            this.base(e), this.type = "mapSelect", this.zoom = e ? e.zoom : 1, this.lat = e ? e.lat : 0, this.lng = e ? e.lng : 0, this.mode = e ? e.mode : "Map"
        },
        getSchema: function() {
            var e = this.base();
            return e.zoom = this.zoom, e.lat = this.lat, e.lng = this.lng, e.mode = this.mode, e
        },
        render: function(e) {
            this.base(e);
            var t = $(this.id + "_items");
            t.addClassName("alignCenter map"), t.style.height = "300px", GBrowserIsCompatible() && (this.map = new GMap2(t), this.map.setCenter(new GLatLng(this.lat, this.lng), this.zoom), this.setMapType(), this.map.disableScrollWheelZoom()), this.select(this.isSelected)
        },
        setMapType: function() {
            switch (this.mode) {
                case "Map":
                    this.map.setMapType(G_NORMAL_MAP);
                    break;
                case "Satellite":
                    this.map.setMapType(G_SATELLITE_MAP);
                    break;
                case "Hybrid":
                    this.map.setMapType(G_HYBRID_MAP);
                    break;
                default:
                    this.map.setMapType(G_NORMAL_MAP)
            }
        }
    }),
    textField = formObject.extend({
        constructor: function() {
            this.base(), this.setSchema()
        },
        getSchema: function() {
            var e = this.base();
            return e.size = this.size, e.rows = this.rows, e.validation = this.validation, e.validation_details = this.validation_details, e.is_token = this.is_token, e
        },
        setSchema: function(e) {
            this.base(e), this.type = "textField", this.size = e && e.size ? e.size : "small", this.rows = e && e.rows ? e.rows : "5", this.validation = e && e.validation ? e.validation : "Text", this.validation_details = e && e.validation_details ? e.validation_details : "", this.is_token = e && e.is_token
        },
        render: function(e) {
            this.base(e);
            var t = $(this.id + "_items"),
                n = "large" == this.size ? $textarea({
                    id: t.id + "_text",
                    rows: this.rows,
                    "class": "textfield",
                    style: "width:99%"
                }) : $input({
                    id: t.id + "_text",
                    type: "text",
                    size: "50",
                    "class": "textfield",
                    style: "width:99%"
                });
            t.appendChild(n), this.select(this.isSelected)
        },
        showProperties: function() {
            this.base(), this.renderPropertyWithOption(lang.current("size"), "size", {
                large: lang.current("large"),
                small: lang.current("small")
            }, "rows", lang.current("Rows")), this.renderListProperty(lang.current("validation"), "validation", {
                Text: {
                    text: lang.current("Text"),
                    with_details: !1
                },
                Number: {
                    text: lang.current("Number"),
                    with_details: "0..100",
                    with_details_label: lang.current("Range")
                },
                Custom: {
                    text: lang.current("Custom"),
                    with_details: "2013-\\d\\d-\\d\\d",
                    with_details_label: lang.current("Regex")
                }
            })
        }
    });
sliderField = formObject.extend({
    constructor: function() {
        this.base(), this.setSchema()
    },
    getSchema: function() {
        var e = this.base();
        return e.showCounter = this.showCounter, e.default_value = $(this.id + "_items_text").value, e.maxValue = this.maxValue, e
    },
    setSchema: function(e) {
        this.base(e), this.type = "slider", this.default_value = e && e.default_value ? e.default_value : 50, this.showCounter = e && e.showCounter ? e.showCounter : "yes", this.maxValue = e && e.maxValue ? e.maxValue : 100
    },
    render: function(e) {
        this.base(e);
        var t = $(this.id + "_items"),
            n = $input({
                id: t.id + "_text",
                type: "text",
                size: "50",
                "class": "textfield",
                style: "width:99%"
            });
        t.appendChild(n), this.default_value > this.maxValue && (this.default_value = 0);
        var i = "yes" == this.showCounter ? "display: inline" : "display: none",
            o = 400 * this.default_value / (this.maxValue - 0) - 12 - 5,
            s = '<div style="float:left; width:400px;"><div style="position:relative;width:400px;padding-bottom:20px;">  		<div style="border-left:solid 1px #b0b0b0;border-top:solid 1px #b0b0b0;margin-top:5px;font-size:1px;height:3px;">  			<div style="border-top:solid 2px #e7eaea;"></div>  		</div>  		<div ontouchstart="dragslider(this,\'' + t.id + "_text',400,0," + this.maxValue + ',50);"	onmousedown="dragslider(this,\'' + t.id + "_text',400,0," + this.maxValue + ',50);" style="position:absolute;top:-15px;left:' + o + 'px;width:40px;height:30px;font-size:1px;background:transparent url(/images/slider.gif) no-repeat center center;"></div>  	</div></div><input id="' + t.id + '_text" type="text" style="float:left; width: 3em; margin-top: -.5em; margin-left: 1.5em;' + i + '" value="' + this.default_value + '" readonly="1"></input><div style="clear:both; height:0em"></div>';
        t.innerHTML = s, this.select(this.isSelected)
    },
    showProperties: function() {
        this.base(), this.renderProperty(lang.current("showCounter"), "showCounter", {
            yes: lang.current("yes"),
            no: lang.current("no")
        });
        var e = $("propertiesArea"),
            t = $fieldset({
                "class": "propertyWrapper"
            }, $legend("Maximum Value"));
        e.appendChild(t);
        var n = $div();
        n.innerHTML = '0 - <input type="text" class="inset" id="slider_max_value" value="' + this.maxValue + '" style="width:4em" />', t.appendChild(n);
        var i = this;
        Event.observe("slider_max_value", "keyup", function() {
            var e = /^\d+$/;
            e.test(this.value) && this.value > 0 && i.setProp("maxValue", this.value)
        })
    }
});
var dateField = formObject.extend({
        constructor: function() {
            this.base(), this.setSchema()
        },
        getSchema: function() {
            var e = this.base();
            return e.value = $(this.id + "_items_date").value, e
        },
        setSchema: function(e) {
            this.base(e), this.type = "dateField", this.value = e && e.value ? e.value : ""
        },
        setupPicker: function(e) {
            this.picker && this.picker.destroy(), e = e ? e : this.id + "_items_date", this.picker = new Pikaday({
                field: document.getElementById(e),
                format: "YYYY-MM-DD",
                locale: page.form.languages[page.form.selectedLanguage]
            })
        },
        changeLanguage: function(e) {
            this.base(e), this.setupPicker()
        },
        render: function(e) {
            this.base(e);
            var t = $(this.id + "_items"),
                n = $input({
                    id: t.id + "_date",
                    type: "text",
                    "class": "datefield",
                    value: this.value
                });
            t.appendChild(n), this.select(this.isSelected), this.setupPicker(t.id + "_date")
        },
        showProperties: function() {
            this.base()
        }
    }),
    dropDown = formObject.extend({
        constructor: function() {
            this.base(), this.setSchema()
        },
        getSchema: function() {
            var e = this.base();
            e.options = new Array, e.options = deepCopy(this.options);
            for (var t = 0; t < e.options.length; t++)
                for (var n = e.options[t], i = 0; i < n.length; i++) e.options[t][i] = e.options[t][i] ? e.options[t][i].replace(/(")/g, "") : "", e.options[t][i] = e.options[t][i] ? e.options[t][i].replace(/(\&)/g, "%26") : "";
            return e
        },
        setSchema: function(e) {
            if (this.base(e), this.type = "dropDown", this.options = new Array, this.options[page.form.selectedLanguage] = new Array("Item 1", "Item 2"), e && e.options[0].constructor != Array) {
                var t = e.options;
                e.options = new Array, e.options[0] = t
            }
            this.options = e && e.options ? e.options : this.options
        },
        addItem: function() {
            var e = $(this.id + "_items_select").value;
            if (e) {
                var t = this.options[page.form.selectedLanguage].length;
                this.options[page.form.selectedLanguage][t] = e, this.refresh(), EditableSelect.showSelect(this.elem)
            }
        },
        delItem: function(e) {
            var t = $(e.element()).classNames().toString();
            isNaN(parseInt(t)) || (this.options[page.form.selectedLanguage].splice(t, 1), this.refresh(), EditableSelect.showSelect(this.elem))
        },
        render: function(e) {
            this.base(e);
            var t = $(this.id + "_items"),
                n = $input({
                    id: t.id + "_select",
                    "class": "one"
                });
            t.appendChild(n);
            var i = $input({
                type: "button",
                "class": "small button green",
                style: "padding-top:1px; padding-bottom:1px; margin-left: 1em",
                value: lang.current("Add Item")
            });
            t.appendChild(i);
            var o = {
                data: this.options[page.form.selectedLanguage],
                width: 300
            };
            EditableSelect.init(n.id, o, this), Event.observe(i, "click", this.addItem.bindAsEventListener(this)), this.elem = n, this.select(this.isSelected)
        },
        select: function(e) {
            this.base(e), !e && this.elem && EditableSelect.hideSelect(this.elem)
        },
        changeLanguage: function() {
            this.options[page.form.selectedLanguage] = this.options[page.form.selectedLanguage] ? this.options[page.form.selectedLanguage] : new Array("Item 1", "Item 2"), this.base(), this.refresh()
        }
    }),
    starRating = itemizedFormObject.extend({
        constructor: function() {
            this.base(), this.setSchema()
        },
        getSchema: function() {
            var e = this.base();
            return e.numberOfStars = this.numberOfStars, e
        },
        setSchema: function(e) {
            this.base(e), this.type = "starRating", this.numberOfStars = e && e.numberOfStars ? e.numberOfStars : 5
        },
        addItem: function() {
            this.numberOfStars++, this.renderStar($(this.id + "_items"), this.numberOfStars - 1), Element.hide(this.id + "_items_star" + (this.numberOfStars - 1).toString()), new Effect.Appear(this.id + "_items_star" + (this.numberOfStars - 1).toString())
        },
        delItem: function() {
            this.numberOfStars > 1 && (this.numberOfStars--, $(this.id + "_items_star" + this.numberOfStars).parentNode.removeChild($(this.id + "_items_star" + this.numberOfStars)))
        },
        render: function(e) {
            this.base(e);
            for (var t = $(this.id + "_items"), n = 0; n < this.numberOfStars; n++) this.renderStar(t, n);
            this.select(this.isSelected)
        },
        renderStar: function(e, t) {
            var n = $img({
                id: e.id + "_star" + t.toString(),
                src: "/images/starrat.gif",
                title: t + 1 + "/" + this.numberOfStars,
                "class": "star",
                name: t
            });
            e.appendChild(n), Event.observe(n, "mouseover", this.starOn.bindAsEventListener(this)), Event.observe(n, "mouseout", this.starOff.bindAsEventListener(this))
        },
        starOn: function(e) {
            for (var t = e.target ? e.target.name : e.srcElement.name, n = 0; t >= n; n++) {
                var i = this.id + "_items_star" + n.toString();
                $(i).src = "/images/starrat-selected.gif"
            }
        },
        starOff: function() {
            for (var e = 0; e < this.numberOfStars; e++) $(this.id + "_items_star" + e).src = "/images/starrat.gif"
        }
    });
htmlItem = Base.extend({
    constructor: function() {
        this.itemText = new htmlTextLine, this.setSchema()
    },
    getSchema: function() {
        var e = new Object;
        return e.itemText = this.itemText.getSchema(), e
    },
    setSchema: function(e) {
        this.isSelected = !1, e && e.itemText && this.itemText.setSchema(e.itemText)
    },
    save: function() {
        this.itemText.save()
    },
    removeLanguage: function(e) {
        this.itemText.removeLanguage(e)
    },
    changeLanguage: function(e) {
        this.itemText.changeLanguage(e)
    },
    render: function(e, t) {
        this.id = e.id + "_" + this.order;
        var n = $p(t ? {
            id: this.id
        } : {
            id: this.id,
            style: "float:left; width:33%"
        });
        e.appendChild(n), this.renderItem(n), this.itemText.id = this.id + "_label", this.itemText.render(n, !1)
    }
}), htmlCheckBox = htmlItem.extend({
    getSchema: function() {
        var e = this.base();
        return e.checked = this.checked, e
    },
    setSchema: function(e) {
        this.base(e), this.checked = e && e.checked ? !0 : !1
    },
    save: function() {
        this.base(), this.checked = $F(this.id + "_cb") ? !0 : !1
    },
    renderItem: function(e) {
        var t = $input({
            id: this.id + "_cb",
            type: "checkbox"
        });
        e.appendChild(t), this.checked && t.setAttribute("checked", "checked")
    }
}), htmlRadioButton = htmlItem.extend({
    setSchema: function(e) {
        this.base(e), this.checked = e && e.checked ? !0 : !1
    },
    getSchema: function() {
        var e = this.base();
        return e.checked = this.checked, e
    },
    save: function() {
        this.base(), this.checked = $F(this.id + "_rb") ? !0 : !1
    },
    renderItem: function(e) {
        var t = $input({
            id: this.id + "_rb",
            type: "radio",
            name: e.parentNode.id
        });
        e.appendChild(t), this.checked && t.setAttribute("checked", "checked")
    }
}), htmlArray = Base.extend({
    constructor: function(e) {
        this.columns = e, this.itemText = new htmlTextArea(!0)
    },
    save: function() {
        this.itemText.save()
    },
    setSchema: function(e) {
        this.itemText.setSchema(e.itemText)
    },
    removeLanguage: function(e) {
        this.itemText.removeLanguage(e)
    },
    changeLanguage: function(e) {
        this.itemText.changeLanguage(e)
    },
    getSchema: function() {
        var e = new Object;
        return e.itemText = this.itemText.getSchema(), e
    },
    render: function(e) {
        this.id = e.id + "_" + this.order;
        var t = $tr({
            id: this.id
        });
        e.appendChild(t);
        var n = $td({
            style: "width:30%"
        });
        t.appendChild(n);
        for (var i = 0; i < this.columns; i++) t.appendChild(this.renderItem(i));
        this.itemText.cssClass = "arrayQuestionTitle", this.itemText.lineHeight = n.clientHeight + "px", this.itemText.id = this.id + "_title", this.itemText.render(n)
    }
}), htmlRadioButtonArray = htmlArray.extend({
    renderItem: function(e) {
        var t = $td({
            "class": "alignCenter"
        });
        return t.appendChild($input({
            id: this.id + "_col" + e.toString(),
            type: "radio"
        })), t
    }
}), htmlCheckBoxArray = htmlArray.extend({
    renderItem: function(e) {
        var t = $td({
            "class": "alignCenter"
        });
        return t.appendChild($input({
            id: this.id + "_col" + e.toString(),
            type: "checkbox"
        })), t
    }
}), htmlTextFieldArray = htmlArray.extend({
    constructor: function(e, t) {
        this.base(e), this.size = t
    },
    renderItem: function(e) {
        var t = $td({
            "class": "arrayItem alignCenter"
        });
        return t.appendChild("large" == this.size ? $textarea({
            id: this.id + "_col" + e.toString(),
            "class": "textfield",
            style: "width:95%"
        }) : $input({
            id: this.id + "_col" + e.toString(),
            type: "text",
            "class": "textfield",
            style: "width:95%"
        })), t
    }
}), htmlStarRatingArray = htmlArray.extend({
    constructor: function(e, t) {
        this.base(e), this.numberOfStars = t
    },
    getSchema: function() {
        var e = this.base();
        return e.numberOfStars = this.numberOfStars, e
    },
    setSchema: function(e) {
        this.base(e), this.numberOfStars = e.numberOfStars
    },
    renderItem: function() {
        for (var e = $td({
                "class": "arrayItem alignCenter"
            }), t = 0; t < this.numberOfStars; t++) {
            var n = $img({
                id: this.id + "_star" + t.toString(),
                src: "/images/starrat.gif",
                title: t + 1 + "/" + this.numberOfStars,
                "class": "star",
                name: t
            });
            e.appendChild(n), Event.observe(n, "mouseover", this.starOn.bindAsEventListener(this), !1), Event.observe(n, "mouseout", this.starOff.bindAsEventListener(this), !1)
        }
        return e
    },
    starOn: function(e) {
        for (var t = e.target ? e.target.name : e.srcElement.name, n = 0; t >= n; n++) $(this.id + "_star" + n.toString()).src = "/images/starrat-selected.gif"
    },
    starOff: function() {
        for (var e = 0; e < this.numberOfStars; e++) $(this.id + "_star" + e).src = "/images/starrat.gif"
    },
    render: function(e) {
        this.id = e.id + "_" + this.order;
        var t = $tr({
            id: this.id
        });
        e.appendChild(t);
        var n = $td({
            style: "width:26%"
        });
        t.appendChild(n);
        for (var i = 0; i < this.columns; i++) t.appendChild(this.renderItem(i));
        this.itemText.cssClass = "arrayQuestionTitle", this.itemText.lineHeight = n.clientHeight + "px", this.itemText.id = this.id + "_title", this.itemText.render(n)
    }
}), editableHtml = Base.extend({
    save: function() {
        $(this.id) && (this.itemText[page.form.selectedLanguage] = $(this.id).value)
    },
    getSchema: function() {
        schema = new Array;
        for (var e = 0; e < this.itemText.length; e++) schema[e] = this.itemText[e] ? this.itemText[e].replace(/(")/g, "") : "", schema[e] = encodeURIComponent(schema[e]);
        return schema
    },
    setSchema: function(e) {
        if (e)
            for (var t = 0; t < e.length; t++) this.itemText[t] = unescape(e[t]);
        else this.itemText = e || this.itemText || new Array
    },
    removeLanguage: function(e) {
        this.itemText.removeAt(e)
    },
    changeLanguage: function() {
        $(this.id).value = "undefined" != typeof this.itemText[page.form.selectedLanguage] ? this.itemText[page.form.selectedLanguage] : locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText, this.id.value == locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText && Element.addClassName(this.id, "placeholder"), this.resize()
    },
    render: function(e, t, n) {
        this.cssClass || (this.cssClass = "itemText");
        var i = "undefined" != typeof this.itemText[page.form.selectedLanguage] ? this.itemText[page.form.selectedLanguage] : locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText;
        this.renderItem(e, i, n), t && e.appendChild($br()), "textArea" == this.input_type ? (Event.observe(this.id, "keyup", this.resize.bind(this)), Event.fire(this.id, "keyup")) : (Event.observe(this.id, "keypress", this.resize.bind(this)), Event.fire(this.id, "keypress")), this.resize()
    }
}), htmlTextArea = editableHtml.extend({
    constructor: function(e, t) {
        this.input_type = "textArea", e && (this.maxWidth = e), t && (this.lineHeight = t), this.setSchema()
    },
    renderItem: function(e, t) {
        this.maxWidth && (this.width = e.clientWidth - 1 >= 0 ? e.clientWidth - 5 + "px" : "0px"), "100%" == this.maxWidth && (this.width = "95%"), /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) && (t = t.replace(/(\r)/g, ""), t = t.replace(/(\n)/g, "\r"), this.width = "90%");
        var n = $textarea({
            id: this.id,
            value: t,
            "class": this.cssClass
        }, t);
        e.appendChild(n), n.value == locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText && Element.addClassName(this.id, "placeholder"), Element.observe(this.id, "focus", function() {
            this.value == locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText && (Element.removeClassName(this.id, "placeholder"), this.value = "")
        }), Element.observe(this.id, "blur", function() {
            "" == this.value && (this.value = locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText, Element.addClassName(this.id, "placeholder"))
        })
    },
    resize: function() {
        var e = $(this.id);
        if (this.width) {
            e.style.width = this.width;
            var t = $F(this.id);
            t = t.replace(/\r?\n/g, "<br />"), t = t.replace(/\>$/g, ">&nbsp;"), t = "" != t ? t : "t";
            var n = document.getElementById("forms"),
                i = e.clientWidth - 6,
                o = $div({
                    id: "resizeDiv",
                    "class": this.cssClass,
                    style: "padding:0px;word-wrap:break-word;top:0;visibility:hidden;width:" + i + "px"
                });
            o.innerHTML = t;
            var n = document.getElementById("forms");
            n.appendChild(o);
            var s = o.clientHeight;
            e.style.height = 5 > s ? e.clientHeight + "px" : s + "px", n.removeChild(o)
        } else {
            for (var t = e.value, r = t.split("\n"), a = r[0].length, o = 1; o < r.length; o++) r[o].length > a && (a = r[o].length);
            e.cols = a + 2, e.rows = r.length
        }
    }
}), htmlTextLine = editableHtml.extend({
    constructor: function(e) {
        e && (this.maxSize = e), this.setSchema()
    },
    renderItem: function(e, t) {
        this.maxSize && (this.size = e.clientWidth - 1 >= 0 ? e.clientWidth - 1 + "px" : "0px");
        var n = $input({
            id: this.id,
            type: "text",
            value: t,
            "class": this.cssClass
        });
        e.appendChild(n), n.value == locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText && Element.addClassName(this.id, "placeholder"), Element.observe(this.id, "focus", function() {
            this.value == locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText && (Element.removeClassName(this.id, "placeholder"), this.value = "")
        }), Element.observe(this.id, "blur", function() {
            "" == this.value && (this.value = locales[page.form.languages[page.form.selectedLanguage]].untitledHelpText, Element.addClassName(this.id, "placeholder"))
        }), this.resize()
    },
    resize: function() {
        if (this.maxSize) $(this.id).style.width = this.size;
        else {
            var e = $span({
                    id: "resize",
                    "class": "itemText",
                    style: "display:inline; visibility:hidden"
                }, $F(this.id)),
                t = $$(".uiObjectItems");
            t[0].appendChild(e), $(this.id).style.width = $("resize").getWidth() + 15 + "px", t[0].removeChild(e)
        }
    }
}), htmlSelectableDiv = Base.extend({
    constructor: function(e) {
        this.id = e
    },
    render: function(e) {
        var t = $(e),
            n = $div({
                id: this.id,
                onclick: "page.form.selectObject(this)",
                "class": "selectable notSelected"
            });
        t.parentNode.insertBefore(n, t)
    }
}), htmlDroppableDiv = Base.extend({
    constructor: function(e) {
        this.id = e
    },
    render: function(e) {
        var t = $(e),
            n = $div({
                id: this.id,
                "class": "dropdiv"
            });
        t.parentNode.insertBefore(n, t)
    }
}), EditableSelect = new Object, EditableSelect.init = function(e, t, n) {
    var i = $(e);
    this.parent = n;
    for (var o = '<ul id="' + e + '-select" class="select-list">', s = t.data.length, r = 0; s > r; r++) {
        var a = e + "-option-" + r;
        o += '<li id="' + a + '" name="' + e + '-options" ><img style="margin-right: 5px" src="/images/delete.png" class="' + r + '" id="' + a + '_delete"/>' + t.data[r] + "</li>"
    }
    o += "</ul>";
    var l = 0,
        c = 0;
    if (null != t.dropDownImg) {
        i.insert({
            after: '<img id="' + e + '-dropdown" src="' + t.dropDownImg.src + '" class="select-dropdown" />'
        });
        var d = $(e + "-dropdown");
        l = i.getHeight(), c = t.dropDownImg.width * l / t.dropDownImg.height, l -= 2, c -= 0, d.setStyle({
            height: l + "px",
            width: c + "px",
            margin: "1px 0 1px -" + c + "px"
        }), d.insert({
            after: o
        }), d.observe("click", EditableSelect.toggleSelect)
    } else i.insert({
        after: o
    });
    for (var u = $(e + "-select"), r = 0; s > r; r++) {
        var h = ($(e + "-option-" + r), $(e + "-option-" + r + "_delete"));
        h.observe("mousedown", this.parent.delItem.bindAsEventListener(this.parent))
    }
    var p = null == t.width ? i.getWidth() : t.width;
    (t.width || c > 0) && i.setStyle({
        width: p + 2 * c + "px"
    }), u.setStyle({
        width: p + 2 * c + "px"
    }), i.observe("focus", EditableSelect.showSelect), i.observe("blur", EditableSelect.hideSelect), u.hide()
}, EditableSelect.selectOption = function(e) {
    var t = e.element(),
        n = t.id,
        i = $(n.substr(0, n.indexOf("-option-")));
    i.value = t.innerHTML
}, EditableSelect.highlightOption = function(e) {
    var t = e.element();
    t.addClassName("highlight")
}, EditableSelect.unhighlightOption = function(e) {
    var t = e.element();
    t.removeClassName("highlight")
}, EditableSelect.toggleSelect = function(e) {
    var t = e.element(),
        n = t.id.length - 9,
        i = t.id.substr(0, n);
    EditableSelect.prepareShow(i).toggle();
    var o = $(i);
    o.focus()
}, EditableSelect.showSelect = function(e) {
    var t = e.element ? e.element() : e;
    EditableSelect.prepareShow(t.id).show()
}, EditableSelect.hideSelect = function(e) {
    var t = e.element ? e.element() : e,
        n = t.id,
        i = $(n + "-select");
    i.hide()
}, EditableSelect.prepareShow = function(e) {
    var t = $(e),
        n = $(e + "-select"),
        i = t.offsetTop + t.getHeight() + "px",
        o = t.offsetLeft + "px",
        s = t.getStyle("width");
    return n.setStyle({
        width: s,
        top: i,
        left: o
    }), n
};
var bkExtend = function() {
    var e = arguments;
    1 == e.length && (e = [this, e[0]]);
    for (var t in e[1]) e[0][t] = e[1][t];
    return e[0]
};
bkClass.prototype.construct = function() {}, bkClass.extend = function(e) {
    var t = function() {
            return arguments[0] !== bkClass ? this.construct.apply(this, arguments) : void 0
        },
        n = new this(bkClass);
    return bkExtend(n, e), t.prototype = n, t.extend = this.extend, t
};
var bkElement = bkClass.extend({
        construct: function(e, t) {
            return "string" == typeof e && (e = (t || document).createElement(e)), e = $BK(e)
        },
        appendTo: function(e) {
            return e.appendChild(this), this
        },
        appendBefore: function(e) {
            return e.parentNode.insertBefore(this, e), this
        },
        addEvent: function(e, t) {
            return bkLib.addEvent(this, e, t), this
        },
        setContent: function(e) {
            return this.innerHTML = e, this
        },
        pos: function() {
            var e = curtop = 0;
            if (obj = this, obj.offsetParent)
                if ("BODY" == obj.offsetParent.tagName) {
                    do e += obj.offsetLeft, curtop += obj.offsetTop; while (obj = obj.offsetParent)
                } else
                    do e += obj.offsetLeft - (obj.offsetParent ? obj.offsetParent.scrollLeft : 0), curtop += obj.offsetTop - (obj.offsetParent ? obj.offsetParent.scrollTop : 0); while (obj = obj.offsetParent);
            var t = window.opera ? 0 : parseInt(this.getStyle("border-width") || this.style.border) || 0;
            return [e + t, curtop + t + this.offsetHeight]
        },
        noSelect: function() {
            return bkLib.noSelect(this), this
        },
        parentTag: function(e) {
            var t = this;
            do {
                if (t && t.nodeName && t.nodeName.toUpperCase() == e) return t;
                t = t.parentNode
            } while (t);
            return !1
        },
        hasClass: function(e) {
            return this.className.match(RegExp("(\\s|^)nicEdit-" + e + "(\\s|$)"))
        },
        addClass: function(e) {
            return this.hasClass(e) || (this.className += " nicEdit-" + e), this
        },
        removeClass: function(e) {
            return this.hasClass(e) && (this.className = this.className.replace(RegExp("(\\s|^)nicEdit-" + e + "(\\s|$)"), " ")), this
        },
        setStyle: function(e) {
            var t, n = this.style;
            for (t in e) switch (t) {
                case "float":
                    n.cssFloat = n.styleFloat = e[t];
                    break;
                case "opacity":
                    n.opacity = e[t], n.filter = "alpha(opacity=" + Math.round(100 * e[t]) + ")";
                    break;
                case "className":
                    this.className = e[t];
                    break;
                default:
                    n[t] = e[t]
            }
            return this
        },
        getStyle: function(e, t) {
            var n = t ? t : document.defaultView;
            return 1 == this.nodeType ? n && n.getComputedStyle ? n.getComputedStyle(this, null).getPropertyValue(e) : this.currentStyle[bkLib.camelize(e)] : void 0
        },
        remove: function() {
            return this.parentNode.removeChild(this), this
        },
        setAttributes: function(e) {
            for (var t in e) this[t] = e[t];
            return this
        }
    }),
    bkLib = {
        isMSIE: -1 != navigator.appVersion.indexOf("MSIE"),
        addEvent: function(e, t, n) {
            e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent("on" + t, n)
        },
        toArray: function(e) {
            for (var t = e.length, n = Array(t); t--;) n[t] = e[t];
            return n
        },
        noSelect: function(e) {
            e.setAttribute && "input" != e.nodeName.toLowerCase() && "textarea" != e.nodeName.toLowerCase() && e.setAttribute("unselectable", "on");
            for (var t = 0; t < e.childNodes.length; t++) bkLib.noSelect(e.childNodes[t])
        },
        camelize: function(e) {
            return e.replace(/\-(.)/g, function(e, t) {
                return t.toUpperCase()
            })
        },
        inArray: function(e, t) {
            return null != bkLib.search(e, t)
        },
        search: function(e, t) {
            for (var n = 0; n < e.length; n++)
                if (e[n] == t) return n;
            return null
        },
        cancelEvent: function(e) {
            return e = e || window.event, e.preventDefault && e.stopPropagation && (e.preventDefault(), e.stopPropagation()), !1
        },
        domLoad: [],
        domLoaded: function() {
            if (!arguments.callee.done)
                for (arguments.callee.done = !0, i = 0; i < bkLib.domLoad.length; i++) bkLib.domLoad[i]()
        },
        onDomLoaded: function(e) {
            this.domLoad.push(e), document.addEventListener ? document.addEventListener("DOMContentLoaded", bkLib.domLoaded, null) : bkLib.isMSIE && (document.write("<style>.nicEdit-main p { margin: 0; }</style><script id=__ie_onload defer " + ("https:" == location.protocol ? "src='javascript:void(0)'" : "src=//0") + "></script>"), $BK("__ie_onload").onreadystatechange = function() {
                "complete" == this.readyState && bkLib.domLoaded()
            }), window.onload = bkLib.domLoaded
        }
    },
    bkEvent = {
        addEvent: function(e, t) {
            return t && (this.eventList = this.eventList || {}, this.eventList[e] = this.eventList[e] || [], this.eventList[e].push(t)), this
        },
        fireEvent: function() {
            var e = bkLib.toArray(arguments),
                t = e.shift();
            if (this.eventList && this.eventList[t])
                for (var n = 0; n < this.eventList[t].length; n++) this.eventList[t][n].apply(this, e)
        }
    };
Function.prototype.closure = function() {
    var e = this,
        t = bkLib.toArray(arguments),
        n = t.shift();
    return function() {
        return "undefined" != typeof bkLib ? e.apply(n, t.concat(bkLib.toArray(arguments))) : void 0
    }
}, Function.prototype.closureListener = function() {
    var e = this,
        t = bkLib.toArray(arguments),
        n = t.shift();
    return function(i) {
        return i = i || window.event, e.apply(n, [i, i.target ? i.target : i.srcElement].concat(t))
    }
};
var nicEditorConfig = bkClass.extend({
        buttons: {
            bold: {
                name: __("Click to Bold"),
                command: "Bold",
                tags: ["B", "STRONG"],
                css: {
                    "font-weight": "bold"
                },
                key: "b"
            },
            italic: {
                name: __("Click to Italic"),
                command: "Italic",
                tags: ["EM", "I"],
                css: {
                    "font-style": "italic"
                },
                key: "i"
            },
            underline: {
                name: __("Click to Underline"),
                command: "Underline",
                tags: ["U"],
                css: {
                    "text-decoration": "underline"
                },
                key: "u"
            },
            left: {
                name: __("Left Align"),
                command: "justifyleft",
                noActive: !0
            },
            center: {
                name: __("Center Align"),
                command: "justifycenter",
                noActive: !0
            },
            right: {
                name: __("Right Align"),
                command: "justifyright",
                noActive: !0
            },
            justify: {
                name: __("Justify Align"),
                command: "justifyfull",
                noActive: !0
            },
            ol: {
                name: __("Insert Ordered List"),
                command: "insertorderedlist",
                tags: ["OL"]
            },
            ul: {
                name: __("Insert Unordered List"),
                command: "insertunorderedlist",
                tags: ["UL"]
            },
            subscript: {
                name: __("Click to Subscript"),
                command: "subscript",
                tags: ["SUB"]
            },
            superscript: {
                name: __("Click to Superscript"),
                command: "superscript",
                tags: ["SUP"]
            },
            strikethrough: {
                name: __("Click to Strike Through"),
                command: "strikeThrough",
                css: {
                    "text-decoration": "line-through"
                }
            },
            removeformat: {
                name: __("Remove Formatting"),
                command: "removeformat",
                noActive: !0
            },
            indent: {
                name: __("Indent Text"),
                command: "indent",
                noActive: !0
            },
            outdent: {
                name: __("Remove Indent"),
                command: "outdent",
                noActive: !0
            },
            hr: {
                name: __("Horizontal Rule"),
                command: "insertHorizontalRule",
                noActive: !0
            }
        },
        iconsPath: "../nicEditorIcons.gif",
        buttonList: "save bold italic underline left center right justify ol ul fontSize fontFamily fontFormat indent outdent image upload link unlink forecolor bgcolor".split(" "),
        iconList: {
            bgcolor: 1,
            forecolor: 2,
            bold: 3,
            center: 4,
            hr: 5,
            indent: 6,
            italic: 7,
            justify: 8,
            left: 9,
            ol: 10,
            outdent: 11,
            removeformat: 12,
            right: 13,
            save: 14,
            strikethrough: 15,
            subscript: 16,
            superscript: 17,
            ul: 18,
            underline: 19,
            image: 20,
            link: 21,
            unlink: 22,
            close: 23,
            arrow: 24
        }
    }),
    nicEditors = {
        nicPlugins: [],
        editors: [],
        registerPlugin: function(e, t) {
            this.nicPlugins.push({
                p: e,
                o: t
            })
        },
        allTextAreas: function(e) {
            for (var t = document.getElementsByTagName("textarea"), n = 0; n < t.length; n++) nicEditors.editors.push(new nicEditor(e).panelInstance(t[n]));
            return nicEditors.editors
        },
        findEditor: function(e) {
            for (var t = nicEditors.editors, n = 0; n < t.length; n++)
                if (t[n].instanceById(e)) return t[n].instanceById(e)
        }
    },
    nicEditor = bkClass.extend({
        construct: function(e) {
            this.options = new nicEditorConfig, bkExtend(this.options, e), this.nicInstances = [], this.loadedPlugins = [], e = nicEditors.nicPlugins;
            for (var t = 0; t < e.length; t++) this.loadedPlugins.push(new e[t].p(this, e[t].o));
            nicEditors.editors.push(this), bkLib.addEvent(document.body, "mousedown", this.selectCheck.closureListener(this))
        },
        panelInstance: function(e, t) {
            e = this.checkReplace($BK(e));
            var n = new bkElement("DIV").setStyle({
                width: (parseInt(e.getStyle("width")) || e.clientWidth) + "px"
            }).appendBefore(e);
            return this.setPanel(n), this.addInstance(e, t)
        },
        checkReplace: function(e) {
            var t = nicEditors.findEditor(e);
            return t && (t.removeInstance(e), t.removePanel()), e
        },
        addInstance: function(e, t) {
            e = this.checkReplace($BK(e));
            var n = e.contentEditable || window.opera ? new nicEditorInstance(e, t, this) : new nicEditorIFrameInstance(e, t, this);
            return this.nicInstances.push(n), this
        },
        removeInstance: function(e) {
            e = $BK(e);
            for (var t = this.nicInstances, n = 0; n < t.length; n++) t[n].e == e && (t[n].remove(), this.nicInstances.splice(n, 1))
        },
        removePanel: function() {
            this.nicPanel && (this.nicPanel.remove(), this.nicPanel = null)
        },
        instanceById: function(e) {
            e = $BK(e);
            for (var t = this.nicInstances, n = 0; n < t.length; n++)
                if (t[n].e == e) return t[n]
        },
        setPanel: function(e) {
            return this.nicPanel = new nicEditorPanel($BK(e), this.options, this), this.fireEvent("panel", this.nicPanel), this
        },
        nicCommand: function(e, t) {
            this.selectedInstance && this.selectedInstance.nicCommand(e, t)
        },
        getIcon: function(e, t) {
            var n = this.options.iconList[e],
                i = t.iconFiles ? t.iconFiles[e] : "";
            return {
                backgroundImage: "url('" + (n ? this.options.iconsPath : i) + "')",
                backgroundPosition: (n ? -18 * (n - 1) : 0) + "px 0px"
            }
        },
        selectCheck: function(e, t) {
            do
                if (t.className && -1 != t.className.indexOf("nicEdit")) return !1; while (t = t.parentNode);
            return this.fireEvent("blur", this.selectedInstance, t), this.lastSelectedInstance = this.selectedInstance, this.selectedInstance = null, !1
        }
    }),
    nicEditor = nicEditor.extend(bkEvent),
    nicEditorInstance = bkClass.extend({
        isSelected: !1,
        construct: function(e, t, n) {
            if (this.ne = n, this.elm = this.e = e, this.options = t || {}, newX = parseInt(e.getStyle("width")) || e.clientWidth, newY = parseInt(e.getStyle("height")) || e.clientHeight, this.initialHeight = newY - 8, (n = "textarea" == e.nodeName.toLowerCase()) || this.options.hasPanel) {
                t = bkLib.isMSIE && !("undefined" != typeof document.body.style.maxHeight && "CSS1Compat" == document.compatMode);
                var i = {
                    width: newX + "px",
                    border: "1px solid #ccc",
                    borderTop: 0,
                    overflowY: "auto",
                    overflowX: "hidden"
                };
                i[t ? "height" : "maxHeight"] = this.ne.options.maxHeight ? this.ne.options.maxHeight + "px" : null, this.editorContain = new bkElement("DIV").setStyle(i).appendBefore(e), i = new bkElement("DIV").setStyle({
                    width: newX - 8 + "px",
                    margin: "4px",
                    minHeight: newY + "px"
                }).addClass("main").appendTo(this.editorContain), e.setStyle({
                    display: "none"
                }), i.innerHTML = e.innerHTML, n && (i.setContent(e.value), this.copyElm = e, (e = e.parentTag("FORM")) && bkLib.addEvent(e, "submit", this.saveContent.closure(this))), i.setStyle(t ? {
                    height: newY + "px"
                } : {
                    overflow: "hidden"
                }), this.elm = i
            }
            this.ne.addEvent("blur", this.blur.closure(this)), this.init(), this.blur()
        },
        init: function() {
            this.elm.setAttribute("contentEditable", "true"), "" == this.getContent() && this.setContent("<br />"), this.instanceDoc = document.defaultView, this.elm.addEvent("mousedown", this.selected.closureListener(this)).addEvent("keypress", this.keyDown.closureListener(this)).addEvent("focus", this.selected.closure(this)).addEvent("blur", this.blur.closure(this)).addEvent("keyup", this.selected.closure(this)), this.ne.fireEvent("add", this)
        },
        remove: function() {
            this.saveContent(), (this.copyElm || this.options.hasPanel) && (this.editorContain.remove(), this.e.setStyle({
                display: "block"
            }), this.ne.removePanel()), this.disable(), this.ne.fireEvent("remove", this)
        },
        disable: function() {
            this.elm.setAttribute("contentEditable", "false")
        },
        getSel: function() {
            return window.getSelection ? window.getSelection() : document.selection
        },
        getRng: function() {
            var e = this.getSel();
            return e ? 0 < e.rangeCount ? e.getRangeAt(0) : e.createRange && e.createRange() || document.createRange() : null
        },
        selRng: function(e, t) {
            window.getSelection ? (t.removeAllRanges(), t.addRange(e)) : e.select()
        },
        selElm: function() {
            var e = this.getRng();
            if (e.startContainer) {
                var t = e.startContainer;
                if (1 == e.cloneContents().childNodes.length)
                    for (var n = 0; n < t.childNodes.length; n++) {
                        var i = t.childNodes[n].ownerDocument.createRange();
                        if (i.selectNode(t.childNodes[n]), 1 != e.compareBoundaryPoints(Range.START_TO_START, i) && -1 != e.compareBoundaryPoints(Range.END_TO_END, i)) return $BK(t.childNodes[n])
                    }
                return $BK(t)
            }
            return $BK("Control" == this.getSel().type ? e.item(0) : e.parentElement())
        },
        saveRng: function() {
            this.savedRange = this.getRng(), this.savedSel = this.getSel()
        },
        restoreRng: function() {
            this.savedRange && this.selRng(this.savedRange, this.savedSel)
        },
        keyDown: function(e) {
            e.ctrlKey && this.ne.fireEvent("key", this, e)
        },
        selected: function(e, t) {
            if (t || (t = this.selElm()), !e.ctrlKey) {
                var n = this.ne.selectedInstance;
                n != this && (n && this.ne.fireEvent("blur", n, t), this.ne.selectedInstance = this, this.ne.fireEvent("focus", n, t)), this.ne.fireEvent("selected", n, t), this.isFocused = !0, this.elm.addClass("selected")
            }
            return !1
        },
        blur: function() {
            this.isFocused = !1, this.elm.removeClass("selected")
        },
        saveContent: function() {
            (this.copyElm || this.options.hasPanel) && (this.ne.fireEvent("save", this), this.copyElm ? this.copyElm.value = this.getContent() : this.e.innerHTML = this.getContent())
        },
        getElm: function() {
            return this.elm
        },
        getContent: function() {
            return this.content = this.getElm().innerHTML, this.ne.fireEvent("get", this), this.content
        },
        setContent: function(e) {
            this.content = e, this.ne.fireEvent("set", this), this.elm.innerHTML = this.content
        },
        nicCommand: function(e, t) {
            document.execCommand(e, !1, t)
        }
    }),
    nicEditorIFrameInstance = nicEditorInstance.extend({
        savedStyles: [],
        init: function() {
            var e = this.elm.innerHTML.replace(/^\s+|\s+$/g, "");
            this.elm.innerHTML = "", e ? e : e = "<br />", this.initialContent = e, this.elmFrame = new bkElement("iframe").setAttributes({
                src: "javascript:;",
                frameBorder: 0,
                allowTransparency: "true",
                scrolling: "no"
            }).setStyle({
                height: "100px",
                width: "100%"
            }).addClass("frame").appendTo(this.elm), this.copyElm && this.elmFrame.setStyle({
                width: this.elm.offsetWidth - 4 + "px"
            }), e = ["font-size", "font-family", "font-weight", "color"];
            for (itm in e) this.savedStyles[bkLib.camelize(itm)] = this.elm.getStyle(itm);
            setTimeout(this.initFrame.closure(this), 50)
        },
        disable: function() {
            this.elm.innerHTML = this.getContent()
        },
        initFrame: function() {
            var e = $BK(this.elmFrame.contentWindow.document);
            e.designMode = "on", e.open();
            var t = this.ne.options.externalCSS;
            e.write("<html><head>" + (t ? '<link href="' + t + '" rel="stylesheet" type="text/css" />' : "") + '</head><body id="nicEditContent" style="margin: 0 !important; background-color: transparent !important;">' + this.initialContent + "</body></html>"), e.close(), this.frameDoc = e, this.frameWin = $BK(this.elmFrame.contentWindow), this.frameContent = $BK(this.frameWin.document.body).setStyle(this.savedStyles), this.instanceDoc = this.frameWin.document.defaultView, this.heightUpdate(), this.frameDoc.addEvent("mousedown", this.selected.closureListener(this)).addEvent("keyup", this.heightUpdate.closureListener(this)).addEvent("keydown", this.keyDown.closureListener(this)).addEvent("keyup", this.selected.closure(this)), this.ne.fireEvent("add", this)
        },
        getElm: function() {
            return this.frameContent
        },
        setContent: function(e) {
            this.content = e, this.ne.fireEvent("set", this), this.frameContent.innerHTML = this.content, this.heightUpdate()
        },
        getSel: function() {
            return this.frameWin ? this.frameWin.getSelection() : this.frameDoc.selection
        },
        heightUpdate: function() {
            this.elmFrame.style.height = Math.max(this.frameContent.offsetHeight, this.initialHeight) + "px"
        },
        nicCommand: function(e, t) {
            this.frameDoc.execCommand(e, !1, t), setTimeout(this.heightUpdate.closure(this), 100)
        }
    }),
    nicEditorPanel = bkClass.extend({
        construct: function(e, t, n) {
            this.elm = e, this.options = t, this.ne = n, this.panelButtons = [], this.buttonList = bkExtend([], this.ne.options.buttonList), this.panelContain = new bkElement("DIV").setStyle({
                overflow: "hidden",
                width: "100%",
                border: "1px solid #cccccc",
                backgroundColor: "#efefef"
            }).addClass("panelContain"), this.panelElm = new bkElement("DIV").setStyle({
                margin: "2px",
                marginTop: "0px",
                zoom: 1,
                overflow: "hidden"
            }).addClass("panel").appendTo(this.panelContain), this.panelContain.appendTo(e), t = this.ne.options, n = t.buttons;
            for (button in n) this.addButton(button, t, !0);
            this.reorder(), e.noSelect()
        },
        addButton: function(a, b) {
            var c = b.buttons[a],
                c = c.type ? eval("(typeof(" + c.type + ') == "undefined") ? null : ' + c.type + ";") : nicEditorButton,
                d = bkLib.inArray(this.buttonList, a);
            c && (d || this.ne.options.fullPanel) && (this.panelButtons.push(new c(this.panelElm, a, b, this.ne)), d || this.buttonList.push(a))
        },
        findButton: function(e) {
            for (var t = 0; t < this.panelButtons.length; t++)
                if (this.panelButtons[t].name == e) return this.panelButtons[t]
        },
        reorder: function() {
            for (var e = this.buttonList, t = 0; t < e.length; t++) {
                var n = this.findButton(e[t]);
                n && this.panelElm.appendChild(n.margin)
            }
        },
        remove: function() {
            this.elm.remove()
        }
    }),
    nicEditorButton = bkClass.extend({
        construct: function(e, t, n, i) {
            this.options = n.buttons[t], this.name = t, this.ne = i, this.elm = e, this.margin = new bkElement("DIV").setStyle({
                "float": "left",
                marginTop: "2px"
            }).appendTo(e), this.contain = new bkElement("DIV").setStyle({
                width: "20px",
                height: "20px"
            }).addClass("buttonContain").appendTo(this.margin), this.border = new bkElement("DIV").setStyle({
                backgroundColor: "#efefef",
                border: "1px solid #efefef"
            }).appendTo(this.contain), this.button = new bkElement("DIV").setStyle({
                width: "18px",
                height: "18px",
                overflow: "hidden",
                zoom: 1,
                cursor: "pointer"
            }).addClass("button").setStyle(this.ne.getIcon(t, n)).appendTo(this.border), this.button.addEvent("mouseover", this.hoverOn.closure(this)).addEvent("mouseout", this.hoverOff.closure(this)).addEvent("mousedown", this.mouseClick.closure(this)).noSelect(), window.opera || (this.button.onmousedown = this.button.onclick = bkLib.cancelEvent), i.addEvent("selected", this.enable.closure(this)).addEvent("blur", this.disable.closure(this)).addEvent("key", this.key.closure(this)), this.disable(), this.init()
        },
        init: function() {},
        hide: function() {
            this.contain.setStyle({
                display: "none"
            })
        },
        updateState: function() {
            this.isDisabled ? this.setBg() : this.isHover ? this.setBg("hover") : this.isActive ? this.setBg("active") : this.setBg()
        },
        setBg: function(e) {
            switch (e) {
                case "hover":
                    var t = {
                        border: "1px solid #666",
                        backgroundColor: "#ddd"
                    };
                    break;
                case "active":
                    t = {
                        border: "1px solid #666",
                        backgroundColor: "#ccc"
                    };
                    break;
                default:
                    t = {
                        border: "1px solid #efefef",
                        backgroundColor: "#efefef"
                    }
            }
            this.border.setStyle(t).addClass("button-" + e)
        },
        checkNodes: function(e) {
            var t = e;
            do
                if (this.options.tags && bkLib.inArray(this.options.tags, t.nodeName)) return this.activate(), !0; while (t = t.parentNode && "nicEdit" != t.className);
            for (t = $BK(e); 3 == t.nodeType;) t = $BK(t.parentNode);
            if (this.options.css)
                for (itm in this.options.css)
                    if (t.getStyle(itm, this.ne.selectedInstance.instanceDoc) == this.options.css[itm]) return this.activate(), !0;
            return this.deactivate(), !1
        },
        activate: function() {
            this.isDisabled || (this.isActive = !0, this.updateState(), this.ne.fireEvent("buttonActivate", this))
        },
        deactivate: function() {
            this.isActive = !1, this.updateState(), this.isDisabled || this.ne.fireEvent("buttonDeactivate", this)
        },
        enable: function(e, t) {
            this.isDisabled = !1, this.contain.setStyle({
                opacity: 1
            }).addClass("buttonEnabled"), this.updateState(), this.checkNodes(t)
        },
        disable: function() {
            this.isDisabled = !0, this.contain.setStyle({
                opacity: .6
            }).removeClass("buttonEnabled"), this.updateState()
        },
        toggleActive: function() {
            this.isActive ? this.deactivate() : this.activate()
        },
        hoverOn: function() {
            this.isDisabled || (this.isHover = !0, this.updateState(), this.ne.fireEvent("buttonOver", this))
        },
        hoverOff: function() {
            this.isHover = !1, this.updateState(), this.ne.fireEvent("buttonOut", this)
        },
        mouseClick: function() {
            this.options.command && (this.ne.nicCommand(this.options.command, this.options.commandArgs), this.options.noActive || this.toggleActive()), this.ne.fireEvent("buttonClick", this)
        },
        key: function(e, t) {
            this.options.key && t.ctrlKey && String.fromCharCode(t.keyCode || t.charCode).toLowerCase() == this.options.key && (this.mouseClick(), t.preventDefault && t.preventDefault())
        }
    }),
    nicPlugin = bkClass.extend({
        construct: function(e, t) {
            this.options = t, this.ne = e, this.ne.addEvent("panel", this.loadPanel.closure(this)), this.init()
        },
        loadPanel: function(e) {
            var t, n = this.options.buttons;
            for (t in n) e.addButton(t, this.options);
            e.reorder()
        },
        init: function() {}
    }),
    nicPaneOptions = {},
    nicEditorPane = bkClass.extend({
        construct: function(e, t, n, i) {
            this.ne = t, this.elm = e, this.pos = e.pos(), this.contain = new bkElement("div").setStyle({
                zIndex: "99999",
                overflow: "hidden",
                position: "absolute",
                left: this.pos[0] + "px",
                top: this.pos[1] + "px"
            }), this.pane = new bkElement("div").setStyle({
                fontSize: "12px",
                border: "1px solid #ccc",
                overflow: "hidden",
                padding: "4px",
                textAlign: "left",
                backgroundColor: "#ffffc9"
            }).addClass("pane").setStyle(n).appendTo(this.contain), i && !i.options.noClose && (this.close = new bkElement("div").setStyle({
                "float": "right",
                height: "16px",
                width: "16px",
                cursor: "pointer"
            }).setStyle(this.ne.getIcon("close", nicPaneOptions)).addEvent("mousedown", i.removePane.closure(this)).appendTo(this.pane)), this.contain.noSelect().appendTo(document.body), this.position(), this.init()
        },
        init: function() {},
        position: function() {
            if (this.ne.nicPanel) {
                var e = this.ne.nicPanel.elm,
                    e = e.pos()[0] + parseInt(e.getStyle("width")) - (parseInt(this.pane.getStyle("width")) + 8);
                e < this.pos[0] && this.contain.setStyle({
                    left: e + "px"
                })
            }
        },
        toggle: function() {
            this.isVisible = !this.isVisible, this.contain.setStyle({
                display: this.isVisible ? "block" : "none"
            })
        },
        remove: function() {
            this.contain && (this.contain.remove(), this.contain = null)
        },
        append: function(e) {
            e.appendTo(this.pane)
        },
        setContent: function(e) {
            this.pane.setContent(e)
        }
    }),
    nicEditorAdvancedButton = nicEditorButton.extend({
        init: function() {
            this.ne.addEvent("selected", this.removePane.closure(this)).addEvent("blur", this.removePane.closure(this))
        },
        mouseClick: function() {
            this.isDisabled || (this.pane && this.pane.pane ? this.removePane() : (this.pane = new nicEditorPane(this.contain, this.ne, {
                width: this.width || "270px",
                backgroundColor: "#fff"
            }, this), this.addPane(), this.ne.selectedInstance.saveRng()))
        },
        addForm: function(e, t) {
            this.form = new bkElement("form").addEvent("submit", this.submit.closureListener(this)), this.pane.append(this.form), this.inputs = {};
            for (itm in e) {
                var n = e[itm],
                    i = "";
                t && (i = t.getAttribute(itm)), i || (i = n.value || "");
                var o = e[itm].type;
                if ("title" == o) new bkElement("div").setContent(n.txt).setStyle({
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "0px",
                    margin: "2px 0"
                }).appendTo(this.form);
                else {
                    var s = new bkElement("div").setStyle({
                        overflow: "hidden",
                        clear: "both"
                    }).appendTo(this.form);
                    switch (n.txt && new bkElement("label").setAttributes({
                        "for": itm
                    }).setContent(n.txt).setStyle({
                        margin: "2px 4px",
                        fontSize: "13px",
                        width: "50px",
                        lineHeight: "20px",
                        textAlign: "right",
                        "float": "left"
                    }).appendTo(s), o) {
                        case "text":
                            this.inputs[itm] = new bkElement("input").setAttributes({
                                id: itm,
                                value: i,
                                type: "text"
                            }).setStyle({
                                margin: "2px 0",
                                fontSize: "13px",
                                "float": "left",
                                height: "20px",
                                border: "1px solid #ccc",
                                overflow: "hidden"
                            }).setStyle(n.style).appendTo(s);
                            break;
                        case "select":
                            this.inputs[itm] = new bkElement("select").setAttributes({
                                id: itm
                            }).setStyle({
                                border: "1px solid #ccc",
                                "float": "left",
                                margin: "2px 0"
                            }).appendTo(s);
                            for (opt in n.options) new bkElement("option").setAttributes({
                                value: opt,
                                selected: opt == i ? "selected" : ""
                            }).setContent(n.options[opt]).appendTo(this.inputs[itm]);
                            break;
                        case "content":
                            this.inputs[itm] = new bkElement("textarea").setAttributes({
                                id: itm
                            }).setStyle({
                                border: "1px solid #ccc",
                                "float": "left"
                            }).setStyle(n.style).appendTo(s), this.inputs[itm].value = i
                    }
                }
            }
            new bkElement("input").setAttributes({
                type: "submit"
            }).setStyle({
                backgroundColor: "#efefef",
                border: "1px solid #ccc",
                margin: "3px 0",
                "float": "left",
                clear: "both"
            }).appendTo(this.form), this.form.onsubmit = bkLib.cancelEvent
        },
        submit: function() {},
        findElm: function(e, t, n) {
            e = this.ne.selectedInstance.getElm().getElementsByTagName(e);
            for (var i = 0; i < e.length; i++)
                if (e[i].getAttribute(t) == n) return $BK(e[i])
        },
        removePane: function() {
            this.pane && (this.pane.remove(), this.pane = null, this.ne.selectedInstance.restoreRng())
        }
    }),
    nicButtonTips = bkClass.extend({
        construct: function(e) {
            this.ne = e, e.addEvent("buttonOver", this.show.closure(this)).addEvent("buttonOut", this.hide.closure(this))
        },
        show: function(e) {
            this.timer = setTimeout(this.create.closure(this, e), 400)
        },
        create: function(e) {
            this.timer = null, this.pane || (this.pane = new nicEditorPane(e.button, this.ne, {
                fontSize: "12px",
                marginTop: "5px"
            }), this.pane.setContent(e.options.name))
        },
        hide: function() {
            this.timer && clearTimeout(this.timer), this.pane && (this.pane = this.pane.remove())
        }
    });
nicEditors.registerPlugin(nicButtonTips);
var nicSelectOptions = {
        buttons: {
            fontSize: {
                name: __("Select Font Size"),
                type: "nicEditorFontSizeSelect",
                command: "fontsize"
            },
            fontFamily: {
                name: __("Select Font Family"),
                type: "nicEditorFontFamilySelect",
                command: "fontname"
            },
            fontFormat: {
                name: __("Select Font Format"),
                type: "nicEditorFontFormatSelect",
                command: "formatBlock"
            }
        }
    },
    nicEditorSelect = bkClass.extend({
        construct: function(e, t, n, i) {
            this.options = n.buttons[t], this.elm = e, this.ne = i, this.name = t, this.selOptions = [], this.margin = new bkElement("div").setStyle({
                "float": "left",
                margin: "2px 1px 0 1px"
            }).appendTo(this.elm), this.contain = new bkElement("div").setStyle({
                width: "90px",
                height: "20px",
                cursor: "pointer",
                overflow: "hidden"
            }).addClass("selectContain").addEvent("click", this.toggle.closure(this)).appendTo(this.margin), this.items = new bkElement("div").setStyle({
                overflow: "hidden",
                zoom: 1,
                border: "1px solid #ccc",
                paddingLeft: "3px",
                backgroundColor: "#fff"
            }).appendTo(this.contain), this.control = new bkElement("div").setStyle({
                overflow: "hidden",
                "float": "right",
                height: "18px",
                width: "16px"
            }).addClass("selectControl").setStyle(this.ne.getIcon("arrow", n)).appendTo(this.items), this.txt = new bkElement("div").setStyle({
                overflow: "hidden",
                "float": "left",
                width: "66px",
                height: "14px",
                marginTop: "1px",
                fontFamily: "sans-serif",
                textAlign: "center",
                fontSize: "12px"
            }).addClass("selectTxt").appendTo(this.items), window.opera || (this.contain.onmousedown = this.control.onmousedown = this.txt.onmousedown = bkLib.cancelEvent), this.margin.noSelect(), this.ne.addEvent("selected", this.enable.closure(this)).addEvent("blur", this.disable.closure(this)), this.disable(), this.init()
        },
        disable: function() {
            this.isDisabled = !0, this.close(), this.contain.setStyle({
                opacity: .6
            })
        },
        enable: function() {
            this.isDisabled = !1, this.close(), this.contain.setStyle({
                opacity: 1
            })
        },
        setDisplay: function(e) {
            this.txt.setContent(e)
        },
        toggle: function() {
            this.isDisabled || (this.pane ? this.close() : this.open())
        },
        open: function() {
            this.pane = new nicEditorPane(this.items, this.ne, {
                width: "88px",
                padding: "0px",
                borderTop: 0,
                borderLeft: "1px solid #ccc",
                borderRight: "1px solid #ccc",
                borderBottom: "0px",
                backgroundColor: "#fff"
            });
            for (var e = 0; e < this.selOptions.length; e++) {
                var t = this.selOptions[e],
                    n = new bkElement("div").setStyle({
                        overflow: "hidden",
                        borderBottom: "1px solid #ccc",
                        width: "88px",
                        textAlign: "left",
                        overflow: "hidden",
                        cursor: "pointer"
                    }),
                    i = new bkElement("div").setStyle({
                        padding: "0px 4px"
                    }).setContent(t[1]).appendTo(n).noSelect();
                i.addEvent("click", this.update.closure(this, t[0])).addEvent("mouseover", this.over.closure(this, i)).addEvent("mouseout", this.out.closure(this, i)).setAttributes("id", t[0]), this.pane.append(n), window.opera || (i.onmousedown = bkLib.cancelEvent)
            }
        },
        close: function() {
            this.pane && (this.pane = this.pane.remove())
        },
        over: function(e) {
            e.setStyle({
                backgroundColor: "#ccc"
            })
        },
        out: function(e) {
            e.setStyle({
                backgroundColor: "#fff"
            })
        },
        add: function(e, t) {
            this.selOptions.push([e, t])
        },
        update: function(e) {
            this.ne.nicCommand(this.options.command, e), this.close()
        }
    }),
    nicEditorFontSizeSelect = nicEditorSelect.extend({
        sel: {
            1: "1&nbsp;(8pt)",
            2: "2&nbsp;(10pt)",
            3: "3&nbsp;(12pt)",
            4: "4&nbsp;(14pt)",
            5: "5&nbsp;(18pt)",
            6: "6&nbsp;(24pt)"
        },
        init: function() {
            this.setDisplay("Font&nbsp;Size...");
            for (itm in this.sel) this.add(itm, '<font size="' + itm + '">' + this.sel[itm] + "</font>")
        }
    }),
    nicEditorFontFamilySelect = nicEditorSelect.extend({
        sel: {
            arial: "Arial",
            "comic sans ms": "Comic Sans",
            "courier new": "Courier New",
            georgia: "Georgia",
            helvetica: "Helvetica",
            impact: "Impact",
            "times new roman": "Times",
            "trebuchet ms": "Trebuchet",
            verdana: "Verdana"
        },
        init: function() {
            this.setDisplay("Font&nbsp;Family...");
            for (itm in this.sel) this.add(itm, '<font face="' + itm + '">' + this.sel[itm] + "</font>")
        }
    }),
    nicEditorFontFormatSelect = nicEditorSelect.extend({
        sel: {
            p: "Paragraph",
            pre: "Pre",
            h6: "Heading&nbsp;6",
            h5: "Heading&nbsp;5",
            h4: "Heading&nbsp;4",
            h3: "Heading&nbsp;3",
            h2: "Heading&nbsp;2",
            h1: "Heading&nbsp;1"
        },
        init: function() {
            this.setDisplay("Font&nbsp;Format...");
            for (itm in this.sel) {
                var e = itm.toUpperCase();
                this.add("<" + e + ">", "<" + itm + ' style="padding: 0px; margin: 0px;">' + this.sel[itm] + "</" + e + ">")
            }
        }
    });
nicEditors.registerPlugin(nicPlugin, nicSelectOptions);
var nicLinkOptions = {
        buttons: {
            link: {
                name: "Add Link",
                type: "nicLinkButton",
                tags: ["A"]
            },
            unlink: {
                name: "Remove Link",
                command: "unlink",
                noActive: !0
            }
        }
    },
    nicLinkButton = nicEditorAdvancedButton.extend({
        addPane: function() {
            this.ln = this.ne.selectedInstance.selElm().parentTag("A"), this.addForm({
                "": {
                    type: "title",
                    txt: "Add/Edit Link"
                },
                href: {
                    type: "text",
                    txt: "URL",
                    value: "http://",
                    style: {
                        width: "150px"
                    }
                },
                title: {
                    type: "text",
                    txt: "Title"
                },
                target: {
                    type: "select",
                    txt: "Open In",
                    options: {
                        "": "Current Window",
                        _blank: "New Window"
                    },
                    style: {
                        width: "100px"
                    }
                }
            }, this.ln)
        },
        submit: function() {
            var e = this.inputs.href.value;
            return "http://" == e || "" == e ? (alert("You must enter a URL to Create a Link"), !1) : (this.removePane(), this.ln || (this.ne.nicCommand("createlink", "javascript:nicTemp();"), this.ln = this.findElm("A", "href", "javascript:nicTemp();")), void(this.ln && this.ln.setAttributes({
                href: this.inputs.href.value,
                title: this.inputs.title.value,
                target: this.inputs.target.options[this.inputs.target.selectedIndex].value
            })))
        }
    });
nicEditors.registerPlugin(nicPlugin, nicLinkOptions);
var nicColorOptions = {
        buttons: {
            forecolor: {
                name: __("Change Text Color"),
                type: "nicEditorColorButton",
                noClose: !0
            },
            bgcolor: {
                name: __("Change Background Color"),
                type: "nicEditorBgColorButton",
                noClose: !0
            }
        }
    },
    nicEditorColorButton = nicEditorAdvancedButton.extend({
        addPane: function() {
            var e, t = {
                    0: "00",
                    1: "33",
                    2: "66",
                    3: "99",
                    4: "CC",
                    5: "FF"
                },
                n = new bkElement("DIV").setStyle({
                    width: "270px"
                });
            for (e in t)
                for (var i in t)
                    for (var o in t) {
                        var s = "#" + t[e] + t[o] + t[i],
                            r = new bkElement("DIV").setStyle({
                                cursor: "pointer",
                                height: "15px",
                                "float": "left"
                            }).appendTo(n),
                            a = new bkElement("DIV").setStyle({
                                border: "2px solid " + s
                            }).appendTo(r),
                            s = new bkElement("DIV").setStyle({
                                backgroundColor: s,
                                overflow: "hidden",
                                width: "11px",
                                height: "11px"
                            }).addEvent("click", this.colorSelect.closure(this, s)).addEvent("mouseover", this.on.closure(this, a)).addEvent("mouseout", this.off.closure(this, a, s)).appendTo(a);
                        window.opera || (r.onmousedown = s.onmousedown = bkLib.cancelEvent)
                    }
            this.pane.append(n.noSelect())
        },
        colorSelect: function(e) {
            this.ne.nicCommand("foreColor", e), this.removePane()
        },
        on: function(e) {
            e.setStyle({
                border: "2px solid #000"
            })
        },
        off: function(e, t) {
            e.setStyle({
                border: "2px solid " + t
            })
        }
    }),
    nicEditorBgColorButton = nicEditorColorButton.extend({
        colorSelect: function(e) {
            this.ne.nicCommand("hiliteColor", e), this.removePane()
        }
    });
nicEditors.registerPlugin(nicPlugin, nicColorOptions);
var nicImageOptions = {
        buttons: {
            image: {
                name: "Add Image",
                type: "nicImageButton",
                tags: ["IMG"]
            }
        }
    },
    nicImageButton = nicEditorAdvancedButton.extend({
        addPane: function() {
            this.im = this.ne.selectedInstance.selElm().parentTag("IMG"), this.addForm({
                "": {
                    type: "title",
                    txt: "Add/Edit Image"
                },
                src: {
                    type: "text",
                    txt: "URL",
                    value: "http://",
                    style: {
                        width: "150px"
                    }
                },
                alt: {
                    type: "text",
                    txt: "Alt Text",
                    style: {
                        width: "100px"
                    }
                },
                align: {
                    type: "select",
                    txt: "Align",
                    options: {
                        none: "Default",
                        left: "Left",
                        right: "Right"
                    }
                }
            }, this.im)
        },
        submit: function() {
            var e = this.inputs.src.value;
            return "" == e || "http://" == e ? (alert("You must enter a Image URL to insert"), !1) : (this.removePane(), this.im || (this.ne.nicCommand("insertImage", "javascript:nicImTemp();"), this.im = this.findElm("IMG", "src", "javascript:nicImTemp();")), void(this.im && this.im.setAttributes({
                src: this.inputs.src.value,
                alt: this.inputs.alt.value,
                align: this.inputs.align.value
            })))
        }
    });
nicEditors.registerPlugin(nicPlugin, nicImageOptions),
    function(e, t, n) {
        var i = "function" == typeof e.moment,
            o = !!e.addEventListener,
            s = e.setTimeout,
            r = function(e, t, n, i) {
                o ? e.addEventListener(t, n, !!i) : e.attachEvent("on" + t, n)
            },
            a = function(e, t, n, i) {
                o ? e.removeEventListener(t, n, !!i) : e.detachEvent("on" + t, n)
            },
            l = function(e, t) {
                return -1 !== (" " + e.className + " ").indexOf(" " + t + " ")
            },
            c = function(e) {
                return /Array/.test(Object.prototype.toString.call(e))
            },
            d = function(e) {
                return /Date/.test(Object.prototype.toString.call(e)) && !isNaN(e.getTime())
            },
            u = function(e) {
                d(e) && e.setHours(0, 0, 0, 0)
            },
            h = function(e, t, i) {
                var o, s;
                for (o in t)(s = e[o] !== n) && "object" == typeof t[o] && t[o].nodeName === n ? d(t[o]) ? i && (e[o] = new Date(t[o].getTime())) : c(t[o]) ? i && (e[o] = t[o].slice(0)) : e[o] = h({}, t[o], i) : (i || !s) && (e[o] = t[o]);
                return e
            },
            p = {
                field: null,
                bound: n,
                format: "YYYY-MM-DD",
                defaultDate: null,
                setDefaultDate: !1,
                firstDay: 0,
                minDate: null,
                maxDate: null,
                yearRange: 10,
                minYear: 0,
                maxYear: 9999,
                minMonth: n,
                maxMonth: n,
                isRTL: !1,
                numberOfMonths: 1,
                i18n: {
                    previousMonth: "Previous Month",
                    nextMonth: "Next Month",
                    months: "January February March April May June July August September October November December".split(" "),
                    weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                    weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" ")
                },
                locales: {
                    en: {
                        previousMonth: "Previous Month",
                        nextMonth: "Next Month",
                        months: "January February March April May June July August September October November December".split(" "),
                        weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                        weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" ")
                    },
                    pt: {
                        previousMonth: "M\xeas Anterior",
                        nextMonth: "M\xeas Seguinte",
                        months: "Janeiro Fevereiro Mar\xe7o Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" "),
                        weekdays: "Domingo Segunda Ter\xe7a Quarta Quinta Sexta S\xe1bado".split(" "),
                        weekdaysShort: "Dom Seg Ter Qua Qui Sex S\xe1b".split(" ")
                    },
                    br: {
                        previousMonth: "M\xeas Anterior",
                        nextMonth: "M\xeas Seguinte",
                        months: "Janeiro Fevereiro Mar\xe7o Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" "),
                        weekdays: "Domingo Segunda Ter\xe7a Quarta Quinta Sexta S\xe1bado".split(" "),
                        weekdaysShort: "Dom Seg Ter Qua Qui Sex S\xe1b".split(" ")
                    },
                    es: {
                        previousMonth: "Mes Anterior",
                        nextMonth: "Mes Siguiente",
                        months: "Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre".split(" "),
                        weekdays: "Domingo Lunes Martes Mi\xe9rcoles Jueves Viernes S\xe1bado".split(" "),
                        weekdaysShort: "Dom Lun Mar M\xede Jue Vie S\xe1b".split(" ")
                    },
                    fr: {
                        previousMonth: "Mois Pr\xe9c\xe9dent",
                        nextMonth: "Mois Suivant",
                        months: "Janvier F\xe9vrier Mars Avril Mai Juin Juillet Ao\xfbt Septembre Octobre Novembre D\xe9cembre".split(" "),
                        weekdays: "Dimanche Lundi Mardi Mercredi Jeudi Vendredi Samedi".split(" "),
                        weekdaysShort: "Dim Lun Mar Mer Jeu Ven Sam".split(" ")
                    },
                    hu: {
                        previousMonth: "El\u0151z\u0151 h\xf3nap",
                        nextMonth: "K\xf6vetkez\u0151 h\xf3nap",
                        months: "Janu\xe1r Febru\xe1r M\xe1rcius \xc1prilis M\xe1jus J\xfanius J\xfalius Augusztus Szeptember Okt\xf3ber November December".split(" "),
                        weekdays: "Vas\xe1rnap H\xe9tf\u0151 Kedd Szerda Cs\xfct\xf6rt\xf6k P\xe9ntek Szombat".split(" "),
                        weekdaysShort: "V. H. K. Sze. Cs. P. Szo.".split(" ")
                    },
                    sv: {
                        previousMonth: "F\xf6reg\xe5ende m\xe5nad",
                        nextMonth: "N\xe4sta m\xe5nad",
                        months: "Januari Februari Mars April Maj Juni Juli Augusti September Oktober November December".split(" "),
                        weekdays: "S\xf6ndag M\xe5ndag Tisdag Onsdag Torsdag Fredag L\xf6rdag".split(" "),
                        weekdaysShort: "S\xf6n M\xe5n Tis Ons Tor Fre L\xf6r".split(" ")
                    },
                    ru: {
                        previousMonth: "\u043f\u0440\u0435\u0434\u044b\u0434\u0443\u0449\u0438\u0439",
                        nextMonth: "\u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439",
                        months: "\u044f\u043d\u0432\u0430\u0440\u044f \u0444\u0435\u0432\u0440\u0430\u043b\u044f \u043c\u0430\u0440\u0442\u0430 \u0430\u043f\u0440\u0435\u043b\u044f \u043c\u0430\u044f \u0438\u044e\u043d\u044f \u0438\u044e\u043b\u044f \u0430\u0432\u0433\u0443\u0441\u0442\u0430 \u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f \u043e\u043a\u0442\u044f\u0431\u0440\u044f \u043d\u043e\u044f\u0431\u0440\u044f \u0434\u0435\u043a\u0430\u0431\u0440\u044f".split(" "),
                        weekdays: "\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435 \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0435\u0440\u0433 \u043f\u044f\u0442\u043d\u0438\u0446\u0430 \u0441\u0443\u0431\u0431\u043e\u0442\u0430".split(" "),
                        weekdaysShort: "\u0412\u0441 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" ")
                    },
                    de: {
                        previousMonth: "Vorheriger Monat",
                        nextMonth: "N\xe4chster Monat",
                        months: "Januar Februar M\xe4rz April Mai Juni Juli August September Oktober November Dezember".split(" "),
                        weekdays: "Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "),
                        weekdaysShort: "So Mo Di Mi Do Fr Sa".split(" ")
                    },
                    it: {
                        previousMonth: "Precedente",
                        nextMonth: "Seguente",
                        months: "gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre".split(" "),
                        weekdays: "domenica luned\xec marted\xec mercoled\xec gioved\xec venerd\xec sabato".split(" "),
                        weekdaysShort: "dom lun mar mer gio ven sab".split(" ")
                    },
                    tr: {
                        previousMonth: "\xf6nceki",
                        nextMonth: "sonraki",
                        months: "Ocak \u015eubat Mart Nisan May\u0131s Haziran Temmuz A\u011fustos Eyl\xfcl Ekim Kas\u0131m Aral\u0131k".split(" "),
                        weekdays: "Pazar Pazartesi Sal\u0131 \xc7ar\u015famba Per\u015fembe Cuma Cumartesi".split(" "),
                        weekdaysShort: "Pzr Pzt Sal \xc7r\u015f Pr\u015f Cum Cts".split(" ")
                    },
                    nl: {
                        previousMonth: "Voorgaand",
                        nextMonth: "Volgende",
                        months: "januari februari maart april mei juni juli augustus september oktober november december".split(" "),
                        weekdays: "zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" "),
                        weekdaysShort: "zon maa din woe don vri zat".split(" ")
                    },
                    ro: {
                        previousMonth: "anterioar\u0103 luni",
                        nextMonth: "lun\u0103 urm\u0103toare",
                        months: "Ianuarie Februarie Martie Aprilie Mai Iunie Iulie August Septembrie Octombrie Noiembrie Decembrie".split(" "),
                        weekdays: "Duminic\u0103 Luni Mar\u021bi Miercuri Joi Vineri S\xe2mbat\u0103".split(" "),
                        weekdaysShort: "Dum Lun Mar Mie Joi Vin S\xe2m".split(" ")
                    }
                },
                onSelect: null,
                onOpen: null,
                onClose: null,
                onDraw: null
            },
            m = function(e, t, n) {
                for (t += e.firstDay; t >= 7;) t -= 7;
                return n ? e.i18n.weekdaysShort[t] : e.i18n.weekdays[t]
            },
            f = function(e, t, n, i, o) {
                return o ? '<td class="is-empty"></td>' : (o = [], i && o.push("is-disabled"), n && o.push("is-today"), t && o.push("is-selected"), '<td data-day="' + e + '" class="' + o.join(" ") + '"><button class="pika-button" type="button">' + e + "</button></td>")
            };
        e.Pikaday = function(n) {
            var a = this,
                c = a.config(n);
            a._onMouseDown = function(t) {
                if (a._v) {
                    t = t || e.event;
                    var n = t.target || t.srcElement;
                    if (n) {
                        if (!l(n, "is-disabled")) {
                            if (l(n, "pika-button") && !l(n, "is-empty")) return a.setDate(new Date(a._y, a._m, parseInt(n.innerHTML, 10))), void(c.bound && s(function() {
                                a.hide()
                            }, 100));
                            l(n, "pika-prev") ? a.prevMonth() : l(n, "pika-next") && a.nextMonth()
                        }
                        if (l(n, "pika-select")) a._c = !0;
                        else {
                            if (!t.preventDefault) return t.returnValue = !1;
                            t.preventDefault()
                        }
                    }
                }
            }, a._onChange = function(t) {
                t = t || e.event, (t = t.target || t.srcElement) && (l(t, "pika-select-month") ? a.gotoMonth(t.value) : l(t, "pika-select-year") && a.gotoYear(t.value))
            }, a._onInputChange = function(t) {
                t.firedBy !== a && (t = i ? (t = e.moment(c.field.value, c.format)) ? t.toDate() : null : new Date(Date.parse(c.field.value)), a.setDate(d(t) ? t : null), a._v || a.show())
            }, a._onInputFocus = function() {
                a.show()
            }, a._onInputClick = function() {
                a.show()
            }, a._onInputBlur = function() {
                a._c || (a._b = s(function() {
                    a.hide()
                }, 50)), a._c = !1
            }, a._onClick = function(t) {
                t = t || e.event;
                var n = t = t.target || t.srcElement;
                if (t) {
                    !o && l(t, "pika-select") && !t.onchange && (t.setAttribute("onchange", "return;"), r(t, "change", a._onChange));
                    do
                        if (l(n, "pika-single")) return; while (n = n.parentNode);
                    a._v && t !== c.field && a.hide()
                }
            }, a.el = t.createElement("div"), a.el.className = "pika-single" + (c.isRTL ? " is-rtl" : ""), r(a.el, "mousedown", a._onMouseDown, !0), r(a.el, "change", a._onChange), c.field && (c.bound ? t.body.appendChild(a.el) : c.field.parentNode.insertBefore(a.el, c.field.nextSibling), r(c.field, "change", a._onInputChange), c.defaultDate || (c.defaultDate = i && c.field.value ? e.moment(c.field.value, c.format).toDate() : new Date(Date.parse(c.field.value)), c.setDefaultDate = !0)), n = c.defaultDate, d(n) ? c.setDefaultDate ? a.setDate(n, !0) : a.gotoDate(n) : a.gotoDate(new Date), c.bound ? (this.hide(), a.el.className += " is-bound", r(c.field, "click", a._onInputClick), r(c.field, "focus", a._onInputFocus), r(c.field, "blur", a._onInputBlur)) : this.show()
        }, e.Pikaday.prototype = {
            config: function(e) {
                this._o || (this._o = h({}, p, !0)), e = h(this._o, e, !0), e.isRTL = !!e.isRTL, e.field = e.field && e.field.nodeName ? e.field : null, e.bound = !!(e.bound !== n ? e.field && e.bound : e.field);
                var t = parseInt(e.numberOfMonths, 10) || 1;
                return e.numberOfMonths = t > 4 ? 4 : t, d(e.minDate) || (e.minDate = !1), d(e.maxDate) || (e.maxDate = !1), e.minDate && e.maxDate && e.maxDate < e.minDate && (e.maxDate = e.minDate = !1), e.minDate && (u(e.minDate), e.minYear = e.minDate.getFullYear(), e.minMonth = e.minDate.getMonth()), e.maxDate && (u(e.maxDate), e.maxYear = e.maxDate.getFullYear(), e.maxMonth = e.maxDate.getMonth()), c(e.yearRange) ? (t = (new Date).getFullYear() - 10, e.yearRange[0] = parseInt(e.yearRange[0], 10) || t, e.yearRange[1] = parseInt(e.yearRange[1], 10) || t) : (e.yearRange = Math.abs(parseInt(e.yearRange, 10)) || p.yearRange, 100 < e.yearRange && (e.yearRange = 100)), e.locale && (p.i18n = p.locales[e.locale], e.i18n = p.i18n), e
            },
            toString: function(t) {
                return d(this._d) ? i ? e.moment(this._d).format(t || this._o.format) : this.toBasicString(this._d) : ""
            },
            toBasicString: function(e) {
                var t = e.getDate(),
                    t = 10 > t ? "0" + t : t,
                    n = e.getMonth() + 1;
                return e.getFullYear() + "-" + (10 > n ? "0" + n : n) + "-" + t
            },
            getMoment: function() {
                return i ? e.moment(this._d) : null
            },
            setMoment: function(t) {
                i && e.moment.isMoment(t) && this.setDate(t.toDate())
            },
            getDate: function() {
                return d(this._d) ? new Date(this._d.getTime()) : null
            },
            setDate: function(e, n) {
                if (!e) return this._d = null, this.draw();
                if ("string" == typeof e && (e = new Date(Date.parse(e))), d(e)) {
                    var i = this._o.minDate,
                        o = this._o.maxDate;
                    if (d(i) && i > e ? e = i : d(o) && e > o && (e = o), this._d = new Date(e.getTime()), u(this._d), this.gotoDate(this._d), this._o.field) {
                        this._o.field.value = this.toString();
                        var s, i = this._o.field,
                            o = {
                                firedBy: this
                            };
                        t.createEvent ? (s = t.createEvent("HTMLEvents"), s.initEvent("change", !0, !1), s = h(s, o), i.dispatchEvent(s)) : t.createEventObject && (s = t.createEventObject(), s = h(s, o), i.fireEvent("onchange", s))
                    }!n && "function" == typeof this._o.onSelect && this._o.onSelect.call(this, this.getDate())
                }
            },
            gotoDate: function(e) {
                d(e) && (this._y = e.getFullYear(), this._m = e.getMonth(), this.draw())
            },
            gotoToday: function() {
                this.gotoDate(new Date)
            },
            gotoMonth: function(e) {
                isNaN(e = parseInt(e, 10)) || (this._m = 0 > e ? 0 : e > 11 ? 11 : e, this.draw())
            },
            nextMonth: function() {
                11 < ++this._m && (this._m = 0, this._y++), this.draw()
            },
            prevMonth: function() {
                0 > --this._m && (this._m = 11, this._y--), this.draw()
            },
            gotoYear: function(e) {
                isNaN(e) || (this._y = parseInt(e, 10), this.draw())
            },
            draw: function(e) {
                if (this._v || e) {
                    var t = this._o;
                    e = t.minYear;
                    var n = t.maxYear,
                        i = t.minMonth,
                        o = t.maxMonth;
                    this._y <= e && (this._y = e, !isNaN(i) && this._m < i && (this._m = i)), this._y >= n && (this._y = n, !isNaN(o) && this._m > o && (this._m = o)), e = this.el;
                    for (var r = this._o, a = this._m, l = this._y, d = l === r.minYear, u = l === r.maxYear, h = '<div class="pika-title">', p = !0, m = !0, o = [], n = 0; 12 > n; n++) o.push('<option value="' + n + '"' + (n === a ? " selected" : "") + (d && n < r.minMonth || u && n > r.maxMonth ? "disabled" : "") + ">" + r.i18n.months[n] + "</option>");
                    for (h += '<div class="pika-label">' + r.i18n.months[a] + '<select class="pika-select pika-select-month">' + o.join("") + "</select></div>", c(r.yearRange) ? (n = r.yearRange[0], i = r.yearRange[1] + 1) : (n = l - r.yearRange, i = 1 + l + r.yearRange), o = []; i > n && n <= r.maxYear; n++) n >= r.minYear && o.push('<option value="' + n + '"' + (n === l ? " selected" : "") + ">" + n + "</option>");
                    if (h += '<div class="pika-label">' + l + '<select class="pika-select pika-select-year">' + o.join("") + "</select></div>", d && (0 === a || r.minMonth >= a) && (p = !1), u && (11 === a || r.maxMonth <= a) && (m = !1), h += '<button class="pika-prev' + (p ? "" : " is-disabled") + '" type="button">' + r.i18n.previousMonth + "</button>", h += '<button class="pika-next' + (m ? "" : " is-disabled") + '" type="button">' + r.i18n.nextMonth + "</button>", e.innerHTML = h + "</div>" + this.render(this._y, this._m), t.bound) {
                        for (e = t.field, n = e.offsetLeft, i = e.offsetTop + e.offsetHeight; e = e.offsetParent;) n += e.offsetLeft, i += e.offsetTop;
                        this.el.style.cssText = "position:absolute;left:" + n + "px;top:" + i + "px;", s(function() {
                            t.field.focus()
                        }, 1)
                    }
                    if ("function" == typeof this._o.onDraw) {
                        var f = this;
                        s(function() {
                            f._o.onDraw.call(f)
                        }, 0)
                    }
                }
            },
            render: function(e, t) {
                var n = this._o,
                    i = new Date,
                    o = [31, 0 === e % 4 && 0 !== e % 100 || 0 === e % 400 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t],
                    s = new Date(e, t, 1).getDay(),
                    r = [],
                    a = [];
                u(i), 0 < n.firstDay && (s -= n.firstDay, 0 > s && (s += 7));
                for (var l = o + s, c = l; c > 7;) c -= 7;
                for (var l = l + (7 - c), h = c = 0; l > c; c++) {
                    var p = new Date(e, t, 1 + (c - s)),
                        g = n.minDate && p < n.minDate || n.maxDate && p > n.maxDate,
                        v = d(this._d) ? p.getTime() === this._d.getTime() : !1,
                        p = p.getTime() === i.getTime();
                    a.push(f(1 + (c - s), v, p, g, s > c || c >= o + s)), 7 === ++h && (r.push("<tr>" + (n.isRTL ? a.reverse() : a).join("") + "</tr>"), a = [], h = 0)
                }
                for (o = [], i = 0; 7 > i; i++) o.push('<th scope="col"><abbr title="' + m(n, i) + '">' + m(n, i, !0) + "</abbr></th>");
                return '<table cellpadding="0" cellspacing="0" class="pika-table">' + ("<thead>" + (n.isRTL ? o.reverse() : o).join("") + "</thead>") + ("<tbody>" + r.join("") + "</tbody>") + "</table>"
            },
            isVisible: function() {
                return this._v
            },
            show: function() {
                if (!this._v) {
                    this._o.bound && r(t, "click", this._onClick);
                    var e, n = this.el;
                    e = (" " + n.className + " ").replace(" is-hidden ", " "), e = e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, ""), n.className = e, this._v = !0, this.draw(), "function" == typeof this._o.onOpen && this._o.onOpen.call(this)
                }
            },
            hide: function() {
                var e = this._v;
                if (!1 !== e) {
                    this._o.bound && a(t, "click", this._onClick), this.el.style.cssText = "";
                    var i = this.el;
                    l(i, "is-hidden") || (i.className = "" === i.className ? "is-hidden" : i.className + " is-hidden"), this._v = !1, e !== n && "function" == typeof this._o.onClose && this._o.onClose.call(this)
                }
            },
            destroy: function() {
                this.hide(), a(this.el, "mousedown", this._onMouseDown, !0), a(this.el, "change", this._onChange), this._o.field && (a(this._o.field, "change", this._onInputChange), this._o.bound && (a(this._o.field, "click", this._onInputClick), a(this._o.field, "focus", this._onInputFocus), a(this._o.field, "blur", this._onInputBlur))), this.el.parentNode && this.el.parentNode.removeChild(this.el)
            }
        }
    }(window, window.document);
var audioplayer_swfobject = function() {
        function e() {
            if (!I) {
                try {
                    var e = k.getElementsByTagName("body")[0].appendChild(k.createElement("span"));
                    e.parentNode.removeChild(e)
                } catch (t) {
                    return
                }
                I = !0;
                for (var e = L.length, n = 0; e > n; n++) L[n]()
            }
        }

        function t(e) {
            I ? e() : L[L.length] = e
        }

        function n(e) {
            if (typeof O.addEventListener != S) O.addEventListener("load", e, !1);
            else if (typeof k.addEventListener != S) k.addEventListener("load", e, !1);
            else if (typeof O.attachEvent != S) {
                var t = O;
                t.attachEvent("onload", e), N[N.length] = [t, "onload", e]
            } else if ("function" == typeof O.onload) {
                var n = O.onload;
                O.onload = function() {
                    n(), e()
                }
            } else O.onload = e
        }

        function i() {
            var e = P.length;
            if (e > 0)
                for (var t = 0; e > t; t++) {
                    var n = P[t].id,
                        i = P[t].callbackFn,
                        l = {
                            success: !1,
                            id: n
                        };
                    if (0 < x.pv[0]) {
                        var c = u(n);
                        if (c)
                            if (!h(P[t].swfVersion) || x.wk && 312 > x.wk)
                                if (P[t].expressInstall && s()) {
                                    l = {}, l.data = P[t].expressInstall, l.width = c.getAttribute("width") || "0", l.height = c.getAttribute("height") || "0", c.getAttribute("class") && (l.styleclass = c.getAttribute("class")), c.getAttribute("align") && (l.align = c.getAttribute("align"));
                                    for (var d = {}, c = c.getElementsByTagName("param"), p = c.length, f = 0; p > f; f++) "movie" != c[f].getAttribute("name").toLowerCase() && (d[c[f].getAttribute("name")] = c[f].getAttribute("value"));
                                    r(l, d, n, i)
                                } else a(c), i && i(l);
                        else m(n, !0), i && (l.success = !0, l.ref = o(n), i(l))
                    } else m(n, !0), i && ((n = o(n)) && typeof n.SetVariable != S && (l.success = !0, l.ref = n), i(l))
                }
        }

        function o(e) {
            var t = null;
            return (e = u(e)) && "OBJECT" == e.nodeName && (typeof e.SetVariable != S ? t = e : (e = e.getElementsByTagName(C)[0]) && (t = e)), t
        }

        function s() {
            return !M && h("6.0.65") && (x.win || x.mac) && !(x.wk && 312 > x.wk)
        }

        function r(e, t, n, i) {
            M = !0, b = i || null, y = {
                success: !1,
                id: n
            };
            var o = u(n);
            o && ("OBJECT" == o.nodeName ? (g = l(o), v = null) : (g = o, v = n), e.id = T, (typeof e.width == S || !/%$/.test(e.width) && 310 > parseInt(e.width, 10)) && (e.width = "310"), (typeof e.height == S || !/%$/.test(e.height) && 137 > parseInt(e.height, 10)) && (e.height = "137"), k.title = k.title.slice(0, 47) + " - Flash Player Installation", i = x.ie && x.win ? "ActiveX" : "PlugIn", i = "MMredirectURL=" + O.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + i + "&MMdoctitle=" + k.title, t.flashvars = typeof t.flashvars != S ? t.flashvars + ("&" + i) : i, x.ie && x.win && 4 != o.readyState && (i = k.createElement("div"), n += "SWFObjectNew", i.setAttribute("id", n), o.parentNode.insertBefore(i, o), o.style.display = "none", function() {
                4 == o.readyState ? o.parentNode.removeChild(o) : setTimeout(arguments.callee, 10)
            }()), c(e, t, n))
        }

        function a(e) {
            if (x.ie && x.win && 4 != e.readyState) {
                var t = k.createElement("div");
                e.parentNode.insertBefore(t, e), t.parentNode.replaceChild(l(e), t), e.style.display = "none",
                    function() {
                        4 == e.readyState ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10)
                    }()
            } else e.parentNode.replaceChild(l(e), e)
        }

        function l(e) {
            var t = k.createElement("div");
            if (x.win && x.ie) t.innerHTML = e.innerHTML;
            else if ((e = e.getElementsByTagName(C)[0]) && (e = e.childNodes))
                for (var n = e.length, i = 0; n > i; i++) !(1 == e[i].nodeType && "PARAM" == e[i].nodeName) && 8 != e[i].nodeType && t.appendChild(e[i].cloneNode(!0));
            return t
        }

        function c(e, t, n) {
            var i, o = u(n);
            if (x.wk && 312 > x.wk) return i;
            if (o)
                if (typeof e.id == S && (e.id = n), x.ie && x.win) {
                    var s, r = "";
                    for (s in e) e[s] != Object.prototype[s] && ("data" == s.toLowerCase() ? t.movie = e[s] : "styleclass" == s.toLowerCase() ? r += ' class="' + e[s] + '"' : "classid" != s.toLowerCase() && (r += " " + s + '="' + e[s] + '"'));
                    s = "";
                    for (var a in t) t[a] != Object.prototype[a] && (s += '<param name="' + a + '" value="' + t[a] + '" />');
                    o.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + r + ">" + s + "</object>", F[F.length] = e.id, i = u(e.id)
                } else {
                    a = k.createElement(C), a.setAttribute("type", _);
                    for (var l in e) e[l] != Object.prototype[l] && ("styleclass" == l.toLowerCase() ? a.setAttribute("class", e[l]) : "classid" != l.toLowerCase() && a.setAttribute(l, e[l]));
                    for (r in t) t[r] != Object.prototype[r] && "movie" != r.toLowerCase() && (e = a, s = r, l = t[r], n = k.createElement("param"), n.setAttribute("name", s), n.setAttribute("value", l), e.appendChild(n));
                    o.parentNode.replaceChild(a, o), i = a
                }
            return i
        }

        function d(e) {
            var t = u(e);
            t && "OBJECT" == t.nodeName && (x.ie && x.win ? (t.style.display = "none", function() {
                if (4 == t.readyState) {
                    var n = u(e);
                    if (n) {
                        for (var i in n) "function" == typeof n[i] && (n[i] = null);
                        n.parentNode.removeChild(n)
                    }
                } else setTimeout(arguments.callee, 10)
            }()) : t.parentNode.removeChild(t))
        }

        function u(e) {
            var t = null;
            try {
                t = k.getElementById(e)
            } catch (n) {}
            return t
        }

        function h(e) {
            var t = x.pv;
            return e = e.split("."), e[0] = parseInt(e[0], 10), e[1] = parseInt(e[1], 10) || 0, e[2] = parseInt(e[2], 10) || 0, t[0] > e[0] || t[0] == e[0] && t[1] > e[1] || t[0] == e[0] && t[1] == e[1] && t[2] >= e[2] ? !0 : !1
        }

        function p(e, t, n, i) {
            if (!x.ie || !x.mac) {
                var o = k.getElementsByTagName("head")[0];
                o && (n = n && "string" == typeof n ? n : "screen", i && (w = E = null), E && w == n || (i = k.createElement("style"), i.setAttribute("type", "text/css"), i.setAttribute("media", n), E = o.appendChild(i), x.ie && x.win && typeof k.styleSheets != S && 0 < k.styleSheets.length && (E = k.styleSheets[k.styleSheets.length - 1]), w = n), x.ie && x.win ? E && typeof E.addRule == C && E.addRule(e, t) : E && typeof k.createTextNode != S && E.appendChild(k.createTextNode(e + " {" + t + "}")))
            }
        }

        function m(e, t) {
            if (j) {
                var n = t ? "visible" : "hidden";
                I && u(e) ? u(e).style.visibility = n : p("#" + e, "visibility:" + n)
            }
        }

        function f(e) {
            return null != /[\\\"<>\.;]/.exec(e) && typeof encodeURIComponent != S ? encodeURIComponent(e) : e
        }
        var g, v, b, y, E, w, x, S = "undefined",
            C = "object",
            _ = "application/x-shockwave-flash",
            T = "SWFObjectExprInst",
            O = window,
            k = document,
            $ = navigator,
            A = !1,
            L = [function() {
                if (A) {
                    var e = k.getElementsByTagName("body")[0],
                        t = k.createElement(C);
                    t.setAttribute("type", _);
                    var n = e.appendChild(t);
                    if (n) {
                        var o = 0;
                        ! function() {
                            if (typeof n.GetVariable != S) {
                                var s = n.GetVariable("$version");
                                s && (s = s.split(" ")[1].split(","), x.pv = [parseInt(s[0], 10), parseInt(s[1], 10), parseInt(s[2], 10)])
                            } else if (10 > o) return o++, void setTimeout(arguments.callee, 10);
                            e.removeChild(t), n = null, i()
                        }()
                    } else i()
                } else i()
            }],
            P = [],
            F = [],
            N = [],
            I = !1,
            M = !1,
            j = !0,
            D = typeof k.getElementById != S && typeof k.getElementsByTagName != S && typeof k.createElement != S,
            H = $.userAgent.toLowerCase(),
            B = $.platform.toLowerCase(),
            R = /win/.test(B ? B : H),
            B = /mac/.test(B ? B : H),
            H = /webkit/.test(H) ? parseFloat(H.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
            z = !1,
            U = [0, 0, 0],
            q = null;
        if (typeof $.plugins != S && typeof $.plugins["Shockwave Flash"] == C) !(q = $.plugins["Shockwave Flash"].description) || typeof $.mimeTypes != S && $.mimeTypes[_] && !$.mimeTypes[_].enabledPlugin || (A = !0, z = !1, q = q.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), U[0] = parseInt(q.replace(/^(.*)\..*$/, "$1"), 10), U[1] = parseInt(q.replace(/^.*\.(.*)\s.*$/, "$1"), 10), U[2] = /[a-zA-Z]/.test(q) ? parseInt(q.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0);
        else if (typeof O.ActiveXObject != S) try {
            var V = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            V && (q = V.GetVariable("$version")) && (z = !0, q = q.split(" ")[1].split(","), U = [parseInt(q[0], 10), parseInt(q[1], 10), parseInt(q[2], 10)])
        } catch (W) {}
        return x = {
            w3: D,
            pv: U,
            wk: H,
            ie: z,
            win: R,
            mac: B
        }, x.w3 && ((typeof k.readyState != S && "complete" == k.readyState || typeof k.readyState == S && (k.getElementsByTagName("body")[0] || k.body)) && e(), I || (typeof k.addEventListener != S && k.addEventListener("DOMContentLoaded", e, !1), x.ie && x.win && (k.attachEvent("onreadystatechange", function() {
            "complete" == k.readyState && (k.detachEvent("onreadystatechange", arguments.callee), e())
        }), O == top && function() {
            if (!I) {
                try {
                    k.documentElement.doScroll("left")
                } catch (t) {
                    return void setTimeout(arguments.callee, 0)
                }
                e()
            }
        }()), x.wk && function() {
            I || (/loaded|complete/.test(k.readyState) ? e() : setTimeout(arguments.callee, 0))
        }(), n(e))), x.ie && x.win && window.attachEvent("onunload", function() {
            for (var e = N.length, t = 0; e > t; t++) N[t][0].detachEvent(N[t][1], N[t][2]);
            for (e = F.length, t = 0; e > t; t++) d(F[t]);
            for (var n in x) x[n] = null;
            x = null;
            for (var i in audioplayer_swfobject) audioplayer_swfobject[i] = null;
            audioplayer_swfobject = null
        }), {
            registerObject: function(e, t, n, i) {
                if (x.w3 && e && t) {
                    var o = {};
                    o.id = e, o.swfVersion = t, o.expressInstall = n, o.callbackFn = i, P[P.length] = o, m(e, !1)
                } else i && i({
                    success: !1,
                    id: e
                })
            },
            getObjectById: function(e) {
                return x.w3 ? o(e) : void 0
            },
            embedSWF: function(e, n, i, o, a, l, d, u, p, f) {
                var g = {
                    success: !1,
                    id: n
                };
                x.w3 && !(x.wk && 312 > x.wk) && e && n && i && o && a ? (m(n, !1), t(function() {
                    i += "", o += "";
                    var t = {};
                    if (p && typeof p === C)
                        for (var v in p) t[v] = p[v];
                    if (t.data = e, t.width = i, t.height = o, v = {}, u && typeof u === C)
                        for (var b in u) v[b] = u[b];
                    if (d && typeof d === C)
                        for (var y in d) v.flashvars = typeof v.flashvars != S ? v.flashvars + ("&" + y + "=" + d[y]) : y + "=" + d[y];
                    if (h(a)) b = c(t, v, n), t.id == n && m(n, !0), g.success = !0, g.ref = b;
                    else {
                        if (l && s()) return t.data = l, void r(t, v, n, f);
                        m(n, !0)
                    }
                    f && f(g)
                })) : f && f(g)
            },
            switchOffAutoHideShow: function() {
                j = !1
            },
            ua: x,
            getFlashPlayerVersion: function() {
                return {
                    major: x.pv[0],
                    minor: x.pv[1],
                    release: x.pv[2]
                }
            },
            hasFlashPlayerVersion: h,
            createSWF: function(e, t, n) {
                return x.w3 ? c(e, t, n) : void 0
            },
            showExpressInstall: function(e, t, n, i) {
                x.w3 && s() && r(e, t, n, i)
            },
            removeSWF: function(e) {
                x.w3 && d(e)
            },
            createCSS: function(e, t, n, i) {
                x.w3 && p(e, t, n, i)
            },
            addDomLoadEvent: t,
            addLoadEvent: n,
            getQueryParamValue: function(e) {
                var t = k.location.search || k.location.hash;
                if (t) {
                    if (/\?/.test(t) && (t = t.split("?")[1]), null == e) return f(t);
                    for (var t = t.split("&"), n = 0; n < t.length; n++)
                        if (t[n].substring(0, t[n].indexOf("=")) == e) return f(t[n].substring(t[n].indexOf("=") + 1))
                }
                return ""
            },
            expressInstallCallback: function() {
                if (M) {
                    var e = u(T);
                    e && g && (e.parentNode.replaceChild(g, e), v && (m(v, !0), x.ie && x.win && (g.style.display = "block")), b && b(y)), M = !1
                }
            }
        }
    }(),
    AudioPlayer = function() {
        function e(e) {
            if (document.all && !window[e])
                for (var t = 0; t < document.forms.length; t++)
                    if (document.forms[t][e]) return document.forms[t][e];
            return document.all ? window[e] : document[e]
        }
        var t, n = [],
            i = "",
            o = {},
            s = -1;
        return {
            setup: function(e, t) {
                i = e, o = t, audioplayer_swfobject.hasFlashPlayerVersion("9") && (audioplayer_swfobject.switchOffAutoHideShow(), audioplayer_swfobject.createCSS("p.audioplayer_container span", "visibility:hidden;height:24px;overflow:hidden;padding:0;border:none;"))
            },
            getPlayer: function(t) {
                return e(t)
            },
            addListener: function(t, n, i) {
                e(t).addListener(n, i)
            },
            embed: function(e, t) {
                var s, r = {},
                    a = {},
                    l = {},
                    c = {};
                for (s in o) r[s] = o[s];
                for (s in t) r[s] = t[s];
                "yes" == r.transparentpagebg ? (a.bgcolor = "#FFFFFF", a.wmode = "transparent") : (r.pagebg && (a.bgcolor = "#" + r.pagebg), a.wmode = "opaque"), a.menu = "false";
                for (s in r) "pagebg" == s || "width" == s || "transparentpagebg" == s || (l[s] = r[s]);
                c.name = e, c.style = "outline: none", l.playerID = e, audioplayer_swfobject.embedSWF(i, e, r.width.toString(), "24", "9", !1, l, a, c), n.push(e)
            },
            syncVolumes: function(t, i) {
                s = i;
                for (var o = 0; o < n.length; o++) n[o] != t && e(n[o]).setVolume(s)
            },
            activate: function(n) {
                t && t != n && e(t).close(), t = n
            },
            load: function(t, n, i, o) {
                e(t).load(n, i, o)
            },
            close: function(n) {
                e(n).close(), n == t && (t = null)
            },
            open: function(t, n) {
                void 0 == n && (n = 1), e(t).open(void 0 == n ? 0 : n - 1)
            },
            getVolume: function() {
                return s
            }
        }
    }();
QF.pages.options = {
    init: function() {
        LOG("PAGE:options"), QF.common.basePage.init(this), $("startpage_content") && (Element.show("startpage_html"), Element.show("finalpage_html"), page.start_page = new nicEditor({
            iconsPath: "/images/niceditor_icons.gif"
        }).panelInstance("startpage_content"), page.final_page = new nicEditor({
            iconsPath: "/images/niceditor_icons.gif"
        }).panelInstance("finalpage_content"), Element.hide("startpage_html"), Element.hide("finalpage_html"))
    },
    activateStartPage: function() {
        Element.show("startpage_html"), page.start_page || (page.start_page = (new nicEditor).panelInstance("startpage_content"))
    },
    cancelStartPage: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "cancel_start_page"
            },
            onSuccess: function(e) {
                page.refreshStartPageBlock(e.responseText)
            }
        }), Element.hide("startpage_html")
    },
    saveStartPage: function() {
        Element.hide("startpage_html");
        var e = encodeURIComponent(page.start_page.nicInstances[0].getContent());
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "activate_start_page",
                startpage: e
            },
            onSuccess: function(e) {
                page.refreshStartPageBlock(e.responseText)
            }
        })
    },
    refreshStartPageBlock: function(e) {
        $("startpage_status").innerHTML = e
    },
    activateFinalPage: function() {
        Element.show("finalpage_html"), page.final_page || (page.final_page = (new nicEditor).panelInstance("finalpage_content"))
    },
    cancelFinalPage: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "cancel_final_page"
            },
            onSuccess: function(e) {
                page.refreshFinalPageBlock(e.responseText)
            }
        }), Element.hide("finalpage_html")
    },
    saveFinalPage: function() {
        Element.hide("finalpage_html");
        var e = encodeURIComponent(page.final_page.nicInstances[0].getContent());
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "activate_final_page",
                finalpage: e
            },
            onSuccess: function(e) {
                page.refreshFinalPageBlock(e.responseText)
            }
        })
    },
    refreshFinalPageBlock: function(e) {
        $("finalpage_status").innerHTML = e
    },
    showRedirect: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "show_redirect"
            },
            onSuccess: function(e) {
                page.showRedirectResult(e.responseText)
            }
        })
    },
    showRedirectResult: function(e) {
        $("redirectDetails").innerHTML = e, new Effect.BlindDown("redirectDetails", {
            duration: .3
        })
    },
    hideRedirect: function() {
        new Effect.BlindUp("redirectDetails", {
            duration: .3
        })
    },
    activateRedirect: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "activate_redirect",
                url: escape($F("urlForRedirect"))
            },
            onSuccess: function(e) {
                page.refreshRedirectBlock(e.responseText)
            }
        })
    },
    refreshRedirectBlock: function(e) {
        this.hideRedirect(), $("redirectState").innerHTML = e
    },
    disableRedirect: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "activate_redirect",
                url: ""
            },
            onSuccess: function(e) {
                page.refreshRedirectBlock(e.responseText)
            }
        })
    },
    changeTheme: function() {
        var e = $("themeSelect");
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "change_theme",
                theme_id: e.options[e.selectedIndex].value
            },
            onSuccess: function() {}
        })
    },
    changeResubmit: function() {
        var e = $("allow-resubmit");
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "change_resubmit",
                allow_resubmit: e.options[e.selectedIndex].value
            },
            onSuccess: function() {}
        })
    },
    changeRepeat: function() {
        var e = $("repeat-control");
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "change_repeat",
                repeat: e.options[e.selectedIndex].value
            },
            onSuccess: function() {}
        })
    },
    showPassword: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "show_password"
            },
            onSuccess: function(e) {
                page.showPasswordResult(e.responseText)
            }
        })
    },
    hidePassword: function() {
        new Effect.BlindUp("passwordDetails", {
            duration: .3
        })
    },
    showPasswordResult: function(e) {
        $("passwordDetails").innerHTML = e, new Effect.BlindDown("passwordDetails", {
            duration: .3
        })
    },
    activatePassword: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "activate_password",
                password: $F("surveyPassword")
            },
            onSuccess: function(e) {
                page.refreshPasswordBlock(e.responseText)
            }
        })
    },
    disablePassword: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "activate_password",
                password: ""
            },
            onSuccess: function(e) {
                page.refreshPasswordBlock(e.responseText)
            }
        })
    },
    refreshPasswordBlock: function(e) {
        this.hidePassword(), $("passwordState").innerHTML = e
    }
}, $("optionsPage") && QF.pages.options.init(), Position.getWindowSize = function(e) {
    e = e ? e : window;
    var t = e.innerWidth || e.document.documentElement.clientWidth || e.document.body.clientWidth,
        n = e.innerHeight || e.document.documentElement.clientHeight || e.document.body.clientHeight;
    return [t, n]
}, QF.pages.publish = {
    init: function() {
        LOG("PAGE:publish"), QF.common.basePage.init(this)
    },
    activateResponses: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "activate_responses"
            },
            onSuccess: function(e) {
                page.refreshResponsesBlock(e.responseText)
            }
        })
    },
    disableResponses: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "disable_responses"
            },
            onSuccess: function(e) {
                page.refreshResponsesBlock(e.responseText)
            }
        })
    },
    refreshResponsesBlock: function(e) {
        $("responsesState").innerHTML = e
    }
}, $("publishPage") && QF.pages.publish.init(), QF.pages.maillist = {
    init: function() {
        LOG("PAGE:maillist"), QF.common.basePage.init(this), this.ajax = new QF.common.ajaxLightbox(lang.current("Loading"))
    },
    showEmailList: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "get_maillist"
            },
            onSuccess: function(e) {
                $("list-table").innerHTML = e.responseText
            }
        })
    },
    addContact: function() {
        this.add_lb = new QF.common.htmlLightbox("largeLB", "greenLB", "add_contacts"), this.add_lb.parameters = "name=" + QF.common.utils.surveyNameFromUri(!0), this.add_lb.show()
    },
    addNewContacts: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "add_contacts",
                contacts: $F("newContactsForm")
            },
            onSuccess: function(e) {
                page.addContactsResult(e.responseText)
            }
        })
    },
    addContactsResult: function(e) {
        1 == e ? (this.add_lb.hide(), page.showEmailList()) : ($("failed-email").innerHTML = e, Element.show("failedParsing"), new Effect.Highlight("failedParsing"))
    },
    deleteContact: function(e) {
        confirm(e + ", " + lang.current("delete_confirm")) && new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "delete_contact",
                contact: e
            },
            onSuccess: function(e) {
                $("list-table").innerHTML = e.responseText
            }
        })
    },
    deleteAll: function() {
        confirm(lang.current("deleteAllConfirm")) && new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "delete_all"
            },
            onSuccess: function(e) {
                $("list-table").innerHTML = e.responseText
            }
        })
    },
    showEmail: function(e) {
        this.lb = new QF.common.htmlLightbox("largeLB", "redLB", "send_mail"), this.lb.parameters = "name=" + QF.common.utils.surveyNameFromUri(!0), this.lb.parameters += "&survey_id=" + $F("s_id"), null != e && (this.lb.parameters += "&email=" + escape(e)), this.lb.show()
    },
    sendEmail: function() {
        if ($("limit")) return void QF.common.accountLimitLightbox("mailing");
        var e = $("to").innerHTML,
            t = $F("subject"),
            n = $F("body"),
            i = $("only_remember") && $("only_remember").checked ? 1 : 0,
            o = $("anonymous") && $("anonymous").checked ? 1 : 0;
        $("sending-please-wait").show(), new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "send",
                email: e,
                subject: t,
                body: encodeURIComponent(n),
                reminder: i,
                anonymous: o
            },
            onSuccess: function(e) {
                page.lb.hide(), $("list-table").innerHTML = e.responseText
            }
        })
    },
    fetchPage: function(e) {
        e || (e = 0);
        var t = parseInt($F("currentPage")) + e;
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "list_table_page",
                page: t
            },
            onSuccess: function(e) {
                page.updateList(e.responseText)
            }
        }), this.ajax.show()
    },
    updateList: function(e) {
        $("list-table").innerHTML = e, this.ajax.hide()
    },
    copyContacts: function() {
        var e = $("source-survey").value;
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "copy_contacts",
                survey_id: e
            },
            onSuccess: function(e) {
                page.updateContacts(e.responseText)
            }
        })
    },
    updateContacts: function(e) {
        var t = $F("newContactsForm");
        $("newContactsForm").value = t ? t + "\n" + e : e
    }
}, $("maillistPage") && QF.pages.maillist.init(), QF.pages.responses = {
    init: function() {
        LOG("PAGE:responses"), QF.common.basePage.init(this), $("table") && (this.table_dimensions = $("table").getDimensions(), this.windowResize(), Event.observe(window, "resize", this.windowResize)), this.ajax = new QF.common.ajaxLightbox(lang.current("loading")), this.special_id = !0, this.special_subdate = !0, this.special_ip = !0, this.show_incomplete = !0, this.entries = $("entries").value, this.sort_dir = "", this.sort_field = "", this.scrollLeft = 0, document.cookie = "tzoffset=" + 60 * (new Date).getTimezoneOffset() * -1 + ";", Event.observe("entries", "change", function() {
            page.fetchPage("first")
        }), page.sortEvents()
    },
    windowResize: function() {
        var e = document.viewport;
        if (e) {
            var t = e.getDimensions(),
                n = t.height - 500;
            n < page.table_dimensions.height && $("table").setStyle({
                height: n + "px"
            })
        }
    },
    sortEvents: function() {
        $$("thead td").each(function(e) {
            Event.observe(e, "click", function() {
                var e = $(this).readAttribute("data-field-id");
                "name" != e && ($$("td.asc").each(function(t) {
                    $(t).readAttribute("data-field-id") != e && $(t).removeClassName("asc")
                }), $$("td.desc").each(function(t) {
                    $(t).readAttribute("data-field-id") != e && $(t).removeClassName("desc")
                }), $(this).hasClassName("desc") ? ($(this).removeClassName("desc"), $(this).addClassName("asc")) : $(this).hasClassName("asc") ? $(this).removeClassName("asc") : $(this).addClassName("desc"), page.sort_field = e, page.sort_dir = "", $(this).hasClassName("asc") && (page.sort_dir = "asc"), $(this).hasClassName("desc") && (page.sort_dir = "desc"), page.fetchPage("first"))
            })
        })
    },
    toggleHeaders: function() {
        $$(".off").each(function(e) {
            Element.toggle(e)
        }), $("in").src = "in" == $("in").name ? "/images/arrow_out.png" : "/images/arrow_in.png", $("in").name = "in" == $("in").name ? "out" : "in"
    },
    deleteAll: function() {
        confirm(lang.current("delete_all_confirm")) && new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "delete_all"
            },
            onSuccess: function(e) {
                page.updateGrid(e.responseText)
            }
        })
    },
    deleteRow: function(e) {
        confirm(lang.current("delete_confirm")) && ($("id_" + e).parentNode.removeChild($("id_" + e)), new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "delete_response",
                id: e
            },
            onSuccess: function(e) {
                page.deleteResult(e.responseText)
            }
        }))
    },
    deleteResult: function() {},
    fetchPage: function(e) {
        this.scrollLeft = $("table").scrollLeft, this.entries = $("entries").value;
        var t = parseInt($F("currentPage"));
        t = "first" === e || "last" === e ? e : parseInt($F("currentPage")) + e, new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "responses_grid",
                entries: this.entries,
                page: t,
                special_id: this.special_id,
                special_subdate: this.special_subdate,
                special_ip: this.special_ip,
                sort_field: this.sort_field,
                sort_dir: this.sort_dir
            },
            onSuccess: function(e) {
                page.updateGrid(e.responseText)
            }
        }), this.ajax.show()
    },
    updateGrid: function(e) {
        $("responses-area").innerHTML = e, this.windowResize();
        for (var t = $$("tr.partial"), n = 0; n < t.length; n++) this.show_incomplete ? Element.show(t[n]) : Element.hide(t[n]);
        page.sortEvents(), $("table").scrollLeft = page.scrollLeft, this.ajax.hide()
    },
    exportData: function() {
        this.exportWindow = new QF.common.htmlLightbox("mediumLB", "", "export"), this.exportWindow.parameters = "name=" + QF.common.utils.surveyNameFromUri(!0), this.exportWindow.show()
    },
    specialFields: function() {
        this.exportWindow = new QF.common.htmlLightbox("mediumLB", "", "special_fields"), this.exportWindow.onLoad = this.loadSpecialFields.bind(this), this.exportWindow.onClose = this.fetchPage.bind(this), this.exportWindow.show()
    },
    loadSpecialFields: function() {
        $("img_id").src = this.special_id ? "/images/tick.png" : "/images/cross.png", $("img_subdate").src = this.special_subdate ? "/images/tick.png" : "/images/cross.png", $("img_ip").src = this.special_ip ? "/images/tick.png" : "/images/cross.png", $("img_incomplete").src = this.show_incomplete ? "/images/tick.png" : "/images/cross.png"
    },
    toggleField: function(el) {
        eval("this." + el + "=!this." + el + ";"), this.loadSpecialFields()
    },
    printAll: function() {
        var e = $F("print_url");
        e ? (this.ajax.show(), document.location = e) : QF.common.accountLimitLightbox()
    }
}, $("responsesPage") && QF.pages.responses.init(), QF.pages.statistics = {
    init: function() {
        LOG("PAGE:statistics"), QF.common.basePage.init(this)
    },
    questionStat: function(e) {
        this.statWindow = new QF.common.htmlLightbox("largeLB", "", "field_statistics"), this.id = e.id, this.statWindow.fadeEffect = !1, this.statWindow.parameters = "name=" + this.getSurveyTitle() + "&field=" + e.id, this.statWindow.onLoad = this.startupStats.bind(this), this.statWindow.show()
    },
    searchText: function(e) {
        var t = $F("text-search");
        t.length > 1 && new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "search_text",
                field: e,
                keywords: t
            },
            onSuccess: function(e) {
                $("text-search-result").innerHTML = e.responseText
            }
        })
    },
    startupStats: function() {
        $("text-search") ? new Ajax.Autocompleter("text-search", "auto-complete-text", "/statistics/" + this.getSurveyTitle() + "?field=" + this.id, {
            paramName: "text",
            minChars: 2
        }) : $("map") && this.startupMap(this.id)
    },
    getSurveyTitle: function() {
        var e = location.href,
            t = e.substr(e.lastIndexOf("/") + 1, e.length);
        return t = t.replace(/#/, "")
    },
    showArrayItem: function(e) {
        for (var t = document.getElementsByClassName("array-question"), n = document.getElementsByClassName("array-question-stats"), i = 0; i < t.length; i++) t[i].removeClassName("selected");
        for (var i = 0; i < n.length; i++) n[i].hide();
        new Effect.BlindDown("array-question-" + e, {
            duration: .1
        }), $("array-question-" + e).parentNode.addClassName("selected")
    },
    getQuestions: function(e) {
        Element.show("paging-ajax"), new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "get_questions_list",
                page: e
            },
            onSuccess: function(e) {
                $("questions-list").innerHTML = e.responseText
            }
        })
    },
    startupMap: function(e) {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "get_map_stats",
                field_id: e
            },
            onSuccess: function(e) {
                page.initMap(e.responseJSON)
            }
        })
    },
    initMap: function(e) {
        if (GBrowserIsCompatible()) {
            var t = $("map");
            t.style.height = "300px";
            var n = new GMap2(t);
            n.setCenter(new GLatLng(e.lat, e.lng), e.zoom), n.setMapType(this.setMapType(e.mode)), e.markers.each(function(e) {
                n.addOverlay(new GMarker(new GLatLng(e[0], e[1])))
            })
        }
    },
    setMapType: function(e) {
        switch (e) {
            case "Map":
                return G_NORMAL_MAP;
            case "Satellite":
                return G_SATELLITE_MAP;
            case "Hybrid":
                return G_HYBRID_MAP;
            default:
                return G_NORMAL_MAP
        }
    }
}, $("statisticsPage") && QF.pages.statistics.init(), QF.pages.alerts = {
    init: function() {
        LOG("PAGE:alerts"), QF.common.basePage.init(this)
    },
    showEmail: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "show_email"
            },
            onSuccess: function(e) {
                page.showEmailResult(e.responseText)
            }
        })
    },
    showEmailResult: function(e) {
        $("emailDetails").innerHTML = e, new Effect.BlindDown("emailDetails", {
            duration: .3
        })
    },
    hideEmail: function() {
        new Effect.BlindUp("emailDetails", {
            duration: .3
        })
    },
    activateEmail: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "activate_email",
                email: $F("emailForAlert"),
                source: $F("senderSource")
            },
            onSuccess: function(e) {
                page.refreshEmailBlock(e.responseText)
            }
        })
    },
    refreshEmailBlock: function(e) {
        this.hideEmail(), $("emailState").innerHTML = e
    },
    disableEmail: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "disable_email"
            },
            onSuccess: function(e) {
                page.refreshEmailBlock(e.responseText)
            }
        })
    }
}, $("alertsPage") && QF.pages.alerts.init(), AIM = {
    frame: function(e) {
        var t = "f" + Math.floor(99999 * Math.random()),
            n = document.createElement("DIV");
        n.innerHTML = '<iframe style="display:none" src="about:blank" id="' + t + '" name="' + t + '" onload="AIM.loaded(\'' + t + "')\"></iframe>", document.body.appendChild(n);
        var i = document.getElementById(t);
        return e && "function" == typeof e.onComplete && (i.onComplete = e.onComplete), t
    },
    form: function(e, t) {
        e.setAttribute("target", t)
    },
    submit: function(e, t) {
        return AIM.form(e, AIM.frame(t)), t && "function" == typeof t.onStart ? t.onStart() : !0
    },
    loaded: function(e) {
        var t = document.getElementById(e);
        if (t.contentDocument) var n = t.contentDocument;
        else if (t.contentWindow) var n = t.contentWindow.document;
        else var n = window.frames[e].document;
        "about:blank" != n.location.href && "function" == typeof t.onComplete && t.onComplete(n.body.innerHTML)
    }
}, QF.pages.templates = {
    init: function() {
        LOG("PAGE:templates"), QF.common.basePage.init(this), this.fields = document.getElementsByClassName("field"), this.matrixCells = $("formBody").getElementsByTagName("td"), this.itemSubTitle = document.getElementsByClassName("itemSubTitle"), this.itemTitle = document.getElementsByClassName("itemTitle"), this.itemText = document.getElementsByClassName("itemText"), $("first_template") && this.preview($F("first_template"))
    },
    defaultTheme: function() {
        this.background = {
            backgroundColor: "#f5f5f5"
        }, this.header = {
            backgroundColor: "#F0F9FF",
            color: "#000000",
            fontFamily: "arial",
            fontSize: "24",
            logo: "",
            logoBackgroundColor: "#FFFFFF"
        }, this.body = {
            backgroundColor: "#FFFFFF",
            title: {
                color: "#DC5151",
                fontFamily: "arial",
                fontSize: "16",
                fontStyle: ""
            },
            subTitle: {
                color: "#666666",
                fontFamily: "arial",
                fontSize: "14",
                fontStyle: ""
            },
            item: {
                color: "#000000",
                fontFamily: "arial",
                fontSize: "12",
                fontStyle: ""
            },
            borderColor: "#dcdcdc",
            hoverColor: "#FFFFE0"
        }, this.actions = {
            backgroundColor: "#FFFFFF"
        }
    },
    uploadLogo: function() {
        this.uploadWindow = new QF.common.htmlLightbox("mediumLB", "", "upload_image"), this.uploadWindow.parameters = "id=" + this.id, this.uploadWindow.show()
    },
    uploadImage: function() {
        var e = $("image"),
            t = /\.jpg|\.gif|\.png/i,
            n = e.value;
        if (-1 == n.search(t)) return alert(lang.current("upload_image_error")), e.form.reset(), !1;
        var i = n.lastIndexOf("."),
            o = n.substr(i + 1, 3);
        return page.header.logo = page.id + "." + o, AIM.submit($("upload_image"), {
            onStart: page.startCallback,
            onComplete: page.completeCallback
        })
    },
    startCallback: function() {
        return !0
    },
    completeCallback: function() {
        return page.uploadWindow && page.uploadWindow.hide(), Element.show("remove-logo-button"), page.applylogo(!0), !0
    },
    save: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "save",
                id: this.id,
                background: JSON.stringify(this.background),
                header: JSON.stringify(this.header),
                body: JSON.stringify(this.body),
                actions: JSON.stringify(this.actions)
            },
            onSuccess: function(e) {
                page.saveResult(e.responseText)
            }
        }), Element.show("save_progress_img")
    },
    saveResult: function(e) {
        Element.hide("save_progress_img"), page.showTemplate(), page.preview(parseInt(e))
    },
    applylogo: function() {
        var e = $("form-logo");
        $("survey-logo") && e.removeChild($("survey-logo")), page.header.logo && (e.appendChild($img({
            id: "survey-logo",
            src: "/uploads/logos/" + page.header.logo + "?timestamp=" + Math.random()
        })), $("form-logo").style.backgroundColor = page.header.logoBackgroundColor)
    },
    removeLogo: function() {
        page.header.logo = "", page.applylogo(), Element.hide("remove-logo-button")
    },
    applyTheme: function() {
        this.applybackground(), this.applyheader(!0), this.applybody(), this.applyactions()
    },
    applybackground: function() {
        $("formBackground").style.backgroundColor = this.background.backgroundColor
    },
    applyheader: function(e) {
        $("formHeader").style.backgroundColor = this.header.backgroundColor, $("title").style.color = this.header.color, $("title").style.fontFamily = this.header.fontFamily, $("title").style.fontSize = this.header.fontSize + "px", $("form-logo") && ($("form-logo").style.backgroundColor = page.header.logoBackgroundColor), $("title").style.fontWeight = "", $("title").style.fontStyle = "", $("title").style.textDecoration = "", "Bold" == this.header.fontStyle && ($("title").style.fontWeight = this.header.fontStyle), "Italic" == this.header.fontStyle && ($("title").style.fontStyle = this.header.fontStyle), "Underline" == this.header.fontStyle && ($("title").style.textDecoration = this.header.fontStyle), e && page.applylogo()
    },
    applybody: function() {
        $("formBody").style.backgroundColor = this.body.backgroundColor;
        for (var e = 0; e < this.fields.length; e++) this.fields[e].style.borderBottom = "1px dashed " + this.body.borderColor;
        for (var e = 0; e < this.matrixCells.length; e++) this.matrixCells[e].style.border = "1px solid " + this.body.borderColor;
        for (var e = 0; e < this.itemTitle.length; e++) this.itemTitle[e].style.color = this.body.title.color, this.itemTitle[e].style.fontFamily = this.body.title.fontFamily, this.itemTitle[e].style.fontSize = this.body.title.fontSize + "px", this.itemTitle[e].style.fontWeight = "", this.itemTitle[e].style.fontStyle = "", this.itemTitle[e].style.textDecoration = "", "Bold" == this.body.title.fontStyle && (this.itemTitle[e].style.fontWeight = this.body.title.fontStyle), "Italic" == this.body.title.fontStyle && (this.itemTitle[e].style.fontStyle = this.body.title.fontStyle), "Underline" == this.body.title.fontStyle && (this.itemTitle[e].style.textDecoration = this.body.title.fontStyle);
        for (var e = 0; e < this.itemSubTitle.length; e++) this.itemSubTitle[e].style.color = this.body.subTitle.color, this.itemSubTitle[e].style.fontFamily = this.body.subTitle.fontFamily, this.itemSubTitle[e].style.fontSize = this.body.subTitle.fontSize + "px", this.itemSubTitle[e].style.fontWeight = "", this.itemSubTitle[e].style.fontStyle = "", this.itemSubTitle[e].style.textDecoration = "", "Bold" == this.body.subTitle.fontStyle && (this.itemSubTitle[e].style.fontWeight = this.body.title.fontStyle), "Italic" == this.body.subTitle.fontStyle && (this.itemSubTitle[e].style.fontStyle = this.body.subTitle.fontStyle), "Underline" == this.body.subTitle.fontStyle && (this.itemSubTitle[e].style.textDecoration = this.body.subTitle.fontStyle);
        for (var e = 0; e < this.itemText.length; e++) this.itemText[e].style.color = this.body.item.color, this.itemText[e].style.fontFamily = this.body.item.fontFamily, this.itemText[e].style.fontSize = this.body.item.fontSize + "px", this.itemText[e].style.fontWeight = "", this.itemText[e].style.fontStyle = "", this.itemText[e].style.textDecoration = "", "Bold" == this.body.item.fontStyle && (this.itemText[e].style.fontWeight = this.body.item.fontStyle), "Italic" == this.body.item.fontStyle && (this.itemText[e].style.fontStyle = this.body.item.fontStyle), "Underline" == this.body.item.fontStyle && (this.itemText[e].style.textDecoration = this.body.item.fontStyle)
    },
    applyactions: function() {
        $("actionArea").style.backgroundColor = this.actions.backgroundColor
    },
    load: function(e) {
        this.defaultTheme(), this.background = e.background || this.background, this.header = e.header || this.header, this.header.logoBackgroundColor = this.header.logoBackgroundColor || "#FFFFFF", this.body = e.body || this.body, this.body.hoverColor = this.body.hoverColor || "#FFFFE0", this.actions = e.actions || this.actions, this.applyTheme(), Element.show("formBackground"), Element.hide("loadingTheme")
    },
    del: function(e) {
        confirm(lang.current("delete_confirm")) && new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "delete",
                id: e
            },
            onSuccess: function(e) {
                $("templatesTable").innerHTML = e.responseText
            }
        })
    },
    preview: function(e) {
        Element.hide("formBackground"), Element.show("loadingTheme"), new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "load",
                id: e
            },
            onSuccess: function(e) {
                page.load(e.responseJSON)
            }
        }), this.id = e
    },
    loadAndEdit: function(e) {
        this.load(e), Element.hide("menu"), Element.show("editor")
    },
    createNew: function() {
        var e = $("newThemeDiv");
        e || ($("newTheme").innerHTML = "", e = $div({
            id: "newThemeDiv"
        }), $("newTheme").appendChild(e), e.appendChild($span(lang.current("theme_name"))), e.appendChild($input({
            type: "text",
            "class": "whiteinset",
            id: "newTemplateName"
        })), e.appendChild($input({
            type: "button",
            "class": "button green",
            value: "ok",
            onclick: "page.defaultTheme();page.fetchThemes()"
        })), e.appendChild($input({
            type: "button",
            "class": "button red",
            value: lang.current("cancel"),
            onclick: "page.fetchThemes()"
        }))), new Effect.Highlight($("newTheme"))
    },
    fetchThemes: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "create_new",
                name: $F("newTemplateName")
            },
            onSuccess: function(e) {
                $("templatesTable").innerHTML = e.responseText
            }
        })
    },
    showEditor: function(e) {
        Element.hide("preview-pane"), this.id != e ? (Element.hide("formBackground"), Element.show("loadingTheme"), this.id = e, new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "load",
                id: e
            },
            onSuccess: function(t) {
                page.preview(e), page.loadAndEdit(t.responseText)
            }
        })) : (Element.hide("menu"), Element.show("editor"))
    },
    showTemplate: function() {
        Element.hide("editor"), this.defaultTheme() || this.applyTheme(), Element.show("menu"), Element.show("preview-pane")
    },
    clickField: function() {
        $("css").innerHTML = "", Element.show("overlay2"), Element.addClassName($("formBody"), "overlayVisible"), Element.addClassName($("css"), "overlayVisible")
    },
    editHeader: function() {
        "none" != $("overlay2").style.display ? this.closeSelection() : (Element.show("headerDef"), Element.show("overlay2"), Element.addClassName($("editHeader"), "overlayVisible"), Element.addClassName($("formHeader"), "overlayVisible"), Element.addClassName($("form-logo"), "overlayVisible"), this.renderUploadImage($("headerDef"), lang.current("logo"), "logo"), this.renderColorPicker($("headerDef"), lang.current("logo"), "logo", "header.logoBackgroundColor"), this.renderColorPicker($("headerDef"), lang.current("background"), "bgcolor", "header.backgroundColor"), this.renderColorPicker($("headerDef"), lang.current("surveyTitle"), "title_block", "header.color"), this.renderFontPicker($("headerDef"), lang.current("surveyTitle"), "title_block", "header"), this.renderCloseButton($("headerDef")))
    },
    editActions: function() {
        "none" != $("overlay2").style.display ? this.closeSelection() : (Element.show("actionsDef"), Element.show("overlay2"), Element.addClassName($("editActions"), "overlayVisible"), Element.addClassName($("actionArea"), "overlayVisible"), this.renderColorPicker($("actionsDef"), lang.current("background"), "bgcolor", "actions.backgroundColor"), this.renderCloseButton($("actionsDef")))
    },
    editBody: function() {
        "none" != $("overlay2").style.display ? this.closeSelection() : (Element.show("bodyDef"), Element.show("overlay2"), Element.addClassName($("editBody"), "overlayVisible"), Element.addClassName($("formBody"), "overlayVisible"), this.renderColorPicker($("bodyDef"), lang.current("background"), "bgcolor", "body.backgroundColor"), this.renderColorPicker($("bodyDef"), lang.current("questionTitle"), "questiontitle", "body.title.color"), this.renderColorPicker($("bodyDef"), lang.current("questionSubTitle"), "questionsubtitle", "body.subTitle.color"), this.renderColorPicker($("bodyDef"), lang.current("fieldText"), "fieldtext", "body.item.color"), this.renderFontPicker($("bodyDef"), lang.current("questionTitle"), "questiontitle", "body.title"), this.renderFontPicker($("bodyDef"), lang.current("questionSubTitle"), "questionsubtitle", "body.subTitle"), this.renderFontPicker($("bodyDef"), lang.current("fieldText"), "fieldtext", "body.item"), this.renderColorPicker($("bodyDef"), lang.current("border"), "border", "body.borderColor"), this.renderColorPicker($("bodyDef"), lang.current("hover"), "hover", "body.hoverColor"), this.renderCloseButton($("bodyDef")))
    },
    editBackground: function() {
        "none" != $("overlay2").style.display ? this.closeSelection() : (Element.show("backgroundDef"), Element.show("overlay2"), Element.addClassName($("editBackground"), "overlayVisible"), Element.addClassName($("formBackground"), "overlayVisible"), this.renderColorPicker($("backgroundDef"), lang.current("background"), "background_bgcolor", "background.backgroundColor"), this.renderCloseButton($("backgroundDef")))
    },
    closeSelection: function() {
        Element.hide("overlay2"), $("headerDef").innerHTML = "", $("bodyDef").innerHTML = "", $("backgroundDef").innerHTML = "", $("actionsDef").innerHTML = "", Element.hide($("headerDef")), Element.hide($("bodyDef")), Element.hide($("backgroundDef")), Element.hide($("actionsDef")), Element.removeClassName($("formBody"), "overlayVisible"), Element.removeClassName($("formHeader"), "overlayVisible"), Element.removeClassName($("formBackground"), "overlayVisible"), Element.removeClassName($("actionArea"), "overlayVisible"), Element.removeClassName($("editHeader"), "overlayVisible"), Element.removeClassName($("editBody"), "overlayVisible"), Element.removeClassName($("editBackground"), "overlayVisible"), Element.removeClassName($("editActions"), "overlayVisible"), Element.removeClassName($("form-logo"), "overlayVisible"), Control.ColorPicker.activeColorPicker && Control.ColorPicker.activeColorPicker.close()
    },
    renderCloseButton: function(e) {
        e.appendChild($div({
            style: "padding:10px;text-align:left"
        }, $input({
            type: "button",
            "class": "button grey",
            value: lang.current("exit"),
            onclick: "page.closeSelection()"
        })))
    },
    renderUploadImage: function(e, t, n) {
        var i = this.renderGroupOptions(e, t, n);
        i.appendChild($img({
            src: "/images/bullet_disk.png"
        }));
        var o = $form({
            id: "upload_image",
            method: "post",
            action: "/upload_image.php",
            enctype: "multipart/form-data",
            onsubmit: "return page.uploadImage()",
            style: "display: inline"
        });
        if (o.appendChild($input({
                type: "hidden",
                id: "image_id",
                name: "id",
                value: page.id
            })), o.appendChild($input({
                type: "hidden",
                id: "type",
                name: "type",
                value: "logo"
            })), o.appendChild($input({
                type: "file",
                id: "image",
                name: "image",
                style: ""
            })), o.appendChild($input({
                type: "submit",
                "class": "button green",
                value: "Upload"
            })), i.appendChild(o), page.header.logo) var s = page.header.logo ? "display: inline" : "display: none";
        i.appendChild($input({
            style: s,
            id: "remove-logo-button",
            type: "button",
            "class": "button red",
            value: lang.current("remove"),
            onclick: "page.removeLogo()"
        }))
    },
    renderGroupOptions: function(e, t, n) {
        if ($(n)) var i = $(n);
        else {
            e.appendChild($div({
                "class": "option",
                style: "width:90%;margin:auto"
            }, t));
            var i = $div({
                id: n,
                "class": "optionBody",
                style: "width:90%;margin:auto;text-align:left"
            });
            e.appendChild(i)
        }
        var o = $div({
            "class": "optionItem"
        });
        return i.appendChild(o), o
    },
    renderColorPicker: function(parent, headerText, ctrlId, cssElement) {
        eval("var val=page." + cssElement + ";"), val = val.substring(1);
        var body = this.renderGroupOptions(parent, headerText, ctrlId);
        body.appendChild($img({
            src: "/images/color_swatch.png"
        })), body.appendChild($span(lang.current("color")));
        var colorp = $input({
            id: ctrlId + "color",
            type: "text",
            "class": "whiteinset",
            value: val
        });
        body.appendChild(colorp), new Control.ColorPicker(ctrlId + "color", {
            onUpdate: page.updateColor,
            element: cssElement
        })
    },
    updateColor: function(color, cssElement) {
        eval("page." + cssElement + '="#' + color + '";'), eval("page.apply" + cssElement.split(".")[0] + "();")
    },
    renderFontPicker: function(parent, headerText, ctrlId, cssBaseElement) {
        eval("var famVal=page." + cssBaseElement + ".fontFamily;"), eval("var sizeVal=page." + cssBaseElement + ".fontSize;"), eval("var styleVal=page." + cssBaseElement + ".fontStyle;");
        var body = this.renderGroupOptions(parent, headerText, ctrlId);
        body.appendChild($img({
            src: "/images/textfield.png"
        })), body.appendChild($span(lang.current("typo"))), body.appendChild($select({
            onchange: "page.updateFont(this)",
            name: cssBaseElement
        }, this.selectOption("arial", famVal), this.selectOption("tahoma", famVal), this.selectOption("verdana", famVal), this.selectOption("times", famVal), this.selectOption("courier", famVal), this.selectOption("georgia", famVal))), body.appendChild($select({
            onchange: "page.updateSize(this)",
            name: cssBaseElement
        }, this.selectOption("10", sizeVal), this.selectOption("12", sizeVal), this.selectOption("14", sizeVal), this.selectOption("16", sizeVal), this.selectOption("18", sizeVal), this.selectOption("20", sizeVal), this.selectOption("22", sizeVal), this.selectOption("24", sizeVal), this.selectOption("26", sizeVal))), body.appendChild($select({
            onchange: "page.updateStyle(this)",
            name: cssBaseElement
        }, this.selectOption("Bold", styleVal), this.selectOption("Italic", styleVal), this.selectOption("Underline", styleVal)))
    },
    selectOption: function(e, t) {
        return e == t ? $option({
            selected: "1"
        }, e) : $option(e)
    },
    updateFont: function(evt) {
        var cssBase = $(evt).name;
        eval("page." + cssBase + ".fontFamily=$F(evt);"), page.applyTheme()
    },
    updateSize: function(evt) {
        var cssBase = $(evt).name;
        eval("page." + cssBase + ".fontSize=$F(evt);"), page.applyTheme(-1)
    },
    updateStyle: function(evt) {
        var cssBase = $(evt).name,
            t = $F(evt);
        eval("page." + cssBase + ".fontStyle=$F(evt);"), page.applyTheme(-1)
    },
    setStar: function(e, t) {
        var n = 0;
        for ($(t) && ($(t).value = e + 1); $(t + "_i" + n.toString());) {
            var i = t + "_i" + n.toString();
            $(i).src = n > e ? "/images/starrat.gif" : "/images/starrat-set.gif", n++
        }
        for (var n = 0; e >= n; n++) {
            var i = t + "_i" + n.toString();
            $(i).src = "/images/starrat-set.gif"
        }
    },
    highlightStar: function(e, t) {
        for (var n = 0; e >= n; n++) {
            var i = t + "_i" + n.toString();
            $(i).src = "/images/starrat-selected.gif"
        }
    },
    deHighlightStar: function(e, t) {
        var n = 0;
        $(t) && (n = $(t).value), n--;
        for (var i = 0; $(t + "_i" + i.toString());) {
            var o = t + "_i" + i.toString();
            $(o).src = i > n ? "/images/starrat.gif" : "/images/starrat-set.gif", i++
        }
    }
}, $("templatesPage") && QF.pages.templates.init();
var YAHOO = function() {
    return {
        util: {}
    }
}();
if (YAHOO.util.Color = new function() {
        this.hsv2rgb = function(e, t, n) {
            var i, o, s;
            if (0 == t) i = 255 * n, o = 255 * n, s = 255 * n;
            else {
                var r = 6 * e;
                6 == r && (r = 0);
                var a = Math.floor(r),
                    l = n * (1 - t),
                    c = n * (1 - t * (r - a)),
                    d = n * (1 - t * (1 - (r - a)));
                0 == a ? (var_r = n, var_g = d, var_b = l) : 1 == a ? (var_r = c, var_g = n, var_b = l) : 2 == a ? (var_r = l, var_g = n, var_b = d) : 3 == a ? (var_r = l, var_g = c, var_b = n) : 4 == a ? (var_r = d, var_g = l, var_b = n) : (var_r = n, var_g = l, var_b = c), i = 255 * var_r, o = 255 * var_g, s = 255 * var_b
            }
            return [Math.round(i), Math.round(o), Math.round(s)]
        }, this.rgb2hsv = function(e, t, n) {
            var e = e / 255,
                t = t / 255,
                n = n / 255,
                i = Math.min(e, t, n),
                o = Math.max(e, t, n);
            deltaMax = o - i;
            var s, r, a, l, c, d = o;
            return 0 == deltaMax ? (r = 0, s = 0) : (s = deltaMax / o, a = ((o - e) / 6 + deltaMax / 2) / deltaMax, l = ((o - t) / 6 + deltaMax / 2) / deltaMax, c = ((o - n) / 6 + deltaMax / 2) / deltaMax, e == o ? r = c - l : t == o ? r = 1 / 3 + a - c : n == o && (r = 2 / 3 + l - a), 0 > r && (r += 1), r > 1 && (r -= 1)), s = s || 0, [r, s, d]
        }, this.rgb2hex = function(e, t, n) {
            return this.toHex(e) + this.toHex(t) + this.toHex(n)
        }, this.hexchars = "0123456789ABCDEF", this.toHex = function(e) {
            return e = e || 0, e = parseInt(e, 10), isNaN(e) && (e = 0), e = Math.round(Math.min(Math.max(0, e), 255)), this.hexchars.charAt((e - e % 16) / 16) + this.hexchars.charAt(e % 16)
        }, this.toDec = function(e) {
            return this.hexchars.indexOf(e.toUpperCase())
        }, this.hex2rgb = function(e) {
            var t = [];
            return t[0] = 16 * this.toDec(e.substr(0, 1)) + this.toDec(e.substr(1, 1)), t[1] = 16 * this.toDec(e.substr(2, 1)) + this.toDec(e.substr(3, 1)), t[2] = 16 * this.toDec(e.substr(4, 1)) + this.toDec(e.substr(5, 1)), t
        }, this.isValidRGB = function(e) {
            return !e[0] && 0 != e[0] || isNaN(e[0]) || e[0] < 0 || e[0] > 255 ? !1 : !e[1] && 0 != e[1] || isNaN(e[1]) || e[1] < 0 || e[1] > 255 ? !1 : !e[2] && 0 != e[2] || isNaN(e[2]) || e[2] < 0 || e[2] > 255 ? !1 : !0
        }
    }, !Control) var Control = {};
Control.colorPickers = [], Control.ColorPicker = Class.create(), Control.ColorPicker.activeColorPicker, Control.ColorPicker.CONTROL, Control.ColorPicker.prototype = {
    initialize: function(e, t) {
        var n = this;
        if (Control.colorPickers.push(n), this.field = $(e), this.fieldName = this.field.name || this.field.id, this.options = Object.extend({
                IMAGE_BASE: "/images/colorpicker/"
            }, t || {}), this.swatch = $(this.options.swatch) || this.field, this.rgb = {}, this.hsv = {}, this.isOpen = !1, !Control.ColorPicker.CONTROL) {
            if (Control.ColorPicker.CONTROL = {}, !$("colorpicker")) {
                var i = Builder.node("div", {
                    id: "colorpicker"
                });
                i.innerHTML = '<div id="colorpicker-div">' + (/MSIE ((6)|(5\.5))/gi.test(navigator.userAgent) && /windows/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) ? '<img id="colorpicker-bg" class="nopngfix" src="' + this.options.IMAGE_BASE + 'blank.gif" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + this.options.IMAGE_BASE + "pickerbg.png', sizingMethod='scale')\" alt=\"\">" : '<img id="colorpicker-bg" class="nopngfix" src="' + this.options.IMAGE_BASE + 'pickerbg.png" alt="">') + '<div id="colorpicker-bg-overlay" style="z-index: 1002;"></div><div id="colorpicker-selector"><img class="nopngfix" src="' + this.options.IMAGE_BASE + 'select.gif" width="11" height="11" alt="" /></div></div><div id="colorpicker-hue-container"><img class="nopngfix" src="' + this.options.IMAGE_BASE + 'hue.png" id="colorpicker-hue-bg-img"><div id="colorpicker-hue-slider"><div id="colorpicker-hue-thumb"><img class="nopngfix" src="' + this.options.IMAGE_BASE + 'hline.png"></div></div></div><div id="colorpicker-footer"><span id="colorpicker-value">#<input type="text" onclick="this.select()" id="colorpicker-value-input" name="colorpicker-value" value=""></input></span><button id="colorpicker-okbutton">OK</button></div>', document.body.appendChild(i)
            }
            Control.ColorPicker.CONTROL = {
                popUp: $("colorpicker"),
                pickerArea: $("colorpicker-div"),
                selector: $("colorpicker-selector"),
                okButton: $("colorpicker-okbutton"),
                value: $("colorpicker-value"),
                input: $("colorpicker-value-input"),
                picker: new Draggable($("colorpicker-selector"), {
                    snap: function(e, t) {
                        return [Math.min(Math.max(e, 0), Control.ColorPicker.activeColorPicker.control.pickerArea.offsetWidth), Math.min(Math.max(t, 0), Control.ColorPicker.activeColorPicker.control.pickerArea.offsetHeight)]
                    },
                    zindex: 1009,
                    change: function(e) {
                        var t = e.currentDelta();
                        Control.ColorPicker.activeColorPicker.update(t[0], t[1])
                    }
                }),
                hueSlider: new Control.Slider("colorpicker-hue-thumb", "colorpicker-hue-slider", {
                    axis: "vertical",
                    onChange: function(e) {
                        Control.ColorPicker.activeColorPicker.updateHue(e)
                    }
                })
            }, Element.hide($("colorpicker"))
        }
        this.control = Control.ColorPicker.CONTROL, this.toggleOnClickListener = this.toggle.bindAsEventListener(this), this.updateOnChangeListener = this.updateFromFieldValue.bindAsEventListener(this), this.closeOnClickOkListener = this.close.bindAsEventListener(this), this.updateOnClickPickerListener = this.updateSelector.bindAsEventListener(this), Event.observe(this.swatch, "click", this.toggleOnClickListener), Event.observe(this.field, "change", this.updateOnChangeListener), Event.observe(this.control.input, "change", this.updateOnChangeListener), this.updateSwatch()
    },
    toggle: function(e) {
        this[this.isOpen ? "close" : "open"](e), Event.stop(e)
    },
    open: function(e) {
        if (Control.colorPickers.each(function(e) {
                e.close()
            }), Control.ColorPicker.activeColorPicker = this, this.isOpen = !0, Element.show(this.control.popUp), this.options.getPopUpPosition) var t = this.options.getPopUpPosition.bind(this)(e);
        else {
            var t = Position.cumulativeOffset(this.swatch || this.field);
            t[0] = t[0] + (this.swatch || this.field).offsetWidth + 10
        }
        this.control.popUp.style.left = t[0] + "px", this.control.popUp.style.top = t[1] + "px", this.updateFromFieldValue(), Event.observe(this.control.okButton, "click", this.closeOnClickOkListener), Event.observe(this.control.pickerArea, "mousedown", this.updateOnClickPickerListener), this.options.onOpen && this.options.onOpen.bind(this)(e)
    },
    close: function() {
        Control.ColorPicker.activeColorPicker == this && (Control.ColorPicker.activeColorPicker = null), this.isOpen = !1, Element.hide(this.control.popUp), Event.stopObserving(this.control.okButton, "click", this.closeOnClickOkListener), Event.stopObserving(this.control.pickerArea, "mousedown", this.updateOnClickPickerListener), this.options.onClose && this.options.onClose.bind(this)()
    },
    updateHue: function(e) {
        var t = (this.control.pickerArea.offsetHeight - 100 * e) / this.control.pickerArea.offsetHeight;
        1 == t && (t = 0);
        var n = YAHOO.util.Color.hsv2rgb(t, 1, 1);
        YAHOO.util.Color.isValidRGB(n) && (this.control.pickerArea.style.backgroundColor = "rgb(" + n[0] + ", " + n[1] + ", " + n[2] + ")", this.update())
    },
    updateFromFieldValue: function(e) {
        if (this.isOpen) {
            var t = e && Event.findElement(e, "input") || this.field,
                n = YAHOO.util.Color.hex2rgb(t.value);
            if (YAHOO.util.Color.isValidRGB(n)) {
                var i = YAHOO.util.Color.rgb2hsv(n[0], n[1], n[2]);
                this.control.selector.style.left = Math.round(i[1] * this.control.pickerArea.offsetWidth) + "px", this.control.selector.style.top = Math.round((1 - i[2]) * this.control.pickerArea.offsetWidth) + "px", this.control.hueSlider.setValue(1 - i[0])
            }
        }
    },
    updateSelector: function(e) {
        var t = Event.pointerX(e),
            n = Event.pointerY(e),
            i = Position.cumulativeOffset($("colorpicker-bg"));
        this.control.selector.style.left = t - i[0] - 6 + "px", this.control.selector.style.top = n - i[1] - 6 + "px", this.update(t - i[0], n - i[1]), this.control.picker.initDrag(e)
    },
    updateSwatch: function() {
        var e = YAHOO.util.Color.hex2rgb(this.field.value);
        if (YAHOO.util.Color.isValidRGB(e)) {
            this.swatch.style.backgroundColor = "rgb(" + e[0] + ", " + e[1] + ", " + e[2] + ")";
            var t = YAHOO.util.Color.rgb2hsv(e[0], e[1], e[2]);
            this.swatch.style.color = t[2] > .65 ? "#000000" : "#FFFFFF"
        }
    },
    update: function(e, t) {
        e || (e = this.control.picker.currentDelta()[0]), t || (t = this.control.picker.currentDelta()[1]);
        var n = (this.control.pickerArea.offsetHeight - 100 * this.control.hueSlider.value) / this.control.pickerArea.offsetHeight;
        1 == n && (n = 0), this.hsv = {
            hue: 1 - this.control.hueSlider.value,
            saturation: e / this.control.pickerArea.offsetWidth,
            brightness: (this.control.pickerArea.offsetHeight - t) / this.control.pickerArea.offsetHeight
        };
        var i = YAHOO.util.Color.hsv2rgb(this.hsv.hue, this.hsv.saturation, this.hsv.brightness);
        this.rgb = {
            red: i[0],
            green: i[1],
            blue: i[2]
        }, this.field.value = YAHOO.util.Color.rgb2hex(i[0], i[1], i[2]), this.control.input.value = this.field.value, this.updateSwatch(), this.options.onUpdate && this.options.onUpdate.bind(this)(this.field.value, this.options.element)
    }
}, QF.pages.account = {
    init: function() {
        LOG("PAGE:account"), QF.common.basePage.init(this), Event.observe("edit_account", "click", this.editAccount.bind(this))
    },
    editAccount: function() {
        this.editWindow = new QF.common.htmlLightbox("largeLB", "", "user_data_form"), this.editWindow.onLoad = this.loadUserForm.bind(this), this.editWindow.show()
    },
    loadUserForm: function() {
        Event.observe("user_form", "submit", page.saveUser), $("timezone").value = $("user_timezone").value
    },
    saveUser: function(e) {
        return Event.stop(e), new Ajax.Request(document.location.href, {
            method: "post",
            parameters: $("user_form").serialize(),
            onSuccess: function(e) {
                page.saveResult(e.responseText)
            }
        }), !1
    },
    saveResult: function(e) {
        "1" == e ? (this.editWindow.hide(), new Ajax.Request(document.location.href, {
            method: "get",
            parameters: {
                account_info: 1
            },
            onSuccess: function(e) {
                $("accountInfo").replace(e.responseText)
            }
        })) : ($("lightboxMain").innerHTML = e, Event.observe("submit", "click", page.saveUser), $$(".closeLb").each(function(e) {
            Event.observe(e, "click", function() {
                page.editWindow.hide()
            })
        }))
    },
    showInvoice: function(e) {
        return this.invoiceWindow = new QF.common.htmlLightbox("largeLB", "", "invoice"), this.invoiceWindow.parameters = "id=" + e, this.invoiceWindow.fadeEffect = !1, this.invoiceWindow.show(), !1
    },
    showProforma: function() {
        this.proformaWindow = new QF.common.htmlLightbox("largeLB", "", "proforma_invoice"), this.proformaWindow.fadeEffect = !1, this.proformaWindow.show()
    },
    selectCurrency: function() {
        var e = $("currency").value;
        $$(".eur,.usd").each(function(e) {
            e.hide()
        }), $$("." + e).each(function(e) {
            e.show()
        })
    }
}, $("accountPage") && QF.pages.account.init(), QF.pages.fullreport = {
    init: function() {
        LOG("PAGE: fullreport or fieldstats"), QF.common.basePage.init(this), $$(".map-select-field").each(function(e) {
            var t = Element.readAttribute(e, "data-id");
            page.startupMap(t, e)
        }), google.charts.load("current", {
            packages: ["corechart"]
        }), google.charts.setOnLoadCallback(page.initCharts)
    },
    initCharts: function() {
        for (var e = document.querySelectorAll(".pie-chart"), t = 0; t < e.length; t++) {
            var n = e[t],
                i = n.getAttribute("data-values");
            i = i.split(",");
            var o = google.visualization.arrayToDataTable([
                    ["Level", "Pct"],
                    ["Always", parseInt(i[0])],
                    ["Often", parseInt(i[1])],
                    ["Sometimes", parseInt(i[2])],
                    ["Rarely", parseInt(i[3])],
                    ["N/A", parseInt(i[4])]
                ]),
                s = {
                    chartArea: {
                        height: "250"
                    },
                    colors: ["#005581", "#4C5650", "#E20177", "#D4D00F", "#887665"],
                    legend: {
                        position: "none"
                    },
                    height: "200"
                },
                r = new google.visualization.PieChart(n);
            r.draw(o, s)
        }
    },
    startupMap: function(e, t) {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "get_map_stats",
                field_id: e
            },
            onSuccess: function(e) {
                page.initMap(e.responseJSON, t)
            }
        })
    },
    initMap: function(e, t) {
        var n = t;
        n.style.height = "300px";
        var t = new GMap2(n);
        t.setCenter(new GLatLng(e.lat, e.lng), e.zoom), t.setMapType(this.setMapType(e.mode)), e.markers.each(function(e) {
            t.addOverlay(new GMarker(new GLatLng(e[0], e[1])))
        })
    },
    setMapType: function(e) {
        switch (e) {
            case "Map":
                return G_NORMAL_MAP;
            case "Satellite":
                return G_SATELLITE_MAP;
            case "Hybrid":
                return G_HYBRID_MAP;
            default:
                return G_NORMAL_MAP
        }
    }
}, ($("fullReportPage") || $("fieldStatsPage")) && QF.pages.fullreport.init(), QF.pages.members = {
    init: function() {
        LOG("PAGE:members"), QF.common.basePage.init(this), $("account-list") && (Event.observe("account-list", "change", page.selectAccount), this.selectAccount()), Event.observe("create_account", "click", page.createAccount), page.account = !1, this.selectAccount()
    },
    createAccount: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "create_account",
                account: $("new_account_name").value
            },
            onSuccess: function(e) {
                page.accountCreationResult(e.responseText)
            }
        })
    },
    accountCreationResult: function(e) {
        "1" != e ? $("creation_error").innerHTML = e : ($("creation_error").innerHTML = "", new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "accounts_list"
            },
            onSuccess: function(e) {
                page.refreshAccounts(e.responseText)
            }
        }))
    },
    refreshAccounts: function(e) {
        $("accounts_list").innerHTML = e, Form.Element.clear($("new_account_name")), Event.observe("account-list", "change", page.selectAccount)
    },
    selectAccount: function() {
        var e = $("account-list");
        e && (new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "members_list",
                account_id: e.options[e.selectedIndex].value
            },
            onSuccess: function(e) {
                page.refreshMembers(e.responseText)
            }
        }), page.account = e.options[e.selectedIndex].value)
    },
    refreshMembers: function(e) {
        $("members-list").innerHTML = e
    },
    addMember: function() {
        var e = $("account-list");
        page.account = e.options[e.selectedIndex].value;
        var t = $F("new_email"),
            n = $F("new_name"),
            i = $F("new_password");
        "<Email>" != t && "<Name>" != n && "<Password>" != i && new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "add_member",
                account_id: page.account,
                name: n,
                email: t,
                password: i
            },
            onSuccess: function(e) {
                page.refreshMembers(e.responseText)
            }
        })
    },
    clearField: function(e) {
        return "Name" == e.value || "Email" == e.value || "Password" == e.value ? (e.value = "", void(e.style.color = "#000000")) : "Nome" == e.value || "Email" == e.value || "Password/Senha" == e.value ? (e.value = "", void(e.style.color = "#000000")) : void 0
    },
    setField: function(e) {
        "" == e.value && "new_name" == e.id && (e.value = "Nome", e.style.color = "#999"), "" == e.value && "new_email" == e.id && (e.value = "Email", e.style.color = "#999"), "" == e.value && "new_password" == e.id && (e.value = "Password/Senha", e.style.color = "#999")
    },
    deleteMember: function(e) {
        confirm("Are you sure?") && new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "delete_member",
                account_id: page.account,
                email: e
            },
            onSuccess: function(e) {
                page.refreshMembers(e.responseText)
            }
        })
    }
}, $("membersPage") && QF.pages.members.init(), QF.pages.reswidget = {
    init: function() {
        QF.common.basePage.init(this), $("map") && this.startupMap(QF.common.utils.surveyNameFromUri(!0)), page.buttonVisibility(0), page.resize()
    },
    buttonVisibility: function(e) {
        0 >= e ? $("prev-button").hide() : $("prev-button").show();
        var t = e + 1;
        $("q-" + t) ? $("next-button").show() : $("next-button").hide()
    },
    nextQuestion: function() {
        $$(".current").each(function(e) {
            var t = e.id.substring(2),
                t = parseInt(t) + 1;
            $("q-" + t) && (e.removeClassName("current"), e.hide(), $("q-" + t).show().addClassName("current"), page.buttonVisibility(t), page.resize())
        })
    },
    prevQuestion: function() {
        $$(".current").each(function(e) {
            var t = e.id.substring(2),
                t = parseInt(t) - 1;
            $("q-" + t) && (e.removeClassName("current"), e.hide(), $("q-" + t).show().addClassName("current"), page.buttonVisibility(t), page.resize())
        })
    },
    resize: function() {
        try {
            parent && parent.resizeIframe && setTimeout(function() {
                window.parent.resizeIframe()
            }, 10)
        } catch (e) {
            e = !1
        }
    },
    startupMap: function(e) {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "get_map_stats",
                field_id: e
            },
            onSuccess: function(e) {
                page.initMap(e.responseJSON)
            }
        })
    },
    initMap: function(e) {
        if (GBrowserIsCompatible()) {
            var t = $("map");
            t.style.height = "300px";
            var n = new GMap2(t);
            n.setCenter(new GLatLng(e.lat, e.lng), e.zoom), n.setMapType(this.setMapType(e.mode)), e.markers.each(function(e) {
                n.addOverlay(new GMarker(new GLatLng(e[0], e[1])))
            })
        }
    },
    setMapType: function(e) {
        switch (e) {
            case "Map":
                return G_NORMAL_MAP;
            case "Satellite":
                return G_SATELLITE_MAP;
            case "Hybrid":
                return G_HYBRID_MAP;
            default:
                return G_NORMAL_MAP
        }
    }
}, $("widgetPage") && QF.pages.reswidget.init(), QF.pages.help = {
    init: function() {
        LOG("PAGE:help"), QF.common.basePage.init(this), Event.observe($("send-request-email"), "click", this.send_request), Event.observe($("request-subject"), "focus", this.clear_default), Event.observe($("request-subject"), "blur", this.put_default), Event.observe($("request-body"), "focus", this.clear_default), Event.observe($("request-body"), "blur", this.put_default)
    },
    send_request: function() {
        new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "send_request",
                subject: $F("request-subject"),
                body: $F("request-body")
            },
            onSuccess: function(e) {
                $("send-request-action").innerHTML = e.responseText
            }
        })
    },
    clear_default: function() {
        this.value == this.title && (this.value = "")
    },
    put_default: function() {
        "" == this.value && (this.value = this.title)
    }
}, $("helpPage") && QF.pages.help.init(), QF.pages.upgrade = {
    init: function() {
        LOG("PAGE:upgrade"), QF.common.basePage.init(this), $("euroCountrySelect") && Event.observe("euroCountrySelect", "change", this.euroData.bind(this)), $("sel-monthly").checked ? page.selectMonthly() : page.selectYearly()
    },
    euroData: function() {
        var e = $("euroCountrySelect").value;
        e && "Outside European Union" != e && "Pa\xeds fora da Uni\xe3o Europeia" != e ? Element.show("euro_info") : Element.hide("euro_info")
    },
    selectMonthly: function() {
        $$(".yearly").each(function(e) {
            e.hide()
        }), $$(".monthly").each(function(e) {
            e.show()
        })
    },
    selectYearly: function() {
        $$(".monthly").each(function(e) {
            e.hide()
        }), $$(".yearly").each(function(e) {
            e.show()
        })
    },
    trackPaypalClick: function(e, t) {
        return ga("send", "event", {
            eventCategory: "Subscription",
            eventAction: "Paypal",
            eventLabel: t,
            hitCallback: function() {
                e.submit()
            }
        }), !1
    },
    trackCreditCardClick: function(e, t) {
        return ga("send", "event", {
            eventCategory: "Subscription",
            eventAction: "FastSpring",
            eventLabel: t,
            hitCallback: function() {
                e.submit()
            }
        }), !1
    },
    selectCurrency: function() {
        var e = $("currency").value;
        $$(".eur,.usd").each(function(e) {
            e.hide()
        }), $$("." + e).each(function(e) {
            e.show()
        })
    },
    saveVat: function() {
        var e = $("vat-number").value;
        e && new Ajax.Request(document.location.href, {
            method: "post",
            parameters: {
                callback: "saveVAT",
                vat: e
            },
            onSuccess: function(e) {
                $("save-vat-ok").src = "NOK" == e.responseText ? "/images/cross.png" : "/images/tick.png", $("save-vat-ok").setStyle({
                    visibility: "visible"
                }), "NOK" == e.responseText && setTimeout(function() {
                    $("save-vat-ok").setStyle({
                        visibility: "hidden"
                    })
                }, 1e3)
            }
        })
    }
}, $("upgradePage") && QF.pages.upgrade.init();