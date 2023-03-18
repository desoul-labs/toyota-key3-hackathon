use openbrush::contracts::psp34::extensions::enumerable::*;

#[openbrush::wrapper]
pub type SBTRef = dyn PSP34Enumerable + PSP34;
