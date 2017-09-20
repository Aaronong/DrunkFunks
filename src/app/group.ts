export class Group {

    groupId: number;
    name: string;
    password: string;

    constructor(
        groupId,
        name,
        password,
    ) {
        this.groupId = groupId;
        this.name = name;
        this.password = password;
    }

    public static deserialiseJson(jsonObject: JSON): Group {
        if (jsonObject == null) {
            return null;
        }
        let group = new Group(
            jsonObject['groupId'],
            jsonObject['name'],
            jsonObject['password'],
        )
        return group;
    }
}
