use openbrush::traits::AccountId;

#[openbrush::trait_definition]
pub trait TaskManagerTrait {
    #[ink(message)]
    fn get_score(&self, account: AccountId) -> u32;

    #[ink(message)]
    fn get_total_score(&self) -> u32;
}

#[openbrush::wrapper]
pub type TaskManagerRef = dyn TaskManagerTrait;
