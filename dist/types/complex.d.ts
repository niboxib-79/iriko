declare class Complex {
    re: number;
    im: number;
    constructor(re: number, im?: number);
    add(cb: Complex): Complex;
    add(cb: number): Complex;
    sub(cb: Complex): Complex;
    sub(cb: number): Complex;
    mul(cb: Complex): Complex;
    mul(cb: number): Complex;
    div(cb: Complex): Complex;
    div(cb: number): Complex;
    abs(): number;
    conjugate(): Complex;
    sign(): Complex;
    static exp(cb: Complex): Complex;
    static exp(cb: number): Complex;
    static ln(cb: Complex): Complex;
    static ln(cb: number): Complex;
}
