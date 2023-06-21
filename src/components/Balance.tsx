'use client'

import { useAccount, useBalance } from 'wagmi'
import contracts from './constants'

export function Balance() {
  return (
    <>
      <div>
        <AccountBalance />
      </div>
    </>
  )
}

export function AccountBalance() {
  const { address } = useAccount()
  const { data } = useBalance({
    address,
    watch: true,
  })

  const { data: daiBalance } = useBalance({
    address,
    token: contracts[31337][0].contracts.DAI.address,
  })

  return (
    <div>
      <p>ETH: {data?.formatted}</p>
      <p>DAI: {daiBalance?.formatted}</p>
    </div>
  )
}
