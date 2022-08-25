import { Table } from '@web3uikit/core';
import { DateTime } from 'luxon';
import Interview from '../interfaces/Interview';

const EmployeeInterviewList = ({
  candidates
} : {
  candidates: Interview[]
}) => {
  return (
    <Table
      columnsConfig="1fr 1fr"
      data={candidates.map(
        (item) => [
          DateTime.fromSeconds(item.attributes.startEpochSeconds).toFormat('dd-MM-yyyy'),
          item.attributes.candidate,
        ]
      )}
      header={[
        <span key="epoch">Allocated At</span>,
        <span key="type">Candidate</span>,
      ]}
      isColumnSortable={[
        true,
        true
      ]}
      maxPages={3}
      pageSize={5}
    />
  );
}

export default EmployeeInterviewList;
