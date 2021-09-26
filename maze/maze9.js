let ws = null;
const wait = 1000;
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
let cvs1 = null;
let ctx1 = null;
let cvs2 = null;
let ctx2 = null;

let help = "";
let fin = 0;
let size = [-1, -1];
let goal = [-1, -1];
let view = [-1, -1, -1];
let see = {"0": "▲", "3":"▶", "6":"▼", "9":"◀"};
let xy = null;
let _z = null;
let min = -1;
let data = [];

function clear() {
	ctx1.clearRect(0, 0, cvs1.width, cvs1.height);
}
function draw(c, p) {
	ctx1.lineWidth = 1;	
	ctx1.beginPath();
	ctx1.moveTo(10+p[0][0],5+p[0][1]);
	for(let i=1; i<p.length; i++) {
		ctx1.lineTo(10+p[i][0],5+p[i][1]);
	}
	ctx1.lineTo(10+p[0][0],5+p[0][1]);
	ctx1.closePath();
	if(c == 2) ctx1.fillStyle = 'rgb(255, 255, 192)';
	else if(c == 3) ctx1.fillStyle = 'rgb(255, 192, 192)';
	else if(c == 0) ctx1.fillStyle = 'rgb(192, 255, 255)';
	else ctx1.fillStyle = 'rgb(192, 192, 192)';
	ctx1.fill();
	ctx1.strokeStyle = 'black';	
	ctx1.stroke();
}
function draw2d() {
	let w = cvs2.width, h = cvs2.height;
	let ix=0; iy=0;
	let c = 0;
	for(let y=1; y<size[1]; y+=8) {
		ix=0;
		for(let x=1; x<size[0]; x+=8) {
			let c3 = 0, c2 = 0, c9 = 0;
			for(let cy=0; cy<8; cy+=2) {
				for(let cx=0; cx<8; cx+=2) {
					let cc = '1';
					try { cc = data[y+cy].charAt(x+cx); } catch(e) {}
					if(cc == '2') c2++;
					else if(cc == '3') c3++;
					else if(cc == '9') c9++;
				}
			}
			if(c2 > 0) c = 1;
			else if(c3 > 0) c = 2;
			else if(c9 == 16) c = 0;
			else c = 256 - (16 - c9) * 4;
			ctx2.lineWidth = 1;
			ctx2.beginPath();
			ctx2.moveTo(ix, iy);
			ctx2.lineTo(ix+1, iy);
			ctx2.closePath();
			if(c < 256) {
				if(c == 0) {
					ctx2.strokeStyle = 'rgb(160, 160, 160)';
				} else if(c == 1) {
					ctx2.strokeStyle = 'rgb(255,255,0)';
				} else if(c == 2) {
					ctx2.strokeStyle = 'rgb(255,0,0)';
				} else {
					ctx2.strokeStyle = 'rgb('+c+','+c+','+c+')';
				}
			} else {
				ctx2.strokeStyle = 'rgb(255,255,255)';
			}
			ctx2.stroke();
			ix++;
		}
		iy++;
	}
}

function info() {
	let e = document.getElementById("info1");
	e.innerHTML = "Size " + size[0] + "x" + size[1];
	e = document.getElementById("info2");
	if(fin) e.innerHTML = "[Goal] " + goal[0] + "," + goal[1];
	else e.innerHTML =  "Goal " + goal[0] + "," + goal[1];
	e = document.getElementById("info3");
	e.innerHTML = "Locate " + view[0] + "," + view[1] + " " + see[""+view[2]];
}
function info3() {
	min++;
	let h = "0" + parseInt(min / 60);
	let m = "0" + (min % 60);
	h = h.substr(h.length - 2);
	m = m.substr(m.length - 2);
	let e = document.getElementById("info4");
	e.innerHTML = "Time: " + h + ":" + m;
	setTimeout(info3, 60 * 1000);
}
function send() {
	if(view[0] <= 0) view[0] = 1;
	if(view[1] <= 0) view[1] = 1;
	if(view[0] >= size[0]+size[0]) view[0] = size[0]+size[0]-1;
	if(view[1] >= size[1]+size[1]) view[1] = size[1]+size[1]-1;
	if(view[0] == goal[0]
		&& view[1] == goal[1]) {
		fin = 1;
		ws.send("S:" + "r");
	}
	ws.send("S:" + "v " + view[0] + " " + view[1] + " " + view[2]);
}
function check(x, y) {
	x += view[0];
	y += view[1];
	let e = document.getElementById(x + "-" + y);
	if(e.className.indexOf('b0') >= 0) return true;
	if(e.className.indexOf('b2') >= 0) return true;
	if(e.className.indexOf('b3') >= 0) return true;
	if(e.className.indexOf('z0') >= 0) return true;
	if(e.className.indexOf('z2') >= 0) return true;
	if(e.className.indexOf('z3') >= 0) return true;
	return false;
}
function door(x, y) {
	x += view[0];
	y += view[1];
	let e = document.getElementById(x + "-" + y);
	if(e.className.indexOf('b2') >= 0) return true;
	if(e.className.indexOf('z2') >= 0) return true;
	return false;
}
function keydown(event){
	help += event.key;
	if(help == "h"
	|| help == "he"
	|| help == "hel"
	|| help == "help") ;
	else help = "";
	var code = event.keyCode;
	if (code == 39) { // 右
		view[2] = (view[2] + 3) % 12;
		send();
		return;
	}
	if (code == 37) { // 左
		view[2] = (view[2] + 12 - 3) % 12;
		send();
		return;
	}
	if (code == 38) { // 上
		if(view[2] == 0) {
			if(check(0, -1)) {
				if(door(0, -1)) {
					view[1]--;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}	
				view[1]--;
				send();
			}
			return;
		}
		if(view[2] == 6) {
			if(check(0, 1)) {
				if(door(0, 1)) {
					view[1]++;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[1]++;
				send();
				return;
			}
		}
		if(view[2] == 3) {
			if(check(1, 0)) {
				if(door(1, 0)) {
					view[0]++;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[0]++;
				send();
			}
			return;
		}
		if(view[2] == 9) {
			if(check(-1, 0)) {
				if(door(-1, 0)) {
					view[0]--;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[0]--;
				send();
			}
			return;
		}
		return;
	}
	if (code == 40) { // 下
		if(view[2] == 6) {
			if(check(0, -1)) {
				if(door(0, -1)) {
					view[1]--;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}	
				view[1]--;
				send();
			}
			return;
		}
		if(view[2] == 0) {
			if(check(0, 1)) {
				if(door(0, 1)) {
					view[1]++;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[1]++;
				send();
				return;
			}
		}
		if(view[2] == 9) {
			if(check(1, 0)) {
				if(door(1, 0)) {
					view[0]++;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[0]++;
				send();
			}
			return;
		}
		if(view[2] == 6) {
			if(check(-1, 0)) {
				if(door(-1, 0)) {
					view[0]--;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[0]--;
				send();
			}
			return;
		}
		return;
	}
	if(help == "help") {
		help = "";
		ws.send("S:" + "r");
	}
}

var band = 9999;
var group = 0;
var addr = "";

window.onload = function() {
	let url = wspath();
	cvs1 = document.getElementById('maze');
	ctx1 = cvs1.getContext('2d');
	cvs2 = document.getElementById('maze2');
	ctx2 = cvs2.getContext('2d');
	clear();
	ws = new WebSocket(url);
	ws.onopen = function() {
		//ws.send("S:" + "c " + size[0] + " " + size[1]); 
		ws.send("band " + band); 
		ws.send("group " + group); 
		ws.send("S:" + "s"); 
		window.addEventListener("keydown", keydown);
	};
	ws.onclose = function() {
		let e = document.getElementById("info1");
		e.innerHTML = "[Close] " + e.innerHTML;
		try {
			window.removeEventListener("keydown");
		} catch(e) {
			// NONE
		}
	};
	ws.onmessage = message;
};

function message(msg) {
	msg = msg.data;
	if(msg.indexOf("title") == 0) {
		let p = msg.indexOf(" ");
		addr = msg.substr(p+1).trim();
		document.title = addr;
		p = addr.indexOf(" ");
		addr = addr.substr(0, p);
		return;
	}
	if(msg.indexOf("users") == 0) {

		return;
	}
	if(msg.indexOf("S:") != 0) return;
	let v = msg.substr(2).trim().split(" ");
	if(v[0] == "S") {
		data = [];
		size[0] = parseInt(v[1]);
		size[1] = parseInt(v[2]);
		info();
		info3();
		return;
	}
	if(v[0] == "G") {
		goal[0] = parseInt(v[1]);
		goal[1] = parseInt(v[2]);
		info();
		let e = document.getElementById(goal[0] + "-" + goal[1]);
		if(e != null) {
			e.className = "b3";
		}
		return;
	}
	if(v[0] == "P") {
		if(v[1] == "E")  {
			return;
		}
		if(v[1] == "B")  {
			let es = document.getElementsByClassName("cx");
			for(let i=0; i<es.length; i++) {
				es[i].className = es[i].className.replace("cx", "").trim();
			}
			return;
		}
		let x = parseInt(v[1]);
		let y = parseInt(v[2]);
		if(x != view[0]
		|| y != view[1]) {
			let e = document.getElementById(x + "-" + y);
			if(e != null) {
				if(e.className.indexOf("cx") < 0)
					e.className += " cx";
			}
		}
		return;
	}
	if(v[0] == "Y") {
		view[0] = parseInt(v[1]);
		view[1] = parseInt(v[2]);
		view[2] = parseInt(v[3]);
		info();
		view2d();
		let e;
		if(xy != null) {
			e = document.getElementById(xy);
			e.className = "b0";
		}
		xy = view[0] + "-" + view[1];
		_z = "c" + view[2];
		e = document.getElementById(xy);
		if(e != null) {
			e.className = _z;
		}
		return;
	}
	if(v[0] == "T") {
		let x = parseInt(v[1]);
		let y = parseInt(v[2]);
		let z = parseInt(v[3]);
		let e = null;
		while(v[4] != "") {
			let c = v[4].charAt(0);
			let cc = data[y];
			cc = cc.substr(0, x) + c + cc.substr(x + 1);
			data[y] = cc;
			let e = document.getElementById(x + "-" + y);
			if(e != null) {
				e.className = "b" + v[4].charAt(0);
			}
			if(z==0) y--;
			else if(z==3) x++;
			else if(z==6) y++;
			else x--;
			v[4] = v[4].substr(1);
		}
		info();
		if(xy != null) {
			e = document.getElementById(xy);
			e.className = _z;
		}
		return;
	}
	if(v[0] == "M"
	|| v[0] == "R") {
		let y = parseInt(v[1]);
		data[y] = v[2];
		let x = 0;
		let e = null;
		while(v[2] != "") {
			let c = v[2].charAt(0);
			if(c != '9') {
				e = document.getElementById(x + "-" + y);
				if(e != null) {
					if(e.className == null
					|| e.className == "")
						e.className = ((v[0] == "M")? "b":"z") + c;
				}
			}
			x++;
			v[2] = v[2].substr(1);
		}
		//e = document.getElementById(xy);
		//e.className = _z;
		return;
	}
	if(v[0] == "V") {
		if(v[1] == "E")  {
			return;
		}
		if(v[1] == "B")  {
			clear();
			return;
		}
		let z = [];
		let i = 2;
		while(i < v.length) {
			z.push([parseInt(v[i]), parseInt(v[i+1])]);
			i+=2;
		}
		draw(parseInt(v[1]), z);
		return;
	}
}

function view2d() {
	draw2d();
	let h = "";
	let mx = 79;
	let my = 53;
	let cy = 0;
	let sx = 0;
	let sy = 0;
	if(view[0] >= 0) {
		sx = view[0] - parseInt(mx / 2);
		sy = view[1] - parseInt(my / 2);
		if(sx < 0) sx = 0;
		if(sy < 0) sy = 0;
		let e = document.getElementById("maze1");
		e.style.left = (parseInt(sx/8) + 2) + "px";
		e.style.top = (parseInt(sy/8) + 2) + "px";
	}
	for(let y=sy; y<size[1]; y++) {
		let cx = 0;
		for(let x=sx; x<size[0]; x++) {
			let c = data[y].charAt(x);
			if(c != '9') {
				c = " class=b" + c;
			} else c = "";
			h += "<span id=" + x + "-" + y + c + "></span>";
			cx++;
			if(cx >= mx) break;
		}
		h += "</br>";
		cy++;
		if(cy >= my) break;
	}
	let e = document.getElementById("map");
	e.innerHTML = h;
	e = document.getElementById(goal[0] + "-" + goal[1]);
	if(e != null) {
		e.className = "b3";
	}
}

function mode(e) {
	let ee = document.getElementById("map");
	if(e.id == "view3") ee = document.getElementById("maze");
	if(e.checked) {
		ee.style.display = "";
	} else {
		ee.style.display = "none";
	}
}
