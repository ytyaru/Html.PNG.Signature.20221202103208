export class PngReader { // https://developer.mozilla.org/ja/docs/Web/JavaScript/Typed_arrays
    constructor() {}
    async isPng(blob, api='DataView') { // blob/file PNGファイルシグネチャがあるか
        console.log(`isPng()`)
        return ('DataView'===api) ? this.isPngFromDataView(blob) : this.isPngFromTypedArray(blob)
    }
    async isPngFromDataView(blob) { // blob/file PNGファイルシグネチャがあるか
        console.log(`isPngFromDataView`)
        const SIG = [0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]
        const dv = new DataView(await blob.arrayBuffer())
        if (dv.length < SIG.length) { return false }
        for (let i=0; i<SIG.length; i++) {
            console.log(SIG[i], dv.getUint8(i))
            if (SIG[i] !== dv.getUint8(i)) { return false }
        }
        console.log(`isPng === true`)
        return true
    }
    async isPngFromTypedArray(blob) { // blob/file PNGファイルシグネチャがあるか
        console.log(`isPngFromTypedArray`)
        return this.#equalsArray([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A], new Uint8Array(await blob.arrayBuffer(), 0, 8))
        /*
        const SIG = [0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]
        const buf = await blob.arrayBuffer()
        if (buf.length < SIG.length) { return false }
        const sig = new Uint8Array(buf, 0, 8);
        for (let i=0; i<SIG.length; i++) {
            console.log(SIG[i], sig[i])
            if (SIG[i] !== sig[i]) { return false }
        }
        return true
        */
        /*
        return (sig == new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))
        */
    }
    #equalsArray(a, b) { // 2つの配列a,bが等しいか
        console.log(`#equalsArray`)
        console.log(a)
        console.log(b)
        if (a.length !== b.length) { return false }
        for (let i=0; i<a.length; i++) {
            if (a[i] !== b[i]) { return false }
        }
        return true
    }
}
/*
// JavaScriptは配列の比較ができない！
// ふつう ==, ===, is(), equals() などで簡単にできるのに……。
// for文で1バイトずつ確認するしかない……。
console.log(([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A] == [0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))
console.log(([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A] === [0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))
console.log((new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]) == new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A])))
console.log((new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]) === new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A])))
console.log((new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]).is(new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))))
console.log(new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]) == new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))
console.log(new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]) === new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))
console.log(new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]).is(new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A])))
*/

