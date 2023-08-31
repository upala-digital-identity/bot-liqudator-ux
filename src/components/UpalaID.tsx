'use client'

import { useEffect, useState } from "react";
import { type Address, useNetwork, useContractRead, useWalletClient, usePrepareContractWrite, useAccount, useContractWrite, useWaitForTransaction} from 'wagmi'
import { UpalaConstants } from '@upala/constants';
import { UpalaIDRead } from "./UpalaIDRead";
import { UpalaIDRegister } from "./UpalaIDRegister";

export function UpalaID() {
    const { address: userAddress } = useAccount()
    const { data: walletClient} = useWalletClient()
    const { chain } = useNetwork()
    // const [upalaID, setUpalaID] = useState('')

    let upConst
    if (chain?.id) {
      upConst = new UpalaConstants(chain?.id)
    }
    const upalaAbi: ReadonlyArray<Object> = JSON.parse(upConst?.getAbi('Upala'));
    const upalaAddress = upConst?.getAddress("Upala")
    const userAccount = walletClient?.account
    const commonParams = 
        {
        address: upalaAddress,
        abi: upalaAbi,
        account: userAccount,
        userAddress: userAddress,
        enabled: Boolean(upalaAddress && userAccount)
        }

    const isValidUpalaID = (rawUpalaID: any) => {
        return Boolean(rawUpalaID) && rawUpalaID !== "0x0" && rawUpalaID !== "0x0000000000000000000000000000000000000000"
    }

    // const { data, refetch: refetchUpalaID } = useContractRead({
    //     ...commonParams,
    //     functionName: 'myId',
    //     onSettled(data, error) {
    //         const validUpalaID = String(isValidUpalaID(data) ? data : 'no Upala id')
    //         setUpalaID(validUpalaID)
    //         console.log('toplevel: Settled', { data, error })
    //     }
    //   })

    function useMyId(commonParams: any) {
        const [upalaID, setUpalaID] = useState('');
        const { data, refetch: refetchUpalaID } = useContractRead({
            ...commonParams,
            functionName: 'myId',
            onSettled(data, error) {
                const validUpalaID = String(isValidUpalaID(data) ? data : 'no Upala id')
                setUpalaID(validUpalaID)
                console.log('toplevel: Settled', { data, error })
            }
        });
        return { data, refetchUpalaID, upalaID };
    }
     
    const { data, refetchUpalaID, upalaID } = useMyId(commonParams);

    console.log("toplevel: UpalaID", data)
    return(
        <>
            {/* { enabled && <UpalaIDRead params={ commonParams } />} */}
            {/* TODO fix first run (when UpalaID is not fetced yet) */}
            { <UpalaIDRegister params={ commonParams } refetchUpalaID={refetchUpalaID}/>}
        </>
    )
}