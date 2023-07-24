import { GraphQLError } from 'graphql';
import {
	getJobs,
	getJob,
	getJobsByCompany,
	createJob,
	deleteJob,
	updateJob,
} from './db/jobs.js';
import { getCompany } from './db/companies.js';

export const resolvers = {
	Query: {
		company: async (_parent, args) => {
			const company = await getCompany(args.id);
			console.log(company);

			if (!company) {
				throw notFoundError('No Company found with id ' + args.id);
			}

			return company;
		},
		job: async (_parent, { id }) => {
			const job = await getJob(id);
			if (!job) {
				throw notFoundError('No Job with id ' + id);
			}
			return job;
		},
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

	Company: {
		jobs: (parent) => getJobsByCompany(parent.id),
	},

	Mutation: {
		createJob: (_parent, args, { auth }) => {
			if (!auth) {
				throw unauthorizedError('Missing authentication');
			}
			const {
				input: { title, description },
			} = args;
			const companyId = 'FjcJCHJALA4i'; // TODO set based on user
			return createJob({ companyId: companyId, title, description });
		},
		deleteJob: (_parent, { id }) => {
			return deleteJob(id);
		},
		updateJob: (_parent, { input: { id, title, description } }) => {
			return updateJob({ id, title, description });
		},
	},
};

function notFoundError(message) {
	return new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } });
}

function toIsoDate(value) {
	return value.slice(0, 'yyyy-dd-mm'.length);
}

function unauthorizedError(message) {
	return new GraphQLError(message, { extensions: { code: 'UNAUTHORIZED' } });
}
