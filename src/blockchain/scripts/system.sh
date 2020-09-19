
	
# Important system accounts are the following with 
# eosio.token and eosio.msig being priveledged accounts
# eosio.token, eosio.msig, eosio.system are accounts with smart contracts installed (deployed)
# By this system setup we create 1 bilion of EOS tokens and put them in circulation.

PK=EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
EOS_CONTRACTS_DIR=/home/viktor/developer/contracts/eosio.contracts/build
CLEOS=cleos 

$CLEOS wallet open
$CLEOS wallet unlock --password PW5KSADwS62Bv263obof9SWmRBzAsdtYRSnDBb6GkGVH82v9MoTXL
	
$CLEOS create account eosio eosio.rex $PK $PK
$CLEOS create account eosio eosio.token $PK $PK
$CLEOS create account eosio eosio.msig $PK $PK
$CLEOS create account eosio eosio.bpay $PK $PK
$CLEOS create account eosio eosio.names $PK $PK
$CLEOS create account eosio eosio.ram $PK $PK
$CLEOS create account eosio eosio.ramfee $PK $PK
$CLEOS create account eosio eosio.saving $PK $PK
$CLEOS create account eosio eosio.stake $PK $PK
$CLEOS create account eosio eosio.vpay $PK $PK


$CLEOS set contract eosio $EOS_CONTRACTS_DIR/eosio.bios

$CLEOS set contract eosio.token $EOS_CONTRACTS_DIR/eosio.token -p eosio.token
$CLEOS set contract eosio.msig $EOS_CONTRACTS_DIR/eosio.msig -p eosio.msig
$CLEOS push action eosio.token create '["eosio", "10000000000.0000 EOS",0,0,0]' -p eosio.token
$CLEOS push action eosio.token issue '["eosio","1000000000.0000 EOS", "issue"]' -p eosio

$CLEOS set contract eosio $EOS_CONTRACTS_DIR/eosio.system -p eosio
# Initialize the system account with code 0 (needed at initialization time) and EOS token with precision 4
$CLEOS push action eosio init '[0, "4,EOS"]' -p eosio
# Make eosio.msig a priveledged account
$CLEOS push action eosio setpriv '["eosio.msig", 1]' -p eosio@active

$CLEOS wallet lock
