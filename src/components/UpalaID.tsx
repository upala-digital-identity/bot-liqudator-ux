'use client'

import { useEffect, useState } from "react";
import { use } from 'react'
import { type Address, useNetwork, useContractRead, useWalletClient, usePrepareContractWrite, useAccount, useContractWrite, useWaitForTransaction} from 'wagmi'
import { UpalaConstants } from '@upala/constants';
import { UpalaIDRead } from "./UpalaIDRead";

export function UpalaID() {
    const { data: walletClient} = useWalletClient()
    const { chain } = useNetwork()
    let upConst
    if (chain?.id) {
      upConst = new UpalaConstants(chain?.id)
    }
    const upalaAbi: ReadonlyArray<Object> = JSON.parse(upConst?.getAbi('Upala'));
    const commonParams = 
        {
        address: upConst?.getAddress("Upala"),
        abi: upalaAbi,
        account: walletClient?.account
        }

        
    return(
        <>
            <UpalaIDRead params={ commonParams } />
        </>
    )
}