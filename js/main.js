
var filesToUpload = [];
const array_chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));
var sendChunk = function(data, total, index) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
			var j = JSON.parse(xhr.response);
			if ((index + 1) < total && j.uploaded === true) {
				sendChunk(data,total,(index+1));
			} else {
				document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + "<div>"+data.name+" uploaded</div>";
			}
        }
    }
    xhr.open("post", "/upload.php", true);
    xhr.setRequestHeader("X-File-Name", data.name);
    xhr.setRequestHeader("X-File-Size", data.size);
    xhr.setRequestHeader("X-File-Type", data.type);
	xhr.setRequestHeader("X-Index", (index + 1));
	xhr.setRequestHeader("X-Total", total);
	xhr.send(data.data[index]);
}
window.addEventListener("load", function(ev) {
	// drag dragstart dragend dragover dragenter dragleave drop
	document.getElementById('dragcont').addEventListener('dragenter', function(ev) {ev.target.style.backgroundColor = '#ffffff';},false);
	document.getElementById('dragcont').addEventListener('dragleave', function(ev) {ev.target.style.backgroundColor = '#eeeeee';},false);
	document.getElementById('dragcont').addEventListener('dragover', function(ev) {ev = ev || event;ev.preventDefault();},false);
	document.getElementById('dragcont').addEventListener('drop', function(ev) {
		ev = ev || event;
		ev.preventDefault();
		// ev.dataTransfer.items[0].getAsString(function(str) {console.log(str);});

		ev.target.style.backgroundColor = '#eeeeee';
		if (ev.dataTransfer.items.length > 0) {
			for (var i = 0;i < ev.dataTransfer.items.length; i++) {
				var item = ev.dataTransfer.items[i];

				if ((item.kind == 'string') && (item.type.match('^text/plain'))) {
					continue;
					item.getAsString(function(s){
						document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + "<div>TEXT "+s+"</div>";
					});
			    } else if ((item.kind == 'string') && (item.type.match('^text/html'))) {
					continue;
					item.getAsString(function(s){
						document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + "<div>HTML "+s+"</div>";
					});
			    } else if ((item.kind == 'string') && (item.type.match('^text/uri-list'))) {
					// скачать файл javascript не может, только средствами PHP
					item.getAsString(function(s){
						document.getElementById('log').innerHTML = document.getElementById('log').innerHTML + "<div><a href='"+s+"'>"+s+"</a></div>";
					});
			    } else if ((item.kind == 'file') && (item.type.match('^image/'))) {
					var f = item.getAsFile();
					var reader = new FileReader();
					reader.onload = function (event) {
						var file = {
							name: event.target.fileInfo.name,
							size: event.target.fileInfo.size,
							type: event.target.fileInfo.type,
							data: array_chunks(event.target.result.substr(event.target.result.indexOf(',') + 1), 1024*1024)
						};
						sendChunk(file,file.data.length,0);
					}
					reader.fileInfo = {
						name: f.name,
						size: f.size,
						type: f.type
					}
					reader.readAsDataURL(f);
			    }
			}
		}
	},false);
	document.getElementById('inputFile').addEventListener('change', function(e) {
		var target = e.target ? e.target : e.srcElement;
		var files = target.files;
		for(var i=0;i<files.length;i++) {
			var file = files[i],
				reader = new FileReader();
			reader.onload = function (event) {
				var file = {
					name: event.target.fileInfo.name,
					size: event.target.fileInfo.size,
					type: event.target.fileInfo.type,
					data: array_chunks(event.target.result.substr(event.target.result.indexOf(',') + 1), 1024*1024)
				};
				sendChunk(file,file.data.length,0);
			}
			reader.fileInfo = {
				name: file.name,
				size: file.size,
				type: file.type
			}
			reader.readAsDataURL(file);
		}
	});
});
