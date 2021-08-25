import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Errors, Text, Loading, Icons } from '@nti/web-commons';
import { Button } from "@nti/web-core";

import BadgeDetails from '../BadgeDetails';

const t = scoped(
	'integrations.services.credly.components.available-badges.Details',
	{
		add: 'Add Badge',
		selected: 'Selected',
	}
);

const styles = stylesheet`
	.details {
		width: 100%;
	}

	.save {
		position: relative;
	}

	.saving .label {
		opacity: 0;
	}

	.spinner {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.error {
		white-space: nowrap;
	}

	.selected {
		color: var(--secondary-green);
	}
`;

Details.propTypes = {
	badge: PropTypes.object,
	onSelect: PropTypes.func,
	selected: PropTypes.bool,
};
export default function Details({ badge, onSelect, selected }) {
	const [saving, setSaving] = React.useState(false);
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		if (saving) {
			setSaving(false);
		}
		if (error) {
			setError(null);
		}
	}, [badge]);

	const doSelect = React.useCallback(async () => {
		try {
			setSaving(true);
			await onSelect(badge);
		} catch (e) {
			setError(e);
		} finally {
			setSaving(false);
		}
	}, [onSelect, badge]);

	const actions = [];

	if (error) {
		actions.push(
			<Errors.Message
				key="error"
				className={styles.error}
				error={error}
			/>
		);
	}

	if (selected) {
		actions.push(
			<div key="checked" className={styles.selected}>
				<Icons.Check className={styles.check} />
				<Text.Base>{t('selected')}</Text.Base>
			</div>
		);
	} else {
		actions.push(
			<Button
				key="save-button"
				className={cx(styles.save, { [styles.saving]: saving })}
				onClick={doSelect}
				rounded
				disabled={saving}
			>
				<Text.Base className={styles.label}>{t('add')}</Text.Base>
				{saving && (
					<div className={styles.spinner}>
						<Loading.Spinner white />
					</div>
				)}
			</Button>
		);
	}

	return (
		<BadgeDetails
			className={styles.details}
			badge={badge}
			hideImage
			actions={actions}
		/>
	);
}
