import { Button, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import Person2Icon from '@mui/icons-material/Person2';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { useState } from "react";
function ProposalItemDetail() {
  const [options, setOptions] = useState<string[]>(['option1', 'option2', 'option3', 'option4']);
  const [totalVotes, setTotalVotes] = useState<number>(20)
  const [votes, setVotes] = useState<number[]>([0, 0, 0, 0])
  const IncreaseNumber = (index: number) => {
    setTotalVotes(totalVotes - 1)
    setVotes(prevVotes => {
      const newVotes = [...prevVotes];
      newVotes[index] += 1;
      return newVotes;
    })
  }
  const cancelClicked = () => {
    setTotalVotes(20)
    setVotes([0, 0, 0, 0])
  }
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-full sm:w-1/2 bg-white rounded-md p-8">
        <div className="flex flex-col items-center justify-center mt-2">
          <Typography sx={{ fontSize: "20px" }}>タイトル</Typography>
          <div className="flex flex-row items-center justify-center mt-2">
            <AccessAlarmIcon />
            <Typography sx={{ marginRight: 3 }}>2021/10/10 10:00</Typography>
            <Person2Icon />
            <Typography>user1</Typography>
          </div>
          <Typography sx={{ marginTop: 2 }}>説明です</Typography>
        </div>
        {options.map((option, index) => (
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mr-2">
              <span className="text-white font-medium">{votes[index]}</span>
            </div>
            <Button sx={{ marginTop: 1, marginButton: 1, width: "80%" }} onClick={() => IncreaseNumber(index)} variant="outlined">{index + 1}. {option}</Button>
          </div>
        ))}
        <div className="flex items-center justify-center mt-2">
          <div className="mr-2">残りの票数: </div>
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mr-2">
            <span className="text-white font-medium">{totalVotes}</span>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="contained" color="error" onClick={() => cancelClicked()} className="w-full mx-2">
            クリア
          </Button>
          <Button variant="contained" className="w-full mx-2">
            決定
          </Button>
        </div>

      </div>
    </div >
  );
}

export default ProposalItemDetail;