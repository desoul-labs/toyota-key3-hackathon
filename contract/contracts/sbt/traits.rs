use openbrush::contracts::psp34::extensions::enumerable::*;

#[openbrush::trait_definition]
pub trait SBTTrait {
    #[ink(message)]
    fn has_token(&self) -> bool;

    #[ink(message)]
    fn total_owners(&self) -> u128;
}

#[openbrush::wrapper]
pub type SBTRef = dyn PSP34Enumerable + PSP34;
