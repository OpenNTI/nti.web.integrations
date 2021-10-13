import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Form, Text } from '@nti/web-commons';
import { Button } from '@nti/web-core';

import Styles from './Connect.css';

const t = scoped('integrations.services.credly.window.Connect', {
	title: 'To Connect to Credly Acclaim, add your Authorization Token',
	placeholder: 'Authorization Token',
});

CredlyAcclaimConnectForm.propTypes = {
	service: PropTypes.shape({
		connect: PropTypes.func,
	}),
	afterSubmit: PropTypes.func,
};
export default function CredlyAcclaimConnectForm({ service, afterSubmit }) {
	const submitForm = useCallback(
		({ json }) => service.connect(json.authorizationToken),
		[service]
	);

	return (
		<div className={Styles.connectForm}>
			<Text.Base className={Styles.title}>{t('title')}</Text.Base>
			<Form
				onSubmit={submitForm}
				autoComplete="off"
				afterSubmit={afterSubmit}
			>
				<Form.Input.Text
					className={Styles.tokenInput}
					name="authorizationToken"
					placeholder={t('placeholder')}
					fill
				/>
				<Button
					as={Form.SubmitButton}
					className={Styles.submit}
					rounded
				>
					Add Token
				</Button>
			</Form>
		</div>
	);
}
