var sd = Object.defineProperty;
var od = (n,t,e)=>t in n ? sd(n, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: e
}) : n[t] = e;
var Nr = (n,t,e)=>(od(n, typeof t != "symbol" ? t + "" : t, e),
e);
(function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload"))
        return;
    for (const i of document.querySelectorAll('link[rel="modulepreload"]'))
        r(i);
    new MutationObserver(i=>{
        for (const s of i)
            if (s.type === "childList")
                for (const o of s.addedNodes)
                    o.tagName === "LINK" && o.rel === "modulepreload" && r(o)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function e(i) {
        const s = {};
        return i.integrity && (s.integrity = i.integrity),
        i.referrerPolicy && (s.referrerPolicy = i.referrerPolicy),
        i.crossOrigin === "use-credentials" ? s.credentials = "include" : i.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin",
        s
    }
    function r(i) {
        if (i.ep)
            return;
        i.ep = !0;
        const s = e(i);
        fetch(i.href, s)
    }
}
)();
function So(n, t, e) {
    return Math.max(n, Math.min(t, e))
}
class ad {
    advance(t) {
        var a;
        if (!this.isRunning)
            return;
        let e = !1;
        if (this.lerp)
            this.value = (r = this.value,
            i = this.to,
            s = 60 * this.lerp,
            o = t,
            function(u, l, c) {
                return (1 - c) * u + c * l
            }(r, i, 1 - Math.exp(-s * o))),
            Math.round(this.value) === this.to && (this.value = this.to,
            e = !0);
        else {
            this.currentTime += t;
            const u = So(0, this.currentTime / this.duration, 1);
            e = u >= 1;
            const l = e ? 1 : this.easing(u);
            this.value = this.from + (this.to - this.from) * l
        }
        var r, i, s, o;
        (a = this.onUpdate) == null || a.call(this, this.value, e),
        e && this.stop()
    }
    stop() {
        this.isRunning = !1
    }
    fromTo(t, e, {lerp: r=.1, duration: i=1, easing: s=u=>u, onStart: o, onUpdate: a}) {
        this.from = this.value = t,
        this.to = e,
        this.lerp = r,
        this.duration = i,
        this.easing = s,
        this.currentTime = 0,
        this.isRunning = !0,
        o == null || o(),
        this.onUpdate = a
    }
}
class ud {
    constructor({wrapper: t, content: e, autoResize: r=!0}={}) {
        Nr(this, "resize", ()=>{
            this.onWrapperResize(),
            this.onContentResize()
        }
        );
        Nr(this, "onWrapperResize", ()=>{
            this.wrapper === window ? (this.width = window.innerWidth,
            this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth,
            this.height = this.wrapper.clientHeight)
        }
        );
        Nr(this, "onContentResize", ()=>{
            this.scrollHeight = this.content.scrollHeight,
            this.scrollWidth = this.content.scrollWidth
        }
        );
        if (this.wrapper = t,
        this.content = e,
        r) {
            const i = function(s, o) {
                let a;
                return function() {
                    let u = arguments
                      , l = this;
                    clearTimeout(a),
                    a = setTimeout(function() {
                        s.apply(l, u)
                    }, o)
                }
            }(this.resize, 250);
            this.wrapper !== window && (this.wrapperResizeObserver = new ResizeObserver(i),
            this.wrapperResizeObserver.observe(this.wrapper)),
            this.contentResizeObserver = new ResizeObserver(i),
            this.contentResizeObserver.observe(this.content)
        }
        this.resize()
    }
    destroy() {
        var t, e;
        (t = this.wrapperResizeObserver) == null || t.disconnect(),
        (e = this.contentResizeObserver) == null || e.disconnect()
    }
    get limit() {
        return {
            x: this.scrollWidth - this.width,
            y: this.scrollHeight - this.height
        }
    }
}
class kc {
    constructor() {
        this.events = {}
    }
    emit(t, ...e) {
        let r = this.events[t] || [];
        for (let i = 0, s = r.length; i < s; i++)
            r[i](...e)
    }
    on(t, e) {
        var r;
        return (r = this.events[t]) != null && r.push(e) || (this.events[t] = [e]),
        ()=>{
            var i;
            this.events[t] = (i = this.events[t]) == null ? void 0 : i.filter(s=>e !== s)
        }
    }
    off(t, e) {
        var r;
        this.events[t] = (r = this.events[t]) == null ? void 0 : r.filter(i=>e !== i)
    }
    destroy() {
        this.events = {}
    }
}
class ld {
    constructor(t, {wheelMultiplier: e=1, touchMultiplier: r=2, normalizeWheel: i=!1}) {
        Nr(this, "onTouchStart", t=>{
            const {clientX: e, clientY: r} = t.targetTouches ? t.targetTouches[0] : t;
            this.touchStart.x = e,
            this.touchStart.y = r,
            this.lastDelta = {
                x: 0,
                y: 0
            },
            this.emitter.emit("scroll", {
                deltaX: 0,
                deltaY: 0,
                event: t
            })
        }
        );
        Nr(this, "onTouchMove", t=>{
            const {clientX: e, clientY: r} = t.targetTouches ? t.targetTouches[0] : t
              , i = -(e - this.touchStart.x) * this.touchMultiplier
              , s = -(r - this.touchStart.y) * this.touchMultiplier;
            this.touchStart.x = e,
            this.touchStart.y = r,
            this.lastDelta = {
                x: i,
                y: s
            },
            this.emitter.emit("scroll", {
                deltaX: i,
                deltaY: s,
                event: t
            })
        }
        );
        Nr(this, "onTouchEnd", t=>{
            this.emitter.emit("scroll", {
                deltaX: this.lastDelta.x,
                deltaY: this.lastDelta.y,
                event: t
            })
        }
        );
        Nr(this, "onWheel", t=>{
            let {deltaX: e, deltaY: r} = t;
            this.normalizeWheel && (e = So(-100, e, 100),
            r = So(-100, r, 100)),
            e *= this.wheelMultiplier,
            r *= this.wheelMultiplier,
            this.emitter.emit("scroll", {
                deltaX: e,
                deltaY: r,
                event: t
            })
        }
        );
        this.element = t,
        this.wheelMultiplier = e,
        this.touchMultiplier = r,
        this.normalizeWheel = i,
        this.touchStart = {
            x: null,
            y: null
        },
        this.emitter = new kc,
        this.element.addEventListener("wheel", this.onWheel, {
            passive: !1
        }),
        this.element.addEventListener("touchstart", this.onTouchStart, {
            passive: !1
        }),
        this.element.addEventListener("touchmove", this.onTouchMove, {
            passive: !1
        }),
        this.element.addEventListener("touchend", this.onTouchEnd, {
            passive: !1
        })
    }
    on(t, e) {
        return this.emitter.on(t, e)
    }
    destroy() {
        this.emitter.destroy(),
        this.element.removeEventListener("wheel", this.onWheel, {
            passive: !1
        }),
        this.element.removeEventListener("touchstart", this.onTouchStart, {
            passive: !1
        }),
        this.element.removeEventListener("touchmove", this.onTouchMove, {
            passive: !1
        }),
        this.element.removeEventListener("touchend", this.onTouchEnd, {
            passive: !1
        })
    }
}
class cd {
    constructor({wrapper: t=window, content: e=document.documentElement, wheelEventsTarget: r=t, eventsTarget: i=r, smoothWheel: s=!0, smoothTouch: o=!1, syncTouch: a=!1, syncTouchLerp: u=.075, touchInertiaMultiplier: l=35, duration: c, easing: p=A=>Math.min(1, 1.001 - Math.pow(2, -10 * A)), lerp: h=!c && .1, infinite: f=!1, orientation: _="vertical", gestureOrientation: d="vertical", touchMultiplier: b=1, wheelMultiplier: T=1, normalizeWheel: w=!1, autoResize: C=!0}={}) {
        Nr(this, "onVirtualScroll", ({deltaX: t, deltaY: e, event: r})=>{
            if (r.ctrlKey)
                return;
            const i = r.type.includes("touch")
              , s = r.type.includes("wheel");
            if ((this.options.smoothTouch || this.options.syncTouch) && i && r.type === "touchstart")
                return void this.reset();
            const o = t === 0 && e === 0
              , a = this.options.gestureOrientation === "vertical" && e === 0 || this.options.gestureOrientation === "horizontal" && t === 0;
            if (o || a)
                return;
            let u = r.composedPath();
            if (u = u.slice(0, u.indexOf(this.rootElement)),
            u.find(h=>{
                var f, _, d, b;
                return ((f = h.hasAttribute) == null ? void 0 : f.call(h, "data-lenis-prevent")) || i && ((_ = h.hasAttribute) == null ? void 0 : _.call(h, "data-lenis-prevent-touch")) || s && ((d = h.hasAttribute) == null ? void 0 : d.call(h, "data-lenis-prevent-wheel")) || ((b = h.classList) == null ? void 0 : b.contains("lenis"))
            }
            ))
                return;
            if (this.isStopped || this.isLocked)
                return void r.preventDefault();
            if (this.isSmooth = (this.options.smoothTouch || this.options.syncTouch) && i || this.options.smoothWheel && s,
            !this.isSmooth)
                return this.isScrolling = !1,
                void this.animate.stop();
            r.preventDefault();
            let l = e;
            this.options.gestureOrientation === "both" ? l = Math.abs(e) > Math.abs(t) ? e : t : this.options.gestureOrientation === "horizontal" && (l = t);
            const c = i && this.options.syncTouch
              , p = i && r.type === "touchend" && Math.abs(l) > 5;
            p && (l = this.velocity * this.options.touchInertiaMultiplier),
            this.scrollTo(this.targetScroll + l, {
                programmatic: !1,
                ...c ? {
                    lerp: p ? this.options.syncTouchLerp : 1
                } : {
                    lerp: this.options.lerp,
                    duration: this.options.duration,
                    easing: this.options.easing
                }
            })
        }
        );
        Nr(this, "onNativeScroll", ()=>{
            if (!this.__preventNextScrollEvent && !this.isScrolling) {
                const t = this.animatedScroll;
                this.animatedScroll = this.targetScroll = this.actualScroll,
                this.velocity = 0,
                this.direction = Math.sign(this.animatedScroll - t),
                this.emit()
            }
        }
        );
        window.lenisVersion = "1.0.33",
        t !== document.documentElement && t !== document.body || (t = window),
        this.options = {
            wrapper: t,
            content: e,
            wheelEventsTarget: r,
            eventsTarget: i,
            smoothWheel: s,
            smoothTouch: o,
            syncTouch: a,
            syncTouchLerp: u,
            touchInertiaMultiplier: l,
            duration: c,
            easing: p,
            lerp: h,
            infinite: f,
            gestureOrientation: d,
            orientation: _,
            touchMultiplier: b,
            wheelMultiplier: T,
            normalizeWheel: w,
            autoResize: C
        },
        this.animate = new ad,
        this.emitter = new kc,
        this.dimensions = new ud({
            wrapper: t,
            content: e,
            autoResize: C
        }),
        this.toggleClass("lenis", !0),
        this.velocity = 0,
        this.isLocked = !1,
        this.isStopped = !1,
        this.isSmooth = a || s || o,
        this.isScrolling = !1,
        this.targetScroll = this.animatedScroll = this.actualScroll,
        this.options.wrapper.addEventListener("scroll", this.onNativeScroll, {
            passive: !1
        }),
        this.virtualScroll = new ld(i,{
            touchMultiplier: b,
            wheelMultiplier: T,
            normalizeWheel: w
        }),
        this.virtualScroll.on("scroll", this.onVirtualScroll)
    }
    destroy() {
        this.emitter.destroy(),
        this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, {
            passive: !1
        }),
        this.virtualScroll.destroy(),
        this.dimensions.destroy(),
        this.toggleClass("lenis", !1),
        this.toggleClass("lenis-smooth", !1),
        this.toggleClass("lenis-scrolling", !1),
        this.toggleClass("lenis-stopped", !1),
        this.toggleClass("lenis-locked", !1)
    }
    on(t, e) {
        return this.emitter.on(t, e)
    }
    off(t, e) {
        return this.emitter.off(t, e)
    }
    setScroll(t) {
        this.isHorizontal ? this.rootElement.scrollLeft = t : this.rootElement.scrollTop = t
    }
    resize() {
        this.dimensions.resize()
    }
    emit() {
        this.emitter.emit("scroll", this)
    }
    reset() {
        this.isLocked = !1,
        this.isScrolling = !1,
        this.animatedScroll = this.targetScroll = this.actualScroll,
        this.velocity = 0,
        this.animate.stop()
    }
    start() {
        this.isStopped = !1,
        this.reset()
    }
    stop() {
        this.isStopped = !0,
        this.animate.stop(),
        this.reset()
    }
    raf(t) {
        const e = t - (this.time || t);
        this.time = t,
        this.animate.advance(.001 * e)
    }
    scrollTo(t, {offset: e=0, immediate: r=!1, lock: i=!1, duration: s=this.options.duration, easing: o=this.options.easing, lerp: a=!s && this.options.lerp, onComplete: u=null, force: l=!1, programmatic: c=!0}={}) {
        if (!this.isStopped && !this.isLocked || l) {
            if (["top", "left", "start"].includes(t))
                t = 0;
            else if (["bottom", "right", "end"].includes(t))
                t = this.limit;
            else {
                let p;
                if (typeof t == "string" ? p = document.querySelector(t) : t != null && t.nodeType && (p = t),
                p) {
                    if (this.options.wrapper !== window) {
                        const f = this.options.wrapper.getBoundingClientRect();
                        e -= this.isHorizontal ? f.left : f.top
                    }
                    const h = p.getBoundingClientRect();
                    t = (this.isHorizontal ? h.left : h.top) + this.animatedScroll
                }
            }
            if (typeof t == "number") {
                if (t += e,
                t = Math.round(t),
                this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : t = So(0, t, this.limit),
                r)
                    return this.animatedScroll = this.targetScroll = t,
                    this.setScroll(this.scroll),
                    this.reset(),
                    void (u == null ? void 0 : u(this));
                if (!c) {
                    if (t === this.targetScroll)
                        return;
                    this.targetScroll = t
                }
                this.animate.fromTo(this.animatedScroll, t, {
                    duration: s,
                    easing: o,
                    lerp: a,
                    onStart: ()=>{
                        i && (this.isLocked = !0),
                        this.isScrolling = !0
                    }
                    ,
                    onUpdate: (p,h)=>{
                        this.isScrolling = !0,
                        this.velocity = p - this.animatedScroll,
                        this.direction = Math.sign(this.velocity),
                        this.animatedScroll = p,
                        this.setScroll(this.scroll),
                        c && (this.targetScroll = p),
                        h || this.emit(),
                        h && (this.reset(),
                        this.emit(),
                        u == null || u(this),
                        this.__preventNextScrollEvent = !0,
                        requestAnimationFrame(()=>{
                            delete this.__preventNextScrollEvent
                        }
                        ))
                    }
                })
            }
        }
    }
    get rootElement() {
        return this.options.wrapper === window ? document.documentElement : this.options.wrapper
    }
    get limit() {
        return this.dimensions.limit[this.isHorizontal ? "x" : "y"]
    }
    get isHorizontal() {
        return this.options.orientation === "horizontal"
    }
    get actualScroll() {
        return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop
    }
    get scroll() {
        return this.options.infinite ? (t = this.animatedScroll,
        e = this.limit,
        (t % e + e) % e) : this.animatedScroll;
        var t, e
    }
    get progress() {
        return this.limit === 0 ? 1 : this.scroll / this.limit
    }
    get isSmooth() {
        return this.__isSmooth
    }
    set isSmooth(t) {
        this.__isSmooth !== t && (this.__isSmooth = t,
        this.toggleClass("lenis-smooth", t))
    }
    get isScrolling() {
        return this.__isScrolling
    }
    set isScrolling(t) {
        this.__isScrolling !== t && (this.__isScrolling = t,
        this.toggleClass("lenis-scrolling", t))
    }
    get isStopped() {
        return this.__isStopped
    }
    set isStopped(t) {
        this.__isStopped !== t && (this.__isStopped = t,
        this.toggleClass("lenis-stopped", t))
    }
    get isLocked() {
        return this.__isLocked
    }
    set isLocked(t) {
        this.__isLocked !== t && (this.__isLocked = t,
        this.toggleClass("lenis-locked", t))
    }
    get className() {
        let t = "lenis";
        return this.isStopped && (t += " lenis-stopped"),
        this.isLocked && (t += " lenis-locked"),
        this.isScrolling && (t += " lenis-scrolling"),
        this.isSmooth && (t += " lenis-smooth"),
        t
    }
    toggleClass(t, e) {
        this.rootElement.classList.toggle(t, e),
        this.emitter.emit("className change", this)
    }
}
var gu = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Lc(n) {
    return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n
}
var Dc = {
    exports: {}
}, fa = {
    exports: {}
}, dl;
function fd() {
    return dl || (dl = 1,
    function(n) {
        (function(t, e) {
            n.exports ? n.exports = e() : t.EvEmitter = e()
        }
        )(typeof window < "u" ? window : gu, function() {
            function t() {}
            let e = t.prototype;
            return e.on = function(r, i) {
                if (!r || !i)
                    return this;
                let s = this._events = this._events || {}
                  , o = s[r] = s[r] || [];
                return o.includes(i) || o.push(i),
                this
            }
            ,
            e.once = function(r, i) {
                if (!r || !i)
                    return this;
                this.on(r, i);
                let s = this._onceEvents = this._onceEvents || {}
                  , o = s[r] = s[r] || {};
                return o[i] = !0,
                this
            }
            ,
            e.off = function(r, i) {
                let s = this._events && this._events[r];
                if (!s || !s.length)
                    return this;
                let o = s.indexOf(i);
                return o != -1 && s.splice(o, 1),
                this
            }
            ,
            e.emitEvent = function(r, i) {
                let s = this._events && this._events[r];
                if (!s || !s.length)
                    return this;
                s = s.slice(0),
                i = i || [];
                let o = this._onceEvents && this._onceEvents[r];
                for (let a of s)
                    o && o[a] && (this.off(r, a),
                    delete o[a]),
                    a.apply(this, i);
                return this
            }
            ,
            e.allOff = function() {
                return delete this._events,
                delete this._onceEvents,
                this
            }
            ,
            t
        })
    }(fa)),
    fa.exports
}
/*!
 * imagesLoaded v5.0.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
(function(n) {
    (function(t, e) {
        n.exports ? n.exports = e(t, fd()) : t.imagesLoaded = e(t, t.EvEmitter)
    }
    )(typeof window < "u" ? window : gu, function(e, r) {
        let i = e.jQuery
          , s = e.console;
        function o(h) {
            return Array.isArray(h) ? h : typeof h == "object" && typeof h.length == "number" ? [...h] : [h]
        }
        function a(h, f, _) {
            if (!(this instanceof a))
                return new a(h,f,_);
            let d = h;
            if (typeof h == "string" && (d = document.querySelectorAll(h)),
            !d) {
                s.error(`Bad element for imagesLoaded ${d || h}`);
                return
            }
            this.elements = o(d),
            this.options = {},
            typeof f == "function" ? _ = f : Object.assign(this.options, f),
            _ && this.on("always", _),
            this.getImages(),
            i && (this.jqDeferred = new i.Deferred),
            setTimeout(this.check.bind(this))
        }
        a.prototype = Object.create(r.prototype),
        a.prototype.getImages = function() {
            this.images = [],
            this.elements.forEach(this.addElementImages, this)
        }
        ;
        const u = [1, 9, 11];
        a.prototype.addElementImages = function(h) {
            h.nodeName === "IMG" && this.addImage(h),
            this.options.background === !0 && this.addElementBackgroundImages(h);
            let {nodeType: f} = h;
            if (!f || !u.includes(f))
                return;
            let _ = h.querySelectorAll("img");
            for (let d of _)
                this.addImage(d);
            if (typeof this.options.background == "string") {
                let d = h.querySelectorAll(this.options.background);
                for (let b of d)
                    this.addElementBackgroundImages(b)
            }
        }
        ;
        const l = /url\((['"])?(.*?)\1\)/gi;
        a.prototype.addElementBackgroundImages = function(h) {
            let f = getComputedStyle(h);
            if (!f)
                return;
            let _ = l.exec(f.backgroundImage);
            for (; _ !== null; ) {
                let d = _ && _[2];
                d && this.addBackground(d, h),
                _ = l.exec(f.backgroundImage)
            }
        }
        ,
        a.prototype.addImage = function(h) {
            let f = new c(h);
            this.images.push(f)
        }
        ,
        a.prototype.addBackground = function(h, f) {
            let _ = new p(h,f);
            this.images.push(_)
        }
        ,
        a.prototype.check = function() {
            if (this.progressedCount = 0,
            this.hasAnyBroken = !1,
            !this.images.length) {
                this.complete();
                return
            }
            let h = (f,_,d)=>{
                setTimeout(()=>{
                    this.progress(f, _, d)
                }
                )
            }
            ;
            this.images.forEach(function(f) {
                f.once("progress", h),
                f.check()
            })
        }
        ,
        a.prototype.progress = function(h, f, _) {
            this.progressedCount++,
            this.hasAnyBroken = this.hasAnyBroken || !h.isLoaded,
            this.emitEvent("progress", [this, h, f]),
            this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, h),
            this.progressedCount === this.images.length && this.complete(),
            this.options.debug && s && s.log(`progress: ${_}`, h, f)
        }
        ,
        a.prototype.complete = function() {
            let h = this.hasAnyBroken ? "fail" : "done";
            if (this.isComplete = !0,
            this.emitEvent(h, [this]),
            this.emitEvent("always", [this]),
            this.jqDeferred) {
                let f = this.hasAnyBroken ? "reject" : "resolve";
                this.jqDeferred[f](this)
            }
        }
        ;
        function c(h) {
            this.img = h
        }
        c.prototype = Object.create(r.prototype),
        c.prototype.check = function() {
            if (this.getIsImageComplete()) {
                this.confirm(this.img.naturalWidth !== 0, "naturalWidth");
                return
            }
            this.proxyImage = new Image,
            this.img.crossOrigin && (this.proxyImage.crossOrigin = this.img.crossOrigin),
            this.proxyImage.addEventListener("load", this),
            this.proxyImage.addEventListener("error", this),
            this.img.addEventListener("load", this),
            this.img.addEventListener("error", this),
            this.proxyImage.src = this.img.currentSrc || this.img.src
        }
        ,
        c.prototype.getIsImageComplete = function() {
            return this.img.complete && this.img.naturalWidth
        }
        ,
        c.prototype.confirm = function(h, f) {
            this.isLoaded = h;
            let {parentNode: _} = this.img
              , d = _.nodeName === "PICTURE" ? _ : this.img;
            this.emitEvent("progress", [this, d, f])
        }
        ,
        c.prototype.handleEvent = function(h) {
            let f = "on" + h.type;
            this[f] && this[f](h)
        }
        ,
        c.prototype.onload = function() {
            this.confirm(!0, "onload"),
            this.unbindEvents()
        }
        ,
        c.prototype.onerror = function() {
            this.confirm(!1, "onerror"),
            this.unbindEvents()
        }
        ,
        c.prototype.unbindEvents = function() {
            this.proxyImage.removeEventListener("load", this),
            this.proxyImage.removeEventListener("error", this),
            this.img.removeEventListener("load", this),
            this.img.removeEventListener("error", this)
        }
        ;
        function p(h, f) {
            this.url = h,
            this.element = f,
            this.img = new Image
        }
        return p.prototype = Object.create(c.prototype),
        p.prototype.check = function() {
            this.img.addEventListener("load", this),
            this.img.addEventListener("error", this),
            this.img.src = this.url,
            this.getIsImageComplete() && (this.confirm(this.img.naturalWidth !== 0, "naturalWidth"),
            this.unbindEvents())
        }
        ,
        p.prototype.unbindEvents = function() {
            this.img.removeEventListener("load", this),
            this.img.removeEventListener("error", this)
        }
        ,
        p.prototype.confirm = function(h, f) {
            this.isLoaded = h,
            this.emitEvent("progress", [this, this.element, f])
        }
        ,
        a.makeJQueryPlugin = function(h) {
            h = h || e.jQuery,
            h && (i = h,
            i.fn.imagesLoaded = function(f, _) {
                return new a(this,f,_).jqDeferred.promise(i(this))
            }
            )
        }
        ,
        a.makeJQueryPlugin(),
        a
    })
}
)(Dc);
var hd = Dc.exports;
const dd = Lc(hd);
(function() {
    function n() {
        for (var r = arguments.length, i = 0; i < r; i++) {
            var s = i < 0 || arguments.length <= i ? void 0 : arguments[i];
            s.nodeType === 1 || s.nodeType === 11 ? this.appendChild(s) : this.appendChild(document.createTextNode(String(s)))
        }
    }
    function t() {
        for (; this.lastChild; )
            this.removeChild(this.lastChild);
        arguments.length && this.append.apply(this, arguments)
    }
    function e() {
        for (var r = this.parentNode, i = arguments.length, s = new Array(i), o = 0; o < i; o++)
            s[o] = arguments[o];
        var a = s.length;
        if (r)
            for (a || r.removeChild(this); a--; ) {
                var u = s[a];
                typeof u != "object" ? u = this.ownerDocument.createTextNode(u) : u.parentNode && u.parentNode.removeChild(u),
                a ? r.insertBefore(this.previousSibling, u) : r.replaceChild(u, this)
            }
    }
    typeof Element < "u" && (Element.prototype.append || (Element.prototype.append = n,
    DocumentFragment.prototype.append = n),
    Element.prototype.replaceChildren || (Element.prototype.replaceChildren = t,
    DocumentFragment.prototype.replaceChildren = t),
    Element.prototype.replaceWith || (Element.prototype.replaceWith = e,
    DocumentFragment.prototype.replaceWith = e))
}
)();
function pd(n, t) {
    if (!(n instanceof t))
        throw new TypeError("Cannot call a class as a function")
}
function pl(n, t) {
    for (var e = 0; e < t.length; e++) {
        var r = t[e];
        r.enumerable = r.enumerable || !1,
        r.configurable = !0,
        "value"in r && (r.writable = !0),
        Object.defineProperty(n, r.key, r)
    }
}
function _l(n, t, e) {
    return t && pl(n.prototype, t),
    e && pl(n, e),
    n
}
function _d(n, t, e) {
    return t in n ? Object.defineProperty(n, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : n[t] = e,
    n
}
function gl(n, t) {
    var e = Object.keys(n);
    if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(n);
        t && (r = r.filter(function(i) {
            return Object.getOwnPropertyDescriptor(n, i).enumerable
        })),
        e.push.apply(e, r)
    }
    return e
}
function ml(n) {
    for (var t = 1; t < arguments.length; t++) {
        var e = arguments[t] != null ? arguments[t] : {};
        t % 2 ? gl(Object(e), !0).forEach(function(r) {
            _d(n, r, e[r])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(e)) : gl(Object(e)).forEach(function(r) {
            Object.defineProperty(n, r, Object.getOwnPropertyDescriptor(e, r))
        })
    }
    return n
}
function Mc(n, t) {
    return md(n) || yd(n, t) || Rc(n, t) || wd()
}
function Ie(n) {
    return gd(n) || vd(n) || Rc(n) || bd()
}
function gd(n) {
    if (Array.isArray(n))
        return Da(n)
}
function md(n) {
    if (Array.isArray(n))
        return n
}
function vd(n) {
    if (typeof Symbol < "u" && Symbol.iterator in Object(n))
        return Array.from(n)
}
function yd(n, t) {
    if (!(typeof Symbol > "u" || !(Symbol.iterator in Object(n)))) {
        var e = []
          , r = !0
          , i = !1
          , s = void 0;
        try {
            for (var o = n[Symbol.iterator](), a; !(r = (a = o.next()).done) && (e.push(a.value),
            !(t && e.length === t)); r = !0)
                ;
        } catch (u) {
            i = !0,
            s = u
        } finally {
            try {
                !r && o.return != null && o.return()
            } finally {
                if (i)
                    throw s
            }
        }
        return e
    }
}
function Rc(n, t) {
    if (n) {
        if (typeof n == "string")
            return Da(n, t);
        var e = Object.prototype.toString.call(n).slice(8, -1);
        if (e === "Object" && n.constructor && (e = n.constructor.name),
        e === "Map" || e === "Set")
            return Array.from(n);
        if (e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))
            return Da(n, t)
    }
}
function Da(n, t) {
    (t == null || t > n.length) && (t = n.length);
    for (var e = 0, r = new Array(t); e < t; e++)
        r[e] = n[e];
    return r
}
function bd() {
    throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
function wd() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
function Ui(n, t) {
    return Object.getOwnPropertyNames(Object(n)).reduce(function(e, r) {
        var i = Object.getOwnPropertyDescriptor(Object(n), r)
          , s = Object.getOwnPropertyDescriptor(Object(t), r);
        return Object.defineProperty(e, r, s || i)
    }, {})
}
function zs(n) {
    return typeof n == "string"
}
function mu(n) {
    return Array.isArray(n)
}
function js() {
    var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = Ui(n), e;
    return t.types !== void 0 ? e = t.types : t.split !== void 0 && (e = t.split),
    e !== void 0 && (t.types = (zs(e) || mu(e) ? String(e) : "").split(",").map(function(r) {
        return String(r).trim()
    }).filter(function(r) {
        return /((line)|(word)|(char))/i.test(r)
    })),
    (t.absolute || t.position) && (t.absolute = t.absolute || /absolute/.test(n.position)),
    t
}
function vu(n) {
    var t = zs(n) || mu(n) ? String(n) : "";
    return {
        none: !t,
        lines: /line/i.test(t),
        words: /word/i.test(t),
        chars: /char/i.test(t)
    }
}
function Xo(n) {
    return n !== null && typeof n == "object"
}
function Ed(n) {
    return Xo(n) && /^(1|3|11)$/.test(n.nodeType)
}
function xd(n) {
    return typeof n == "number" && n > -1 && n % 1 === 0
}
function Td(n) {
    return Xo(n) && xd(n.length)
}
function nn(n) {
    return mu(n) ? n : n == null ? [] : Td(n) ? Array.prototype.slice.call(n) : [n]
}
function vl(n) {
    var t = n;
    return zs(n) && (/^(#[a-z]\w+)$/.test(n.trim()) ? t = document.getElementById(n.trim().slice(1)) : t = document.querySelectorAll(n)),
    nn(t).reduce(function(e, r) {
        return [].concat(Ie(e), Ie(nn(r).filter(Ed)))
    }, [])
}
var Sd = Object.entries
  , Co = "_splittype"
  , kr = {}
  , Cd = 0;
function Wr(n, t, e) {
    if (!Xo(n))
        return console.warn("[data.set] owner is not an object"),
        null;
    var r = n[Co] || (n[Co] = ++Cd)
      , i = kr[r] || (kr[r] = {});
    return e === void 0 ? t && Object.getPrototypeOf(t) === Object.prototype && (kr[r] = ml(ml({}, i), t)) : t !== void 0 && (i[t] = e),
    e
}
function qi(n, t) {
    var e = Xo(n) ? n[Co] : null
      , r = e && kr[e] || {};
    return t === void 0 ? r : r[t]
}
function Ic(n) {
    var t = n && n[Co];
    t && (delete n[t],
    delete kr[t])
}
function Ad() {
    Object.keys(kr).forEach(function(n) {
        delete kr[n]
    })
}
function Od() {
    Sd(kr).forEach(function(n) {
        var t = Mc(n, 2)
          , e = t[0]
          , r = t[1]
          , i = r.isRoot
          , s = r.isSplit;
        (!i || !s) && (kr[e] = null,
        delete kr[e])
    })
}
function Pd(n) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : " "
      , e = n ? String(n) : "";
    return e.trim().replace(/\s+/g, " ").split(t)
}
var yu = "\\ud800-\\udfff"
  , Nc = "\\u0300-\\u036f\\ufe20-\\ufe23"
  , zc = "\\u20d0-\\u20f0"
  , Fc = "\\ufe0e\\ufe0f"
  , kd = "[".concat(yu, "]")
  , Ma = "[".concat(Nc).concat(zc, "]")
  , Ra = "\\ud83c[\\udffb-\\udfff]"
  , Ld = "(?:".concat(Ma, "|").concat(Ra, ")")
  , Bc = "[^".concat(yu, "]")
  , Vc = "(?:\\ud83c[\\udde6-\\uddff]){2}"
  , $c = "[\\ud800-\\udbff][\\udc00-\\udfff]"
  , Wc = "\\u200d"
  , Yc = "".concat(Ld, "?")
  , Xc = "[".concat(Fc, "]?")
  , Dd = "(?:" + Wc + "(?:" + [Bc, Vc, $c].join("|") + ")" + Xc + Yc + ")*"
  , Md = Xc + Yc + Dd
  , Rd = "(?:".concat(["".concat(Bc).concat(Ma, "?"), Ma, Vc, $c, kd].join("|"), `
)`)
  , Id = RegExp("".concat(Ra, "(?=").concat(Ra, ")|").concat(Rd).concat(Md), "g")
  , Nd = [Wc, yu, Nc, zc, Fc]
  , zd = RegExp("[".concat(Nd.join(""), "]"));
function Fd(n) {
    return n.split("")
}
function Uc(n) {
    return zd.test(n)
}
function Bd(n) {
    return n.match(Id) || []
}
function Vd(n) {
    return Uc(n) ? Bd(n) : Fd(n)
}
function $d(n) {
    return n == null ? "" : String(n)
}
function Wd(n) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return n = $d(n),
    n && zs(n) && !t && Uc(n) ? Vd(n) : n.split(t)
}
function Ia(n, t) {
    var e = document.createElement(n);
    return t && Object.keys(t).forEach(function(r) {
        var i = t[r]
          , s = zs(i) ? i.trim() : i;
        s === null || s === "" || (r === "children" ? e.append.apply(e, Ie(nn(s))) : e.setAttribute(r, s))
    }),
    e
}
var bu = {
    splitClass: "",
    lineClass: "line",
    wordClass: "word",
    charClass: "char",
    types: ["lines", "words", "chars"],
    absolute: !1,
    tagName: "div"
};
function Yd(n, t) {
    t = Ui(bu, t);
    var e = vu(t.types)
      , r = t.tagName
      , i = n.nodeValue
      , s = document.createDocumentFragment()
      , o = []
      , a = [];
    return /^\s/.test(i) && s.append(" "),
    o = Pd(i).reduce(function(u, l, c, p) {
        var h, f;
        return e.chars && (f = Wd(l).map(function(_) {
            var d = Ia(r, {
                class: "".concat(t.splitClass, " ").concat(t.charClass),
                style: "display: inline-block;",
                children: _
            });
            return Wr(d, "isChar", !0),
            a = [].concat(Ie(a), [d]),
            d
        })),
        e.words || e.lines ? (h = Ia(r, {
            class: "".concat(t.wordClass, " ").concat(t.splitClass),
            style: "display: inline-block; ".concat(e.words && t.absolute ? "position: relative;" : ""),
            children: e.chars ? f : l
        }),
        Wr(h, {
            isWord: !0,
            isWordStart: !0,
            isWordEnd: !0
        }),
        s.appendChild(h)) : f.forEach(function(_) {
            s.appendChild(_)
        }),
        c < p.length - 1 && s.append(" "),
        e.words ? u.concat(h) : u
    }, []),
    /\s$/.test(i) && s.append(" "),
    n.replaceWith(s),
    {
        words: o,
        chars: a
    }
}
function qc(n, t) {
    var e = n.nodeType
      , r = {
        words: [],
        chars: []
    };
    if (!/(1|3|11)/.test(e))
        return r;
    if (e === 3 && /\S/.test(n.nodeValue))
        return Yd(n, t);
    var i = nn(n.childNodes);
    if (i.length && (Wr(n, "isSplit", !0),
    !qi(n).isRoot)) {
        n.style.display = "inline-block",
        n.style.position = "relative";
        var s = n.nextSibling
          , o = n.previousSibling
          , a = n.textContent || ""
          , u = s ? s.textContent : " "
          , l = o ? o.textContent : " ";
        Wr(n, {
            isWordEnd: /\s$/.test(a) || /^\s/.test(u),
            isWordStart: /^\s/.test(a) || /\s$/.test(l)
        })
    }
    return i.reduce(function(c, p) {
        var h = qc(p, t)
          , f = h.words
          , _ = h.chars;
        return {
            words: [].concat(Ie(c.words), Ie(f)),
            chars: [].concat(Ie(c.chars), Ie(_))
        }
    }, r)
}
function Xd(n, t, e, r) {
    if (!e.absolute)
        return {
            top: t ? n.offsetTop : null
        };
    var i = n.offsetParent
      , s = Mc(r, 2)
      , o = s[0]
      , a = s[1]
      , u = 0
      , l = 0;
    if (i && i !== document.body) {
        var c = i.getBoundingClientRect();
        u = c.x + o,
        l = c.y + a
    }
    var p = n.getBoundingClientRect()
      , h = p.width
      , f = p.height
      , _ = p.x
      , d = p.y
      , b = d + a - l
      , T = _ + o - u;
    return {
        width: h,
        height: f,
        top: b,
        left: T
    }
}
function Gc(n) {
    qi(n).isWord ? (Ic(n),
    n.replaceWith.apply(n, Ie(n.childNodes))) : nn(n.children).forEach(function(t) {
        return Gc(t)
    })
}
var Ud = function() {
    return document.createDocumentFragment()
};
function qd(n, t, e) {
    var r = vu(t.types), i = t.tagName, s = n.getElementsByTagName("*"), o = [], a = [], u = null, l, c, p, h = [], f = n.parentElement, _ = n.nextElementSibling, d = Ud(), b = window.getComputedStyle(n), T = b.textAlign, w = parseFloat(b.fontSize), C = w * .2;
    return t.absolute && (p = {
        left: n.offsetLeft,
        top: n.offsetTop,
        width: n.offsetWidth
    },
    c = n.offsetWidth,
    l = n.offsetHeight,
    Wr(n, {
        cssWidth: n.style.width,
        cssHeight: n.style.height
    })),
    nn(s).forEach(function(A) {
        var O = A.parentElement === n
          , P = Xd(A, O, t, e)
          , E = P.width
          , L = P.height
          , M = P.top
          , D = P.left;
        /^br$/i.test(A.nodeName) || (r.lines && O && ((u === null || M - u >= C) && (u = M,
        o.push(a = [])),
        a.push(A)),
        t.absolute && Wr(A, {
            top: M,
            left: D,
            width: E,
            height: L
        }))
    }),
    f && f.removeChild(n),
    r.lines && (h = o.map(function(A) {
        var O = Ia(i, {
            class: "".concat(t.splitClass, " ").concat(t.lineClass),
            style: "display: block; text-align: ".concat(T, "; width: 100%;")
        });
        Wr(O, "isLine", !0);
        var P = {
            height: 0,
            top: 1e4
        };
        return d.appendChild(O),
        A.forEach(function(E, L, M) {
            var D = qi(E)
              , F = D.isWordEnd
              , k = D.top
              , $ = D.height
              , U = M[L + 1];
            P.height = Math.max(P.height, $),
            P.top = Math.min(P.top, k),
            O.appendChild(E),
            F && qi(U).isWordStart && O.append(" ")
        }),
        t.absolute && Wr(O, {
            height: P.height,
            top: P.top
        }),
        O
    }),
    r.words || Gc(d),
    n.replaceChildren(d)),
    t.absolute && (n.style.width = "".concat(n.style.width || c, "px"),
    n.style.height = "".concat(l, "px"),
    nn(s).forEach(function(A) {
        var O = qi(A)
          , P = O.isLine
          , E = O.top
          , L = O.left
          , M = O.width
          , D = O.height
          , F = qi(A.parentElement)
          , k = !P && F.isLine;
        A.style.top = "".concat(k ? E - F.top : E, "px"),
        A.style.left = P ? "".concat(p.left, "px") : "".concat(L - (k ? p.left : 0), "px"),
        A.style.height = "".concat(D, "px"),
        A.style.width = P ? "".concat(p.width, "px") : "".concat(M, "px"),
        A.style.position = "absolute"
    })),
    f && (_ ? f.insertBefore(n, _) : f.appendChild(n)),
    h
}
var gn = Ui(bu, {})
  , Gd = function() {
    _l(n, null, [{
        key: "clearData",
        value: function() {
            Ad()
        }
    }, {
        key: "setDefaults",
        value: function(e) {
            return gn = Ui(gn, js(e)),
            bu
        }
    }, {
        key: "revert",
        value: function(e) {
            vl(e).forEach(function(r) {
                var i = qi(r)
                  , s = i.isSplit
                  , o = i.html
                  , a = i.cssWidth
                  , u = i.cssHeight;
                s && (r.innerHTML = o,
                r.style.width = a || "",
                r.style.height = u || "",
                Ic(r))
            })
        }
    }, {
        key: "create",
        value: function(e, r) {
            return new n(e,r)
        }
    }, {
        key: "data",
        get: function() {
            return kr
        }
    }, {
        key: "defaults",
        get: function() {
            return gn
        },
        set: function(e) {
            gn = Ui(gn, js(e))
        }
    }]);
    function n(t, e) {
        pd(this, n),
        this.isSplit = !1,
        this.settings = Ui(gn, js(e)),
        this.elements = vl(t),
        this.split()
    }
    return _l(n, [{
        key: "split",
        value: function(e) {
            var r = this;
            this.revert(),
            this.elements.forEach(function(o) {
                Wr(o, "html", o.innerHTML)
            }),
            this.lines = [],
            this.words = [],
            this.chars = [];
            var i = [window.pageXOffset, window.pageYOffset];
            e !== void 0 && (this.settings = Ui(this.settings, js(e)));
            var s = vu(this.settings.types);
            s.none || (this.elements.forEach(function(o) {
                Wr(o, "isRoot", !0);
                var a = qc(o, r.settings)
                  , u = a.words
                  , l = a.chars;
                r.words = [].concat(Ie(r.words), Ie(u)),
                r.chars = [].concat(Ie(r.chars), Ie(l))
            }),
            this.elements.forEach(function(o) {
                if (s.lines || r.settings.absolute) {
                    var a = qd(o, r.settings, i);
                    r.lines = [].concat(Ie(r.lines), Ie(a))
                }
            }),
            this.isSplit = !0,
            window.scrollTo(i[0], i[1]),
            Od())
        }
    }, {
        key: "revert",
        value: function() {
            this.isSplit && (this.lines = null,
            this.words = null,
            this.chars = null,
            this.isSplit = !1),
            n.revert(this.elements)
        }
    }]),
    n
}();
function ni(n) {
    if (n === void 0)
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return n
}
function Hc(n, t) {
    n.prototype = Object.create(t.prototype),
    n.prototype.constructor = n,
    n.__proto__ = t
}
/*!
 * GSAP 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var or = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
        lineHeight: ""
    }
}, Nn = {
    duration: .5,
    overwrite: !1,
    delay: 0
}, wu, Te, Wt, pr = 1e8, It = 1 / pr, Na = Math.PI * 2, Hd = Na / 4, jd = 0, jc = Math.sqrt, Kd = Math.cos, Zd = Math.sin, _e = function(t) {
    return typeof t == "string"
}, Jt = function(t) {
    return typeof t == "function"
}, di = function(t) {
    return typeof t == "number"
}, Eu = function(t) {
    return typeof t > "u"
}, Gr = function(t) {
    return typeof t == "object"
}, Xe = function(t) {
    return t !== !1
}, xu = function() {
    return typeof window < "u"
}, Ks = function(t) {
    return Jt(t) || _e(t)
}, Kc = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {}
, Se = Array.isArray, za = /(?:-?\.?\d|\.)+/gi, Zc = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, Tn = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, ha = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, Jc = /[+-]=-?[.\d]+/, Qc = /[^,'"\[\]\s]+/gi, Jd = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, Ut, Br, Fa, Tu, ar = {}, Ao = {}, tf, ef = function(t) {
    return (Ao = sn(t, ar)) && He
}, Su = function(t, e) {
    return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()")
}, bs = function(t, e) {
    return !e && console.warn(t)
}, rf = function(t, e) {
    return t && (ar[t] = e) && Ao && (Ao[t] = e) || ar
}, ws = function() {
    return 0
}, Qd = {
    suppressEvents: !0,
    isStart: !0,
    kill: !1
}, fo = {
    suppressEvents: !0,
    kill: !1
}, tp = {
    suppressEvents: !0
}, Cu = {}, Si = [], Ba = {}, nf, rr = {}, da = {}, yl = 30, ho = [], Au = "", Ou = function(t) {
    var e = t[0], r, i;
    if (Gr(e) || Jt(e) || (t = [t]),
    !(r = (e._gsap || {}).harness)) {
        for (i = ho.length; i-- && !ho[i].targetTest(e); )
            ;
        r = ho[i]
    }
    for (i = t.length; i--; )
        t[i] && (t[i]._gsap || (t[i]._gsap = new Of(t[i],r))) || t.splice(i, 1);
    return t
}, ji = function(t) {
    return t._gsap || Ou(_r(t))[0]._gsap
}, sf = function(t, e, r) {
    return (r = t[e]) && Jt(r) ? t[e]() : Eu(r) && t.getAttribute && t.getAttribute(e) || r
}, Ue = function(t, e) {
    return (t = t.split(",")).forEach(e) || t
}, re = function(t) {
    return Math.round(t * 1e5) / 1e5 || 0
}, pe = function(t) {
    return Math.round(t * 1e7) / 1e7 || 0
}, On = function(t, e) {
    var r = e.charAt(0)
      , i = parseFloat(e.substr(2));
    return t = parseFloat(t),
    r === "+" ? t + i : r === "-" ? t - i : r === "*" ? t * i : t / i
}, ep = function(t, e) {
    for (var r = e.length, i = 0; t.indexOf(e[i]) < 0 && ++i < r; )
        ;
    return i < r
}, Oo = function() {
    var t = Si.length, e = Si.slice(0), r, i;
    for (Ba = {},
    Si.length = 0,
    r = 0; r < t; r++)
        i = e[r],
        i && i._lazy && (i.render(i._lazy[0], i._lazy[1], !0)._lazy = 0)
}, of = function(t, e, r, i) {
    Si.length && !Te && Oo(),
    t.render(e, r, i || Te && e < 0 && (t._initted || t._startAt)),
    Si.length && !Te && Oo()
}, af = function(t) {
    var e = parseFloat(t);
    return (e || e === 0) && (t + "").match(Qc).length < 2 ? e : _e(t) ? t.trim() : t
}, uf = function(t) {
    return t
}, vr = function(t, e) {
    for (var r in e)
        r in t || (t[r] = e[r]);
    return t
}, rp = function(t) {
    return function(e, r) {
        for (var i in r)
            i in e || i === "duration" && t || i === "ease" || (e[i] = r[i])
    }
}, sn = function(t, e) {
    for (var r in e)
        t[r] = e[r];
    return t
}, bl = function n(t, e) {
    for (var r in e)
        r !== "__proto__" && r !== "constructor" && r !== "prototype" && (t[r] = Gr(e[r]) ? n(t[r] || (t[r] = {}), e[r]) : e[r]);
    return t
}, Po = function(t, e) {
    var r = {}, i;
    for (i in t)
        i in e || (r[i] = t[i]);
    return r
}, os = function(t) {
    var e = t.parent || Ut
      , r = t.keyframes ? rp(Se(t.keyframes)) : vr;
    if (Xe(t.inherit))
        for (; e; )
            r(t, e.vars.defaults),
            e = e.parent || e._dp;
    return t
}, ip = function(t, e) {
    for (var r = t.length, i = r === e.length; i && r-- && t[r] === e[r]; )
        ;
    return r < 0
}, lf = function(t, e, r, i, s) {
    r === void 0 && (r = "_first"),
    i === void 0 && (i = "_last");
    var o = t[i], a;
    if (s)
        for (a = e[s]; o && o[s] > a; )
            o = o._prev;
    return o ? (e._next = o._next,
    o._next = e) : (e._next = t[r],
    t[r] = e),
    e._next ? e._next._prev = e : t[i] = e,
    e._prev = o,
    e.parent = e._dp = t,
    e
}, Uo = function(t, e, r, i) {
    r === void 0 && (r = "_first"),
    i === void 0 && (i = "_last");
    var s = e._prev
      , o = e._next;
    s ? s._next = o : t[r] === e && (t[r] = o),
    o ? o._prev = s : t[i] === e && (t[i] = s),
    e._next = e._prev = e.parent = null
}, Oi = function(t, e) {
    t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t),
    t._act = 0
}, Ki = function(t, e) {
    if (t && (!e || e._end > t._dur || e._start < 0))
        for (var r = t; r; )
            r._dirty = 1,
            r = r.parent;
    return t
}, np = function(t) {
    for (var e = t.parent; e && e.parent; )
        e._dirty = 1,
        e.totalDuration(),
        e = e.parent;
    return t
}, Va = function(t, e, r, i) {
    return t._startAt && (Te ? t._startAt.revert(fo) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, i))
}, sp = function n(t) {
    return !t || t._ts && n(t.parent)
}, wl = function(t) {
    return t._repeat ? zn(t._tTime, t = t.duration() + t._rDelay) * t : 0
}, zn = function(t, e) {
    var r = Math.floor(t /= e);
    return t && r === t ? r - 1 : r
}, ko = function(t, e) {
    return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur)
}, qo = function(t) {
    return t._end = pe(t._start + (t._tDur / Math.abs(t._ts || t._rts || It) || 0))
}, Go = function(t, e) {
    var r = t._dp;
    return r && r.smoothChildTiming && t._ts && (t._start = pe(r._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)),
    qo(t),
    r._dirty || Ki(r, t)),
    t
}, cf = function(t, e) {
    var r;
    if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (r = ko(t.rawTime(), e),
    (!e._dur || Fs(0, e.totalDuration(), r) - e._tTime > It) && e.render(r, !0)),
    Ki(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
        if (t._dur < t.duration())
            for (r = t; r._dp; )
                r.rawTime() >= 0 && r.totalTime(r._tTime),
                r = r._dp;
        t._zTime = -It
    }
}, $r = function(t, e, r, i) {
    return e.parent && Oi(e),
    e._start = pe((di(r) ? r : r || t !== Ut ? cr(t, r, e) : t._time) + e._delay),
    e._end = pe(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)),
    lf(t, e, "_first", "_last", t._sort ? "_start" : 0),
    $a(e) || (t._recent = e),
    i || cf(t, e),
    t._ts < 0 && Go(t, t._tTime),
    t
}, ff = function(t, e) {
    return (ar.ScrollTrigger || Su("scrollTrigger", e)) && ar.ScrollTrigger.create(e, t)
}, hf = function(t, e, r, i, s) {
    if (ku(t, e, s),
    !t._initted)
        return 1;
    if (!r && t._pt && !Te && (t._dur && t.vars.lazy !== !1 || !t._dur && t.vars.lazy) && nf !== ir.frame)
        return Si.push(t),
        t._lazy = [s, i],
        1
}, op = function n(t) {
    var e = t.parent;
    return e && e._ts && e._initted && !e._lock && (e.rawTime() < 0 || n(e))
}, $a = function(t) {
    var e = t.data;
    return e === "isFromStart" || e === "isStart"
}, ap = function(t, e, r, i) {
    var s = t.ratio, o = e < 0 || !e && (!t._start && op(t) && !(!t._initted && $a(t)) || (t._ts < 0 || t._dp._ts < 0) && !$a(t)) ? 0 : 1, a = t._rDelay, u = 0, l, c, p;
    if (a && t._repeat && (u = Fs(0, t._tDur, e),
    c = zn(u, a),
    t._yoyo && c & 1 && (o = 1 - o),
    c !== zn(t._tTime, a) && (s = 1 - o,
    t.vars.repeatRefresh && t._initted && t.invalidate())),
    o !== s || Te || i || t._zTime === It || !e && t._zTime) {
        if (!t._initted && hf(t, e, i, r, u))
            return;
        for (p = t._zTime,
        t._zTime = e || (r ? It : 0),
        r || (r = e && !p),
        t.ratio = o,
        t._from && (o = 1 - o),
        t._time = 0,
        t._tTime = u,
        l = t._pt; l; )
            l.r(o, l.d),
            l = l._next;
        e < 0 && Va(t, e, r, !0),
        t._onUpdate && !r && sr(t, "onUpdate"),
        u && t._repeat && !r && t.parent && sr(t, "onRepeat"),
        (e >= t._tDur || e < 0) && t.ratio === o && (o && Oi(t, 1),
        !r && !Te && (sr(t, o ? "onComplete" : "onReverseComplete", !0),
        t._prom && t._prom()))
    } else
        t._zTime || (t._zTime = e)
}, up = function(t, e, r) {
    var i;
    if (r > e)
        for (i = t._first; i && i._start <= r; ) {
            if (i.data === "isPause" && i._start > e)
                return i;
            i = i._next
        }
    else
        for (i = t._last; i && i._start >= r; ) {
            if (i.data === "isPause" && i._start < e)
                return i;
            i = i._prev
        }
}, Fn = function(t, e, r, i) {
    var s = t._repeat
      , o = pe(e) || 0
      , a = t._tTime / t._tDur;
    return a && !i && (t._time *= o / t._dur),
    t._dur = o,
    t._tDur = s ? s < 0 ? 1e10 : pe(o * (s + 1) + t._rDelay * s) : o,
    a > 0 && !i && Go(t, t._tTime = t._tDur * a),
    t.parent && qo(t),
    r || Ki(t.parent, t),
    t
}, El = function(t) {
    return t instanceof Ne ? Ki(t) : Fn(t, t._dur)
}, lp = {
    _start: 0,
    endTime: ws,
    totalDuration: ws
}, cr = function n(t, e, r) {
    var i = t.labels, s = t._recent || lp, o = t.duration() >= pr ? s.endTime(!1) : t._dur, a, u, l;
    return _e(e) && (isNaN(e) || e in i) ? (u = e.charAt(0),
    l = e.substr(-1) === "%",
    a = e.indexOf("="),
    u === "<" || u === ">" ? (a >= 0 && (e = e.replace(/=/, "")),
    (u === "<" ? s._start : s.endTime(s._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (l ? (a < 0 ? s : r).totalDuration() / 100 : 1)) : a < 0 ? (e in i || (i[e] = o),
    i[e]) : (u = parseFloat(e.charAt(a - 1) + e.substr(a + 1)),
    l && r && (u = u / 100 * (Se(r) ? r[0] : r).totalDuration()),
    a > 1 ? n(t, e.substr(0, a - 1), r) + u : o + u)) : e == null ? o : +e
}, as = function(t, e, r) {
    var i = di(e[1]), s = (i ? 2 : 1) + (t < 2 ? 0 : 1), o = e[s], a, u;
    if (i && (o.duration = e[1]),
    o.parent = r,
    t) {
        for (a = o,
        u = r; u && !("immediateRender"in a); )
            a = u.vars.defaults || {},
            u = Xe(u.vars.inherit) && u.parent;
        o.immediateRender = Xe(a.immediateRender),
        t < 2 ? o.runBackwards = 1 : o.startAt = e[s - 1]
    }
    return new ae(e[0],o,e[s + 1])
}, Ri = function(t, e) {
    return t || t === 0 ? e(t) : e
}, Fs = function(t, e, r) {
    return r < t ? t : r > e ? e : r
}, xe = function(t, e) {
    return !_e(t) || !(e = Jd.exec(t)) ? "" : e[1]
}, cp = function(t, e, r) {
    return Ri(r, function(i) {
        return Fs(t, e, i)
    })
}, Wa = [].slice, df = function(t, e) {
    return t && Gr(t) && "length"in t && (!e && !t.length || t.length - 1 in t && Gr(t[0])) && !t.nodeType && t !== Br
}, fp = function(t, e, r) {
    return r === void 0 && (r = []),
    t.forEach(function(i) {
        var s;
        return _e(i) && !e || df(i, 1) ? (s = r).push.apply(s, _r(i)) : r.push(i)
    }) || r
}, _r = function(t, e, r) {
    return Wt && !e && Wt.selector ? Wt.selector(t) : _e(t) && !r && (Fa || !Bn()) ? Wa.call((e || Tu).querySelectorAll(t), 0) : Se(t) ? fp(t, r) : df(t) ? Wa.call(t, 0) : t ? [t] : []
}, Ya = function(t) {
    return t = _r(t)[0] || bs("Invalid scope") || {},
    function(e) {
        var r = t.current || t.nativeElement || t;
        return _r(e, r.querySelectorAll ? r : r === t ? bs("Invalid scope") || Tu.createElement("div") : t)
    }
}, pf = function(t) {
    return t.sort(function() {
        return .5 - Math.random()
    })
}, _f = function(t) {
    if (Jt(t))
        return t;
    var e = Gr(t) ? t : {
        each: t
    }
      , r = Zi(e.ease)
      , i = e.from || 0
      , s = parseFloat(e.base) || 0
      , o = {}
      , a = i > 0 && i < 1
      , u = isNaN(i) || a
      , l = e.axis
      , c = i
      , p = i;
    return _e(i) ? c = p = {
        center: .5,
        edges: .5,
        end: 1
    }[i] || 0 : !a && u && (c = i[0],
    p = i[1]),
    function(h, f, _) {
        var d = (_ || e).length, b = o[d], T, w, C, A, O, P, E, L, M;
        if (!b) {
            if (M = e.grid === "auto" ? 0 : (e.grid || [1, pr])[1],
            !M) {
                for (E = -pr; E < (E = _[M++].getBoundingClientRect().left) && M < d; )
                    ;
                M < d && M--
            }
            for (b = o[d] = [],
            T = u ? Math.min(M, d) * c - .5 : i % M,
            w = M === pr ? 0 : u ? d * p / M - .5 : i / M | 0,
            E = 0,
            L = pr,
            P = 0; P < d; P++)
                C = P % M - T,
                A = w - (P / M | 0),
                b[P] = O = l ? Math.abs(l === "y" ? A : C) : jc(C * C + A * A),
                O > E && (E = O),
                O < L && (L = O);
            i === "random" && pf(b),
            b.max = E - L,
            b.min = L,
            b.v = d = (parseFloat(e.amount) || parseFloat(e.each) * (M > d ? d - 1 : l ? l === "y" ? d / M : M : Math.max(M, d / M)) || 0) * (i === "edges" ? -1 : 1),
            b.b = d < 0 ? s - d : s,
            b.u = xe(e.amount || e.each) || 0,
            r = r && d < 0 ? Sf(r) : r
        }
        return d = (b[h] - b.min) / b.max || 0,
        pe(b.b + (r ? r(d) : d) * b.v) + b.u
    }
}, Xa = function(t) {
    var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
    return function(r) {
        var i = pe(Math.round(parseFloat(r) / t) * t * e);
        return (i - i % 1) / e + (di(r) ? 0 : xe(r))
    }
}, gf = function(t, e) {
    var r = Se(t), i, s;
    return !r && Gr(t) && (i = r = t.radius || pr,
    t.values ? (t = _r(t.values),
    (s = !di(t[0])) && (i *= i)) : t = Xa(t.increment)),
    Ri(e, r ? Jt(t) ? function(o) {
        return s = t(o),
        Math.abs(s - o) <= i ? s : o
    }
    : function(o) {
        for (var a = parseFloat(s ? o.x : o), u = parseFloat(s ? o.y : 0), l = pr, c = 0, p = t.length, h, f; p--; )
            s ? (h = t[p].x - a,
            f = t[p].y - u,
            h = h * h + f * f) : h = Math.abs(t[p] - a),
            h < l && (l = h,
            c = p);
        return c = !i || l <= i ? t[c] : o,
        s || c === o || di(o) ? c : c + xe(o)
    }
    : Xa(t))
}, mf = function(t, e, r, i) {
    return Ri(Se(t) ? !e : r === !0 ? !!(r = 0) : !i, function() {
        return Se(t) ? t[~~(Math.random() * t.length)] : (r = r || 1e-5) && (i = r < 1 ? Math.pow(10, (r + "").length - 2) : 1) && Math.floor(Math.round((t - r / 2 + Math.random() * (e - t + r * .99)) / r) * r * i) / i
    })
}, hp = function() {
    for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
        e[r] = arguments[r];
    return function(i) {
        return e.reduce(function(s, o) {
            return o(s)
        }, i)
    }
}, dp = function(t, e) {
    return function(r) {
        return t(parseFloat(r)) + (e || xe(r))
    }
}, pp = function(t, e, r) {
    return yf(t, e, 0, 1, r)
}, vf = function(t, e, r) {
    return Ri(r, function(i) {
        return t[~~e(i)]
    })
}, _p = function n(t, e, r) {
    var i = e - t;
    return Se(t) ? vf(t, n(0, t.length), e) : Ri(r, function(s) {
        return (i + (s - t) % i) % i + t
    })
}, gp = function n(t, e, r) {
    var i = e - t
      , s = i * 2;
    return Se(t) ? vf(t, n(0, t.length - 1), e) : Ri(r, function(o) {
        return o = (s + (o - t) % s) % s || 0,
        t + (o > i ? s - o : o)
    })
}, Es = function(t) {
    for (var e = 0, r = "", i, s, o, a; ~(i = t.indexOf("random(", e)); )
        o = t.indexOf(")", i),
        a = t.charAt(i + 7) === "[",
        s = t.substr(i + 7, o - i - 7).match(a ? Qc : za),
        r += t.substr(e, i - e) + mf(a ? s : +s[0], a ? 0 : +s[1], +s[2] || 1e-5),
        e = o + 1;
    return r + t.substr(e, t.length - e)
}, yf = function(t, e, r, i, s) {
    var o = e - t
      , a = i - r;
    return Ri(s, function(u) {
        return r + ((u - t) / o * a || 0)
    })
}, mp = function n(t, e, r, i) {
    var s = isNaN(t + e) ? 0 : function(f) {
        return (1 - f) * t + f * e
    }
    ;
    if (!s) {
        var o = _e(t), a = {}, u, l, c, p, h;
        if (r === !0 && (i = 1) && (r = null),
        o)
            t = {
                p: t
            },
            e = {
                p: e
            };
        else if (Se(t) && !Se(e)) {
            for (c = [],
            p = t.length,
            h = p - 2,
            l = 1; l < p; l++)
                c.push(n(t[l - 1], t[l]));
            p--,
            s = function(_) {
                _ *= p;
                var d = Math.min(h, ~~_);
                return c[d](_ - d)
            }
            ,
            r = e
        } else
            i || (t = sn(Se(t) ? [] : {}, t));
        if (!c) {
            for (u in e)
                Pu.call(a, t, u, "get", e[u]);
            s = function(_) {
                return Mu(_, a) || (o ? t.p : t)
            }
        }
    }
    return Ri(r, s)
}, xl = function(t, e, r) {
    var i = t.labels, s = pr, o, a, u;
    for (o in i)
        a = i[o] - e,
        a < 0 == !!r && a && s > (a = Math.abs(a)) && (u = o,
        s = a);
    return u
}, sr = function(t, e, r) {
    var i = t.vars, s = i[e], o = Wt, a = t._ctx, u, l, c;
    if (s)
        return u = i[e + "Params"],
        l = i.callbackScope || t,
        r && Si.length && Oo(),
        a && (Wt = a),
        c = u ? s.apply(l, u) : s.call(l),
        Wt = o,
        c
}, Jn = function(t) {
    return Oi(t),
    t.scrollTrigger && t.scrollTrigger.kill(!!Te),
    t.progress() < 1 && sr(t, "onInterrupt"),
    t
}, Sn, bf = [], wf = function(t) {
    if (t)
        if (t = !t.name && t.default || t,
        xu() || t.headless) {
            var e = t.name
              , r = Jt(t)
              , i = e && !r && t.init ? function() {
                this._props = []
            }
            : t
              , s = {
                init: ws,
                render: Mu,
                add: Pu,
                kill: Mp,
                modifier: Dp,
                rawVars: 0
            }
              , o = {
                targetTest: 0,
                get: 0,
                getSetter: Du,
                aliases: {},
                register: 0
            };
            if (Bn(),
            t !== i) {
                if (rr[e])
                    return;
                vr(i, vr(Po(t, s), o)),
                sn(i.prototype, sn(s, Po(t, o))),
                rr[i.prop = e] = i,
                t.targetTest && (ho.push(i),
                Cu[e] = 1),
                e = (e === "css" ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin"
            }
            rf(e, i),
            t.register && t.register(He, i, qe)
        } else
            bf.push(t)
}, Rt = 255, Qn = {
    aqua: [0, Rt, Rt],
    lime: [0, Rt, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, Rt],
    navy: [0, 0, 128],
    white: [Rt, Rt, Rt],
    olive: [128, 128, 0],
    yellow: [Rt, Rt, 0],
    orange: [Rt, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [Rt, 0, 0],
    pink: [Rt, 192, 203],
    cyan: [0, Rt, Rt],
    transparent: [Rt, Rt, Rt, 0]
}, pa = function(t, e, r) {
    return t += t < 0 ? 1 : t > 1 ? -1 : 0,
    (t * 6 < 1 ? e + (r - e) * t * 6 : t < .5 ? r : t * 3 < 2 ? e + (r - e) * (2 / 3 - t) * 6 : e) * Rt + .5 | 0
}, Ef = function(t, e, r) {
    var i = t ? di(t) ? [t >> 16, t >> 8 & Rt, t & Rt] : 0 : Qn.black, s, o, a, u, l, c, p, h, f, _;
    if (!i) {
        if (t.substr(-1) === "," && (t = t.substr(0, t.length - 1)),
        Qn[t])
            i = Qn[t];
        else if (t.charAt(0) === "#") {
            if (t.length < 6 && (s = t.charAt(1),
            o = t.charAt(2),
            a = t.charAt(3),
            t = "#" + s + s + o + o + a + a + (t.length === 5 ? t.charAt(4) + t.charAt(4) : "")),
            t.length === 9)
                return i = parseInt(t.substr(1, 6), 16),
                [i >> 16, i >> 8 & Rt, i & Rt, parseInt(t.substr(7), 16) / 255];
            t = parseInt(t.substr(1), 16),
            i = [t >> 16, t >> 8 & Rt, t & Rt]
        } else if (t.substr(0, 3) === "hsl") {
            if (i = _ = t.match(za),
            !e)
                u = +i[0] % 360 / 360,
                l = +i[1] / 100,
                c = +i[2] / 100,
                o = c <= .5 ? c * (l + 1) : c + l - c * l,
                s = c * 2 - o,
                i.length > 3 && (i[3] *= 1),
                i[0] = pa(u + 1 / 3, s, o),
                i[1] = pa(u, s, o),
                i[2] = pa(u - 1 / 3, s, o);
            else if (~t.indexOf("="))
                return i = t.match(Zc),
                r && i.length < 4 && (i[3] = 1),
                i
        } else
            i = t.match(za) || Qn.transparent;
        i = i.map(Number)
    }
    return e && !_ && (s = i[0] / Rt,
    o = i[1] / Rt,
    a = i[2] / Rt,
    p = Math.max(s, o, a),
    h = Math.min(s, o, a),
    c = (p + h) / 2,
    p === h ? u = l = 0 : (f = p - h,
    l = c > .5 ? f / (2 - p - h) : f / (p + h),
    u = p === s ? (o - a) / f + (o < a ? 6 : 0) : p === o ? (a - s) / f + 2 : (s - o) / f + 4,
    u *= 60),
    i[0] = ~~(u + .5),
    i[1] = ~~(l * 100 + .5),
    i[2] = ~~(c * 100 + .5)),
    r && i.length < 4 && (i[3] = 1),
    i
}, xf = function(t) {
    var e = []
      , r = []
      , i = -1;
    return t.split(Ci).forEach(function(s) {
        var o = s.match(Tn) || [];
        e.push.apply(e, o),
        r.push(i += o.length + 1)
    }),
    e.c = r,
    e
}, Tl = function(t, e, r) {
    var i = "", s = (t + i).match(Ci), o = e ? "hsla(" : "rgba(", a = 0, u, l, c, p;
    if (!s)
        return t;
    if (s = s.map(function(h) {
        return (h = Ef(h, e, 1)) && o + (e ? h[0] + "," + h[1] + "%," + h[2] + "%," + h[3] : h.join(",")) + ")"
    }),
    r && (c = xf(t),
    u = r.c,
    u.join(i) !== c.c.join(i)))
        for (l = t.replace(Ci, "1").split(Tn),
        p = l.length - 1; a < p; a++)
            i += l[a] + (~u.indexOf(a) ? s.shift() || o + "0,0,0,0)" : (c.length ? c : s.length ? s : r).shift());
    if (!l)
        for (l = t.split(Ci),
        p = l.length - 1; a < p; a++)
            i += l[a] + s[a];
    return i + l[p]
}, Ci = function() {
    var n = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
    for (t in Qn)
        n += "|" + t + "\\b";
    return new RegExp(n + ")","gi")
}(), vp = /hsl[a]?\(/, Tf = function(t) {
    var e = t.join(" "), r;
    if (Ci.lastIndex = 0,
    Ci.test(e))
        return r = vp.test(e),
        t[1] = Tl(t[1], r),
        t[0] = Tl(t[0], r, xf(t[1])),
        !0
}, xs, ir = function() {
    var n = Date.now, t = 500, e = 33, r = n(), i = r, s = 1e3 / 240, o = s, a = [], u, l, c, p, h, f, _ = function d(b) {
        var T = n() - i, w = b === !0, C, A, O, P;
        if ((T > t || T < 0) && (r += T - e),
        i += T,
        O = i - r,
        C = O - o,
        (C > 0 || w) && (P = ++p.frame,
        h = O - p.time * 1e3,
        p.time = O = O / 1e3,
        o += C + (C >= s ? 4 : s - C),
        A = 1),
        w || (u = l(d)),
        A)
            for (f = 0; f < a.length; f++)
                a[f](O, h, P, b)
    };
    return p = {
        time: 0,
        frame: 0,
        tick: function() {
            _(!0)
        },
        deltaRatio: function(b) {
            return h / (1e3 / (b || 60))
        },
        wake: function() {
            tf && (!Fa && xu() && (Br = Fa = window,
            Tu = Br.document || {},
            ar.gsap = He,
            (Br.gsapVersions || (Br.gsapVersions = [])).push(He.version),
            ef(Ao || Br.GreenSockGlobals || !Br.gsap && Br || {}),
            bf.forEach(wf)),
            c = typeof requestAnimationFrame < "u" && requestAnimationFrame,
            u && p.sleep(),
            l = c || function(b) {
                return setTimeout(b, o - p.time * 1e3 + 1 | 0)
            }
            ,
            xs = 1,
            _(2))
        },
        sleep: function() {
            (c ? cancelAnimationFrame : clearTimeout)(u),
            xs = 0,
            l = ws
        },
        lagSmoothing: function(b, T) {
            t = b || 1 / 0,
            e = Math.min(T || 33, t)
        },
        fps: function(b) {
            s = 1e3 / (b || 240),
            o = p.time * 1e3 + s
        },
        add: function(b, T, w) {
            var C = T ? function(A, O, P, E) {
                b(A, O, P, E),
                p.remove(C)
            }
            : b;
            return p.remove(b),
            a[w ? "unshift" : "push"](C),
            Bn(),
            C
        },
        remove: function(b, T) {
            ~(T = a.indexOf(b)) && a.splice(T, 1) && f >= T && f--
        },
        _listeners: a
    },
    p
}(), Bn = function() {
    return !xs && ir.wake()
}, St = {}, yp = /^[\d.\-M][\d.\-,\s]/, bp = /["']/g, wp = function(t) {
    for (var e = {}, r = t.substr(1, t.length - 3).split(":"), i = r[0], s = 1, o = r.length, a, u, l; s < o; s++)
        u = r[s],
        a = s !== o - 1 ? u.lastIndexOf(",") : u.length,
        l = u.substr(0, a),
        e[i] = isNaN(l) ? l.replace(bp, "").trim() : +l,
        i = u.substr(a + 1).trim();
    return e
}, Ep = function(t) {
    var e = t.indexOf("(") + 1
      , r = t.indexOf(")")
      , i = t.indexOf("(", e);
    return t.substring(e, ~i && i < r ? t.indexOf(")", r + 1) : r)
}, xp = function(t) {
    var e = (t + "").split("(")
      , r = St[e[0]];
    return r && e.length > 1 && r.config ? r.config.apply(null, ~t.indexOf("{") ? [wp(e[1])] : Ep(t).split(",").map(af)) : St._CE && yp.test(t) ? St._CE("", t) : r
}, Sf = function(t) {
    return function(e) {
        return 1 - t(1 - e)
    }
}, Cf = function n(t, e) {
    for (var r = t._first, i; r; )
        r instanceof Ne ? n(r, e) : r.vars.yoyoEase && (!r._yoyo || !r._repeat) && r._yoyo !== e && (r.timeline ? n(r.timeline, e) : (i = r._ease,
        r._ease = r._yEase,
        r._yEase = i,
        r._yoyo = e)),
        r = r._next
}, Zi = function(t, e) {
    return t && (Jt(t) ? t : St[t] || xp(t)) || e
}, hn = function(t, e, r, i) {
    r === void 0 && (r = function(u) {
        return 1 - e(1 - u)
    }
    ),
    i === void 0 && (i = function(u) {
        return u < .5 ? e(u * 2) / 2 : 1 - e((1 - u) * 2) / 2
    }
    );
    var s = {
        easeIn: e,
        easeOut: r,
        easeInOut: i
    }, o;
    return Ue(t, function(a) {
        St[a] = ar[a] = s,
        St[o = a.toLowerCase()] = r;
        for (var u in s)
            St[o + (u === "easeIn" ? ".in" : u === "easeOut" ? ".out" : ".inOut")] = St[a + "." + u] = s[u]
    }),
    s
}, Af = function(t) {
    return function(e) {
        return e < .5 ? (1 - t(1 - e * 2)) / 2 : .5 + t((e - .5) * 2) / 2
    }
}, _a = function n(t, e, r) {
    var i = e >= 1 ? e : 1
      , s = (r || (t ? .3 : .45)) / (e < 1 ? e : 1)
      , o = s / Na * (Math.asin(1 / i) || 0)
      , a = function(c) {
        return c === 1 ? 1 : i * Math.pow(2, -10 * c) * Zd((c - o) * s) + 1
    }
      , u = t === "out" ? a : t === "in" ? function(l) {
        return 1 - a(1 - l)
    }
    : Af(a);
    return s = Na / s,
    u.config = function(l, c) {
        return n(t, l, c)
    }
    ,
    u
}, ga = function n(t, e) {
    e === void 0 && (e = 1.70158);
    var r = function(o) {
        return o ? --o * o * ((e + 1) * o + e) + 1 : 0
    }
      , i = t === "out" ? r : t === "in" ? function(s) {
        return 1 - r(1 - s)
    }
    : Af(r);
    return i.config = function(s) {
        return n(t, s)
    }
    ,
    i
};
Ue("Linear,Quad,Cubic,Quart,Quint,Strong", function(n, t) {
    var e = t < 5 ? t + 1 : t;
    hn(n + ",Power" + (e - 1), t ? function(r) {
        return Math.pow(r, e)
    }
    : function(r) {
        return r
    }
    , function(r) {
        return 1 - Math.pow(1 - r, e)
    }, function(r) {
        return r < .5 ? Math.pow(r * 2, e) / 2 : 1 - Math.pow((1 - r) * 2, e) / 2
    })
});
St.Linear.easeNone = St.none = St.Linear.easeIn;
hn("Elastic", _a("in"), _a("out"), _a());
(function(n, t) {
    var e = 1 / t
      , r = 2 * e
      , i = 2.5 * e
      , s = function(a) {
        return a < e ? n * a * a : a < r ? n * Math.pow(a - 1.5 / t, 2) + .75 : a < i ? n * (a -= 2.25 / t) * a + .9375 : n * Math.pow(a - 2.625 / t, 2) + .984375
    };
    hn("Bounce", function(o) {
        return 1 - s(1 - o)
    }, s)
}
)(7.5625, 2.75);
hn("Expo", function(n) {
    return n ? Math.pow(2, 10 * (n - 1)) : 0
});
hn("Circ", function(n) {
    return -(jc(1 - n * n) - 1)
});
hn("Sine", function(n) {
    return n === 1 ? 1 : -Kd(n * Hd) + 1
});
hn("Back", ga("in"), ga("out"), ga());
St.SteppedEase = St.steps = ar.SteppedEase = {
    config: function(t, e) {
        t === void 0 && (t = 1);
        var r = 1 / t
          , i = t + (e ? 0 : 1)
          , s = e ? 1 : 0
          , o = 1 - It;
        return function(a) {
            return ((i * Fs(0, o, a) | 0) + s) * r
        }
    }
};
Nn.ease = St["quad.out"];
Ue("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(n) {
    return Au += n + "," + n + "Params,"
});
var Of = function(t, e) {
    this.id = jd++,
    t._gsap = this,
    this.target = t,
    this.harness = e,
    this.get = e ? e.get : sf,
    this.set = e ? e.getSetter : Du
}
  , Ts = function() {
    function n(e) {
        this.vars = e,
        this._delay = +e.delay || 0,
        (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0,
        this._yoyo = !!e.yoyo || !!e.yoyoEase),
        this._ts = 1,
        Fn(this, +e.duration, 1, 1),
        this.data = e.data,
        Wt && (this._ctx = Wt,
        Wt.data.push(this)),
        xs || ir.wake()
    }
    var t = n.prototype;
    return t.delay = function(r) {
        return r || r === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + r - this._delay),
        this._delay = r,
        this) : this._delay
    }
    ,
    t.duration = function(r) {
        return arguments.length ? this.totalDuration(this._repeat > 0 ? r + (r + this._rDelay) * this._repeat : r) : this.totalDuration() && this._dur
    }
    ,
    t.totalDuration = function(r) {
        return arguments.length ? (this._dirty = 0,
        Fn(this, this._repeat < 0 ? r : (r - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur
    }
    ,
    t.totalTime = function(r, i) {
        if (Bn(),
        !arguments.length)
            return this._tTime;
        var s = this._dp;
        if (s && s.smoothChildTiming && this._ts) {
            for (Go(this, r),
            !s._dp || s.parent || cf(s, this); s && s.parent; )
                s.parent._time !== s._start + (s._ts >= 0 ? s._tTime / s._ts : (s.totalDuration() - s._tTime) / -s._ts) && s.totalTime(s._tTime, !0),
                s = s.parent;
            !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && r < this._tDur || this._ts < 0 && r > 0 || !this._tDur && !r) && $r(this._dp, this, this._start - this._delay)
        }
        return (this._tTime !== r || !this._dur && !i || this._initted && Math.abs(this._zTime) === It || !r && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = r),
        of(this, r, i)),
        this
    }
    ,
    t.time = function(r, i) {
        return arguments.length ? this.totalTime(Math.min(this.totalDuration(), r + wl(this)) % (this._dur + this._rDelay) || (r ? this._dur : 0), i) : this._time
    }
    ,
    t.totalProgress = function(r, i) {
        return arguments.length ? this.totalTime(this.totalDuration() * r, i) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0
    }
    ,
    t.progress = function(r, i) {
        return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - r : r) + wl(this), i) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0
    }
    ,
    t.iteration = function(r, i) {
        var s = this.duration() + this._rDelay;
        return arguments.length ? this.totalTime(this._time + (r - 1) * s, i) : this._repeat ? zn(this._tTime, s) + 1 : 1
    }
    ,
    t.timeScale = function(r, i) {
        if (!arguments.length)
            return this._rts === -It ? 0 : this._rts;
        if (this._rts === r)
            return this;
        var s = this.parent && this._ts ? ko(this.parent._time, this) : this._tTime;
        return this._rts = +r || 0,
        this._ts = this._ps || r === -It ? 0 : this._rts,
        this.totalTime(Fs(-Math.abs(this._delay), this._tDur, s), i !== !1),
        qo(this),
        np(this)
    }
    ,
    t.paused = function(r) {
        return arguments.length ? (this._ps !== r && (this._ps = r,
        r ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()),
        this._ts = this._act = 0) : (Bn(),
        this._ts = this._rts,
        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== It && (this._tTime -= It)))),
        this) : this._ps
    }
    ,
    t.startTime = function(r) {
        if (arguments.length) {
            this._start = r;
            var i = this.parent || this._dp;
            return i && (i._sort || !this.parent) && $r(i, this, r - this._delay),
            this
        }
        return this._start
    }
    ,
    t.endTime = function(r) {
        return this._start + (Xe(r) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1)
    }
    ,
    t.rawTime = function(r) {
        var i = this.parent || this._dp;
        return i ? r && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? ko(i.rawTime(r), this) : this._tTime : this._tTime
    }
    ,
    t.revert = function(r) {
        r === void 0 && (r = tp);
        var i = Te;
        return Te = r,
        (this._initted || this._startAt) && (this.timeline && this.timeline.revert(r),
        this.totalTime(-.01, r.suppressEvents)),
        this.data !== "nested" && r.kill !== !1 && this.kill(),
        Te = i,
        this
    }
    ,
    t.globalTime = function(r) {
        for (var i = this, s = arguments.length ? r : i.rawTime(); i; )
            s = i._start + s / (Math.abs(i._ts) || 1),
            i = i._dp;
        return !this.parent && this._sat ? this._sat.globalTime(r) : s
    }
    ,
    t.repeat = function(r) {
        return arguments.length ? (this._repeat = r === 1 / 0 ? -2 : r,
        El(this)) : this._repeat === -2 ? 1 / 0 : this._repeat
    }
    ,
    t.repeatDelay = function(r) {
        if (arguments.length) {
            var i = this._time;
            return this._rDelay = r,
            El(this),
            i ? this.time(i) : this
        }
        return this._rDelay
    }
    ,
    t.yoyo = function(r) {
        return arguments.length ? (this._yoyo = r,
        this) : this._yoyo
    }
    ,
    t.seek = function(r, i) {
        return this.totalTime(cr(this, r), Xe(i))
    }
    ,
    t.restart = function(r, i) {
        return this.play().totalTime(r ? -this._delay : 0, Xe(i))
    }
    ,
    t.play = function(r, i) {
        return r != null && this.seek(r, i),
        this.reversed(!1).paused(!1)
    }
    ,
    t.reverse = function(r, i) {
        return r != null && this.seek(r || this.totalDuration(), i),
        this.reversed(!0).paused(!1)
    }
    ,
    t.pause = function(r, i) {
        return r != null && this.seek(r, i),
        this.paused(!0)
    }
    ,
    t.resume = function() {
        return this.paused(!1)
    }
    ,
    t.reversed = function(r) {
        return arguments.length ? (!!r !== this.reversed() && this.timeScale(-this._rts || (r ? -It : 0)),
        this) : this._rts < 0
    }
    ,
    t.invalidate = function() {
        return this._initted = this._act = 0,
        this._zTime = -It,
        this
    }
    ,
    t.isActive = function() {
        var r = this.parent || this._dp, i = this._start, s;
        return !!(!r || this._ts && this._initted && r.isActive() && (s = r.rawTime(!0)) >= i && s < this.endTime(!0) - It)
    }
    ,
    t.eventCallback = function(r, i, s) {
        var o = this.vars;
        return arguments.length > 1 ? (i ? (o[r] = i,
        s && (o[r + "Params"] = s),
        r === "onUpdate" && (this._onUpdate = i)) : delete o[r],
        this) : o[r]
    }
    ,
    t.then = function(r) {
        var i = this;
        return new Promise(function(s) {
            var o = Jt(r) ? r : uf
              , a = function() {
                var l = i.then;
                i.then = null,
                Jt(o) && (o = o(i)) && (o.then || o === i) && (i.then = l),
                s(o),
                i.then = l
            };
            i._initted && i.totalProgress() === 1 && i._ts >= 0 || !i._tTime && i._ts < 0 ? a() : i._prom = a
        }
        )
    }
    ,
    t.kill = function() {
        Jn(this)
    }
    ,
    n
}();
vr(Ts.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: !1,
    parent: null,
    _initted: !1,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -It,
    _prom: 0,
    _ps: !1,
    _rts: 1
});
var Ne = function(n) {
    Hc(t, n);
    function t(r, i) {
        var s;
        return r === void 0 && (r = {}),
        s = n.call(this, r) || this,
        s.labels = {},
        s.smoothChildTiming = !!r.smoothChildTiming,
        s.autoRemoveChildren = !!r.autoRemoveChildren,
        s._sort = Xe(r.sortChildren),
        Ut && $r(r.parent || Ut, ni(s), i),
        r.reversed && s.reverse(),
        r.paused && s.paused(!0),
        r.scrollTrigger && ff(ni(s), r.scrollTrigger),
        s
    }
    var e = t.prototype;
    return e.to = function(i, s, o) {
        return as(0, arguments, this),
        this
    }
    ,
    e.from = function(i, s, o) {
        return as(1, arguments, this),
        this
    }
    ,
    e.fromTo = function(i, s, o, a) {
        return as(2, arguments, this),
        this
    }
    ,
    e.set = function(i, s, o) {
        return s.duration = 0,
        s.parent = this,
        os(s).repeatDelay || (s.repeat = 0),
        s.immediateRender = !!s.immediateRender,
        new ae(i,s,cr(this, o),1),
        this
    }
    ,
    e.call = function(i, s, o) {
        return $r(this, ae.delayedCall(0, i, s), o)
    }
    ,
    e.staggerTo = function(i, s, o, a, u, l, c) {
        return o.duration = s,
        o.stagger = o.stagger || a,
        o.onComplete = l,
        o.onCompleteParams = c,
        o.parent = this,
        new ae(i,o,cr(this, u)),
        this
    }
    ,
    e.staggerFrom = function(i, s, o, a, u, l, c) {
        return o.runBackwards = 1,
        os(o).immediateRender = Xe(o.immediateRender),
        this.staggerTo(i, s, o, a, u, l, c)
    }
    ,
    e.staggerFromTo = function(i, s, o, a, u, l, c, p) {
        return a.startAt = o,
        os(a).immediateRender = Xe(a.immediateRender),
        this.staggerTo(i, s, a, u, l, c, p)
    }
    ,
    e.render = function(i, s, o) {
        var a = this._time, u = this._dirty ? this.totalDuration() : this._tDur, l = this._dur, c = i <= 0 ? 0 : pe(i), p = this._zTime < 0 != i < 0 && (this._initted || !l), h, f, _, d, b, T, w, C, A, O, P, E;
        if (this !== Ut && c > u && i >= 0 && (c = u),
        c !== this._tTime || o || p) {
            if (a !== this._time && l && (c += this._time - a,
            i += this._time - a),
            h = c,
            A = this._start,
            C = this._ts,
            T = !C,
            p && (l || (a = this._zTime),
            (i || !s) && (this._zTime = i)),
            this._repeat) {
                if (P = this._yoyo,
                b = l + this._rDelay,
                this._repeat < -1 && i < 0)
                    return this.totalTime(b * 100 + i, s, o);
                if (h = pe(c % b),
                c === u ? (d = this._repeat,
                h = l) : (d = ~~(c / b),
                d && d === c / b && (h = l,
                d--),
                h > l && (h = l)),
                O = zn(this._tTime, b),
                !a && this._tTime && O !== d && this._tTime - O * b - this._dur <= 0 && (O = d),
                P && d & 1 && (h = l - h,
                E = 1),
                d !== O && !this._lock) {
                    var L = P && O & 1
                      , M = L === (P && d & 1);
                    if (d < O && (L = !L),
                    a = L ? 0 : c % l ? l : c,
                    this._lock = 1,
                    this.render(a || (E ? 0 : pe(d * b)), s, !l)._lock = 0,
                    this._tTime = c,
                    !s && this.parent && sr(this, "onRepeat"),
                    this.vars.repeatRefresh && !E && (this.invalidate()._lock = 1),
                    a && a !== this._time || T !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
                        return this;
                    if (l = this._dur,
                    u = this._tDur,
                    M && (this._lock = 2,
                    a = L ? l : -1e-4,
                    this.render(a, !0),
                    this.vars.repeatRefresh && !E && this.invalidate()),
                    this._lock = 0,
                    !this._ts && !T)
                        return this;
                    Cf(this, E)
                }
            }
            if (this._hasPause && !this._forcing && this._lock < 2 && (w = up(this, pe(a), pe(h)),
            w && (c -= h - (h = w._start))),
            this._tTime = c,
            this._time = h,
            this._act = !C,
            this._initted || (this._onUpdate = this.vars.onUpdate,
            this._initted = 1,
            this._zTime = i,
            a = 0),
            !a && h && !s && !d && (sr(this, "onStart"),
            this._tTime !== c))
                return this;
            if (h >= a && i >= 0)
                for (f = this._first; f; ) {
                    if (_ = f._next,
                    (f._act || h >= f._start) && f._ts && w !== f) {
                        if (f.parent !== this)
                            return this.render(i, s, o);
                        if (f.render(f._ts > 0 ? (h - f._start) * f._ts : (f._dirty ? f.totalDuration() : f._tDur) + (h - f._start) * f._ts, s, o),
                        h !== this._time || !this._ts && !T) {
                            w = 0,
                            _ && (c += this._zTime = -It);
                            break
                        }
                    }
                    f = _
                }
            else {
                f = this._last;
                for (var D = i < 0 ? i : h; f; ) {
                    if (_ = f._prev,
                    (f._act || D <= f._end) && f._ts && w !== f) {
                        if (f.parent !== this)
                            return this.render(i, s, o);
                        if (f.render(f._ts > 0 ? (D - f._start) * f._ts : (f._dirty ? f.totalDuration() : f._tDur) + (D - f._start) * f._ts, s, o || Te && (f._initted || f._startAt)),
                        h !== this._time || !this._ts && !T) {
                            w = 0,
                            _ && (c += this._zTime = D ? -It : It);
                            break
                        }
                    }
                    f = _
                }
            }
            if (w && !s && (this.pause(),
            w.render(h >= a ? 0 : -It)._zTime = h >= a ? 1 : -1,
            this._ts))
                return this._start = A,
                qo(this),
                this.render(i, s, o);
            this._onUpdate && !s && sr(this, "onUpdate", !0),
            (c === u && this._tTime >= this.totalDuration() || !c && a) && (A === this._start || Math.abs(C) !== Math.abs(this._ts)) && (this._lock || ((i || !l) && (c === u && this._ts > 0 || !c && this._ts < 0) && Oi(this, 1),
            !s && !(i < 0 && !a) && (c || a || !u) && (sr(this, c === u && i >= 0 ? "onComplete" : "onReverseComplete", !0),
            this._prom && !(c < u && this.timeScale() > 0) && this._prom())))
        }
        return this
    }
    ,
    e.add = function(i, s) {
        var o = this;
        if (di(s) || (s = cr(this, s, i)),
        !(i instanceof Ts)) {
            if (Se(i))
                return i.forEach(function(a) {
                    return o.add(a, s)
                }),
                this;
            if (_e(i))
                return this.addLabel(i, s);
            if (Jt(i))
                i = ae.delayedCall(0, i);
            else
                return this
        }
        return this !== i ? $r(this, i, s) : this
    }
    ,
    e.getChildren = function(i, s, o, a) {
        i === void 0 && (i = !0),
        s === void 0 && (s = !0),
        o === void 0 && (o = !0),
        a === void 0 && (a = -pr);
        for (var u = [], l = this._first; l; )
            l._start >= a && (l instanceof ae ? s && u.push(l) : (o && u.push(l),
            i && u.push.apply(u, l.getChildren(!0, s, o)))),
            l = l._next;
        return u
    }
    ,
    e.getById = function(i) {
        for (var s = this.getChildren(1, 1, 1), o = s.length; o--; )
            if (s[o].vars.id === i)
                return s[o]
    }
    ,
    e.remove = function(i) {
        return _e(i) ? this.removeLabel(i) : Jt(i) ? this.killTweensOf(i) : (Uo(this, i),
        i === this._recent && (this._recent = this._last),
        Ki(this))
    }
    ,
    e.totalTime = function(i, s) {
        return arguments.length ? (this._forcing = 1,
        !this._dp && this._ts && (this._start = pe(ir.time - (this._ts > 0 ? i / this._ts : (this.totalDuration() - i) / -this._ts))),
        n.prototype.totalTime.call(this, i, s),
        this._forcing = 0,
        this) : this._tTime
    }
    ,
    e.addLabel = function(i, s) {
        return this.labels[i] = cr(this, s),
        this
    }
    ,
    e.removeLabel = function(i) {
        return delete this.labels[i],
        this
    }
    ,
    e.addPause = function(i, s, o) {
        var a = ae.delayedCall(0, s || ws, o);
        return a.data = "isPause",
        this._hasPause = 1,
        $r(this, a, cr(this, i))
    }
    ,
    e.removePause = function(i) {
        var s = this._first;
        for (i = cr(this, i); s; )
            s._start === i && s.data === "isPause" && Oi(s),
            s = s._next
    }
    ,
    e.killTweensOf = function(i, s, o) {
        for (var a = this.getTweensOf(i, o), u = a.length; u--; )
            yi !== a[u] && a[u].kill(i, s);
        return this
    }
    ,
    e.getTweensOf = function(i, s) {
        for (var o = [], a = _r(i), u = this._first, l = di(s), c; u; )
            u instanceof ae ? ep(u._targets, a) && (l ? (!yi || u._initted && u._ts) && u.globalTime(0) <= s && u.globalTime(u.totalDuration()) > s : !s || u.isActive()) && o.push(u) : (c = u.getTweensOf(a, s)).length && o.push.apply(o, c),
            u = u._next;
        return o
    }
    ,
    e.tweenTo = function(i, s) {
        s = s || {};
        var o = this, a = cr(o, i), u = s, l = u.startAt, c = u.onStart, p = u.onStartParams, h = u.immediateRender, f, _ = ae.to(o, vr({
            ease: s.ease || "none",
            lazy: !1,
            immediateRender: !1,
            time: a,
            overwrite: "auto",
            duration: s.duration || Math.abs((a - (l && "time"in l ? l.time : o._time)) / o.timeScale()) || It,
            onStart: function() {
                if (o.pause(),
                !f) {
                    var b = s.duration || Math.abs((a - (l && "time"in l ? l.time : o._time)) / o.timeScale());
                    _._dur !== b && Fn(_, b, 0, 1).render(_._time, !0, !0),
                    f = 1
                }
                c && c.apply(_, p || [])
            }
        }, s));
        return h ? _.render(0) : _
    }
    ,
    e.tweenFromTo = function(i, s, o) {
        return this.tweenTo(s, vr({
            startAt: {
                time: cr(this, i)
            }
        }, o))
    }
    ,
    e.recent = function() {
        return this._recent
    }
    ,
    e.nextLabel = function(i) {
        return i === void 0 && (i = this._time),
        xl(this, cr(this, i))
    }
    ,
    e.previousLabel = function(i) {
        return i === void 0 && (i = this._time),
        xl(this, cr(this, i), 1)
    }
    ,
    e.currentLabel = function(i) {
        return arguments.length ? this.seek(i, !0) : this.previousLabel(this._time + It)
    }
    ,
    e.shiftChildren = function(i, s, o) {
        o === void 0 && (o = 0);
        for (var a = this._first, u = this.labels, l; a; )
            a._start >= o && (a._start += i,
            a._end += i),
            a = a._next;
        if (s)
            for (l in u)
                u[l] >= o && (u[l] += i);
        return Ki(this)
    }
    ,
    e.invalidate = function(i) {
        var s = this._first;
        for (this._lock = 0; s; )
            s.invalidate(i),
            s = s._next;
        return n.prototype.invalidate.call(this, i)
    }
    ,
    e.clear = function(i) {
        i === void 0 && (i = !0);
        for (var s = this._first, o; s; )
            o = s._next,
            this.remove(s),
            s = o;
        return this._dp && (this._time = this._tTime = this._pTime = 0),
        i && (this.labels = {}),
        Ki(this)
    }
    ,
    e.totalDuration = function(i) {
        var s = 0, o = this, a = o._last, u = pr, l, c, p;
        if (arguments.length)
            return o.timeScale((o._repeat < 0 ? o.duration() : o.totalDuration()) / (o.reversed() ? -i : i));
        if (o._dirty) {
            for (p = o.parent; a; )
                l = a._prev,
                a._dirty && a.totalDuration(),
                c = a._start,
                c > u && o._sort && a._ts && !o._lock ? (o._lock = 1,
                $r(o, a, c - a._delay, 1)._lock = 0) : u = c,
                c < 0 && a._ts && (s -= c,
                (!p && !o._dp || p && p.smoothChildTiming) && (o._start += c / o._ts,
                o._time -= c,
                o._tTime -= c),
                o.shiftChildren(-c, !1, -1 / 0),
                u = 0),
                a._end > s && a._ts && (s = a._end),
                a = l;
            Fn(o, o === Ut && o._time > s ? o._time : s, 1, 1),
            o._dirty = 0
        }
        return o._tDur
    }
    ,
    t.updateRoot = function(i) {
        if (Ut._ts && (of(Ut, ko(i, Ut)),
        nf = ir.frame),
        ir.frame >= yl) {
            yl += or.autoSleep || 120;
            var s = Ut._first;
            if ((!s || !s._ts) && or.autoSleep && ir._listeners.length < 2) {
                for (; s && !s._ts; )
                    s = s._next;
                s || ir.sleep()
            }
        }
    }
    ,
    t
}(Ts);
vr(Ne.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
});
var Tp = function(t, e, r, i, s, o, a) {
    var u = new qe(this._pt,t,e,0,1,Rf,null,s), l = 0, c = 0, p, h, f, _, d, b, T, w;
    for (u.b = r,
    u.e = i,
    r += "",
    i += "",
    (T = ~i.indexOf("random(")) && (i = Es(i)),
    o && (w = [r, i],
    o(w, t, e),
    r = w[0],
    i = w[1]),
    h = r.match(ha) || []; p = ha.exec(i); )
        _ = p[0],
        d = i.substring(l, p.index),
        f ? f = (f + 1) % 5 : d.substr(-5) === "rgba(" && (f = 1),
        _ !== h[c++] && (b = parseFloat(h[c - 1]) || 0,
        u._pt = {
            _next: u._pt,
            p: d || c === 1 ? d : ",",
            s: b,
            c: _.charAt(1) === "=" ? On(b, _) - b : parseFloat(_) - b,
            m: f && f < 4 ? Math.round : 0
        },
        l = ha.lastIndex);
    return u.c = l < i.length ? i.substring(l, i.length) : "",
    u.fp = a,
    (Jc.test(i) || T) && (u.e = 0),
    this._pt = u,
    u
}, Pu = function(t, e, r, i, s, o, a, u, l, c) {
    Jt(i) && (i = i(s || 0, t, o));
    var p = t[e], h = r !== "get" ? r : Jt(p) ? l ? t[e.indexOf("set") || !Jt(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](l) : t[e]() : p, f = Jt(p) ? l ? Pp : Df : Lu, _;
    if (_e(i) && (~i.indexOf("random(") && (i = Es(i)),
    i.charAt(1) === "=" && (_ = On(h, i) + (xe(h) || 0),
    (_ || _ === 0) && (i = _))),
    !c || h !== i || Ua)
        return !isNaN(h * i) && i !== "" ? (_ = new qe(this._pt,t,e,+h || 0,i - (h || 0),typeof p == "boolean" ? Lp : Mf,0,f),
        l && (_.fp = l),
        a && _.modifier(a, this, t),
        this._pt = _) : (!p && !(e in t) && Su(e, i),
        Tp.call(this, t, e, h, i, f, u || or.stringFilter, l))
}, Sp = function(t, e, r, i, s) {
    if (Jt(t) && (t = us(t, s, e, r, i)),
    !Gr(t) || t.style && t.nodeType || Se(t) || Kc(t))
        return _e(t) ? us(t, s, e, r, i) : t;
    var o = {}, a;
    for (a in t)
        o[a] = us(t[a], s, e, r, i);
    return o
}, Pf = function(t, e, r, i, s, o) {
    var a, u, l, c;
    if (rr[t] && (a = new rr[t]).init(s, a.rawVars ? e[t] : Sp(e[t], i, s, o, r), r, i, o) !== !1 && (r._pt = u = new qe(r._pt,s,t,0,1,a.render,a,0,a.priority),
    r !== Sn))
        for (l = r._ptLookup[r._targets.indexOf(s)],
        c = a._props.length; c--; )
            l[a._props[c]] = u;
    return a
}, yi, Ua, ku = function n(t, e, r) {
    var i = t.vars, s = i.ease, o = i.startAt, a = i.immediateRender, u = i.lazy, l = i.onUpdate, c = i.runBackwards, p = i.yoyoEase, h = i.keyframes, f = i.autoRevert, _ = t._dur, d = t._startAt, b = t._targets, T = t.parent, w = T && T.data === "nested" ? T.vars.targets : b, C = t._overwrite === "auto" && !wu, A = t.timeline, O, P, E, L, M, D, F, k, $, U, W, q, K;
    if (A && (!h || !s) && (s = "none"),
    t._ease = Zi(s, Nn.ease),
    t._yEase = p ? Sf(Zi(p === !0 ? s : p, Nn.ease)) : 0,
    p && t._yoyo && !t._repeat && (p = t._yEase,
    t._yEase = t._ease,
    t._ease = p),
    t._from = !A && !!i.runBackwards,
    !A || h && !i.stagger) {
        if (k = b[0] ? ji(b[0]).harness : 0,
        q = k && i[k.prop],
        O = Po(i, Cu),
        d && (d._zTime < 0 && d.progress(1),
        e < 0 && c && a && !f ? d.render(-1, !0) : d.revert(c && _ ? fo : Qd),
        d._lazy = 0),
        o) {
            if (Oi(t._startAt = ae.set(b, vr({
                data: "isStart",
                overwrite: !1,
                parent: T,
                immediateRender: !0,
                lazy: !d && Xe(u),
                startAt: null,
                delay: 0,
                onUpdate: l && function() {
                    return sr(t, "onUpdate")
                }
                ,
                stagger: 0
            }, o))),
            t._startAt._dp = 0,
            t._startAt._sat = t,
            e < 0 && (Te || !a && !f) && t._startAt.revert(fo),
            a && _ && e <= 0 && r <= 0) {
                e && (t._zTime = e);
                return
            }
        } else if (c && _ && !d) {
            if (e && (a = !1),
            E = vr({
                overwrite: !1,
                data: "isFromStart",
                lazy: a && !d && Xe(u),
                immediateRender: a,
                stagger: 0,
                parent: T
            }, O),
            q && (E[k.prop] = q),
            Oi(t._startAt = ae.set(b, E)),
            t._startAt._dp = 0,
            t._startAt._sat = t,
            e < 0 && (Te ? t._startAt.revert(fo) : t._startAt.render(-1, !0)),
            t._zTime = e,
            !a)
                n(t._startAt, It, It);
            else if (!e)
                return
        }
        for (t._pt = t._ptCache = 0,
        u = _ && Xe(u) || u && !_,
        P = 0; P < b.length; P++) {
            if (M = b[P],
            F = M._gsap || Ou(b)[P]._gsap,
            t._ptLookup[P] = U = {},
            Ba[F.id] && Si.length && Oo(),
            W = w === b ? P : w.indexOf(M),
            k && ($ = new k).init(M, q || O, t, W, w) !== !1 && (t._pt = L = new qe(t._pt,M,$.name,0,1,$.render,$,0,$.priority),
            $._props.forEach(function(H) {
                U[H] = L
            }),
            $.priority && (D = 1)),
            !k || q)
                for (E in O)
                    rr[E] && ($ = Pf(E, O, t, W, M, w)) ? $.priority && (D = 1) : U[E] = L = Pu.call(t, M, E, "get", O[E], W, w, 0, i.stringFilter);
            t._op && t._op[P] && t.kill(M, t._op[P]),
            C && t._pt && (yi = t,
            Ut.killTweensOf(M, U, t.globalTime(e)),
            K = !t.parent,
            yi = 0),
            t._pt && u && (Ba[F.id] = 1)
        }
        D && If(t),
        t._onInit && t._onInit(t)
    }
    t._onUpdate = l,
    t._initted = (!t._op || t._pt) && !K,
    h && e <= 0 && A.render(pr, !0, !0)
}, Cp = function(t, e, r, i, s, o, a, u) {
    var l = (t._pt && t._ptCache || (t._ptCache = {}))[e], c, p, h, f;
    if (!l)
        for (l = t._ptCache[e] = [],
        h = t._ptLookup,
        f = t._targets.length; f--; ) {
            if (c = h[f][e],
            c && c.d && c.d._pt)
                for (c = c.d._pt; c && c.p !== e && c.fp !== e; )
                    c = c._next;
            if (!c)
                return Ua = 1,
                t.vars[e] = "+=0",
                ku(t, a),
                Ua = 0,
                u ? bs(e + " not eligible for reset") : 1;
            l.push(c)
        }
    for (f = l.length; f--; )
        p = l[f],
        c = p._pt || p,
        c.s = (i || i === 0) && !s ? i : c.s + (i || 0) + o * c.c,
        c.c = r - c.s,
        p.e && (p.e = re(r) + xe(p.e)),
        p.b && (p.b = c.s + xe(p.b))
}, Ap = function(t, e) {
    var r = t[0] ? ji(t[0]).harness : 0, i = r && r.aliases, s, o, a, u;
    if (!i)
        return e;
    s = sn({}, e);
    for (o in i)
        if (o in s)
            for (u = i[o].split(","),
            a = u.length; a--; )
                s[u[a]] = s[o];
    return s
}, Op = function(t, e, r, i) {
    var s = e.ease || i || "power1.inOut", o, a;
    if (Se(e))
        a = r[t] || (r[t] = []),
        e.forEach(function(u, l) {
            return a.push({
                t: l / (e.length - 1) * 100,
                v: u,
                e: s
            })
        });
    else
        for (o in e)
            a = r[o] || (r[o] = []),
            o === "ease" || a.push({
                t: parseFloat(t),
                v: e[o],
                e: s
            })
}, us = function(t, e, r, i, s) {
    return Jt(t) ? t.call(e, r, i, s) : _e(t) && ~t.indexOf("random(") ? Es(t) : t
}, kf = Au + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", Lf = {};
Ue(kf + ",id,stagger,delay,duration,paused,scrollTrigger", function(n) {
    return Lf[n] = 1
});
var ae = function(n) {
    Hc(t, n);
    function t(r, i, s, o) {
        var a;
        typeof i == "number" && (s.duration = i,
        i = s,
        s = null),
        a = n.call(this, o ? i : os(i)) || this;
        var u = a.vars, l = u.duration, c = u.delay, p = u.immediateRender, h = u.stagger, f = u.overwrite, _ = u.keyframes, d = u.defaults, b = u.scrollTrigger, T = u.yoyoEase, w = i.parent || Ut, C = (Se(r) || Kc(r) ? di(r[0]) : "length"in i) ? [r] : _r(r), A, O, P, E, L, M, D, F;
        if (a._targets = C.length ? Ou(C) : bs("GSAP target " + r + " not found. https://gsap.com", !or.nullTargetWarn) || [],
        a._ptLookup = [],
        a._overwrite = f,
        _ || h || Ks(l) || Ks(c)) {
            if (i = a.vars,
            A = a.timeline = new Ne({
                data: "nested",
                defaults: d || {},
                targets: w && w.data === "nested" ? w.vars.targets : C
            }),
            A.kill(),
            A.parent = A._dp = ni(a),
            A._start = 0,
            h || Ks(l) || Ks(c)) {
                if (E = C.length,
                D = h && _f(h),
                Gr(h))
                    for (L in h)
                        ~kf.indexOf(L) && (F || (F = {}),
                        F[L] = h[L]);
                for (O = 0; O < E; O++)
                    P = Po(i, Lf),
                    P.stagger = 0,
                    T && (P.yoyoEase = T),
                    F && sn(P, F),
                    M = C[O],
                    P.duration = +us(l, ni(a), O, M, C),
                    P.delay = (+us(c, ni(a), O, M, C) || 0) - a._delay,
                    !h && E === 1 && P.delay && (a._delay = c = P.delay,
                    a._start += c,
                    P.delay = 0),
                    A.to(M, P, D ? D(O, M, C) : 0),
                    A._ease = St.none;
                A.duration() ? l = c = 0 : a.timeline = 0
            } else if (_) {
                os(vr(A.vars.defaults, {
                    ease: "none"
                })),
                A._ease = Zi(_.ease || i.ease || "none");
                var k = 0, $, U, W;
                if (Se(_))
                    _.forEach(function(q) {
                        return A.to(C, q, ">")
                    }),
                    A.duration();
                else {
                    P = {};
                    for (L in _)
                        L === "ease" || L === "easeEach" || Op(L, _[L], P, _.easeEach);
                    for (L in P)
                        for ($ = P[L].sort(function(q, K) {
                            return q.t - K.t
                        }),
                        k = 0,
                        O = 0; O < $.length; O++)
                            U = $[O],
                            W = {
                                ease: U.e,
                                duration: (U.t - (O ? $[O - 1].t : 0)) / 100 * l
                            },
                            W[L] = U.v,
                            A.to(C, W, k),
                            k += W.duration;
                    A.duration() < l && A.to({}, {
                        duration: l - A.duration()
                    })
                }
            }
            l || a.duration(l = A.duration())
        } else
            a.timeline = 0;
        return f === !0 && !wu && (yi = ni(a),
        Ut.killTweensOf(C),
        yi = 0),
        $r(w, ni(a), s),
        i.reversed && a.reverse(),
        i.paused && a.paused(!0),
        (p || !l && !_ && a._start === pe(w._time) && Xe(p) && sp(ni(a)) && w.data !== "nested") && (a._tTime = -It,
        a.render(Math.max(0, -c) || 0)),
        b && ff(ni(a), b),
        a
    }
    var e = t.prototype;
    return e.render = function(i, s, o) {
        var a = this._time, u = this._tDur, l = this._dur, c = i < 0, p = i > u - It && !c ? u : i < It ? 0 : i, h, f, _, d, b, T, w, C, A;
        if (!l)
            ap(this, i, s, o);
        else if (p !== this._tTime || !i || o || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== c) {
            if (h = p,
            C = this.timeline,
            this._repeat) {
                if (d = l + this._rDelay,
                this._repeat < -1 && c)
                    return this.totalTime(d * 100 + i, s, o);
                if (h = pe(p % d),
                p === u ? (_ = this._repeat,
                h = l) : (_ = ~~(p / d),
                _ && _ === pe(p / d) && (h = l,
                _--),
                h > l && (h = l)),
                T = this._yoyo && _ & 1,
                T && (A = this._yEase,
                h = l - h),
                b = zn(this._tTime, d),
                h === a && !o && this._initted && _ === b)
                    return this._tTime = p,
                    this;
                _ !== b && (C && this._yEase && Cf(C, T),
                this.vars.repeatRefresh && !T && !this._lock && this._time !== d && this._initted && (this._lock = o = 1,
                this.render(pe(d * _), !0).invalidate()._lock = 0))
            }
            if (!this._initted) {
                if (hf(this, c ? i : h, o, s, p))
                    return this._tTime = 0,
                    this;
                if (a !== this._time && !(o && this.vars.repeatRefresh && _ !== b))
                    return this;
                if (l !== this._dur)
                    return this.render(i, s, o)
            }
            if (this._tTime = p,
            this._time = h,
            !this._act && this._ts && (this._act = 1,
            this._lazy = 0),
            this.ratio = w = (A || this._ease)(h / l),
            this._from && (this.ratio = w = 1 - w),
            h && !a && !s && !_ && (sr(this, "onStart"),
            this._tTime !== p))
                return this;
            for (f = this._pt; f; )
                f.r(w, f.d),
                f = f._next;
            C && C.render(i < 0 ? i : C._dur * C._ease(h / this._dur), s, o) || this._startAt && (this._zTime = i),
            this._onUpdate && !s && (c && Va(this, i, s, o),
            sr(this, "onUpdate")),
            this._repeat && _ !== b && this.vars.onRepeat && !s && this.parent && sr(this, "onRepeat"),
            (p === this._tDur || !p) && this._tTime === p && (c && !this._onUpdate && Va(this, i, !0, !0),
            (i || !l) && (p === this._tDur && this._ts > 0 || !p && this._ts < 0) && Oi(this, 1),
            !s && !(c && !a) && (p || a || T) && (sr(this, p === u ? "onComplete" : "onReverseComplete", !0),
            this._prom && !(p < u && this.timeScale() > 0) && this._prom()))
        }
        return this
    }
    ,
    e.targets = function() {
        return this._targets
    }
    ,
    e.invalidate = function(i) {
        return (!i || !this.vars.runBackwards) && (this._startAt = 0),
        this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0,
        this._ptLookup = [],
        this.timeline && this.timeline.invalidate(i),
        n.prototype.invalidate.call(this, i)
    }
    ,
    e.resetTo = function(i, s, o, a, u) {
        xs || ir.wake(),
        this._ts || this.play();
        var l = Math.min(this._dur, (this._dp._time - this._start) * this._ts), c;
        return this._initted || ku(this, l),
        c = this._ease(l / this._dur),
        Cp(this, i, s, o, a, c, l, u) ? this.resetTo(i, s, o, a, 1) : (Go(this, 0),
        this.parent || lf(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0),
        this.render(0))
    }
    ,
    e.kill = function(i, s) {
        if (s === void 0 && (s = "all"),
        !i && (!s || s === "all"))
            return this._lazy = this._pt = 0,
            this.parent ? Jn(this) : this;
        if (this.timeline) {
            var o = this.timeline.totalDuration();
            return this.timeline.killTweensOf(i, s, yi && yi.vars.overwrite !== !0)._first || Jn(this),
            this.parent && o !== this.timeline.totalDuration() && Fn(this, this._dur * this.timeline._tDur / o, 0, 1),
            this
        }
        var a = this._targets, u = i ? _r(i) : a, l = this._ptLookup, c = this._pt, p, h, f, _, d, b, T;
        if ((!s || s === "all") && ip(a, u))
            return s === "all" && (this._pt = 0),
            Jn(this);
        for (p = this._op = this._op || [],
        s !== "all" && (_e(s) && (d = {},
        Ue(s, function(w) {
            return d[w] = 1
        }),
        s = d),
        s = Ap(a, s)),
        T = a.length; T--; )
            if (~u.indexOf(a[T])) {
                h = l[T],
                s === "all" ? (p[T] = s,
                _ = h,
                f = {}) : (f = p[T] = p[T] || {},
                _ = s);
                for (d in _)
                    b = h && h[d],
                    b && ((!("kill"in b.d) || b.d.kill(d) === !0) && Uo(this, b, "_pt"),
                    delete h[d]),
                    f !== "all" && (f[d] = 1)
            }
        return this._initted && !this._pt && c && Jn(this),
        this
    }
    ,
    t.to = function(i, s) {
        return new t(i,s,arguments[2])
    }
    ,
    t.from = function(i, s) {
        return as(1, arguments)
    }
    ,
    t.delayedCall = function(i, s, o, a) {
        return new t(s,0,{
            immediateRender: !1,
            lazy: !1,
            overwrite: !1,
            delay: i,
            onComplete: s,
            onReverseComplete: s,
            onCompleteParams: o,
            onReverseCompleteParams: o,
            callbackScope: a
        })
    }
    ,
    t.fromTo = function(i, s, o) {
        return as(2, arguments)
    }
    ,
    t.set = function(i, s) {
        return s.duration = 0,
        s.repeatDelay || (s.repeat = 0),
        new t(i,s)
    }
    ,
    t.killTweensOf = function(i, s, o) {
        return Ut.killTweensOf(i, s, o)
    }
    ,
    t
}(Ts);
vr(ae.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
});
Ue("staggerTo,staggerFrom,staggerFromTo", function(n) {
    ae[n] = function() {
        var t = new Ne
          , e = Wa.call(arguments, 0);
        return e.splice(n === "staggerFromTo" ? 5 : 4, 0, 0),
        t[n].apply(t, e)
    }
});
var Lu = function(t, e, r) {
    return t[e] = r
}
  , Df = function(t, e, r) {
    return t[e](r)
}
  , Pp = function(t, e, r, i) {
    return t[e](i.fp, r)
}
  , kp = function(t, e, r) {
    return t.setAttribute(e, r)
}
  , Du = function(t, e) {
    return Jt(t[e]) ? Df : Eu(t[e]) && t.setAttribute ? kp : Lu
}
  , Mf = function(t, e) {
    return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e6) / 1e6, e)
}
  , Lp = function(t, e) {
    return e.set(e.t, e.p, !!(e.s + e.c * t), e)
}
  , Rf = function(t, e) {
    var r = e._pt
      , i = "";
    if (!t && e.b)
        i = e.b;
    else if (t === 1 && e.e)
        i = e.e;
    else {
        for (; r; )
            i = r.p + (r.m ? r.m(r.s + r.c * t) : Math.round((r.s + r.c * t) * 1e4) / 1e4) + i,
            r = r._next;
        i += e.c
    }
    e.set(e.t, e.p, i, e)
}
  , Mu = function(t, e) {
    for (var r = e._pt; r; )
        r.r(t, r.d),
        r = r._next
}
  , Dp = function(t, e, r, i) {
    for (var s = this._pt, o; s; )
        o = s._next,
        s.p === i && s.modifier(t, e, r),
        s = o
}
  , Mp = function(t) {
    for (var e = this._pt, r, i; e; )
        i = e._next,
        e.p === t && !e.op || e.op === t ? Uo(this, e, "_pt") : e.dep || (r = 1),
        e = i;
    return !r
}
  , Rp = function(t, e, r, i) {
    i.mSet(t, e, i.m.call(i.tween, r, i.mt), i)
}
  , If = function(t) {
    for (var e = t._pt, r, i, s, o; e; ) {
        for (r = e._next,
        i = s; i && i.pr > e.pr; )
            i = i._next;
        (e._prev = i ? i._prev : o) ? e._prev._next = e : s = e,
        (e._next = i) ? i._prev = e : o = e,
        e = r
    }
    t._pt = s
}
  , qe = function() {
    function n(e, r, i, s, o, a, u, l, c) {
        this.t = r,
        this.s = s,
        this.c = o,
        this.p = i,
        this.r = a || Mf,
        this.d = u || this,
        this.set = l || Lu,
        this.pr = c || 0,
        this._next = e,
        e && (e._prev = this)
    }
    var t = n.prototype;
    return t.modifier = function(r, i, s) {
        this.mSet = this.mSet || this.set,
        this.set = Rp,
        this.m = r,
        this.mt = s,
        this.tween = i
    }
    ,
    n
}();
Ue(Au + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(n) {
    return Cu[n] = 1
});
ar.TweenMax = ar.TweenLite = ae;
ar.TimelineLite = ar.TimelineMax = Ne;
Ut = new Ne({
    sortChildren: !1,
    defaults: Nn,
    autoRemoveChildren: !0,
    id: "root",
    smoothChildTiming: !0
});
or.stringFilter = Tf;
var Ji = []
  , po = {}
  , Ip = []
  , Sl = 0
  , Np = 0
  , ma = function(t) {
    return (po[t] || Ip).map(function(e) {
        return e()
    })
}
  , qa = function() {
    var t = Date.now()
      , e = [];
    t - Sl > 2 && (ma("matchMediaInit"),
    Ji.forEach(function(r) {
        var i = r.queries, s = r.conditions, o, a, u, l;
        for (a in i)
            o = Br.matchMedia(i[a]).matches,
            o && (u = 1),
            o !== s[a] && (s[a] = o,
            l = 1);
        l && (r.revert(),
        u && e.push(r))
    }),
    ma("matchMediaRevert"),
    e.forEach(function(r) {
        return r.onMatch(r, function(i) {
            return r.add(null, i)
        })
    }),
    Sl = t,
    ma("matchMedia"))
}
  , Nf = function() {
    function n(e, r) {
        this.selector = r && Ya(r),
        this.data = [],
        this._r = [],
        this.isReverted = !1,
        this.id = Np++,
        e && this.add(e)
    }
    var t = n.prototype;
    return t.add = function(r, i, s) {
        Jt(r) && (s = i,
        i = r,
        r = Jt);
        var o = this
          , a = function() {
            var l = Wt, c = o.selector, p;
            return l && l !== o && l.data.push(o),
            s && (o.selector = Ya(s)),
            Wt = o,
            p = i.apply(o, arguments),
            Jt(p) && o._r.push(p),
            Wt = l,
            o.selector = c,
            o.isReverted = !1,
            p
        };
        return o.last = a,
        r === Jt ? a(o, function(u) {
            return o.add(null, u)
        }) : r ? o[r] = a : a
    }
    ,
    t.ignore = function(r) {
        var i = Wt;
        Wt = null,
        r(this),
        Wt = i
    }
    ,
    t.getTweens = function() {
        var r = [];
        return this.data.forEach(function(i) {
            return i instanceof n ? r.push.apply(r, i.getTweens()) : i instanceof ae && !(i.parent && i.parent.data === "nested") && r.push(i)
        }),
        r
    }
    ,
    t.clear = function() {
        this._r.length = this.data.length = 0
    }
    ,
    t.kill = function(r, i) {
        var s = this;
        if (r ? function() {
            for (var a = s.getTweens(), u = s.data.length, l; u--; )
                l = s.data[u],
                l.data === "isFlip" && (l.revert(),
                l.getChildren(!0, !0, !1).forEach(function(c) {
                    return a.splice(a.indexOf(c), 1)
                }));
            for (a.map(function(c) {
                return {
                    g: c._dur || c._delay || c._sat && !c._sat.vars.immediateRender ? c.globalTime(0) : -1 / 0,
                    t: c
                }
            }).sort(function(c, p) {
                return p.g - c.g || -1 / 0
            }).forEach(function(c) {
                return c.t.revert(r)
            }),
            u = s.data.length; u--; )
                l = s.data[u],
                l instanceof Ne ? l.data !== "nested" && (l.scrollTrigger && l.scrollTrigger.revert(),
                l.kill()) : !(l instanceof ae) && l.revert && l.revert(r);
            s._r.forEach(function(c) {
                return c(r, s)
            }),
            s.isReverted = !0
        }() : this.data.forEach(function(a) {
            return a.kill && a.kill()
        }),
        this.clear(),
        i)
            for (var o = Ji.length; o--; )
                Ji[o].id === this.id && Ji.splice(o, 1)
    }
    ,
    t.revert = function(r) {
        this.kill(r || {})
    }
    ,
    n
}()
  , zp = function() {
    function n(e) {
        this.contexts = [],
        this.scope = e,
        Wt && Wt.data.push(this)
    }
    var t = n.prototype;
    return t.add = function(r, i, s) {
        Gr(r) || (r = {
            matches: r
        });
        var o = new Nf(0,s || this.scope), a = o.conditions = {}, u, l, c;
        Wt && !o.selector && (o.selector = Wt.selector),
        this.contexts.push(o),
        i = o.add("onMatch", i),
        o.queries = r;
        for (l in r)
            l === "all" ? c = 1 : (u = Br.matchMedia(r[l]),
            u && (Ji.indexOf(o) < 0 && Ji.push(o),
            (a[l] = u.matches) && (c = 1),
            u.addListener ? u.addListener(qa) : u.addEventListener("change", qa)));
        return c && i(o, function(p) {
            return o.add(null, p)
        }),
        this
    }
    ,
    t.revert = function(r) {
        this.kill(r || {})
    }
    ,
    t.kill = function(r) {
        this.contexts.forEach(function(i) {
            return i.kill(r, !0)
        })
    }
    ,
    n
}()
  , Lo = {
    registerPlugin: function() {
        for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
            e[r] = arguments[r];
        e.forEach(function(i) {
            return wf(i)
        })
    },
    timeline: function(t) {
        return new Ne(t)
    },
    getTweensOf: function(t, e) {
        return Ut.getTweensOf(t, e)
    },
    getProperty: function(t, e, r, i) {
        _e(t) && (t = _r(t)[0]);
        var s = ji(t || {}).get
          , o = r ? uf : af;
        return r === "native" && (r = ""),
        t && (e ? o((rr[e] && rr[e].get || s)(t, e, r, i)) : function(a, u, l) {
            return o((rr[a] && rr[a].get || s)(t, a, u, l))
        }
        )
    },
    quickSetter: function(t, e, r) {
        if (t = _r(t),
        t.length > 1) {
            var i = t.map(function(c) {
                return He.quickSetter(c, e, r)
            })
              , s = i.length;
            return function(c) {
                for (var p = s; p--; )
                    i[p](c)
            }
        }
        t = t[0] || {};
        var o = rr[e]
          , a = ji(t)
          , u = a.harness && (a.harness.aliases || {})[e] || e
          , l = o ? function(c) {
            var p = new o;
            Sn._pt = 0,
            p.init(t, r ? c + r : c, Sn, 0, [t]),
            p.render(1, p),
            Sn._pt && Mu(1, Sn)
        }
        : a.set(t, u);
        return o ? l : function(c) {
            return l(t, u, r ? c + r : c, a, 1)
        }
    },
    quickTo: function(t, e, r) {
        var i, s = He.to(t, sn((i = {},
        i[e] = "+=0.1",
        i.paused = !0,
        i), r || {})), o = function(u, l, c) {
            return s.resetTo(e, u, l, c)
        };
        return o.tween = s,
        o
    },
    isTweening: function(t) {
        return Ut.getTweensOf(t, !0).length > 0
    },
    defaults: function(t) {
        return t && t.ease && (t.ease = Zi(t.ease, Nn.ease)),
        bl(Nn, t || {})
    },
    config: function(t) {
        return bl(or, t || {})
    },
    registerEffect: function(t) {
        var e = t.name
          , r = t.effect
          , i = t.plugins
          , s = t.defaults
          , o = t.extendTimeline;
        (i || "").split(",").forEach(function(a) {
            return a && !rr[a] && !ar[a] && bs(e + " effect requires " + a + " plugin.")
        }),
        da[e] = function(a, u, l) {
            return r(_r(a), vr(u || {}, s), l)
        }
        ,
        o && (Ne.prototype[e] = function(a, u, l) {
            return this.add(da[e](a, Gr(u) ? u : (l = u) && {}, this), l)
        }
        )
    },
    registerEase: function(t, e) {
        St[t] = Zi(e)
    },
    parseEase: function(t, e) {
        return arguments.length ? Zi(t, e) : St
    },
    getById: function(t) {
        return Ut.getById(t)
    },
    exportRoot: function(t, e) {
        t === void 0 && (t = {});
        var r = new Ne(t), i, s;
        for (r.smoothChildTiming = Xe(t.smoothChildTiming),
        Ut.remove(r),
        r._dp = 0,
        r._time = r._tTime = Ut._time,
        i = Ut._first; i; )
            s = i._next,
            (e || !(!i._dur && i instanceof ae && i.vars.onComplete === i._targets[0])) && $r(r, i, i._start - i._delay),
            i = s;
        return $r(Ut, r, 0),
        r
    },
    context: function(t, e) {
        return t ? new Nf(t,e) : Wt
    },
    matchMedia: function(t) {
        return new zp(t)
    },
    matchMediaRefresh: function() {
        return Ji.forEach(function(t) {
            var e = t.conditions, r, i;
            for (i in e)
                e[i] && (e[i] = !1,
                r = 1);
            r && t.revert()
        }) || qa()
    },
    addEventListener: function(t, e) {
        var r = po[t] || (po[t] = []);
        ~r.indexOf(e) || r.push(e)
    },
    removeEventListener: function(t, e) {
        var r = po[t]
          , i = r && r.indexOf(e);
        i >= 0 && r.splice(i, 1)
    },
    utils: {
        wrap: _p,
        wrapYoyo: gp,
        distribute: _f,
        random: mf,
        snap: gf,
        normalize: pp,
        getUnit: xe,
        clamp: cp,
        splitColor: Ef,
        toArray: _r,
        selector: Ya,
        mapRange: yf,
        pipe: hp,
        unitize: dp,
        interpolate: mp,
        shuffle: pf
    },
    install: ef,
    effects: da,
    ticker: ir,
    updateRoot: Ne.updateRoot,
    plugins: rr,
    globalTimeline: Ut,
    core: {
        PropTween: qe,
        globals: rf,
        Tween: ae,
        Timeline: Ne,
        Animation: Ts,
        getCache: ji,
        _removeLinkedListItem: Uo,
        reverting: function() {
            return Te
        },
        context: function(t) {
            return t && Wt && (Wt.data.push(t),
            t._ctx = Wt),
            Wt
        },
        suppressOverwrites: function(t) {
            return wu = t
        }
    }
};
Ue("to,from,fromTo,delayedCall,set,killTweensOf", function(n) {
    return Lo[n] = ae[n]
});
ir.add(Ne.updateRoot);
Sn = Lo.to({}, {
    duration: 0
});
var Fp = function(t, e) {
    for (var r = t._pt; r && r.p !== e && r.op !== e && r.fp !== e; )
        r = r._next;
    return r
}
  , Bp = function(t, e) {
    var r = t._targets, i, s, o;
    for (i in e)
        for (s = r.length; s--; )
            o = t._ptLookup[s][i],
            o && (o = o.d) && (o._pt && (o = Fp(o, i)),
            o && o.modifier && o.modifier(e[i], t, r[s], i))
}
  , va = function(t, e) {
    return {
        name: t,
        rawVars: 1,
        init: function(i, s, o) {
            o._onInit = function(a) {
                var u, l;
                if (_e(s) && (u = {},
                Ue(s, function(c) {
                    return u[c] = 1
                }),
                s = u),
                e) {
                    u = {};
                    for (l in s)
                        u[l] = e(s[l]);
                    s = u
                }
                Bp(a, s)
            }
        }
    }
}
  , He = Lo.registerPlugin({
    name: "attr",
    init: function(t, e, r, i, s) {
        var o, a, u;
        this.tween = r;
        for (o in e)
            u = t.getAttribute(o) || "",
            a = this.add(t, "setAttribute", (u || 0) + "", e[o], i, s, 0, 0, o),
            a.op = o,
            a.b = u,
            this._props.push(o)
    },
    render: function(t, e) {
        for (var r = e._pt; r; )
            Te ? r.set(r.t, r.p, r.b, r) : r.r(t, r.d),
            r = r._next
    }
}, {
    name: "endArray",
    init: function(t, e) {
        for (var r = e.length; r--; )
            this.add(t, r, t[r] || 0, e[r], 0, 0, 0, 0, 0, 1)
    }
}, va("roundProps", Xa), va("modifiers"), va("snap", gf)) || Lo;
ae.version = Ne.version = He.version = "3.12.5";
tf = 1;
xu() && Bn();
St.Power0;
St.Power1;
St.Power2;
St.Power3;
St.Power4;
St.Linear;
St.Quad;
St.Cubic;
St.Quart;
St.Quint;
St.Strong;
St.Elastic;
St.Back;
St.SteppedEase;
St.Bounce;
St.Sine;
St.Expo;
St.Circ;
/*!
 * CSSPlugin 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var Cl, bi, Pn, Ru, Gi, Al, Iu, Vp = function() {
    return typeof window < "u"
}, pi = {}, Wi = 180 / Math.PI, kn = Math.PI / 180, mn = Math.atan2, Ol = 1e8, Nu = /([A-Z])/g, $p = /(left|right|width|margin|padding|x)/i, Wp = /[\s,\(]\S/, Yr = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity"
}, Ga = function(t, e) {
    return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e)
}, Yp = function(t, e) {
    return e.set(e.t, e.p, t === 1 ? e.e : Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e)
}, Xp = function(t, e) {
    return e.set(e.t, e.p, t ? Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u : e.b, e)
}, Up = function(t, e) {
    var r = e.s + e.c * t;
    e.set(e.t, e.p, ~~(r + (r < 0 ? -.5 : .5)) + e.u, e)
}, zf = function(t, e) {
    return e.set(e.t, e.p, t ? e.e : e.b, e)
}, Ff = function(t, e) {
    return e.set(e.t, e.p, t !== 1 ? e.b : e.e, e)
}, qp = function(t, e, r) {
    return t.style[e] = r
}, Gp = function(t, e, r) {
    return t.style.setProperty(e, r)
}, Hp = function(t, e, r) {
    return t._gsap[e] = r
}, jp = function(t, e, r) {
    return t._gsap.scaleX = t._gsap.scaleY = r
}, Kp = function(t, e, r, i, s) {
    var o = t._gsap;
    o.scaleX = o.scaleY = r,
    o.renderTransform(s, o)
}, Zp = function(t, e, r, i, s) {
    var o = t._gsap;
    o[e] = r,
    o.renderTransform(s, o)
}, qt = "transform", Ge = qt + "Origin", Jp = function n(t, e) {
    var r = this
      , i = this.target
      , s = i.style
      , o = i._gsap;
    if (t in pi && s) {
        if (this.tfm = this.tfm || {},
        t !== "transform")
            t = Yr[t] || t,
            ~t.indexOf(",") ? t.split(",").forEach(function(a) {
                return r.tfm[a] = si(i, a)
            }) : this.tfm[t] = o.x ? o[t] : si(i, t),
            t === Ge && (this.tfm.zOrigin = o.zOrigin);
        else
            return Yr.transform.split(",").forEach(function(a) {
                return n.call(r, a, e)
            });
        if (this.props.indexOf(qt) >= 0)
            return;
        o.svg && (this.svgo = i.getAttribute("data-svg-origin"),
        this.props.push(Ge, e, "")),
        t = qt
    }
    (s || e) && this.props.push(t, e, s[t])
}, Bf = function(t) {
    t.translate && (t.removeProperty("translate"),
    t.removeProperty("scale"),
    t.removeProperty("rotate"))
}, Qp = function() {
    var t = this.props, e = this.target, r = e.style, i = e._gsap, s, o;
    for (s = 0; s < t.length; s += 3)
        t[s + 1] ? e[t[s]] = t[s + 2] : t[s + 2] ? r[t[s]] = t[s + 2] : r.removeProperty(t[s].substr(0, 2) === "--" ? t[s] : t[s].replace(Nu, "-$1").toLowerCase());
    if (this.tfm) {
        for (o in this.tfm)
            i[o] = this.tfm[o];
        i.svg && (i.renderTransform(),
        e.setAttribute("data-svg-origin", this.svgo || "")),
        s = Iu(),
        (!s || !s.isStart) && !r[qt] && (Bf(r),
        i.zOrigin && r[Ge] && (r[Ge] += " " + i.zOrigin + "px",
        i.zOrigin = 0,
        i.renderTransform()),
        i.uncache = 1)
    }
}, Vf = function(t, e) {
    var r = {
        target: t,
        props: [],
        revert: Qp,
        save: Jp
    };
    return t._gsap || He.core.getCache(t),
    e && e.split(",").forEach(function(i) {
        return r.save(i)
    }),
    r
}, $f, Ha = function(t, e) {
    var r = bi.createElementNS ? bi.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : bi.createElement(t);
    return r && r.style ? r : bi.createElement(t)
}, Ur = function n(t, e, r) {
    var i = getComputedStyle(t);
    return i[e] || i.getPropertyValue(e.replace(Nu, "-$1").toLowerCase()) || i.getPropertyValue(e) || !r && n(t, Vn(e) || e, 1) || ""
}, Pl = "O,Moz,ms,Ms,Webkit".split(","), Vn = function(t, e, r) {
    var i = e || Gi
      , s = i.style
      , o = 5;
    if (t in s && !r)
        return t;
    for (t = t.charAt(0).toUpperCase() + t.substr(1); o-- && !(Pl[o] + t in s); )
        ;
    return o < 0 ? null : (o === 3 ? "ms" : o >= 0 ? Pl[o] : "") + t
}, ja = function() {
    Vp() && window.document && (Cl = window,
    bi = Cl.document,
    Pn = bi.documentElement,
    Gi = Ha("div") || {
        style: {}
    },
    Ha("div"),
    qt = Vn(qt),
    Ge = qt + "Origin",
    Gi.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0",
    $f = !!Vn("perspective"),
    Iu = He.core.reverting,
    Ru = 1)
}, ya = function n(t) {
    var e = Ha("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), r = this.parentNode, i = this.nextSibling, s = this.style.cssText, o;
    if (Pn.appendChild(e),
    e.appendChild(this),
    this.style.display = "block",
    t)
        try {
            o = this.getBBox(),
            this._gsapBBox = this.getBBox,
            this.getBBox = n
        } catch {}
    else
        this._gsapBBox && (o = this._gsapBBox());
    return r && (i ? r.insertBefore(this, i) : r.appendChild(this)),
    Pn.removeChild(e),
    this.style.cssText = s,
    o
}, kl = function(t, e) {
    for (var r = e.length; r--; )
        if (t.hasAttribute(e[r]))
            return t.getAttribute(e[r])
}, Wf = function(t) {
    var e;
    try {
        e = t.getBBox()
    } catch {
        e = ya.call(t, !0)
    }
    return e && (e.width || e.height) || t.getBBox === ya || (e = ya.call(t, !0)),
    e && !e.width && !e.x && !e.y ? {
        x: +kl(t, ["x", "cx", "x1"]) || 0,
        y: +kl(t, ["y", "cy", "y1"]) || 0,
        width: 0,
        height: 0
    } : e
}, Yf = function(t) {
    return !!(t.getCTM && (!t.parentNode || t.ownerSVGElement) && Wf(t))
}, on = function(t, e) {
    if (e) {
        var r = t.style, i;
        e in pi && e !== Ge && (e = qt),
        r.removeProperty ? (i = e.substr(0, 2),
        (i === "ms" || e.substr(0, 6) === "webkit") && (e = "-" + e),
        r.removeProperty(i === "--" ? e : e.replace(Nu, "-$1").toLowerCase())) : r.removeAttribute(e)
    }
}, wi = function(t, e, r, i, s, o) {
    var a = new qe(t._pt,e,r,0,1,o ? Ff : zf);
    return t._pt = a,
    a.b = i,
    a.e = s,
    t._props.push(r),
    a
}, Ll = {
    deg: 1,
    rad: 1,
    turn: 1
}, t_ = {
    grid: 1,
    flex: 1
}, Pi = function n(t, e, r, i) {
    var s = parseFloat(r) || 0, o = (r + "").trim().substr((s + "").length) || "px", a = Gi.style, u = $p.test(e), l = t.tagName.toLowerCase() === "svg", c = (l ? "client" : "offset") + (u ? "Width" : "Height"), p = 100, h = i === "px", f = i === "%", _, d, b, T;
    if (i === o || !s || Ll[i] || Ll[o])
        return s;
    if (o !== "px" && !h && (s = n(t, e, r, "px")),
    T = t.getCTM && Yf(t),
    (f || o === "%") && (pi[e] || ~e.indexOf("adius")))
        return _ = T ? t.getBBox()[u ? "width" : "height"] : t[c],
        re(f ? s / _ * p : s / 100 * _);
    if (a[u ? "width" : "height"] = p + (h ? o : i),
    d = ~e.indexOf("adius") || i === "em" && t.appendChild && !l ? t : t.parentNode,
    T && (d = (t.ownerSVGElement || {}).parentNode),
    (!d || d === bi || !d.appendChild) && (d = bi.body),
    b = d._gsap,
    b && f && b.width && u && b.time === ir.time && !b.uncache)
        return re(s / b.width * p);
    if (f && (e === "height" || e === "width")) {
        var w = t.style[e];
        t.style[e] = p + i,
        _ = t[c],
        w ? t.style[e] = w : on(t, e)
    } else
        (f || o === "%") && !t_[Ur(d, "display")] && (a.position = Ur(t, "position")),
        d === t && (a.position = "static"),
        d.appendChild(Gi),
        _ = Gi[c],
        d.removeChild(Gi),
        a.position = "absolute";
    return u && f && (b = ji(d),
    b.time = ir.time,
    b.width = d[c]),
    re(h ? _ * s / p : _ && s ? p / _ * s : 0)
}, si = function(t, e, r, i) {
    var s;
    return Ru || ja(),
    e in Yr && e !== "transform" && (e = Yr[e],
    ~e.indexOf(",") && (e = e.split(",")[0])),
    pi[e] && e !== "transform" ? (s = Cs(t, i),
    s = e !== "transformOrigin" ? s[e] : s.svg ? s.origin : Mo(Ur(t, Ge)) + " " + s.zOrigin + "px") : (s = t.style[e],
    (!s || s === "auto" || i || ~(s + "").indexOf("calc(")) && (s = Do[e] && Do[e](t, e, r) || Ur(t, e) || sf(t, e) || (e === "opacity" ? 1 : 0))),
    r && !~(s + "").trim().indexOf(" ") ? Pi(t, e, s, r) + r : s
}, e_ = function(t, e, r, i) {
    if (!r || r === "none") {
        var s = Vn(e, t, 1)
          , o = s && Ur(t, s, 1);
        o && o !== r ? (e = s,
        r = o) : e === "borderColor" && (r = Ur(t, "borderTopColor"))
    }
    var a = new qe(this._pt,t.style,e,0,1,Rf), u = 0, l = 0, c, p, h, f, _, d, b, T, w, C, A, O;
    if (a.b = r,
    a.e = i,
    r += "",
    i += "",
    i === "auto" && (d = t.style[e],
    t.style[e] = i,
    i = Ur(t, e) || i,
    d ? t.style[e] = d : on(t, e)),
    c = [r, i],
    Tf(c),
    r = c[0],
    i = c[1],
    h = r.match(Tn) || [],
    O = i.match(Tn) || [],
    O.length) {
        for (; p = Tn.exec(i); )
            b = p[0],
            w = i.substring(u, p.index),
            _ ? _ = (_ + 1) % 5 : (w.substr(-5) === "rgba(" || w.substr(-5) === "hsla(") && (_ = 1),
            b !== (d = h[l++] || "") && (f = parseFloat(d) || 0,
            A = d.substr((f + "").length),
            b.charAt(1) === "=" && (b = On(f, b) + A),
            T = parseFloat(b),
            C = b.substr((T + "").length),
            u = Tn.lastIndex - C.length,
            C || (C = C || or.units[e] || A,
            u === i.length && (i += C,
            a.e += C)),
            A !== C && (f = Pi(t, e, d, C) || 0),
            a._pt = {
                _next: a._pt,
                p: w || l === 1 ? w : ",",
                s: f,
                c: T - f,
                m: _ && _ < 4 || e === "zIndex" ? Math.round : 0
            });
        a.c = u < i.length ? i.substring(u, i.length) : ""
    } else
        a.r = e === "display" && i === "none" ? Ff : zf;
    return Jc.test(i) && (a.e = 0),
    this._pt = a,
    a
}, Dl = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%"
}, r_ = function(t) {
    var e = t.split(" ")
      , r = e[0]
      , i = e[1] || "50%";
    return (r === "top" || r === "bottom" || i === "left" || i === "right") && (t = r,
    r = i,
    i = t),
    e[0] = Dl[r] || r,
    e[1] = Dl[i] || i,
    e.join(" ")
}, i_ = function(t, e) {
    if (e.tween && e.tween._time === e.tween._dur) {
        var r = e.t, i = r.style, s = e.u, o = r._gsap, a, u, l;
        if (s === "all" || s === !0)
            i.cssText = "",
            u = 1;
        else
            for (s = s.split(","),
            l = s.length; --l > -1; )
                a = s[l],
                pi[a] && (u = 1,
                a = a === "transformOrigin" ? Ge : qt),
                on(r, a);
        u && (on(r, qt),
        o && (o.svg && r.removeAttribute("transform"),
        Cs(r, 1),
        o.uncache = 1,
        Bf(i)))
    }
}, Do = {
    clearProps: function(t, e, r, i, s) {
        if (s.data !== "isFromStart") {
            var o = t._pt = new qe(t._pt,e,r,0,0,i_);
            return o.u = i,
            o.pr = -10,
            o.tween = s,
            t._props.push(r),
            1
        }
    }
}, Ss = [1, 0, 0, 1, 0, 0], Xf = {}, Uf = function(t) {
    return t === "matrix(1, 0, 0, 1, 0, 0)" || t === "none" || !t
}, Ml = function(t) {
    var e = Ur(t, qt);
    return Uf(e) ? Ss : e.substr(7).match(Zc).map(re)
}, zu = function(t, e) {
    var r = t._gsap || ji(t), i = t.style, s = Ml(t), o, a, u, l;
    return r.svg && t.getAttribute("transform") ? (u = t.transform.baseVal.consolidate().matrix,
    s = [u.a, u.b, u.c, u.d, u.e, u.f],
    s.join(",") === "1,0,0,1,0,0" ? Ss : s) : (s === Ss && !t.offsetParent && t !== Pn && !r.svg && (u = i.display,
    i.display = "block",
    o = t.parentNode,
    (!o || !t.offsetParent) && (l = 1,
    a = t.nextElementSibling,
    Pn.appendChild(t)),
    s = Ml(t),
    u ? i.display = u : on(t, "display"),
    l && (a ? o.insertBefore(t, a) : o ? o.appendChild(t) : Pn.removeChild(t))),
    e && s.length > 6 ? [s[0], s[1], s[4], s[5], s[12], s[13]] : s)
}, Ka = function(t, e, r, i, s, o) {
    var a = t._gsap, u = s || zu(t, !0), l = a.xOrigin || 0, c = a.yOrigin || 0, p = a.xOffset || 0, h = a.yOffset || 0, f = u[0], _ = u[1], d = u[2], b = u[3], T = u[4], w = u[5], C = e.split(" "), A = parseFloat(C[0]) || 0, O = parseFloat(C[1]) || 0, P, E, L, M;
    r ? u !== Ss && (E = f * b - _ * d) && (L = A * (b / E) + O * (-d / E) + (d * w - b * T) / E,
    M = A * (-_ / E) + O * (f / E) - (f * w - _ * T) / E,
    A = L,
    O = M) : (P = Wf(t),
    A = P.x + (~C[0].indexOf("%") ? A / 100 * P.width : A),
    O = P.y + (~(C[1] || C[0]).indexOf("%") ? O / 100 * P.height : O)),
    i || i !== !1 && a.smooth ? (T = A - l,
    w = O - c,
    a.xOffset = p + (T * f + w * d) - T,
    a.yOffset = h + (T * _ + w * b) - w) : a.xOffset = a.yOffset = 0,
    a.xOrigin = A,
    a.yOrigin = O,
    a.smooth = !!i,
    a.origin = e,
    a.originIsAbsolute = !!r,
    t.style[Ge] = "0px 0px",
    o && (wi(o, a, "xOrigin", l, A),
    wi(o, a, "yOrigin", c, O),
    wi(o, a, "xOffset", p, a.xOffset),
    wi(o, a, "yOffset", h, a.yOffset)),
    t.setAttribute("data-svg-origin", A + " " + O)
}, Cs = function(t, e) {
    var r = t._gsap || new Of(t);
    if ("x"in r && !e && !r.uncache)
        return r;
    var i = t.style, s = r.scaleX < 0, o = "px", a = "deg", u = getComputedStyle(t), l = Ur(t, Ge) || "0", c, p, h, f, _, d, b, T, w, C, A, O, P, E, L, M, D, F, k, $, U, W, q, K, H, G, y, j, nt, et, at, Ct;
    return c = p = h = d = b = T = w = C = A = 0,
    f = _ = 1,
    r.svg = !!(t.getCTM && Yf(t)),
    u.translate && ((u.translate !== "none" || u.scale !== "none" || u.rotate !== "none") && (i[qt] = (u.translate !== "none" ? "translate3d(" + (u.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (u.rotate !== "none" ? "rotate(" + u.rotate + ") " : "") + (u.scale !== "none" ? "scale(" + u.scale.split(" ").join(",") + ") " : "") + (u[qt] !== "none" ? u[qt] : "")),
    i.scale = i.rotate = i.translate = "none"),
    E = zu(t, r.svg),
    r.svg && (r.uncache ? (H = t.getBBox(),
    l = r.xOrigin - H.x + "px " + (r.yOrigin - H.y) + "px",
    K = "") : K = !e && t.getAttribute("data-svg-origin"),
    Ka(t, K || l, !!K || r.originIsAbsolute, r.smooth !== !1, E)),
    O = r.xOrigin || 0,
    P = r.yOrigin || 0,
    E !== Ss && (F = E[0],
    k = E[1],
    $ = E[2],
    U = E[3],
    c = W = E[4],
    p = q = E[5],
    E.length === 6 ? (f = Math.sqrt(F * F + k * k),
    _ = Math.sqrt(U * U + $ * $),
    d = F || k ? mn(k, F) * Wi : 0,
    w = $ || U ? mn($, U) * Wi + d : 0,
    w && (_ *= Math.abs(Math.cos(w * kn))),
    r.svg && (c -= O - (O * F + P * $),
    p -= P - (O * k + P * U))) : (Ct = E[6],
    et = E[7],
    y = E[8],
    j = E[9],
    nt = E[10],
    at = E[11],
    c = E[12],
    p = E[13],
    h = E[14],
    L = mn(Ct, nt),
    b = L * Wi,
    L && (M = Math.cos(-L),
    D = Math.sin(-L),
    K = W * M + y * D,
    H = q * M + j * D,
    G = Ct * M + nt * D,
    y = W * -D + y * M,
    j = q * -D + j * M,
    nt = Ct * -D + nt * M,
    at = et * -D + at * M,
    W = K,
    q = H,
    Ct = G),
    L = mn(-$, nt),
    T = L * Wi,
    L && (M = Math.cos(-L),
    D = Math.sin(-L),
    K = F * M - y * D,
    H = k * M - j * D,
    G = $ * M - nt * D,
    at = U * D + at * M,
    F = K,
    k = H,
    $ = G),
    L = mn(k, F),
    d = L * Wi,
    L && (M = Math.cos(L),
    D = Math.sin(L),
    K = F * M + k * D,
    H = W * M + q * D,
    k = k * M - F * D,
    q = q * M - W * D,
    F = K,
    W = H),
    b && Math.abs(b) + Math.abs(d) > 359.9 && (b = d = 0,
    T = 180 - T),
    f = re(Math.sqrt(F * F + k * k + $ * $)),
    _ = re(Math.sqrt(q * q + Ct * Ct)),
    L = mn(W, q),
    w = Math.abs(L) > 2e-4 ? L * Wi : 0,
    A = at ? 1 / (at < 0 ? -at : at) : 0),
    r.svg && (K = t.getAttribute("transform"),
    r.forceCSS = t.setAttribute("transform", "") || !Uf(Ur(t, qt)),
    K && t.setAttribute("transform", K))),
    Math.abs(w) > 90 && Math.abs(w) < 270 && (s ? (f *= -1,
    w += d <= 0 ? 180 : -180,
    d += d <= 0 ? 180 : -180) : (_ *= -1,
    w += w <= 0 ? 180 : -180)),
    e = e || r.uncache,
    r.x = c - ((r.xPercent = c && (!e && r.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-c) ? -50 : 0))) ? t.offsetWidth * r.xPercent / 100 : 0) + o,
    r.y = p - ((r.yPercent = p && (!e && r.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-p) ? -50 : 0))) ? t.offsetHeight * r.yPercent / 100 : 0) + o,
    r.z = h + o,
    r.scaleX = re(f),
    r.scaleY = re(_),
    r.rotation = re(d) + a,
    r.rotationX = re(b) + a,
    r.rotationY = re(T) + a,
    r.skewX = w + a,
    r.skewY = C + a,
    r.transformPerspective = A + o,
    (r.zOrigin = parseFloat(l.split(" ")[2]) || !e && r.zOrigin || 0) && (i[Ge] = Mo(l)),
    r.xOffset = r.yOffset = 0,
    r.force3D = or.force3D,
    r.renderTransform = r.svg ? s_ : $f ? qf : n_,
    r.uncache = 0,
    r
}, Mo = function(t) {
    return (t = t.split(" "))[0] + " " + t[1]
}, ba = function(t, e, r) {
    var i = xe(e);
    return re(parseFloat(e) + parseFloat(Pi(t, "x", r + "px", i))) + i
}, n_ = function(t, e) {
    e.z = "0px",
    e.rotationY = e.rotationX = "0deg",
    e.force3D = 0,
    qf(t, e)
}, Bi = "0deg", Gn = "0px", Vi = ") ", qf = function(t, e) {
    var r = e || this
      , i = r.xPercent
      , s = r.yPercent
      , o = r.x
      , a = r.y
      , u = r.z
      , l = r.rotation
      , c = r.rotationY
      , p = r.rotationX
      , h = r.skewX
      , f = r.skewY
      , _ = r.scaleX
      , d = r.scaleY
      , b = r.transformPerspective
      , T = r.force3D
      , w = r.target
      , C = r.zOrigin
      , A = ""
      , O = T === "auto" && t && t !== 1 || T === !0;
    if (C && (p !== Bi || c !== Bi)) {
        var P = parseFloat(c) * kn, E = Math.sin(P), L = Math.cos(P), M;
        P = parseFloat(p) * kn,
        M = Math.cos(P),
        o = ba(w, o, E * M * -C),
        a = ba(w, a, -Math.sin(P) * -C),
        u = ba(w, u, L * M * -C + C)
    }
    b !== Gn && (A += "perspective(" + b + Vi),
    (i || s) && (A += "translate(" + i + "%, " + s + "%) "),
    (O || o !== Gn || a !== Gn || u !== Gn) && (A += u !== Gn || O ? "translate3d(" + o + ", " + a + ", " + u + ") " : "translate(" + o + ", " + a + Vi),
    l !== Bi && (A += "rotate(" + l + Vi),
    c !== Bi && (A += "rotateY(" + c + Vi),
    p !== Bi && (A += "rotateX(" + p + Vi),
    (h !== Bi || f !== Bi) && (A += "skew(" + h + ", " + f + Vi),
    (_ !== 1 || d !== 1) && (A += "scale(" + _ + ", " + d + Vi),
    w.style[qt] = A || "translate(0, 0)"
}, s_ = function(t, e) {
    var r = e || this, i = r.xPercent, s = r.yPercent, o = r.x, a = r.y, u = r.rotation, l = r.skewX, c = r.skewY, p = r.scaleX, h = r.scaleY, f = r.target, _ = r.xOrigin, d = r.yOrigin, b = r.xOffset, T = r.yOffset, w = r.forceCSS, C = parseFloat(o), A = parseFloat(a), O, P, E, L, M;
    u = parseFloat(u),
    l = parseFloat(l),
    c = parseFloat(c),
    c && (c = parseFloat(c),
    l += c,
    u += c),
    u || l ? (u *= kn,
    l *= kn,
    O = Math.cos(u) * p,
    P = Math.sin(u) * p,
    E = Math.sin(u - l) * -h,
    L = Math.cos(u - l) * h,
    l && (c *= kn,
    M = Math.tan(l - c),
    M = Math.sqrt(1 + M * M),
    E *= M,
    L *= M,
    c && (M = Math.tan(c),
    M = Math.sqrt(1 + M * M),
    O *= M,
    P *= M)),
    O = re(O),
    P = re(P),
    E = re(E),
    L = re(L)) : (O = p,
    L = h,
    P = E = 0),
    (C && !~(o + "").indexOf("px") || A && !~(a + "").indexOf("px")) && (C = Pi(f, "x", o, "px"),
    A = Pi(f, "y", a, "px")),
    (_ || d || b || T) && (C = re(C + _ - (_ * O + d * E) + b),
    A = re(A + d - (_ * P + d * L) + T)),
    (i || s) && (M = f.getBBox(),
    C = re(C + i / 100 * M.width),
    A = re(A + s / 100 * M.height)),
    M = "matrix(" + O + "," + P + "," + E + "," + L + "," + C + "," + A + ")",
    f.setAttribute("transform", M),
    w && (f.style[qt] = M)
}, o_ = function(t, e, r, i, s) {
    var o = 360, a = _e(s), u = parseFloat(s) * (a && ~s.indexOf("rad") ? Wi : 1), l = u - i, c = i + l + "deg", p, h;
    return a && (p = s.split("_")[1],
    p === "short" && (l %= o,
    l !== l % (o / 2) && (l += l < 0 ? o : -o)),
    p === "cw" && l < 0 ? l = (l + o * Ol) % o - ~~(l / o) * o : p === "ccw" && l > 0 && (l = (l - o * Ol) % o - ~~(l / o) * o)),
    t._pt = h = new qe(t._pt,e,r,i,l,Yp),
    h.e = c,
    h.u = "deg",
    t._props.push(r),
    h
}, Rl = function(t, e) {
    for (var r in e)
        t[r] = e[r];
    return t
}, a_ = function(t, e, r) {
    var i = Rl({}, r._gsap), s = "perspective,force3D,transformOrigin,svgOrigin", o = r.style, a, u, l, c, p, h, f, _;
    i.svg ? (l = r.getAttribute("transform"),
    r.setAttribute("transform", ""),
    o[qt] = e,
    a = Cs(r, 1),
    on(r, qt),
    r.setAttribute("transform", l)) : (l = getComputedStyle(r)[qt],
    o[qt] = e,
    a = Cs(r, 1),
    o[qt] = l);
    for (u in pi)
        l = i[u],
        c = a[u],
        l !== c && s.indexOf(u) < 0 && (f = xe(l),
        _ = xe(c),
        p = f !== _ ? Pi(r, u, l, _) : parseFloat(l),
        h = parseFloat(c),
        t._pt = new qe(t._pt,a,u,p,h - p,Ga),
        t._pt.u = _ || 0,
        t._props.push(u));
    Rl(a, i)
};
Ue("padding,margin,Width,Radius", function(n, t) {
    var e = "Top"
      , r = "Right"
      , i = "Bottom"
      , s = "Left"
      , o = (t < 3 ? [e, r, i, s] : [e + s, e + r, i + r, i + s]).map(function(a) {
        return t < 2 ? n + a : "border" + a + n
    });
    Do[t > 1 ? "border" + n : n] = function(a, u, l, c, p) {
        var h, f;
        if (arguments.length < 4)
            return h = o.map(function(_) {
                return si(a, _, l)
            }),
            f = h.join(" "),
            f.split(h[0]).length === 5 ? h[0] : f;
        h = (c + "").split(" "),
        f = {},
        o.forEach(function(_, d) {
            return f[_] = h[d] = h[d] || h[(d - 1) / 2 | 0]
        }),
        a.init(u, f, p)
    }
});
var Gf = {
    name: "css",
    register: ja,
    targetTest: function(t) {
        return t.style && t.nodeType
    },
    init: function(t, e, r, i, s) {
        var o = this._props, a = t.style, u = r.vars.startAt, l, c, p, h, f, _, d, b, T, w, C, A, O, P, E, L;
        Ru || ja(),
        this.styles = this.styles || Vf(t),
        L = this.styles.props,
        this.tween = r;
        for (d in e)
            if (d !== "autoRound" && (c = e[d],
            !(rr[d] && Pf(d, e, r, i, t, s)))) {
                if (f = typeof c,
                _ = Do[d],
                f === "function" && (c = c.call(r, i, t, s),
                f = typeof c),
                f === "string" && ~c.indexOf("random(") && (c = Es(c)),
                _)
                    _(this, t, d, c, r) && (E = 1);
                else if (d.substr(0, 2) === "--")
                    l = (getComputedStyle(t).getPropertyValue(d) + "").trim(),
                    c += "",
                    Ci.lastIndex = 0,
                    Ci.test(l) || (b = xe(l),
                    T = xe(c)),
                    T ? b !== T && (l = Pi(t, d, l, T) + T) : b && (c += b),
                    this.add(a, "setProperty", l, c, i, s, 0, 0, d),
                    o.push(d),
                    L.push(d, 0, a[d]);
                else if (f !== "undefined") {
                    if (u && d in u ? (l = typeof u[d] == "function" ? u[d].call(r, i, t, s) : u[d],
                    _e(l) && ~l.indexOf("random(") && (l = Es(l)),
                    xe(l + "") || l === "auto" || (l += or.units[d] || xe(si(t, d)) || ""),
                    (l + "").charAt(1) === "=" && (l = si(t, d))) : l = si(t, d),
                    h = parseFloat(l),
                    w = f === "string" && c.charAt(1) === "=" && c.substr(0, 2),
                    w && (c = c.substr(2)),
                    p = parseFloat(c),
                    d in Yr && (d === "autoAlpha" && (h === 1 && si(t, "visibility") === "hidden" && p && (h = 0),
                    L.push("visibility", 0, a.visibility),
                    wi(this, a, "visibility", h ? "inherit" : "hidden", p ? "inherit" : "hidden", !p)),
                    d !== "scale" && d !== "transform" && (d = Yr[d],
                    ~d.indexOf(",") && (d = d.split(",")[0]))),
                    C = d in pi,
                    C) {
                        if (this.styles.save(d),
                        A || (O = t._gsap,
                        O.renderTransform && !e.parseTransform || Cs(t, e.parseTransform),
                        P = e.smoothOrigin !== !1 && O.smooth,
                        A = this._pt = new qe(this._pt,a,qt,0,1,O.renderTransform,O,0,-1),
                        A.dep = 1),
                        d === "scale")
                            this._pt = new qe(this._pt,O,"scaleY",O.scaleY,(w ? On(O.scaleY, w + p) : p) - O.scaleY || 0,Ga),
                            this._pt.u = 0,
                            o.push("scaleY", d),
                            d += "X";
                        else if (d === "transformOrigin") {
                            L.push(Ge, 0, a[Ge]),
                            c = r_(c),
                            O.svg ? Ka(t, c, 0, P, 0, this) : (T = parseFloat(c.split(" ")[2]) || 0,
                            T !== O.zOrigin && wi(this, O, "zOrigin", O.zOrigin, T),
                            wi(this, a, d, Mo(l), Mo(c)));
                            continue
                        } else if (d === "svgOrigin") {
                            Ka(t, c, 1, P, 0, this);
                            continue
                        } else if (d in Xf) {
                            o_(this, O, d, h, w ? On(h, w + c) : c);
                            continue
                        } else if (d === "smoothOrigin") {
                            wi(this, O, "smooth", O.smooth, c);
                            continue
                        } else if (d === "force3D") {
                            O[d] = c;
                            continue
                        } else if (d === "transform") {
                            a_(this, c, t);
                            continue
                        }
                    } else
                        d in a || (d = Vn(d) || d);
                    if (C || (p || p === 0) && (h || h === 0) && !Wp.test(c) && d in a)
                        b = (l + "").substr((h + "").length),
                        p || (p = 0),
                        T = xe(c) || (d in or.units ? or.units[d] : b),
                        b !== T && (h = Pi(t, d, l, T)),
                        this._pt = new qe(this._pt,C ? O : a,d,h,(w ? On(h, w + p) : p) - h,!C && (T === "px" || d === "zIndex") && e.autoRound !== !1 ? Up : Ga),
                        this._pt.u = T || 0,
                        b !== T && T !== "%" && (this._pt.b = l,
                        this._pt.r = Xp);
                    else if (d in a)
                        e_.call(this, t, d, l, w ? w + c : c);
                    else if (d in t)
                        this.add(t, d, l || t[d], w ? w + c : c, i, s);
                    else if (d !== "parseTransform") {
                        Su(d, c);
                        continue
                    }
                    C || (d in a ? L.push(d, 0, a[d]) : L.push(d, 1, l || t[d])),
                    o.push(d)
                }
            }
        E && If(this)
    },
    render: function(t, e) {
        if (e.tween._time || !Iu())
            for (var r = e._pt; r; )
                r.r(t, r.d),
                r = r._next;
        else
            e.styles.revert()
    },
    get: si,
    aliases: Yr,
    getSetter: function(t, e, r) {
        var i = Yr[e];
        return i && i.indexOf(",") < 0 && (e = i),
        e in pi && e !== Ge && (t._gsap.x || si(t, "x")) ? r && Al === r ? e === "scale" ? jp : Hp : (Al = r || {}) && (e === "scale" ? Kp : Zp) : t.style && !Eu(t.style[e]) ? qp : ~e.indexOf("-") ? Gp : Du(t, e)
    },
    core: {
        _removeProperty: on,
        _getMatrix: zu
    }
};
He.utils.checkPrefix = Vn;
He.core.getStyleSaver = Vf;
(function(n, t, e, r) {
    var i = Ue(n + "," + t + "," + e, function(s) {
        pi[s] = 1
    });
    Ue(t, function(s) {
        or.units[s] = "deg",
        Xf[s] = 1
    }),
    Yr[i[13]] = n + "," + t,
    Ue(r, function(s) {
        var o = s.split(":");
        Yr[o[1]] = i[o[0]]
    })
}
)("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
Ue("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(n) {
    or.units[n] = "px"
});
He.registerPlugin(Gf);
var We = He.registerPlugin(Gf) || He;
We.core.Tween;
function Il(n, t) {
    for (var e = 0; e < t.length; e++) {
        var r = t[e];
        r.enumerable = r.enumerable || !1,
        r.configurable = !0,
        "value"in r && (r.writable = !0),
        Object.defineProperty(n, r.key, r)
    }
}
function u_(n, t, e) {
    return t && Il(n.prototype, t),
    e && Il(n, e),
    n
}
/*!
 * Observer 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var me, _o, nr, Ei, xi, Ln, Hf, Yi, ls, jf, ui, Cr, Kf, Zf = function() {
    return me || typeof window < "u" && (me = window.gsap) && me.registerPlugin && me
}, Jf = 1, Cn = [], bt = [], qr = [], cs = Date.now, Za = function(t, e) {
    return e
}, l_ = function() {
    var t = ls.core
      , e = t.bridge || {}
      , r = t._scrollers
      , i = t._proxies;
    r.push.apply(r, bt),
    i.push.apply(i, qr),
    bt = r,
    qr = i,
    Za = function(o, a) {
        return e[o](a)
    }
}, Ai = function(t, e) {
    return ~qr.indexOf(t) && qr[qr.indexOf(t) + 1][e]
}, fs = function(t) {
    return !!~jf.indexOf(t)
}, Le = function(t, e, r, i, s) {
    return t.addEventListener(e, r, {
        passive: i !== !1,
        capture: !!s
    })
}, ke = function(t, e, r, i) {
    return t.removeEventListener(e, r, !!i)
}, Zs = "scrollLeft", Js = "scrollTop", Ja = function() {
    return ui && ui.isPressed || bt.cache++
}, Ro = function(t, e) {
    var r = function i(s) {
        if (s || s === 0) {
            Jf && (nr.history.scrollRestoration = "manual");
            var o = ui && ui.isPressed;
            s = i.v = Math.round(s) || (ui && ui.iOS ? 1 : 0),
            t(s),
            i.cacheID = bt.cache,
            o && Za("ss", s)
        } else
            (e || bt.cache !== i.cacheID || Za("ref")) && (i.cacheID = bt.cache,
            i.v = t());
        return i.v + i.offset
    };
    return r.offset = 0,
    t && r
}, ze = {
    s: Zs,
    p: "left",
    p2: "Left",
    os: "right",
    os2: "Right",
    d: "width",
    d2: "Width",
    a: "x",
    sc: Ro(function(n) {
        return arguments.length ? nr.scrollTo(n, ce.sc()) : nr.pageXOffset || Ei[Zs] || xi[Zs] || Ln[Zs] || 0
    })
}, ce = {
    s: Js,
    p: "top",
    p2: "Top",
    os: "bottom",
    os2: "Bottom",
    d: "height",
    d2: "Height",
    a: "y",
    op: ze,
    sc: Ro(function(n) {
        return arguments.length ? nr.scrollTo(ze.sc(), n) : nr.pageYOffset || Ei[Js] || xi[Js] || Ln[Js] || 0
    })
}, $e = function(t, e) {
    return (e && e._ctx && e._ctx.selector || me.utils.toArray)(t)[0] || (typeof t == "string" && me.config().nullTargetWarn !== !1 ? console.warn("Element not found:", t) : null)
}, ki = function(t, e) {
    var r = e.s
      , i = e.sc;
    fs(t) && (t = Ei.scrollingElement || xi);
    var s = bt.indexOf(t)
      , o = i === ce.sc ? 1 : 2;
    !~s && (s = bt.push(t) - 1),
    bt[s + o] || Le(t, "scroll", Ja);
    var a = bt[s + o]
      , u = a || (bt[s + o] = Ro(Ai(t, r), !0) || (fs(t) ? i : Ro(function(l) {
        return arguments.length ? t[r] = l : t[r]
    })));
    return u.target = t,
    a || (u.smooth = me.getProperty(t, "scrollBehavior") === "smooth"),
    u
}, Qa = function(t, e, r) {
    var i = t
      , s = t
      , o = cs()
      , a = o
      , u = e || 50
      , l = Math.max(500, u * 3)
      , c = function(_, d) {
        var b = cs();
        d || b - o > u ? (s = i,
        i = _,
        a = o,
        o = b) : r ? i += _ : i = s + (_ - s) / (b - a) * (o - a)
    }
      , p = function() {
        s = i = r ? 0 : i,
        a = o = 0
    }
      , h = function(_) {
        var d = a
          , b = s
          , T = cs();
        return (_ || _ === 0) && _ !== i && c(_),
        o === a || T - a > l ? 0 : (i + (r ? b : -b)) / ((r ? T : o) - d) * 1e3
    };
    return {
        update: c,
        reset: p,
        getVelocity: h
    }
}, Hn = function(t, e) {
    return e && !t._gsapAllow && t.preventDefault(),
    t.changedTouches ? t.changedTouches[0] : t
}, Nl = function(t) {
    var e = Math.max.apply(Math, t)
      , r = Math.min.apply(Math, t);
    return Math.abs(e) >= Math.abs(r) ? e : r
}, Qf = function() {
    ls = me.core.globals().ScrollTrigger,
    ls && ls.core && l_()
}, th = function(t) {
    return me = t || Zf(),
    !_o && me && typeof document < "u" && document.body && (nr = window,
    Ei = document,
    xi = Ei.documentElement,
    Ln = Ei.body,
    jf = [nr, Ei, xi, Ln],
    me.utils.clamp,
    Kf = me.core.context || function() {}
    ,
    Yi = "onpointerenter"in Ln ? "pointer" : "mouse",
    Hf = ie.isTouch = nr.matchMedia && nr.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart"in nr || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0,
    Cr = ie.eventTypes = ("ontouchstart"in xi ? "touchstart,touchmove,touchcancel,touchend" : "onpointerdown"in xi ? "pointerdown,pointermove,pointercancel,pointerup" : "mousedown,mousemove,mouseup,mouseup").split(","),
    setTimeout(function() {
        return Jf = 0
    }, 500),
    Qf(),
    _o = 1),
    _o
};
ze.op = ce;
bt.cache = 0;
var ie = function() {
    function n(e) {
        this.init(e)
    }
    var t = n.prototype;
    return t.init = function(r) {
        _o || th(me) || console.warn("Please gsap.registerPlugin(Observer)"),
        ls || Qf();
        var i = r.tolerance
          , s = r.dragMinimum
          , o = r.type
          , a = r.target
          , u = r.lineHeight
          , l = r.debounce
          , c = r.preventDefault
          , p = r.onStop
          , h = r.onStopDelay
          , f = r.ignore
          , _ = r.wheelSpeed
          , d = r.event
          , b = r.onDragStart
          , T = r.onDragEnd
          , w = r.onDrag
          , C = r.onPress
          , A = r.onRelease
          , O = r.onRight
          , P = r.onLeft
          , E = r.onUp
          , L = r.onDown
          , M = r.onChangeX
          , D = r.onChangeY
          , F = r.onChange
          , k = r.onToggleX
          , $ = r.onToggleY
          , U = r.onHover
          , W = r.onHoverEnd
          , q = r.onMove
          , K = r.ignoreCheck
          , H = r.isNormalizer
          , G = r.onGestureStart
          , y = r.onGestureEnd
          , j = r.onWheel
          , nt = r.onEnable
          , et = r.onDisable
          , at = r.onClick
          , Ct = r.scrollSpeed
          , X = r.capture
          , ot = r.allowClicks
          , At = r.lockAxis
          , gt = r.onLockAxis;
        this.target = a = $e(a) || xi,
        this.vars = r,
        f && (f = me.utils.toArray(f)),
        i = i || 1e-9,
        s = s || 0,
        _ = _ || 1,
        Ct = Ct || 1,
        o = o || "wheel,touch,pointer",
        l = l !== !1,
        u || (u = parseFloat(nr.getComputedStyle(Ln).lineHeight) || 22);
        var Lt, Yt, Qt, Y, ut, zt, Ht, z = this, ge = 0, ur = 0, Dr = r.passive || !c, jt = ki(a, ze), Ke = ki(a, ce), Ze = jt(), br = Ke(), te = ~o.indexOf("touch") && !~o.indexOf("pointer") && Cr[0] === "pointerdown", lr = fs(a), Ft = a.ownerDocument || Ei, Be = [0, 0, 0], Ce = [0, 0, 0], wr = 0, Zr = function() {
            return wr = cs()
        }, Kt = function(rt, Ot) {
            return (z.event = rt) && f && ~f.indexOf(rt.target) || Ot && te && rt.pointerType !== "touch" || K && K(rt, Ot)
        }, zi = function() {
            z._vx.reset(),
            z._vy.reset(),
            Yt.pause(),
            p && p(z)
        }, Mr = function() {
            var rt = z.deltaX = Nl(Be)
              , Ot = z.deltaY = Nl(Ce)
              , J = Math.abs(rt) >= i
              , ct = Math.abs(Ot) >= i;
            F && (J || ct) && F(z, rt, Ot, Be, Ce),
            J && (O && z.deltaX > 0 && O(z),
            P && z.deltaX < 0 && P(z),
            M && M(z),
            k && z.deltaX < 0 != ge < 0 && k(z),
            ge = z.deltaX,
            Be[0] = Be[1] = Be[2] = 0),
            ct && (L && z.deltaY > 0 && L(z),
            E && z.deltaY < 0 && E(z),
            D && D(z),
            $ && z.deltaY < 0 != ur < 0 && $(z),
            ur = z.deltaY,
            Ce[0] = Ce[1] = Ce[2] = 0),
            (Y || Qt) && (q && q(z),
            Qt && (w(z),
            Qt = !1),
            Y = !1),
            zt && !(zt = !1) && gt && gt(z),
            ut && (j(z),
            ut = !1),
            Lt = 0
        }, Jr = function(rt, Ot, J) {
            Be[J] += rt,
            Ce[J] += Ot,
            z._vx.update(rt),
            z._vy.update(Ot),
            l ? Lt || (Lt = requestAnimationFrame(Mr)) : Mr()
        }, Qr = function(rt, Ot) {
            At && !Ht && (z.axis = Ht = Math.abs(rt) > Math.abs(Ot) ? "x" : "y",
            zt = !0),
            Ht !== "y" && (Be[2] += rt,
            z._vx.update(rt, !0)),
            Ht !== "x" && (Ce[2] += Ot,
            z._vy.update(Ot, !0)),
            l ? Lt || (Lt = requestAnimationFrame(Mr)) : Mr()
        }, Ae = function(rt) {
            if (!Kt(rt, 1)) {
                rt = Hn(rt, c);
                var Ot = rt.clientX
                  , J = rt.clientY
                  , ct = Ot - z.x
                  , I = J - z.y
                  , g = z.isDragging;
                z.x = Ot,
                z.y = J,
                (g || Math.abs(z.startX - Ot) >= s || Math.abs(z.startY - J) >= s) && (w && (Qt = !0),
                g || (z.isDragging = !0),
                Qr(ct, I),
                g || b && b(z))
            }
        }, Er = z.onPress = function(st) {
            Kt(st, 1) || st && st.button || (z.axis = Ht = null,
            Yt.pause(),
            z.isPressed = !0,
            st = Hn(st),
            ge = ur = 0,
            z.startX = z.x = st.clientX,
            z.startY = z.y = st.clientY,
            z._vx.reset(),
            z._vy.reset(),
            Le(H ? a : Ft, Cr[1], Ae, Dr, !0),
            z.deltaX = z.deltaY = 0,
            C && C(z))
        }
        , _t = z.onRelease = function(st) {
            if (!Kt(st, 1)) {
                ke(H ? a : Ft, Cr[1], Ae, !0);
                var rt = !isNaN(z.y - z.startY)
                  , Ot = z.isDragging
                  , J = Ot && (Math.abs(z.x - z.startX) > 3 || Math.abs(z.y - z.startY) > 3)
                  , ct = Hn(st);
                !J && rt && (z._vx.reset(),
                z._vy.reset(),
                c && ot && me.delayedCall(.08, function() {
                    if (cs() - wr > 300 && !st.defaultPrevented) {
                        if (st.target.click)
                            st.target.click();
                        else if (Ft.createEvent) {
                            var I = Ft.createEvent("MouseEvents");
                            I.initMouseEvent("click", !0, !0, nr, 1, ct.screenX, ct.screenY, ct.clientX, ct.clientY, !1, !1, !1, !1, 0, null),
                            st.target.dispatchEvent(I)
                        }
                    }
                })),
                z.isDragging = z.isGesturing = z.isPressed = !1,
                p && Ot && !H && Yt.restart(!0),
                T && Ot && T(z),
                A && A(z, J)
            }
        }
        , xr = function(rt) {
            return rt.touches && rt.touches.length > 1 && (z.isGesturing = !0) && G(rt, z.isDragging)
        }, Oe = function() {
            return (z.isGesturing = !1) || y(z)
        }, ve = function(rt) {
            if (!Kt(rt)) {
                var Ot = jt()
                  , J = Ke();
                Jr((Ot - Ze) * Ct, (J - br) * Ct, 1),
                Ze = Ot,
                br = J,
                p && Yt.restart(!0)
            }
        }, Ve = function(rt) {
            if (!Kt(rt)) {
                rt = Hn(rt, c),
                j && (ut = !0);
                var Ot = (rt.deltaMode === 1 ? u : rt.deltaMode === 2 ? nr.innerHeight : 1) * _;
                Jr(rt.deltaX * Ot, rt.deltaY * Ot, 0),
                p && !H && Yt.restart(!0)
            }
        }, Tr = function(rt) {
            if (!Kt(rt)) {
                var Ot = rt.clientX
                  , J = rt.clientY
                  , ct = Ot - z.x
                  , I = J - z.y;
                z.x = Ot,
                z.y = J,
                Y = !0,
                p && Yt.restart(!0),
                (ct || I) && Qr(ct, I)
            }
        }, gi = function(rt) {
            z.event = rt,
            U(z)
        }, Je = function(rt) {
            z.event = rt,
            W(z)
        }, Rr = function(rt) {
            return Kt(rt) || Hn(rt, c) && at(z)
        };
        Yt = z._dc = me.delayedCall(h || .25, zi).pause(),
        z.deltaX = z.deltaY = 0,
        z._vx = Qa(0, 50, !0),
        z._vy = Qa(0, 50, !0),
        z.scrollX = jt,
        z.scrollY = Ke,
        z.isDragging = z.isGesturing = z.isPressed = !1,
        Kf(this),
        z.enable = function(st) {
            return z.isEnabled || (Le(lr ? Ft : a, "scroll", Ja),
            o.indexOf("scroll") >= 0 && Le(lr ? Ft : a, "scroll", ve, Dr, X),
            o.indexOf("wheel") >= 0 && Le(a, "wheel", Ve, Dr, X),
            (o.indexOf("touch") >= 0 && Hf || o.indexOf("pointer") >= 0) && (Le(a, Cr[0], Er, Dr, X),
            Le(Ft, Cr[2], _t),
            Le(Ft, Cr[3], _t),
            ot && Le(a, "click", Zr, !0, !0),
            at && Le(a, "click", Rr),
            G && Le(Ft, "gesturestart", xr),
            y && Le(Ft, "gestureend", Oe),
            U && Le(a, Yi + "enter", gi),
            W && Le(a, Yi + "leave", Je),
            q && Le(a, Yi + "move", Tr)),
            z.isEnabled = !0,
            st && st.type && Er(st),
            nt && nt(z)),
            z
        }
        ,
        z.disable = function() {
            z.isEnabled && (Cn.filter(function(st) {
                return st !== z && fs(st.target)
            }).length || ke(lr ? Ft : a, "scroll", Ja),
            z.isPressed && (z._vx.reset(),
            z._vy.reset(),
            ke(H ? a : Ft, Cr[1], Ae, !0)),
            ke(lr ? Ft : a, "scroll", ve, X),
            ke(a, "wheel", Ve, X),
            ke(a, Cr[0], Er, X),
            ke(Ft, Cr[2], _t),
            ke(Ft, Cr[3], _t),
            ke(a, "click", Zr, !0),
            ke(a, "click", Rr),
            ke(Ft, "gesturestart", xr),
            ke(Ft, "gestureend", Oe),
            ke(a, Yi + "enter", gi),
            ke(a, Yi + "leave", Je),
            ke(a, Yi + "move", Tr),
            z.isEnabled = z.isPressed = z.isDragging = !1,
            et && et(z))
        }
        ,
        z.kill = z.revert = function() {
            z.disable();
            var st = Cn.indexOf(z);
            st >= 0 && Cn.splice(st, 1),
            ui === z && (ui = 0)
        }
        ,
        Cn.push(z),
        H && fs(a) && (ui = z),
        z.enable(d)
    }
    ,
    u_(n, [{
        key: "velocityX",
        get: function() {
            return this._vx.getVelocity()
        }
    }, {
        key: "velocityY",
        get: function() {
            return this._vy.getVelocity()
        }
    }]),
    n
}();
ie.version = "3.12.5";
ie.create = function(n) {
    return new ie(n)
}
;
ie.register = th;
ie.getAll = function() {
    return Cn.slice()
}
;
ie.getById = function(n) {
    return Cn.filter(function(t) {
        return t.vars.id === n
    })[0]
}
;
Zf() && me.registerPlugin(ie);
/*!
 * ScrollTrigger 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var tt, bn, Tt, Xt, Ar, Vt, eh, Io, As, hs, ts, Qs, we, Ho, tu, Me, zl, Fl, wn, rh, wa, ih, De, eu, nh, sh, vi, ru, Fu, Dn, Bu, No, iu, Ea, to = 1, Ee = Date.now, xa = Ee(), mr = 0, es = 0, Bl = function(t, e, r) {
    var i = er(t) && (t.substr(0, 6) === "clamp(" || t.indexOf("max") > -1);
    return r["_" + e + "Clamp"] = i,
    i ? t.substr(6, t.length - 7) : t
}, Vl = function(t, e) {
    return e && (!er(t) || t.substr(0, 6) !== "clamp(") ? "clamp(" + t + ")" : t
}, c_ = function n() {
    return es && requestAnimationFrame(n)
}, $l = function() {
    return Ho = 1
}, Wl = function() {
    return Ho = 0
}, Vr = function(t) {
    return t
}, rs = function(t) {
    return Math.round(t * 1e5) / 1e5 || 0
}, oh = function() {
    return typeof window < "u"
}, ah = function() {
    return tt || oh() && (tt = window.gsap) && tt.registerPlugin && tt
}, an = function(t) {
    return !!~eh.indexOf(t)
}, uh = function(t) {
    return (t === "Height" ? Bu : Tt["inner" + t]) || Ar["client" + t] || Vt["client" + t]
}, lh = function(t) {
    return Ai(t, "getBoundingClientRect") || (an(t) ? function() {
        return bo.width = Tt.innerWidth,
        bo.height = Bu,
        bo
    }
    : function() {
        return ai(t)
    }
    )
}, f_ = function(t, e, r) {
    var i = r.d
      , s = r.d2
      , o = r.a;
    return (o = Ai(t, "getBoundingClientRect")) ? function() {
        return o()[i]
    }
    : function() {
        return (e ? uh(s) : t["client" + s]) || 0
    }
}, h_ = function(t, e) {
    return !e || ~qr.indexOf(t) ? lh(t) : function() {
        return bo
    }
}, Xr = function(t, e) {
    var r = e.s
      , i = e.d2
      , s = e.d
      , o = e.a;
    return Math.max(0, (r = "scroll" + i) && (o = Ai(t, r)) ? o() - lh(t)()[s] : an(t) ? (Ar[r] || Vt[r]) - uh(i) : t[r] - t["offset" + i])
}, eo = function(t, e) {
    for (var r = 0; r < wn.length; r += 3)
        (!e || ~e.indexOf(wn[r + 1])) && t(wn[r], wn[r + 1], wn[r + 2])
}, er = function(t) {
    return typeof t == "string"
}, Fe = function(t) {
    return typeof t == "function"
}, is = function(t) {
    return typeof t == "number"
}, Xi = function(t) {
    return typeof t == "object"
}, jn = function(t, e, r) {
    return t && t.progress(e ? 0 : 1) && r && t.pause()
}, Ta = function(t, e) {
    if (t.enabled) {
        var r = t._ctx ? t._ctx.add(function() {
            return e(t)
        }) : e(t);
        r && r.totalTime && (t.callbackAnimation = r)
    }
}, vn = Math.abs, ch = "left", fh = "top", Vu = "right", $u = "bottom", Qi = "width", tn = "height", ds = "Right", ps = "Left", _s = "Top", gs = "Bottom", oe = "padding", fr = "margin", $n = "Width", Wu = "Height", le = "px", hr = function(t) {
    return Tt.getComputedStyle(t)
}, d_ = function(t) {
    var e = hr(t).position;
    t.style.position = e === "absolute" || e === "fixed" ? e : "relative"
}, Yl = function(t, e) {
    for (var r in e)
        r in t || (t[r] = e[r]);
    return t
}, ai = function(t, e) {
    var r = e && hr(t)[tu] !== "matrix(1, 0, 0, 1, 0, 0)" && tt.to(t, {
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        skewX: 0,
        skewY: 0
    }).progress(1)
      , i = t.getBoundingClientRect();
    return r && r.progress(0).kill(),
    i
}, zo = function(t, e) {
    var r = e.d2;
    return t["offset" + r] || t["client" + r] || 0
}, hh = function(t) {
    var e = [], r = t.labels, i = t.duration(), s;
    for (s in r)
        e.push(r[s] / i);
    return e
}, p_ = function(t) {
    return function(e) {
        return tt.utils.snap(hh(t), e)
    }
}, Yu = function(t) {
    var e = tt.utils.snap(t)
      , r = Array.isArray(t) && t.slice(0).sort(function(i, s) {
        return i - s
    });
    return r ? function(i, s, o) {
        o === void 0 && (o = .001);
        var a;
        if (!s)
            return e(i);
        if (s > 0) {
            for (i -= o,
            a = 0; a < r.length; a++)
                if (r[a] >= i)
                    return r[a];
            return r[a - 1]
        } else
            for (a = r.length,
            i += o; a--; )
                if (r[a] <= i)
                    return r[a];
        return r[0]
    }
    : function(i, s, o) {
        o === void 0 && (o = .001);
        var a = e(i);
        return !s || Math.abs(a - i) < o || a - i < 0 == s < 0 ? a : e(s < 0 ? i - t : i + t)
    }
}, __ = function(t) {
    return function(e, r) {
        return Yu(hh(t))(e, r.direction)
    }
}, ro = function(t, e, r, i) {
    return r.split(",").forEach(function(s) {
        return t(e, s, i)
    })
}, de = function(t, e, r, i, s) {
    return t.addEventListener(e, r, {
        passive: !i,
        capture: !!s
    })
}, he = function(t, e, r, i) {
    return t.removeEventListener(e, r, !!i)
}, io = function(t, e, r) {
    r = r && r.wheelHandler,
    r && (t(e, "wheel", r),
    t(e, "touchmove", r))
}, Xl = {
    startColor: "green",
    endColor: "red",
    indent: 0,
    fontSize: "16px",
    fontWeight: "normal"
}, no = {
    toggleActions: "play",
    anticipatePin: 0
}, Fo = {
    top: 0,
    left: 0,
    center: .5,
    bottom: 1,
    right: 1
}, go = function(t, e) {
    if (er(t)) {
        var r = t.indexOf("=")
          , i = ~r ? +(t.charAt(r - 1) + 1) * parseFloat(t.substr(r + 1)) : 0;
        ~r && (t.indexOf("%") > r && (i *= e / 100),
        t = t.substr(0, r - 1)),
        t = i + (t in Fo ? Fo[t] * e : ~t.indexOf("%") ? parseFloat(t) * e / 100 : parseFloat(t) || 0)
    }
    return t
}, so = function(t, e, r, i, s, o, a, u) {
    var l = s.startColor
      , c = s.endColor
      , p = s.fontSize
      , h = s.indent
      , f = s.fontWeight
      , _ = Xt.createElement("div")
      , d = an(r) || Ai(r, "pinType") === "fixed"
      , b = t.indexOf("scroller") !== -1
      , T = d ? Vt : r
      , w = t.indexOf("start") !== -1
      , C = w ? l : c
      , A = "border-color:" + C + ";font-size:" + p + ";color:" + C + ";font-weight:" + f + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
    return A += "position:" + ((b || u) && d ? "fixed;" : "absolute;"),
    (b || u || !d) && (A += (i === ce ? Vu : $u) + ":" + (o + parseFloat(h)) + "px;"),
    a && (A += "box-sizing:border-box;text-align:left;width:" + a.offsetWidth + "px;"),
    _._isStart = w,
    _.setAttribute("class", "gsap-marker-" + t + (e ? " marker-" + e : "")),
    _.style.cssText = A,
    _.innerText = e || e === 0 ? t + "-" + e : t,
    T.children[0] ? T.insertBefore(_, T.children[0]) : T.appendChild(_),
    _._offset = _["offset" + i.op.d2],
    mo(_, 0, i, w),
    _
}, mo = function(t, e, r, i) {
    var s = {
        display: "block"
    }
      , o = r[i ? "os2" : "p2"]
      , a = r[i ? "p2" : "os2"];
    t._isFlipped = i,
    s[r.a + "Percent"] = i ? -100 : 0,
    s[r.a] = i ? "1px" : 0,
    s["border" + o + $n] = 1,
    s["border" + a + $n] = 0,
    s[r.p] = e + "px",
    tt.set(t, s)
}, yt = [], nu = {}, Os, Ul = function() {
    return Ee() - mr > 34 && (Os || (Os = requestAnimationFrame(fi)))
}, yn = function() {
    (!De || !De.isPressed || De.startX > Vt.clientWidth) && (bt.cache++,
    De ? Os || (Os = requestAnimationFrame(fi)) : fi(),
    mr || ln("scrollStart"),
    mr = Ee())
}, Sa = function() {
    sh = Tt.innerWidth,
    nh = Tt.innerHeight
}, ns = function() {
    bt.cache++,
    !we && !ih && !Xt.fullscreenElement && !Xt.webkitFullscreenElement && (!eu || sh !== Tt.innerWidth || Math.abs(Tt.innerHeight - nh) > Tt.innerHeight * .25) && Io.restart(!0)
}, un = {}, g_ = [], dh = function n() {
    return he(vt, "scrollEnd", n) || Hi(!0)
}, ln = function(t) {
    return un[t] && un[t].map(function(e) {
        return e()
    }) || g_
}, tr = [], ph = function(t) {
    for (var e = 0; e < tr.length; e += 5)
        (!t || tr[e + 4] && tr[e + 4].query === t) && (tr[e].style.cssText = tr[e + 1],
        tr[e].getBBox && tr[e].setAttribute("transform", tr[e + 2] || ""),
        tr[e + 3].uncache = 1)
}, Xu = function(t, e) {
    var r;
    for (Me = 0; Me < yt.length; Me++)
        r = yt[Me],
        r && (!e || r._ctx === e) && (t ? r.kill(1) : r.revert(!0, !0));
    No = !0,
    e && ph(e),
    e || ln("revert")
}, _h = function(t, e) {
    bt.cache++,
    (e || !Re) && bt.forEach(function(r) {
        return Fe(r) && r.cacheID++ && (r.rec = 0)
    }),
    er(t) && (Tt.history.scrollRestoration = Fu = t)
}, Re, en = 0, ql, m_ = function() {
    if (ql !== en) {
        var t = ql = en;
        requestAnimationFrame(function() {
            return t === en && Hi(!0)
        })
    }
}, gh = function() {
    Vt.appendChild(Dn),
    Bu = !De && Dn.offsetHeight || Tt.innerHeight,
    Vt.removeChild(Dn)
}, Gl = function(t) {
    return As(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(e) {
        return e.style.display = t ? "none" : "block"
    })
}, Hi = function(t, e) {
    if (mr && !t && !No) {
        de(vt, "scrollEnd", dh);
        return
    }
    gh(),
    Re = vt.isRefreshing = !0,
    bt.forEach(function(i) {
        return Fe(i) && ++i.cacheID && (i.rec = i())
    });
    var r = ln("refreshInit");
    rh && vt.sort(),
    e || Xu(),
    bt.forEach(function(i) {
        Fe(i) && (i.smooth && (i.target.style.scrollBehavior = "auto"),
        i(0))
    }),
    yt.slice(0).forEach(function(i) {
        return i.refresh()
    }),
    No = !1,
    yt.forEach(function(i) {
        if (i._subPinOffset && i.pin) {
            var s = i.vars.horizontal ? "offsetWidth" : "offsetHeight"
              , o = i.pin[s];
            i.revert(!0, 1),
            i.adjustPinSpacing(i.pin[s] - o),
            i.refresh()
        }
    }),
    iu = 1,
    Gl(!0),
    yt.forEach(function(i) {
        var s = Xr(i.scroller, i._dir)
          , o = i.vars.end === "max" || i._endClamp && i.end > s
          , a = i._startClamp && i.start >= s;
        (o || a) && i.setPositions(a ? s - 1 : i.start, o ? Math.max(a ? s : i.start + 1, s) : i.end, !0)
    }),
    Gl(!1),
    iu = 0,
    r.forEach(function(i) {
        return i && i.render && i.render(-1)
    }),
    bt.forEach(function(i) {
        Fe(i) && (i.smooth && requestAnimationFrame(function() {
            return i.target.style.scrollBehavior = "smooth"
        }),
        i.rec && i(i.rec))
    }),
    _h(Fu, 1),
    Io.pause(),
    en++,
    Re = 2,
    fi(2),
    yt.forEach(function(i) {
        return Fe(i.vars.onRefresh) && i.vars.onRefresh(i)
    }),
    Re = vt.isRefreshing = !1,
    ln("refresh")
}, su = 0, vo = 1, ms, fi = function(t) {
    if (t === 2 || !Re && !No) {
        vt.isUpdating = !0,
        ms && ms.update(0);
        var e = yt.length
          , r = Ee()
          , i = r - xa >= 50
          , s = e && yt[0].scroll();
        if (vo = su > s ? -1 : 1,
        Re || (su = s),
        i && (mr && !Ho && r - mr > 200 && (mr = 0,
        ln("scrollEnd")),
        ts = xa,
        xa = r),
        vo < 0) {
            for (Me = e; Me-- > 0; )
                yt[Me] && yt[Me].update(0, i);
            vo = 1
        } else
            for (Me = 0; Me < e; Me++)
                yt[Me] && yt[Me].update(0, i);
        vt.isUpdating = !1
    }
    Os = 0
}, ou = [ch, fh, $u, Vu, fr + gs, fr + ds, fr + _s, fr + ps, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"], yo = ou.concat([Qi, tn, "boxSizing", "max" + $n, "max" + Wu, "position", fr, oe, oe + _s, oe + ds, oe + gs, oe + ps]), v_ = function(t, e, r) {
    Mn(r);
    var i = t._gsap;
    if (i.spacerIsNative)
        Mn(i.spacerState);
    else if (t._gsap.swappedIn) {
        var s = e.parentNode;
        s && (s.insertBefore(t, e),
        s.removeChild(e))
    }
    t._gsap.swappedIn = !1
}, Ca = function(t, e, r, i) {
    if (!t._gsap.swappedIn) {
        for (var s = ou.length, o = e.style, a = t.style, u; s--; )
            u = ou[s],
            o[u] = r[u];
        o.position = r.position === "absolute" ? "absolute" : "relative",
        r.display === "inline" && (o.display = "inline-block"),
        a[$u] = a[Vu] = "auto",
        o.flexBasis = r.flexBasis || "auto",
        o.overflow = "visible",
        o.boxSizing = "border-box",
        o[Qi] = zo(t, ze) + le,
        o[tn] = zo(t, ce) + le,
        o[oe] = a[fr] = a[fh] = a[ch] = "0",
        Mn(i),
        a[Qi] = a["max" + $n] = r[Qi],
        a[tn] = a["max" + Wu] = r[tn],
        a[oe] = r[oe],
        t.parentNode !== e && (t.parentNode.insertBefore(e, t),
        e.appendChild(t)),
        t._gsap.swappedIn = !0
    }
}, y_ = /([A-Z])/g, Mn = function(t) {
    if (t) {
        var e = t.t.style, r = t.length, i = 0, s, o;
        for ((t.t._gsap || tt.core.getCache(t.t)).uncache = 1; i < r; i += 2)
            o = t[i + 1],
            s = t[i],
            o ? e[s] = o : e[s] && e.removeProperty(s.replace(y_, "-$1").toLowerCase())
    }
}, oo = function(t) {
    for (var e = yo.length, r = t.style, i = [], s = 0; s < e; s++)
        i.push(yo[s], r[yo[s]]);
    return i.t = t,
    i
}, b_ = function(t, e, r) {
    for (var i = [], s = t.length, o = r ? 8 : 0, a; o < s; o += 2)
        a = t[o],
        i.push(a, a in e ? e[a] : t[o + 1]);
    return i.t = t.t,
    i
}, bo = {
    left: 0,
    top: 0
}, Hl = function(t, e, r, i, s, o, a, u, l, c, p, h, f, _) {
    Fe(t) && (t = t(u)),
    er(t) && t.substr(0, 3) === "max" && (t = h + (t.charAt(4) === "=" ? go("0" + t.substr(3), r) : 0));
    var d = f ? f.time() : 0, b, T, w;
    if (f && f.seek(0),
    isNaN(t) || (t = +t),
    is(t))
        f && (t = tt.utils.mapRange(f.scrollTrigger.start, f.scrollTrigger.end, 0, h, t)),
        a && mo(a, r, i, !0);
    else {
        Fe(e) && (e = e(u));
        var C = (t || "0").split(" "), A, O, P, E;
        w = $e(e, u) || Vt,
        A = ai(w) || {},
        (!A || !A.left && !A.top) && hr(w).display === "none" && (E = w.style.display,
        w.style.display = "block",
        A = ai(w),
        E ? w.style.display = E : w.style.removeProperty("display")),
        O = go(C[0], A[i.d]),
        P = go(C[1] || "0", r),
        t = A[i.p] - l[i.p] - c + O + s - P,
        a && mo(a, P, i, r - P < 20 || a._isStart && P > 20),
        r -= r - P
    }
    if (_ && (u[_] = t || -.001,
    t < 0 && (t = 0)),
    o) {
        var L = t + r
          , M = o._isStart;
        b = "scroll" + i.d2,
        mo(o, L, i, M && L > 20 || !M && (p ? Math.max(Vt[b], Ar[b]) : o.parentNode[b]) <= L + 1),
        p && (l = ai(a),
        p && (o.style[i.op.p] = l[i.op.p] - i.op.m - o._offset + le))
    }
    return f && w && (b = ai(w),
    f.seek(h),
    T = ai(w),
    f._caScrollDist = b[i.p] - T[i.p],
    t = t / f._caScrollDist * h),
    f && f.seek(d),
    f ? t : Math.round(t)
}, w_ = /(webkit|moz|length|cssText|inset)/i, jl = function(t, e, r, i) {
    if (t.parentNode !== e) {
        var s = t.style, o, a;
        if (e === Vt) {
            t._stOrig = s.cssText,
            a = hr(t);
            for (o in a)
                !+o && !w_.test(o) && a[o] && typeof s[o] == "string" && o !== "0" && (s[o] = a[o]);
            s.top = r,
            s.left = i
        } else
            s.cssText = t._stOrig;
        tt.core.getCache(t).uncache = 1,
        e.appendChild(t)
    }
}, mh = function(t, e, r) {
    var i = e
      , s = i;
    return function(o) {
        var a = Math.round(t());
        return a !== i && a !== s && Math.abs(a - i) > 3 && Math.abs(a - s) > 3 && (o = a,
        r && r()),
        s = i,
        i = o,
        o
    }
}, ao = function(t, e, r) {
    var i = {};
    i[e.p] = "+=" + r,
    tt.set(t, i)
}, Kl = function(t, e) {
    var r = ki(t, e)
      , i = "_scroll" + e.p2
      , s = function o(a, u, l, c, p) {
        var h = o.tween
          , f = u.onComplete
          , _ = {};
        l = l || r();
        var d = mh(r, l, function() {
            h.kill(),
            o.tween = 0
        });
        return p = c && p || 0,
        c = c || a - l,
        h && h.kill(),
        u[i] = a,
        u.inherit = !1,
        u.modifiers = _,
        _[i] = function() {
            return d(l + c * h.ratio + p * h.ratio * h.ratio)
        }
        ,
        u.onUpdate = function() {
            bt.cache++,
            o.tween && fi()
        }
        ,
        u.onComplete = function() {
            o.tween = 0,
            f && f.call(h)
        }
        ,
        h = o.tween = tt.to(t, u),
        h
    };
    return t[i] = r,
    r.wheelHandler = function() {
        return s.tween && s.tween.kill() && (s.tween = 0)
    }
    ,
    de(t, "wheel", r.wheelHandler),
    vt.isTouch && de(t, "touchmove", r.wheelHandler),
    s
}, vt = function() {
    function n(e, r) {
        bn || n.register(tt) || console.warn("Please gsap.registerPlugin(ScrollTrigger)"),
        ru(this),
        this.init(e, r)
    }
    var t = n.prototype;
    return t.init = function(r, i) {
        if (this.progress = this.start = 0,
        this.vars && this.kill(!0, !0),
        !es) {
            this.update = this.refresh = this.kill = Vr;
            return
        }
        r = Yl(er(r) || is(r) || r.nodeType ? {
            trigger: r
        } : r, no);
        var s = r, o = s.onUpdate, a = s.toggleClass, u = s.id, l = s.onToggle, c = s.onRefresh, p = s.scrub, h = s.trigger, f = s.pin, _ = s.pinSpacing, d = s.invalidateOnRefresh, b = s.anticipatePin, T = s.onScrubComplete, w = s.onSnapComplete, C = s.once, A = s.snap, O = s.pinReparent, P = s.pinSpacer, E = s.containerAnimation, L = s.fastScrollEnd, M = s.preventOverlaps, D = r.horizontal || r.containerAnimation && r.horizontal !== !1 ? ze : ce, F = !p && p !== 0, k = $e(r.scroller || Tt), $ = tt.core.getCache(k), U = an(k), W = ("pinType"in r ? r.pinType : Ai(k, "pinType") || U && "fixed") === "fixed", q = [r.onEnter, r.onLeave, r.onEnterBack, r.onLeaveBack], K = F && r.toggleActions.split(" "), H = "markers"in r ? r.markers : no.markers, G = U ? 0 : parseFloat(hr(k)["border" + D.p2 + $n]) || 0, y = this, j = r.onRefreshInit && function() {
            return r.onRefreshInit(y)
        }
        , nt = f_(k, U, D), et = h_(k, U), at = 0, Ct = 0, X = 0, ot = ki(k, D), At, gt, Lt, Yt, Qt, Y, ut, zt, Ht, z, ge, ur, Dr, jt, Ke, Ze, br, te, lr, Ft, Be, Ce, wr, Zr, Kt, zi, Mr, Jr, Qr, Ae, Er, _t, xr, Oe, ve, Ve, Tr, gi, Je;
        if (y._startClamp = y._endClamp = !1,
        y._dir = D,
        b *= 45,
        y.scroller = k,
        y.scroll = E ? E.time.bind(E) : ot,
        Yt = ot(),
        y.vars = r,
        i = i || r.animation,
        "refreshPriority"in r && (rh = 1,
        r.refreshPriority === -9999 && (ms = y)),
        $.tweenScroll = $.tweenScroll || {
            top: Kl(k, ce),
            left: Kl(k, ze)
        },
        y.tweenTo = At = $.tweenScroll[D.p],
        y.scrubDuration = function(J) {
            xr = is(J) && J,
            xr ? _t ? _t.duration(J) : _t = tt.to(i, {
                ease: "expo",
                totalProgress: "+=0",
                inherit: !1,
                duration: xr,
                paused: !0,
                onComplete: function() {
                    return T && T(y)
                }
            }) : (_t && _t.progress(1).kill(),
            _t = 0)
        }
        ,
        i && (i.vars.lazy = !1,
        i._initted && !y.isReverted || i.vars.immediateRender !== !1 && r.immediateRender !== !1 && i.duration() && i.render(0, !0, !0),
        y.animation = i.pause(),
        i.scrollTrigger = y,
        y.scrubDuration(p),
        Ae = 0,
        u || (u = i.vars.id)),
        A && ((!Xi(A) || A.push) && (A = {
            snapTo: A
        }),
        "scrollBehavior"in Vt.style && tt.set(U ? [Vt, Ar] : k, {
            scrollBehavior: "auto"
        }),
        bt.forEach(function(J) {
            return Fe(J) && J.target === (U ? Xt.scrollingElement || Ar : k) && (J.smooth = !1)
        }),
        Lt = Fe(A.snapTo) ? A.snapTo : A.snapTo === "labels" ? p_(i) : A.snapTo === "labelsDirectional" ? __(i) : A.directional !== !1 ? function(J, ct) {
            return Yu(A.snapTo)(J, Ee() - Ct < 500 ? 0 : ct.direction)
        }
        : tt.utils.snap(A.snapTo),
        Oe = A.duration || {
            min: .1,
            max: 2
        },
        Oe = Xi(Oe) ? hs(Oe.min, Oe.max) : hs(Oe, Oe),
        ve = tt.delayedCall(A.delay || xr / 2 || .1, function() {
            var J = ot()
              , ct = Ee() - Ct < 500
              , I = At.tween;
            if ((ct || Math.abs(y.getVelocity()) < 10) && !I && !Ho && at !== J) {
                var g = (J - Y) / jt, v = i && !F ? i.totalProgress() : g, m = ct ? 0 : (v - Er) / (Ee() - ts) * 1e3 || 0, x = tt.utils.clamp(-g, 1 - g, vn(m / 2) * m / .185), S = g + (A.inertia === !1 ? 0 : x), R, V, B = A, N = B.onStart, Z = B.onInterrupt, Q = B.onComplete;
                if (R = Lt(S, y),
                is(R) || (R = S),
                V = Math.round(Y + R * jt),
                J <= ut && J >= Y && V !== J) {
                    if (I && !I._initted && I.data <= vn(V - J))
                        return;
                    A.inertia === !1 && (x = R - g),
                    At(V, {
                        duration: Oe(vn(Math.max(vn(S - v), vn(R - v)) * .185 / m / .05 || 0)),
                        ease: A.ease || "power3",
                        data: vn(V - J),
                        onInterrupt: function() {
                            return ve.restart(!0) && Z && Z(y)
                        },
                        onComplete: function() {
                            y.update(),
                            at = ot(),
                            i && (_t ? _t.resetTo("totalProgress", R, i._tTime / i._tDur) : i.progress(R)),
                            Ae = Er = i && !F ? i.totalProgress() : y.progress,
                            w && w(y),
                            Q && Q(y)
                        }
                    }, J, x * jt, V - J - x * jt),
                    N && N(y, At.tween)
                }
            } else
                y.isActive && at !== J && ve.restart(!0)
        }).pause()),
        u && (nu[u] = y),
        h = y.trigger = $e(h || f !== !0 && f),
        Je = h && h._gsap && h._gsap.stRevert,
        Je && (Je = Je(y)),
        f = f === !0 ? h : $e(f),
        er(a) && (a = {
            targets: h,
            className: a
        }),
        f && (_ === !1 || _ === fr || (_ = !_ && f.parentNode && f.parentNode.style && hr(f.parentNode).display === "flex" ? !1 : oe),
        y.pin = f,
        gt = tt.core.getCache(f),
        gt.spacer ? Ke = gt.pinState : (P && (P = $e(P),
        P && !P.nodeType && (P = P.current || P.nativeElement),
        gt.spacerIsNative = !!P,
        P && (gt.spacerState = oo(P))),
        gt.spacer = te = P || Xt.createElement("div"),
        te.classList.add("pin-spacer"),
        u && te.classList.add("pin-spacer-" + u),
        gt.pinState = Ke = oo(f)),
        r.force3D !== !1 && tt.set(f, {
            force3D: !0
        }),
        y.spacer = te = gt.spacer,
        Qr = hr(f),
        Zr = Qr[_ + D.os2],
        Ft = tt.getProperty(f),
        Be = tt.quickSetter(f, D.a, le),
        Ca(f, te, Qr),
        br = oo(f)),
        H) {
            ur = Xi(H) ? Yl(H, Xl) : Xl,
            z = so("scroller-start", u, k, D, ur, 0),
            ge = so("scroller-end", u, k, D, ur, 0, z),
            lr = z["offset" + D.op.d2];
            var Rr = $e(Ai(k, "content") || k);
            zt = this.markerStart = so("start", u, Rr, D, ur, lr, 0, E),
            Ht = this.markerEnd = so("end", u, Rr, D, ur, lr, 0, E),
            E && (gi = tt.quickSetter([zt, Ht], D.a, le)),
            !W && !(qr.length && Ai(k, "fixedMarkers") === !0) && (d_(U ? Vt : k),
            tt.set([z, ge], {
                force3D: !0
            }),
            zi = tt.quickSetter(z, D.a, le),
            Jr = tt.quickSetter(ge, D.a, le))
        }
        if (E) {
            var st = E.vars.onUpdate
              , rt = E.vars.onUpdateParams;
            E.eventCallback("onUpdate", function() {
                y.update(0, 0, 1),
                st && st.apply(E, rt || [])
            })
        }
        if (y.previous = function() {
            return yt[yt.indexOf(y) - 1]
        }
        ,
        y.next = function() {
            return yt[yt.indexOf(y) + 1]
        }
        ,
        y.revert = function(J, ct) {
            if (!ct)
                return y.kill(!0);
            var I = J !== !1 || !y.enabled
              , g = we;
            I !== y.isReverted && (I && (Ve = Math.max(ot(), y.scroll.rec || 0),
            X = y.progress,
            Tr = i && i.progress()),
            zt && [zt, Ht, z, ge].forEach(function(v) {
                return v.style.display = I ? "none" : "block"
            }),
            I && (we = y,
            y.update(I)),
            f && (!O || !y.isActive) && (I ? v_(f, te, Ke) : Ca(f, te, hr(f), Kt)),
            I || y.update(I),
            we = g,
            y.isReverted = I)
        }
        ,
        y.refresh = function(J, ct, I, g) {
            if (!((we || !y.enabled) && !ct)) {
                if (f && J && mr) {
                    de(n, "scrollEnd", dh);
                    return
                }
                !Re && j && j(y),
                we = y,
                At.tween && !I && (At.tween.kill(),
                At.tween = 0),
                _t && _t.pause(),
                d && i && i.revert({
                    kill: !1
                }).invalidate(),
                y.isReverted || y.revert(!0, !0),
                y._subPinOffset = !1;
                var v = nt(), m = et(), x = E ? E.duration() : Xr(k, D), S = jt <= .01, R = 0, V = g || 0, B = Xi(I) ? I.end : r.end, N = r.endTrigger || h, Z = Xi(I) ? I.start : r.start || (r.start === 0 || !h ? 0 : f ? "0 0" : "0 100%"), Q = y.pinnedContainer = r.pinnedContainer && $e(r.pinnedContainer, y), lt = h && Math.max(0, yt.indexOf(y)) || 0, ft = lt, ht, dt, wt, kt, Pt, it, Dt, Bt, ne, ye, ee, $t, Et;
                for (H && Xi(I) && ($t = tt.getProperty(z, D.p),
                Et = tt.getProperty(ge, D.p)); ft--; )
                    it = yt[ft],
                    it.end || it.refresh(0, 1) || (we = y),
                    Dt = it.pin,
                    Dt && (Dt === h || Dt === f || Dt === Q) && !it.isReverted && (ye || (ye = []),
                    ye.unshift(it),
                    it.revert(!0, !0)),
                    it !== yt[ft] && (lt--,
                    ft--);
                for (Fe(Z) && (Z = Z(y)),
                Z = Bl(Z, "start", y),
                Y = Hl(Z, h, v, D, ot(), zt, z, y, m, G, W, x, E, y._startClamp && "_startClamp") || (f ? -.001 : 0),
                Fe(B) && (B = B(y)),
                er(B) && !B.indexOf("+=") && (~B.indexOf(" ") ? B = (er(Z) ? Z.split(" ")[0] : "") + B : (R = go(B.substr(2), v),
                B = er(Z) ? Z : (E ? tt.utils.mapRange(0, E.duration(), E.scrollTrigger.start, E.scrollTrigger.end, Y) : Y) + R,
                N = h)),
                B = Bl(B, "end", y),
                ut = Math.max(Y, Hl(B || (N ? "100% 0" : x), N, v, D, ot() + R, Ht, ge, y, m, G, W, x, E, y._endClamp && "_endClamp")) || -.001,
                R = 0,
                ft = lt; ft--; )
                    it = yt[ft],
                    Dt = it.pin,
                    Dt && it.start - it._pinPush <= Y && !E && it.end > 0 && (ht = it.end - (y._startClamp ? Math.max(0, it.start) : it.start),
                    (Dt === h && it.start - it._pinPush < Y || Dt === Q) && isNaN(Z) && (R += ht * (1 - it.progress)),
                    Dt === f && (V += ht));
                if (Y += R,
                ut += R,
                y._startClamp && (y._startClamp += R),
                y._endClamp && !Re && (y._endClamp = ut || -.001,
                ut = Math.min(ut, Xr(k, D))),
                jt = ut - Y || (Y -= .01) && .001,
                S && (X = tt.utils.clamp(0, 1, tt.utils.normalize(Y, ut, Ve))),
                y._pinPush = V,
                zt && R && (ht = {},
                ht[D.a] = "+=" + R,
                Q && (ht[D.p] = "-=" + ot()),
                tt.set([zt, Ht], ht)),
                f && !(iu && y.end >= Xr(k, D)))
                    ht = hr(f),
                    kt = D === ce,
                    wt = ot(),
                    Ce = parseFloat(Ft(D.a)) + V,
                    !x && ut > 1 && (ee = (U ? Xt.scrollingElement || Ar : k).style,
                    ee = {
                        style: ee,
                        value: ee["overflow" + D.a.toUpperCase()]
                    },
                    U && hr(Vt)["overflow" + D.a.toUpperCase()] !== "scroll" && (ee.style["overflow" + D.a.toUpperCase()] = "scroll")),
                    Ca(f, te, ht),
                    br = oo(f),
                    dt = ai(f, !0),
                    Bt = W && ki(k, kt ? ze : ce)(),
                    _ ? (Kt = [_ + D.os2, jt + V + le],
                    Kt.t = te,
                    ft = _ === oe ? zo(f, D) + jt + V : 0,
                    ft && (Kt.push(D.d, ft + le),
                    te.style.flexBasis !== "auto" && (te.style.flexBasis = ft + le)),
                    Mn(Kt),
                    Q && yt.forEach(function(Mt) {
                        Mt.pin === Q && Mt.vars.pinSpacing !== !1 && (Mt._subPinOffset = !0)
                    }),
                    W && ot(Ve)) : (ft = zo(f, D),
                    ft && te.style.flexBasis !== "auto" && (te.style.flexBasis = ft + le)),
                    W && (Pt = {
                        top: dt.top + (kt ? wt - Y : Bt) + le,
                        left: dt.left + (kt ? Bt : wt - Y) + le,
                        boxSizing: "border-box",
                        position: "fixed"
                    },
                    Pt[Qi] = Pt["max" + $n] = Math.ceil(dt.width) + le,
                    Pt[tn] = Pt["max" + Wu] = Math.ceil(dt.height) + le,
                    Pt[fr] = Pt[fr + _s] = Pt[fr + ds] = Pt[fr + gs] = Pt[fr + ps] = "0",
                    Pt[oe] = ht[oe],
                    Pt[oe + _s] = ht[oe + _s],
                    Pt[oe + ds] = ht[oe + ds],
                    Pt[oe + gs] = ht[oe + gs],
                    Pt[oe + ps] = ht[oe + ps],
                    Ze = b_(Ke, Pt, O),
                    Re && ot(0)),
                    i ? (ne = i._initted,
                    wa(1),
                    i.render(i.duration(), !0, !0),
                    wr = Ft(D.a) - Ce + jt + V,
                    Mr = Math.abs(jt - wr) > 1,
                    W && Mr && Ze.splice(Ze.length - 2, 2),
                    i.render(0, !0, !0),
                    ne || i.invalidate(!0),
                    i.parent || i.totalTime(i.totalTime()),
                    wa(0)) : wr = jt,
                    ee && (ee.value ? ee.style["overflow" + D.a.toUpperCase()] = ee.value : ee.style.removeProperty("overflow-" + D.a));
                else if (h && ot() && !E)
                    for (dt = h.parentNode; dt && dt !== Vt; )
                        dt._pinOffset && (Y -= dt._pinOffset,
                        ut -= dt._pinOffset),
                        dt = dt.parentNode;
                ye && ye.forEach(function(Mt) {
                    return Mt.revert(!1, !0)
                }),
                y.start = Y,
                y.end = ut,
                Yt = Qt = Re ? Ve : ot(),
                !E && !Re && (Yt < Ve && ot(Ve),
                y.scroll.rec = 0),
                y.revert(!1, !0),
                Ct = Ee(),
                ve && (at = -1,
                ve.restart(!0)),
                we = 0,
                i && F && (i._initted || Tr) && i.progress() !== Tr && i.progress(Tr || 0, !0).render(i.time(), !0, !0),
                (S || X !== y.progress || E || d) && (i && !F && i.totalProgress(E && Y < -.001 && !X ? tt.utils.normalize(Y, ut, 0) : X, !0),
                y.progress = S || (Yt - Y) / jt === X ? 0 : X),
                f && _ && (te._pinOffset = Math.round(y.progress * wr)),
                _t && _t.invalidate(),
                isNaN($t) || ($t -= tt.getProperty(z, D.p),
                Et -= tt.getProperty(ge, D.p),
                ao(z, D, $t),
                ao(zt, D, $t - (g || 0)),
                ao(ge, D, Et),
                ao(Ht, D, Et - (g || 0))),
                S && !Re && y.update(),
                c && !Re && !Dr && (Dr = !0,
                c(y),
                Dr = !1)
            }
        }
        ,
        y.getVelocity = function() {
            return (ot() - Qt) / (Ee() - ts) * 1e3 || 0
        }
        ,
        y.endAnimation = function() {
            jn(y.callbackAnimation),
            i && (_t ? _t.progress(1) : i.paused() ? F || jn(i, y.direction < 0, 1) : jn(i, i.reversed()))
        }
        ,
        y.labelToScroll = function(J) {
            return i && i.labels && (Y || y.refresh() || Y) + i.labels[J] / i.duration() * jt || 0
        }
        ,
        y.getTrailing = function(J) {
            var ct = yt.indexOf(y)
              , I = y.direction > 0 ? yt.slice(0, ct).reverse() : yt.slice(ct + 1);
            return (er(J) ? I.filter(function(g) {
                return g.vars.preventOverlaps === J
            }) : I).filter(function(g) {
                return y.direction > 0 ? g.end <= Y : g.start >= ut
            })
        }
        ,
        y.update = function(J, ct, I) {
            if (!(E && !I && !J)) {
                var g = Re === !0 ? Ve : y.scroll(), v = J ? 0 : (g - Y) / jt, m = v < 0 ? 0 : v > 1 ? 1 : v || 0, x = y.progress, S, R, V, B, N, Z, Q, lt;
                if (ct && (Qt = Yt,
                Yt = E ? ot() : g,
                A && (Er = Ae,
                Ae = i && !F ? i.totalProgress() : m)),
                b && f && !we && !to && mr && (!m && Y < g + (g - Qt) / (Ee() - ts) * b ? m = 1e-4 : m === 1 && ut > g + (g - Qt) / (Ee() - ts) * b && (m = .9999)),
                m !== x && y.enabled) {
                    if (S = y.isActive = !!m && m < 1,
                    R = !!x && x < 1,
                    Z = S !== R,
                    N = Z || !!m != !!x,
                    y.direction = m > x ? 1 : -1,
                    y.progress = m,
                    N && !we && (V = m && !x ? 0 : m === 1 ? 1 : x === 1 ? 2 : 3,
                    F && (B = !Z && K[V + 1] !== "none" && K[V + 1] || K[V],
                    lt = i && (B === "complete" || B === "reset" || B in i))),
                    M && (Z || lt) && (lt || p || !i) && (Fe(M) ? M(y) : y.getTrailing(M).forEach(function(wt) {
                        return wt.endAnimation()
                    })),
                    F || (_t && !we && !to ? (_t._dp._time - _t._start !== _t._time && _t.render(_t._dp._time - _t._start),
                    _t.resetTo ? _t.resetTo("totalProgress", m, i._tTime / i._tDur) : (_t.vars.totalProgress = m,
                    _t.invalidate().restart())) : i && i.totalProgress(m, !!(we && (Ct || J)))),
                    f) {
                        if (J && _ && (te.style[_ + D.os2] = Zr),
                        !W)
                            Be(rs(Ce + wr * m));
                        else if (N) {
                            if (Q = !J && m > x && ut + 1 > g && g + 1 >= Xr(k, D),
                            O)
                                if (!J && (S || Q)) {
                                    var ft = ai(f, !0)
                                      , ht = g - Y;
                                    jl(f, Vt, ft.top + (D === ce ? ht : 0) + le, ft.left + (D === ce ? 0 : ht) + le)
                                } else
                                    jl(f, te);
                            Mn(S || Q ? Ze : br),
                            Mr && m < 1 && S || Be(Ce + (m === 1 && !Q ? wr : 0))
                        }
                    }
                    A && !At.tween && !we && !to && ve.restart(!0),
                    a && (Z || C && m && (m < 1 || !Ea)) && As(a.targets).forEach(function(wt) {
                        return wt.classList[S || C ? "add" : "remove"](a.className)
                    }),
                    o && !F && !J && o(y),
                    N && !we ? (F && (lt && (B === "complete" ? i.pause().totalProgress(1) : B === "reset" ? i.restart(!0).pause() : B === "restart" ? i.restart(!0) : i[B]()),
                    o && o(y)),
                    (Z || !Ea) && (l && Z && Ta(y, l),
                    q[V] && Ta(y, q[V]),
                    C && (m === 1 ? y.kill(!1, 1) : q[V] = 0),
                    Z || (V = m === 1 ? 1 : 3,
                    q[V] && Ta(y, q[V]))),
                    L && !S && Math.abs(y.getVelocity()) > (is(L) ? L : 2500) && (jn(y.callbackAnimation),
                    _t ? _t.progress(1) : jn(i, B === "reverse" ? 1 : !m, 1))) : F && o && !we && o(y)
                }
                if (Jr) {
                    var dt = E ? g / E.duration() * (E._caScrollDist || 0) : g;
                    zi(dt + (z._isFlipped ? 1 : 0)),
                    Jr(dt)
                }
                gi && gi(-g / E.duration() * (E._caScrollDist || 0))
            }
        }
        ,
        y.enable = function(J, ct) {
            y.enabled || (y.enabled = !0,
            de(k, "resize", ns),
            U || de(k, "scroll", yn),
            j && de(n, "refreshInit", j),
            J !== !1 && (y.progress = X = 0,
            Yt = Qt = at = ot()),
            ct !== !1 && y.refresh())
        }
        ,
        y.getTween = function(J) {
            return J && At ? At.tween : _t
        }
        ,
        y.setPositions = function(J, ct, I, g) {
            if (E) {
                var v = E.scrollTrigger
                  , m = E.duration()
                  , x = v.end - v.start;
                J = v.start + x * J / m,
                ct = v.start + x * ct / m
            }
            y.refresh(!1, !1, {
                start: Vl(J, I && !!y._startClamp),
                end: Vl(ct, I && !!y._endClamp)
            }, g),
            y.update()
        }
        ,
        y.adjustPinSpacing = function(J) {
            if (Kt && J) {
                var ct = Kt.indexOf(D.d) + 1;
                Kt[ct] = parseFloat(Kt[ct]) + J + le,
                Kt[1] = parseFloat(Kt[1]) + J + le,
                Mn(Kt)
            }
        }
        ,
        y.disable = function(J, ct) {
            if (y.enabled && (J !== !1 && y.revert(!0, !0),
            y.enabled = y.isActive = !1,
            ct || _t && _t.pause(),
            Ve = 0,
            gt && (gt.uncache = 1),
            j && he(n, "refreshInit", j),
            ve && (ve.pause(),
            At.tween && At.tween.kill() && (At.tween = 0)),
            !U)) {
                for (var I = yt.length; I--; )
                    if (yt[I].scroller === k && yt[I] !== y)
                        return;
                he(k, "resize", ns),
                U || he(k, "scroll", yn)
            }
        }
        ,
        y.kill = function(J, ct) {
            y.disable(J, ct),
            _t && !ct && _t.kill(),
            u && delete nu[u];
            var I = yt.indexOf(y);
            I >= 0 && yt.splice(I, 1),
            I === Me && vo > 0 && Me--,
            I = 0,
            yt.forEach(function(g) {
                return g.scroller === y.scroller && (I = 1)
            }),
            I || Re || (y.scroll.rec = 0),
            i && (i.scrollTrigger = null,
            J && i.revert({
                kill: !1
            }),
            ct || i.kill()),
            zt && [zt, Ht, z, ge].forEach(function(g) {
                return g.parentNode && g.parentNode.removeChild(g)
            }),
            ms === y && (ms = 0),
            f && (gt && (gt.uncache = 1),
            I = 0,
            yt.forEach(function(g) {
                return g.pin === f && I++
            }),
            I || (gt.spacer = 0)),
            r.onKill && r.onKill(y)
        }
        ,
        yt.push(y),
        y.enable(!1, !1),
        Je && Je(y),
        i && i.add && !jt) {
            var Ot = y.update;
            y.update = function() {
                y.update = Ot,
                Y || ut || y.refresh()
            }
            ,
            tt.delayedCall(.01, y.update),
            jt = .01,
            Y = ut = 0
        } else
            y.refresh();
        f && m_()
    }
    ,
    n.register = function(r) {
        return bn || (tt = r || ah(),
        oh() && window.document && n.enable(),
        bn = es),
        bn
    }
    ,
    n.defaults = function(r) {
        if (r)
            for (var i in r)
                no[i] = r[i];
        return no
    }
    ,
    n.disable = function(r, i) {
        es = 0,
        yt.forEach(function(o) {
            return o[i ? "kill" : "disable"](r)
        }),
        he(Tt, "wheel", yn),
        he(Xt, "scroll", yn),
        clearInterval(Qs),
        he(Xt, "touchcancel", Vr),
        he(Vt, "touchstart", Vr),
        ro(he, Xt, "pointerdown,touchstart,mousedown", $l),
        ro(he, Xt, "pointerup,touchend,mouseup", Wl),
        Io.kill(),
        eo(he);
        for (var s = 0; s < bt.length; s += 3)
            io(he, bt[s], bt[s + 1]),
            io(he, bt[s], bt[s + 2])
    }
    ,
    n.enable = function() {
        if (Tt = window,
        Xt = document,
        Ar = Xt.documentElement,
        Vt = Xt.body,
        tt && (As = tt.utils.toArray,
        hs = tt.utils.clamp,
        ru = tt.core.context || Vr,
        wa = tt.core.suppressOverwrites || Vr,
        Fu = Tt.history.scrollRestoration || "auto",
        su = Tt.pageYOffset,
        tt.core.globals("ScrollTrigger", n),
        Vt)) {
            es = 1,
            Dn = document.createElement("div"),
            Dn.style.height = "100vh",
            Dn.style.position = "absolute",
            gh(),
            c_(),
            ie.register(tt),
            n.isTouch = ie.isTouch,
            vi = ie.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),
            eu = ie.isTouch === 1,
            de(Tt, "wheel", yn),
            eh = [Tt, Xt, Ar, Vt],
            tt.matchMedia ? (n.matchMedia = function(u) {
                var l = tt.matchMedia(), c;
                for (c in u)
                    l.add(c, u[c]);
                return l
            }
            ,
            tt.addEventListener("matchMediaInit", function() {
                return Xu()
            }),
            tt.addEventListener("matchMediaRevert", function() {
                return ph()
            }),
            tt.addEventListener("matchMedia", function() {
                Hi(0, 1),
                ln("matchMedia")
            }),
            tt.matchMedia("(orientation: portrait)", function() {
                return Sa(),
                Sa
            })) : console.warn("Requires GSAP 3.11.0 or later"),
            Sa(),
            de(Xt, "scroll", yn);
            var r = Vt.style, i = r.borderTopStyle, s = tt.core.Animation.prototype, o, a;
            for (s.revert || Object.defineProperty(s, "revert", {
                value: function() {
                    return this.time(-.01, !0)
                }
            }),
            r.borderTopStyle = "solid",
            o = ai(Vt),
            ce.m = Math.round(o.top + ce.sc()) || 0,
            ze.m = Math.round(o.left + ze.sc()) || 0,
            i ? r.borderTopStyle = i : r.removeProperty("border-top-style"),
            Qs = setInterval(Ul, 250),
            tt.delayedCall(.5, function() {
                return to = 0
            }),
            de(Xt, "touchcancel", Vr),
            de(Vt, "touchstart", Vr),
            ro(de, Xt, "pointerdown,touchstart,mousedown", $l),
            ro(de, Xt, "pointerup,touchend,mouseup", Wl),
            tu = tt.utils.checkPrefix("transform"),
            yo.push(tu),
            bn = Ee(),
            Io = tt.delayedCall(.2, Hi).pause(),
            wn = [Xt, "visibilitychange", function() {
                var u = Tt.innerWidth
                  , l = Tt.innerHeight;
                Xt.hidden ? (zl = u,
                Fl = l) : (zl !== u || Fl !== l) && ns()
            }
            , Xt, "DOMContentLoaded", Hi, Tt, "load", Hi, Tt, "resize", ns],
            eo(de),
            yt.forEach(function(u) {
                return u.enable(0, 1)
            }),
            a = 0; a < bt.length; a += 3)
                io(he, bt[a], bt[a + 1]),
                io(he, bt[a], bt[a + 2])
        }
    }
    ,
    n.config = function(r) {
        "limitCallbacks"in r && (Ea = !!r.limitCallbacks);
        var i = r.syncInterval;
        i && clearInterval(Qs) || (Qs = i) && setInterval(Ul, i),
        "ignoreMobileResize"in r && (eu = n.isTouch === 1 && r.ignoreMobileResize),
        "autoRefreshEvents"in r && (eo(he) || eo(de, r.autoRefreshEvents || "none"),
        ih = (r.autoRefreshEvents + "").indexOf("resize") === -1)
    }
    ,
    n.scrollerProxy = function(r, i) {
        var s = $e(r)
          , o = bt.indexOf(s)
          , a = an(s);
        ~o && bt.splice(o, a ? 6 : 2),
        i && (a ? qr.unshift(Tt, i, Vt, i, Ar, i) : qr.unshift(s, i))
    }
    ,
    n.clearMatchMedia = function(r) {
        yt.forEach(function(i) {
            return i._ctx && i._ctx.query === r && i._ctx.kill(!0, !0)
        })
    }
    ,
    n.isInViewport = function(r, i, s) {
        var o = (er(r) ? $e(r) : r).getBoundingClientRect()
          , a = o[s ? Qi : tn] * i || 0;
        return s ? o.right - a > 0 && o.left + a < Tt.innerWidth : o.bottom - a > 0 && o.top + a < Tt.innerHeight
    }
    ,
    n.positionInViewport = function(r, i, s) {
        er(r) && (r = $e(r));
        var o = r.getBoundingClientRect()
          , a = o[s ? Qi : tn]
          , u = i == null ? a / 2 : i in Fo ? Fo[i] * a : ~i.indexOf("%") ? parseFloat(i) * a / 100 : parseFloat(i) || 0;
        return s ? (o.left + u) / Tt.innerWidth : (o.top + u) / Tt.innerHeight
    }
    ,
    n.killAll = function(r) {
        if (yt.slice(0).forEach(function(s) {
            return s.vars.id !== "ScrollSmoother" && s.kill()
        }),
        r !== !0) {
            var i = un.killAll || [];
            un = {},
            i.forEach(function(s) {
                return s()
            })
        }
    }
    ,
    n
}();
vt.version = "3.12.5";
vt.saveStyles = function(n) {
    return n ? As(n).forEach(function(t) {
        if (t && t.style) {
            var e = tr.indexOf(t);
            e >= 0 && tr.splice(e, 5),
            tr.push(t, t.style.cssText, t.getBBox && t.getAttribute("transform"), tt.core.getCache(t), ru())
        }
    }) : tr
}
;
vt.revert = function(n, t) {
    return Xu(!n, t)
}
;
vt.create = function(n, t) {
    return new vt(n,t)
}
;
vt.refresh = function(n) {
    return n ? ns() : (bn || vt.register()) && Hi(!0)
}
;
vt.update = function(n) {
    return ++bt.cache && fi(n === !0 ? 2 : 0)
}
;
vt.clearScrollMemory = _h;
vt.maxScroll = function(n, t) {
    return Xr(n, t ? ze : ce)
}
;
vt.getScrollFunc = function(n, t) {
    return ki($e(n), t ? ze : ce)
}
;
vt.getById = function(n) {
    return nu[n]
}
;
vt.getAll = function() {
    return yt.filter(function(n) {
        return n.vars.id !== "ScrollSmoother"
    })
}
;
vt.isScrolling = function() {
    return !!mr
}
;
vt.snapDirectional = Yu;
vt.addEventListener = function(n, t) {
    var e = un[n] || (un[n] = []);
    ~e.indexOf(t) || e.push(t)
}
;
vt.removeEventListener = function(n, t) {
    var e = un[n]
      , r = e && e.indexOf(t);
    r >= 0 && e.splice(r, 1)
}
;
vt.batch = function(n, t) {
    var e = [], r = {}, i = t.interval || .016, s = t.batchMax || 1e9, o = function(l, c) {
        var p = []
          , h = []
          , f = tt.delayedCall(i, function() {
            c(p, h),
            p = [],
            h = []
        }).pause();
        return function(_) {
            p.length || f.restart(!0),
            p.push(_.trigger),
            h.push(_),
            s <= p.length && f.progress(1)
        }
    }, a;
    for (a in t)
        r[a] = a.substr(0, 2) === "on" && Fe(t[a]) && a !== "onRefreshInit" ? o(a, t[a]) : t[a];
    return Fe(s) && (s = s(),
    de(vt, "refresh", function() {
        return s = t.batchMax()
    })),
    As(n).forEach(function(u) {
        var l = {};
        for (a in r)
            l[a] = r[a];
        l.trigger = u,
        e.push(vt.create(l))
    }),
    e
}
;
var Zl = function(t, e, r, i) {
    return e > i ? t(i) : e < 0 && t(0),
    r > i ? (i - e) / (r - e) : r < 0 ? e / (e - r) : 1
}, Aa = function n(t, e) {
    e === !0 ? t.style.removeProperty("touch-action") : t.style.touchAction = e === !0 ? "auto" : e ? "pan-" + e + (ie.isTouch ? " pinch-zoom" : "") : "none",
    t === Ar && n(Vt, e)
}, uo = {
    auto: 1,
    scroll: 1
}, E_ = function(t) {
    var e = t.event, r = t.target, i = t.axis, s = (e.changedTouches ? e.changedTouches[0] : e).target, o = s._gsap || tt.core.getCache(s), a = Ee(), u;
    if (!o._isScrollT || a - o._isScrollT > 2e3) {
        for (; s && s !== Vt && (s.scrollHeight <= s.clientHeight && s.scrollWidth <= s.clientWidth || !(uo[(u = hr(s)).overflowY] || uo[u.overflowX])); )
            s = s.parentNode;
        o._isScroll = s && s !== r && !an(s) && (uo[(u = hr(s)).overflowY] || uo[u.overflowX]),
        o._isScrollT = a
    }
    (o._isScroll || i === "x") && (e.stopPropagation(),
    e._gsapAllow = !0)
}, vh = function(t, e, r, i) {
    return ie.create({
        target: t,
        capture: !0,
        debounce: !1,
        lockAxis: !0,
        type: e,
        onWheel: i = i && E_,
        onPress: i,
        onDrag: i,
        onScroll: i,
        onEnable: function() {
            return r && de(Xt, ie.eventTypes[0], Ql, !1, !0)
        },
        onDisable: function() {
            return he(Xt, ie.eventTypes[0], Ql, !0)
        }
    })
}, x_ = /(input|label|select|textarea)/i, Jl, Ql = function(t) {
    var e = x_.test(t.target.tagName);
    (e || Jl) && (t._gsapAllow = !0,
    Jl = e)
}, T_ = function(t) {
    Xi(t) || (t = {}),
    t.preventDefault = t.isNormalizer = t.allowClicks = !0,
    t.type || (t.type = "wheel,touch"),
    t.debounce = !!t.debounce,
    t.id = t.id || "normalizer";
    var e = t, r = e.normalizeScrollX, i = e.momentum, s = e.allowNestedScroll, o = e.onRelease, a, u, l = $e(t.target) || Ar, c = tt.core.globals().ScrollSmoother, p = c && c.get(), h = vi && (t.content && $e(t.content) || p && t.content !== !1 && !p.smooth() && p.content()), f = ki(l, ce), _ = ki(l, ze), d = 1, b = (ie.isTouch && Tt.visualViewport ? Tt.visualViewport.scale * Tt.visualViewport.width : Tt.outerWidth) / Tt.innerWidth, T = 0, w = Fe(i) ? function() {
        return i(a)
    }
    : function() {
        return i || 2.8
    }
    , C, A, O = vh(l, t.type, !0, s), P = function() {
        return A = !1
    }, E = Vr, L = Vr, M = function() {
        u = Xr(l, ce),
        L = hs(vi ? 1 : 0, u),
        r && (E = hs(0, Xr(l, ze))),
        C = en
    }, D = function() {
        h._gsap.y = rs(parseFloat(h._gsap.y) + f.offset) + "px",
        h.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(h._gsap.y) + ", 0, 1)",
        f.offset = f.cacheID = 0
    }, F = function() {
        if (A) {
            requestAnimationFrame(P);
            var H = rs(a.deltaY / 2)
              , G = L(f.v - H);
            if (h && G !== f.v + f.offset) {
                f.offset = G - f.v;
                var y = rs((parseFloat(h && h._gsap.y) || 0) - f.offset);
                h.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + y + ", 0, 1)",
                h._gsap.y = y + "px",
                f.cacheID = bt.cache,
                fi()
            }
            return !0
        }
        f.offset && D(),
        A = !0
    }, k, $, U, W, q = function() {
        M(),
        k.isActive() && k.vars.scrollY > u && (f() > u ? k.progress(1) && f(u) : k.resetTo("scrollY", u))
    };
    return h && tt.set(h, {
        y: "+=0"
    }),
    t.ignoreCheck = function(K) {
        return vi && K.type === "touchmove" && F() || d > 1.05 && K.type !== "touchstart" || a.isGesturing || K.touches && K.touches.length > 1
    }
    ,
    t.onPress = function() {
        A = !1;
        var K = d;
        d = rs((Tt.visualViewport && Tt.visualViewport.scale || 1) / b),
        k.pause(),
        K !== d && Aa(l, d > 1.01 ? !0 : r ? !1 : "x"),
        $ = _(),
        U = f(),
        M(),
        C = en
    }
    ,
    t.onRelease = t.onGestureStart = function(K, H) {
        if (f.offset && D(),
        !H)
            W.restart(!0);
        else {
            bt.cache++;
            var G = w(), y, j;
            r && (y = _(),
            j = y + G * .05 * -K.velocityX / .227,
            G *= Zl(_, y, j, Xr(l, ze)),
            k.vars.scrollX = E(j)),
            y = f(),
            j = y + G * .05 * -K.velocityY / .227,
            G *= Zl(f, y, j, Xr(l, ce)),
            k.vars.scrollY = L(j),
            k.invalidate().duration(G).play(.01),
            (vi && k.vars.scrollY >= u || y >= u - 1) && tt.to({}, {
                onUpdate: q,
                duration: G
            })
        }
        o && o(K)
    }
    ,
    t.onWheel = function() {
        k._ts && k.pause(),
        Ee() - T > 1e3 && (C = 0,
        T = Ee())
    }
    ,
    t.onChange = function(K, H, G, y, j) {
        if (en !== C && M(),
        H && r && _(E(y[2] === H ? $ + (K.startX - K.x) : _() + H - y[1])),
        G) {
            f.offset && D();
            var nt = j[2] === G
              , et = nt ? U + K.startY - K.y : f() + G - j[1]
              , at = L(et);
            nt && et !== at && (U += at - et),
            f(at)
        }
        (G || H) && fi()
    }
    ,
    t.onEnable = function() {
        Aa(l, r ? !1 : "x"),
        vt.addEventListener("refresh", q),
        de(Tt, "resize", q),
        f.smooth && (f.target.style.scrollBehavior = "auto",
        f.smooth = _.smooth = !1),
        O.enable()
    }
    ,
    t.onDisable = function() {
        Aa(l, !0),
        he(Tt, "resize", q),
        vt.removeEventListener("refresh", q),
        O.kill()
    }
    ,
    t.lockAxis = t.lockAxis !== !1,
    a = new ie(t),
    a.iOS = vi,
    vi && !f() && f(1),
    vi && tt.ticker.add(Vr),
    W = a._dc,
    k = tt.to(a, {
        ease: "power4",
        paused: !0,
        inherit: !1,
        scrollX: r ? "+=0.1" : "+=0",
        scrollY: "+=0.1",
        modifiers: {
            scrollY: mh(f, f(), function() {
                return k.pause()
            })
        },
        onUpdate: fi,
        onComplete: W.vars.onComplete
    }),
    a
};
vt.sort = function(n) {
    return yt.sort(n || function(t, e) {
        return (t.vars.refreshPriority || 0) * -1e6 + t.start - (e.start + (e.vars.refreshPriority || 0) * -1e6)
    }
    )
}
;
vt.observe = function(n) {
    return new ie(n)
}
;
vt.normalizeScroll = function(n) {
    if (typeof n > "u")
        return De;
    if (n === !0 && De)
        return De.enable();
    if (n === !1) {
        De && De.kill(),
        De = n;
        return
    }
    var t = n instanceof ie ? n : T_(n);
    return De && De.target === t.target && De.kill(),
    an(t.target) && (De = t),
    t
}
;
vt.core = {
    _getVelocityProp: Qa,
    _inputObserver: vh,
    _scrollers: bt,
    _proxies: qr,
    bridge: {
        ss: function() {
            mr || ln("scrollStart"),
            mr = Ee()
        },
        ref: function() {
            return we
        }
    }
};
ah() && tt.registerPlugin(vt);
var au = {
    exports: {}
};
(function(n, t) {
    (function(e, r) {
        r(t)
    }
    )(gu, function(e) {
        var r, i, s, o, a, u, l, c, p = "transform", h = p + "Origin", f, _ = function(g) {
            var v = g.ownerDocument || g;
            for (!(p in g.style) && ("msTransform"in g.style) && (p = "msTransform",
            h = p + "Origin"); v.parentNode && (v = v.parentNode); )
                ;
            if (i = window,
            l = new F,
            v) {
                r = v,
                s = v.documentElement,
                o = v.body,
                c = r.createElementNS("http://www.w3.org/2000/svg", "g"),
                c.style.transform = "none";
                var m = v.createElement("div")
                  , x = v.createElement("div")
                  , S = v && (v.body || v.firstElementChild);
                S && S.appendChild && (S.appendChild(m),
                m.appendChild(x),
                m.setAttribute("style", "position:static;transform:translate3d(0,0,1px)"),
                f = x.offsetParent !== m,
                S.removeChild(m))
            }
            return v
        }, d = function(g) {
            for (var v, m; g && g !== o; )
                m = g._gsap,
                m && m.uncache && m.get(g, "x"),
                m && !m.scaleX && !m.scaleY && m.renderTransform && (m.scaleX = m.scaleY = 1e-4,
                m.renderTransform(1, m),
                v ? v.push(m) : v = [m]),
                g = g.parentNode;
            return v
        }, b = [], T = [], w = function() {
            return i.pageYOffset || r.scrollTop || s.scrollTop || o.scrollTop || 0
        }, C = function() {
            return i.pageXOffset || r.scrollLeft || s.scrollLeft || o.scrollLeft || 0
        }, A = function(g) {
            return g.ownerSVGElement || ((g.tagName + "").toLowerCase() === "svg" ? g : null)
        }, O = function I(g) {
            if (i.getComputedStyle(g).position === "fixed")
                return !0;
            if (g = g.parentNode,
            g && g.nodeType === 1)
                return I(g)
        }, P = function I(g, v) {
            if (g.parentNode && (r || _(g))) {
                var m = A(g)
                  , x = m ? m.getAttribute("xmlns") || "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml"
                  , S = m ? v ? "rect" : "g" : "div"
                  , R = v !== 2 ? 0 : 100
                  , V = v === 3 ? 100 : 0
                  , B = "position:absolute;display:block;pointer-events:none;margin:0;padding:0;"
                  , N = r.createElementNS ? r.createElementNS(x.replace(/^https/, "http"), S) : r.createElement(S);
                return v && (m ? (u || (u = I(g)),
                N.setAttribute("width", .01),
                N.setAttribute("height", .01),
                N.setAttribute("transform", "translate(" + R + "," + V + ")"),
                u.appendChild(N)) : (a || (a = I(g),
                a.style.cssText = B),
                N.style.cssText = B + "width:0.1px;height:0.1px;top:" + V + "px;left:" + R + "px",
                a.appendChild(N))),
                N
            }
            throw "Need document and parent."
        }, E = function(g) {
            for (var v = new F, m = 0; m < g.numberOfItems; m++)
                v.multiply(g.getItem(m).matrix);
            return v
        }, L = function(g) {
            var v = g.getCTM(), m;
            return v || (m = g.style[p],
            g.style[p] = "none",
            g.appendChild(c),
            v = c.getCTM(),
            g.removeChild(c),
            m ? g.style[p] = m : g.style.removeProperty(p.replace(/([A-Z])/g, "-$1").toLowerCase())),
            v || l.clone()
        }, M = function(g, v) {
            var m = A(g), x = g === m, S = m ? b : T, R = g.parentNode, V, B, N, Z, Q, lt;
            if (g === i)
                return g;
            if (S.length || S.push(P(g, 1), P(g, 2), P(g, 3)),
            V = m ? u : a,
            m)
                x ? (N = L(g),
                Z = -N.e / N.a,
                Q = -N.f / N.d,
                B = l) : g.getBBox ? (N = g.getBBox(),
                B = g.transform ? g.transform.baseVal : {},
                B = B.numberOfItems ? B.numberOfItems > 1 ? E(B) : B.getItem(0).matrix : l,
                Z = B.a * N.x + B.c * N.y,
                Q = B.b * N.x + B.d * N.y) : (B = new F,
                Z = Q = 0),
                v && g.tagName.toLowerCase() === "g" && (Z = Q = 0),
                (x ? m : R).appendChild(V),
                V.setAttribute("transform", "matrix(" + B.a + "," + B.b + "," + B.c + "," + B.d + "," + (B.e + Z) + "," + (B.f + Q) + ")");
            else {
                if (Z = Q = 0,
                f)
                    for (B = g.offsetParent,
                    N = g; N && (N = N.parentNode) && N !== B && N.parentNode; )
                        (i.getComputedStyle(N)[p] + "").length > 4 && (Z = N.offsetLeft,
                        Q = N.offsetTop,
                        N = 0);
                if (lt = i.getComputedStyle(g),
                lt.position !== "absolute" && lt.position !== "fixed")
                    for (B = g.offsetParent; R && R !== B; )
                        Z += R.scrollLeft || 0,
                        Q += R.scrollTop || 0,
                        R = R.parentNode;
                N = V.style,
                N.top = g.offsetTop - Q + "px",
                N.left = g.offsetLeft - Z + "px",
                N[p] = lt[p],
                N[h] = lt[h],
                N.position = lt.position === "fixed" ? "fixed" : "absolute",
                g.parentNode.appendChild(V)
            }
            return V
        }, D = function(g, v, m, x, S, R, V) {
            return g.a = v,
            g.b = m,
            g.c = x,
            g.d = S,
            g.e = R,
            g.f = V,
            g
        }, F = function() {
            function I(v, m, x, S, R, V) {
                v === void 0 && (v = 1),
                m === void 0 && (m = 0),
                x === void 0 && (x = 0),
                S === void 0 && (S = 1),
                R === void 0 && (R = 0),
                V === void 0 && (V = 0),
                D(this, v, m, x, S, R, V)
            }
            var g = I.prototype;
            return g.inverse = function() {
                var m = this.a
                  , x = this.b
                  , S = this.c
                  , R = this.d
                  , V = this.e
                  , B = this.f
                  , N = m * R - x * S || 1e-10;
                return D(this, R / N, -x / N, -S / N, m / N, (S * B - R * V) / N, -(m * B - x * V) / N)
            }
            ,
            g.multiply = function(m) {
                var x = this.a
                  , S = this.b
                  , R = this.c
                  , V = this.d
                  , B = this.e
                  , N = this.f
                  , Z = m.a
                  , Q = m.c
                  , lt = m.b
                  , ft = m.d
                  , ht = m.e
                  , dt = m.f;
                return D(this, Z * x + lt * R, Z * S + lt * V, Q * x + ft * R, Q * S + ft * V, B + ht * x + dt * R, N + ht * S + dt * V)
            }
            ,
            g.clone = function() {
                return new I(this.a,this.b,this.c,this.d,this.e,this.f)
            }
            ,
            g.equals = function(m) {
                var x = this.a
                  , S = this.b
                  , R = this.c
                  , V = this.d
                  , B = this.e
                  , N = this.f;
                return x === m.a && S === m.b && R === m.c && V === m.d && B === m.e && N === m.f
            }
            ,
            g.apply = function(m, x) {
                x === void 0 && (x = {});
                var S = m.x
                  , R = m.y
                  , V = this.a
                  , B = this.b
                  , N = this.c
                  , Z = this.d
                  , Q = this.e
                  , lt = this.f;
                return x.x = S * V + R * N + Q || 0,
                x.y = S * B + R * Z + lt || 0,
                x
            }
            ,
            I
        }();
        function k(I, g, v, m) {
            if (!I || !I.parentNode || (r || _(I)).documentElement === I)
                return new F;
            var x = d(I)
              , S = A(I)
              , R = S ? b : T
              , V = M(I, v)
              , B = R[0].getBoundingClientRect()
              , N = R[1].getBoundingClientRect()
              , Z = R[2].getBoundingClientRect()
              , Q = V.parentNode
              , lt = !m && O(I)
              , ft = new F((N.left - B.left) / 100,(N.top - B.top) / 100,(Z.left - B.left) / 100,(Z.top - B.top) / 100,B.left + (lt ? 0 : C()),B.top + (lt ? 0 : w()));
            if (Q.removeChild(V),
            x)
                for (B = x.length; B--; )
                    N = x[B],
                    N.scaleX = N.scaleY = 0,
                    N.renderTransform(1, N);
            return g ? ft.inverse() : ft
        }
        /*!
 * Flip 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
        var $ = 1, U, W, q, K, H, G, y, j = function(g, v) {
            return g.actions.forEach(function(m) {
                return m.vars[v] && m.vars[v](m)
            })
        }, nt = {}, et = 180 / Math.PI, at = Math.PI / 180, Ct = {}, X = {}, ot = {}, At = function(g) {
            return typeof g == "string" ? g.split(" ").join("").split(",") : g
        }, gt = At("onStart,onUpdate,onComplete,onReverseComplete,onInterrupt"), Lt = At("transform,transformOrigin,width,height,position,top,left,opacity,zIndex,maxWidth,maxHeight,minWidth,minHeight"), Yt = function(g) {
            return U(g)[0] || console.warn("Element not found:", g)
        }, Qt = function(g) {
            return Math.round(g * 1e4) / 1e4 || 0
        }, Y = function(g, v, m) {
            return g.forEach(function(x) {
                return x.classList[m](v)
            })
        }, ut = {
            zIndex: 1,
            kill: 1,
            simple: 1,
            spin: 1,
            clearProps: 1,
            targets: 1,
            toggleClass: 1,
            onComplete: 1,
            onUpdate: 1,
            onInterrupt: 1,
            onStart: 1,
            delay: 1,
            repeat: 1,
            repeatDelay: 1,
            yoyo: 1,
            scale: 1,
            fade: 1,
            absolute: 1,
            props: 1,
            onEnter: 1,
            onLeave: 1,
            custom: 1,
            paused: 1,
            nested: 1,
            prune: 1,
            absoluteOnLeave: 1
        }, zt = {
            zIndex: 1,
            simple: 1,
            clearProps: 1,
            scale: 1,
            absolute: 1,
            fitChild: 1,
            getVars: 1,
            props: 1
        }, Ht = function(g) {
            return g.replace(/([A-Z])/g, "-$1").toLowerCase()
        }, z = function(g, v) {
            var m = {}, x;
            for (x in g)
                v[x] || (m[x] = g[x]);
            return m
        }, ge = {}, ur = function(g) {
            var v = ge[g] = At(g);
            return ot[g] = v.concat(Lt),
            v
        }, Dr = function(g) {
            var v = g._gsap || W.core.getCache(g);
            return v.gmCache === W.ticker.frame ? v.gMatrix : (v.gmCache = W.ticker.frame,
            v.gMatrix = k(g, !0, !1, !0))
        }, jt = function I(g, v, m) {
            m === void 0 && (m = 0);
            for (var x = g.parentNode, S = 1e3 * Math.pow(10, m) * (v ? -1 : 1), R = v ? -S * 900 : 0; g; )
                R += S,
                g = g.previousSibling;
            return x ? R + I(x, v, m + 1) : R
        }, Ke = function(g, v, m) {
            return g.forEach(function(x) {
                return x.d = jt(m ? x.element : x.t, v)
            }),
            g.sort(function(x, S) {
                return x.d - S.d
            }),
            g
        }, Ze = function(g, v) {
            for (var m = g.element.style, x = g.css = g.css || [], S = v.length, R, V; S--; )
                R = v[S],
                V = m[R] || m.getPropertyValue(R),
                x.push(V ? R : X[R] || (X[R] = Ht(R)), V);
            return m
        }, br = function(g) {
            var v = g.css
              , m = g.element.style
              , x = 0;
            for (g.cache.uncache = 1; x < v.length; x += 2)
                v[x + 1] ? m[v[x]] = v[x + 1] : m.removeProperty(v[x]);
            !v[v.indexOf("transform") + 1] && m.translate && (m.removeProperty("translate"),
            m.removeProperty("scale"),
            m.removeProperty("rotate"))
        }, te = function(g, v) {
            g.forEach(function(m) {
                return m.a.cache.uncache = 1
            }),
            v || g.finalStates.forEach(br)
        }, lr = "paddingTop,paddingRight,paddingBottom,paddingLeft,gridArea,transition".split(","), Ft = function(g, v, m) {
            var x = g.element, S = g.width, R = g.height, V = g.uncache, B = g.getProp, N = x.style, Z = 4, Q, lt, ft;
            if (typeof v != "object" && (v = g),
            q && m !== 1)
                return q._abs.push({
                    t: x,
                    b: g,
                    a: g,
                    sd: 0
                }),
                q._final.push(function() {
                    return (g.cache.uncache = 1) && br(g)
                }),
                x;
            for (lt = B("display") === "none",
            (!g.isVisible || lt) && (lt && (Ze(g, ["display"]).display = v.display),
            g.matrix = v.matrix,
            g.width = S = g.width || v.width,
            g.height = R = g.height || v.height),
            Ze(g, lr),
            ft = window.getComputedStyle(x); Z--; )
                N[lr[Z]] = ft[lr[Z]];
            if (N.gridArea = "1 / 1 / 1 / 1",
            N.transition = "none",
            N.position = "absolute",
            N.width = S + "px",
            N.height = R + "px",
            N.top || (N.top = "0px"),
            N.left || (N.left = "0px"),
            V)
                Q = new rt(x);
            else if (Q = z(g, Ct),
            Q.position = "absolute",
            g.simple) {
                var ht = x.getBoundingClientRect();
                Q.matrix = new F(1,0,0,1,ht.left + C(),ht.top + w())
            } else
                Q.matrix = k(x, !1, !1, !0);
            return Q = Ae(Q, g, !0),
            g.x = G(Q.x, .01),
            g.y = G(Q.y, .01),
            x
        }, Be = function(g, v) {
            return v !== !0 && (v = U(v),
            g = g.filter(function(m) {
                if (v.indexOf((m.sd < 0 ? m.b : m.a).element) !== -1)
                    return !0;
                m.t._gsap.renderTransform(1),
                m.b.isVisible && (m.t.style.width = m.b.width + "px",
                m.t.style.height = m.b.height + "px")
            })),
            g
        }, Ce = function(g) {
            return Ke(g, !0).forEach(function(v) {
                return (v.a.isVisible || v.b.isVisible) && Ft(v.sd < 0 ? v.b : v.a, v.b, 1)
            })
        }, wr = function(g, v) {
            return v && g.idLookup[Zr(v).id] || g.elementStates[0]
        }, Zr = function(g, v, m, x) {
            return g instanceof rt ? g : g instanceof st ? wr(g, x) : new rt(typeof g == "string" ? Yt(g) || console.warn(g + " not found") : g,v,m)
        }, Kt = function(g, v) {
            for (var m = W.getProperty(g.element, null, "native"), x = g.props = {}, S = v.length; S--; )
                x[v[S]] = (m(v[S]) + "").trim();
            return x.zIndex && (x.zIndex = parseFloat(x.zIndex) || 0),
            g
        }, zi = function(g, v) {
            var m = g.style || g, x;
            for (x in v)
                m[x] = v[x]
        }, Mr = function(g) {
            var v = g.getAttribute("data-flip-id");
            return v || g.setAttribute("data-flip-id", v = "auto-" + $++),
            v
        }, Jr = function(g) {
            return g.map(function(v) {
                return v.element
            })
        }, Qr = function(g, v, m) {
            return g && v.length && m.add(g(Jr(v), m, new st(v,0,!0)), 0)
        }, Ae = function(g, v, m, x, S, R) {
            var V = g.element, B = g.cache, N = g.parent, Z = g.x, Q = g.y, lt = v.width, ft = v.height, ht = v.scaleX, dt = v.scaleY, wt = v.rotation, kt = v.bounds, Pt = R && y && y(V, "transform"), it = g, Dt = v.matrix, Bt = Dt.e, ne = Dt.f, ye = g.bounds.width !== kt.width || g.bounds.height !== kt.height || g.scaleX !== ht || g.scaleY !== dt || g.rotation !== wt, ee = !ye && g.simple && v.simple && !S, $t, Et, Mt, ti, Sr, be, xt;
            return ee || !N ? (ht = dt = 1,
            wt = $t = 0) : (Sr = Dr(N),
            be = Sr.clone().multiply(v.ctm ? v.matrix.clone().multiply(v.ctm) : v.matrix),
            wt = Qt(Math.atan2(be.b, be.a) * et),
            $t = Qt(Math.atan2(be.c, be.d) * et + wt) % 360,
            ht = Math.sqrt(Math.pow(be.a, 2) + Math.pow(be.b, 2)),
            dt = Math.sqrt(Math.pow(be.c, 2) + Math.pow(be.d, 2)) * Math.cos($t * at),
            S && (S = U(S)[0],
            ti = W.getProperty(S),
            xt = S.getBBox && typeof S.getBBox == "function" && S.getBBox(),
            it = {
                scaleX: ti("scaleX"),
                scaleY: ti("scaleY"),
                width: xt ? xt.width : Math.ceil(parseFloat(ti("width", "px"))),
                height: xt ? xt.height : parseFloat(ti("height", "px"))
            }),
            B.rotation = wt + "deg",
            B.skewX = $t + "deg"),
            m ? (ht *= lt === it.width || !it.width ? 1 : lt / it.width,
            dt *= ft === it.height || !it.height ? 1 : ft / it.height,
            B.scaleX = ht,
            B.scaleY = dt) : (lt = G(lt * ht / it.scaleX, 0),
            ft = G(ft * dt / it.scaleY, 0),
            V.style.width = lt + "px",
            V.style.height = ft + "px"),
            x && zi(V, v.props),
            ee || !N ? (Z += Bt - g.matrix.e,
            Q += ne - g.matrix.f) : ye || N !== v.parent ? (B.renderTransform(1, B),
            be = k(S || V, !1, !1, !0),
            Et = Sr.apply({
                x: be.e,
                y: be.f
            }),
            Mt = Sr.apply({
                x: Bt,
                y: ne
            }),
            Z += Mt.x - Et.x,
            Q += Mt.y - Et.y) : (Sr.e = Sr.f = 0,
            Mt = Sr.apply({
                x: Bt - g.matrix.e,
                y: ne - g.matrix.f
            }),
            Z += Mt.x,
            Q += Mt.y),
            Z = G(Z, .02),
            Q = G(Q, .02),
            R && !(R instanceof rt) ? Pt && Pt.revert() : (B.x = Z + "px",
            B.y = Q + "px",
            B.renderTransform(1, B)),
            R && (R.x = Z,
            R.y = Q,
            R.rotation = wt,
            R.skewX = $t,
            m ? (R.scaleX = ht,
            R.scaleY = dt) : (R.width = lt,
            R.height = ft)),
            R || B
        }, Er = function(g, v) {
            return g instanceof st ? g : new st(g,v)
        }, _t = function(g, v, m) {
            var x = g.idLookup[m]
              , S = g.alt[m];
            return S.isVisible && (!(v.getElementState(S.element) || S).isVisible || !x.isVisible) ? S : x
        }, xr = [], Oe = "width,height,overflowX,overflowY".split(","), ve, Ve = function(g) {
            if (g !== ve) {
                var v = H.style
                  , m = H.clientWidth === window.outerWidth
                  , x = H.clientHeight === window.outerHeight
                  , S = 4;
                if (g && (m || x)) {
                    for (; S--; )
                        xr[S] = v[Oe[S]];
                    m && (v.width = H.clientWidth + "px",
                    v.overflowY = "hidden"),
                    x && (v.height = H.clientHeight + "px",
                    v.overflowX = "hidden"),
                    ve = g
                } else if (ve) {
                    for (; S--; )
                        xr[S] ? v[Oe[S]] = xr[S] : v.removeProperty(Ht(Oe[S]));
                    ve = g
                }
            }
        }, Tr = function(g, v, m, x) {
            g instanceof st && v instanceof st || console.warn("Not a valid state object."),
            m = m || {};
            var S = m, R = S.clearProps, V = S.onEnter, B = S.onLeave, N = S.absolute, Z = S.absoluteOnLeave, Q = S.custom, lt = S.delay, ft = S.paused, ht = S.repeat, dt = S.repeatDelay, wt = S.yoyo, kt = S.toggleClass, Pt = S.nested, it = S.zIndex, Dt = S.scale, Bt = S.fade, ne = S.stagger, ye = S.spin, ee = S.prune, $t = ("props"in m ? m : g).props, Et = z(m, ut), Mt = W.timeline({
                delay: lt,
                paused: ft,
                repeat: ht,
                repeatDelay: dt,
                yoyo: wt,
                data: "isFlip"
            }), ti = Et, Sr = [], be = [], xt = [], Hs = [], rd = ye === !0 ? 1 : ye || 0, id = typeof ye == "function" ? ye : function() {
                return rd
            }
            , oa = g.interrupted || v.interrupted, ll = Mt[x !== 1 ? "to" : "from"], pn, Qe, cl, mi, ue, Zt, _n, Ir, aa, ei, ri, ua, se, Pe;
            for (Qe in v.idLookup)
                ri = v.alt[Qe] ? _t(v, g, Qe) : v.idLookup[Qe],
                ue = ri.element,
                ei = g.idLookup[Qe],
                g.alt[Qe] && ue === ei.element && (g.alt[Qe].isVisible || !ri.isVisible) && (ei = g.alt[Qe]),
                ei ? (Zt = {
                    t: ue,
                    b: ei,
                    a: ri,
                    sd: ei.element === ue ? 0 : ri.isVisible ? 1 : -1
                },
                xt.push(Zt),
                Zt.sd && (Zt.sd < 0 && (Zt.b = ri,
                Zt.a = ei),
                oa && Ze(Zt.b, $t ? ot[$t] : Lt),
                Bt && xt.push(Zt.swap = {
                    t: ei.element,
                    b: Zt.b,
                    a: Zt.a,
                    sd: -Zt.sd,
                    swap: Zt
                })),
                ue._flip = ei.element._flip = q ? q.timeline : Mt) : ri.isVisible && (xt.push({
                    t: ue,
                    b: z(ri, {
                        isVisible: 1
                    }),
                    a: ri,
                    sd: 0,
                    entering: 1
                }),
                ue._flip = q ? q.timeline : Mt);
            if ($t && (ge[$t] || ur($t)).forEach(function(ii) {
                return Et[ii] = function(Fi) {
                    return xt[Fi].a.props[ii]
                }
            }),
            xt.finalStates = aa = [],
            ua = function() {
                for (Ke(xt),
                Ve(!0),
                mi = 0; mi < xt.length; mi++)
                    Zt = xt[mi],
                    se = Zt.a,
                    Pe = Zt.b,
                    ee && !se.isDifferent(Pe) && !Zt.entering ? xt.splice(mi--, 1) : (ue = Zt.t,
                    Pt && !(Zt.sd < 0) && mi && (se.matrix = k(ue, !1, !1, !0)),
                    Pe.isVisible && se.isVisible ? (Zt.sd < 0 ? (_n = new rt(ue,$t,g.simple),
                    Ae(_n, se, Dt, 0, 0, _n),
                    _n.matrix = k(ue, !1, !1, !0),
                    _n.css = Zt.b.css,
                    Zt.a = se = _n,
                    Bt && (ue.style.opacity = oa ? Pe.opacity : se.opacity),
                    ne && Hs.push(ue)) : Zt.sd > 0 && Bt && (ue.style.opacity = oa ? se.opacity - Pe.opacity : "0"),
                    Ae(se, Pe, Dt, $t)) : Pe.isVisible !== se.isVisible && (Pe.isVisible ? se.isVisible || (Pe.css = se.css,
                    be.push(Pe),
                    xt.splice(mi--, 1),
                    N && Pt && Ae(se, Pe, Dt, $t)) : (se.isVisible && Sr.push(se),
                    xt.splice(mi--, 1))),
                    Dt || (ue.style.maxWidth = Math.max(se.width, Pe.width) + "px",
                    ue.style.maxHeight = Math.max(se.height, Pe.height) + "px",
                    ue.style.minWidth = Math.min(se.width, Pe.width) + "px",
                    ue.style.minHeight = Math.min(se.height, Pe.height) + "px"),
                    Pt && kt && ue.classList.add(kt)),
                    aa.push(se);
                var Fi;
                if (kt && (Fi = aa.map(function(mt) {
                    return mt.element
                }),
                Pt && Fi.forEach(function(mt) {
                    return mt.classList.remove(kt)
                })),
                Ve(!1),
                Dt ? (Et.scaleX = function(mt) {
                    return xt[mt].a.scaleX
                }
                ,
                Et.scaleY = function(mt) {
                    return xt[mt].a.scaleY
                }
                ) : (Et.width = function(mt) {
                    return xt[mt].a.width + "px"
                }
                ,
                Et.height = function(mt) {
                    return xt[mt].a.height + "px"
                }
                ,
                Et.autoRound = m.autoRound || !1),
                Et.x = function(mt) {
                    return xt[mt].a.x + "px"
                }
                ,
                Et.y = function(mt) {
                    return xt[mt].a.y + "px"
                }
                ,
                Et.rotation = function(mt) {
                    return xt[mt].a.rotation + (ye ? id(mt, Ir[mt], Ir) * 360 : 0)
                }
                ,
                Et.skewX = function(mt) {
                    return xt[mt].a.skewX
                }
                ,
                Ir = xt.map(function(mt) {
                    return mt.t
                }),
                (it || it === 0) && (Et.modifiers = {
                    zIndex: function() {
                        return it
                    }
                },
                Et.zIndex = it,
                Et.immediateRender = m.immediateRender !== !1),
                Bt && (Et.opacity = function(mt) {
                    return xt[mt].sd < 0 ? 0 : xt[mt].sd > 0 ? xt[mt].a.opacity : "+=0"
                }
                ),
                Hs.length) {
                    ne = W.utils.distribute(ne);
                    var nd = Ir.slice(Hs.length);
                    Et.stagger = function(mt, hl) {
                        return ne(~Hs.indexOf(hl) ? Ir.indexOf(xt[mt].swap.t) : mt, hl, nd)
                    }
                }
                if (gt.forEach(function(mt) {
                    return m[mt] && Mt.eventCallback(mt, m[mt], m[mt + "Params"])
                }),
                Q && Ir.length) {
                    ti = z(Et, ut),
                    "scale"in Q && (Q.scaleX = Q.scaleY = Q.scale,
                    delete Q.scale);
                    for (Qe in Q)
                        pn = z(Q[Qe], zt),
                        pn[Qe] = Et[Qe],
                        !("duration"in pn) && "duration"in Et && (pn.duration = Et.duration),
                        pn.stagger = Et.stagger,
                        ll.call(Mt, Ir, pn, 0),
                        delete ti[Qe]
                }
                (Ir.length || be.length || Sr.length) && (kt && Mt.add(function() {
                    return Y(Fi, kt, Mt._zTime < 0 ? "remove" : "add")
                }, 0) && !ft && Y(Fi, kt, "add"),
                Ir.length && ll.call(Mt, Ir, ti, 0)),
                Qr(V, Sr, Mt),
                Qr(B, be, Mt);
                var ca = q && q.timeline;
                ca && (ca.add(Mt, 0),
                q._final.push(function() {
                    return te(xt, !R)
                })),
                cl = Mt.duration(),
                Mt.call(function() {
                    var mt = Mt.time() >= cl;
                    mt && !ca && te(xt, !R),
                    kt && Y(Fi, kt, mt ? "remove" : "add")
                })
            }
            ,
            Z && (N = xt.filter(function(ii) {
                return !ii.sd && !ii.a.isVisible && ii.b.isVisible
            }).map(function(ii) {
                return ii.a.element
            })),
            q) {
                var fl;
                N && (fl = q._abs).push.apply(fl, Be(xt, N)),
                q._run.push(ua)
            } else
                N && Ce(Be(xt, N)),
                ua();
            var la = q ? q.timeline : Mt;
            return la.revert = function() {
                return Je(la, 1, 1)
            }
            ,
            la
        }, gi = function I(g) {
            g.vars.onInterrupt && g.vars.onInterrupt.apply(g, g.vars.onInterruptParams || []),
            g.getChildren(!0, !1, !0).forEach(I)
        }, Je = function(g, v, m) {
            if (g && g.progress() < 1 && (!g.paused() || m))
                return v && (gi(g),
                v < 2 && g.progress(1),
                g.kill()),
                !0
        }, Rr = function(g) {
            for (var v = g.idLookup = {}, m = g.alt = {}, x = g.elementStates, S = x.length, R; S--; )
                R = x[S],
                v[R.id] ? m[R.id] = R : v[R.id] = R
        }, st = function() {
            function I(v, m, x) {
                if (this.props = m && m.props,
                this.simple = !!(m && m.simple),
                x)
                    this.targets = Jr(v),
                    this.elementStates = v,
                    Rr(this);
                else {
                    this.targets = U(v);
                    var S = m && (m.kill === !1 || m.batch && !m.kill);
                    q && !S && q._kill.push(this),
                    this.update(S || !!q)
                }
            }
            var g = I.prototype;
            return g.update = function(m) {
                var x = this;
                return this.elementStates = this.targets.map(function(S) {
                    return new rt(S,x.props,x.simple)
                }),
                Rr(this),
                this.interrupt(m),
                this.recordInlineStyles(),
                this
            }
            ,
            g.clear = function() {
                return this.targets.length = this.elementStates.length = 0,
                Rr(this),
                this
            }
            ,
            g.fit = function(m, x, S) {
                for (var R = Ke(this.elementStates.slice(0), !1, !0), V = (m || this).idLookup, B = 0, N, Z; B < R.length; B++)
                    N = R[B],
                    S && (N.matrix = k(N.element, !1, !1, !0)),
                    Z = V[N.id],
                    Z && Ae(N, Z, x, !0, 0, N),
                    N.matrix = k(N.element, !1, !1, !0);
                return this
            }
            ,
            g.getProperty = function(m, x) {
                var S = this.getElementState(m) || Ct;
                return (x in S ? S : S.props || Ct)[x]
            }
            ,
            g.add = function(m) {
                for (var x = m.targets.length, S = this.idLookup, R = this.alt, V, B, N; x--; )
                    B = m.elementStates[x],
                    N = S[B.id],
                    N && (B.element === N.element || R[B.id] && R[B.id].element === B.element) ? (V = this.elementStates.indexOf(B.element === N.element ? N : R[B.id]),
                    this.targets.splice(V, 1, m.targets[x]),
                    this.elementStates.splice(V, 1, B)) : (this.targets.push(m.targets[x]),
                    this.elementStates.push(B));
                return m.interrupted && (this.interrupted = !0),
                m.simple || (this.simple = !1),
                Rr(this),
                this
            }
            ,
            g.compare = function(m) {
                var x = m.idLookup, S = this.idLookup, R = [], V = [], B = [], N = [], Z = [], Q = m.alt, lt = this.alt, ft = function(ee, $t, Et) {
                    return (ee.isVisible !== $t.isVisible ? ee.isVisible ? B : N : ee.isVisible ? V : R).push(Et) && Z.push(Et)
                }, ht = function(ee, $t, Et) {
                    return Z.indexOf(Et) < 0 && ft(ee, $t, Et)
                }, dt, wt, kt, Pt, it, Dt, Bt, ne;
                for (kt in x)
                    it = Q[kt],
                    Dt = lt[kt],
                    dt = it ? _t(m, this, kt) : x[kt],
                    Pt = dt.element,
                    wt = S[kt],
                    Dt ? (ne = wt.isVisible || !Dt.isVisible && Pt === wt.element ? wt : Dt,
                    Bt = it && !dt.isVisible && !it.isVisible && ne.element === it.element ? it : dt,
                    Bt.isVisible && ne.isVisible && Bt.element !== ne.element ? ((Bt.isDifferent(ne) ? V : R).push(Bt.element, ne.element),
                    Z.push(Bt.element, ne.element)) : ft(Bt, ne, Bt.element),
                    it && Bt.element === it.element && (it = x[kt]),
                    ht(Bt.element !== wt.element && it ? it : Bt, wt, wt.element),
                    ht(it && it.element === Dt.element ? it : Bt, Dt, Dt.element),
                    it && ht(it, Dt.element === it.element ? Dt : wt, it.element)) : (wt ? wt.isDifferent(dt) ? ft(dt, wt, Pt) : R.push(Pt) : B.push(Pt),
                    it && ht(it, wt, it.element));
                for (kt in S)
                    x[kt] || (N.push(S[kt].element),
                    lt[kt] && N.push(lt[kt].element));
                return {
                    changed: V,
                    unchanged: R,
                    enter: B,
                    leave: N
                }
            }
            ,
            g.recordInlineStyles = function() {
                for (var m = ot[this.props] || Lt, x = this.elementStates.length; x--; )
                    Ze(this.elementStates[x], m)
            }
            ,
            g.interrupt = function(m) {
                var x = this
                  , S = [];
                this.targets.forEach(function(R) {
                    var V = R._flip
                      , B = Je(V, m ? 0 : 1);
                    m && B && S.indexOf(V) < 0 && V.add(function() {
                        return x.updateVisibility()
                    }),
                    B && S.push(V)
                }),
                !m && S.length && this.updateVisibility(),
                this.interrupted || (this.interrupted = !!S.length)
            }
            ,
            g.updateVisibility = function() {
                this.elementStates.forEach(function(m) {
                    var x = m.element.getBoundingClientRect();
                    m.isVisible = !!(x.width || x.height || x.top || x.left),
                    m.uncache = 1
                })
            }
            ,
            g.getElementState = function(m) {
                return this.elementStates[this.targets.indexOf(Yt(m))]
            }
            ,
            g.makeAbsolute = function() {
                return Ke(this.elementStates.slice(0), !0, !0).map(Ft)
            }
            ,
            I
        }(), rt = function() {
            function I(v, m, x) {
                this.element = v,
                this.update(m, x)
            }
            var g = I.prototype;
            return g.isDifferent = function(m) {
                var x = this.bounds
                  , S = m.bounds;
                return x.top !== S.top || x.left !== S.left || x.width !== S.width || x.height !== S.height || !this.matrix.equals(m.matrix) || this.opacity !== m.opacity || this.props && m.props && JSON.stringify(this.props) !== JSON.stringify(m.props)
            }
            ,
            g.update = function(m, x) {
                var S = this
                  , R = S.element
                  , V = W.getProperty(R)
                  , B = W.core.getCache(R)
                  , N = R.getBoundingClientRect()
                  , Z = R.getBBox && typeof R.getBBox == "function" && R.nodeName.toLowerCase() !== "svg" && R.getBBox()
                  , Q = x ? new F(1,0,0,1,N.left + C(),N.top + w()) : k(R, !1, !1, !0);
                S.getProp = V,
                S.element = R,
                S.id = Mr(R),
                S.matrix = Q,
                S.cache = B,
                S.bounds = N,
                S.isVisible = !!(N.width || N.height || N.left || N.top),
                S.display = V("display"),
                S.position = V("position"),
                S.parent = R.parentNode,
                S.x = V("x"),
                S.y = V("y"),
                S.scaleX = B.scaleX,
                S.scaleY = B.scaleY,
                S.rotation = V("rotation"),
                S.skewX = V("skewX"),
                S.opacity = V("opacity"),
                S.width = Z ? Z.width : G(V("width", "px"), .04),
                S.height = Z ? Z.height : G(V("height", "px"), .04),
                m && Kt(S, ge[m] || ur(m)),
                S.ctm = R.getCTM && R.nodeName.toLowerCase() === "svg" && L(R).inverse(),
                S.simple = x || Qt(Q.a) === 1 && !Qt(Q.b) && !Qt(Q.c) && Qt(Q.d) === 1,
                S.uncache = 0
            }
            ,
            I
        }(), Ot = function() {
            function I(v, m) {
                this.vars = v,
                this.batch = m,
                this.states = [],
                this.timeline = m.timeline
            }
            var g = I.prototype;
            return g.getStateById = function(m) {
                for (var x = this.states.length; x--; )
                    if (this.states[x].idLookup[m])
                        return this.states[x]
            }
            ,
            g.kill = function() {
                this.batch.remove(this)
            }
            ,
            I
        }(), J = function() {
            function I(v) {
                this.id = v,
                this.actions = [],
                this._kill = [],
                this._final = [],
                this._abs = [],
                this._run = [],
                this.data = {},
                this.state = new st,
                this.timeline = W.timeline()
            }
            var g = I.prototype;
            return g.add = function(m) {
                var x = this.actions.filter(function(S) {
                    return S.vars === m
                });
                return x.length ? x[0] : (x = new Ot(typeof m == "function" ? {
                    animate: m
                } : m,this),
                this.actions.push(x),
                x)
            }
            ,
            g.remove = function(m) {
                var x = this.actions.indexOf(m);
                return x >= 0 && this.actions.splice(x, 1),
                this
            }
            ,
            g.getState = function(m) {
                var x = this
                  , S = q
                  , R = K;
                return q = this,
                this.state.clear(),
                this._kill.length = 0,
                this.actions.forEach(function(V) {
                    V.vars.getState && (V.states.length = 0,
                    K = V,
                    V.state = V.vars.getState(V)),
                    m && V.states.forEach(function(B) {
                        return x.state.add(B)
                    })
                }),
                K = R,
                q = S,
                this.killConflicts(),
                this
            }
            ,
            g.animate = function() {
                var m = this, x = q, S = this.timeline, R = this.actions.length, V, B;
                for (q = this,
                S.clear(),
                this._abs.length = this._final.length = this._run.length = 0,
                this.actions.forEach(function(N) {
                    N.vars.animate && N.vars.animate(N);
                    var Z = N.vars.onEnter, Q = N.vars.onLeave, lt = N.targets, ft, ht;
                    lt && lt.length && (Z || Q) && (ft = new st,
                    N.states.forEach(function(dt) {
                        return ft.add(dt)
                    }),
                    ht = ft.compare(ct.getState(lt)),
                    ht.enter.length && Z && Z(ht.enter),
                    ht.leave.length && Q && Q(ht.leave))
                }),
                Ce(this._abs),
                this._run.forEach(function(N) {
                    return N()
                }),
                B = S.duration(),
                V = this._final.slice(0),
                S.add(function() {
                    B <= S.time() && (V.forEach(function(N) {
                        return N()
                    }),
                    j(m, "onComplete"))
                }),
                q = x; R--; )
                    this.actions[R].vars.once && this.actions[R].kill();
                return j(this, "onStart"),
                S.restart(),
                this
            }
            ,
            g.loadState = function(m) {
                m || (m = function() {
                    return 0
                }
                );
                var x = [];
                return this.actions.forEach(function(S) {
                    if (S.vars.loadState) {
                        var R, V = function B(N) {
                            N && (S.targets = N),
                            R = x.indexOf(B),
                            ~R && (x.splice(R, 1),
                            x.length || m())
                        };
                        x.push(V),
                        S.vars.loadState(V)
                    }
                }),
                x.length || m(),
                this
            }
            ,
            g.setState = function() {
                return this.actions.forEach(function(m) {
                    return m.targets = m.vars.setState && m.vars.setState(m)
                }),
                this
            }
            ,
            g.killConflicts = function(m) {
                return this.state.interrupt(m),
                this._kill.forEach(function(x) {
                    return x.interrupt(m)
                }),
                this
            }
            ,
            g.run = function(m, x) {
                var S = this;
                return this !== q && (m || this.getState(x),
                this.loadState(function() {
                    S._killed || (S.setState(),
                    S.animate())
                })),
                this
            }
            ,
            g.clear = function(m) {
                this.state.clear(),
                m || (this.actions.length = 0)
            }
            ,
            g.getStateById = function(m) {
                for (var x = this.actions.length, S; x--; )
                    if (S = this.actions[x].getStateById(m),
                    S)
                        return S;
                return this.state.idLookup[m] && this.state
            }
            ,
            g.kill = function() {
                this._killed = 1,
                this.clear(),
                delete nt[this.id]
            }
            ,
            I
        }(), ct = function() {
            function I() {}
            return I.getState = function(v, m) {
                var x = Er(v, m);
                return K && K.states.push(x),
                m && m.batch && I.batch(m.batch).state.add(x),
                x
            }
            ,
            I.from = function(v, m) {
                return m = m || {},
                "clearProps"in m || (m.clearProps = !0),
                Tr(v, Er(m.targets || v.targets, {
                    props: m.props || v.props,
                    simple: m.simple,
                    kill: !!m.kill
                }), m, -1)
            }
            ,
            I.to = function(v, m) {
                return Tr(v, Er(m.targets || v.targets, {
                    props: m.props || v.props,
                    simple: m.simple,
                    kill: !!m.kill
                }), m, 1)
            }
            ,
            I.fromTo = function(v, m, x) {
                return Tr(v, m, x)
            }
            ,
            I.fit = function(v, m, x) {
                var S = x ? z(x, zt) : {}
                  , R = x || S
                  , V = R.absolute
                  , B = R.scale
                  , N = R.getVars
                  , Z = R.props
                  , Q = R.runBackwards
                  , lt = R.onComplete
                  , ft = R.simple
                  , ht = x && x.fitChild && Yt(x.fitChild)
                  , dt = Zr(m, Z, ft, v)
                  , wt = Zr(v, 0, ft, dt)
                  , kt = Z ? ot[Z] : Lt
                  , Pt = W.context();
                return Z && zi(S, dt.props),
                Ze(wt, kt),
                Q && ("immediateRender"in S || (S.immediateRender = !0),
                S.onComplete = function() {
                    br(wt),
                    lt && lt.apply(this, arguments)
                }
                ),
                V && Ft(wt, dt),
                S = Ae(wt, dt, B || ht, Z, ht, S.duration || N ? S : 0),
                Pt && !N && Pt.add(function() {
                    return function() {
                        return br(wt)
                    }
                }),
                N ? S : S.duration ? W.to(wt.element, S) : null
            }
            ,
            I.makeAbsolute = function(v, m) {
                return (v instanceof st ? v : new st(v,m)).makeAbsolute()
            }
            ,
            I.batch = function(v) {
                return v || (v = "default"),
                nt[v] || (nt[v] = new J(v))
            }
            ,
            I.killFlipsOf = function(v, m) {
                (v instanceof st ? v.targets : U(v)).forEach(function(x) {
                    return x && Je(x._flip, m !== !1 ? 1 : 2)
                })
            }
            ,
            I.isFlipping = function(v) {
                var m = I.getByTarget(v);
                return !!m && m.isActive()
            }
            ,
            I.getByTarget = function(v) {
                return (Yt(v) || Ct)._flip
            }
            ,
            I.getElementState = function(v, m) {
                return new rt(Yt(v),m)
            }
            ,
            I.convertCoordinates = function(v, m, x) {
                var S = k(m, !0, !0).multiply(k(v));
                return x ? S.apply(x) : S
            }
            ,
            I.register = function(v) {
                if (H = typeof document < "u" && document.body,
                H) {
                    W = v,
                    _(H),
                    U = W.utils.toArray,
                    y = W.core.getStyleSaver;
                    var m = W.utils.snap(.1);
                    G = function(S, R) {
                        return m(parseFloat(S) + R)
                    }
                }
            }
            ,
            I
        }();
        ct.version = "3.12.5",
        typeof window < "u" && window.gsap && window.gsap.registerPlugin(ct),
        e.Flip = ct,
        e.default = ct,
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    })
}
)(au, au.exports);
var S_ = au.exports;
const ss = Lc(S_);
function tc(n) {
    document.querySelectorAll(n).forEach(t=>{
        const e = document.createElement("div");
        e.classList = "overflow-hidden",
        t.parentNode.appendChild(e),
        e.appendChild(t)
    }
    )
}
function C_(n) {
    We.set(".project_cms-item h3 .char", {
        opacity: .25
    }),
    n.forEach((t,e)=>{
        const r = t.getAttribute("data-project-slug")
          , i = t.querySelector(".text-caption:first-child")
          , s = t.querySelector(".text-caption:last-child");
        i.textContent = `0${e + 1}`,
        s.textContent = `0${n.length}`,
        t.setAttribute("id", r),
        vt.create({
            trigger: t,
            start: "top 50%",
            once: !0,
            onEnter: ()=>{
                We.to(t.querySelectorAll(".char"), {
                    opacity: 1,
                    stagger: {
                        each: .01
                    }
                })
            }
        })
    }
    )
}
function A_() {
    const n = We.timeline();
    return n.to(".loader_main-text", {
        delay: .2,
        opacity: 1,
        filter: "blur(0px)",
        duration: .7,
        y: "0%",
        transformOrigin: "center bottom",
        rotationX: 0,
        ease: "power4.out"
    }).to(".loader_main-text", {
        delay: .1,
        duration: .6,
        transformOrigin: "top center",
        rotationX: 2,
        filter: "blur(10px)",
        opacity: 0,
        y: "100%",
        ease: "power4.in"
    }).to(".loader", {
        delay: .1,
        height: "0%",
        duration: 1,
        ease: "expo.out"
    }).to(".loader_bottom-text", {
        duration: .3,
        opacity: 0
    }, "<0%").to("h1 .word", {
        opacity: 1,
        filter: "blur(0px)",
        duration: .65,
        y: "0%",
        transformOrigin: "center center",
        rotationX: 0,
        rotationZ: 0,
        ease: "power4.out",
        stagger: {
            each: .075
        }
    }, "<20%").to(".header_subtext .line", {
        opacity: 1,
        filter: "blur(0px)",
        duration: .55,
        y: "0%",
        rotationZ: 0,
        transformOrigin: "left bottom",
        ease: "power4.out",
        stagger: {
            each: .05
        }
    }, "<30%").to(".header_projects-list-link", {
        width: "100%",
        duration: .6,
        ease: "power4.out",
        stagger: {
            each: .075
        }
    }, "<10%").to(".header_projects-list-wrap .text-caption", {
        y: "0%",
        opacity: 1,
        filter: "blur(0px)",
        transformOrigin: "left bottom",
        rotationZ: 0,
        duration: .5,
        ease: "power4.out"
    }, "<0%").to(".header_projects-link-text", {
        y: "0%",
        opacity: 1,
        transformOrigin: "left bottom",
        filter: "blur(0px)",
        rotationZ: 0,
        duration: .5,
        ease: "power4.out",
        stagger: {
            each: .075
        }
    }, "<0%").to(".navbar_container", {
        y: "0%",
        opacity: 1,
        duration: .5,
        ease: "power4.out"
    }, "<30%").to(".marquee_component", {
        x: "0%",
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power4.out"
    }, "<0%"),
    n
}
function ec(n, t) {
    for (var e = 0; e < t.length; e++) {
        var r = t[e];
        r.enumerable = r.enumerable || !1,
        r.configurable = !0,
        "value"in r && (r.writable = !0),
        Object.defineProperty(n, r.key, r)
    }
}
function O_(n, t, e) {
    return t && ec(n.prototype, t),
    e && ec(n, e),
    Object.defineProperty(n, "prototype", {
        writable: !1
    }),
    n
}
/*!
 * Splide.js
 * Version  : 4.1.4
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
var rc = "(prefers-reduced-motion: reduce)"
  , An = 1
  , P_ = 2
  , Wn = 3
  , Xn = 4
  , Bs = 5
  , wo = 6
  , Bo = 7
  , k_ = {
    CREATED: An,
    MOUNTED: P_,
    IDLE: Wn,
    MOVING: Xn,
    SCROLLING: Bs,
    DRAGGING: wo,
    DESTROYED: Bo
};
function _i(n) {
    n.length = 0
}
function Ii(n, t, e) {
    return Array.prototype.slice.call(n, t, e)
}
function Nt(n) {
    return n.bind.apply(n, [null].concat(Ii(arguments, 1)))
}
var yh = setTimeout
  , uu = function() {};
function ic(n) {
    return requestAnimationFrame(n)
}
function jo(n, t) {
    return typeof t === n
}
function Ps(n) {
    return !qu(n) && jo("object", n)
}
var Uu = Array.isArray
  , bh = Nt(jo, "function")
  , Li = Nt(jo, "string")
  , Vs = Nt(jo, "undefined");
function qu(n) {
    return n === null
}
function wh(n) {
    try {
        return n instanceof (n.ownerDocument.defaultView || window).HTMLElement
    } catch {
        return !1
    }
}
function $s(n) {
    return Uu(n) ? n : [n]
}
function yr(n, t) {
    $s(n).forEach(t)
}
function Gu(n, t) {
    return n.indexOf(t) > -1
}
function Eo(n, t) {
    return n.push.apply(n, $s(t)),
    n
}
function li(n, t, e) {
    n && yr(t, function(r) {
        r && n.classList[e ? "add" : "remove"](r)
    })
}
function Hr(n, t) {
    li(n, Li(t) ? t.split(" ") : t, !0)
}
function Ws(n, t) {
    yr(t, n.appendChild.bind(n))
}
function Hu(n, t) {
    yr(n, function(e) {
        var r = (t || e).parentNode;
        r && r.insertBefore(e, t)
    })
}
function ks(n, t) {
    return wh(n) && (n.msMatchesSelector || n.matches).call(n, t)
}
function Eh(n, t) {
    var e = n ? Ii(n.children) : [];
    return t ? e.filter(function(r) {
        return ks(r, t)
    }) : e
}
function Ys(n, t) {
    return t ? Eh(n, t)[0] : n.firstElementChild
}
var Ls = Object.keys;
function rn(n, t, e) {
    return n && (e ? Ls(n).reverse() : Ls(n)).forEach(function(r) {
        r !== "__proto__" && t(n[r], r)
    }),
    n
}
function Ds(n) {
    return Ii(arguments, 1).forEach(function(t) {
        rn(t, function(e, r) {
            n[r] = t[r]
        })
    }),
    n
}
function Ti(n) {
    return Ii(arguments, 1).forEach(function(t) {
        rn(t, function(e, r) {
            Uu(e) ? n[r] = e.slice() : Ps(e) ? n[r] = Ti({}, Ps(n[r]) ? n[r] : {}, e) : n[r] = e
        })
    }),
    n
}
function nc(n, t) {
    yr(t || Ls(n), function(e) {
        delete n[e]
    })
}
function jr(n, t) {
    yr(n, function(e) {
        yr(t, function(r) {
            e && e.removeAttribute(r)
        })
    })
}
function pt(n, t, e) {
    Ps(t) ? rn(t, function(r, i) {
        pt(n, i, r)
    }) : yr(n, function(r) {
        qu(e) || e === "" ? jr(r, t) : r.setAttribute(t, String(e))
    })
}
function Rn(n, t, e) {
    var r = document.createElement(n);
    return t && (Li(t) ? Hr(r, t) : pt(r, t)),
    e && Ws(e, r),
    r
}
function Or(n, t, e) {
    if (Vs(e))
        return getComputedStyle(n)[t];
    qu(e) || (n.style[t] = "" + e)
}
function Ms(n, t) {
    Or(n, "display", t)
}
function xh(n) {
    n.setActive && n.setActive() || n.focus({
        preventScroll: !0
    })
}
function Pr(n, t) {
    return n.getAttribute(t)
}
function sc(n, t) {
    return n && n.classList.contains(t)
}
function dr(n) {
    return n.getBoundingClientRect()
}
function cn(n) {
    yr(n, function(t) {
        t && t.parentNode && t.parentNode.removeChild(t)
    })
}
function Th(n) {
    return Ys(new DOMParser().parseFromString(n, "text/html").body)
}
function oi(n, t) {
    n.preventDefault(),
    t && (n.stopPropagation(),
    n.stopImmediatePropagation())
}
function Sh(n, t) {
    return n && n.querySelector(t)
}
function ju(n, t) {
    return t ? Ii(n.querySelectorAll(t)) : []
}
function ci(n, t) {
    li(n, t, !1)
}
function lu(n) {
    return n.timeStamp
}
function $i(n) {
    return Li(n) ? n : n ? n + "px" : ""
}
var Xs = "splide"
  , Ku = "data-" + Xs;
function vs(n, t) {
    if (!n)
        throw new Error("[" + Xs + "] " + (t || ""))
}
var Di = Math.min
  , Vo = Math.max
  , $o = Math.floor
  , Rs = Math.ceil
  , Ye = Math.abs;
function Ch(n, t, e) {
    return Ye(n - t) < e
}
function xo(n, t, e, r) {
    var i = Di(t, e)
      , s = Vo(t, e);
    return r ? i < n && n < s : i <= n && n <= s
}
function En(n, t, e) {
    var r = Di(t, e)
      , i = Vo(t, e);
    return Di(Vo(r, n), i)
}
function cu(n) {
    return +(n > 0) - +(n < 0)
}
function fu(n, t) {
    return yr(t, function(e) {
        n = n.replace("%s", "" + e)
    }),
    n
}
function Zu(n) {
    return n < 10 ? "0" + n : "" + n
}
var oc = {};
function L_(n) {
    return "" + n + Zu(oc[n] = (oc[n] || 0) + 1)
}
function Ah() {
    var n = [];
    function t(o, a, u, l) {
        i(o, a, function(c, p, h) {
            var f = "addEventListener"in c
              , _ = f ? c.removeEventListener.bind(c, p, u, l) : c.removeListener.bind(c, u);
            f ? c.addEventListener(p, u, l) : c.addListener(u),
            n.push([c, p, h, u, _])
        })
    }
    function e(o, a, u) {
        i(o, a, function(l, c, p) {
            n = n.filter(function(h) {
                return h[0] === l && h[1] === c && h[2] === p && (!u || h[3] === u) ? (h[4](),
                !1) : !0
            })
        })
    }
    function r(o, a, u) {
        var l, c = !0;
        return typeof CustomEvent == "function" ? l = new CustomEvent(a,{
            bubbles: c,
            detail: u
        }) : (l = document.createEvent("CustomEvent"),
        l.initCustomEvent(a, c, !1, u)),
        o.dispatchEvent(l),
        l
    }
    function i(o, a, u) {
        yr(o, function(l) {
            l && yr(a, function(c) {
                c.split(" ").forEach(function(p) {
                    var h = p.split(".");
                    u(l, h[0], h[1])
                })
            })
        })
    }
    function s() {
        n.forEach(function(o) {
            o[4]()
        }),
        _i(n)
    }
    return {
        bind: t,
        unbind: e,
        dispatch: r,
        destroy: s
    }
}
var dn = "mounted"
  , ac = "ready"
  , Mi = "move"
  , Us = "moved"
  , Oh = "click"
  , D_ = "active"
  , M_ = "inactive"
  , R_ = "visible"
  , I_ = "hidden"
  , fe = "refresh"
  , je = "updated"
  , Is = "resize"
  , Ju = "resized"
  , N_ = "drag"
  , z_ = "dragging"
  , F_ = "dragged"
  , Qu = "scroll"
  , Un = "scrolled"
  , B_ = "overflow"
  , Ph = "destroy"
  , V_ = "arrows:mounted"
  , $_ = "arrows:updated"
  , W_ = "pagination:mounted"
  , Y_ = "pagination:updated"
  , kh = "navigation:mounted"
  , Lh = "autoplay:play"
  , X_ = "autoplay:playing"
  , Dh = "autoplay:pause"
  , Mh = "lazyload:loaded"
  , Rh = "sk"
  , Ih = "sh"
  , Wo = "ei";
function Gt(n) {
    var t = n ? n.event.bus : document.createDocumentFragment()
      , e = Ah();
    function r(s, o) {
        e.bind(t, $s(s).join(" "), function(a) {
            o.apply(o, Uu(a.detail) ? a.detail : [])
        })
    }
    function i(s) {
        e.dispatch(t, s, Ii(arguments, 1))
    }
    return n && n.event.on(Ph, e.destroy),
    Ds(e, {
        bus: t,
        on: r,
        off: Nt(e.unbind, t),
        emit: i
    })
}
function Ko(n, t, e, r) {
    var i = Date.now, s, o = 0, a, u = !0, l = 0;
    function c() {
        if (!u) {
            if (o = n ? Di((i() - s) / n, 1) : 1,
            e && e(o),
            o >= 1 && (t(),
            s = i(),
            r && ++l >= r))
                return h();
            a = ic(c)
        }
    }
    function p(T) {
        T || _(),
        s = i() - (T ? o * n : 0),
        u = !1,
        a = ic(c)
    }
    function h() {
        u = !0
    }
    function f() {
        s = i(),
        o = 0,
        e && e(o)
    }
    function _() {
        a && cancelAnimationFrame(a),
        o = 0,
        a = 0,
        u = !0
    }
    function d(T) {
        n = T
    }
    function b() {
        return u
    }
    return {
        start: p,
        rewind: f,
        pause: h,
        cancel: _,
        set: d,
        isPaused: b
    }
}
function U_(n) {
    var t = n;
    function e(i) {
        t = i
    }
    function r(i) {
        return Gu($s(i), t)
    }
    return {
        set: e,
        is: r
    }
}
function q_(n, t) {
    var e = Ko(t || 0, n, null, 1);
    return function() {
        e.isPaused() && e.start()
    }
}
function G_(n, t, e) {
    var r = n.state
      , i = e.breakpoints || {}
      , s = e.reducedMotion || {}
      , o = Ah()
      , a = [];
    function u() {
        var _ = e.mediaQuery === "min";
        Ls(i).sort(function(d, b) {
            return _ ? +d - +b : +b - +d
        }).forEach(function(d) {
            c(i[d], "(" + (_ ? "min" : "max") + "-width:" + d + "px)")
        }),
        c(s, rc),
        p()
    }
    function l(_) {
        _ && o.destroy()
    }
    function c(_, d) {
        var b = matchMedia(d);
        o.bind(b, "change", p),
        a.push([_, b])
    }
    function p() {
        var _ = r.is(Bo)
          , d = e.direction
          , b = a.reduce(function(T, w) {
            return Ti(T, w[1].matches ? w[0] : {})
        }, {});
        nc(e),
        f(b),
        e.destroy ? n.destroy(e.destroy === "completely") : _ ? (l(!0),
        n.mount()) : d !== e.direction && n.refresh()
    }
    function h(_) {
        matchMedia(rc).matches && (_ ? Ti(e, s) : nc(e, Ls(s)))
    }
    function f(_, d, b) {
        Ti(e, _),
        d && Ti(Object.getPrototypeOf(e), _),
        (b || !r.is(An)) && n.emit(je, e)
    }
    return {
        setup: u,
        destroy: l,
        reduce: h,
        set: f
    }
}
var Zo = "Arrow"
  , Jo = Zo + "Left"
  , Qo = Zo + "Right"
  , Nh = Zo + "Up"
  , zh = Zo + "Down"
  , uc = "rtl"
  , ta = "ttb"
  , Oa = {
    width: ["height"],
    left: ["top", "right"],
    right: ["bottom", "left"],
    x: ["y"],
    X: ["Y"],
    Y: ["X"],
    ArrowLeft: [Nh, Qo],
    ArrowRight: [zh, Jo]
};
function H_(n, t, e) {
    function r(s, o, a) {
        a = a || e.direction;
        var u = a === uc && !o ? 1 : a === ta ? 0 : -1;
        return Oa[s] && Oa[s][u] || s.replace(/width|left|right/i, function(l, c) {
            var p = Oa[l.toLowerCase()][u] || l;
            return c > 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p
        })
    }
    function i(s) {
        return s * (e.direction === uc ? 1 : -1)
    }
    return {
        resolve: r,
        orient: i
    }
}
var hi = "role"
  , In = "tabindex"
  , j_ = "disabled"
  , Lr = "aria-"
  , qs = Lr + "controls"
  , Fh = Lr + "current"
  , lc = Lr + "selected"
  , gr = Lr + "label"
  , tl = Lr + "labelledby"
  , Bh = Lr + "hidden"
  , el = Lr + "orientation"
  , Ns = Lr + "roledescription"
  , cc = Lr + "live"
  , fc = Lr + "busy"
  , hc = Lr + "atomic"
  , rl = [hi, In, j_, qs, Fh, gr, tl, Bh, el, Ns]
  , Kr = Xs + "__"
  , Ni = "is-"
  , Pa = Xs
  , dc = Kr + "track"
  , K_ = Kr + "list"
  , ea = Kr + "slide"
  , Vh = ea + "--clone"
  , Z_ = ea + "__container"
  , il = Kr + "arrows"
  , ra = Kr + "arrow"
  , $h = ra + "--prev"
  , Wh = ra + "--next"
  , ia = Kr + "pagination"
  , Yh = ia + "__page"
  , J_ = Kr + "progress"
  , Q_ = J_ + "__bar"
  , tg = Kr + "toggle"
  , eg = Kr + "spinner"
  , rg = Kr + "sr"
  , ig = Ni + "initialized"
  , fn = Ni + "active"
  , Xh = Ni + "prev"
  , Uh = Ni + "next"
  , hu = Ni + "visible"
  , du = Ni + "loading"
  , qh = Ni + "focus-in"
  , Gh = Ni + "overflow"
  , ng = [fn, hu, Xh, Uh, du, qh, Gh]
  , sg = {
    slide: ea,
    clone: Vh,
    arrows: il,
    arrow: ra,
    prev: $h,
    next: Wh,
    pagination: ia,
    page: Yh,
    spinner: eg
};
function og(n, t) {
    if (bh(n.closest))
        return n.closest(t);
    for (var e = n; e && e.nodeType === 1 && !ks(e, t); )
        e = e.parentElement;
    return e
}
var ag = 5
  , pc = 200
  , Hh = "touchstart mousedown"
  , ka = "touchmove mousemove"
  , La = "touchend touchcancel mouseup click";
function ug(n, t, e) {
    var r = Gt(n), i = r.on, s = r.bind, o = n.root, a = e.i18n, u = {}, l = [], c = [], p = [], h, f, _;
    function d() {
        C(),
        A(),
        w()
    }
    function b() {
        i(fe, T),
        i(fe, d),
        i(je, w),
        s(document, Hh + " keydown", function(E) {
            _ = E.type === "keydown"
        }, {
            capture: !0
        }),
        s(o, "focusin", function() {
            li(o, qh, !!_)
        })
    }
    function T(E) {
        var L = rl.concat("style");
        _i(l),
        ci(o, c),
        ci(h, p),
        jr([h, f], L),
        jr(o, E ? L : ["style", Ns])
    }
    function w() {
        ci(o, c),
        ci(h, p),
        c = P(Pa),
        p = P(dc),
        Hr(o, c),
        Hr(h, p),
        pt(o, gr, e.label),
        pt(o, tl, e.labelledby)
    }
    function C() {
        h = O("." + dc),
        f = Ys(h, "." + K_),
        vs(h && f, "A track/list element is missing."),
        Eo(l, Eh(f, "." + ea + ":not(." + Vh + ")")),
        rn({
            arrows: il,
            pagination: ia,
            prev: $h,
            next: Wh,
            bar: Q_,
            toggle: tg
        }, function(E, L) {
            u[L] = O("." + E)
        }),
        Ds(u, {
            root: o,
            track: h,
            list: f,
            slides: l
        })
    }
    function A() {
        var E = o.id || L_(Xs)
          , L = e.role;
        o.id = E,
        h.id = h.id || E + "-track",
        f.id = f.id || E + "-list",
        !Pr(o, hi) && o.tagName !== "SECTION" && L && pt(o, hi, L),
        pt(o, Ns, a.carousel),
        pt(f, hi, "presentation")
    }
    function O(E) {
        var L = Sh(o, E);
        return L && og(L, "." + Pa) === o ? L : void 0
    }
    function P(E) {
        return [E + "--" + e.type, E + "--" + e.direction, e.drag && E + "--draggable", e.isNavigation && E + "--nav", E === Pa && fn]
    }
    return Ds(u, {
        setup: d,
        mount: b,
        destroy: T
    })
}
var Yn = "slide"
  , qn = "loop"
  , Gs = "fade";
function lg(n, t, e, r) {
    var i = Gt(n), s = i.on, o = i.emit, a = i.bind, u = n.Components, l = n.root, c = n.options, p = c.isNavigation, h = c.updateOnMove, f = c.i18n, _ = c.pagination, d = c.slideFocus, b = u.Direction.resolve, T = Pr(r, "style"), w = Pr(r, gr), C = e > -1, A = Ys(r, "." + Z_), O;
    function P() {
        C || (r.id = l.id + "-slide" + Zu(t + 1),
        pt(r, hi, _ ? "tabpanel" : "group"),
        pt(r, Ns, f.slide),
        pt(r, gr, w || fu(f.slideLabel, [t + 1, n.length]))),
        E()
    }
    function E() {
        a(r, "click", Nt(o, Oh, H)),
        a(r, "keydown", Nt(o, Rh, H)),
        s([Us, Ih, Un], F),
        s(kh, M),
        h && s(Mi, D)
    }
    function L() {
        O = !0,
        i.destroy(),
        ci(r, ng),
        jr(r, rl),
        pt(r, "style", T),
        pt(r, gr, w || "")
    }
    function M() {
        var G = n.splides.map(function(y) {
            var j = y.splide.Components.Slides.getAt(t);
            return j ? j.slide.id : ""
        }).join(" ");
        pt(r, gr, fu(f.slideX, (C ? e : t) + 1)),
        pt(r, qs, G),
        pt(r, hi, d ? "button" : ""),
        d && jr(r, Ns)
    }
    function D() {
        O || F()
    }
    function F() {
        if (!O) {
            var G = n.index;
            k(),
            $(),
            li(r, Xh, t === G - 1),
            li(r, Uh, t === G + 1)
        }
    }
    function k() {
        var G = W();
        G !== sc(r, fn) && (li(r, fn, G),
        pt(r, Fh, p && G || ""),
        o(G ? D_ : M_, H))
    }
    function $() {
        var G = q()
          , y = !G && (!W() || C);
        if (n.state.is([Xn, Bs]) || pt(r, Bh, y || ""),
        pt(ju(r, c.focusableNodes || ""), In, y ? -1 : ""),
        d && pt(r, In, y ? -1 : 0),
        G !== sc(r, hu) && (li(r, hu, G),
        o(G ? R_ : I_, H)),
        !G && document.activeElement === r) {
            var j = u.Slides.getAt(n.index);
            j && xh(j.slide)
        }
    }
    function U(G, y, j) {
        Or(j && A || r, G, y)
    }
    function W() {
        var G = n.index;
        return G === t || c.cloneStatus && G === e
    }
    function q() {
        if (n.is(Gs))
            return W();
        var G = dr(u.Elements.track)
          , y = dr(r)
          , j = b("left", !0)
          , nt = b("right", !0);
        return $o(G[j]) <= Rs(y[j]) && $o(y[nt]) <= Rs(G[nt])
    }
    function K(G, y) {
        var j = Ye(G - t);
        return !C && (c.rewind || n.is(qn)) && (j = Di(j, n.length - j)),
        j <= y
    }
    var H = {
        index: t,
        slideIndex: e,
        slide: r,
        container: A,
        isClone: C,
        mount: P,
        destroy: L,
        update: F,
        style: U,
        isWithin: K
    };
    return H
}
function cg(n, t, e) {
    var r = Gt(n)
      , i = r.on
      , s = r.emit
      , o = r.bind
      , a = t.Elements
      , u = a.slides
      , l = a.list
      , c = [];
    function p() {
        h(),
        i(fe, f),
        i(fe, h)
    }
    function h() {
        u.forEach(function(F, k) {
            d(F, k, -1)
        })
    }
    function f() {
        O(function(F) {
            F.destroy()
        }),
        _i(c)
    }
    function _() {
        O(function(F) {
            F.update()
        })
    }
    function d(F, k, $) {
        var U = lg(n, k, $, F);
        U.mount(),
        c.push(U),
        c.sort(function(W, q) {
            return W.index - q.index
        })
    }
    function b(F) {
        return F ? P(function(k) {
            return !k.isClone
        }) : c
    }
    function T(F) {
        var k = t.Controller
          , $ = k.toIndex(F)
          , U = k.hasFocus() ? 1 : e.perPage;
        return P(function(W) {
            return xo(W.index, $, $ + U - 1)
        })
    }
    function w(F) {
        return P(F)[0]
    }
    function C(F, k) {
        yr(F, function($) {
            if (Li($) && ($ = Th($)),
            wh($)) {
                var U = u[k];
                U ? Hu($, U) : Ws(l, $),
                Hr($, e.classes.slide),
                L($, Nt(s, Is))
            }
        }),
        s(fe)
    }
    function A(F) {
        cn(P(F).map(function(k) {
            return k.slide
        })),
        s(fe)
    }
    function O(F, k) {
        b(k).forEach(F)
    }
    function P(F) {
        return c.filter(bh(F) ? F : function(k) {
            return Li(F) ? ks(k.slide, F) : Gu($s(F), k.index)
        }
        )
    }
    function E(F, k, $) {
        O(function(U) {
            U.style(F, k, $)
        })
    }
    function L(F, k) {
        var $ = ju(F, "img")
          , U = $.length;
        U ? $.forEach(function(W) {
            o(W, "load error", function() {
                --U || k()
            })
        }) : k()
    }
    function M(F) {
        return F ? u.length : c.length
    }
    function D() {
        return c.length > e.perPage
    }
    return {
        mount: p,
        destroy: f,
        update: _,
        register: d,
        get: b,
        getIn: T,
        getAt: w,
        add: C,
        remove: A,
        forEach: O,
        filter: P,
        style: E,
        getLength: M,
        isEnough: D
    }
}
function fg(n, t, e) {
    var r = Gt(n), i = r.on, s = r.bind, o = r.emit, a = t.Slides, u = t.Direction.resolve, l = t.Elements, c = l.root, p = l.track, h = l.list, f = a.getAt, _ = a.style, d, b, T;
    function w() {
        C(),
        s(window, "resize load", q_(Nt(o, Is))),
        i([je, fe], C),
        i(Is, A)
    }
    function C() {
        d = e.direction === ta,
        Or(c, "maxWidth", $i(e.width)),
        Or(p, u("paddingLeft"), O(!1)),
        Or(p, u("paddingRight"), O(!0)),
        A(!0)
    }
    function A(H) {
        var G = dr(c);
        (H || b.width !== G.width || b.height !== G.height) && (Or(p, "height", P()),
        _(u("marginRight"), $i(e.gap)),
        _("width", L()),
        _("height", M(), !0),
        b = G,
        o(Ju),
        T !== (T = K()) && (li(c, Gh, T),
        o(B_, T)))
    }
    function O(H) {
        var G = e.padding
          , y = u(H ? "right" : "left");
        return G && $i(G[y] || (Ps(G) ? 0 : G)) || "0px"
    }
    function P() {
        var H = "";
        return d && (H = E(),
        vs(H, "height or heightRatio is missing."),
        H = "calc(" + H + " - " + O(!1) + " - " + O(!0) + ")"),
        H
    }
    function E() {
        return $i(e.height || dr(h).width * e.heightRatio)
    }
    function L() {
        return e.autoWidth ? null : $i(e.fixedWidth) || (d ? "" : D())
    }
    function M() {
        return $i(e.fixedHeight) || (d ? e.autoHeight ? null : D() : E())
    }
    function D() {
        var H = $i(e.gap);
        return "calc((100%" + (H && " + " + H) + ")/" + (e.perPage || 1) + (H && " - " + H) + ")"
    }
    function F() {
        return dr(h)[u("width")]
    }
    function k(H, G) {
        var y = f(H || 0);
        return y ? dr(y.slide)[u("width")] + (G ? 0 : W()) : 0
    }
    function $(H, G) {
        var y = f(H);
        if (y) {
            var j = dr(y.slide)[u("right")]
              , nt = dr(h)[u("left")];
            return Ye(j - nt) + (G ? 0 : W())
        }
        return 0
    }
    function U(H) {
        return $(n.length - 1) - $(0) + k(0, H)
    }
    function W() {
        var H = f(0);
        return H && parseFloat(Or(H.slide, u("marginRight"))) || 0
    }
    function q(H) {
        return parseFloat(Or(p, u("padding" + (H ? "Right" : "Left")))) || 0
    }
    function K() {
        return n.is(Gs) || U(!0) > F()
    }
    return {
        mount: w,
        resize: A,
        listSize: F,
        slideSize: k,
        sliderSize: U,
        totalSize: $,
        getPadding: q,
        isOverflow: K
    }
}
var hg = 2;
function dg(n, t, e) {
    var r = Gt(n), i = r.on, s = t.Elements, o = t.Slides, a = t.Direction.resolve, u = [], l;
    function c() {
        i(fe, p),
        i([je, Is], f),
        (l = b()) && (_(l),
        t.Layout.resize(!0))
    }
    function p() {
        h(),
        c()
    }
    function h() {
        cn(u),
        _i(u),
        r.destroy()
    }
    function f() {
        var T = b();
        l !== T && (l < T || !T) && r.emit(fe)
    }
    function _(T) {
        var w = o.get().slice()
          , C = w.length;
        if (C) {
            for (; w.length < T; )
                Eo(w, w);
            Eo(w.slice(-T), w.slice(0, T)).forEach(function(A, O) {
                var P = O < T
                  , E = d(A.slide, O);
                P ? Hu(E, w[0].slide) : Ws(s.list, E),
                Eo(u, E),
                o.register(E, O - T + (P ? 0 : C), A.index)
            })
        }
    }
    function d(T, w) {
        var C = T.cloneNode(!0);
        return Hr(C, e.classes.clone),
        C.id = n.root.id + "-clone" + Zu(w + 1),
        C
    }
    function b() {
        var T = e.clones;
        if (!n.is(qn))
            T = 0;
        else if (Vs(T)) {
            var w = e[a("fixedWidth")] && t.Layout.slideSize(0)
              , C = w && Rs(dr(s.track)[a("width")] / w);
            T = C || e[a("autoWidth")] && n.length || e.perPage * hg
        }
        return T
    }
    return {
        mount: c,
        destroy: h
    }
}
function pg(n, t, e) {
    var r = Gt(n), i = r.on, s = r.emit, o = n.state.set, a = t.Layout, u = a.slideSize, l = a.getPadding, c = a.totalSize, p = a.listSize, h = a.sliderSize, f = t.Direction, _ = f.resolve, d = f.orient, b = t.Elements, T = b.list, w = b.track, C;
    function A() {
        C = t.Transition,
        i([dn, Ju, je, fe], O)
    }
    function O() {
        t.Controller.isBusy() || (t.Scroll.cancel(),
        E(n.index),
        t.Slides.update())
    }
    function P(y, j, nt, et) {
        y !== j && H(y > nt) && (F(),
        L(D(U(), y > nt), !0)),
        o(Xn),
        s(Mi, j, nt, y),
        C.start(j, function() {
            o(Wn),
            s(Us, j, nt, y),
            et && et()
        })
    }
    function E(y) {
        L($(y, !0))
    }
    function L(y, j) {
        if (!n.is(Gs)) {
            var nt = j ? y : M(y);
            Or(T, "transform", "translate" + _("X") + "(" + nt + "px)"),
            y !== nt && s(Ih)
        }
    }
    function M(y) {
        if (n.is(qn)) {
            var j = k(y)
              , nt = j > t.Controller.getEnd()
              , et = j < 0;
            (et || nt) && (y = D(y, nt))
        }
        return y
    }
    function D(y, j) {
        var nt = y - K(j)
          , et = h();
        return y -= d(et * (Rs(Ye(nt) / et) || 1)) * (j ? 1 : -1),
        y
    }
    function F() {
        L(U(), !0),
        C.cancel()
    }
    function k(y) {
        for (var j = t.Slides.get(), nt = 0, et = 1 / 0, at = 0; at < j.length; at++) {
            var Ct = j[at].index
              , X = Ye($(Ct, !0) - y);
            if (X <= et)
                et = X,
                nt = Ct;
            else
                break
        }
        return nt
    }
    function $(y, j) {
        var nt = d(c(y - 1) - q(y));
        return j ? W(nt) : nt
    }
    function U() {
        var y = _("left");
        return dr(T)[y] - dr(w)[y] + d(l(!1))
    }
    function W(y) {
        return e.trimSpace && n.is(Yn) && (y = En(y, 0, d(h(!0) - p()))),
        y
    }
    function q(y) {
        var j = e.focus;
        return j === "center" ? (p() - u(y, !0)) / 2 : +j * u(y) || 0
    }
    function K(y) {
        return $(y ? t.Controller.getEnd() : 0, !!e.trimSpace)
    }
    function H(y) {
        var j = d(D(U(), y));
        return y ? j >= 0 : j <= T[_("scrollWidth")] - dr(w)[_("width")]
    }
    function G(y, j) {
        j = Vs(j) ? U() : j;
        var nt = y !== !0 && d(j) < d(K(!1))
          , et = y !== !1 && d(j) > d(K(!0));
        return nt || et
    }
    return {
        mount: A,
        move: P,
        jump: E,
        translate: L,
        shift: D,
        cancel: F,
        toIndex: k,
        toPosition: $,
        getPosition: U,
        getLimit: K,
        exceededLimit: G,
        reposition: O
    }
}
function _g(n, t, e) {
    var r = Gt(n), i = r.on, s = r.emit, o = t.Move, a = o.getPosition, u = o.getLimit, l = o.toPosition, c = t.Slides, p = c.isEnough, h = c.getLength, f = e.omitEnd, _ = n.is(qn), d = n.is(Yn), b = Nt(U, !1), T = Nt(U, !0), w = e.start || 0, C, A = w, O, P, E;
    function L() {
        M(),
        i([je, fe, Wo], M),
        i(Ju, D)
    }
    function M() {
        O = h(!0),
        P = e.perMove,
        E = e.perPage,
        C = H();
        var X = En(w, 0, f ? C : O - 1);
        X !== w && (w = X,
        o.reposition())
    }
    function D() {
        C !== H() && s(Wo)
    }
    function F(X, ot, At) {
        if (!Ct()) {
            var gt = $(X)
              , Lt = K(gt);
            Lt > -1 && (ot || Lt !== w) && (nt(Lt),
            o.move(gt, Lt, A, At))
        }
    }
    function k(X, ot, At, gt) {
        t.Scroll.scroll(X, ot, At, function() {
            var Lt = K(o.toIndex(a()));
            nt(f ? Di(Lt, C) : Lt),
            gt && gt()
        })
    }
    function $(X) {
        var ot = w;
        if (Li(X)) {
            var At = X.match(/([+\-<>])(\d+)?/) || []
              , gt = At[1]
              , Lt = At[2];
            gt === "+" || gt === "-" ? ot = W(w + +("" + gt + (+Lt || 1)), w) : gt === ">" ? ot = Lt ? G(+Lt) : b(!0) : gt === "<" && (ot = T(!0))
        } else
            ot = _ ? X : En(X, 0, C);
        return ot
    }
    function U(X, ot) {
        var At = P || (at() ? 1 : E)
          , gt = W(w + At * (X ? -1 : 1), w, !(P || at()));
        return gt === -1 && d && !Ch(a(), u(!X), 1) ? X ? 0 : C : ot ? gt : K(gt)
    }
    function W(X, ot, At) {
        if (p() || at()) {
            var gt = q(X);
            gt !== X && (ot = X,
            X = gt,
            At = !1),
            X < 0 || X > C ? !P && (xo(0, X, ot, !0) || xo(C, ot, X, !0)) ? X = G(y(X)) : _ ? X = At ? X < 0 ? -(O % E || E) : O : X : e.rewind ? X = X < 0 ? C : 0 : X = -1 : At && X !== ot && (X = G(y(ot) + (X < ot ? -1 : 1)))
        } else
            X = -1;
        return X
    }
    function q(X) {
        if (d && e.trimSpace === "move" && X !== w)
            for (var ot = a(); ot === l(X, !0) && xo(X, 0, n.length - 1, !e.rewind); )
                X < w ? --X : ++X;
        return X
    }
    function K(X) {
        return _ ? (X + O) % O || 0 : X
    }
    function H() {
        for (var X = O - (at() || _ && P ? 1 : E); f && X-- > 0; )
            if (l(O - 1, !0) !== l(X, !0)) {
                X++;
                break
            }
        return En(X, 0, O - 1)
    }
    function G(X) {
        return En(at() ? X : E * X, 0, C)
    }
    function y(X) {
        return at() ? Di(X, C) : $o((X >= C ? O - 1 : X) / E)
    }
    function j(X) {
        var ot = o.toIndex(X);
        return d ? En(ot, 0, C) : ot
    }
    function nt(X) {
        X !== w && (A = w,
        w = X)
    }
    function et(X) {
        return X ? A : w
    }
    function at() {
        return !Vs(e.focus) || e.isNavigation
    }
    function Ct() {
        return n.state.is([Xn, Bs]) && !!e.waitForTransition
    }
    return {
        mount: L,
        go: F,
        scroll: k,
        getNext: b,
        getPrev: T,
        getAdjacent: U,
        getEnd: H,
        setIndex: nt,
        getIndex: et,
        toIndex: G,
        toPage: y,
        toDest: j,
        hasFocus: at,
        isBusy: Ct
    }
}
var gg = "http://www.w3.org/2000/svg"
  , mg = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"
  , lo = 40;
function vg(n, t, e) {
    var r = Gt(n), i = r.on, s = r.bind, o = r.emit, a = e.classes, u = e.i18n, l = t.Elements, c = t.Controller, p = l.arrows, h = l.track, f = p, _ = l.prev, d = l.next, b, T, w = {};
    function C() {
        O(),
        i(je, A)
    }
    function A() {
        P(),
        C()
    }
    function O() {
        var k = e.arrows;
        k && !(_ && d) && M(),
        _ && d && (Ds(w, {
            prev: _,
            next: d
        }),
        Ms(f, k ? "" : "none"),
        Hr(f, T = il + "--" + e.direction),
        k && (E(),
        F(),
        pt([_, d], qs, h.id),
        o(V_, _, d)))
    }
    function P() {
        r.destroy(),
        ci(f, T),
        b ? (cn(p ? [_, d] : f),
        _ = d = null) : jr([_, d], rl)
    }
    function E() {
        i([dn, Us, fe, Un, Wo], F),
        s(d, "click", Nt(L, ">")),
        s(_, "click", Nt(L, "<"))
    }
    function L(k) {
        c.go(k, !0)
    }
    function M() {
        f = p || Rn("div", a.arrows),
        _ = D(!0),
        d = D(!1),
        b = !0,
        Ws(f, [_, d]),
        !p && Hu(f, h)
    }
    function D(k) {
        var $ = '<button class="' + a.arrow + " " + (k ? a.prev : a.next) + '" type="button"><svg xmlns="' + gg + '" viewBox="0 0 ' + lo + " " + lo + '" width="' + lo + '" height="' + lo + '" focusable="false"><path d="' + (e.arrowPath || mg) + '" />';
        return Th($)
    }
    function F() {
        if (_ && d) {
            var k = n.index
              , $ = c.getPrev()
              , U = c.getNext()
              , W = $ > -1 && k < $ ? u.last : u.prev
              , q = U > -1 && k > U ? u.first : u.next;
            _.disabled = $ < 0,
            d.disabled = U < 0,
            pt(_, gr, W),
            pt(d, gr, q),
            o($_, _, d, $, U)
        }
    }
    return {
        arrows: w,
        mount: C,
        destroy: P,
        update: F
    }
}
var yg = Ku + "-interval";
function bg(n, t, e) {
    var r = Gt(n), i = r.on, s = r.bind, o = r.emit, a = Ko(e.interval, n.go.bind(n, ">"), E), u = a.isPaused, l = t.Elements, c = t.Elements, p = c.root, h = c.toggle, f = e.autoplay, _, d, b = f === "pause";
    function T() {
        f && (w(),
        h && pt(h, qs, l.track.id),
        b || C(),
        P())
    }
    function w() {
        e.pauseOnHover && s(p, "mouseenter mouseleave", function(M) {
            _ = M.type === "mouseenter",
            O()
        }),
        e.pauseOnFocus && s(p, "focusin focusout", function(M) {
            d = M.type === "focusin",
            O()
        }),
        h && s(h, "click", function() {
            b ? C() : A(!0)
        }),
        i([Mi, Qu, fe], a.rewind),
        i(Mi, L)
    }
    function C() {
        u() && t.Slides.isEnough() && (a.start(!e.resetProgress),
        d = _ = b = !1,
        P(),
        o(Lh))
    }
    function A(M) {
        M === void 0 && (M = !0),
        b = !!M,
        P(),
        u() || (a.pause(),
        o(Dh))
    }
    function O() {
        b || (_ || d ? A(!1) : C())
    }
    function P() {
        h && (li(h, fn, !b),
        pt(h, gr, e.i18n[b ? "play" : "pause"]))
    }
    function E(M) {
        var D = l.bar;
        D && Or(D, "width", M * 100 + "%"),
        o(X_, M)
    }
    function L(M) {
        var D = t.Slides.getAt(M);
        a.set(D && +Pr(D.slide, yg) || e.interval)
    }
    return {
        mount: T,
        destroy: a.cancel,
        play: C,
        pause: A,
        isPaused: u
    }
}
function wg(n, t, e) {
    var r = Gt(n)
      , i = r.on;
    function s() {
        e.cover && (i(Mh, Nt(a, !0)),
        i([dn, je, fe], Nt(o, !0)))
    }
    function o(u) {
        t.Slides.forEach(function(l) {
            var c = Ys(l.container || l.slide, "img");
            c && c.src && a(u, c, l)
        })
    }
    function a(u, l, c) {
        c.style("background", u ? 'center/cover no-repeat url("' + l.src + '")' : "", !0),
        Ms(l, u ? "none" : "")
    }
    return {
        mount: s,
        destroy: Nt(o, !1)
    }
}
var Eg = 10
  , xg = 600
  , Tg = .6
  , Sg = 1.5
  , Cg = 800;
function Ag(n, t, e) {
    var r = Gt(n), i = r.on, s = r.emit, o = n.state.set, a = t.Move, u = a.getPosition, l = a.getLimit, c = a.exceededLimit, p = a.translate, h = n.is(Yn), f, _, d = 1;
    function b() {
        i(Mi, A),
        i([je, fe], O)
    }
    function T(E, L, M, D, F) {
        var k = u();
        if (A(),
        M && (!h || !c())) {
            var $ = t.Layout.sliderSize()
              , U = cu(E) * $ * $o(Ye(E) / $) || 0;
            E = a.toPosition(t.Controller.toDest(E % $)) + U
        }
        var W = Ch(k, E, 1);
        d = 1,
        L = W ? 0 : L || Vo(Ye(E - k) / Sg, Cg),
        _ = D,
        f = Ko(L, w, Nt(C, k, E, F), 1),
        o(Bs),
        s(Qu),
        f.start()
    }
    function w() {
        o(Wn),
        _ && _(),
        s(Un)
    }
    function C(E, L, M, D) {
        var F = u()
          , k = E + (L - E) * P(D)
          , $ = (k - F) * d;
        p(F + $),
        h && !M && c() && (d *= Tg,
        Ye($) < Eg && T(l(c(!0)), xg, !1, _, !0))
    }
    function A() {
        f && f.cancel()
    }
    function O() {
        f && !f.isPaused() && (A(),
        w())
    }
    function P(E) {
        var L = e.easingFunc;
        return L ? L(E) : 1 - Math.pow(1 - E, 4)
    }
    return {
        mount: b,
        destroy: A,
        scroll: T,
        cancel: O
    }
}
var xn = {
    passive: !1,
    capture: !0
};
function Og(n, t, e) {
    var r = Gt(n), i = r.on, s = r.emit, o = r.bind, a = r.unbind, u = n.state, l = t.Move, c = t.Scroll, p = t.Controller, h = t.Elements.track, f = t.Media.reduce, _ = t.Direction, d = _.resolve, b = _.orient, T = l.getPosition, w = l.exceededLimit, C, A, O, P, E, L = !1, M, D, F;
    function k() {
        o(h, ka, uu, xn),
        o(h, La, uu, xn),
        o(h, Hh, U, xn),
        o(h, "click", K, {
            capture: !0
        }),
        o(h, "dragstart", oi),
        i([dn, je], $)
    }
    function $() {
        var Y = e.drag;
        Qt(!Y),
        P = Y === "free"
    }
    function U(Y) {
        if (M = !1,
        !D) {
            var ut = Lt(Y);
            gt(Y.target) && (ut || !Y.button) && (p.isBusy() ? oi(Y, !0) : (F = ut ? h : window,
            E = u.is([Xn, Bs]),
            O = null,
            o(F, ka, W, xn),
            o(F, La, q, xn),
            l.cancel(),
            c.cancel(),
            H(Y)))
        }
    }
    function W(Y) {
        if (u.is(wo) || (u.set(wo),
        s(N_)),
        Y.cancelable)
            if (E) {
                l.translate(C + At(at(Y)));
                var ut = Ct(Y) > pc
                  , zt = L !== (L = w());
                (ut || zt) && H(Y),
                M = !0,
                s(z_),
                oi(Y)
            } else
                j(Y) && (E = y(Y),
                oi(Y))
    }
    function q(Y) {
        u.is(wo) && (u.set(Wn),
        s(F_)),
        E && (G(Y),
        oi(Y)),
        a(F, ka, W),
        a(F, La, q),
        E = !1
    }
    function K(Y) {
        !D && M && oi(Y, !0)
    }
    function H(Y) {
        O = A,
        A = Y,
        C = T()
    }
    function G(Y) {
        var ut = nt(Y)
          , zt = et(ut)
          , Ht = e.rewind && e.rewindByDrag;
        f(!1),
        P ? p.scroll(zt, 0, e.snap) : n.is(Gs) ? p.go(b(cu(ut)) < 0 ? Ht ? "<" : "-" : Ht ? ">" : "+") : n.is(Yn) && L && Ht ? p.go(w(!0) ? ">" : "<") : p.go(p.toDest(zt), !0),
        f(!0)
    }
    function y(Y) {
        var ut = e.dragMinThreshold
          , zt = Ps(ut)
          , Ht = zt && ut.mouse || 0
          , z = (zt ? ut.touch : +ut) || 10;
        return Ye(at(Y)) > (Lt(Y) ? z : Ht)
    }
    function j(Y) {
        return Ye(at(Y)) > Ye(at(Y, !0))
    }
    function nt(Y) {
        if (n.is(qn) || !L) {
            var ut = Ct(Y);
            if (ut && ut < pc)
                return at(Y) / ut
        }
        return 0
    }
    function et(Y) {
        return T() + cu(Y) * Di(Ye(Y) * (e.flickPower || 600), P ? 1 / 0 : t.Layout.listSize() * (e.flickMaxPages || 1))
    }
    function at(Y, ut) {
        return ot(Y, ut) - ot(X(Y), ut)
    }
    function Ct(Y) {
        return lu(Y) - lu(X(Y))
    }
    function X(Y) {
        return A === Y && O || A
    }
    function ot(Y, ut) {
        return (Lt(Y) ? Y.changedTouches[0] : Y)["page" + d(ut ? "Y" : "X")]
    }
    function At(Y) {
        return Y / (L && n.is(Yn) ? ag : 1)
    }
    function gt(Y) {
        var ut = e.noDrag;
        return !ks(Y, "." + Yh + ", ." + ra) && (!ut || !ks(Y, ut))
    }
    function Lt(Y) {
        return typeof TouchEvent < "u" && Y instanceof TouchEvent
    }
    function Yt() {
        return E
    }
    function Qt(Y) {
        D = Y
    }
    return {
        mount: k,
        disable: Qt,
        isDragging: Yt
    }
}
var Pg = {
    Spacebar: " ",
    Right: Qo,
    Left: Jo,
    Up: Nh,
    Down: zh
};
function nl(n) {
    return n = Li(n) ? n : n.key,
    Pg[n] || n
}
var _c = "keydown";
function kg(n, t, e) {
    var r = Gt(n), i = r.on, s = r.bind, o = r.unbind, a = n.root, u = t.Direction.resolve, l, c;
    function p() {
        h(),
        i(je, f),
        i(je, h),
        i(Mi, d)
    }
    function h() {
        var T = e.keyboard;
        T && (l = T === "global" ? window : a,
        s(l, _c, b))
    }
    function f() {
        o(l, _c)
    }
    function _(T) {
        c = T
    }
    function d() {
        var T = c;
        c = !0,
        yh(function() {
            c = T
        })
    }
    function b(T) {
        if (!c) {
            var w = nl(T);
            w === u(Jo) ? n.go("<") : w === u(Qo) && n.go(">")
        }
    }
    return {
        mount: p,
        destroy: f,
        disable: _
    }
}
var ys = Ku + "-lazy"
  , To = ys + "-srcset"
  , Lg = "[" + ys + "], [" + To + "]";
function Dg(n, t, e) {
    var r = Gt(n)
      , i = r.on
      , s = r.off
      , o = r.bind
      , a = r.emit
      , u = e.lazyLoad === "sequential"
      , l = [Us, Un]
      , c = [];
    function p() {
        e.lazyLoad && (h(),
        i(fe, h))
    }
    function h() {
        _i(c),
        f(),
        u ? T() : (s(l),
        i(l, _),
        _())
    }
    function f() {
        t.Slides.forEach(function(w) {
            ju(w.slide, Lg).forEach(function(C) {
                var A = Pr(C, ys)
                  , O = Pr(C, To);
                if (A !== C.src || O !== C.srcset) {
                    var P = e.classes.spinner
                      , E = C.parentElement
                      , L = Ys(E, "." + P) || Rn("span", P, E);
                    c.push([C, w, L]),
                    C.src || Ms(C, "none")
                }
            })
        })
    }
    function _() {
        c = c.filter(function(w) {
            var C = e.perPage * ((e.preloadPages || 1) + 1) - 1;
            return w[1].isWithin(n.index, C) ? d(w) : !0
        }),
        c.length || s(l)
    }
    function d(w) {
        var C = w[0];
        Hr(w[1].slide, du),
        o(C, "load error", Nt(b, w)),
        pt(C, "src", Pr(C, ys)),
        pt(C, "srcset", Pr(C, To)),
        jr(C, ys),
        jr(C, To)
    }
    function b(w, C) {
        var A = w[0]
          , O = w[1];
        ci(O.slide, du),
        C.type !== "error" && (cn(w[2]),
        Ms(A, ""),
        a(Mh, A, O),
        a(Is)),
        u && T()
    }
    function T() {
        c.length && d(c.shift())
    }
    return {
        mount: p,
        destroy: Nt(_i, c),
        check: _
    }
}
function Mg(n, t, e) {
    var r = Gt(n), i = r.on, s = r.emit, o = r.bind, a = t.Slides, u = t.Elements, l = t.Controller, c = l.hasFocus, p = l.getIndex, h = l.go, f = t.Direction.resolve, _ = u.pagination, d = [], b, T;
    function w() {
        C(),
        i([je, fe, Wo], w);
        var D = e.pagination;
        _ && Ms(_, D ? "" : "none"),
        D && (i([Mi, Qu, Un], M),
        A(),
        M(),
        s(W_, {
            list: b,
            items: d
        }, L(n.index)))
    }
    function C() {
        b && (cn(_ ? Ii(b.children) : b),
        ci(b, T),
        _i(d),
        b = null),
        r.destroy()
    }
    function A() {
        var D = n.length
          , F = e.classes
          , k = e.i18n
          , $ = e.perPage
          , U = c() ? l.getEnd() + 1 : Rs(D / $);
        b = _ || Rn("ul", F.pagination, u.track.parentElement),
        Hr(b, T = ia + "--" + E()),
        pt(b, hi, "tablist"),
        pt(b, gr, k.select),
        pt(b, el, E() === ta ? "vertical" : "");
        for (var W = 0; W < U; W++) {
            var q = Rn("li", null, b)
              , K = Rn("button", {
                class: F.page,
                type: "button"
            }, q)
              , H = a.getIn(W).map(function(y) {
                return y.slide.id
            })
              , G = !c() && $ > 1 ? k.pageX : k.slideX;
            o(K, "click", Nt(O, W)),
            e.paginationKeyboard && o(K, "keydown", Nt(P, W)),
            pt(q, hi, "presentation"),
            pt(K, hi, "tab"),
            pt(K, qs, H.join(" ")),
            pt(K, gr, fu(G, W + 1)),
            pt(K, In, -1),
            d.push({
                li: q,
                button: K,
                page: W
            })
        }
    }
    function O(D) {
        h(">" + D, !0)
    }
    function P(D, F) {
        var k = d.length
          , $ = nl(F)
          , U = E()
          , W = -1;
        $ === f(Qo, !1, U) ? W = ++D % k : $ === f(Jo, !1, U) ? W = (--D + k) % k : $ === "Home" ? W = 0 : $ === "End" && (W = k - 1);
        var q = d[W];
        q && (xh(q.button),
        h(">" + W),
        oi(F, !0))
    }
    function E() {
        return e.paginationDirection || e.direction
    }
    function L(D) {
        return d[l.toPage(D)]
    }
    function M() {
        var D = L(p(!0))
          , F = L(p());
        if (D) {
            var k = D.button;
            ci(k, fn),
            jr(k, lc),
            pt(k, In, -1)
        }
        if (F) {
            var $ = F.button;
            Hr($, fn),
            pt($, lc, !0),
            pt($, In, "")
        }
        s(Y_, {
            list: b,
            items: d
        }, D, F)
    }
    return {
        items: d,
        mount: w,
        destroy: C,
        getAt: L,
        update: M
    }
}
var Rg = [" ", "Enter"];
function Ig(n, t, e) {
    var r = e.isNavigation
      , i = e.slideFocus
      , s = [];
    function o() {
        n.splides.forEach(function(_) {
            _.isParent || (l(n, _.splide),
            l(_.splide, n))
        }),
        r && c()
    }
    function a() {
        s.forEach(function(_) {
            _.destroy()
        }),
        _i(s)
    }
    function u() {
        a(),
        o()
    }
    function l(_, d) {
        var b = Gt(_);
        b.on(Mi, function(T, w, C) {
            d.go(d.is(qn) ? C : T)
        }),
        s.push(b)
    }
    function c() {
        var _ = Gt(n)
          , d = _.on;
        d(Oh, h),
        d(Rh, f),
        d([dn, je], p),
        s.push(_),
        _.emit(kh, n.splides)
    }
    function p() {
        pt(t.Elements.list, el, e.direction === ta ? "vertical" : "")
    }
    function h(_) {
        n.go(_.index)
    }
    function f(_, d) {
        Gu(Rg, nl(d)) && (h(_),
        oi(d))
    }
    return {
        setup: Nt(t.Media.set, {
            slideFocus: Vs(i) ? r : i
        }, !0),
        mount: o,
        destroy: a,
        remount: u
    }
}
function Ng(n, t, e) {
    var r = Gt(n)
      , i = r.bind
      , s = 0;
    function o() {
        e.wheel && i(t.Elements.track, "wheel", a, xn)
    }
    function a(l) {
        if (l.cancelable) {
            var c = l.deltaY
              , p = c < 0
              , h = lu(l)
              , f = e.wheelMinThreshold || 0
              , _ = e.wheelSleep || 0;
            Ye(c) > f && h - s > _ && (n.go(p ? "<" : ">"),
            s = h),
            u(p) && oi(l)
        }
    }
    function u(l) {
        return !e.releaseWheel || n.state.is(Xn) || t.Controller.getAdjacent(l) !== -1
    }
    return {
        mount: o
    }
}
var zg = 90;
function Fg(n, t, e) {
    var r = Gt(n)
      , i = r.on
      , s = t.Elements.track
      , o = e.live && !e.isNavigation
      , a = Rn("span", rg)
      , u = Ko(zg, Nt(c, !1));
    function l() {
        o && (h(!t.Autoplay.isPaused()),
        pt(s, hc, !0),
        a.textContent = "…",
        i(Lh, Nt(h, !0)),
        i(Dh, Nt(h, !1)),
        i([Us, Un], Nt(c, !0)))
    }
    function c(f) {
        pt(s, fc, f),
        f ? (Ws(s, a),
        u.start()) : (cn(a),
        u.cancel())
    }
    function p() {
        jr(s, [cc, hc, fc]),
        cn(a)
    }
    function h(f) {
        o && pt(s, cc, f ? "off" : "polite")
    }
    return {
        mount: l,
        disable: h,
        destroy: p
    }
}
var Bg = Object.freeze({
    __proto__: null,
    Media: G_,
    Direction: H_,
    Elements: ug,
    Slides: cg,
    Layout: fg,
    Clones: dg,
    Move: pg,
    Controller: _g,
    Arrows: vg,
    Autoplay: bg,
    Cover: wg,
    Scroll: Ag,
    Drag: Og,
    Keyboard: kg,
    LazyLoad: Dg,
    Pagination: Mg,
    Sync: Ig,
    Wheel: Ng,
    Live: Fg
})
  , Vg = {
    prev: "Previous slide",
    next: "Next slide",
    first: "Go to first slide",
    last: "Go to last slide",
    slideX: "Go to slide %s",
    pageX: "Go to page %s",
    play: "Start autoplay",
    pause: "Pause autoplay",
    carousel: "carousel",
    slide: "slide",
    select: "Select a slide to show",
    slideLabel: "%s of %s"
}
  , $g = {
    type: "slide",
    role: "region",
    speed: 400,
    perPage: 1,
    cloneStatus: !0,
    arrows: !0,
    pagination: !0,
    paginationKeyboard: !0,
    interval: 5e3,
    pauseOnHover: !0,
    pauseOnFocus: !0,
    resetProgress: !0,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    drag: !0,
    direction: "ltr",
    trimSpace: !0,
    focusableNodes: "a, button, textarea, input, select, iframe",
    live: !0,
    classes: sg,
    i18n: Vg,
    reducedMotion: {
        speed: 0,
        rewindSpeed: 0,
        autoplay: "pause"
    }
};
function Wg(n, t, e) {
    var r = t.Slides;
    function i() {
        Gt(n).on([dn, fe], s)
    }
    function s() {
        r.forEach(function(a) {
            a.style("transform", "translateX(-" + 100 * a.index + "%)")
        })
    }
    function o(a, u) {
        r.style("transition", "opacity " + e.speed + "ms " + e.easing),
        yh(u)
    }
    return {
        mount: i,
        start: o,
        cancel: uu
    }
}
function Yg(n, t, e) {
    var r = t.Move, i = t.Controller, s = t.Scroll, o = t.Elements.list, a = Nt(Or, o, "transition"), u;
    function l() {
        Gt(n).bind(o, "transitionend", function(f) {
            f.target === o && u && (p(),
            u())
        })
    }
    function c(f, _) {
        var d = r.toPosition(f, !0)
          , b = r.getPosition()
          , T = h(f);
        Ye(d - b) >= 1 && T >= 1 ? e.useScroll ? s.scroll(d, T, !1, _) : (a("transform " + T + "ms " + e.easing),
        r.translate(d, !0),
        u = _) : (r.jump(f),
        _())
    }
    function p() {
        a(""),
        s.cancel()
    }
    function h(f) {
        var _ = e.rewindSpeed;
        if (n.is(Yn) && _) {
            var d = i.getIndex(!0)
              , b = i.getEnd();
            if (d === 0 && f >= b || d >= b && f === 0)
                return _
        }
        return e.speed
    }
    return {
        mount: l,
        start: c,
        cancel: p
    }
}
var Xg = function() {
    function n(e, r) {
        this.event = Gt(),
        this.Components = {},
        this.state = U_(An),
        this.splides = [],
        this._o = {},
        this._E = {};
        var i = Li(e) ? Sh(document, e) : e;
        vs(i, i + " is invalid."),
        this.root = i,
        r = Ti({
            label: Pr(i, gr) || "",
            labelledby: Pr(i, tl) || ""
        }, $g, n.defaults, r || {});
        try {
            Ti(r, JSON.parse(Pr(i, Ku)))
        } catch {
            vs(!1, "Invalid JSON")
        }
        this._o = Object.create(Ti({}, r))
    }
    var t = n.prototype;
    return t.mount = function(r, i) {
        var s = this
          , o = this.state
          , a = this.Components;
        vs(o.is([An, Bo]), "Already mounted!"),
        o.set(An),
        this._C = a,
        this._T = i || this._T || (this.is(Gs) ? Wg : Yg),
        this._E = r || this._E;
        var u = Ds({}, Bg, this._E, {
            Transition: this._T
        });
        return rn(u, function(l, c) {
            var p = l(s, a, s._o);
            a[c] = p,
            p.setup && p.setup()
        }),
        rn(a, function(l) {
            l.mount && l.mount()
        }),
        this.emit(dn),
        Hr(this.root, ig),
        o.set(Wn),
        this.emit(ac),
        this
    }
    ,
    t.sync = function(r) {
        return this.splides.push({
            splide: r
        }),
        r.splides.push({
            splide: this,
            isParent: !0
        }),
        this.state.is(Wn) && (this._C.Sync.remount(),
        r.Components.Sync.remount()),
        this
    }
    ,
    t.go = function(r) {
        return this._C.Controller.go(r),
        this
    }
    ,
    t.on = function(r, i) {
        return this.event.on(r, i),
        this
    }
    ,
    t.off = function(r) {
        return this.event.off(r),
        this
    }
    ,
    t.emit = function(r) {
        var i;
        return (i = this.event).emit.apply(i, [r].concat(Ii(arguments, 1))),
        this
    }
    ,
    t.add = function(r, i) {
        return this._C.Slides.add(r, i),
        this
    }
    ,
    t.remove = function(r) {
        return this._C.Slides.remove(r),
        this
    }
    ,
    t.is = function(r) {
        return this._o.type === r
    }
    ,
    t.refresh = function() {
        return this.emit(fe),
        this
    }
    ,
    t.destroy = function(r) {
        r === void 0 && (r = !0);
        var i = this.event
          , s = this.state;
        return s.is(An) ? Gt(this).on(ac, this.destroy.bind(this, r)) : (rn(this._C, function(o) {
            o.destroy && o.destroy(r)
        }, !0),
        i.emit(Ph),
        i.destroy(),
        r && _i(this.splides),
        s.set(Bo)),
        this
    }
    ,
    O_(n, [{
        key: "options",
        get: function() {
            return this._o
        },
        set: function(r) {
            this._C.Media.set(r, !0, !0)
        }
    }, {
        key: "length",
        get: function() {
            return this._C.Slides.getLength(!0)
        }
    }, {
        key: "index",
        get: function() {
            return this._C.Controller.getIndex()
        }
    }]),
    n
}()
  , sl = Xg;
sl.defaults = {};
sl.STATES = k_;
/*!
 * @splidejs/splide-extension-auto-scroll
 * Version  : 0.5.3
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
function Ug(n) {
    n.length = 0
}
function ol(n, t, e) {
    return Array.prototype.slice.call(n, t, e)
}
function na(n) {
    return n.bind.apply(n, [null].concat(ol(arguments, 1)))
}
function gc(n) {
    return requestAnimationFrame(n)
}
function al(n, t) {
    return typeof t === n
}
var jh = Array.isArray;
na(al, "function");
na(al, "string");
na(al, "undefined");
function Kh(n) {
    return jh(n) ? n : [n]
}
function mc(n, t) {
    Kh(n).forEach(t)
}
var qg = Object.keys;
function Gg(n, t, e) {
    if (n) {
        var r = qg(n);
        r = e ? r.reverse() : r;
        for (var i = 0; i < r.length; i++) {
            var s = r[i];
            if (s !== "__proto__" && t(n[s], s) === !1)
                break
        }
    }
    return n
}
function Hg(n) {
    return ol(arguments, 1).forEach(function(t) {
        Gg(t, function(e, r) {
            n[r] = t[r]
        })
    }),
    n
}
var jg = Math.min;
function Kg() {
    var n = [];
    function t(o, a, u, l) {
        i(o, a, function(c, p, h) {
            var f = "addEventListener"in c
              , _ = f ? c.removeEventListener.bind(c, p, u, l) : c.removeListener.bind(c, u);
            f ? c.addEventListener(p, u, l) : c.addListener(u),
            n.push([c, p, h, u, _])
        })
    }
    function e(o, a, u) {
        i(o, a, function(l, c, p) {
            n = n.filter(function(h) {
                return h[0] === l && h[1] === c && h[2] === p && (!u || h[3] === u) ? (h[4](),
                !1) : !0
            })
        })
    }
    function r(o, a, u) {
        var l, c = !0;
        return typeof CustomEvent == "function" ? l = new CustomEvent(a,{
            bubbles: c,
            detail: u
        }) : (l = document.createEvent("CustomEvent"),
        l.initCustomEvent(a, c, !1, u)),
        o.dispatchEvent(l),
        l
    }
    function i(o, a, u) {
        mc(o, function(l) {
            l && mc(a, function(c) {
                c.split(" ").forEach(function(p) {
                    var h = p.split(".");
                    u(l, h[0], h[1])
                })
            })
        })
    }
    function s() {
        n.forEach(function(o) {
            o[4]()
        }),
        Ug(n)
    }
    return {
        bind: t,
        unbind: e,
        dispatch: r,
        destroy: s
    }
}
var vc = "move"
  , yc = "moved"
  , Zg = "updated"
  , bc = "drag"
  , Jg = "dragged"
  , wc = "scroll"
  , Ec = "scrolled"
  , Qg = "destroy";
function tm(n) {
    var t = n ? n.event.bus : document.createDocumentFragment()
      , e = Kg();
    function r(s, o) {
        e.bind(t, Kh(s).join(" "), function(a) {
            o.apply(o, jh(a.detail) ? a.detail : [])
        })
    }
    function i(s) {
        e.dispatch(t, s, ol(arguments, 1))
    }
    return n && n.event.on(Qg, e.destroy),
    Hg(e, {
        bus: t,
        on: r,
        off: na(e.unbind, t),
        emit: i
    })
}
function Zh(n, t, e, r) {
    var i = Date.now, s, o = 0, a, u = !0, l = 0;
    function c() {
        if (!u) {
            if (o = n ? jg((i() - s) / n, 1) : 1,
            e && e(o),
            o >= 1 && (t(),
            s = i(),
            r && ++l >= r))
                return h();
            gc(c)
        }
    }
    function p(T) {
        !T && _(),
        s = i() - (T ? o * n : 0),
        u = !1,
        gc(c)
    }
    function h() {
        u = !0
    }
    function f() {
        s = i(),
        o = 0,
        e && e(o)
    }
    function _() {
        a && cancelAnimationFrame(a),
        o = 0,
        a = 0,
        u = !0
    }
    function d(T) {
        n = T
    }
    function b() {
        return u
    }
    return {
        start: p,
        rewind: f,
        pause: h,
        cancel: _,
        set: d,
        isPaused: b
    }
}
function em(n, t) {
    var e;
    function r() {
        e || (e = Zh(t || 0, function() {
            n(),
            e = null
        }, null, 1),
        e.start())
    }
    return r
}
var rm = "is-active"
  , im = "slide"
  , nm = "fade";
function Jh(n, t, e) {
    return Array.prototype.slice.call(n, t, e)
}
function ul(n) {
    return n.bind(null, ...Jh(arguments, 1))
}
function sa(n, t) {
    return typeof t === n
}
function pu(n) {
    return !Qh(n) && sa("object", n)
}
const sm = Array.isArray;
ul(sa, "function");
ul(sa, "string");
const om = ul(sa, "undefined");
function Qh(n) {
    return n === null
}
function am(n) {
    return sm(n) ? n : [n]
}
function Yo(n, t) {
    am(n).forEach(t)
}
function um(n, t, e) {
    n && Yo(t, r=>{
        r && n.classList[e ? "add" : "remove"](r)
    }
    )
}
const lm = Object.keys;
function td(n, t, e) {
    if (n) {
        let r = lm(n);
        r = e ? r.reverse() : r;
        for (let i = 0; i < r.length; i++) {
            const s = r[i];
            if (s !== "__proto__" && t(n[s], s) === !1)
                break
        }
    }
    return n
}
function xc(n) {
    return Jh(arguments, 1).forEach(t=>{
        td(t, (e,r)=>{
            n[r] = t[r]
        }
        )
    }
    ),
    n
}
function cm(n, t) {
    Yo(n, e=>{
        Yo(t, r=>{
            e && e.removeAttribute(r)
        }
        )
    }
    )
}
function ed(n, t, e) {
    pu(t) ? td(t, (r,i)=>{
        ed(n, i, r)
    }
    ) : Yo(n, r=>{
        Qh(e) || e === "" ? cm(r, t) : r.setAttribute(t, String(e))
    }
    )
}
const {min: Tc, max: Sc, floor: Sm, ceil: Cm, abs: Am} = Math;
function fm(n, t, e) {
    const r = Tc(t, e)
      , i = Sc(t, e);
    return Tc(Sc(r, n), i)
}
const hm = {
    speed: 1,
    autoStart: !0,
    pauseOnHover: !0,
    pauseOnFocus: !0
}
  , dm = {
    startScroll: "Start auto scroll",
    pauseScroll: "Pause auto scroll"
};
function pm(n, t, e) {
    const {on: r, off: i, bind: s, unbind: o} = tm(n)
      , {translate: a, getPosition: u, toIndex: l, getLimit: c} = t.Move
      , {setIndex: p, getIndex: h} = t.Controller
      , {orient: f} = t.Direction
      , {toggle: _} = t.Elements
      , {Live: d} = t
      , {root: b} = n
      , T = em(t.Arrows.update, 500);
    let w = {}, C, A, O, P, E, L;
    function M() {
        const {autoScroll: et} = e;
        w = xc({}, hm, pu(et) ? et : {})
    }
    function D() {
        n.is(nm) || !C && e.autoScroll !== !1 && (C = Zh(0, H),
        k(),
        U())
    }
    function F() {
        C && (C.cancel(),
        C = null,
        L = void 0,
        i([vc, bc, wc, yc, Ec]),
        o(b, "mouseenter mouseleave focusin focusout"),
        o(_, "click"))
    }
    function k() {
        w.pauseOnHover && s(b, "mouseenter mouseleave", et=>{
            O = et.type === "mouseenter",
            K()
        }
        ),
        w.pauseOnFocus && s(b, "focusin focusout", et=>{
            P = et.type === "focusin",
            K()
        }
        ),
        w.useToggleButton && s(_, "click", ()=>{
            A ? W() : q()
        }
        ),
        r(Zg, $),
        r([vc, bc, wc], ()=>{
            E = !0,
            q(!1)
        }
        ),
        r([yc, Jg, Ec], ()=>{
            E = !1,
            K()
        }
        )
    }
    function $() {
        const {autoScroll: et} = e;
        et !== !1 ? (w = xc({}, w, pu(et) ? et : {}),
        D()) : F(),
        C && !om(L) && a(L)
    }
    function U() {
        w.autoStart && (document.readyState === "complete" ? W() : s(window, "load", W))
    }
    function W() {
        nt() && (C.start(!0),
        d.disable(!0),
        P = O = A = !1,
        j())
    }
    function q(et=!0) {
        A || (A = et,
        j(),
        nt() || (C.pause(),
        d.disable(!1)))
    }
    function K() {
        A || (O || P || E ? q(!1) : W())
    }
    function H() {
        const et = u()
          , at = G(et);
        et !== at ? (a(at),
        y(L = u())) : (q(!1),
        w.rewind && n.go(w.speed > 0 ? 0 : t.Controller.getEnd())),
        T()
    }
    function G(et) {
        const at = w.speed || 1;
        return et += f(at),
        n.is(im) && (et = fm(et, c(!1), c(!0))),
        et
    }
    function y(et) {
        const {length: at} = n
          , Ct = (l(et) + at) % at;
        Ct !== h() && (p(Ct),
        t.Slides.update(),
        t.Pagination.update(),
        e.lazyLoad === "nearby" && t.LazyLoad.check())
    }
    function j() {
        if (_) {
            const et = A ? "startScroll" : "pauseScroll";
            um(_, rm, !A),
            ed(_, "aria-label", e.i18n[et] || dm[et])
        }
    }
    function nt() {
        return !C || C.isPaused()
    }
    return {
        setup: M,
        mount: D,
        destroy: F,
        play: W,
        pause: q,
        isPaused: nt
    }
}
function _m() {
    new sl(".splide",{
        type: "loop",
        drag: "free",
        arrows: !1,
        gap: 0,
        pagination: !1,
        focus: "center",
        perPage: 3,
        autoScroll: {
            speed: 1
        },
        breakpoints: {
            640: {
                perPage: 2
            }
        }
    }).mount({
        AutoScroll: pm
    })
}
const gm = document.querySelector("#works-link")
  , mm = document.querySelector("#contact-link")
  , co = document.querySelector("#about-link")
  , vm = document.querySelector(".about_top-row .button")
  , ym = document.querySelector(".bg-overlay")
  , bm = document.querySelectorAll(".navbar_link")
  , Kn = document.querySelector(".navbar_link-shape")
  , wm = document.querySelector(".navbar_menu")
  , zr = document.querySelector(".about_component")
  , Zn = document.querySelector(".section_stats")
  , Cc = document.querySelector(".custom-cursor_detect")
  , Ac = document.querySelector(".custom-cursor")
  , Em = document.querySelectorAll(".header_projects-list-item")
  , xm = document.querySelectorAll(".project_cms-item");
We.registerPlugin(vt, ss);
let Oc = We.matchMedia(), Fr, _u, Pc;
document.addEventListener("DOMContentLoaded", ()=>{
    new Gd("h1, .header_subtext ,.project_cms-item h3",{
        type: "chars,words,lines"
    }),
    tc("h1 .line"),
    tc(".header_subtext .line"),
    _u = A_(),
    _u.play(),
    C_(xm),
    Em.forEach(o=>{
        const a = o.getAttribute("data-project-slug");
        o.addEventListener("click", ()=>{
            Fr.scrollTo(`#${a}`)
        }
        )
    }
    );
    let n = document.querySelector(".navbar_menu-blur");
    Oc.add("(max-width: 479px)", ()=>{
        n = document.querySelector(".navbar_container")
    }
    ),
    We.to(n, {
        background: "rgba(255, 255, 255, .5)",
        duration: .4,
        scrollTrigger: {
            trigger: ".section_projects",
            start: "top 5%",
            toggleActions: "play none none reverse"
        }
    }),
    We.to(".navbar_logo-text", {
        opacity: 0,
        duration: .4,
        scrollTrigger: {
            trigger: ".section_projects",
            start: "top 5%",
            toggleActions: "play none none reverse"
        }
    });
    let t = !1;
    window.addEventListener("beforeunload", function() {
        t = !0
    }),
    window.addEventListener("unload", function() {
        t && window.scrollTo(0, 0)
    }),
    Cc.addEventListener("mouseenter", function() {
        Ac.classList.add("is-active")
    }),
    Cc.addEventListener("mouseleave", function() {
        Ac.classList.remove("is-active")
    }),
    _m(),
    dd(".page-wrapper", ()=>{
        Fr = new cd({
            duration: 1.1,
            direction: "vertical",
            smooth: !0,
            smoothTouch: !1,
            touchMultiplier: 1.5
        }),
        Fr.on("scroll", vt.update),
        We.ticker.add(c=>{
            Fr.raf(c * 1e3)
        }
        ),
        We.ticker.lagSmoothing(0);
        const o = Zn.querySelectorAll("[data-count]");
        let a = Zn.querySelector("[data-count='followers']").textContent
          , u = Zn.querySelector("[data-count='likes']").textContent
          , l = Zn.querySelector("[data-count='shots']").textContent;
        o.forEach(c=>{
            let p;
            c.getAttribute("data-count") === "followers" && (p = 10),
            c.getAttribute("data-count") === "likes" && (p = 70),
            c.getAttribute("data-count") === "shots" && (p = 240),
            c.textContent = p
        }
        ),
        vt.create({
            trigger: Zn,
            start: "top 40%",
            once: !0,
            onEnter: ()=>{
                o.forEach(c=>{
                    let p;
                    c.getAttribute("data-count") === "followers" && (p = a),
                    c.getAttribute("data-count") === "likes" && (p = u),
                    c.getAttribute("data-count") === "shots" && (p = l),
                    We.to(c, {
                        duration: 1.5,
                        innerHTML: p,
                        snap: "innerHTML",
                        ease: "none",
                        onUpdate: function() {
                            c.innerHTML = Math.ceil(this.targets()[0].innerHTML)
                        }
                    })
                }
                )
            }
        }),
        gm.addEventListener("click", ()=>{
            Fr.scrollTo("#projects")
        }
        ),
        mm.addEventListener("click", ()=>{
            Fr.scrollTo("#bottom")
        }
        )
    }
    ),
    Oc.add("(hover:hover)", ()=>{
        bm.forEach(function(o) {
            o.addEventListener("mouseenter", function() {
                const a = ss.getState(Kn, {
                    props: "opacity",
                    simple: !0
                });
                Kn.classList.add("is-active"),
                this.appendChild(Kn),
                ss.from(a, {
                    absolute: !0,
                    duration: .3,
                    ease: "power2.out"
                })
            })
        }),
        wm.addEventListener("mouseleave", function() {
            const o = ss.getState(Kn, {
                props: "opacity",
                simple: !0
            });
            Kn.classList.remove("is-active"),
            ss.from(o, {
                absolute: !0,
                duration: .3,
                ease: "power2.out",
                scale: !0
            })
        })
    }
    );
    let r = window.innerWidth / 1e3;
    const i = We.timeline({
        paused: !0
    })
      , s = We.timeline({
        paused: !0
    });
    We.set("[data-about-inner]", {
        x: "3%",
        opacity: 0
    }),
    i.to(zr, {
        width: "100%",
        duration: r,
        ease: "power3.out"
    }).to(".bg-overlay", {
        width: "100%",
        duration: 0
    }, 0).to(".bg-overlay", {
        opacity: 1,
        duration: .6,
        pointerEvents: "all"
    }, 0).to(".custom-cursor_parent", {
        opacity: 1,
        duration: 0
    }, 0).to("[data-about-inner]", {
        opacity: 1,
        x: "0%",
        duration: .9,
        ease: "power2.out",
        stagger: {
            amount: .5
        }
    }, .15),
    s.to(zr, {
        width: "0%",
        duration: .5,
        ease: "power3.out"
    }).to(".custom-cursor_parent", {
        opacity: 0,
        duration: .3
    }, 0).to("[data-about-inner]", {
        opacity: 0,
        x: "3%",
        duration: .5,
        ease: "power2.out"
    }).to(".bg-overlay", {
        opacity: 0,
        duration: .3,
        pointerEvents: "none"
    }, "<"),
    co.addEventListener("click", o=>{
        o.preventDefault(),
        zr.classList.contains("is-opened") || (zr.classList.add("is-opened"),
        i.restart(),
        Fr.stop())
    }
    ),
    vm.addEventListener("click", o=>{
        o.preventDefault(),
        !i.isActive() && zr.classList.contains("is-opened") && (zr.classList.remove("is-opened"),
        s.restart(),
        Fr.start(),
        co.focus())
    }
    ),
    ym.addEventListener("click", o=>{
        !i.isActive() && zr.classList.contains("is-opened") && (zr.classList.remove("is-opened"),
        s.restart(),
        Fr.start(),
        co.focus())
    }
    ),
    document.addEventListener("keydown", function(o) {
        o.key === "Escape" && !i.isActive() && zr.classList.contains("is-opened") && (zr.classList.remove("is-opened"),
        s.restart(),
        Fr.start(),
        co.focus())
    })
}
);
document.addEventListener("visibilitychange", ()=>{
    document.hidden || Pc || (_u.restart(),
    setTimeout(()=>{
        Pc = !0
    }
    , 5e3))
}
);
