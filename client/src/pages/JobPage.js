import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
// import { formatDate } from '../lib/formatters';
// import { jobs } from '../lib/fake-data';
import { getJob } from '../lib/graphql/queries';
import { useEffect, useState } from 'react';
import { deleteJob } from '../lib/graphql/queries';

function JobPage() {
	const navigate = useNavigate();
	const { jobId } = useParams();

	const [job, setJob] = useState(null);

	const handleDelete = async () => {
		await deleteJob(jobId);

		navigate('/');
	};

	useEffect(() => {
		getJob(jobId).then((res) => {
			setJob(res);
		});
	}, [jobId]);

	if (!job) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			<h1 className='title is-2'>{job?.title}</h1>
			<h2 className='subtitle is-4'>
				<Link to={`/companies/${job?.company?.id}`}>
					{job?.company?.name}
				</Link>
			</h2>
			<div className='box'>
				<div className='block has-text-grey'>
					{/* Posted: {formatDate(job?.date, 'long')} */}
					Posted: {job.date}
				</div>
				<p
					className='block'
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					{job?.description}
					<span onClick={handleDelete} style={{ cursor: 'pointer' }}>
						&#x274C;
					</span>
				</p>
			</div>
		</div>
	);
}

export default JobPage;
