// import { useState, useEffect } from 'react';
import JobList from '../components/JobList';
// import { getJobs } from '../lib/graphql/queries';
import { useJobs } from '../lib/graphql/hooks';

function HomePage() {
	const { jobs, loading, error } = useJobs();

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Data not available</p>;
	}
	// const [jobs, setJobs] = useState([]);

	// const initLoad = async () => {
	// 	const jobs = await getJobs();
	// 	setJobs(jobs);
	// };

	// useEffect(() => {
	// 	initLoad();
	// }, []);

	return (
		<div>
			<h1 className='title'>Job Board</h1>
			<JobList jobs={jobs} />
		</div>
	);
}

export default HomePage;
