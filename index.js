const express = require('express')
require('./config')
const Product = require('./product');
const product = require('./product');
const UserSchema = require('./user');
const app = express();     //Covert the data in json format
const bcrypt = require('bcrypt'); //password hidden npm
const multer = require('multer') // uplad the file npm 
const jwt = require('jsonwebtoken')  // download jwt token
const JWT_TOKEN = 'Anurag@123' // name of our secret key 
app.use(express.json())
const { body, validationResult } = require('express-validator');
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

app.post('/upload', upload, (req, resp) => {
    resp.send()
})

// type 1 insert the data
app.post('/create', async (req, resp) => {
    let data = new UserSchema(req.body) // userschema is path of model where we store the data
    let result = await data.save()
    console.log(result)
let datasave={status:200 , statusmessage:"response succes"}
let responsecode={response1:datasave}
//  return datasave
 resp.send(responsecode)
})
// type 1 insert the data
// type 2 insert the data
app.post('/create1', async (req, resp, next) => {
    const product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        model: req.body.model,
        category: req.body.category
    })
    product.save()
        .then(result => {
            resp.status(200).json({
                Product: result
            })
            resp.send(Product)
        })
        .catch(err => {
            console.log(err)
            resp.status(500).json({
                error: err
            })
        })
})
// type 2 insert the data


app.get('/list', async (req, resp) => {
    let data = await Product.find();
    resp.send(data)
})
// get the specific id data
app.get('/listid/:_id', async (req, resp) => {
    let data = await Product.findById(req.params)
        .then(result => {
            resp.status(200).json({
                Product: result
            })
            resp.send(data)
        })
        .catch(err => {
            console.log(err)
            resp.status(500).json({
                error: err
            })
        })


})
// get the specific id data
app.delete("/delete/:_id", async (req, resp) => {
    let data = await Product.deleteOne(req.params)
    if(data)
    {
        let datasave={status:200 , statusmessage:"delete successfully"}
        let responsecode={response1:datasave}
        //  return datasave
         resp.send(responsecode)
    }
    
   

})
// update code type 1
app.put("/update/:_id", async (req, resp) => {
    let data = await Product.updateOne(
        req.params, {
        $set: req.body
    });
    resp.send(data)
})
// update code type 1

// update code type 2
app.put("/update2/:_id", async (req, resp, next) => {
    console.log(req.params._id)
    Product.findOneAndUpdate({ _id: req.params._id }, {
        $set: {
            name: req.body.name,
            brand: req.body.brand,
            model: req.body.model,
            category: req.body.category
        }
    })
        .then(result => {
            resp.status(200).json({
                Product: result
            })
            resp.send(data)
        })
        .catch(err => {
            console.log(err)
            resp.status(500).json({
                error: err
            })
        })

})
// update code type 2

app.get("/serach/:key", async (req, resp) => {
    let data = await product.find({
        $or: [
            { "name": { $regex: req.params.key } },
            { "catego": { $regex: req.params.key } } //jo search karana h usko ham aise likh sakate h 
        ]
    })
    resp.send(data)
})


// signup 
app.post('/signup', async (req, resp, next) => {
    try{
    const {email,password} = req.body
    const oldUser = await UserSchema.findOne({ email });
    if (oldUser) {
        return resp.status(409).send("User Already Exist. Please Login");
      }
    const salt = await bcrypt.genSalt(10)
    const secpass = await bcrypt.hash(req.body.password, salt)
    {
        const User = new UserSchema({
            name: req.body.name,
            email: req.body.email,
            password: secpass,
           
        })
        const data = {
            User: {
                id: User.id
            }
        }
        const token = jwt.sign(data, JWT_TOKEN)
        console.log(token)
        resp.json(token)
        result = await User.save()
    
        console.log(result)
        resp.send(result)
    
    }
}
        catch(error){
        
                resp.status(500)
             }
    

})
// signup 

// login Api
app.post('/login',async(req, resp) => {
    const {email,password} = req.body
    // [
    //     body('email','Enter Email ').isEmail(),
    //     body('password','Password').exists()
    // ], 
    // Finds the validation errors in this request and wraps them in an object with handy functions
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    try{
        let User = await UserSchema.findOne({email});

    //   console.log(User)
      if(!User)
      {
        return resp.status(400).json({error:"user not exist"})
      }
      const passwordCampare=await bcrypt.compare(password,User.password);
      if(!passwordCampare)
      {
        return resp.status(400).json({error:"user not exist"})
      }
      const data = {
        User: {
            id: User.id
        }
    }
    const token = jwt.sign(data, JWT_TOKEN)
    console.log(token)
    resp.json(token)
    }
    catch(error){
        
       resp.status(500)
    }
    })
// login Api
app.listen(9000, () => {
    console.log("jjjj")
})