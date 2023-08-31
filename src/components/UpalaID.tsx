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
    const [upalaID, setUpalaID] = useState('')

    let upConst
    if (chain?.id) {
      upConst = new UpalaConstants(chain?.id)
    }
    const upalaAbi: ReadonlyArray<Object> = JSON.parse(upConst?.getAbi('Upala'));
    const upalaAddress = upConst?.getAddress("Upala")
    const userAccount = walletClient?.account
    const enabled = Boolean(upalaAddress && userAccount) 
    console.log("enabled", enabled)
    const commonParams = 
        {
        address: upalaAddress,
        abi: upalaAbi,
        account: userAccount,
        userAddress: userAddress,
        setUpalaID: setUpalaID,
        upalaID: upalaID,
        enabled: enabled
        }

    const { data, refetch: refetchUpalaID } = useContractRead({
        ...commonParams,
        functionName: 'myId',
        onSettled(data, error) {
          console.log('toplevel: Settled', { data, error })
        }
      })
    console.log("toplevel:", data)
    
    return(
        <>
            {/* { enabled && <UpalaIDRead params={ commonParams } />} */}
            {/* TODO fix first run (when UpalaID is not fetced yet) */}
            { <UpalaIDRegister params={ commonParams } refetchUpalaID={refetchUpalaID}/>}
        </>
    )
}