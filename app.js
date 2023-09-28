let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let {custData} = require("./custData.js");
let fs = require("fs");
let fname = "customers.json";

app.get("/svr/resetData", function(req,res) {
  let data = JSON.stringify(custData);
  fs.writeFile(fname, data, function(err) {
    if(err) console.log(err);
    else {
      res.send("Data in file is reset");
    }
  });
});

app.get("/svr/customers",function(req,res) {
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else {
      let custArray = JSON.parse(data);
      res.send(custArray);
    }
  });
});

app.post("/svr/customers",function(req,res) {
  let body = req.body;
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else {
      let custArray = JSON.parse(data);
      // let maxId = custArray.reduce((acc,curr) => curr.id > acc ? curr.id : acc,0);
      // let newId = maxId + 1;
      let newCust = body;
      custArray.push(newCust);
      let data1 = JSON.stringify(custArray);
      fs.writeFile(fname,data1,function(err) {
        if(err) res.status(404).send(err);
        else res.send(newCust);
      });
    }
  });
});

app.put("/svr/customers/:id",function(req,res) {
  let body = req.body;
  let id = req.params.id;
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else {
      let custArray = JSON.parse(data);
      let index = custArray.findIndex((st) => st.id === id);
      if(index >= 0) {
        let updatedCustomer = {...custArray[index],...body};
        custArray[index] = updatedCustomer;
        let data1 = JSON.stringify(custArray);
        fs.writeFile(fname,data1,function(err) {
          if(err) res.status(404).send(err);
          else res.send(updatedCustomer);
        });
      }else {
        res.status(404).send("No customer found");
      }
    }
  });
});

app.delete("/svr/customers/:id",function(req,res) {
  let id = req.params.id;
  fs.readFile(fname,"utf8",function(err,data) {
    if(err) res.status(404).send(err);
    else {
      let custArray = JSON.parse(data);
      let index = custArray.findIndex((st) => st.id === id);
      if(index >= 0) {
        let deletedCustomer = custArray.splice(index,1);
        let data1 = JSON.stringify(custArray);
        fs.writeFile(fname,data1,function(err) {
          if(err) res.status(404).send(err);
          else res.send(deletedCustomer);
        });
      }else {
        res.status(404).send("No customer found");
      }
    }
  });
});