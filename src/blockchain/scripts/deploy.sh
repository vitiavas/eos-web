cleos wallet open -n eos_wallet
cleos wallet unlock -n eos_wallet --password PW5HppwoVy7mTf8445BjEbo6LLxbEwg2uWAJPB9sGEAxr7kvxeAxg 

cleos set contract login build/login -p login@active
cleos set contract storage build/storage -p storage@active

cleos wallet lock -n eos_wallet
