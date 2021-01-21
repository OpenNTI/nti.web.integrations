import React from 'react';
import PropTypes from 'prop-types';
import {HOC, Loading, Errors} from '@nti/web-commons';

import {BadgesStore, AwardsBadgesStore, AwardedBadgesStore} from './Store';

const {Variant} = HOC;

const Awards = 'awards';
const Awarded = 'awarded';

Badges.propTypes = {
	view: PropTypes.oneOf([Awards, Awarded]),
	Store: PropTypes.shape({
		useValue: PropTypes.func
	})
};
function Badges ({view, Store}) {
	const {loading, error, badges, totalPages, currentPage} = BadgesStore.useValue();

	return (
		<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />}>
			{error && (<Errors.Message error={error} />)}
			{}
		</Loading.Placeholder>
	);
}

export const AwardsBadges = AwardsBadgesStore.WrapCmp(Variant(Badges, {view: Awards}));
export const AwardedBadges = AwardedBadgesStore.WrapCmp(Variant(Badges, {view: Awarded}));
