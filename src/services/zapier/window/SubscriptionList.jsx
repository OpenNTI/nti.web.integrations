import React, { useState, useEffect } from 'react';
import {List} from '@nti/web-commons';
import classnames from 'classnames/bind';
import {getService} from '@nti/web-client';

import Styles from './SubscriptionList.css';

const cx = classnames.bind(Styles);

const useZapierSubscriptionList = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const [error, setError] = useState([]);

	useEffect(() => {
		async function load () {
			setLoading(true);
			setError(null);
			try {
				const result = await getService().then(s => s.get('./zapier/subscriptions'));
				// console.log(result);
				setData(result.Items);
			}
			catch (e) {
				setError(e);
			}
			finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	return {
		loading,
		data,
		error
	};
};

export default function SubscriptionList (props) {
	const {data, loading, error} = useZapierSubscriptionList();
	return error
		? <div>Error</div>
		: loading
			? <div>Loading</div>
			: (
				<List.Unadorned className={cx(Styles.root)}>
					{ data?.map?.(item => <li key={item.Id}>{item.Id}</li>) }
				</List.Unadorned>
			);
}
