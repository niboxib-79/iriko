import { Err, Ok } from "~/ns";

describe("Ok<T, E>", () => {
    it("unwrap() returns the contained value", () => {
        expect(Ok(42).unwrap()).toBe(42);
    });

    it("unwrap_or() returns the contained value, ignoring the fallback", () => {
        expect(Ok(42).unwrap_or(99)).toBe(42);
    });

    it("unwrap_or_else() returns the contained value, ignoring the fallback function", () => {
        expect(Ok(42).unwrap_or_else(() => 99)).toBe(42);
    });

    it("unwrap_err() throws an error", () => {
        expect(() => Ok(42).unwrap_err()).toThrow("tried to unwrap_err Ok: 42");
    });

    it("is_ok() returns true", () => {
        expect(Ok(42).is_ok()).toBe(true);
    });

    it("is_err() returns false", () => {
        expect(Ok(42).is_err()).toBe(false);
    });

    it("map() transforms the contained value", () => {
        expect(Ok(2).map((x) => x * 3).unwrap()).toBe(6);
    });

    it("map_err() does nothing and keeps the same Ok value", () => {
        expect(Ok(2).map_err((e) => `Error: ${e}`).unwrap()).toBe(2);
    });

    it("flat_map() correctly applies the function", () => {
        expect(Ok(2).flat_map((x) => Ok(x * 3)).unwrap()).toBe(6);
        expect(Ok(2).flat_map(() => Err("error")).is_err()).toBe(true);
    });

    it("and() returns the second result if Ok, otherwise Err", () => {
        expect(Ok(42).and(Ok(99)).unwrap()).toBe(99);
        expect(Ok(42).and(Err("error")).is_err()).toBe(true);
    });

    it("or() returns itself if Ok", () => {
        expect(Ok(42).or(Ok(99)).unwrap()).toBe(42);
    });

    it("or_else() returns itself if Ok", () => {
        expect(Ok(42).or_else(() => Ok(99)).unwrap()).toBe(42);
    });

    it("ok() converts Ok into Some variant of Option", () => {
        expect(Ok(42).ok().unwrap()).toBe(42);
    });

    it("err() converts Ok into None variant of Option", () => {
        expect(Ok(42).err().is_none()).toBe(true);
    });

    it("invert() converts Ok into Err with the same value", () => {
        expect(Ok(42).invert().unwrap_err()).toBe(42);
    });

    it("throw() throws the contained value", () => {
        expect(() => Ok("error").throw()).toThrow("error");
    });
});

describe("Err<T, E>", () => {
    it("unwrap() should throw an error", () => {
        expect(() => Err("error").unwrap()).toThrow("error");
    });

    it("unwrap_or() returns the fallback value", () => {
        expect(Err("error").unwrap_or(99)).toBe(99);
    });

    it("unwrap_or_else() returns the result of the fallback function", () => {
        expect(Err("error").unwrap_or_else(() => 99)).toBe(99);
    });

    it("unwrap_err() returns the contained error value", () => {
        expect(Err("error").unwrap_err()).toBe("error");
    });

    it("is_ok() returns false", () => {
        expect(Err("error").is_ok()).toBe(false);
    });

    it("is_err() returns true", () => {
        expect(Err("error").is_err()).toBe(true);
    });

    it("map() does nothing and keeps the same Err value", () => {
        expect(Err("error").map((x) => x * 3).is_err()).toBe(true);
    });

    it("map_err() transforms the contained error", () => {
        expect(Err("error").map_err((e) => `Error: ${e}`).unwrap_err()).toBe("Error: error");
    });

    it("flat_map() keeps the error unchanged", () => {
        expect(Err("error").flat_map((x) => Ok(x * 3)).is_err()).toBe(true);
    });

    it("and() returns Err", () => {
        expect(Err("error").and(Ok(99)).is_err()).toBe(true);
    });

    it("or() returns the other Result", () => {
        expect(Err("error").or(Ok(99)).unwrap()).toBe(99);
    });

    it("or_else() returns the result of the provided function", () => {
        expect(Err("error").or_else(() => Ok(99)).unwrap()).toBe(99);
    });

    it("ok() converts Err into None variant of Option", () => {
        expect(Err("error").ok().is_none()).toBe(true);
    });

    it("err() converts Err into Some variant of Option", () => {
        expect(Err("error").err().unwrap()).toBe("error");
    });

    it("invert() converts Err into Ok with the same value", () => {
        expect(Err("error").invert().unwrap()).toBe("error");
    });

    it("throw() throws the contained error", () => {
        expect(() => Err("error").throw()).toThrow("error");
    });
});
