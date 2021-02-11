/*import mercadopago from 'mercadopago';

//Agregamos las credenciales
mercadopago.configurations({
    access_token: process.env.MP_ACCESS_TOKEN,
    public_key: process.env.MP_PUBLIC_KEY
})

//routes


const payMercadopago = (req,res) => {
// Crea un objeto de preferencia
let preference = {
    items: [
      {
        title: 'Mi producto',
        unit_price: 100,
        quantity: 1,
      }
    ]
  };
  
  mercadopago.preferences.create(preference)
  .then(function(response){
  // Este valor reemplazará el string "<%= global.id %>" en tu HTML
    global.id = response.body.id;
  }).catch(function(error){
    console.log(error);
  });
}





/*{
    "id": 699223334,
    "nickname": "TT017189",
    "password": "qatest9849",
    "site_status": "active",
    "email": "test_user_96757941@testuser.com",

    "credentials":{
        "test":{

            "public_key": "TEST-56f297bc-e0f0-4044-a194-a423d7ec90ec",
            "access_token": "TEST-165875718603058-010911-4747cf9ef3d57e8a15b37428742beaca-699223334"
        },
        "production":{
            "public_key":"APP_USR-cd0ccd18-db8f-45ca-90e2-cad7e781a17e",
            "access_token":"APP_USR-165875718603058-010911-4d057d5cfcdb0ab862556efce980e1df-699223334",
            "client_id":"165875718603058",
            "client_secret":"Svu4s10l7ISL35C8npRsmTiBAM0flAth"
        }
    }
}

{
    
    "id": 699230790,
    "nickname": "TETE7138763",
    "password": "qatest1949",
    "site_status": "active",
    "email": "test_user_37586987@testuser.com",

        "credentials":{
        "test":{

            "public_key": "TEST-eb161665-2117-4838-95da-10cded8198f5",
            "access_token": "TEST-1209633050172911-010912-8f3dd9a7e6ce7417aa5e26ee15253037-699230790"
        },
        "production":{
            "public_key":"APP_USR-b63a73a5-79d9-45d8-8734-2fa6a22a6d28",
            "access_token":"APP_USR-1209633050172911-010912-1463741671619f47d35fb7faf0bc2e94-699230790",
            "client_id":"1209633050172911",
            "client_secret":"GKH1QRhaH4SVAJs2XFhH3c9ZKAJ6x3bi"
        }
    }

}
*/