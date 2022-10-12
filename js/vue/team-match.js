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
    methods: {
        downloadCsv: function (event) {
            function buildCsvRow(cells) {
                var row = Array(18).fill('');
                if (cells) {
                    for (var index in cells) {
                        var value = cells[index];
                        if (typeof value == 'string') {
                            value = value.replace('"', '');
                        }
                        row[index] = value;
                    }
                }
                return row.join(';') + "\n";
            }
            // TODO: build object
            var csv = "";
            csv += buildCsvRow();
            csv += buildCsvRow({
                2: "ACTA:",
                3: this.id,
                6: "Temporada 2022/23",
            });
            csv += buildCsvRow({
                1: "El número d'acta la podeu trobar al calendari",
                4: "NOMÉS CAL OMPLIR LES CASELLES DE COLOR, LA RESTA SURT AUTOMÀTIC",
            });
            csv += buildCsvRow({
                4: "En cas que surti un error #N/A, llavors sí que haureu d'escriure el nom",
            });
            csv += buildCsvRow({
                2: "CATEGORIA:",
                3: this.match['Categoria'],
                5: "FASE:",
                6: this.match['Fase'],
            });
            csv += buildCsvRow();
            csv += buildCsvRow({
                2: "GRUP:",
                3: this.match['Grup'],
                5: "JORNADA:",
                6: this.match['Jornada'],
            });
            csv += buildCsvRow();
            csv += buildCsvRow(); // TODO add radio button ABC/XYZ
            csv += buildCsvRow({
                2: "EQ. LOCAL:",
                3: this.teamA,
                7: "EQ. VISITANT:",
                8: this.teamX,
            });
            csv += buildCsvRow(); // TODO add radio button XYZ/ABC
            csv += buildCsvRow();
            csv += buildCsvRow({
                11: "JOCS",
                15: "TOTAL",
            });
            csv += buildCsvRow({
                2: "nº pers.",
                6: "nº pers.",
            });
            for (var i in this.singleMatches) {
                var sm = this.singleMatches[i];
                csv += buildCsvRow({
                    1: sm.player1,
                    2: this.idPlayers[sm.player1],
                    3: this.player(this.idPlayers[sm.player1]),
                    6: sm.player2,
                    7: this.idPlayers[sm.player2],
                    8: this.player(this.idPlayers[sm.player2]),
                    11: sm.points1,
                    13: sm.points2,
                    15: this.total(i)[0],
                    17: this.total(i)[1],
                });
            }
            // TODO: add Doubles match
            csv += buildCsvRow({
                1: "DOBLES",
                2: "", // TODO: add doubles player A.1 id
                3: "", // TODO: add doubles player A.1 name
                6: "DOBLES",
                7: "", // TODO: add doubles player X.1 id
                8: "", // TODO: add doubles player X.1 name
                11: 0,
                13: 0,
                // TODO: compute total
                15: 0,
                17: 0,
            });
            csv += buildCsvRow({
                2: "", // TODO: add doubles player A.2 id
                3: "", // TODO: add doubles player A.2 name
                7: "", // TODO: add doubles player X.2 id
                8: "", // TODO: add doubles player X.2  name
            });
            csv += buildCsvRow();
            csv += buildCsvRow();
            csv += buildCsvRow({
                2: "GUANYADOR",
                4: "RESULTAT",
                6: "JOCS",
                8: "En el cas de substitució d'un jugador, s'ha d'introduir a mà."
            });
            csv += buildCsvRow({
                2: this.winner.team,
                4: this.winner.score[0],
                5: this.winner.score[1],
                6: this.winner.sets[0],
                7: this.winner.sets[1],
                8: "Recordeu posar els jugadors als dobles, en cas de disputar-lo.",
            });
            console.log("CSV:\n", csv)
            var exportedFilenmae = 'resultats-' + this.id + '.csv';
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, exportedFilenmae);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", exportedFilenmae);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
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
            <div class="row" v-if="winner">
                <div class="col offset-s8 s4">
                    Descarrega:
                    <a class="waves-effect waves-light btn" v-on:click="downloadCsv">
                        <i class="material-icons right">cloud_download</i>
                        CSV
                    </a>
                </div>
            </div>
        <div>
    `
})
