class User{
    constructor(id,username, password, name, lastName, gender, birthDate, role="Customer", cartId=0, accumulatedPoints=0, customerType="Bronze", isBanned=false, cancelationNumber=0){
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
        this.customerType = customerType;
        this.isBanned = isBanned;
        this.cancelationNumber = cancelationNumber;
    }
}

module.exports = User;