import { Abi, ContractPromise } from "@polkadot/api-contract";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../context/ApiContext";
import SBT_ABI from '../sbt/artifacts/sbt.json';
import { type KeyringPair } from '@polkadot/keyring/types'
import { type ApiPromise } from '@polkadot/api';
import { type WeightV2 } from '@polkadot/types/interfaces';
import TASK_ABI from '../task_manager/artifacts/task_manager.json';
import PROPOSAL_ABI from '../proposal_manager/artifacts/proposal_manager.json';
import { AccountId } from "../sbt/typedContract/types-arguments/sbt";

const SBT_CONTRACT_ADDR = 'YXpfeRsSxi4mv4FhQ6fkqF6LdgTw8L36PcYvtZsoesBppwZ';
const TASK_CONTRACT_ADDR = 'Z9hGfS7gvyvPLjAMne9qkJjmgS9EPbktxrmVz17nc6sypXE';
const PROPOSAL_CONTRACT_ADDR = 'X79VMwE553iYesPWwuHN8FpJUKHqfnJu8sTK5MkMv6J3Sni';

const createWeightV2 = (api: ApiPromise, refTime: number, proofSize: number) => {
  return {
    gasLimit: api.registry.createType('WeightV2', {
      refTime,
      proofSize,
    }) as WeightV2,
  }
}

export function useSbtContract() {
  const { api, apiReady } = useContext(ApiContext);
  const [contract, setContract] = useState<ContractPromise>();

  useEffect(() => {
    if (!api || !apiReady) {
      console.log('api is not ready');
      return;
    }
    const abi = new Abi(SBT_ABI, api.registry.getChainProperties());
    const ctr = new ContractPromise(api, abi, SBT_CONTRACT_ADDR);
    setContract(ctr);
  }, [api, apiReady]);

  const mintToken = async (signer: KeyringPair) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const unsub = await contract.tx
      .mintToken(createWeightV2(api, 3951114240, 629760))
      .signAndSend(signer, (res) => {
        if (res.isCompleted) {
          console.log('completed');
          Promise.resolve(res);
        }
        if (res.isError) {
          console.log('error');
          Promise.reject(res);
        }
        unsub();
      });
  }

  const ownersTokenByIndex = async (signer: KeyringPair, account: string, index: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const tokenId = await contract.query.ownersTokenByIndex(signer.address, { gasLimit: -1 }, account, index);
    return tokenId.result.toHuman();
  }

  const ownerOf = async (signer: KeyringPair, tokenId: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const owner = await contract.query.ownerOf(signer.address, { gasLimit: -1 }, tokenId);
    return owner.result.toHuman();
  }

  return {
    mintToken,
    ownersTokenByIndex,
    ownerOf,
  }
}

export function useTaskContract() {
  const { api, apiReady } = useContext(ApiContext);
  const [contract, setContract] = useState<ContractPromise>();

  useEffect(() => {
    if (!api || !apiReady) {
      console.log('api is not ready');
      return;
    }
    const abi = new Abi(TASK_ABI, api.registry.getChainProperties());
    const ctr = new ContractPromise(api, abi, TASK_CONTRACT_ADDR);
    setContract(ctr);
  }, [api, apiReady]);

  const createTask = async (signer: KeyringPair, deadline: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const unsub = await contract.tx
      .createTask(createWeightV2(api, 6164667490, 867985), deadline)
      .signAndSend(signer, (res) => {
        if (res.isCompleted) {
          console.log('completed');
          Promise.resolve(res);
        }
        if (res.isError) {
          console.log('error');
          Promise.reject(res);
        }
        unsub();
      });
  }

  const takeTask = async (signer: KeyringPair, id: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const unsub = await contract.tx
      .takeTask(createWeightV2(api, 6166686531, 867985), id)
      .signAndSend(signer, (res) => {
        if (res.isCompleted) {
          console.log('completed');
          Promise.resolve(res);
        }
        if (res.isError) {
          console.log('error');
          Promise.reject(res);
        }
        unsub();
      });
  }

  const completeTask = async (signer: KeyringPair, id: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const unsub = await contract.tx
      .completeTask(createWeightV2(api, 6165514785, 867985), id)
      .signAndSend(signer, (res) => {
        if (res.isCompleted) {
          console.log('completed');
          Promise.resolve(res);
        }
        if (res.isError) {
          console.log('error');
          Promise.reject(res);
        }
        unsub();
      }
      );
  }

  const getTaskCount = async (signer: KeyringPair) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const total = await contract.query.totalSupply(signer.address, { gasLimit: -1 });
    return total.result.toHuman();
  }

  const getOwnerOfTask = async (signer: KeyringPair, id: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const owner = await contract.query.ownerOf(signer.address, { gasLimit: -1 }, id);
    return owner.result.toHuman();
  }

  const isTaskCompleted = async (signer: KeyringPair, id: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const isCompleted = await contract.query.isCompleted(signer.address, { gasLimit: -1 }, id);
    return isCompleted.result.toHuman();
  }

  const getTaskDeadline = async (signer: KeyringPair, id: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const deadline = await contract.query.getDeadline(signer.address, { gasLimit: -1 }, id);
    return deadline.result.toHuman();
  }

  const getScore = async (signer: KeyringPair, account: AccountId) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const score = await contract.query.getScore(signer.address, { gasLimit: -1 }, account);
    return score.result.toHuman();
  }

  const getTotalScore = async (signer: KeyringPair) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const score = await contract.query.getTotalScore(signer.address, { gasLimit: -1 });
    return score.result.toHuman();
  }

  const evaluateTask = async (signer: KeyringPair, id: number, score: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const unsub = await contract.tx
      .evaluateTask(createWeightV2(api, 6168911293, 867985), id, score)
      .signAndSend(signer, (res) => {
        if (res.isCompleted) {
          console.log('completed');
          Promise.resolve(res);
        }
        if (res.isError) {
          console.log('error');
          Promise.reject(res);
        }
        unsub();
      });
  }

  return {
    createTask,
    takeTask,
    completeTask,
    getTaskCount,
    getOwnerOfTask,
    isTaskCompleted,
    getTaskDeadline,
    getScore,
    getTotalScore,
  }
}

export function useProposalContract() {
  const { api, apiReady } = useContext(ApiContext);
  const [contract, setContract] = useState<ContractPromise>();

  useEffect(() => {
    if (!api || !apiReady) {
      console.log('api is not ready');
      return;
    }
    const abi = new Abi(PROPOSAL_ABI, api.registry.getChainProperties());
    const ctr = new ContractPromise(api, abi, PROPOSAL_CONTRACT_ADDR);
    setContract(ctr);
  }, [api, apiReady]);

  const createProposal = async (signer: KeyringPair, deadline: number, optionCount: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const unsub = await contract.tx
      .createProposal(createWeightV2(api, 6289762248, 904461), deadline, optionCount)
      .signAndSend(signer, (res) => {
        if (res.isCompleted) {
          console.log('completed');
          Promise.resolve(res);
        }
        if (res.isError) {
          console.log('error');
          Promise.reject(res);
        }
        unsub();
      });
  }

  const voteProposal = async (signer: KeyringPair, id: number, votes: number[]) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const unsub = await contract.tx
      .voteProposal(createWeightV2(api, 6309578895, 904461), id, votes)
      .signAndSend(signer, (res) => {
        if (res.isCompleted) {
          console.log('completed');
          Promise.resolve(res);
        }
        if (res.isError) {
          console.log('error');
          Promise.reject(res);
        }
        unsub();
      });
  }

  const getProposalCount = async (signer: KeyringPair) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const total = await contract.query.totalSupply(signer.address, { gasLimit: -1 });
    return total.result.toHuman();
  }

  const getProposal = async (signer: KeyringPair, id: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const proposal = await contract.query.getProposal(signer.address, { gasLimit: -1 }, id);
    return proposal.result.toHuman();
  }

  const getCreatorOfProposal = async (signer: KeyringPair, id: number) => {
    if (!api || !contract) {
      console.log('contract is not ready');
      return;
    }

    const creator = await contract.query.ownerOf(signer.address, { gasLimit: -1 }, id);
    return creator.result.toHuman();
  }

  return {
    createProposal,
    voteProposal,
    getProposalCount,
    getProposal,
    getCreatorOfProposal,
  }
}