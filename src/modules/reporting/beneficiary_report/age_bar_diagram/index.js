import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CardTitle } from 'reactstrap';

const barChartOptions = {
	maintainAspectRatio: false,
	legend: {
		display: true,
		position: 'bottom'
	},
	scales: {
		xAxes: [
			{
				gridLines: { display: false },
				// stacked: true,
				barThickness: 40
			}
		],
		yAxes: [
			{
				gridLines: { borderDash: [4, 2] }
				// stacked: true
			}
		]
	}
};

const Index = props => {
	const { data } = props;

	const barChartData = {
		datasets: [
			{
				label: 'Beneficiaries',
				backgroundColor: '#2B7EC1',
				stack: '2'
			}
		]
	};

	let bar_labels = [];
	let bar_data = [];

	if (data && data.length) {
		bar_labels = [];
		for (let d of data) {
			bar_labels.push(d.range);
			bar_data.push(d.value);
		}
	}

	barChartData.labels = bar_labels;
	barChartData.datasets[0].data = bar_data;

	return (
		<div>
			<CardTitle>Beneficiary by age</CardTitle>
			<br />
			<div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 420 }}>
				<Bar data={barChartData} options={barChartOptions} />
			</div>
		</div>
	);
};

export default Index;
