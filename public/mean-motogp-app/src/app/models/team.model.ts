export class Team {
    #_id: string;
    #riderName: string;
    #teamName: string;
    #rank: number;

    get _id(): string { return this.#_id; }
    get riderName(): string { return this.#riderName; }
    set riderName(riderName: string) { this.#riderName = riderName; }
    get teamName(): string { return this.#teamName; }
    set teamName(teamName: string) { this.#teamName = teamName; }
    get rank(): number { return this.#rank; }
    set rank(rank: number) { this.#rank = rank; }

    constructor(_id: string, riderName: string, teamName: string, rank: number) {
        this.#_id = _id;
        this.#riderName = riderName;
        this.#teamName = teamName;
        this.#rank = rank;
    }
}