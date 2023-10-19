import { Balance } from '../components/Balance'
import { ConnectButton } from '../components/ConnectButton'
import { Connected } from '../components/Connected'
import { UpalaID } from '../components/UpalaID'
import { Warning } from '../components/Warning'

function Page() {
  return (
    <>
      <h1>Bot liquidator</h1>

      <ConnectButton />
      <Connected>
        <hr />
        {/* <h2>Balances</h2> */}
        <Balance />
        <hr />
        <UpalaID />
        <br />
        <Warning />
      </Connected>
    </>
  )
}

export default Page
