const express = require("express");
const cors = require("cors");
const multer = require("multer")
const app = express();
const Joi = require("joi");
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

app.get("/",(req, res) => {
    res.sendFile(__dirname+"/index.html");
});


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


app.get("/api/services", (req, res) =>{
   res.send(services);
})

app.post("/api/services", upload.single("img"), (req,res)=>{
    const result = validateService(req.body);

    if(result.error){
        console.log("I have an error");
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const service = {
        _id: services.length,
        Name:req.body.Name,
        pricing:req.body.pricing,
        Description:req.body.Description,
    };
    
    if(req.file){
        service.img_name = "images/" + req.file.filename;
    }

    services.push(service);
    res.status(200).send(service);
});

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

