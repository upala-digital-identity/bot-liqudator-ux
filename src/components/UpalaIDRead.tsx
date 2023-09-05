'use client'

export function UpalaIDRead({ upalaID }: { upalaID: any }) {

  return (
    <div>
      <b>2. Create an Upala ID</b>
      {upalaID != "0x0" ? '[✓ - Got UpalaID]' : '[_ - No Upala ID]'}
      <br />
      {upalaID  != "0x0" ? <>Your Upala ID: {upalaID?.toString()} </>: 'not yet registered or already liquidated'}
      <br />
    </div>
  )
}