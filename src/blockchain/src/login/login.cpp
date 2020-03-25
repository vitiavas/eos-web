#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;
class [[eosio::contract("login")]] login : public eosio::contract {

  private:

    struct [[eosio::table]] user_info {
      name            user;
      std::string username;
      checksum256 uid;

      auto primary_key() const { return user.value; }
    };
    

    typedef eosio::multi_index<name("users"), user_info> users_table;

    users_table _users;


  public:

    login( name receiver, name code, datastream<const char*> ds ):contract(receiver, code, ds),
                       _users(receiver, receiver.value) {}

    [[eosio::action]]
    void authenticate(name user) {
        // Ensure this action is authorized by the player
        require_auth(user);
        // Create a record in the table if the player doesn't exist in our app yet
        auto user_iterator = _users.find(user.value);
        if (user_iterator == _users.end()) {
          user_iterator = _users.emplace(user,  [&](auto& new_user) {
            new_user.user = user;
          });
        } 
    }

    [[eosio::action]]
    void prove(std::string signing) { }
    
    [[eosio::action]]
    void upsert(name user, std::string username, checksum256 uid) {
      require_auth( user );
      users_table users(get_self(), get_first_receiver().value);
      auto iterator = users.find(user.value);
      eosio::check( iterator == users.end(), "Utilizador já existe!");
      //The user isn't in the table
      users.emplace(user, [&]( auto& row ) {
        row.user = user;
        row.username = username;
        row.uid = uid;
      });
    }

    [[eosio::action]]
    void erase(name user) {
      // require_auth(user);
      users_table users(get_self(), get_first_receiver().value);
      auto iterator = users.find(user.value);
      check(iterator != users.end(), "Record does not exist");
      users.erase(iterator);
    }

};

EOSIO_DISPATCH(login, (authenticate)(upsert)(erase)(prove))