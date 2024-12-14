export class FMath {
    static abs(x) {
        return x < 0 ? -x : x;
    }
    static floor(x) {
        return x | 0;
    }
    static ceil(x) {
        return (x | 0) + 1;
    }
    static round(x) {
        return (x + 0.5) | 0;
    }
    static pow(x, y) {
        let result = 1;
        for (let i = 0; i < y; i++) {
            result *= x;
        }
        return result;
    }
    static hypot(...v) {
        let result = 0;
        for (let i = 0; i < v.length; i++) {
            result += v[i] * v[i];
        }
        return Math.sqrt(result);
    }
    static min(...v) {
        let result = v[0];
        for (let i = 1; i < v.length; i++) {
            if (v[i] < result) {
                result = v[i];
            }
        }
        return result;
    }
    static max(...v) {
        let result = v[0];
        for (let i = 1; i < v.length; i++) {
            if (v[i] > result) {
                result = v[i];
            }
        }
        return result;
    }
    static random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }
}
