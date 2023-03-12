import React, { useState } from "react";
import { Avatar, Box, Button, Divider, Input, List, ListItem, ListItemAvatar, ListItemText, Modal, Typography, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import Person2Icon from '@mui/icons-material/Person2';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  item: {
    id: string;
    title: string;
    description: string;
    user?: string;
    expiredAt: string;
    status: 0 | 1 | 2;
  };
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function TaskItem({ item }: Props) {
  const buttonContent: Record<number, string> = {
    0: '',
    1: '自分が担当',
    2: '評価',
    3: '完成する',
    4: '評価済み',
    5: '完成済み',
  }
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
                      {item.user}
                    </Typography>
                    <AccessAlarmIcon />
                    {item.expiredAt}
                  </React.Fragment>
                }
              />
            </div>
            {(item.status > 0 && item.status <= 4) &&
              <Button
                variant="outlined"
                // disabled={item.status === 4 || item.status === 5}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded h-10"
                onClick={handleOpen}
              >
                {buttonContent[item.status]}
              </Button>
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
  );
}

export default TaskItem;