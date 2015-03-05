/* JUnlink is a tiny JavaScript utility to handle broken links. */
/* XXX should we use a worker? */
(function() {
var opts = {
	checkuri: '/checkuri',
	baseurl: 'http://localhost',
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
		if(isup)
			return;
		console.log(url);
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
		xhrpend = 1;
		this.onreadystatechange = function() {
			if(this.readyState == 4)
				xhrpend = 0;
			if(onready)
				onready.apply(this, arguments);
		};
		xhrsend.apply(this, arguments);
	};
}

function run() {
	var	elems = $('a[href]:not([href="#"])'),
		len = elems.length,
		href, tm, n = 0,
	tm = setInterval(function() {
		if(xhrpend) {
			console.log('skip this cycle, retrying...');
			return;
		}
		if(n >= len) {
			clearTimeout(tm);
			return;
		}
		href = elems[n].getAttribute('href');
		if(href && href != '#')
			handle(elems[n]);
		++n;
	}, 560);
}

function main() {
	trackxhr();
	run();
}

document.addEventListener('DOMContentLoaded', main);
})();
