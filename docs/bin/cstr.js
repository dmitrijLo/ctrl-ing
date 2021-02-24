/**
 * @author Stefan Goessner (c) 2021
 * @license MIT Licence (MIT)
 */
/* jshint -W014 */

// error: two base nodes !

/**
 * Create constraint between a pair of nodes.
 * @param {object} p1 - node one.
 * @param {object} p2 - node two.
 * @param {number} r - magnitude of vector from `p1` to `p2`.
 * @param {number} w - angle of vector from `p1` to `p2` w.r.t positive x-axis [radians].
 */
function cstr({id,p1,p2,r,w}) {
    const o = {id, p1, p2};
    if (r !== undefined) {
        if (typeof r === 'string' && r === 'const') {
            o._r = Math.hypot(p2.y-p1.y, p2.x-p1.x);
        }
        else if (typeof r === 'number') { // constant
            o._r = r;
        }
        else if (typeof r === 'function') {
            Object.defineProperty(o, '_r', { get:r, enumerable:true, configurable:true });
        }
    }
    if (w !== undefined) {
        if (typeof w === 'string' && w === 'const') {
            o._w = Math.atan2(p2.y-p1.y, p2.x-p1.x);
        }
        else if (typeof w === 'number') { // constant
            o._w = w;
        }
        else if (typeof w === 'function') {
            Object.defineProperty(o, '_w', { get:w, enumerable:true, configurable:true });
        }
    }

    return Object.create(cstr.prototype, Object.getOwnPropertyDescriptors(o));
}

cstr.prototype = {
    get r() { return this._r !== undefined ? this._r : (this.p2.x-this.p1.x)*Math.cos(this.w) + (this.p2.y-this.p1.y)*Math.sin(this.w); },
    get w() { return this._w !== undefined ? this._w : Math.atan2(this.p2.y-this.p1.y, this.p2.x-this.p1.x); },

    get dr() { 
        return this._r === undefined 
            ? 0 : (this.p2.x-this.p1.x)*Math.cos(this.w) + (this.p2.y-this.p1.y)*Math.sin(this.w) - this._r;
    },
    get dw() { 
        return this._w === undefined 
            ? 0 : (this.p2.y-this.p1.y)*Math.cos(this._w) - (this.p2.x-this.p1.x)*Math.sin(this._w);
    },
    get im1() { return (this.p1.m ? 1/this.p1.m : this.p1.base ? 0 : 1); },
    get im2() { return (this.p2.m ? 1/this.p2.m : this.p2.base ? 0 : 1); },
    get imc() { return this.im1 + this.im2; },

    correct_r(tol) {
        let done = this._r === undefined;
        if (!done) {  // self-control
            const dr = this.dr;
            this.applyImpulse(dr*Math.cos(this.w), dr*Math.sin(this.w));
            done = Math.abs(dr) < tol;  // constraint fulfilled ...
        }
        return done;
    },
    correct_w(tol) {
        let done = this._w === undefined;
        if (!done) {  // self-control
            const dw = this.dw;
            this.applyImpulse(-dw*Math.sin(this._w), dw*Math.cos(this._w));
            done = Math.abs(dw) < tol;  // constraint fulfilled ...
        }
        return done;
    },

    correct(tol) {
        return this.correct_r(tol) && this.correct_w(tol);
    },

    applyImpulse(dx,dy) {
        const im1_imc = this.im1 / this.imc, 
              im2_imc = this.im2 / this.imc,
              limit = 1000;
        this.p1.x = Math.min(limit,Math.max(-limit, this.p1.x + im1_imc * dx));
        this.p1.y = Math.min(limit,Math.max(-limit, this.p1.y + im1_imc * dy));
        this.p2.x = Math.min(limit,Math.max(-limit, this.p2.x - im2_imc * dx));
        this.p2.y = Math.min(limit,Math.max(-limit, this.p2.y - im2_imc * dy));
    }
/*
    align() {
        this._w = Math.atan2(this.p2.y-this.p1.y, this.p2.x-this.p1.x);
    }
*/
}

/**
 * Create constraint between a pair of constraints.
 * @param {object} c1 - constraint one.
 * @param {object} c2 - constraint two.
 */
function cstr2({c1,c2,type}) {
    const o = {c1,c2,type};
    if (type === 'r-r') {
        o.L = c1.r + c2.r;
    }
    return Object.create(cstr2.prototype, Object.getOwnPropertyDescriptors(o));
}

cstr2.prototype = {
    get Cr() { return this.c1.Cw - this.ratio*this.c1.r/this.c2.r*this.c2.Cw; },
    get imc() { return this.c1.imc +this.c2.imc; },

    correct(lenTol) { // r-r ... !
        const c1 = this.c1, c2 = this.c2;
        const r1 = c1.r;
        const r2 = c2.r;
        const del = c1.r + c2.r - this.L;
        const del1 = this.c1.imc/this.imc*del, del2 = this.c2.imc/this.imc*del;
        c1._w = c1.w + del1; c2._w = c2.w + del2;

        return c1.correct(lenTol) && c2.correct(lenTol);
    }
}


// use it with node.js ... ?
if (typeof module !== 'undefined') module.exports = cstr;