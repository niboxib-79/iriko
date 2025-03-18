import { type Option } from "../types/option/index";
declare class Builder {
    private on_mousedown_f;
    private on_mouseup_f;
    private on_mousemove_f;
    constructor();
    on_mousedown(f: (e: PointerEvent) => void): this;
    on_mouseup(f: (e: PointerEvent) => void): this;
    on_mousemove(f: (e: PointerEvent) => void): this;
    build(): PointerHandler;
}
export declare class PointerHandler {
    private mousedown;
    private mouseup;
    private mousemove;
    private on_mousedown_f;
    private on_mouseup_f;
    private on_mousemove_f;
    private mousedown_handler_capture;
    private mousedown_handler;
    private mouseup_handler;
    private mousemove_handler;
    private frame;
    private elements;
    constructor(on_mousedown_f: Option<(e: PointerEvent) => void>, on_mouseup_f: Option<(e: PointerEvent) => void>, on_mousemove_f: Option<(e: PointerEvent) => void>);
    handlers(capture?: boolean): {
        onPointerDown: (e: PointerEvent) => void;
        onPointerUp: (e: PointerEvent) => void;
        onPointerMove: (e: PointerEvent) => void;
    };
    add_event_listener<E extends HTMLElement>(e: E, capture?: boolean): void;
    remove_event_listener<E extends HTMLElement>(e: E, capture?: boolean): void;
    cleanup(): void;
    static Builder: typeof Builder;
}
export {};
