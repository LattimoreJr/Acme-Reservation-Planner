const pg = require('pg')
const client = new pg.Client('postgres://localhost/acme_reservation_planner')
const {v4} = require('uuid')
const uuidv4 = v4


const createCustomer = async (customer) => {
    const SQL = `
        INSERT INTO customers(id, name)
        VALUES($1,$2)
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), customer.name])
    return response.rows[0]
}

const createRestaurant = async (restaurant) => {
    const SQL = `
        INSERT INTO restaurants(id, name)
        VALUES($1,$2)
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), restaurant.name])
    return response.rows[0]
}

const createReservation = async(reservation) => {
    const SQL = `
        INSERT INTO reservations(id, date, party_count, restaurant_id, customer_id)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), reservation.date, reservation.party_count, reservation.restaurant_id, reservation.customer_id])
    return response.rows[0]
}

const fetchCustomers = async () => {
    const SQL = `
        SELECT *
        FROM customers
    `
    const response = await client.query(SQL)
    return response.rows
}

const fetchRestaurants = async () => {
    const SQL = `
        SELECT *
        FROM restaurants
    `
    const response = await client.query(SQL)
    return response.rows
}

const fetchReservations = async () => {
    const SQL = `
        SELECT *
        FROM reservations
    `
    const response = await client.query(SQL)
    return response.rows
}

const destroyReservation = async (id, customer_id) => {
    const SQL = `
        DELETE FROM reservations
        WHERE id = $1 AND customer_id = $2
    `
    await client.query(SQL, [id, customer_id])

}



const seed = async () => {
    const SQL = `
        DROP TABLE IF EXISTS reservations;
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS restaurants;
        CREATE TABLE customers(
            id UUID PRIMARY KEY,
            name VARCHAR(100)
        );
        CREATE TABLE restaurants(
            id UUID PRIMARY KEY,
            name VARCHAR(100)
        );
        CREATE TABLE reservations(
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
            customer_id UUID REFERENCES customers(id) NOT NULL
        );
    `
    await client.query(SQL)
    const [moe, joe, flo] = await Promise.all([
        createCustomer({name: 'will'}),
        createCustomer({name: 'mike'}),
        createCustomer({name: 'dave'}),
    ])
    const [sushi, greek, fastFood] = await Promise.all([
        createRestaurant({name:'sushi'}),
        createRestaurant({name:'greek'}),
        createRestaurant({name:'fast food'}),
    ])
    await Promise.all([
        createReservation({
            date: new Date(2025, 9, 25),
            party_count: 2,
            restaurant_id: sushi.id,
            customer_id: flo.id
        })
    ])
}


module.exports = { 
    client, 
    seed, 
    createCustomer, 
    createRestaurant, 
    fetchCustomers, 
    fetchRestaurants, 
    fetchReservations, 
    createReservation, 
    destroyReservation 
}