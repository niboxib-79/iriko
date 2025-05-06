class Complex {
    public re: number;
    public im: number;
    public constructor(re: number, im = 0) {
        this.re = re;
        this.im = im;
    }
    public add(cb: Complex): Complex;
    public add(cb: number): Complex;
    public add(cb: Complex | number): Complex {
        if (typeof cb === "number") {
            return new Complex(this.re + cb, this.im);
        } else {
            return new Complex(this.re + cb.re, this.im + cb.im);
        }
    }
    public sub(cb: Complex): Complex;
    public sub(cb: number): Complex;
    public sub(cb: Complex | number): Complex {
        if (typeof cb === "number") {
            return new Complex(this.re - cb, this.im);
        } else {
            return new Complex(this.re - cb.re, this.im - cb.im);
        }
    }
    public mul(cb: Complex): Complex;
    public mul(cb: number): Complex;
    public mul(cb: Complex | number): Complex {
        if (typeof cb === "number") {
            return new Complex(this.re * cb, this.im * cb);
        } else {
            return new Complex(
                this.re * cb.re - this.im * cb.im,
                this.re * cb.im + this.im * cb.re,
            );
        }
    }
    public div(cb: Complex): Complex;
    public div(cb: number): Complex;
    public div(cb: Complex | number): Complex {
        if (typeof cb === "number") {
            return new Complex(this.re / cb, this.im / cb);
        } else {
            const denominator = this.re * cb.re + this.im * cb.im;
            return new Complex(
                (this.re * cb.re + this.im * cb.im) / denominator,
                (this.im * cb.re - this.re * cb.im) / denominator,
            );
        }
    }
    public abs(): number {
        return Math.sqrt(this.re * this.re + this.im * this.im);
    }
    public conjugate(): Complex {
        return new Complex(this.re, this.im);
    }
    public sign(): Complex {
        const abs = this.abs();
        return new Complex(this.re / abs, this.im / abs);
    }
    public static exp(cb: Complex): Complex;
    public static exp(cb: number): Complex;
    public static exp(cb: Complex | number): Complex {
        if (typeof cb === "number") {
            return new Complex(Math.exp(cb), 0);
        } else {
            const abs = Math.exp(cb.re);
            return new Complex(abs * Math.cos(cb.im), abs * Math.sin(cb.im));
        }
    }
    public static ln(cb: Complex): Complex;
    public static ln(cb: number): Complex;
    public static ln(cb: Complex | number): Complex {
        const abs = typeof cb === "number" ? Math.abs(cb) : cb.abs();
        const arg = typeof cb === "number" ? 0 : Math.atan2(cb.im, cb.re);
        return new Complex(Math.log(abs), arg);
    }
}
