/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class OkC {
    constructor(val) {
        this.val = val;
    }
    unwrap() {
        return this.val;
    }
    unwrap_or(_d) {
        return this.val;
    }
    unwrap_or_else(_f) {
        return this.val;
    }
    unwrap_err() {
        throw new Error(`tried to unwrap_err Ok: ${this.val}`);
    }
    is_ok() {
        return true;
    }
    is_ok_and(f) {
        return f(this.val);
    }
    is_err() {
        return false;
    }
    is_err_and(_f) {
        return false;
    }
    map(f) {
        return new OkC(f(this.val));
    }
    map_async(f) {
        return __awaiter(this, void 0, void 0, function* () {
            return new OkC(yield f(this.val));
        });
    }
    map_err(_f) {
        return this;
    }
    and(rb) {
        return rb;
    }
    flat_map(f) {
        return f(this.val);
    }
    or(_rb) {
        return this;
    }
    or_else(_f) {
        return this;
    }
    ok() {
        return Some(this.val);
    }
    err() {
        return None();
    }
    invert() {
        return Err(this.val);
    }
    throw() {
        throw this.val;
    }
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Ok = (val) => new OkC(val);

class ErrC {
    constructor(e) {
        this.e = e;
    }
    unwrap() {
        throw new Error(`tried to unwrap Err value: ${this.e}`);
    }
    unwrap_or(d) {
        return d;
    }
    unwrap_or_else(f) {
        return f();
    }
    unwrap_err() {
        return this.e;
    }
    is_ok() {
        return false;
    }
    is_ok_and(_f) {
        return false;
    }
    is_err() {
        return true;
    }
    is_err_and(f) {
        return f(this.e);
    }
    map(_f) {
        return this;
    }
    map_async(_f) {
        return __awaiter(this, void 0, void 0, function* () {
            return this;
        });
    }
    map_err(f) {
        return new ErrC(f(this.e));
    }
    and(_rb) {
        return this;
    }
    flat_map(_f) {
        return this;
    }
    or(rb) {
        return rb;
    }
    or_else(f) {
        return f(this.e);
    }
    ok() {
        return None();
    }
    err() {
        return Some(this.e);
    }
    invert() {
        return Ok(this.e);
    }
    throw() {
        throw this.e;
    }
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Err = (e) => new ErrC(e);

const Result = {
    try: (f) => {
        try {
            const v = f();
            return Ok(v);
        }
        catch (e) {
            return Err(e);
        }
    },
    try_async: (f) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const v = yield f();
            return Ok(v);
        }
        catch (e) {
            return Err(e);
        }
    }),
    try_promise: (p) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const v = yield p;
            return Ok(v);
        }
        catch (e) {
            return Err(e);
        }
    }),
    all: (arr) => {
        const res = [];
        for (const o of arr) {
            if (o.is_ok()) {
                res.push(o.unwrap());
            }
            else {
                return o;
            }
        }
        return Ok(res);
    },
    any: (arr) => {
        const err = [];
        for (const o of arr) {
            if (o.is_ok()) {
                return o;
            }
            else {
                err.push(o.unwrap_err());
            }
        }
        return Err(err);
    },
};

class NoneC {
    unwrap() {
        throw new Error("tried to unwrap None value");
    }
    unwrap_or(alt) {
        return alt;
    }
    unwrap_or_else(f) {
        return f();
    }
    is_some() {
        return false;
    }
    is_some_and(_f) {
        return false;
    }
    is_none() {
        return true;
    }
    is_none_or(_f) {
        return true;
    }
    map(_f) {
        return this;
    }
    and(_ob) {
        return this;
    }
    flat_map(_f) {
        return this;
    }
    or(ob) {
        return ob;
    }
    or_else(f) {
        return f();
    }
    ok_or(e) {
        return Err(e);
    }
    ok_or_else(f) {
        return Err(f());
    }
    filter(_f) {
        return this;
    }
    zip(_ob) {
        return this;
    }
    raw() {
        return undefined;
    }
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const None = () => new NoneC();

class SomeC {
    constructor(val) {
        this.val = val;
    }
    unwrap() {
        return this.val;
    }
    unwrap_or(alt) {
        return this.val;
    }
    unwrap_or_else(f) {
        return this.val;
    }
    is_some() {
        return true;
    }
    is_some_and(f) {
        return f(this.val);
    }
    is_none() {
        return false;
    }
    is_none_or(f) {
        return f(this.val);
    }
    map(f) {
        return new SomeC(f(this.val));
    }
    and(ob) {
        return ob;
    }
    flat_map(f) {
        return f(this.val);
    }
    or(_ob) {
        return this;
    }
    or_else(_f) {
        return this;
    }
    ok_or(_e) {
        return Ok(this.val);
    }
    ok_or_else(_f) {
        return Ok(this.val);
    }
    filter(f) {
        return f(this.val) ? this : None();
    }
    zip(ob) {
        if (ob.is_some())
            return new SomeC([this.val, ob.val]);
        else
            return None();
    }
    raw() {
        return this.val;
    }
}
const Some = (v) => new SomeC(v);

const Option = {
    from: (v) => {
        if (v === undefined || v === null) {
            return None();
        }
        else {
            return Some(v);
        }
    },
    all: (arr) => {
        const res = [];
        for (const o of arr) {
            if (o.is_some()) {
                res.push(o.unwrap());
            }
            else {
                return None();
            }
        }
        return Some(res);
    },
    any: (arr) => {
        for (const o of arr) {
            if (o.is_some()) {
                return o;
            }
        }
        return None();
    },
};

class Frame {
    constructor(f) {
        this.f = f;
        const fr = () => {
            if (this.canceled)
                return;
            this.f();
            this.anim_id = requestAnimationFrame(fr);
        };
        this.anim_id = requestAnimationFrame(fr);
        this.canceled = false;
    }
    cleanup() {
        cancelAnimationFrame(this.anim_id);
        this.canceled = true;
    }
}

class Builder {
    constructor() {
        this.on_mousedown_f = None();
        this.on_mouseup_f = None();
        this.on_mousemove_f = None();
    }
    on_mousedown(f) {
        this.on_mousedown_f = Some(f);
        return this;
    }
    on_mouseup(f) {
        this.on_mouseup_f = Some(f);
        return this;
    }
    on_mousemove(f) {
        this.on_mousemove_f = Some(f);
        return this;
    }
    build() {
        return new PointerHandler(this.on_mousedown_f, this.on_mouseup_f, this.on_mousemove_f);
    }
}
class PointerHandler {
    constructor(on_mousedown_f, on_mouseup_f, on_mousemove_f) {
        this.mousedown = None();
        this.mouseup = None();
        this.mousemove = None();
        this.on_mousedown_f = on_mousedown_f;
        this.on_mouseup_f = on_mouseup_f;
        this.on_mousemove_f = on_mousemove_f;
        this.mousedown_handler_capture = (e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            this.mousedown = Some(e);
        };
        this.mousedown_handler = (e) => {
            this.mousedown = Some(e);
        };
        this.mouseup_handler = (e) => {
            this.mouseup = Some(e);
        };
        this.mousemove_handler = (e) => {
            this.mousemove = Some(e);
        };
        this.frame = new Frame(() => {
            this.on_mousedown_f.zip(this.mousedown).map(([fn, e]) => fn(e));
            this.on_mouseup_f.zip(this.mouseup).map(([fn, e]) => fn(e));
            this.on_mousemove_f.zip(this.mousemove).map(([fn, e]) => fn(e));
            this.mousedown = None();
            this.mouseup = None();
            this.mousemove = None();
        });
        this.elements = new Set();
    }
    handlers(capture = false) {
        return {
            onPointerDown: capture
                ? this.mousedown_handler_capture
                : this.mousedown_handler,
            onPointerUp: this.mouseup_handler,
            onPointerMove: this.mousemove_handler,
        };
    }
    add_event_listener(e, capture = false) {
        const { onPointerDown, onPointerUp, onPointerMove } = this.handlers(capture);
        e.addEventListener("pointerdown", onPointerDown);
        e.addEventListener("pointerup", onPointerUp);
        e.addEventListener("pointermove", onPointerMove);
        this.elements.add({ elem: e, capture });
    }
    remove_event_listener(e, capture = false) {
        const { onPointerDown, onPointerUp, onPointerMove } = this.handlers(capture);
        e.removeEventListener("pointerdown", onPointerDown);
        e.removeEventListener("pointerup", onPointerUp);
        e.removeEventListener("pointermove", onPointerMove);
        this.elements.delete({ elem: e, capture });
    }
    cleanup() {
        this.frame.cleanup();
        for (const { elem, capture } of this.elements) {
            this.remove_event_listener(elem, capture);
        }
    }
}
PointerHandler.Builder = Builder;

var ns = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Err: Err,
    Frame: Frame,
    None: None,
    Ok: Ok,
    Option: Option,
    PointerHandler: PointerHandler,
    Result: Result,
    Some: Some
});

export { Err, Frame, ns as Iriko, None, Ok, Option, PointerHandler, Result, Some };
