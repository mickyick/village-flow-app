// markComplete.cdc
// This transaction marks a goal as complete for a specific member in a group

import AccountabilityStake from "../contracts/AccountabilityStake.cdc"

transaction(groupID: UInt64, member: Address) {
    
    prepare(acct: &Account) {
        // Nothing to prepare
    }
    
    execute {
        AccountabilityStake.markComplete(
            groupID: groupID,
            member: member
        )
        
        log("Marked goal as complete for member: ".concat(member.toString()))
    }
}