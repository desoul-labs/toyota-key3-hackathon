#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[openbrush::contract]
pub mod proposal_manager {
    use ink::{
        prelude::vec::Vec,
        storage::Mapping,
    };
    use openbrush::{
        contracts::psp34::{
            extensions::{
                enumerable::*,
                metadata::*,
            },
            PSP34Error,
        },
        traits::{
            Storage,
            String,
        },
    };
    use sbt::sbt::SBTRef;
    use task_manager::task_manager::TaskManagerRef;

    #[ink(storage)]
    #[derive(Storage)]
    pub struct ProposalManager {
        #[storage_field]
        psp34: psp34::Data<Balances>,
        #[storage_field]
        metadata: Data,
        next_id: u32,
        proposal: Mapping<Id, Vec<u32>>,
        deadline: Mapping<Id, u64>,
        sbt_contract: SBTRef,
        task_manager: TaskManagerRef,
    }

    impl PSP34 for ProposalManager {}
    impl PSP34Enumerable for ProposalManager {}
    impl PSP34Metadata for ProposalManager {}

    impl ProposalManager {
        #[ink(constructor)]
        pub fn new(sbt_hash: Hash, task_manager_hash: Hash, version: u32) -> Self {
            let mut _instance = ProposalManager {
                psp34: psp34::Data::default(),
                metadata: Data::default(),
                next_id: 0,
                proposal: Mapping::new(),
                deadline: Mapping::new(),
                task_manager: TaskManagerRef::new(sbt_hash, version)
                    .endowment(1000000)
                    .code_hash(task_manager_hash)
                    .salt_bytes(version.to_le_bytes())
                    .instantiate(),
                sbt_contract: SBTRef::new()
                    .endowment(1000000)
                    .code_hash(sbt_hash)
                    .salt_bytes(version.to_le_bytes())
                    .instantiate(),
            };

            let collection_id = _instance.collection_id();
            _instance._set_attribute(
                collection_id.clone(),
                String::from("name"),
                String::from("ProposalManager"),
            );
            _instance._set_attribute(collection_id, String::from("symbol"), String::from("Proposals"));
            _instance
        }

        #[ink(message)]
        pub fn create_proposal(&mut self, deadline: u64, option_count: u8) -> Result<(), PSP34Error> {
            if !self.sbt_contract.has_token() {
                return Err(PSP34Error::Custom("Not a member".into()))
            }
            if deadline < Self::env().block_timestamp() {
                return Err(PSP34Error::Custom("Invalid deadline".into()))
            }

            self._mint_to(Self::env().caller(), Id::U32(self.next_id))?;
            let mut options: Vec<u32> = Vec::new();
            for _ in 0..option_count {
                options.push(0);
            }
            self.proposal.insert(&Id::U32(self.next_id), &options);
            self.next_id += 1;
            Ok(())
        }

        #[ink(message)]
        pub fn get_proposal(&self, id: Id) -> Vec<u32> {
            self.proposal.get(&id).unwrap()
        }

        #[ink(message)]
        pub fn vote_proposal(&mut self, id: Id, votes: Vec<u32>) -> Result<(), PSP34Error> {
            if !self.sbt_contract.has_token() {
                return Err(PSP34Error::Custom("Not a member".into()))
            }
            if self.proposal.get(&id).is_none() {
                return Err(PSP34Error::Custom("Proposal not found".into()))
            }
            if self.deadline.get(&id).unwrap_or(0) < Self::env().block_timestamp() {
                return Err(PSP34Error::Custom("Proposal is closed".into()))
            }
            let mut proposal = self.proposal.get(&id).unwrap();
            if proposal.len() != votes.len() {
                return Err(PSP34Error::Custom("Invalid vote".into()))
            }

            let vote_sum: u32 = votes.iter().sum();
            let total_owner = self.sbt_contract.total_owners();
            let voter_score = self.task_manager.get_score(Self::env().caller());
            let total_score = if self.task_manager.get_total_score() == 0 {
                total_owner as u32
            } else {
                self.task_manager.get_total_score()
            };

            let mut temp = (total_owner + 1) / 2;
            let mut factor = total_owner;
            while temp < factor {
                factor = temp;
                temp = (total_owner / temp + temp) / 2;
            }

            let normalized_voter_score = if voter_score == 0 { 1 } else { voter_score };
            let vote_credit = factor as u32 * normalized_voter_score * 100 / total_score;
            if vote_sum != vote_credit {
                return Err(PSP34Error::Custom("Invalid vote".into()))
            }

            for (i, vote) in votes.iter().enumerate() {
                proposal[i] += vote;
            }
            Ok(())
        }
    }
}
