import { Box, Button, CircularProgress, Dialog, DialogTitle, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import Person2Icon from '@mui/icons-material/Person2';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskQuery, useProposalQuery, useProposalTx } from "./hooks/useContracts";
import { useAccount } from "./hooks/useAccounts";
import { toast } from 'react-toastify';

interface Proposal {
  id: string;
  title: string;
  description: string;
  expiredAt: string;
  user: string;
  options: string[];
}

function ProposalItemDetail() {
  const [optionVotes, setOptionVotes] = useState<number[]>([0]);
  const [totalVotedVotes, setTotalVotedVotes] = useState<number>(0)
  const [totalVotes, setTotalVotes] = useState<number>(0)
  const [votes, setVotes] = useState<number[]>([])
  const [proposal, setProposal] = useState<Proposal>()
  const [loading, setLoading] = useState(true);
  const { proposalId } = useParams();
  const [score, setScore] = useState<number>(0)
  const account = useAccount();
  const { getProposalCount, getProposal } = useProposalQuery(account.address);
  const { voteProposal } = useProposalTx(account);
  const { getScore } = useTaskQuery(account.address);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://toyota-hackathon.azurewebsites.net/api/proposal/${proposalId}`);
      const data = await response.json();
      setProposal(data);
      console.log(data)
    }
    fetchData()
    setLoading(false)
  }, [proposalId])

  useEffect(() => {
    const fetchScore = async () => {
      const score = await getScore(account.address)
      setScore(score)
      setTotalVotes(score)
    }
    fetchScore()
  }, [account, getScore])

  useEffect(() => {
    const fetchProposal = async () => {
      if (!proposalId) return
      const proposalOptions = await getProposal(parseInt(proposalId))
      if (proposalOptions) {
        setOptionVotes(proposalOptions)
        setVotes(Array.from({ length: proposalOptions.length }, () => 0))
        setTotalVotedVotes(proposalOptions.reduce((a, b) => a + b, 0))
      }
    }
    fetchProposal()
  }, [getProposal, proposalId])

  const IncreaseNumber = (index: number) => {
    if (totalVotes <= 0) {
      toast.error('You have no more votes')
      return
    }
    setTotalVotes(totalVotes - 1)
    setVotes(prevVotes => {
      const newVotes = [...prevVotes];
      newVotes[index] += 1;
      return newVotes;
    })
  }

  const cancelClicked = () => {
    setTotalVotes(score)
    setVotes(Array.from({ length: optionVotes.length }, () => 0))
  }

  const BackButtonClicked = () => {
    navigate(`/proposal`);
  }

  const handleClose = () => setLoading(false)

  const handleSubmit = async () => {
    // setLoading(true)
    const res = await voteProposal(parseInt(proposalId!), votes).then(async (res) => {
      console.log(res)
    })
    // setLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Dialog onClose={handleClose} open={loading} >
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
      <div className="relative w-full sm:w-1/2 bg-white rounded-md p-8">
        <IconButton onClick={() => BackButtonClicked()}>
          <ArrowBack />
        </IconButton>
        <div className="flex flex-col items-center justify-center mt-2">
          <Typography sx={{ fontSize: "20px" }}>{proposal?.title}</Typography>
          <div className="flex flex-row items-center justify-center mt-2">
            <AccessAlarmIcon />
            <Typography sx={{ marginRight: 3 }}>{new Date(parseInt(proposal?.expiredAt || "0") * 1000).toLocaleString().slice(0, 10)}</Typography>
            <Person2Icon />
            <Typography>user1</Typography>
          </div>
          <Typography sx={{ marginTop: 2 }}>{proposal?.description}</Typography>
        </div>
        {proposal?.expiredAt && parseInt(proposal.expiredAt) * 1000 < Date.now() ?
          optionVotes.map((option, index) => (
            <div className="flex items-center" key={index}>
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mr-2">
                <span className="text-white font-medium">{votes[index]}</span>
              </div>
              {votes[index] === Math.max(...votes) ?
                <Button sx={{
                  marginTop: 1, marginButton: 1, width: "80%", backgroundImage: `linear-gradient(to right, #b9ccff ${optionVotes[index] / totalVotedVotes * 100}%, white ${votes[index] / totalVotedVotes * 100}%, white 100%)`
                }} variant="outlined">{index + 1}. {option}</Button>
                :
                <Button sx={{
                  marginTop: 1, marginButton: 1, width: "80%", backgroundImage: `linear-gradient(to right, #c3c3c3 ${optionVotes[index] / totalVotedVotes * 100}%, white ${votes[index] / totalVotedVotes * 100}%, white 100%)`
                }} variant="outlined">{index + 1}. {option}</Button>
              }
            </div>
          ))
          :
          <>
            {optionVotes.map((option, index) => (
              <div className="flex items-center" key={index}>
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mr-2">
                  <span className="text-white font-medium">{votes[index]}</span>
                </div>
                <Button sx={{
                  marginTop: 1, marginButton: 1, width: "80%"
                }} onClick={() => IncreaseNumber(index)} variant="outlined">{index + 1}. {option}</Button>
              </div>
            ))}
            <div className="flex items-center justify-center mt-2 flex-wrap">
              <div className="mr-2 text-center">残りの票数: </div>
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mr-2">
                <span className="text-white font-medium">{totalVotes}</span>
              </div>
              <div className="flex flex-col w-full justify-center mt-3">
                <Button variant="contained" color="error" onClick={() => cancelClicked()} className="w-full mx-2">
                  クリア
                </Button>
              </div>
              <div className="flex flex-col w-full justify-center mt-3">
                <Button onClick={() => handleSubmit()} variant="contained" className="w-full mx-2">
                  決定
                </Button>
              </div>
            </div>
          </>
        }
      </div >
    </div >
  );
}

export default ProposalItemDetail;