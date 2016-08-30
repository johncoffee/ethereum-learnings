contract Owned {
  function owned() { owner = msg.sender; }

    // The owner of this registry.
    address public owner = msg.sender;

    // This contract only defines a modifier but does not use it - it will
    // be used in derived contracts.
    // The function body is inserted where the special symbol "_" in the
    // definition of a modifier appears.
    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }

    function kill() onlyOwner {
        selfdestruct(owner);
    }
}

contract BaseRegistry is Owned {
    uint8 public constant UNREGISTER_COST = 255;

    // This struct keeps all data for a Record.
    struct Record {
        // Keeps the address of this record creator.
        // Keeps the time when this record was created.
        uint time;
        // Keeps the index of the keys array for fast lookup
        uint keysIndex;
        int[] lat;
        int[] lng;
        address[] owners;
    }

    // This mapping keeps the records of this Registry.
    mapping(bytes => Record) records;

    // Keeps the total numbers of records in this Registry.
    uint public numRecords;

    // Keeps a list of all keys to interate the records.
    bytes[] public keys;


    modifier onlyRecordOwner(bytes key, address sender) {
        address owner = getOwner(key);
        if (owner != sender) throw;
        _
    }

    // This is the function that actually insert a record.
    function register(bytes key, int lat, int lng) {
        if (records[key].time == 0) {
            records[key].time = now;
            records[key].keysIndex = keys.length;
            records[key].owners.push(msg.sender);
            keys.length++;
            keys[keys.length - 1] = key;
            records[key].lat.push(lat);
            records[key].lng.push(lng);
            numRecords++;
        } else {
            throw;
        }
    }

    // Updates the values of the given record.
    // function update(address key, bytes20 btih) onlyRecordOwner(key, msg.sender) {
    //     records[key].btih = btih;
    // }

    // Unregister a given record
    function unregister(bytes key) onlyRecordOwner(key, msg.sender) {
        // if (msg.value == UNREGISTER_COST) {
            //distributeValueToOwners(key, msg.value);

            uint keysIndex = records[key].keysIndex;
            delete records[key];
            numRecords--;
            keys[keysIndex] = keys[keys.length - 1];
            records[keys[keysIndex]].keysIndex = keysIndex;
            keys.length--;
        // }
    }

    function distributeValueToOwners(bytes key, uint value) {
        Record record = records[key];
        uint amountEach = value / (record.owners.length - 1);
        for (uint8 i = 0; i < record.owners.length - 1; i++) {
            address owner = record.owners[i];
            owner.send(amountEach);
        }
    }

    // Transfer ownership of a given record.
    function transfer(bytes key, address newOwner) {
        address owner = getOwner(key);
        if (owner == msg.sender) {
            records[key].owners.push(newOwner);
        } else {
            throw;
        }
    }

    // Tells whether a given key is registered.
    function isRegistered(bytes key) returns(bool) {
        return records[key].time != 0;
    }

    // function getRecordAtIndex(uint rindex) returns(address key, address owner, uint time, bytes20 btih) {
    //     Record record = records[keys[rindex]];
    //     key = keys[rindex];
    //     owner = getOwner(key);
    //     time = record.time;
    //     btih = record.btih;
    // }

    // function getRecord(address key) returns(address owner, uint time, bytes32 btih) {
    //     Record record = records[key];
    //     owner = getOwner(key);
    //     time = record.time;
    //     btih = record.btih;
    // }

    // Returns the owner of the given record. The owner could also be get
    // by using the function getRecord but in that case all record attributes
    // are returned.
    function getOwner(bytes key) returns(address) {
        Record record = records[key];
        return record.owners[record.owners.length-1];
    }

    // Returns the registration time of the given record. The time could also
    // be get by using the function getRecord but in that case all record attributes
    // are returned.
    function getTime(bytes key) returns(uint) {
        return records[key].time;
    }

    function empty() onlyOwner {
        if (this.balance > 0) {
            owner.send(this.balance);
        }
    }
}

contract Registry is BaseRegistry {}