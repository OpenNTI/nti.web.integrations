import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Text, Image, List, StandardUI} from '@nti/web-commons';

import Styles from './Organization.css';

const t = scoped('integrations.services.credly.components.Organization', {
	website: 'Website'
});

CredlyAcclaimOrganization.propTypes = {
	className: PropTypes.string,
	organization: PropTypes.shape({
		name: PropTypes.string,
		photoURL: PropTypes.string,
		contactEmail: PropTypes.string,
		websiteURL: PropTypes.string
	})
};
export default function CredlyAcclaimOrganization ({className, organization}) {
	return (
		<StandardUI.Card className={cx(Styles.credlyOrganization, className)}>
			<Image className={Styles.photo} src={organization.photoURL} />
			<div className={Styles.info}>
				<Text.Base className={Styles.name}>{organization.name}</Text.Base>
				<List.SeparatedInline className={Styles.list}>
					{organization.websiteURL && (
						<Text.Base>
							<a href={organization.websiteURL} rel="noopener noreferrer">{t('website')}</a>
						</Text.Base>
					)}
					{organization.contactEmail && (
						<Text.Base>
							<a href={`mailto:${organization.contactEmail}`}>{organization.contactEmail}</a>
						</Text.Base>
					)}
				</List.SeparatedInline>
			</div>
		</StandardUI.Card>
	);
}
