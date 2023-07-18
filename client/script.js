async function fetchGreetnig() {
	const response = await fetch('http://localhost:9000/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: 'query { greeting }',
		}),
	});
	const { data } = await response.json();
	return data.greeting;
}

fetchGreetnig().then((res) => {
	document.getElementById('greeting').textContent = res;
});
