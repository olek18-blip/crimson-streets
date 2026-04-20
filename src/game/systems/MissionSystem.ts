export interface Mission {
    id: string;
    description: string;
    state: 'not started' | 'in progress' | 'completed';
    start: () => void;
    complete: () => void;
}

export class MissionSystem {
    private missions: Mission[] = [];

    constructor() {
        // Initialize with a base mission for testing
        this.missions.push(this.createBaseMission());
    }

    private createBaseMission(): Mission {
        return {
            id: 'mission-1',
            description: 'Test weapons and vehicles',
            state: 'not started',
            start: () => {
                this.updateMissionState('mission-1', 'in progress');
            },
            complete: () => {
                this.updateMissionState('mission-1', 'completed');
            }
        };
    }

    private updateMissionState(id: string, state: 'not started' | 'in progress' | 'completed') {
        const mission = this.missions.find(m => m.id === id);
        if (mission) {
            mission.state = state;
        }
    }

    public getMissions(): Mission[] {
        return this.missions;
    }
}