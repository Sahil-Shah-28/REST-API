const express = require("express");

const users = require("./MOCK_DATA.json")

const fs = require("fs");

const app = express()

const PORT = 8000;

// Now for a web server we can create a html document

app.get("/users",(req,res)=>{
   const html = `
   <ul>
   ${users.map(user=>`<li>${user.first_name}</li>`).join("")}
   </ul>
   `
   res.send(html)
})


// This is for mobile application which will use this data through an API

app.get("/api/users",(req,res)=>{
    return res.json(users)
})

// For a particular user

// We have used route becuase we need to use same route for patch and elete so this is efficient way of doing it

app.use(express.json())

app.route("/api/users/:id").get((req,res)=>{
    let id = Number( req.params.id)
    let user=users.find((user)=>user.id===id)
    res.send(user)
}).patch((req,res)=>{
    let id=Number(req.params.id)
    let first_name = req.query
    let user = users.find( (user) => user.id===id);
    user.first_name=first_name
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users),(err,data)=>{
        return res.json(user)
    })
}).delete((req, res) => {
    let id = Number(req.params.id);
    let user = users.filter(user => user.id !== id);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users),(err,data)=>{
        return res.json(user)
    })});

    

// For adding a new user 

app.use(express.urlencoded({extended:false}))

app.post("/api/users",(req,res)=>{
    const userData =req.body
    users.push({id : users.length + 1 , ...userData })
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
       return res.json("done")
    })
})

app.listen(PORT,()=>console.log(`Server connected successfully !!!!! @ port no : ${PORT}`));
