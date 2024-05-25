//! A simple program that takes a number `n` as input, and writes the `n-1`th and `n`th fibonacci
//! number as an output.

// These two lines are necessary for the program to properly compile.
//
// Under the hood, we wrap your main function with some extra code so that it behaves properly
// inside the zkVM.
#![no_main]
sp1_zkvm::entrypoint!(main);

use alloy_sol_types::{sol, SolType};
use chacha20::cipher::{KeyIvInit, StreamCipher, StreamCipherSeek};
use chacha20::ChaCha20;
use evm_runner::{run_simulation, RunEvmResult};
use sha3::{Digest, Keccak256};

pub fn main() {
    let (key, nonce, calldata, blockchain_settings, drand_master_pk, round) =
        sp1_zkvm::io::read::<([u8; 32], [u8; 12], String, String, String, u64)>();

    let RunEvmResult {
        before,
        after,
        hash_private_inputs,
        private_inputs_concat,
    }: RunEvmResult = run_simulation(&calldata, &blockchain_settings);

    let mut cipher = ChaCha20::new(&key.into(), &nonce.into());

    let mut chacha_cipher = private_inputs_concat.as_bytes().to_vec();

    cipher.apply_keystream(&mut chacha_cipher);

    let drand_master_pk_bytes = hex::decode(drand_master_pk).unwrap();

    let mut tlock_cipher = vec![];
    tlock::encrypt(
        &mut tlock_cipher,
        private_inputs_concat.as_bytes(),
        &drand_master_pk_bytes,
        round,
    )
    .unwrap();

    let mut hasher = Keccak256::new();
    hasher.update(key);
    let key_hash = hasher.finalize();
    let key_hash_str = hex::encode(key_hash);

    // Commit to the public values of the program.
    sp1_zkvm::io::commit(&(
        before,
        after,
        hash_private_inputs,
        chacha_cipher,
        key_hash_str,
        tlock_cipher,
        round,
    ));
}
