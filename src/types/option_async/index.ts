import { NoneAsync } from "./none";
import { SomeAsync } from "./some";

export type OptionAsync<T> = SomeAsync<T> | NoneAsync<T>;

export { NoneAsync, SomeAsync };
