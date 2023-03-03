#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[openbrush::contract]
pub mod sbt {
    use openbrush::{
        contracts::psp34::{
            extensions::{
                enumerable::*,
                metadata::*,
            },
            PSP34Error,
            Transfer,
        },
        traits::Storage,
    };

    #[ink(storage)]
    #[derive(Storage)]
    pub struct SBT {
        #[storage_field]
        psp34: psp34::Data<Balances>,
        #[storage_field]
        metadata: metadata::Data,
        next_id: u32,
        owner: AccountId,
    }

    impl PSP34 for SBT {}
    impl PSP34Enumerable for SBT {}
    impl PSP34Metadata for SBT {}

    impl Transfer for SBT {
        fn _before_token_transfer(
            &mut self,
            _from: Option<&AccountId>,
            _to: Option<&AccountId>,
            _id: &Id,
        ) -> Result<(), PSP34Error> {
            if _from.is_some() && _to.is_some() {
                return Err(PSP34Error::Custom("Transfer is not supported".into()))
            }
            Ok(())
        }
    }

    impl SBT {
        #[ink(constructor)]
        pub fn new() -> Self {
            let mut _instance = SBT {
                psp34: psp34::Data::default(),
                metadata: metadata::Data::default(),
                next_id: 0,
                owner: Self::env().caller(),
            };
            _instance
        }

        #[ink(message)]
        pub fn has_token(&self) -> bool {
            return self.owners_token_by_index(Self::env().caller(), 0).is_ok();
        }

        #[ink(message)]
        pub fn mint_token(&mut self) -> Result<(), PSP34Error> {
            if self.has_token() {
                return Err(PSP34Error::Custom("You already have a token".into()))
            }
            return self._mint_to(Self::env().caller(), Id::U32(self.next_id));
        }

        #[ink(message)]
        pub fn total_owners(&self) -> u128 {
            return self.total_supply();
        }
    }
}
