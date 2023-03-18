import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ProposalItem from './ProposalItem';
import { useEffect, useState } from 'react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  expiredAt: string;
  user: string;
}

function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>()
  const navigate = useNavigate()
  const handleProposalCreation = () => {
    navigate('/proposal/creation')
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://toyota-hackathon.azurewebsites.net/api/GetProposals');
      const data = await response.json();
      setProposals(data);
    }
    fetchData()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2 border-b-2 border-gray-200">
        <div className="flex flex-col items-center">
        </div>
        <div className="flex flex-col items-center">
          <AddCircleOutlineIcon fontSize='large' className='text-blue-500 font-bold' onClick={() => handleProposalCreation()} />
          <span className="font-bold text-sm text-blue-500">提案を作成</span>
        </div>
      </div>
      {proposals !== undefined && proposals.map((proposal) => {
        return (
          <ProposalItem key={proposal.id} proposal={proposal as Proposal} />
        )
      })}
    </div>
  );
}

export default ProposalList;