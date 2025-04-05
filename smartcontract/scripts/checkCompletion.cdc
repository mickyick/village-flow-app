// This script checks if a member has completed their goal in a specific group

import AccountabilityStake from "../contracts/AccountabilityStake.cdc"

access(all) fun main(groupID: UInt64, member: Address): Bool {
    // Get the group
    let group = AccountabilityStake.groups[groupID] 
        ?? panic("Group does not exist")
    
    // Check if the member has completed their goal
    return group.getCompletion(member: member) ?? false
}