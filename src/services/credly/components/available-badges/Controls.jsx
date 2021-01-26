import React from 'react';
import {scoped} from '@nti/lib-locale';
import {Text} from '@nti/web-commons';

import Store from './Store';

const t = scoped('integrations.services.credly.components.available-badges.Controls', {
	issuedBy: 'Issued By:'
});

const styles = css`
	.controls {
		display: flex;
		flex-direction: row;
		padding: var(--side-padding, 1rem);
	}

	.org-label {
		display: block;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		color: var(--tertiary-grey);
	}
`;

export default function AvailableBadgesHeader () {
	const {integration} = Store.useValue();

	const {organization} = integration ?? {};

	return (
		<>
			<div className={styles.controls}>
				<div className={styles.org}>
					{organization && (<Text.Base className={styles.orgLabel}>{t('issuedBy')}</Text.Base>)}
					{organization && (
						<Text.Base>{organization.name}</Text.Base>
					)}
				</div>
			</div>
		</>
	);
}
