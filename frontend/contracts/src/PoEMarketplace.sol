// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { KeyEnc } from "./KeyEnc.sol";

/**
 * @title ProofOfExploitMarketplace
 * @author @qedric - https://warpcast.com/berlin
 * @dev A marketplace for white-hat hackers to sell proofs of exploits to 
 * smart contract stakeholders.
 */
contract ProofOfExploitMarketplace is ERC721, KeyEnc {

    struct Exploit {
        string description; // can by bytes for more efficient storage
        address creator; // the creator of the exploit
        address purchasedBy; // will be the address of the buyer of the token
        uint256 price;  // price set by the creator
        bytes32 keyHash; // the hash of the key of the encryption of the proof of the exploit
        bytes sharedKeyCipher; // the encrypted key of the exploit, released by the redeeming process
        bool redeemed; // true if this exploit has been redeemed and the sharedKeyCipher is available
    }

    /// map of all exploits (which are also tokens)
    mapping(uint256 => Exploit) public exploits;

    /// keep track of our exploits (which are also tokens)
    uint256 public exploitCount;

    event ExploitPosted(uint256 indexed id, address indexed creator, uint256 price);
    event TokenPurchased(uint256 indexed id, address indexed buyer);
    event ExploitRedeemed(uint256 indexed id, address indexed buyer);

    constructor(bytes32 _ecdhProgramVkey)
        ERC721("ProofOfExploitToken", "PET")
        KeyEnc(_ecdhProgramVkey)
    {}

    /**
     * @notice Posts a new exploit to the marketplace.
     * @param description A description of the exploit.
     * @param price The price for the exploit.
     * @param keyHash The hash of the key of the encryption of the proof of the exploit.
     * @return The ID of the newly created exploit (token).
     */
    function postExploit(
        string calldata description,
        uint256 price,
        bytes32 keyHash
    ) external returns (uint256) {
        uint256 id = exploitCount;
        exploitCount++;

        exploits[id] = Exploit({
            description: description,
            creator: msg.sender,
            purchasedBy: address(0),
            price: price,
            keyHash: keyHash,
            sharedKeyCipher: new bytes(0),
            redeemed: false
        });

        _mint(msg.sender, id);

        emit ExploitPosted(id, msg.sender, price);
        return id;
    }

    /**
     * @notice Purchases a token for a specific exploit. the buyer's address is stored in the exploit
     * @param exploitId The ID of the exploit to purchase.
     */
    function purchaseToken(uint256 exploitId) external payable {
        Exploit storage exploit = exploits[exploitId];
        require(msg.value >= exploit.price, "Insufficient funds");

        _transfer(exploit.creator, msg.sender, exploitId);

        exploit.purchasedBy = msg.sender;

        emit TokenPurchased(exploitId, msg.sender);
    }

    /**
     * @notice Redeems an exploit by providing the encrypted key.
     * @param tokenId The ID of the token (exploit).
     * @param proof The proof of the exploit.
     */
    function redeemExploit(uint256 tokenId, bytes memory proof, bytes memory publicValues) external {
        // make sure the exploit exists:
        require(tokenId >= 0 && tokenId < exploitCount, "Exploit does not exist");
        Exploit storage exploit = exploits[tokenId];
        require(exploit.creator == msg.sender, "Only the creator can redeem");
        require(!exploit.redeemed, "Exploit already redeemed");

        /*
            @param proof The encoded proof.
            @param publicValues The encoded public values.
            @param keyHashCommited The commited key hash.
        */
        bytes memory sharedKeyCipher = verifyKeyEncProof(proof, publicValues, exploit.keyHash);

        exploit.redeemed = true;
        exploit.sharedKeyCipher = sharedKeyCipher;

        address buyer = ownerOf(tokenId);
        require(exploit.purchasedBy != address(0), "No buyer for this token");

        payable(exploit.creator).transfer(exploit.price);

        emit ExploitRedeemed(tokenId, buyer);
    }

    /**
     * @notice Allows a token holder to retrieve the encrypted key for the exploit.
     * @param tokenId The ID of the token (exploit).
     * @return The encrypted key.
     */
    function getExploitKey(uint256 tokenId) external view returns (bytes memory) {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can get the key");

        Exploit storage exploit = exploits[tokenId];
        require(exploit.redeemed, "Exploit not redeemed yet");

        return exploit.sharedKeyCipher;
    }
}
