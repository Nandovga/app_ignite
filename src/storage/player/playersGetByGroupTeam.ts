import {playersGetByGroup} from "@storage/player/playersGetByGroup";

export async function playersGetByGroupTeam(group: string, team: string){
    try {
        const storage = await playersGetByGroup(group);
        return storage.filter(player => player.team === team)
    } catch (error){
        throw error;
    }
}
