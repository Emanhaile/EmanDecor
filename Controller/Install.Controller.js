const installService = require('../Services/Install.Services');

async function install(req, res, next){
    // res.send("the table is created")
  const installmessage = await installService.install();
  
  if(installmessage.status===200){
    res.status(200).json({ messsage: installmessage}) ;
  }
  else {
  res.status(500).json({ messsage: installmessage}) ;
   }
   
  }
  module.exports={install}