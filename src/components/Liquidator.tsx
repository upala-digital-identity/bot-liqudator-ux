'use client'

import { BaseError } from 'viem'
import { type Address, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { stringify } from '../utils/stringify'

const poolAddress = process.env.NEXT_PUBLIC_POOL_ADDRESS

export function Liquidator(
    { upalaID, userAddress, liquidationCheque, poolAbi }:
        { upalaID: any, userAddress: any, liquidationCheque: any, poolAbi: any }) {

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
        isLoading: isLiqLoading,
        isError: isLiqError
    } = useContractWrite(liquidateConfig)

    // wait for transaction 
    const {
        data: liqReceipt,
        isLoading: isLiqPending,
        isSuccess: isLiqSuccess,
    } = useWaitForTransaction({ hash: liquidationData?.hash })

    return (
        <div>
            <b>3. Liquidate your Upala ID </b>
            <button
                disabled={!liquidate}
                onClick={() => liquidate && liquidate()}
            >
                {isLiqLoading ? 'loading...' : 'Liquidate'}
            </button>
        </div>
    )
}