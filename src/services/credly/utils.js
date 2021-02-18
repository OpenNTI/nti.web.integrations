import { findIntegration } from '../../utils';

import { Handles } from './Constants';

export function findCredlyIntegration(context) {
	return findIntegration(s => Handles[s.MimeType], context);
}
