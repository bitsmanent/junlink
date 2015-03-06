/* JUnlink is a tiny JavaScript utility to handle broken links. */
/* XXX should we use a worker? */
(function() {
var opts = {
	checkuri: '/checkuri',
	baseurl: 'http://localhost',
	classchecked: 'junlink-checked',
	classbroken: 'junlink-broken'
};
var xhrpend = 0; /* Are there pending XHRs? */

function $(sel) {
	return document.querySelectorAll(sel);
}

function handle(el) {
	var url = el.getAttribute('href');
	if(url[0] == '/')
		url = opts.baseurl+url;
	check(url, function(isup) {
		el.classList.add(opts.classchecked);
		if(isup == 1)
			return;
		el.classList.add(opts.classbroken);
		el.onclick = function(ev) {
			ev.preventDefault();
		};
	});
}

function check(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', opts.checkuri+'?check='+url, true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4)
			callback(xhr.response);
	};
	xhr.send(null);
}

function trackxhr() {
	var xhrsend = XMLHttpRequest.prototype.send;
	XMLHttpRequest.prototype.send = function() {
		var onready = this.onreadystatechange;
		++xhrpend;
		this.onreadystatechange = function() {
			if(this.readyState == 4)
				--xhrpend;
			if(onready)
				onready.apply(this, arguments);
		};
		xhrsend.apply(this, arguments);
	};
}

function run() {
	var	elems = $('a[href]:not(.'+opts.scannedclass+')'),
		len = elems.length,
		href, tm, n = 0;
	tm = setInterval(function() {
		if(xhrpend)
			return;
		if(n >= len) {
			clearTimeout(tm);
			run();
			return;
		}
		href = elems[n].getAttribute('href');
		if(href && href != '#')
			handle(elems[n]);
		++n;
	}, 550);
}

function main() {
	trackxhr();
	run();
}

document.addEventListener('DOMContentLoaded', main);
})();
