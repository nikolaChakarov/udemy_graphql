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
			console.log(args);
			const company = await getCompany(args.id);

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
		createJob: (_parent, args, { user }) => {
			if (!user) {
				throw unauthorizedError('Missing authentication');
			}
			const {
				input: { title, description },
			} = args;
			const companyId = user.companyId;
			return createJob({ companyId: companyId, title, description });
		},
		deleteJob: async (_parent, { id }, { user }) => {
			if (!user) {
				throw unauthorizedError('Missing authentication');
			}
			const job = await deleteJob(id, user.companyId);

			if (!job) {
				throw unauthorizedError('Not Job found with id: ' + id);
			}
			return job;
		},
		updateJob: async (
			_parent,
			{ input: { id, title, description } },
			{ user }
		) => {
			if (!user) {
				throw unauthorizedError('Missing authentication');
			}
			const job = await updateJob({
				id,
				companyId: user.companyId,
				title,
				description,
			});
			if (!job) {
				throw unauthorizedError('Not Job found with id: ' + id);
			}
			return job;
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
