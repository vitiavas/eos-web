# Basic project template for EOS dApps

The project template can be used both in VS Code and CLion. It's part of the ["How to setup VS Code and CLion for EOS dApp Development"](https://infinitexlabs.com/setup-ide-for-eos-development/) tutorial. 


# Dependencies


* EOSIO v1.8.0.
* eosio.cdt v1.6.1
(https://developers.eos.io)

# Make sure to create your wallet and import development key-pair

EOS wallets explained https://developers.eos.io/eosio-home/docs/wallets


# Start new Blockchain from scratch

biosboot/genesis/genesis_start.sh

# After first start, the following start should be done 

biosboot/genesis/start.sh

# Stop Blockchain

biosboot/genesis/stop.sh

# Erase blockchain

biosboot/genesis/clean.sh

# Compile Contracts

scripts/build.sh

# Deploy Contracts

scripts/deploy.sh

# Full Build

scripts/fullBuild.sh


# Developers Portal

https://www.eosdocs.io/understandingeos/
