pragma solidity ^0.5.0;

contract User {
    uint public distance = 50;
    address owner;

    struct Coupon {
        uint id;
        string name;

    }

    mapping (uint => Coupon) public coupons;

    constructor() public{
        owner = msg.sender;
    }

    modifier checkBalance(uint toSubtract){
        require(distance >= toSubtract, "Insufficient distance");
        _;
    }

    function test() public pure returns(string memory){
        return "testing string";
    }

    function addDistance(uint _distance) public{
        distance += _distance;
    }

    function subtractDistance(uint _distance) public {
        distance -= _distance;
    }

    function claimReward(uint _distanceToSubtract) public checkBalance(_distanceToSubtract) {
        distance -= _distanceToSubtract;

    }
}