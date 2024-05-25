// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {SP1Verifier} from "./SP1Verifier.sol";

struct KeyEncOut {
    bytes32 keyHash;
    bytes keyCipher;
}

/// @title KeyEnc.
contract KeyEnc is SP1Verifier {
    /// @notice The verification key for the fibonacci program.
    bytes32 public ecdhProgramVkey;

    constructor(bytes32 _ecdhProgramVkey) {
        ecdhProgramVkey = _ecdhProgramVkey;
    }

    /// @notice The entrypoint for verifying the proof of a fibonacci number.
    /// @param proof The encoded proof.
    /// @param publicValues The encoded public values.
    /// @param keyHashCommited The commited key hash.
    /// @return keyCipher The shared key cipher.
    function verifyKeyEncProof(
        bytes memory proof,
        bytes memory publicValues,
        bytes32 keyHashCommited
    ) public view returns (bytes memory) {
        this.verifyProof(ecdhProgramVkey, publicValues, proof);
        (KeyEncOut memory out) = abi.decode(publicValues, (KeyEncOut));
        if (keyHashCommited != out.keyHash) {
            revert("KeyEnc: preimage does not match with previous commited key.");
        }
        return out.keyCipher;
    }
}
