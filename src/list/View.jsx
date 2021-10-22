import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import {
	Hooks,
	Loading,
	HOC,
	Text as BaseText,
	Errors,
	EmptyState,
	List,
	Prompt,
} from '@nti/web-commons';
import { Icons, useChanges } from '@nti/web-core';

import { resolveServices, getNameFor, getWindowFor } from '../services';
import { ReturnParams } from '../utils';

import styles from './Styles.css';
import Item from './Item';

const { Variant } = HOC;
const { useResolver } = Hooks;
const { isPending, isResolved, isErrored } = useResolver;

const t = scoped('integrations.list.View', {
	title: 'Connect with Your Other Services Today!',
	empty: 'No integrations have been setup.',

	available: {
		title: 'Available',
	},

	upgrades: {
		title: 'Upgrades and Add-Ons',
	},

	comingSoon: {
		title: 'Coming Soon',
		description:
			'We are always looking to grow our list of integrations and ultimately improve your workflow.<br />Have a suggestion? Contact <a href="mailto:integrations@nextthought.com?subject=New%%20Integration">integrations@nextthought.com</a> to see about adding it.',
	},
});

const Text = BaseText.Translator(t);

const SectionHeader = Variant(
	'div',
	{ className: styles.sectionHeader },
	'Section Header'
);
const SectionTitle = Variant(
	Text.Base,
	{ className: styles.sectionTitle },
	'Section Title'
);
const SectionDescription = Variant(
	Text.Base,
	{ className: styles.sectionDescription, as: 'p' },
	'Section Description'
);

const GroupHeader = Variant(
	'div',
	{ className: styles.groupHeader },
	'Group Header'
);
const GroupTitle = Variant(
	Text.Base,
	{ className: styles.groupTitle, as: 'h3' },
	'Group Title'
);

const ItemList = Variant(
	List.Unadorned,
	{ className: styles.list },
	'Integration List'
);

const isAvailable = s => s.isConnected() || s.canConnect();
const isComingSoon = s => s.comingSoon;
const isUpgrade = s => !isAvailable(s) && !isComingSoon(s);

const renderItem = (s, setSelected) => (
	<li key={s.name}>
		<Item service={s} onClick={() => setSelected(s.name)} />
	</li>
);

IntegrationsList.propTypes = {
	context: PropTypes.object,
};
export default function IntegrationsList({ context }) {
	const [selected, setSelected] = useState(null);

	const resolver = useResolver(() => resolveServices(context), [context]);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const services = isResolved(resolver) ? resolver : null;

	useChanges(services);

	const { list } = services ?? {};

	useEffect(() => {
		const params = ReturnParams.get();

		if (params) {
			setSelected(params.get('service'));
		}
	}, []);

	const selectedService =
		selected && (list || []).find(s => s.name === selected);
	const Window = selectedService && getWindowFor(selectedService);

	const empty = !error && (list || []).length === 0;
	const { available, upgrades, comingSoon } = useMemo(
		() =>
			(list || [])
				.sort((a, b) => {
					const aName = getNameFor(a);
					const bName = getNameFor(b);

					return aName < bName ? -1 : aName === bName ? 0 : 1;
				})
				.reduce(
					(acc, s) => {
						if (isAvailable(s)) {
							acc.available.push(s);
						} else if (isComingSoon(s)) {
							acc.comingSoon.push(s);
						} else if (isUpgrade(s)) {
							acc.upgrades.push(s);
						}

						return acc;
					},
					{ available: [], upgrades: [], comingSoon: [] }
				),
		[list]
	);

	return (
		<div className={styles.integrationsList}>
			<SectionHeader>
				<SectionTitle localeKey="title" as="h1" />
			</SectionHeader>
			<Loading.Placeholder
				loading={loading}
				fallback={<Loading.Spinner.Large />}
			>
				{error && (
					<Errors.Message className={styles.error} error={error} />
				)}
				{empty && <EmptyState header={t('empty')} />}
				{available.length > 0 && (
					<section>
						<GroupHeader>
							<GroupTitle localeKey="available.title" />
						</GroupHeader>
						<ItemList>
							{available.map(s => renderItem(s, setSelected))}
						</ItemList>
					</section>
				)}
				{upgrades.length > 0 && (
					<section>
						<GroupHeader>
							<GroupTitle localeKey="upgrades.title" />
							<Icons.Lock />
						</GroupHeader>
						<ItemList>
							{upgrades.map(s => renderItem(s, setSelected))}
						</ItemList>
					</section>
				)}
				{comingSoon.length > 0 && (
					<section>
						<SectionHeader>
							<SectionTitle localeKey="comingSoon.title" />
							<SectionDescription localeKey="comingSoon.description" />
						</SectionHeader>
						<ItemList>
							{comingSoon.map(s => renderItem(s, setSelected))}
						</ItemList>
					</section>
				)}
			</Loading.Placeholder>
			{Window && (
				<Prompt.Dialog>
					<Window
						service={selectedService}
						doClose={() => (
							ReturnParams.clear(), setSelected(null)
						)}
					/>
				</Prompt.Dialog>
			)}
		</div>
	);
}
