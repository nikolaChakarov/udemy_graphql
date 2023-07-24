import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('http://localhost:9000/graphql');

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

	return client.request(query, { id });
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
