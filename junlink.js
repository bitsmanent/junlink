/* JUnlink is a tiny JavaScript utility to handle broken links. */
(function() {
var opts = {
	checkuri: '/checkuri', /* E.g.
	baseurl: '', /* E.g. http://yoursite.com */
};

function $(sel) {
	return document.querySelectorAll(sel);
}

function handle(el) {
	var url = el.getAttribute('href');

	if(url[0] == '/')
		url = opts.baseurl+url;
	
	check(url, function(isup) {
		isup = 0;
		if(isup)
			return;
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

function init() {
	var	elems = $('a[href]'),
		len = elems.length,
		href, tm, n = 0,
	
	tm = setInterval(function() {
		if(n >= len) {
			clearTimeout(tm);
			return;
		}
		href = elems[n].getAttribute('href');
		if(href && href != '#')
			handle(elems[n]);
		++n;
	}, 500);
}

document.addEventListener('DOMContentLoaded', init);
})();
