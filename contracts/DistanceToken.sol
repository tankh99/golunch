pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract DistanceToken is ERC20{
    address owner;
    string public name = "DistanceToken";
    string public symbol = "DST";
    uint public decimals = 6;
    uint public initialSupply = 1000000 * 10**18;

    struct User {
        uint distance;
    }


    mapping (address => User) public users;
    

    constructor() public {
        _mint(msg.sender, initialSupply);
        owner = msg.sender;
    }

    function redeemReward() public payable returns(uint){
        transfer(owner, msg.value);
        User storage user = users[msg.sender];
        user.distance -= msg.value;
    }
}