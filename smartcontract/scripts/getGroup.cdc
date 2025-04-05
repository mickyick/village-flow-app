// This script returns information about a specific accountability group

import AccountabilityStake from "../contracts/AccountabilityStake.cdc"

access(all) fun main(groupID: UInt64): {String: AnyStruct}? {
    // Get the group and return its data as a dictionary
    if let group = AccountabilityStake.groups[groupID] {
        let result: {String: AnyStruct} = {
            "id": group.id,
            "goal": group.goal,
            "members": group.members,
            "rewardDistributed": group.isRewardDistributed()
        }
        return result
    }
    return nil
}