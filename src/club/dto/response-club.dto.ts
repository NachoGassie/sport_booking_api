import { Club } from "../entities/club.entity";


export type NoRelationsClub = Omit<Club, 'fields' | 'user' | 'managerAccount'>;
