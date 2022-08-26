import { useEffect } from 'react';
import { useWeb3ExecuteFunction } from 'react-moralis';
import { Table } from '@web3uikit/core';
import { DateTime } from 'luxon';

import { showSuccess } from '../containers/Toast';

import Interview from '../interfaces/Interview';

import TrinityAbi from '../abi/Trinity.json';

import { CONTRACT_ADDRESS } from '../constants';

const ValidatorInterviewList = ({
  candidates
} : {
  candidates: Interview[]
}) => {
  const {
    fetch,
    data: issueSkillNFTData,
    error: issueSkillNFTError
  } = useWeb3ExecuteFunction({
      contractAddress: CONTRACT_ADDRESS,
      functionName: "issueSkillNFT",
      abi: TrinityAbi.abi,
      params: {
        _candidate: '0x808FF4E7Ec78636bAb0712aC0c53D60978194596',
        _skill: 'https://lh3.googleusercontent.com/ifMOtIqni6DEfu0sfjvL4Es4TVlqhQVQfu3hTCCIft2-UeYwtrYmAK5MpZq1G0UZClkBwGJ4xDdEIkyE5sT3uBtEWwx9g6tM4Fn5Uw=s0',
      },
  });

  const onClick = async (candidate: string) => {
    await fetch();
  };

  useEffect(() => {
    if (issueSkillNFTData) {
      showSuccess(
        `Waiting on ${issueSkillNFTData['hash']} to complete`
      , {
        autoClose: false
      });
    }
  }, [issueSkillNFTData, issueSkillNFTError]);

  return (
    <Table
      columnsConfig="1fr 1fr 1fr"
      data={candidates.map(
        (item) => [
          <div
            key={`${item.attributes.candidate}_time`}
            className='flex flex-row items-center justify-start w-full h-full'
          >
            {DateTime.fromSeconds(item.attributes.startEpochSeconds).toFormat('dd-MM-yyyy')}
          </div>,
          <div
            key={`${item.attributes.candidate}_candidate`}
            className='flex flex-row items-center justify-center w-full h-full'
          >
            {item.attributes.candidate.slice(16)}
          </div>,
          <button
            key={`${item.attributes.candidate}_verify`}
            className="ml-4 btn-basic bg-gradient"
            onClick={onClick.bind(null, item.attributes.candidate)}
          >
            Verify
          </button>
        ]
      )}
      header={[
        <span key="epoch">Allocated At</span>,
        <span key="type">Candidate</span>,
        <span key="type">Issue Skill</span>,
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

export default ValidatorInterviewList;
