export class User {
    #_id: string;
    #name: string;
    #username: string;
    #password: string;

    get id(): string { return this.#_id; }
    get name(): string { return this.#name; }
    set name(name: string) { this.#name = name; }
    get username(): string { return this.#username; }
    set username(username: string) { this.#username = username; }
    get password(): string { return this.#password; }
    set password(password: string) { this.#password = password; }

    constructor(id: string, name: string, username: string, password: string) {
        this.#_id = id;
        this.#username = username;
        this.#password = password;
        this.#name = name;
    }

    reset(): void {
        this.name = "";
        this.username = "";
        this.password = "";
    }
}