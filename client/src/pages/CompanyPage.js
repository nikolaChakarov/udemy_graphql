import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
// import { companies } from '../lib/fake-data';
import { getCompany } from '../lib/graphql/queries';

function CompanyPage() {
	const { companyId } = useParams();

	const [company, setCompany] = useState(null);

	useEffect(() => {
		getCompany(companyId).then((res) => setCompany(res));
	}, [companyId]);

	if (!company) {
		return <p>Loading...</p>;
	}

	// const company = companies.find((company) => company.id === companyId);
	return (
		<div>
			<h1 className='title'>{company.name}</h1>
			<div className='box'>{company.description}</div>
		</div>
	);
}

export default CompanyPage;
