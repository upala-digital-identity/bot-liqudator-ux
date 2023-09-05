'use client'

export function LiquidationCheque({ liquidationCheque, isLoadingCheque }:
    { liquidationCheque: any, isLoadingCheque: any }) {
    // console.log(liquidationCheque)

    return (
        <div>
        <b>1. Verifiy discord stamp for your address at <a href="https://passport.gitcoin.co">Gitcoin Passport</a></b>
        { liquidationCheque?.score > 0 ? '[✓ - verified]' : '[not verified]' }
        { isLoadingCheque ? 'loading...' : '' }
      <br />
      <br />
      </div>
  )
}