import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {HOC, Loading, Errors, Button} from '@nti/web-commons';

import AvailableBadges from '../available-badges';
import BadgeGrid from '../BadgeGrid';

import {BadgesStore, AwardsBadgesStore, AwardedBadgesStore} from './Store';
import BadgeWrapper from './BadgeWrapper';

const {WithContainerQuery} = HOC;

const t = scoped('integrations.services.credly.components.badges.View', {
	addBadge: '+Add Badge'
});

const styles = css`
	.add-button:global(.nti-button) {
		background: none;
		color: var(--primary-blue);
		padding-left: 0;
		padding-right: 0;
	}
`;

Badges.propTypes = {
	context: PropTypes.object,
	columns: PropTypes.number,
	emptyState: PropTypes.node
};
function Badges ({context, columns, emptyState}) {
	const {
		loading,
		error,
		badges,
		canAddBadges,
		addBadge
	} = BadgesStore.useMonitor(['loading', 'error', 'badges', 'canAddBadges', 'addBadge']);

	const [selectOpen, setSelectOpen] = React.useState(false);
	const openSelect = React.useCallback(() => setSelectOpen(true), [setSelectOpen]);
	const closeSelect = React.useCallback(() => setSelectOpen(false), [setSelectOpen]);

	const onBadgeAdd = React.useCallback((badge) => addBadge(badge), [addBadge]);
	const isEmpty = badges && badges.length === 0;

	return (
		<>
			<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />}>
				{canAddBadges && (<Button className={styles.addButton} onClick={openSelect}>{t('addBadge')}</Button>)}
				{error && (<Errors.Message error={error} />)}
				{isEmpty && (emptyState || null)}
				{!isEmpty && (
					<BadgeGrid columns={columns}>
						{(badges ?? []).map((badge, key) => (
							<BadgeWrapper key={key} badge={badge} />
						))}
					</BadgeGrid>
				)}
			</Loading.Placeholder>
			{selectOpen && (
				<AvailableBadges.SelectDialog
					context={context}
					selected={badges}
					doClose={closeSelect}
					onSelect={onBadgeAdd}
				/>
			)}
		</>
	);
}

const ColumnQuery = WithContainerQuery((size) =>({
	columns: Math.max(Math.floor(size.width / 140), 1)
}));

const deriveBindingFromProps = (props) => ({context: props.context, readOnly: props.readOnly});

export const AwardsBadges = ColumnQuery(
	AwardsBadgesStore.WrapCmp(Badges, {
		deriveBindingFromProps
	})
);
export const AwardedBadges = ColumnQuery(
	AwardedBadgesStore.WrapCmp(Badges, {
		deriveBindingFromProps: (props) => ({
			...deriveBindingFromProps(props),
			pageSize: props.columns == null ? -1 : props.columns * 2
		})
	})
);

AwardsBadges.hasBadges = AwardsBadgesStore.hasBadges;
AwardedBadges.hasBadges = AwardedBadgesStore.hasBadges;
