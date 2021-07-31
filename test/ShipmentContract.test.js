const ShipmentContract = artifacts.require('./ShipmentContract.sol');

contract('ShipmentContract', (accounts) => {
	before(async () => {
		this.shipmentContract = await ShipmentContract.deployed();
	});

	it('Phase #1: Contract Deploy', async () => {
		const address = await this.shipmentContract.address;
		assert.notEqual(address, 0x0);
		assert.notEqual(address, '');
		assert.notEqual(address, null);
		assert.notEqual(address, undefined);
	});

	it('Phase #2: Owner Verification', async () => {
		const owner = await this.shipmentContract.owner();
		assert.equal(owner, accounts[0]);
	});

	it('Phase #3: Add Location', async () => {
		var loc = await this.shipmentContract.locations(accounts[0]);
		assert.equal(loc.is_verified, false);
		loc = await this.shipmentContract.locations(accounts[1]);
		assert.equal(loc.is_verified, false);
		loc = await this.shipmentContract.locations(accounts[2]);
		assert.equal(loc.is_verified, false);
		loc = await this.shipmentContract.locations(accounts[3]);
		assert.equal(loc.is_verified, false);
		await this.shipmentContract.addOrUpdateLocation(
			accounts[0],
			'MainWarehouse',
			'Ranchi',
			'Jharkhand',
			'IN',
			0
		);
		await this.shipmentContract.addOrUpdateLocation(
			accounts[1],
			'SubWarehouse',
			'Ranchi',
			'Jharkhand',
			'IN',
			1
		);
		await this.shipmentContract.addOrUpdateLocation(
			accounts[2],
			'CityHub',
			'Kolkata',
			'Kolkata',
			'IN',
			2
		);
		await this.shipmentContract.addOrUpdateLocation(
			accounts[3],
			'CustomerName',
			'Kolkata',
			'Kolkata',
			'IN',
			3
		);
		loc = await this.shipmentContract.locations(accounts[0]);
		assert.equal(loc.is_verified, true);
		assert.equal(loc.name, 'MainWarehouse');
		assert.equal(loc.city, 'Ranchi');
		assert.equal(loc.state, 'Jharkhand');
		assert.equal(loc.country, 'IN');
		loc = await this.shipmentContract.locations(accounts[1]);
		assert.equal(loc.is_verified, true);
		assert.equal(loc.name, 'SubWarehouse');
		assert.equal(loc.city, 'Ranchi');
		assert.equal(loc.state, 'Jharkhand');
		assert.equal(loc.country, 'IN');
		loc = await this.shipmentContract.locations(accounts[2]);
		assert.equal(loc.is_verified, true);
		assert.equal(loc.name, 'CityHub');
		assert.equal(loc.city, 'Kolkata');
		assert.equal(loc.state, 'Kolkata');
		assert.equal(loc.country, 'IN');
		loc = await this.shipmentContract.locations(accounts[3]);
		assert.equal(loc.is_verified, true);
		assert.equal(loc.name, 'CustomerName');
		assert.equal(loc.city, 'Kolkata');
		assert.equal(loc.state, 'Kolkata');
		assert.equal(loc.country, 'IN');
	});

	it('Phase #4: Add Shipment', async () => {
		var shipment = await this.shipmentContract.shipments(12345);
		assert.equal(shipment.is_verified, false);
		await this.shipmentContract.addShipment(12345, accounts[0], accounts[1], accounts[3]);
		shipment = await this.shipmentContract.shipments(12345);
		assert.equal(shipment.is_verified, true);
		assert.equal(shipment.source.id, accounts[0]);
		assert.equal(shipment.current.id, accounts[0]);
		assert.equal(shipment.next.id, accounts[1]);
		assert.equal(shipment.destination.id, accounts[3]);
	});

	it('Phase #5: Update Shipment Location', async () => {
		var shipment = await this.shipmentContract.shipments(12345);
		assert.equal(shipment.is_verified, true);
		await this.shipmentContract.updateShipmentLocation(12345, accounts[2], { from: accounts[1] });
		shipment = await this.shipmentContract.shipments(12345);
		assert.equal(shipment.is_verified, true);
		assert.equal(shipment.current.id, accounts[1]);
		assert.equal(shipment.next.id, accounts[2]);
		await this.shipmentContract.updateShipmentLocation(12345, accounts[3], { from: accounts[2] });
		shipment = await this.shipmentContract.shipments(12345);
		assert.equal(shipment.is_verified, true);
		assert.equal(shipment.current.id, accounts[2]);
		assert.equal(shipment.next.id, accounts[3]);
	});

	it('Phase #6: Shipment Delivered', async () => {
		var shipment = await this.shipmentContract.shipments(12345);
		assert.equal(shipment.is_verified, true);
		await this.shipmentContract.shipmentDelivered(12345, { from: accounts[3] });
		shipment = await this.shipmentContract.shipments(12345);
		assert.equal(shipment.is_verified, true);
		assert.equal(shipment.is_delivered, true);
		assert.equal(shipment.current.id, accounts[3]);
	});
});
