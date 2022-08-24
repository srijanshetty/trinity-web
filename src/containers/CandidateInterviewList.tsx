import { Table } from '@web3uikit/core';
import { DateTime } from 'luxon';
import Interview from '../interfaces/Interview';

const CandidateInterviewList = ({
  interviews
} : {
  interviews: Interview[]
}) => {
  return (
    <Table
      columnsConfig="1fr 1fr 1fr"
      data={interviews.map(
        (item) => [
          DateTime.fromSeconds(item.attributes.startEpochSeconds).toFormat('dd-MM-yyyy'),
          item.attributes.stage,
          item.attributes.sourceAccount,
        ]
      )}
      header={[
        <span key="epoch">Allocated At</span>,
        <span key="type">Stage</span>,
        <span key="type">Interviewer</span>,
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

export default CandidateInterviewList;
