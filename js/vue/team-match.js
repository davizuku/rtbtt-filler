Vue.component('team-match', {
    props: ['id', 'matches', 'players'],
    data: function() {
        var matchId = this.id;
        var match = this.matches[matchId];
        var singleMatches = [
            {'player1': 'A', 'player2': 'Y', 'points1': 0, 'points2': 0},
            {'player1': 'B', 'player2': 'X', 'points1': 0, 'points2': 0},
            {'player1': 'C', 'player2': 'Z', 'points1': 0, 'points2': 0},
            {'player1': 'A', 'player2': 'X', 'points1': 0, 'points2': 0},
            {'player1': 'C', 'player2': 'Y', 'points1': 0, 'points2': 0},
            {'player1': 'B', 'player2': 'Z', 'points1': 0, 'points2': 0},
        ];

        return {
            'xyz': '0',
            'match': match,
            'idPlayers': {
                'A': '',
                'B': '',
                'C': '',
                'X': '',
                'Y': '',
                'Z': '',
            },
            'singleMatches': singleMatches,
            player: function(id) {
                var p = this.players[id];
                if (p) {
                    return p['Nom'] + ' ' + p['1r Cognom'] + ' ' + p['2n Cognom'];
                }
                return '';
            },
            total: function(ith) {
                var total1 = 0,
                    total2 = 0;
                for (var i = 0; i <= ith; i++) {
                    if (Math.max(this.singleMatches[i].points1, this.singleMatches[i].points2) === 3) {
                        if (this.singleMatches[i].points1 > this.singleMatches[i].points2) {
                            total1++;
                        } else {
                            total2++;
                        }
                    }
                }
                return [total1, total2];
            },
        };
    },
    computed: {
        teamA: function() {
            return parseInt(this.xyz) ? this.match["Equip Visitant"] : this.match["Equip Local"];
        },
        teamX: function() {
            return parseInt(this.xyz) ? this.match["Equip Local"] : this.match["Equip Visitant"];
        },
        winner: function() {
            var score = this.total(5);
            if (score[0] + score[1] < 6) {
                return null;
            }
            var w = {
                'team': score[0] > score[1] ? this.teamA : this.teamX,
                'score': score,
                'sets': [0, 0]
            };
            for (i in this.singleMatches) {
                if (this.singleMatches.hasOwnProperty(i)) {
                    var sm = this.singleMatches[i];
                    w.sets[0] += parseInt(sm.points1);
                    w.sets[1] += parseInt(sm.points2);
                }
            }
            return w;
        }
    },
    template: `
        <div class='team-match'>
            <div class="row">
                <div class="col s3">
                    <p>Jornada: {{match.Jornada}}</p>
                </div>
                <div class="col s3">
                    <p>Categoria: {{match.Categoria}}</p>
                </div>
                <div class="col s3">
                    <p>Fase: {{match.Fase}}</p>
                </div>
                <div class="col s3">
                    <p>Grup: {{match.Grup}}</p>
                </div>
            </div>
            <div class="row">
                 <div class="col s4 offset-s4">
                    <label>
                        <input type="radio" name="xyz" id="abcLocal" value="0" v-model="xyz">
                        <span>ABC/XYZ</span>
                    </label>
                    <label>
                        <input type="radio" name="xyz" id="xyzLocal" value="1" v-model="xyz">
                        <span>XYZ/ABC</span>
                    </label>
                </div>
            </div>
            <div class="row">
                <div class="col s4">
                    <h6>{{teamA}}</h6>
                </div>
                <div class="col s4">
                    <h6>{{teamX}}</h6>
                </div>
                <div class="col s2">
                    <h6>Jocs<h6>
                </div>
                <div class="col s2">
                    <h6>Total<h6>
                </div>
            </div>
            <!-- Single matches -->
            <div class="row" v-for="(sm, i) in singleMatches">
                <div class="col s3">
                    <span>{{sm.player1}}: <b>{{player(idPlayers[sm.player1])}}<b> </span>
                </div>
                <div class="col s1">
                    <input v-if="i < 3" type="number" pattern="[0-9]*" inputmode="numeric" v-model="idPlayers[sm.player1]" placeholder="Dorsal">
                </div>
                <div class="col s3">
                    <span>{{sm.player2}}: <b>{{player(idPlayers[sm.player2])}}<b> </span>
                </div>
               <div class="col s1">
                    <input v-if="i < 3" type="number" pattern="[0-9]*" inputmode="numeric" v-model="idPlayers[sm.player2]" placeholder="Dorsal">
                </div>
                <div class="col s1">
                    <input v-model="sm.points1" type="number" min="0" max="3" step="1">
                </div>
                <div class="col s1">
                    <input v-model="sm.points2" type="number" min="0" max="3" step="1">
                </div>
                <div class="col s2">
                    <span><b>{{total(i)[0]}} - {{total(i)[1]}}</b><span>
                </div>
            </div>
            <!-- Final result -->
            <div class="row" v-if="winner">
                <div class="col s8">
                    Guanyador: <h4>{{winner.team}}</h4>
                </div>
                <div class="col s2">
                    <p>Resultat: {{winner.score}}</p>
                </div>
                <div class="col s2">
                    <p>Jocs: {{winner.sets}}</p>
                </div>
            </div>
        <div>
    `
})
