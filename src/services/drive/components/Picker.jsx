import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';
import { Text, Loading, HOC } from '@nti/web-commons';
import { Button } from '@nti/web-core';

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
			const api = await Authorize.getGoogleAPI();

			await new Promise(fulfill => void api.load('picker', fulfill));

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
				.setDeveloperKey(apiKeys.key)
				.setAppId(apiKeys.AppId)
				.setOrigin(global.location.origin)
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

/**
 * @param {object} props
 * @param {string?} props.className
 * @param {object} props.value
 * @param {(doc: any)=> void} props.onChange
 * @param {(error: Error) => void} props.onError
 * @param {boolean} props.autoLaunch
 * @param {React.Ref<HTMLDivElement>} ref
 * @returns {JSX.Element}
 */
function GoogleDrivePickerImpl(
	{ className, value, onChange, onError, autoLaunch },
	ref
) {
	const [authToken, setAuthToken] = useState(null);
	const [open, setOpen] = useState(autoLaunch);

	const onAuth = token => {
		setAuthToken(token);
	};

	const onAuthFail = (...args) => {
		onError?.(...args);
		setOpen(false);
	};

	const onAuthCancel = () => setOpen(false);

	useEffect(() => {
		if (!open || !authToken) {
			return;
		}

		let unmounted = false;

		const pick = async () => {
			try {
				const docs = await showPicker(authToken);

				if (!unmounted) {
					onChange?.(docs);
				}
			} catch (e) {
				if (!unmounted) {
					onError?.(e);
				}
			} finally {
				setOpen(false);
			}
		};

		pick();
		return () => (unmounted = true);
	}, [authToken, open]);

	return (
		<div className={cx('drive-picker', className)} ref={ref}>
			{open && !authToken && (
				<Authorize
					onAuthorized={onAuth}
					onFailure={onAuthFail}
					onCancel={onAuthCancel}
					scopes={AuthScopes}
				/>
			)}
			{value ? (
				<a
					href={value.url}
					className={cx('document')}
					target="_blank"
					rel="noopener noreferrer"
				>
					{value.iconUrl && <img src={value.iconUrl} />}
					<Text.Base className={cx('name')}>{value.name}</Text.Base>
				</a>
			) : (
				<Text.Base className={cx('no-selection')}>
					{t('noSelected')}
				</Text.Base>
			)}
			<Button
				onClick={open ? null : () => setOpen(true)}
				className={cx('launch')}
			>
				{open ? (
					<Loading.Spinner white size="16px" />
				) : (
					<Text.Base>{t('launch')}</Text.Base>
				)}
			</Button>
		</div>
	);
}

const GoogleDrivePicker = React.forwardRef(GoogleDrivePickerImpl);

GoogleDrivePicker.Bar = HOC.Variant(GoogleDrivePicker, {
	className: cx('bar'),
});

export default GoogleDrivePicker;
