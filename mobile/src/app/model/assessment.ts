import { GameCategory, GameLevel } from './game';
import { PersistentData } from './common';
export type Competency = 'YES' | 'NE' | 'NO';

export interface Evaluation {
    competent?: boolean;
    competency?: Competency;
    comment: string;
}
export interface SkillEvaluation extends Evaluation {
    skillName: string;
}
export interface SkillSetEvaluation extends Evaluation {
    skillSetName: string;
    skillEvaluations: SkillEvaluation[];
}
export interface SkillProfileEvaluation extends Evaluation {
    profileId: number;
    profileName: string;
    skillSetEvaluation: SkillSetEvaluation[];
}

export interface Assessment extends SkillProfileEvaluation, PersistentData {
    competition: string;
    date: Date;
    field: string;
    timeSlot: string;
    coachId: number;
    gameCategory: GameCategory;
    gameSpeed: GameLevel;
    gameSkill: GameLevel;
    refereeId: number;
    refereeShortName: string;
    closed?: boolean;
}