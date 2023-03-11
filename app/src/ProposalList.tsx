import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ProposalItem from './ProposalItem';

interface Proposal {
  id: string;
  title: string;
  description: string;
  expiredAt: string;
  user?: string;
}

function ProposalList() {
  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2 border-b-2 border-gray-200">
        <div className="flex flex-col items-center">
        </div>
        <div className="flex flex-col items-center">
          <AddCircleOutlineIcon fontSize='large' className='text-blue-500 font-bold' />
          <span className="font-bold text-sm text-blue-500">タスクを作成</span>
        </div>
      </div>
      {Data !== undefined && Data.map((proposal) => {
        return (
          <ProposalItem key={proposal.id} proposal={proposal as Proposal} />
        )
      })}
    </div>
  );
}

const Data = [
  {
    id: '1',
    title: 'タスク1',
    description: 'タスク1の説明',
    expiredAt: '2021-10-10',
    user: 'user1',
  },
  {
    id: '2',
    title: 'タスク2',
    description: 'タスク2の説明',
    expiredAt: '2021-10-10',
    user: 'user2',
  },
  {
    id: '3',
    title: 'タスク3',
    description: 'タスク3の説明',
    expiredAt: '2021-10-10',
    user: 'user3',
  },
]
export default ProposalList;