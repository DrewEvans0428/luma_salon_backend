const express = require("express");
const cors = require("cors");
const multer = require("multer")
const app = express();
const Joi = require("joi");
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use(express.json());
app.use(cors());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

mongoose
.connect("mongodb+srv://Drew_Luma:Duke2005@lumasalonbackend.rm7yduo.mongodb.net/?retryWrites=true&w=majority&appName=LumaSalonBackend")
.then(() => {
    console.log("conncected to mongodb");
})
.catch((error) => {
    console.log("couldn't connect to mongodb", error);
});

const serviceSchema = new mongoose.Schema({
    Name:String,
    pricing:String,
    Description:String,
    img_name:String,
});

const Service = mongoose.model("Service", serviceSchema);

app.get("/",(req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.get("/api/services", async(req, res) => {
    const services = await Service.find();
    res.send(services);
})

app.post("/api/services", upload.single("img"),async(req,res)=>{
    const result = validateService(req.body);

    if(result.error){
        console.log("I have an error");
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const service = new Service({
        Name:req.body.Name,
        pricing:req.body.pricing,
        Description:req.body.Description,
    });
    
    if(req.file){
        service.img_name = "images/" + req.file.filename;
    }

    const newService = await service.save();
    res.status(200).send(newService);
});

app.put("/api/services/:id", upload.single("img"),async(req,res)=>{
    const result = validateService(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const fieldsToUpdate = {
    Name:service.Name = req.body.Name,
    pricing:service.pricing = req.body.pricing,
    Description:service.Description = req.body.Description
    }

    if(req.file){
        fieldsToUpdate.img_name = "images/" + req.file.filename;
    }

    const wentThrough = await Service.updateOne({_id:req.params.id}, fieldsToUpdate);
    const service = await Service.findOne({_id:req.params.id});

    res.status(200).send(service);
});


/*
let services = [
    {
        "_id":1,
        "Name":"Hair Cuts",
        "Stylists": [
            "Jennifer Evans",
            "Rhonda Reeves"
        ],
        "pricing":"dependent on stylist but average cost is around $40",
        "Description": "Here at Luma Salon we know how to do all types of haircuts no matter the length.Some of our haircuts include bobs, pixie cuts, layered cuts, Lobs, and undercuts. Hair services are also not limited to  just women, we have many male clients who come in regularly and get all ranges of haircuts.",
        "haircut-options":[
            "bobs",
            "pixie cuts",
            "layered cuts",
            "Lobs",
            "undercuts"
        ],
    "img_name":"images/haircut.jpg"
    },
    {
        "_id":2,
        "Name":"Waxings",
        "Stylists":[
            "Jennifer Evans",
            "Rhonda Reeves"
        ],
        "pricing":"Dependent on stylist, but average price is around $20",
        "Description":"Facial Waxings are also dependent on the stylist. They are normally a cheaper option as theyre normally pretty quick. This normally consists of an eyebrow touchup, using hot wax and a waxing strip. This service is offered to both male and female clients.",
        "img_name":"images/waxing.jpg"
    },
    {
        "_id":3,
        "Name":"Coloring",
        "Stylists":[
            "Jennifer Evans",
            "Rhonda Reeves"
        ],
        "pricing":"Dependent on how long it takes, but typically around $100",
        "Description":"Our coloring treatments normally take a little longer than other services. some of our coloring services consist of highlights, lowlights, base color, and gloss. Highlights are used to add lighter shades to hair, they can be any color. Lowlights are subtle highlights that add dimension and depth to your hair color, theyre unlike normal highlights as they are more subtle than highlights.",
        "coloring-options":[
            "highlights",
            "lowlights",
            "base color",
            "gloss"
        ],
        "img_name":"images/coloring.jpg"
    },
    {
        "_id":4,
        "Name":"Head Spa Treatments",
        "Stylists":[
            "Jenny"
            ],
        "pricing":"Dependent on time, typically around $60",
        "Description":"Our headspa treatments are new to Luma Salon! Come enjoy these soothing head spas at Luma Salon!",
        "img_name":"images/mermaid_spa.jpg"
    }
];
*/

app.delete("/api/services/:id",async(req,res)=>{
    const service = await Service.findByIdAndDelete(req.params.id);
    res.status(200).send(service);
})

const validateService = (service) => {
    const schema = Joi.object({
        _id:Joi.allow(""),
        Name:Joi.string().min(3).required(),
        pricing:Joi.string().required(),
        Description:Joi.string().required(),
    });

    return schema.validate(service);
}

app.listen(3001, () =>{
    console.log("im listening");
})






