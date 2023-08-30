'use client'

import { useEffect, useState } from "react";
import { BaseError } from 'viem'
import { use } from 'react'
import { type Address, useNetwork, useContractRead, useWalletClient, usePrepareContractWrite, useAccount, useContractWrite, useWaitForTransaction} from 'wagmi'
import { stringify } from '../utils/stringify'
import { UpalaConstants } from '@upala/constants';

export function UpalaIDRegister ({ params }: { params: any }) {

  const prepareParams = {
    ...params,
    functionName: 'newIdentity',
    args: [params.userAddress as Address],
  }

    // register Upala ID button
    const { config: newIdentityConfig } = usePrepareContractWrite({
      ...prepareParams
    })
    const { write: newId, data: newIDdata, error, isLoading: isNewIdLoading, isError } = useContractWrite(newIdentityConfig)
    const {
      data: receipt,
      isLoading: isPending,
      isSuccess,
    } = useWaitForTransaction({ hash: newIDdata?.hash })

    return (
      <>
   {/* {/* <button
      disabled={isRefetching}
      onClick={() => refetch()}
      style={{ marginLeft: 4 }}
    >
      {isRefetching ? 'loading...' : 'refetch'}
    </button>  */}
    <button
    disabled={!newId}
    onClick={() => newId && newId()}
    style={{ marginLeft: 4 }}
  >
    {isNewIdLoading ? 'loading...' : 'New Upala ID'}
  </button>
  </>
    )
  }