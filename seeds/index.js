const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: "6135a18946e7820764c70243",
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'lo',
            price,
            geometry: { type: 'Point', coordinates: [ -6.379508, 39.459118 ] },
            images: [
                {
                  url: 'https://res.cloudinary.com/dubix1non/image/upload/v1630964322/YelpCamp/dukinz83kikee8nryy7e.jpg',
                  filename: 'YelpCamp/dukinz83kikee8nryy7e',
                },
                {
                  url: 'https://res.cloudinary.com/dubix1non/image/upload/v1630964322/YelpCamp/ogi5hqn4hsdew8kshuk3.jpg',
                  filename: 'YelpCamp/ogi5hqn4hsdew8kshuk3',
                },
                {
                  url: 'https://res.cloudinary.com/dubix1non/image/upload/v1630964323/YelpCamp/voceoay9e7qbz9yiavay.jpg',
                  filename: 'YelpCamp/voceoay9e7qbz9yiavay',
                }
              ],
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})