import { useContext, useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import dayjs, { Dayjs } from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, CircularProgress, Dialog, DialogTitle, IconButton, Modal, OutlinedInput, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ApiContext } from './context/ApiContext';
import ABI from './task_manager/artifacts/task_manager.json';
import { ContractPromise, Abi } from '@polkadot/api-contract';
import { WeightV2 } from '@polkadot/types/interfaces';
import { Keyring } from '@polkadot/api';
import BN from "bn.js";
import { u64 } from '@polkadot/types';
interface item {
  id: string;
  title: string;
  description: string;
  expiredAt: string;
  user?: string;
  status: 0 | 1 | 2; // 0: not started, 1: in progress, 2: completed
};

const timeTest = new BN(2_168_018_840_013)
const address: string =
  process.env.CONTRACT_ADDRESS ||
  'Z9hGfS7gvyvPLjAMne9qkJjmgS9EPbktxrmVz17nc6sypXE';

function TaskList() {
  const [tasks, setTasks] = useState<item[]>()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [contract, setContract] = useState<ContractPromise>()
  const [user, setUser] = useState<string>('')
  const [successMsg, setSuccessMsg] = useState('');

  const [timeValue, setTimeValue] = useState<Dayjs | undefined>()
  const { api, apiReady } = useContext(ApiContext);

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

  useEffect(() => {
    if (!api || !apiReady) {
      console.log('api is not ready');
      return;
    }
    const abi = new Abi(ABI, api.registry.getChainProperties());
    const contract = new ContractPromise(api, abi, address);
    setLoading(false);
    setContract(contract);
    console.log(contract)
    const test = api?.query.timestamp.now()
    console.log(test)
  }, [api, apiReady]);

  const createTask = async () => {
    setSuccessMsg('');
    if (!api || !apiReady) {
      console.log('The API is not ready');
      return;
    }

    if (!contract) {
      console.log('no contract');
      return;
    }

    setLoading(true);
    //Alice, Bob, Charlie, Dave, Eve and Ferdie
    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Eve', { name: 'Alice default' });

    let deadline: u64;
    api.query.timestamp.now().then((blockTime1: any) => {
      deadline = api.registry.createType('u64', blockTime1.toNumber());
    })
    // Todo: calculate deadline (blocktime + unix time)
    const unsub = await contract.tx
      .createTask(
        // deadline as any,
        {
          gasLimit: api.registry.createType('WeightV2', {
            refTime: 3951114240,
            proofSize: 629760,
          }) as WeightV2
        },
      )
      .signAndSend(alice, (res: any) => {
        if (res.status.isInBlock) {
          console.log('in a block');
        }
        if (res.status.isFinalized) {
          setLoading(false);
          const today = new Date();
          const twoYearsLater = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
          localStorage.setItem('expiredAt', twoYearsLater.toISOString());
          setSuccessMsg('Success!');
          console.log('finalized');
          res.events.forEach((record: any) => {
            const { event } = record;
            console.log('event', event.toHuman());
          });
        }
      })

    if (successMsg !== '') {
      const task: item = {
        id: '4',
        title: title,
        description: description,
        expiredAt: timeValue!.unix().toString(),
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
    }

    setOpen(false)
  }

  return (
    <div>
      <Dialog onClose={handleClose} open={loading}>
        <DialogTitle>Please wait</DialogTitle>
        <Box
          sx={{
            width: '250px',
            height: '250px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Dialog>
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
                    value={timeValue ?? null}
                    onChange={(newValue) => setTimeValue(newValue!)}
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