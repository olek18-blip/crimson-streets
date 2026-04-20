import React from 'react';
import { useGameStore } from '../store/gameStore';

const MissionPanel: React.FC = () => {
    const { activeMissions } = useGameStore();

    return (
        <div className="mission-panel">
            <h2>Active Missions</h2>
            <ul>
                {activeMissions.map(mission => (
                    <li key={mission.id} className="mission-item">
                        <h3>{mission.objective}</h3>
                        <p>Reward: {mission.reward}</p>
                        <p>Status: {mission.isComplete ? 'Completed' : 'In Progress'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MissionPanel;