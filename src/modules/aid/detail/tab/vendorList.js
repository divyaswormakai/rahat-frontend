import React, { useContext, useEffect, useCallback } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';

import { AidContext } from '../../../../contexts/AidContext';

const List = ({ projectId }) => {
	const { vendor_pagination, vendors_list, vendorsByAid } = useContext(AidContext);

	const handlePagination = current_page => {
		let _start = (current_page - 1) * vendor_pagination.limit;
		console.log({ _start });
	};

	const fetchVendorsByAId = useCallback(async () => {
		await vendorsByAid(projectId);
	}, [projectId, vendorsByAid]);

	useEffect(() => {
		fetchVendorsByAId();
	}, [fetchVendorsByAId]);

	return (
		<>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">Name</th>
						<th className="border-0">Address</th>
						<th className="border-0">Phone number</th>
						<th className="border-0">Email</th>
						<th className="border-0">Shop</th>
					</tr>
				</thead>
				<tbody>
					{vendors_list.length > 0 ? (
						vendors_list.map(d => {
							return (
								<tr key={d._id}>
									<td>{d.name}</td>
									<td>{d.address || '-'}</td>
									<td>{d.phone}</td>
									<td>{d.email}</td>
									<td>{d.shop_name || '-'}</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={2}></td>
							<td>No data available.</td>
						</tr>
					)}
				</tbody>
			</Table>

			{vendor_pagination.totalPages > 1 ? (
				<Pagination
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '50px'
					}}
				>
					<PaginationItem>
						<PaginationLink first href="#first_page" onClick={() => handlePagination(1)} />
					</PaginationItem>
					{[...Array(vendor_pagination.totalPages)].map((p, i) => (
						<PaginationItem
							key={i}
							active={vendor_pagination.currentPage === i + 1 ? true : false}
							onClick={() => handlePagination(i + 1)}
						>
							<PaginationLink href={`#page=${i + 1}`}>{i + 1}</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationLink last href="#last_page" onClick={() => handlePagination(vendor_pagination.totalPages)} />
					</PaginationItem>
				</Pagination>
			) : (
				''
			)}
		</>
	);
};

export default List;
