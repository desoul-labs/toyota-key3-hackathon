import { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import dayjs, { Dayjs } from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, IconButton, Modal, OutlinedInput, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface item {
  id: string;
  title: string;
  description: string;
  expiredAt: string;
  user?: string;
  status: 0 | 1 | 2;
};

function TaskList() {
  const [tasks, setTasks] = useState<item[]>()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [user, setUser] = useState<string>('')

  const [timeValue, setTimeValue] = useState<Dayjs | null>();
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const TaskCreationClicked = () => {
    setOpen(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://toyota-hackathon.azurewebsites.net/api/GetTasks');
      const data = await response.json();
      console.log(data)
      setTasks(data);
    }
    fetchData()
  }, [])

  const createTask = async () => {
    const task: item = {
      id: '4',
      title: title,
      description: description,
      expiredAt: timeValue?.toString() as string,
      status: 0
    }
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
    }
    setOpen(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2 border-b-2 border-gray-200">
        <div className="flex flex-col items-center">
          <span className="font-bold text-3xl text-blue-500">180</span>
          <span className="font-bold text-sm text-blue-500">貢献度</span>
        </div>
        <div className="flex flex-col items-center">
          <AddCircleOutlineIcon fontSize='large' className='text-blue-500 font-bold' onClick={() => TaskCreationClicked()} />
          <span className="font-bold text-sm text-blue-500">タスクを作成</span>
        </div>
      </div>
      {tasks !== undefined && tasks.map((task) => {
        return (
          <TaskItem key={task.id} item={task as item} />
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
                    value={timeValue}
                    onChange={(newValue) => setTimeValue(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Button variant="contained" onClick={() => createTask()}>タスクを追加</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TaskList;