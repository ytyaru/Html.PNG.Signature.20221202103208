JavaScriptでPNGファイル解析（シグネチャ）

　バイナリファイルの先頭8バイト固定データを読み取る。

<!-- more -->

# ブツ

* [DEMO][]
* [リポジトリ][]

[DEMO]:https://ytyaru.github.io/Html.PNG.Signature.20221202103208
[リポジトリ]:https://github.com/ytyaru/Html.PNG.Signature.20221202103208

```sh
NAME='Html.PNG.Signature.20221202103208'
git clone https://github.com/ytyaru/$NAME
cd $NAME/docs
```

1. ターミナルを起動する
1. 上記コマンドを叩く
1. 起動したブラウザでHTTPSを実行する（Chromiumの場合は以下）
	1. `この接続ではプライバシーが保護されません`ページが表示される
	1. `詳細設定`をクリックする
	1. `localhost にアクセスする（安全ではありません）`リンクをクリックする
1. ファイルを選ぶ（次のうちいずれかの方法で）
	* 任意ファイルをドラッグ＆ドロップする
	* ファイル選択ダイアログボタンを押してファイルを選択する
1. PNG判定が実行される
	* もしPNGなら`このファイルはPNG形式です😄`と表示され、PNG画像が表示される
	* もしPNGでないなら`このファイルはPNG形式でない！`と表示される

　テスト用PNG画像はリポジトリの`./docs/asset/image/monar-mark-gold.png`にある。非PNGファイルは適当に`README.md`を使えばいい。

# 概要

* [PNGファイルシグネチャ][]

[PNGファイルシグネチャ]:https://www.w3.org/TR/png/#5PNG-file-signature

　PNGファイルはバイナリファイルであり、先頭8バイトが固定データ`89 50 4E 47 0D 0A 1A 0A`になっている。

　つまり次の手順でファイルがPNG形式であるか判定できる。

1. ファイルを開く
1. バイナリデータ配列として解釈する
1. 先頭8バイトを読む
1. 3が`89 50 4E 47 0D 0A 1A 0A`であるならPNG形式と判定する

　ふつうは拡張子`.png`かどうかだけで判断できるが、このシグネチャ判定のほうがより厳密に可能。特にPNGファイルを詳しく読み取り、書き込みしたければ最初に行いたい。

# 実装概要

　ファイルをドラッグ＆ドロップ（DnD）やファイル選択ダイアログでひとつ選ぶと、PNGかどうか判定してメッセージ表示する。PNGなら画像を表示する。

　[Drag and Drop API][]や[input type="file" 要素][]からファイルをひとつ取得する。ファイルは[File][]オブジェクトとして返される。[File][]は[Blob][]を継承した型。[arrayBuffer()][]でファイルのバイナリデータを取得できる。

[Drag and Drop API]:https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
[input type="file" 要素]:https://developer.mozilla.org/ja/docs/Web/HTML/Element/input/file
[File]:https://developer.mozilla.org/ja/docs/Web/API/File
[Blob]:https://developer.mozilla.org/ja/docs/Web/API/Blob
[arrayBuffer()]:https://developer.mozilla.org/ja/docs/Web/API/Blob/arrayBuffer

## バイナリ操作API

　JavaScriptにおけるバイナリ操作はおもに2種類ある。[DataView][]または型付配列（[TypedArray][]）を使う方法。

1. [ArrayBuffer][]を生成／取得する
1. [DataView][]または型付配列（[TypedArray][]）に変換する
1. 各クラスのバイナリ操作APIを使う

　以下参照。

* [JavaScript の型付き配列][]（[TypedArray][]）

### 型付配列（[TypedArray][]）

#### 整数

Byte|Signd|Unsigned|Clamped
----|-----|--------|-------
1|[Int8Array][]|[Uint8Array][]|[Uint8ClampedArray][]|
2|[Int16Array][]|[Uint16Array][]|
4|[Int32Array][]|[UInt32Array][]|
8|[BigInt64Array][]|[BigUint64Array][]|

#### 浮動少数

Byte|Signd
----|-----
4|[Float32Array][]
8|[Float64Array][]

[JavaScript の型付き配列]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Typed_arrays
[TypedArray]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Typed_arrays
[ArrayBuffer]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
[DataView]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/DataView
[Int8Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Int8Array
[Uint8Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
[Uint8ClampedArray]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
[Int16Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Int16Array
[Uint16Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array
[Int32Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Int32Array
[Uint32Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array
[Float32Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Float32Array
[Float64Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Float64Array
[BigInt64Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array
[BigUint64Array]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array

# コード抜粋

* index.html
	* main.js
		* drop-box.js
			* png-reader.js

　ES Moduleで`import`する。

## index.html

　ファイラからファイルをDnDする領域をつくる。

　また、[input type="file" 要素][]でダイアログからファイル選択するUIを用意する。

```html
<div id="drop-zone" style="border: 1px solid; padding: 30px;">
    <input type="file" name="file" id="file-input">
</div>
```

　今回はES Moduleを使った。そのため[script要素][]の`type`属性値に`module`をセットする。

[script要素]:https://developer.mozilla.org/ja/docs/Web/HTML/Element/script

```html
<script type="module" src="js/main.js"></script>
```

## main.js

```javascript
import {DropBox} from "./drop-box.js";
window.addEventListener('DOMContentLoaded', async(event) => {
    const dropBox = new DropBox()
    await dropBox.create()
});
```

　DnD領域を描画する処理を呼び出す。

## drop-box.js

　ファイルダイアログからファイルを取得する。

```javascript
fileInput.addEventListener('change', async(e)=>{
    await previewFile(e.target.files[0]);
});
```

　ドラッグ＆ドロップからファイルを取得する。

```javascript
dropZone.addEventListener('drop', async(e)=>{
    var files = e.dataTransfer.files;
    fileInput.files = files;
    await previewFile(files[0]);
}, false);
```

　PNG判定の呼出と画像表示。

```javascript
async function previewFile(file) {
    preview.innerHTML = '';
    const reader = new PngReader()
    if (await reader.isPng(file, apiSelect.value)) {
        message(`このファイルはPNG形式です😄`)
        var fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = function() {
            var img = document.createElement('img');
            img.setAttribute('src', fr.result);
            preview.appendChild(img);
        };
    }
    else { message(`このファイルはPNG形式でない！`, true) }
}
```

## png-reader.js

　PNG判定。[DataView][]と[TypedArray][]の2種類の方法を用意した。`isPng()`の第二引数`api`で指定する。

```javascript
export class PngReader {
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
```

　判定方法は簡単。ファイルの先頭8バイトを取得して`89 50 4E 47 0D 0A 1A 0A`になっていればPNGと判定する。これは[PNGファイルシグネチャ][]の仕様である。

　あとはバイト配列を比較すればいいだけなのだが。バイナリデータ配列はCPUのバイトオーダーによって方向が変わる。リトルエンディアン／ビッグエンディアンがある。この差を吸収してくれるのが[DataView][]。バイトオーダーの差を考慮しなければ[TypedArray][]を使えばいい。ただ、どちらもバイナリを読み書きするAPIが異なる点は注意。一応、両方の場合でやってみた。

　ここで残念なお知らせ。なんとJavaScriptは配列の比較ができない！　ふつう他の言語なら`==`, `===`, `is()`, `equals()`などで簡単にできるのに……。`for`文で1バイトずつ確認するしないという残念ぶり。ダサい。ダサすぎる。[等価性の比較と同一性][]参照。

[等価性の比較と同一性]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness

```javascript
// 配列の比較ができない……
console.log(([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A] == [0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))
console.log(([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A] === [0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))
console.log((new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]) == new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A])))
console.log((new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]) === new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A])))
console.log((new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]).is(new Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))))
console.log(new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]) == new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))
console.log(new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]) === new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]))
console.log(new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]).is(new Uint8Array([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A])))
```

　とにかくJavaScriptでバイナリ操作する超基本ができた。あとはPNGのチャンクを読んだり、CRCチェックサム計算や、zlibのDeflate圧縮をやってみたい。どこまでできるかな。

