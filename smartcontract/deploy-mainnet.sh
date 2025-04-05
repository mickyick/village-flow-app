#!/bin/bash

# Deploy the contract to Flow mainnet
flow project deploy --network=mainnet

# Verify deployment
echo "Verifying contract deployment..."
flow scripts execute ./scripts/getAllGroups.cdc --network=mainnet