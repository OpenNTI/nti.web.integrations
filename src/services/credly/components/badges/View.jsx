import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {HOC, Loading, Errors, Button} from '@nti/web-commons';

import AvailableBadges from '../available-badges';

import {BadgesStore, AwardsBadgesStore, AwardedBadgesStore} from './Store';

const {Variant} = HOC;

const t = scoped('integrations.services.credly.components.badges.View', {
	addBadge: '+Add Badge'
});

const Awards = 'awards';
const Awarded = 'awarded';

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
	view: PropTypes.oneOf([Awards, Awarded]),
};
function Badges ({context, view}) {
	const {
		loading,
		error,
		badges,
		totalPages,
		currentPage,
		canAddBadges,
		addBadge
	} = BadgesStore.useValue();

	const [selectOpen, setSelectOpen] = React.useState(false);
	const openSelect = React.useCallback(() => setSelectOpen(true), [setSelectOpen]);
	const closeSelect = React.useCallback(() => setSelectOpen(false), [setSelectOpen]);

	return (
		<>
			<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />}>
				{canAddBadges && (<Button className={styles.addButton} onClick={openSelect}>{t('addBadge')}</Button>)}
				{error && (<Errors.Message error={error} />)}
				{!error && (
					<div>{view}</div>
				)}
			</Loading.Placeholder>
			{selectOpen && (<AvailableBadges.SelectDialog context={context} doClose={closeSelect} onSelect={addBadge} />)}
		</>
	);
}

const Config = {
	deriveBindingFromProps: (props) => props.context
};

export const AwardsBadges = AwardsBadgesStore.WrapCmp(Variant(Badges, {view: Awards}), Config);
export const AwardedBadges = AwardedBadgesStore.WrapCmp(Variant(Badges, {view: Awarded}), Config);
