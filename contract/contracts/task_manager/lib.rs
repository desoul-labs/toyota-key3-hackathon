#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[openbrush::contract]
pub mod task_manager {
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

    #[ink(storage)]
    #[derive(Storage)]
    pub struct TaskManager {
        #[storage_field]
        psp34: psp34::Data,
        #[storage_field]
        metadata: Data,
        next_id: u8,
        deadlines: Mapping<Id, u64>,
        completed: Mapping<Id, ()>,
        sbt_contract: SBTRef,
        score: Mapping<AccountId, u64>,
        total_score: u64,
        // voted: Mapping<Id, Mapping<AccountId, ()>>,
    }

    impl PSP34 for TaskManager {}
    impl PSP34Enumerable for TaskManager {}
    impl PSP34Metadata for TaskManager {}

    impl TaskManager {
        #[ink(constructor)]
        pub fn new(sbt_contract: SBTRef) -> Self {
            let mut _instance = TaskManager {
                psp34: psp34::Data::default(),
                metadata: Data::default(),
                next_id: 0,
                deadlines: Mapping::new(),
                completed: Mapping::new(),
                sbt_contract,
                score: Mapping::new(),
                total_score: 0,
            };

            let collection_id = _instance.collection_id();
            _instance._set_attribute(collection_id.clone(), String::from("name"), String::from("TaskManager"));
            _instance._set_attribute(collection_id, String::from("symbol"), String::from("Proposals"));
            _instance
        }

        #[ink(message)]
        pub fn create_task(&mut self, deadline: u64) -> Result<(), PSP34Error> {
            if !self.sbt_contract.has_token() {
                return Err(PSP34Error::Custom("Not a member".into()))
            }
            if deadline < Self::env().block_timestamp() {
                return Err(PSP34Error::Custom("Deadline is in the past".into()))
            }
            self._mint_to(Self::env().account_id(), Id::U8(self.next_id))?;
            self.deadlines.insert(Id::U8(self.next_id), &deadline);
            self.next_id += 1;
            Ok(())
        }

        #[ink(message)]
        pub fn take_task(&mut self, id: Id) -> Result<(), PSP34Error> {
            if !self.sbt_contract.has_token() {
                return Err(PSP34Error::Custom("Not a member".into()))
            }
            if self.owner_of(id.clone()).unwrap() != Self::env().account_id() {
                return Err(PSP34Error::Custom("Task is already taken".into()))
            }
            if self.completed.get(&id).is_some() {
                return Err(PSP34Error::Custom("Task is completed".into()))
            }
            return self.transfer(Self::env().caller(), id, Vec::new())
        }

        #[ink(message)]
        pub fn complete_task(&mut self, id: Id) -> Result<(), PSP34Error> {
            if !self.sbt_contract.has_token() {
                return Err(PSP34Error::Custom("Not a member".into()))
            }
            if self.owner_of(id.clone()).unwrap() != Self::env().caller() {
                return Err(PSP34Error::Custom("Task is owned by others".into()))
            }
            if self.completed.get(&id).is_some() {
                return Err(PSP34Error::Custom("Task is completed".into()))
            }
            self.completed.insert(id, &());
            Ok(())
        }

        #[ink(message)]
        pub fn get_deadline(&self, id: Id) -> u64 {
            self.deadlines.get(&id).unwrap()
        }

        #[ink(message)]
        pub fn is_completed(&self, id: Id) -> bool {
            self.completed.get(&id).is_some()
        }

        #[ink(message)]
        pub fn get_score(&self, account: AccountId) -> Result<u64, PSP34Error> {
            if !self.sbt_contract.has_token() {
                return Err(PSP34Error::Custom("Not a member".into()))
            }
            Ok(self.score.get(&account).unwrap_or(0))
        }

        #[ink(message)]
        pub fn evaluate_task(&mut self, id: Id, score: u64) -> Result<(), PSP34Error> {
            if !self.sbt_contract.has_token() {
                return Err(PSP34Error::Custom("Not a member".into()))
            }
            let caller = Self::env().caller();
            if self.owner_of(id.clone()).unwrap() == caller {
                return Err(PSP34Error::Custom("Cannot self evaluate".into()))
            }
            if self.completed.get(&id).is_none() {
                return Err(PSP34Error::Custom("Task is not completed".into()))
            }
            if score > 100 {
                return Err(PSP34Error::Custom("Score must be between 0 and 100".into()))
            }

            let evaluator_score = self.score.get(caller);
            let total_score = if self.total_score == 0 {
                self.total_supply() as u64
            } else {
                self.total_score
            };
            let evaluation = score * evaluator_score.unwrap_or(1) / total_score;
            self.score.insert(caller, &(evaluator_score.unwrap_or(0) + 1));
            self.total_score += 1;

            let task_owner = self.owner_of(id.clone()).unwrap();
            let current_score = self.score.get(&task_owner).unwrap_or(0);
            self.score.insert(task_owner, &(current_score + evaluation));
            self.total_score += evaluation;
            Ok(())
        }
    }
}
