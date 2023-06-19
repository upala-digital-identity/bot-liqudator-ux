'use client'

import { useState } from 'react'
import { BaseError } from 'viem'
import { type Address, useContractRead, useWalletClient } from 'wagmi'
import { wagmiContractConfig } from './contracts'
import contracts from './constants'

export function ReadContract() {
  return (
    <div>
      <div>
        <BalanceOf />
        <br />
        <TotalSupply />
      </div>
    </div>
  )
}

function TotalSupply() {
  const { data: walletClient, isError, isLoading } = useWalletClient()

  const { data, isRefetching, refetch } = useContractRead({
    address: contracts[31337][0].contracts.Upala.address,
    abi: contracts[31337][0].contracts.Upala.abi,
    functionName: 'myId',
    account: walletClient?.account
  })

  return (
    <div>
      Total Supply: {data?.toString()}
      <button
          disabled={isRefetching}
          onClick={() => refetch()}
          style={{ marginLeft: 4 }}
        >
          {isRefetching ? 'loading...' : 'refetch'}
        </button>
      </div>
    )
}

function BalanceOf() {
  const [address, setAddress] = useState<Address>(
    '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  )
  const { data, error, isLoading, isSuccess } = useContractRead({
    ...wagmiContractConfig,
    functionName: 'balanceOf',
    args: [address],
    enabled: Boolean(address),
  })

  const [value, setValue] = useState<string>(address)

  return (
    <div>
      Token balance: {isSuccess && data?.toString()}
      <input
        onChange={(e) => setValue(e.target.value)}
        placeholder="wallet address"
        style={{ marginLeft: 4 }}
        value={value}
      />
      <button onClick={() => setAddress(value as Address)}>
        {isLoading ? 'fetching...' : 'fetch'}
      </button>
      {error && <div>{(error as BaseError).shortMessage}</div>}
    </div>
  )
}
