import {PngReader} from "./png-reader.js";
export class DropBox {
    constructor() {}
    async create() {
        var dropZone = document.getElementById('drop-zone');
        var preview = document.getElementById('preview');
        var fileInput = document.getElementById('file-input');
        var apiSelect = document.getElementById('api');

        /*
        apiSelect.addEventListener('input', async(e)=>{
            
        })
        */

        dropZone.addEventListener('dragover', async(e)=>{
            e.stopPropagation();
            e.preventDefault();
            e.target.style.background = '#e1e7f0';
        }, false);

        dropZone.addEventListener('dragleave', async(e)=>{
            e.stopPropagation();
            e.preventDefault();
            e.target.style.background = '#ffffff';
        }, false);

        fileInput.addEventListener('change', async(e)=>{
            await previewFile(e.target.files[0]);
        });

        dropZone.addEventListener('drop', async(e)=>{
            e.stopPropagation();
            e.preventDefault();
            e.target.style.background = '#ffffff';
            var files = e.dataTransfer.files;
            if (files.length > 1) { return alert('開けるファイルは1つだけです。'); }
            fileInput.files = files;
            await previewFile(files[0]);
        }, false);

        function message(m, isAlert=false) { console.log(m); document.getElementById('is-png').textContent = m; if(isAlert){alert(m)}}
        async function previewFile(file) {
            preview.innerHTML = ''
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
    }
}

