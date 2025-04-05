// This script returns information about all accountability groups

import AccountabilityStake from "../contracts/AccountabilityStake.cdc"

access(all) fun main(): {UInt64: {String: AnyStruct}} {
    let result: {UInt64: {String: AnyStruct}} = {}
    
    // Convert each group to a dictionary to avoid reference issues
    for id in AccountabilityStake.groups.keys {
        if let group = AccountabilityStake.groups[id] {
            result[id] = {
                "id": group.id,
                "goal": group.goal,
                "members": group.members,
                "rewardDistributed": group.isRewardDistributed()
            }
        }
    }
    
    return result
}