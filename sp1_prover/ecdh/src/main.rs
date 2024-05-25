//! A simple program that takes a number `n` as input, and writes the `n-1`th and `n`th fibonacci
//! number as an output.

// These two lines are necessary for the program to properly compile.
//
// Under the hood, we wrap your main function with some extra code so that it behaves properly
// inside the zkVM.
#![no_main]
sp1_zkvm::entrypoint!(main);

use alloy_primitives::{fixed_bytes, FixedBytes, U256};
use alloy_sol_types::{sol, SolType};
use chacha20::cipher::{KeyIvInit, StreamCipher, StreamCipherSeek};
use chacha20::ChaCha20;
use sha3::{Digest, Keccak256};
use static_dh_ecdh::ecdh::ecdh::{FromBytes, KeyExchange, Pkk256, Skk256, ToBytes, ECDHNISTK256};

/// The public values encoded as a tuple that can be easily deserialized inside Solidity.
sol! {
    struct KeyEncOut {
        bytes32 keyHash;
        bytes keyCipher;
    }
}

pub fn main() {
    let (key, nonce, seller_sk_bytes, buyer_pk_bytes) =
        sp1_zkvm::io::read::<([u8; 32], [u8; 12], Vec<u8>, Vec<u8>)>();

    let seller_sk = Skk256::from_bytes(&seller_sk_bytes).unwrap();
    let buyer_pk = Pkk256::from_bytes(&buyer_pk_bytes).unwrap();

    let shared_key: [u8; 32] = ECDHNISTK256::generate_shared_secret(&seller_sk, &buyer_pk)
        .unwrap()
        .to_bytes()
        .to_vec()
        .try_into()
        .unwrap();

    let mut cipher = ChaCha20::new(&shared_key.into(), &nonce.into());

    let mut buffer = key.to_vec();

    cipher.apply_keystream(&mut buffer);

    let ciphertext = buffer.clone();

    let mut hasher = Keccak256::new();
    hasher.update(key);
    let key_hash: [u8; 32] = hasher.finalize().to_vec().try_into().unwrap();

    let out = KeyEncOut {
        keyHash: key_hash.into(),
        keyCipher: ciphertext.into(),
    };

    let bytes = KeyEncOut::abi_encode(&out);

    // Commit to the public values of the program.
    sp1_zkvm::io::commit_slice(&bytes);
}
