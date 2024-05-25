require('dotenv').config()
import { GetStorageAtReturnType, createPublicClient, http, toHex } from 'viem'
import { sepolia } from 'viem/chains'
import fs from 'fs'

const publicClient = createPublicClient({ 
    chain: sepolia,
    transport: http()
})

async function getStorageAtSlot(target:string, slot:number) {
    return await publicClient.getStorageAt({
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
        slot: toHex(0)
    })
}

async function fetchAndStoreContractState(target:string) {
    const slots = 100; // Number of storage slots to fetch. Adjust as needed.
    const state: GetStorageAtReturnType[] = [];

    for (let slot = 0; slot < slots; slot++) {
        const storage:GetStorageAtReturnType = await getStorageAtSlot(target, slot)
        if (storage) {
            state.push(storage);
        }
    }

    // Store the state in a JSON file
    fs.writeFileSync('contractState.json', JSON.stringify(state));
    
    console.log('Contract state saved.');
}

fetchAndStoreContractState('0x..');
