'use client'

import { useNetwork, useWalletClient, useAccount } from 'wagmi'
import { UpalaConstants } from '@upala/constants';
import { UpalaIDRead } from "./UpalaIDRead";
import { UpalaIDRegister } from "./UpalaIDRegister";
import { useUpalaId } from "../hooks/useUpalaID"
import { useChequeFetcher } from '../hooks/useChequeFetch';
import { LiquidationCheque } from './LiquidataionCheque';
import { Liquidator } from './Liquidator';

export function UpalaID() {
    const { address: userAddress } = useAccount()
    const { data: walletClient} = useWalletClient()
    const { chain } = useNetwork()

    let upConst
    if (chain?.id) {
      upConst = new UpalaConstants(chain?.id)
    }
    // TODO why abi is fetched in different ways?!
    const upalaAbi: ReadonlyArray<Object> = JSON.parse(upConst?.getAbi('Upala'));
    const poolAbi: ReadonlyArray<Object> = upConst?.getAbi('SignedScoresPool')
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
    const { liquidationCheque, isLoadingCheque } = useChequeFetcher(userAddress)
    const { upalaID , refetchUpalaID} = useUpalaId(commonParams);

    return(
        <>
            <LiquidationCheque liquidationCheque={liquidationCheque} isLoadingCheque={isLoadingCheque}/>
            { upalaID != 'fetching' && <UpalaIDRead upalaID={ upalaID } />}
            { upalaID != 'fetching' && <UpalaIDRegister upalaID={ upalaID } params={ commonParams } refetchUpalaID={refetchUpalaID}/>}
            <Liquidator 
                upalaID={upalaID}
                userAddress={userAddress}
                liquidationCheque={liquidationCheque}
                poolAbi={poolAbi}
            />
        </>
    )
}