import {
	ApolloClient,
	ApolloLink,
	InMemoryCache,
	concat,
	createHttpLink,
	gql,
} from '@apollo/client';
// import { GraphQLClient } from 'graphql-request';
import { getAccessToken } from '../auth';

// const client = new GraphQLClient('http://localhost:9000/graphql', {
// 	headers: () => {
// 		const token = getAccessToken();
// 		if (token) {
// 			return {
// 				Authorization: `Bearer ${token}`,
// 			};
// 		}
// 		return {};
// 	},
// });

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });
const authLink = new ApolloLink((operation, forward) => {
	const token = getAccessToken();
	if (token) {
		operation.setContext({
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
	return forward(operation);
});

export const apolloClient = new ApolloClient({
	link: concat(authLink, httpLink),
	cache: new InMemoryCache(),
	// defaultOptions: {
	// 	query: {
	// 		fetchPolicy: 'network-only',
	// 	},
	// 	watchQuery: {
	// 		fetchPolicy: 'network-only',
	// 	},
	// },
});

const jobByIdQuery = gql`
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

export async function createJob({ title, description }) {
	const mutation = gql`
		mutation CreateJob($input: CreateJobInput!) {
			job: createJob(input: $input) {
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

	const { data } = await apolloClient.mutate({
		mutation,
		variables: {
			input: { title, description },
		},
		update: (cache, { data }) => {
			cache.writeQuery({
				query: jobByIdQuery,
				variables: {
					id: data.job.id,
				},
				data,
			});
		},
	});

	return data.job;

	// const { job } = await client.request(mutation, {
	// 	input: { title, description },
	// });

	// return job;
}

export async function deleteJob(id) {
	const mutation = gql`
		mutation DeleteJob($id: ID!) {
			deleteJob(id: $id) {
				id
				title
			}
		}
	`;

	try {
		const deleted = await apolloClient.mutate({
			mutation,
			variables: { id },
		});

		return deleted;
		// const deleted = await client.request(mutation, { id });
		// return deleted;
	} catch (error) {
		console.log(error);
	}
}

export async function updatedJob({ id, title, description }) {
	const mutation = gql`
		mutation UpdateJob($input: UpdateJobInput!) {
			updateJob(input: $input) {
				id
				title
				description
			}
		}
	`;

	try {
		const updatedJob = await apolloClient.mutate({
			mutation,
			variables: {
				input: { id, title, description },
			},
		});
		console.log(updatedJob);
		return updatedJob;

		// const updatedJob = await client.request(mutation, {
		// 	input: { id, title, description },
		// });
		// return updatedJob;
	} catch (err) {
		console.log(err);
	}
}

export async function getJob(id) {
	const { data } = await apolloClient.query({
		query: jobByIdQuery,
		variables: { id },
	});
	return data.job;

	// const { job } = await client.request(query, { id });
	// return job;
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

	const result = await apolloClient.query({
		query,
		fetchPolicy: 'network-only',
	});
	return result.data.jobs;

	// const { jobs } = await client.request(query);
	// return jobs;
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

	const { data } = await apolloClient.query({ query, variables: { id } });
	return data.company;

	// const { company } = await client.request(query, { id });
	// return company;
}
