let ws = null;
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
let cxy = null;
let cz = null;
let min = -1;
let data = [];
let area = [];

let logging = function(log) {};
let speed = false;

function clear() {
	if(ctx1 == null) return;
	ctx1.clearRect(0, 0, cvs1.width, cvs1.height);
}
function frame3d(c, p) {
	if(!speed) {
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
}
function area2d() {
	let w = cvs2.width, h = cvs2.height;
	let ix=0; iy=0;
	let c = 0;
	for(let y=1; y<size[1]; y+=8) {
		ix=0;
		for(let x=1; x<size[0]; x+=8) {
			let c3 = 0, c2 = 0, c9 = 0, c1 = 0;
			for(let cy=0; cy<8; cy+=2) {
				for(let cx=0; cx<8; cx+=2) {
					let cc = '1';
					try { cc = data[y+cy].charAt(x+cx); } catch(e) {}
					if(cc == '2') c2++;
					else if(cc == '3') c3++;
					else if(cc == '9') c9++;
					else if(cc == '1') c1++;
				}
			}
			if(c2 > 0) c = 1;
			else if(c3 > 0) c = 2;
			else if(c1 == 16) c = 0;
			else c = 256 - (c9 + c1) * 4;
			if(area[iy][ix] != c) {
				area[iy][ix] = c;
				ctx2.lineWidth = 1;
				ctx2.beginPath();
				ctx2.moveTo(ix, iy);
				ctx2.lineTo(ix+1, iy);
				ctx2.closePath();
				if(c < 256) {
					if(c == 0) {
						ctx2.strokeStyle = 'rgb(80, 80, 80)';
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
			}
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
	let e = data[y].charAt(x);
	if(e == "0") return true;
	if(e == "2") return true;
	if(e == "3") return true;
	if(e == "9") {
		console.log("9 " + x + ", " + y);
		return true;
	}
	return false;
}
function door(x, y) {
	x += view[0];
	y += view[1];
	e = data[y].charAt(x);
	if(e == "2") return true;
	if(e == "9")
		return false;
	return false;
}
function _for0() {
	let rc = 0;
	if(check(0, -1)) {
		if(door(0, -1)) {
			view[1]--;
			logging("Open door " + view[0] + " " + view[1]);
			ws.send("S:o " + view[0] + " " + view[1]);
			let e = document.getElementById(view[0] + "-" + view[1]);
			e.className = "b0";
			rc++;
		}	
		view[1]--;
		send();
		rc++;
	}
	return rc;
}
function _for6() {
	let rc = 0;
	if(check(0, 1)) {
		if(door(0, 1)) {
			view[1]++;
			logging("Open door " + view[0] + " " + view[1]);
			ws.send("S:o " + view[0] + " " + view[1]);
			let e = document.getElementById(view[0] + "-" + view[1]);
			if(e != null)
				e.className = "b0";
			rc++;
		}
		view[1]++;
		send();
		rc++;
	}
	return rc;
}
function _for3() {
	let rc = 0;
	if(check(1, 0)) {
		if(door(1, 0)) {
			view[0]++;
			logging("Open door " + view[0] + " " + view[1]);
			ws.send("S:o " + view[0] + " " + view[1]);
			let e = document.getElementById(view[0] + "-" + view[1]);
			if(e != null)
				e.className = "b0";
			rc++;
		}
		view[0]++;
		send();
		rc++;
	}
	return rc;
}
function _for9() {
	let rc = 0;
	if(check(-1, 0)) {
		if(door(-1, 0)) {
			view[0]--;
			logging("Open door " + view[0] + " " + view[1]);
			ws.send("S:o " + view[0] + " " + view[1]);
			let e = document.getElementById(view[0] + "-" + view[1]);
			if(e != null)
				e.className = "b0";
			rc++;
		}
		view[0]--;
		send();
		rc++;
	}
	return rc;
}
function _right() {
	view[2] = (view[2] + 3) % 12;
	send();
}
function _left() {
	view[2] = (view[2] + 12 - 3) % 12;
	send();
}

function keydown(event) {
	help += event.key;
	if(help == "h"
	|| help == "he"
	|| help == "hel"
	|| help == "help") ;
	else help = "";
	var code = event.keyCode;
	if (code == 39) { // 右
		_right();
		return;
	}
	if (code == 37) { // 左
		_left();
		return;
	}
	if (code == 38) { // 上
		if(view[2] == 0) { _for0(); return; }
		if(view[2] == 6) { _for6(); return; }
		if(view[2] == 3) { _for3(); return; }
		if(view[2] == 9) { _for9(); return; }
		return;
	}
	if (code == 40) { // 下
		if(view[2] == 6) { _for0(); return; }
		if(view[2] == 0) { _for6(); return; }
		if(view[2] == 9) { _for3(); return; }
		if(view[2] == 3) { _for9(); return; }
	}
	if(help == "help") {
		help = "";
		ws.send("S:" + "r");
	}
}

var band = 9999;
var group = 0;
var addr = "";

function maze9() {
	let url = wspath();
	if(!speed) {
		cvs1 = document.getElementById('maze');
		ctx1 = cvs1.getContext('2d');
	}
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

window.onload = maze9;

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

	logging(msg);

	let v = msg.substr(2).trim().split(" ");
	if(v[0] == "S") {
		data = [];
		size[0] = parseInt(v[1]);
		size[1] = parseInt(v[2]);
		area = [];
		let ix = 0, iy = 0;
		for(let y=1; y<size[1]; y+=8) {
			area[iy] = [];
			ix = 0;
			for(let x=1; x<size[0]; x+=8) {
				area[iy][ix] = -1;
				ix++;
			}
			iy++;
		}
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
		if(cxy != null) {
			e = document.getElementById(cxy);
			if(e != null)
				e.className = "b0";
		}
		cxy = view[0] + "-" + view[1];
		cz = "c" + view[2];
		e = document.getElementById(cxy);
		if(e != null)
			e.className = cz;
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
		if(cxy != null) {
			e = document.getElementById(cxy);
			if(e != null)
				e.className = cz;
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
		//e = document.getElementById(cxy);
		//e.className = cz;
		return;
	}
	if(v[0] == "V") {
		if(v[1] == "E")  {
			VE();
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
		frame3d(parseInt(v[1]), z);
		return;
	}
}

let VE = function() {
}

let show = [-99999999, -99999999];

function view2d() {
	let mx = 79;
	let my = 53;

	if(Math.abs(view[0] - show[0]) > parseInt(mx * 3 / 8)
	|| Math.abs(view[1] - show[1]) > parseInt(my * 3 / 8)) {
		show[0] = view[0];
		show[1] = view[1];
	} else  return;

	area2d();
	let h = "";
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
	if(e.id == "view3")
		ee = document.getElementById("maze");
	if(e.checked) {
		ee.style.display = "";
	} else {
		ee.style.display = "none";
	}
}
