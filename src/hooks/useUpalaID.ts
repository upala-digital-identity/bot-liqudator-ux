import { useState } from 'react'
import { useContractRead } from 'wagmi'

const isValidUpalaID = (rawUpalaID: any) => {
    return Boolean(rawUpalaID) && rawUpalaID !== "0x0" && rawUpalaID !== "0x0000000000000000000000000000000000000000"
}

export function useUpalaId(commonParams: any) {
    const [upalaID, setUpalaID] = useState('fetching');
    const { data, refetch: refetchUpalaID } = useContractRead({
        ...commonParams,
        functionName: 'myId',
        onSettled(data, error) {
            const validUpalaID = String(isValidUpalaID(data) ? data : '0x0')
            setUpalaID(validUpalaID)
            console.log('useUpalaId: settled', { data, error })
        }
    });
    return { upalaID, refetchUpalaID };
}