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

function check0369() {
	let c = "";
	if(check( 0, -1)) c += "0";
	if(check( 0,  1)) c += "6";
	if(check(-1,  0)) c += "9";
	if(check( 1,  0)) c += "3";
	if(c.length == 1) return parseInt(c);
	return -1;
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
	c = check0369();
	if(c >= 0) {
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
		timeer = setTimeout(scan0369, wsec);
		return;
	}
	if(view[2] == 0) {
		     if(check( 1,  0)) { _right(); rc = _for3(); }
		else if(check( 0, -1)) {           rc = _for0(); }
		else if(check(-1,  0)) { _left();  rc = _for9(); }
		return;
	}
	if(view[2] == 6) {
		     if(check(-1, 0)) { _right(); rc = _for9(); }
		else if(check( 0, 1)) {           rc = _for6(); }
		else if(check( 1, 0)) { _left();  rc = _for3(); }
		return;
	}
	if(view[2] == 3) {
		     if(check(0,  1)) { _right(); rc = _for6(); }
		else if(check(1,  0)) {           rc = _for3(); }
		else if(check(0, -1)) { _left();  rc = _for0(); }
		return;
	}
	if(view[2] == 9) {
		     if(check( 0, -1)) { _right(); rc = _for0(); }
		else if(check(-1,  0)) {           rc = _for9(); }
		else if(check( 0,  1)) { _left();  rc = _for6(); }
		return;
	}
}
