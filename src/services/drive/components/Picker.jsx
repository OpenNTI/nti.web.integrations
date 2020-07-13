import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Text, Loading, Button} from '@nti/web-commons';

import {Authorize} from '../../google';

const t = scoped('integrations.drive.components.Picker', {
	launch: 'Open Google Picker'
});

const AuthScopes = ['https://www.googleapis.com/auth/drive.file'];

GoogleDrivePicker.propTypes = {
	value: PropTypes.object,
	onChange: PropTypes.func,
	onError: PropTypes.func,

	autoLaunch: PropTypes.bool
};
export default function GoogleDrivePicker ({value, onChange, onError, autoLaunch}) {
	const [authToken, setAuthToken] = React.useState(null);
	const [open, setOpen] = React.useState(autoLaunch);

	const onAuth = (token) => {
		setAuthToken(token);
	};

	const onAuthFail = () => {
		debugger;
	};

	React.useEffect(() => {
		if (!open || !authToken) { return; }

		alert('Show Google Picker');
	}, [authToken, open]);

	return (
		<div>
			{open && !authToken && (
				<Authorize onAuthorized={onAuth} onFailure={onAuthFail} scopes={AuthScopes}/>
			)}

			<Button onClick={open ? null : (() => setOpen(true))}>
				{open && (<Loading.Spinner />)}
				{!open && (
					<Text.Base>
						{t('launch')}
					</Text.Base>
				)}
			</Button>
		</div>
	);
}