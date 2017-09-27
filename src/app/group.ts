import { User } from "./user";

export class Group {

    groupId: number;
    name: string;
    password: string;
    ownerId: number;
    members: User[];

    constructor(
        groupId,
        name,
        password,
        ownerId,
        members,
    ) {
        this.groupId = groupId;
        this.name = name;
        this.password = password;
        this.ownerId = ownerId;
        this.members = members;
    }

    public static deserialiseJson(jsonObject: JSON): Group {
        if (jsonObject == null) {
            return null;
        }

        var members = null;

        if (jsonObject['Members']) {
            if (jsonObject['Members'].length > 0) {
                members = jsonObject['Members'].map(member => {
                    return User.deserialiseJson(member);
                })
            }
        }

        let group = new Group(
            jsonObject['groupId'],
            jsonObject['name'],
            jsonObject['password'],
            jsonObject['ownerId'],
            members,
        )

        return group;
    }
}
