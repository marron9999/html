let wsec = 500;
view3d = false;

VE = function() {
	VE = function() { };
	setTimeout(scan0369, wsec);
}

function check9(x, y) {
	x += view[0];
	y += view[1];
	let e = data[y][x];
	if(e == 9) {
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
	let rc = 0;
	let sec = wsec;
	let c = unknown();
	if(c >= 0) {
		console.log("v " + view[0] + ", " + view[1]);
		ws.send("S:" + "v " + view[0] + " " + view[1] + " " + c);
		setTimeout(scan0369, 1000);
		return;
	}
	c = check0369();
	if(c >= 0) {
		data[view[1]][view[0]] = 1;
		console.log("c " + view[0] + ", " + view[1]);
		let e = document.getElementById(view[0] + "-" + view[1]);
		e.className = "b1";
		ws.send("S:" + "c " + view[0] + " " + view[1]);
		     if(c == 0) { view[1]--; view[2] = 0; }
		else if(c == 6) { view[1]++; view[2] = 6; }
		else if(c == 3) { view[0]++; view[2] = 3; }
		else            { view[0]--; view[2] = 9; }
		cxy = view[0] + "-" + view[1];
		cz = "c" + view[2];
		e = document.getElementById(cxy);
		e.className = cz;
		setTimeout(scan0369, wsec);
		return;
	}
	if(view[2] == 0) {
		     if(check( 1,  0)) { _right(); rc = _for3(); }
		else if(check( 0, -1)) {           rc = _for0(); }
		else if(check(-1,  0)) { _left();  rc = _for9(); }
		if(rc == 2) 
			sec = 1000;
		setTimeout(scan0369, sec);
		return;
	}
	if(view[2] == 6) {
		     if(check(-1, 0)) { _right(); rc = _for9(); }
		else if(check( 0, 1)) {           rc = _for6(); }
		else if(check( 1, 0)) { _left();  rc = _for3(); }
		if(rc == 2) 
			sec = 1000;
		setTimeout(scan0369, sec);
		return;
	}
	if(view[2] == 3) {
		     if(check(0,  1)) { _right(); rc = _for6(); }
		else if(check(1,  0)) {           rc = _for3(); }
		else if(check(0, -1)) { _left();  rc = _for0(); }
		if(rc == 2) 
			sec = 1000;
		setTimeout(scan0369, sec);
		return;
	}
	if(view[2] == 9) {
		     if(check( 0, -1)) { _right(); rc = _for0(); }
		else if(check(-1,  0)) {           rc = _for9(); }
		else if(check( 0,  1)) { _left();  rc = _for6(); }
		if(rc == 2) 
			sec = 1000;
		setTimeout(scan0369, sec);
		return;
	}
}
