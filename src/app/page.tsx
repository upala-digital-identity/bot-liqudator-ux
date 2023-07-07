import { Balance } from '../components/Balance'
import { ConnectButton } from '../components/ConnectButton'
import { Connected } from '../components/Connected'
import { ReadContract } from '../components/ReadContract'

export function Page() {
  return (
    <>
      <h1>Bot liquidator</h1>

      <ConnectButton />

      <Connected>
        <hr />
        <h2>Balances</h2>
        <Balance />
        <hr />
        <ReadContract />
        <br />
      </Connected>
    </>
  )
}

export default Page
