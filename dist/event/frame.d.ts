export declare class Frame {
    private f;
    private anim_id;
    private canceled;
    constructor(f: () => void);
    cleanup(): void;
}
