'use client'

import { type Address, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'

export function UpalaIDRegister ({ upalaID, params, refetchUpalaID }: { upalaID: any, params: any, refetchUpalaID: () => void }) {
  const prepareParams = {
    ...params,
    functionName: 'newIdentity',
    args: [params.userAddress as Address],
    enabled: Boolean(upalaID == "0x0")
  }

  // prepare
  const { config: newIdentityConfig } = usePrepareContractWrite({ ...prepareParams })

  // write
  const { 
    write: newId,
    data: newIDdata,
    error,
    isError 
  } = useContractWrite(newIdentityConfig)

  // wait for tx
  const {
    isLoading: isPending,
  } = useWaitForTransaction({
    hash: newIDdata?.hash,
    onSuccess(data) {
      console.log('Registered Successfully', data)
      refetchUpalaID()
    }
  })

  return (
    <>
      <button
        disabled={!Boolean(upalaID == '0x0')}
        onClick={() => newId && newId()}
        style={{ marginLeft: 0 }}
      >
        {isPending ? 'Waiting for tx...' : 'New Upala ID'}
      </button>
    </>
  )
}