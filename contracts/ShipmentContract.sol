// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

contract ShipmentContract {
    enum LocationType {
        MainWareHouse,
        SubWareHouse,
        CityHub,
        Customer
    }

    struct Location {
        address id;
        string name;
        string city;
        string state;
        string country;
        LocationType locType;
        bool is_verified;
    }

    struct Shipment {
        uint128 id;
        Location source;
        Location current;
        Location next;
        Location destination;
        bool is_delivered;
        bool is_verified;
    }

    address public owner;
    mapping(address => Location) public locations;
    mapping(uint128 => Shipment) public shipments;

    constructor() payable {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You cannot perform this action");
        _;
    }

    function addOrUpdateLocation(
        address id,
        string memory name,
        string memory city,
        string memory state,
        string memory country,
        LocationType loctype
    ) public onlyOwner {
        locations[id] = Location(id, name, city, state, country, loctype, true);
    }

    function addShipment(
        uint128 shipmentId,
        address sourceId,
        address nextId,
        address destinationId
    ) public onlyOwner {
        require(
            locations[sourceId].is_verified,
            "Invalid Location Address for 'source'"
        );
        require(
            locations[nextId].is_verified,
            "Invalid Location Address for 'next'"
        );
        require(
            locations[destinationId].is_verified,
            "Invalid Location Address for 'destination'"
        );
        require(
            !shipments[shipmentId].is_verified,
            "Shipment ID already exists"
        );
        shipments[shipmentId] = Shipment(
            shipmentId,
            locations[sourceId],
            locations[sourceId],
            locations[nextId],
            locations[destinationId],
            false,
            true
        );
    }

    function updateShipmentLocation(uint128 shipmentId, address nextId) public {
        require(shipments[shipmentId].is_verified, "Invalid Shipment ID");
        require(
            locations[nextId].is_verified,
            "Invalid Location Address for 'next'"
        );
        require(
            locations[msg.sender].locType != LocationType.Customer,
            "You cannot perform this action"
        );
        require(
            msg.sender == shipments[shipmentId].next.id,
            "You cannot update the location"
        );
        require(
            !shipments[shipmentId].is_delivered,
            "Shipment is already delivered"
        );
        shipments[shipmentId].current = shipments[shipmentId].next;
        shipments[shipmentId].next = locations[nextId];
    }

    function shipmentDelivered(uint128 shipmentId) public {
        require(shipments[shipmentId].is_verified, "Invalid Shipment ID");
        require(
            locations[msg.sender].locType == LocationType.Customer,
            "You cannot perform this action"
        );
        require(
            msg.sender == shipments[shipmentId].next.id,
            "Shipment has not arrived at destination"
        );
        require(
            !shipments[shipmentId].is_delivered,
            "Shipment is already delivered"
        );
        shipments[shipmentId].current = shipments[shipmentId].next;
        shipments[shipmentId].is_delivered = true;
    }
}
