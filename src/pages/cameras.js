import { DataTable, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from 'carbon-components-react';
import React from 'react';
import Layout from '../components/layout';

const CamerasPage = () => {
  let headerData = [{
    header: 'Name',
    key: 'name'
  }, {
    header: 'Status',
    key: 'status'
  }];
  let rowsData = [{
    id: 'id',
    name: 'Camera 1',
    status: 'Active'
  }];

  return (
    <Layout>
      <DataTable rows={rowsData} headers={headerData}>
        {({ rows, headers, getHeaderProps, getTableProps }) => {
          return (
          <TableContainer title="Cameras" description="All the goodness ">
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}}
      </DataTable>
    </Layout>
  )
};

export default CamerasPage;