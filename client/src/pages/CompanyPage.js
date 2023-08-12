import { useQuery } from '@apollo/client';
// import { useState, useEffect } from 'react';
import { json, useParams } from 'react-router';
// import { companies } from '../lib/fake-data';
import { companyByIdQuery } from '../lib/graphql/queries';
import JobList from '../components/JobList';
import { useCompany } from '../lib/graphql/hooks';

function CompanyPage() {
	const { companyId } = useParams();

	const { company, loading, error } = useCompany(companyId);

	// const { data, loading, error } = useQuery(companyByIdQuery, {
	// 	variables: {
	// 		id: companyId,
	// 	},
	// });

	// const [state, setState] = useState({
	// 	company: null,
	// 	loading: true,
	// 	error: false,
	// });

	// useEffect(() => {
	// 	(async () => {
	// 		try {
	// 			const company = await getCompany(companyId);
	// 			setState({ company, loading: false, error: false });
	// 		} catch (error) {
	// 			console.log('error:', JSON.stringify(error, null, 2));
	// 			setState({ company: null, loading: false, error: true });
	// 		}
	// 	})();
	// }, [companyId]);

	// const { company, loading, error } = state;

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <div className='has-text-danger'>Data unavailable</div>;
	}

	// const company = companies.find((company) => company.id === companyId);

	// const { company } = data;

	// console.log({ data, loading, error });

	return (
		<div>
			<h1 className='title'>{company.name}</h1>
			<div className='box'>{company.description}</div>
			<h2 className='title is-5'>Jobs at {company.name}</h2>

			<JobList jobs={company.jobs} />
		</div>
	);
}

export default CompanyPage;
