'use client'

import { useContractRead } from 'wagmi'

export function UpalaIDRead({ upalaID }: { upalaID: any }) {

  return (
    <div>
      <b>2. Create an Upala ID</b>
      {upalaID ? '[✓]' : '[_]'}
      <br />
      {upalaID ? <>Your Upala ID: {upalaID?.toString()} </>: 'not yet registered or already liquidated'}
      <br />
    </div>
  )
}
  

