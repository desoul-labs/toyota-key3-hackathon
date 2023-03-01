#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[openbrush::contract]
pub mod proposal_manager {
    use ink::{
        prelude::vec::Vec,
        storage::Mapping,
        storage::StorageLayout,
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
    use task_manager::task_manager::*;

    #[ink(storage)]
    #[derive(Storage)]
    pub struct ProposalManager {
        #[storage_field]
        psp34: psp34::Data<Balances>,
        #[storage_field]
        metadata: Data,
        next_id: u8,
        proposal: Mapping<Id, Vec<u8>>,
        sbt_contract: SBTRef,
        task_manager: TaskManagerRef,
    }

    impl PSP34 for ProposalManager {}
    impl PSP34Enumerable for ProposalManager {}
    impl PSP34Metadata for ProposalManager {}

    impl ProposalManager {
        #[ink(constructor)]
        pub fn new(sbt_contract: SBTRef, task_manager: TaskManagerRef) -> Self {
            let mut _instance = ProposalManager {
                psp34: psp34::Data::default(),
                metadata: Data::default(),
                next_id: 0,
                proposal: Mapping::new(),
                sbt_contract,
                task_manager,
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
        pub fn create_proposal(&mut self, options: Vec<u8>) -> Result<(), PSP34Error> {
            if !self.sbt_contract.has_token() {
                return Err(PSP34Error::Custom("Not a member".into()))
            }
            self._mint_to(Self::env().caller(), Id::U8(self.next_id))?;
            self.proposal.insert(Id::U8(self.next_id), &options);
            self.next_id += 1;
            Ok(())
        }

        #[ink(message)]
        pub fn vote_proposal(&mut self, id: Id, votes: Vec<u8>) -> Result<(), PSP34Error> {
            if !self.sbt_contract.has_token() {
                return Err(PSP34Error::Custom("Not a member".into()))
            }
            self._check_token_exists(&id)?;
            let mut proposal = self.proposal.get(&id).unwrap();
            if proposal.len() != votes.len() {
                return Err(PSP34Error::Custom("Invalid vote".into()))
            }
            for (i, vote) in votes.iter().enumerate() {
                proposal[i] += vote;
            }
            Ok(())
        }
    }
}
