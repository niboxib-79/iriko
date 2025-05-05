import { None, Some } from "~/ns";

describe("Some<T>", () => {
    it("unwrap() returns the contained value", () => {
        expect(Some(42).unwrap()).toBe(42);
    });

    it("unwrap_or() returns the contained value, ignoring the fallback", () => {
        expect(Some(42).unwrap_or(99)).toBe(42);
    });

    it("unwrap_or_else() returns the contained value, ignoring the fallback function", () => {
        expect(Some(42).unwrap_or_else(() => 99)).toBe(42);
    });

    it("is_some() returns true", () => {
        expect(Some(42).is_some()).toBe(true);
    });

    it("is_none() returns false", () => {
        expect(Some(42).is_none()).toBe(false);
    });

    it("map() transforms the contained value", () => {
        expect(Some(2).map((x) => x * 3).unwrap()).toBe(6);
    });

    it("flat_map() correctly applies the function", () => {
        expect(Some(2).flat_map((x) => Some(x * 3)).unwrap()).toBe(6);
        expect(Some(2).flat_map(() => None()).is_none()).toBe(true);
    });

    it("and() returns the second option if Some, otherwise None", () => {
        expect(Some(42).and(Some(99)).unwrap()).toBe(99);
        expect(Some(42).and(None()).is_none()).toBe(true);
    });

    it("or() returns itself if Some", () => {
        expect(Some(42).or(Some(99)).unwrap()).toBe(42);
    });

    it("or_else() returns itself if Some", () => {
        expect(Some(42).or_else(() => Some(99)).unwrap()).toBe(42);
    });

    it("ok_or() converts Some into Ok variant of Result", () => {
        expect(Some(42).ok_or("error").unwrap()).toBe(42);
    });

    it("ok_or_else() converts Some into Ok variant of Result", () => {
        expect(Some(42).ok_or(()=>"error").unwrap()).toBe(42);
    });

    it("filter() returns Some if predicate matches, otherwise None", () => {
        expect(Some(42).filter((x) => x > 40).unwrap()).toBe(42);
        expect(Some(42).filter((x) => x < 40).is_none()).toBe(true);
    });

    it("zip() correctly zips two Some values", () => {
        expect(Some(42).zip(Some(99)).unwrap()).toEqual([42, 99]);
        expect(Some(42).zip(None()).is_none()).toBe(true);
    });
});

describe("None<T>", () => {
    it("unwrap() should throw an error", () => {
        expect(() => None().unwrap()).toThrow();
    });

    it("unwrap_or() returns the fallback value", () => {
        expect(None().unwrap_or(99)).toBe(99);
    });

    it("unwrap_or_else() returns the result of the fallback function", () => {
        expect(None().unwrap_or_else(() => 99)).toBe(99);
    });

    it("is_some() returns false", () => {
        expect(None().is_some()).toBe(false);
    });

    it("is_none() returns true", () => {
        expect(None().is_none()).toBe(true);
    });

    it("map() returns None", () => {
        expect(None().map((x) => x * 3).is_none()).toBe(true);
    });

    it("flat_map() returns None", () => {
        expect(None().flat_map((x) => Some(x * 3)).is_none()).toBe(true);
    });

    it("and() returns None", () => {
        expect(None().and(Some(99)).is_none()).toBe(true);
    });

    it("or() returns the other option", () => {
        expect(None().or(Some(99)).unwrap()).toBe(99);
    });

    it("or_else() returns the result of the provided function", () => {
        expect(None().or_else(() => Some(99)).unwrap()).toBe(99);
    });

    it("ok_or() returns Err variant of Result", () => {
        expect(None().ok_or("error").unwrap_err()).toBe("error");
    });

    it("ok_or_else() returns Err variant of Result", () => {
        expect(None().ok_or_else(()=>"error").unwrap_err()).toBe("error");
    });

    it("filter() always returns None", () => {
        expect(None().filter(() => true).is_none()).toBe(true);
    });

    it("zip() always returns None", () => {
        expect(None().zip(Some(99)).is_none()).toBe(true);
    });
});
