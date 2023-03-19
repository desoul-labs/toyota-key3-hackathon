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
    use sbt::traits::SBTRef;
    use task_manager::traits::TaskManagerRef;

    #[ink(storage)]
    #[derive(Storage)]
    pub struct ProposalManager {
        #[storage_field]
        psp34: psp34::Data<Balances>,
        #[storage_field]
        metadata: Data,
        next_id: u32,
        proposal: Mapping<Id, Vec<u32>>,
        voted: Mapping<Id, Vec<AccountId>>,
        deadline: Mapping<Id, u64>,
        task_manager: AccountId,
        sbt: AccountId,
    }

    impl PSP34 for ProposalManager {}
    impl PSP34Enumerable for ProposalManager {}
    impl PSP34Metadata for ProposalManager {}

    impl ProposalManager {
        #[ink(constructor)]
        pub fn new(task_manager: AccountId, sbt: AccountId) -> Self {
            let mut _instance = ProposalManager {
                psp34: psp34::Data::default(),
                metadata: Data::default(),
                next_id: 0,
                proposal: Mapping::new(),
                deadline: Mapping::new(),
                voted: Mapping::new(),
                task_manager,
                sbt,
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
            if SBTRef::balance_of(&self.sbt, Self::env().caller()) == 0 {
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
            self.deadline.insert(&Id::U32(self.next_id), &deadline);
            self.proposal.insert(&Id::U32(self.next_id), &options);
            self.next_id += 1;
            Ok(())
        }

        #[ink(message)]
        pub fn is_voted(&self, id: Id, account: AccountId) -> bool {
            self.voted.get(&id).unwrap_or_default().contains(&account)
        }

        #[ink(message)]
        pub fn get_proposal(&self, id: Id) -> Vec<u32> {
            self.proposal.get(&id).unwrap()
        }

        #[ink(message)]
        pub fn get_vote_credit(&self, account: AccountId) -> u32 {
            let total_owner = SBTRef::total_supply(&self.sbt);
            let voter_score = TaskManagerRef::get_score(&self.task_manager, account);
            let total_score = if TaskManagerRef::get_total_score(&self.task_manager) == 0 {
                total_owner as u32
            } else {
                TaskManagerRef::get_total_score(&self.task_manager)
            };

            let mut temp = (total_owner + 1) / 2;
            let mut factor = total_owner;
            while temp < factor {
                factor = temp;
                temp = (total_owner / temp + temp) / 2;
            }

            let normalized_voter_score = if voter_score == 0 { 1 } else { voter_score };
            factor as u32 * normalized_voter_score * 100 / total_score
        }

        #[ink(message)]
        pub fn vote_proposal(&mut self, id: Id, votes: Vec<u32>) -> Result<(), PSP34Error> {
            if SBTRef::balance_of(&self.sbt, Self::env().caller()) == 0 {
                return Err(PSP34Error::Custom("Not a member".into()))
            }
            if self.proposal.get(&id).is_none() {
                return Err(PSP34Error::Custom("Proposal not found".into()))
            }
            if self.deadline.get(&id).unwrap_or(0) < Self::env().block_timestamp() {
                return Err(PSP34Error::Custom("Proposal is closed".into()))
            }
            if self.voted.get(&id).unwrap_or_default().contains(&Self::env().caller()) {
                return Err(PSP34Error::Custom("Already voted".into()))
            }
            let mut proposal = self.proposal.get(&id).unwrap();
            if proposal.len() != votes.len() {
                return Err(PSP34Error::Custom("Invalid vote".into()))
            }

            let vote_sum: u32 = votes.iter().sum();
            let vote_credit = self.get_vote_credit(Self::env().caller());
            if vote_sum > vote_credit {
                return Err(PSP34Error::Custom("Invalid vote".into()))
            }

            for (i, vote) in votes.iter().enumerate() {
                proposal[i] += vote;
            }
            self.voted.get(&id).unwrap_or_default().push(Self::env().caller());

            Ok(())
        }
    }
}
