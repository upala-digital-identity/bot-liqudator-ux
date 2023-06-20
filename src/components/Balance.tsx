'use client'

import { useState } from 'react'
import type { Address } from 'wagmi'
import { useAccount, useBalance, erc20ABI, useContractRead } from 'wagmi'
import contracts from './constants'

export function Balance() {
  return (
    <>
      <div>
        <AccountBalance />
      </div>
      <br />
    </>
  )
}

export function AccountBalance() {
  const { address } = useAccount()
  const { data, refetch } = useBalance({
    address,
    watch: true,
  })

  // TODO do dai balalance
  const { data: daiBalance, error, isLoading, isSuccess } = useContractRead({
    address: contracts[31337][0].contracts.DAI.address,
    abi: contracts[31337][0].contracts.DAI.abi,
    functionName: 'balanceOf',
    args: [address as Address],
    enabled: Boolean(address),
  })

  return (
    <div>
      {data?.formatted}
      {daiBalance?.toString()}
      <button onClick={() => refetch()}>refetch</button>
    </div>
  )
}
