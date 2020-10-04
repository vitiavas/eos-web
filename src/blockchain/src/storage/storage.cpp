#include <eosio/eosio.hpp>
#include <eosio/crypto.hpp>
#include <eosio/transaction.hpp>

using namespace std;
using namespace eosio;
class [[eosio::contract("storage")]] storage : public eosio::contract {

  private:

    struct [[eosio::table]] history_audit {
      uint64_t id;
      checksum256 hash_uid;
      std::string date;
      std::string status;
      std::string event;
      uint32_t minTime;
      uint32_t maxTime; 
      auto primary_key() const { return id; }
    };

    struct [[eosio::table]] records_info {
      uint64_t id;
      checksum256 hash_uid;
      checksum256 hash;
      uint32_t stamp_secs;
      uint32_t stamp_nsecs; 
      checksum256 txid;
      std::string code;
      auto primary_key() const { return id; }

      // Fix the table. May need to drop all blockchain and start a new one later because of primary key uniqueness and serialization is broken
      EOSLIB_SERIALIZE( records_info, (id)(hash_uid)(hash)(stamp_secs)(stamp_nsecs)(txid)(code))

    };

    typedef eosio::multi_index<name("records"), records_info> records;

    typedef eosio::multi_index<name("history"), history_audit> history;

    records _records;

    history _history;

  public:

    storage( name receiver, name code, datastream<const char*> ds ):contract(receiver, code, ds),
                       _records(receiver, receiver.value), _history(receiver, receiver.value) {}


    checksum256 get_trx_id() {
        size_t size = transaction_size();
        char buf[size];
        size_t read = read_transaction( buf, size );
        eosio::check( size == read, "read_transaction failed");
        return sha256( buf, read );
    }

    [[eosio::action]]
    void insert(name user, checksum256 hash, checksum256 hash_uid, uint32_t stamp_secs, uint32_t stamp_nsecs, std::string date, std::string status, std::string event) {
        // Ensure this action is authorized by the user
        require_auth(user);
        // get_self -> name of this contract
        // get_first_receiver -> scope (Since we have only 1 table. get_first_receiver ensures that only 1 will be taken)
        // // Create a record in the table
        _records.emplace(user, [&](auto &new_record) {
            new_record.hash = hash;
            new_record.hash_uid = hash_uid;
            new_record.stamp_secs = stamp_secs;
            new_record.stamp_nsecs = stamp_nsecs;
            new_record.txid = get_trx_id();
            new_record.id = _records.available_primary_key();
        });
    }
    
    [[eosio::action]]
    void update(name user, checksum256 hash_uid, std::string date, std::string event, std::string status, uint32_t minTime, uint32_t maxTime) {
        // Ensure this action is authorized by the user
        require_auth(user);
        _history.emplace(user, [&](auto &new_record) {
            new_record.hash_uid = hash_uid;
            new_record.date = date;
            new_record.status = status;
            new_record.event = event;
            new_record.minTime = minTime;
            new_record.maxTime = maxTime;
            new_record.id = _history.available_primary_key();
        });
    }

    [[eosio::action]]
    void eraseall() {
      records records(get_self(), get_first_receiver().value);
      auto it = records.begin();
      while (it != records.end()) {
        it = records.erase(it);
      }

      history history(get_self(), get_first_receiver().value);
      auto it2 = history.begin();
      while (it2 != history.end()) {
        it2 = history.erase(it2);
      }
    }

    [[eosio::action]]
    void erase(name user, uint32_t minTime, uint32_t maxTime, checksum256 hash_rfid) {
      require_auth(user);
      records records(get_self(), get_first_receiver().value);
      for(auto itr = records.begin(); itr != records.end();) {
        if(itr->stamp_secs >= minTime && itr->stamp_secs <= maxTime && itr->hash_uid == hash_rfid) {
          itr = records.erase(itr);
        }
      }
    }

};

EOSIO_DISPATCH(storage, (insert)(update)(erase)(eraseall))