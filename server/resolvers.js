import { getJobs } from './db/jobs.js';
import { getCompany } from './db/companies.js';

export const resolvers = {
	Query: {
		jobs: () => getJobs(),
	},

	Job: {
		company: (parent) => {
			return getCompany(parent.companyId);
		},
		date: (parent) => {
			return toIsoDate(parent.createdAt);
		},
	},
};

function toIsoDate(value) {
	return value.slice(0, 'yyyy-dd-mm'.length);
}
