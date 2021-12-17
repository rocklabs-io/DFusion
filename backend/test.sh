#!/bin/bash

set -e

# clear
dfx stop
rm -rf .dfx

ALICE_HOME=$(mktemp -d -t alice-temp)
BOB_HOME=$(mktemp -d -t bob-temp)

ALICE_PUBLIC_KEY="principal \"$( \
    HOME=$ALICE_HOME dfx identity get-principal
)\""
BOB_PUBLIC_KEY="principal \"$( \
    HOME=$BOB_HOME dfx identity get-principal
)\""

echo Alice id = $ALICE_PUBLIC_KEY
echo Bob id = $BOB_PUBLIC_KEY

HOME=$ALICE_HOME
dfx start --background
dfx canister --no-wallet create --all
dfx build

eval dfx canister --no-wallet install dfusion --argument="'(principal \"$(dfx identity get-principal)\")'"

echo Alice create entry "Hello World"
eval dfx canister --no-wallet call dfusion createEntry "'Hello World!'"
echo entry created 

echo Alice create entry "Hello DFusion"
eval dfx canister --no-wallet call dfusion createEntry "'Hello DFusion!'"
echo entry created 

echo get Alice\'s entry
eval dfx canister --no-wallet call dfusion getUserEntries "'($ALICE_PUBLIC_KEY)'"

HOME=$BOB_HOME
echo Bob create entry "Hello DFinity"
eval dfx canister --no-wallet call dfusion createEntry "'Hello DFinity!'"

echo get Bob\'s entry
eval dfx canister --no-wallet call dfusion getUserEntries "'($BOB_PUBLIC_KEY)'"

echo get all entries
eval dfx canister --no-wallet call dfusion getAllEntries 

echo Bob like article 0 from Alice 
eval dfx canister --no-wallet call dfusion like 0

echo get Article 0
eval dfx canister --no-wallet call dfusion getEntry 0

echo Bob unlike article 0
eval dfx canister --no-wallet call dfusion like 0

echo get Article 0
eval dfx canister --no-wallet call dfusion getEntry 0

echo Bob follow Alice
eval dfx canister --no-wallet call dfusion follow "'($ALICE_PUBLIC_KEY)'"

echo get Bob and Alice user info
echo Alice:
eval dfx canister --no-wallet call dfusion getUser "'($ALICE_PUBLIC_KEY)'"
echo Bob:
eval dfx canister --no-wallet call dfusion getUser "'($BOB_PUBLIC_KEY)'"

echo Bob unfollow Alice
eval dfx canister --no-wallet call dfusion follow "'($ALICE_PUBLIC_KEY)'"

echo get Bob and Alice user info
echo Alice:
eval dfx canister --no-wallet call dfusion getUser "'($ALICE_PUBLIC_KEY)'"
echo Bob:
eval dfx canister --no-wallet call dfusion getUser "'($BOB_PUBLIC_KEY)'"

echo getAllEntries
eval dfx canister --no-wallet call dfusion getAllEntries

dfx stop