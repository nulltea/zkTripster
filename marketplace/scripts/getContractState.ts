require('dotenv').config()
import { ethers } from 'ethers'
import fs from 'fs'

// Set up the provider with Infura using the environment variable
const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_ID}`);

const contractAddress = '0xYourContractAddress';

async function getStorageAtSlot(target:string, slot:number) {
    return await provider.getStorageAt(target, slot);
}

async function fetchAndStoreContractState(target:string) {
    const slots = 100; // Number of storage slots to fetch. Adjust as needed.
    const state = [];

    for (let slot = 0; slot < slots; slot++) {
        const storage = await getStorageAtSlot(target, slot);
        state.push(storage);
    }

    // Store the state in a JSON file
    fs.writeFileSync('contractState.json', JSON.stringify(state));
    
    console.log('Contract state saved.');
}

fetchAndStoreContractState('0x..');
