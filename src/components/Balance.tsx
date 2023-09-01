'use client'

import { useAccount, useBalance, useNetwork } from 'wagmi'
const { UpalaConstants } = require('@upala/constants')

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
  // const { data } = useBalance({
  //   address,
  //   watch: true,
  // })
  const { chain } = useNetwork()
  let upConst
  if (chain?.id) {
    upConst = new UpalaConstants(chain?.id)
  }
  const token = upConst?.getAddress("DAI")
  const { data: daiBalance } = useBalance({
    address,
    token: token,
    enabled: Boolean(address && token)
  })

  return (
    <div>
      {/* <p>ETH (xDAI): {data?.formatted}</p> */}
      <p>Your DAI Balance: {daiBalance?.formatted}</p>
    </div>
  )
}
