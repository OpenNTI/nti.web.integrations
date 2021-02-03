import React from 'react';
import {scoped} from '@nti/lib-locale';
import {Text, Input, Icons, Paging} from '@nti/web-commons';

import Store from './Store';

const t = scoped('integrations.services.credly.components.available-badges.Controls', {
	issuedBy: 'Issued By:',
	search: 'Search Badges',
	results: 'Search Results'
});

const ControlLine = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	justify-content: space-between;
	padding: var(--side-padding, 1rem) var(--side-padding, 1rem) 0;

	&:empty {
		display: none;
	}

	& + & {
		padding-top: 0;
	}

	&:last-of-type {
		padding-bottom: var(--side-padding, 1rem);
	}
`;

const Org = styled.div`
	/* To match the margin top of the search input */
	margin-top: 7px;
`;
const OrgLabel = styled(Text.Base)`
	display: block;
	font-size: 0.625rem;
	font-weight: 700;
	text-transform: uppercase;
	color: var(--tertiary-grey);
`;

const Search = styled.div`
	flex: 1 1 auto;
	max-width: 33%;
`;

const SearchResultsLabel = styled(Text.Base)`

`;

const PagingControls = styled.div`

`;


export default function AvailableBadgesHeader () {
	const {
		integration,
		searchTerm,
		updateSearchTerm,

		currentPage,
		totalPages,
		loadPage
	} = Store.useValue();

	const {organization} = integration ?? {};

	return (
		<>
			<ControlLine>
				<Org>
					{organization && (<OrgLabel>{t('issuedBy')}</OrgLabel>)}
					{organization && (
						<Text.Base>{organization.name}</Text.Base>
					)}
				</Org>
				<Search>
					<Input.Icon icon={<Icons.Search />}>
						<Input.LabelPlaceholder>
							<Input.Text placeholder={t('search')} onChange={updateSearchTerm} value={searchTerm} />
						</Input.LabelPlaceholder>
					</Input.Icon>
				</Search>
			</ControlLine>
			<ControlLine>
				<SearchResultsLabel>
					{searchTerm ? t('results') : null}
				</SearchResultsLabel>
				{totalPages && totalPages > 1 && (
					<PagingControls>
						<Paging.Controls total={totalPages} current={currentPage} onChange={loadPage} />
					</PagingControls>
				)}
			</ControlLine>
		</>
	);
}
