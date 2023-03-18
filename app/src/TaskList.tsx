import { useContext, useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import dayjs, { Dayjs } from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, IconButton, Modal, OutlinedInput, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTaskQuery, useTaskTx } from './hooks/useContracts';
import { useAccount } from "./hooks/useAccounts";
import { Item } from "./types/task";
import { toast } from 'react-toastify';
import { ApiContext } from "./context/ApiContext";

function TaskList() {
  const [tasks, setTasks] = useState<Item[]>()
  const [open, setOpen] = useState(false)
  const [score, setScore] = useState<number>(0)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [user, setUser] = useState<string>('')
  const [timeValue, setTimeValue] = useState<Dayjs | undefined>()
  const { api } = useContext(ApiContext)

  const account = useAccount();
  const { getTaskCount, getOwnerOfTask, getScore, getTaskDeadline } = useTaskQuery(account.address);
  const { createTask } = useTaskTx(account);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://toyota-hackathon.azurewebsites.net/api/GetTasks');
      const data = await response.json() as Item[];
      setTasks(data);
    }

    fetchData()
  }, [getOwnerOfTask]);

  useEffect(() => {
    const fetchScore = async () => {
      const score = await getScore(account.address)
      setScore(score)
    }

    fetchScore()
  }, [account, getScore]);

  const handleClose = () => setOpen(false)

  const handleSubmit = async () => {
    const nextTaskId = await getTaskCount();

    const task: Item = {
      id: nextTaskId.toString(),
      title: title,
      description: description,
      expiredAt: timeValue!.unix().toString(),
      user: localStorage.getItem('name')!,
      status: 0
    }

    const blockTime = await (await api.query.timestamp.now()).toString()
    const deadline = timeValue!.unix() - dayjs().unix() + parseInt(blockTime)
    const res = createTask(deadline).then(async (res) => {
      const response = await fetch('https://toyota-hackathon.azurewebsites.net/api/CreateTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
      })
      if (response.status === 200) {
        const newTasks = tasks === undefined ? [task] : [...tasks, task];
        setTasks(newTasks);
        setOpen(false)
      }
    });

    toast.promise(res, {
      pending: 'タスクを作成中です',
      success: 'タスクを作成しました',
      error: 'タスクの作成に失敗しました'
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2 border-b-2 border-gray-200">
        <div className="flex flex-col items-center">
          <span className="font-bold text-3xl text-blue-500">{score}</span>
          <span className="font-bold text-sm text-blue-500">貢献度</span>
        </div>
        <div className="flex flex-col items-center">
          <AddCircleOutlineIcon fontSize='large' className='text-blue-500 font-bold' onClick={() => setOpen(true)} />
          <span className="font-bold text-sm text-blue-500">タスクを作成</span>
        </div>
      </div>
      {tasks !== undefined && tasks.map((task) => {
        return (
          <TaskItem key={task.id} item={task} />
        )
      })}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex items-center justify-center h-full">
          <div className="relative w-full sm:w-1/2 bg-white rounded-md shadow-lg p-8">
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                className="absolute top-1 right-1"
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div className="flex flex-col mt-10">
              <Typography>タイトル</Typography>
              <OutlinedInput
                id="outlined-adornment-weight"
                size="small"
                aria-describedby="outlined-weight-helper-text"
                sx={{ mb: 2 }}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Typography>説明</Typography>
              <TextField
                id="outlined-textarea"
                aria-describedby="outlined-weight-helper-text"
                multiline
                rows={3}
                variant="outlined"
                sx={{ mb: 2 }}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Typography>期限</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    sx={{ mb: 2 }}
                    value={timeValue ?? null}
                    onChange={(newValue) => setTimeValue(newValue!)}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Button variant="contained" onClick={() => handleSubmit()}>タスクを追加</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TaskList;