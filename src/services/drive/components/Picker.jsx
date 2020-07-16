import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {ExternalLibraryManager} from '@nti/web-client';
import {Text, Loading, Button, HOC} from '@nti/web-commons';

import {Authorize} from '../../google';

import Styles from './Picker.css';

const cx = classnames.bind(Styles);
const t = scoped('integrations.drive.components.Picker', {
	launch: 'Open Google Picker',
	noSelected: 'No Document Selected'
});

const GAPISource = 'https://apis.google.com/js/api.js';
const GAPIDevKey = 'AIzaSyBntrVvY4b0pY9u4vSf_54hnDdt-eYK_H4';
const GAPIAppId = '918146062510';

const AuthScopes = ['https://www.googleapis.com/auth/drive.file'];

function loadPicker () {
	if (!loadPicker.ref) {
		const load = async () => {
			await ExternalLibraryManager.injectScript(GAPISource, 'gapi');
			await new Promise((fulfill) => global.gapi.load('picker', {callback: fulfill}));

			if (!global.google?.picker) {
				throw new Error('Unable to load picker');
			}

			return global.google.picker;
		};

		loadPicker.ref = load();
	}

	return loadPicker.ref;
}

async function showPicker (authToken) {
	const picker = await loadPicker();

	return new Promise((fulfill, reject) => {
		try {
			const pickerView = new picker.PickerBuilder()
				.enableFeature(picker.Feature.NAV_HIDDEN)
				.setOAuthToken(authToken)
				.setDeveloperKey(GAPIDevKey)
				.setAppId(GAPIAppId)
				.addView(new picker.View(picker.ViewId.DOCS))
				.addView(new picker.DocsUploadView())
				.setCallback((data) => {
					if (data.action === picker.Action.PICKED) {
						fulfill(data.docs);
					} else if (data.action === picker.Action.CANCEL) {
						fulfill(null);
					}
				})
				.build();

			pickerView.setVisible(true);

		} catch (e) {
			reject(e);
		}
	});
}

GoogleDrivePicker.Bar = HOC.Variant(GoogleDrivePicker, {className: cx('bar')});
GoogleDrivePicker.propTypes = {
	className: PropTypes.string,

	value: PropTypes.object,
	onChange: PropTypes.func,
	onError: PropTypes.func,

	autoLaunch: PropTypes.bool
};
export default function GoogleDrivePicker ({className, value, onChange, onError, autoLaunch}) {
	const [authToken, setAuthToken] = React.useState(null);
	const [open, setOpen] = React.useState(autoLaunch);

	const onAuth = (token) => {
		setAuthToken(token);
	};

	const onAuthFail = (...args) => {
		onError?.(...args);
		setOpen(false);
	};

	const onAuthCancel = () => setOpen(false);

	React.useEffect(() => {
		if (!open || !authToken) { return; }

		let unmounted = false;

		const pick = async () => {
			try {
				const docs = await showPicker(authToken);

				if (!unmounted) {
					onChange?.(docs);
					setOpen(false);
				}
			} catch (e) {
				if (!unmounted) {
					onError?.(e);
					setOpen(false);
				}
			}
		};

		pick();
		return () => unmounted = true;
	}, [authToken, open]);

	return (
		<div className={cx('drive-picker', className)}>
			{open && !authToken && (
				<Authorize
					onAuthorized={onAuth}
					onFailure={onAuthFail}
					onCancel={onAuthCancel}
					scopes={AuthScopes}
				/>
			)}
			{value && (
				<a href={value.url} className={cx('document')} target="_blank" rel="noopener noreferrer">
					{value.iconUrl && (<img src={value.iconUrl} />)}
					<Text.Base className={cx('name')}>
						{value.name}
					</Text.Base>
				</a>
			)}
			{!value && (
				<Text.Base className={cx('no-selection')}>
					{t('noSelected')}
				</Text.Base>
			)}
			<Button onClick={open ? null : (() => setOpen(true))} className={cx('launch')}>
				{open && (<Loading.Spinner white size="16px" />)}
				{!open && (
					<Text.Base>
						{t('launch')}
					</Text.Base>
				)}
			</Button>
		</div>
	);
}