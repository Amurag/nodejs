const express = require('express')
require('./config')
const Product = require('./product');
const product = require('./product');
const app = express();
const multer = require('multer')
app.use(express.json())
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) { //cb means callback function
            cb(null, "uploads")// uploads is our folder where we store the image 
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".jpg")
        }
    })
}).single("user_file");//postman me body me jo name set kiya h uska name "user_file"

app.post('/upload',upload,(req,resp)=>{
    resp.send()
})
app.post('/create', async (req, resp) => {
    let data = new Product(req.body)
    let result = await data.save()
    console.log(result)
    resp.send(result)

})
app.get('/list', async (req, resp) => {
    let data = await Product.find();
    resp.send(data)

})

app.delete("/delete/:_id", async (req, resp) => {
    let data = await Product.deleteOne(req.params);
    resp.send(data)

})

app.put("/update/:_id", async (req, resp) => {
    let data = await Product.updateOne(
        req.params, {
        $set: req.body
    }
    );
    resp.send(data)

})
app.get("/serach/:key", async (req, resp) => {
    let data = await product.find({
        $or: [
            { "name": { $regex: req.params.key } },
            { "catego": { $regex: req.params.key } } //jo search karana h usko ham aise likh sakate h 
        ]
    })
    resp.send(data)
})
app.listen(5000);