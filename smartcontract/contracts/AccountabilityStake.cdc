// AccountabilityStake.cdc

access(all) contract AccountabilityStake {

    access(all) struct Group {
        access(all) let id: UInt64
        access(all) let goal: String
        access(all) let members: [Address]
        access(self) var completions: {Address: Bool}
        access(self) var stakes: {Address: UFix64}
        access(self) var rewardDistributed: Bool
        
        // Getter methods for private fields
        access(all) fun getCompletion(member: Address): Bool? {
            return self.completions[member]
        }
        
        access(all) fun getStake(member: Address): UFix64? {
            return self.stakes[member]
        }
        
        access(all) fun isRewardDistributed(): Bool {
            return self.rewardDistributed
        }
        
        // Setter methods for private fields
        access(contract) fun setCompletion(member: Address, completed: Bool) {
            self.completions[member] = completed
        }
        
        access(contract) fun setRewardDistributed(distributed: Bool) {
            self.rewardDistributed = distributed
        }

        init(id: UInt64, goal: String, members: [Address], stakePerUser: UFix64) {
            self.id = id
            self.goal = goal
            self.members = members
            self.completions = {}
            self.stakes = {}
            self.rewardDistributed = false

            for addr in members {
                self.completions[addr] = false
                self.stakes[addr] = stakePerUser
            }
        }
    }

    access(all) var nextGroupID: UInt64
    access(all) var groups: {UInt64: Group}

    access(all) event GroupCreated(id: UInt64, goal: String, stake: UFix64, members: [Address])
    access(all) event GoalCompleted(groupID: UInt64, member: Address)
    access(all) event RewardsDistributed(groupID: UInt64, amountPerWinner: UFix64)

    init() {
        self.nextGroupID = 0
        self.groups = {}
    }

    access(all) fun createGroup(goal: String, members: [Address], stakeAmount: UFix64): UInt64 {
        let id = self.nextGroupID
        self.groups[id] = Group(id: id, goal: goal, members: members, stakePerUser: stakeAmount)
        self.nextGroupID = self.nextGroupID + 1

        emit GroupCreated(id: id, goal: goal, stake: stakeAmount, members: members)
        return id
    }

    access(all) fun markComplete(groupID: UInt64, member: Address) {
        let group = self.groups[groupID]!
        if !group.members.contains(member) {
            panic("You are not a member of this group")
        }

        group.setCompletion(member: member, completed: true)
        emit GoalCompleted(groupID: groupID, member: member)
    }

    access(all) fun distribute(groupID: UInt64) {
        let group = self.groups[groupID]!
        if group.isRewardDistributed() {
            panic("Already distributed")
        }

        var winners: [Address] = []
        for member in group.members {
            if group.getCompletion(member: member) == true {
                winners.append(member)
            }
        }
        
        if winners.length == 0 {
            panic("No winners to distribute rewards to")
        }

        // Calculate total stake by multiplying stake amount by number of members
        // We assume all members have the same stake amount
        let stakePerMember = group.getStake(member: group.members[0]) ?? panic("Stake amount not found")
        let totalStake: UFix64 = UFix64(group.members.length) * stakePerMember
        
        // Calculate reward per winner
        let rewardPerWinner: UFix64 = totalStake / UFix64(winners.length)

        // For MVP: just emit how much each winner would get
        // Later: actually send them tokens from the contract
        group.setRewardDistributed(distributed: true)
        emit RewardsDistributed(groupID: groupID, amountPerWinner: rewardPerWinner)
    }
    
    // Getter methods to support script files
    access(all) fun getGroup(id: UInt64): Group? {
        return self.groups[id]
    }
    
    access(all) fun getAllGroups(): {UInt64: Group} {
        return self.groups
    }
}