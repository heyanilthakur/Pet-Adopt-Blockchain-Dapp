pragma solidity 0.5.0;

contract pet_adoption_app {

    address[12] public adopters;

    // This function allows adopters to adopt a pet
    function adopt_pet(uint pet_id) public returns (uint) {

        //here we are making sure that pet_id that adopters wants if from the index 0 to 11
        require(pet_id >= 0 && pet_id <= 11);
        //here we set the address of the adopter as value using pet number as the index
        adopters[pet_id] = msg.sender;
        //finally returning pet selected number/index
        return pet_id;
    }
    
    //this function will return array adopters, 
    //it will used to check which pets are already adopted
    function fetch_Adopters() public returns (address[12] memory) {
        //this will return whole array and we can use it which index are filled with value
        return adopters;
    }
}