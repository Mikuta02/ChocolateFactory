class User{
    constructor(id,username, password, name, lastName, gender, birthDate, role="Customer", cartId=0, accumulatedPoints=0, customerTypeId=1, isBanned=false, cancelationNumber=0, worksAtFactoryId){
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.lastName = lastName;
        this.gender = gender;
        this.birthDate = birthDate;
        this.role = role;
        this.cartId = cartId;
        this.accumulatedPoints = accumulatedPoints;
        this.customerTypeId = customerTypeId;
        this.isBanned = isBanned;
        this.cancelationNumber = cancelationNumber;
        this.worksAtFactoryId = worksAtFactoryId;
    }
}

module.exports = User;