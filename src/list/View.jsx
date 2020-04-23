import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Loading, EmptyState, Errors, Hooks, Text, List, Prompt} from '@nti/web-commons';

import {getIntegrationsCollection, ReturnParams} from '../utils';
import {getWindowFor, getNameFor} from '../services';

import Styles from './Styles.css';
import Item from './Item';
import getPreviewItems from './get-preview-items';

const {useResolver, useForceUpdate} = Hooks;
const {isPending, isResolved, isErrored} = useResolver;

const cx = classnames.bind(Styles);
const t = scoped('integrations.list.View', {
	title: 'Connect with Other Services',
	description: 'Integrate with popular services so you can do even more with your audience.',
	error: 'Unable to load integrations',
	empty: 'No integrations have not been set up.',
	addIntegration: 'Not seeing the integration you need? Contact <a href="mailto:integrations@nextthought.com">integrations@nextthought.com</a> to see about adding it.'
});


IntegrationsList.propTypes = {
	context: PropTypes.object
};
export default function IntegrationsList ({context}) {
	const forceUpdate = useForceUpdate();

	const [selected, setSelected] = React.useState(null);

	React.useEffect(() => {
		const params = ReturnParams.get();

		if (params) {
			setSelected(params.get('service'));
		}
	}, []);

	const resolver = useResolver(() => getIntegrationsCollection(context), [context]);
	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const integrations = !error && isResolved(resolver) ? resolver : null;

	React.useEffect(() => {
		if (!integrations) { return; }

		return integrations.subscribeToChange(forceUpdate);
	}, [integrations]);

	const preview = getPreviewItems(context) ?? [];
	const actual = integrations?.Items ?? [];
	const services = ([...actual, ...preview])
		.filter(Boolean)
		.sort((a, b) => {
			const aName = getNameFor(a);
			const bName = getNameFor(b);

			return aName < bName ? -1 : (aName === bName ? 0 : 1);
		});

	const selectedService = selected && services.find(s => s.name === selected);
	const Window = selectedService && getWindowFor(selectedService);

	return (
		<div className={cx('nti-integrations-list')}>
			<Text.Base className={cx('title')}>{t('title')}</Text.Base>
			<Text.Base className={cx('description')}>{t('description')}</Text.Base>
			<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />}>
				{error && (<Errors.Message className={cx('error')} error={error} />)}
				{!error && services.length === 0 && (
					<EmptyState header={t('empty')} />
				)}
				{!error && services.length > 0 && (
					<List.Unadorned className={cx('integrations')}>
						{services.map((service) => {
							return (
								<li key={service.name}>
									<Item
										service={service}
										onClick={() => setSelected(service.name)}
									/>
								</li>
							);
						})}
					</List.Unadorned>
				)}
				{!error && services.length > 0 && (<Text.Base className={cx('add-integration')} localized>{t('addIntegration')}</Text.Base>)}
				{Window && (
					<Prompt.Dialog>
						<Window service={selectedService} doClose={() => (ReturnParams.clear(), setSelected(null))} />
					</Prompt.Dialog>
				)}
			</Loading.Placeholder>
		</div>
	);
}

