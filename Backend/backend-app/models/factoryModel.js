class Factory{
    constructor(id,name, workingHours, status, location, logoPath='', rating=0, comments=[], chocolates=[]){
        this.id = id;
        this.name = name;
        this.workingHours = workingHours;
        this.status = status;
        this.location = location;
        this.logoPath = logoPath;
        this.rating = rating;
        this.comments = comments;
        this.chocolates = chocolates;
    }
}

module.exports = Factory;