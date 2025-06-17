const express = require('express')
const app = express.Router()
const{
    client,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    createReservation,
    destroyReservation
} = require('./db')

app.get('/customers', async(req,res,next) => {
    try {
        res.send(await fetchCustomers())
    } catch (error) {
        next(error)
    }
})

app.get('/restaurants', async(req,res,next) => {
    try {
        res.send(await fetchRestaurants())
    } catch (error) {
        next(error)
    }
})

app.get('/reservations', async(req,res,next) => {
    try {
        res.send(await fetchReservations())
    } catch (error) {
        next(error)
    }
})

app.post('/customers/:id/reservations', async(req,res,next) => {
    try {
        res.send(await createReservation(req.body))
    } catch (error) {
        next(error)
    }
})

app.delete('/customers/:customer_id/reservations/:id', async(req,res,next) => {
    try {
        await destroyReservation(req.params.id, req.params.customer_id)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})


module.exports = app