import BadgeDetails from '../BadgeDetails';

const Template = args => <BadgeDetails {...args} />;

// className: PropTypes.string,
// 	badge: PropTypes.shape({
// 		name: PropTypes.string,
// 		description: PropTypes.string,
// 		organizationName: PropTypes.string,
// 		badgeURL: PropTypes.string,
// 		acceptBadgeURL: PropTypes.string,
// 	}),

// 	hideImage: PropTypes.bool,
// 	dialog: PropTypes.bool,
// 	actions: PropTypes.arrayOf(PropTypes.node),

export const Basic = Template.bind({});
Basic.args = {
	badge: {
		name: 'Test Badge',
		description:
			'Sed posuere consectetur est at lobortis. Nullam id dolor id nibh ultricies vehicula ut id elit.',
		organizationName: 'NextThought',
		acceptBadgeURL: '//some.fake.url',
	},
};

export default {
	title: 'BadgeDetails',
	component: BadgeDetails,
};
