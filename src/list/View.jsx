import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {
	Hooks,
	Loading,
	HOC,
	Text as BaseText,
	Errors,
	EmptyState,
	Icons
} from '@nti/web-commons';

import {resolveServices} from '../services';

import Styles from './View.css';

const {Variant} = HOC;
const {useResolver} = Hooks;
const {isPending, isResolved, isErrored} = useResolver;

const t = scoped('integrations.list.View', {
	title: 'Connect with Your Other Services Today!',
	empty: 'No integrations have been setup.',

	available: {
		title: 'Available'
	},

	upgrades: {
		title: 'Upgrades and Add-Ons'
	},

	comingSoon: {
		title: 'Coming Soon',
		description: 'We are always looking to grow our list of integrations and ultimately improve your workflow. <br />Have a suggestion? Contact <a href="mailto:integrations@nextthought.com&subject=New%20Integration">integrations@nextthought.com</a> to see about adding it.'
	}
});

const Text = BaseText.Translator(t);

const SectionHeader = Variant('div', {className: Styles.sectionHeader}, 'Section Header');
const SectionTitle = Variant(Text.Base, {className: Styles.sectionTitle}, 'Section Title');
const SectionDescription = Variant(Text.Base, {className: Styles.sectionDescription, as: 'p'}, 'Section Description');

const GroupHeader = Variant('div', {className: Styles.groupHeader}, 'Group Header');
const GroupTitle = Variant(Text.Base, {className: Styles.groupTitle, as: 'h3'}, 'Group Title');

const isAvailable = (s) => s.isEnabled() || s.canConnect();
const isComingSoon = (s) => s.comingSoon;
const isUpgrade = (s) => !isAvailable(s) && !isComingSoon(s);

IntegrationsList.propTypes = {
	context: PropTypes.object
};
export default function IntegrationsList ({context}) {
	const resolver = useResolver(() => resolveServices(context), [context]);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const services = isResolved(resolver) ? resolver : null;

	const empty = !error && (services || []).length === 0;
	const {available, upgrades, comingSoon} = React.useMemo(() => (
		(services || []).reduce((acc, s) => {
			if (isAvailable(s)) { acc.available.push(s); }
			else if (isComingSoon(s)) { acc.comingSoon.push(s); }
			else if (isUpgrade(s)) { acc.upgrades.push(s); }

			return acc;
		}, {available: [], upgrades: [], comingSoon: []})
	), [services]);

	return (
		<div className={Styles.integrationsList}>
			<SectionHeader>
				<SectionTitle localeKey="title" as="h1" />
			</SectionHeader>
			<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />}>
				{error && (<Errors.Message className={Styles.error} error={error} />)}
				{empty && (<EmptyState header={t('empty')} />)}
				{available.length > 0 && (
					<section>
						<GroupHeader>
							<GroupTitle localeKey="available.title" />
						</GroupHeader>
					</section>
				)}
				{upgrades.length > 0 && (
					<section>
						<GroupHeader>
							<GroupTitle localeKey="upgrades.title" />
							<Icons.Lock />
						</GroupHeader>
					</section>
				)}
				{comingSoon.length > 0 && (
					<section>
						<SectionHeader>
							<SectionTitle localeKey="comingSoon.title" />
							<SectionDescription localeKey="comingSoon.description" />
						</SectionHeader>
					</section>
				)}
			</Loading.Placeholder>
		</div>
	);
}
