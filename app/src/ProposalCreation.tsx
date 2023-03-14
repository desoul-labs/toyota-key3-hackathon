import { useContext, useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import dayjs, { Dayjs } from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, CircularProgress, Dialog, DialogTitle, IconButton, InputAdornment, Modal, OutlinedInput, TextField, Typography } from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { ArrowBack } from "@mui/icons-material";

interface Proposal {
  id: string;
  title: string;
  description: string;
  options: string[];
  expiredAt: string;
}

function ProposalCreation() {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState<string>("0")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [contract, setContract] = useState<ContractPromise>()
  const [user, setUser] = useState<string>("")
  const [successMsg, setSuccessMsg] = useState('');
  const [timeValue, setTimeValue] = useState<Dayjs | undefined>()
  const [proposals, setProposals] = useState<Proposal[]>()
  const navigate = useNavigate();

  const handleClose = () => setOpen(false)

  const [options, setOptions] = useState<string[]>([""]);

  const handleAddClicked = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const BackButtonClicked = () => {
    navigate(`/proposal`);
  }

  //Todo: need to update id(now is always 0)
  const createProposal = async () => {
    const proposal = {
      id: id,
      title: title,
      description: description,
      options: options,
      user: localStorage.getItem('name'),
      expiredAt: timeValue!.unix().toString()
    }
    const response = await fetch('https://toyota-hackathon.azurewebsites.net/api/CreateProposal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proposal)
    })
    if (response.status === 200) {
      const newProposal = proposals === undefined ? [proposal] : [...proposals, proposal];
      setProposals(newProposal);
    }
    navigate('/proposal')
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-full sm:w-1/2 bg-white rounded-md p-8">
        <IconButton onClick={() => BackButtonClicked()}>
          <ArrowBack />
        </IconButton>
        <div className="flex-1 flex justify-center">
          <Typography sx={{ fontSize: "20px" }}>提案を作成</Typography>
        </div>
        <div className="flex flex-col mt-2">
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
          <Typography>選択肢</Typography>
          {options.map((option, index) => (
            <OutlinedInput
              key={index}
              id={`outlined-adornment-weight-${index}`}
              startAdornment={
                <InputAdornment position="start">
                  {index + 1}.
                </InputAdornment>
              }
              size="small"
              aria-describedby={`outlined-weight-helper-text-${index}`}
              sx={{ mb: 2 }}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          ))}
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <AddIcon className="mb-2" onClick={() => handleAddClicked()} />
            </div>
          </div>
          <Button variant="contained" onClick={() => createProposal()}>提案を作成</Button>
        </div>
      </div>
    </div>
  );
}

export default ProposalCreation;