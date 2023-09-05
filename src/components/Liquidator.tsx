'use client'

import { BaseError } from 'viem'
import { type Address, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { stringify } from '../utils/stringify'

const poolAddress = process.env.NEXT_PUBLIC_POOL_ADDRESS

export function Liquidator(
    { upalaID, userAddress, liquidationCheque, poolAbi, refetchUpalaID }:
        { upalaID: any, userAddress: any, liquidationCheque: any, poolAbi: any, refetchUpalaID: () => void }) {

    // prepare liquidation
    const { config: liquidateConfig } = usePrepareContractWrite({
        address: poolAddress as Address,
        abi: poolAbi,
        functionName: "attack",
        args: [
            upalaID as Address,
            userAddress as Address,
            liquidationCheque?.score,
            liquidationCheque?.bundleId as Address,
            liquidationCheque?.cheque as Address,
        ],
        enabled: Boolean(upalaID != "0x0" && upalaID != 'fetching')
    })

    // liquidate
    const {
        write: liquidate,
        data: liquidationData,
        error: liquidationError,
        isError: isLiqError
    } = useContractWrite(liquidateConfig)

    // wait for transaction 
    const {
        isLoading,
        isSuccess,
    } = useWaitForTransaction(
        {
            hash: liquidationData?.hash,
            onSuccess(data) {
                console.log('Liquidated successfully', data)
                refetchUpalaID()
            }
        })

    return (
        <div>
            <b>3. Liquidate your Upala ID </b>
            <button
                disabled={!liquidate}
                onClick={() => liquidate && liquidate()}
            >
                {isLoading ? 'loading...' : 'Liquidate'}
            </button>
            {isSuccess && (
                <div>
                    Liquidated! Check your wxDai balance!
                </div>
            )}
        </div>
    )
}