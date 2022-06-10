console.clear();
const prompt = require('prompt-sync')();
const { resolvePtr } = require('dns');
const fs = require('fs');

let monstros = JSON.parse(fs.readFileSync('criaturas.json', 'utf-8'));

/*
    Variáveis Globais
*/

/*
    Funções
*/
function playerName() {
    while (true) {
        try {
            const nome = prompt(`Qual é o seu nome sobrevivente 013? `);
            if (nome.length < 3)
                throw `Seu nome deve ter 3 ou mais caracteres...`;
            return nome;
        } catch (error) {}
    }
}

function rollaDado(faces = 20) {
    return (roll = Math.floor(Math.random() * faces + 1));
}

function imprimeObjeto(objeto) {
    for (const chave in objeto) {
        if (Object.hasOwnProperty.call(objeto, chave)) {
            const valor = objeto[chave];
            console.log(chave, valor);
        }
    }
}

function iniciaCombate(jogador, monstro) {
    let turno = 0;
    while (true) {
        console.clear();
        console.log(
            `\n${monstro.nome} HP [${monstro.vida[0]}/${monstro.vida[1]}] 
            \n\n\n\n\n\n${jogador.nome} HP[${jogador.vida[0]}/${jogador.vida[1]}]\n`,
        );
        prompt(`\t[Atacar]\t[Fugir]`);
        const roll = rollaDado(20);
        console.log(roll);

        if (turno % 2 === 0) {
            prompt(`${jogador.nome} tenta golpear ${monstro.nome}`);
            if (roll + jogador.ataque >= 10 + monstro.defesa) {
                const dano =
                    jogador.ataque > monstro.defesa
                        ? jogador.ataque - monstro.defesa
                        : 0;
                prompt(`\t${jogador.nome} causou ${dano} pontos de dano.`);
                monstro.mudaVida(-dano);
                if (monstro.vida[0] <= 0) return true;
            } else prompt(`\t${jogador.nome} errou...`);
            turno++;
        } else {
            prompt(`${monstro.nome} tenta acertar um golpe em ${jogador.nome}`);
            console.log(roll);
            if (roll + monstro.ataque >= 10 + jogador.defesa) {
                const dano =
                    monstro.ataque > jogador.defesa
                        ? monstro.ataque - jogador.defesa
                        : 0;
                prompt(`\t${monstro.nome} te causou ${dano} pontos de dano.`);
                jogador.mudaVida(-dano);
                if (player.vida[0] <= 0) return false;
            } else prompt(`\t${monstro.nome} errou...`);
            turno++;
        }
    }
}

/*
    Trama
*/

/*
    Começa o Jogo
*/
class Sala {
    static num_salas = 0;
    static salas = [];

    constructor(nome, salamae, inimigo) {
        this.nome = nome;
        this.portas = { Mae: salamae, Filha: [] };
        this.inimigo = inimigo;

        this.criaSalaFilha();
        Sala.salas.push(this);
    }

    criaSalaFilha() {
        for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i++) {
            this.portas.Filha.push('Fechada');
            Sala.num_salas += 1;
        }
    }

    static imprimeSalas() {
        for (const sala of Sala.salas) {
            imprimeObjeto(sala);
        }
    }
}

class Player {
    constructor(nome, classe) {
        this.nome = nome;
        this.vida;
        this.ataque;
        this.defesa;
        this.level = 1;
        this.alive = true;

        this.iniciaAtributos(classe);
    }

    iniciaAtributos(classe) {
        if (classe === 'Fordo') {
            [this.vida, this.ataque, this.defesa] = [[8, 8], 3, 2];
        } else if (classe === 'Magro') {
            [this.vida, this.ataque, this.defesa] = [[6, 6], 5, 0];
        } else {
            [this.vida, this.ataque, this.defesa] = [[7, 7], 4, 1];
        }
    }

    mudaVida(num) {
        this.vida[0] += num;
        if (this.vida[0] > this.vida[1]) this.vida[0] = this.vida[1];
        if (this.vida[0] <= 0) this.alive = false;

        return this.alive;
    }
}

class Monstro {
    static combates = [];

    constructor(nome, vida, ataque, defesa) {
        this.nome = nome;
        this.vida = [vida, vida];
        this.ataque = ataque;
        this.defesa = defesa;
        this.alive = true;

        Monstro.combates.push(this.nome);
    }

    mudaVida(num) {
        this.vida[0] += num;
        if (this.vida[0] > this.vida[1]) this.vida[0] = this.vida[1];
        if (this.vida[0] <= 0) this.alive = false;

        return this.alive;
    }
}

class Ogro extends Monstro {
    grita() {
        console.log(
            `${this.nome} forte!!! ${this.nome} esmaga ${player.nome}!!!`,
        );
    }
}

function criarMonstro(nome) {
    const lista = monstros['Monstros'];
    let _monstro;
    for (let i = 0; i < lista.length; i++) {
        imprimeObjeto(lista[i]);
        if (lista[i].Nome === nome) {
            const [a, b, c, d] = [
                lista[i].Atributos[0],
                lista[i].Atributos[1],
                lista[i].Atributos[2],
                lista[i].Atributos[3],
            ];
            console.log(lista[i].Nome);
            if (lista[i].Nome === 'Ogro') _monstro = new Ogro(a, b, c, d);
            else _monstro = new Monstro(a, b, c, d);
            return _monstro;
        }
    }
}

const player = new Player(playerName(), 'Magro');
// const cela = new Sala('Cela da Prisão', false, 'Rato Gigante');
const rato = criarMonstro('Rato Gigante');
// const ogro = criarMonstro('Ogro');

// imprimeObjeto(rato);
// imprimeObjeto(ogro);
// imprimeObjeto(cela);
// ogro.grita();
// imprimeObjeto(player);
// Sala.imprimeSalas();

// console.log(Monstro.combates, Sala.num_salas);
// console.log(monstros);

if (iniciaCombate(player, rato))
    console.log(`${player.nome} VENCEU O COMBATE!!!`);
else
    console.log(
        `${player.nome} foi DERROTADO por ${
            Monstro.combates[Monstro.combates.length - 1]
        }`,
    );
console.log();
