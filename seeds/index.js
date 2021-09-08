if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()  // STORE THE CLOUDINARY API AND KEY TO .ENV
}
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')
const imageCollection = require('./campgrounds')

mongoose.connect(process.env.DB_URL, {})
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 200; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const imgNums = Math.floor(Math.random() * 3) + 1
        let imgs = []
        for (let i = 0; i < imgNums; i++) {
          const urlStr = sample(imageCollection).url
          const fileName = urlStr.split('/')[urlStr.split('/').length - 1].split('.')[0]
          imgs.push({
            url: urlStr,
            filename: fileName
          })
        }
        const camp = new Campground({
            author: "6137b821266ef30fe8aeeed7",
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'lo',
            price,
            geometry: { type: 'Point',
                        coordinates: [ cities[random].longitude, cities[random].latitude ] 
                      },
            images: imgs
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})