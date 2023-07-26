import { ApolloClient } from '@apollo/client';
import { GraphQLClient, gql } from 'graphql-request';
import { getAccessToken } from '../auth';

const client = new GraphQLClient('http://localhost:9000/graphql', {
	headers: () => {
		const token = getAccessToken();
		if (token) {
			return {
				Authorization: `Bearer ${token}`,
			};
		}
		return {};
	},
});

export async function createJob({ title, description }) {
	const query = gql`
		mutation CreateJob($input: CreateJobInput!) {
			job: createJob(input: $input) {
				id
			}
		}
	`;

	const { job } = await client.request(query, {
		input: { title, description },
	});

	return job;
}

export async function deleteJob(id) {
	const query = gql`
		mutation DeleteJob($id: ID!) {
			deleteJob(id: $id) {
				id
				title
			}
		}
	`;

	try {
		const deleted = await client.request(query, { id });
		return deleted;
	} catch (error) {
		console.log(error);
	}
}

export async function updatedJob({ id, title, description }) {
	const query = gql`
		mutation UpdateJob($input: UpdateJobInput!) {
			updateJob(input: $input) {
				id
				title
				description
			}
		}
	`;

	try {
		const updatedJob = await client.request(query, {
			input: { id, title, description },
		});
		console.log('updatedJob::', updatedJob);
		return updatedJob;
	} catch (err) {
		console.log(err);
	}
}

export async function getJob(id) {
	const query = gql`
		query JobById($id: ID!) {
			job(id: $id) {
				id
				date
				title
				description
				company {
					id
					name
				}
			}
		}
	`;

	const { job } = await client.request(query, { id });
	return job;
}

export async function getJobs() {
	const query = gql`
		query Jobs {
			jobs {
				id
				title
				date
				company {
					id
					name
				}
			}
		}
	`;

	const { jobs } = await client.request(query);
	return jobs;
}

export async function getCompany(id) {
	const query = gql`
		query getCompanyById($id: ID!) {
			company(id: $id) {
				id
				name
				description
				jobs {
					title
					id
					date
				}
			}
		}
	`;

	const { company } = await client.request(query, { id });
	return company;
}
