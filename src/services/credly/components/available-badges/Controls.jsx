import React from 'react';
import { scoped } from '@nti/lib-locale';
import { Text, Input, Icons, Paging } from '@nti/web-commons';

import Store from './Store';

const t = scoped(
	'integrations.services.credly.components.available-badges.Controls',
	{
		issuedBy: 'Issued By:',
		sorts: {
			label: 'Sort By:',
			name: 'Name',
			created: 'Most Recent',
			issued: 'Issued Count',
			updated: 'Last Updated',
		},
		search: 'Search Badges',
		results: 'Search Results',
	}
);

const ControlLine = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-end;
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

const Spacer = styled.div`
	flex: 1 1 auto;
`;

const Group = styled.div`
	/* To match the margin top of the search input */
	margin-bottom: 27px;
	margin-right: 1.5rem;
`;
const GroupLabel = styled(Text.Base)`
	display: block;
	font-size: 0.625rem;
	font-weight: 700;
	text-transform: uppercase;
	color: var(--tertiary-grey);
`;

const Select = styled(Input.Select)`
	& :global(.select-label),
	& :global(.nti-text-input) {
		height: 44px;
	}

	& :global(.nti-select-input-option.display) {
		padding-top: 5px;
		padding-bottom: 5px;
	}
`;

const Search = styled.div`
	flex: 1 1 auto;
	max-width: 33%;
`;

export default function AvailableBadgesHeader() {
	const {
		integration,
		searchTerm,
		updateSearchTerm,

		sorts,
		activeSort,
		setSort,

		currentPage,
		totalPages,
		loadPage,
	} = Store.useValue();

	const { organization } = integration ?? {};

	return (
		<>
			<ControlLine>
				<Group>
					{organization && <GroupLabel>{t('issuedBy')}</GroupLabel>}
					{organization && (
						<Select value="org" disabled>
							<Input.Select.Option value="org">
								{organization.name}
							</Input.Select.Option>
						</Select>
					)}
				</Group>
				{integration && (
					<Group>
						<GroupLabel>{t('sorts.label')}</GroupLabel>
						<Select value={activeSort} onChange={setSort}>
							{sorts.map(sort => (
								<Input.Select.Option value={sort} key={sort}>
									{t(`sorts.${sort}`)}
								</Input.Select.Option>
							))}
						</Select>
					</Group>
				)}
				<Spacer />
				<Search>
					<Input.Icon icon={<Icons.Search />}>
						<Input.LabelPlaceholder>
							<Input.Text
								placeholder={t('search')}
								onChange={updateSearchTerm}
								value={searchTerm}
							/>
						</Input.LabelPlaceholder>
					</Input.Icon>
				</Search>
			</ControlLine>
			<ControlLine>
				<div>{searchTerm ? t('results') : null}</div>
				<Spacer />
				{totalPages && totalPages > 1 && (
					<div>
						<Paging.Controls
							total={totalPages}
							current={currentPage}
							onChange={loadPage}
						/>
					</div>
				)}
			</ControlLine>
		</>
	);
}
