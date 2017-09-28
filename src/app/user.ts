export class User {

    userId: number;
    email: string;
    name: string;
    fid: number;
    contactNumber: string;
    address: string;
    latitude: number;
    longitude: number;

    constructor(
        userId,
        fbId,
        name,
        email,
        contactNumber,
        address,
        latitude,
        longitude,
    ) {
        this.userId = userId;
        this.fid = fbId;
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public static deserialiseJson(jsonObject: JSON): User {
        if (jsonObject == null) {
            return null;
        }
        let user = new User(
            jsonObject['userId'],
            jsonObject['fid'],
            jsonObject['name'],
            jsonObject['email'],
            jsonObject['contact_number'],
            jsonObject['address'],
            jsonObject['latitude'],
            jsonObject['longitude'],
        )
        return user;
    }
}