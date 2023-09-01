'use client'

import { useEffect, useState } from "react";
import { type Address, useNetwork, useContractRead, useWalletClient, usePrepareContractWrite, useAccount, useContractWrite, useWaitForTransaction} from 'wagmi'
import { UpalaConstants } from '@upala/constants';
import { UpalaIDRead } from "./UpalaIDRead";
import { UpalaIDRegister } from "./UpalaIDRegister";
import { useUpalaId } from "../hooks/useUpalaID"

export function UpalaID() {
    const { address: userAddress } = useAccount()
    const { data: walletClient} = useWalletClient()
    const { chain } = useNetwork()

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

    const { upalaID , refetchUpalaID} = useUpalaId(commonParams);
    console.log("toplevel: UpalaID", upalaID)

    return(
        <>
            { upalaID != 'fetching' && <UpalaIDRead upalaID={ upalaID } />}
            { upalaID != 'fetching' && <UpalaIDRegister upalaID={ upalaID } params={ commonParams } refetchUpalaID={refetchUpalaID}/>}
        </>
    )
}