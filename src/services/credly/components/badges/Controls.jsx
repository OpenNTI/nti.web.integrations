import React from 'react';
import {Paging} from '@nti/web-commons';

import {BadgesStore} from './Store';

const Controls = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-end;
`;

export default function BadgesControls () {
	const {
		currentPage,
		totalPages,

		loadPage
	} = BadgesStore.useValue();

	if (!totalPages || totalPages === 1) { return null; }

	return (
		<Controls>
			<Paging.Controls total={totalPages} current={currentPage} onChange={loadPage} />
		</Controls>
	);
}
