App = {
    web3Provider: null,
    contracts: {},
  
    init: function() {
      // here our pets are loaded
      $.getJSON('../pets_data.json', function(data) {
        var pets_Row = $('#pets_Row');
        var pet_Template = $('#pet_Template');
  
        for (i = 0; i < data.length; i ++) {
          pet_Template.find('.card-title').text(data[i].name); //gets pet's name
          pet_Template.find('img').attr('src', data[i].photo); //get pet's pic
          pet_Template.find('.pet-behavior').text(data[i].behavior); //get pet's behavior
          pet_Template.find('.pet-age').text(data[i].age); //get pet's age
          pet_Template.find('.pet-type').text(data[i].animal_type); //get pet's type
          pet_Template.find('.pet-color').text(data[i].color); //get pet's color
          pet_Template.find('.btn-adopt').attr('data-id', data[i].id); //get pet's associated id

          pets_Row.append(pet_Template.html()); //append the whole pet data in one card
        }
      });
  
      //execute web3: connection with  the metamask is carried out here
      return App.Web3();
    },
  
    Web3: function() {
      if (typeof web3 !== 'undefined') {
        //alert("not undefined web3")
        App.web3Provider = web3.currentProvider;
        //alert(App.web3Provider)
      } else {
        //alert("set manually url for metamask connection")
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:3000');
      }
      web3 = new Web3(App.web3Provider);
  
      //once connection is established with web3 it will execute contract function
      return App.Contract();
    },
  
    Contract: function() {
        //this json file is automatically created in build dir once we migrate 
      $.getJSON('pet_adoption_app.json', function(data) {
        //here it will get the required contract artifact file and instantiate it with the truffle-contract
        var Adoption_Artifact = data;
        App.contracts.pet_adoption_app = TruffleContract(Adoption_Artifact);
      
        // here it will Set the provider for our contract
        App.contracts.pet_adoption_app.setProvider(App.web3Provider);
      
        //it will execute mark adopted function which uses our contract to retrieve and mark the adopted pets
        return App.markAdopted();
      });
  
      return App.bindEvents();
      //here we are binding the event that is suppose to execute once we click adopt button
    },
  
    bindEvents: function() {
      $(document).on('click', '.btn-adopt', App.handleAdopt);
    },
  
    markAdopted: function(adopters, account) {
      var adoption_Instance;
      
      App.contracts.pet_adoption_app.deployed().then(function(instance) {
        adoption_Instance = instance;
      
        return adoption_Instance.fetch_Adopters.call();
      }).then(function(adopters) {
        for (i = 0; i < adopters.length; i++) {
          if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
            $('.card-pet').eq(i).find('button').text('Success').attr('disabled', true);
          }
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    },
  
    handleAdopt: function() {
      event.preventDefault();
  
      var pet_Id = parseInt($(event.target).data('id')); //get the pet's id
        
      var adoption_Instance;
      
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
      
        var account = accounts[0]; // get the currect user's address
        //alert(account);
      
        App.contracts.pet_adoption_app.deployed().then(function(instance) {
          adoption_Instance = instance;

          return adoption_Instance.adopt_pet(pet_Id, {from: account});//execute adopt pet function written in sol contract
        }).then(function(result) {
          return App.markAdopted();//it will update the button from adopt to success
        }).catch(function(err) {
          console.log(err.message);
        });
      });
    }
  
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });