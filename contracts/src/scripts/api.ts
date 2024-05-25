import { 
    createPublicClient,
    createWalletClient,
    custom,
    http,
    parseAbiItem } from 'viem'
import { sepolia } from 'viem/chains'

import abi from '../../lib/PoEMarketplace_abi.json'

const CONTRACT = process.env.CONTRACT_ADDRESS || '0x..'

const publicClient = createPublicClient({ 
    chain: sepolia,
    transport: http()
})

const client = createWalletClient({
    chain: sepolia,
    transport: custom((window as any).ethereum)
})

export const [account] = await client.getAddresses()

// generic function to write to the contract and return tx hash
const writeContract = async (functionName:string, args: any[]) => {

    const { request } = await publicClient.simulateContract({
        account,
        address: CONTRACT as `0x${string}`,
        abi: abi,
        functionName: functionName,
        args: args
    })
    return await client.writeContract(request)
}

// watches for the TokenPurchased event emitted during the purchaseToken function call. 
// This will be used to trigger the redeem function call.
export const unwatchPurchase = publicClient.watchEvent({
  address: CONTRACT as `0x${string}`,
  event: parseAbiItem('event TokenPurchased(uint256 indexed id, address indexed buyer)'), 
  // TO DO - call function with logs to derive public key https://viem.sh/docs/utilities/recoverPublicKey#recoverpublickey
  onLogs: logs => console.log(logs) 
})

// watches for the TokenPurchased event emitted during the purchaseToken function call. 
// This will be used to trigger the redeem function call.
export const unwatchRedeem = publicClient.watchEvent({
    address: CONTRACT as `0x${string}`,
    event: parseAbiItem('event ExploitRedeemed(uint256 indexed id, address indexed buyer)'), 
    // TO DO - call function with logs to derive public key https://viem.sh/docs/utilities/recoverPublicKey#recoverpublickey
    onLogs: logs => console.log(logs) 
  })
  

// A White Hat Hacker can post an exploit to the marketplace
export const postExploit = async (description:string, price:bigint, hash:bigint) => await writeContract('postExploit', [description, price, hash])

// A vendor can purchase the exploit token from the marketplace
export const purchaseToken = async (tokenId:number) => await writeContract('purchaseToken', [tokenId])

// The White Hat Hacker uses the vendor's public key derived from the purchaseToken transaction to compute the proofs and receive the payment
export const redeem = async (tokenId:number, key:bigint) => await writeContract('redeemExploit', [tokenId, key])

// Finally, the vendor can retrieve the shared key from the exploit token
export const retrieveKey = async (tokenId:number) => publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: abi,
    functionName: 'getExploitKey',
    args: [tokenId]
})