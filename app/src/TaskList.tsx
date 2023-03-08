import TaskItem from "./TaskItem";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
interface item {
  name: string;
  dueDate: string;
  assignedTo: string;
  status: 0 | 1 | 2 | 3 | 4 | 5;
};

function TaskList() {
  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2 border-b-2 border-gray-200">
        <div className="flex flex-col items-center">
          <span className="font-bold text-3xl text-blue-500">180</span>
          <span className="font-bold text-sm text-blue-500">貢献度</span>
        </div>
        <div className="flex flex-col items-center">
          <AddCircleOutlineIcon fontSize='large' className='text-blue-500 font-bold' />
          <span className="font-bold text-sm text-blue-500">タスクを作成</span>
        </div>
      </div>
      {data.map((item) => {
        return (
          <TaskItem item={item as item} />
        )
      })}
    </div >
  );
}

export default TaskList;

const data = [
  {
    name: '鈴木',
    dueDate: '2023-03-05',
    assignedTo: 'User 8',
    status: 0,
  },
  {
    name: '伊藤',
    dueDate: '2023-03-05',
    assignedTo: 'User 6',
    status: 2,
  },
  {
    name: '吉田',
    dueDate: '2023-03-05',
    assignedTo: 'User 4',
    status: 1,
  },
  {
    name: '高橋',
    dueDate: '2023-03-05',
    assignedTo: 'User 1',
    status: 4,
  },
  {
    name: '高橋',
    dueDate: '2023-03-05',
    assignedTo: 'User 1',
    status: 3,
  },
  {
    name: '高橋',
    dueDate: '2023-03-05',
    assignedTo: 'User 1',
    status: 2,
  },
  {
    name: '高橋',
    dueDate: '2023-03-05',
    assignedTo: 'User 1',
    status: 2,
  },
  {
    name: '高橋',
    dueDate: '2023-03-05',
    assignedTo: 'User 1',
    status: 2,
  },
  {
    name: '高橋',
    dueDate: '2023-03-05',
    assignedTo: 'User 1',
    status: 2,
  },
];
