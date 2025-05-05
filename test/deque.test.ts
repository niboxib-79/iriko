import { Deque, None, Some } from "~/ns";

describe("Deque", () => {
    let deque: Deque<number>;

    beforeEach(() => {
        deque = new Deque<number>();
    });

    it("should initialize empty", () => {
        expect(deque.length).toBe(0);
        expect(deque.at(0)).toEqual(None());
    });

    it("push_back and pop_back", () => {
        const len1 = deque.push_back(1);
        expect(len1).toBe(1);
        expect(deque.length).toBe(1);
        expect(deque.pop_back()).toEqual(Some(1));
        expect(deque.length).toBe(0);
        expect(deque.pop_back()).toEqual(None());
    });

    it("push_front and pop_front", () => {
        const len1 = deque.push_front(10);
        expect(len1).toBe(1);
        expect(deque.length).toBe(1);
        expect(deque.pop_front()).toEqual(Some(10));
        expect(deque.length).toBe(0);
        expect(deque.pop_front()).toEqual(None());
    });

    it("at should return correct items", () => {
        deque.push_back(1);
        deque.push_back(2);
        deque.push_back(3);
        expect(deque.at(0)).toEqual(Some(1));
        expect(deque.at(1)).toEqual(Some(2));
        expect(deque.at(2)).toEqual(Some(3));
        expect(deque.at(3)).toEqual(None());
        expect(deque.at(-1)).toEqual(Some(3));
    });

    it("for_each should iterate in order", () => {
        deque.push_back(1);
        deque.push_back(2);
        const items: number[] = [];
        deque.for_each((v) => items.push(v));
        expect(items).toEqual([1, 2]);
    });

    it("map should transform values", () => {
        deque.push_back(2);
        deque.push_back(3);
        const mapped = deque.map((v) => v * 10);
        expect(mapped).not.toBe(deque);
        expect(mapped.length).toBe(2);
        expect(mapped.at(0)).toEqual(Some(20));
        expect(mapped.at(1)).toEqual(Some(30));
    });

    it("flat_map should flatten nested deques", () => {
        deque.push_back(1);
        deque.push_back(2);
        const flat = deque.flat_map((v) => {
            const d = new Deque<number>();
            d.push_back(v);
            d.push_back(v + 10);
            return d;
        });
        expect(flat.length).toBe(4);
        expect(flat.at(0)).toEqual(Some(1));
        expect(flat.at(1)).toEqual(Some(11));
        expect(flat.at(2)).toEqual(Some(2));
        expect(flat.at(3)).toEqual(Some(12));
    });

    it("fold should accumulate values", () => {
        deque.push_back(1);
        deque.push_back(2);
        deque.push_back(3);
        const sum = deque.fold(0, (acc, cur) => acc + cur);
        expect(sum).toBe(6);
    });

    it("clone should create independent copy", () => {
        deque.push_back(5);
        const copy = deque.clone();
        expect(copy).not.toBe(deque);
        expect(copy.length).toBe(1);
        copy.push_back(10);
        expect(deque.length).toBe(1);
        expect(copy.length).toBe(2);
    });

    it("values generator should iterate values", () => {
        deque.push_back(7);
        deque.push_back(8);
        const vals = Array.from(deque.values());
        expect(vals).toEqual([7, 8]);
    });

    it("keys generator should iterate indices", () => {
        deque.push_back(4);
        deque.push_back(5);
        const keys = Array.from(deque.keys());
        expect(keys).toEqual([0, 1]);
    });

    it("entries generator should iterate [index, value]", () => {
        deque.push_back(9);
        deque.push_back(10);
        const entries = Array.from(deque.entries());
        expect(entries).toEqual([
            [0, 9],
            [1, 10],
        ]);
    });

    it("iterator should support for..of", () => {
        deque.push_back(1);
        deque.push_back(2);
        const arr: number[] = [];
        for (const v of deque) {
            arr.push(v);
        }
        expect(arr).toEqual([1, 2]);
    });
});
