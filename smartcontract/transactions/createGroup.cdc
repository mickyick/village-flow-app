// createGroup.cdc
// This transaction creates a new accountability group

import AccountabilityStake from "../contracts/AccountabilityStake.cdc"

transaction(goal: String, members: [Address], stakeAmount: UFix64) {
    
    prepare(acct: &Account) {
        // Nothing to prepare
    }
    
    execute {
        let groupID = AccountabilityStake.createGroup(
            goal: goal,
            members: members,
            stakeAmount: stakeAmount
        )
        
        log("Created group with ID: ".concat(groupID.toString()))
    }
}