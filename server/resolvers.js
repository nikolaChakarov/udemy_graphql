import { getJobs, getJob } from './db/jobs.js';
import { getCompany } from './db/companies.js';

export const resolvers = {
	Query: {
		job: (_parent, { id }) => getJob(id),
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
