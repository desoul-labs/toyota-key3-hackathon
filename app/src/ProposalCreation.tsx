import { useContext, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { Button, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { ArrowBack } from "@mui/icons-material";
import { useProposalQuery, useProposalTx } from "./hooks/useContracts";
import { useAccount } from "./hooks/useAccounts";
import { toast } from 'react-toastify';
import { ApiContext } from "./context/ApiContext";

interface Proposal {
  id: number;
  title: string;
  user: string;
  description: string;
  options: string[];
  expiredAt: string;
}

function ProposalCreation() {
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [timeValue, setTimeValue] = useState<Dayjs | undefined>()
  const [proposals, setProposals] = useState<Proposal[]>()
  const account = useAccount();
  const { createProposal } = useProposalTx(account);
  const { getProposalCount } = useProposalQuery(account.address);
  const navigate = useNavigate();
  const { api } = useContext(ApiContext);
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

  const handleSubmit = async () => {
    if (timeValue === undefined) {
      toast.error('期限を設定してください')
      return
    }
    if (timeValue < dayjs()) {
      toast.error('期限を過去に設定することはできません')
      return
    }
    const nextProposalId = await getProposalCount();
    const proposal: Proposal = {
      id: nextProposalId,
      user: localStorage.getItem('name')!,
      title: title,
      description: description,
      options: options,
      expiredAt: timeValue!.unix().toString()
    }
    const blockTime = await (await api.query.timestamp.now()).toString()
    const deadline = timeValue!.unix() - dayjs().unix() + parseInt(blockTime)
    const res = createProposal(deadline, options.length).then(async (res) => {
      console.log(res)
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
    })

    toast.promise(res, {
      pending: '提案を作成中...',
      success: '提案を作成しました',
      error: '提案の作成に失敗しました'
    });
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
          <Button variant="contained" onClick={() => handleSubmit()}>提案を作成</Button>
        </div>
      </div>
    </div>
  );
}

export default ProposalCreation;