import {GetStorageAtReturnType, createPublicClient, toHex, custom} from 'viem'
import {sepolia} from 'viem/chains'
import fs from 'vite-plugin-fs/browser';

const publicClient = createPublicClient({
    chain: sepolia,
    transport: custom(window.ethereum)
})

async function getStorageAtSlot(target: string, slot: number) {
    console.log(target)
    console.log(slot)
    return await publicClient.getStorageAt({
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
        slot: toHex(0)
    })
}

async function fetchAndStoreContractState(target: string) {
    const slots = 100; // Number of storage slots to fetch. Adjust as needed.
    const state: GetStorageAtReturnType[] = [];

    for (let slot = 0; slot < slots; slot++) {
        const storage: GetStorageAtReturnType = await getStorageAtSlot(target, slot)
        if (storage) {
            state.push(storage);
        }
    }

    // Store the state in a JSON file
    await fs.writeFile('contractState.json', JSON.stringify(state));

    console.log('Contract state saved.');
}

fetchAndStoreContractState('0x..');
