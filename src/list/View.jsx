import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Loading, EmptyState, Errors, Hooks, Text, List} from '@nti/web-commons';

import {getIntegrationsCollection} from '../utils';

import Styles from './Styles.css';
import Item from './Item';

const {useResolver, useForceUpdate} = Hooks;
const {isPending, isResolved, isErrored} = useResolver;

const cx = classnames.bind(Styles);
const t = scoped('integrations.list.View', {
	title: 'Connect with Other Services',
	description: 'Integrate with popular services so you can do even more with your audience.',
	error: 'Unable to load integrations',
	empty: 'No integrations have not been set up.'
});

IntegrationsList.propTypes = {
	context: PropTypes.object
};
export default function IntegrationsList ({context}) {
	const forceUpdate = useForceUpdate();

	const resolver = useResolver(() => getIntegrationsCollection(context), [context]);
	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const integrations = !error && isResolved(resolver) ? resolver : null;

	React.useEffect(() => {
		if (!integrations) { return; }

		return integrations.subscribeToChange(forceUpdate);
	}, [integrations]);

	const services = integrations?.Items ?? [];

	return (
		<div className={cx('nti-integrations-list')}>
			<Text.Base className={cx('title')}>{t('title')}</Text.Base>
			<Text.Base className={cx('description')}>{t('description')}</Text.Base>
			<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />}>
				{error && (<Errors.Message error={error} />)}
				{!error && services.length === 0 && (
					<EmptyState header={t('empty')} />
				)}
				{!error && services.length > 0 && (
					<List.Unadorned className={cx('integrations')}>
						{services.map((service) => {
							return (
								<li key={service.name}>
									<Item service={service} />
								</li>
							);
						})}
					</List.Unadorned>
				)}
			</Loading.Placeholder>
		</div>
	);
}

