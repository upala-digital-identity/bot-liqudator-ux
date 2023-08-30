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
    const commonParams = 
        {
        address: upConst?.getAddress("Upala"),
        abi: upalaAbi,
        account: walletClient?.account,
        userAddress: userAddress,
        setUpalaID: setUpalaID,
        upalaID: upalaID
        }
        
    return(
        <>
            <UpalaIDRead params={ commonParams } />
            {!upalaID && <UpalaIDRegister params={ commonParams } />}
        </>
    )
}