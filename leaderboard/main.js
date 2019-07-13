    class fetchData {
        constructor(mode, time, category) {
            this.xml = null;
            this.data = null;
            this.url = `https://zombsroyale.io/api/leaderboard/live`;
            this.mode = mode;
            this.time = time;
            this.category = category;
            this.Stop = false;
        }
        getData() {
            try {
                this.xml = new XMLHttpRequest();
                this.xml.onreadystatechange = this.onreadystate.bind(this);
                this.xml.open("GET", this.url, true);
                this.xml.send(`userKey=&mode=${this.mode}&time=${this.time}&category=${this.category}`);
            } catch (error) {
                console.log(`Something go wrong: ${error}`);
            }
        }
        onreadystate() {
            if (this.checkIntegrityOfXml()) {
                this.parseData(this.xml.responseText);
                this.Stop = true;
            }
        }
        checkIntegrityOfXml() {
            return this.xml.readyState == 4 && this.xml.status == 200;
        }
        parseData(data) {
            this.data = JSON.parse(data);
        }
    }

    class player extends fetchData {
        constructor() {
            super();
            this.user = new Map();
        }
        setNewUser(player) {
            for (let length in player) {
                let playerStat = player[length];
                this.addUser(playerStat.name, playerStat.kills, playerStat.kills_per_round, playerStat.rounds, playerStat.time_alive, playerStat.top10, playerStat.winrate, playerStat.wins);
            }
        }
        addUser(name, kills, kills_per_round, rounds, time_alive, top10, winrate, wins) {
            this.user.set(name, this.format(name, kills, kills_per_round, rounds, time_alive, top10, winrate, wins))
        }
        format(name, kills, kills_per_round, rounds, time_alive, top10, winrate, wins) {
            return {
                name: name,
                kills: kills,
                kills_per_round: kills_per_round,
                rounds: rounds,
                time_alive: time_alive,
                top10: top10,
                winrate: winrate,
                wins: wins
            }
        }
        searchUser(name) {
            let searched = this.user.get(name);
            return searched || `No user found with this name: ${name}`;
        }
    }

    class init {
        constructor() {
            this.fetchUserData();
        }
        fetchUserData() {
            const mode = "Solo";
            const time = "all";
            const category = "time_alive";
            this.fetchUser = new fetchData(mode, time, category);
            this.fetchUser.getData();
            this.Timeout(2000);
        }
        Timeout(ms) {
            setTimeout(() => {
                this.fetchUserPlayer()
            }, ms)
        }
        fetchUserPlayer() {
            const dataPlayer = this.fetchUser.data.players;
            console.log("executed...")
            this.Player = new player();
            this.Player.setNewUser(dataPlayer);
            console.log(this.Player)
        }
    }

    let user = new init();