import { Team } from "./team.model";

export class Race {
    #_id: string;
    #circuitName :string;
    #season: number;
    #winner: string;
    #teams: Team[];


    get _id(): string { return this.#_id; }
    get circuitName(): string { return this.#circuitName; }
    set circuitName(circuitName: string) { this.#circuitName = circuitName; }
    get season(): number { return this.#season; }
    set season(season: number) { this.#season = season; }
    get winner(): string { return this.#winner; }
    set winner(winner: string) { this.#winner = winner; }
    get teams(): Team[] { return this.#teams; }
    set teams(teams: Team[]) { this.#teams = teams; }

    constructor(id: string, circuitName: string, season: number, winner: string, teams: Team[]) {
        this.#_id = id;
        this.#circuitName = circuitName;
        this.#season = season;
        this.#winner = winner;
        this.#teams = teams;
    }
}