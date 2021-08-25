import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';
import { Text, Loading, HOC } from '@nti/web-commons';
import { Button } from "@nti/web-core";

import { Authorize } from '../../google-sso';

import Styles from './Picker.css';

const cx = classnames.bind(Styles);
const t = scoped('integrations.drive.components.Picker', {
	launch: 'Open Google Picker',
	noSelected: 'No Document Selected',
});

const AuthScopes = ['https://www.googleapis.com/auth/drive.file'];

function loadPicker() {
	if (!loadPicker.ref) {
		const load = async () => {
			const gapi = await Authorize.getGoogleAPI();

			await new Promise(fulfill =>
				gapi.load('picker', { callback: fulfill })
			);

			if (!global.google?.picker) {
				throw new Error('Unable to load picker');
			}

			return global.google.picker;
		};

		loadPicker.ref = load();
	}

	return loadPicker.ref;
}

async function showPicker(authToken) {
	const picker = await loadPicker();
	const apiKeys = await Authorize.getGoogleAPIKeys();

	return new Promise((fulfill, reject) => {
		try {
			const pickerView = new picker.PickerBuilder()
				.enableFeature(picker.Feature.NAV_HIDDEN)
				.setOAuthToken(authToken)
				.setDeveloperKey(apiKeys.DevKey)
				.setAppId(apiKeys.AppId)
				.setOrigin(
					`${global.location.protocol}//${global.location.host}`
				)
				.addViewGroup(
					new picker.ViewGroup(
						new picker.DocsView(picker.ViewId.DOCS)
							.setIncludeFolders(true)
							.setOwnedByMe(true)
							.setMode(picker.DocsViewMode.LIST)
							.setLabel('Owned By Me')
					)
						.addView(
							new picker.DocsView(picker.ViewId.DOCS)
								.setIncludeFolders(true)
								.setOwnedByMe(false)
								.setMode(picker.DocsViewMode.LIST)
								.setLabel('Shared with Me')
						)
						.addView(
							new picker.DocsView(picker.ViewId.DOCS)
								.setStarred(true)
								.setMode(picker.DocsViewMode.LIST)
								.setLabel('Starred')
						)
						.addView(new picker.DocsUploadView())
				)
				.setCallback(data => {
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

GoogleDrivePicker.Bar = HOC.Variant(GoogleDrivePicker, {
	className: cx('bar'),
});
GoogleDrivePicker.propTypes = {
	className: PropTypes.string,

	value: PropTypes.object,
	onChange: PropTypes.func,
	onError: PropTypes.func,

	autoLaunch: PropTypes.bool,
};
export default function GoogleDrivePicker({
	className,
	value,
	onChange,
	onError,
	autoLaunch,
}) {
	const [authToken, setAuthToken] = React.useState(null);
	const [open, setOpen] = React.useState(autoLaunch);

	const onAuth = token => {
		setAuthToken(token);
	};

	const onAuthFail = (...args) => {
		onError?.(...args);
		setOpen(false);
	};

	const onAuthCancel = () => setOpen(false);

	React.useEffect(() => {
		if (!open || !authToken) {
			return;
		}

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
		return () => (unmounted = true);
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
				<a
					href={value.url}
					className={cx('document')}
					target="_blank"
					rel="noopener noreferrer"
				>
					{value.iconUrl && <img src={value.iconUrl} />}
					<Text.Base className={cx('name')}>{value.name}</Text.Base>
				</a>
			)}
			{!value && (
				<Text.Base className={cx('no-selection')}>
					{t('noSelected')}
				</Text.Base>
			)}
			<Button
				onClick={open ? null : () => setOpen(true)}
				className={cx('launch')}
			>
				{open && <Loading.Spinner white size="16px" />}
				{!open && <Text.Base>{t('launch')}</Text.Base>}
			</Button>
		</div>
	);
}
