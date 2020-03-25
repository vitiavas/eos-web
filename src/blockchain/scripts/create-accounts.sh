
	
# Create eos-monarch accounts and distribute EOS by it's rams,cpu and bandwidth
# The main application accounts are login and storage. These accounts will hold smart contracts

cleos wallet open [WALLET_PASSWORD]
cleos wallet unlock --password [WALLET_PASSWORD]

cleos create account eosio login [LOGIN_PUB_KEY] -p eosio@active
cleos create account eosio storage [STORAGE_PUB_KEY] -p eosio@active

cleos wallet lock
