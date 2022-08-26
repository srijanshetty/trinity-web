import { useEffect, useState } from 'react';
import { useWeb3ExecuteFunction, useMoralisQuery } from 'react-moralis';
import { Table } from '@web3uikit/core';
import { DateTime } from 'luxon';

import { showSuccess, showError } from '../containers/Toast';

import Interview from '../interfaces/Interview';

import TrinityAbi from '../abi/Trinity.json';

import { CONTRACT_ADDRESS } from '../constants';

const ValidatorInterviewList = ({
  validator,
  candidates,
} : {
  validator: string;
  candidates: Interview[];
}) => {
  const [currentCandidate, setCurrentCandidate] = useState(null);

  const {
    fetch,
    data: issueSkillNFTData,
    error: issueSkillNFTError
  } = useWeb3ExecuteFunction();

  const { fetch: fetchInterviews } = useMoralisQuery(
    "Interviews",
    (query) => query
      .equalTo("status", "OPEN")
      .equalTo("stage", "VALIDATOR")
      .equalTo("candidate", currentCandidate),
    [currentCandidate],
    { autoFetch: false }
  );

  const { fetch: fetchCandidateData } = useMoralisQuery(
    "Candidates",
    (query) => query
      .equalTo("status", "VALIDATOR")
      .equalTo("account", currentCandidate),
    [currentCandidate],
    { autoFetch: false }
  );

  const onSkillNFTIssued = async () => {
    try {
      const candidates = await fetchCandidateData();
      const candidate = candidates[0];

      if (candidate) {
        console.log(candidate);

        // Update the state of the candidate to VALIDATOR
        candidate.set("status", "VALIDATED");
        await candidate.save();

        // Create an interview entry for the candidate
        const interviews = await fetchInterviews();
        const interview = interviews[0];

        if (interview) {
          interview.set("status", "CLOSED");
          await interview.save();
        } else {
          showError('No interview found for candidate!');
        }
      } else {
        showError('No candidate found for interview!');
      }
    } catch (error) {
      console.log(error);
      showError('Could not find any candidate to validate');
    }
  }

  const onClick = async (candidate: string) => {
    const options = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: "issueSkillNFT",
      abi: TrinityAbi.abi,
      params: {
        _candidate: candidate,
        _skill: 'https://lh3.googleusercontent.com/ifMOtIqni6DEfu0sfjvL4Es4TVlqhQVQfu3hTCCIft2-UeYwtrYmAK5MpZq1G0UZClkBwGJ4xDdEIkyE5sT3uBtEWwx9g6tM4Fn5Uw=s0',
      },
    }
    setCurrentCandidate(candidate);
    await fetch({ params: options });
  };

  // Show the transaction hash once request starts
  useEffect(() => {
    if (issueSkillNFTData) {
      showSuccess(
        `Waiting on ${issueSkillNFTData['hash']} to complete`
      , {
        autoClose: false
      });

      onSkillNFTIssued();
    }

    if (issueSkillNFTError) {
      console.log(issueSkillNFTError);
      showError(issueSkillNFTError.message);
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
