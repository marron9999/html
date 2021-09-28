var github = false;
var post_id = null;
function post_init(id, parent) {
	let host = window.location.hostname;
	if(host.indexOf("github") >= 0) {
		github = true;
		return;
	}
	post_id = id;
	if(parent != undefined)
		parent = document.getElementById(parent);
	else parent = document.body;
	parent.innerHTML +=
	"<hr style='margin-top:30px'>"
	+ "<h3 style='margin-bottom:10px'><span class=white>質問コーナー</span></h3>"
	+"<div style='font-size:14px;margin-left: 10px;margin-top: 10px;'><span class=white>名前：</span><input id=post_name style='padding: 4px 3px;'>&nbsp;&nbsp;<button onclick='post()'>以下を質問する</button><br>"
	+ "<textarea id=post_text rows=5 cols=80 style='resize:none;margin-top:5px;'></textarea><br>"
	+ "<div id=post_log style='margin-top:5px;margin-bottom:10px'></div></div>";
	let v = localStorage.getItem("post_name");
	if(v != null && v != "") {
		document.getElementById("post_name").value = v;
	}
	post_load(post_id);
}

function post() {
	if(github) return;
	let value =  post_id + "\t";
	let n = document.getElementById("post_name");
	n = n.value.trim(); if(n == "") return;
	value += n + "\t";
	let t = document.getElementById("post_text");
	let v = t.value.trim(); if(v == "") return;
	localStorage.setItem("post_name", n);
	value += v.replace(/\n/g, "\\n");
	post_xhr("/app/post", value, function(text) { post_log(text); });
	t.value = "";
}
function post_load(id) {
	if(github) return;
	post_xhr("/app/load", id, function(text) { post_log(text); });
}
function post_xhr(url, data, func) {
	if(github) return;
	data = encodeURIComponent(data);
	const req = new XMLHttpRequest();
	req.onload = function() {
		func(decodeURIComponent(req.responseText));
	}
	req.open("post", url);
	req.setRequestHeader( 'Content-Type', 'text/html' );
	req.send(data);
}
function post_log(text) {
	if(github) return;
	document.getElementById("post_log").innerHTML = "";
	text = text.split("\n");
	for(let i=text.length-1; i>=0; i--) {
		text[i] = text[i].trim();
		if(text[i] == "") continue;
		let t = text[i].indexOf("\t");
		let d = text[i].substr(0, t);
		if(d.charAt(0) == '@') continue;
		t = text[i].indexOf("\t");
		text[i] = text[i].substr(t+1);
		t = text[i].indexOf("\t");
		let u = text[i].substr(0, t);
		text[i] = text[i].substr(t+1).replace(/\\n/g, "\n");
		t = d.replace(/\//g, "").replace(/:/g, "").replace(/ /g, "").replace(/\./g, "");
		document.getElementById("post_log").innerHTML
		+= "<div style='border-top: 1px solid #ccc;' id=" + t + ">"
			+ "<div style='font-size:80%;'>" + d.substr(0, d.lastIndexOf(":")) + " " + u + "</div>"
			+ "<div style='white-space:pre;'>" + text[i] + "</div>"
			+ "</div>";
	}
	for(let i=text.length-1; i>=0; i--) {
		text[i] = text[i].trim();
		if(text[i] == "") continue;
		let t = text[i].indexOf("\t");
		let d = text[i].substr(0, t);
		if(d.charAt(0) != '@') continue;
		t = text[i].indexOf("\t");
		text[i] = text[i].substr(t+1);
		t = text[i].indexOf("\t");
		let u = text[i].substr(0, t);
		text[i] = text[i].substr(t+1).replace(/\\n/g, "\n");
		t = d.replace(/\//g, "").replace(/:/g, "").replace(/ /g, "").replace(/\./g, "");
		document.getElementById(t.substr(1)).innerHTML
			+= "<div style='white-space:pre;color:blue;padding-left:1em;'>" + text[i] + "</div>";
	}
}
function post_dir(func) {
	if(github) return;
	const req = new XMLHttpRequest();
	req.onload = function() {
		func(decodeURIComponent(req.responseText));
	}
	req.open("post", "/app/dir");
	req.setRequestHeader( 'Content-Type', 'text/html' );
	req.send("");
}
function post_get(id, func) {
	if(github) return;
	post_xhr("/app/log", id, func);
}
function post_cmd(cmd, func) {
	if(github) return;
	cmd = encodeURIComponent(cmd);
	const req = new XMLHttpRequest();
	req.onload = function() {
		func(decodeURIComponent(req.responseText));
	}
	req.open("post", "/app/cmd");
	req.setRequestHeader( 'Content-Type', 'text/html' );
	req.send(cmd);
}
