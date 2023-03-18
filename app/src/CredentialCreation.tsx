import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useSbtQuery, useSbtTx } from './hooks/useContracts';
import { useAccount } from './hooks/useAccounts';
import { toast } from 'react-toastify';

function CredentialCreation() {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [skill, setSkill] = useState('');
  const navigate = useNavigate();
  const account = useAccount();
  const { totalSupply } = useSbtQuery(account.address);
  const { mintToken } = useSbtTx(account);

  const handleSubmit = async () => {
    if (department === '' || skill === '' || name === '') {
      return;
    }

    const tokenId = await totalSupply();

    const res = mintToken().then(async (res) => {
      console.log(res)

      localStorage.setItem('name', name);
      localStorage.setItem('department', department);
      localStorage.setItem('skill', skill);
      localStorage.setItem('address', account.address);
      localStorage.setItem('startedAt', new Date().toISOString());
      const today = new Date();
      const twoYearsLater = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
      localStorage.setItem('expiredAt', twoYearsLater.toISOString());

      const sbt = {
        id: tokenId,
        name: name,
        department: department,
        skill: skill,
        address: account.address,
        startedAt: new Date().toISOString(),
        expiredAt: new Date(new Date().getFullYear() + 2, new Date().getMonth(), new Date().getDate()).toISOString(),
      };
      await fetch('https://toyota-hackathon.azurewebsites.net/api/CreateSbt', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sbt)
      });

      setTimeout(() => navigate('/'), 1000);
    });

    toast.promise(res, {
      pending: '社員証を作成中...',
      success: '社員証を作成できた！',
      error: '社員証を作成できなかった、、、\n既に社員証をお持ちですか？',
    });
  };

  return (
    <Box className="min-h-screen flex justify-center items-center">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '300px',
        }}
      >
        <Typography>address: {account.address}</Typography>
        <InputLabel className="text-sm">名前</InputLabel>
        <TextField
          className="w-full"
          size="small"
          variant="outlined"
          onChange={(event) => setName(event.target.value)}
        />
        <InputLabel className="text-sm mt-5">希望部署</InputLabel>
        <Select
          value={department}
          className="h-10 w-full mb-5 bg-white rounded-md border border-gray-400 pl-2 pr-8 text-sm focus:outline-none focus:border-teal-600"
          sx={{ '& .MuiSelect-selected': { bgcolor: 'teal.600' } }}
          onChange={(event) => setDepartment(event.target.value)}
        >
          <MenuItem value="product">プロダクト開発部</MenuItem>
          <MenuItem value="marketing">マーケティング</MenuItem>
          <MenuItem value="hr">人事部</MenuItem>
        </Select>
        <InputLabel className="text-sm">活かせる知識・スキル</InputLabel>
        <Select
          value={skill}
          className="h-10 w-full mb-7 bg-white rounded-md border border-gray-400 pl-2 pr-8 text-sm focus:outline-none focus:border-teal-600"
          sx={{ '& .MuiSelect-selected': { bgcolor: 'teal.600' } }}
          onChange={(event) => setSkill(event.target.value)}
        >
          <MenuItem value="ui">UI</MenuItem>
          <MenuItem value="development">開発</MenuItem>
          <MenuItem value="planning">企画</MenuItem>
        </Select>
        <Button
          variant="outlined"
          className="bg-teal-600 text-white w-full h-10 rounded-md"
          disabled={department === '' || skill === '' || name === ''}
          onClick={() => handleSubmit()}
          sx={{ mb: 1 }}
        >
          社員証を受け取る
        </Button>
        {(department === '' || skill === '' || name === '') && (
          <Typography variant="caption" className="text-red-500 text-sm mt-2">
            全ての情報を入力してください
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default CredentialCreation;
