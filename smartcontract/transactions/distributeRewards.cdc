// distributeRewards.cdc
// This transaction distributes rewards to members who completed their goals

import AccountabilityStake from "../contracts/AccountabilityStake.cdc"

transaction(groupID: UInt64) {
    
    prepare(acct: &Account) {
        // Nothing to prepare
    }
    
    execute {
        AccountabilityStake.distribute(groupID: groupID)
        
        log("Distributed rewards for group: ".concat(groupID.toString()))
    }
}