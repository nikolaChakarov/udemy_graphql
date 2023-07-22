import { getJobs, getJob, getJobsByCompany } from './db/jobs.js';
import { getCompany } from './db/companies.js';

export const resolvers = {
	Query: {
		job: (_parent, { id }) => getJob(id),
		jobs: () => getJobs(),
		company: (_parent, args) => getCompany(args.id),
	},

	Job: {
		company: (parent) => {
			return getCompany(parent.companyId);
		},
		date: (parent) => {
			return toIsoDate(parent.createdAt);
		},
	},

	Company: {
		jobs: (parent) => getJobsByCompany(parent.id),
	},
};

function toIsoDate(value) {
	return value.slice(0, 'yyyy-dd-mm'.length);
}
