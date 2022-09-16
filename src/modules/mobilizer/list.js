import React, { useState, useEffect, useContext, useCallback } from 'react';
import { MobilizerContext } from '../../contexts/MobilizerContext';
import { useToasts } from 'react-toast-notifications';
import { Link } from 'react-router-dom';
import { History } from '../../utils/History';
import moment from 'moment';
import { dottedString } from '../../utils';

import {
	Card,
	CardBody,
	CardTitle,
	Button,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	Table,
	Row,
	Col,
	CustomInput
} from 'reactstrap';

import displayPic from '../../assets/images/users/user_avatar.svg';
import AdvancePagination from '../global/AdvancePagination';
import { APP_CONSTANTS } from '../../constants';

const { PAGE_LIMIT } = APP_CONSTANTS;
const SEARCH_OPTIONS = { PHONE: 'phone', NAME: 'name' };

const Mobilizer = () => {
	const { addToast } = useToasts();
	const [model, setModel] = useState(false);
	const [filter, setFilter] = useState({
		searchPlaceholder: 'Enter phone number...',
		searchBy: 'phone'
	});
	const [totalRecords, setTotalRecords] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [currentPage, setCurrentPage] = useState(1);

	const { listMobilizer, list, addMobilizer } = useContext(MobilizerContext);

	const toggle = () => setModel(!model);

	const fetchMobilizersList = query => {
		let params = { start: 0, limit: PAGE_LIMIT, ...query };
		listMobilizer(params)
			.then(d => {
				setTotalRecords(d.total);
			})
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	const handleFilterChange = e => {
		let { value } = e.target;
		if (value === SEARCH_OPTIONS.NAME) {
			setFilter({
				searchPlaceholder: 'Enter name...',
				searchBy: SEARCH_OPTIONS.NAME
			});
		}
		if (value === SEARCH_OPTIONS.PHONE) {
			setFilter({
				searchPlaceholder: 'Enter phone number...',
				searchBy: SEARCH_OPTIONS.PHONE
			});
		}
		setSearchValue('');
		fetchMobilizersList({ start: 0, limit: PAGE_LIMIT });
	};

	const handleSearchInputChange = e => {
		const { value } = e.target;
		setSearchValue(value);
		if (filter.searchBy === SEARCH_OPTIONS.PHONE && value) {
			return fetchMobilizersList({ start: 0, limit: PAGE_LIMIT, phone: value });
		}
		if (filter.searchBy === SEARCH_OPTIONS.NAME && value) {
			return fetchMobilizersList({ start: 0, limit: PAGE_LIMIT, name: value });
		}
		fetchMobilizersList({ start: 0, limit: PAGE_LIMIT });
	};

	const getQueryParams = useCallback(() => {
		const params = {};
		if (filter.searchBy === SEARCH_OPTIONS.PHONE && searchValue) params.phone = searchValue;
		if (filter.searchBy === SEARCH_OPTIONS.NAME && searchValue) params.name = searchValue;
		return params;
	}, [filter.searchBy, searchValue]);

	const onPageChanged = useCallback(
		async paginationData => {
			const params = getQueryParams();
			const { currentPage, pageLimit } = paginationData;
			setCurrentPage(currentPage);
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT, ...params };
			listMobilizer(query);
		},
		[getQueryParams, listMobilizer]
	);

	const handleAddClick = () => History.push('/add-mobilizers');

	const fetchTotalRecords = useCallback(async () => {
		const data = await listMobilizer({ start: 0, limit: PAGE_LIMIT });
		setTotalRecords(data.total);
	}, [listMobilizer]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	return (
		<div className="main">
			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 p-3">
						<Row>
							<Col md="4">Mobilizers</Col>
							<Col md="6">
								<div
									style={{
										float: 'right',
										display: 'flex'
									}}
								>
									<CustomInput
										type="select"
										id="exampleCustomSelect"
										name="customSelect"
										defaultValue=""
										onChange={handleFilterChange}
										style={{ width: 'auto', marginRight: '5px' }}
									>
										<option value="phone">Search By Phone</option>
										<option value="name">By Name</option>
									</CustomInput>
									<div style={{ display: 'inline-flex' }}>
										<Input
											placeholder={filter.searchPlaceholder}
											onChange={handleSearchInputChange}
											style={{ width: '100%' }}
										/>
									</div>
								</div>
							</Col>
							<Col md="2">
								<div>
									<Button onClick={handleAddClick} className="btn" color="info">
										Add New
									</Button>
								</div>
							</Col>
						</Row>
					</CardTitle>
					<CardBody>
						<Table className="no-wrap v-middle" responsive>
							<thead>
								<tr className="border-0">
									<th className="border-0">S.N.</th>
									<th className="border-0">Name</th>
									<th className="border-0">Phone</th>
									<th className="border-0">Address</th>
									<th className="border-0">Registration Date</th>
									<th className="border-0">Action</th>
								</tr>
							</thead>
							<tbody>
								{list.length ? (
									list.map((e, i) => (
										<tr key={e._id}>
											<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
											<td>
												<div className="d-flex no-block align-items-center">
													<div className="mr-2">
														<img src={displayPic} alt="user" className="rounded-circle" width="45" />
													</div>
													<div className="">
														<h5 className="mb-0 font-16 font-medium">{dottedString(e.name)}</h5>
													</div>
												</div>
											</td>
											<td>{e.phone}</td>
											<td>{dottedString(e.address)}</td>
											<td>{moment(e.created_at).format('MMM Do YYYY, hh:mm A')}</td>
											<td className="blue-grey-text text-darken-4 font-medium">
												<Link to={`/mobilizers/${e._id}`}>
													<i className="fas fa-eye fa-lg"></i>
												</Link>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td style={{ textAlign: 'center' }} colSpan={4}>
											No data available
										</td>
									</tr>
								)}
							</tbody>
						</Table>

						{totalRecords > 0 && (
							<AdvancePagination
								totalRecords={totalRecords}
								pageLimit={PAGE_LIMIT}
								pageNeighbours={1}
								onPageChanged={onPageChanged}
							/>
						)}
					</CardBody>
				</Card>
			</div>

			<Modal isOpen={model} toggle={toggle}>
				<Form
					onSubmit={e => {
						e.preventDefault();
						addMobilizer(e)
							.then(() => {
								addToast('Mobilizer Added Successfully', {
									appearance: 'success',
									autoDismiss: true
								});
								fetchMobilizersList({});
								toggle();
							})
							.catch(err =>
								addToast(err.message, {
									appearance: 'error',
									autoDismiss: true
								})
							);
					}}
				>
					<ModalHeader toggle={toggle}>
						<div>
							<h3>Add Mobilizer</h3>
						</div>
					</ModalHeader>
					<ModalBody>
						<div className="form-item">
							<label htmlFor="name">Name</label>
							<br />
							<Input name="name" type="text" placeholder="Full Name" className="form-field" required />
						</div>
						<br />

						<div className="form-item">
							<label htmlFor="ethaddress">Wallet Address</label>
							<br />
							<Input name="ethaddress" type="text" placeholder="Wallet Address" className="form-field" required />
						</div>
						<br />
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gridColumnGap: '10px'
							}}
						>
							<div className="form-item">
								<label htmlFor="email">Email</label>
								<br />
								<Input name="email" type="email" placeholder="Email Address" className="form-field" required />
							</div>
							<div className="form-item">
								<label htmlFor="phone">Phone</label>
								<br />
								<Input name="phone" type="number" placeholder="Phone no" className="form-field" required />
							</div>
						</div>
						<br />
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gridColumnGap: '10px'
							}}
						>
							<div className="form-item">
								<label htmlFor="address">Address</label>
								<br />
								<Input name="address" type="text" placeholder="Your Address" className="form-field" required />
							</div>
							<div className="form-item">
								<label htmlFor="govt_id">Government Id</label>
								<br />
								<Input name="govt_id" type="text" placeholder="Govt Id" className="form-field" required />
							</div>
						</div>
						<br />
						<div className="form-item">
							<label htmlFor="ethaddress">Organization</label>
							<br />
							<Input name="organization" type="text" placeholder="Organization" className="form-field" required />
						</div>
						<br />
					</ModalBody>
					<ModalFooter>
						<Button color="primary">Submit</Button>
						<Button color="secondary" onClick={toggle}>
							Cancel
						</Button>
					</ModalFooter>
				</Form>
			</Modal>
			<br />
		</div>
	);
};

export default Mobilizer;
