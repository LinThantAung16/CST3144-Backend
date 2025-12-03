class Order {
    constructor(data) {
        this.name = data.name; 
        this.phone = data.phone; 
        this.lessonIDs = data.lessonIDs;
        this.spaces = data.spaces;
    }

    
    get name() {
        return this._name;
    }

    set name(value) {
        // name validation
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(value)) {
            throw new Error("Invalid Name: Must be letters only");
        }
        this._name = value;
    }

    // PHONE GETTER & SETTER
    get phone() {
        return this._phone;
    }
    //phone number validation
    set phone(value) {
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(value)) {
            throw new Error("Invalid Phone Number: Must be numbers only");
        }
        this._phone = value;
    }

    get spaces() {
        return this._spaces;
    }

    set spaces(value) {
        // 1. Check if it's a number
        const num = Number(value);
        
        // 2. Check if valid number and Integer (no decimals)
        if (isNaN(num) || !Number.isInteger(num)) {
            throw new Error("Invalid Spaces: Must be a whole number");
        }

        // 3. Check if positive
        if (num <= 0) {
            throw new Error("Invalid Spaces: Must be at least 1");
        }

        this._spaces = num;
    }


    // Convert Class back to simple JSON object for MongoDB
    toDocument() {
        return {
            name: this.name,
            phone: this.phone,
            lessonIDs: this.lessonIDs,
            spaces: this.spaces,
            orderDate: new Date() 
        };
    }
}

module.exports = Order;