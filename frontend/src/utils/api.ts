const fetchContractData = async (contractAddress: string = '') => {
    // TODO: Implement API call to fetch contract data
    console.log(contractAddress)
    try {
        // const response = await fetch(`/api/contracts/${contractAddress}`);
        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }
        // const data = await response.json();
        return {zkPoex: 'zkPoex', Enc: 'Enc adsa dasd'};
    } catch (error) {
        console.error('Error fetching contract data:', error);
        throw error;
    }
};

export {fetchContractData}