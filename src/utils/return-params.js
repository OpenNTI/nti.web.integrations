import { getHistory } from '@nti/web-routing';

export function addToURL(href, params) {
	if (!href || !params) {
		return href;
	}

	const url = new URL(href);

	for (let [name, value] of Object.entries(params)) {
		url.searchParams.set(name, value);
	}

	return url.toString();
}

export function get() {
	const { href } = global.location || {};
	const url = href ? new URL(href) : null;

	return url?.searchParams;
}

export function clear() {
	const history = getHistory();

	history.replace({ ...history.location, search: '' });
}
