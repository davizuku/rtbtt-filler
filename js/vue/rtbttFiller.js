Vue.component('rtbtt-filler', {
    data: {},
    computed: {
        matchId: function() {
            var varName = 'id'
            var query = window.location.search.substr(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == varName) {
                    return decodeURIComponent(pair[1]);
                }
            }
            return ''
        },
        matches: function() {
            return window.encontres;
        },
        players: function() {
            return window.persones;
        },
    },
    template: `
        <div v-if=matchId>
            <team-match v-bind:id='matchId' v-bind:matches='matches' v-bind:players='players'></team-match>
        </div>
        <div v-else>
            <form>
            Introdueix l'identificador de l'encontre:
            <input name="id" type="number"/>
            <input type="submit" value="Envia">
            </form>
        </div>
    `
})
