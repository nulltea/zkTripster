#![cfg_attr(not(test), no_std)]

extern crate alloc;
extern crate core;

use crate::alloc::string::ToString;
use core::str::FromStr;

use alloc::{collections::BTreeMap, format, string::String, vec::Vec};
use ethereum_types::Address;
use evm::{
    backend::{MemoryAccount, MemoryBackend, MemoryVicinity},
    executor::stack::{MemoryStackState, StackExecutor, StackSubstateMetadata},
    Config, ExitReason, ExitSucceed, Handler,
};
use hex::encode;
use primitive_types::{H160, H256, U256};
use serde::Deserialize;
use serde_json::from_str;
use sha3::{Digest, Keccak256};

#[derive(Debug, Deserialize)]
pub struct DeserializeMemoryVicinity {
    pub gas_price: String,
    pub origin: String,
    pub chain_id: String,
    pub block_hashes: String,
    pub block_number: String,
    pub block_coinbase: String,
    pub block_timestamp: String,
    pub block_difficulty: String,
    pub block_gas_limit: String,
    pub block_base_fee_per_gas: String,
}

#[derive(Debug, Deserialize)]
pub struct RunEvmResult {
    pub before: String,
    pub after: String,
    pub hash_private_inputs: String,
    pub private_inputs_concat: String,
}

pub const TARGET_CONTRACT_EVM_PROGRAM: &str = include_str!("../../bytecode/Target.bin-runtime");
pub const EXPLOITER_CONTRACT_EVM_PROGRAM: &str =
    include_str!("../../bytecode/Exploiter.bin-runtime");

pub const TARGET_ADDRESS: &str = "0x1000000000000000000000000000000000000000";
pub const EXPLOITER_ADDRESS: &str = "0x2000000000000000000000000000000000000000";
pub const CALLER_ADDRESS: &str = "0xf000000000000000000000000000000000000000";

pub fn run_simulation(calldata: &str, blockchain_settings: &str) -> RunEvmResult {
    run_evm(
        TARGET_CONTRACT_EVM_PROGRAM,
        EXPLOITER_CONTRACT_EVM_PROGRAM,
        calldata,
        blockchain_settings,
    )
}

fn run_evm(
    target_bytecode: &str,
    exploiter_bytecode: &str,
    calldata: &str,
    blockchain_settings: &str,
) -> RunEvmResult {
    let config = Config::istanbul();

    // deserialize vicinity
    let deserialize_vicinity: DeserializeMemoryVicinity = from_str(blockchain_settings).unwrap();

    let vicinity = MemoryVicinity {
        gas_price: U256::from_str(&deserialize_vicinity.gas_price).unwrap(),
        origin: H160::from_str(&deserialize_vicinity.origin).unwrap(),
        chain_id: U256::from_str(&deserialize_vicinity.chain_id).unwrap(),
        block_hashes: serde_json::from_str::<Vec<String>>(&deserialize_vicinity.block_hashes)
            .unwrap()
            .into_iter()
            .map(|s| H256::from_str(&s).unwrap())
            .collect(),
        block_number: U256::from_str(&deserialize_vicinity.block_number).unwrap(),
        block_coinbase: H160::from_str(&deserialize_vicinity.block_coinbase).unwrap(),
        block_timestamp: U256::from_str(&deserialize_vicinity.block_timestamp).unwrap(),
        block_difficulty: U256::from_str(&deserialize_vicinity.block_difficulty).unwrap(),
        block_gas_limit: U256::from_str(&deserialize_vicinity.block_gas_limit).unwrap(),
        block_base_fee_per_gas: U256::from_str(&deserialize_vicinity.block_base_fee_per_gas)
            .unwrap(),
    };

    // chain state
    let mut global_state = BTreeMap::new();
    let target_storage: BTreeMap<H256, H256> = BTreeMap::new();
    let mut exploiter_storage = BTreeMap::new();

    // insert target address in exploiter contract
    let target_address = H256::from(Address::from(H160::from_str(TARGET_ADDRESS).unwrap()));
    exploiter_storage.insert(H256::zero(), target_address);

    // formats the exploiter state binary tree map as a string for future hashing
    let mut concat_exploiter_btreemap = String::new();
    concat_exploiter_btreemap += "[";
    for (key, value) in &exploiter_storage {
        concat_exploiter_btreemap +=
            &format!("[{},{}]", encode(key.as_bytes()), encode(value.as_bytes()));
    }
    concat_exploiter_btreemap += "]";
    let exploiter_btreemap = concat_exploiter_btreemap.as_str();

    // deploy target contract to state
    global_state.insert(
        H160::from_str(TARGET_ADDRESS).unwrap(),
        MemoryAccount {
            nonce: U256::one(),
            balance: U256::from_dec_str("1000000000000000000").unwrap(), // 1 ether
            storage: target_storage,
            code: hex::decode(target_bytecode).unwrap(),
        },
    );

    // constraint: exploiter has nonce 1
    let exploiter_nonce = U256::one();
    assert!(exploiter_nonce == U256::one());

    // deploy exploiter contract to state
    global_state.insert(
        H160::from_str(EXPLOITER_ADDRESS).unwrap(),
        MemoryAccount {
            nonce: exploiter_nonce,
            balance: U256::from_dec_str("0").unwrap(), // 0 ether
            storage: exploiter_storage,
            code: hex::decode(exploiter_bytecode).unwrap(),
        },
    );

    // deploy caller address in state
    global_state.insert(
        H160::from_str(CALLER_ADDRESS).unwrap(),
        MemoryAccount {
            nonce: U256::one(),
            balance: U256::from_dec_str("10000000000000000000").unwrap(), // 10 ether for the caller
            storage: BTreeMap::new(),
            code: Vec::new(),
        },
    );

    let backend = MemoryBackend::new(&vicinity, global_state);
    let metadata = StackSubstateMetadata::new(u64::MAX, &config);
    let state = MemoryStackState::new(metadata, &backend);
    let precompiles = BTreeMap::new();
    let mut executor = StackExecutor::new_with_precompiles(state, &config, &precompiles);

    let before = executor.balance(H160::from_str(TARGET_ADDRESS).unwrap());
    // println!("BEFORE: {:?}", before);

    let (exit_reason, _) = executor.transact_call(
        H160::from_str(CALLER_ADDRESS).unwrap(),
        H160::from_str(EXPLOITER_ADDRESS).unwrap(),
        U256::from_dec_str("1000000000000000000").unwrap(), // 1 ether - 1000000000000000000
        hex::decode(calldata).unwrap(),
        u64::MAX,
        Vec::new(),
    );

    // println!("EXIT REASON: {:?}", exit_reason);
    // constraint: transaction succeeded
    assert!(exit_reason == ExitReason::Succeed(ExitSucceed::Stopped));

    let after = executor.balance(H160::from_str(TARGET_ADDRESS).unwrap());
    // println!("AFTER: {:?}", after);

    // hashes private inputs with keccak256
    let mut hasher = Keccak256::new();
    let private_inputs_concat = format!(
        "[{},{},{},{}]",
        EXPLOITER_CONTRACT_EVM_PROGRAM, EXPLOITER_ADDRESS, CALLER_ADDRESS, exploiter_btreemap
    );
    hasher.update(private_inputs_concat.clone());
    let hash = hasher.finalize();
    let hash_private_inputs = hex::encode(hash);

    // constraint: caller address, target address and exploiter address are different
    assert!(CALLER_ADDRESS != TARGET_ADDRESS);
    assert!(CALLER_ADDRESS != EXPLOITER_ADDRESS);
    assert!(TARGET_ADDRESS != EXPLOITER_ADDRESS);

    // simulataion outputs: the before and after hack balance of ETH of the target
    RunEvmResult {
        before: before.to_string(),
        after: after.to_string(),
        hash_private_inputs,
        private_inputs_concat,
    }
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn evm_exploit_works() {
        let calldata = "63d9b770"; // exploit()
        let blockchain_settings = r#"
        {
			"gas_price": "0",
			"origin": "0x0000000000000000000000000000000000000000",
			"block_hashes": "[]",
			"block_number": "0",
			"block_coinbase": "0x0000000000000000000000000000000000000000",
			"block_timestamp": "0",
			"block_difficulty": "0",
			"block_gas_limit": "0",
			"chain_id": "1",
			"block_base_fee_per_gas": "0"
		}
    	"#;

        let result = run_simulation(calldata, blockchain_settings);
        println!(
            "Result [Balance before tx, Balance after tx, Hash of private inputs]: {:?}",
            result
        );
        assert_eq!(result.before, "1000000000000000000"); // target should have 1 ethers before the exploit
        assert_eq!(result.after, "0"); // target should have 0 after the exploit
        assert_eq!(
            result.hash_private_inputs,
            "9a68fde8bf1c116a2f268c7e838b8a561779dccf9d8284b7f9c1e06871fbecc5"
        ); // hash of private inputs is correct
    }
}
