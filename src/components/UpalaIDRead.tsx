'use client'

import { useContractRead } from 'wagmi'

export function UpalaIDRead({ params }: { params: any }) {

  const readUpalaIDParams = {
    ...params,
    functionName: 'myId',
  }

  const isValidUpalaID = (rawUpalaID: any) => {
      return Boolean(rawUpalaID) && rawUpalaID !== "0x0" && rawUpalaID !== "0x0000000000000000000000000000000000000000"

  }
  const { data: upalaID, isRefetching, refetch } = useContractRead({
    ...readUpalaIDParams,
    onSettled(data, error) {
      const validUpalaID = isValidUpalaID(data) ? data : ''
      params.setUpalaID(validUpalaID)
      console.log('Settled', { data, error })
    }
  })

  console.log("gotUpalaID", params.upalaID)

  return (
    <div>
      <b>2. Create an Upala ID</b>
      {/* {gotUpalaID ? '[✓]' : '[_]'} */}
      <br />
      {/* Your Upala ID: {gotUpalaID ? upalaID?.toString() : 'not yet registered or already liquidated'} */}
      <br />
    </div>
  )
}
  

