import { Abi, ContractPromise } from "@polkadot/api-contract";
import { useCallback, useContext, useMemo } from "react";
import { ApiContext } from "../context/ApiContext";
import SBT_ABI from '../sbt/artifacts/sbt.json';
import { type KeyringPair } from '@polkadot/keyring/types'
import { type ApiPromise } from '@polkadot/api';
import { type WeightV2 } from '@polkadot/types/interfaces';
import TASK_ABI from '../task_manager/artifacts/task_manager.json';
import PROPOSAL_ABI from '../proposal_manager/artifacts/proposal_manager.json';
import SBTQuery from "../sbt/typedContract/query/sbt";
import SBTTx from "../sbt/typedContract/tx-sign-and-send/sbt";
import TaskQuery from "../task_manager/typedContract/query/task_manager";
import TaskTx from "../task_manager/typedContract/tx-sign-and-send/task_manager";
import ProposalQuery from "../proposal_manager/typedContract/query/proposal_manager";
import ProposalTx from "../proposal_manager/typedContract/tx-sign-and-send/proposal_manager";
import { AccountId, Id } from "../sbt/typedContract/types-returns/sbt";
import { IdBuilder } from "../sbt/typedContract/types-arguments/sbt";
import { SignAndSendSuccessResponse } from "@727-ventures/typechain-types";

const SBT_CONTRACT_ADDR = 'WRFXJrDKdqzGqwdhhwrFMEmqW3GzTQM5JWSaGA3DRWdqTKZ';
const TASK_CONTRACT_ADDR = 'W1YVcMWmVA6NuyiFt5TmfoCPhqfU49CM26vZTK6gjUB2FS5';
const PROPOSAL_CONTRACT_ADDR = 'bE3zgoZaUJ8v83zGd3at83VoZguusiCG3ih7xXauREGJUpz';

const createWeightV2 = (api: ApiPromise, refTime: number, proofSize: number) => {
  return {
    gasLimit: api.registry.createType('WeightV2', {
      refTime,
      proofSize,
    }) as WeightV2,
  }
}

export function useSbtQuery(caller: string) {
  const { api } = useContext(ApiContext);
  const queryStub = useMemo(() => {
    const abi = new Abi(SBT_ABI, api.registry.getChainProperties());
    const contract = new ContractPromise(api, abi, SBT_CONTRACT_ADDR);
    return new SBTQuery(contract, api, caller)
  }, [api, caller]);

  const ownersTokenByIndex = useCallback(async (owner: string, index: number) => {
    return new Promise<Id>(async (resolve, reject) => {
      const res = await queryStub
        .ownersTokenByIndex(owner, index)
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        if (res.ok.err !== undefined) {
          reject(res.ok.err);
        }
        if (res.ok.ok !== undefined) {
          resolve(res.ok.ok);
        }
      }
    });
  }, [queryStub]);

  const ownerOf = useCallback(async (id: number) => {
    return new Promise<AccountId | null>(async (resolve, reject) => {
      const res = await queryStub
        .ownerOf(IdBuilder.U32(id))
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
  }, [queryStub]);

  const totalSupply = useCallback(async () => {
    return new Promise<number>(async (resolve, reject) => {
      const res = await queryStub
        .totalSupply()
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok.toNumber());
      }
    });
  }, [queryStub]);

  return {
    ownersTokenByIndex,
    ownerOf,
    totalSupply,
  }
}

export function useSbtTx(signer: KeyringPair) {
  const { api } = useContext(ApiContext);
  const txStub = useMemo(() => {
    const abi = new Abi(SBT_ABI, api.registry.getChainProperties());
    const contract = new ContractPromise(api, abi, SBT_CONTRACT_ADDR);
    return new SBTTx(api, contract, signer)
  }, [api, signer]);

  const mintToken = useCallback(async () => {
    return new Promise<SignAndSendSuccessResponse>(async (resolve, reject) => {
      await txStub
        .mintToken(createWeightV2(api, 3951114240, 629760))
        .then(
          (val) => {
            if (val.error !== undefined) {
              reject(val.error);
              return;
            }
            resolve(val);
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }, [api, txStub]);

  return {
    mintToken,
  }
}

export function useTaskQuery(caller: string) {
  const { api } = useContext(ApiContext);
  const queryStub = useMemo(() => {
    const abi = new Abi(TASK_ABI, api.registry.getChainProperties());
    const contract = new ContractPromise(api, abi, TASK_CONTRACT_ADDR);
    return new TaskQuery(contract, api, caller)
  }, [api, caller]);

  const getTaskCount = useCallback(async () => {
    return new Promise<number>(async (resolve, reject) => {
      const res = await queryStub
        .totalSupply()
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok.toNumber());
      }
    });
  }, [queryStub]);


  const getOwnerOfTask = useCallback(async (id: number) => {
    return new Promise<AccountId | null>(async (resolve, reject) => {
      const res = await queryStub
        .ownerOf(IdBuilder.U32(id))
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
  }, [queryStub]);

  const isTaskCompleted = useCallback(async (id: number) => {
    return new Promise<boolean>(async (resolve, reject) => {
      const res = await queryStub
        .isCompleted(IdBuilder.U32(id))
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
  }, [queryStub]);

  const isEvaluated = useCallback(async (id: number, account: AccountId) => {
    return new Promise<boolean>(async (resolve, reject) => {
      const res = await queryStub
        .isEvaluated(IdBuilder.U32(id), account)
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
  }, [queryStub])

  const getTaskDeadline = useCallback(async (id: number) => {
    return new Promise<number>(async (resolve, reject) => {
      const res = await queryStub
        .getDeadline(IdBuilder.U32(id))
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
  }, [queryStub]);

  const getScore = useCallback(async (account: AccountId) => {
    return new Promise<number>(async (resolve, reject) => {
      const res = await queryStub
        .getScore(account)
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
  }, [queryStub]);

  const getTotalScore = useCallback(async () => {
    return new Promise<number>(async (resolve, reject) => {
      const res = await queryStub
        .getTotalScore()
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
  }, [queryStub]);

  return {
    getTaskCount,
    getOwnerOfTask,
    isTaskCompleted,
    getTaskDeadline,
    isEvaluated,
    getScore,
    getTotalScore,
  }
}

export function useTaskTx(signer: KeyringPair) {
  const { api } = useContext(ApiContext);
  const txStub = useMemo(() => {
    const abi = new Abi(TASK_ABI, api.registry.getChainProperties());
    const contract = new ContractPromise(api, abi, TASK_CONTRACT_ADDR);
    return new TaskTx(api, contract, signer)
  }, [api, signer]);

  const createTask = useCallback(async (deadline: number) => {
    return new Promise<SignAndSendSuccessResponse>(async (resolve, reject) => {
      await txStub
        .createTask(deadline, createWeightV2(api, 6168068921, 868490))
        .then(
          (val) => {
            if (val.error !== undefined) {
              reject(val.error);
              return;
            }
            resolve(val);
          },
          (err) => {
            console.log(err);
            reject(err);
          },
        );
    });
  }, [api, txStub]);

  const completeTask = useCallback(async (id: number) => {
    return new Promise<SignAndSendSuccessResponse>(async (resolve, reject) => {
      await txStub
        .completeTask(IdBuilder.U32(id), createWeightV2(api, 6169586765, 868490))
        .then(
          (val) => {
            if (val.error !== undefined) {
              reject(val.error);
              return;
            }
            resolve(val);
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }, [api, txStub]);

  const evaluateTask = useCallback(async (id: number, score: number) => {
    return new Promise<SignAndSendSuccessResponse>(async (resolve, reject) => {
      await txStub
        .evaluateTask(IdBuilder.U32(id), score, createWeightV2(api, 8207359113, 1040413))
        .then(
          (val) => {
            if (val.error !== undefined) {
              reject(val.error);
              return;
            }
            resolve(val);
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }, [api, txStub]);

  return {
    createTask,
    completeTask,
    evaluateTask,
  }
}

export function useProposalQuery(caller: string) {
  const { api } = useContext(ApiContext);
  const queryStub = useMemo(() => {
    const abi = new Abi(PROPOSAL_ABI, api.registry.getChainProperties());
    const contract = new ContractPromise(api, abi, PROPOSAL_CONTRACT_ADDR);
    return new ProposalQuery(contract, api, caller);
  }, [api, caller]);

  const getProposalCount = useCallback(async () => {
    return new Promise<number>(async (resolve, reject) => {
      const res = await queryStub
        .totalSupply()
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok.toNumber());
      }
    });
  }, [queryStub]);

  const getProposal = useCallback(async (id: number) => {
    return new Promise<number[]>(async (resolve, reject) => {
      const res = await queryStub
        .getProposal(IdBuilder.U32(id))
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
  }, [queryStub]);

  const getCreatorOfProposal = useCallback(async (id: number) => {
    return new Promise<AccountId | null>(async (resolve, reject) => {
      const res = await queryStub
        .ownerOf(IdBuilder.U32(id))
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
  }, [queryStub]);

  const isVoted = useCallback(async (id: number, voter: string) => {
    return new Promise<boolean>(async (resolve, reject) => {
      const res = await queryStub
        .isVoted(IdBuilder.U32(id), voter)
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
  }, [queryStub])

  const getVoteCredit = useCallback(async (voter: string) => {
    return new Promise<number>(async (resolve, reject) => {
      const res = await queryStub
        .getVoteCredit(voter)
        .then((ret) => ret.value);
      if (res.err !== undefined) {
        reject(res.err);
      }
      if (res.ok !== undefined) {
        resolve(res.ok);
      }
    });
    }, [queryStub])

  return {
    getProposalCount,
    getProposal,
    getCreatorOfProposal,
    isVoted,
    getVoteCredit
  }
}

export function useProposalTx(signer: KeyringPair) {
  const { api } = useContext(ApiContext);
  const txStub = useMemo(() => {
    const abi = new Abi(PROPOSAL_ABI, api.registry.getChainProperties());
    const contract = new ContractPromise(api, abi, PROPOSAL_CONTRACT_ADDR);
    return new ProposalTx(api, contract, signer);
  }, [api, signer]);

  const createProposal = useCallback(async (deadline: number, optionCount: number) => {
    return new Promise<SignAndSendSuccessResponse>(async (resolve, reject) => {
      await txStub
        .createProposal(deadline, optionCount, createWeightV2(api, 6257725623, 874641))
        .then(
          (val) => {
            if (val.error !== undefined) {
              reject(val.error);
              return;
            }
            resolve(val);
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }, [api, txStub]);

  const voteProposal = useCallback(async (id: number, votes: number[]) => {
    return new Promise<SignAndSendSuccessResponse>(async (resolve, reject) => {
      await txStub
        .voteProposal(IdBuilder.U32(id), votes, createWeightV2(api, 13746373035, 1455660))
        .then(
          (val) => {
            if (val.error !== undefined) {
              reject(val.error);
              return;
            }
            resolve(val);
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }, [api, txStub]);

  return {
    createProposal,
    voteProposal,
  }
}