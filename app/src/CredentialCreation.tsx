import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ContractPromise, Abi } from '@polkadot/api-contract';
import { WeightV2 } from '@polkadot/types/interfaces';
import { Keyring } from '@polkadot/api';
import ABI from './sbt/artifacts/sbt.json';
import { ApiContext } from './context/ApiContext';

const address: string =
  process.env.CONTRACT_ADDRESS ||
  'YXpfeRsSxi4mv4FhQ6fkqF6LdgTw8L36PcYvtZsoesBppwZ';

function CredentialCreation() {
  const { api, apiReady } = useContext(ApiContext);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<ContractPromise>();
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  // const contract = new Contract('ZgWBeHcntdGeyUsNc7mj51gf5trNdMr3Gc9X5tYExYSAXQA', alice, api);
  // const sbtQuery = new SbtQuery(contract, api, alice.address);
  // const sbtTx = new SbtTx(api, contract, alice);
  useEffect(() => {
    if (!api || !apiReady) {
      console.log('api is not ready');
      return;
    }
    const abi = new Abi(ABI, api.registry.getChainProperties());
    const contract = new ContractPromise(api, abi, address);
    setLoading(false);
    setContract(contract);
  }, [api, apiReady]);

  const handleSubmit = async () => {
    setSuccessMsg('');
    if (department === '' || skill === '' || name === '') {
      return;
    }

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
    const alice = keyring.addFromUri('//Ferdie', { name: 'Alice default' });
    const unsub = await contract.tx
      .mintToken({
        gasLimit: api.registry.createType('WeightV2', {
          refTime: 3951114240,
          proofSize: 629760,
        }) as WeightV2,
      })
      .signAndSend(alice, (res: any) => {
        if (res.status.isInBlock) {
          console.log('in a block');
        }
        if (res.status.isFinalized) {
          setLoading(false);
          localStorage.setItem('name', name);
          localStorage.setItem('department', department);
          localStorage.setItem('skill', skill);
          localStorage.setItem('address', alice.address);
          localStorage.setItem('startedAt', new Date().toISOString());
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
      });
    if (successMsg !== '') {
      const sbt = {
        id: '3',
        name: name,
        department: department,
        skill: skill,
        address: alice.address,
        startedAt: new Date().toISOString(),
        expiredAt: new Date(new Date().getFullYear() + 2, new Date().getMonth(), new Date().getDate()).toISOString(),
      }
      const response = await fetch('https://toyota-hackathon.azurewebsites.net/api/CreateSbt', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sbt)
      })
      setTimeout(() => navigate('/'), 1000);
    }


  };

  const handleClose = () => {
    setLoading(false);
  };

  return (
    <Box className="min-h-screen flex justify-center items-center">
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
        <Typography sx={{ color: 'green' }}>{successMsg}</Typography>
      </Box>
    </Box>
  );
}

export default CredentialCreation;
