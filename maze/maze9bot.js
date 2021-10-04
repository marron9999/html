let wsec = 10;
let timer = null;
speed = true;

let logc = 0;
logging = function(log) {
	let e = log.substr(0,3);
	if(e == "S:V") return;
	if(e == "S:M") return;
	if(e == "S:R") return;
	if(e == "S:P") return;
	if(e == "S:T") return;
	if(e == "S:Y") return;
	if(e == "S:Y") return;
	if(e == "S:c") return;
	if(e == "S:o") return;
	if(e == "S:v") return;
	if(e == "S:s") return;
	e = document.getElementById("log");
	let h = e.innerHTML
		+ "<div>" + log + "</div>";
	if(logc >= 12) {
		h = h.substr(h.indexOf("</div>")+1+1+3+1);
	}
	e.innerHTML = h;
	logc++;
};

VE = function() {
	//VE = function() { };
	if(timer == null) {
		timer = setTimeout(scan0369, wsec);
	}
}

function check9(x, y) {
	x += view[0];
	y += view[1];
	let e = data[y].charAt(x);
	if(e == "9") {
		return true;
	}
	return false;
}

function unknown() {
	if(check9( 0, -1)) return 0;
	if(check9( 0,  1)) return 6;
	if(check9(-1,  0)) return 9;
	if(check9( 1,  0)) return 3;
	return -1;
}

let pass9 = false;
function pass(x, y) {
	let e = data[y].charAt(x);
	if(e == "0") return true;
	if(e == "2") return true;
	if(e == "3") return true;
	if(e == "9") {
		console.log("9 " + x + ", " + y);
		pass9 = true;
		return true;
	}
	return false;
}

function pass0369(bx, by) {
	let c = "";
	if(pass(bx +  0, by + -1)) c += "0";
	if(pass(bx +  0, by +  1)) c += "6";
	if(pass(bx +  1, by +  0)) c += "3";
	if(pass(bx + -1, by +  0)) c += "9";
	return c;
}

function _right_() {
	view[2] = (view[2] + 3) % 12;
}
function _left_() {
	view[2] = (view[2] + 12 - 3) % 12;
}

function scan0369() {
	timer = null;
	let rc = 0;
	let c = unknown();
	if(c >= 0) {
		logging("Scan " + view[0] + " " + view[1] + " " + c);
		ws.send("S:v " + view[0] + " " + view[1] + " " + c);
		return;
	}
	c = pass0369(view[0], view[1]);
	if(c.length == 1) {
		c = parseInt(c);
		let cc = data[view[1]];
		cc = cc.substr(0, view[0]) + "1" + cc.substr(view[0] + 1);
		data[view[1]] = cc;
		//logging("Build block " + view[0] + " " + view[1]);
		let e = document.getElementById(view[0] + "-" + view[1]);
		if(e != null)
			e.className = "b1";
		ws.send("S:c " + view[0] + " " + view[1]);
		     if(c == 0) { view[1]--; view[2] = 0; }
		else if(c == 6) { view[1]++; view[2] = 6; }
		else if(c == 3) { view[0]++; view[2] = 3; }
		else            { view[0]--; view[2] = 9; }
		cxy = view[0] + "-" + view[1];
		cz = "c" + view[2];
		e = document.getElementById(cxy);
		if(e != null)
			e.className = cz;
		ws.send("S:v " + view[0] + " " + view[1] + " " + view[2]);
		return;
	}
	if(view[2] == 0) {
		     if(check( 1,  0)) { _right_(); rc = _for3(); }
		else if(check( 0, -1)) {
			let bx = view[0];
			let by = view[1] - 1;
			pass9 = false;
			c = pass0369(bx, by);
			while(c == "06") {
				if(pass9) break;
				by--;
				c = pass0369(bx, by);
			}
			if((!pass9) && c == '6') {
				while(by != view[1]) {
					let cc = data[by];
					cc = cc.substr(0, bx) + "1" + cc.substr(bx + 1);
					data[by] = cc;
					let e = document.getElementById(bx + "-" + by);
					if(e != null)
						e.className = "b1";
					ws.send("S:c " + bx + " " + by);
					by++;
				}
				timer = setTimeout(scan0369, wsec);
				return;
			}
			rc = _for0();
		}
		else if(check(-1,  0)) { _left_();  rc = _for9(); }
		return;
	}
	if(view[2] == 6) {
		     if(check(-1, 0)) { _right_(); rc = _for9(); }
		else if(check( 0, 1)) {
			let bx = view[0];
			let by = view[1] + 1;
			pass9 = false;
			c = pass0369(bx, by);
			while(c == "06") {
				if(pass9) break;
				by++;
				c = pass0369(bx, by);
			}
			if((!pass9) && c == '0') {
				while(by != view[1]) {
					let cc = data[by];
					cc = cc.substr(0, bx) + "1" + cc.substr(bx + 1);
					data[by] = cc;
					let e = document.getElementById(bx + "-" + by);
					if(e != null)
						e.className = "b1";
					ws.send("S:c " + bx + " " + by);
					by--;
				}
				timer = setTimeout(scan0369, wsec);
				return;
			}
			rc = _for6();
		}
		else if(check( 1, 0)) { _left_();  rc = _for3(); }
		return;
	}
	if(view[2] == 3) {
		     if(check(0,  1)) { _right_(); rc = _for6(); }
		else if(check(1,  0)) {
			let bx = view[0] + 1;
			let by = view[1];
			pass9 = false;
			c = pass0369(bx, by);
			while(c == "39") {
				if(pass9) break;
				bx++;
				c = pass0369(bx, by);
			}
			if((!pass9) && c == '9') {
				while(bx != view[0]) {
					let cc = data[by];
					cc = cc.substr(0, bx) + "1" + cc.substr(bx + 1);
					data[by] = cc;
					let e = document.getElementById(bx + "-" + by);
					if(e != null)
						e.className = "b1";
					ws.send("S:c " + bx + " " + by);
					bx--;
				}
				timer = setTimeout(scan0369, wsec);
				return;
			}
			rc = _for3();
		}
		else if(check(0, -1)) { _left_();  rc = _for0(); }
		return;
	}
	if(view[2] == 9) {
		     if(check( 0, -1)) { _right_(); rc = _for0(); }
		else if(check(-1,  0)) {
			let bx = view[0] - 1;
			let by = view[1];
			pass9 = false;
			c = pass0369(bx, by);
			while(c == "39") {
				if(pass9) break;
				bx--;
				c = pass0369(bx, by);
			}
			if((!pass9) && c == '3') {
				while(bx != view[0]) {
					let cc = data[by];
					cc = cc.substr(0, bx) + "1" + cc.substr(bx + 1);
					data[by] = cc;
					let e = document.getElementById(bx + "-" + by);
					if(e != null)
						e.className = "b1";
					ws.send("S:c " + bx + " " + by);
					bx++;
				}
				timer = setTimeout(scan0369, wsec);
				return;
			}
			rc = _for9();
		}
		else if(check( 0,  1)) { _left_();  rc = _for6(); }
		return;
	}
}
