import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Input, List, ListItem, ListItemAvatar, ListItemText, Modal, Typography, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import Person2Icon from '@mui/icons-material/Person2';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CloseIcon from '@mui/icons-material/Close';
import { useTaskQuery, useTaskTx, useSbtQuery } from './hooks/useContracts';
import { useAccount } from "./hooks/useAccounts";
import { Item } from "./types/task";
import { toast } from 'react-toastify';

interface Props {
  item: Item;
}

const TASK_CONTRACT_ADDR = 'Ymi3RJKiQoJUFqpiDoKkoJAtgEcZMmu9QqempavBza57TPw';

function TaskItem({ item }: Props) {
  const [open, setOpen] = useState(false);
  const { account } = useAccount('//Lily');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [owner, setOwner] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [evaluation, setEvaluation] = useState<string>('');
  const { getOwnerOfTask, isTaskCompleted } = useTaskQuery(account.address);
  const { takeTask, evaluateTask } = useTaskTx(account);

  useEffect(() => {
    const checkTaskCompleted = async () => {
      const result = await isTaskCompleted(item.id);
      setTaskCompleted(result as boolean)
      const owner = await getOwnerOfTask(item.id);

      if (owner) {
        console.log('owner', owner.toString());
        setOwner(owner.toString());
      }
    }
    checkTaskCompleted();
  }, [getOwnerOfTask, isTaskCompleted, item.id])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://toyota-hackathon.azurewebsites.net/api/sbt/${owner}`);
      const data = await response.json();
      setName(data);
      console.log(data)
    }
    fetchData()
  }, [owner])
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleEvaluationSubmit = async () => {
    if (!isNaN(parseInt(evaluation))) {
      if (parseInt(evaluation) < 0 || parseInt(evaluation) > 100) {
        toast.error('評価は0~100の間で入力してください');
      }
      else {
        const res = evaluateTask(item.id, parseInt(evaluation)).then(async (res) => {
          console.log(res)
        });
        toast.promise(res, {
          pending: 'タスクを担当しようとしています',
          success: 'タスクを担当しました',
          error: 'タスクの担当に失敗しました'
        });
      }
    }
    else {
      toast.error('評価は数値で入力してください');
    }
  }
  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem alignItems="flex-start">
          <div className='flex justify-between w-full'>
            <div className="flex flex-col">
              <h4 className='mb-2'>{item.title}</h4>
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Person2Icon />
                    <Typography
                      sx={{ display: 'inline', marginRight: '10px' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {owner === TASK_CONTRACT_ADDR ? '' : name}
                    </Typography>
                    <AccessAlarmIcon />
                    {item.expiredAt}
                  </React.Fragment>
                }
              />
            </div>
            {taskCompleted ? (
              <Button
                variant="outlined"
                // disabled={item.status === 4 || item.status === 5}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded h-10"
                onClick={handleOpen}
              >
                評価
              </Button>
            ) : null
            }
          </div>
        </ListItem >
        <Divider sx={{ borderBottomWidth: 1, backgroundColor: "black" }} component="li" />
      </List >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <div className="fixed w-1/2 min-w-full h-2/3 top-1/4 left-1/4 bg-white rounded-md shadow-lg p-8"> */}
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
            <h2 className="text-2xl font-bold mb-4 text-center">{item.title}</h2>
            <div className="flex items-center mb-4">
              <Person2Icon fontSize="large" className="text-gray-500 mr-2" />
              <span className="text-lg font-bold">{item.user}</span>
              <span className="ml-4 text-gray-500">
                {new Date(parseInt(item.expiredAt) * 1000).toLocaleString().slice(0, 10)}
              </span>
            </div>
            <p className="text-lg text-gray-800">
              {item.description}
            </p>
            <div className="flex flex-col mt-10">
              <Typography>評価点(0-100)</Typography>
              <OutlinedInput
                id="outlined-adornment-weight"
                size="small"
                aria-describedby="outlined-weight-helper-text"
                sx={{ mb: 2 }}
                onChange={(e) => setEvaluation(e.target.value)}
              />
              <Button onClick={() => handleEvaluationSubmit()} variant="contained">評価</Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <div className="fixed w-1/2 min-w-full h-2/3 top-1/4 left-1/4 bg-white rounded-md shadow-lg p-8"> */}
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
            <h2 className="text-2xl font-bold mb-4 text-center">{item.title}</h2>
            <div className="flex items-center mb-4">
              <Person2Icon fontSize="large" className="text-gray-500 mr-2" />
              <span className="text-lg font-bold">{item.user}</span>
              <span className="ml-4 text-gray-500">Due Date: 2023-03-01</span>
            </div>
            <p className="text-lg text-gray-800">
              {item.description}
            </p>
            <div className="flex flex-col mt-10">
              <Typography>評価点(0-100)</Typography>
              <OutlinedInput
                id="outlined-adornment-weight"
                size="small"
                aria-describedby="outlined-weight-helper-text"
                sx={{ mb: 2 }}
              />
              <Button variant="contained">評価</Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TaskItem;