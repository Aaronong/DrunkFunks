import { User } from './user';

export class Group {

    id: number;
    name: string;
    owner: number;
    members: User[];
}
