
	
# Create eos-monarch accounts and distribute EOS by it's rams,cpu and bandwidth
# The main application accounts are login and storage. These accounts will hold smart contracts

cleos wallet open -n eos_wallet
cleos wallet unlock -n eos_wallet --password PW5HppwoVy7mTf8445BjEbo6LLxbEwg2uWAJPB9sGEAxr7kvxeAxg 

cleos create account eosio login EOS6EPatn2EfHKNkQhSaYZ1LS8pREpYzsPMuKB8ynq8BHWgEL7G1h -p eosio@active
cleos create account eosio storage EOS6U8NufGHBDszGbDVysGZDKCdihKr3exeCrbSnHprwbf1boNVSM -p eosio@active

cleos create account eosio viktor EOS5ZnMHhKdcwnahAZvBGbNNyQbdxG9qFsURUVmhphEXmjHUiZDHK -p eosio@active
cleos create account eosio sequeira EOS5kX3BrRWCzsNhkTC3umxwFrwB63UvwwzkvkgyFzxksJqQ8EvC8 -p eosio@active

cleos create account eosio gaspar EOS8JqYUF3omfsK4VJbBx2DtHWNZ3keKj2hpdvLRz9k9AMe3EVyxb -p eosio@active

cleos wallet lock -n eos_wallet
