import {getConfig} from '@nti/web-client';
import {URL} from '@nti/lib-commons';

const LoginRelBlackList = {
	'logon.forgot.passcode': true,
	'logon.forgot.username': true,
	'logon.handshake': true,
	'logon.reset.passcode': true,
	'logon.ping': true,
	'logon.nti.password': true
};

const isLoginRel = RegExp.prototype.test.bind(/^login\./);

export const isFontevaSSORel = (rel) => rel === 'logon.salesforce';
export const isGoogleSSORel = (rel) => rel === 'logon.google';
export const isGrowthZoneSSORel = (rel) => rel === 'logon.growthzone';
export const isIMISSSORel = RegExp.prototype.test.bind(/^login\..*\.imis$/);
export const isSalesForceSSOREl = (rel) => rel === 'logon.salesforce';
export const isYourMembershipSSORel = (rel) => rel === 'logon.your.membership';

export const isEnterpriseSSO = (rel) => (
	isLoginRel(rel) &&
	!LoginRelBlackList[rel] &&
	!isGoogleSSORel(rel) &&
	!isGrowthZoneSSORel(rel) &&
	!isIMISSSORel(rel) &&
	!isSalesForceSSOREl(rel) &&
	!isYourMembershipSSORel(rel)
);

export async function getSSOLoginRels () {
	const server = getConfig('server');

	const response = await fetch(URL.resolve(server, 'logon.ping'), {
		method: 'GET',
		credentials: 'omit',
		headers: {
			accept: 'application/json'
		}
	});

	const data = await response.text();
	const json = JSON.parse(data);

	return json.Links
		.map(l => l.rel)
		.filter(r => isLoginRel(r) && !LoginRelBlackList[r]);
}
