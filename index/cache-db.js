const db = {
	enable: true,
	log: function(v) {
		//console.log(v);
	},
	db: null,
	name: null,
	close : function() {
		this.db.close();
		this.db = null;
	},
	open : function(name, succ, fail) {
		this.name = name;
		let idb = window.indexedDB;
		let request = idb.open(name,1);
		request.onsuccess = function (event) {
			this.log("Success creating/accessing \"" + name + "\"");
			this.db = event.target.result;
			this.db.onerror = function (event) {
					this.log("Error accessing database");
			}.bind(this);
			succ();
		}.bind(this);
		request.onerror = function (event) {
			this.log("Error accessing \"" + name + "\"");
			if(fail != undefined)
				fail();
		}.bind(this);
		request.onupgradeneeded = function(event){
			let db = event.target.result;
			db.createObjectStore(name, {keyPath : 'id'})
		}.bind(this);
	},
	delete : function (id) {
		this.log("Delete id:\"" + id + "\"");
		let tran = this.db.transaction(this.name, "readwrite");
		store.delete(id);
	},
	put : function (id, data) {
		this.log("Put id:\"" + id + "\"");
		let tran = this.db.transaction(this.name, "readwrite");
		let store = tran.objectStore(this.name);
		data.id = id;
		store.put(data);
	},
	get : function (id, succ, fail) {
		this.log("Gut id:\"" + id + "\"");
		this.getting = true;
		let tran = this.db.transaction([this.name], "readwrite");
		let store = tran.objectStore(this.name);
		let request = store.get(id);
		request.onsuccess = function (event) {
			succ(event.target.result);
		}.bind(this);
		request.onerror = function (event) {
			this.log("Error accessing id:\"" + id + "\"");
			if(fail != undefined)
				fail();
		}.bind(this);
	},

	ids : function(base, sec) {
		let list = localStorage.getItem(base + "." + sec);
		if(list == null || list == "") list = [];
		else list = JSON.parse(list);
		return list;
	},
	info : function(base, id, mode) {
		let v = localStorage.getItem(base + "." + id);
		if(v == null || v == "") v = {};
		else v = JSON.parse(v);
		if(mode) {
			let date = this.today();
			let p = v.time.indexOf(".");
			if(p >= 0) v.time = v.time.substr(0, p);
			if(v.date == date.date) {
				v.date = "";
			} else {
				p = v.time.lastIndexOf(":");
				if(p >= 0) v.time = v.time.substr(0, p);
			}
			//p = v.date.indexOf("/");
			//if(p >= 0) v.date = v.date.substr(p+1);
		}
		return v;
	},
	infos : function(base, sec, mode) {
		let list = this.ids(base, sec);
		for(let i=0; i<list.length; i++) {
			let v = this.info(base, list[i], mode);
			list[i] = v;
		}
		return list;
	},
	today : function () {
		let date = new Date();
		let f = function(v, n) { v = "000" + v; return v.substr(v.length - n); };
		let time = f(date.getHours(), 2)
			+ ":" + f(date.getMinutes(), 2)
			+ ":" + f(date.getSeconds(), 2)
			+ "." + f(date.getMilliseconds(), 3);
		date = f(date.getFullYear(), 4)
			+ "/" + f(date.getMonth()+1, 2)
			+ "/" + f(date.getDate(), 2);
		return {"date":date, "time":time };
	}
};

//export { db };
